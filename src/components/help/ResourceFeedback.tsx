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
      <div className="resource-feedback resource-feedback-submitted">
        <p>Thanks for your feedback! We use this to improve our resources.</p>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <div className="resource-feedback resource-feedback-prompt">
        <button className="feedback-prompt-btn" onClick={() => setIsOpen(true)}>
          Was this resource helpful? Let us know
        </button>
      </div>
    );
  }

  return (
    <div className="resource-feedback resource-feedback-form">
      <h3>Was this resource helpful?</h3>
      <form onSubmit={handleSubmit}>
        <div className="feedback-helpful-row">
          <button
            type="button"
            className={`feedback-helpful-btn ${isHelpful === true ? 'selected' : ''}`}
            onClick={() => { setIsHelpful(true); setCategory(null); }}
          >
            Yes, helpful
          </button>
          <button
            type="button"
            className={`feedback-helpful-btn feedback-not-helpful ${isHelpful === false ? 'selected' : ''}`}
            onClick={() => setIsHelpful(false)}
          >
            I need more support
          </button>
        </div>

        {isHelpful === false && (
          <div className="feedback-categories">
            <p className="feedback-categories-label">What would help you most?</p>
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
          </div>
        )}

        {isHelpful !== null && (
          <div className="feedback-details">
            <label htmlFor="feedback-details-input">
              {isHelpful ? 'Any other comments? (optional)' : 'Tell us more about what you need (optional)'}
            </label>
            <textarea
              id="feedback-details-input"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              placeholder={isHelpful
                ? 'What was most useful?'
                : 'What specific information or support would help?'
              }
            />
          </div>
        )}

        {isHelpful !== null && (
          <div className="feedback-actions">
            <button
              type="submit"
              className="feedback-submit-btn"
              disabled={isSubmitting || (!isHelpful && !category)}
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
        )}
      </form>
    </div>
  );
}
