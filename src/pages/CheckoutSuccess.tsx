// ============================================
// ACCESS COMPASS - CHECKOUT SUCCESS PAGE
// ============================================
// Displayed after successful Stripe payment
// ============================================

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ConsultationCTA } from '../components/ConsultationCTA';

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshAccessState, accessState, isAuthenticated } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setIsVerifying(false);
        return;
      }

      // Refresh access state to pick up the new entitlement
      // (The webhook should have already created it)
      await refreshAccessState();

      // Give it a moment to propagate
      setTimeout(async () => {
        await refreshAccessState();
        setIsVerifying(false);
        setVerified(true);
      }, 2000);
    };

    verifyPayment();
  }, [sessionId, refreshAccessState]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isVerifying) {
      navigate('/decision');
    }
  }, [isAuthenticated, isVerifying, navigate]);

  if (isVerifying) {
    return (
      <div className="checkout-success-page">
        <div className="success-container">
          <div className="loading-spinner" />
          <h2>Verifying your payment...</h2>
          <p>This will only take a moment.</p>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  if (!verified && !sessionId) {
    return (
      <div className="checkout-success-page">
        <div className="success-container">
          <div className="error-icon">?</div>
          <h2>Something went wrong</h2>
          <p>We couldn't verify your payment. If you completed a purchase, please contact support.</p>
          <Link to="/dashboard" className="btn-primary">
            Go to Dashboard
          </Link>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  return (
    <div className="checkout-success-page">
      <div className="success-container">
        <div className="success-icon">✓</div>
        <h1>Welcome aboard!</h1>
        <p className="success-message">
          Your purchase was successful. You now have access to{' '}
          <strong>
            {accessState.accessLevel === 'deep_dive' ? 'Deep Dive' : 'Pulse Check'}
          </strong>
          .
        </p>

        {/* What's included */}
        <div className="whats-next">
          <h2>What's next?</h2>
          <ul>
            <li>
              <span className="check">✓</span>
              Complete your accessibility assessment
            </li>
            <li>
              <span className="check">✓</span>
              Get your personalised action plan
            </li>
            <li>
              <span className="check">✓</span>
              Access your Resource Suite
            </li>
            {accessState.accessLevel === 'deep_dive' && (
              <li>
                <span className="check">✓</span>
                Build your DIAP in the workspace
              </li>
            )}
          </ul>
        </div>

        {/* Consultation CTA */}
        <div className="consultation-section">
          <ConsultationCTA variant="included" />
        </div>

        {/* Actions */}
        <div className="success-actions">
          <Link to="/dashboard" className="btn-primary">
            Go to Dashboard →
          </Link>
        </div>

        {/* Support */}
        <p className="support-note">
          Questions? <a href="mailto:support@accesscompass.com.au">Contact support</a>
        </p>
      </div>
      <style>{styles}</style>
    </div>
  );
}

const styles = `
  .checkout-success-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--ivory-tusk, #ece9e6);
    padding: 40px 20px;
  }

  .success-container {
    text-align: center;
    background: white;
    padding: 48px;
    border-radius: 24px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    max-width: 540px;
    width: 100%;
  }

  .loading-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #e0e0e0;
    border-top-color: #3a0b52;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 24px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .success-icon {
    width: 80px;
    height: 80px;
    background: #22c55e;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    margin: 0 auto 24px;
    box-shadow: 0 4px 16px rgba(34, 197, 94, 0.3);
  }

  .error-icon {
    width: 80px;
    height: 80px;
    background: #f59e0b;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    margin: 0 auto 24px;
  }

  h1 {
    color: #3a0b52;
    margin: 0 0 12px;
    font-size: 2rem;
    font-weight: 700;
  }

  h2 {
    color: #3a0b52;
    margin: 0 0 12px;
    font-size: 1.5rem;
  }

  .success-message {
    color: #4a4a4a;
    font-size: 1.1rem;
    margin: 0 0 32px;
    line-height: 1.6;
  }

  .whats-next {
    background: #f8f7f6;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
    text-align: left;
  }

  .whats-next h3 {
    color: #3a0b52;
    margin: 0 0 16px;
    font-size: 1.1rem;
  }

  .whats-next ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .whats-next li {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    color: #2d2d2d;
    font-size: 1rem;
  }

  .whats-next .check {
    color: #22c55e;
    font-weight: bold;
    flex-shrink: 0;
  }

  .consultation-section {
    margin-bottom: 24px;
  }

  .success-actions {
    margin-bottom: 24px;
  }

  .btn-primary {
    display: inline-block;
    padding: 16px 32px;
    background: var(--amethyst-diamond, #490E67);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(58, 11, 82, 0.3);
  }

  .support-note {
    color: var(--text-muted, #6b6360);
    font-size: 0.9rem;
    margin: 0;
  }

  .support-note a {
    color: #3a0b52;
    text-decoration: underline;
  }
`;
