/**
 * DIAP Workspace Page
 *
 * Comprehensive DIAP management with:
 * - 3-tab interface (All, In Progress, Completed)
 * - Document upload and management
 * - Import from CSV and PDF
 * - Export functionality (CSV)
 * - Item status updates and editing
 * - Calendar date picker for due dates
 */

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDIAPManagement } from '../hooks/useDIAPManagement';
import { PRIORITY_LEGEND, PRIORITY_ENCOURAGEMENT } from '../utils/priorityCalculation';
import { FLARE_CONTACT, groupModuleCodesByExpertise } from '../utils/professionalSupportGroups';
import { generateDIAPPdf } from '../utils/diapPdfGenerator';
import { getSession } from '../utils/session';
import { PageFooter } from '../components/PageFooter';
import { useModuleProgress } from '../hooks/useModuleProgress';
import { getModuleById, getQuestionsForMode } from '../data/accessModules';
import { DIAP_SECTIONS as _DIAP_SECTIONS, DIAP_CATEGORIES, getDIAPSectionForModule, groupItemsByCategoryAndObjective, getCustomCategoryNames, setCustomCategoryName, getCategoryDisplayName, getCustomCategories, addCustomCategory, removeCustomCategory, getAllCategories } from '../data/diapMapping';
import type { DIAPItem, DIAPStatus, DIAPPriority, DIAPCategory, CSVImportResult, PDFImportResult, ExcelImportResult } from '../hooks/useDIAPManagement';
import { usePageTitle } from '../hooks/usePageTitle';
import { hasHelpContent, getHelpByQuestionId } from '../data/help';
import { getResourceLink } from '../utils/resourceLinks';
import { PageGuide, type GuideFeature } from '../components/PageGuide';
import { Zap, Upload, Paperclip, Filter, Users as UsersIcon, CalendarDays, Plus } from 'lucide-react';
import '../styles/diap.css';

const DIAP_FEATURES: GuideFeature[] = [
  { icon: Plus, title: 'Add a DIAP item', description: 'Click "Add Item" in the top-right to create a new action item manually.' },
  { icon: Zap, title: 'Generate from responses', description: 'Auto-populate action items from your completed module assessment findings.' },
  { icon: Upload, title: 'Import and export', description: 'Import from CSV, Excel, or PDF. Export as CSV or formatted PDF to share with management.' },
  { icon: Paperclip, title: 'Upload evidence', description: 'Attach photos, quotes, or research to each action item as supporting evidence.' },
  { icon: UsersIcon, title: 'Assign responsibility', description: 'Set a responsible role for each item so ownership is clear.' },
  { icon: CalendarDays, title: 'Set due dates', description: 'Add a due date for accountability. Cards colour-code automatically as deadlines approach.' },
  { icon: Filter, title: 'Filter items', description: 'Filter by status, priority, category, assigned role, or due date. Click a summary card to jump to that section.' },
];

// Filter types are Set-based for multi-select
type ImportResult = CSVImportResult | PDFImportResult | ExcelImportResult;

const DIAP_ROLES_KEY = 'diap_managed_roles';

const ROLE_PRESETS = [
  'Facilities Manager',
  'Operations Manager',
  'HR / People & Culture',
  'IT / Digital Team',
  'Marketing / Communications',
  'Customer Service Manager',
  'WHS / Safety Officer',
  'Senior Leadership',
  'Finance / Procurement',
  'External Consultant',
];

function loadManagedRoles(): string[] {
  try {
    const stored = localStorage.getItem(DIAP_ROLES_KEY);
    if (stored) return JSON.parse(stored) as string[];
  } catch { /* ignore */ }
  return [...ROLE_PRESETS];
}

function saveManagedRoles(roles: string[]) {
  localStorage.setItem(DIAP_ROLES_KEY, JSON.stringify(roles));
}

export default function DIAPWorkspace() {
  usePageTitle('DIAP Workspace');
  const {
    items,
    documents,
    isLoading,
    getStats,
    createItem,
    updateItem,
    deleteItem,
    uploadDocument,
    deleteDocument,
    importFromCSV,
    importFromExcel,
    importFromPDF,
    exportToCSV,
    getCSVTemplate,
    generateFromResponses,
    addAttachment,
    removeAttachment,
    reorderItem,
  } = useDIAPManagement();

  const [filterStatuses, setFilterStatuses] = useState<Set<DIAPStatus>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<DIAPItem | null>(null);
  const [filterCategories, setFilterCategories] = useState<Set<DIAPCategory>>(new Set());
  const [filterPriorities, setFilterPriorities] = useState<Set<DIAPPriority>>(new Set());
  const [filterResponsible, setFilterResponsible] = useState<string>('all');
  const [filterDueDate, setFilterDueDate] = useState<Set<string>>(new Set());
  const [customDateFrom, setCustomDateFrom] = useState('');
  const [customDateTo, setCustomDateTo] = useState('');
  const [showDocuments, setShowDocuments] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const filtersRef = useRef<HTMLDetailsElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<{ count: number; shown: boolean } | null>(null);

  // One-time edit hint - show only on first visit
  const HINT_KEY = 'diap_edit_hint_shown';
  const [showEditHint, setShowEditHint] = useState(() => {
    return !localStorage.getItem(HINT_KEY);
  });

  // Dismiss hint after first interaction
  const dismissHint = useCallback(() => {
    if (showEditHint) {
      setShowEditHint(false);
      localStorage.setItem(HINT_KEY, 'true');
    }
  }, [showEditHint]);

  // Get module progress for evidence layer
  const { progress: moduleProgress } = useModuleProgress([]);

  // Get completed modules as evidence
  const completedModulesEvidence = useMemo(() => {
    return Object.values(moduleProgress)
      .filter(p => p.status === 'completed')
      .map(p => {
        const module = getModuleById(p.moduleId);
        const diapSection = getDIAPSectionForModule(p.moduleId);
        return {
          moduleId: p.moduleId,
          moduleName: module?.name || p.moduleCode,
          moduleCode: p.moduleCode,
          completedAt: p.completedAt,
          completedBy: p.ownership?.completedBy,
          completedByRole: p.ownership?.completedByRole,
          confidenceSnapshot: p.confidenceSnapshot,
          diapSection: diapSection?.name || 'General',
          diapSectionId: diapSection?.id || 'policy-procedure',
          doingWellCount: p.summary?.doingWell?.length || 0,
          actionsCount: p.summary?.priorityActions?.length || 0,
        };
      })
      .sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime());
  }, [moduleProgress]);

  // Detect DIAP items whose source response has changed
  const changedItems = useMemo(() => {
    const changes: Record<string, { oldAnswer: string; newAnswer: string }> = {};
    // Build a lookup of current responses by questionId
    const currentResponses: Record<string, string> = {};
    Object.values(moduleProgress).forEach(mp => {
      if (!mp.responses) return;
      mp.responses.forEach(r => {
        currentResponses[r.questionId] = r.answer || '';
      });
    });
    // Compare against each DIAP item's sourceAnswer
    items.forEach(item => {
      if (!item.questionSource || !item.sourceAnswer) return;
      const current = currentResponses[item.questionSource];
      if (current && current !== item.sourceAnswer) {
        changes[item.id] = { oldAnswer: item.sourceAnswer, newAnswer: current };
      }
    });
    return changes;
  }, [items, moduleProgress]);

  const dismissChange = useCallback((itemId: string) => {
    const change = changedItems[itemId];
    if (change) {
      updateItem(itemId, { sourceAnswer: change.newAnswer });
    }
  }, [changedItems, updateItem]);

  // Collect evidence from completed module responses (photos, documents)
  interface CollectedEvidence {
    id: string;
    type: 'photo' | 'document' | 'media-analysis';
    name: string;
    dataUrl?: string;
    moduleName: string;
    moduleCode: string;
    questionText?: string;
    uploadedAt: string;
  }

  const collectedEvidence = useMemo(() => {
    const evidence: CollectedEvidence[] = [];

    Object.values(moduleProgress).forEach(mp => {
      if (mp.status !== 'completed' || !mp.responses) return;

      const module = getModuleById(mp.moduleId);
      const moduleName = module?.name || mp.moduleCode;
      const moduleCode = mp.moduleCode;
      const questions = module ? getQuestionsForMode(module, 'deep-dive') : [];

      mp.responses.forEach(response => {
        const question = questions.find(q => q.id === response.questionId);
        const questionText = question?.text || response.questionId;

        // Collect evidence files
        if (response.evidence && response.evidence.length > 0) {
          response.evidence.forEach(ev => {
            evidence.push({
              id: ev.id,
              type: ev.type === 'photo' ? 'photo' : 'document',
              name: ev.name,
              dataUrl: ev.dataUrl,
              moduleName,
              moduleCode,
              questionText,
              uploadedAt: ev.uploadedAt,
            });
          });
        }

        // Collect media analysis photos
        if (response.mediaAnalysis?.photoPreviews) {
          response.mediaAnalysis.photoPreviews.forEach((preview, idx) => {
            evidence.push({
              id: `${response.questionId}-photo-${idx}`,
              type: 'media-analysis',
              name: `${response.mediaAnalysis!.analysisType} photo ${idx + 1}`,
              dataUrl: preview,
              moduleName,
              moduleCode,
              questionText,
              uploadedAt: response.mediaAnalysis!.analysisDate || response.timestamp,
            });
          });
        }
      });
    });

    return evidence;
  }, [moduleProgress]);

  // Group collected evidence by module
  const evidenceByModule = useMemo(() => {
    const grouped: Record<string, { moduleName: string; moduleCode: string; items: CollectedEvidence[] }> = {};

    collectedEvidence.forEach(ev => {
      if (!grouped[ev.moduleCode]) {
        grouped[ev.moduleCode] = {
          moduleName: ev.moduleName,
          moduleCode: ev.moduleCode,
          items: [],
        };
      }
      grouped[ev.moduleCode].items.push(ev);
    });

    return Object.values(grouped);
  }, [collectedEvidence]);

  // Track which module folders are expanded
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  const toggleFolder = (moduleCode: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [moduleCode]: !prev[moduleCode],
    }));
  };

  // Track which category groups are expanded (start all collapsed for scanability)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Custom category names
  const [customCategoryNames, setCustomCategoryNames] = useState<Record<string, string>>(getCustomCategoryNames);
  const [editingCategoryName, setEditingCategoryName] = useState<string | null>(null);
  const [editingNameValue, setEditingNameValue] = useState('');
  const categoryNameInputRef = useRef<HTMLInputElement>(null);

  const toggleCategory = (categoryId: string) => {
    if (editingCategoryName) return;
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const startEditingCategoryName = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const displayName = getCategoryDisplayName(categoryId, customCategoryNames);
    setEditingCategoryName(categoryId);
    setEditingNameValue(displayName);
    setTimeout(() => categoryNameInputRef.current?.select(), 0);
  };

  const saveCategoryName = () => {
    if (editingCategoryName && editingNameValue.trim()) {
      setCustomCategoryName(editingCategoryName, editingNameValue.trim());
      setCustomCategoryNames(getCustomCategoryNames());
    }
    setEditingCategoryName(null);
  };

  const cancelEditingCategoryName = () => {
    setEditingCategoryName(null);
  };

  // Custom categories
  const [customCategories, setCustomCategories] = useState(getCustomCategories);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const newCategoryInputRef = useRef<HTMLInputElement>(null);
  const allCategories = useMemo(() => [...DIAP_CATEGORIES, ...customCategories], [customCategories]);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    addCustomCategory(newCategoryName, newCategoryDesc);
    setCustomCategories(getCustomCategories());
    setNewCategoryName('');
    setNewCategoryDesc('');
    setShowAddCategory(false);
  };

  const handleRemoveCategory = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const catItems = items.filter(i => i.category === categoryId);
    if (catItems.length > 0) {
      alert('Move or delete all items in this category before removing it.');
      return;
    }
    removeCustomCategory(categoryId);
    setCustomCategories(getCustomCategories());
  };

  // Managed roles list (persisted in localStorage)
  const [managedRoles, setManagedRoles] = useState<string[]>(loadManagedRoles);
  const [showManageRoles, setShowManageRoles] = useState(false);

  // Ensure any roles used in items are in the managed list
  const responsiblePeople = useMemo(() => {
    const all = new Set(managedRoles);
    items.forEach(item => {
      if (item.responsibleRole?.trim()) all.add(item.responsibleRole.trim());
    });
    return Array.from(all).sort((a, b) => a.localeCompare(b));
  }, [items, managedRoles]);

  const addManagedRole = useCallback((role: string) => {
    const trimmed = role.trim();
    if (!trimmed) return;
    setManagedRoles(prev => {
      if (prev.some(r => r.toLowerCase() === trimmed.toLowerCase())) return prev;
      const next = [...prev, trimmed].sort((a, b) => a.localeCompare(b));
      saveManagedRoles(next);
      return next;
    });
  }, []);

  const renameManagedRole = useCallback((oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || oldName === trimmed) return;
    setManagedRoles(prev => {
      const next = prev.map(r => r === oldName ? trimmed : r);
      const deduped = [...new Set(next)].sort((a, b) => a.localeCompare(b));
      saveManagedRoles(deduped);
      return deduped;
    });
    // Update all items that use the old name
    items.forEach(item => {
      if (item.responsibleRole === oldName) {
        updateItem(item.id, { responsibleRole: trimmed });
      }
    });
  }, [items, updateItem]);

  const deleteManagedRole = useCallback((role: string) => {
    setManagedRoles(prev => {
      const next = prev.filter(r => r !== role);
      saveManagedRoles(next);
      return next;
    });
  }, []);

  const getDueBucket = useCallback((dueDate?: string): string => {
    if (!dueDate) return 'no-date';
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const daysLeft = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return 'overdue';
    if (daysLeft <= 7) return 'this-week';
    if (daysLeft <= 30) return 'this-month';
    return 'later';
  }, []);

  const dueDateCounts = useMemo(() => {
    const counts: Record<string, number> = { overdue: 0, 'this-week': 0, 'this-month': 0, later: 0, 'no-date': 0 };
    for (const item of items) {
      counts[getDueBucket(item.dueDate)]++;
    }
    return counts;
  }, [items, getDueBucket]);

  // Filter items based on tab and filters
  const filteredItems = useMemo(() => {
    let filtered = [...items];

    // Filter by status (multi-select)
    if (filterStatuses.size > 0) {
      filtered = filtered.filter(i => filterStatuses.has(i.status));
    }

    // Filter by category (multi-select)
    if (filterCategories.size > 0) {
      filtered = filtered.filter(i => filterCategories.has(i.category));
    }

    // Filter by priority (multi-select)
    if (filterPriorities.size > 0) {
      filtered = filtered.filter(i => filterPriorities.has(i.priority));
    }

    // Filter by responsible person
    if (filterResponsible !== 'all') {
      filtered = filtered.filter(i => i.responsibleRole === filterResponsible);
    }

    // Filter by due date period
    if (filterDueDate.size > 0) {
      filtered = filtered.filter(i => {
        if (filterDueDate.has('custom')) {
          if (!i.dueDate) return filterDueDate.has('no-date');
          const due = new Date(i.dueDate);
          due.setHours(0, 0, 0, 0);
          const from = customDateFrom ? new Date(customDateFrom) : null;
          const to = customDateTo ? new Date(customDateTo) : null;
          if (from) from.setHours(0, 0, 0, 0);
          if (to) to.setHours(0, 0, 0, 0);
          if (from && to) return due >= from && due <= to;
          if (from) return due >= from;
          if (to) return due <= to;
          return true;
        }
        return filterDueDate.has(getDueBucket(i.dueDate));
      });
    }

    // Sort: use manual sortOrder if set, otherwise group by priority
    const hasManualOrder = filtered.some(i => i.sortOrder !== undefined);
    if (hasManualOrder) {
      filtered.sort((a, b) => (a.sortOrder ?? Infinity) - (b.sortOrder ?? Infinity));
    } else {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      filtered.sort((a, b) =>
        (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2)
      );
    }

    return filtered;
  }, [items, filterStatuses, filterCategories, filterPriorities, filterResponsible, filterDueDate, getDueBucket, customDateFrom, customDateTo]);

  // Group filtered items by category, then by objective within each category
  const itemsByCategory = useMemo(() => {
    return groupItemsByCategoryAndObjective(filteredItems);
  }, [filteredItems]);

  // Get stats
  const stats = getStats();

  // Compute per-category stats for the overview cards
  const categoryStats = useMemo(() => {
    return allCategories.map(cat => {
      const catItems = items.filter(i => i.category === cat.id);
      const total = catItems.length;
      const achieved = catItems.filter(i => i.status === 'achieved').length;
      const ongoing = catItems.filter(i => i.status === 'ongoing').length;
      const inProgress = catItems.filter(i => i.status === 'in-progress').length;
      const high = catItems.filter(i => i.priority === 'high').length;
      const medium = catItems.filter(i => i.priority === 'medium').length;
      const low = catItems.filter(i => i.priority === 'low').length;
      const pct = total > 0 ? Math.round(((achieved + ongoing) / total) * 100) : 0;
      return { ...cat, total, achieved, ongoing, inProgress, high, medium, low, pct };
    });
  }, [items, allCategories]);

  // Extract unique module codes from items for professional support grouping
  const expertiseGroups = useMemo(() => {
    const codes = new Set<string>();
    for (const item of items) {
      if (item.moduleSource) {
        // moduleSource can be "2.1" or "Module 2.1: Name" — extract the code
        const match = item.moduleSource.match(/(\d+\.\d+)/);
        if (match) codes.add(match[1]);
      }
    }
    return groupModuleCodesByExpertise(Array.from(codes));
  }, [items]);

  // Handle status change
  const handleStatusChange = (itemId: string, newStatus: DIAPStatus) => {
    updateItem(itemId, { status: newStatus });
  };

  // Handle export to CSV
  const handleExportCSV = () => {
    const csvContent = exportToCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DIAP-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle export to PDF
  const handleExportPDF = () => {
    const session = getSession();
    const orgName = session?.business_snapshot?.organisation_name || 'Your Organisation';
    generateDIAPPdf({ items, orgName, customCategoryNames });
  };

  // Handle download CSV template
  const handleDownloadTemplate = () => {
    const template = getCSVTemplate();
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'DIAP-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle CSV import
  const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const result = importFromCSV(text);
      setImportResult(result);
    } catch (error) {
      setImportResult({
        success: false,
        imported: 0,
        errors: ['Failed to read CSV file'],
        items: [],
      });
    } finally {
      setIsImporting(false);
      if (csvInputRef.current) csvInputRef.current.value = '';
    }
  };

  // Handle Excel import
  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const result = await importFromExcel(file);
      setImportResult(result);
    } catch (error) {
      setImportResult({
        success: false,
        imported: 0,
        errors: ['Failed to parse Excel file'],
        items: [],
        sheetsProcessed: [],
      });
    } finally {
      setIsImporting(false);
      if (excelInputRef.current) excelInputRef.current.value = '';
    }
  };

  // Handle PDF import
  const handlePDFImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const result = await importFromPDF(file);
      setImportResult(result);
    } catch (error) {
      setImportResult({
        success: false,
        imported: 0,
        errors: ['Failed to parse PDF file'],
        items: [],
      });
    } finally {
      setIsImporting(false);
      if (pdfInputRef.current) pdfInputRef.current.value = '';
    }
  };

  // Handle generating DIAP items from completed assessments
  const handleGenerateFromAssessment = useCallback(() => {
    setIsGenerating(true);
    let totalGenerated = 0;

    try {
      // Get all completed modules
      const completedModules = Object.values(moduleProgress).filter(p => p.status === 'completed');

      completedModules.forEach(moduleData => {
        const module = getModuleById(moduleData.moduleId);
        if (!module || !moduleData.responses) return;

        // Get questions for this module
        const questions = getQuestionsForMode(module, 'deep-dive');

        // Generate DIAP items from responses
        const count = generateFromResponses(
          moduleData.responses,
          questions,
          `${module.code}: ${module.name}`
        );

        totalGenerated += count;
      });

      setGenerationResult({ count: totalGenerated, shown: true });

      // Hide the result message after 5 seconds
      setTimeout(() => {
        setGenerationResult(prev => prev ? { ...prev, shown: false } : null);
      }, 5000);
    } catch (error) {
      console.error('Error generating DIAP items:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [moduleProgress, generateFromResponses]);

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await uploadDocument(file);
    e.target.value = '';
  };

  if (isLoading) {
    return (
      <div className="diap-page">
        <div className="container">
          <div className="loading-state">Loading your DIAP...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="diap-page">
      <div className="container">
        {/* Header */}
        <div className="diap-header">
          <div className="header-content">
            <h1>Disability Inclusion Action Plan</h1>
            <p className="header-subtitle">Management System</p>
          </div>
          <div className="diap-header-actions">
            {!showAddForm && (
              <button className="btn-add-item" onClick={() => setShowAddForm(true)}>
                + Add Item
              </button>
            )}
            <button className="btn-import" onClick={() => setShowImportModal(true)}>
              Import DIAP
            </button>
            <button className="btn-export" onClick={handleExportCSV}>
              Export CSV
            </button>
            <button className="btn-export" onClick={handleExportPDF}>
              Export PDF
            </button>
          </div>
        </div>

        <PageGuide pageId="diap" features={DIAP_FEATURES} />

        {/* Generation Result Notification */}
        {generationResult?.shown && (
          <div className="generation-notification">
            <div className="success-icon">
              {generationResult.count > 0 ? '✓' : 'ℹ'}
            </div>
            <div className="generation-notification-content">
              {generationResult.count > 0 ? (
                <>
                  <h4>Items Generated</h4>
                  <p>Added {generationResult.count} action item{generationResult.count !== 1 ? 's' : ''} from your assessment.</p>
                </>
              ) : (
                <>
                  <h4>Already Up to Date</h4>
                  <p>All assessment findings are already in your DIAP.</p>
                </>
              )}
            </div>
            <button
              className="close-btn"
              onClick={() => setGenerationResult(prev => prev ? { ...prev, shown: false } : null)}
            >
              ×
            </button>
          </div>
        )}

        {/* Generate from Assessment Banner - Show when there are completed modules but no/few items */}
        {completedModulesEvidence.length > 0 && items.length === 0 && (
          <div className="generate-banner">
            <div className="generate-banner-content">
              <h2 className="generate-banner-heading">Generate DIAP from Your Assessment</h2>
              <p>You have {completedModulesEvidence.length} completed module{completedModulesEvidence.length !== 1 ? 's' : ''}. Generate action items based on your assessment findings.</p>
            </div>
            <button
              className="btn-generate"
              onClick={handleGenerateFromAssessment}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <span className="spinner"></span>
                  Generating...
                </>
              ) : (
                'Generate Action Items'
              )}
            </button>
          </div>
        )}

        {/* Manage Roles Modal */}
        {showManageRoles && (
          <ManageRolesModal
            roles={managedRoles}
            items={items}
            onRename={renameManagedRole}
            onDelete={deleteManagedRole}
            onAdd={addManagedRole}
            onClose={() => setShowManageRoles(false)}
          />
        )}

        {/* Import Modal */}
        {showImportModal && (
          <div className="modal-overlay" onClick={() => { setShowImportModal(false); setImportResult(null); }} onKeyDown={(e) => { if (e.key === 'Escape') { setShowImportModal(false); setImportResult(null); } }}>
            <div className="modal-content import-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="diap-import-title">
              <div className="modal-header">
                <h2 id="diap-import-title">Import Existing DIAP</h2>
                <button className="modal-close" onClick={() => { setShowImportModal(false); setImportResult(null); }}>
                  &times;
                </button>
              </div>

              <div className="modal-body">
                {!importResult ? (
                  <>
                    <p className="import-intro">
                      Import your existing Disability Inclusion Action Plan from Excel, CSV, or PDF.
                      Items will be added to your current DIAP.
                    </p>

                    <div className="import-options">
                      {/* Excel Import - Primary Option */}
                      <div className="import-option recommended">
                        <div className="import-option-icon">📗</div>
                        <h3>Import from Excel (Recommended)</h3>
                        <p>Import directly from your existing Excel DIAP spreadsheet (.xlsx files).</p>
                        <div className="import-option-actions">
                          <label className="btn btn-primary">
                            {isImporting ? 'Importing...' : 'Select Excel File'}
                            <input
                              ref={excelInputRef}
                              type="file"
                              accept=".xlsx,.xls"
                              onChange={handleExcelImport}
                              hidden
                              disabled={isImporting}
                            />
                          </label>
                        </div>
                        <p className="import-note">
                          Your spreadsheet should have columns for Action/Task, and optionally: Priority, Status, Due Date, Responsible Person.
                        </p>
                      </div>

                      {/* CSV Import */}
                      <div className="import-option">
                        <div className="import-option-icon">📊</div>
                        <h3>Import from CSV</h3>
                        <p>Import a CSV file exported from Excel or Google Sheets.</p>
                        <div className="import-option-actions">
                          <button
                            className="btn btn-secondary"
                            onClick={handleDownloadTemplate}
                          >
                            Download Template
                          </button>
                          <label className="btn btn-primary">
                            {isImporting ? 'Importing...' : 'Select CSV File'}
                            <input
                              ref={csvInputRef}
                              type="file"
                              accept=".csv"
                              onChange={handleCSVImport}
                              hidden
                              disabled={isImporting}
                            />
                          </label>
                        </div>
                      </div>

                      {/* PDF Import */}
                      <div className="import-option">
                        <div className="import-option-icon">📄</div>
                        <h3>Import from PDF</h3>
                        <p>Extract action items from an existing DIAP PDF document.</p>
                        <div className="import-option-actions">
                          <label className="btn btn-primary">
                            {isImporting ? 'Parsing PDF...' : 'Select PDF File'}
                            <input
                              ref={pdfInputRef}
                              type="file"
                              accept=".pdf"
                              onChange={handlePDFImport}
                              hidden
                              disabled={isImporting}
                            />
                          </label>
                        </div>
                        <p className="import-note">
                          Note: PDF import works best with well-structured documents.
                          You may need to review and adjust imported items.
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="import-result">
                    {importResult.success ? (
                      <>
                        <div className="import-success">
                          <span className="success-icon">✓</span>
                          <h3>Import Successful!</h3>
                          <p>Imported {importResult.imported} item{importResult.imported !== 1 ? 's' : ''} to your DIAP.</p>
                        </div>
                        {importResult.errors.length > 0 && (
                          <div className="import-warnings">
                            <h4>Warnings:</h4>
                            <ul>
                              {importResult.errors.map((err, i) => (
                                <li key={i}>{err}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="import-error">
                        <span className="error-icon">!</span>
                        <h3>Import Failed</h3>
                        <ul>
                          {importResult.errors.map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="import-result-actions">
                      <button
                        className="btn btn-secondary"
                        onClick={() => setImportResult(null)}
                      >
                        Import Another File
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => { setShowImportModal(false); setImportResult(null); }}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <details ref={filtersRef} className="diap-controls-collapsible">
          <summary className="diap-controls-summary">
            Filters
            {(filterStatuses.size > 0 || filterPriorities.size > 0 || filterCategories.size > 0 || filterResponsible !== 'all' || filterDueDate.size > 0) && (
              <span className="filter-active-count">
                {filterStatuses.size + filterPriorities.size + filterCategories.size + (filterResponsible !== 'all' ? 1 : 0) + filterDueDate.size} active
              </span>
            )}
          </summary>
          <div className="diap-filter-panel" role="group" aria-label="Filter DIAP items">
            <div className="filter-group">
              <span className="filter-group-label">Status</span>
              <div className="filter-chips" role="group" aria-label="Filter by status">
                {([
                  ['not-started', 'Not Started'],
                  ['in-progress', 'In Progress'],
                  ['achieved', 'Achieved'],
                  ['ongoing', 'Ongoing'],
                  ['on-hold', 'On Hold'],
                  ['cancelled', 'Cancelled'],
                ] as [DIAPStatus, string][]).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={`filter-chip status-chip ${filterStatuses.has(value) ? 'active' : ''}`}
                    onClick={() => setFilterStatuses(prev => {
                      const next = new Set(prev);
                      next.has(value) ? next.delete(value) : next.add(value);
                      return next;
                    })}
                    aria-pressed={filterStatuses.has(value)}
                  >
                    {label} ({stats.byStatus[value]})
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <span className="filter-group-label">Priority</span>
              <div className="filter-chips" role="group" aria-label="Filter by priority">
                {([
                  ['high', 'High'],
                  ['medium', 'Medium'],
                  ['low', 'Low'],
                ] as [DIAPPriority, string][]).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={`filter-chip priority-chip ${filterPriorities.has(value) ? 'active' : ''}`}
                    onClick={() => setFilterPriorities(prev => {
                      const next = new Set(prev);
                      next.has(value) ? next.delete(value) : next.add(value);
                      return next;
                    })}
                    aria-pressed={filterPriorities.has(value)}
                  >
                    {label} ({stats.byPriority[value]})
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <span className="filter-group-label">Category</span>
              <div className="filter-chips" role="group" aria-label="Filter by category">
                {allCategories.map(cat => {
                  const count = categoryStats.find(c => c.id === cat.id)?.total || 0;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      className={`filter-chip category-chip ${filterCategories.has(cat.id as DIAPCategory) ? 'active' : ''}`}
                      onClick={() => setFilterCategories(prev => {
                        const next = new Set(prev);
                        const id = cat.id as DIAPCategory;
                        next.has(id) ? next.delete(id) : next.add(id);
                        return next;
                      })}
                      aria-pressed={filterCategories.has(cat.id as DIAPCategory)}
                    >
                      {getCategoryDisplayName(cat.id, customCategoryNames)} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="filter-group">
              <span className="filter-group-label">Assigned</span>
              <div className="filter-chips">
                <select
                  id="diap-filter-assigned"
                  value={filterResponsible}
                  onChange={(e) => setFilterResponsible(e.target.value)}
                  className="filter-select"
                  aria-label="Filter by assigned role"
                >
                  <option value="all">All Roles</option>
                  {responsiblePeople.map(person => (
                    <option key={person} value={person}>{person}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="filter-group">
              <span className="filter-group-label">Due</span>
              <div className="filter-chips" role="group" aria-label="Filter by due date">
                {([
                  ['overdue', 'Overdue'],
                  ['this-week', 'This week'],
                  ['this-month', 'This month'],
                  ['no-date', 'No date'],
                  ['custom', 'Custom'],
                ] as [string, string][]).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={`filter-chip due-chip ${filterDueDate.has(value) ? 'active' : ''}`}
                    onClick={() => setFilterDueDate(prev => {
                      const next = new Set(prev);
                      if (value === 'custom') {
                        if (next.has('custom')) {
                          next.delete('custom');
                          setCustomDateFrom('');
                          setCustomDateTo('');
                        } else {
                          next.clear();
                          next.add('custom');
                        }
                      } else {
                        next.delete('custom');
                        setCustomDateFrom('');
                        setCustomDateTo('');
                        next.has(value) ? next.delete(value) : next.add(value);
                      }
                      return next;
                    })}
                    aria-pressed={filterDueDate.has(value)}
                  >
                    {value === 'custom' ? label : `${label} (${dueDateCounts[value] ?? 0})`}
                  </button>
                ))}
              </div>
              {filterDueDate.has('custom') && (
                <div className="custom-date-range">
                  <label className="date-range-label">
                    From
                    <input
                      type="date"
                      value={customDateFrom}
                      onChange={(e) => setCustomDateFrom(e.target.value)}
                      className="date-range-input"
                    />
                  </label>
                  <label className="date-range-label">
                    To
                    <input
                      type="date"
                      value={customDateTo}
                      onChange={(e) => setCustomDateTo(e.target.value)}
                      className="date-range-input"
                    />
                  </label>
                </div>
              )}
            </div>

            {(filterStatuses.size > 0 || filterPriorities.size > 0 || filterCategories.size > 0 || filterResponsible !== 'all' || filterDueDate.size > 0) && (
              <button
                type="button"
                className="filter-clear-btn"
                onClick={() => {
                  setFilterStatuses(new Set());
                  setFilterPriorities(new Set());
                  setFilterCategories(new Set());
                  setFilterResponsible('all');
                  setFilterDueDate(new Set());
                  setCustomDateFrom('');
                  setCustomDateTo('');
                }}
              >
                Clear all filters
              </button>
            )}

            {/* Apply Filters (collapse panel and expand categories with results) */}
            <button
              className="btn-generate btn-generate-full"
              onClick={() => {
                if (filtersRef.current) filtersRef.current.open = false;
                const expanded: Record<string, boolean> = {};
                itemsByCategory.forEach(({ group, totalItems }) => {
                  if (totalItems > 0) expanded[group.id] = true;
                });
                setExpandedCategories(expanded);
              }}
            >
              Apply Filters
            </button>
          </div>
        </details>

        {/* Priority legend (collapsible) */}
        {items.length > 0 && (
          <details className="diap-controls-collapsible diap-priority-legend">
            <summary className="diap-controls-summary">Understanding priority levels</summary>
            <dl className="diap-priority-legend-list">
              {PRIORITY_LEGEND.map(({ level, label, description }) => (
                <div key={level} className={`diap-priority-legend-item diap-priority-${level}`}>
                  <dt>{label}</dt>
                  <dd>{description}</dd>
                </div>
              ))}
            </dl>
            <p className="diap-priority-encouragement">{PRIORITY_ENCOURAGEMENT}</p>
          </details>
        )}

        {/* Add Form (only for new items - edit is inline) */}
        {showAddForm && (
          <DIAPItemForm
            item={null}
            onSave={(data) => {
              createItem(data as Omit<DIAPItem, 'id' | 'sessionId' | 'createdAt' | 'updatedAt'>);
              setShowAddForm(false);
            }}
            onCancel={() => {
              setShowAddForm(false);
            }}
            responsiblePeopleList={responsiblePeople}
            onAddRole={addManagedRole}
            onManageRoles={() => setShowManageRoles(true)}
          />
        )}

        {/* DIAP Sections */}
        <div className="diap-category-view" aria-live="polite">
            {itemsByCategory.map(({ group, objectiveGroups, totalItems }) => {
              if (filterCategories.size > 0 && totalItems === 0) return null;
              const isExpanded = expandedCategories[group.id];
              const catStat = categoryStats.find(c => c.id === group.id);
              const displayName = getCategoryDisplayName(group.id, customCategoryNames);

              return (
                <div
                  key={group.id}
                  id={`diap-cat-${group.id}`}
                  className={`diap-category-group ${isExpanded ? 'expanded' : ''}`}
                  onClick={() => { dismissHint(); toggleCategory(group.id); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCategory(group.id); } }}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                >
                  <div className="category-header">
                    <span className="category-icon" aria-hidden="true">{group.icon}</span>
                    <div className="category-info">
                      {editingCategoryName === group.id ? (
                        <div className="category-name-edit" onClick={(e) => e.stopPropagation()}>
                          <input
                            ref={categoryNameInputRef}
                            type="text"
                            className="category-name-input"
                            value={editingNameValue}
                            onChange={(e) => setEditingNameValue(e.target.value)}
                            onKeyDown={(e) => {
                              e.stopPropagation();
                              if (e.key === 'Enter') saveCategoryName();
                              if (e.key === 'Escape') cancelEditingCategoryName();
                            }}
                            onBlur={saveCategoryName}
                            aria-label="Category name"
                          />
                        </div>
                      ) : (
                        <h2 className="category-name">
                          {displayName}
                          <button
                            className="category-rename-btn"
                            onClick={(e) => startEditingCategoryName(group.id, e)}
                            aria-label={`Rename ${displayName}`}
                            title="Rename category"
                          >
                            ✎
                          </button>
                          {group.id.startsWith('custom-') && (
                            <button
                              className="category-remove-btn"
                              onClick={(e) => handleRemoveCategory(group.id, e)}
                              aria-label={`Remove ${displayName} category`}
                              title="Remove category"
                            >
                              ×
                            </button>
                          )}
                        </h2>
                      )}
                      <span className="category-description">{group.description}</span>
                      {catStat && catStat.total > 0 && (
                        <span className="category-progress-inline">
                          <span className="category-progress-bar" role="progressbar" aria-valuenow={catStat.pct} aria-valuemin={0} aria-valuemax={100}>
                            <span className="category-progress-fill" style={{ width: `${catStat.pct}%` }} />
                          </span>
                          <span className="category-progress-text">{catStat.pct}%</span>
                        </span>
                      )}
                    </div>
                    <span className="category-count">{totalItems}</span>
                    <span className="category-chevron" aria-hidden="true">&#9660;</span>
                  </div>

                  {isExpanded && (
                    <div className="category-content" onClick={(e) => e.stopPropagation()}>
                      {objectiveGroups.length === 0 ? (
                        <p className="section-empty">No items in this category</p>
                      ) : (
                        objectiveGroups.map(({ objective, items: objItems }) => (
                          <div key={objective} className="objective-group">
                            <div className="objective-group-header">
                              <h3 className="objective-group-title">{objective}</h3>
                              <span className="objective-group-count">{objItems.length} {objItems.length === 1 ? 'action' : 'actions'}</span>
                            </div>
                            <div className="section-items">
                              {objItems.map((item, index) => (
                                editingItem?.id === item.id ? (
                                  <div key={item.id} className="inline-edit-wrapper">
                                    <DIAPItemForm
                                      item={editingItem}
                                      onSave={(data) => {
                                        updateItem(editingItem.id, data);
                                        setEditingItem(null);
                                      }}
                                      onCancel={() => {
                                        setEditingItem(null);
                                      }}
                                      onDelete={() => {
                                        deleteItem(editingItem.id);
                                        setEditingItem(null);
                                      }}
                                      responsiblePeopleList={responsiblePeople}
                                      onAddRole={addManagedRole}
                                      onManageRoles={() => setShowManageRoles(true)}
                                      onAddAttachment={addAttachment}
                                      onRemoveAttachment={removeAttachment}
                                    />
                                  </div>
                                ) : (
                                  <DIAPItemCard
                                    key={item.id}
                                    item={item}
                                    onStatusChange={handleStatusChange}
                                    onEdit={() => {
                                      dismissHint();
                                      setEditingItem(item);
                                    }}
                                    onAddAttachment={addAttachment}
                                    onRemoveAttachment={removeAttachment}
                                    onMoveUp={index > 0 ? () => reorderItem(item.id, objItems[index - 1].id) : undefined}
                                    onMoveDown={index < objItems.length - 1 ? () => reorderItem(item.id, objItems[index + 1].id) : undefined}
                                    showEditHint={showEditHint && index === 0 && group.id === 'access'}
                                    responseChange={changedItems[item.id]}
                                    onDismissChange={() => dismissChange(item.id)}
                                  />
                                )
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Add Category */}
            {showAddCategory ? (
              <div className="add-category-form">
                <h3>Add a custom category</h3>
                <div className="form-row">
                  <label>
                    Category name *
                    <input
                      ref={newCategoryInputRef}
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="e.g. Digital Accessibility"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddCategory();
                        if (e.key === 'Escape') setShowAddCategory(false);
                      }}
                    />
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    Description
                    <input
                      type="text"
                      value={newCategoryDesc}
                      onChange={(e) => setNewCategoryDesc(e.target.value)}
                      placeholder="Brief description (optional)"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddCategory();
                        if (e.key === 'Escape') setShowAddCategory(false);
                      }}
                    />
                  </label>
                </div>
                <div className="add-category-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowAddCategory(false)}>Cancel</button>
                  <button type="button" className="btn-primary" onClick={handleAddCategory} disabled={!newCategoryName.trim()}>Add Category</button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="btn-add-category"
                onClick={() => {
                  setShowAddCategory(true);
                  setTimeout(() => newCategoryInputRef.current?.focus(), 0);
                }}
              >
                <Plus size={16} aria-hidden="true" /> Add Category
              </button>
            )}
        </div>

        {/* Documents Section */}
        <div className="documents-section">
          <button
            type="button"
            className="section-header"
            onClick={() => setShowDocuments(!showDocuments)}
            aria-expanded={showDocuments}
          >
            <h2>Supporting Documents ({documents.length + collectedEvidence.length})</h2>
            <span className={`chevron ${showDocuments ? 'open' : ''}`} aria-hidden="true">&#9660;</span>
          </button>

          {showDocuments && (
            <div className="documents-content">
              {/* Auto-collected evidence from modules - grouped by folder */}
              {evidenceByModule.length > 0 && (
                <div className="evidence-from-modules">
                  <h3 className="evidence-subsection-title">
                    <span className="auto-badge">Auto-collected</span>
                    Evidence from Assessments ({collectedEvidence.length})
                  </h3>
                  <p className="evidence-subsection-desc">
                    Photos and documents uploaded during your accessibility reviews
                  </p>

                  <div className="evidence-folders">
                    {evidenceByModule.map((folder) => (
                      <div
                        key={folder.moduleCode}
                        className={`evidence-folder ${expandedFolders[folder.moduleCode] ? 'expanded' : ''}`}
                      >
                        <button
                          className="folder-header"
                          onClick={() => toggleFolder(folder.moduleCode)}
                          aria-expanded={expandedFolders[folder.moduleCode]}
                        >
                          <span className="folder-icon" aria-hidden="true">
                            {expandedFolders[folder.moduleCode] ? '📂' : '📁'}
                          </span>
                          <span className="folder-name">{folder.moduleName}</span>
                          <span className="folder-count">{folder.items.length}</span>
                          <span className="folder-chevron" aria-hidden="true">&#9660;</span>
                        </button>

                        {expandedFolders[folder.moduleCode] && (
                          <div className="folder-contents">
                            <div className="folder-evidence-grid">
                              {folder.items.map((ev) => (
                                <div key={ev.id} className="folder-evidence-item">
                                  {ev.dataUrl && ev.type !== 'document' ? (
                                    <div className="folder-evidence-thumb">
                                      <img src={ev.dataUrl} alt={ev.name} />
                                    </div>
                                  ) : (
                                    <div className="folder-evidence-thumb is-doc">
                                      <span className="doc-icon">📄</span>
                                    </div>
                                  )}
                                  <div className="folder-evidence-info">
                                    <span className="folder-evidence-name">{ev.name}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Manual upload area */}
              <div className="manual-documents">
                <h3 className="evidence-subsection-title">
                  <span className="folder-icon" aria-hidden="true">📎</span>
                  Additional Documents {documents.length > 0 && `(${documents.length})`}
                </h3>
                <div className="upload-area">
                  <label className="upload-label">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      hidden
                    />
                    <span className="upload-icon">+</span>
                    <span>Upload document</span>
                  </label>
                  <p className="upload-hint">PDF, Word, or images up to 10MB</p>
                </div>

                {documents.length > 0 && (
                  <div className="documents-list">
                    {documents.map((doc) => (
                      <div key={doc.id} className="document-item">
                        <div className="document-icon">
                          {getFileIcon(doc.fileType)}
                        </div>
                        <div className="document-info">
                          <span className="document-name">{doc.filename}</span>
                          <span className="document-meta">
                            {formatFileSize(doc.fileSize || 0)} • {new Date(doc.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="document-actions">
                          <button
                            className="btn-doc-action delete"
                            onClick={() => deleteDocument(doc.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Professional Support */}
        {expertiseGroups.length > 0 && (
          <div className="diap-professional-support">
            <h2>Professional support</h2>
            <p className="diap-prof-intro">
              Based on your action items, the following areas may benefit from specialist input.
            </p>
            {expertiseGroups.map(group => (
              <div key={group.type} className="diap-prof-group">
                <div className="diap-prof-group-header">
                  <strong>{group.label}</strong>
                  <span className="diap-prof-codes">{group.moduleCodes.join(', ')}</span>
                </div>
                <p className="diap-prof-group-desc">{group.description}</p>
              </div>
            ))}
            <div className="diap-prof-cta">
              <span className="diap-prof-cta-label">{FLARE_CONTACT.label}</span>
              <div className="diap-prof-cta-links">
                <a href={`mailto:${FLARE_CONTACT.email}`}>{FLARE_CONTACT.email}</a>
                <span className="diap-prof-cta-sep" aria-hidden="true">|</span>
                <a href={`https://${FLARE_CONTACT.website}`} target="_blank" rel="noopener noreferrer">{FLARE_CONTACT.website}</a>
              </div>
            </div>
          </div>
        )}

        <PageFooter />
      </div>
    </div>
  );
}

function getChangeMessage(oldAnswer: string, newAnswer: string): string {
  if (newAnswer === 'yes') {
    return 'Your assessment response has changed to Yes. This item may no longer be needed.';
  }
  if (newAnswer === 'partially') {
    return 'Your assessment response has changed to Partially. You may want to update this action to reflect partial progress.';
  }
  if (newAnswer === 'not-sure' || newAnswer === 'unable-to-check') {
    return 'Your assessment response has changed to Unsure. This item may need further investigation before action.';
  }
  if (newAnswer === 'no' && oldAnswer !== 'no') {
    return 'Your assessment response has changed to No. This item may need to be reprioritised.';
  }
  // Multi-select or other value changes
  if (oldAnswer !== newAnswer) {
    return 'Your assessment response for this item has been updated. Review whether this action still applies.';
  }
  return 'Your assessment response has changed. Review this item.';
}

// DIAP Item Card Component
interface DIAPItemCardProps {
  item: DIAPItem;
  onStatusChange: (id: string, status: DIAPStatus) => void;
  onEdit: () => void;
  onAddAttachment: (id: string, file: File) => void;
  onRemoveAttachment: (itemId: string, attachmentId: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  showEditHint?: boolean;
  responseChange?: { oldAnswer: string; newAnswer: string };
  onDismissChange?: () => void;
}

function DIAPItemCard({ item, onStatusChange, onEdit, onAddAttachment, onRemoveAttachment, onMoveUp, onMoveDown, showEditHint, responseChange, onDismissChange }: DIAPItemCardProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const attachInputRef = useRef<HTMLInputElement>(null);

  const priorityColors = {
    high: { bg: '#fef2f2', border: '#dc2626', badgeBorder: '#e88a8a', text: '#b91c1c' },
    medium: { bg: '#fef6ee', border: '#b45309', badgeBorder: '#d4a06a', text: '#92400e' },
    low: { bg: '#f0fdf4', border: '#15803d', badgeBorder: '#6bc88e', text: '#166534' },
  };

  const getDueDateUrgency = (dueDate?: string): { label: string; className: string } | null => {
    if (!dueDate) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const daysLeft = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const formatted = due.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
    if (daysLeft < 0) return { label: `Overdue: ${formatted}`, className: 'due-overdue' };
    if (daysLeft === 0) return { label: `Due today`, className: 'due-overdue' };
    if (daysLeft <= 7) return { label: `Due ${formatted}`, className: 'due-soon' };
    if (daysLeft <= 30) return { label: `Due ${formatted}`, className: 'due-approaching' };
    return { label: `Due ${formatted}`, className: 'due-future' };
  };

  const statusLabels: Record<DIAPStatus, string> = {
    'not-started': 'Not Started',
    'in-progress': 'In Progress',
    'achieved': 'Achieved',
    'ongoing': 'Ongoing',
    'on-hold': 'On Hold',
    'cancelled': 'Cancelled',
  };

  const colors = priorityColors[item.priority];

  // Handle card click (opens edit)
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger edit if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (
      target.closest('.status-selector') ||
      target.closest('.item-actions') ||
      target.closest('button')
    ) {
      return;
    }
    onEdit();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      // Don't trigger if focus is on a button inside
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON') return;
      e.preventDefault();
      onEdit();
    }
  };

  return (
    <div
      className={`diap-item-card status-${item.status} clickable-card`}
      style={{ borderLeftColor: colors.border }}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Editable item: ${item.objective}. Press Enter to edit.`}
    >
      {/* One-time helper text */}
      {showEditHint && (
        <div className="edit-hint" role="status">
          <span className="hint-icon">💡</span>
          Click anywhere on a card to edit it
        </div>
      )}

      {/* Response changed indicator */}
      {responseChange && (
        <div className="response-changed-banner" role="alert" onClick={(e) => e.stopPropagation()}>
          <span className="response-changed-icon" aria-hidden="true">⚠</span>
          <span className="response-changed-text">
            {getChangeMessage(responseChange.oldAnswer, responseChange.newAnswer)}
          </span>
          <button
            className="response-changed-dismiss"
            onClick={(e) => { e.stopPropagation(); onDismissChange?.(); }}
            aria-label="Dismiss change notification"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Section label */}
      <div className="item-section-label">
        {item.moduleSource
          ? (item.moduleSource.replace(/^\d+\.\d+:\s*/, '') || item.moduleSource)
          : item.category.replace(/-/g, ' ')}
      </div>

      <div className="item-header">
        <div className="item-badges">
          <span
            className="priority-badge"
            style={{ background: colors.bg, color: colors.text, borderColor: colors.badgeBorder }}
          >
            {item.priority} priority
          </span>
        </div>
        <div className="item-actions">
          {onMoveUp && (
            <button
              className="action-btn reorder"
              onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
              aria-label="Move item up"
            >
              ▲
            </button>
          )}
          {onMoveDown && (
            <button
              className="action-btn reorder"
              onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
              aria-label="Move item down"
            >
              ▼
            </button>
          )}
        </div>
      </div>

      <div className="item-title-row">
        <h3 className="item-title">{item.objective}</h3>
        <button
          className="inline-edit-btn"
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          aria-label="Edit objective"
          title="Edit"
        >
          <span aria-hidden="true">✏️</span>
        </button>
      </div>

      {item.action && (
        <div className="item-description">{item.action}</div>
      )}

      {/* Key details row - owner and timeline */}
      <div className="item-details-row">
          {item.responsibleRole && (
            <div className="detail-chip owner-chip">
              <span className="detail-icon" aria-hidden="true">👤</span>
              <span className="detail-text">{item.responsibleRole}</span>
            </div>
          )}
          {(() => {
            const urgency = getDueDateUrgency(item.dueDate);
            if (urgency) {
              return (
                <div className={`detail-chip date-chip ${urgency.className}`}>
                  <span className="detail-icon" aria-hidden="true">📅</span>
                  <span className="detail-text">{urgency.label}</span>
                </div>
              );
            }
            return (
              <button
                className="detail-chip set-date-btn"
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                aria-label="Set a due date for this item"
              >
                <span className="detail-icon" aria-hidden="true">📅</span>
                <span className="detail-text">Set due date</span>
              </button>
            );
          })()}
      </div>

      <div className="item-footer">
        <div className="status-selector" onClick={(e) => e.stopPropagation()}>
          <button
            className={`status-btn status-${item.status}`}
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            aria-haspopup="listbox"
            aria-expanded={showStatusMenu}
          >
            {statusLabels[item.status]}
            <span className="dropdown-arrow" aria-hidden="true">&#9660;</span>
          </button>

          {showStatusMenu && (
            <div className="status-menu" role="listbox" aria-label="Select status">
              {Object.entries(statusLabels).map(([status, label]) => (
                <button
                  key={status}
                  className={`status-option ${status === item.status ? 'active' : ''}`}
                  onClick={() => {
                    onStatusChange(item.id, status as DIAPStatus);
                    setShowStatusMenu(false);
                  }}
                  role="option"
                  aria-selected={status === item.status}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
        {item.complianceLevel && (
          <span className={`compliance-badge compliance-${item.complianceLevel}`}>
            {item.complianceLevel === 'mandatory' ? 'Mandatory' : 'Best Practice'}
          </span>
        )}
      </div>

      {item.questionSource && hasHelpContent(item.questionSource) && (() => {
        const help = getHelpByQuestionId(item.questionSource!);
        return (
          <div className="item-resource-link">
            <Link
              to={getResourceLink(item.questionSource!)}
              state={{ from: 'diap' }}
              className="resource-guide-link"
            >
              View guide: {help?.title || 'Resource guide'}
            </Link>
          </div>
        );
      })()}

      {/* Per-item attachments */}
      <div className="item-attachments" onClick={(e) => e.stopPropagation()}>
        {(item.attachments || []).length > 0 && (
          <div className="attachment-list">
            {item.attachments!.map(att => (
              <div key={att.id} className="attachment-chip">
                <span className="attachment-icon" aria-hidden="true">
                  {att.type.startsWith('image/') ? '🖼️' : '📎'}
                </span>
                <span className="attachment-name" title={att.name}>{att.name}</span>
                <button
                  className="attachment-remove"
                  onClick={() => onRemoveAttachment(item.id, att.id)}
                  aria-label={`Remove ${att.name}`}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          ref={attachInputRef}
          type="file"
          className="sr-only"
          accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onAddAttachment(item.id, file);
              e.target.value = '';
            }
          }}
          aria-label="Upload attachment"
        />
        <button
          className="btn-attach"
          onClick={() => attachInputRef.current?.click()}
          aria-label="Add evidence or attachment"
        >
          + Add evidence
        </button>
      </div>
    </div>
  );
}

// Role Combo Box Component
interface RoleComboBoxProps {
  value: string;
  roles: string[];
  onChange: (value: string) => void;
  onAddRole?: (role: string) => void;
  onManageRoles?: () => void;
  inputId?: string;
}

function RoleComboBox({ value, roles, onChange, onAddRole, onManageRoles, inputId }: RoleComboBoxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!search) return roles;
    const q = search.toLowerCase();
    return roles.filter(r => r.toLowerCase().includes(q));
  }, [roles, search]);

  const exactMatch = roles.some(r => r.toLowerCase() === search.toLowerCase());

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectRole = (role: string) => {
    onChange(role);
    setSearch('');
    setOpen(false);
  };

  const handleCreate = () => {
    const trimmed = search.trim();
    if (!trimmed) return;
    onAddRole?.(trimmed);
    onChange(trimmed);
    setSearch('');
    setOpen(false);
  };

  return (
    <div className="role-combobox" ref={wrapRef}>
      <div className="role-combobox-input-row">
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          className="role-combobox-input"
          value={open ? search : value}
          placeholder="Select or type a role..."
          onFocus={() => { setOpen(true); setSearch(''); }}
          onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur(); }
            if (e.key === 'Enter' && search.trim()) {
              e.preventDefault();
              if (filtered.length === 1) { selectRole(filtered[0]); }
              else if (!exactMatch && search.trim()) { handleCreate(); }
            }
          }}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            className="role-combobox-clear"
            onClick={() => { onChange(''); setSearch(''); }}
            aria-label="Clear role"
          >
            &times;
          </button>
        )}
      </div>
      {open && (
        <ul className="role-combobox-list" role="listbox">
          {filtered.map(role => (
            <li
              key={role}
              className={`role-combobox-option ${role === value ? 'selected' : ''}`}
              onMouseDown={(e) => { e.preventDefault(); selectRole(role); }}
              role="option"
              aria-selected={role === value}
            >
              {role}
            </li>
          ))}
          {search.trim() && !exactMatch && (
            <li
              className="role-combobox-option create-new"
              onMouseDown={(e) => { e.preventDefault(); handleCreate(); }}
              role="option"
            >
              + Add "{search.trim()}"
            </li>
          )}
          {filtered.length === 0 && !search.trim() && (
            <li className="role-combobox-empty">No roles defined yet</li>
          )}
          {onManageRoles && (
            <>
              <li className="role-combobox-divider" role="separator" />
              <li
                className="role-combobox-option manage-roles-option"
                onMouseDown={(e) => { e.preventDefault(); setOpen(false); onManageRoles(); }}
                role="option"
              >
                Manage Roles...
              </li>
            </>
          )}
        </ul>
      )}
    </div>
  );
}

// Manage Roles Modal Component
interface ManageRolesModalProps {
  roles: string[];
  items: DIAPItem[];
  onRename: (oldName: string, newName: string) => void;
  onDelete: (role: string) => void;
  onAdd: (role: string) => void;
  onClose: () => void;
}

function ManageRolesModal({ roles, items, onRename, onDelete, onAdd, onClose }: ManageRolesModalProps) {
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newRole, setNewRole] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const addInputRef = useRef<HTMLInputElement>(null);

  const countForRole = (role: string) => items.filter(i => i.responsibleRole === role).length;

  // Focus trap
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;
    const focusable = modal.querySelectorAll<HTMLElement>('button, input, [tabindex]:not([tabindex="-1"])');
    if (focusable.length > 0) addInputRef.current?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const els = modal.querySelectorAll<HTMLElement>('button:not([disabled]), input, [tabindex]:not([tabindex="-1"])');
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [roles, editingRole]);

  const handleRename = (oldName: string) => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== oldName) {
      onRename(oldName, trimmed);
    }
    setEditingRole(null);
    setEditValue('');
  };

  const handleAdd = () => {
    const trimmed = newRole.trim();
    if (trimmed) {
      onAdd(trimmed);
      setNewRole('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); } }}>
      <div ref={modalRef} className="modal-content manage-roles-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="manage-roles-title">
        <div className="modal-header">
          <h2 id="manage-roles-title">Manage Roles</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close manage roles">&times;</button>
        </div>
        <div className="modal-body">
          <p className="manage-roles-intro">
            Define the roles and departments responsible for DIAP actions. Use roles (not individual names) so accountability persists when people change positions.
          </p>

          <div className="manage-roles-add">
            <input
              ref={addInputRef}
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="Add a new role..."
              aria-label="New role name"
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
            />
            <button type="button" className="btn-sm btn-save" onClick={handleAdd} disabled={!newRole.trim()}>
              Add
            </button>
          </div>

          <ul className="manage-roles-list">
            {roles.map(role => {
              const count = countForRole(role);
              const isEditing = editingRole === role;
              return (
                <li key={role} className="manage-roles-item">
                  {isEditing ? (
                    <div className="manage-roles-edit-row">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') { e.preventDefault(); handleRename(role); }
                          if (e.key === 'Escape') { setEditingRole(null); }
                        }}
                        aria-label={`Rename ${role}`}
                        autoFocus
                      />
                      <button type="button" className="btn-sm btn-save" onClick={() => handleRename(role)}>Save</button>
                      <button type="button" className="btn-sm btn-cancel" onClick={() => setEditingRole(null)}>Cancel</button>
                    </div>
                  ) : (
                    <>
                      <span className="manage-roles-name">{role}</span>
                      {count > 0 && <span className="manage-roles-count">{count} item{count !== 1 ? 's' : ''}</span>}
                      <div className="manage-roles-actions">
                        <button
                          type="button"
                          className="btn-sm btn-rename"
                          onClick={() => { setEditingRole(role); setEditValue(role); }}
                          aria-label={`Rename ${role}`}
                        >
                          Rename
                        </button>
                        <button
                          type="button"
                          className="btn-sm btn-delete"
                          onClick={() => { if (count > 0) { if (window.confirm(`"${role}" is assigned to ${count} item${count !== 1 ? 's' : ''}. Those items will keep their current assignment. Remove this role from the list?`)) onDelete(role); } else { onDelete(role); } }}
                          aria-label={`Remove ${role}`}
                        >
                          Remove
                        </button>
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
          {roles.length === 0 && (
            <p className="manage-roles-empty">No roles defined. Add one above or they'll be created when you assign items.</p>
          )}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-sm btn-done" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}

// DIAP Item Form Component
interface DIAPItemFormProps {
  item?: DIAPItem | null;
  onSave: (data: Partial<DIAPItem>) => void;
  onCancel: () => void;
  onDelete?: () => void;
  responsiblePeopleList?: string[];
  onAddRole?: (role: string) => void;
  onManageRoles?: () => void;
  onAddAttachment?: (itemId: string, file: File) => void;
  onRemoveAttachment?: (itemId: string, attachmentId: string) => void;
}

function DIAPItemForm({ item, onSave, onCancel, onDelete, responsiblePeopleList = [], onAddRole, onManageRoles, onAddAttachment, onRemoveAttachment }: DIAPItemFormProps) {
  const formAttachRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    objective: item?.objective || '',
    action: item?.action || '',
    category: item?.category || 'physical-access' as DIAPCategory,
    priority: item?.priority || 'medium' as DIAPPriority,
    status: item?.status || 'not-started' as DIAPStatus,
    timeframe: item?.timeframe || '',
    dueDate: item?.dueDate || '',
    responsibleRole: item?.responsibleRole || '',
    notes: item?.notes || '',
    successIndicators: item?.successIndicators || '',
    budgetEstimate: item?.budgetEstimate || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.objective.trim()) return;
    onSave({
      ...formData,
      importSource: item?.importSource || 'manual',
    });
  };

  const handlePriorityChange = (newPriority: DIAPPriority) => {
    setFormData({
      ...formData,
      priority: newPriority,
    });
  };

  return (
    <form className="diap-item-form" onSubmit={handleSubmit}>
      <h3>{item ? 'Edit Item' : 'Add New Item'}</h3>

      <div className="form-row">
        <label>
          Objective *
          <span className="field-hint">What do you want to achieve?</span>
          <input
            type="text"
            value={formData.objective}
            onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
            required
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Action *
          <span className="field-hint">What specific steps will you take?</span>
          <textarea
            value={formData.action}
            onChange={(e) => setFormData({ ...formData, action: e.target.value })}
            rows={3}
            required
          />
        </label>
      </div>

      <div className="form-row double">
        <label>
          Category
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as DIAPCategory })}
          >
            {getAllCategories().map(cat => (
              <option key={cat.id} value={cat.id}>{getCategoryDisplayName(cat.id)}</option>
            ))}
          </select>
        </label>

        <fieldset className="priority-fieldset" role="radiogroup" aria-label="Priority">
          <legend>Priority</legend>
          <div className="priority-toggle">
            <button
              type="button"
              className={`priority-btn priority-high ${formData.priority === 'high' ? 'active' : ''}`}
              onClick={() => handlePriorityChange('high')}
              aria-pressed={formData.priority === 'high'}
            >
              High
            </button>
            <button
              type="button"
              className={`priority-btn priority-medium ${formData.priority === 'medium' ? 'active' : ''}`}
              onClick={() => handlePriorityChange('medium')}
              aria-pressed={formData.priority === 'medium'}
            >
              Medium
            </button>
            <button
              type="button"
              className={`priority-btn priority-low ${formData.priority === 'low' ? 'active' : ''}`}
              onClick={() => handlePriorityChange('low')}
              aria-pressed={formData.priority === 'low'}
            >
              Low
            </button>
          </div>
        </fieldset>
      </div>

      <div className="form-row double">
        <div className="form-field">
          <label htmlFor="diap-role-input">
            Responsible Role
            <span className="field-hint">Select a role or type to create a new one</span>
          </label>
          <RoleComboBox
            inputId="diap-role-input"
            value={formData.responsibleRole}
            roles={responsiblePeopleList}
            onChange={(val) => setFormData({ ...formData, responsibleRole: val })}
            onAddRole={onAddRole}
            onManageRoles={onManageRoles}
          />
        </div>

        <label>
          Due Date
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </label>
      </div>

      <div className="form-row double">
        <label>
          Status
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as DIAPStatus })}
          >
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="achieved">Achieved</option>
            <option value="ongoing">Ongoing</option>
            <option value="on-hold">On Hold</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
      </div>

      <div className="form-row">
        <label>
          Success Indicators
          <span className="field-hint">How will you measure success?</span>
          <input
            type="text"
            value={formData.successIndicators}
            onChange={(e) => setFormData({ ...formData, successIndicators: e.target.value })}
          />
        </label>
      </div>

      <div className="form-row double">
        <label>
          Budget Estimate
          <span className="field-hint">e.g., &lt;$500, $1,000-$5,000</span>
          <input
            type="text"
            value={formData.budgetEstimate}
            onChange={(e) => setFormData({ ...formData, budgetEstimate: e.target.value })}
          />
        </label>

        <label>
          Notes
          <span className="field-hint">Additional notes</span>
          <input
            type="text"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </label>
      </div>

      {/* Evidence upload (only when editing existing item) */}
      {item && onAddAttachment && (
        <div className="form-row">
          <label>
            Evidence
            <span className="field-hint">
              Upload photos, quotes, research, or documents. Examples: site photos showing current state,
              supplier quotes for improvements, staff training certificates, policy documents.
            </span>
          </label>
          {(item.attachments || []).length > 0 && (
            <div className="attachment-list" style={{ marginBottom: '8px' }}>
              {item.attachments!.map(att => (
                <div key={att.id} className="attachment-chip">
                  <span className="attachment-icon" aria-hidden="true">
                    {att.type.startsWith('image/') ? '🖼️' : '📎'}
                  </span>
                  <span className="attachment-name" title={att.name}>{att.name}</span>
                  {onRemoveAttachment && (
                    <button
                      type="button"
                      className="attachment-remove"
                      onClick={() => onRemoveAttachment(item.id, att.id)}
                      aria-label={`Remove ${att.name}`}
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          <input
            ref={formAttachRef}
            type="file"
            className="sr-only"
            accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onAddAttachment(item.id, file);
                e.target.value = '';
              }
            }}
          />
          <button
            type="button"
            className="btn-attach"
            onClick={() => formAttachRef.current?.click()}
          >
            + Add evidence
          </button>
        </div>
      )}

      <div className="form-actions">
        {item && onDelete && (
          <button
            type="button"
            className="btn-delete-item"
            onClick={() => { if (window.confirm('Delete this item? This cannot be undone.')) onDelete(); }}
          >
            Delete Item
          </button>
        )}
        <div className="form-actions-right">
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-save">
            {item ? 'Update Item' : 'Add Item'}
          </button>
        </div>
      </div>
    </form>
  );
}

// Helper functions
function getFileIcon(fileType: string): string {
  if (fileType.includes('pdf')) return '📄';
  if (fileType.includes('word') || fileType.includes('document')) return '📝';
  if (fileType.includes('image')) return '🖼️';
  return '📎';
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
