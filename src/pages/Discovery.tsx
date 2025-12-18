import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { DiscoveryModule, ReviewModeSelection, CalibrationQuestions } from '../components/discovery';
import { getSession, getDiscoveryData, updateDiscoveryData, updateSelectedModules } from '../utils/session';
import { calculateDepthRecommendation } from '../lib/recommendationEngine';
import { JOURNEY_PHASES } from '../data/touchpoints';
import { accessModules } from '../data/accessModules';
import type { ReviewMode, RecommendationResult, CalibrationData, ModuleType } from '../types';
import '../components/discovery/discovery.css';

type DiscoveryStep = 'summary' | 'discovery' | 'calibration' | 'pathway-decision';

function Discovery() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const session = getSession();
  const existingDiscovery = getDiscoveryData();

  // Check if user has existing discovery data with actual touchpoints selected
  const hasExistingDiscovery = existingDiscovery?.discovery_data?.selectedTouchpoints &&
    existingDiscovery.discovery_data.selectedTouchpoints.length > 0;

  // Check if coming from manual module selection
  const fromModuleSelection = searchParams.get('step') === 'calibration';

  // Check if explicitly reviewing existing discovery (from dashboard)
  const isReviewMode = searchParams.get('review') === 'true';

  // Determine initial step
  const getInitialStep = (): DiscoveryStep => {
    if (fromModuleSelection) return 'calibration';
    // Only show summary if explicitly reviewing AND has actual touchpoints
    if (isReviewMode && hasExistingDiscovery) return 'summary';
    return 'discovery';
  };

  const [currentStep, setCurrentStep] = useState<DiscoveryStep>(getInitialStep());

  // Temporary storage for discovery results
  const [discoveryResults, setDiscoveryResults] = useState<{
    selectedTouchpoints: string[];
    selectedSubTouchpoints: string[];
    recommendedModules: string[];
    recommendedDepth: ReviewMode;
    recommendationResult: RecommendationResult;
  } | null>(null);

  // Calibration data collected before pathway decision
  const [calibrationData, setCalibrationData] = useState<CalibrationData | null>(null);

  // Get business type from session for industry-based recommendations
  const industryId = session?.business_snapshot?.business_types?.[0] || 'other';
  const organisationSize = session?.business_snapshot?.organisation_size || 'small';


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
  }) => {
    setDiscoveryResults(data);
    setCurrentStep('calibration');
  };

  const handleCalibrationComplete = (data: CalibrationData) => {
    setCalibrationData(data);

    // Calculate recommendation based on calibration data
    const { budget, workApproach, timing } = data;
    const deepDiveSignals = [];
    const pulseCheckSignals = [];

    // Budget signals
    if (budget === 'significant' || budget === 'moderate') {
      deepDiveSignals.push('investment');
    } else if (budget === 'minimal') {
      pulseCheckSignals.push('budget');
    }

    // Work approach signals
    if (workApproach === 'with-team' || workApproach === 'external-support') {
      deepDiveSignals.push('team');
    } else if (workApproach === 'myself') {
      pulseCheckSignals.push('solo');
    }

    // Timing signals
    if (timing === 'now' || timing === 'next-3-months') {
      deepDiveSignals.push('timing');
    } else if (timing === 'later') {
      pulseCheckSignals.push('timing');
    }

    // Organisation size factor
    if (organisationSize === 'large' || organisationSize === 'enterprise') {
      deepDiveSignals.push('size');
    }

    // Determine recommended mode
    const recommendedMode = deepDiveSignals.length >= 2 ? 'deep_dive' : 'pulse';

    // Get selected modules from session
    const selectedModules = discoveryResults?.recommendedModules || session?.selected_modules || [];

    // Save all discovery data including calibration
    updateDiscoveryData({
      discovery_data: {
        selectedTouchpoints: discoveryResults?.selectedTouchpoints || [],
        selectedSubTouchpoints: discoveryResults?.selectedSubTouchpoints || [],
      },
      recommendation_result: discoveryResults?.recommendationResult || ({} as RecommendationResult),
      review_mode: recommendedMode,
      recommended_modules: selectedModules,
      budget_range: data.budget,
      work_approach: data.workApproach,
      action_timing: data.timing,
    });

    // Save the modules as selected modules (if from discovery flow)
    if (discoveryResults) {
      updateSelectedModules(discoveryResults.recommendedModules as ModuleType[]);
    }

    // Navigate directly to decision page with recommendation
    console.log('Navigating to decision with recommendation:', recommendedMode);
    navigate(`/decision?recommended=${recommendedMode}`);
  };

  const handlePathwaySelect = (mode: ReviewMode) => {
    // This is now unused but keeping for backwards compatibility
    navigate('/decision');
  };

  const handleBack = () => {
    if (currentStep === 'calibration') {
      if (fromModuleSelection) {
        navigate('/modules');
      } else {
        setCurrentStep('discovery');
      }
    } else if (currentStep === 'discovery') {
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

  // Calculate depth recommendation based on discovery + calibration data
  const depthRecommendation = discoveryResults
    ? calculateDepthRecommendation(discoveryResults.selectedTouchpoints, calibrationData)
    : { recommendedDepth: 'pulse-check' as ReviewMode, touchpointCount: 0, reasoning: '' };

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

  return (
    <>
      {currentStep === 'discovery' && (
        <DiscoveryModule
          onComplete={handleDiscoveryComplete}
          onBack={handleBack}
          onSkip={handleSkipDiscovery}
          industryId={industryId}
          serviceType="other"
        />
      )}

      {currentStep === 'calibration' && (discoveryResults || fromModuleSelection) && (
        <CalibrationQuestions
          onComplete={handleCalibrationComplete}
          onBack={handleBack}
          touchpointCount={discoveryResults?.selectedTouchpoints.length || session?.selected_modules?.length || 0}
        />
      )}
    </>
  );
}

export default Discovery;
