import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DiscoveryModule, ReviewModeSelection, CalibrationQuestions } from '../components/discovery';
import { getSession, updateDiscoveryData, updateSelectedModules } from '../utils/session';
import { calculateDepthRecommendation } from '../lib/recommendationEngine';
import type { ReviewMode, RecommendationResult, CalibrationData } from '../types';

type DiscoveryStep = 'discovery' | 'calibration' | 'pathway-decision';

function Discovery() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const session = getSession();

  // Check if coming from manual module selection
  const fromModuleSelection = searchParams.get('step') === 'calibration';

  const [currentStep, setCurrentStep] = useState<DiscoveryStep>(
    fromModuleSelection ? 'calibration' : 'discovery'
  );

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
    setCurrentStep('pathway-decision');
  };

  const handlePathwaySelect = (mode: ReviewMode) => {
    // Get selected modules from session (either from discovery or manual selection)
    const selectedModules = discoveryResults?.recommendedModules || session?.selected_modules || [];

    // Save all discovery data including calibration and selected pathway
    updateDiscoveryData({
      discovery_data: {
        selectedTouchpoints: discoveryResults?.selectedTouchpoints || [],
        selectedSubTouchpoints: discoveryResults?.selectedSubTouchpoints || [],
      },
      recommendation_result: discoveryResults?.recommendationResult || ({} as RecommendationResult),
      review_mode: mode,
      recommended_modules: selectedModules,
      budget_range: calibrationData?.budget,
      work_approach: calibrationData?.workApproach,
      action_timing: calibrationData?.timing,
    });

    // Save the modules as selected modules (if from discovery flow)
    if (discoveryResults) {
      updateSelectedModules(discoveryResults.recommendedModules);
    }

    // Navigate directly to dashboard
    navigate('/dashboard');
  };

  const handleBack = () => {
    if (currentStep === 'pathway-decision') {
      setCurrentStep('calibration');
    } else if (currentStep === 'calibration') {
      if (fromModuleSelection) {
        // Go back to module selection if we came from there
        navigate('/modules');
      } else {
        setCurrentStep('discovery');
      }
    } else {
      navigate('/start');
    }
  };

  const handleSkipDiscovery = () => {
    // Skip discovery and go directly to module selection
    navigate('/modules');
  };

  // Calculate depth recommendation based on discovery + calibration data
  const depthRecommendation = discoveryResults
    ? calculateDepthRecommendation(discoveryResults.selectedTouchpoints, calibrationData)
    : { recommendedDepth: 'pulse-check' as ReviewMode, touchpointCount: 0, reasoning: '' };

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

      {currentStep === 'pathway-decision' && (discoveryResults || fromModuleSelection) && (
        <ReviewModeSelection
          recommendedMode={depthRecommendation.recommendedDepth}
          onSelect={handlePathwaySelect}
          onBack={handleBack}
          touchpointCount={depthRecommendation.touchpointCount}
          reasoning={depthRecommendation.reasoning}
          calibrationData={calibrationData}
          organisationSize={organisationSize}
        />
      )}
    </>
  );
}

export default Discovery;
