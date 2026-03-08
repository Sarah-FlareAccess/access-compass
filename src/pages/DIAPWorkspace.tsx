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

import { useState, useMemo, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDIAPManagement } from '../hooks/useDIAPManagement';
import { PRIORITY_LEGEND, PRIORITY_ENCOURAGEMENT } from '../utils/priorityCalculation';
import { FLARE_CONTACT, groupModuleCodesByExpertise } from '../utils/professionalSupportGroups';
import { generateDIAPPdf } from '../utils/diapPdfGenerator';
import { getSession } from '../utils/session';
import { PageFooter } from '../components/PageFooter';
import { useModuleProgress } from '../hooks/useModuleProgress';
import { getModuleById, getQuestionsForMode } from '../data/accessModules';
import { DIAP_SECTIONS as _DIAP_SECTIONS, DIAP_CATEGORIES, getDIAPSectionForModule, groupItemsByCategory } from '../data/diapMapping';
import type { DIAPItem, DIAPAttachment, DIAPStatus, DIAPPriority, DIAPCategory, CSVImportResult, PDFImportResult, ExcelImportResult } from '../hooks/useDIAPManagement';
import { usePageTitle } from '../hooks/usePageTitle';
import { hasHelpContent, getHelpByQuestionId } from '../data/help';
import { getResourceLink } from '../utils/resourceLinks';
import { PageGuide, type GuideFeature } from '../components/PageGuide';
import { Zap, Upload, Paperclip, Filter, LayoutGrid, Download, PenLine, Users as UsersIcon, CalendarDays, CheckCircle2 } from 'lucide-react';
import '../styles/diap.css';

const DIAP_FEATURES: GuideFeature[] = [
  { icon: PenLine, title: 'Edit items', description: 'Click any card to edit the objective, action steps, notes, budget, and success indicators.' },
  { icon: Paperclip, title: 'Upload evidence', description: 'Attach photos, quotes, or research to each action item as supporting evidence.' },
  { icon: UsersIcon, title: 'Assign responsibility', description: 'Set a responsible person or team for each item so ownership is clear.' },
  { icon: CalendarDays, title: 'Due dates and timeframes', description: 'Add a specific due date or general timeframe to track deadlines.' },
  { icon: CheckCircle2, title: 'Status tracking', description: 'Update item status (Not Started, In Progress, Completed, On Hold) as work progresses.' },
  { icon: Zap, title: 'Generate from responses', description: 'Auto-populate action items from your completed module assessment findings.' },
  { icon: Upload, title: 'Import and export', description: 'Import from CSV, Excel, or PDF. Export as CSV or formatted PDF to share with management.' },
  { icon: Filter, title: 'Filter and view modes', description: 'Filter by priority, category, or person. Switch between list and section views.' },
];

type TabType = 'all' | 'in-progress' | 'completed';
type ViewMode = 'list' | 'by-section';
type ImportResult = CSVImportResult | PDFImportResult | ExcelImportResult;

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

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<DIAPItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<DIAPCategory | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<DIAPPriority | 'all'>('all');
  const [filterResponsible, setFilterResponsible] = useState<string>('all');
  const [showDocuments, setShowDocuments] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
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

  // Track which category groups are expanded (start all expanded)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    DIAP_CATEGORIES.forEach(cat => {
      initial[cat.id] = true;
    });
    return initial;
  });

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Get unique list of responsible people from all items (for dropdown)
  const responsiblePeople = useMemo(() => {
    const people = new Set<string>();
    items.forEach(item => {
      if (item.responsibleRole && item.responsibleRole.trim()) {
        people.add(item.responsibleRole.trim());
      }
    });
    // Also check localStorage for previously assigned people
    const storedPeople = localStorage.getItem('diap_responsible_people');
    if (storedPeople) {
      try {
        const parsed = JSON.parse(storedPeople) as string[];
        parsed.forEach(p => people.add(p));
      } catch {
        // Ignore parse errors
      }
    }
    return Array.from(people).sort((a, b) => a.localeCompare(b));
  }, [items]);

  // Save responsible people to localStorage when items change
  useMemo(() => {
    if (responsiblePeople.length > 0) {
      localStorage.setItem('diap_responsible_people', JSON.stringify(responsiblePeople));
    }
  }, [responsiblePeople]);

  // Filter items based on tab and filters
  const filteredItems = useMemo(() => {
    let filtered = [...items];

    // Filter by tab
    if (activeTab === 'in-progress') {
      filtered = filtered.filter(i => i.status === 'in-progress');
    } else if (activeTab === 'completed') {
      filtered = filtered.filter(i => i.status === 'completed');
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(i => i.category === filterCategory);
    }

    // Filter by priority
    if (filterPriority !== 'all') {
      filtered = filtered.filter(i => i.priority === filterPriority);
    }

    // Filter by responsible person
    if (filterResponsible !== 'all') {
      filtered = filtered.filter(i => i.responsibleRole === filterResponsible);
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
  }, [items, activeTab, filterCategory, filterPriority, filterResponsible]);

  // Group filtered items by category for the by-section view
  const itemsByCategory = useMemo(() => {
    return groupItemsByCategory(filteredItems);
  }, [filteredItems]);

  // Get stats
  const stats = getStats();

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
    generateDIAPPdf({ items, orgName });
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
              <h3>✨ Generate DIAP from Your Assessment</h3>
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

        {/* Stats Overview */}
        <div className="diap-stats-grid">
          <div className="stat-card total">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Items</span>
          </div>
          <div className="stat-card not-started">
            <span className="stat-value">{stats.byStatus['not-started']}</span>
            <span className="stat-label">Not Started</span>
          </div>
          <div className="stat-card in-progress">
            <span className="stat-value">{stats.byStatus['in-progress']}</span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat-card completed">
            <span className="stat-value">{stats.byStatus['completed']}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-card high-priority">
            <span className="stat-value">{stats.byPriority['high']}</span>
            <span className="stat-label">High Priority</span>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="view-mode-toggle">
          <button
            className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            List View
          </button>
          <button
            className={`view-mode-btn ${viewMode === 'by-section' ? 'active' : ''}`}
            onClick={() => setViewMode('by-section')}
          >
            By DIAP Section
          </button>
        </div>

        {/* Tabs and Filters */}
        <div className="diap-controls">
          <div className="tabs" role="tablist" aria-label="DIAP item status">
            <button
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
              role="tab"
              aria-selected={activeTab === 'all'}
            >
              All ({items.length})
            </button>
            <button
              className={`tab ${activeTab === 'in-progress' ? 'active' : ''}`}
              onClick={() => setActiveTab('in-progress')}
              role="tab"
              aria-selected={activeTab === 'in-progress'}
            >
              In Progress ({stats.byStatus['in-progress']})
            </button>
            <button
              className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
              role="tab"
              aria-selected={activeTab === 'completed'}
            >
              Completed ({stats.byStatus['completed']})
            </button>
          </div>

          <div className="filters">
            <div className="filter-field">
              <label htmlFor="diap-filter-category" className="sr-only">Filter by category</label>
              <select
                id="diap-filter-category"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as DIAPCategory | 'all')}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                <option value="physical-access">Physical Access</option>
                <option value="information-communication-marketing">Information, Communication & Marketing</option>
                <option value="customer-service">Customer Service</option>
                <option value="operations-policy-procedure">Operations, Policy & Procedure</option>
                <option value="people-culture">People & Culture</option>
              </select>
            </div>

            <div className="filter-field">
              <label htmlFor="diap-filter-priority" className="sr-only">Filter by priority</label>
              <select
                id="diap-filter-priority"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as DIAPPriority | 'all')}
                className="filter-select"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div className="filter-field">
              <label htmlFor="diap-filter-assigned" className="sr-only">Filter by assigned person</label>
              <select
                id="diap-filter-assigned"
                value={filterResponsible}
                onChange={(e) => setFilterResponsible(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Assigned</option>
                {responsiblePeople.map(person => (
                  <option key={person} value={person}>{person}</option>
                ))}
              </select>
            </div>

            <button
              className={`btn-add-item ${showAddForm ? 'active' : ''}`}
              onClick={() => setShowAddForm(!showAddForm)}
            >
              + Add Item
            </button>
          </div>
        </div>

        {/* Priority legend (collapsible) */}
        {items.length > 0 && (
          <details className="diap-priority-legend">
            <summary>Understanding priority levels</summary>
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
          />
        )}

        {/* Items - List View or By Category View */}
        {viewMode === 'list' ? (
          <div className="diap-items-list" aria-live="polite">
            {filteredItems.length === 0 ? (
              <div className="empty-state">
                <p>No items found.</p>
                {activeTab !== 'all' && (
                  <button onClick={() => setActiveTab('all')}>View all items</button>
                )}
              </div>
            ) : (
              filteredItems.map((item, index) => (
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
                      responsiblePeopleList={responsiblePeople}
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
                    onDelete={() => deleteItem(item.id)}
                    onAddAttachment={addAttachment}
                    onRemoveAttachment={removeAttachment}
                    onMoveUp={index > 0 ? () => reorderItem(item.id, filteredItems[index - 1].id) : undefined}
                    onMoveDown={index < filteredItems.length - 1 ? () => reorderItem(item.id, filteredItems[index + 1].id) : undefined}
                    showEditHint={showEditHint && index === 0}
                  />
                )
              ))
            )}
          </div>
        ) : (
          /* By Category View - Grouped into 3 main groups */
          <div className="diap-category-view" aria-live="polite">
            {itemsByCategory.map(({ group, subcategories }) => {
              const totalItemsInGroup = subcategories.reduce((sum, s) => sum + s.items.length, 0);
              const isExpanded = expandedCategories[group.id];

              return (
                <div key={group.id} className={`diap-category-group ${isExpanded ? 'expanded' : ''}`}>
                  <button
                    className="category-header"
                    onClick={() => toggleCategory(group.id)}
                    aria-expanded={isExpanded}
                  >
                    <span className="category-icon" aria-hidden="true">{group.icon}</span>
                    <div className="category-info">
                      <span className="category-name">{group.name}</span>
                      <span className="category-description">{group.description}</span>
                    </div>
                    <span className="category-count">{totalItemsInGroup}</span>
                    <span className="category-chevron" aria-hidden="true">&#9660;</span>
                  </button>

                  {isExpanded && (
                    <div className="category-content">
                      {subcategories.map(({ id, label, items: categoryItems }) => (
                        <div key={id} className="diap-section-block">
                          <div className="section-label">
                            <span className="section-name">{label}</span>
                            <span className="section-count">{categoryItems.length}</span>
                          </div>
                          {categoryItems.length === 0 ? (
                            <p className="section-empty">No items in this category</p>
                          ) : (
                            <div className="section-items">
                              {categoryItems.map((item, index) => (
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
                                      responsiblePeopleList={responsiblePeople}
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
                                    onDelete={() => deleteItem(item.id)}
                                    onAddAttachment={addAttachment}
                                    onRemoveAttachment={removeAttachment}
                                    onMoveUp={index > 0 ? () => reorderItem(item.id, categoryItems[index - 1].id) : undefined}
                                    onMoveDown={index < categoryItems.length - 1 ? () => reorderItem(item.id, categoryItems[index + 1].id) : undefined}
                                    showEditHint={showEditHint && index === 0 && group.id === 'access'}
                                  />
                                )
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

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

        {/* Quick Actions */}
        <div className="diap-actions">
          <Link to="/dashboard" className="btn btn-secondary">
            ← Back to Dashboard
          </Link>
          <Link to="/questions" className="btn btn-secondary">
            Continue Review
          </Link>
        </div>

        <PageFooter />
      </div>

    </div>
  );
}

// DIAP Item Card Component
interface DIAPItemCardProps {
  item: DIAPItem;
  onStatusChange: (id: string, status: DIAPStatus) => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddAttachment: (id: string, file: File) => void;
  onRemoveAttachment: (itemId: string, attachmentId: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  showEditHint?: boolean;
}

function DIAPItemCard({ item, onStatusChange, onEdit, onDelete, onAddAttachment, onRemoveAttachment, onMoveUp, onMoveDown, showEditHint }: DIAPItemCardProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const attachInputRef = useRef<HTMLInputElement>(null);

  const priorityColors = {
    high: { bg: 'rgba(239, 68, 68, 0.1)', border: '#dc2626', text: '#dc2626' },
    medium: { bg: 'rgba(251, 191, 36, 0.1)', border: '#d97706', text: '#d97706' },
    low: { bg: 'rgba(34, 197, 94, 0.1)', border: '#16a34a', text: '#16a34a' },
  };

  const statusLabels: Record<DIAPStatus, string> = {
    'not-started': 'Not Started',
    'in-progress': 'In Progress',
    'completed': 'Completed',
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

      <div className="item-header">
        <div className="item-badges">
          <span
            className="priority-badge"
            style={{ background: colors.bg, color: colors.text }}
          >
            {item.priority} priority
          </span>
          <span className="category-badge">{item.category.replace(/-/g, ' ')}</span>
          {item.complianceLevel && (
            <span className={`compliance-badge compliance-${item.complianceLevel}`}>
              {item.complianceLevel === 'mandatory' ? 'Mandatory' : 'Best Practice'}
            </span>
          )}
          {item.moduleSource && (
            <span className="module-source-badge" title={item.moduleSource}>
              {item.moduleSource.replace(/^\d+\.\d+:\s*/, '') || item.moduleSource}
            </span>
          )}
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
          <button
            className="action-btn delete"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            aria-label={`Delete ${item.objective}`}
          >
            Delete
          </button>
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
          {item.dueDate ? (
            <div className="detail-chip date-chip">
              <span className="detail-icon" aria-hidden="true">📅</span>
              <span className="detail-text">
                {new Date(item.dueDate).toLocaleDateString('en-AU', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
          ) : item.timeframe ? (
            <div className="detail-chip timeframe-chip">
              <span className="detail-icon" aria-hidden="true">⏱️</span>
              <span className="detail-text">{item.timeframe}</span>
            </div>
          ) : (
            <button
              className="detail-chip set-timeframe-btn"
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              aria-label="Set a timeframe for this item"
            >
              <span className="detail-icon" aria-hidden="true">⏱️</span>
              <span className="detail-text">Set your timeframe</span>
            </button>
          )}
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
        {(item.attachments || []).length === 0 && (
          <p className="evidence-hint">
            Add evidence: site photos, supplier quotes, policy documents, training records, or research.
          </p>
        )}
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

// DIAP Item Form Component
interface DIAPItemFormProps {
  item?: DIAPItem | null;
  onSave: (data: Partial<DIAPItem>) => void;
  onCancel: () => void;
  responsiblePeopleList?: string[];
  onAddAttachment?: (itemId: string, file: File) => void;
  onRemoveAttachment?: (itemId: string, attachmentId: string) => void;
}

function DIAPItemForm({ item, onSave, onCancel, responsiblePeopleList = [], onAddAttachment, onRemoveAttachment }: DIAPItemFormProps) {
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
            <option value="physical-access">Physical Access</option>
            <option value="information-communication-marketing">Information, Communication & Marketing</option>
            <option value="customer-service">Customer Service</option>
            <option value="operations-policy-procedure">Operations, Policy & Procedure</option>
            <option value="people-culture">People & Culture</option>
          </select>
        </label>

        <label>
          Priority
          <div className="priority-toggle">
            <button
              type="button"
              className={`priority-btn priority-high ${formData.priority === 'high' ? 'active' : ''}`}
              onClick={() => handlePriorityChange('high')}
            >
              High
            </button>
            <button
              type="button"
              className={`priority-btn priority-medium ${formData.priority === 'medium' ? 'active' : ''}`}
              onClick={() => handlePriorityChange('medium')}
            >
              Medium
            </button>
            <button
              type="button"
              className={`priority-btn priority-low ${formData.priority === 'low' ? 'active' : ''}`}
              onClick={() => handlePriorityChange('low')}
            >
              Low
            </button>
          </div>
        </label>
      </div>

      <div className="form-row double">
        <label>
          Responsible Person/Role
          <span className="field-hint">e.g., Facilities Manager, HR Team</span>
          <input
            type="text"
            value={formData.responsibleRole}
            onChange={(e) => setFormData({ ...formData, responsibleRole: e.target.value })}
            list="responsible-people-list"
            autoComplete="off"
          />
          {responsiblePeopleList.length > 0 && (
            <datalist id="responsible-people-list">
              {responsiblePeopleList.map(person => (
                <option key={person} value={person} />
              ))}
            </datalist>
          )}
        </label>

        <label>
          Timeframe
          <select
            value={formData.timeframe}
            onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
          >
            <option value="">Select timeframe</option>
            <option value="0-30 days">0-30 days</option>
            <option value="30-90 days">30-90 days</option>
            <option value="3-12 months">3-12 months</option>
            <option value="Ongoing">Ongoing</option>
          </select>
        </label>
      </div>

      <div className="form-row double">
        <label>
          Due Date
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
          />
        </label>

        <label>
          Status
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as DIAPStatus })}
          >
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
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
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-save">
          {item ? 'Update Item' : 'Add Item'}
        </button>
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
