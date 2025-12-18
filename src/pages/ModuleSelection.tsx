import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, updateSelectedModules } from '../utils/session';
import { accessModules, moduleGroups } from '../data/accessModules';
import type { ModuleType } from '../types';
import '../styles/module-selection.css';

export default function ModuleSelection() {
  const navigate = useNavigate();
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  useEffect(() => {
    const session = getSession();
    // Check for business_types (new) or business_type (legacy)
    const hasBusinessInfo = (session?.business_snapshot?.business_types?.length ?? 0) > 0 ||
                            session?.business_snapshot?.business_type;
    if (!session || !hasBusinessInfo) {
      // Redirect to business snapshot if not completed
      navigate('/start');
      return;
    }

    // Pre-select modules if already saved
    if (session.selected_modules && session.selected_modules.length > 0) {
      setSelectedModules(session.selected_modules);
    }
  }, [navigate]);

  const toggleModule = (moduleId: string) => {
    if (selectedModules.includes(moduleId)) {
      setSelectedModules(selectedModules.filter((id) => id !== moduleId));
    } else {
      setSelectedModules([...selectedModules, moduleId]);
    }
  };

  const selectAllInGroup = (groupId: string) => {
    const groupModuleIds = accessModules
      .filter(m => m.group === groupId)
      .map(m => m.id);

    const allSelected = groupModuleIds.every(id => selectedModules.includes(id));

    if (allSelected) {
      // Deselect all in group
      setSelectedModules(selectedModules.filter(id => !groupModuleIds.includes(id)));
    } else {
      // Select all in group
      const newSelected = [...new Set([...selectedModules, ...groupModuleIds])];
      setSelectedModules(newSelected);
    }
  };

  const selectAll = () => {
    if (selectedModules.length === accessModules.length) {
      setSelectedModules([]);
    } else {
      setSelectedModules(accessModules.map(m => m.id));
    }
  };

  const handleContinue = () => {
    if (selectedModules.length === 0) {
      alert('Please select at least one module to continue');
      return;
    }

    // Save selected modules
    updateSelectedModules(selectedModules as ModuleType[]);

    // Navigate to discovery flow starting at calibration step
    navigate('/discovery?step=calibration');
  };

  // Group modules by their journey phase
  const groupedModules = moduleGroups.map(group => ({
    ...group,
    modules: accessModules.filter(m => m.group === group.id),
  }));

  // Calculate estimated time (using base time, review mode selected later)
  const totalTime = selectedModules.reduce((total, moduleId) => {
    const module = accessModules.find(m => m.id === moduleId);
    if (!module) return total;
    return total + module.estimatedTime;
  }, 0);

  return (
    <div className="module-selection-page">
      <div className="container">
        <div className="page-header">
          <h1>Choose your modules</h1>
          <p className="helper-text">
            Select the accessibility areas you'd like to review. You can choose individual modules
            or select entire groups. Come back anytime to review additional areas.
          </p>
        </div>

        {/* Select All */}
        <div className="select-all-row">
          <button className="select-all-btn" onClick={selectAll}>
            {selectedModules.length === accessModules.length ? 'Deselect all' : 'Select all modules'}
          </button>
          <span className="module-count-hint">
            {accessModules.length} modules available
          </span>
        </div>

        {/* Grouped Modules */}
        <div className="module-groups">
          {groupedModules.map(group => (
            <div key={group.id} className="module-group">
              <div className="group-header">
                <div className="group-info">
                  <h2 className="group-title">{group.label}</h2>
                  <p className="group-description">{group.description}</p>
                </div>
                <button
                  className="select-group-btn"
                  onClick={() => selectAllInGroup(group.id)}
                >
                  {group.modules.every(m => selectedModules.includes(m.id))
                    ? 'Deselect group'
                    : 'Select all'}
                </button>
              </div>

              <div className="modules-grid">
                {group.modules.map((module) => {
                  const isSelected = selectedModules.includes(module.id);

                  return (
                    <div
                      key={module.id}
                      className={`module-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleModule(module.id)}
                    >
                      <div className="module-header">
                        <div className="module-icon">{module.icon}</div>
                        <div className="checkbox-indicator">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleModule(module.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      <div className="module-content">
                        <h3 className="module-title">{module.name}</h3>
                        <p className="module-description">{module.description}</p>
                        <div className="module-meta">
                          <span className="module-code">{module.code}</span>
                          <span className="module-time">~{module.estimatedTime} min</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="selection-footer">
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/discovery')}
          >
            ← Back to discovery
          </button>
          <div className="selection-summary">
            <div className="module-counter">
              {selectedModules.length} module{selectedModules.length !== 1 ? 's' : ''} selected
            </div>
            {selectedModules.length > 0 && (
              <div className="time-estimate">
                Estimated time: ~{totalTime} minutes
              </div>
            )}
          </div>
          <button
            className="btn btn-primary"
            onClick={handleContinue}
            disabled={selectedModules.length === 0}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
