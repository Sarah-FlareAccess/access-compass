// ============================================
// ACCESS COMPASS - PRICING ENGINE
// ============================================
// Config-driven pricing for Pulse Check and Deep Dive
// ============================================

import type {
  BusinessSizeTier,
  AccessLevel,
  ModuleBundle,
  PriceResult,
  PricingInput,
} from '../types/access';

// ============================================
// PRICING CONFIGURATION
// ============================================

/**
 * Pricing matrix in AUD cents
 *
 * Rules:
 * - Pulse Check starts at $600 for small businesses
 * - Deep Dive for small/medium is self-serve
 * - Deep Dive for large/enterprise requires a call ($10,000+ anchor)
 * - Enterprise Pulse also requires a call (steered to Deep Dive)
 */
const PRICING_MATRIX: Record<BusinessSizeTier, Record<AccessLevel, Record<ModuleBundle, number>>> = {
  small: {
    pulse: {
      core: 60000,      // $600
      expanded: 90000,  // $900
      full: 120000,     // $1,200
    },
    deep_dive: {
      core: 150000,     // $1,500
      expanded: 200000, // $2,000
      full: 250000,     // $2,500
    },
  },
  medium: {
    pulse: {
      core: 120000,     // $1,200
      expanded: 180000, // $1,800
      full: 240000,     // $2,400
    },
    deep_dive: {
      core: 300000,     // $3,000
      expanded: 400000, // $4,000
      full: 500000,     // $5,000
    },
  },
  large: {
    pulse: {
      core: 240000,     // $2,400
      expanded: 360000, // $3,600
      full: 480000,     // $4,800
    },
    deep_dive: {
      // Large Deep Dive requires a call - pricing is custom
      core: 0,
      expanded: 0,
      full: 0,
    },
  },
  enterprise: {
    // Enterprise always requires a call
    pulse: {
      core: 0,
      expanded: 0,
      full: 0,
    },
    deep_dive: {
      core: 0,
      expanded: 0,
      full: 0,
    },
  },
};

// ============================================
// INCLUSIONS BY BUNDLE
// ============================================

const PULSE_INCLUSIONS: Record<ModuleBundle, string[]> = {
  core: [
    '5 core accessibility modules',
    'Pulse Check summary report',
    'Priority action recommendations',
    'Access to Resource Suite',
    'Free consultation included',
  ],
  expanded: [
    '10 accessibility modules',
    'Pulse Check summary report',
    'Detailed action plan',
    'Progress tracking dashboard',
    'Access to Resource Suite',
    'Free consultation included',
  ],
  full: [
    'All 15+ accessibility modules',
    'Comprehensive summary report',
    'Full action plan with timeline',
    'Progress tracking dashboard',
    'Access to Resource Suite',
    'Free consultation included',
  ],
};

const DEEP_DIVE_INCLUSIONS: Record<ModuleBundle, string[]> = {
  core: [
    '5 core accessibility modules',
    'Full DIAP workspace',
    'Structured action plan',
    'Evidence management',
    'Export to PDF/CSV',
    'Free consultation included',
  ],
  expanded: [
    '10 accessibility modules',
    'Full DIAP workspace',
    'Comprehensive action plan',
    'Team assignment features',
    'Evidence management',
    'Export to PDF/CSV',
    'Free consultation included',
  ],
  full: [
    'All 15+ accessibility modules',
    'Full DIAP workspace',
    'Enterprise action planning',
    'Team assignment & tracking',
    'Evidence management',
    'Export to PDF/CSV/Excel',
    'Priority support',
    'Free consultation included',
  ],
};

const ENTERPRISE_INCLUSIONS = [
  'Custom enterprise solution',
  'Unlimited modules',
  'Full DIAP workspace',
  'Multi-site support',
  'Dedicated account manager',
  'Team training included',
  'Priority support',
  'Free consultation included',
];

// ============================================
// PRICING FUNCTIONS
// ============================================

/**
 * Format cents to AUD currency string
 */
export function formatPrice(cents: number, currency: string = 'AUD'): string {
  if (cents === 0) return 'Contact for pricing';

  const dollars = cents / 100;
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(dollars);
}

/**
 * Check if a product can be purchased self-serve via Stripe
 */
export function isPurchasable(
  businessSizeTier: BusinessSizeTier,
  accessLevel: AccessLevel
): boolean {
  // Enterprise always requires a call
  if (businessSizeTier === 'enterprise') return false;

  // Large businesses can only self-serve Pulse
  if (businessSizeTier === 'large' && accessLevel === 'deep_dive') return false;

  // Small and medium can self-serve both
  return true;
}

/**
 * Check if a product requires a sales call
 */
export function requiresCall(
  businessSizeTier: BusinessSizeTier,
  accessLevel: AccessLevel
): boolean {
  return !isPurchasable(businessSizeTier, accessLevel);
}

/**
 * Calculate the price for a given configuration
 */
export function calculatePrice(
  businessSizeTier: BusinessSizeTier,
  accessLevel: AccessLevel,
  moduleBundle: ModuleBundle
): PriceResult {
  const amountCents = PRICING_MATRIX[businessSizeTier][accessLevel][moduleBundle];
  const purchasable = isPurchasable(businessSizeTier, accessLevel);
  const needsCall = requiresCall(businessSizeTier, accessLevel);

  // Get inclusions based on access level
  let inclusions: string[];
  if (businessSizeTier === 'enterprise' || (businessSizeTier === 'large' && accessLevel === 'deep_dive')) {
    inclusions = ENTERPRISE_INCLUSIONS;
  } else if (accessLevel === 'pulse') {
    inclusions = PULSE_INCLUSIONS[moduleBundle];
  } else {
    inclusions = DEEP_DIVE_INCLUSIONS[moduleBundle];
  }

  // Format the label
  let label: string;
  if (!purchasable) {
    if (accessLevel === 'deep_dive') {
      label = 'From $10,000';
    } else {
      label = 'Contact for pricing';
    }
  } else {
    label = formatPrice(amountCents);
  }

  return {
    amountCents,
    currency: 'AUD',
    label,
    inclusions,
    isPurchasable: purchasable,
    requiresCall: needsCall,
  };
}

/**
 * Calculate price from a PricingInput object
 */
export function calculatePriceFromInput(input: PricingInput): PriceResult {
  return calculatePrice(input.businessSizeTier, input.accessLevel, input.moduleBundle);
}

/**
 * Get pricing summary for both pathways for a given business size
 */
export function getPricingSummary(
  businessSizeTier: BusinessSizeTier,
  moduleBundle: ModuleBundle = 'core'
): {
  pulse: PriceResult;
  deepDive: PriceResult;
} {
  return {
    pulse: calculatePrice(businessSizeTier, 'pulse', moduleBundle),
    deepDive: calculatePrice(businessSizeTier, 'deep_dive', moduleBundle),
  };
}

/**
 * Get all pricing tiers for display (useful for pricing page)
 */
export function getAllPricingTiers(): Record<BusinessSizeTier, {
  label: string;
  description: string;
  pulse: PriceResult;
  deepDive: PriceResult;
}> {
  const tiers: BusinessSizeTier[] = ['small', 'medium', 'large', 'enterprise'];
  const descriptions: Record<BusinessSizeTier, { label: string; description: string }> = {
    small: { label: 'Small', description: '1-20 staff' },
    medium: { label: 'Medium', description: '21-100 staff' },
    large: { label: 'Large', description: '100+ staff' },
    enterprise: { label: 'Enterprise', description: 'Multi-site or precinct' },
  };

  const result: Record<BusinessSizeTier, { label: string; description: string; pulse: PriceResult; deepDive: PriceResult }> = {} as any;

  for (const tier of tiers) {
    const { pulse, deepDive } = getPricingSummary(tier, 'core');
    result[tier] = {
      ...descriptions[tier],
      pulse,
      deepDive,
    };
  }

  return result;
}

/**
 * Calculate GST (10% in Australia)
 */
export function calculateGST(amountCents: number): number {
  return Math.round(amountCents * 0.1);
}

/**
 * Get total including GST
 */
export function getTotalWithGST(amountCents: number): {
  subtotal: number;
  gst: number;
  total: number;
} {
  const gst = calculateGST(amountCents);
  return {
    subtotal: amountCents,
    gst,
    total: amountCents + gst,
  };
}

/**
 * Validate that pricing is consistent with business rules
 * - Pulse must start at $600 for small
 * - Pulse must always be less than Deep Dive anchor ($10,000)
 */
export function validatePricingRules(): boolean {
  // Check small pulse core is at least $600
  const smallPulseCore = PRICING_MATRIX.small.pulse.core;
  if (smallPulseCore < 60000) {
    console.error('Pricing rule violation: Small Pulse Core must be at least $600');
    return false;
  }

  // Check all pulse prices are below $10,000 Deep Dive anchor
  const tiers: BusinessSizeTier[] = ['small', 'medium', 'large'];
  const bundles: ModuleBundle[] = ['core', 'expanded', 'full'];

  for (const tier of tiers) {
    for (const bundle of bundles) {
      const pulsePrice = PRICING_MATRIX[tier].pulse[bundle];
      if (pulsePrice >= 1000000) { // $10,000
        console.error(`Pricing rule violation: ${tier} ${bundle} Pulse ($${pulsePrice / 100}) exceeds Deep Dive anchor`);
        return false;
      }
    }
  }

  return true;
}

// Run validation in development
if (import.meta.env.DEV) {
  validatePricingRules();
}
