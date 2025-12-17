import { useState, useMemo } from 'react';
import type { ReviewMode, DiscoveryData, RecommendationResult } from '../../types';
import { JOURNEY_PHASES, getTouchpointBlocks } from '../../data/touchpoints';
import {
  generateRecommendations,
  groupModulesByJourney,
  moduleIdsToCodes,
  calculateDepthRecommendation,
} from '../../lib/recommendationEngine';
import { JourneyPhaseSection } from './JourneyPhaseSection';
import { ModuleRecommendationCard } from './ModuleRecommendationCard';
import './discovery.css';

interface DiscoveryModuleProps {
  onComplete: (data: {
    selectedTouchpoints: string[];
    selectedSubTouchpoints: string[];
    recommendedModules: string[];
    recommendedDepth: ReviewMode;
    recommendationResult: RecommendationResult;
  }) => void;
  onBack: () => void;
  onSkip: () => void;
  industryId?: string;
  serviceType?: string;
}

export function DiscoveryModule({
  onComplete,
  onBack,
  onSkip,
  industryId = 'other',
  serviceType = 'other',
}: DiscoveryModuleProps) {
  const [selectedTouchpoints, setSelectedTouchpoints] = useState<string[]>([]);
  const [selectedSubTouchpoints, setSelectedSubTouchpoints] = useState<string[]>([]);
  const [openPhases, setOpenPhases] = useState<string[]>(['before-arrival']);
  const [currentStep, setCurrentStep] = useState<'touchpoints' | 'recommendation'>('touchpoints');

  const toggleTouchpoint = (id: string) => {
    setSelectedTouchpoints(prev => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        // Also remove any sub-touchpoints
        const touchpoint = JOURNEY_PHASES.flatMap(p => p.touchpoints).find(t => t.id === id);
        if (touchpoint?.subTouchpoints) {
          setSelectedSubTouchpoints(current =>
            current.filter(st => !touchpoint.subTouchpoints!.some(s => s.id === st))
          );
        }
        return prev.filter(t => t !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const toggleSubTouchpoint = (id: string) => {
    setSelectedSubTouchpoints(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const togglePhaseOpen = (phaseId: string, open: boolean) => {
    setOpenPhases(prev =>
      open ? [...prev, phaseId] : prev.filter(p => p !== phaseId)
    );
  };

  // Calculate recommendations using the recommendation engine
  const recommendationResult = useMemo(() => {
    const discoveryData: DiscoveryData = {
      selectedTouchpoints,
      selectedSubTouchpoints,
      responses: {},
    };

    // Treat all selected touchpoints as "yes" responses
    selectedTouchpoints.forEach(tp => {
      discoveryData.responses![tp] = 'yes';
    });

    return generateRecommendations(discoveryData, industryId, serviceType);
  }, [selectedTouchpoints, industryId, serviceType]);

  // Calculate depth recommendation
  const depthRecommendation = useMemo(() => {
    return calculateDepthRecommendation(selectedTouchpoints);
  }, [selectedTouchpoints]);

  const handleContinue = () => {
    if (currentStep === 'touchpoints') {
      setCurrentStep('recommendation');
    } else {
      // Convert module IDs to codes for backward compatibility
      const moduleCodes = moduleIdsToCodes(
        recommendationResult.recommendedModules.map(m => m.moduleId)
      );

      onComplete({
        selectedTouchpoints,
        selectedSubTouchpoints,
        recommendedModules: moduleCodes,
        recommendedDepth: depthRecommendation.recommendedDepth,
        recommendationResult,
      });
    }
  };

  const handleBack = () => {
    if (currentStep === 'recommendation') {
      setCurrentStep('touchpoints');
    } else {
      onBack();
    }
  };

  return (
    <div className="discovery-page">
      <div className="discovery-container">
        {/* Progress indicator */}
        <div className="progress-indicator">
          <div className="progress-dots">
            <div className={`progress-dot ${currentStep === 'touchpoints' || currentStep === 'recommendation' ? 'active' : ''}`} />
            <div className={`progress-line ${currentStep === 'recommendation' ? 'active' : ''}`} />
            <div className={`progress-dot ${currentStep === 'recommendation' ? 'active' : ''}`} />
          </div>
          <div className="time-estimate">
            <span>⏱️</span>
            <span>About 3-5 minutes</span>
          </div>
        </div>

        {currentStep === 'touchpoints' && (
          <div className="touchpoints-view">
            {/* Header */}
            <div className="discovery-header-card">
              <h1 className="discovery-title">
                Where does accessibility matter in your business?
              </h1>
              <p className="discovery-subtitle">
                Think about a typical customer visit. Select the parts of the journey that apply to your business.
              </p>
              {/* Journey orientation cue */}
              <div className="journey-orientation">
                <span>Before arrival</span>
                <span className="arrow">→</span>
                <span>During visit</span>
                <span className="arrow">→</span>
                <span>Staying connected</span>
              </div>
            </div>

            {/* Journey Phase Cards */}
            <div className="journey-phases">
              {JOURNEY_PHASES.map((phase, index) => (
                <JourneyPhaseSection
                  key={phase.id}
                  phaseId={phase.id}
                  label={phase.label}
                  subLabel={phase.subLabel}
                  description={phase.description}
                  icon={phase.icon}
                  touchpoints={phase.touchpoints}
                  touchpointBlocks={getTouchpointBlocks(phase)}
                  selectedTouchpoints={selectedTouchpoints}
                  selectedSubTouchpoints={selectedSubTouchpoints}
                  onToggleTouchpoint={toggleTouchpoint}
                  onToggleSubTouchpoint={toggleSubTouchpoint}
                  isOpen={openPhases.includes(phase.id)}
                  onOpenChange={(open) => togglePhaseOpen(phase.id, open)}
                  isFirst={index === 0}
                  isLast={index === JOURNEY_PHASES.length - 1}
                  bgColorClass={phase.bgColorClass}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="discovery-actions-card">
              <div className="discovery-buttons">
                <button className="btn-back" onClick={handleBack}>
                  ← Back
                </button>
                <button
                  className="btn-continue"
                  onClick={handleContinue}
                  disabled={selectedTouchpoints.length === 0}
                >
                  Continue →
                </button>
              </div>

              <div className="skip-link">
                <button onClick={onSkip}>
                  Skip discovery and choose modules manually
                </button>
                <p>You can still choose your review depth next.</p>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'recommendation' && (
          <div className="recommendation-view">
            {/* Header */}
            <div className="recommendation-header">
              <h1 className="discovery-title">
                Based on what you've told us, accessibility shows up in these areas
              </h1>
              <p className="discovery-subtitle">
                You can adjust these at any time. Nothing is locked in.
              </p>
            </div>

            {/* Warnings */}
            {recommendationResult.warnings.length > 0 && (
              <div className="warnings-section">
                {recommendationResult.warnings.map((warning, i) => (
                  <div key={i} className="warning-banner">
                    <span className="warning-icon">⚠️</span>
                    <p className="warning-message">{warning.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Grouped module recommendations */}
            {groupModulesByJourney(recommendationResult.recommendedModules).map(group => (
              <div key={group.phase} className="journey-group">
                <h3 className="journey-group-label">{group.label}</h3>
                <div className="module-cards">
                  {group.modules.map(module => (
                    <ModuleRecommendationCard
                      key={module.moduleId}
                      module={module}
                      showWhySuggested={true}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Also relevant section */}
            {recommendationResult.alsoRelevant.length > 0 && (
              <div className="also-relevant-section">
                <h3 className="also-relevant-label">Also relevant later</h3>
                {recommendationResult.alsoRelevant.map(module => (
                  <div key={module.moduleId} className="also-relevant-item">
                    <div>
                      <span className="also-relevant-name">{module.moduleName}</span>
                      <span className="also-relevant-code">{module.moduleCode}</span>
                    </div>
                    <span className="also-relevant-time">{module.estimatedTime} min</span>
                  </div>
                ))}
              </div>
            )}

            {/* Reassurance text */}
            <p className="reassurance-text">
              You can revisit or refine your discovery responses later from your dashboard.
            </p>

            {/* Actions */}
            <div className="discovery-actions-card">
              <div className="discovery-buttons" style={{ flexDirection: 'column' }}>
                <button className="btn-continue" onClick={handleContinue}>
                  Continue →
                </button>
                <button className="btn-back" onClick={handleBack}>
                  ← Back to adjust selections
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
