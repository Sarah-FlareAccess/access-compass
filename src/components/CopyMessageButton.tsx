import { useState, useCallback } from 'react';

interface CopyMessageButtonProps {
  getMessage: () => string;
  label?: string;
  className?: string;
}

export function CopyMessageButton({ getMessage, label = 'Copy Message', className = '' }: CopyMessageButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getMessage());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [getMessage]);

  return (
    <button
      type="button"
      className={`btn-copy-message ${className}`}
      onClick={handleCopy}
      aria-live="polite"
    >
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copied!
        </>
      ) : label}
    </button>
  );
}
