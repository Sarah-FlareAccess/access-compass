# Changelog - January 18, 2026

## Summary
This update focuses on button accessibility improvements across the application, module helper text enhancements, time estimate corrections, and B6 Marketing module refinements.

---

## Button Accessibility Fixes

### Issue
Multiple buttons throughout the application had accessibility issues including:
- Insufficient color contrast (white text on green backgrounds)
- Missing or inconsistent hover states
- Missing focus indicators
- Inconsistent styling across different components

### Changes Made

#### questions.css
- `.btn-complete`: Changed text color from white to dark green (`#052e16`) for 4.5:1 contrast ratio
- `.btn-confirm-complete`: Same dark green text fix
- `.btn-review`: Added proper white background, purple border (`#5a3c82`), dark text, hover state with light purple background (`#f3e8ff`), and focus outline

#### media-analysis.css
- `.btn-skip`: Updated to white background, purple border (`#5a3c82`), dark text (`#1a1a2e`)
- Added hover state with light purple background
- Added focus outline (`2px solid #7c3aed`)

#### url-analysis.css
- `.btn-skip-analysis`: White background, purple border, dark text with accessible hover/focus
- `.btn-change-url`: Same accessible styling pattern
- `.btn-continue-confirmed`: Dark green text (`#052e16`) on green background
- `.btn-analyze`: Added focus state with white outline

#### discovery.css
- Removed `!important` override that was forcing grey background on `.btn-skip`

#### diap.css
- `.btn-cancel`: Updated to white background with purple border styling
- `.diap-actions .btn-secondary`: Same accessible styling pattern

#### ResourceCentre.css
- `.btn-back`: Updated to consistent purple border styling with accessible hover/focus states

---

## Module Helper Text Updates (B4.1)

Enhanced helpContent for the following B4.1 Digital Accessibility questions with more practical guidance:

### B4.1-1-2a (Alt Text Consistency)
- Added tips on establishing clear guidelines
- Included template/checklist recommendations
- Added quality review suggestions

### B4.1-1-2b (Who Adds Alt Text)
- Guidance on training content creators
- Tips on integrating alt text into content workflows
- Note about using accessibility checkers

### B4.1-1-3a (Contrast Audit)
- Tools recommendations (browser extensions, built-in checkers)
- Tips on checking common problem areas
- Note on automated vs manual testing

### B4.1-1-3b (Text on Images)
- Guidance on avoiding text in images
- Tips for ensuring contrast when text on images is necessary
- Note about focus indicators meeting 3:1 contrast ratio

### B4.1-1-5a (Mobile Testing)
- Tips on testing with actual devices
- Checking touch targets and zoom functionality
- Testing with screen readers on mobile

### B4.1-1-5b (Device Types)
- Guidance on testing across device categories
- Browser and OS coverage recommendations

### B4.1-1-6 (Video/Audio Content)
- Captions and transcripts guidance
- Audio description tips
- Accessible media player recommendations

---

## Module Time Estimate Updates

### Issue
The dashboard was displaying pulse-check time estimates regardless of review mode, and deep-dive times needed adjustment to reflect actual completion requirements.

### Changes Made

#### Dashboard.tsx
Fixed time display logic to show appropriate estimates based on review mode:
- **Pulse check mode**: Shows `estimatedTime` with +5 min range
- **Deep dive mode**: Shows `estimatedTimeDeepDive` with +10 min range

#### accessModules.ts - Updated estimatedTimeDeepDive values:

| Module | Previous | Updated |
|--------|----------|---------|
| B1 (Discovery & Information) | 18 min | 25 min |
| B4.1 (Digital - Website) | 25 min | 40 min |
| B4.2 (Digital - Social Media) | 25 min | 35 min |
| B4.3 (Digital - Email) | 30 min | 40 min |
| A1 (Paths & Wayfinding) | 25 min | 30 min |
| A2 (Parking & Drop-off) | 22 min | 28 min |
| A5 (Entrances) | 22 min | 30 min |
| A6 (Vertical Access) | 18 min | 25 min |
| C1 (Customer Service) | 28 min | 35 min |

---

## B6 Marketing Module Changes

### Removed Questions
- **B6-DD-1a**: "What types of imagery do you use in your marketing materials?" (redundant with existing questions)
- **B6-DD-1b**: "Where do you source images for marketing?" (redundant)

### Updated Helper Text
- **B6-DD-2a**: Enhanced guidance on featuring people with disabilities authentically
- **B6-DD-3a**: Updated tips on reviewing marketing language
- **B6-DD-4a**: Improved guidance on staff appearance in marketing

### Other Changes
- Removed all references to Disability:IN throughout the module
- Updated B6-PC-3 to mention alternative formats "alongside standard materials" (not "on request")
- Simplified B6-PC-3 helpText to remove redundant bulleted list

---

## B1 Discovery Module Updates

### B1-D-1b (Findability)
- Expanded tip language with more detailed guidance
- Added examples beyond physical premises (online services, events)
- Removed misplaced "Consider where customers are looking" tip (was about content, not placement)

### B1-D-1c (Participation Information)
- Added "can I participate in this experience" examples for online services and events

---

## Files Modified

- `src/components/discovery/discovery.css`
- `src/components/questions/QuestionFlow.tsx`
- `src/components/questions/media-analysis.css`
- `src/components/questions/questions.css`
- `src/components/questions/url-analysis.css`
- `src/data/accessModules.ts`
- `src/hooks/useBranchingLogic.ts`
- `src/pages/Dashboard.tsx`
- `src/pages/ResourceCentre.css`
- `src/styles/dashboard.css`
- `src/styles/diap.css`

---

## Testing Notes

1. Verify button contrast meets WCAG 2.1 AA standards (4.5:1 for text)
2. Test focus indicators are visible on all interactive elements
3. Confirm hover states work consistently across all button types
4. Check dashboard displays correct time estimates based on review mode
5. Verify B6 module flows correctly with removed questions
