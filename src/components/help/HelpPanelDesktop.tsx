/**
 * Help Panel Desktop
 *
 * Fixed side panel that slides in from the right on desktop viewports.
 */

import { useEffect, useRef } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import type { HelpContent, BusinessType } from '../../data/help/types';
import { HelpContent as HelpContentComponent } from './HelpContent';
import './HelpPanel.css';

interface HelpPanelDesktopProps {
  content: HelpContent;
  isOpen: boolean;
  onClose: () => void;
  businessTypes?: BusinessType[];
  onNavigateToQuestion?: (questionId: string) => void;
  onSectionToggle?: (sectionName: string, isExpanded: boolean) => void;
  onFeedback?: (isPositive: boolean) => void;
}

export function HelpPanelDesktop({
  content,
  isOpen,
  onClose,
  businessTypes = [],
  onNavigateToQuestion,
  onSectionToggle,
  onFeedback,
}: HelpPanelDesktopProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap and focus management
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  // Handle click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        // Don't close if clicking on the help button that opened it
        const target = e.target as HTMLElement;
        if (target.closest('[data-help-trigger]')) return;
        onClose();
      }
    };

    // Small delay to prevent immediate close
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`help-panel-backdrop ${isOpen ? 'help-panel-backdrop--open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`help-panel-desktop ${isOpen ? 'help-panel-desktop--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-panel-title"
      >
        {/* Header */}
        <div className="help-panel-header">
          <h2 id="help-panel-title" className="help-panel-title">
            {content.title}
          </h2>
          <div className="help-panel-header-actions">
            <button
              ref={closeButtonRef}
              className="help-panel-close"
              onClick={onClose}
              aria-label="Close help panel"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="help-panel-body">
          <HelpContentComponent
            content={content}
            businessTypes={businessTypes}
            onNavigateToQuestion={onNavigateToQuestion}
            onSectionToggle={onSectionToggle}
            onFeedback={onFeedback}
          />
        </div>
      </div>
    </>
  );
}

export default HelpPanelDesktop;
