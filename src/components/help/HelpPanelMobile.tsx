/**
 * Help Panel Mobile
 *
 * Bottom sheet for mobile viewports using a simple slide-up approach.
 */

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { HelpContent, BusinessType } from '../../data/help/types';
import { HelpContent as HelpContentComponent } from './HelpContent';
import './HelpPanel.css';

interface HelpPanelMobileProps {
  content: HelpContent;
  isOpen: boolean;
  onClose: () => void;
  businessTypes?: BusinessType[];
  onNavigateToQuestion?: (questionId: string) => void;
  onSectionToggle?: (sectionName: string, isExpanded: boolean) => void;
  onFeedback?: (isPositive: boolean) => void;
}

export function HelpPanelMobile({
  content,
  isOpen,
  onClose,
  businessTypes = [],
  onNavigateToQuestion,
  onSectionToggle,
  onFeedback,
}: HelpPanelMobileProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  // Prevent body scroll when open
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

  return (
    <>
      {/* Backdrop */}
      <div
        className={`help-panel-backdrop ${isOpen ? 'help-panel-backdrop--open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`help-panel-mobile ${isOpen ? 'help-panel-mobile--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-panel-mobile-title"
      >
        {/* Header */}
        <div className="help-panel-header">
          <h2 id="help-panel-mobile-title" className="help-panel-title">
            {content.title}
          </h2>
          <button
            ref={closeButtonRef}
            className="help-panel-close"
            onClick={onClose}
            aria-label="Close help panel"
          >
            <X size={20} />
          </button>
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

export default HelpPanelMobile;
