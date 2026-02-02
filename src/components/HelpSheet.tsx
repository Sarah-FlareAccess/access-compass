/**
 * HelpSheet Component
 *
 * A bottom sheet that provides quick help during the discovery/onboarding process.
 * Shows top FAQs, contact support option, and link to full help page.
 *
 * Accessibility features:
 * - Escape key to close
 * - Focus management
 * - Browser back button closes sheet (instead of navigating away)
 *
 * Tone: Encouraging, supportive, professional
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './HelpSheet.css';

interface HelpSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

const quickFAQs: FAQItem[] = [
  {
    question: "What if I'm not sure about an answer?",
    answer: "That's completely okay! Just give your best estimate based on what you know. You can always come back and update your answers later. The goal is to help us understand your business, not to test you."
  },
  {
    question: "How do I choose which touchpoints apply?",
    answer: "Think about a typical customer visit from start to finish. If a touchpoint is part of their experience (like parking, entry, or payment), select it. If it doesn't apply to your business (like you don't have a car park), you can mark it as not applicable."
  },
  {
    question: "Can I change my answers later?",
    answer: "Absolutely! Your responses are saved as you go, and you can revisit the discovery process anytime from your dashboard to update your selections or refine your answers."
  },
  {
    question: "How long does this take?",
    answer: "Most people complete the discovery process in 5-10 minutes. Take your time - there's no rush. You can pause and come back anytime."
  },
];

export function HelpSheet({ isOpen, onClose }: HelpSheetProps) {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  // Track if we're closing due to popstate (back button) to avoid double history.back()
  const closingFromPopstate = useRef(false);
  // Track if we've pushed history state
  const historyPushed = useRef(false);

  // Handle close - manages history state
  const handleClose = useCallback(() => {
    if (!closingFromPopstate.current && historyPushed.current) {
      // User closed via X button, Escape, or overlay click - go back in history
      window.history.back();
    }
    historyPushed.current = false;
    closingFromPopstate.current = false;
    onClose();
  }, [onClose]);

  // Handle browser back button (popstate event)
  useEffect(() => {
    if (!isOpen) return;

    const handlePopstate = () => {
      // User pressed back button - close sheet without calling history.back()
      closingFromPopstate.current = true;
      historyPushed.current = false;
      onClose();
    };

    // Push a history state when sheet opens so back button closes it
    window.history.pushState({ modal: 'help-sheet' }, '');
    historyPushed.current = true;

    window.addEventListener('popstate', handlePopstate);

    return () => {
      window.removeEventListener('popstate', handlePopstate);
      // If sheet is closing but not due to popstate, clean up history state
      if (!closingFromPopstate.current && historyPushed.current) {
        const state = window.history.state;
        if (state?.modal === 'help-sheet') {
          window.history.back();
        }
      }
    };
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus the close button when opening
      setTimeout(() => firstFocusableRef.current?.focus(), 100);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleClose]);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="help-sheet-backdrop"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="help-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-sheet-title"
      >
        {/* Drag handle */}
        <div className="help-sheet-handle">
          <div className="help-sheet-handle-bar" />
        </div>

        {/* Header */}
        <div className="help-sheet-header">
          <h2 id="help-sheet-title" className="help-sheet-title">
            Need a hand?
          </h2>
          <button
            ref={firstFocusableRef}
            className="help-sheet-close"
            onClick={handleClose}
            aria-label="Close help"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="help-sheet-content">
          {/* Encouragement message */}
          <p className="help-sheet-intro">
            You're doing great! Here are answers to common questions. If you need more help, we're here for you.
          </p>

          {/* Quick FAQs */}
          <div className="help-sheet-faqs">
            <h3 className="help-sheet-section-title">Common Questions</h3>
            <ul className="faq-list">
              {quickFAQs.map((faq, index) => (
                <li key={index} className="faq-item">
                  <button
                    className={`faq-question ${expandedFAQ === index ? 'expanded' : ''}`}
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={expandedFAQ === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span>{faq.question}</span>
                    <svg
                      className="faq-chevron"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  <div
                    id={`faq-answer-${index}`}
                    className={`faq-answer ${expandedFAQ === index ? 'expanded' : ''}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                  >
                    <p>{faq.answer}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* View all FAQs link */}
          <Link
            to="/discovery/help"
            className="help-sheet-link"
            onClick={handleClose}
          >
            <span>View all FAQs & guides</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>

          {/* Contact Section */}
          <div className="help-sheet-contact">
            <h3 className="help-sheet-section-title">Still stuck?</h3>
            <p className="help-sheet-contact-text">
              Our team is happy to help you through the process. Reach out anytime.
            </p>
            <a
              href="mailto:support@accesscompass.com.au?subject=Help%20with%20Discovery%20Process"
              className="help-sheet-contact-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>Email Support</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
