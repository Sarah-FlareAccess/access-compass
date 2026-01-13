/**
 * ReportConfigSelector Component
 *
 * Allows users to select which assessment runs to include in their report.
 * Supports:
 * - Quick selection by context (team, department, event, etc.)
 * - Custom selection of specific modules and runs
 * - Progress comparison toggle
 */

import { useState, useMemo } from 'react';
import type { ModuleRun, ModuleRunContext } from '../hooks/useModuleProgress';
import { accessModules } from '../data/accessModules';
import './ReportConfigSelector.css';

// Selection for a single module
export interface ModuleRunSelection {
  moduleId: string;
  moduleName: string;
  moduleCode: string;
  selectedRunId: string | null;  // null means use current/default
  availableRuns: ModuleRun[];
}

// Complete report configuration
export interface ReportConfig {
  filterType: 'all' | 'context' | 'custom';
  contextFilter?: string;  // The context name to filter by
  moduleSelections: ModuleRunSelection[];
  includeProgressComparison: boolean;
  comparisonRunId?: string;  // Run to compare against (most recent by default)
}

interface ReportConfigSelectorProps {
  selectedModuleIds: string[];
  getModuleRuns: (moduleId: string) => ModuleRun[];
  currentProgress: Record<string, { activeRunId?: string; status: string }>;
  onConfigChange: (config: ReportConfig) => void;
  initialConfig?: ReportConfig;
}

export function ReportConfigSelector({
  selectedModuleIds,
  getModuleRuns,
  currentProgress,
  onConfigChange,
  initialConfig,
}: ReportConfigSelectorProps) {
  const [filterType, setFilterType] = useState<'all' | 'context' | 'custom'>(
    initialConfig?.filterType || 'all'
  );
  const [contextFilter, setContextFilter] = useState<string>(
    initialConfig?.contextFilter || ''
  );
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customSelections, setCustomSelections] = useState<Record<string, string | null>>({});
  const [includeComparison, setIncludeComparison] = useState(
    initialConfig?.includeProgressComparison || false
  );

  // Get all unique contexts from all runs across all modules
  const allContexts = useMemo(() => {
    const contexts = new Map<string, { type: ModuleRunContext['type']; name: string; count: number }>();

    selectedModuleIds.forEach(moduleId => {
      const runs = getModuleRuns(moduleId);
      runs.forEach(run => {
        const key = run.context.name;
        const existing = contexts.get(key);
        if (existing) {
          existing.count++;
        } else {
          contexts.set(key, {
            type: run.context.type,
            name: run.context.name,
            count: 1,
          });
        }
      });
    });

    return Array.from(contexts.values()).sort((a, b) => b.count - a.count);
  }, [selectedModuleIds, getModuleRuns]);

  // Build module selections based on current filter
  const moduleSelections = useMemo((): ModuleRunSelection[] => {
    return selectedModuleIds.map(moduleId => {
      const module = accessModules.find(m => m.id === moduleId);
      const runs = getModuleRuns(moduleId);
      const progress = currentProgress[moduleId];

      let selectedRunId: string | null = null;

      if (filterType === 'context' && contextFilter) {
        // Find run matching the context
        const matchingRun = runs.find(r => r.context.name === contextFilter);
        selectedRunId = matchingRun?.id || null;
      } else if (filterType === 'custom') {
        selectedRunId = customSelections[moduleId] ?? progress?.activeRunId ?? null;
      } else {
        // 'all' - use current/active run
        selectedRunId = progress?.activeRunId || (runs.length > 0 ? runs[runs.length - 1]?.id : null);
      }

      return {
        moduleId,
        moduleName: module?.name || moduleId,
        moduleCode: module?.code || moduleId,
        selectedRunId,
        availableRuns: runs,
      };
    });
  }, [selectedModuleIds, getModuleRuns, currentProgress, filterType, contextFilter, customSelections]);

  // Check if there are previous runs to compare against
  const hasPreviousRuns = useMemo(() => {
    return selectedModuleIds.some(moduleId => {
      const runs = getModuleRuns(moduleId);
      return runs.length > 1;
    });
  }, [selectedModuleIds, getModuleRuns]);

  // Emit config changes
  const emitConfig = (updates: Partial<{
    filterType: 'all' | 'context' | 'custom';
    contextFilter: string;
    customSelections: Record<string, string | null>;
    includeComparison: boolean;
  }>) => {
    const newFilterType = updates.filterType ?? filterType;
    const newContextFilter = updates.contextFilter ?? contextFilter;
    const newIncludeComparison = updates.includeComparison ?? includeComparison;

    const config: ReportConfig = {
      filterType: newFilterType,
      contextFilter: newFilterType === 'context' ? newContextFilter : undefined,
      moduleSelections,
      includeProgressComparison: newIncludeComparison,
    };

    onConfigChange(config);
  };

  const handleFilterChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomModal(true);
      return;
    }

    if (value === 'all') {
      setFilterType('all');
      setContextFilter('');
      emitConfig({ filterType: 'all', contextFilter: '' });
    } else {
      setFilterType('context');
      setContextFilter(value);
      emitConfig({ filterType: 'context', contextFilter: value });
    }
  };

  const handleCustomSelectionChange = (moduleId: string, runId: string | null) => {
    setCustomSelections(prev => ({
      ...prev,
      [moduleId]: runId,
    }));
  };

  const handleApplyCustomSelection = () => {
    setFilterType('custom');
    setShowCustomModal(false);
    emitConfig({ filterType: 'custom', customSelections });
  };

  const handleComparisonToggle = (checked: boolean) => {
    setIncludeComparison(checked);
    emitConfig({ includeComparison: checked });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getContextTypeLabel = (type: ModuleRunContext['type']) => {
    const labels: Record<ModuleRunContext['type'], string> = {
      general: 'General',
      team: 'Team',
      department: 'Department',
      event: 'Event',
      location: 'Location',
      experience: 'Experience',
      other: 'Other',
    };
    return labels[type] || type;
  };

  return (
    <div className="report-config-selector">
      <h3>Generate report for</h3>

      <div className="config-row">
        <select
          value={filterType === 'context' ? contextFilter : filterType}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="context-select"
        >
          <option value="all">All assessments (current data)</option>
          {allContexts.length > 0 && (
            <optgroup label="Filter by context">
              {allContexts.map(ctx => (
                <option key={ctx.name} value={ctx.name}>
                  {ctx.name} ({getContextTypeLabel(ctx.type)}) - {ctx.count} module{ctx.count !== 1 ? 's' : ''}
                </option>
              ))}
            </optgroup>
          )}
          <option value="custom">Custom selection...</option>
        </select>
      </div>

      {/* Progress comparison toggle */}
      {hasPreviousRuns && (
        <div className="config-row comparison-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={includeComparison}
              onChange={(e) => handleComparisonToggle(e.target.checked)}
            />
            <span className="toggle-text">
              <strong>Include progress comparison</strong>
              <span className="toggle-hint">Compare to most recent previous assessment</span>
            </span>
          </label>
        </div>
      )}

      {/* Show current selection summary */}
      {filterType !== 'all' && (
        <div className="selection-summary">
          {filterType === 'context' && (
            <p>
              Showing data for: <strong>{contextFilter}</strong>
              {moduleSelections.filter(m => m.selectedRunId).length < moduleSelections.length && (
                <span className="warning">
                  ({moduleSelections.length - moduleSelections.filter(m => m.selectedRunId).length} module(s) have no matching assessment)
                </span>
              )}
            </p>
          )}
          {filterType === 'custom' && (
            <p>
              Custom selection: {moduleSelections.filter(m => m.selectedRunId).length} of {moduleSelections.length} modules
              <button
                className="btn-edit-selection"
                onClick={() => setShowCustomModal(true)}
              >
                Edit
              </button>
            </p>
          )}
        </div>
      )}

      {/* Custom Selection Modal */}
      {showCustomModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <div className="custom-modal-header">
              <h3>Select modules and assessments</h3>
              <button className="close-btn" onClick={() => setShowCustomModal(false)}>×</button>
            </div>

            <div className="custom-modal-content">
              <p className="modal-intro">
                Choose which assessment to include for each module. Modules without a selection will be excluded from the report.
              </p>

              <div className="module-selection-list">
                {moduleSelections.map(selection => (
                  <div key={selection.moduleId} className="module-selection-item">
                    <div className="module-info">
                      <span className="module-code">{selection.moduleCode}</span>
                      <span className="module-name">{selection.moduleName}</span>
                    </div>

                    <select
                      value={customSelections[selection.moduleId] ?? selection.selectedRunId ?? ''}
                      onChange={(e) => handleCustomSelectionChange(
                        selection.moduleId,
                        e.target.value || null
                      )}
                      className="run-select"
                    >
                      <option value="">Exclude from report</option>
                      {selection.availableRuns.length === 0 ? (
                        <option value="" disabled>No assessments available</option>
                      ) : (
                        selection.availableRuns.map(run => (
                          <option key={run.id} value={run.id}>
                            {run.context.name} ({formatDate(run.completedAt || run.startedAt)})
                            {run.status === 'completed' ? ' ✓' : ' (in progress)'}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="custom-modal-footer">
              <button className="btn-secondary" onClick={() => setShowCustomModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleApplyCustomSelection}>
                Apply Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
