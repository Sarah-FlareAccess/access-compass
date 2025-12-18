// ============================================
// ACCESS COMPASS - DISCOVERY SUMMARY PAGE
// ============================================
// For returning users to review and modify their discovery selections
// ============================================

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getSession, updateSession, getDiscoveryData, updateDiscoveryData, clearDiscoveryData } from '../utils/session';
import { JOURNEY_PHASES } from '../data/touchpoints';
import { MODULES } from '../lib/recommendationEngine';
import '../components/discovery/discovery.css';
import './DiscoverySummary.css';

interface BusinessContext {
  hasPhysicalVenue: boolean | null;
  hasOnlinePresence: boolean | null;
  servesPublicCustomers: boolean | null;
  hasOnlineServices: boolean | null;
}

export default function DiscoverySummary() {
  const navigate = useNavigate();
  const session = getSession();
  const storedDiscovery = getDiscoveryData();

  // Check if user has completed discovery
  const discoveryData = storedDiscovery?.discovery_data;
  const hasCompletedDiscovery = (discoveryData?.selectedTouchpoints?.length ?? 0) > 0;

  // Local state for editing
  const [isEditingContext, setIsEditingContext] = useState(false);
  const [isEditingTouchpoints, setIsEditingTouchpoints] = useState(false);
  const [isEditingModules, setIsEditingModules] = useState(false);

  // Editable values
  const [businessContext, setBusinessContext] = useState<BusinessContext>({
    hasPhysicalVenue: session?.business_snapshot?.has_physical_venue ?? null,
    hasOnlinePresence: session?.business_snapshot?.has_online_presence ?? null,
    servesPublicCustomers: session?.business_snapshot?.serves_public_customers ?? null,
    hasOnlineServices: session?.business_snapshot?.has_online_services ?? null,
  });

  const [selectedTouchpoints, setSelectedTouchpoints] = useState<string[]>(
    discoveryData?.selectedTouchpoints || []
  );

  const [selectedModules, setSelectedModules] = useState<string[]>(
    storedDiscovery?.recommended_modules || []
  );

  // Redirect if no discovery data
  useEffect(() => {
    if (!hasCompletedDiscovery) {
      navigate('/discovery');
    }
  }, [hasCompletedDiscovery, navigate]);

  if (!hasCompletedDiscovery) {
    return null;
  }

  // Get touchpoint labels
  const getTouchpointLabel = (id: string) => {
    for (const phase of JOURNEY_PHASES) {
      const touchpoint = phase.touchpoints.find(t => t.id === id);
      if (touchpoint) return touchpoint.label;
    }
    return id;
  };

  // Get module by ID
  const getModule = (id: string) => {
    return MODULES.find(m => m.id === id);
  };

  // Group touchpoints by phase
  const touchpointsByPhase = JOURNEY_PHASES.map(phase => ({
    phase,
    selected: selectedTouchpoints.filter(tpId =>
      phase.touchpoints.some(t => t.id === tpId)
    ),
  })).filter(group => group.selected.length > 0);

  // Toggle touchpoint
  const toggleTouchpoint = (id: string) => {
    setSelectedTouchpoints(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  // Toggle module
  const toggleModule = (id: string) => {
    setSelectedModules(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  // Save changes
  const handleSaveContext = () => {
    updateSession({
      business_snapshot: {
        organisation_name: session?.business_snapshot?.organisation_name ?? '',
        organisation_size: session?.business_snapshot?.organisation_size ?? 'small',
        business_types: session?.business_snapshot?.business_types ?? [],
        user_role: session?.business_snapshot?.user_role ?? 'owner',
        has_physical_venue: businessContext.hasPhysicalVenue ?? false,
        has_online_presence: businessContext.hasOnlinePresence ?? false,
        serves_public_customers: businessContext.servesPublicCustomers ?? false,
        has_online_services: businessContext.hasOnlineServices ?? false,
      },
    });
    setIsEditingContext(false);
  };

  const handleSaveTouchpoints = () => {
    updateDiscoveryData({
      discovery_data: {
        ...discoveryData,
        selectedTouchpoints,
        selectedSubTouchpoints: discoveryData?.selectedSubTouchpoints || [],
      },
    });
    setIsEditingTouchpoints(false);
  };

  const handleSaveModules = () => {
    updateDiscoveryData({
      recommended_modules: selectedModules,
    });
    setIsEditingModules(false);
  };

  // Start fresh
  const handleStartFresh = () => {
    if (confirm('This will clear your discovery data and start over. Continue?')) {
      clearDiscoveryData();
      navigate('/discovery');
    }
  };

  // Continue to dashboard
  const handleContinue = () => {
    navigate('/dashboard');
  };

  return (
    <div className="discovery-summary-page">
      <div className="summary-container">
        {/* Header */}
        <div className="summary-header">
          <h1>Your Discovery Summary</h1>
          <p>Review and update your accessibility focus areas</p>
        </div>

        {/* Business Context Section */}
        <div className="summary-section">
          <div className="section-header">
            <h2>Business Context</h2>
            {!isEditingContext ? (
              <button className="btn-edit" onClick={() => setIsEditingContext(true)}>
                Edit
              </button>
            ) : (
              <div className="edit-actions">
                <button className="btn-save" onClick={handleSaveContext}>Save</button>
                <button className="btn-cancel" onClick={() => setIsEditingContext(false)}>Cancel</button>
              </div>
            )}
          </div>

          {!isEditingContext ? (
            <div className="context-display">
              <div className="context-item">
                <span className="context-label">Physical venue:</span>
                <span className={`context-value ${businessContext.hasPhysicalVenue ? 'yes' : 'no'}`}>
                  {businessContext.hasPhysicalVenue ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="context-item">
                <span className="context-label">Online presence:</span>
                <span className={`context-value ${businessContext.hasOnlinePresence ? 'yes' : 'no'}`}>
                  {businessContext.hasOnlinePresence ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="context-item">
                <span className="context-label">Public-facing customers:</span>
                <span className={`context-value ${businessContext.servesPublicCustomers ? 'yes' : 'no'}`}>
                  {businessContext.servesPublicCustomers ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="context-item">
                <span className="context-label">Online services:</span>
                <span className={`context-value ${businessContext.hasOnlineServices ? 'yes' : 'no'}`}>
                  {businessContext.hasOnlineServices ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          ) : (
            <div className="context-edit">
              {[
                { key: 'hasPhysicalVenue', label: 'Do you have a physical venue?' },
                { key: 'hasOnlinePresence', label: 'Do you have an online presence?' },
                { key: 'servesPublicCustomers', label: 'Do you serve public-facing customers?' },
                { key: 'hasOnlineServices', label: 'Do you operate online services?' },
              ].map(({ key, label }) => (
                <div key={key} className="context-edit-item">
                  <span className="context-label">{label}</span>
                  <div className="radio-group-inline">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name={key}
                        checked={businessContext[key as keyof BusinessContext] === true}
                        onChange={() => setBusinessContext(prev => ({ ...prev, [key]: true }))}
                      />
                      Yes
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name={key}
                        checked={businessContext[key as keyof BusinessContext] === false}
                        onChange={() => setBusinessContext(prev => ({ ...prev, [key]: false }))}
                      />
                      No
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Touchpoints Section */}
        <div className="summary-section">
          <div className="section-header">
            <h2>Selected Touchpoints</h2>
            {!isEditingTouchpoints ? (
              <button className="btn-edit" onClick={() => setIsEditingTouchpoints(true)}>
                Edit
              </button>
            ) : (
              <div className="edit-actions">
                <button className="btn-save" onClick={handleSaveTouchpoints}>Save</button>
                <button className="btn-cancel" onClick={() => setIsEditingTouchpoints(false)}>Cancel</button>
              </div>
            )}
          </div>

          {!isEditingTouchpoints ? (
            <div className="touchpoints-display">
              {touchpointsByPhase.length > 0 ? (
                touchpointsByPhase.map(({ phase, selected }) => (
                  <div key={phase.id} className="touchpoint-group">
                    <h4 className="group-label">{phase.label}</h4>
                    <div className="touchpoint-tags">
                      {selected.map(tpId => (
                        <span key={tpId} className="touchpoint-tag">
                          {getTouchpointLabel(tpId)}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-message">No touchpoints selected</p>
              )}
            </div>
          ) : (
            <div className="touchpoints-edit">
              {JOURNEY_PHASES.map(phase => (
                <div key={phase.id} className="touchpoint-edit-group">
                  <h4 className="group-label">{phase.label}</h4>
                  <div className="touchpoint-checkboxes">
                    {phase.touchpoints.map(tp => (
                      <label key={tp.id} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedTouchpoints.includes(tp.id)}
                          onChange={() => toggleTouchpoint(tp.id)}
                        />
                        <span>{tp.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modules Section */}
        <div className="summary-section">
          <div className="section-header">
            <h2>Selected Modules</h2>
            <span className="module-count">{selectedModules.length} modules</span>
            {!isEditingModules ? (
              <button className="btn-edit" onClick={() => setIsEditingModules(true)}>
                Edit
              </button>
            ) : (
              <div className="edit-actions">
                <button className="btn-save" onClick={handleSaveModules}>Save</button>
                <button className="btn-cancel" onClick={() => setIsEditingModules(false)}>Cancel</button>
              </div>
            )}
          </div>

          {!isEditingModules ? (
            <div className="modules-display">
              {selectedModules.length > 0 ? (
                <div className="module-tags">
                  {selectedModules.map(moduleId => {
                    const module = getModule(moduleId);
                    return module ? (
                      <span key={moduleId} className="module-tag">
                        <span className="module-code">{module.id}</span>
                        {module.name}
                      </span>
                    ) : null;
                  })}
                </div>
              ) : (
                <p className="empty-message">No modules selected</p>
              )}
            </div>
          ) : (
            <div className="modules-edit">
              <div className="module-checkboxes">
                {MODULES.map(module => (
                  <label key={module.id} className="checkbox-label module-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedModules.includes(module.id)}
                      onChange={() => toggleModule(module.id)}
                    />
                    <span className="module-code">{module.id}</span>
                    <span className="module-name">{module.name}</span>
                    <span className="module-time">{module.estimatedTime} min</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="summary-actions">
          <button className="btn-primary" onClick={handleContinue}>
            Continue to Dashboard →
          </button>
          <button className="btn-secondary" onClick={handleStartFresh}>
            Start Fresh
          </button>
        </div>

        {/* Back Link */}
        <div className="back-link-wrapper">
          <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
