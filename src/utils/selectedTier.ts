// Global store for selected pricing tier using window object.
// This survives across lazy-loaded chunks and cannot be cleared
// by localStorage/sessionStorage cleanup in the auth flow.

interface TierData { tier: string; category: string }

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
