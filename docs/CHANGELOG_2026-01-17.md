# Changelog - January 17, 2026

## Accessibility Improvements

### ARIA Landmarks & Screen Reader Support
- Added skip link to `AppLayout.tsx` for keyboard navigation
- Added `role="main"` landmark to main content area
- Added `aria-label` to `NavBar` navigation element
- Added `role="complementary"` and `aria-label` to `Sidebar`
- Added `aria-hidden="true"` to decorative SVG icons in Dashboard and ModuleDetailModal
- Added `role="complementary"` to Dashboard sidebar

### Heading Hierarchy Fixes
- Fixed heading level skips across multiple pages:
  - `Checkout.tsx`: h1 → h2 → h3 (was h1 → h3 → h4)
  - `CheckoutSuccess.tsx`: h1 → h2 (was h1 → h3)
  - `Decision.tsx`: h2 → h3 (was h2 → h4)
  - `ClarifyLater.tsx`: h1 → h2 → h3 (was h1 → h3 → h4)
  - `DiscoverySummary.tsx`: h2 → h3 (was h2 → h4)

### Image Alt Text
- Audited all images for proper alt text
- Updated `MediaAnalysisInput.tsx` with more descriptive alt text for uploaded images

## New Features

### Module Detail Modal
- Created new `ModuleDetailModal.tsx` component for viewing module details
- Added `ModuleDetailModal.css` for modal styling
- Created `moduleDetails.ts` data file with detailed module information
- Enhanced "Learn more" button to show module name: "Learn more about **[Module Name]**"
- Added info icon and arrow to Learn more button

### Discovery Flow Enhancements
- Enhanced category labels on "Your personalised accessibility priorities" page
  - Increased font size to 1.25rem
  - Added letter-spacing for better readability
- Added border-bottom separator to category headers
- Increased category icon size and spacing
- Added more padding and margin to module category containers

## Bug Fixes
- Fixed TypeScript unused variable errors:
  - `JourneyPhaseSection.tsx`: renamed unused `phaseId` prop
  - `Dashboard.tsx`: removed unused `orgName` variable
  - `DiscoverySummary.tsx`: removed unused `setSelectedTouchpoints` setter
  - `recommendationEngine.ts`: removed unused `generateDefaultStarterSet` function

## Files Changed
- `src/components/AppLayout.tsx`
- `src/components/NavBar.tsx`
- `src/components/NavBar.css`
- `src/components/Sidebar.tsx`
- `src/components/discovery/DiscoveryModule.tsx`
- `src/components/discovery/JourneyPhaseSection.tsx`
- `src/components/discovery/discovery.css`
- `src/components/discovery/ModuleDetailModal.tsx` (new)
- `src/components/discovery/ModuleDetailModal.css` (new)
- `src/components/questions/MediaAnalysisInput.tsx`
- `src/data/moduleDetails.ts` (new)
- `src/lib/recommendationEngine.ts`
- `src/pages/Checkout.tsx`
- `src/pages/CheckoutSuccess.tsx`
- `src/pages/ClarifyLater.tsx`
- `src/pages/Dashboard.tsx`
- `src/pages/Decision.tsx`
- `src/pages/DiscoverySummary.tsx`
- `src/pages/DiscoverySummary.css`
- `src/styles/dashboard.css`
