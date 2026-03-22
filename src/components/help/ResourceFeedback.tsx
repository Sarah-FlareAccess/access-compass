/**
 * Resource Feedback Component
 *
 * Inline feedback form at the bottom of resource pages.
 * Collects user feedback on whether the resource was helpful
 * and what additional information they need.
 */

import { useState } from 'react';
import './ResourceFeedback.css';

type FeedbackCategory = 'need-more-detail' | 'too-complex' | 'not-relevant' | 'missing-info' | 'other';

const FEEDBACK_CATEGORIES: { value: FeedbackCategory; label: string; hint: string }[] = [
  { value: 'need-more-detail', label: 'Need more detail', hint: 'The guidance is too high-level for my situation' },
  { value: 'too-complex', label: 'Too complex', hint: 'The information is hard to understand or apply' },
  { value: 'not-relevant', label: 'Not relevant to my business', hint: 'This doesn\'t apply to my type of business or venue' },
  { value: 'missing-info', label: 'Missing information', hint: 'There\'s something specific I need that isn\'t covered' },
  { value: 'other', label: 'Other feedback', hint: 'Something else about this resource' },
];

interface ResourceFeedbackProps {
  resourceTitle: string;
  resourceId: string;
}

export function ResourceFeedback({ resourceTitle, resourceId }: ResourceFeedbackProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
  const [category, setCategory] = useState<FeedbackCategory | null>(null);
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isHelpful === null) return;

    setIsSubmitting(true);

    const feedbackData = {
      resourceId,
      resourceTitle,
      isHelpful,
      category: !isHelpful ? category : null,
      details: details.trim() || null,
      pageUrl: window.location.href,
      timestamp: new Date().toISOString(),
    };

    console.log('Resource feedback submitted:', feedbackData);

    // Simulate API delay - replace with real backend call
    await new Promise(resolve => setTimeout(resolve, 800));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="resource-feedback resource-feedback-submitted" aria-live="polite">
        <p>Thanks for your feedback! We use this to improve our resources.</p>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <div className="resource-feedback resource-feedback-prompt">
        <span className="feedback-prompt-text">Did this resource answer your questions?</span>
        <div className="feedback-prompt-actions">
          <button className="feedback-thumb-btn feedback-thumb-yes" onClick={() => { setIsHelpful(true); setIsOpen(true); }}>
            Yes, thanks
          </button>
          <button className="feedback-thumb-btn feedback-thumb-no" onClick={() => { setIsHelpful(false); setIsOpen(true); }}>
            I still have questions
          </button>
        </div>
      </div>
    );
  }

  // Auto-submit positive feedback
  if (isHelpful === true && !isSubmitted) {
    const feedbackData = {
      resourceId,
      resourceTitle,
      isHelpful: true,
      category: null,
      details: null,
      pageUrl: window.location.href,
      timestamp: new Date().toISOString(),
    };
    console.log('Resource feedback submitted:', feedbackData);
    setIsSubmitted(true);
  }

  const requiresDetails = category === 'not-relevant' || category === 'missing-info' || category === 'other';
  const detailsMissing = requiresDetails && !details.trim();

  return (
    <div className="resource-feedback resource-feedback-form" role="region" aria-label="Resource feedback">
      <h3 id="feedback-heading">What would help you most?</h3>
      <p className="feedback-disclaimer">This is not a request for personalised support. Your feedback helps us identify where we need to add more content and guidance on this topic.</p>
      <form onSubmit={handleSubmit} noValidate>
        <fieldset className="feedback-categories" role="radiogroup" aria-labelledby="feedback-heading">
          <legend className="sr-only">Select what would help you most</legend>
          {FEEDBACK_CATEGORIES.map(cat => (
            <label
              key={cat.value}
              className={`feedback-category-option ${category === cat.value ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="feedback-category"
                value={cat.value}
                checked={category === cat.value}
                onChange={() => setCategory(cat.value)}
              />
              <div>
                <span className="feedback-category-label">{cat.label}</span>
                <span className="feedback-category-hint">{cat.hint}</span>
              </div>
            </label>
          ))}
        </fieldset>

        {category && (
          <div className="feedback-details">
            <label htmlFor="feedback-details-input">
              Tell us more about what you need {requiresDetails ? '(required)' : '(optional)'}
            </label>
            <textarea
              id="feedback-details-input"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              placeholder="What specific information or support would help?"
              aria-required={requiresDetails}
              aria-describedby={detailsMissing ? 'feedback-details-error' : undefined}
            />
            {detailsMissing && (
              <p id="feedback-details-error" className="feedback-error" role="alert">
                Please tell us what you need so we can improve this resource.
              </p>
            )}
          </div>
        )}

        <div className="feedback-actions">
          <button
            type="submit"
            className="feedback-submit-btn"
            disabled={isSubmitting || !category || detailsMissing}
          >
            {isSubmitting ? 'Sending...' : 'Send feedback'}
          </button>
          <button
            type="button"
            className="feedback-cancel-btn"
            onClick={() => { setIsOpen(false); setIsHelpful(null); setCategory(null); setDetails(''); }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
