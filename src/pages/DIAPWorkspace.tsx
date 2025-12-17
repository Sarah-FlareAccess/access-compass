/**
 * DIAP Workspace Page
 *
 * Comprehensive DIAP management with:
 * - 3-tab interface (All, In Progress, Completed)
 * - Document upload and management
 * - Export functionality (CSV)
 * - Item status updates and editing
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDIAPManagement } from '../hooks/useDIAPManagement';
import { useModuleProgress } from '../hooks/useModuleProgress';
import { getModuleById } from '../data/accessModules';
import { DIAP_SECTIONS, getDIAPSectionForModule } from '../data/diapMapping';
import type { DIAPItem, DIAPDocument, DIAPStatus, DIAPPriority, DIAPCategory } from '../hooks/useDIAPManagement';
import '../styles/diap.css';

type TabType = 'all' | 'in-progress' | 'completed';
type ViewMode = 'list' | 'by-section';

export default function DIAPWorkspace() {
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
  } = useDIAPManagement();

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<DIAPItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<DIAPCategory | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<DIAPPriority | 'all'>('all');
  const [showDocuments, setShowDocuments] = useState(false);
  const [showEvidence, setShowEvidence] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

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

  // Group items by DIAP section
  const itemsBySection = useMemo(() => {
    const grouped: Record<string, DIAPItem[]> = {};
    DIAP_SECTIONS.forEach(section => {
      grouped[section.id] = [];
    });

    items.forEach(item => {
      const sectionId = item.moduleSource
        ? (getDIAPSectionForModule(item.moduleSource)?.id || 'policy-procedure')
        : 'policy-procedure';
      if (!grouped[sectionId]) {
        grouped[sectionId] = [];
      }
      grouped[sectionId].push(item);
    });

    return grouped;
  }, [items]);

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

    // Sort by priority (high > medium > low)
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    filtered.sort((a, b) =>
      (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2)
    );

    return filtered;
  }, [items, activeTab, filterCategory, filterPriority]);

  // Get stats
  const stats = getStats();

  // Handle status change
  const handleStatusChange = (itemId: string, newStatus: DIAPStatus) => {
    updateItem(itemId, { status: newStatus });
  };

  // Handle export to CSV
  const handleExportCSV = () => {
    const headers = ['Objective', 'Action', 'Category', 'Priority', 'Status', 'Timeframe', 'Created'];
    const rows = items.map(item => [
      item.objective,
      item.action,
      item.category,
      item.priority,
      item.status,
      item.timeframe,
      new Date(item.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell || ''}"`).join(','))
      .join('\n');

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
        <header className="page-global-header">
          <div className="header-brand">
            <Link to="/dashboard" className="brand-link">
              <span className="brand-name">Access Compass</span>
              <span className="brand-byline">by Flare Access</span>
            </Link>
          </div>
          <div className="header-actions">
            <Link to="/dashboard" className="header-action-btn">Dashboard</Link>
          </div>
        </header>
        <div className="container">
          <div className="loading-state">Loading your DIAP...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="diap-page">
      <header className="page-global-header">
        <div className="header-brand">
          <Link to="/dashboard" className="brand-link">
            <span className="brand-name">Access Compass</span>
            <span className="brand-byline">by Flare Access</span>
          </Link>
        </div>
        <div className="header-actions">
          <Link to="/dashboard" className="header-action-btn">Dashboard</Link>
        </div>
      </header>
      <div className="container">
        {/* Header */}
        <div className="diap-header">
          <div className="header-content">
            <h1>Disability Inclusion Action Plan</h1>
            <p>Track and manage your accessibility improvements</p>
          </div>
          <div className="diap-header-actions">
            <button className="btn-export" onClick={handleExportCSV}>
              Export CSV
            </button>
          </div>
        </div>

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

        {/* Evidence Layer - Module Completion Metadata */}
        {completedModulesEvidence.length > 0 && (
          <div className="evidence-layer">
            <div
              className="evidence-layer-header"
              onClick={() => setShowEvidence(!showEvidence)}
            >
              <h2>Assessment Evidence ({completedModulesEvidence.length} modules completed)</h2>
              <span className={`chevron ${showEvidence ? 'open' : ''}`}>&#9660;</span>
            </div>

            {showEvidence && (
              <div className="evidence-layer-content">
                <p className="evidence-intro">
                  These completed reviews provide the evidence base for your DIAP.
                  Each module's findings have been used to generate suggested actions.
                </p>

                <div className="evidence-grid">
                  {completedModulesEvidence.map(evidence => (
                    <div key={evidence.moduleId} className="evidence-card">
                      <div className="evidence-card-header">
                        <span className="evidence-module-name">{evidence.moduleName}</span>
                        <span className={`evidence-confidence confidence-${evidence.confidenceSnapshot || 'mixed'}`}>
                          {evidence.confidenceSnapshot === 'strong' && 'Strong'}
                          {evidence.confidenceSnapshot === 'mixed' && 'Mixed'}
                          {evidence.confidenceSnapshot === 'needs-work' && 'Needs work'}
                          {!evidence.confidenceSnapshot && 'Reviewed'}
                        </span>
                      </div>
                      <div className="evidence-card-body">
                        <span className="evidence-diap-section">{evidence.diapSection}</span>
                        <div className="evidence-stats">
                          <span className="evidence-stat positive">{evidence.doingWellCount} strengths</span>
                          <span className="evidence-stat action">{evidence.actionsCount} actions</span>
                        </div>
                      </div>
                      <div className="evidence-card-footer">
                        {evidence.completedBy && (
                          <span className="evidence-completed-by">
                            Completed by: {evidence.completedBy}
                          </span>
                        )}
                        {evidence.completedAt && (
                          <span className="evidence-completed-date">
                            {new Date(evidence.completedAt).toLocaleDateString('en-AU', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

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
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All ({items.length})
            </button>
            <button
              className={`tab ${activeTab === 'in-progress' ? 'active' : ''}`}
              onClick={() => setActiveTab('in-progress')}
            >
              In Progress ({stats.byStatus['in-progress']})
            </button>
            <button
              className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Completed ({stats.byStatus['completed']})
            </button>
          </div>

          <div className="filters">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as DIAPCategory | 'all')}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              <option value="physical-access">Physical Access</option>
              <option value="digital-access">Digital Access</option>
              <option value="communication">Communication</option>
              <option value="customer-service">Customer Service</option>
              <option value="policy-procedure">Policy & Procedure</option>
              <option value="training">Training</option>
              <option value="other">Other</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as DIAPPriority | 'all')}
              className="filter-select"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            <button
              className={`btn-add-item ${showAddForm ? 'active' : ''}`}
              onClick={() => setShowAddForm(!showAddForm)}
            >
              + Add Item
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingItem) && (
          <DIAPItemForm
            item={editingItem}
            onSave={(data) => {
              if (editingItem) {
                updateItem(editingItem.id, data);
              } else {
                createItem(data as Omit<DIAPItem, 'id' | 'sessionId' | 'createdAt' | 'updatedAt'>);
              }
              setShowAddForm(false);
              setEditingItem(null);
            }}
            onCancel={() => {
              setShowAddForm(false);
              setEditingItem(null);
            }}
          />
        )}

        {/* Items List */}
        <div className="diap-items-list">
          {filteredItems.length === 0 ? (
            <div className="empty-state">
              <p>No items found.</p>
              {activeTab !== 'all' && (
                <button onClick={() => setActiveTab('all')}>View all items</button>
              )}
            </div>
          ) : (
            filteredItems.map((item) => (
              <DIAPItemCard
                key={item.id}
                item={item}
                onStatusChange={handleStatusChange}
                onEdit={() => setEditingItem(item)}
                onDelete={() => deleteItem(item.id)}
              />
            ))
          )}
        </div>

        {/* Documents Section */}
        <div className="documents-section">
          <div
            className="section-header"
            onClick={() => setShowDocuments(!showDocuments)}
          >
            <h2>Supporting Documents ({documents.length})</h2>
            <span className={`chevron ${showDocuments ? 'open' : ''}`}>&#9660;</span>
          </div>

          {showDocuments && (
            <div className="documents-content">
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
          )}
        </div>

        {/* Quick Actions */}
        <div className="diap-actions">
          <Link to="/dashboard" className="btn btn-secondary">
            Back to Dashboard
          </Link>
          <Link to="/questions" className="btn btn-secondary">
            Continue Review
          </Link>
        </div>
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
}

function DIAPItemCard({ item, onStatusChange, onEdit, onDelete }: DIAPItemCardProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

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

  return (
    <div
      className={`diap-item-card status-${item.status}`}
      style={{ borderLeftColor: colors.border }}
    >
      <div className="item-header">
        <div className="item-badges">
          <span
            className="priority-badge"
            style={{ background: colors.bg, color: colors.text }}
          >
            {item.priority} priority
          </span>
          <span className="category-badge">{item.category.replace(/-/g, ' ')}</span>
        </div>
        <div className="item-actions">
          <button className="action-btn" onClick={onEdit}>Edit</button>
          <button className="action-btn delete" onClick={onDelete}>Delete</button>
        </div>
      </div>

      <h3 className="item-title">{item.objective}</h3>

      {item.action && (
        <p className="item-description">{item.action}</p>
      )}

      <div className="item-footer">
        <div className="status-selector">
          <button
            className={`status-btn status-${item.status}`}
            onClick={() => setShowStatusMenu(!showStatusMenu)}
          >
            {statusLabels[item.status]}
            <span className="dropdown-arrow">&#9660;</span>
          </button>

          {showStatusMenu && (
            <div className="status-menu">
              {Object.entries(statusLabels).map(([status, label]) => (
                <button
                  key={status}
                  className={`status-option ${status === item.status ? 'active' : ''}`}
                  onClick={() => {
                    onStatusChange(item.id, status as DIAPStatus);
                    setShowStatusMenu(false);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="item-meta">
          {item.responsibleRole && <span className="owner">Owner: {item.responsibleRole}</span>}
          {item.timeframe && (
            <span className="due-date">Timeframe: {item.timeframe}</span>
          )}
        </div>
      </div>

      {item.moduleSource && (
        <div className="item-source">
          From module: {item.moduleSource}
        </div>
      )}
    </div>
  );
}

// DIAP Item Form Component
interface DIAPItemFormProps {
  item?: DIAPItem | null;
  onSave: (data: Partial<DIAPItem>) => void;
  onCancel: () => void;
}

function DIAPItemForm({ item, onSave, onCancel }: DIAPItemFormProps) {
  const [formData, setFormData] = useState({
    objective: item?.objective || '',
    action: item?.action || '',
    category: item?.category || 'physical-access' as DIAPCategory,
    priority: item?.priority || 'medium' as DIAPPriority,
    status: item?.status || 'not-started' as DIAPStatus,
    timeframe: item?.timeframe || '30-90 days',
    responsibleRole: item?.responsibleRole || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.objective.trim()) return;
    onSave(formData);
  };

  return (
    <form className="diap-item-form" onSubmit={handleSubmit}>
      <h3>{item ? 'Edit Item' : 'Add New Item'}</h3>

      <div className="form-row">
        <label>
          Objective *
          <input
            type="text"
            value={formData.objective}
            onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
            placeholder="What do you want to achieve?"
            required
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Action
          <textarea
            value={formData.action}
            onChange={(e) => setFormData({ ...formData, action: e.target.value })}
            placeholder="What steps will you take?"
            rows={3}
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
            <option value="digital-access">Digital Access</option>
            <option value="communication">Communication</option>
            <option value="customer-service">Customer Service</option>
            <option value="policy-procedure">Policy & Procedure</option>
            <option value="training">Training</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label>
          Priority
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as DIAPPriority })}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>
      </div>

      <div className="form-row double">
        <label>
          Responsible Person/Role
          <input
            type="text"
            value={formData.responsibleRole}
            onChange={(e) => setFormData({ ...formData, responsibleRole: e.target.value })}
            placeholder="Who's responsible?"
          />
        </label>

        <label>
          Timeframe
          <select
            value={formData.timeframe}
            onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
          >
            <option value="0-30 days">0-30 days</option>
            <option value="30-90 days">30-90 days</option>
            <option value="3-12 months">3-12 months</option>
            <option value="Ongoing">Ongoing</option>
          </select>
        </label>
      </div>

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
