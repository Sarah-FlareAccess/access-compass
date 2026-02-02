/**
 * Module Detail Modal
 *
 * Displays detailed information about a module to help users understand
 * what's covered, why it matters, and who benefits.
 *
 * Accessibility features:
 * - Escape key to close
 * - Focus trap within modal
 * - Proper ARIA attributes
 * - Browser back button closes modal (instead of navigating away)
 */

import { useEffect, useRef, useCallback } from 'react';
import { getModuleDetail } from '../../data/moduleDetails';
import { MODULES } from '../../lib/recommendationEngine';
import './ModuleDetailModal.css';

interface ModuleDetailModalProps {
  moduleId: string;
  isSelected: boolean;
  onClose: () => void;
  onToggleSelect: (moduleId: string) => void;
}

export function ModuleDetailModal({
  moduleId,
  isSelected,
  onClose,
  onToggleSelect,
}: ModuleDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  // Track if we're closing due to popstate (back button) to avoid double history.back()
  const closingFromPopstate = useRef(false);

  // Get module basic info and detail
  const moduleInfo = MODULES.find(m => m.id === moduleId);
  const moduleDetail = getModuleDetail(moduleId);

  // Handle close - manages history state
  const handleClose = useCallback(() => {
    if (!closingFromPopstate.current) {
      // User closed via X button, Escape, or overlay click - go back in history
      window.history.back();
    }
    onClose();
  }, [onClose]);

  // Handle browser back button (popstate event)
  useEffect(() => {
    const handlePopstate = () => {
      // User pressed back button - close modal without calling history.back()
      closingFromPopstate.current = true;
      onClose();
    };

    // Push a history state when modal opens so back button closes it
    window.history.pushState({ modal: 'module-detail', moduleId }, '');

    window.addEventListener('popstate', handlePopstate);

    return () => {
      window.removeEventListener('popstate', handlePopstate);
      // If modal is unmounting but not due to popstate, clean up history state
      if (!closingFromPopstate.current) {
        // Check if current state is our modal state before going back
        const state = window.history.state;
        if (state?.modal === 'module-detail') {
          window.history.back();
        }
      }
    };
  }, [moduleId, onClose]);

  // Handle escape key and focus trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    // Focus the modal
    modalRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleClose]);

  if (!moduleInfo) {
    return null;
  }

  const handleToggle = () => {
    onToggleSelect(moduleId);
  };

  return (
    <div className="module-detail-overlay" onClick={handleClose}>
      <div
        className="module-detail-modal"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-labelledby="module-detail-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className="module-detail-header">
          <div className="module-detail-title-row">
            <h2 id="module-detail-title">{moduleInfo.name}</h2>
            <button
              className="module-detail-close"
              onClick={handleClose}
              aria-label="Close modal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="module-detail-meta">
            <span className="module-detail-time">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              {moduleInfo.estimatedTime} min
            </span>
            <span className={`module-detail-status ${isSelected ? 'selected' : ''}`}>
              {isSelected ? 'In your review' : 'Not selected'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="module-detail-content">
          {/* Overview */}
          <section className="module-detail-section">
            <h3>Overview</h3>
            <p>{moduleDetail?.overview || moduleInfo.description}</p>
          </section>

          {/* Topics Covered */}
          {moduleDetail?.topics && moduleDetail.topics.length > 0 && (
            <section className="module-detail-section">
              <h3>Topics covered</h3>
              <ul className="module-detail-topics">
                {moduleDetail.topics.map((topic, index) => (
                  <li key={index}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M9 12l2 2 4-4" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    {topic}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Why It Matters */}
          {moduleDetail?.whyMatters && (
            <section className="module-detail-section highlight">
              <h3>Why it matters</h3>
              <p>{moduleDetail.whyMatters}</p>
            </section>
          )}

          {/* Who It Helps */}
          {moduleDetail?.whoHelps && moduleDetail.whoHelps.length > 0 && (
            <section className="module-detail-section">
              <h3>Who this helps</h3>
              <ul className="module-detail-who">
                {moduleDetail.whoHelps.map((who, index) => (
                  <li key={index}>
                    <span className="who-icon" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    {who}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Actions */}
        <div className="module-detail-actions">
          <button
            className={`module-detail-toggle ${isSelected ? 'remove' : 'add'}`}
            onClick={handleToggle}
          >
            {isSelected ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
                Remove from review
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Add to my review
              </>
            )}
          </button>
          <button className="module-detail-done" onClick={handleClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
