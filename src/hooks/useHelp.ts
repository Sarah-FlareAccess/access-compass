/**
 * Help Panel State Management Hook
 *
 * Manages the help panel open/close state, content loading,
 * and navigation between help articles.
 */

import { useState, useCallback, useEffect } from 'react';
import type { HelpContent, BusinessType } from '../data/help/types';
import { getHelpByQuestionId, hasHelpContent } from '../data/help';

interface UseHelpOptions {
  /** User's business types for contextual examples */
  businessTypes?: BusinessType[];

  /** Callback when help is opened (for analytics) */
  onOpen?: (questionId: string) => void;

  /** Callback when help is closed */
  onClose?: () => void;
}

interface UseHelpReturn {
  /** Whether help panel is open */
  isOpen: boolean;

  /** Current help content (null if closed) */
  content: HelpContent | null;

  /** Current question ID */
  currentQuestionId: string | null;

  /** Open help for a specific question */
  openHelp: (questionId: string) => void;

  /** Close help panel */
  closeHelp: () => void;

  /** Check if help exists for a question */
  hasHelp: (questionId: string) => boolean;

  /** Navigate to help for a related question */
  navigateToRelated: (questionId: string) => void;

  /** Filter examples by business type */
  getRelevantExamples: () => HelpContent['examples'];

  /** Track section expansion (for analytics) */
  trackSectionToggle: (sectionName: string, isExpanded: boolean) => void;

  /** Track feedback */
  trackFeedback: (isPositive: boolean) => void;
}

export function useHelp(options: UseHelpOptions = {}): UseHelpReturn {
  const { businessTypes = [], onOpen, onClose } = options;

  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<HelpContent | null>(null);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);

  const openHelp = useCallback((questionId: string) => {
    const helpContent = getHelpByQuestionId(questionId);
    if (helpContent) {
      setContent(helpContent);
      setCurrentQuestionId(questionId);
      setIsOpen(true);
      onOpen?.(questionId);
    } else {
      console.warn(`No help content found for question: ${questionId}`);
    }
  }, [onOpen]);

  const closeHelp = useCallback(() => {
    setIsOpen(false);
    onClose?.();
    // Delay clearing content for exit animation
    setTimeout(() => {
      setContent(null);
      setCurrentQuestionId(null);
    }, 300);
  }, [onClose]);

  const hasHelp = useCallback((questionId: string): boolean => {
    return hasHelpContent(questionId);
  }, []);

  const navigateToRelated = useCallback((questionId: string) => {
    // Close briefly then reopen with new content for smooth transition
    setIsOpen(false);
    setTimeout(() => {
      openHelp(questionId);
    }, 150);
  }, [openHelp]);

  const getRelevantExamples = useCallback(() => {
    if (!content?.examples) return [];

    // If no business types specified, return all examples
    if (businessTypes.length === 0) return content.examples;

    // Prioritise matching business types, then include general
    const matching = content.examples.filter(
      ex => businessTypes.includes(ex.businessType) || ex.businessType === 'general'
    );

    // If no matches, return all examples
    return matching.length > 0 ? matching : content.examples;
  }, [content, businessTypes]);

  const trackSectionToggle = useCallback((sectionName: string, isExpanded: boolean) => {
    // Analytics tracking - can be connected to analytics provider
    console.debug('Help section toggled:', {
      questionId: currentQuestionId,
      sectionName,
      isExpanded
    });
  }, [currentQuestionId]);

  const trackFeedback = useCallback((isPositive: boolean) => {
    // Analytics tracking - can be connected to analytics provider
    console.debug('Help feedback:', {
      questionId: currentQuestionId,
      isPositive
    });
  }, [currentQuestionId]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeHelp();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeHelp]);

  // Prevent body scroll when panel is open on mobile
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  return {
    isOpen,
    content,
    currentQuestionId,
    openHelp,
    closeHelp,
    hasHelp,
    navigateToRelated,
    getRelevantExamples,
    trackSectionToggle,
    trackFeedback,
  };
}

export default useHelp;
