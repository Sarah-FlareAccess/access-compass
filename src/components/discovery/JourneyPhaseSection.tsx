import type { Touchpoint } from '../../types';
import './discovery.css';

interface TouchpointBlock {
  id: string;
  label: string;
  labelOnline?: string;
  touchpoints: Touchpoint[];
}

interface JourneyPhaseSectionProps {
  phaseId: string;
  label: string;
  subLabel: string;
  description: string;
  tip?: string; // Helpful tip for this phase
  icon: string;
  touchpoints: Touchpoint[];
  touchpointBlocks?: TouchpointBlock[];
  selectedTouchpoints: string[];
  selectedSubTouchpoints: string[];
  onToggleTouchpoint: (id: string) => void;
  onToggleSubTouchpoint: (id: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isFirst?: boolean;
  isLast?: boolean;
  bgColorClass: string;
  useOnlineLabels?: boolean; // Whether to use online-specific labels
  isNotApplicable?: boolean; // Whether this phase is marked as N/A
  onToggleNotApplicable?: () => void; // Callback to toggle N/A status
}

const ICON_MAP: Record<string, string> = {
  'search': '🔍',
  'map-pin': '📍',
  'message-circle': '💬',
  'users': '👥',
  'clipboard': '📋',
};

export function JourneyPhaseSection({
  phaseId: _phaseId,
  label,
  subLabel,
  description,
  tip,
  icon,
  touchpoints,
  touchpointBlocks,
  selectedTouchpoints,
  selectedSubTouchpoints: _selectedSubTouchpoints,
  onToggleTouchpoint,
  onToggleSubTouchpoint: _onToggleSubTouchpoint,
  isOpen,
  onOpenChange,
  bgColorClass,
  useOnlineLabels = false,
  isNotApplicable = false,
  onToggleNotApplicable,
}: JourneyPhaseSectionProps) {
  const selectedCount = touchpoints.filter(t => selectedTouchpoints.includes(t.id)).length;
  const hasSelections = selectedCount > 0;

  const handleTouchpointToggle = (touchpoint: Touchpoint) => {
    onToggleTouchpoint(touchpoint.id);
  };

  const renderTouchpoint = (touchpoint: Touchpoint) => {
    const isSelected = selectedTouchpoints.includes(touchpoint.id);

    // Use online-specific labels when applicable
    const touchpointLabel = useOnlineLabels && touchpoint.labelOnline ? touchpoint.labelOnline : touchpoint.label;
    const touchpointDescription = useOnlineLabels && touchpoint.descriptionOnline ? touchpoint.descriptionOnline : touchpoint.description;

    return (
      <div key={touchpoint.id} className="touchpoint-wrapper">
        <label
          className={`touchpoint-item ${isSelected ? 'selected' : ''}`}
          htmlFor={`touchpoint-${touchpoint.id}`}
        >
          <input
            type="checkbox"
            id={`touchpoint-${touchpoint.id}`}
            checked={isSelected}
            onChange={() => handleTouchpointToggle(touchpoint)}
            className="touchpoint-checkbox"
          />
          <div className="touchpoint-content">
            <div className="touchpoint-label">{touchpointLabel}</div>
            <div className="touchpoint-description">{touchpointDescription}</div>
            {touchpoint.example && (
              <div className="touchpoint-example">{touchpoint.example}</div>
            )}
          </div>
        </label>
      </div>
    );
  };

  // Determine review status for the header badge
  const getReviewStatus = () => {
    if (isNotApplicable) return { text: 'N/A', className: 'status-na' };
    if (hasSelections) return { text: `${selectedCount} selected`, className: 'status-selected' };
    return null;
  };

  const reviewStatus = getReviewStatus();

  return (
    <div className={`journey-phase-section ${bgColorClass} ${isNotApplicable ? 'phase-not-applicable' : ''}`}>
      {/* Header - Collapsible trigger */}
      <div
        className="phase-header"
        onClick={() => onOpenChange(!isOpen)}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenChange(!isOpen);
          }
        }}
      >
        <div className="phase-icon">
          {ICON_MAP[icon] || '📋'}
        </div>
        <div className="phase-info">
          <h3 className="phase-label">{label}</h3>
          <p className="phase-sublabel">{subLabel}</p>
        </div>
        <div className="phase-actions">
          {reviewStatus && (
            <span className={`selection-count ${reviewStatus.className}`}>
              {reviewStatus.text}
            </span>
          )}
          <span className={`phase-chevron ${isOpen ? 'rotated' : ''}`}>▼</span>
        </div>
      </div>

      {/* Content - Collapsible */}
      {isOpen && (
        <div className="phase-content">
          <p className="phase-description">{description}</p>
          {tip && (
            <div className="phase-tip">
              <span className="tip-icon">💡</span>
              <span className="tip-text">{tip}</span>
            </div>
          )}

          {/* Render by blocks if provided, otherwise flat list */}
          {!isNotApplicable && (
            <>
              {touchpointBlocks && touchpointBlocks.length > 0 ? (
                <div className="touchpoint-blocks">
                  {touchpointBlocks.map((block) => {
                    const blockLabel = useOnlineLabels && block.labelOnline ? block.labelOnline : block.label;
                    return (
                      <div key={block.id} className="touchpoint-block">
                        <h4 className="block-label">{blockLabel}</h4>
                        <div className="touchpoint-list">
                          {block.touchpoints.map(renderTouchpoint)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="touchpoint-list">
                  {touchpoints.map(renderTouchpoint)}
                </div>
              )}
            </>
          )}

          {/* Not Applicable Option */}
          {onToggleNotApplicable && (
            <div className="phase-na-option">
              <label
                className={`na-checkbox-label ${isNotApplicable ? 'checked' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleNotApplicable();
                }}
              >
                <input
                  type="checkbox"
                  checked={isNotApplicable}
                  onChange={onToggleNotApplicable}
                  onClick={(e) => e.stopPropagation()}
                  className="na-checkbox"
                />
                <span className="na-label-text">None of these apply to my business</span>
              </label>
              {isNotApplicable && (
                <p className="na-hint">This section has been marked as not applicable. No modules will be recommended for this area.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
