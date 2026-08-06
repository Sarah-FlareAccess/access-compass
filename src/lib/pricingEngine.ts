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
    moduleLimit: 2,
    resourceHubMonths: 0,
    inclusions: [
      'Up to 2 modules (Deep Dive depth)',
      'Scoped PDF report',
      'Self-service only',
    ],
  },
  starter: {
    name: 'Starter',
    priceAmountCents: 49900,
    period: '12 months',
    accessLevel: 'pulse',
    moduleLimit: null,
    resourceHubMonths: 12,
    inclusions: [
      'Pulse Check on all relevant modules (scoped to your venue from a library of 50)',
      'Resource Hub access (12 months)',
      'Self-service support',
      'Priority action recommendations',
    ],
  },
  committed: {
    name: 'Committed',
    priceAmountCents: 129000,
    period: '12 months',
    accessLevel: 'deep_dive',
    moduleLimit: null,
    resourceHubMonths: 12,
    inclusions: [
      'Deep Dive on all relevant modules (scoped to your venue from a library of 50)',
      'Resource Hub access (12 months)',
      'Full DIAP workspace',
      '1x re-assessment included',
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
    priceAmountCents: 149000,
    period: '12 months',
    sites: 3,
    perSiteCents: 49667,
    isPurchasable: true,
    inclusions: [
      'Pulse Check for 3 sites',
      'Resource Hub access (12 months)',
      'Cross-site comparison',
      'Self-service support',
    ],
  },
  deep_3: {
    name: 'Multi-Site Deep',
    priceAmountCents: 249000,
    period: '12 months',
    sites: 3,
    perSiteCents: 83000,
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
    // The background quoting target, not a printed price. The page shows
    // "Contact us" from six sites up, so this number never reaches a buyer
    // except through a quote. Absorbed the old Multi-Site Custom card.
    priceAmountCents: 490000,
    period: '12 months',
    sites: null,
    perSiteCents: 0,
    isPurchasable: false,
    inclusions: [
      'Deep Dive from 6 sites up',
      'Resource Hub access (12 months)',
      'Full DIAP workspace per site',
      'Cross-site comparison + trends',
      'API access, SSO and custom integrations on request',
      'Dedicated account manager',
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

export type AuthorityTier = 'core' | 'professional' | 'enterprise';

interface AuthorityTierConfig {
  name: string;
  priceAmountCents: number;
  priceLabel: string;
  period: string;
  accessLevel: AccessLevel;
  sites: string;
  users: string;
  reAssessments: number | null;
  networkProgramsIncluded: string | null;
  multiDiap: boolean;
  isPurchasable: boolean;
  inclusions: string[];
}

const AUTHORITY_TIERS: Record<AuthorityTier, AuthorityTierConfig> = {
  core: {
    name: 'Core',
    // Background quoting target. Every Authority edition is now a scoped
    // conversation, so the page prints "Contact us" and this number is the
    // internal record only. Floor rule: Core stays above Multi-Site Plus.
    priceAmountCents: 990000,
    priceLabel: 'Contact us',
    period: '12 months',
    accessLevel: 'deep_dive',
    sites: '6 sites / venues / events',
    users: '20',
    reAssessments: 6,
    networkProgramsIncluded: null,
    multiDiap: false,
    isPurchasable: false,
    inclusions: [
      'Full DIAP management (import, assign, track, export)',
      'Statutory framework alignment and reporting',
      'Australian-built and hosted in Sydney',
      'Works alongside Asana, Monday.com, Planner or Teams — send actions out, evidence comes back',
      '6 sites / events, 20 user seats',
      'All modules (Pulse + Deep Dive)',
      '12-month Resource Hub access',
      'Evidence library',
      '1 re-assessment per site',
      'Stakeholder / board PDF report',
      'Australian data residency (Sydney)',
      '1 × 60-min consultation included',
      'Email + guided onboarding',
    ],
  },
  professional: {
    name: 'Professional',
    // Background quoting target, as with Core. Page prints "Contact us".
    priceAmountCents: 1690000,
    priceLabel: 'Contact us',
    period: '12 months',
    accessLevel: 'deep_dive',
    sites: '12 sites / venues / events',
    users: '30',
    reAssessments: 24,
    networkProgramsIncluded: '1 Lite group (up to 10 businesses)',
    multiDiap: true,
    isPurchasable: false,
    inclusions: [
      'Everything in Core',
      '12 sites / events, 30 user seats',
      '1 Lite Network Program included (10 businesses, 10 Pulse Check modules of your choice, aggregate dashboard, 12 months)',
      '2 re-assessments per site',
      'Program history: compare each plan cycle against the last',
      '1 × 60-min consultation included',
      'Priority email + 6-monthly check-in',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    // The floor stays here as the internal record. The page shows "Contact us"
    // instead, so keep priceLabel matching what the page prints or the two
    // sources disagree about what a buyer was told.
    priceAmountCents: 3000000,
    priceLabel: 'Contact us',
    period: '12 months',
    accessLevel: 'deep_dive',
    sites: 'from 20 sites / venues / events',
    users: 'Unlimited',
    reAssessments: null,
    networkProgramsIncluded: '2 Lite Network Programs (up to 10 businesses each)',
    multiDiap: true,
    isPurchasable: false,
    inclusions: [
      'Everything in Professional',
      'From 20 sites / events, unlimited user seats',
      '2 Lite Network Programs (10 businesses each, 10 Pulse Check modules of your choice per program, aggregate dashboard, 12 months)',
      'Single sign-on (SAML)',
      'API access and custom integrations on request',
      'Unlimited re-assessments',
      '2 × 60-min consultations included',
      'Dedicated implementation and ongoing success support',
    ],
  },
};

// ============================================
// AUTHORITY ADD-ONS
// ============================================

export const CONSULTATION_ADDONS = {
  thirtyMin: { label: '30-min consultation', priceCents: 20000, standalonePriceCents: 25000 },
  sixtyMin: { label: '60-min consultation', priceCents: 35000, standalonePriceCents: 45000 },
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
      core: 49900,      // Starter: $499
      expanded: 49900,
      full: 49900,
    },
    deep_dive: {
      core: 129000,     // Committed: $1,290
      expanded: 129000,
      full: 129000,
    },
  },
  medium: {
    pulse: {
      core: 49900,
      expanded: 49900,
      full: 49900,
    },
    deep_dive: {
      core: 129000,
      expanded: 129000,
      full: 129000,
    },
  },
  large: {
    pulse: {
      core: 149000,     // Multi-Site Pulse (3 sites): $1,490
      expanded: 249000,  // Multi-Site Deep: $2,490
      full: 0,           // Multi-Site Plus: quoted, no printed price
    },
    deep_dive: {
      core: 249000,
      expanded: 0,       // Quoted
      full: 0,           // Quoted
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

export function calculateAuthorityTotal(tier: AuthorityTier): {
  totalCents: number;
  label: string;
} {
  const config = AUTHORITY_TIERS[tier];
  if (!config.isPurchasable) {
    return { totalCents: 0, label: config.priceLabel };
  }
  return {
    totalCents: config.priceAmountCents,
    label: config.priceLabel,
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
