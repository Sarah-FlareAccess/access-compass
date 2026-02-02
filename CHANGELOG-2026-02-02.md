# Access Compass Changes - 2 February 2026

## B4.2 Booking & Ticketing Systems Module

### Questions Added (7 new)
- **DD-1f**: Can customers save their progress and return to complete the booking later?
- **DD-1g**: Is the payment step of your booking process accessible?
- **DD-3d**: Is the booking confirmation accessible?
- **DD-3e**: When customers indicate accessibility requirements, do you automatically send relevant accessibility information?
- **DD-5c**: Is booking information available in plain language or Easy Read format?
- **DD-6c**: Is real-time assistance available for customers who need help during the booking process?
- **DD-8e**: Are promotional offers, packages, and discounts available for accessible bookings?
- **DD-8g**: Are cancellation policies flexible for customers who may need to cancel due to disability-related circumstances?

### Questions Removed (2)
- **DD-8a**: Can accessible tickets or options be booked online? (redundant with PC-8)
- **DD-9b**: When was your booking system last reviewed for accessibility? (generic, not actionable)

### Questions Reformatted (standardised to helpContent format with summary + tips)
- DD-8b: Companion/support worker tickets
- DD-8c: Pricing transparency
- DD-8d: Booking process equivalence
- DD-8f: Modification/cancellation process

### Category Changes
- **DD-1e → PC-9**: Mobile booking promoted to pulse check (high impact)
- **DD-1d**: Fixed showWhen to link to PC-1 instead of PC-2

### Final Module Count
- **9 pulse checks** (was 8)
- **30 deep dives** (was 31)
- **39 total questions**

---

## Accessibility Fixes (WAVE Audit)

### Contrast Improvements
Changed green text color from `#16a34a` to `#166534` (darker) on light backgrounds:
- `dashboard.css`: `.result-good` (e.g., "5 doing well" badges)
- `dashboard.css`: `.confidence-badge.confidence-strong`
- `diap.css`: `.evidence-confidence.confidence-strong`
- `diap.css`: `.evidence-stat.positive`

Changed review button color from `#16a34a` to `#15803d`:
- `dashboard.css`: `.module-action-btn.btn-review`

### Structural Fixes
- Added visually hidden `<h1>` to Dashboard ("Accessibility Dashboard") for screen readers
- Added `.sr-only` utility class to `global.css`

### Redundant Link Fix
- NavBar now renders `<span>` with `aria-current="page"` instead of `<Link>` when on current page
- Prevents duplicate links to same destination

---

## UI/UX Changes

### Dashboard Icon Change
- Changed "new assessment" button icon from counter-clockwise arrow (undo) to **plus (+)** icon
- Plus icon is clearer for "create new" action
- Updated title text to "New assessment"

---

## Files Modified

### Data
- `src/data/accessModules.ts` - B4.2 module questions

### Components
- `src/pages/Dashboard.tsx` - h1, icon change
- `src/components/NavBar.tsx` - redundant link fix

### Styles
- `src/styles/dashboard.css` - contrast fixes
- `src/styles/diap.css` - contrast fixes
- `src/styles/global.css` - added .sr-only class
