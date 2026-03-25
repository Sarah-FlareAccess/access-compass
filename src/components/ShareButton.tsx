import { useState, useRef, useEffect, useCallback } from 'react';
import { downloadAsText } from '../utils/shareSummary';

interface ShareButtonProps {
  getSummary: () => string;
  filename?: string;
  label?: string;
}

export function ShareButton({ getSummary, filename = 'access-compass-summary.txt', label = 'Share' }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getSummary());
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [getSummary]);

  const handleDownload = useCallback(() => {
    downloadAsText(getSummary(), filename);
    setIsOpen(false);
  }, [getSummary, filename]);

  return (
    <div className="share-button-container" ref={menuRef}>
      <button
        type="button"
        className="btn-share"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        {label}
      </button>
      {isOpen && (
        <div className="share-menu" role="menu">
          <button type="button" role="menuitem" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy to clipboard'}
          </button>
          <button type="button" role="menuitem" onClick={handleDownload}>
            Download as text
          </button>
        </div>
      )}
    </div>
  );
}
