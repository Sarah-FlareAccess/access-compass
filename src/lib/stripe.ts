// ============================================
// ACCESS COMPASS - STRIPE UTILITIES
// ============================================
// Client-side Stripe integration utilities
// ============================================

import type {
  BusinessSizeTier,
  AccessLevel,
  ModuleBundle,
  CreateCheckoutRequest,
  CreateCheckoutResponse,
} from '../types/access';
import { calculatePrice, getTotalWithGST } from './pricingEngine';

// ============================================
// CONFIGURATION
// ============================================

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Check if Stripe is configured
export const isStripeEnabled = (): boolean => {
  return !!STRIPE_PUBLIC_KEY;
};

// ============================================
// CREATE CHECKOUT SESSION
// ============================================

/**
 * Create a Stripe checkout session
 *
 * This function calls your backend API to create a checkout session.
 * The backend should:
 * 1. Validate the request
 * 2. Create a Stripe checkout session
 * 3. Return the checkout URL
 *
 * For MVP without a backend, this will create a mock checkout flow.
 */
export async function createCheckoutSession(
  request: CreateCheckoutRequest
): Promise<CreateCheckoutResponse & { error?: string }> {
  const { businessSizeTier, accessLevel, moduleBundle, sessionId, successUrl, cancelUrl } = request;

  // Calculate pricing
  const pricing = calculatePrice(businessSizeTier, accessLevel, moduleBundle);
  const totals = getTotalWithGST(pricing.amountCents);

  // If Stripe is not configured, use mock mode
  if (!isStripeEnabled()) {
    console.warn('Stripe not configured. Using mock checkout.');
    return createMockCheckout(request);
  }

  try {
    // Call backend API to create checkout session
    const response = await fetch(`${API_BASE_URL}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        businessSizeTier,
        accessLevel,
        moduleBundle,
        sessionId,
        successUrl,
        cancelUrl,
        amountCents: totals.total,
        currency: 'AUD',
        productName: `${accessLevel === 'deep_dive' ? 'Deep Dive' : 'Pulse Check'} – ${businessSizeTier}`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        checkoutUrl: '',
        sessionId: '',
        error: errorData.message || 'Failed to create checkout session',
      };
    }

    const data = await response.json();
    return {
      checkoutUrl: data.url,
      sessionId: data.sessionId,
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      checkoutUrl: '',
      sessionId: '',
      error: 'Network error. Please try again.',
    };
  }
}

// ============================================
// MOCK CHECKOUT (for development)
// ============================================

async function createMockCheckout(
  request: CreateCheckoutRequest
): Promise<CreateCheckoutResponse & { error?: string }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Generate a mock session ID
  const mockSessionId = `mock_session_${Date.now()}`;

  // For development, redirect to success page directly
  // In production, this would be the Stripe checkout URL
  const successUrlWithSession = request.successUrl.replace(
    '{CHECKOUT_SESSION_ID}',
    mockSessionId
  );

  console.log('Mock checkout created:', {
    sessionId: mockSessionId,
    tier: request.businessSizeTier,
    level: request.accessLevel,
    bundle: request.moduleBundle,
  });

  return {
    checkoutUrl: successUrlWithSession,
    sessionId: mockSessionId,
  };
}

// ============================================
// VERIFY CHECKOUT SESSION
// ============================================

/**
 * Verify a checkout session after payment
 * Called on the success page to confirm payment
 */
export async function verifyCheckoutSession(
  sessionId: string
): Promise<{
  success: boolean;
  error?: string;
  purchaseId?: string;
}> {
  if (!sessionId) {
    return { success: false, error: 'No session ID provided' };
  }

  // Mock verification for development
  if (sessionId.startsWith('mock_')) {
    console.log('Mock session verified:', sessionId);
    return { success: true, purchaseId: `purchase_${sessionId}` };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/verify-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || 'Failed to verify payment',
      };
    }

    const data = await response.json();
    return {
      success: true,
      purchaseId: data.purchaseId,
    };
  } catch (error) {
    console.error('Error verifying checkout session:', error);
    return {
      success: false,
      error: 'Network error. Please contact support.',
    };
  }
}

// ============================================
// STRIPE WEBHOOK HANDLER (Backend)
// ============================================

/**
 * Example webhook handler structure (implement in backend)
 *
 * This should be implemented as a server-side API route
 * (e.g., Supabase Edge Function, Next.js API route, etc.)
 *
 * The webhook should:
 * 1. Verify the Stripe signature
 * 2. Handle checkout.session.completed event
 * 3. Create entitlement record in database
 * 4. Create purchase record
 */
export const WEBHOOK_EVENTS = {
  CHECKOUT_COMPLETED: 'checkout.session.completed',
  PAYMENT_SUCCEEDED: 'payment_intent.succeeded',
  PAYMENT_FAILED: 'payment_intent.payment_failed',
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Format amount for Stripe (cents)
 */
export function formatAmountForStripe(amount: number): number {
  return Math.round(amount);
}

/**
 * Get product description for Stripe
 */
export function getProductDescription(
  tier: BusinessSizeTier,
  level: AccessLevel,
  bundle: ModuleBundle
): string {
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);
  const levelLabel = level === 'deep_dive' ? 'Deep Dive' : 'Pulse Check';
  const bundleLabel = bundle.charAt(0).toUpperCase() + bundle.slice(1);

  return `Access Compass ${levelLabel} - ${tierLabel} (${bundleLabel} bundle)`;
}
