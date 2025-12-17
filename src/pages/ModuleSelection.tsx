import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, updateSelectedModules, updateDiscoveryData } from '../utils/session';
import { accessModules, moduleGroups } from '../data/accessModules';
import type { ReviewMode } from '../types';
import '../styles/module-selection.css';

export default function ModuleSelection() {
  const navigate = useNavigate();
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [reviewMode, setReviewMode] = useState<ReviewMode>('pulse-check');

  useEffect(() => {
    const session = getSession();
    // Check for business_types (new) or business_type (legacy)
    const hasBusinessInfo = session?.business_snapshot?.business_types?.length > 0 ||
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
    updateSelectedModules(selectedModules);

    // Save discovery data with manual selection flag and review mode
    updateDiscoveryData({
      discovery_data: {
        selectedTouchpoints: [],
        selectedSubTouchpoints: [],
      },
      review_mode: reviewMode,
      recommended_modules: selectedModules,
    });

    navigate('/dashboard');
  };

  // Group modules by their journey phase
  const groupedModules = moduleGroups.map(group => ({
    ...group,
    modules: accessModules.filter(m => m.group === group.id),
  }));

  // Calculate estimated time
  const totalTime = selectedModules.reduce((total, moduleId) => {
    const module = accessModules.find(m => m.id === moduleId);
    if (!module) return total;
    return total + (reviewMode === 'deep-dive' && module.estimatedTimeDeepDive
      ? module.estimatedTimeDeepDive
      : module.estimatedTime);
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

        {/* Review Mode Selection */}
        <div className="review-mode-selector">
          <label className="review-mode-label">Review depth:</label>
          <div className="review-mode-options">
            <button
              className={`review-mode-btn ${reviewMode === 'pulse-check' ? 'active' : ''}`}
              onClick={() => setReviewMode('pulse-check')}
            >
              <span className="mode-name">Pulse Check</span>
              <span className="mode-desc">Quick overview</span>
            </button>
            <button
              className={`review-mode-btn ${reviewMode === 'deep-dive' ? 'active' : ''}`}
              onClick={() => setReviewMode('deep-dive')}
            >
              <span className="mode-name">Deep Dive</span>
              <span className="mode-desc">Comprehensive review</span>
            </button>
          </div>
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
                  const estimatedTime = reviewMode === 'deep-dive' && module.estimatedTimeDeepDive
                    ? module.estimatedTimeDeepDive
                    : module.estimatedTime;

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
                          <span className="module-time">~{estimatedTime} min</span>
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
            Continue to dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}
