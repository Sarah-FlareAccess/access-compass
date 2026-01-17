import { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './ReportProblem.css';

interface ReportProblemProps {
  isOpen: boolean;
  onClose: () => void;
}

type IssueType = 'bug' | 'suggestion' | 'question' | 'other';

export function ReportProblem({ isOpen, onClose }: ReportProblemProps) {
  const location = useLocation();
  const [issueType, setIssueType] = useState<IssueType>('bug');
  const [description, setDescription] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);

    // Simulate submission - in production this would send to your backend
    // You could integrate with services like:
    // - Email API (SendGrid, Resend)
    // - Issue trackers (GitHub Issues API, Jira)
    // - Feedback tools (Canny, UserVoice)
    // - Your own backend endpoint

    const reportData = {
      type: issueType,
      description: description.trim(),
      pageUrl: window.location.href,
      pathname: location.pathname,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      hasScreenshot: !!screenshot,
    };

    console.log('Problem report submitted:', reportData);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    // Reset form state
    setIssueType('bug');
    setDescription('');
    setScreenshot(null);
    setScreenshotPreview(null);
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="report-problem-overlay" onClick={handleClose}>
      <div className="report-problem-modal" onClick={e => e.stopPropagation()}>
        <button className="report-close-btn" onClick={handleClose} aria-label="Close">
          &times;
        </button>

        {isSubmitted ? (
          <div className="report-success">
            <div className="success-icon">✓</div>
            <h2>Thank you for your feedback!</h2>
            <p>We've received your report and will look into it.</p>
            <button className="btn btn-primary" onClick={handleClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="report-header">
              <h2>Report a Problem</h2>
              <p>Help us improve by reporting bugs, suggesting features, or asking questions.</p>
            </div>

            <form onSubmit={handleSubmit} className="report-form">
              <div className="form-group">
                <label>What type of feedback is this?</label>
                <div className="issue-type-selector">
                  {[
                    { value: 'bug', label: 'Bug', icon: '🐛', desc: 'Something isn\'t working' },
                    { value: 'suggestion', label: 'Suggestion', icon: '💡', desc: 'Idea for improvement' },
                    { value: 'question', label: 'Question', icon: '❓', desc: 'Need help or clarification' },
                    { value: 'other', label: 'Other', icon: '📝', desc: 'General feedback' },
                  ].map(type => (
                    <button
                      key={type.value}
                      type="button"
                      className={`issue-type-btn ${issueType === type.value ? 'active' : ''}`}
                      onClick={() => setIssueType(type.value as IssueType)}
                    >
                      <span className="issue-type-icon">{type.icon}</span>
                      <span className="issue-type-label">{type.label}</span>
                      <span className="issue-type-desc">{type.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="report-description">Describe the issue *</label>
                <textarea
                  id="report-description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder={
                    issueType === 'bug'
                      ? 'What happened? What did you expect to happen?'
                      : issueType === 'suggestion'
                      ? 'What would you like to see improved or added?'
                      : issueType === 'question'
                      ? 'What would you like help with?'
                      : 'Share your feedback...'
                  }
                  rows={4}
                  required
                />
              </div>

              <div className="form-group">
                <label>Screenshot (optional)</label>
                <p className="form-hint">Add a screenshot to help us understand the issue better.</p>

                {screenshotPreview ? (
                  <div className="screenshot-preview">
                    <img src={screenshotPreview} alt="Screenshot preview" />
                    <button
                      type="button"
                      className="remove-screenshot-btn"
                      onClick={removeScreenshot}
                      aria-label="Remove screenshot"
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <div
                    className="screenshot-upload"
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        fileInputRef.current?.click();
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label="Click to add a screenshot"
                  >
                    <span className="upload-icon" aria-hidden="true">📷</span>
                    <span>Click to add a screenshot</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotChange}
                      className="hidden-input"
                      aria-label="Upload screenshot"
                      tabIndex={-1}
                    />
                  </div>
                )}
              </div>

              <div className="form-group page-context">
                <span className="context-label">Page:</span>
                <span className="context-value">{location.pathname}</span>
              </div>

              <div className="report-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!description.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Sending...
                    </>
                  ) : (
                    'Submit Report'
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// Trigger button component for use in different locations
interface ReportProblemTriggerProps {
  variant?: 'sidebar' | 'footer' | 'icon';
  onClick: () => void;
}

export function ReportProblemTrigger({ variant = 'sidebar', onClick }: ReportProblemTriggerProps) {
  if (variant === 'footer') {
    return (
      <button className="report-trigger-footer" onClick={onClick}>
        <span className="trigger-icon">🐛</span>
        Report a problem
      </button>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        className="report-trigger-icon"
        onClick={onClick}
        aria-label="Report a problem"
        title="Report a problem"
      >
        🐛
      </button>
    );
  }

  // Sidebar variant
  return (
    <button className="sidebar-nav-item report-trigger-sidebar" onClick={onClick}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span>Report a Problem</span>
    </button>
  );
}
