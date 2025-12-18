/**
 * Help Content Component
 *
 * Renders the actual help content within panels.
 */

import type { HelpContent as HelpContentType, BusinessType } from '../../data/help/types';

interface HelpContentProps {
  content: HelpContentType;
  businessTypes?: BusinessType[];
  onNavigateToQuestion?: (questionId: string) => void;
  onSectionToggle?: (sectionName: string, isExpanded: boolean) => void;
  onFeedback?: (isPositive: boolean) => void;
}

export function HelpContent({
  content,
  businessTypes = [],
  onNavigateToQuestion,
  onSectionToggle: _onSectionToggle,
  onFeedback,
}: HelpContentProps) {
  // Filter examples by business type if provided
  const relevantExamples = content.examples?.filter(
    (ex) => businessTypes.length === 0 || businessTypes.includes(ex.businessType) || ex.businessType === 'general'
  );

  return (
    <div className="help-content">
      {/* Summary */}
      <div className="help-content-summary">
        <p>{content.summary}</p>
      </div>

      {/* Why It Matters */}
      {content.whyItMatters && (
        <section className="help-content-section">
          <h3>Why It Matters</h3>
          <p>{content.whyItMatters.text}</p>
          {content.whyItMatters.statistic && (
            <div className="help-statistic">
              <span className="help-statistic-value">{content.whyItMatters.statistic.value}</span>
              <span className="help-statistic-context">{content.whyItMatters.statistic.context}</span>
            </div>
          )}
        </section>
      )}

      {/* Tips */}
      {content.tips && content.tips.length > 0 && (
        <section className="help-content-section">
          <h3>Quick Tips</h3>
          <ul className="help-tips-list">
            {content.tips.map((tip, index) => (
              <li key={index} className="help-tip">
                <span className="help-tip-text">{tip.text}</span>
                {tip.detail && <span className="help-tip-detail">{tip.detail}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Examples */}
      {relevantExamples && relevantExamples.length > 0 && (
        <section className="help-content-section">
          <h3>Examples</h3>
          {relevantExamples.map((example, index) => (
            <div key={index} className="help-example">
              <span className="help-example-type">{example.businessTypeLabel}</span>
              <p className="help-example-scenario">{example.scenario}</p>
              <p className="help-example-solution">{example.solution}</p>
              {example.outcome && <p className="help-example-outcome">{example.outcome}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Related Questions */}
      {content.relatedQuestions && content.relatedQuestions.length > 0 && onNavigateToQuestion && (
        <section className="help-content-section">
          <h3>Related Questions</h3>
          <ul className="help-related-list">
            {content.relatedQuestions.map((related) => (
              <li key={related.questionId}>
                <button
                  className="help-related-link"
                  onClick={() => onNavigateToQuestion(related.questionId)}
                >
                  {related.questionText}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* External Resources */}
      {content.resources && content.resources.length > 0 && (
        <section className="help-content-section">
          <h3>Resources</h3>
          <ul className="help-resources-list">
            {content.resources.map((resource, index) => (
              <li key={index}>
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  {resource.title}
                </a>
                {resource.description && <span className="help-resource-desc">{resource.description}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Feedback */}
      {onFeedback && (
        <div className="help-feedback">
          <span>Was this helpful?</span>
          <button onClick={() => onFeedback(true)} aria-label="Yes, this was helpful">Yes</button>
          <button onClick={() => onFeedback(false)} aria-label="No, this was not helpful">No</button>
        </div>
      )}
    </div>
  );
}

export default HelpContent;
