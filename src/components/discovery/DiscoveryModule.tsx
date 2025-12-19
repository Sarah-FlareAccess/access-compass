import { useState, useMemo, useEffect } from 'react';
import type { ReviewMode, DiscoveryData, RecommendationResult } from '../../types';
import { JOURNEY_PHASES, getTouchpointBlocks } from '../../data/touchpoints';
import {
  generateRecommendations,
  moduleIdsToCodes,
  calculateDepthRecommendation,
  MODULES,
} from '../../lib/recommendationEngine';
import { JourneyPhaseSection } from './JourneyPhaseSection';
import './discovery.css';

interface DiscoveryModuleProps {
  onComplete: (data: {
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

  // Business context questions
  const [hasPhysicalVenue, setHasPhysicalVenue] = useState<boolean | null>(null);
  const [hasOnlinePresence, setHasOnlinePresence] = useState<boolean | null>(null);
  const [servesPublicCustomers, setServesPublicCustomers] = useState<boolean | null>(null);
  const [hasOnlineServices, setHasOnlineServices] = useState<boolean | null>(null);

  // Customized module selection (user can modify recommendations)
  const [customSelectedModules, setCustomSelectedModules] = useState<string[]>([]);
  const [showAllModules, setShowAllModules] = useState(false);

  const toggleModuleSelection = (moduleId: string) => {
    setCustomSelectedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

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

  // Filter journey phases based on business context answers
  const filteredJourneyPhases = useMemo(() => {
    // Only filter once all context questions are answered
    const allAnswered = hasPhysicalVenue !== null && hasOnlinePresence !== null;

    if (!allAnswered) {
      // Show all phases until questions are answered
      return JOURNEY_PHASES;
    }

    return JOURNEY_PHASES.filter(phase => {
      // "When they're here" phase is only relevant for physical venues
      if (phase.id === 'when-here' && !hasPhysicalVenue) {
        return false;
      }

      // These phases are always relevant (apply to both online and physical businesses):
      // - "before-arrival": finding info, planning, booking
      // - "customer-service": staff interaction, service flexibility
      // - "staying-connected": feedback, ongoing communication
      return true;
    }).map(phase => {
      // For the "before-arrival" phase, filter touchpoints based on context
      if (phase.id === 'before-arrival') {
        let filteredTouchpoints = [...phase.touchpoints];

        // If no online presence, filter out purely online touchpoints
        if (!hasOnlinePresence) {
          filteredTouchpoints = filteredTouchpoints.filter(tp => {
            // Keep enquiries (can be phone-based)
            // Keep costs-policies (general info)
            // Filter finding-online if no online presence
            if (tp.id === 'finding-online') return false;
            return true;
          });
        }

        // If no physical venue, adjust descriptions or filter physical-only items
        // (most before-arrival touchpoints apply to online businesses too)

        return {
          ...phase,
          touchpoints: filteredTouchpoints,
          blocks: phase.blocks?.map(block => ({
            ...block,
            touchpointIds: block.touchpointIds.filter(id =>
              filteredTouchpoints.some(tp => tp.id === id)
            ),
          })).filter(block => block.touchpointIds.length > 0),
        };
      }

      return phase;
    });
  }, [hasPhysicalVenue, hasOnlinePresence]);

  // Initialize custom module selection when entering recommendation step
  useEffect(() => {
    if (currentStep === 'recommendation' && customSelectedModules.length === 0) {
      // Initialize with all recommended modules
      const allRecommended = [
        ...recommendationResult.recommendedModules.map(m => m.moduleId),
        ...recommendationResult.alsoRelevant.map(m => m.moduleId),
      ];
      setCustomSelectedModules(allRecommended);
    }
  }, [currentStep, recommendationResult, customSelectedModules.length]);

  const handleContinue = () => {
    if (currentStep === 'touchpoints') {
      setCurrentStep('recommendation');
    } else {
      // Use custom selected modules (user may have modified)
      const moduleCodes = moduleIdsToCodes(customSelectedModules);

      onComplete({
        selectedTouchpoints,
        selectedSubTouchpoints,
        recommendedModules: moduleCodes,
        recommendedDepth: depthRecommendation.recommendedDepth,
        recommendationResult,
        businessContext: {
          hasPhysicalVenue: hasPhysicalVenue ?? false,
          hasOnlinePresence: hasOnlinePresence ?? false,
          servesPublicCustomers: servesPublicCustomers ?? false,
          hasOnlineServices: hasOnlineServices ?? false,
        },
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
              {/* Journey orientation cue - dynamic based on business context */}
              <div className="journey-orientation">
                <span>Before arrival</span>
                <span className="arrow">→</span>
                {(hasPhysicalVenue === null || hasPhysicalVenue === true) && (
                  <>
                    <span>Physical space</span>
                    <span className="arrow">→</span>
                  </>
                )}
                <span>Customer service</span>
                <span className="arrow">→</span>
                <span>Staying connected</span>
              </div>
            </div>

            {/* Business Context Questions */}
            <div className="business-context-questions">
              {/* Physical Venue */}
              <div className="context-question">
                <label>
                  Do you have a physical venue customers visit? <span className="required">*</span>
                </label>
                <p className="field-helper">e.g. shop, office, facility, or site</p>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="has_physical_venue"
                      checked={hasPhysicalVenue === true}
                      onChange={() => setHasPhysicalVenue(true)}
                      required
                    />
                    <span>Yes</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="has_physical_venue"
                      checked={hasPhysicalVenue === false}
                      onChange={() => setHasPhysicalVenue(false)}
                      required
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {/* Online Presence */}
              <div className="context-question">
                <label>
                  Do you have an online presence (website, booking system)?{' '}
                  <span className="required">*</span>
                </label>
                <p className="field-helper">e.g. website, app, online booking, or digital services</p>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="has_online_presence"
                      checked={hasOnlinePresence === true}
                      onChange={() => setHasOnlinePresence(true)}
                      required
                    />
                    <span>Yes</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="has_online_presence"
                      checked={hasOnlinePresence === false}
                      onChange={() => setHasOnlinePresence(false)}
                      required
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {/* Public-Facing Customers */}
              <div className="context-question">
                <label>
                  Do you serve public-facing customers? <span className="required">*</span>
                </label>
                <p className="field-helper">e.g. visitors, guests, clients, or members of the public</p>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="serves_public_customers"
                      checked={servesPublicCustomers === true}
                      onChange={() => setServesPublicCustomers(true)}
                      required
                    />
                    <span>Yes</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="serves_public_customers"
                      checked={servesPublicCustomers === false}
                      onChange={() => setServesPublicCustomers(false)}
                      required
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {/* Online Services */}
              <div className="context-question">
                <label>
                  Do you operate online services? <span className="required">*</span>
                </label>
                <p className="field-helper">e.g. online retail, business coaching, consulting, digital services</p>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="has_online_services"
                      checked={hasOnlineServices === true}
                      onChange={() => setHasOnlineServices(true)}
                      required
                    />
                    <span>Yes</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="has_online_services"
                      checked={hasOnlineServices === false}
                      onChange={() => setHasOnlineServices(false)}
                      required
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Context-aware message */}
            {hasPhysicalVenue === false && hasOnlinePresence !== null && (
              <div className="context-message">
                <span className="context-icon">💡</span>
                <p>
                  Since you don't have a physical venue, we've tailored the journey to focus on
                  digital touchpoints. Physical premises questions have been removed.
                </p>
              </div>
            )}

            {hasOnlinePresence === false && hasPhysicalVenue !== null && (
              <div className="context-message">
                <span className="context-icon">💡</span>
                <p>
                  Since you don't have an online presence, we've adjusted the journey to focus on
                  in-person touchpoints. Some digital-only questions have been removed.
                </p>
              </div>
            )}

            {/* Journey Phase Cards */}
            <div className="journey-phases">
              {filteredJourneyPhases.map((phase, index) => {
                // Use online-specific labels when user has no physical venue
                const useOnlineLabels = hasPhysicalVenue === false;
                const phaseLabel = useOnlineLabels && phase.labelOnline ? phase.labelOnline : phase.label;
                const phaseSubLabel = useOnlineLabels && phase.subLabelOnline ? phase.subLabelOnline : phase.subLabel;
                const phaseDescription = useOnlineLabels && phase.descriptionOnline ? phase.descriptionOnline : phase.description;

                return (
                  <JourneyPhaseSection
                    key={phase.id}
                    phaseId={phase.id}
                    label={phaseLabel}
                    subLabel={phaseSubLabel}
                    description={phaseDescription}
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
                    isLast={index === filteredJourneyPhases.length - 1}
                    bgColorClass={phase.bgColorClass}
                    useOnlineLabels={useOnlineLabels}
                  />
                );
              })}
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
                  disabled={
                    selectedTouchpoints.length === 0 ||
                    hasPhysicalVenue === null ||
                    hasOnlinePresence === null ||
                    servesPublicCustomers === null ||
                    hasOnlineServices === null
                  }
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
            {/* Header with value messaging */}
            <div className="recommendation-header">
              <div className="header-icon-wrapper">
                <span className="header-icon">🎯</span>
              </div>
              <h1 className="discovery-title">
                Your personalised accessibility priorities
              </h1>
              <p className="discovery-subtitle">
                We've identified the areas that matter most for your business. Each module gives you practical actions you can take right away.
              </p>
              <div className="header-value-points">
                <span className="value-point"><span className="check-icon">✓</span> Tailored to your business type</span>
                <span className="value-point"><span className="check-icon">✓</span> Clear, actionable priorities</span>
                <span className="value-point"><span className="check-icon">✓</span> Downloadable report included</span>
              </div>
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

            {/* Selected modules count - enhanced */}
            <div className="module-selection-summary">
              <div className="selection-info">
                <span className="selection-count">
                  {customSelectedModules.length}
                </span>
                <span className="selection-label">
                  module{customSelectedModules.length !== 1 ? 's' : ''} in your review
                </span>
              </div>
              <div className="selection-time-wrapper">
                <span className="time-icon">⏱</span>
                <span className="selection-time">
                  ~{MODULES.filter(m => customSelectedModules.includes(m.id))
                    .reduce((sum, m) => sum + m.estimatedTime, 0)} min total
                </span>
              </div>
            </div>

            {/* Instruction prompt */}
            <div className="selection-instruction">
              <span className="instruction-icon">👆</span>
              <p>Review the recommended modules below. <strong>Click to select or deselect</strong> based on what's relevant to your business.</p>
            </div>

            {/* Selectable module tiles by category */}
            {(() => {
              // Get recommended module IDs for highlighting
              const recommendedIds = new Set([
                ...recommendationResult.recommendedModules.map(m => m.moduleId),
                ...recommendationResult.alsoRelevant.map(m => m.moduleId),
              ]);

              // Define categories with all module codes - enhanced with icons and outcomes
              const categories = [
                {
                  id: 'before-visit',
                  label: 'Before visit',
                  icon: '🔍',
                  description: 'Help customers find you and plan their visit with confidence',
                  outcome: 'Customers arrive prepared and feeling welcome',
                  codes: ['B1', 'B2', 'B3', 'B4.1', 'B4.2', 'B4.3'],
                },
                {
                  id: 'during-visit',
                  label: 'During visit',
                  icon: '🏪',
                  description: 'Create a physical space where everyone can participate fully',
                  outcome: 'Customers navigate and engage independently',
                  codes: ['A1', 'A2', 'A3a', 'A3b', 'A4', 'A5', 'A6', 'A7'],
                },
                {
                  id: 'service',
                  label: 'Service and support',
                  icon: '🤝',
                  description: 'Communicate and serve customers with diverse needs',
                  outcome: 'Every customer interaction is inclusive',
                  codes: ['C1', 'C2'],
                },
                {
                  id: 'after-visit',
                  label: 'After visit',
                  icon: '📈',
                  description: 'Gather feedback and continuously improve',
                  outcome: 'Your accessibility grows over time',
                  codes: ['C3'],
                },
              ];

              return categories.map(category => {
                // Get all modules for this category
                const categoryModules = MODULES.filter(m =>
                  category.codes.includes(m.id)
                );

                // Filter based on showAllModules toggle
                const visibleModules = showAllModules
                  ? categoryModules
                  : categoryModules.filter(m =>
                      recommendedIds.has(m.id) || customSelectedModules.includes(m.id)
                    );

                if (visibleModules.length === 0) return null;

                return (
                  <div key={category.id} className={`module-category category-${category.id}`}>
                    <div className="category-header">
                      <span className="category-icon">{category.icon}</span>
                      <div className="category-info">
                        <h3 className="category-label">{category.label}</h3>
                        <p className="category-description">{category.description}</p>
                      </div>
                    </div>
                    <p className="category-outcome">
                      <span className="outcome-label">Outcome:</span> {category.outcome}
                    </p>
                    <div className="module-tiles selectable">
                      {visibleModules.map(module => {
                        const isSelected = customSelectedModules.includes(module.id);
                        const isRecommended = recommendedIds.has(module.id);

                        return (
                          <div
                            key={module.id}
                            className={`module-tile selectable ${isSelected ? 'selected' : ''} ${isRecommended ? 'recommended' : ''}`}
                            onClick={() => toggleModuleSelection(module.id)}
                            role="checkbox"
                            aria-checked={isSelected}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                toggleModuleSelection(module.id);
                              }
                            }}
                          >
                            <div className="tile-checkbox">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleModuleSelection(module.id)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <div className="tile-content">
                              <div className="tile-header">
                                <span className="tile-name">{module.name}</span>
                                <span className="tile-code">{module.id}</span>
                              </div>
                              <p className="tile-description">{module.description}</p>
                              <div className="tile-meta">
                                <span className="tile-time">{module.estimatedTime} min</span>
                                {isRecommended && (
                                  <span className="tile-badge">Recommended</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              });
            })()}

            {/* Show more/less modules toggle */}
            <div className="show-all-toggle">
              <button
                className="btn-toggle-modules"
                onClick={() => setShowAllModules(!showAllModules)}
              >
                {showAllModules ? '− Show fewer modules' : '+ Show all available modules'}
              </button>
              <p className="toggle-hint">
                {showAllModules
                  ? 'Showing all modules. Click to show only recommended.'
                  : 'Want to add more? Click to see all available modules.'}
              </p>
            </div>

            {/* Reassurance section */}
            <div className="reassurance-section">
              <p className="reassurance-text">
                <strong>Not sure what to include?</strong> Start with our recommendations – you can always add more later.
              </p>
              <p className="reassurance-subtext">
                Click any module to add or remove it from your review.
              </p>
            </div>

            {/* Actions */}
            <div className="discovery-actions-card">
              <p className="action-context">
                Ready to start? Your review will take approximately {MODULES.filter(m => customSelectedModules.includes(m.id)).reduce((sum, m) => sum + m.estimatedTime, 0)} minutes.
              </p>
              <div className="discovery-buttons" style={{ flexDirection: 'column' }}>
                <button className="btn-continue" onClick={handleContinue}>
                  Continue to review →
                </button>
                <button className="btn-back" onClick={handleBack}>
                  ← Back to adjust answers
                </button>
              </div>
              <p className="action-reassurance">
                You'll get a downloadable report with prioritised actions at the end.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
