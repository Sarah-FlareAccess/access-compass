// ============================================
// ACCESS COMPASS - PRICING ENGINE
// ============================================
// Config-driven pricing aligned to the 8-tier model (30 Mar 2026)
// ============================================

import type {
  BusinessSizeTier,
  AccessLevel,
  ModuleBundle,
  PriceResult,
  PricingInput,
} from '../types/access';

// ============================================
// INDIVIDUAL TIERS
// ============================================

export type IndividualTier = 'free' | 'starter' | 'committed';

interface IndividualTierConfig {
  name: string;
  priceAmountCents: number;
  period: string;
  accessLevel: AccessLevel;
  moduleLimit: number | null;
  resourceHubMonths: number;
  inclusions: string[];
}

const INDIVIDUAL_TIERS: Record<IndividualTier, IndividualTierConfig> = {
  free: {
    name: 'Free',
    priceAmountCents: 0,
    period: '',
    accessLevel: 'deep_dive',
    moduleLimit: 3,
    resourceHubMonths: 0,
    inclusions: [
      'Up to 3 modules (Deep Dive depth)',
      'Scoped PDF report',
      'Self-service only',
    ],
  },
  starter: {
    name: 'Starter',
    priceAmountCents: 39900,
    period: '6 months',
    accessLevel: 'pulse',
    moduleLimit: null,
    resourceHubMonths: 6,
    inclusions: [
      'Pulse Check on all relevant modules',
      'Resource Hub access (6 months)',
      'Self-service support',
      'Priority action recommendations',
    ],
  },
  committed: {
    name: 'Committed',
    priceAmountCents: 69900,
    period: '12 months',
    accessLevel: 'deep_dive',
    moduleLimit: null,
    resourceHubMonths: 12,
    inclusions: [
      'Deep Dive on all relevant modules',
      'Resource Hub access (12 months)',
      'Full DIAP workspace',
      '1x re-assessment included',
      '1x 60-minute consultation',
    ],
  },
};

// ============================================
// INDIVIDUAL MODULE PRICING (A LA CARTE)
// ============================================

export interface ModuleBundlePrice {
  moduleCount: number;
  priceAmountCents: number;
  perModuleCents: number;
  inclusions: string[];
}

const MODULE_BUNDLES: ModuleBundlePrice[] = [
  {
    moduleCount: 1,
    priceAmountCents: 4900,
    perModuleCents: 4900,
    inclusions: [
      'Deep Dive assessment + report',
      '30-day Resource Hub access (that module)',
      'Spend credited toward Starter or Committed',
    ],
  },
  {
    moduleCount: 3,
    priceAmountCents: 12900,
    perModuleCents: 4300,
    inclusions: [
      'Deep Dive assessment + report (3 modules)',
      '30-day Resource Hub access per module',
      'Spend credited toward Starter or Committed',
    ],
  },
  {
    moduleCount: 5,
    priceAmountCents: 19900,
    perModuleCents: 3980,
    inclusions: [
      'Deep Dive assessment + report (5 modules)',
      '30-day Resource Hub access per module',
      'Spend credited toward Starter or Committed',
    ],
  },
];

// ============================================
// MULTI-SITE TIERS
// ============================================

export type MultiSiteTier = 'pulse_3' | 'deep_3' | 'plus_6' | 'custom';

interface MultiSiteTierConfig {
  name: string;
  priceAmountCents: number;
  period: string;
  sites: number | null;
  perSiteCents: number;
  isPurchasable: boolean;
  inclusions: string[];
}

const MULTI_SITE_TIERS: Record<MultiSiteTier, MultiSiteTierConfig> = {
  pulse_3: {
    name: 'Multi-Site Pulse',
    priceAmountCents: 99900,
    period: '6 months',
    sites: 3,
    perSiteCents: 33300,
    isPurchasable: true,
    inclusions: [
      'Pulse Check for 3 sites',
      'Resource Hub access (6 months)',
      'Cross-site comparison',
      'Self-service support',
    ],
  },
  deep_3: {
    name: 'Multi-Site Deep',
    priceAmountCents: 179900,
    period: '12 months',
    sites: 3,
    perSiteCents: 60000,
    isPurchasable: true,
    inclusions: [
      'Deep Dive for 3 sites',
      'Resource Hub access (12 months)',
      'Full DIAP workspace per site',
      'Cross-site comparison',
    ],
  },
  plus_6: {
    name: 'Multi-Site Plus',
    priceAmountCents: 299900,
    period: '12 months',
    sites: 6,
    perSiteCents: 50000,
    isPurchasable: true,
    inclusions: [
      'Deep Dive for 6 sites',
      'Resource Hub access (12 months)',
      'Full DIAP workspace per site',
      'Cross-site comparison + trends',
      'Priority support',
    ],
  },
  custom: {
    name: 'Multi-Site Custom',
    priceAmountCents: 0,
    period: '',
    sites: null,
    perSiteCents: 0,
    isPurchasable: false,
    inclusions: [
      '7+ locations or complex requirements',
      'Custom module selection per site',
      'Dedicated account manager',
      'Enterprise reporting',
    ],
  },
};

// ============================================
// AUTHORITY TIERS
// ============================================

export type AuthorityTier = 'essentials' | 'pro' | 'enterprise';

interface AuthorityTierConfig {
  name: string;
  platformFeeCents: number;
  perBusinessCents: number;
  period: string;
  accessLevel: AccessLevel;
  maxPrograms: number | null;
  maxAdmins: number | null;
  isPurchasable: boolean;
  inclusions: string[];
}

const AUTHORITY_TIERS: Record<AuthorityTier, AuthorityTierConfig> = {
  essentials: {
    name: 'Council Essentials',
    platformFeeCents: 400000,
    perBusinessCents: 9900,
    period: '1 year',
    accessLevel: 'pulse',
    maxPrograms: 1,
    maxAdmins: 3,
    isPurchasable: true,
    inclusions: [
      '1 active program (scoped modules)',
      '3 admin users',
      'Completion tracking dashboard',
      'Aggregate PDF + per-business summary',
      '30-day Resource Hub per business',
      'Email support + onboarding call',
    ],
  },
  pro: {
    name: 'Council Pro',
    platformFeeCents: 890000,
    perBusinessCents: 34900,
    period: '1 year',
    accessLevel: 'deep_dive',
    maxPrograms: 5,
    maxAdmins: 10,
    isPurchasable: true,
    inclusions: [
      'Up to 5 active programs (scoped modules)',
      '10 admin users',
      'Full aggregate dashboard with trends',
      'Question guidance notes',
      'Resource Hub + DIAP included for businesses',
      '1 re-assessment per business',
      'Priority email + quarterly review',
    ],
  },
  enterprise: {
    name: 'Enterprise & Partnerships',
    platformFeeCents: 0,
    perBusinessCents: 0,
    period: '',
    accessLevel: 'deep_dive',
    maxPrograms: null,
    maxAdmins: null,
    isPurchasable: false,
    inclusions: [
      'Unlimited programs and admin users',
      'White-label and co-branding options',
      'SSO + integrations + API access',
      'Dedicated partnership manager',
      'Custom reporting and data export',
    ],
  },
};

// ============================================
// AUTHORITY ADD-ONS
// ============================================

export const AUTHORITY_ADDONS = {
  extraProgram: { label: 'Extra program', priceCents: 100000, period: '/program/year' },
  extraAdmin: { label: 'Extra admin seat', priceCents: 50000, period: '/seat/year' },
  advisory: { label: 'Advisory session', priceCents: 25000, period: '/session' },
};

// ============================================
// LEGACY COMPATIBILITY
// ============================================
// These functions maintain backward compatibility with Decision.tsx and Checkout.tsx
// which use the old BusinessSizeTier x AccessLevel x ModuleBundle model.
// They map old inputs to the new tier structure.

/**
 * Pricing matrix in AUD cents (legacy compatibility)
 * Maps old business-size model to new tier-based pricing.
 */
const PRICING_MATRIX: Record<BusinessSizeTier, Record<AccessLevel, Record<ModuleBundle, number>>> = {
  small: {
    pulse: {
      core: 39900,      // Starter: $399
      expanded: 39900,
      full: 39900,
    },
    deep_dive: {
      core: 69900,      // Committed: $699
      expanded: 69900,
      full: 69900,
    },
  },
  medium: {
    pulse: {
      core: 39900,
      expanded: 39900,
      full: 39900,
    },
    deep_dive: {
      core: 69900,
      expanded: 69900,
      full: 69900,
    },
  },
  large: {
    pulse: {
      core: 99900,      // Multi-Site Pulse (3 sites): $999
      expanded: 179900,  // Multi-Site Deep: $1,799
      full: 299900,      // Multi-Site Plus: $2,999
    },
    deep_dive: {
      core: 179900,
      expanded: 299900,
      full: 0,           // Custom
    },
  },
  enterprise: {
    pulse: { core: 0, expanded: 0, full: 0 },
    deep_dive: { core: 0, expanded: 0, full: 0 },
  },
};

const INDIVIDUAL_INCLUSIONS: Record<AccessLevel, string[]> = {
  pulse: INDIVIDUAL_TIERS.starter.inclusions,
  deep_dive: INDIVIDUAL_TIERS.committed.inclusions,
};

const ENTERPRISE_INCLUSIONS = [
  'Custom enterprise solution',
  'Unlimited modules and sites',
  'Full DIAP workspace',
  'Multi-site support',
  'Dedicated account manager',
  'Priority support',
];

// ============================================
// UTILITY FUNCTIONS
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
 * Check if a product can be purchased self-serve via Stripe (legacy)
 */
export function isPurchasable(
  businessSizeTier: BusinessSizeTier,
  accessLevel: AccessLevel
): boolean {
  if (businessSizeTier === 'enterprise') return false;
  if (businessSizeTier === 'large' && accessLevel === 'deep_dive') return false;
  return true;
}

/**
 * Check if a product requires a sales call (legacy)
 */
export function requiresCall(
  businessSizeTier: BusinessSizeTier,
  accessLevel: AccessLevel
): boolean {
  return !isPurchasable(businessSizeTier, accessLevel);
}

/**
 * Calculate the price for a given configuration (legacy)
 */
export function calculatePrice(
  businessSizeTier: BusinessSizeTier,
  accessLevel: AccessLevel,
  moduleBundle: ModuleBundle
): PriceResult {
  const amountCents = PRICING_MATRIX[businessSizeTier][accessLevel][moduleBundle];
  const purchasable = isPurchasable(businessSizeTier, accessLevel);
  const needsCall = requiresCall(businessSizeTier, accessLevel);

  let inclusions: string[];
  if (businessSizeTier === 'enterprise') {
    inclusions = ENTERPRISE_INCLUSIONS;
  } else if (businessSizeTier === 'large') {
    inclusions = MULTI_SITE_TIERS[accessLevel === 'pulse' ? 'pulse_3' : 'deep_3'].inclusions;
  } else {
    inclusions = INDIVIDUAL_INCLUSIONS[accessLevel];
  }

  let label: string;
  if (!purchasable) {
    label = 'Contact for pricing';
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
 * Calculate price from a PricingInput object (legacy)
 */
export function calculatePriceFromInput(input: PricingInput): PriceResult {
  return calculatePrice(input.businessSizeTier, input.accessLevel, input.moduleBundle);
}

/**
 * Get pricing summary for both pathways for a given business size (legacy)
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
 * Get all pricing tiers for display (legacy)
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

// ============================================
// NEW TIER-BASED API
// ============================================

export function getIndividualTier(tier: IndividualTier): IndividualTierConfig {
  return INDIVIDUAL_TIERS[tier];
}

export function getModuleBundlePrice(moduleCount: 1 | 3 | 5): ModuleBundlePrice {
  return MODULE_BUNDLES.find(b => b.moduleCount === moduleCount) || MODULE_BUNDLES[0];
}

export function getMultiSiteTier(tier: MultiSiteTier): MultiSiteTierConfig {
  return MULTI_SITE_TIERS[tier];
}

export function getAuthorityTier(tier: AuthorityTier): AuthorityTierConfig {
  return AUTHORITY_TIERS[tier];
}

export function calculateAuthorityTotal(tier: AuthorityTier, businessCount: number): {
  platformFeeCents: number;
  licenseTotalCents: number;
  totalCents: number;
  label: string;
} {
  const config = AUTHORITY_TIERS[tier];
  if (!config.isPurchasable) {
    return { platformFeeCents: 0, licenseTotalCents: 0, totalCents: 0, label: 'Contact for pricing' };
  }
  const licenseTotalCents = config.perBusinessCents * businessCount;
  const totalCents = config.platformFeeCents + licenseTotalCents;
  return {
    platformFeeCents: config.platformFeeCents,
    licenseTotalCents,
    totalCents,
    label: `${formatPrice(config.platformFeeCents)} + ${formatPrice(licenseTotalCents)} (${businessCount} businesses)`,
  };
}

// ============================================
// GST
// ============================================

export function calculateGST(amountCents: number): number {
  return Math.round(amountCents * 0.1);
}

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
