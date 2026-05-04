import { useId, useState } from 'react';
import { Link2 } from 'lucide-react';
import type { QuestionResponse } from '../../hooks/useModuleProgress';
import { RESPONSE_LABELS } from '../../constants/responseOptions';
import './related-answer-banner.css';

export type RelatedAnswerScope = 'event-only' | 'all-events' | 'fresh';

interface RelatedAnswerBannerProps {
  sourceQuestionId: string;
  sourceModuleCode?: string;
  sourceResponse: QuestionResponse;
  guidance?: string;
  selectedScope: RelatedAnswerScope | undefined;
  onApply: (scope: Exclude<RelatedAnswerScope, 'fresh'>) => void;
  onAnswerFresh: () => void;
}

function summariseResponse(response: QuestionResponse): string {
  if (response.answer) {
    const label = RESPONSE_LABELS[response.answer] ?? response.answer;
    if (response.answer === 'partially' && response.partialDescription) {
      return `${label}: ${response.partialDescription}`;
    }
    return label;
  }
  if (response.measurement?.value !== undefined) {
    return `${response.measurement.value} ${response.measurement.unit}`;
  }
  if (response.multiSelectValues && response.multiSelectValues.length > 0) {
    return response.multiSelectValues.join(', ');
  }
  if (response.linkValue) {
    return response.linkValue;
  }
  if (response.notes) {
    return response.notes.length > 120 ? `${response.notes.slice(0, 120)}…` : response.notes;
  }
  return 'Recorded';
}

export function RelatedAnswerBanner({
  sourceQuestionId,
  sourceModuleCode,
  sourceResponse,
  guidance,
  selectedScope,
  onApply,
  onAnswerFresh,
}: RelatedAnswerBannerProps) {
  const headingId = useId();
  const [showGuidance, setShowGuidance] = useState(false);

  const summary = summariseResponse(sourceResponse);
  const moduleLabel = sourceModuleCode
    ? `Module ${sourceModuleCode} • ${sourceQuestionId}`
    : sourceQuestionId;

  return (
    <section
      className="related-answer-banner"
      aria-labelledby={headingId}
    >
      <div className="related-answer-banner-header">
        <Link2 size={18} aria-hidden="true" className="related-answer-banner-icon" />
        <h3 id={headingId} className="related-answer-banner-title">
          You answered this in a related question
        </h3>
      </div>

      <p className="related-answer-banner-source">
        From <span className="related-answer-banner-source-id">{moduleLabel}</span>:
        <span className="related-answer-banner-summary"> {summary}</span>
      </p>

      {guidance && (
        <div className="related-answer-banner-guidance-wrapper">
          <button
            type="button"
            className="related-answer-banner-guidance-toggle"
            aria-expanded={showGuidance}
            onClick={() => setShowGuidance(prev => !prev)}
          >
            {showGuidance ? 'Hide guidance' : 'When does this apply?'}
          </button>
          {showGuidance && (
            <p className="related-answer-banner-guidance">{guidance}</p>
          )}
        </div>
      )}

      <fieldset className="related-answer-banner-actions">
        <legend className="visually-hidden">Apply this answer or answer fresh</legend>

        <button
          type="button"
          className={`related-answer-banner-action ${selectedScope === 'event-only' ? 'is-selected' : ''}`}
          onClick={() => onApply('event-only')}
          aria-pressed={selectedScope === 'event-only'}
        >
          <span className="related-answer-banner-action-title">Use for this event only</span>
          <span className="related-answer-banner-action-detail">
            Inherits the answer here. Future events will be asked again.
          </span>
        </button>

        <button
          type="button"
          className={`related-answer-banner-action ${selectedScope === 'all-events' ? 'is-selected' : ''}`}
          onClick={() => onApply('all-events')}
          aria-pressed={selectedScope === 'all-events'}
        >
          <span className="related-answer-banner-action-title">Apply to all events</span>
          <span className="related-answer-banner-action-detail">
            Auto-fills this answer in this module across every event you assess.
          </span>
        </button>

        <button
          type="button"
          className={`related-answer-banner-action related-answer-banner-action-fresh ${selectedScope === 'fresh' ? 'is-selected' : ''}`}
          onClick={onAnswerFresh}
          aria-pressed={selectedScope === 'fresh'}
        >
          <span className="related-answer-banner-action-title">Answer fresh</span>
          <span className="related-answer-banner-action-detail">
            This event has different conditions. I want to answer separately.
          </span>
        </button>
      </fieldset>
    </section>
  );
}
