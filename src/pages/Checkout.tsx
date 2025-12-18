// ============================================
// ACCESS COMPASS - CHECKOUT PAGE
// ============================================
// Handles Stripe checkout session creation
// ============================================

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getSession } from '../utils/session';
import {
  calculatePrice,
  formatPrice,
  getTotalWithGST,
  isPurchasable,
} from '../lib/pricingEngine';
import { createCheckoutSession } from '../lib/stripe';
import type { BusinessSizeTier, AccessLevel, ModuleBundle } from '../types/access';

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, isLoading: authLoading, accessState, user } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get checkout params from URL
  const tier = (searchParams.get('tier') || 'small') as BusinessSizeTier;
  const level = (searchParams.get('level') || 'pulse') as AccessLevel;
  const bundle = (searchParams.get('bundle') || 'core') as ModuleBundle;

  const session = getSession();

  // Validate purchasability
  const canPurchase = isPurchasable(tier, level);

  // Calculate pricing
  const pricing = calculatePrice(tier, level, bundle);
  const totals = getTotalWithGST(pricing.amountCents);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(`/decision?returnTo=/checkout?tier=${tier}&level=${level}&bundle=${bundle}`);
    }
  }, [authLoading, isAuthenticated, navigate, tier, level, bundle]);

  // Redirect if already has access
  useEffect(() => {
    if (!authLoading && isAuthenticated && accessState.hasAccess) {
      navigate('/dashboard', { replace: true });
    }
  }, [authLoading, isAuthenticated, accessState, navigate]);

  // Redirect if not purchasable (enterprise needs to book a call)
  useEffect(() => {
    if (!canPurchase) {
      navigate('/decision');
    }
  }, [canPurchase, navigate]);

  const handleCheckout = async () => {
    if (!user) {
      setError('Please sign in to continue');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { checkoutUrl, error: checkoutError } = await createCheckoutSession({
        businessSizeTier: tier,
        accessLevel: level,
        moduleBundle: bundle,
        sessionId: session?.session_id,
        successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/decision`,
      });

      if (checkoutError || !checkoutUrl) {
        setError(checkoutError || 'Failed to create checkout session');
        setIsProcessing(false);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error('Checkout error:', err);
      setError('An unexpected error occurred');
      setIsProcessing(false);
    }
  };

  if (authLoading) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="loading-spinner" />
          <p>Loading...</p>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <Link to="/decision" className="back-link">
          ← Back to options
        </Link>

        <h1>Complete your purchase</h1>

        {/* Order Summary */}
        <div className="order-summary">
          <h3>Order summary</h3>

          <div className="order-item">
            <div className="item-details">
              <span className="item-name">
                {level === 'deep_dive' ? 'Deep Dive' : 'Pulse Check'} – {tier.charAt(0).toUpperCase() + tier.slice(1)}
              </span>
              <span className="item-bundle">
                {bundle.charAt(0).toUpperCase() + bundle.slice(1)} bundle
              </span>
            </div>
            <span className="item-price">{formatPrice(pricing.amountCents)}</span>
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>{formatPrice(totals.subtotal)}</span>
            </div>
            <div className="total-row">
              <span>GST (10%)</span>
              <span>{formatPrice(totals.gst)}</span>
            </div>
            <div className="total-row total-final">
              <span>Total</span>
              <span>{formatPrice(totals.total)}</span>
            </div>
          </div>
        </div>

        {/* Inclusions */}
        <div className="inclusions-summary">
          <h4>What's included:</h4>
          <ul>
            {pricing.inclusions.map((item, i) => (
              <li key={i}>
                <span className="check">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Checkout Button */}
        <button
          className="btn-checkout"
          onClick={handleCheckout}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : `Pay ${formatPrice(totals.total)} AUD`}
        </button>

        {/* Security Note */}
        <p className="security-note">
          <span className="lock-icon">🔒</span>
          Secure payment powered by Stripe
        </p>
      </div>
      <style>{styles}</style>
    </div>
  );
}

const styles = `
  .checkout-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f8f7f6 0%, #ece9e6 100%);
    padding: 40px 20px;
  }

  .checkout-container {
    background: white;
    padding: 40px;
    border-radius: 24px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    max-width: 500px;
    width: 100%;
  }

  .back-link {
    display: inline-block;
    color: #666;
    text-decoration: none;
    margin-bottom: 24px;
    font-size: 0.95rem;
  }

  .back-link:hover {
    color: #3a0b52;
  }

  h1 {
    color: #3a0b52;
    margin: 0 0 24px;
    font-size: 1.75rem;
    font-weight: 700;
  }

  .loading-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #e0e0e0;
    border-top-color: #3a0b52;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .order-summary {
    background: #f8f7f6;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
  }

  .order-summary h3 {
    color: #3a0b52;
    margin: 0 0 16px;
    font-size: 1.1rem;
  }

  .order-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 16px;
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 16px;
  }

  .item-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .item-name {
    font-weight: 600;
    color: #2d2d2d;
  }

  .item-bundle {
    font-size: 0.9rem;
    color: #666;
  }

  .item-price {
    font-weight: 600;
    color: #2d2d2d;
  }

  .order-totals {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .total-row {
    display: flex;
    justify-content: space-between;
    color: #666;
    font-size: 0.95rem;
  }

  .total-final {
    font-weight: 700;
    color: #2d2d2d;
    font-size: 1.1rem;
    padding-top: 8px;
    border-top: 1px solid #e0e0e0;
    margin-top: 8px;
  }

  .inclusions-summary {
    margin-bottom: 24px;
  }

  .inclusions-summary h4 {
    color: #666;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0 0 12px;
  }

  .inclusions-summary ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .inclusions-summary li {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 0;
    color: #4a4a4a;
    font-size: 0.95rem;
  }

  .inclusions-summary .check {
    color: #22c55e;
    font-weight: bold;
  }

  .error-message {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 14px 16px;
    border-radius: 10px;
    margin-bottom: 20px;
    font-size: 0.95rem;
  }

  .btn-checkout {
    width: 100%;
    padding: 18px 24px;
    background: linear-gradient(135deg, #3a0b52 0%, #c91344 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.15rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 16px;
  }

  .btn-checkout:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(58, 11, 82, 0.3);
  }

  .btn-checkout:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .security-note {
    text-align: center;
    color: #666;
    font-size: 0.9rem;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .lock-icon {
    font-size: 1rem;
  }
`;
