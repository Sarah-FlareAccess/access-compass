// In-memory store for selected pricing tier.
// Survives across page navigations within the SPA (no storage needed).
let selectedTier: { tier: string; category: string } | null = null;

export function setSelectedTier(tier: string, category: string) {
  selectedTier = { tier, category };
  // Also persist to storage as backup
  try {
    const data = JSON.stringify({ tier, category, selected_at: new Date().toISOString() });
    localStorage.setItem('access_compass_selected_tier', data);
    sessionStorage.setItem('access_compass_selected_tier', data);
  } catch { /* ignore */ }
}

export function getSelectedTier(): { tier: string; category: string } | null {
  if (selectedTier) return selectedTier;
  // Fallback to storage
  try {
    const raw = sessionStorage.getItem('access_compass_selected_tier')
      || localStorage.getItem('access_compass_selected_tier');
    if (raw) {
      const parsed = JSON.parse(raw);
      selectedTier = { tier: parsed.tier, category: parsed.category };
      return selectedTier;
    }
  } catch { /* ignore */ }
  return null;
}
