import { useState } from 'react';
import type { Touchpoint } from '../../types';
import './discovery.css';

interface TouchpointBlock {
  id: string;
  label: string;
  touchpoints: Touchpoint[];
}

interface JourneyPhaseSectionProps {
  phaseId: string;
  label: string;
  subLabel: string;
  description: string;
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
}

const ICON_MAP: Record<string, string> = {
  'search': '🔍',
  'map-pin': '📍',
  'message-circle': '💬',
};

export function JourneyPhaseSection({
  phaseId,
  label,
  subLabel,
  description,
  icon,
  touchpoints,
  touchpointBlocks,
  selectedTouchpoints,
  selectedSubTouchpoints,
  onToggleTouchpoint,
  onToggleSubTouchpoint,
  isOpen,
  onOpenChange,
  bgColorClass,
}: JourneyPhaseSectionProps) {
  const [expandedTouchpoints, setExpandedTouchpoints] = useState<string[]>([]);

  const selectedCount = touchpoints.filter(t => selectedTouchpoints.includes(t.id)).length;
  const hasSelections = selectedCount > 0;

  const toggleExpanded = (id: string) => {
    setExpandedTouchpoints(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const renderTouchpoint = (touchpoint: Touchpoint) => {
    const isSelected = selectedTouchpoints.includes(touchpoint.id);
    const isExpanded = expandedTouchpoints.includes(touchpoint.id);
    const hasSubTouchpoints = touchpoint.subTouchpoints && touchpoint.subTouchpoints.length > 0;

    return (
      <div key={touchpoint.id} className="touchpoint-wrapper">
        <div
          className={`touchpoint-item ${isSelected ? 'selected' : ''}`}
          onClick={() => onToggleTouchpoint(touchpoint.id)}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleTouchpoint(touchpoint.id)}
            onClick={(e) => e.stopPropagation()}
            className="touchpoint-checkbox"
          />
          <div className="touchpoint-content">
            <div className="touchpoint-label">{touchpoint.label}</div>
            <div className="touchpoint-description">{touchpoint.description}</div>
          </div>
          {hasSubTouchpoints && isSelected && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(touchpoint.id);
              }}
              className="expand-button"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              <span className={`chevron ${isExpanded ? 'rotated' : ''}`}>▼</span>
            </button>
          )}
        </div>

        {/* Sub-touchpoints */}
        {hasSubTouchpoints && isSelected && isExpanded && (
          <div className="sub-touchpoints">
            <p className="sub-touchpoints-hint">
              Optional: Select specific areas to refine recommendations
            </p>
            {touchpoint.subTouchpoints!.map((sub) => (
              <div
                key={sub.id}
                className={`sub-touchpoint-item ${selectedSubTouchpoints.includes(sub.id) ? 'selected' : ''}`}
                onClick={() => onToggleSubTouchpoint(sub.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedSubTouchpoints.includes(sub.id)}
                  onChange={() => onToggleSubTouchpoint(sub.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="touchpoint-checkbox"
                />
                <span className="sub-touchpoint-label">{sub.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`journey-phase-section ${bgColorClass}`}>
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
          {hasSelections && (
            <span className="selection-count">
              {selectedCount} selected
            </span>
          )}
          <span className={`phase-chevron ${isOpen ? 'rotated' : ''}`}>▼</span>
        </div>
      </div>

      {/* Content - Collapsible */}
      {isOpen && (
        <div className="phase-content">
          <p className="phase-description">{description}</p>

          {/* Render by blocks if provided, otherwise flat list */}
          {touchpointBlocks && touchpointBlocks.length > 0 ? (
            <div className="touchpoint-blocks">
              {touchpointBlocks.map((block) => (
                <div key={block.id} className="touchpoint-block">
                  <h4 className="block-label">{block.label}</h4>
                  <div className="touchpoint-list">
                    {block.touchpoints.map(renderTouchpoint)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="touchpoint-list">
              {touchpoints.map(renderTouchpoint)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
