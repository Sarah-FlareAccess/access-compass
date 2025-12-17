import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, updateSelectedModules } from '../utils/session';
import { modules } from '../data/modules';
import type { ModuleType } from '../types';
import '../styles/module-selection.css';

export default function ModuleSelection() {
  const navigate = useNavigate();
  const [selectedModules, setSelectedModules] = useState<ModuleType[]>([]);
  const [businessSnapshot, setBusinessSnapshot] = useState<any>(null);

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

    setBusinessSnapshot(session.business_snapshot);

    // Pre-select modules if already saved
    if (session.selected_modules && session.selected_modules.length > 0) {
      setSelectedModules(session.selected_modules);
    }
  }, [navigate]);

  const toggleModule = (moduleId: ModuleType) => {
    if (selectedModules.includes(moduleId)) {
      setSelectedModules(selectedModules.filter((id) => id !== moduleId));
    } else {
      setSelectedModules([...selectedModules, moduleId]);
    }
  };

  const handleContinue = () => {
    if (selectedModules.length === 0) {
      alert('Please select at least one module to continue');
      return;
    }

    updateSelectedModules(selectedModules);
    navigate('/questions');
  };

  if (!businessSnapshot) {
    return null; // Loading or redirecting
  }

  return (
    <div className="module-selection-page">
      <div className="container">
        <div className="page-header">
          <h1>Choose what you want to review today</h1>
          <p className="helper-text">
            Select the areas most relevant to your business. You can come back to other areas
            later.
          </p>
        </div>

        <div className="modules-grid">
          {modules.map((module) => {
            const isRecommended = module.recommended_if(businessSnapshot);
            const isSelected = selectedModules.includes(module.id);

            return (
              <div
                key={module.id}
                className={`module-card ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleModule(module.id)}
              >
                {isRecommended && <div className="recommended-badge">Recommended</div>}
                <div className="module-icon">{module.icon}</div>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
                <div className="checkbox-indicator">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleModule(module.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="selection-footer">
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/discovery')}
          >
            ← Back
          </button>
          <div className="module-counter">
            {selectedModules.length} module{selectedModules.length !== 1 ? 's' : ''} selected
          </div>
          <button
            className="btn btn-primary"
            onClick={handleContinue}
            disabled={selectedModules.length === 0}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
