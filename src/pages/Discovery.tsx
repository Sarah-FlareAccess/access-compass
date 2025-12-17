import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DiscoveryModule, ReviewModeSelection, OptionalQuestions } from '../components/discovery';
import { getSession, updateDiscoveryData } from '../utils/session';
import { calculateDepthRecommendation } from '../lib/recommendationEngine';
import type { ReviewMode, RecommendationResult } from '../types';

type DiscoveryStep = 'discovery' | 'review-mode' | 'optional-questions';

function Discovery() {
  const navigate = useNavigate();
  const session = getSession();
  const [currentStep, setCurrentStep] = useState<DiscoveryStep>('discovery');
  const [selectedReviewMode, setSelectedReviewMode] = useState<ReviewMode>('foundation');

  // Temporary storage for discovery results before review mode selection
  const [discoveryResults, setDiscoveryResults] = useState<{
    selectedTouchpoints: string[];
    selectedSubTouchpoints: string[];
    recommendedModules: string[];
    recommendedDepth: ReviewMode;
    recommendationResult: RecommendationResult;
  } | null>(null);

  // Get business type from session for industry-based recommendations
  const industryId = session?.business_snapshot?.business_types?.[0] || 'other';

  const handleDiscoveryComplete = (data: {
    selectedTouchpoints: string[];
    selectedSubTouchpoints: string[];
    recommendedModules: string[];
    recommendedDepth: ReviewMode;
    recommendationResult: RecommendationResult;
  }) => {
    setDiscoveryResults(data);
    setCurrentStep('review-mode');
  };

  const handleReviewModeSelect = (mode: ReviewMode) => {
    setSelectedReviewMode(mode);
    setCurrentStep('optional-questions');
  };

  const handleOptionalQuestionsComplete = (data: { budget?: string; priority?: string }) => {
    if (discoveryResults) {
      // Save all discovery data including the selected review mode and optional answers
      updateDiscoveryData({
        discovery_data: {
          selectedTouchpoints: discoveryResults.selectedTouchpoints,
          selectedSubTouchpoints: discoveryResults.selectedSubTouchpoints,
        },
        recommendation_result: discoveryResults.recommendationResult,
        review_mode: selectedReviewMode,
        recommended_modules: discoveryResults.recommendedModules,
        budget_range: data.budget,
        priority_timeframe: data.priority,
      });

      // Navigate to the module selection page
      navigate('/modules');
    }
  };

  const handleOptionalQuestionsSkip = () => {
    if (discoveryResults) {
      // Save discovery data without optional answers
      updateDiscoveryData({
        discovery_data: {
          selectedTouchpoints: discoveryResults.selectedTouchpoints,
          selectedSubTouchpoints: discoveryResults.selectedSubTouchpoints,
        },
        recommendation_result: discoveryResults.recommendationResult,
        review_mode: selectedReviewMode,
        recommended_modules: discoveryResults.recommendedModules,
      });

      navigate('/modules');
    }
  };

  const handleBack = () => {
    if (currentStep === 'optional-questions') {
      setCurrentStep('review-mode');
    } else if (currentStep === 'review-mode') {
      setCurrentStep('discovery');
    } else {
      navigate('/start');
    }
  };

  const handleSkipDiscovery = () => {
    // Skip discovery and go directly to module selection
    // Will use industry defaults instead
    navigate('/modules');
  };

  // Calculate depth recommendation for review mode selection
  const depthRecommendation = discoveryResults
    ? calculateDepthRecommendation(discoveryResults.selectedTouchpoints)
    : { recommendedDepth: 'foundation' as ReviewMode, touchpointCount: 0, reasoning: '' };

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

      {currentStep === 'review-mode' && discoveryResults && (
        <ReviewModeSelection
          recommendedMode={depthRecommendation.recommendedDepth}
          onSelect={handleReviewModeSelect}
          onBack={handleBack}
          touchpointCount={depthRecommendation.touchpointCount}
          reasoning={depthRecommendation.reasoning}
        />
      )}

      {currentStep === 'optional-questions' && (
        <OptionalQuestions
          onComplete={handleOptionalQuestionsComplete}
          onSkip={handleOptionalQuestionsSkip}
          onBack={handleBack}
        />
      )}
    </>
  );
}

export default Discovery;
