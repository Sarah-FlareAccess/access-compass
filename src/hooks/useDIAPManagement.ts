/**
 * DIAP Management Hook
 *
 * Manages DIAP (Disability Inclusion Action Plan) items and documents.
 * Supports auto-generation from module responses and manual management.
 */

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase, isSupabaseEnabled } from '../utils/supabase';
import { getSession } from '../utils/session';

export type DIAPCategory =
  | 'physical-access'
  | 'digital-access'
  | 'communication'
  | 'customer-service'
  | 'policy-procedure'
  | 'training'
  | 'other';

export type DIAPStatus =
  | 'not-started'
  | 'in-progress'
  | 'completed'
  | 'on-hold'
  | 'cancelled';

export type DIAPPriority = 'high' | 'medium' | 'low';

export interface DIAPItem {
  id: string;
  sessionId: string;

  // Core fields
  objective: string;
  action: string;
  category: DIAPCategory;
  priority: DIAPPriority;

  // Timeframe
  timeframe: string; // '0-30 days', '30-90 days', '3-12 months', 'Ongoing'

  // Assignment
  responsibleRole?: string;
  responsibleTeam?: string;

  // Status
  status: DIAPStatus;

  // Source tracking
  moduleSource?: string;
  questionSource?: string;

  // Details
  impactStatement?: string;
  dependencies?: string[];
  resources?: string[];
  budgetEstimate?: string;
  notes?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface DIAPDocument {
  id: string;
  sessionId: string;
  filename: string;
  fileType: string;
  fileSize?: number;
  storagePath: string;
  linkedItemIds: string[];
  description?: string;
  uploadedAt: string;
}

const DIAP_ITEMS_KEY = 'access_compass_diap_items';
const DIAP_DOCUMENTS_KEY = 'access_compass_diap_documents';

// Local storage functions
function getLocalItems(): DIAPItem[] {
  const data = localStorage.getItem(DIAP_ITEMS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveLocalItems(items: DIAPItem[]) {
  localStorage.setItem(DIAP_ITEMS_KEY, JSON.stringify(items));
}

function getLocalDocuments(): DIAPDocument[] {
  const data = localStorage.getItem(DIAP_DOCUMENTS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveLocalDocuments(docs: DIAPDocument[]) {
  localStorage.setItem(DIAP_DOCUMENTS_KEY, JSON.stringify(docs));
}

interface UseDIAPManagementReturn {
  items: DIAPItem[];
  documents: DIAPDocument[];
  isLoading: boolean;
  error: string | null;

  // Item CRUD
  createItem: (item: Omit<DIAPItem, 'id' | 'sessionId' | 'createdAt' | 'updatedAt'>) => DIAPItem;
  updateItem: (id: string, updates: Partial<DIAPItem>) => void;
  deleteItem: (id: string) => void;

  // Bulk operations
  createItemsFromResponses: (responses: ResponseForDIAP[]) => DIAPItem[];

  // Document operations
  uploadDocument: (file: File, linkedItemIds?: string[]) => Promise<DIAPDocument | null>;
  deleteDocument: (id: string) => Promise<void>;
  linkDocumentToItem: (documentId: string, itemId: string) => void;

  // Queries
  getItemsByPriority: (priority: DIAPPriority) => DIAPItem[];
  getItemsByStatus: (status: DIAPStatus) => DIAPItem[];
  getItemsByTimeframe: (timeframe: string) => DIAPItem[];
  getItemsByCategory: (category: DIAPCategory) => DIAPItem[];
  getStats: () => DIAPStats;

  // Sync
  syncToCloud: () => Promise<void>;
}

export interface ResponseForDIAP {
  questionId: string;
  questionText: string;
  answer: 'no' | 'not-sure';
  moduleCode: string;
  moduleName: string;
  impactLevel?: 'high' | 'medium' | 'low';
  safetyRelated?: boolean;
  category?: DIAPCategory;
}

export interface DIAPStats {
  total: number;
  byStatus: Record<DIAPStatus, number>;
  byPriority: Record<DIAPPriority, number>;
  byTimeframe: Record<string, number>;
  completedPercentage: number;
}

// Priority calculation based on response metadata
function calculatePriority(response: ResponseForDIAP): DIAPPriority {
  if (response.safetyRelated) return 'high';
  if (response.impactLevel === 'high') return 'high';
  if (response.impactLevel === 'medium') return 'medium';
  return 'low';
}

// Timeframe based on priority
function calculateTimeframe(priority: DIAPPriority): string {
  switch (priority) {
    case 'high':
      return '0-30 days';
    case 'medium':
      return '30-90 days';
    case 'low':
      return '3-12 months';
    default:
      return '3-12 months';
  }
}

// Convert question to action text
function questionToAction(questionText: string): string {
  // Remove question mark and convert to action
  let action = questionText.replace(/\?$/, '');

  // Common patterns to convert
  const patterns = [
    { match: /^Do you have/i, replace: 'Implement' },
    { match: /^Is there/i, replace: 'Add' },
    { match: /^Are there/i, replace: 'Provide' },
    { match: /^Can customers/i, replace: 'Enable customers to' },
    { match: /^Do customers/i, replace: 'Ensure customers can' },
    { match: /^Does your/i, replace: 'Ensure your' },
  ];

  for (const { match, replace } of patterns) {
    if (match.test(action)) {
      action = action.replace(match, replace);
      break;
    }
  }

  return action;
}

export function useDIAPManagement(): UseDIAPManagementReturn {
  const [items, setItems] = useState<DIAPItem[]>([]);
  const [documents, setDocuments] = useState<DIAPDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load on mount
  useEffect(() => {
    const load = async () => {
      try {
        // Load from localStorage
        const localItems = getLocalItems();
        const localDocs = getLocalDocuments();
        setItems(localItems);
        setDocuments(localDocs);

        // Sync from cloud if available
        if (isSupabaseEnabled() && supabase) {
          const session = getSession();
          if (session?.session_id) {
            const { data: cloudItems, error: itemsError } = await supabase
              .from('diap_items')
              .select('*')
              .eq('session_id', session.session_id);

            // Skip cloud sync if table doesn't exist or other error
            if (itemsError) {
              console.log('Supabase diap_items not available, using local storage');
            } else if (cloudItems && cloudItems.length > 0) {
              const mapped = cloudItems.map(item => ({
                id: item.id,
                sessionId: item.session_id,
                objective: item.objective,
                action: item.action,
                category: item.category,
                priority: item.priority,
                timeframe: item.timeframe,
                responsibleRole: item.responsible_role,
                responsibleTeam: item.responsible_team,
                status: item.status,
                moduleSource: item.module_source,
                questionSource: item.question_source,
                impactStatement: item.impact_statement,
                dependencies: item.dependencies,
                resources: item.resources,
                budgetEstimate: item.budget_estimate,
                notes: item.notes,
                createdAt: item.created_at,
                updatedAt: item.updated_at,
                completedAt: item.completed_at,
              }));

              setItems(mapped);
              saveLocalItems(mapped);
            }

            const { data: cloudDocs, error: docsError } = await supabase
              .from('diap_documents')
              .select('*')
              .eq('session_id', session.session_id);

            // Skip cloud sync if table doesn't exist or other error
            if (docsError) {
              console.log('Supabase diap_documents not available, using local storage');
            } else if (cloudDocs && cloudDocs.length > 0) {
              const mappedDocs = cloudDocs.map(doc => ({
                id: doc.id,
                sessionId: doc.session_id,
                filename: doc.filename,
                fileType: doc.file_type,
                fileSize: doc.file_size,
                storagePath: doc.storage_path,
                linkedItemIds: doc.linked_item_ids || [],
                description: doc.description,
                uploadedAt: doc.uploaded_at,
              }));

              setDocuments(mappedDocs);
              saveLocalDocuments(mappedDocs);
            }
          }
        }
      } catch (err) {
        console.error('Error loading DIAP data:', err);
        setError('Failed to load DIAP data');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  // Create item
  const createItem = useCallback((
    itemData: Omit<DIAPItem, 'id' | 'sessionId' | 'createdAt' | 'updatedAt'>
  ): DIAPItem => {
    const session = getSession();
    const now = new Date().toISOString();

    const newItem: DIAPItem = {
      ...itemData,
      id: uuidv4(),
      sessionId: session?.session_id || '',
      createdAt: now,
      updatedAt: now,
    };

    setItems(prev => {
      const updated = [...prev, newItem];
      saveLocalItems(updated);
      return updated;
    });

    return newItem;
  }, []);

  // Update item
  const updateItem = useCallback((id: string, updates: Partial<DIAPItem>) => {
    setItems(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          const newItem = {
            ...item,
            ...updates,
            updatedAt: new Date().toISOString(),
          };

          // Set completedAt if status changed to completed
          if (updates.status === 'completed' && item.status !== 'completed') {
            newItem.completedAt = new Date().toISOString();
          }

          return newItem;
        }
        return item;
      });

      saveLocalItems(updated);
      return updated;
    });
  }, []);

  // Delete item
  const deleteItem = useCallback((id: string) => {
    setItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      saveLocalItems(updated);
      return updated;
    });
  }, []);

  // Create items from module responses
  const createItemsFromResponses = useCallback((responses: ResponseForDIAP[]): DIAPItem[] => {
    const newItems: DIAPItem[] = [];
    const session = getSession();
    const now = new Date().toISOString();

    for (const response of responses) {
      const priority = calculatePriority(response);
      const timeframe = calculateTimeframe(priority);

      const item: DIAPItem = {
        id: uuidv4(),
        sessionId: session?.session_id || '',
        objective: `Improve ${response.moduleName.toLowerCase()}`,
        action: questionToAction(response.questionText),
        category: response.category || 'other',
        priority,
        timeframe,
        status: 'not-started',
        moduleSource: response.moduleCode,
        questionSource: response.questionId,
        impactStatement: response.safetyRelated
          ? 'This is a safety-related item requiring immediate attention.'
          : undefined,
        createdAt: now,
        updatedAt: now,
      };

      newItems.push(item);
    }

    setItems(prev => {
      const updated = [...prev, ...newItems];
      saveLocalItems(updated);
      return updated;
    });

    return newItems;
  }, []);

  // Upload document
  const uploadDocument = useCallback(async (
    file: File,
    linkedItemIds: string[] = []
  ): Promise<DIAPDocument | null> => {
    const session = getSession();
    if (!session?.session_id) {
      setError('No session found');
      return null;
    }

    try {
      let storagePath = '';

      // Upload to Supabase storage if available
      if (isSupabaseEnabled() && supabase) {
        const fileName = `${session.session_id}/${uuidv4()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('diap-documents')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          // Fall back to base64
          storagePath = await fileToBase64(file);
        } else {
          storagePath = fileName;
        }
      } else {
        // Store as base64 in localStorage
        storagePath = await fileToBase64(file);
      }

      const doc: DIAPDocument = {
        id: uuidv4(),
        sessionId: session.session_id,
        filename: file.name,
        fileType: file.type,
        fileSize: file.size,
        storagePath,
        linkedItemIds,
        uploadedAt: new Date().toISOString(),
      };

      setDocuments(prev => {
        const updated = [...prev, doc];
        saveLocalDocuments(updated);
        return updated;
      });

      return doc;
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('Failed to upload document');
      return null;
    }
  }, []);

  // Delete document
  const deleteDocument = useCallback(async (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;

    try {
      // Delete from Supabase storage if it's a path (not base64)
      if (isSupabaseEnabled() && supabase && !doc.storagePath.startsWith('data:')) {
        await supabase.storage.from('diap-documents').remove([doc.storagePath]);
      }

      setDocuments(prev => {
        const updated = prev.filter(d => d.id !== id);
        saveLocalDocuments(updated);
        return updated;
      });
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Failed to delete document');
    }
  }, [documents]);

  // Link document to item
  const linkDocumentToItem = useCallback((documentId: string, itemId: string) => {
    setDocuments(prev => {
      const updated = prev.map(doc => {
        if (doc.id === documentId && !doc.linkedItemIds.includes(itemId)) {
          return { ...doc, linkedItemIds: [...doc.linkedItemIds, itemId] };
        }
        return doc;
      });

      saveLocalDocuments(updated);
      return updated;
    });
  }, []);

  // Query helpers
  const getItemsByPriority = useCallback((priority: DIAPPriority) => {
    return items.filter(item => item.priority === priority);
  }, [items]);

  const getItemsByStatus = useCallback((status: DIAPStatus) => {
    return items.filter(item => item.status === status);
  }, [items]);

  const getItemsByTimeframe = useCallback((timeframe: string) => {
    return items.filter(item => item.timeframe === timeframe);
  }, [items]);

  const getItemsByCategory = useCallback((category: DIAPCategory) => {
    return items.filter(item => item.category === category);
  }, [items]);

  // Get stats
  const getStats = useCallback((): DIAPStats => {
    const total = items.length;

    const byStatus: Record<DIAPStatus, number> = {
      'not-started': 0,
      'in-progress': 0,
      'completed': 0,
      'on-hold': 0,
      'cancelled': 0,
    };

    const byPriority: Record<DIAPPriority, number> = {
      'high': 0,
      'medium': 0,
      'low': 0,
    };

    const byTimeframe: Record<string, number> = {};

    items.forEach(item => {
      byStatus[item.status]++;
      byPriority[item.priority]++;
      byTimeframe[item.timeframe] = (byTimeframe[item.timeframe] || 0) + 1;
    });

    const completed = byStatus['completed'];
    const completedPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, byStatus, byPriority, byTimeframe, completedPercentage };
  }, [items]);

  // Sync to cloud
  const syncToCloud = useCallback(async () => {
    if (!isSupabaseEnabled() || !supabase) return;

    const session = getSession();
    if (!session?.session_id) return;

    try {
      // Sync items
      for (const item of items) {
        await supabase.from('diap_items').upsert({
          id: item.id,
          session_id: item.sessionId,
          objective: item.objective,
          action: item.action,
          category: item.category,
          priority: item.priority,
          timeframe: item.timeframe,
          responsible_role: item.responsibleRole,
          responsible_team: item.responsibleTeam,
          status: item.status,
          module_source: item.moduleSource,
          question_source: item.questionSource,
          impact_statement: item.impactStatement,
          dependencies: item.dependencies,
          resources: item.resources,
          budget_estimate: item.budgetEstimate,
          notes: item.notes,
          created_at: item.createdAt,
          updated_at: item.updatedAt,
          completed_at: item.completedAt,
        });
      }

      // Sync documents metadata (not the files themselves)
      for (const doc of documents) {
        await supabase.from('diap_documents').upsert({
          id: doc.id,
          session_id: doc.sessionId,
          filename: doc.filename,
          file_type: doc.fileType,
          file_size: doc.fileSize,
          storage_path: doc.storagePath,
          linked_item_ids: doc.linkedItemIds,
          description: doc.description,
          uploaded_at: doc.uploadedAt,
        });
      }
    } catch (err) {
      console.error('Error syncing DIAP data:', err);
      setError('Failed to sync DIAP data');
    }
  }, [items, documents]);

  return {
    items,
    documents,
    isLoading,
    error,
    createItem,
    updateItem,
    deleteItem,
    createItemsFromResponses,
    uploadDocument,
    deleteDocument,
    linkDocumentToItem,
    getItemsByPriority,
    getItemsByStatus,
    getItemsByTimeframe,
    getItemsByCategory,
    getStats,
    syncToCloud,
  };
}

// Helper: Convert file to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}
