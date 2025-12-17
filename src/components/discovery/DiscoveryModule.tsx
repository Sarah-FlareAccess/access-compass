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
                Let's understand where accessibility shows up in your business
              </h1>
              <p className="discovery-subtitle">
                This short discovery helps us recommend the most relevant modules and suggest the right level of detail for your review.
              </p>
              <p className="discovery-subtitle">
                We'll walk through a typical customer visit and ask which parts apply to your business.
              </p>
              <p className="discovery-note">
                This is not an assessment. You're simply sharing context so we can tailor what comes next.
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
                Based on what you've told us, these areas are relevant to your business
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

            {/* All modules as categorized tiles */}
            {(() => {
              // Combine all modules
              const allModules = [
                ...recommendationResult.recommendedModules,
                ...recommendationResult.alsoRelevant,
              ];

              // Define categories
              const categories = [
                {
                  id: 'before-visit',
                  label: 'Before visit',
                  codes: ['B1', 'B2', 'B3', 'B4.1', 'B4.2'],
                },
                {
                  id: 'during-visit',
                  label: 'During visit',
                  codes: ['A1', 'A2', 'A3', 'A3a', 'A6', 'A7', 'C1'],
                },
                {
                  id: 'after-visit',
                  label: 'After visit',
                  codes: ['C3'],
                },
              ];

              return categories.map(category => {
                const categoryModules = allModules.filter(m =>
                  category.codes.some(code => m.moduleCode.startsWith(code))
                );

                if (categoryModules.length === 0) return null;

                return (
                  <div key={category.id} className="module-category">
                    <h3 className="category-label">{category.label}</h3>
                    <div className="module-tiles">
                      {categoryModules.map(module => (
                        <div key={module.moduleId} className="module-tile">
                          <div className="tile-header">
                            <span className="tile-name">{module.moduleName}</span>
                            <span className="tile-code">{module.moduleCode}</span>
                          </div>
                          <span className="tile-time">{module.estimatedTime} min</span>
                          {module.whySuggested && module.whySuggested.triggeringTouchpoints.length > 0 && (
                            <div className="tile-why">
                              <span className="why-label">Why suggested</span>
                              <span className="why-text">
                                {module.whySuggested.triggeringTouchpoints.slice(0, 2).join('; ')}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              });
            })()}

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
