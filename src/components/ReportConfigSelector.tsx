/**
 * ReportConfigSelector Component
 *
 * Allows users to configure their report:
 * - Include/exclude individual modules via inline checkboxes
 * - Filter by context (team, department, event)
 * - Toggle progress comparison and evidence
 */

import { useState, useMemo, useCallback } from 'react';
import type { ModuleRun, ModuleRunContext } from '../hooks/useModuleProgress';
import { accessModules, moduleGroups } from '../data/accessModules';
import './ReportConfigSelector.css';

// Selection for a single module
export interface ModuleRunSelection {
  moduleId: string;
  moduleName: string;
  moduleCode: string;
  selectedRunId: string | null;  // null means excluded
  availableRuns: ModuleRun[];
}

// Complete report configuration
export interface ReportConfig {
  filterType: 'all' | 'context' | 'custom';
  contextFilter?: string;
  moduleSelections: ModuleRunSelection[];
  includeProgressComparison: boolean;
  comparisonRunId?: string;
  includeEvidence: boolean;
}

interface ReportConfigSelectorProps {
  selectedModuleIds: string[];
  getModuleRuns: (moduleId: string) => ModuleRun[];
  currentProgress: Record<string, { activeRunId?: string; status: string }>;
  onConfigChange: (config: ReportConfig) => void;
  initialConfig?: ReportConfig;
}

const GROUP_ORDER = ['before-arrival', 'getting-in', 'during-visit', 'service-support', 'organisational-commitment', 'events'];

export function ReportConfigSelector({
  selectedModuleIds,
  getModuleRuns,
  currentProgress,
  onConfigChange,
  initialConfig,
}: ReportConfigSelectorProps) {
  const [contextFilter, setContextFilter] = useState<string>(
    initialConfig?.contextFilter || ''
  );
  // Track which modules are excluded (by id). Starts empty = all included.
  const [excludedModules, setExcludedModules] = useState<Set<string>>(() => {
    if (initialConfig?.filterType === 'custom') {
      const excluded = new Set<string>();
      initialConfig.moduleSelections.forEach(s => {
        if (!s.selectedRunId) excluded.add(s.moduleId);
      });
      return excluded;
    }
    return new Set();
  });
  const [includeComparison, setIncludeComparison] = useState(
    initialConfig?.includeProgressComparison || false
  );
  const [includeEvidence, setIncludeEvidence] = useState(
    initialConfig?.includeEvidence ?? true
  );

  // Get all unique contexts from all runs
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
          contexts.set(key, { type: run.context.type, name: run.context.name, count: 1 });
        }
      });
    });
    return Array.from(contexts.values()).sort((a, b) => b.count - a.count);
  }, [selectedModuleIds, getModuleRuns]);

  // Build module info with group data for display
  const moduleEntries = useMemo(() => {
    return selectedModuleIds.map(moduleId => {
      const mod = accessModules.find(m => m.id === moduleId);
      const runs = getModuleRuns(moduleId);
      const prog = currentProgress[moduleId];
      return {
        moduleId,
        moduleName: mod?.name || moduleId,
        moduleCode: mod?.code || moduleId,
        group: mod?.group || 'during-visit',
        availableRuns: runs,
        activeRunId: prog?.activeRunId || (runs.length > 0 ? runs[runs.length - 1]?.id : null),
        status: prog?.status || 'not-started',
      };
    });
  }, [selectedModuleIds, getModuleRuns, currentProgress]);

  // Group modules by category
  const groupedModules = useMemo(() => {
    const groups: { groupId: string; label: string; modules: typeof moduleEntries }[] = [];
    for (const gId of GROUP_ORDER) {
      const groupDef = moduleGroups.find(g => g.id === gId);
      const mods = moduleEntries.filter(m => m.group === gId);
      if (mods.length > 0) {
        groups.push({ groupId: gId, label: groupDef?.label || gId, modules: mods });
      }
    }
    return groups;
  }, [moduleEntries]);

  const hasPreviousRuns = useMemo(() => {
    return selectedModuleIds.some(moduleId => getModuleRuns(moduleId).length > 1);
  }, [selectedModuleIds, getModuleRuns]);

  // Build selections and emit config
  const emitConfig = useCallback((
    ctx: string,
    excluded: Set<string>,
    comparison: boolean,
    evidence: boolean,
  ) => {
    const hasExclusions = excluded.size > 0;
    const selections: ModuleRunSelection[] = moduleEntries.map(entry => ({
      moduleId: entry.moduleId,
      moduleName: entry.moduleName,
      moduleCode: entry.moduleCode,
      selectedRunId: excluded.has(entry.moduleId) ? null : (
        ctx
          ? (entry.availableRuns.find(r => r.context.name === ctx)?.id || null)
          : entry.activeRunId
      ),
      availableRuns: entry.availableRuns,
    }));

    onConfigChange({
      filterType: hasExclusions ? 'custom' : (ctx ? 'context' : 'all'),
      contextFilter: ctx || undefined,
      moduleSelections: selections,
      includeProgressComparison: comparison,
      includeEvidence: evidence,
    });
  }, [moduleEntries, onConfigChange]);

  const handleContextChange = (value: string) => {
    const ctx = value === 'all' ? '' : value;
    setContextFilter(ctx);
    if (value === 'all') {
      setExcludedModules(new Set());
      emitConfig('', new Set(), includeComparison, includeEvidence);
    } else {
      emitConfig(ctx, excludedModules, includeComparison, includeEvidence);
    }
  };

  const handleModuleToggle = (moduleId: string) => {
    setExcludedModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      emitConfig(contextFilter, next, includeComparison, includeEvidence);
      return next;
    });
  };

  const handleSelectAllInGroup = (groupModuleIds: string[], include: boolean) => {
    setExcludedModules(prev => {
      const next = new Set(prev);
      for (const id of groupModuleIds) {
        if (include) {
          next.delete(id);
        } else {
          next.add(id);
        }
      }
      emitConfig(contextFilter, next, includeComparison, includeEvidence);
      return next;
    });
  };

  const handleComparisonToggle = (checked: boolean) => {
    setIncludeComparison(checked);
    emitConfig(contextFilter, excludedModules, checked, includeEvidence);
  };

  const handleEvidenceToggle = (checked: boolean) => {
    setIncludeEvidence(checked);
    emitConfig(contextFilter, excludedModules, includeComparison, checked);
  };

  const getContextTypeLabel = (type: ModuleRunContext['type']) => {
    const labels: Record<ModuleRunContext['type'], string> = {
      general: 'General', team: 'Team', department: 'Department',
      event: 'Event', location: 'Location', experience: 'Experience', other: 'Other',
    };
    return labels[type] || type;
  };

  const includedCount = selectedModuleIds.length - excludedModules.size;

  return (
    <div className="report-config-selector">
      <h3>Generate report for</h3>

      <div className="config-row">
        <select
          value={contextFilter || 'all'}
          onChange={(e) => handleContextChange(e.target.value)}
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
        </select>
      </div>

      {/* Inline module selection */}
      <details className="module-select-section">
        <summary className="module-select-toggle">
          Select modules
          <span className="module-select-count">{includedCount} of {selectedModuleIds.length} included</span>
        </summary>
        <div className="module-select-body">
          {groupedModules.map(group => {
            const groupIds = group.modules.map(m => m.moduleId);
            const allIncluded = groupIds.every(id => !excludedModules.has(id));
            const noneIncluded = groupIds.every(id => excludedModules.has(id));

            return (
              <fieldset key={group.groupId} className="module-select-group">
                <legend className="module-select-group-legend">
                  <span>{group.label}</span>
                  <span className="group-toggle-btns">
                    <button
                      type="button"
                      className="group-toggle-btn"
                      onClick={() => handleSelectAllInGroup(groupIds, true)}
                      disabled={allIncluded}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      className="group-toggle-btn"
                      onClick={() => handleSelectAllInGroup(groupIds, false)}
                      disabled={noneIncluded}
                    >
                      None
                    </button>
                  </span>
                </legend>
                {group.modules.map(mod => {
                  const isIncluded = !excludedModules.has(mod.moduleId);
                  const inputId = `mod-select-${mod.moduleId}`;
                  return (
                    <label key={mod.moduleId} className={`module-select-item${isIncluded ? '' : ' module-excluded'}`} htmlFor={inputId}>
                      <input
                        type="checkbox"
                        id={inputId}
                        checked={isIncluded}
                        onChange={() => handleModuleToggle(mod.moduleId)}
                      />
                      <span className="module-select-code">{mod.moduleCode}</span>
                      <span className="module-select-name">{mod.moduleName}</span>
                    </label>
                  );
                })}
              </fieldset>
            );
          })}
        </div>
      </details>

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

      {/* Include evidence toggle */}
      <div className="config-row comparison-toggle">
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={includeEvidence}
            onChange={(e) => handleEvidenceToggle(e.target.checked)}
          />
          <span className="toggle-text">
            <strong>Include evidence</strong>
            <span className="toggle-hint">Show photos, documents, and notes attached to questions</span>
          </span>
        </label>
      </div>
    </div>
  );
}
