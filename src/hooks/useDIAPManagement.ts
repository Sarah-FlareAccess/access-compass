/**
 * DIAP Management Hook
 *
 * Manages DIAP (Disability Inclusion Action Plan) items and documents.
 * Supports auto-generation from module responses and manual management.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase, isSupabaseEnabled } from '../utils/supabase';
import { getSession } from '../utils/session';
import { syncRecord, fetchRecords, resolveByTimestamp } from '../utils/cloudSync';
import { useAuthSafe } from '../contexts/AuthContext';
import { calculateQuestionPriority } from '../utils/priorityCalculation';
import { logActivityStandalone } from './useActivityLog';
import { MODULE_TO_DIAP_MAPPING, DIAP_SECTIONS } from '../data/diapMapping';
import type { DIAPComment } from '../types/activity';
import { getModuleById, getQuestionsForMode } from '../data/accessModules';
import { generateActionText } from '../components/questions/QuestionFlow';

export type DIAPCategory =
  | 'physical-access'
  | 'information-communication-marketing'
  | 'customer-service'
  | 'operations-policy-procedure'
  | 'people-culture'
  | (string & {});

export type DIAPStatus =
  | 'not-started'
  | 'in-progress'
  | 'achieved'
  | 'ongoing'
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
  dueDate?: string; // ISO date string for specific due date

  // Assignment
  responsibleRole?: string;
  responsibleTeam?: string;

  // Status
  status: DIAPStatus;

  // Source tracking
  moduleSource?: string;
  questionSource?: string;
  sourceAnswer?: string; // Original answer when item was generated (no, partially, not-sure)
  importSource?: 'audit' | 'manual' | 'csv' | 'pdf'; // Track where item came from

  // Compliance information
  complianceLevel?: 'mandatory' | 'best-practice';
  complianceRef?: string;

  // Details
  impactStatement?: string;
  dependencies?: string[];
  resources?: string[];
  budgetEstimate?: string;
  notes?: string;
  successIndicators?: string; // How success will be measured

  // Per-item attachments (evidence, quotes, research)
  attachments?: DIAPAttachment[];

  // Comments thread
  comments?: DIAPComment[];

  // Display order (lower = higher in list)
  sortOrder?: number;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface DIAPAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
  addedAt: string;
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
const DIAP_MIGRATION_KEY = 'diap_migration_v8';

function getLocalItems(): DIAPItem[] {
  const data = localStorage.getItem(DIAP_ITEMS_KEY);
  if (!data) return [];
  const items: DIAPItem[] = JSON.parse(data);

  // Migrate old 'completed' status to 'achieved'
  if (!localStorage.getItem('diap_status_migration_v1')) {
    let statusChanged = false;
    for (const item of items) {
      if ((item.status as string) === 'completed') {
        (item as unknown as Record<string, unknown>).status = 'achieved';
        statusChanged = true;
      }
    }
    if (statusChanged) {
      localStorage.setItem(DIAP_ITEMS_KEY, JSON.stringify(items));
    }
    localStorage.setItem('diap_status_migration_v1', 'done');
  }

  // One-time migration: fix timeframes, priorities, categories, and complianceLevel
  if (!localStorage.getItem(DIAP_MIGRATION_KEY)) {
    let changed = false;
    for (const item of items) {
      // Clear all preset timeframes (old defaults)
      if (item.timeframe && item.timeframe !== 'Ongoing') {
        item.timeframe = '';
        changed = true;
      }

      // Recalculate priority and fix category/complianceLevel from source question
      if (item.questionSource && item.moduleSource) {
        const moduleCode = extractModuleCode(item.moduleSource);
        if (moduleCode) {
          const mod = getModuleById(moduleCode);
          if (mod) {
            const questions = getQuestionsForMode(mod, 'deep-dive');
            // Strip suffixes like "-media-0" or "-url-1" to find the base question ID
            const baseQuestionId = item.questionSource.replace(/-(media|url)-\d+$/, '');
            const question = questions.find(q => q.id === baseQuestionId || q.id === item.questionSource);
            if (question) {
              // Fix complianceLevel if missing
              if (!item.complianceLevel && question.complianceLevel) {
                item.complianceLevel = question.complianceLevel;
                changed = true;
              }

              // Recalculate priority from question data
              const answer = item.status === 'achieved' ? 'yes' : 'no';
              const newPriority = calculateQuestionPriority({
                complianceLevel: question.complianceLevel,
                safetyRelated: question.safetyRelated,
                impactLevel: question.impactLevel,
                answer,
              });
              if (item.priority !== newPriority) {
                item.priority = newPriority;
                changed = true;
              }

              // Regenerate objective and actions using outcome-focused system
              if (item.importSource === 'audit') {
                const newObjective = generateObjective(question, answer, moduleCode);
                if (item.objective !== newObjective) {
                  item.objective = newObjective;
                  item.action = generateDIAPActions(question, answer);
                  changed = true;
                }
              }
            }

            // Fix category using authoritative mapping
            const correctCategory = mapModuleToCategory(moduleCode);
            if (item.category !== correctCategory) {
              item.category = correctCategory;
              changed = true;
            }
          }
        }
      }

      // Ensure every item has a complianceLevel (default to best-practice)
      if (!item.complianceLevel) {
        item.complianceLevel = 'best-practice';
        changed = true;
      }
    }
    localStorage.setItem(DIAP_MIGRATION_KEY, 'true');
    if (changed) {
      localStorage.setItem(DIAP_ITEMS_KEY, JSON.stringify(items));
    }
  }

  // One-time migration: backfill success indicators for existing items
  if (!localStorage.getItem('diap_success_indicators_v6')) {
    let indicatorChanged = false;
    for (const item of items) {
      if (item.moduleSource && item.importSource === 'audit') {
        const moduleCode = extractModuleCode(item.moduleSource);
        if (moduleCode) {
          const mod = getModuleById(moduleCode);
          if (mod) {
            const questions = getQuestionsForMode(mod, 'deep-dive');
            const baseQuestionId = item.questionSource?.replace(/-(media|url)-\d+$/, '') || '';
            const question = questions.find(q => q.id === baseQuestionId || q.id === item.questionSource);
            if (question) {
              item.successIndicators = generateSuccessIndicator(question, moduleCode);
              indicatorChanged = true;
            }
          }
        }
        // Fallback if no question match but we have a module code
        if (!item.successIndicators && moduleCode) {
          item.successIndicators = generateSuccessIndicator({ text: '' }, moduleCode);
          indicatorChanged = true;
        }
      }
    }
    localStorage.setItem('diap_success_indicators_v6', 'done');
    if (indicatorChanged) {
      localStorage.setItem(DIAP_ITEMS_KEY, JSON.stringify(items));
    }
  }

  // Deduplicate items by questionSource (keep the first occurrence)
  const seen = new Set<string>();
  let deduped = false;
  const uniqueItems: DIAPItem[] = [];
  for (const item of items) {
    const key = item.questionSource || item.id;
    if (item.questionSource && seen.has(key)) {
      deduped = true;
      continue;
    }
    seen.add(key);
    uniqueItems.push(item);
  }
  if (deduped) {
    localStorage.setItem(DIAP_ITEMS_KEY, JSON.stringify(uniqueItems));
  }

  // Clean action text: strip old numbered filler steps that were appended to every action
  let actionChanged = false;
  for (const item of uniqueItems) {
    if (item.action) {
      const cleaned = stripFillerSteps(item.action);
      if (cleaned !== item.action) {
        item.action = cleaned;
        actionChanged = true;
      }
    }
  }
  if (actionChanged) {
    localStorage.setItem(DIAP_ITEMS_KEY, JSON.stringify(uniqueItems));
  }

  return uniqueItems;
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

// CSV Import result
export interface CSVImportResult {
  success: boolean;
  imported: number;
  errors: string[];
  items: DIAPItem[];
}

// PDF Import result
export interface PDFImportResult {
  success: boolean;
  imported: number;
  errors: string[];
  items: DIAPItem[];
  rawText?: string;
}

// Excel Import result
export interface ExcelImportResult {
  success: boolean;
  imported: number;
  errors: string[];
  items: DIAPItem[];
  sheetsProcessed: string[];
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
  importFromCSV: (csvContent: string) => CSVImportResult;
  importFromExcel: (file: File) => Promise<ExcelImportResult>;
  importFromPDF: (file: File) => Promise<PDFImportResult>;
  generateFromResponses: (responses: any[], questions: any[], moduleName: string) => number;

  // Document operations
  uploadDocument: (file: File, linkedItemIds?: string[]) => Promise<DIAPDocument | null>;
  deleteDocument: (id: string) => Promise<void>;
  linkDocumentToItem: (documentId: string, itemId: string) => void;

  // Attachments
  addAttachment: (itemId: string, file: File) => Promise<void>;
  removeAttachment: (itemId: string, attachmentId: string) => void;

  // Comments
  addComment: (itemId: string, text: string) => void;

  // Reorder
  reorderItem: (itemIdA: string, itemIdB: string) => void;

  // Queries
  getItemsByPriority: (priority: DIAPPriority) => DIAPItem[];
  getItemsByStatus: (status: DIAPStatus) => DIAPItem[];
  getItemsByTimeframe: (timeframe: string) => DIAPItem[];
  getItemsByCategory: (category: DIAPCategory) => DIAPItem[];
  getStats: () => DIAPStats;

  // Export
  exportToCSV: () => string;
  getCSVTemplate: () => string;

  // Sync
  syncToCloud: () => Promise<void>;
}

export interface ResponseForDIAP {
  questionId: string;
  questionText: string;
  answer: 'no' | 'not-sure' | 'partially';
  moduleCode: string;
  moduleName: string;
  impactLevel?: 'high' | 'medium' | 'low';
  safetyRelated?: boolean;
  complianceLevel?: 'mandatory' | 'best-practice';
  category?: DIAPCategory;
  notes?: string;
}

export interface DIAPStats {
  total: number;
  byStatus: Record<DIAPStatus, number>;
  byPriority: Record<DIAPPriority, number>;
  byTimeframe: Record<string, number>;
  completedPercentage: number;
}

function calculatePriority(response: ResponseForDIAP): DIAPPriority {
  return calculateQuestionPriority({
    complianceLevel: response.complianceLevel,
    safetyRelated: response.safetyRelated,
    impactLevel: response.impactLevel,
    answer: response.answer,
  });
}

function calculateTimeframe(_priority: DIAPPriority): string {
  return '';
}

// Get DIAP action text from question - uses same system as the report
function getDIAPActionText(question: any, answer: string): string {
  if (answer === 'no' || answer === 'not-sure') {
    return question.actionText?.no || generateActionText(question.text);
  }
  if (answer === 'partially') {
    if (question.actionText?.partially) return question.actionText.partially;
    const base = generateActionText(question.text);
    return `Complete improvements: ${base.charAt(0).toLowerCase() + base.slice(1)}`;
  }
  return generateActionText(question.text);
}

export function useDIAPManagement(): UseDIAPManagementReturn {
  const [items, setItems] = useState<DIAPItem[]>([]);
  const [documents, setDocuments] = useState<DIAPDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId, organisationId } = useAuthSafe();
  const userIdRef = useRef(userId);
  const orgIdRef = useRef(organisationId);

  useEffect(() => {
    userIdRef.current = userId;
    orgIdRef.current = organisationId;
  }, [userId, organisationId]);

  // Background sync a single DIAP item to Supabase
  const syncItemToCloud = useCallback((item: DIAPItem) => {
    if (!userIdRef.current) return;
    syncRecord('diap_items', {
      id: item.id,
      session_id: item.sessionId,
      objective: item.objective,
      action: item.action,
      category: item.category,
      priority: item.priority,
      timeframe: item.timeframe,
      responsible_role: item.responsibleRole || null,
      responsible_team: item.responsibleTeam || null,
      status: item.status,
      module_source: item.moduleSource || null,
      question_source: item.questionSource || null,
      impact_statement: item.impactStatement || null,
      dependencies: item.dependencies || [],
      resources: item.resources || [],
      budget_estimate: item.budgetEstimate || null,
      notes: item.notes || null,
      success_indicators: item.successIndicators || null,
      created_at: item.createdAt,
      updated_at: item.updatedAt,
      completed_at: item.completedAt || null,
    }, userIdRef.current, orgIdRef.current).catch(() => {});
  }, []);

  // Sync multiple items (batch after bulk operations)
  const syncItemsBatchToCloud = useCallback((itemsToSync: DIAPItem[]) => {
    for (const item of itemsToSync) {
      syncItemToCloud(item);
    }
  }, [syncItemToCloud]);

  // Load on mount
  useEffect(() => {
    const load = async () => {
      try {
        // Load from localStorage (instant)
        const localItems = getLocalItems();
        const localDocs = getLocalDocuments();
        setItems(localItems);
        setDocuments(localDocs);

        // If authenticated, try to merge cloud data
        if (isSupabaseEnabled() && userId) {
          const { data: cloudItems, error: itemsError } = await fetchRecords(
            'diap_items', userId
          );

          if (itemsError) {
            console.log('[useDIAPManagement] Items cloud fetch skipped:', itemsError);
          } else if (cloudItems && cloudItems.length > 0) {
            // Build lookup of local items by ID
            const localMap = new Map(localItems.map(i => [i.id, i]));
            let hasChanges = false;
            const merged = [...localItems];

            for (const row of cloudItems as Record<string, unknown>[]) {
              const id = row.id as string;
              const localItem = localMap.get(id);
              const cloudUpdatedAt = row.updated_at as string;
              const localUpdatedAt = localItem?.updatedAt;

              if (!localItem) {
                // Cloud has an item we don't have locally
                merged.push({
                  id,
                  sessionId: row.session_id as string,
                  objective: row.objective as string,
                  action: row.action as string,
                  category: (row.category as DIAPCategory) || 'physical-access',
                  priority: (row.priority as DIAPPriority) || 'medium',
                  timeframe: (row.timeframe as string) || '',
                  responsibleRole: row.responsible_role as string | undefined,
                  responsibleTeam: row.responsible_team as string | undefined,
                  status: (row.status as DIAPStatus) || 'not-started',
                  moduleSource: row.module_source as string | undefined,
                  questionSource: row.question_source as string | undefined,
                  impactStatement: row.impact_statement as string | undefined,
                  dependencies: (row.dependencies as string[]) || [],
                  resources: (row.resources as string[]) || [],
                  budgetEstimate: row.budget_estimate as string | undefined,
                  notes: row.notes as string | undefined,
                  successIndicators: row.success_indicators as string | undefined,
                  createdAt: row.created_at as string,
                  updatedAt: cloudUpdatedAt,
                  completedAt: row.completed_at as string | undefined,
                  importSource: (row.import_source as DIAPItem['importSource']) || 'audit',
                });
                hasChanges = true;
              } else if (resolveByTimestamp(localUpdatedAt, cloudUpdatedAt) === 'cloud') {
                // Cloud is newer, update local
                const idx = merged.findIndex(i => i.id === id);
                if (idx >= 0) {
                  merged[idx] = {
                    ...merged[idx],
                    objective: row.objective as string,
                    action: row.action as string,
                    status: (row.status as DIAPStatus) || merged[idx].status,
                    priority: (row.priority as DIAPPriority) || merged[idx].priority,
                    notes: row.notes as string | undefined,
                    updatedAt: cloudUpdatedAt,
                    completedAt: row.completed_at as string | undefined,
                  };
                  hasChanges = true;
                }
              }
            }

            // Strip filler from cloud-merged actions too
            for (const item of merged) {
              if (item.action) {
                const cleaned = stripFillerSteps(item.action);
                if (cleaned !== item.action) {
                  item.action = cleaned;
                  hasChanges = true;
                }
              }
            }

            // Deduplicate after merge
            const seenQ = new Set<string>();
            const dedupedMerged: DIAPItem[] = [];
            for (const item of merged) {
              const key = item.questionSource || item.id;
              if (item.questionSource && seenQ.has(key)) {
                hasChanges = true;
                continue;
              }
              seenQ.add(key);
              dedupedMerged.push(item);
            }

            if (hasChanges) {
              setItems(dedupedMerged);
              saveLocalItems(dedupedMerged);
            }
          }

          // Also fetch cloud documents
          const { data: cloudDocs } = await fetchRecords('diap_documents', userId);
          if (cloudDocs && cloudDocs.length > 0) {
            const localDocMap = new Map(localDocs.map(d => [d.id, d]));
            let docsChanged = false;
            const mergedDocs = [...localDocs];

            for (const row of cloudDocs as Record<string, unknown>[]) {
              const id = row.id as string;
              if (!localDocMap.has(id)) {
                mergedDocs.push({
                  id,
                  sessionId: row.session_id as string,
                  filename: row.filename as string,
                  fileType: row.file_type as string,
                  fileSize: row.file_size as number | undefined,
                  storagePath: row.storage_path as string,
                  linkedItemIds: (row.linked_item_ids as string[]) || [],
                  description: row.description as string | undefined,
                  uploadedAt: row.uploaded_at as string,
                });
                docsChanged = true;
              }
            }

            if (docsChanged) {
              setDocuments(mergedDocs);
              saveLocalDocuments(mergedDocs);
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
  }, [userId]);

  // Auto-sync items to cloud when they change (debounced)
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialLoadDone = useRef(false);

  useEffect(() => {
    // Skip the initial load (items set from localStorage)
    if (!initialLoadDone.current) {
      if (!isLoading) initialLoadDone.current = true;
      return;
    }
    if (!userIdRef.current || items.length === 0) return;

    // Debounce: wait 2 seconds after last change before syncing
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      syncItemsBatchToCloud(items);
    }, 2000);

    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [items, isLoading, syncItemsBatchToCloud]);

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

    logActivityStandalone('diap-item-created', {
      diapItemId: newItem.id,
      diapItemObjective: newItem.objective,
    }, userIdRef.current || undefined);

    return newItem;
  }, []);

  // Update item
  const updateItem = useCallback((id: string, updates: Partial<DIAPItem>) => {
    // Read current items outside the state updater (avoids StrictMode double-fire)
    let currentItems: DIAPItem[] = [];
    try {
      const stored = localStorage.getItem(DIAP_ITEMS_KEY);
      if (stored) currentItems = JSON.parse(stored);
    } catch { /* ignore */ }
    const existingItem = currentItems.find(item => item.id === id);
    if (existingItem) {
      if (updates.status && updates.status !== existingItem.status) {
        logActivityStandalone('diap-status-changed', {
          diapItemId: existingItem.id,
          diapItemObjective: existingItem.objective,
          oldValue: existingItem.status,
          newValue: updates.status,
        }, userIdRef.current || undefined);
      }
      if (updates.responsibleRole && updates.responsibleRole !== existingItem.responsibleRole) {
        logActivityStandalone('diap-assigned', {
          diapItemId: existingItem.id,
          diapItemObjective: existingItem.objective,
          assigneeName: updates.responsibleRole,
        }, userIdRef.current || undefined);
      }
    }

    setItems(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          const newItem = {
            ...item,
            ...updates,
            updatedAt: new Date().toISOString(),
          };

          if (updates.status === 'achieved' && item.status !== 'achieved') {
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
        objective: generateObjective({ text: response.questionText }, response.answer, response.moduleCode),
        action: generateDIAPActions({ text: response.questionText }, response.answer),
        category: response.category || 'operations-policy-procedure',
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
      'achieved': 0,
      'ongoing': 0,
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

    const achieved = byStatus['achieved'];
    const completedPercentage = total > 0 ? Math.round((achieved / total) * 100) : 0;

    return { total, byStatus, byPriority, byTimeframe, completedPercentage };
  }, [items]);

  // Import from CSV
  const importFromCSV = useCallback((csvContent: string): CSVImportResult => {
    const session = getSession();
    const now = new Date().toISOString();
    const errors: string[] = [];
    const importedItems: DIAPItem[] = [];

    try {
      const lines = csvContent.split('\n').filter(line => line.trim());
      if (lines.length < 2) {
        return { success: false, imported: 0, errors: ['CSV file is empty or has no data rows'], items: [] };
      }

      // Parse header
      const header = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());
      const requiredCols = ['objective', 'action'];
      const missingCols = requiredCols.filter(col => !header.includes(col));

      if (missingCols.length > 0) {
        return { success: false, imported: 0, errors: [`Missing required columns: ${missingCols.join(', ')}`], items: [] };
      }

      // Get column indices
      const colIdx = {
        objective: header.indexOf('objective'),
        action: header.indexOf('action'),
        category: header.indexOf('category'),
        priority: header.indexOf('priority'),
        status: header.indexOf('status'),
        timeframe: header.indexOf('timeframe'),
        dueDate: header.indexOf('due_date') !== -1 ? header.indexOf('due_date') : header.indexOf('duedate'),
        responsible: header.indexOf('responsible') !== -1 ? header.indexOf('responsible') : header.indexOf('responsible_role'),
        notes: header.indexOf('notes'),
        successIndicators: header.indexOf('success_indicators') !== -1 ? header.indexOf('success_indicators') : header.indexOf('indicators'),
        budgetEstimate: header.indexOf('budget_estimate') !== -1 ? header.indexOf('budget_estimate') : header.indexOf('budget'),
      };

      // Parse data rows
      for (let i = 1; i < lines.length; i++) {
        try {
          const values = parseCSVLine(lines[i]);
          if (values.length === 0 || values.every(v => !v.trim())) continue;

          const objective = values[colIdx.objective]?.trim() || '';
          const action = values[colIdx.action]?.trim() || '';

          if (!objective && !action) {
            errors.push(`Row ${i + 1}: Missing both objective and action`);
            continue;
          }

          // Parse category
          let category: DIAPCategory = 'operations-policy-procedure';
          if (colIdx.category !== -1 && values[colIdx.category]) {
            const catValue = values[colIdx.category].toLowerCase().trim().replace(/\s+/g, '-');
            if (isValidCategory(catValue)) {
              category = catValue as DIAPCategory;
            }
          }

          // Parse priority
          let priority: DIAPPriority = 'medium';
          if (colIdx.priority !== -1 && values[colIdx.priority]) {
            const prioValue = values[colIdx.priority].toLowerCase().trim();
            if (['high', 'medium', 'low'].includes(prioValue)) {
              priority = prioValue as DIAPPriority;
            }
          }

          // Parse status
          let status: DIAPStatus = 'not-started';
          if (colIdx.status !== -1 && values[colIdx.status]) {
            const statusValue = values[colIdx.status].toLowerCase().trim().replace(/\s+/g, '-');
            if (isValidStatus(statusValue)) {
              status = statusValue as DIAPStatus;
            }
          }

          // Parse timeframe
          let timeframe = '30-90 days';
          if (colIdx.timeframe !== -1 && values[colIdx.timeframe]) {
            timeframe = values[colIdx.timeframe].trim();
          }

          // Parse due date
          let dueDate: string | undefined;
          if (colIdx.dueDate !== -1 && values[colIdx.dueDate]) {
            const parsed = new Date(values[colIdx.dueDate].trim());
            if (!isNaN(parsed.getTime())) {
              dueDate = parsed.toISOString().split('T')[0];
            }
          }

          const item: DIAPItem = {
            id: uuidv4(),
            sessionId: session?.session_id || '',
            objective: objective || action,
            action: action || objective,
            category,
            priority,
            status,
            timeframe,
            dueDate,
            responsibleRole: colIdx.responsible !== -1 ? values[colIdx.responsible]?.trim() : undefined,
            notes: colIdx.notes !== -1 ? values[colIdx.notes]?.trim() : undefined,
            successIndicators: colIdx.successIndicators !== -1 ? values[colIdx.successIndicators]?.trim() : undefined,
            budgetEstimate: colIdx.budgetEstimate !== -1 ? values[colIdx.budgetEstimate]?.trim() : undefined,
            importSource: 'csv',
            createdAt: now,
            updatedAt: now,
          };

          importedItems.push(item);
        } catch (rowError) {
          errors.push(`Row ${i + 1}: Parse error`);
        }
      }

      if (importedItems.length > 0) {
        setItems(prev => {
          const updated = [...prev, ...importedItems];
          saveLocalItems(updated);
          return updated;
        });
      }

      return {
        success: importedItems.length > 0,
        imported: importedItems.length,
        errors,
        items: importedItems,
      };
    } catch (err) {
      console.error('CSV import error:', err);
      return { success: false, imported: 0, errors: ['Failed to parse CSV file'], items: [] };
    }
  }, []);

  // Import from Excel (.xlsx)
  const importFromExcel = useCallback(async (file: File): Promise<ExcelImportResult> => {
    const session = getSession();
    const now = new Date().toISOString();
    const errors: string[] = [];
    const importedItems: DIAPItem[] = [];
    const sheetsProcessed: string[] = [];

    try {
      const XLSX = await import('xlsx');
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      // Process each sheet
      for (const sheetName of workbook.SheetNames) {
        sheetsProcessed.push(sheetName);
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        if (jsonData.length < 2) continue;

        // Get headers from first row
        const headers = (jsonData[0] as string[]).map(h => String(h || '').toLowerCase().trim());

        // Find column indices
        const colIdx = {
          objective: headers.findIndex(h => h.includes('objective') || h.includes('goal')),
          action: headers.findIndex(h => h.includes('action') || h.includes('task') || h.includes('item')),
          category: headers.findIndex(h => h.includes('category') || h.includes('area') || h.includes('pillar')),
          priority: headers.findIndex(h => h.includes('priority')),
          status: headers.findIndex(h => h.includes('status')),
          timeframe: headers.findIndex(h => h.includes('timeframe') || h.includes('timeline')),
          dueDate: headers.findIndex(h => h.includes('due') || h.includes('date') || h.includes('deadline')),
          responsible: headers.findIndex(h => h.includes('responsible') || h.includes('owner') || h.includes('who') || h.includes('assigned')),
          notes: headers.findIndex(h => h.includes('note') || h.includes('comment')),
          successIndicators: headers.findIndex(h => h.includes('indicator') || h.includes('measure') || h.includes('kpi')),
          budgetEstimate: headers.findIndex(h => h.includes('budget') || h.includes('cost') || h.includes('resource')),
        };

        // Check if we have at least objective or action column
        if (colIdx.objective === -1 && colIdx.action === -1) {
          errors.push(`Sheet "${sheetName}": No objective or action column found`);
          continue;
        }

        // Process data rows
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.every(cell => !cell)) continue;

          const getValue = (idx: number) => idx !== -1 && row[idx] ? String(row[idx]).trim() : '';

          const objective = getValue(colIdx.objective);
          const action = getValue(colIdx.action);

          if (!objective && !action) continue;

          // Parse category
          let category: DIAPCategory = 'operations-policy-procedure';
          const catValue = getValue(colIdx.category).toLowerCase().replace(/\s+/g, '-');
          if (isValidCategory(catValue)) {
            category = catValue as DIAPCategory;
          } else {
            // Try to categorize from text
            category = categorizeFromText(action || objective);
          }

          // Parse priority
          let priority: DIAPPriority = 'medium';
          const prioValue = getValue(colIdx.priority).toLowerCase();
          if (['high', 'medium', 'low'].includes(prioValue)) {
            priority = prioValue as DIAPPriority;
          } else if (prioValue.includes('1') || prioValue.includes('urgent')) {
            priority = 'high';
          } else if (prioValue.includes('3') || prioValue.includes('low')) {
            priority = 'low';
          }

          // Parse status
          let status: DIAPStatus = 'not-started';
          const statusValue = getValue(colIdx.status).toLowerCase();
          if (statusValue.includes('progress')) {
            status = 'in-progress';
          } else if (statusValue.includes('achiev') || statusValue.includes('complete') || statusValue.includes('done')) {
            status = 'achieved';
          } else if (statusValue.includes('ongoing') || statusValue.includes('continuous') || statusValue.includes('recurring')) {
            status = 'ongoing';
          } else if (statusValue.includes('hold') || statusValue.includes('pause')) {
            status = 'on-hold';
          }

          // Parse timeframe
          let timeframe = '30-90 days';
          const tfValue = getValue(colIdx.timeframe).toLowerCase();
          if (tfValue.includes('immediate') || tfValue.includes('0-30') || tfValue.includes('month')) {
            timeframe = '0-30 days';
          } else if (tfValue.includes('year') || tfValue.includes('12') || tfValue.includes('long')) {
            timeframe = '3-12 months';
          } else if (tfValue.includes('ongoing')) {
            timeframe = 'Ongoing';
          }

          // Parse due date
          let dueDate: string | undefined;
          const dateValue = getValue(colIdx.dueDate);
          if (dateValue) {
            // Handle Excel date serial numbers
            if (!isNaN(Number(dateValue))) {
              const excelDate = new Date((Number(dateValue) - 25569) * 86400 * 1000);
              if (!isNaN(excelDate.getTime())) {
                dueDate = excelDate.toISOString().split('T')[0];
              }
            } else {
              const parsed = new Date(dateValue);
              if (!isNaN(parsed.getTime())) {
                dueDate = parsed.toISOString().split('T')[0];
              }
            }
          }

          const item: DIAPItem = {
            id: uuidv4(),
            sessionId: session?.session_id || '',
            objective: objective || action,
            action: action || objective,
            category,
            priority,
            status,
            timeframe,
            dueDate,
            responsibleRole: getValue(colIdx.responsible) || undefined,
            notes: getValue(colIdx.notes) || undefined,
            successIndicators: getValue(colIdx.successIndicators) || undefined,
            budgetEstimate: getValue(colIdx.budgetEstimate) || undefined,
            importSource: 'csv', // Using 'csv' as Excel is similar
            createdAt: now,
            updatedAt: now,
          };

          importedItems.push(item);
        }
      }

      if (importedItems.length > 0) {
        setItems(prev => {
          const updated = [...prev, ...importedItems];
          saveLocalItems(updated);
          return updated;
        });
      } else if (errors.length === 0) {
        errors.push('No valid DIAP items found in the Excel file');
      }

      return {
        success: importedItems.length > 0,
        imported: importedItems.length,
        errors,
        items: importedItems,
        sheetsProcessed,
      };
    } catch (err) {
      console.error('Excel import error:', err);
      return {
        success: false,
        imported: 0,
        errors: ['Failed to parse Excel file. Please ensure it is a valid .xlsx file.'],
        items: [],
        sheetsProcessed,
      };
    }
  }, []);

  // Import from PDF - extracts text and attempts to parse DIAP items
  const importFromPDF = useCallback(async (file: File): Promise<PDFImportResult> => {
    const session = getSession();
    const now = new Date().toISOString();
    const errors: string[] = [];
    const importedItems: DIAPItem[] = [];

    try {
      // Use PDF.js to extract text
      const arrayBuffer = await file.arrayBuffer();
      const pdfjsLib = await import('pdfjs-dist');

      // Set worker source
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      // Extract text from all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      // Attempt to parse DIAP items from text
      // Look for common patterns in DIAP documents
      // Reserved patterns for future structured parsing:
      // - "Action: ... Responsible: ... Timeframe: ..."
      // - Numbered items "1. Action text"
      // - Bullet points

      // Try to extract structured items
      const actionPattern = /(?:Action|Item|Task|Objective)[:\s]+([^.\n]+)/gi;
      let match;

      while ((match = actionPattern.exec(fullText)) !== null) {
        const actionText = match[1].trim();
        if (actionText.length > 10 && actionText.length < 500) {
          // Try to find associated responsibility
          const contextStart = Math.max(0, match.index - 200);
          const contextEnd = Math.min(fullText.length, match.index + match[0].length + 200);
          const context = fullText.slice(contextStart, contextEnd);

          let responsible: string | undefined;
          const respMatch = context.match(/(?:Responsible|Owner|Who|Assigned)[:\s]+([^\n,]+)/i);
          if (respMatch) {
            responsible = respMatch[1].trim();
          }

          let dueDate: string | undefined;
          const dateMatch = context.match(/(?:Due|By|Date|Timeframe)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+\s+\d{4})/i);
          if (dateMatch) {
            const parsed = new Date(dateMatch[1]);
            if (!isNaN(parsed.getTime())) {
              dueDate = parsed.toISOString().split('T')[0];
            }
          }

          // Categorize based on keywords
          const category = categorizeFromText(actionText);
          const priority = prioritizeFromText(actionText);

          const item: DIAPItem = {
            id: uuidv4(),
            sessionId: session?.session_id || '',
            objective: actionText,
            action: actionText,
            category,
            priority,
            status: 'not-started',
            timeframe: '',
            dueDate,
            responsibleRole: responsible,
            importSource: 'pdf',
            createdAt: now,
            updatedAt: now,
          };

          // Avoid duplicates
          if (!importedItems.some(i => i.action === item.action)) {
            importedItems.push(item);
          }
        }
      }

      // If no structured items found, try to extract numbered or bulleted items
      if (importedItems.length === 0) {
        const bulletPattern = /(?:^|\n)\s*(?:\d+[.)]\s*|[•\-*]\s*)(.{20,200})(?:\n|$)/g;
        while ((match = bulletPattern.exec(fullText)) !== null) {
          const text = match[1].trim();
          if (text && !text.match(/^(page|copyright|table of contents)/i)) {
            const item: DIAPItem = {
              id: uuidv4(),
              sessionId: session?.session_id || '',
              objective: text,
              action: text,
              category: categorizeFromText(text),
              priority: 'medium',
              status: 'not-started',
              timeframe: '',
              importSource: 'pdf',
              createdAt: now,
              updatedAt: now,
            };
            importedItems.push(item);
          }
        }
      }

      if (importedItems.length === 0) {
        errors.push('Could not extract DIAP items from PDF. Try using CSV import instead.');
      } else {
        setItems(prev => {
          const updated = [...prev, ...importedItems];
          saveLocalItems(updated);
          return updated;
        });
      }

      return {
        success: importedItems.length > 0,
        imported: importedItems.length,
        errors,
        items: importedItems,
        rawText: fullText.slice(0, 5000), // Return first 5000 chars for review
      };
    } catch (err) {
      console.error('PDF import error:', err);
      return {
        success: false,
        imported: 0,
        errors: ['Failed to parse PDF file. Make sure it contains readable text.'],
        items: [],
      };
    }
  }, []);

  // Generate DIAP items from module responses (including media and URL analysis)
  const generateFromResponses = useCallback((responses: any[], questions: any[], moduleName: string) => {
    const session = getSession();
    const now = new Date().toISOString();
    const newItems: DIAPItem[] = [];

    // Get existing items to avoid duplicates
    const existingItems = getLocalItems();
    const existingQuestionSources = new Set(existingItems.map(i => i.questionSource).filter(Boolean));

    responses.forEach(response => {
      // Skip if we already have a DIAP item for this question
      if (existingQuestionSources.has(response.questionId)) {
        return;
      }

      const question = questions.find((q: any) => q.id === response.questionId);
      if (!question) return;

      // Generate items for "no", "not-sure", or "partially" answers
      if (response.answer === 'no' || response.answer === 'not-sure' || response.answer === 'partially') {
        const priority: DIAPPriority = calculateQuestionPriority({
          complianceLevel: question.complianceLevel,
          safetyRelated: question.safetyRelated,
          impactLevel: question.impactLevel,
          answer: response.answer,
        });
        let impactStatement: string | undefined;

        if (response.answer === 'partially') {
          impactStatement = response.notes?.trim()
            ? `Partial measures in place: ${response.notes.trim()}. Complete implementation for full accessibility.`
            : 'Partial measures are in place. Complete implementation for full accessibility.';
        } else if (response.answer === 'not-sure') {
          impactStatement = 'This area needs further investigation to confirm current status.';
        } else {
          impactStatement = question.safetyRelated
            ? 'This is a safety-related item requiring immediate attention.'
            : undefined;
        }

        // Extract module code from moduleName (e.g. "1.4: Social media..." -> "1.4")
        const moduleCodeForObj = moduleName.match(/(\d+\.\d+)/)?.[1] || '';

        const item: DIAPItem = {
          id: uuidv4(),
          sessionId: session?.session_id || '',
          objective: generateObjective(question, response.answer, moduleCodeForObj),
          action: generateDIAPActions(question, response.answer),
          category: mapModuleToCategory(moduleName),
          priority,
          status: 'not-started',
          timeframe: '',
          moduleSource: moduleName,
          questionSource: response.questionId,
          sourceAnswer: response.answer,
          importSource: 'audit',
          impactStatement,
          successIndicators: generateSuccessIndicator(question, moduleCodeForObj),
          complianceLevel: question.complianceLevel,
          complianceRef: question.complianceRef,
          createdAt: now,
          updatedAt: now,
        };

        newItems.push(item);
      }

      // Generate items from multi-select gap analysis
      // If only some positive options are selected, unselected ones represent gaps
      if (question.type === 'multi-select' && question.options && response.answer) {
        const selectedIds = response.answer.split(',').map((s: string) => s.trim()).filter(Boolean);

        // Skip generic/catch-all options
        const skipIds = new Set(['other', 'not-sure', 'none', 'none-of-these', 'not-applicable', 'na', 'unsure']);

        // Find positive-sentiment options that were NOT selected (these are gaps)
        const gaps = question.options.filter((opt: any) =>
          opt.sentiment === 'positive' &&
          !selectedIds.includes(opt.id) &&
          !skipIds.has(opt.id)
        );

        // Only create a DIAP item if there are meaningful gaps AND at least one option was selected
        // (if nothing was selected, the question likely wasn't answered)
        if (gaps.length > 0 && selectedIds.length > 0 && !selectedIds.every((id: string) => skipIds.has(id))) {
          const gapLabels = gaps.map((g: any) => g.label).join(', ');
          const selectedLabels = question.options
            .filter((opt: any) => selectedIds.includes(opt.id) && !skipIds.has(opt.id))
            .map((opt: any) => opt.label)
            .join(', ');

          const moduleCodeForObj = moduleName.match(/(\d+\.\d+)/)?.[1] || '';

          const gapItem: DIAPItem = {
            id: uuidv4(),
            sessionId: session?.session_id || '',
            objective: generateObjective(question, 'partially', moduleCodeForObj),
            action: `Currently in place: ${selectedLabels}. Consider adding: ${gapLabels}.`,
            category: mapModuleToCategory(moduleName),
            priority: 'low' as DIAPPriority,
            status: 'not-started',
            timeframe: '',
            moduleSource: moduleName,
            questionSource: response.questionId,
            sourceAnswer: response.answer,
            importSource: 'audit',
            impactStatement: `${selectedIds.length} of ${selectedIds.length + gaps.length} options currently in place. Expanding coverage would improve accessibility.`,
            successIndicators: generateSuccessIndicator(question, moduleCodeForObj),
            complianceLevel: question.complianceLevel,
            complianceRef: question.complianceRef,
            createdAt: now,
            updatedAt: now,
          };

          newItems.push(gapItem);
        }
      }

      // Generate items from media analysis improvements
      if (response.mediaAnalysis && response.mediaAnalysis.improvements?.length > 0) {
        const analysisType = response.mediaAnalysis.analysisType || 'media';
        // Use the same priority system as regular questions
        const priority: DIAPPriority = calculateQuestionPriority({
          complianceLevel: question?.complianceLevel,
          safetyRelated: question?.safetyRelated,
          impactLevel: question?.impactLevel,
          answer: response.answer || 'no',
        });

        response.mediaAnalysis.improvements.forEach((improvement: string, idx: number) => {
          const itemId = `${response.questionId}-media-${idx}`;
          if (existingQuestionSources.has(itemId)) return;

          const item: DIAPItem = {
            id: uuidv4(),
            sessionId: session?.session_id || '',
            objective: `Improve ${formatAnalysisType(analysisType)} accessibility`,
            action: improvement,
            category: mapAnalysisTypeToCategory(analysisType),
            priority,
            status: 'not-started',
            timeframe: '',
            moduleSource: moduleName,
            questionSource: itemId,
            importSource: 'audit',
            complianceLevel: question?.complianceLevel,
            complianceRef: question?.complianceRef,
            notes: `From ${formatAnalysisType(analysisType)} analysis (Score: ${response.mediaAnalysis.overallScore}/100)`,
            createdAt: now,
            updatedAt: now,
          };

          newItems.push(item);
        });
      }

      // Generate items from URL/website analysis improvements
      if (response.urlAnalysis && response.urlAnalysis.improvements?.length > 0) {
        // Use the same priority system as regular questions
        const priority: DIAPPriority = calculateQuestionPriority({
          complianceLevel: question?.complianceLevel,
          safetyRelated: question?.safetyRelated,
          impactLevel: question?.impactLevel,
          answer: response.answer || 'no',
        });

        response.urlAnalysis.improvements.forEach((improvement: string, idx: number) => {
          const itemId = `${response.questionId}-url-${idx}`;
          if (existingQuestionSources.has(itemId)) return;

          const item: DIAPItem = {
            id: uuidv4(),
            sessionId: session?.session_id || '',
            objective: 'Improve website accessibility',
            action: improvement,
            category: 'information-communication-marketing',
            priority,
            status: 'not-started',
            timeframe: '',
            moduleSource: moduleName,
            questionSource: itemId,
            importSource: 'audit',
            complianceLevel: question?.complianceLevel,
            complianceRef: question?.complianceRef,
            notes: `From website audit of ${response.urlAnalysis.url} (Score: ${response.urlAnalysis.overallScore}/100)`,
            createdAt: now,
            updatedAt: now,
          };

          newItems.push(item);
        });
      }
    });

    if (newItems.length > 0) {
      setItems(prev => {
        const updated = [...prev, ...newItems];
        saveLocalItems(updated);
        return updated;
      });
    }

    return newItems.length;
  }, []);

  // Export to CSV
  const exportToCSV = useCallback((): string => {
    const headers = ['objective', 'action', 'category', 'priority', 'status', 'timeframe', 'due_date', 'responsible', 'notes', 'success_indicators', 'budget_estimate', 'created_at'];
    const rows = items.map(item => [
      escapeCSV(item.objective),
      escapeCSV(item.action),
      item.category,
      item.priority,
      item.status,
      item.timeframe,
      item.dueDate || '',
      escapeCSV(item.responsibleRole || ''),
      escapeCSV(item.notes || ''),
      escapeCSV(item.successIndicators || ''),
      escapeCSV(item.budgetEstimate || ''),
      item.createdAt,
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }, [items]);

  // Get CSV template
  const getCSVTemplate = useCallback((): string => {
    const headers = ['objective', 'action', 'category', 'priority', 'status', 'timeframe', 'due_date', 'responsible', 'notes', 'success_indicators', 'budget_estimate'];
    const example = [
      '"Improve entrance accessibility"',
      '"Install automatic door opener at main entrance"',
      'physical-access',
      'high',
      'not-started',
      '0-30 days',
      '2025-03-01',
      '"Facilities Manager"',
      '"Quote received from contractor"',
      '"Door opener installed and operational"',
      '"$2,000-$5,000"',
    ];

    return [headers.join(','), example.join(',')].join('\n');
  }, []);

  // Sync to cloud
  const syncToCloud = useCallback(async () => {
    if (!isSupabaseEnabled() || !userIdRef.current) return;

    // Sync all items
    syncItemsBatchToCloud(items);

    // Sync all documents
    for (const doc of documents) {
      syncRecord('diap_documents', {
        id: doc.id,
        session_id: doc.sessionId,
        filename: doc.filename,
        file_type: doc.fileType,
        file_size: doc.fileSize || null,
        storage_path: doc.storagePath,
        linked_item_ids: doc.linkedItemIds,
        description: doc.description || null,
        uploaded_at: doc.uploadedAt,
      }, userIdRef.current!, orgIdRef.current).catch(() => {});
    }
  }, [items, documents, syncItemsBatchToCloud]);

  // Add attachment to an item
  const addAttachment = useCallback(async (itemId: string, file: File) => {
    const dataUrl = await fileToBase64(file);
    const attachment: DIAPAttachment = {
      id: uuidv4(),
      name: file.name,
      type: file.type,
      size: file.size,
      dataUrl,
      addedAt: new Date().toISOString(),
    };
    setItems(prev => {
      const updated = prev.map(item => {
        if (item.id === itemId) {
          return { ...item, attachments: [...(item.attachments || []), attachment], updatedAt: new Date().toISOString() };
        }
        return item;
      });
      saveLocalItems(updated);
      return updated;
    });
  }, []);

  // Remove attachment from an item
  const removeAttachment = useCallback((itemId: string, attachmentId: string) => {
    setItems(prev => {
      const updated = prev.map(item => {
        if (item.id === itemId) {
          return { ...item, attachments: (item.attachments || []).filter(a => a.id !== attachmentId), updatedAt: new Date().toISOString() };
        }
        return item;
      });
      saveLocalItems(updated);
      return updated;
    });
  }, []);

  // Add a comment to a DIAP item
  const addComment = useCallback((itemId: string, text: string) => {
    const comment: DIAPComment = {
      id: crypto.randomUUID(),
      authorName: (() => {
        const session = getSession();
        return session?.business_snapshot?.contact_name || 'Team member';
      })(),
      authorId: userIdRef.current || undefined,
      text,
      createdAt: new Date().toISOString(),
    };

    setItems(prev => {
      const updated = prev.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            comments: [...(item.comments || []), comment],
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      });
      saveLocalItems(updated);
      return updated;
    });

    const item = items.find(i => i.id === itemId);
    logActivityStandalone('diap-comment-added', {
      diapItemId: itemId,
      diapItemObjective: item?.objective || '',
      commentText: text,
    }, userIdRef.current || undefined);
  }, [items]);

  // Reorder: swap two items by their IDs
  const reorderItem = useCallback((itemIdA: string, itemIdB: string) => {
    setItems(prev => {
      const idxA = prev.findIndex(i => i.id === itemIdA);
      const idxB = prev.findIndex(i => i.id === itemIdB);
      if (idxA === -1 || idxB === -1) return prev;

      const updated = [...prev];
      [updated[idxA], updated[idxB]] = [updated[idxB], updated[idxA]];
      // Update sortOrder to match array positions
      const reordered = updated.map((item, i) => ({ ...item, sortOrder: i }));
      saveLocalItems(reordered);
      return reordered;
    });
  }, []);

  return {
    items,
    documents,
    isLoading,
    error,
    createItem,
    updateItem,
    deleteItem,
    createItemsFromResponses,
    importFromCSV,
    importFromExcel,
    importFromPDF,
    generateFromResponses,
    uploadDocument,
    deleteDocument,
    linkDocumentToItem,
    addAttachment,
    removeAttachment,
    addComment,
    reorderItem,
    getItemsByPriority,
    getItemsByStatus,
    getItemsByTimeframe,
    getItemsByCategory,
    getStats,
    exportToCSV,
    getCSVTemplate,
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

// Helper: Parse CSV line handling quoted fields
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

// Helper: Escape CSV value
function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

// Helper: Validate category
function isValidCategory(value: string): boolean {
  const validCategories = ['physical-access', 'information-communication-marketing', 'customer-service', 'operations-policy-procedure', 'people-culture'];
  if (validCategories.includes(value)) return true;
  // Also accept custom categories
  try {
    const custom = JSON.parse(localStorage.getItem('diap_custom_categories') || '[]');
    return custom.some((c: { id: string }) => c.id === value);
  } catch { return false; }
}

// Helper: Validate status
function isValidStatus(value: string): boolean {
  const validStatuses = ['not-started', 'in-progress', 'achieved', 'ongoing', 'on-hold', 'cancelled'];
  return validStatuses.includes(value);
}

// Helper: Categorize DIAP item from text
function categorizeFromText(text: string): DIAPCategory {
  const lower = text.toLowerCase();

  // Physical Access - physical spaces, facilities, navigation
  if (lower.match(/entrance|door|ramp|lift|elevator|parking|toilet|restroom|path|access|mobility|wheelchair|wayfinding|seating|furniture/)) {
    return 'physical-access';
  }
  // Information, Communication & Marketing - digital, print, signage, marketing
  if (lower.match(/website|online|digital|app|software|screen reader|wcag|alt text|caption|subtitle|video|audio|social media|sign|braille|auslan|interpreter|language|document|format|font|print|marketing|brochure|flyer|menu|booking|ticketing/)) {
    return 'information-communication-marketing';
  }
  // Customer Service - service delivery, customer interactions
  if (lower.match(/customer|service|greeting|assistance|welcome|feedback|complaint|booking|reservation/)) {
    return 'customer-service';
  }
  // Operations, Policy & Procedure - organisational operations
  if (lower.match(/policy|procedure|guideline|standard|compliance|audit|review|operations|process|system|equipment/)) {
    return 'operations-policy-procedure';
  }
  // People & Culture - staff, training, HR
  if (lower.match(/staff|training|education|awareness|learning|skill|team|employee|hr|culture|recruitment|induction/)) {
    return 'people-culture';
  }

  return 'operations-policy-procedure';
}

// Helper: Determine priority from text
function prioritizeFromText(text: string): DIAPPriority {
  const lower = text.toLowerCase();

  if (lower.match(/urgent|immediate|critical|safety|emergency|hazard|danger|asap/)) {
    return 'high';
  }
  if (lower.match(/important|significant|soon|priority/)) {
    return 'medium';
  }

  return 'medium';
}

// Helper: Map module code or name to DIAP category using authoritative mapping
function mapModuleToCategory(moduleNameOrCode: string): DIAPCategory {
  // Extract module code (e.g. "1.4" from "Social media, video & audio" or "1.4")
  const codeMatch = moduleNameOrCode.match(/(\d+\.\d+)/);
  if (codeMatch) {
    const sectionId = MODULE_TO_DIAP_MAPPING[codeMatch[1]];
    if (sectionId) {
      const section = DIAP_SECTIONS.find(s => s.id === sectionId);
      if (section) return section.categoryId as DIAPCategory;
    }
  }

  // Fallback: try to find module by name
  const lower = moduleNameOrCode.toLowerCase();
  if (lower.match(/entrance|arrival|parking|path|toilet|seating|sensory|accommodation|signage|wayfinding|lighting|sound/)) return 'physical-access';
  if (lower.match(/communication|information|website|digital|marketing|social media|video|audio|menu|brochure|booking|ticketing/)) return 'information-communication-marketing';
  if (lower.match(/customer|service|experience|equipment|activity|retail|safety|feedback/)) return 'customer-service';
  if (lower.match(/staff|training|awareness/)) return 'people-culture';
  return 'operations-policy-procedure';
}

// Strip old generic filler steps that were appended to every DIAP action
function stripFillerSteps(action: string): string {
  const fillerPatterns = [
    /\n?\d+\.\s*Train relevant staff on requirements and procedures\.?/gi,
    /\n?\d+\.\s*Brief relevant staff on changes and expectations\.?/gi,
    /\n?\d+\.\s*Document the change and schedule review in 6 months\.?/gi,
    /\n?\d+\.\s*Schedule policy review every 12 months\.?/gi,
    /\n?\d+\.\s*Schedule regular accessibility audits of digital content\.?/gi,
    /\n?\d+\.\s*Create process to review materials every 6 months\.?/gi,
  ];
  let cleaned = action;
  for (const pattern of fillerPatterns) {
    cleaned = cleaned.replace(pattern, '');
  }
  // If the action was "1. [real action]" and we stripped steps 2+3, remove the leading "1. "
  cleaned = cleaned.replace(/^\s*1\.\s+/, '').trim();
  return cleaned;
}

// Helper: Extract module code from moduleSource string
function extractModuleCode(moduleSource: string): string | undefined {
  const match = moduleSource.match(/(\d+\.\d+)/);
  return match ? match[1] : undefined;
}

// Helper: Map analysis type to category
function mapAnalysisTypeToCategory(analysisType: string): DIAPCategory {
  const typeMap: Record<string, DIAPCategory> = {
    // Information, Communication & Marketing
    'menu': 'information-communication-marketing',
    'brochure': 'information-communication-marketing',
    'flyer': 'information-communication-marketing',
    'large-print': 'information-communication-marketing',
    'signage': 'information-communication-marketing',
    'social-media-post': 'information-communication-marketing',
    'social-media-url': 'information-communication-marketing',
    'website-wave': 'information-communication-marketing',
    // Physical Access
    'lighting': 'physical-access',
    'ground-surface': 'physical-access',
    'pathway': 'physical-access',
    'entrance': 'physical-access',
    'ramp': 'physical-access',
    'stairs': 'physical-access',
    'door': 'physical-access',
  };
  return typeMap[analysisType] || 'operations-policy-procedure';
}

// Helper: Format analysis type for display
function formatAnalysisType(analysisType: string): string {
  const labels: Record<string, string> = {
    'menu': 'menu',
    'brochure': 'brochure',
    'flyer': 'flyer',
    'large-print': 'large print document',
    'signage': 'signage',
    'lighting': 'lighting',
    'ground-surface': 'ground surface',
    'pathway': 'pathway',
    'entrance': 'entrance',
    'ramp': 'ramp',
    'stairs': 'stairs',
    'door': 'door',
    'social-media-post': 'social media',
    'social-media-url': 'social media profile',
    'website-wave': 'website',
  };
  return labels[analysisType] || analysisType;
}

// Helper: Generate outcome-focused objective from question topic
// Module-specific objective lookup. Each module maps to a single objective,
// or an object with keyword-based sub-objectives for larger modules.
const MODULE_OBJECTIVES: Record<string, string | { default: string; keywords: { pattern: RegExp; objective: string }[] }> = {
  // 1.x Before Arrival
  '1.1': 'Welcome all visitors with clear pre-visit information to plan their journey',
  '1.2': 'Provide a website that all visitors can use with confidence',
  '1.3': 'Offer booking and ticketing systems that work for all customers',
  '1.4': 'Create social media, video, and audio content everyone can enjoy',
  '1.5': 'Communicate in clear, welcoming, and inclusive language',
  '1.6': 'Reflect and welcome diverse audiences in marketing materials',
  // 2.x Getting In
  '2.1': 'Provide welcoming arrival, parking, and drop-off options for all visitors',
  '2.2': 'Welcome all visitors through accessible, dignified entry points',
  '2.3': 'Provide paths and aisles that all visitors can use comfortably',
  '2.4': 'Create a comfortable queuing and arrival experience for all visitors',
  // 3.x During Visit
  '3.1': {
    default: 'Provide comfortable seating, furniture, and layout for all visitors',
    keywords: [
      { pattern: /seating|chair|bench|wheelchair.*space/i, objective: 'Offer seating options that welcome all visitors' },
      { pattern: /furniture|table|counter|height/i, objective: 'Provide furniture and surfaces that work for all visitors' },
      { pattern: /layout|space|manoeuvr|circulation/i, objective: 'Create a layout that supports comfortable movement for all visitors' },
    ],
  },
  '3.2': {
    default: 'Provide toilet and amenity facilities that all visitors can use',
    keywords: [
      { pattern: /changing places|adult change|hoist/i, objective: 'Offer Changing Places or adult change facilities for visitors who need them' },
      { pattern: /shower|bath/i, objective: 'Provide shower and bathing facilities all guests can use' },
    ],
  },
  '3.3': {
    default: 'Create a comfortable sensory environment that all visitors can enjoy',
    keywords: [
      { pattern: /light|glare|bright/i, objective: 'Provide lighting that is comfortable and functional for all visitors' },
      { pattern: /noise|sound|acoustic/i, objective: 'Create a sound environment that is comfortable for all visitors' },
      { pattern: /quiet|calm|sensory room/i, objective: 'Offer sensory-friendly spaces and options for visitors who need them' },
    ],
  },
  '3.4': 'Provide equipment and resources that all visitors can use',
  '3.5': 'Help all visitors navigate independently through clear signage and wayfinding',
  '3.6': 'Provide menus and printed materials that all visitors can read and use',
  '3.7': 'Share on-site information in formats all visitors can access',
  '3.8': 'Welcome all visitors to participate fully in experiences and activities',
  '3.9': {
    default: 'Provide accommodation that welcomes guests with diverse needs',
    keywords: [
      { pattern: /kitchen|kitchenette|cook/i, objective: 'Provide kitchenette and cooking facilities all guests can use' },
      { pattern: /bathroom|ensuite|shower/i, objective: 'Provide accommodation bathrooms all guests can use' },
    ],
  },
  '3.10': 'Support all customers to browse, select, and purchase independently',
  // 4.x Service & Support
  '4.1': 'Offer contact channels that all customers can use with ease',
  '4.2': 'Build staff confidence in delivering welcoming, inclusive service',
  '4.3': 'Offer booking and ticketing processes that all customers can complete',
  '4.4': 'Include all visitors in safety and emergency planning',
  '4.5': 'Invite feedback through channels all customers can use',
  '4.6': 'Keep in touch with all customers through accessible communications',
  '4.7': 'Maintain welcoming, accessible communication with all customers over time',
  // 5.x Organisation
  '5.1': 'Embed accessibility and inclusion into organisational policies and culture',
  '5.2': 'Foster an inclusive workplace where all employees can thrive',
  '5.3': 'Strengthen organisational capability through accessibility training',
  '5.4': 'Incorporate accessibility into procurement and supplier decisions',
  '5.5': 'Celebrate progress and drive continuous improvement in accessibility',
  // 6.x Events
  '6.1': 'Plan and promote events that welcome all attendees',
  '6.2': 'Choose and set up venues that all attendees can enjoy',
  '6.3': 'Share event information in formats all attendees can access',
  '6.4': 'Offer sensory access and assistive technology so all attendees can participate',
  '6.5': 'Deliver inclusive, welcoming event operations on the day',
};

// Question-text-driven success indicators with targets and boundaries
// Each entry: regex pattern matched against question text → bullet-pointed indicators
const QUESTION_SUCCESS_INDICATORS: { pattern: RegExp; indicators: string[] }[] = [
  // Doors, entry, clearance
  { pattern: /\bdoors?\b|\bentry\b|\bentrance|\bclearance|\blatch/i, indicators: [
    '• Aim for all primary entry points to meet accessible door clearance requirements (per AS 1428.1) within 12 months',
    '• Door hardware and clearance checked quarterly and after any renovation',
    '• All customer-facing staff can direct visitors to accessible entries',
  ]},
  // Parking and drop-off
  { pattern: /\bparking\b|\bdrop.?off|\bpick.?up/i, indicators: [
    '• Accessible parking spaces checked weekly for obstructions and kept clear',
    '• Drop-off zone clear and usable during operating hours',
    '• Accessible parking signage visible and in good condition, reviewed annually',
  ]},
  // Paths, aisles, corridors
  { pattern: /\bpaths?\b|\baisle|\bcorridor|\bcirculation|\bmanoeuvr/i, indicators: [
    '• Aim for primary internal paths to meet 1000mm minimum width (1200mm preferred) within 12 months',
    '• Floor surfaces assessed for slip hazards quarterly',
    '• Staff process in place to report and clear path obstructions within 1 hour',
  ]},
  // Ramps, steps, levels
  { pattern: /\bramps?\b|\bsteps?\b|\bstair|\blevel\b|\bgradient/i, indicators: [
    '• All primary access ramps to meet AS 1428.1 gradient requirements within 12 months; secondary ramps within 24 months',
    '• Non-slip strips and handrails inspected quarterly',
    '• Alternative level access route signed at all stepped entries within 6 months',
  ]},
  // Signage and wayfinding
  { pattern: /\bsign(?:s|age)?\b|\bwayfind|\bdirect(?:ion|ional)?\b|\bnavigat/i, indicators: [
    '• Signage audit completed within 3 months; priority signs upgraded to high-contrast (min 70% luminance contrast) within 12 months',
    '• All new signage meets standard: sans-serif, appropriate height, high contrast',
    '• Signage reviewed annually and after any layout changes',
  ]},
  // Braille and tactile
  { pattern: /\bbraille|\btactile/i, indicators: [
    '• Tactile/Braille signage installed on priority rooms (toilets, lifts, reception) within 12 months',
    '• Tactile signage condition checked annually and replaced when damaged',
  ]},
  // Lighting
  { pattern: /\blights?\b|\blighting\b|\bglare\b|\bbright/i, indicators: [
    '• Lighting assessment completed in all public areas within 3 months',
    '• Priority glare and dim-area issues resolved within 6 months',
    '• Lighting reviewed after any fit-out changes and annually',
  ]},
  // Noise, sound, acoustics
  { pattern: /\bnoise\b|\bsound\b|\bacoustic|\bloud\b/i, indicators: [
    '• Noise levels assessed in main service areas within 3 months; solutions implemented for problem areas within 12 months',
    '• If hearing loop installed, tested monthly and confirmed operational',
    '• Quiet hours or quiet zones offered where suitable for the business type',
  ]},
  // Sensory, quiet space
  { pattern: /\bsensory\b|\bquiet\b|\bcalm\b/i, indicators: [
    '• At least 1 quiet/sensory-friendly space identified and available during operating hours within 6 months',
    '• Sensory guide or map created and published within 6 months, updated annually',
    '• Staff briefed on sensory-friendly options within 1 month of implementation',
  ]},
  // Website, digital, online
  { pattern: /\bwebsite\b|\bweb page|\bdigital\b|\bonline\b.*\baccess/i, indicators: [
    '• Initial accessibility scan completed (e.g. WAVE or axe) and critical issues fixed within 3 months',
    '• Aim for WCAG 2.1 AA compliance on key pages within 12 months',
    '• Critical accessibility issues (navigation, forms, checkout) resolved within 30 days of discovery',
  ]},
  // Screen reader, assistive tech
  { pattern: /\bscreen reader|\bassistive\b|\bkeyboard\b/i, indicators: [
    '• Key user journeys (homepage, booking, contact) keyboard-accessible within 6 months',
    '• Screen reader testing completed on primary pages within 6 months, then annually',
    '• Accessibility issues logged and critical items resolved within 30 days',
  ]},
  // Contrast, colour
  { pattern: /\bcontrast\b|\bcolou?rs?\b/i, indicators: [
    '• All text on key pages meets 4.5:1 contrast ratio within 3 months',
    '• Colour is not the sole method of conveying information on any page',
    '• Contrast check included in content publishing process',
  ]},
  // Forms, inputs
  { pattern: /\bforms?\b|\binput\b|\bfields?\b|\bcheckout\b/i, indicators: [
    '• All customer-facing forms have visible labels and clear error messages within 3 months',
    '• All forms completable via keyboard only, confirmed by testing within 6 months',
    '• Form accessibility issues tracked and reduced by 50% within 12 months',
  ]},
  // Mobile, responsive
  { pattern: /\bmobile\b|\bresponsive\b|\bphone\b.*\bapp\b/i, indicators: [
    '• Website tested on iOS and Android devices; critical mobile issues fixed within 3 months',
    '• Touch targets meet 24x24px minimum (WCAG 2.2 AA), aim for 44x44px on key interactions',
    '• Mobile experience checked when making website updates',
  ]},
  // Social media, video, captions
  { pattern: /\bsocial media|\bvideo\b|\bcaption|\bsubtitle/i, indicators: [
    '• All new videos include captions before or within 48 hours of publishing',
    '• Alt text included on all new social media images from [start date]',
    '• Top 10 existing videos captioned within 6 months',
  ]},
  // Audio, podcast, transcript
  { pattern: /\baudio\b|\bpodcast|\btranscript/i, indicators: [
    '• All new audio content has a transcript published within 1 week',
    '• Top 5 most-accessed existing audio items transcribed within 6 months',
  ]},
  // Alt text, images
  { pattern: /\balt text|\bimage desc|\bphoto\b.*\baccess/i, indicators: [
    '• All new images include descriptive alt text from [start date]',
    '• Alt text added to top 20 most-viewed existing pages within 3 months',
    '• Team provided with alt text guidelines and checklist',
  ]},
  // Marketing, representation
  { pattern: /\bmarketing\b|\brepresentation\b|\binclusive\b.*\bimage|\bdiverse\b/i, indicators: [
    '• Aim for at least 1 in 5 marketing images to feature diverse representation including disability within 12 months',
    '• Inclusive imagery sourced or commissioned within 6 months',
    '• Representation reviewed as part of each campaign planning process',
  ]},
  // Plain language, Easy Read
  { pattern: /\bplain language|\beasy read|\breadab|\bjargon\b/i, indicators: [
    '• Top 5 customer-facing documents reviewed and simplified to Year 8 reading level within 6 months',
    '• At least 1 key document (e.g. welcome guide) available in Easy Read within 12 months',
    '• Plain language check included in process for new content',
  ]},
  // Booking, ticketing
  { pattern: /\bbookings?\b|\bticket|\breserv/i, indicators: [
    '• Booking process accessibility tested and critical barriers fixed within 3 months',
    '• Companion/carer ticketing policy published and all booking staff briefed within 3 months',
    '• At least 1 alternative booking method available (e.g. phone or email)',
  ]},
  // Seating, furniture
  { pattern: /\bseat|\bchair\b|\bbench\b|\bfurniture\b|\btables?\b|\bcounters?\b/i, indicators: [
    '• At least 1 wheelchair-accessible option available at each seating/counter type within 6 months',
    '• At least 1 lowered counter or service point available within 6 months',
    '• Furniture arrangement checked monthly to maintain minimum 1000mm clear circulation paths',
  ]},
  // Toilets, bathrooms, amenities
  { pattern: /\btoilet|\bbathroom|\bamenit|\bwashroom|\brestroom/i, indicators: [
    '• Accessible toilet included in daily cleaning checklist with access kept clear',
    '• Emergency cord verified to reach floor level, checked monthly',
    '• Grab rails, signage, and fittings inspected quarterly',
  ]},
  // Changing Places
  { pattern: /\bchanging places|\badult change|\bhoist\b/i, indicators: [
    '• If Changing Places facility exists: registered on National map, checked daily, equipment serviced every 6 months',
    '• If not available: nearest Changing Places facility identified and information provided to visitors who enquire',
  ]},
  // Equipment, resources, assistive
  { pattern: /\bequipment\b|\bresources?\b|\bassistive\b.*\bdevice|\bwheelchair\b.*\bloan|\bmobility\b.*\baid/i, indicators: [
    '• Available assistive equipment listed on website and at reception within 3 months',
    '• All equipment checked monthly for condition and functionality',
    '• Customer-facing staff briefed on equipment availability and use within 3 months',
  ]},
  // Menus, printed materials
  { pattern: /\bmenus?\b|\bprinted\b|\bbrochure|\bpamphlet|\bflyer/i, indicators: [
    '• Top 3 key printed materials available in large print and/or digital format within 6 months',
    '• Accessible formats updated within 2 weeks of content changes',
    '• Customers informed that accessible formats are available',
  ]},
  // Staff training, awareness
  { pattern: /\bstaff\b.*\btrain|\btrain\b.*\bstaff|\bawareness\b|\bdisability\b.*\bconfident|\bcustomer\b.*\bservice/i, indicators: [
    '• All customer-facing staff complete disability awareness training within 3 months of starting',
    '• Annual refresher training or team discussion completed each year',
    '• Customer feedback on staff interactions reviewed at least every 6 months',
  ]},
  // Auslan, sign language
  { pattern: /\bauslan\b|\bsign language|\bdeaf\b|\bhearing\b/i, indicators: [
    '• Process established to arrange Auslan interpreter on request within 48 hours notice',
    '• National Relay Service (NRS) details available to staff and promoted to customers within 3 months',
    '• Team learns basic Auslan greetings (hello, thank you, help) within 6 months',
    '• Hearing loop or captioning available for group presentations where feasible',
  ]},
  // Emergency, evacuation, safety
  { pattern: /\bemergency\b|\bevacuat|\bsafety\b|\bfire\b|\balarm\b/i, indicators: [
    '• Personal Emergency Evacuation Plans (PEEPs) offered to all visitors who identify a need',
    '• Evacuation drill includes at least 1 accessibility scenario annually',
    '• Visual and audible alarms reviewed within 6 months; upgrades planned where gaps are found',
  ]},
  // Feedback, reviews, complaints
  { pattern: /\bfeedback\b|\breview\b|\bcomplaint|\bsurvey\b/i, indicators: [
    '• Feedback available in at least 2 formats (e.g. online, verbal, paper)',
    '• Accessibility-related feedback reviewed and responded to within 5 business days',
    '• Feedback trends reviewed every 6 months to identify common issues',
  ]},
  // Contact, communication channels
  { pattern: /\bcontact\b|\bphone\b|\bemail\b|\bchat\b|\bcommunication channel/i, indicators: [
    '• At least 2 accessible contact channels available (e.g. phone and email)',
    '• Enquiries responded to within 1 business day during business hours',
    '• Contact options clearly promoted on website and at venue',
  ]},
  // Policy, procedure, governance
  { pattern: /\bpolicy\b|\bprocedure\b|\bgovernance\b|\bcompliance\b/i, indicators: [
    '• Accessibility policy published and communicated to all staff within 6 months',
    '• Policy reviewed annually and updated within 30 days of relevant regulatory changes',
    '• Accessibility discussed in team or leadership meetings at least quarterly',
  ]},
  // Employment, recruitment, workplace
  { pattern: /\bemploy|\brecruit|\bhiring\b|\bworkplace\b|\bjob\b|\bpositions?\b/i, indicators: [
    '• All job advertisements include accessibility and adjustment statement from [start date]',
    '• Interview adjustment options offered proactively to all candidates',
    '• Workplace adjustment requests responded to within 5 business days',
  ]},
  // Procurement, suppliers
  { pattern: /\bprocure|\bsupplier|\bvendor\b|\bcontract\b/i, indicators: [
    '• Accessibility criteria included in procurement checklist for all new suppliers from [start date]',
    '• Top 5 existing suppliers reviewed for accessibility within 12 months',
    '• Supplier accessibility practices discussed at annual review',
  ]},
  // Continuous improvement, reporting
  { pattern: /\bimprov|\bprogress\b|\breports?\b|\bmeasur|\baudits?\b/i, indicators: [
    '• Accessibility progress reported to leadership at least every 6 months',
    '• At least 1 accessibility improvement completed per quarter',
    '• Annual accessibility summary documented and shared with team',
  ]},
  // Programs, activities, experiences
  { pattern: /\bprograms?\b|\bactivit|\bexperience\b|\bevents?\b|\bparticipat/i, indicators: [
    '• All core programs/activities reviewed for accessibility barriers within 12 months',
    '• At least 1 adapted option available for each core experience within 12 months',
    '• Feedback sought from participants with disability at least annually',
  ]},
  // Accommodation, rooms
  { pattern: /\baccommod|\brooms?\b|\bhotel\b|\bstay\b|\bguest\b/i, indicators: [
    '• Accessible room features verified before each guest arrival as part of standard check-in process',
    '• Accessibility information on booking platform reviewed and updated every 6 months',
    '• Guest accessibility feedback reviewed quarterly and used to guide improvements',
  ]},
  // Retail, shopping
  { pattern: /\bretail\b|\bshops?\b|\bshopping\b|\bpurchas|\bbrowse\b|\bproduct\b/i, indicators: [
    '• At least 1 accessible checkout option available within 6 months',
    '• Product information available in accessible format for key product lines within 12 months',
    '• Staff briefed to proactively offer assistance; approach reviewed every 6 months',
  ]},
  // Maps, directories
  { pattern: /\bmaps?\b|\bdirector(?:y|ies)\b|\blayout\b.*\bguide/i, indicators: [
    '• Accessible map or directory available in print and digital format within 6 months',
    '• Map updated within 2 weeks of any layout change',
    '• Map includes accessible routes, toilets, lifts, and quiet spaces',
  ]},
  // Queue, waiting
  { pattern: /\bqueue|\bwaiting\b|\bwait\b|\bbusy\b/i, indicators: [
    '• Wait times communicated to customers via signage or staff within 3 months',
    '• Seating available in main queue areas within 3 months',
    '• Priority or alternative access available for customers who need it',
  ]},
  // Pre-visit information (catch questions about sharing info before arrival)
  { pattern: /\bpre.?visit\b|\bbefore\b.*\bvisit|\binformation\b.*\bavailab|\baccess.*\binformation\b/i, indicators: [
    '• Accessibility information published on primary customer-facing channel within 3 months',
    '• Information covers physical access, sensory environment, and available supports',
    '• Information reviewed for accuracy every 6 months and after any venue changes',
  ]},
];

function generateSuccessIndicator(question: any, _moduleCode?: string): string {
  const questionText = question.text?.toLowerCase() || '';

  // Match against question text patterns
  for (const entry of QUESTION_SUCCESS_INDICATORS) {
    if (entry.pattern.test(questionText)) {
      return entry.indicators.join('\n');
    }
  }

  // Generic fallback
  return [
    '• Change implemented and verified within 6 months',
    '• Staff briefed on changes within 1 month of implementation',
    '• Reviewed annually for ongoing effectiveness',
  ].join('\n');
}

function generateObjective(question: any, _answer: string, moduleCode?: string): string {
  const code = moduleCode || '';
  const entry = MODULE_OBJECTIVES[code];

  if (!entry) {
    return 'Create a welcoming, accessible experience for all visitors';
  }

  if (typeof entry === 'string') {
    return entry;
  }

  // Module has keyword sub-objectives
  const lower = question.text.toLowerCase();
  for (const kw of entry.keywords) {
    if (kw.pattern.test(lower)) {
      return kw.objective;
    }
  }
  return entry.default;
}

// Helper: Generate action text for DIAP items
// Topic-specific supporting steps (step 2 and step 3) keyed by pattern
const SUPPORTING_STEPS: { pattern: RegExp; steps: [string, string] }[] = [
  { pattern: /\bdoors?\b|\bentry\b|\bentrance|\bclearance|\blatch/i, steps: [
    'Measure current door clearances and hardware against AS 1428.1 requirements and document gaps',
    'Schedule a review of entry points after any renovation or layout change',
  ]},
  { pattern: /\bparking\b|\bdrop.?off|\bpick.?up/i, steps: [
    'Audit accessible parking bays for correct dimensions, signage, and proximity to entrance',
    'Add a weekly check of accessible parking and drop-off zones to your maintenance schedule',
  ]},
  { pattern: /\bpaths?\b|\baisle|\bcorridor|\bcirculation|\bmanoeuvr/i, steps: [
    'Measure primary circulation paths and identify any pinch points below 1000mm width',
    'Establish a process for staff to report and clear path obstructions promptly',
  ]},
  { pattern: /\bramps?\b|\bsteps?\b|\bstair|\blevel\b|\bgradient/i, steps: [
    'Assess ramp gradients and handrail condition against AS 1428.1 requirements',
    'Install or improve signage directing visitors to alternative level access routes',
  ]},
  { pattern: /\bsign(?:s|age)?\b|\bwayfind|\bdirect(?:ion|ional)?\b|\bnavigat/i, steps: [
    'Audit existing signage for contrast, font size, and mounting height compliance',
    'Prioritise upgrades at key decision points (entrances, intersections, lifts, toilets)',
  ]},
  { pattern: /\blights?\b|\blighting\b|\bglare\b|\bbright/i, steps: [
    'Assess lighting levels and glare in all public areas, noting problem spots',
    'Prioritise fixes in high-traffic areas and review after any fit-out changes',
  ]},
  { pattern: /\bnoise\b|\bsound\b|\bacoustic|\bloud\b/i, steps: [
    'Measure or estimate noise levels in main service areas during peak times',
    'Identify practical solutions for problem areas (soft furnishings, screens, quiet zones)',
  ]},
  { pattern: /\bsensory\b|\bquiet\b|\bcalm\b/i, steps: [
    'Identify a suitable space that can serve as a quiet or sensory-friendly area',
    'Create a sensory guide describing the environment (noise, lighting, crowds) at different times',
  ]},
  { pattern: /\bwebsite\b|\bweb page|\bdigital\b|\bonline\b/i, steps: [
    'Run an initial accessibility scan (e.g. WAVE or axe) on your key pages and note critical issues',
    'Prioritise fixing navigation, forms, and content structure issues first',
  ]},
  { pattern: /\bscreen reader|\bassistive\b|\bkeyboard\b/i, steps: [
    'Test key user journeys (homepage, booking, contact) using keyboard-only navigation',
    'Log any issues found and prioritise fixes by customer impact',
  ]},
  { pattern: /\bcontrast\b|\bcolou?rs?\b/i, steps: [
    'Check text contrast ratios on key pages using a free tool like WebAIM Contrast Checker',
    'Ensure colour is never the only way information is communicated (add labels or patterns)',
  ]},
  { pattern: /\bforms?\b|\binput\b|\bfields?\b|\bcheckout\b/i, steps: [
    'Review all customer-facing forms for visible labels, clear error messages, and logical tab order',
    'Test form completion using keyboard only and fix any barriers found',
  ]},
  { pattern: /\bmobile\b|\bresponsive\b/i, steps: [
    'Test your website on common iOS and Android devices, noting any layout or interaction issues',
    'Check that touch targets are large enough (aim for 44x44px on key interactions)',
  ]},
  { pattern: /\bsocial media|\bvideo\b|\bcaption|\bsubtitle/i, steps: [
    'Establish a process to add captions to all new videos before or within 48 hours of publishing',
    'Prioritise captioning your most-viewed existing videos first',
  ]},
  { pattern: /\baudio\b|\bpodcast|\btranscript/i, steps: [
    'Set up a workflow to produce transcripts for all new audio content within one week',
    'Identify your most-accessed existing audio items and prioritise transcribing those',
  ]},
  { pattern: /\balt text|\bimage desc/i, steps: [
    'Add descriptive alt text to images on your most-visited pages first',
    'Create a simple alt text guide for your team covering dos, don\'ts, and examples',
  ]},
  { pattern: /\bmarketing\b|\brepresentation\b|\binclusive\b.*\bimage|\bdiverse\b/i, steps: [
    'Review your current marketing imagery for diversity and disability representation',
    'Source or commission inclusive imagery for your next campaign or content refresh',
  ]},
  { pattern: /\bplain language|\beasy read|\breadab|\bjargon\b/i, steps: [
    'Review your top customer-facing documents against a Year 8 reading level target',
    'Add a plain language check step to your content publishing process',
  ]},
  { pattern: /\bbookings?\b|\bticket|\breserv/i, steps: [
    'Test your booking process for accessibility barriers (keyboard, screen reader, mobile)',
    'Ensure at least one alternative booking method is available (e.g. phone or email)',
  ]},
  { pattern: /\bseat|\bchair\b|\bbench\b|\bfurniture\b|\btables?\b|\bcounters?\b/i, steps: [
    'Audit seating and counter options for wheelchair accessibility and height variety',
    'Check furniture arrangements maintain at least 1000mm clear circulation paths',
  ]},
  { pattern: /\btoilet|\bbathroom|\bamenit|\bwashroom|\brestroom/i, steps: [
    'Verify accessible toilet features: grab rails, emergency cord to floor, clear signage',
    'Add accessible toilet checks to your daily cleaning and maintenance routine',
  ]},
  { pattern: /\bequipment\b|\bresources?\b|\bassistive\b.*\bdevice|\bwheelchair\b.*\bloan|\bmobility\b.*\baid/i, steps: [
    'List all available assistive equipment and publish it on your website and at reception',
    'Set up a monthly equipment check for condition and functionality',
  ]},
  { pattern: /\bmenus?\b|\bprinted\b|\bbrochure|\bpamphlet|\bflyer/i, steps: [
    'Identify your top 3 customer-facing printed materials and create large print or digital versions',
    'Set up a process to update accessible formats within 2 weeks of content changes',
  ]},
  { pattern: /\bstaff\b.*\btrain|\btrain\b.*\bstaff|\bawareness\b|\bdisability\b.*\bconfident|\bcustomer\b.*\bservice/i, steps: [
    'Schedule disability awareness training for all customer-facing staff within 3 months',
    'Plan annual refresher sessions and incorporate accessibility into regular team discussions',
  ]},
  { pattern: /\bauslan\b|\bsign language|\bdeaf\b|\bhearing\b/i, steps: [
    'Establish a process to arrange Auslan interpreting on request with 48 hours notice',
    'Make National Relay Service (NRS) details available to staff and promoted to customers',
  ]},
  { pattern: /\bemergency\b|\bevacuat|\bsafety\b|\bfire\b|\balarm\b/i, steps: [
    'Review your evacuation plan to include at least one disability-specific scenario',
    'Check that alarms have both visual and audible alerts in all public areas',
  ]},
  { pattern: /\bfeedback\b|\breview\b|\bcomplaint|\bsurvey\b/i, steps: [
    'Ensure feedback is available in at least 2 formats (e.g. online, verbal, paper)',
    'Set up a 6-monthly review of accessibility-related feedback trends',
  ]},
  { pattern: /\bcontact\b|\bphone\b|\bemail\b|\bchat\b/i, steps: [
    'Verify that at least 2 accessible contact channels are available and clearly promoted',
    'Set a response time target for accessibility enquiries (e.g. 1 business day)',
  ]},
  { pattern: /\bpolicy\b|\bprocedure\b|\bgovernance\b|\bcompliance\b/i, steps: [
    'Draft or update your accessibility policy and share it with all staff',
    'Schedule annual policy reviews and quarterly accessibility discussions in team meetings',
  ]},
  { pattern: /\bemploy|\brecruit|\bhiring\b|\bworkplace\b|\bjob\b|\bpositions?\b/i, steps: [
    'Add an accessibility and adjustment statement to all job advertisements',
    'Proactively offer interview adjustment options to all candidates',
  ]},
  { pattern: /\bprograms?\b|\bactivit|\bexperience\b|\bevents?\b|\bparticipat/i, steps: [
    'Review your core programs or activities for accessibility barriers',
    'Develop at least one adapted option for each core experience within 12 months',
  ]},
  { pattern: /\baccommod|\brooms?\b|\bhotel\b|\bstay\b|\bguest\b/i, steps: [
    'Verify accessible room features as part of your standard pre-arrival check process',
    'Review and update accessibility information on your booking platform every 6 months',
  ]},
  { pattern: /\bretail\b|\bshops?\b|\bshopping\b|\bpurchas|\bbrowse\b|\bproduct\b/i, steps: [
    'Ensure at least one accessible checkout option is available',
    'Review product information accessibility for your key product lines',
  ]},
  { pattern: /\bmaps?\b|\bdirector(?:y|ies)\b/i, steps: [
    'Create an accessible map or directory in both print and digital formats',
    'Include accessible routes, toilets, lifts, and quiet spaces on the map',
  ]},
  { pattern: /\bqueue|\bwaiting\b|\bwait\b|\bbusy\b/i, steps: [
    'Set up a way to communicate wait times to customers (signage or staff)',
    'Ensure seating is available in main queue areas and priority access is offered where needed',
  ]},
  { pattern: /\bpre.?visit\b|\bbefore\b.*\bvisit|\binformation\b.*\bavailab|\baccess.*\binformation\b/i, steps: [
    'Publish accessibility information on your primary customer-facing channel',
    'Set a 6-monthly review to keep the information accurate and up to date',
  ]},
];

function generateDIAPActions(question: any, answer: string): string {
  const primaryAction = getDIAPActionText(question, answer);
  const lower = question.text?.toLowerCase() || '';

  // Find topic-specific supporting steps
  for (const entry of SUPPORTING_STEPS) {
    if (entry.pattern.test(lower)) {
      return [primaryAction, ...entry.steps].map((s, i) => `${i + 1}. ${s}`).join('\n');
    }
  }

  // Generic fallback supporting steps
  return [
    primaryAction,
    'Verify the change is working as intended and gather initial feedback',
    'Schedule a review in 6 months to assess effectiveness and identify further improvements',
  ].map((s, i) => `${i + 1}. ${s}`).join('\n');
}
