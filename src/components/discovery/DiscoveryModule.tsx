import { useState, useMemo, useEffect, useRef } from 'react';
import type { ReviewMode, DiscoveryData, RecommendationResult } from '../../types';
import { JOURNEY_PHASES, getTouchpointBlocks } from '../../data/touchpoints';
import {
  generateRecommendations,
  moduleIdsToCodes,
  calculateDepthRecommendation,
  MODULES,
} from '../../lib/recommendationEngine';
import { getDiscoveryProgress, saveDiscoveryProgress, clearDiscoveryProgress } from '../../utils/session';
import { JourneyPhaseSection } from './JourneyPhaseSection';
import { ModuleDetailModal } from './ModuleDetailModal';
import './discovery.css';

interface DiscoveryModuleProps {
  onComplete: (data: {
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
      offersExperiences: boolean;
      offersAccommodation: boolean;
      assessmentType?: 'business' | 'event' | 'both';
    };
  }) => void;
  onBack: () => void;
  onSkip: () => void;
  industryId?: string;
  serviceType?: string;
  initialStep?: 'touchpoints' | 'recommendation';
  existingData?: {
    selectedTouchpoints?: string[];
    selectedSubTouchpoints?: string[];
    recommendedModules?: string[];
    businessContext?: {
      hasPhysicalVenue?: boolean;
      hasOnlinePresence?: boolean;
      servesPublicCustomers?: boolean;
      hasOnlineServices?: boolean;
      offersExperiences?: boolean;
      offersAccommodation?: boolean;
      assessmentType?: 'business' | 'event' | 'both';
    };
  };
}

export function DiscoveryModule({
  onComplete,
  onBack,
  onSkip,
  industryId = 'other',
  serviceType = 'other',
  initialStep = 'touchpoints',
  existingData,
}: DiscoveryModuleProps) {
  // Load saved progress if no existingData provided
  const savedProgress = !existingData ? getDiscoveryProgress() : null;

  const [selectedTouchpoints, setSelectedTouchpoints] = useState<string[]>(
    existingData?.selectedTouchpoints || savedProgress?.selectedTouchpoints || []
  );
  const [selectedSubTouchpoints, setSelectedSubTouchpoints] = useState<string[]>(
    existingData?.selectedSubTouchpoints || savedProgress?.selectedSubTouchpoints || []
  );
  const [openPhases, setOpenPhases] = useState<string[]>(['before-arrival']);
  const [currentStep, setCurrentStep] = useState<'touchpoints' | 'recommendation'>(
    savedProgress?.currentStep || initialStep
  );

  // Track phases marked as "not applicable"
  const [notApplicablePhases, setNotApplicablePhases] = useState<string[]>(
    savedProgress?.notApplicablePhases || []
  );

  // Business context questions (only the two that control phase/touchpoint visibility)
  const [hasPhysicalVenue, setHasPhysicalVenue] = useState<boolean | null>(
    existingData?.businessContext?.hasPhysicalVenue ?? savedProgress?.businessContext?.hasPhysicalVenue ?? null
  );
  const [hasOnlinePresence, setHasOnlinePresence] = useState<boolean | null>(
    existingData?.businessContext?.hasOnlinePresence ?? savedProgress?.businessContext?.hasOnlinePresence ?? null
  );
  // Assessment type - 'business' for ongoing operations, 'event' for standalone events, 'both' for both
  type AssessmentType = 'business' | 'event' | 'both';
  const [assessmentType, setAssessmentType] = useState<AssessmentType>(() => {
    // Check for new assessmentType field first, then fall back to legacy isEventAssessment
    const existingValue = existingData?.businessContext?.assessmentType ?? savedProgress?.businessContext?.assessmentType;
    if (existingValue) return existingValue;
    // Legacy support for old boolean field
    const legacyValue = (savedProgress?.businessContext as Record<string, unknown>)?.isEventAssessment;
    if (legacyValue === true) return 'event';
    return 'business';
  });

  // Customized module selection (user can modify recommendations)
  const [customSelectedModules, setCustomSelectedModules] = useState<string[]>(
    existingData?.recommendedModules || savedProgress?.customSelectedModules || []
  );
  const [showAllModules, setShowAllModules] = useState(false);

  // Module detail modal state
  const [moduleDetailId, setModuleDetailId] = useState<string | null>(null);

  // Track whether we've initialized modules for fresh discovery
  // Only true if explicitly returning to adjust modules (initialStep='recommendation' with existing data)
  const hasInitializedModules = useRef(
    initialStep === 'recommendation' && !!existingData?.recommendedModules?.length
  );

  // Auto-save progress whenever state changes
  useEffect(() => {
    // Don't save if we have existingData (editing mode)
    if (existingData) return;

    saveDiscoveryProgress({
      selectedTouchpoints,
      selectedSubTouchpoints,
      notApplicablePhases,
      customSelectedModules,
      currentStep,
      businessContext: {
        hasPhysicalVenue,
        hasOnlinePresence,
        servesPublicCustomers: null,
        hasOnlineServices: null,
        offersExperiences: null,
        offersAccommodation: null,
        assessmentType,
      },
      lastUpdated: new Date().toISOString(),
    });
  }, [
    selectedTouchpoints,
    selectedSubTouchpoints,
    notApplicablePhases,
    customSelectedModules,
    currentStep,
    hasPhysicalVenue,
    hasOnlinePresence,
    assessmentType,
    existingData,
  ]);

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

  // Toggle phase as "not applicable"
  const togglePhaseNotApplicable = (phaseId: string) => {
    setNotApplicablePhases(prev => {
      const isCurrentlyNA = prev.includes(phaseId);
      if (isCurrentlyNA) {
        // Un-marking as N/A
        return prev.filter(p => p !== phaseId);
      } else {
        // Marking as N/A - also clear any selected touchpoints for this phase
        const phase = JOURNEY_PHASES.find(p => p.id === phaseId);
        if (phase) {
          const phaseTouchpointIds = phase.touchpoints.map(t => t.id);
          setSelectedTouchpoints(current =>
            current.filter(tp => !phaseTouchpointIds.includes(tp))
          );
          // Also clear sub-touchpoints
          const phaseSubTouchpointIds = phase.touchpoints
            .flatMap(t => t.subTouchpoints || [])
            .map(st => st.id);
          setSelectedSubTouchpoints(current =>
            current.filter(st => !phaseSubTouchpointIds.includes(st))
          );
        }
        return [...prev, phaseId];
      }
    });
  };

  // Filter journey phases based on business context answers
  // NOTE: This must be defined BEFORE isPhaseReviewed and recommendationResult which depend on it
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

      // Filter out auto-included touchpoints for physical venues
      if (hasPhysicalVenue) {
        const visibleTouchpoints = phase.touchpoints.filter(tp => tp.autoInclude !== 'physical');
        if (visibleTouchpoints.length !== phase.touchpoints.length) {
          return {
            ...phase,
            touchpoints: visibleTouchpoints,
            blocks: phase.blocks?.map(block => ({
              ...block,
              touchpointIds: block.touchpointIds.filter(id =>
                visibleTouchpoints.some(tp => tp.id === id)
              ),
            })).filter(block => block.touchpointIds.length > 0),
          };
        }
      }

      return phase;
    }).filter(phase => phase.touchpoints.length > 0);
  }, [hasPhysicalVenue, hasOnlinePresence]);

  // Check if a phase has been reviewed (has selections OR marked as N/A)
  const isPhaseReviewed = (phaseId: string): boolean => {
    if (notApplicablePhases.includes(phaseId)) return true;
    const phase = filteredJourneyPhases.find(p => p.id === phaseId);
    if (!phase) return true; // Phase not shown, considered reviewed
    return phase.touchpoints.some(t => selectedTouchpoints.includes(t.id));
  };

  // Calculate recommendations using the recommendation engine
  const recommendationResult = useMemo(() => {
    // Check if all phases are marked as N/A (user explicitly said nothing applies)
    const allPhasesNA = filteredJourneyPhases.length > 0 &&
      filteredJourneyPhases.every(phase => notApplicablePhases.includes(phase.id));

    const discoveryData: DiscoveryData = {
      selectedTouchpoints,
      selectedSubTouchpoints,
      responses: {},
      notApplicablePhases,
      explicitlyCompleted: allPhasesNA,
      businessContext: {
        hasPhysicalVenue: hasPhysicalVenue ?? undefined,
        hasOnlinePresence: hasOnlinePresence ?? undefined,
        offersExperiences: selectedTouchpoints.includes('experiences-activities') || undefined,
        offersAccommodation: selectedTouchpoints.includes('accommodation-rooms') || undefined,
        assessmentType,
      },
    };

    // Treat all selected touchpoints as "yes" responses
    selectedTouchpoints.forEach(tp => {
      discoveryData.responses![tp] = 'yes';
    });

    return generateRecommendations(discoveryData, industryId, serviceType);
  }, [selectedTouchpoints, selectedSubTouchpoints, notApplicablePhases, filteredJourneyPhases, industryId, serviceType, hasPhysicalVenue, hasOnlinePresence, assessmentType]);

  // Calculate depth recommendation
  const depthRecommendation = useMemo(() => {
    return calculateDepthRecommendation(selectedTouchpoints);
  }, [selectedTouchpoints]);

  // Event modules to add when event assessment is selected
  const eventModuleIds = ['6.1', '6.2', '6.3', '6.4', '6.5'];

  // Initialize custom module selection when entering recommendation step
  useEffect(() => {
    // Only initialize once when transitioning to recommendation step for fresh discovery
    if (currentStep === 'recommendation' && !hasInitializedModules.current) {
      // Initialize with all recommended modules (for 'business' or 'both' mode)
      const allRecommended = assessmentType === 'event' ? [] : [
        ...recommendationResult.recommendedModules.map(m => m.moduleId),
        ...recommendationResult.alsoRelevant.map(m => m.moduleId),
      ];
      // Add event modules if event or both assessment is selected
      if (assessmentType === 'event' || assessmentType === 'both') {
        eventModuleIds.forEach(id => {
          if (!allRecommended.includes(id)) {
            allRecommended.push(id);
          }
        });
      }
      setCustomSelectedModules(allRecommended);
      hasInitializedModules.current = true;
    }
  }, [currentStep, recommendationResult, assessmentType]);

  const handleContinue = () => {
    if (currentStep === 'touchpoints') {
      // Initialize all recommended modules when transitioning to recommendation step
      // (only if not already initialized from existingData)
      if (!hasInitializedModules.current) {
        // For 'event' only mode, start with empty list; for 'business' or 'both', use recommendations
        const allRecommended = assessmentType === 'event' ? [] : [
          ...recommendationResult.recommendedModules.map(m => m.moduleId),
          ...recommendationResult.alsoRelevant.map(m => m.moduleId),
        ];
        // Add event modules if event or both assessment is selected
        if (assessmentType === 'event' || assessmentType === 'both') {
          eventModuleIds.forEach(id => {
            if (!allRecommended.includes(id)) {
              allRecommended.push(id);
            }
          });
        }
        setCustomSelectedModules(allRecommended);
        hasInitializedModules.current = true;
      }
      setCurrentStep('recommendation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Use custom selected modules (user may have modified)
      const moduleCodes = moduleIdsToCodes(customSelectedModules);

      // Clear saved progress since discovery is complete
      clearDiscoveryProgress();

      onComplete({
        selectedTouchpoints,
        selectedSubTouchpoints,
        notApplicablePhases,
        recommendedModules: moduleCodes,
        recommendedDepth: depthRecommendation.recommendedDepth,
        recommendationResult,
        businessContext: {
          hasPhysicalVenue: hasPhysicalVenue ?? false,
          hasOnlinePresence: hasOnlinePresence ?? false,
          servesPublicCustomers: true,
          hasOnlineServices: (hasOnlinePresence ?? false),
          offersExperiences: selectedTouchpoints.includes('experiences-activities'),
          offersAccommodation: selectedTouchpoints.includes('accommodation-rooms'),
          assessmentType,
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
          {/* Time estimate removed - not useful here */}
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
                    <span>Space & experiences</span>
                    <span className="arrow">→</span>
                  </>
                )}
                <span>Customer service</span>
                <span className="arrow">→</span>
                <span>Staying connected</span>
                <span className="arrow">→</span>
                <span>Policy</span>
              </div>
            </div>

            {/* Lead questions - shape which journey phases appear */}
            <div className="business-context-questions">
              <div className="context-lead-questions">
                {/* Assessment Type - first question, sets the frame */}
                <fieldset className="context-question event-assessment-question">
                  <legend>
                    What would you like to assess?
                  </legend>
                  <p className="field-helper">Choose based on what you're reviewing</p>
                  <div className="radio-group radio-group-vertical">
                    <label className="radio-label radio-label-card">
                      <input
                        type="radio"
                        name="assessment_type"
                        checked={assessmentType === 'business'}
                        onChange={() => setAssessmentType('business')}
                      />
                      <div className="radio-card-content">
                        <span className="radio-card-title">Ongoing business operations</span>
                        <span className="radio-card-description">Your venue, services, website, and day-to-day customer experience. Best for permanent locations, ongoing services, or general improvement.</span>
                      </div>
                    </label>
                    <label className="radio-label radio-label-card">
                      <input
                        type="radio"
                        name="assessment_type"
                        checked={assessmentType === 'event'}
                        onChange={() => setAssessmentType('event')}
                      />
                      <div className="radio-card-content">
                        <span className="radio-card-title">Standalone event</span>
                        <span className="radio-card-description">A specific event like a festival, conference, concert, market, or function. Covers event planning, promotion, venue setup, and on-the-day operations.</span>
                      </div>
                    </label>
                    <label className="radio-label radio-label-card">
                      <input
                        type="radio"
                        name="assessment_type"
                        checked={assessmentType === 'both'}
                        onChange={() => setAssessmentType('both')}
                      />
                      <div className="radio-card-content">
                        <span className="radio-card-title">🏢 + 🎪 Business Operations & Event</span>
                        <span className="radio-card-description">Assess both your ongoing operations AND a specific event. Choose this if your business also hosts or runs events like markets, festivals, conferences, or functions.</span>
                      </div>
                    </label>
                  </div>
                </fieldset>

                <fieldset className="context-question">
                  <legend>
                    Do you have a physical venue customers visit? <span className="required">*</span>
                  </legend>
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
                  <p className="field-tip">
                    <span className="tip-icon">💡</span>
                    Select "Yes" even for small spaces like a pop-up stall, market booth, or shared office where customers come to you.
                  </p>
                </fieldset>

                <fieldset className="context-question">
                  <legend>
                    Do you have an online presence?{' '}
                    <span className="required">*</span>
                  </legend>
                  <p className="field-helper">e.g. website, app, social media, online booking, or digital services</p>
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
                  <p className="field-tip">
                    <span className="tip-icon">💡</span>
                    This includes a Facebook page, Google Business listing, or any way customers find information about you online.
                  </p>
                </fieldset>
              </div>
            </div>

            {/* Event or Both mode message */}
            {assessmentType === 'event' && (
              <div className="context-message event-mode-message">
                <span className="context-icon">🎪</span>
                <div>
                  <p><strong>Event assessment mode</strong></p>
                  <p>
                    You'll receive the 5 standalone Event modules covering the full event journey from planning to pack-down.
                    The touchpoint selection below is optional for event-only assessments.
                  </p>
                </div>
              </div>
            )}

            {assessmentType === 'both' && (
              <div className="context-message both-mode-message">
                <span className="context-icon">🏢🎪</span>
                <div>
                  <p><strong>Combined assessment</strong></p>
                  <p>
                    You'll receive organisational modules based on the touchpoints below, plus the 5 standalone Event modules.
                  </p>
                </div>
              </div>
            )}

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

            {/* Journey mapping instruction - shown once lead questions are answered */}
            {hasPhysicalVenue !== null && hasOnlinePresence !== null && (
              <div className="journey-instruction">
                <div className="instruction-header">
                  <h2>Walk through your customer journey</h2>
                </div>
                <p className="instruction-detail">
                  Below are the stages of a typical customer experience. <strong>Expand each section</strong> and tick the touchpoints that apply to your business. This helps us recommend the right modules for your review.
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
                const phaseTip = useOnlineLabels && phase.tipOnline ? phase.tipOnline : phase.tip;

                return (
                  <JourneyPhaseSection
                    key={phase.id}
                    phaseId={phase.id}
                    label={phaseLabel}
                    subLabel={phaseSubLabel}
                    description={phaseDescription}
                    tip={phaseTip}
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
                    isNotApplicable={notApplicablePhases.includes(phase.id)}
                    onToggleNotApplicable={() => togglePhaseNotApplicable(phase.id)}
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
                    // Lead questions must be answered
                    hasPhysicalVenue === null ||
                    hasOnlinePresence === null ||
                    // All journey phases must be reviewed (selected OR marked N/A)
                    !filteredJourneyPhases.every(phase => isPhaseReviewed(phase.id))
                  }
                >
                  Continue →
                </button>
              </div>

              <div className="discovery-skip-link">
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

            {/* Selected modules count */}
            <div className="module-selection-summary">
              <div className="selection-info">
                <span className="selection-count">
                  {customSelectedModules.length}
                </span>
                <span className="selection-label">
                  module{customSelectedModules.length !== 1 ? 's' : ''} in your review
                </span>
              </div>
              {/* Time estimate removed */}
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
                  codes: ['1.1', '3.5', '3.6', '1.2', '1.3', '1.4', '1.5', '1.6'],
                },
                {
                  id: 'during-visit',
                  label: 'During visit',
                  icon: '🏪',
                  description: 'Create a physical space where everyone can participate fully',
                  outcome: 'Customers navigate and engage independently',
                  codes: ['2.1', '2.2', '2.3', '2.4', '3.1', '3.2', '3.3', '3.4', '3.7', '3.8', '3.9', '3.10', '3.11', '3.12', '4.4'],
                },
                {
                  id: 'service',
                  label: 'Service and support',
                  icon: '🤝',
                  description: 'Communicate and serve customers with diverse needs',
                  outcome: 'Every customer interaction is inclusive',
                  codes: ['4.2', '4.3'],
                },
                {
                  id: 'after-visit',
                  label: 'After visit',
                  icon: '📈',
                  description: 'Gather feedback and stay connected with customers',
                  outcome: 'Learn and build lasting relationships',
                  codes: ['4.5', '4.6'],
                },
                {
                  id: 'policy-operations',
                  label: 'Policy and operations',
                  icon: '📋',
                  description: 'Embed accessibility into your organisational practices',
                  outcome: 'Accessibility becomes part of how you operate',
                  codes: ['5.1', '5.2', '5.3', '5.4', '5.5', '5.6'],
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
                        <h2 className="category-label">{category.label}</h2>
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
                            onClick={() => setModuleDetailId(module.id)}
                            role="button"
                            aria-label={`View details for ${module.name}${isSelected ? ' (selected)' : ''}`}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setModuleDetailId(module.id);
                              }
                            }}
                          >
                            <div className="tile-checkbox">
                              <input
                                type="checkbox"
                                id={`module-${module.id}`}
                                checked={isSelected}
                                onChange={() => toggleModuleSelection(module.id)}
                                onClick={(e) => e.stopPropagation()}
                                aria-label={`Select ${module.name}`}
                              />
                            </div>
                            <div className="tile-content">
                              <div className="tile-header">
                                <span className="tile-name">{module.name}</span>
                              </div>
                              <p className="tile-description">{module.description}</p>
                              <div className="tile-meta">
                                {isRecommended && (
                                  <span className="tile-badge">Recommended</span>
                                )}
                              </div>
                              <span className="tile-tap-hint">Tap for details</span>
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
                {showAllModules ? '− Show recommended modules' : '+ Show all available modules'}
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
                You've selected {customSelectedModules.length} modules to review.
              </p>
              <div className="discovery-buttons" style={{ flexDirection: 'column' }}>
                <button className="btn-continue" onClick={handleContinue}>
                  Choose your path →
                </button>
                <button className="btn-back" onClick={handleBack}>
                  ← Back to adjust answers
                </button>
              </div>
              <p className="action-reassurance">
                Next, you'll choose between a quick pulse check or a comprehensive deep dive.
              </p>
            </div>
          </div>
        )}

        {/* Module Detail Modal */}
        {moduleDetailId && (
          <ModuleDetailModal
            moduleId={moduleDetailId}
            isSelected={customSelectedModules.includes(moduleDetailId)}
            onClose={() => setModuleDetailId(null)}
            onToggleSelect={toggleModuleSelection}
          />
        )}
      </div>
    </div>
  );
}
