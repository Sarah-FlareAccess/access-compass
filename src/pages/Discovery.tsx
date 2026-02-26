import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { DiscoveryModule } from '../components/discovery';
import { getSession, getDiscoveryData, updateDiscoveryData, updateSelectedModules, updateSession } from '../utils/session';
import { normalizeModuleCode } from '../utils/moduleCompat';
import { JOURNEY_PHASES } from '../data/touchpoints';
import { accessModules } from '../data/accessModules';
import type { ReviewMode, RecommendationResult, ModuleType } from '../types';
import { usePageTitle } from '../hooks/usePageTitle';
import '../components/discovery/discovery.css';
import './DiscoverySummary.css';

type DiscoveryStep = 'summary' | 'discovery';

function Discovery() {
  usePageTitle('Discovery');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const session = getSession();
  const existingDiscovery = getDiscoveryData();

  // Check if user has COMPLETED discovery (must have touchpoints - modules alone isn't enough)
  const hasCompletedDiscovery = existingDiscovery?.discovery_data?.selectedTouchpoints &&
    existingDiscovery.discovery_data.selectedTouchpoints.length > 0;

  // Check if user has modules but incomplete discovery (legacy data)
  const hasModulesWithoutDiscovery = !hasCompletedDiscovery &&
    existingDiscovery?.recommended_modules &&
    existingDiscovery.recommended_modules.length > 0;

  // Check if coming back to adjust modules (from decision page)
  const goToModules = searchParams.get('modules') === 'true';

  // Check if coming from summary page to edit touchpoints
  const isEditMode = searchParams.get('edit') === 'true';

  // Determine step based on URL params - check on every render
  const viewParam = searchParams.get('view');
  const reviewParam = searchParams.get('review');
  const isViewingSummary = viewParam === 'summary' || reviewParam === 'true';

  const [currentStep, setCurrentStep] = useState<DiscoveryStep>('discovery');

  // Update step when URL parameters change (e.g., navigating from another page)
  // This runs on mount AND whenever searchParams changes
  useEffect(() => {
    const shouldShowSummary = searchParams.get('view') === 'summary' || searchParams.get('review') === 'true';
    if (shouldShowSummary) {
      setCurrentStep('summary');
    } else if (!searchParams.get('modules')) {
      // Only reset to discovery if not in modules adjustment mode
      setCurrentStep('discovery');
    }
  }, [searchParams]);

  // Get business type from session for industry-based recommendations
  const industryId = session?.business_snapshot?.business_types?.[0] || 'other';


  // Get module names for display
  const getRecommendedModuleNames = () => {
    const moduleIds = (existingDiscovery?.recommended_modules || []).map(normalizeModuleCode);
    return moduleIds.map(id => {
      const module = accessModules.find(m => m.id === id);
      return module?.name || id;
    });
  };

  // Group touchpoints by journey phase
  const getTouchpointsByPhase = () => {
    const touchpointIds = existingDiscovery?.discovery_data?.selectedTouchpoints || [];
    const grouped: Record<string, string[]> = {};

    JOURNEY_PHASES.forEach(phase => {
      const phaseTouchpoints = phase.touchpoints
        .filter(t => touchpointIds.includes(t.id))
        .map(t => t.label);
      if (phaseTouchpoints.length > 0) {
        grouped[phase.label] = phaseTouchpoints;
      }
    });

    return grouped;
  };

  const handleDiscoveryComplete = (data: {
    selectedTouchpoints: string[];
    selectedSubTouchpoints: string[];
    notApplicablePhases: string[];
    recommendedModules: string[];
    recommendedDepth: ReviewMode;
    recommendationResult: RecommendationResult;
    businessContext: {
      hasPhysicalVenue: boolean;
      hasOnlinePresence: boolean;
      servesPublicCustomers: boolean;
      hasOnlineServices: boolean;
    };
  }) => {
    // Save business context to session immediately
    const currentSession = getSession();
    updateSession({
      business_snapshot: {
        ...currentSession?.business_snapshot,
        organisation_name: currentSession?.business_snapshot?.organisation_name ?? '',
        organisation_size: currentSession?.business_snapshot?.organisation_size ?? 'small',
        business_types: currentSession?.business_snapshot?.business_types ?? [],
        user_role: currentSession?.business_snapshot?.user_role ?? 'owner',
        has_physical_venue: data.businessContext.hasPhysicalVenue,
        has_online_presence: data.businessContext.hasOnlinePresence,
        serves_public_customers: data.businessContext.servesPublicCustomers,
        has_online_services: data.businessContext.hasOnlineServices,
      },
    });

    // Save discovery data
    updateDiscoveryData({
      discovery_data: {
        selectedTouchpoints: data.selectedTouchpoints,
        selectedSubTouchpoints: data.selectedSubTouchpoints,
        notApplicablePhases: data.notApplicablePhases,
        explicitlyCompleted: true,
      },
      recommendation_result: data.recommendationResult,
      review_mode: data.recommendedDepth,
      recommended_modules: data.recommendedModules,
    });

    // Save the modules as selected modules
    updateSelectedModules(data.recommendedModules as ModuleType[]);

    // Navigate directly to decision page
    navigate('/decision');
  };


  const handleBack = () => {
    if (currentStep === 'discovery') {
      // Only go back to summary if viewing summary mode, otherwise go to business snapshot
      if (isViewingSummary && hasCompletedDiscovery) {
        setCurrentStep('summary');
      } else {
        navigate('/start');
      }
    } else {
      // From summary, go back to dashboard
      navigate('/dashboard');
    }
  };

  const handleSkipDiscovery = () => {
    navigate('/modules');
  };

  const handleMakeChanges = () => {
    setCurrentStep('discovery');
  };


  // Summary view for returning users
  if (currentStep === 'summary') {
    const touchpointsByPhase = getTouchpointsByPhase();
    const moduleNames = getRecommendedModuleNames();
    const reviewMode = existingDiscovery?.review_mode || 'pulse-check';
    const businessSnapshot = session?.business_snapshot;
    const orgName = businessSnapshot?.organisation_name || 'Your Organisation';

    return (
      <div className="discovery-summary-page">
        <div className="discovery-summary-container">
          <div className="summary-header">
            <h1>Discovery &amp; Modules</h1>
            <p>Your business context and accessibility module selection</p>
          </div>

          {/* Business Context */}
          <div className="summary-section">
            <h2>Business Context</h2>
            <div className="business-context-card">
              <div className="context-row">
                <span className="context-label">Organisation</span>
                <span className="context-value">{orgName}</span>
              </div>
              {businessSnapshot?.business_types && businessSnapshot.business_types.length > 0 && (
                <div className="context-row">
                  <span className="context-label">Business Type</span>
                  <span className="context-value">{businessSnapshot.business_types.join(', ')}</span>
                </div>
              )}
              <div className="context-row">
                <span className="context-label">Physical Venue</span>
                <span className="context-value">{businessSnapshot?.has_physical_venue ? 'Yes' : 'No'}</span>
              </div>
              <div className="context-row">
                <span className="context-label">Online Presence</span>
                <span className="context-value">{businessSnapshot?.has_online_presence ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          {/* Review Mode - only show if discovery was completed */}
          {hasCompletedDiscovery && (
            <div className="summary-section">
              <h2>Review Mode</h2>
              <div className="summary-mode-badge">
                <span className={`mode-icon ${reviewMode}`}>
                  {reviewMode === 'deep-dive' ? '🔬' : '⚡'}
                </span>
                <div className="mode-info">
                  <strong>{reviewMode === 'deep-dive' ? 'Deep Dive' : 'Pulse Check'}</strong>
                  <span>
                    {reviewMode === 'deep-dive'
                      ? 'Comprehensive assessment with detailed questions'
                      : 'Quick overview with key questions'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Selected Touchpoints - only show if discovery was completed */}
          {hasCompletedDiscovery && Object.keys(touchpointsByPhase).length > 0 && (
            <div className="summary-section">
              <h2>Selected Touchpoints</h2>
              <div className="touchpoints-by-phase">
                {Object.entries(touchpointsByPhase).map(([phase, touchpoints]) => (
                  <div key={phase} className="phase-group">
                    <h3>{phase}</h3>
                    <ul>
                      {touchpoints.map(tp => (
                        <li key={tp}>{tp}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current Modules */}
          <div className="summary-section">
            <h2>Your Modules ({moduleNames.length})</h2>
            {moduleNames.length > 0 ? (
              <div className="module-chips">
                {moduleNames.map(name => (
                  <span key={name} className="module-chip">{name}</span>
                ))}
              </div>
            ) : (
              <p className="no-data">No modules selected yet. Complete discovery to get recommendations.</p>
            )}
          </div>

          {/* Prompt to complete discovery if not done */}
          {!hasCompletedDiscovery && (
            <div className="summary-info-box warning">
              <span className="info-icon">⚠️</span>
              <div>
                <strong>{hasModulesWithoutDiscovery ? 'Discovery Incomplete' : 'Complete Discovery'}</strong>
                <p>
                  {hasModulesWithoutDiscovery
                    ? 'Your modules were set up without completing the discovery process. Complete discovery to ensure your modules match your actual customer touchpoints.'
                    : 'Answer a few questions about your customer touchpoints to get personalised module recommendations.'}
                </p>
              </div>
            </div>
          )}

          {/* Warning Notice - only show if has existing discovery */}
          {hasCompletedDiscovery && (
            <div className="summary-warning">
              <span className="warning-icon">⚠️</span>
              <p>
                <strong>Note:</strong> Changing your discovery responses may update your recommended modules.
                Your completed assessments will remain, but new recommendations may be added.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="summary-actions">
            <Link to="/dashboard" className="btn-secondary">
              ← Back to Dashboard
            </Link>
            <button className="btn-primary" onClick={handleMakeChanges}>
              {hasCompletedDiscovery ? 'Edit Discovery' : 'Start Discovery'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Build existing data for module adjustment mode or edit mode (from summary page)
  // Edit mode: pre-populate touchpoints and business context for user to modify
  // Modules mode: skip to recommendation step with existing data
  const shouldPrePopulate = (goToModules || isEditMode) && hasCompletedDiscovery;
  const existingDataForModule = shouldPrePopulate ? {
    selectedTouchpoints: existingDiscovery?.discovery_data?.selectedTouchpoints || [],
    selectedSubTouchpoints: existingDiscovery?.discovery_data?.selectedSubTouchpoints || [],
    recommendedModules: (existingDiscovery?.recommended_modules || []).map(normalizeModuleCode),
    businessContext: {
      hasPhysicalVenue: session?.business_snapshot?.has_physical_venue,
      hasOnlinePresence: session?.business_snapshot?.has_online_presence,
      servesPublicCustomers: session?.business_snapshot?.serves_public_customers,
      hasOnlineServices: session?.business_snapshot?.has_online_services,
    },
  } : undefined;

  return (
    <>
      {currentStep === 'discovery' && (
        <DiscoveryModule
          onComplete={handleDiscoveryComplete}
          onBack={handleBack}
          onSkip={handleSkipDiscovery}
          industryId={industryId}
          serviceType="other"
          // Edit mode: start from touchpoints to let user modify selections
          // Modules mode: skip to recommendation step
          initialStep={goToModules && hasCompletedDiscovery ? 'recommendation' : 'touchpoints'}
          existingData={existingDataForModule}
        />
      )}
    </>
  );
}

export default Discovery;
