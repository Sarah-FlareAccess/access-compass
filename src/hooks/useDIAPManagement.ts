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
import { deleteRecord, fetchOrgRecords, syncOrgRecord, resolveByTimestamp } from '../utils/cloudSync';
import { computeFileHash, findEvidenceByHash, linkExistingEvidence, promoteToEvidenceFile, type ExistingEvidenceMatch } from '../utils/evidenceStorage';
import { useAuthSafe } from '../contexts/AuthContext';
import { useActiveSiteId } from './useSites';
import { calculateQuestionPriority } from '../utils/priorityCalculation';
import { logActivityStandalone } from './useActivityLog';
import { MODULE_TO_DIAP_MAPPING, DIAP_SECTIONS } from '../data/diapMapping';
import type { DIAPComment } from '../types/activity';
import { getModuleById, getQuestionsForMode } from '../data/accessModules';
import { generateActionText } from '../components/questions/QuestionFlow';
import { selectDiapContent } from '../utils/diapContent';
import { DIAP_QUESTION_CONTENT } from '../data/diapQuestionContent';
import { generateModuleSummary } from '../utils/generateModuleSummary';

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

  // Site scoping (multi-site orgs). null / undefined = organisation-wide.
  // Stamped with the active site when the item is created or generated.
  siteId?: string | null;

  // Custom board column (Asana-style section) this action sits in. null =
  // Unassigned. Value is a column id from organisations.diap_board_columns.
  boardColumn?: string | null;

  // Per-item statutory-framework domain override. When set (to a domain id of
  // the org's jurisdiction framework, e.g. 'VIC-D'), this action is pinned to
  // that outcome domain on the DAP outcomes board and in the framework report,
  // overriding the derived module->domain mapping. null / undefined = derived.
  // Legacy single-value field; superseded by frameworkDomains (kept for reads).
  frameworkDomain?: string | null;

  // Per-item statutory-framework domain tags. An action can be tagged against
  // multiple outcome domains (pillars) at once, e.g. ['VIC-B','VIC-C']. When
  // non-empty this overrides both the derived mapping and the legacy single
  // frameworkDomain, for the board and the framework report. Empty/undefined
  // = fall back to frameworkDomain, then the derived mapping.
  frameworkDomains?: string[] | null;

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
  complianceLevel?: 'mandatory' | 'best-practice' | 'wcag-aa' | 'dda-compliant';
  complianceRef?: string;

  // Details
  impactStatement?: string;
  dependencies?: string[];
  resources?: string[];
  budgetEstimate?: string;
  notes?: string;
  successIndicators?: string; // How success will be measured
  // Set once a user manually edits the action or success indicators. Content
  // refresh migrations skip these so a user's own wording is never overwritten.
  contentEdited?: boolean;

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
  storagePath?: string;
  bucket?: string;
  dataUrl?: string;
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

  // Normalise legacy status values on every read (idempotent). 'completed'
  // predates 'achieved'; 'planned' predates the current vocabulary and has no
  // label/board column, so it surfaces as a raw grey pill. The cloud-row path
  // (mapCloudRowToItem) already maps 'planned' -> 'not-started'; do the same for
  // items that only ever lived in localStorage. Not gated behind a one-time flag
  // so any stragglers are always caught, then persisted if anything changed.
  {
    let statusChanged = false;
    for (const item of items) {
      const s = item.status as string;
      if (s === 'completed') { (item as unknown as Record<string, unknown>).status = 'achieved'; statusChanged = true; }
      else if (s === 'planned') { (item as unknown as Record<string, unknown>).status = 'not-started'; statusChanged = true; }
    }
    if (statusChanged) {
      localStorage.setItem(DIAP_ITEMS_KEY, JSON.stringify(items));
    }
    localStorage.setItem('diap_status_migration_v1', 'done');
  }

  // One-time migration: fix timeframes, priorities, categories and complianceLevel
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
                  item.action = generateDIAPActions(question, answer, moduleCode);
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

  // One-time migration v7: regenerate action steps and success indicators for
  // auto-generated items using the module-domain content model. Fixes the
  // cross-domain topic mismatches and gives every audit item a clean 3-step
  // action. Only touches audit-source items; manual/CSV/PDF imports are left
  // as the user entered them.
  if (!localStorage.getItem('diap_content_v59')) {
    let v7Changed = false;
    for (const item of items) {
      // Auto-generated items only: importSource 'audit' or unset. Never touch
      // manual, CSV or PDF imports or items a user has edited.
      if (item.contentEdited) continue;
      if (!item.moduleSource) continue;
      if (item.importSource && item.importSource !== 'audit') continue;
      const moduleCode = extractModuleCode(item.moduleSource);
      if (!moduleCode) continue;
      const mod = getModuleById(moduleCode);
      const baseQuestionId = item.questionSource?.replace(/-(media|url)-\d+$/, '') || '';
      const question = mod
        ? getQuestionsForMode(mod, 'deep-dive').find(q => q.id === baseQuestionId || q.id === item.questionSource)
        : undefined;
      if (question) {
        item.action = generateDIAPActions(question, item.sourceAnswer || 'no', moduleCode);
        item.successIndicators = generateSuccessIndicator(question, moduleCode);
        v7Changed = true;
      }
    }
    localStorage.setItem('diap_content_v59', 'done');
    if (v7Changed) {
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
  try {
    localStorage.setItem(DIAP_ITEMS_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn('saveLocalItems: localStorage write failed (likely quota); cloud sync still active', err);
  }
}

function getLocalDocuments(): DIAPDocument[] {
  const data = localStorage.getItem(DIAP_DOCUMENTS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveLocalDocuments(docs: DIAPDocument[]) {
  try {
    const safeDocs = docs.map(d =>
      d.storagePath?.startsWith('data:')
        ? { ...d, storagePath: '' }
        : d
    );
    localStorage.setItem(DIAP_DOCUMENTS_KEY, JSON.stringify(safeDocs));
  } catch (err) {
    console.warn('saveLocalDocuments: localStorage write failed (likely quota); cloud sync still active', err);
  }
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
  generateFromResponses: (responses: any[], questions: any[], moduleName: string, overrideSiteId?: string | null) => number;

  // Document operations
  uploadDocument: (file: File, linkedItemIds?: string[]) => Promise<DIAPDocument | null>;
  deleteDocument: (id: string) => Promise<void>;
  linkDocumentToItem: (documentId: string, itemId: string) => void;

  // Attachments
  addAttachment: (itemId: string, file: File) => Promise<void>;
  attachExistingEvidence: (itemId: string, existing: ExistingEvidenceMatch) => Promise<void>;
  removeAttachment: (itemId: string, attachmentId: string) => Promise<void>;

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
  complianceLevel?: 'mandatory' | 'best-practice' | 'wcag-aa' | 'dda-compliant';
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

// Comments are stored in Supabase as a JSON string. Parse defensively.
function parseCloudComments(raw: unknown): DIAPComment[] | undefined {
  if (!raw) return undefined;
  if (Array.isArray(raw)) return raw as DIAPComment[];
  try {
    return JSON.parse(raw as string) as DIAPComment[];
  } catch {
    return undefined;
  }
}

// Map a diap_items cloud row to a DIAPItem. Covers every field the write path
// (syncItemToCloud) sends, so cross-device merges never silently drop fields
// like board column, responsible person, timeframe, due date, budget or sort
// order. Fields not stored in the cloud (frameworkDomains, sourceAnswer,
// compliance*, attachments) are absent here so a spread over the local item
// preserves them.
function mapCloudRowToItem(row: Record<string, unknown>): DIAPItem {
  return {
    id: row.id as string,
    sessionId: row.session_id as string,
    siteId: (row.site_id as string | null) ?? null,
    boardColumn: (row.board_column as string | null) ?? null,
    frameworkDomain: (row.framework_domain as string | null) ?? null,
    frameworkDomains: (row.framework_domains as string[] | null) ?? null,
    sourceAnswer: (row.source_answer as string | null) ?? undefined,
    objective: row.objective as string,
    action: row.action as string,
    category: (row.category as DIAPCategory) || 'physical-access',
    priority: (row.priority as DIAPPriority) || 'medium',
    timeframe: (row.timeframe as string) || '',
    dueDate: (row.due_date as string | null) ?? undefined,
    responsibleRole: (row.responsible_role as string | null) ?? undefined,
    responsibleTeam: (row.responsible_team as string | null) ?? undefined,
    // 'planned' is a legacy status value that predates the current vocabulary;
    // normalise it (and any empty value) to 'not-started' so labels, board
    // columns, filters and the exported PDF stay consistent.
    status: (row.status === 'planned' ? 'not-started' : (row.status as DIAPStatus)) || 'not-started',
    moduleSource: (row.module_source as string | null) ?? undefined,
    questionSource: (row.question_source as string | null) ?? undefined,
    impactStatement: (row.impact_statement as string | null) ?? undefined,
    dependencies: (row.dependencies as string[]) || [],
    resources: (row.resources as string[]) || [],
    budgetEstimate: (row.budget_estimate as string | null) ?? undefined,
    notes: (row.notes as string | null) ?? undefined,
    successIndicators: (row.success_indicators as string | null) ?? undefined,
    contentEdited: (row.content_edited as boolean) ?? false,
    comments: parseCloudComments(row.comments),
    sortOrder: (row.sort_order as number | null) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    completedAt: (row.completed_at as string | null) ?? undefined,
    importSource: (row.import_source as DIAPItem['importSource']) || 'audit',
  };
}

export function useDIAPManagement(): UseDIAPManagementReturn {
  const [items, setItems] = useState<DIAPItem[]>([]);
  const [documents, setDocuments] = useState<DIAPDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId, organisationId } = useAuthSafe();
  const [activeSiteId] = useActiveSiteId();
  const userIdRef = useRef(userId);
  const orgIdRef = useRef(organisationId);
  const activeSiteIdRef = useRef<string | null>(activeSiteId);
  const itemsRef = useRef<DIAPItem[]>([]);

  useEffect(() => {
    userIdRef.current = userId;
    orgIdRef.current = organisationId;
    activeSiteIdRef.current = activeSiteId;
  }, [userId, organisationId, activeSiteId]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // Background sync a single DIAP item to Supabase.
  // Org-scoped per migration 023: DIAP items are visible to all org members
  // and last_modified_by_user_id captures who most recently edited.
  // Anonymous users (no org) stay localStorage-only.
  const syncItemToCloud = useCallback((item: DIAPItem) => {
    if (!userIdRef.current || !orgIdRef.current) return;
    syncOrgRecord('diap_items', {
      id: item.id,
      session_id: item.sessionId,
      site_id: item.siteId ?? null,
      board_column: item.boardColumn ?? null,
      framework_domain: item.frameworkDomain ?? null,
      framework_domains: item.frameworkDomains ?? null,
      source_answer: item.sourceAnswer ?? null,
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
      content_edited: item.contentEdited ?? false,
      due_date: item.dueDate || null,
      comments: item.comments ? JSON.stringify(item.comments) : null,
      sort_order: item.sortOrder ?? null,
      created_at: item.createdAt,
      updated_at: item.updatedAt,
      completed_at: item.completedAt || null,
    }, orgIdRef.current, userIdRef.current, item.siteId ?? null).catch(() => {});
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

        // If user is in an org, fetch org-scoped DIAP items.
        // Anonymous users / no-org users stay localStorage-only.
        if (isSupabaseEnabled() && userId && organisationId) {
          const { data: cloudItems, error: itemsError } = await fetchOrgRecords(
            'diap_items', organisationId
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
                merged.push(mapCloudRowToItem(row));
                hasChanges = true;
              } else if (resolveByTimestamp(localUpdatedAt, cloudUpdatedAt) === 'cloud') {
                // Cloud is newer, update local. Apply every synced field (spread
                // preserves local-only fields the cloud does not store, e.g.
                // attachments and framework domains).
                const idx = merged.findIndex(i => i.id === id);
                if (idx >= 0) {
                  merged[idx] = {
                    ...merged[idx],
                    ...mapCloudRowToItem(row),
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

          // Fetch evidence_files for DIAP items so attachments persist across
          // devices. Org-scoped per migration 023: any active member of the
          // org can see all DIAP-linked evidence.
          if (supabase) {
            try {
              const { data: evRows } = await supabase
                .from('evidence_files')
                .select('id, diap_item_id, linked_diap_item_ids, file_name, file_type, file_size, storage_path, bucket_name, created_at')
                .eq('organisation_id', organisationId);
              if (evRows && evRows.length > 0) {
                const byItem = new Map<string, DIAPAttachment[]>();
                for (const row of evRows as Record<string, unknown>[]) {
                  const linkedIds = new Set<string>();
                  const primary = row.diap_item_id as string | null;
                  if (primary) linkedIds.add(primary);
                  const linkedArr = (row.linked_diap_item_ids as string[] | null) || [];
                  for (const id of linkedArr) linkedIds.add(id);
                  if (linkedIds.size === 0) continue;
                  for (const itemId of linkedIds) {
                    if (!byItem.has(itemId)) byItem.set(itemId, []);
                    byItem.get(itemId)!.push({
                      id: row.id as string,
                      name: row.file_name as string,
                      type: row.file_type as string,
                      size: (row.file_size as number) || 0,
                      storagePath: row.storage_path as string,
                      bucket: (row.bucket_name as string) || 'evidence-files',
                      addedAt: row.created_at as string,
                    });
                  }
                }
                setItems(prev => {
                  const updated = prev.map(it => {
                    const cloudAtts = byItem.get(it.id);
                    if (!cloudAtts) return it;
                    const localOnly = (it.attachments || []).filter(a => !a.storagePath);
                    return { ...it, attachments: [...cloudAtts, ...localOnly] };
                  });
                  saveLocalItems(updated);
                  return updated;
                });
              }
            } catch (err) {
              console.log('[useDIAPManagement] evidence_files fetch skipped:', err);
            }
          }

          // Also fetch cloud documents (org-scoped)
          const { data: cloudDocs } = await fetchOrgRecords('diap_documents', organisationId);
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
      siteId: activeSiteIdRef.current ?? null,
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
      const trackedFields: (keyof DIAPItem)[] = [
        'objective', 'action', 'category', 'priority', 'timeframe', 'dueDate',
        'notes', 'successIndicators', 'budgetEstimate', 'impactStatement',
      ];
      const changedFields: string[] = [];
      for (const f of trackedFields) {
        if (updates[f] !== undefined && updates[f] !== existingItem[f]) changedFields.push(f);
      }
      if (changedFields.length > 0) {
        logActivityStandalone('diap-item-updated', {
          diapItemId: existingItem.id,
          diapItemObjective: existingItem.objective,
          changedFields,
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

          // Once a user changes the action or indicators, protect their wording
          // from future content-refresh migrations.
          const editedContent =
            (updates.action !== undefined && updates.action !== item.action) ||
            (updates.successIndicators !== undefined && updates.successIndicators !== item.successIndicators);
          if (item.contentEdited || editedContent) {
            newItem.contentEdited = true;
          }

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

    if (userIdRef.current) {
      deleteRecord('diap_items', { id }, userIdRef.current).catch(() => {});
    }
  }, []);

  // Create items from module responses
  const createItemsFromResponses = useCallback((responses: ResponseForDIAP[]): DIAPItem[] => {
    const newItems: DIAPItem[] = [];
    const session = getSession();
    const now = new Date().toISOString();

    for (const response of responses) {
      const priority = calculatePriority(response);
      const timeframe = calculateTimeframe(priority);

      const genQuestion = { id: response.questionId, text: response.questionText };
      const item: DIAPItem = {
        id: uuidv4(),
        sessionId: session?.session_id || '',
        objective: generateObjective(genQuestion, response.answer, response.moduleCode),
        action: generateDIAPActions(genQuestion, response.answer, response.moduleCode),
        category: response.category || 'operations-policy-procedure',
        priority,
        timeframe,
        status: 'not-started',
        moduleSource: response.moduleCode,
        questionSource: response.questionId,
        sourceAnswer: response.answer,
        importSource: 'audit',
        successIndicators: generateSuccessIndicator(genQuestion, response.moduleCode),
        impactStatement: response.safetyRelated
          ? 'This is a safety-related item requiring immediate attention.'
          : undefined,
        createdAt: now,
        updatedAt: now,
      };

      newItems.push(item);
    }

    for (const it of newItems) it.siteId = activeSiteIdRef.current ?? null;
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

      if (userIdRef.current && orgIdRef.current) {
        syncOrgRecord('diap_documents', {
          id: doc.id,
          session_id: doc.sessionId,
          filename: doc.filename,
          file_type: doc.fileType,
          file_size: doc.fileSize || null,
          storage_path: doc.storagePath,
          linked_item_ids: doc.linkedItemIds,
          description: doc.description || null,
          uploaded_at: doc.uploadedAt,
        }, orgIdRef.current, userIdRef.current).catch(() => {});
      }

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

      if (userIdRef.current) {
        deleteRecord('diap_documents', { id }, userIdRef.current).catch(() => {});
      }
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
  const generateFromResponses = useCallback((responses: any[], questions: any[], moduleName: string, overrideSiteId?: string | null) => {
    const session = getSession();
    const now = new Date().toISOString();
    // overrideSiteId lets the all-venue backfill generate a specific venue's
    // actions without it being the active site. Undefined = use the active site.
    const site = overrideSiteId !== undefined ? overrideSiteId : (activeSiteIdRef.current ?? null);
    const newItems: DIAPItem[] = [];

    // Get existing items to avoid duplicates. Scoped to the active site so the
    // same question assessed at different venues produces separate actions.
    const existingItems = getLocalItems();
    const existingQuestionSources = new Set(
      existingItems.filter(i => (i.siteId ?? null) === site).map(i => i.questionSource).filter(Boolean)
    );

    // Reuse the SAME summary logic the report uses (generateModuleSummary), so
    // EVERY answer type - yes/no, partially, single-select, multi-select, media,
    // url, measurement - flows into the DIAP. No responses are dropped.
    const summary = generateModuleSummary(responses as any, questions as any);
    const moduleCodeForObj = moduleName.match(/(\d+\.\d+)/)?.[1] || '';
    const added = new Set<string>();
    const respByQ = new Map<string, any>(responses.map((r: any) => [r.questionId, r]));

    const pushItem = (
      questionId: string,
      questionText: string,
      priority: DIAPPriority,
      impactStatement: string | undefined,
    ) => {
      if (!questionId || existingQuestionSources.has(questionId) || added.has(questionId)) return;
      added.add(questionId);
      const q: any = questions.find((qq: any) => qq.id === questionId) || { text: questionText };
      // Every answered question that surfaces a gap contributes to the DIAP and
      // is analysed individually (via its own curated action steps + success
      // indicators). Generation is already gap-driven — only 'no'/'partially'/
      // 'unable-to-check'/incomplete multi-select answers reach here — so nothing
      // is manufactured for things already done. (Previously diagnostic/scoping
      // questions were filtered out here via isDiagnosticQuestion; that was
      // reversed 2026-07-13 so they too contribute, now that title-wording is
      // handled cleanly.)
      const resp: any = respByQ.get(questionId);
      const sourceAnswer = resp?.answer
        || (resp?.multiSelectValues?.length ? resp.multiSelectValues.join(',') : undefined);
      newItems.push({
        id: uuidv4(),
        sessionId: session?.session_id || '',
        objective: generateObjective(q, sourceAnswer || 'no', moduleCodeForObj),
        action: generateDIAPActions(q, sourceAnswer || 'no', moduleCodeForObj),
        category: mapModuleToCategory(moduleName),
        priority,
        status: 'not-started',
        timeframe: '',
        moduleSource: moduleName,
        questionSource: questionId,
        sourceAnswer,
        importSource: 'audit',
        impactStatement,
        successIndicators: generateSuccessIndicator(q, moduleCodeForObj),
        complianceLevel: q.complianceLevel,
        complianceRef: q.complianceRef,
        createdAt: now,
        updatedAt: now,
      });
    };

    for (const pa of summary.priorityActions) {
      pushItem(pa.questionId, pa.questionText, (pa.priority as DIAPPriority) || 'medium', pa.impactStatement);
    }
    for (const ae of summary.areasToExplore) {
      if (typeof ae === 'string') continue;
      pushItem(ae.questionId, ae.questionText, 'low', 'This area needs further investigation to confirm current status.');
    }

    if (newItems.length > 0) {
      for (const it of newItems) it.siteId = site;
      setItems(prev => {
        const updated = [...prev, ...newItems];
        saveLocalItems(updated);
        return updated;
      });
      syncItemsBatchToCloud(newItems);
    }

    return newItems.length;
  }, [syncItemsBatchToCloud]);

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

  // Sync to cloud (org-scoped per migration 023)
  const syncToCloud = useCallback(async () => {
    if (!isSupabaseEnabled() || !userIdRef.current || !orgIdRef.current) return;

    // Sync all items
    syncItemsBatchToCloud(items);

    // Sync all documents
    const orgId = orgIdRef.current;
    const userIdValue = userIdRef.current;
    for (const doc of documents) {
      syncOrgRecord('diap_documents', {
        id: doc.id,
        session_id: doc.sessionId,
        filename: doc.filename,
        file_type: doc.fileType,
        file_size: doc.fileSize || null,
        storage_path: doc.storagePath,
        linked_item_ids: doc.linkedItemIds,
        description: doc.description || null,
        uploaded_at: doc.uploadedAt,
      }, orgId, userIdValue).catch(() => {});
    }
  }, [items, documents, syncItemsBatchToCloud]);

  const addAttachment = useCallback(async (itemId: string, file: File) => {
    const session = getSession();
    const userId = userIdRef.current;
    const orgId = orgIdRef.current;
    const item = itemsRef.current.find(i => i.id === itemId);

    let storagePath: string | undefined;
    let dataUrl: string | undefined;
    let evidenceFileId: string | undefined;
    let dedupedExistingId: string | null = null;

    if (userId && session?.session_id && isSupabaseEnabled() && supabase) {
      const hash = await computeFileHash(file);
      if (hash) {
        const existing = await findEvidenceByHash(userId, hash);
        if (existing) {
          await linkExistingEvidence(existing.id, { diapItemId: itemId });
          dedupedExistingId = existing.id;
          evidenceFileId = existing.id;
          storagePath = existing.storagePath;
        }
      }

      if (!dedupedExistingId) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const path = `${userId}/${session.session_id}/diap-${itemId}/${Date.now()}-${safeName}`;
        const { error: uploadError } = await supabase.storage
          .from('evidence-files')
          .upload(path, file, { contentType: file.type, upsert: true });
        if (!uploadError) {
          storagePath = path;
          evidenceFileId = crypto.randomUUID();
          const { error: insertError } = await supabase.from('evidence_files').insert({
            id: evidenceFileId,
            user_id: userId,
            organisation_id: orgId || null,
            session_id: session.session_id,
            module_id: item?.moduleSource || null,
            question_id: item?.questionSource || null,
            diap_item_id: itemId,
            linked_diap_item_ids: [itemId],
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
            storage_path: path,
            mime_type: file.type,
            file_hash: hash || null,
          });
          if (insertError) {
            console.warn('evidence_files insert failed:', insertError);
          }
        } else {
          console.warn('storage upload failed, falling back to base64:', uploadError);
        }
      }
    }

    if (!storagePath) {
      dataUrl = await fileToBase64(file);
    }

    const attachment: DIAPAttachment = {
      id: evidenceFileId || uuidv4(),
      name: file.name,
      type: file.type,
      size: file.size,
      storagePath,
      dataUrl,
      addedAt: new Date().toISOString(),
    };

    let itemObjective: string | undefined;
    setItems(prev => {
      const updated = prev.map(it => {
        if (it.id === itemId) {
          itemObjective = it.objective;
          return { ...it, attachments: [...(it.attachments || []), attachment], updatedAt: new Date().toISOString() };
        }
        return it;
      });
      saveLocalItems(updated);
      return updated;
    });

    logActivityStandalone('diap-item-updated', {
      diapItemId: itemId,
      diapItemObjective: itemObjective,
      changedFields: ['evidence-added'],
      attachmentName: file.name,
    }, userId || undefined);
  }, []);

  const attachExistingEvidence = useCallback(async (
    itemId: string,
    existing: ExistingEvidenceMatch
  ) => {
    const userId = userIdRef.current;
    const orgId = orgIdRef.current;
    let resolvedId = existing.id;
    let resolvedBucket = existing.bucket;
    let resolvedPath = existing.storagePath;
    if (userId && isSupabaseEnabled()) {
      const session = getSession();
      const sessionId = session?.session_id || 'no-session';
      const item = itemsRef.current.find(i => i.id === itemId);
      const promoted = await promoteToEvidenceFile(existing, {
        userId,
        organisationId: orgId,
        sessionId,
        diapItemId: itemId,
        moduleId: item?.moduleSource,
        questionId: item?.questionSource,
      });
      if (promoted) {
        resolvedId = promoted.id;
        resolvedBucket = promoted.bucket;
        resolvedPath = promoted.storagePath;
      }
    }
    const isPhoto = existing.fileType === 'photo' || (existing.mimeType?.startsWith('image/') ?? false);
    const attachment: DIAPAttachment = {
      id: resolvedId,
      name: existing.fileName,
      type: isPhoto ? 'image/jpeg' : existing.fileType,
      size: existing.fileSize,
      storagePath: resolvedPath,
      bucket: resolvedBucket,
      addedAt: new Date().toISOString(),
    };
    let itemObjective: string | undefined;
    setItems(prev => {
      const updated = prev.map(it => {
        if (it.id === itemId) {
          itemObjective = it.objective;
          if ((it.attachments || []).some(a => a.id === existing.id)) return it;
          return { ...it, attachments: [...(it.attachments || []), attachment], updatedAt: new Date().toISOString() };
        }
        return it;
      });
      saveLocalItems(updated);
      return updated;
    });
    logActivityStandalone('diap-item-updated', {
      diapItemId: itemId,
      diapItemObjective: itemObjective,
      changedFields: ['evidence-added'],
      attachmentName: existing.fileName,
    }, userId || undefined);
  }, []);

  const removeAttachment = useCallback(async (itemId: string, attachmentId: string) => {
    const item = itemsRef.current.find(i => i.id === itemId);
    const att = item?.attachments?.find(a => a.id === attachmentId);

    if (att?.storagePath && isSupabaseEnabled() && supabase) {
      try {
        await supabase.storage.from('evidence-files').remove([att.storagePath]);
      } catch (err) {
        console.warn('storage remove failed:', err);
      }
      try {
        await supabase.from('evidence_files').delete().eq('id', attachmentId);
      } catch (err) {
        console.warn('evidence_files delete failed:', err);
      }
    }

    setItems(prev => {
      const updated = prev.map(it => {
        if (it.id === itemId) {
          return { ...it, attachments: (it.attachments || []).filter(a => a.id !== attachmentId), updatedAt: new Date().toISOString() };
        }
        return it;
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
        const displayName = localStorage.getItem('access_compass_user_display_name');
        if (displayName) return displayName;
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
    if (item) {
      const updatedItem = {
        ...item,
        comments: [...(item.comments || []), comment],
        updatedAt: new Date().toISOString(),
      };
      syncItemToCloud(updatedItem);
    }

    logActivityStandalone('diap-comment-added', {
      diapItemId: itemId,
      diapItemObjective: item?.objective || '',
      commentText: text,
    }, userIdRef.current || undefined);
  }, [items, syncItemToCloud]);

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
    attachExistingEvidence,
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
  cleaned = cleaned.trim();
  // Only drop the leading "1. " when stripping filler left a single step. If a
  // numbered step 2 remains, keep the "1." so the list stays consistently
  // numbered (otherwise the first step shows unnumbered next to 2. and 3.).
  if (!/(^|\n)\s*2\.\s/.test(cleaned)) {
    cleaned = cleaned.replace(/^\s*1\.\s+/, '').trim();
  }
  return cleaned;
}

// Helper: Extract module code from moduleSource string
function extractModuleCode(moduleSource: string): string | undefined {
  const match = moduleSource.match(/(\d+\.\d+)/);
  return match ? match[1] : undefined;
}

// A diagnostic/scoping question gathers context (identifying barriers, current
// state, confidence) rather than describing an accessibility gap to fix. These
// should not become DIAP action items - they read as questions on the plan and
// aren't actionable. Detected by discovery-style lead-ins or structurally as
// multi-selects whose options are all neutral and which carry no prescriptive
// actionText.
const DIAGNOSTIC_QUESTION_PATTERNS: RegExp[] = [
  /^how confident/i,
  /^how easy is it/i,
  /^how well do/i,
  /^where would it be easiest/i,
  /^what types? of .* do you currently/i,
  /^which .* do you currently/i,
  /^what(?:'s| is) (?:currently )?(?:a |your )?(?:barrier|challenge)/i,
  /^where (?:is|are|do you) .*(?:publish|share)/i,
];

export function isDiagnosticQuestion(q: any): boolean {
  if (!q) return false;
  const text = String(q.text || '').trim();
  if (DIAGNOSTIC_QUESTION_PATTERNS.some(re => re.test(text))) return true;
  // Structural: a multi-select with all-neutral options and no prescriptive
  // action is a "tell us about your situation" question, not a gap to fix.
  if (q.type === 'multi-select' && Array.isArray(q.options) && !q.actionText) {
    const allNeutral = q.options.every((o: any) => !o?.sentiment || o.sentiment === 'neutral');
    if (allNeutral) return true;
  }
  return false;
}

// Helper: Generate outcome-focused objective from question topic
// Module-specific objective lookup. Each module maps to a single objective,
// or an object with keyword-based sub-objectives for larger modules.
const MODULE_OBJECTIVES: Record<string, string | { default: string; keywords: { pattern: RegExp; objective: string }[] }> = {
  // 1.x Before Arrival
  '1.1': 'Welcome all visitors with clear pre-visit information to plan their journey',
  '1.2': 'Provide a website that all visitors can use with confidence',
  '1.3': 'Offer booking and ticketing systems that work for all customers',
  '1.4': 'Create social media, video and audio content everyone can enjoy',
  '1.5': 'Communicate in clear, welcoming and inclusive language',
  '1.6': 'Reflect and welcome diverse audiences in marketing materials',
  // 2.x Getting In
  '2.1': 'Provide welcoming arrival, parking and drop-off options for all visitors',
  '2.2': 'Welcome all visitors through accessible, dignified entry points',
  '2.3': 'Provide paths and aisles that all visitors can use comfortably',
  '2.4': 'Create a comfortable queuing and arrival experience for all visitors',
  // 3.x During Visit
  '3.1': {
    default: 'Provide comfortable seating, furniture and layout for all visitors',
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
  '3.10': 'Support all customers to browse, select and purchase independently',
  '3.11': 'Provide outdoor spaces and grounds that all visitors can access and enjoy',
  '3.12': 'Create inclusive playgrounds and play spaces where all children can play together',
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
  '5.3': 'Strengthen organisational capability through accessibility training',
  '5.4': 'Incorporate accessibility into procurement and supplier decisions',
  '5.5': 'Celebrate progress and drive continuous improvement in accessibility',
  '5.6': 'Ensure third-party services and platforms meet your accessibility standards',
  '5.7': 'Design jobs and advertise roles in ways that attract candidates with disability',
  '5.8': 'Run interviews and selection processes that are fair to every candidate',
  '5.9': 'Induct new staff accessibly and embed workplace adjustments from day one',
  '5.10': 'Retain disabled staff and build a culture where disclosure is safe',
  // 6.x Events
  '6.1': 'Plan and promote events that welcome all attendees',
  '6.2': 'Choose and set up venues that all attendees can enjoy',
  '6.3': 'Share event information in formats all attendees can access',
  '6.4': 'Offer sensory access and assistive technology so all attendees can participate',
  '6.5': 'Deliver inclusive, welcoming event operations on the day',
};


function generateSuccessIndicator(question: any, moduleCode?: string): string {
  const perQuestion = question.id ? DIAP_QUESTION_CONTENT[question.id] : undefined;
  if (perQuestion) {
    return perQuestion.indicators.map(s => `• ${s}`).join('\n');
  }
  return selectDiapContent(moduleCode, question.text || '').indicators.join('\n');
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


function generateDIAPActions(question: any, answer: string, moduleCode?: string): string {
  const perQuestion = question.id ? DIAP_QUESTION_CONTENT[question.id] : undefined;
  if (perQuestion) {
    return perQuestion.steps.map((s, i) => `${i + 1}. ${s}`).join('\n');
  }
  const primaryAction = getDIAPActionText(question, answer);
  const { steps } = selectDiapContent(moduleCode, question.text || '');
  return [primaryAction, ...steps].map((s, i) => `${i + 1}. ${s}`).join('\n');
}
