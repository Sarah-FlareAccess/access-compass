import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { DiscoveryModule } from '../components/discovery';
import { getSession, getDiscoveryData, updateDiscoveryData, updateSelectedModules, updateSession } from '../utils/session';
import { JOURNEY_PHASES } from '../data/touchpoints';
import { accessModules } from '../data/accessModules';
import type { ReviewMode, RecommendationResult, ModuleType } from '../types';
import '../components/discovery/discovery.css';

type DiscoveryStep = 'summary' | 'discovery';

function Discovery() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const session = getSession();
  const existingDiscovery = getDiscoveryData();

  // Check if user has existing discovery data with actual touchpoints selected
  const hasExistingDiscovery = existingDiscovery?.discovery_data?.selectedTouchpoints &&
    existingDiscovery.discovery_data.selectedTouchpoints.length > 0;

  // Check if explicitly reviewing existing discovery (from dashboard)
  const isReviewMode = searchParams.get('review') === 'true';

  // Check if coming back to adjust modules (from decision page)
  const goToModules = searchParams.get('modules') === 'true';

  // Determine initial step
  const getInitialStep = (): DiscoveryStep => {
    // Only show summary if explicitly reviewing AND has actual touchpoints
    if (isReviewMode && hasExistingDiscovery) return 'summary';
    return 'discovery';
  };

  const [currentStep, setCurrentStep] = useState<DiscoveryStep>(getInitialStep());

  // Get business type from session for industry-based recommendations
  const industryId = session?.business_snapshot?.business_types?.[0] || 'other';


  // Get module names for display
  const getRecommendedModuleNames = () => {
    const moduleIds = existingDiscovery?.recommended_modules || [];
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
      // Only go back to summary if in review mode, otherwise go to business snapshot
      if (isReviewMode && hasExistingDiscovery) {
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

    return (
      <div className="discovery-summary-page">
        <div className="discovery-summary-container">
          <div className="summary-header">
            <h1>Your Discovery Summary</h1>
            <p>Review your current accessibility journey settings</p>
          </div>

          {/* Review Mode */}
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

          {/* Selected Touchpoints */}
          <div className="summary-section">
            <h2>Selected Touchpoints</h2>
            {Object.keys(touchpointsByPhase).length > 0 ? (
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
            ) : (
              <p className="no-data">No touchpoints selected</p>
            )}
          </div>

          {/* Recommended Modules */}
          <div className="summary-section">
            <h2>Recommended Modules ({moduleNames.length})</h2>
            {moduleNames.length > 0 ? (
              <div className="module-chips">
                {moduleNames.map(name => (
                  <span key={name} className="module-chip">{name}</span>
                ))}
              </div>
            ) : (
              <p className="no-data">No modules recommended</p>
            )}
          </div>

          {/* Warning Notice */}
          <div className="summary-warning">
            <span className="warning-icon">⚠️</span>
            <p>
              <strong>Note:</strong> Changing your discovery responses may update your recommended modules.
              Your completed assessments will remain, but new recommendations may be added.
            </p>
          </div>

          {/* Actions */}
          <div className="summary-actions">
            <Link to="/dashboard" className="btn-secondary">
              ← Back to Dashboard
            </Link>
            <button className="btn-primary" onClick={handleMakeChanges}>
              Make Changes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Build existing data for module adjustment mode
  const existingDataForModule = goToModules && hasExistingDiscovery ? {
    selectedTouchpoints: existingDiscovery?.discovery_data?.selectedTouchpoints || [],
    selectedSubTouchpoints: existingDiscovery?.discovery_data?.selectedSubTouchpoints || [],
    recommendedModules: existingDiscovery?.recommended_modules || [],
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
          initialStep={goToModules && hasExistingDiscovery ? 'recommendation' : 'touchpoints'}
          existingData={existingDataForModule}
        />
      )}
    </>
  );
}

export default Discovery;
