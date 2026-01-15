# Changelog - January 15, 2026

## UI/UX Improvements

### Button Hover States
- Standardized primary button hover color to lighter purple (#723d8d) across the entire site
- Fixed secondary button hovers to use fill effect (purple background, white text) instead of subtle changes
- Updated hover states on DIAP page: Export CSV, List view, By DIAP section, filter tabs, Supporting docs
- Improved dashboard hovers: Evidence Library tab, module section tiles

### Softer Visual Design
- Increased border radius on module groups (16px to 20px) for softer appearance
- Increased border radius on module tiles (12px to 16px)
- Increased border radius on evidence library container (16px to 20px)
- Added rounded corners to topic tiles (section headers)
- Progress card now uses 24px radius for extra soft look
- Topic icons increased from 12px to 16px radius

### Navbar Improvements
- Organisation name now displays as a pill-shaped badge with semi-transparent background
- Added green "active" indicator dot before org name
- Increased font weight for better readability
- Added max-width with text ellipsis for longer organisation names
- Org name now clearly visible between DIAP and Logout buttons

## New Features

### Report a Problem
- Added new ReportProblem modal component for user feedback
- Issue type selector: Bug, Suggestion, Question, Other
- Description textarea for detailed feedback
- Optional screenshot upload with preview
- Auto-captures current page URL for context
- Success confirmation state after submission

### Page Footer Component
- Created reusable PageFooter component with "Access Compass by Flare Access" branding
- Integrated Report Problem trigger button in footer
- Added to key pages: Export, DIAP Workspace, Resource Centre, Discovery Summary

### Dashboard Sidebar
- Added Report Problem trigger in the Help section of the dashboard sidebar

## Files Changed

### New Files
- `src/components/ReportProblem.tsx` - Modal component for reporting problems
- `src/components/ReportProblem.css` - Styling for report problem modal
- `src/components/PageFooter.tsx` - Reusable page footer component
- `src/components/PageFooter.css` - Footer styling
- `src/pages/Export.css` - Export page specific styles

### Modified Files
- `src/styles/global.css` - Button hover standardization
- `src/styles/dashboard.css` - Rounded corners, hover improvements
- `src/styles/diap.css` - Button and section hover fixes
- `src/components/NavBar.css` - Org name badge styling
- `src/components/NavBar.tsx` - Navigation structure
- `src/pages/Dashboard.tsx` - Report Problem integration
- `src/pages/Export.tsx` - PageFooter integration
- `src/pages/DIAPWorkspace.tsx` - PageFooter integration
- `src/pages/ResourceCentre.tsx` - PageFooter integration
- `src/pages/DiscoverySummary.tsx` - PageFooter integration
- Various other CSS files for hover state fixes

## Design Tokens

### Hover Pattern - Primary Buttons
```css
background: #723d8d;
color: white;
transform: translateY(-2px);
box-shadow: 0 6px 20px rgba(114, 61, 141, 0.35);
```

### Hover Pattern - Secondary Buttons
```css
background: #723d8d;
color: white;
border-color: #723d8d;
transform: translateY(-2px);
box-shadow: 0 6px 20px rgba(114, 61, 141, 0.35);
```

### Hover Pattern - Section Headers/Tiles
```css
background: rgba(114, 61, 141, 0.12);
box-shadow: inset 0 0 0 2px rgba(114, 61, 141, 0.15);
```
