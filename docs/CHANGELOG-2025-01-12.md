# Changelog - 12 January 2025

## Summary
Major expansion of accessibility modules and fixes to the discovery flow module selection.

---

## New Features

### Policy and Operations Modules (P1-P5)
Expanded the policy section from a single module to five comprehensive modules:

| Module | Name | Description |
|--------|------|-------------|
| P1 | Accessibility policy and commitment | Formalises your accessibility commitment with documented policies and inclusion statements |
| P2 | Employing people with disability | Creates an inclusive workplace - attract, hire, and support employees with disability |
| P3 | Staff training and awareness | Builds disability confidence across your team for consistent, respectful service |
| P4 | Accessible procurement | Ensures suppliers and partners meet accessibility standards |
| P5 | Continuous improvement and reporting | Tracks progress and drives ongoing improvement with metrics and reporting |

**New touchpoints added:**
- Accessibility policies
- Inclusive employment
- Workplace adjustments
- Staff training
- Procurement and partnerships
- Supplier accessibility standards
- Continuous improvement
- Accessibility reporting

### After Visit Modules (C3, C4)
Split the "After visit" phase into two focused modules:

| Module | Name | Focus Areas |
|--------|------|-------------|
| C3 | Feedback and reviews | Surveys, feedback forms, online reviews, complaints handling |
| C4 | Staying connected | Newsletters, promotions, loyalty programs, referrals |

**New touchpoints added:**
- Surveys and forms
- Online reviews and ratings
- Newsletters and emails
- Offers and promotions
- Loyalty and rewards
- Referral programs

---

## Bug Fixes

### Module Selection Bug Fix
**Issue:** After completing discovery, only 3 modules were being selected instead of all recommended modules.

**Root Cause:** The `hasInitializedModules` ref was being initialized with `true` for fresh discovery flows due to stale session data. The ref only checked if `existingData?.recommendedModules?.length` was truthy, which could be true from previous sessions.

**Fix:** Changed ref initialization to require both conditions:
```typescript
const hasInitializedModules = useRef(
  initialStep === 'recommendation' && !!existingData?.recommendedModules?.length
);
```

This ensures:
- Fresh discovery (`initialStep='touchpoints'`): All recommended modules are selected
- Returning to adjust modules (`initialStep='recommendation'`): Existing selection is preserved

### Missing Touchpoint Mapping
**Issue:** The `service-flexibility` touchpoint was not mapped to any modules.

**Fix:** Added mapping in `recommendationEngine.ts`:
```typescript
'service-flexibility': ['C1', 'C2']
```

---

## UI/UX Improvements

### "Back to adjust modules" Navigation
- Changed "Back to discovery" link on Decision page to "Back to adjust modules"
- Link now navigates to `/discovery?modules=true` to go directly to module selection
- Preserves existing touchpoint selections and business context

### CTA Button Text
- Changed "Continue to review" to "Choose your path →" to accurately reflect the next step
- Updated context text to show number of modules selected

---

## Files Changed

### Components
- `src/components/discovery/DiscoveryModule.tsx` - Module initialization fix, ref logic update
- `src/components/discovery/JourneyPhaseSection.tsx` - UI updates
- `src/components/discovery/discovery.css` - Styling updates

### Data
- `src/data/accessModules.ts` - Added P2-P5 and C4 modules with full question sets
- `src/data/touchpoints.ts` - Added 8 policy touchpoints and 6 after-visit touchpoints
- `src/lib/recommendationEngine.ts` - Added touchpoint-to-module mappings, discovery questions

### Pages
- `src/pages/Discovery.tsx` - Added `?modules=true` param handling, existingData prop
- `src/pages/Decision.tsx` - Updated back link navigation

### Hooks & Types
- `src/hooks/useBranchingLogic.ts` - Added new category types (employment, training, procurement, improvement)
- `src/types/index.ts` - Type updates

---

## Technical Notes

### Module Recommendation Flow
1. User selects touchpoints in discovery
2. `generateRecommendations()` calculates scores based on `TOUCHPOINT_TO_MODULES` mapping
3. Modules with score >= 2 are included in recommendations
4. `handleContinue()` initializes `customSelectedModules` with all recommended modules
5. User can toggle individual modules on the recommendation page

### Session Data Structure
```typescript
{
  discovery_data: {
    selectedTouchpoints: string[],
    selectedSubTouchpoints: string[]
  },
  recommended_modules: string[],  // Module codes like 'P1', 'C3'
  review_mode: 'pulse-check' | 'deep-dive'
}
```
