// ============================================
// ACCESS COMPASS - CONSULTATION CTA COMPONENT
// ============================================
// CTA for booking the included consultation
// ============================================

import { useAuth } from '../hooks/useAuth';

const CONSULT_BOOKING_URL = import.meta.env.VITE_CONSULT_BOOKING_URL || '#';
const SALES_BOOKING_URL = import.meta.env.VITE_SALES_BOOKING_URL || CONSULT_BOOKING_URL;

interface ConsultationCTAProps {
  /**
   * 'included' - For users with access (shows "Book your included consult")
   * 'explore' - For users without access (shows "Book a quick chat")
   */
  variant?: 'included' | 'explore';

  /**
   * Additional CSS class
   */
  className?: string;
}

/**
 * Consultation CTA component
 *
 * Shows contextual CTA for booking a consultation:
 * - "Book your included consult (free)" for entitled users
 * - "Book a quick chat" for users exploring
 */
export function ConsultationCTA({ variant, className = '' }: ConsultationCTAProps) {
  const { accessState } = useAuth();

  // Determine variant automatically if not specified
  const effectiveVariant = variant ?? (accessState.hasAccess ? 'included' : 'explore');

  const isIncluded = effectiveVariant === 'included';
  const bookingUrl = isIncluded ? CONSULT_BOOKING_URL : SALES_BOOKING_URL;

  return (
    <div className={`consultation-cta-wrapper ${className}`}>
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`consultation-cta-link ${isIncluded ? 'included' : 'explore'}`}
      >
        {isIncluded ? (
          <>
            <span className="cta-icon">📅</span>
            <span className="cta-text">
              Book your included consult <span className="cta-badge">(free)</span>
            </span>
          </>
        ) : (
          <>
            <span className="cta-icon">💬</span>
            <span className="cta-text">Book a quick chat</span>
          </>
        )}
        <span className="cta-arrow">→</span>
      </a>

      <style>{`
        .consultation-cta-wrapper {
          width: 100%;
        }

        .consultation-cta-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.2s ease;
          width: 100%;
          box-sizing: border-box;
        }

        .consultation-cta-link.included {
          background: rgba(34, 197, 94, 0.1);
          border: 2px solid #22c55e;
          color: #16a34a;
        }

        .consultation-cta-link.included:hover {
          background: rgba(34, 197, 94, 0.15);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
        }

        .consultation-cta-link.explore {
          background: #f8f7f6;
          border: 2px solid #e0e0e0;
          color: #3a0b52;
        }

        .consultation-cta-link.explore:hover {
          border-color: #3a0b52;
          background: #faf9f8;
          transform: translateY(-2px);
        }

        .cta-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .cta-text {
          flex: 1;
          font-weight: 600;
          font-size: 1rem;
        }

        .cta-badge {
          font-weight: 500;
          opacity: 0.8;
        }

        .cta-arrow {
          font-size: 1.1rem;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .consultation-cta-link:hover .cta-arrow {
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
}

/**
 * Inline text link version for use in paragraphs
 */
export function ConsultationLink({ variant }: { variant?: 'included' | 'explore' }) {
  const { accessState } = useAuth();
  const effectiveVariant = variant ?? (accessState.hasAccess ? 'included' : 'explore');
  const isIncluded = effectiveVariant === 'included';
  const bookingUrl = isIncluded ? CONSULT_BOOKING_URL : SALES_BOOKING_URL;

  return (
    <a
      href={bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: isIncluded ? '#16a34a' : '#3a0b52',
        fontWeight: 600,
        textDecoration: 'underline',
        textUnderlineOffset: '2px',
      }}
    >
      {isIncluded ? 'book your free consultation' : 'book a quick chat'}
    </a>
  );
}

export default ConsultationCTA;
