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
import { calculateQuestionPriority } from '../utils/priorityCalculation';
import { MODULE_TO_DIAP_MAPPING, DIAP_SECTIONS } from '../data/diapMapping';
import { getModuleById, getQuestionsForMode } from '../data/accessModules';
import { generateActionText } from '../components/questions/QuestionFlow';

export type DIAPCategory =
  | 'physical-access'
  | 'information-communication-marketing'
  | 'customer-service'
  | 'operations-policy-procedure'
  | 'people-culture';

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
  dueDate?: string; // ISO date string for specific due date

  // Assignment
  responsibleRole?: string;
  responsibleTeam?: string;

  // Status
  status: DIAPStatus;

  // Source tracking
  moduleSource?: string;
  questionSource?: string;
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
const DIAP_MIGRATION_KEY = 'diap_migration_v6';

function getLocalItems(): DIAPItem[] {
  const data = localStorage.getItem(DIAP_ITEMS_KEY);
  if (!data) return [];
  const items: DIAPItem[] = JSON.parse(data);

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
              const answer = item.status === 'completed' ? 'yes' : 'no';
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

  return items;
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

function calculateTimeframe(priority: DIAPPriority): string {
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

  // Load on mount
  useEffect(() => {
    const load = async () => {
      try {
        // Load from localStorage
        const localItems = getLocalItems();
        const localDocs = getLocalDocuments();
        setItems(localItems);
        setDocuments(localDocs);

        // Sync from cloud if available (with timeout to handle latency)
        if (isSupabaseEnabled() && supabase) {
          const session = getSession();
          if (session?.session_id) {
            // Add timeout to prevent hanging on slow connections
            const timeoutPromise = <T,>() => new Promise<{ data: T | null; error: Error }>((resolve) => {
              setTimeout(() => resolve({ data: null, error: new Error('Supabase query timeout') }), 10000);
            });

            const itemsQueryPromise = supabase
              .from('diap_items')
              .select('*')
              .eq('session_id', session.session_id);

            const { data: cloudItems, error: itemsError } = await Promise.race([itemsQueryPromise, timeoutPromise<any[]>()]);

            // Skip cloud sync if table doesn't exist, timeout, or other error (silently fall back)
            if (itemsError) {
              console.log('[useDIAPManagement] Items cloud sync skipped:', itemsError.message);
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

            const docsQueryPromise = supabase
              .from('diap_documents')
              .select('*')
              .eq('session_id', session.session_id);

            const { data: cloudDocs, error: docsError } = await Promise.race([docsQueryPromise, timeoutPromise<any[]>()]);

            // Skip cloud sync if table doesn't exist, timeout, or other error (silently fall back)
            if (docsError) {
              console.log('[useDIAPManagement] Docs cloud sync skipped:', docsError.message);
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
          if (statusValue.includes('progress') || statusValue.includes('ongoing')) {
            status = 'in-progress';
          } else if (statusValue.includes('complete') || statusValue.includes('done')) {
            status = 'completed';
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
          importSource: 'audit',
          impactStatement,
          complianceLevel: question.complianceLevel,
          complianceRef: question.complianceRef,
          createdAt: now,
          updatedAt: now,
        };

        newItems.push(item);
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
  return validCategories.includes(value);
}

// Helper: Validate status
function isValidStatus(value: string): boolean {
  const validStatuses = ['not-started', 'in-progress', 'completed', 'on-hold', 'cancelled'];
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
function generateObjective(question: any, answer: string, moduleCode?: string): string {
  const lower = question.text.toLowerCase();

  // Module-group outcome themes
  const code = moduleCode || '';
  if (code.startsWith('1.')) {
    // Before Arrival
    if (lower.includes('transport')) return 'Build visitor confidence by providing pre-visit accessible transport information';
    if (lower.includes('parking')) return 'Enable independent arrival by providing clear accessible parking information';
    if (lower.includes('booking') || lower.includes('reservation') || lower.includes('ticketing')) return 'Ensure all customers can book and plan their visit independently';
    if (lower.includes('website') || lower.includes('online')) return 'Ensure your online presence is accessible to all potential visitors';
    if (lower.includes('video') || lower.includes('audio') || lower.includes('caption') || lower.includes('subtitle')) return 'Ensure video and audio content is accessible to people with hearing or vision disabilities';
    if (lower.includes('social media') || lower.includes('alt text') || lower.includes('image description')) return 'Ensure social media content reaches and is usable by all audiences';
    if (lower.includes('marketing') || lower.includes('representation')) return 'Ensure marketing materials reflect and welcome diverse audiences';
    if (lower.includes('language') || lower.includes('plain') || lower.includes('easy read')) return 'Ensure communications are clear and understandable for all audiences';
    if (lower.includes('auslan') || lower.includes('sign language') || lower.includes('interpreter')) return 'Provide communication options for Deaf and hard of hearing visitors';
    return 'Enable all visitors to plan and prepare for their visit with confidence';
  }
  if (code.startsWith('2.')) {
    // Getting In
    if (lower.includes('entrance') || lower.includes('entry') || lower.includes('door')) return 'Ensure all visitors can enter the premises independently and with dignity';
    if (lower.includes('ramp') || lower.includes('step') || lower.includes('stair') || lower.includes('level')) return 'Remove physical barriers to entry for people with mobility disabilities';
    if (lower.includes('path') || lower.includes('aisle') || lower.includes('route')) return 'Ensure all paths and aisles are navigable for wheelchair visitors and people with mobility aids';
    if (lower.includes('queue') || lower.includes('wait') || lower.includes('busy')) return 'Reduce barriers for people who cannot stand in queues or manage busy environments';
    if (lower.includes('parking') || lower.includes('drop-off')) return 'Ensure accessible arrival options for people with mobility disabilities';
    return 'Remove barriers to entry and ensure all visitors can access the premises';
  }
  if (code.startsWith('3.')) {
    // During Visit
    if (lower.includes('toilet') || lower.includes('bathroom') || lower.includes('amenit')) return 'Ensure toilet and amenity facilities are accessible and meet visitor needs';
    if (lower.includes('seating') || lower.includes('chair') || lower.includes('furniture')) return 'Provide comfortable and accessible seating and furniture options';
    if (lower.includes('lighting') || lower.includes('glare')) return 'Create a comfortable visual environment for all visitors';
    if (lower.includes('noise') || lower.includes('sound') || lower.includes('acoustic') || lower.includes('sensory')) return 'Create a comfortable sensory environment for visitors with sensory sensitivities';
    if (lower.includes('sign') || lower.includes('wayfinding') || lower.includes('direction')) return 'Help all visitors navigate the space confidently and independently';
    if (lower.includes('menu') || lower.includes('printed') || lower.includes('brochure')) return 'Ensure printed materials are accessible to people with vision or cognitive disabilities';
    if (lower.includes('hearing loop') || lower.includes('assistive listening')) return 'Ensure people with hearing disabilities can participate fully';
    if (lower.includes('accommodation') || lower.includes('room') || lower.includes('bed')) return 'Provide accessible accommodation that meets diverse guest needs';
    if (lower.includes('retail') || lower.includes('shopping') || lower.includes('checkout')) return 'Ensure all customers can browse, select, and purchase independently';
    if (lower.includes('activity') || lower.includes('experience') || lower.includes('recreation')) return 'Enable all visitors to participate fully in activities and experiences';
    return 'Ensure all visitors can participate comfortably during their visit';
  }
  if (code.startsWith('4.')) {
    // Service & Support
    if (lower.includes('staff') && (lower.includes('train') || lower.includes('aware') || lower.includes('confiden'))) return 'Build staff confidence and capability in supporting customers with disability';
    if (lower.includes('feedback') || lower.includes('complaint') || lower.includes('review')) return 'Ensure customers with disability can easily provide feedback';
    if (lower.includes('safety') || lower.includes('emergency') || lower.includes('evacuation')) return 'Ensure safety and emergency procedures are inclusive of people with disability';
    if (lower.includes('companion') || lower.includes('carer') || lower.includes('support person')) return 'Ensure companion and support person needs are accommodated';
    if (lower.includes('service') || lower.includes('assistance')) return 'Deliver inclusive and responsive customer service';
    return 'Ensure service and support is inclusive and responsive';
  }
  if (code.startsWith('5.')) {
    // Organisation
    if (lower.includes('policy') || lower.includes('procedure')) return 'Embed accessibility into organisational policies and procedures';
    if (lower.includes('employ') || lower.includes('recruit') || lower.includes('workplace')) return 'Create an inclusive workplace for employees with disability';
    if (lower.includes('procurement') || lower.includes('purchasing') || lower.includes('supplier')) return 'Ensure procurement processes consider accessibility requirements';
    if (lower.includes('train') || lower.includes('awareness')) return 'Build organisational capacity through accessibility training';
    if (lower.includes('review') || lower.includes('audit') || lower.includes('improvement') || lower.includes('report')) return 'Drive continuous improvement in accessibility outcomes';
    return 'Strengthen organisational commitment to disability inclusion';
  }
  if (code.startsWith('6.')) {
    // Events
    if (lower.includes('venue') || lower.includes('location') || lower.includes('space')) return 'Ensure event venues are physically accessible';
    if (lower.includes('registration') || lower.includes('booking') || lower.includes('sign up')) return 'Ensure event registration is accessible and captures access needs';
    if (lower.includes('communication') || lower.includes('promotion') || lower.includes('information')) return 'Ensure event communications are accessible to all audiences';
    return 'Deliver events that are inclusive and accessible to all participants';
  }

  // Generic fallbacks by topic
  if (lower.includes('safe') || lower.includes('hazard') || lower.includes('emergency')) return 'Ensure safety measures are inclusive of people with disability';
  if (lower.includes('staff') || lower.includes('train')) return 'Build staff capability in disability inclusion';
  if (lower.includes('sign') || lower.includes('wayfind')) return 'Ensure all visitors can navigate the space independently';
  if (lower.includes('website') || lower.includes('digital') || lower.includes('online')) return 'Ensure digital presence is accessible to all visitors';

  return 'Improve accessibility and inclusion in this area';
}

// Helper: Generate multi-step action text for DIAP items
function generateDIAPActions(question: any, answer: string): string {
  const primaryAction = getDIAPActionText(question, answer);
  const lower = question.text.toLowerCase();

  // Build supporting actions based on topic
  const supportingActions: string[] = [];

  // Staff-related actions
  if (lower.includes('staff') || lower.includes('customer') || lower.includes('service') || lower.includes('greeting')) {
    supportingActions.push('Train relevant staff on requirements and procedures');
  } else {
    supportingActions.push('Brief relevant staff on changes and expectations');
  }

  // Policy/review actions
  if (lower.includes('policy') || lower.includes('procedure') || lower.includes('process')) {
    supportingActions.push('Schedule policy review every 12 months');
  } else if (lower.includes('website') || lower.includes('digital') || lower.includes('online') || lower.includes('social media')) {
    supportingActions.push('Schedule regular accessibility audits of digital content');
  } else if (lower.includes('sign') || lower.includes('material') || lower.includes('print') || lower.includes('menu') || lower.includes('brochure')) {
    supportingActions.push('Create process to review materials every 6 months');
  } else {
    supportingActions.push('Document the change and schedule review in 6 months');
  }

  // Format as numbered steps
  const steps = [primaryAction, ...supportingActions];
  return steps.map((s, i) => `${i + 1}. ${s}`).join('\n');
}
