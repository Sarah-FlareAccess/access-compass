# Access Compass - Session Notes (12 Jan 2026)

## Summary
Landing page copy updates and visual design refinements to create a calmer, more credible aesthetic with smooth section transitions.

---

## Copy Updates

### Hero Section
- **Headline:** "Make your business more accessible — step by step"
- **Subhead:** "Access Compass cuts through the complexity — giving you a clear, prioritised action plan tailored to your business, your budget, and your capacity. No expertise required. Just practical next steps you can actually take."
- **Supporting line:** "Helping hospitality, retail, accommodation, tourism, events, recreation, and service businesses improve accessibility for people with disability — and welcome more customers."
- **Removed:** Three badges (10-15 min check, Instant priorities, Free to start)

### Journey Card (Value Bridge)
- **Updated to:** "Accessibility is a journey, not a one-off task. Access Compass supports progress over perfection, helping you make meaningful improvements one step at a time, within your capacity."

### What You'll Get - Card 4
- **Heading:** Changed from "Quick to complete" → "Built for busy people"
- **Description:** Changed from "Most businesses finish in 15 minutes..." → "Start now, save your progress, and come back anytime. Work at your own pace."

### Bottom CTA
- **Removed:** Supporting text "Takes about 15 minutes. No signup required."

---

## Visual Design Changes

### Colour Update
- Primary purple updated to `#490E67` throughout landing page
- Subtle tonal gradients using variations of brand purple

### Background Sections (Flat/Square Edges)
- Hero section: Removed rounded bottom corners, now edge-to-edge
- All section backgrounds: Smooth gradient transitions, no curved edges
- Value bridge: Gradient flows from purple → light purple → ivory
- Benefits section: Solid ivory background
- How it works: Subtle gradient from ivory-tusk to ivory-warm

### Components (Rounded Corners Restored)
- CTA buttons: `border-radius: var(--radius-md)`
- Value statement card: `border-radius: var(--radius-lg)`
- Benefit cards: `border-radius: var(--radius-lg)` with left border accent
- Benefit icons: `border-radius: var(--radius-md)`
- Step numbers: `border-radius: 50%` (circular)
- Step content cards: `border-radius: var(--radius-md)`

### Design Intent
- Calm, credible, grounded
- System-like rather than decorative
- Continuous visual flow between sections
- Orange accent limited to CTAs only

---

## Files Modified

- `src/pages/Landing.tsx` - Copy updates
- `src/styles/landing.css` - Visual design refinements
- `src/styles/global.css` - Removed hero border-radius

---

## Technical Notes

- Hero badges hidden via CSS (`display: none`) rather than removed from JSX
- Background transitions use smooth vertical gradients
- Component shadows use brand purple with low opacity for warmth

---

## Deployment
- Development server: http://localhost:5173/
- Production: https://access-compass-git-main-sarah-omaras-projects.vercel.app/
