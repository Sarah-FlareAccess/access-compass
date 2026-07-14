// ============================================
// ACCESS COMPASS - DISCOVERY SUMMARY PAGE
// ============================================
// For returning users to review and modify their discovery selections
// ============================================

import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getSession, updateSession, getDiscoveryData, updateDiscoveryData, clearDiscoveryData } from '../utils/session';
import { normalizeModuleCode } from '../utils/moduleCompat';
import { JOURNEY_PHASES } from '../data/touchpoints';
import { MODULES } from '../lib/recommendationEngine';
import { getModuleById } from '../data/accessModules';
import { useAuth } from '../contexts/AuthContext';
import type { JourneyPhase } from '../types';
import { PageFooter } from '../components/PageFooter';
import { ModuleDetailModal } from '../components/discovery/ModuleDetailModal';
import { usePageTitle } from '../hooks/usePageTitle';
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
  offersExperiences: boolean | null;
  assessmentType: AssessmentType;
}

export default function DiscoverySummary() {
  usePageTitle('Business profile');
  const navigate = useNavigate();
  const { accessState } = useAuth();
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

  // Modal state for edit confirmations
  const [showTouchpointEditWarning, setShowTouchpointEditWarning] = useState(false);
  const [showContextEditWarning, setShowContextEditWarning] = useState(false);

  // Module detail modal state
  const [moduleDetailId, setModuleDetailId] = useState<string | null>(null);

  // Editable values
  const [businessContext, setBusinessContext] = useState<BusinessContext>(() => {
    // Canonical source is business_snapshot.assessment_type; fall back to the
    // legacy discovery_data location, then default to 'business'.
    const assessmentType: AssessmentType =
      session?.business_snapshot?.assessment_type
      || discoveryData?.businessContext?.assessmentType
      || 'business';

    return {
      hasPhysicalVenue: session?.business_snapshot?.has_physical_venue ?? null,
      hasOnlinePresence: session?.business_snapshot?.has_online_presence ?? null,
      servesPublicCustomers: session?.business_snapshot?.serves_public_customers ?? null,
      hasOnlineServices: session?.business_snapshot?.has_online_services ?? null,
      offersExperiences: session?.business_snapshot?.offers_experiences ?? null,
      assessmentType,
    };
  });

  const [selectedTouchpoints] = useState<string[]>(
    discoveryData?.selectedTouchpoints || []
  );

  const [selectedModules, setSelectedModules] = useState<string[]>(
    (storedDiscovery?.recommended_modules || []).map(normalizeModuleCode)
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

  const formatMinutes = (mins: number): string => {
    if (mins <= 0) return '—';
    return `${mins} min`;
  };

  // Resolve the customer's review mode (Pulse Check vs Deep Dive). Prefer the
  // entitlement on accessState; fall back to whatever was saved during
  // discovery; default to pulse so we never overstate the duration.
  const reviewMode: 'pulse' | 'deep-dive' = (() => {
    if (accessState.accessLevel === 'deep_dive') return 'deep-dive';
    if (accessState.accessLevel === 'pulse') return 'pulse';
    if (storedDiscovery?.review_mode === 'deep-dive') return 'deep-dive';
    return 'pulse';
  })();
  const reviewModeLabel = reviewMode === 'deep-dive' ? 'Deep Dive' : 'Pulse Check';

  // Get the time for a module based on the customer's mode.
  const getModuleTime = (moduleId: string): number => {
    const recModule = getModule(moduleId);
    if (reviewMode === 'pulse') {
      return recModule?.estimatedTime ?? 0;
    }
    const fullModule = getModuleById(moduleId);
    return fullModule?.estimatedTimeDeepDive ?? (recModule?.estimatedTime ?? 0) * 3;
  };

  const orgName = session?.business_snapshot?.organisation_name
    || accessState.organisation?.name
    || null;
  const businessTypes = session?.business_snapshot?.business_types ?? [];
  const orgSize = session?.business_snapshot?.organisation_size;
  const userRole = session?.business_snapshot?.user_role;
  const pricingTier = accessState.organisation?.pricing_tier;

  const assessmentTypeLabel = (() => {
    switch (businessContext.assessmentType) {
      case 'event': return 'Standalone event';
      case 'both': return 'Business operations + event';
      case 'business':
      default: return 'Ongoing business operations';
    }
  })();

  // Toggle module
  const toggleModule = (id: string) => {
    setSelectedModules(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  // Event module IDs
  const eventModuleIds = ['6.1', '6.2', '6.3', '6.4', '6.5'];

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
        offers_experiences: businessContext.offersExperiences ?? false,
        assessment_type: businessContext.assessmentType,
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
          offersExperiences: businessContext.offersExperiences ?? false,
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
          <h1>Business profile</h1>
          <p>Your business setup, customer journey and accessibility focus areas</p>
        </div>

        {/* Snapshot card */}
        <div className="summary-section summary-snapshot">
          <div className="snapshot-headline">
            <div className="snapshot-name-block">
              <h2 className="snapshot-org-name">{orgName || 'Your organisation'}</h2>
              {pricingTier && (
                <span className="snapshot-plan-badge">{pricingTier} plan</span>
              )}
            </div>
            <div className="snapshot-totals">
              <div className="snapshot-total-item">
                <span className="snapshot-total-number">{selectedModules.length}</span>
                <span className="snapshot-total-label">{selectedModules.length === 1 ? 'module' : 'modules'}</span>
              </div>
            </div>
          </div>
          <dl className="snapshot-facts">
            <div className="snapshot-fact">
              <dt>Assessment type</dt>
              <dd>{assessmentTypeLabel}</dd>
            </div>
            {businessTypes.length > 0 && (
              <div className="snapshot-fact">
                <dt>Business type</dt>
                <dd>{businessTypes.join(', ')}</dd>
              </div>
            )}
            {orgSize && (
              <div className="snapshot-fact">
                <dt>Size</dt>
                <dd>{orgSize.charAt(0).toUpperCase() + orgSize.slice(1)}</dd>
              </div>
            )}
            {userRole && (
              <div className="snapshot-fact">
                <dt>Your role</dt>
                <dd>{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</dd>
              </div>
            )}
            {businessContext.offersExperiences && (
              <div className="snapshot-fact">
                <dt>Offers experiences</dt>
                <dd>Tours, classes or guided activities</dd>
              </div>
            )}
          </dl>
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
              <button className="btn-edit" onClick={() => setShowContextEditWarning(true)}>
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
                  {businessContext.assessmentType === 'business' && '🏢 Ongoing Business Operations'}
                  {businessContext.assessmentType === 'both' && '🏢 + 🎪 Business Operations & Event'}
                </span>
              </div>
              <div className="context-item">
                <span className="context-label">Customers attend physical locations:</span>
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
                <span className="context-label">Offers tours, classes or experiences:</span>
                <span className={`context-value ${businessContext.offersExperiences ? 'yes' : 'no'}`}>
                  {businessContext.offersExperiences ? 'Yes' : 'No'}
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
                      <span className="assessment-card-desc">Your venue, services, website and day-to-day customer experience</span>
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
                      <span className="assessment-card-desc">A specific event like a festival, conference, concert, market or function</span>
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
                      <span className="assessment-card-title">🏢 + 🎪 Business Operations & Event</span>
                      <span className="assessment-card-desc">Assess both your ongoing operations AND a specific event. Choose this if your business also hosts or runs events like markets, festivals, conferences or functions.</span>
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
                { key: 'hasPhysicalVenue', label: 'Do customers attend physical locations with you? (your own venue, partner sites, public spaces or tour meeting points)' },
                { key: 'hasOnlinePresence', label: 'Do you have an online presence?' },
                { key: 'offersExperiences', label: 'Do you offer tours, classes, activities or guided experiences?' },
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
                  <ul className="touchpoint-chips" role="list">
                    {selected.map(tpId => (
                      <li key={tpId} className="touchpoint-chip">{getTouchpointLabel(tpId)}</li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="empty-message">No touchpoints selected</p>
            )}
          </div>
        </div>

        {/* Touchpoint Edit Warning Modal */}
        {showTouchpointEditWarning && (
          <div className="warning-modal-overlay" onClick={() => setShowTouchpointEditWarning(false)} onKeyDown={(e) => { if (e.key === 'Escape') setShowTouchpointEditWarning(false); }}>
            <div className="warning-modal" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true" aria-labelledby="touchpoint-warning-title">
              <div className="warning-modal-icon" aria-hidden="true">⚠️</div>
              <h3 id="touchpoint-warning-title">Update Your Visitor Journey?</h3>
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

        {/* Business Context Edit Warning Modal */}
        {showContextEditWarning && (
          <div className="warning-modal-overlay" onClick={() => setShowContextEditWarning(false)} onKeyDown={(e) => { if (e.key === 'Escape') setShowContextEditWarning(false); }}>
            <div className="warning-modal" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true" aria-labelledby="context-warning-title">
              <div className="warning-modal-icon" aria-hidden="true">⚠️</div>
              <h3 id="context-warning-title">Update Business Context?</h3>
              <p>
                Changing your business context may recalculate your recommended modules, which could affect your plan.
              </p>
              <p className="warning-modal-detail">
                Your existing module progress will be preserved.
              </p>
              <div className="warning-modal-actions">
                <button
                  className="btn-cancel"
                  onClick={() => setShowContextEditWarning(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-confirm"
                  onClick={() => { setShowContextEditWarning(false); setIsEditingContext(true); }}
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
                <>
                  <p className="modules-total-strip">
                    {selectedModules.length} {selectedModules.length === 1 ? 'module' : 'modules'} selected · times shown for {reviewModeLabel}
                  </p>
                  <div className="modules-by-phase">
                    {modulesByPhase.map(({ phase, label, modules }) => (
                      <div key={phase} className="module-phase-group">
                        <h3 className="group-label">{label}</h3>
                        <div className="summary-module-grid" role="list">
                          {modules.map(module => (
                            <div key={module.id} className="summary-module-row" role="listitem"
                              onClick={() => setModuleDetailId(module.id)}
                              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setModuleDetailId(module.id); } }}
                              tabIndex={0}
                              aria-label={`View details for ${module.name}`}
                            >
                              <span className="summary-module-name">{module.name}</span>
                              <span className="summary-module-time">{formatMinutes(getModuleTime(module.id))}</span>
                              <span className="summary-module-arrow">→</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="empty-message">No modules selected</p>
              )}
            </div>
          ) : (
            <div className="modules-edit">
              <p className="modules-edit-hint">Tap a module to learn more. Use the checkbox to select or deselect.</p>
              <div className="modules-edit-by-phase">
                {(['before-arrival', 'during-visit', 'after-visit', 'policy-operations'] as JourneyPhase[]).map(phase => {
                  const phaseModules = MODULES.filter(m => m.journeyTheme === phase);
                  if (phaseModules.length === 0) return null;
                  return (
                    <div key={phase} className="module-edit-phase-group">
                      <h3 className="group-label">{JOURNEY_PHASE_LABELS[phase]}</h3>
                      <div className="module-edit-cards">
                        {phaseModules.map(module => {
                          const isSelected = selectedModules.includes(module.id);
                          return (
                            <div
                              key={module.id}
                              className={`module-edit-row ${isSelected ? 'selected' : ''}`}
                            >
                              <label className="module-edit-checkbox" aria-label={`Select ${module.name}`}>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleModule(module.id)}
                                />
                              </label>
                              <button
                                type="button"
                                className="module-edit-name-btn"
                                onClick={() => setModuleDetailId(module.id)}
                                aria-label={`View details for ${module.name}`}
                              >
                                <span className="module-edit-name">{module.name}</span>
                                <span className="module-edit-arrow" aria-hidden="true">→</span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
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
