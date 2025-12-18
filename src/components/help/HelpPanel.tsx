/**
 * Help Panel Container
 *
 * Responsive container that renders the appropriate panel type:
 * - Desktop (≥1024px): Side panel sliding in from right
 * - Mobile (<1024px): Bottom sheet using Vaul
 */

import { useEffect, useState } from 'react';
import type { HelpContent, BusinessType } from '../../data/help/types';
import { HelpPanelDesktop } from './HelpPanelDesktop';
import { HelpPanelMobile } from './HelpPanelMobile';

interface HelpPanelProps {
  /** Help content to display */
  content: HelpContent | null;

  /** Whether panel is open */
  isOpen: boolean;

  /** Close handler */
  onClose: () => void;

  /** Optional: current business types for contextual examples */
  businessTypes?: BusinessType[];

  /** Optional: callback when user navigates to related question */
  onNavigateToQuestion?: (questionId: string) => void;

  /** Optional: track section toggle for analytics */
  onSectionToggle?: (sectionName: string, isExpanded: boolean) => void;

  /** Optional: track feedback for analytics */
  onFeedback?: (isPositive: boolean) => void;
}

export function HelpPanel({
  content,
  isOpen,
  onClose,
  businessTypes = [],
  onNavigateToQuestion,
  onSectionToggle,
  onFeedback,
}: HelpPanelProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Don't render if no content
  if (!content) return null;

  const commonProps = {
    content,
    isOpen,
    onClose,
    businessTypes,
    onNavigateToQuestion,
    onSectionToggle,
    onFeedback,
  };

  return isMobile ? (
    <HelpPanelMobile {...commonProps} />
  ) : (
    <HelpPanelDesktop {...commonProps} />
  );
}

export default HelpPanel;
