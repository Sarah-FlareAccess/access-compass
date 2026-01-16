# Changelog

All notable changes to Access Compass will be documented in this file.

## [0.3.0] - January 2026

### Added

#### Global Navigation Sidebar
- **New Sidebar Component**: Created `src/components/Sidebar.tsx` for consistent navigation across all authenticated pages
- **Unified Navigation**: All pages now share the same sidebar design as Dashboard
- **Resource Centre Link**: Added to sidebar navigation for easy access to help resources

#### Organisation Identity Redesign
- **Visual Enhancement**: Organisation identity section now features a purple-to-orange gradient background
- **Role Labels**: Renamed display labels - "Owner" shows as "Lead", "Admin" remains "Admin", "Member" shows as "Contributor"
- **Conditional Display**: Role badge only appears when user has an actual organisation membership (hidden for single-user scenarios)

### Fixed

#### Build & Type Errors
- Removed unused `UserEntitlementResult` import from `AuthContext.tsx`
- Fixed type mismatch for constraints in `Dashboard.tsx` - added `as const` assertions for `budget_range`, `capacity`, and `timeframe`

#### UI/UX Bugs
- **Button Alignment**: Fixed Discovery Summary page button sizing issues caused by CSS conflicts between `discovery.css` and `DiscoverySummary.css`
- **Organisation Name**: Fixed bug where user's organisation (e.g., "Hotel Bird") showed as "Test Organisation" - Dashboard was incorrectly overwriting session data
- **Double Sidebar**: Fixed Dashboard page showing duplicate sidebars - excluded `/dashboard` from `PAGES_WITH_SIDEBAR` array in AppLayout
- **Module Count Mismatch**: Fixed 26 vs 25 module count discrepancy - removed incorrect mappings in `normalizeCode` function that was remapping A6→A5 and A7→A6

### Changed
- **Button Styling**: Discovery Summary buttons now use new `.summary-btn` classes with `all: unset` reset to prevent style inheritance conflicts
- **Dashboard Session Logic**: Dev session only created when no session exists at all, preventing overwrite of real user data
- **AppLayout**: Updated to conditionally render sidebar for authenticated pages while excluding Dashboard (which has its own built-in sidebar)

### Technical
- New file: `src/components/Sidebar.tsx` - Global navigation sidebar component
- Updated `src/components/AppLayout.tsx` - Sidebar integration with route-based conditional rendering
- Updated `src/styles/dashboard.css` - Organisation identity gradient styling
- Updated `src/pages/DiscoverySummary.css` - New button classes with style reset
- Updated `src/lib/recommendationEngine.ts` - Fixed normalizeCode mappings

---

## [Unreleased] - December 2024

### Added

#### DIAP 5-Category Structure
The DIAP workspace now uses a standardised 5-category structure aligned with Australian DIAP frameworks:

1. **Physical Access** - Physical spaces, facilities, and navigation
2. **Information, Communication & Marketing** - Digital, print, signage, and marketing materials
3. **Customer Service** - Service delivery and customer interactions
4. **Operations, Policy & Procedure** - Organisational operations and compliance
5. **People & Culture** - Staff capability, training, and workplace culture

#### DIAP Workspace Enhancements
- **Heading Update**: Changed to "Disability Inclusion Action Plan - Management System"
- **By Category View**: New collapsible category view with expand/collapse functionality for reduced cognitive load
- **Filter by Responsible Person**: Dropdown filter to search items by assigned person
- **Responsible Person Autocomplete**: Form suggests previously assigned people (persisted in localStorage)
- **Consistent Categorisation**: All DIAP items, filters, and groupings use the new 5-category structure

#### Access System & Authentication
- Supabase authentication integration
- Access control hooks (`useAuth`, `useAccessCheck`)
- Pathway decision flow (Pulse Check vs Deep Dive)
- Checkout and payment integration structure
- Discovery summary page for returning users

#### Media Analysis Framework
- Comprehensive media analysis for accessibility assessment
- WAVE API integration for website accessibility audits
- Vision-based analysis for printed materials and physical environments
- Social media accessibility checking
- Plain language explanations and actionable guidance

#### UI/UX Improvements
- Help panel with contextual guidance
- Evidence upload enhancements with image optimisation
- Review summary improvements
- Navigation bar updates
- Form page styling refinements

### Changed
- DIAP sections now map to the 5-category structure via `categoryId`
- Updated `DIAPCategory` type definition
- Updated categorisation functions: `categorizeFromText`, `mapModuleToCategory`, `mapAnalysisTypeToCategory`
- Discovery process unchanged (uses customer journey language: Before Arrival, When Here, Staying Connected)

### Technical
- Updated `src/hooks/useDIAPManagement.ts` - DIAP state management with new category types
- Updated `src/data/diapMapping.ts` - Category definitions, DIAP_CATEGORIES, CATEGORY_TO_GROUP
- Added grouping functions: `groupItemsByCategory`, `getCategoriesForGroup`, `getCategoryLabel`
- New files: `useAuth.ts`, `useAccessCheck.ts`, `Decision.tsx`, `DiscoverySummary.tsx`, `HelpPanel.tsx`
- Added `src/utils/visionAnalysis.ts` and `src/utils/imageOptimization.ts`

---

## [0.2.0] - Previous Updates

### Added

#### Module Ownership & Accountability
- **Module Assignment System**: Assign modules to team members with name, email, and target completion date
- **Person+Plus Icon**: Improved assign button with clear person-with-plus icon (previously ambiguous `+` symbol)
- **Email Field**: Added optional email field for future notification capability
- **Completion Confirmation**: At end of module, users confirm completion with "Completed by" name and role
  - Pre-fills with assigned person if module was assigned
  - Completion date is captured automatically
- **Email Notification Template**: After assigning with email, generates a copyable message for:
  - Email, Slack, or Teams notification
  - Includes module name, organisation, target date, and getting started instructions
  - One-click copy to clipboard
- **Confidence Snapshot**: Automatic assessment of module confidence (Strong/Mixed/Needs Work) based on responses

#### DIAP Integration
- **DIAP Section Mapping**: Modules now map to standard DIAP focus areas:
  - Information & Communication
  - Built Environment
  - Service Delivery
  - Customer Service & Training
  - Policy & Procedure
- **Evidence Layer**: DIAP Workspace shows completed module metadata as evidence
- **View Mode Toggle**: Switch between list view and by-section view in DIAP Workspace

#### Reports
- **Module Evidence Section**: Reports now include "Modules Reviewed" section showing:
  - Module name and code
  - Completion date
  - Who completed it (name and role)
  - Who it was assigned to
  - Confidence snapshot
  - Count of strengths and actions identified

### Changed
- Assignment modal header now shows "(optional)" label
- Assignment modal shows email template after saving (if email provided)
- Email field hint updated to explain notification message generation
- Assign button shows edit (pencil) icon when module already has assignment
- Improved tooltip messages for assignment button

### Technical
- Added `ModuleOwnership` interface with `assignedToEmail` field
- Added `ModuleCompletionEvidence` interface for report generation
- Created `src/data/diapMapping.ts` for DIAP section mapping utilities
- Updated `useModuleProgress` hook with ownership management methods
- Updated `useReportGeneration` hook to include module evidence

## [0.1.0] - Initial Release

### Added
- Core accessibility self-review functionality
- 13 assessment modules covering:
  - Before the visit (Accessibility Information)
  - Getting in and around (Entrance, Parking, Paths, Vertical Movement, Wayfinding, Toilets, Sensory Environment)
  - During the visit (Experience, Service Points, Seating)
  - Service and support (Staff Awareness, Communication Support)
- Discovery flow for organisation context
- Module-based question flow with branching logic
- Summary generation with strengths, actions, and areas to explore
- DIAP (Disability Inclusion Action Plan) workspace
- Report generation (Pulse Check and Deep Dive modes)
- PDF export capability
- Local storage persistence
