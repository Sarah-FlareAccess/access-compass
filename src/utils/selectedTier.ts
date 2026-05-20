// Global store for selected pricing tier using window object.
// This survives across lazy-loaded chunks and cannot be cleared
// by localStorage/sessionStorage cleanup in the auth flow.

export interface TierData { tier: string; category: string }

declare global {
  interface Window {
    __ac_selected_tier?: TierData;
  }
}

export function setSelectedTier(tier: string, category: string) {
  window.__ac_selected_tier = { tier, category };
}

export function getSelectedTier(): TierData | null {
  return window.__ac_selected_tier || null;
}

export type OrgSize = 'small' | 'medium' | 'large' | 'enterprise';

// Map pricing-tier category to the DB size enum. Mirrors the seat-cap
// breakpoints in get_max_members_for_size() (small=5, medium=15, large=50,
// enterprise=500). Authority and major-venue customers need the enterprise
// cap because their team plus child-org coordinators add up quickly.
export function tierToOrgSize(tier: TierData | null): OrgSize {
  if (!tier) return 'small';
  switch (tier.category) {
    case 'authority':
      return 'enterprise';
    case 'majorvenue':
      return 'enterprise';
    case 'multisite':
      return 'large';
    case 'individual':
    default:
      return 'small';
  }
}

// JS mirror of the SQL get_max_members_for_size() function. Keep the two in
// sync if either changes. Used as the fallback when no specific pricing tier
// is known.
export function maxMembersForSize(size: OrgSize): number {
  switch (size) {
    case 'small': return 5;
    case 'medium': return 15;
    case 'large': return 50;
    case 'enterprise': return 500;
  }
}

// Per-tier seat counts. Source of truth: the tier objects in src/pages/Pricing.tsx.
// Keep this in sync if the advertised "users" field changes on any tier.
// The Enterprise authority tier advertises "from 20"; we set 20 as the floor
// and allow seat expansion to be configured on a per-customer basis.
const TIER_SEATS: Record<string, number> = {
  'Free': 1,
  'Starter': 2,
  'Committed': 3,
  'Multi-Site Pulse': 6,
  'Multi-Site Deep': 6,
  'Multi-Site Plus': 12,
  'Premier Venue': 10,
  'Major Venue': 20,
  'Core': 6,
  'Professional': 12,
  'Enterprise': 20,
};

// Resolve max members for a tier by looking up its advertised seat count.
// Returns null when the tier name is unknown so the caller can fall back to
// the size-based default.
export function maxMembersForTier(tier: TierData | null): number | null {
  if (!tier) return null;
  return TIER_SEATS[tier.tier] ?? null;
}
