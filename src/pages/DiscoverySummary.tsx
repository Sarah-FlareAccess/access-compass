// ============================================
// ACCESS COMPASS - DISCOVERY SUMMARY PAGE
// ============================================
// For returning users to review and modify their discovery selections
// ============================================

import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getSession, updateSession, getDiscoveryData, updateDiscoveryData, clearDiscoveryData } from '../utils/session';
import { JOURNEY_PHASES } from '../data/touchpoints';
import { MODULES } from '../lib/recommendationEngine';
import type { JourneyPhase } from '../types';
import { PageFooter } from '../components/PageFooter';
import { ModuleDetailModal } from '../components/discovery/ModuleDetailModal';
import '../components/discovery/discovery.css';
import './DiscoverySummary.css';

// Journey phase labels for grouping modules
const JOURNEY_PHASE_LABELS: Record<JourneyPhase, string> = {
  'before-arrival': 'Before They Arrive',
  'during-visit': 'During Their Visit',
  'after-visit': 'After Their Visit',
  'policy-operations': 'Policy & Operations',
};

type AssessmentType = 'business' | 'event' | 'both';

interface BusinessContext {
  hasPhysicalVenue: boolean | null;
  hasOnlinePresence: boolean | null;
  servesPublicCustomers: boolean | null;
  hasOnlineServices: boolean | null;
  assessmentType: AssessmentType;
}

export default function DiscoverySummary() {
  const navigate = useNavigate();
  const session = getSession();
  const storedDiscovery = getDiscoveryData();

  // Check if user has completed discovery or has modules
  const discoveryData = storedDiscovery?.discovery_data;
  const hasCompletedDiscovery = (discoveryData?.selectedTouchpoints?.length ?? 0) > 0;
  const hasModules = (storedDiscovery?.recommended_modules?.length ?? 0) > 0;
  const hasAnyData = hasCompletedDiscovery || hasModules || session?.business_snapshot;

  // Local state for editing
  const [isEditingContext, setIsEditingContext] = useState(false);
  const [isEditingModules, setIsEditingModules] = useState(false);

  // Modal state for touchpoint edit confirmation
  const [showTouchpointEditWarning, setShowTouchpointEditWarning] = useState(false);

  // Module detail modal state
  const [moduleDetailId, setModuleDetailId] = useState<string | null>(null);

  // Editable values
  const [businessContext, setBusinessContext] = useState<BusinessContext>(() => {
    // Get assessmentType from discoveryData or default to 'business'
    const assessmentType: AssessmentType = discoveryData?.businessContext?.assessmentType || 'business';

    return {
      hasPhysicalVenue: session?.business_snapshot?.has_physical_venue ?? null,
      hasOnlinePresence: session?.business_snapshot?.has_online_presence ?? null,
      servesPublicCustomers: session?.business_snapshot?.serves_public_customers ?? null,
      hasOnlineServices: session?.business_snapshot?.has_online_services ?? null,
      assessmentType,
    };
  });

  const [selectedTouchpoints] = useState<string[]>(
    discoveryData?.selectedTouchpoints || []
  );

  const [selectedModules, setSelectedModules] = useState<string[]>(
    storedDiscovery?.recommended_modules || []
  );

  // Redirect only if no data at all (no session, no discovery, no modules)
  useEffect(() => {
    if (!hasAnyData) {
      navigate('/discovery');
    }
  }, [hasAnyData, navigate]);

  if (!hasAnyData) {
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

  // Group selected modules by journey phase
  const modulesByPhase = useMemo(() => {
    const phases: JourneyPhase[] = ['before-arrival', 'during-visit', 'after-visit', 'policy-operations'];
    return phases.map(phase => ({
      phase,
      label: JOURNEY_PHASE_LABELS[phase],
      modules: selectedModules
        .map(id => getModule(id))
        .filter(m => m && m.journeyTheme === phase) as typeof MODULES,
    })).filter(group => group.modules.length > 0);
  }, [selectedModules]);

  // Toggle module
  const toggleModule = (id: string) => {
    setSelectedModules(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  // Event module IDs
  const eventModuleIds = ['E1', 'E2', 'E3', 'E4', 'E5'];

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

    // Update modules based on assessment type
    let updatedModules = [...selectedModules];

    if (businessContext.assessmentType === 'event' || businessContext.assessmentType === 'both') {
      // Add event modules if not already present
      eventModuleIds.forEach(id => {
        if (!updatedModules.includes(id)) {
          updatedModules.push(id);
        }
      });
    } else {
      // Remove event modules for business-only assessment
      updatedModules = updatedModules.filter(id => !eventModuleIds.includes(id));
    }

    // Update local state
    setSelectedModules(updatedModules);

    // Also update the discovery data with assessmentType and modules
    updateDiscoveryData({
      recommended_modules: updatedModules,
      discovery_data: {
        selectedTouchpoints: discoveryData?.selectedTouchpoints || [],
        selectedSubTouchpoints: discoveryData?.selectedSubTouchpoints || [],
        notApplicablePhases: discoveryData?.notApplicablePhases,
        explicitlyCompleted: discoveryData?.explicitlyCompleted,
        businessContext: {
          ...discoveryData?.businessContext,
          hasPhysicalVenue: businessContext.hasPhysicalVenue ?? false,
          hasOnlinePresence: businessContext.hasOnlinePresence ?? false,
          servesPublicCustomers: businessContext.servesPublicCustomers ?? false,
          hasOnlineServices: businessContext.hasOnlineServices ?? false,
          assessmentType: businessContext.assessmentType,
        },
      },
    });
    setIsEditingContext(false);
  };

  // Handle touchpoint edit - redirect to full discovery flow
  const handleTouchpointEditConfirm = () => {
    setShowTouchpointEditWarning(false);
    // Navigate to discovery page with edit flag to pre-populate existing data
    navigate('/discovery?edit=true');
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

        {/* Warning for incomplete discovery */}
        {!hasCompletedDiscovery && hasModules && (
          <div className="discovery-incomplete-banner">
            <span className="banner-icon">⚠️</span>
            <div className="banner-content">
              <strong>Discovery not completed</strong>
              <p>Your modules were selected without completing the discovery process. Complete discovery to get personalised recommendations based on your customer touchpoints.</p>
              <Link to="/discovery" className="banner-link">Complete Discovery →</Link>
            </div>
          </div>
        )}

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
              <div className="context-item context-item-highlight">
                <span className="context-label">Assessment type:</span>
                <span className={`context-value ${businessContext.assessmentType}`}>
                  {businessContext.assessmentType === 'event' && '🎪 Standalone Event'}
                  {businessContext.assessmentType === 'business' && 'Ongoing Business Operations'}
                  {businessContext.assessmentType === 'both' && '🏢 + 🎪 Both'}
                </span>
              </div>
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
              {/* Assessment Type Toggle - Card Style */}
              <div className="context-edit-item context-edit-item-assessment">
                <span className="context-label">What are you assessing?</span>
                <div className="assessment-type-cards">
                  <label className={`assessment-card ${businessContext.assessmentType === 'business' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="assessmentType"
                      checked={businessContext.assessmentType === 'business'}
                      onChange={() => setBusinessContext(prev => ({ ...prev, assessmentType: 'business' }))}
                    />
                    <div className="assessment-card-content">
                      <span className="assessment-card-title">Ongoing business operations</span>
                      <span className="assessment-card-desc">Your venue, services, website, and day-to-day customer experience</span>
                    </div>
                  </label>
                  <label className={`assessment-card ${businessContext.assessmentType === 'event' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="assessmentType"
                      checked={businessContext.assessmentType === 'event'}
                      onChange={() => setBusinessContext(prev => ({ ...prev, assessmentType: 'event' }))}
                    />
                    <div className="assessment-card-content">
                      <span className="assessment-card-title">🎪 Standalone event assessment</span>
                      <span className="assessment-card-desc">A specific event like a festival, conference, concert, market, or function</span>
                    </div>
                  </label>
                  <label className={`assessment-card ${businessContext.assessmentType === 'both' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="assessmentType"
                      checked={businessContext.assessmentType === 'both'}
                      onChange={() => setBusinessContext(prev => ({ ...prev, assessmentType: 'both' }))}
                    />
                    <div className="assessment-card-content">
                      <span className="assessment-card-title">🏢 + 🎪 Both</span>
                      <span className="assessment-card-desc">Assess both your ongoing operations AND a specific event</span>
                    </div>
                  </label>
                </div>
                {(businessContext.assessmentType === 'event' || businessContext.assessmentType === 'both') && (
                  <p className="assessment-note">
                    {businessContext.assessmentType === 'event'
                      ? 'Event assessments use the 5 standalone Event modules. You\'ll need to re-run discovery to update your module recommendations.'
                      : 'Combined assessments include both organisational modules AND the 5 Event modules. Re-run discovery to update recommendations.'}
                  </p>
                )}
              </div>

              {/* Separator */}
              <div className="context-edit-separator" />

              {/* Business Context Questions */}
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
            <button className="btn-edit" onClick={() => setShowTouchpointEditWarning(true)}>
              Edit
            </button>
          </div>

          <div className="touchpoints-display">
            {touchpointsByPhase.length > 0 ? (
              touchpointsByPhase.map(({ phase, selected }) => (
                <div key={phase.id} className="touchpoint-group">
                  <h3 className="group-label">{phase.label}</h3>
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
        </div>

        {/* Touchpoint Edit Warning Modal */}
        {showTouchpointEditWarning && (
          <div className="warning-modal-overlay" onClick={() => setShowTouchpointEditWarning(false)}>
            <div className="warning-modal" onClick={(e) => e.stopPropagation()}>
              <div className="warning-modal-icon">⚠️</div>
              <h3>Update Your Visitor Journey?</h3>
              <p>
                Editing your visitor journey will recalculate your recommended modules, which may affect your plan.
              </p>
              <p className="warning-modal-detail">
                You'll go through the full discovery process with your current selections pre-filled. Your existing module progress will be preserved.
              </p>
              <div className="warning-modal-actions">
                <button
                  className="btn-cancel"
                  onClick={() => setShowTouchpointEditWarning(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-confirm"
                  onClick={handleTouchpointEditConfirm}
                >
                  Continue to Edit
                </button>
              </div>
            </div>
          </div>
        )}

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
              {modulesByPhase.length > 0 ? (
                <div className="modules-by-phase">
                  {modulesByPhase.map(({ phase, label, modules }) => (
                    <div key={phase} className="module-phase-group">
                      <h3 className="group-label">{label}</h3>
                      <div className="module-tags">
                        {modules.map(module => (
                          <button
                            key={module.id}
                            type="button"
                            className="module-tag clickable"
                            onClick={() => setModuleDetailId(module.id)}
                            aria-label={`View details for ${module.name}`}
                          >
                            {module.name}
                            <span className="module-tag-arrow">→</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-message">No modules selected</p>
              )}
            </div>
          ) : (
            <div className="modules-edit">
              <p className="modules-edit-hint">Tap a module to learn more. Use the checkbox to select or deselect.</p>
              <div className="module-edit-cards">
                {MODULES.map(module => {
                  const isSelected = selectedModules.includes(module.id);
                  return (
                    <div
                      key={module.id}
                      className={`module-edit-card ${isSelected ? 'selected' : ''}`}
                    >
                      <div className="module-edit-checkbox">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleModule(module.id)}
                          aria-label={`Select ${module.name}`}
                        />
                      </div>
                      <button
                        type="button"
                        className="module-edit-info"
                        onClick={() => setModuleDetailId(module.id)}
                        aria-label={`View details for ${module.name}`}
                      >
                        <span className="module-edit-name">{module.name}</span>
                        <span className="module-edit-time">{module.estimatedTime} min</span>
                        <span className="module-edit-arrow">→</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="summary-actions">
          <Link to="/dashboard" className="summary-btn summary-btn-secondary">
            ← Back to Dashboard
          </Link>
          <button className="summary-btn summary-btn-primary" onClick={handleContinue}>
            Save Changes
          </button>
        </div>

        {/* Start Fresh Option */}
        <div className="start-fresh-wrapper">
          <button className="btn-text-link" onClick={handleStartFresh}>
            Start a new discovery from scratch
          </button>
        </div>

        <PageFooter />
      </div>

      {/* Module Detail Modal */}
      {moduleDetailId && (
        <ModuleDetailModal
          moduleId={moduleDetailId}
          isSelected={selectedModules.includes(moduleDetailId)}
          onClose={() => setModuleDetailId(null)}
          onToggleSelect={toggleModule}
        />
      )}
    </div>
  );
}
