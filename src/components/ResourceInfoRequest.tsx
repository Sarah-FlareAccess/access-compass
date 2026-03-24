import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './ResourceInfoRequest.css';

type InfoCategory = 'need-more-detail' | 'too-complex' | 'not-relevant' | 'missing-info' | 'other';

const INFO_CATEGORIES: { value: InfoCategory; label: string; hint: string }[] = [
  { value: 'need-more-detail', label: 'Need more detail', hint: 'The guidance is too high-level for my situation' },
  { value: 'too-complex', label: 'Too complex', hint: 'The information is hard to understand or apply' },
  { value: 'not-relevant', label: 'Not relevant to my business', hint: 'This doesn\'t apply to my type of business or venue' },
  { value: 'missing-info', label: 'Missing information', hint: 'There\'s something specific I need that isn\'t covered' },
  { value: 'other', label: 'Other', hint: 'Something else about the resources' },
];

interface ResourceInfoRequestProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResourceInfoRequest({ isOpen, onClose }: ResourceInfoRequestProps) {
  const [category, setCategory] = useState<InfoCategory | null>(null);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const resetForm = useCallback(() => {
    setCategory(null);
    setDetails('');
    setIsSubmitting(false);
    setIsSubmitted(false);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  useEffect(() => {
    if (isOpen && closeRef.current) {
      closeRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, handleClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    setIsSubmitting(true);

    const data = {
      category,
      details: details.trim() || null,
      pageUrl: window.location.href,
      timestamp: new Date().toISOString(),
    };

    console.log('Resource info request submitted:', data);
    await new Promise(resolve => setTimeout(resolve, 800));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (!isOpen) return null;

  const requiresDetails = category === 'not-relevant' || category === 'missing-info' || category === 'other';
  const detailsMissing = requiresDetails && !details.trim();

  const content = (
    <div
      className="info-request-overlay"
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-request-title"
      onClick={(e) => { if (e.target === overlayRef.current) handleClose(); }}
    >
      <div className="info-request-panel">
        <div className="info-request-header">
          <h2 id="info-request-title">What would help you most?</h2>
          <button
            ref={closeRef}
            className="info-request-close"
            onClick={handleClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {isSubmitted ? (
          <div className="info-request-success" role="status" aria-live="polite">
            <p>Thanks for letting us know. We use this to improve our resources.</p>
            <button className="info-request-done-btn" onClick={handleClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="info-request-disclaimer">
              This is not a request for personalised support. Your feedback helps us identify where we need to add more content and guidance.
            </p>
            <form onSubmit={handleSubmit} noValidate>
              <fieldset className="info-request-categories" role="radiogroup" aria-labelledby="info-request-title">
                <legend className="sr-only">Select what would help you most</legend>
                {INFO_CATEGORIES.map(cat => (
                  <label
                    key={cat.value}
                    className={`info-request-option ${category === cat.value ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="info-category"
                      value={cat.value}
                      checked={category === cat.value}
                      onChange={() => setCategory(cat.value)}
                      tabIndex={0}
                    />
                    <div>
                      <span className="info-request-option-label">{cat.label}</span>
                      <span className="info-request-option-hint">{cat.hint}</span>
                    </div>
                  </label>
                ))}
              </fieldset>

              {category && (
                <div className="info-request-details">
                  <label htmlFor="info-request-details-input">
                    Tell us more {requiresDetails ? '(required)' : '(optional)'}
                  </label>
                  <textarea
                    id="info-request-details-input"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={3}
                    placeholder="What specific information or guidance would help?"
                    aria-required={requiresDetails}
                    aria-describedby={detailsMissing ? 'info-request-error' : undefined}
                  />
                  {detailsMissing && (
                    <p id="info-request-error" className="info-request-error" role="alert">
                      Please tell us what you need so we can improve our resources.
                    </p>
                  )}
                </div>
              )}

              <div className="info-request-actions">
                <button
                  type="submit"
                  className="info-request-submit"
                  disabled={isSubmitting || !category || detailsMissing}
                >
                  {isSubmitting ? 'Sending...' : 'Send feedback'}
                </button>
                <button
                  type="button"
                  className="info-request-cancel"
                  onClick={handleClose}
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

interface ResourceInfoTriggerProps {
  onClick: () => void;
}

export function ResourceInfoTrigger({ onClick }: ResourceInfoTriggerProps) {
  return (
    <button className="sidebar-nav-item info-request-trigger" onClick={onClick}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <span>Need more resource information?</span>
    </button>
  );
}
