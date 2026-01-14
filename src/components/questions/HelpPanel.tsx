/**
 * HelpPanel Component
 *
 * A slide-out panel for rich help content including images, videos, and tips.
 * - Desktop: Slides in from the right side
 * - Mobile: Bottom sheet that slides up
 */

import { useEffect, useRef, useState } from 'react';
import type { HelpContent } from '../../hooks/useBranchingLogic';
import './help-panel.css';

interface HelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
  content: HelpContent;
  questionText?: string;
}

export function HelpPanel({ isOpen, onClose, content, questionText: _questionText }: HelpPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // Match animation duration
  };

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    if (isOpen) {
      // Delay adding listener to prevent immediate close
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  // Prevent body scroll when open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  const title = content.title || 'Understanding this question';

  return (
    <>
      {/* Backdrop overlay */}
      <div className={`help-panel-backdrop ${isClosing ? 'closing' : ''}`} />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`help-panel ${isClosing ? 'closing' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-panel-title"
      >
        {/* Drag handle for mobile */}
        <div className="help-panel-drag-handle">
          <div className="drag-indicator" />
        </div>

        {/* Header */}
        <div className="help-panel-header">
          <h3 id="help-panel-title">{title}</h3>
          <button
            className="help-panel-close"
            onClick={handleClose}
            aria-label="Close help panel"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="help-panel-content">
          {/* Summary */}
          {content.summary && (
            <div className="help-section help-summary">
              <p>{content.summary}</p>
            </div>
          )}

          {/* Video embed */}
          {content.videoUrl && (
            <div className="help-section help-video">
              <div className="video-container">
                <iframe
                  src={getVimeoEmbedUrl(content.videoUrl)}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={content.videoCaption || 'Help video'}
                />
              </div>
              {content.videoCaption && (
                <p className="video-caption">{content.videoCaption}</p>
              )}
            </div>
          )}

          {/* Examples grid */}
          {content.examples && content.examples.length > 0 && (
            <div className="help-section help-examples">
              <h4>Examples</h4>
              <div className="examples-grid">
                {content.examples.map((example, index) => (
                  <div key={index} className={`example-card example-${example.type}`}>
                    {example.imageUrl && (
                      <div className="example-image">
                        <img
                          src={example.imageUrl}
                          alt={example.caption}
                          loading="lazy"
                        />
                        <span className={`example-badge ${example.type}`}>
                          {example.type === 'good' && '✓ Good'}
                          {example.type === 'poor' && '✗ Poor'}
                          {example.type === 'info' && 'ℹ Info'}
                        </span>
                      </div>
                    )}
                    <div className="example-text">
                      <p className="example-caption">{example.caption}</p>
                      {example.details && (
                        <p className="example-details">{example.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips list */}
          {content.tips && content.tips.length > 0 && (
            <div className="help-section help-tips">
              <h4>Quick tips</h4>
              <ul>
                {content.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Learn more link */}
          {content.learnMoreUrl && (
            <div className="help-section help-learn-more">
              <a
                href={content.learnMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="learn-more-link"
              >
                {content.learnMoreText || 'Learn more'}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </a>
              {content.learnMoreNote && (
                <p className="learn-more-note">{content.learnMoreNote}</p>
              )}
            </div>
          )}
        </div>

        {/* Footer with close button for mobile */}
        <div className="help-panel-footer">
          <button className="btn-got-it" onClick={handleClose}>
            Got it
          </button>
        </div>
      </div>
    </>
  );
}

// Helper to convert Vimeo URL to embed URL
function getVimeoEmbedUrl(url: string): string {
  // Handle various Vimeo URL formats
  const vimeoRegex = /(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/;
  const match = url.match(vimeoRegex);

  if (match && match[1]) {
    return `https://player.vimeo.com/video/${match[1]}?title=0&byline=0&portrait=0`;
  }

  // If already an embed URL, return as-is
  if (url.includes('player.vimeo.com')) {
    return url;
  }

  // Fallback: return original (may not work)
  return url;
}
