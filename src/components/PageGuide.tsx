import { useState, useCallback, type ReactNode } from 'react';
import { ChevronDown, HelpCircle, type LucideIcon } from 'lucide-react';
import './PageGuide.css';

export interface GuideFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface PageGuideProps {
  pageId: string;
  features: GuideFeature[];
  tip?: ReactNode;
}

const STORAGE_PREFIX = 'page_guide_collapsed_';

export function PageGuide({ pageId, features, tip }: PageGuideProps) {
  const storageKey = STORAGE_PREFIX + pageId;

  const [isOpen, setIsOpen] = useState(() => {
    return localStorage.getItem(storageKey) !== 'true';
  });

  const toggle = useCallback(() => {
    setIsOpen(prev => {
      const next = !prev;
      localStorage.setItem(storageKey, next ? 'false' : 'true');
      return next;
    });
  }, [storageKey]);

  return (
    <div className="page-guide" role="region" aria-label="Page guide">
      <button
        className="page-guide-toggle"
        onClick={toggle}
        aria-expanded={isOpen}
      >
        <HelpCircle size={16} aria-hidden="true" className="page-guide-icon" />
        <span>How to use this page</span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`page-guide-chevron ${isOpen ? 'open' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="page-guide-content">
          <div className="page-guide-grid">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="page-guide-feature">
                  <Icon size={18} aria-hidden="true" className="page-guide-feature-icon" />
                  <div>
                    <strong className="page-guide-feature-title">{feature.title}</strong>
                    <p className="page-guide-feature-desc">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {tip && <p className="page-guide-tip">{tip}</p>}
        </div>
      )}
    </div>
  );
}
