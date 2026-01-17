# Changelog - 17 January 2026

## Summary
Major review and refinement of the B4.3 (Social media, video & audio) module to focus on outcomes rather than process. Added expandable sections to module summary, fixed "areas to explore" wording, and improved accessibility.

---

## B4.3 Module - Questions Removed

The following questions were removed as they were process-focused rather than outcome-focused, or were redundant:

### Audio Descriptions
| Question ID | Question | Reason |
|-------------|----------|--------|
| DD-2a | Which types of videos do you provide audio descriptions for? | Granular detail - PC-2 covers the outcome |
| DD-2b | How do you create audio descriptions for your videos? | Process-focused |
| DD-2c | Do you review scripts or storyboards for audio description opportunities? | Process-focused |

### Alt Text / Image Descriptions
| Question ID | Question | Reason |
|-------------|----------|--------|
| DD-3a | On which social media platforms do you consistently add alt text? | Unnecessary detail |
| DD-3b | Do you have guidelines or training for staff on writing effective alt text? | Process-focused (can be in recommendations) |
| DD-3c | Do you use image descriptions in addition to alt text for complex images? | Redundant - added as tip to PC-3 instead |

### Video Controls
| Question ID | Question | Reason |
|-------------|----------|--------|
| DD-4a | Have you tested video playback using keyboard-only navigation? | Process-focused (testing methodology) |
| DD-4c | Can users easily find and activate caption controls on your videos? | Redundant with PC-4 - added as tip instead |

### Content Warnings
| Question ID | Question | Reason |
|-------------|----------|--------|
| DD-5a | What types of content do you provide warnings for? | Granular detail - PC-5 covers the outcome |

### Inclusive Representation
| Question ID | Question | Reason |
|-------------|----------|--------|
| DD-6a | How do you approach representation of people with disability in your content? | Process-focused - PC-6 covers the outcome |
| DD-6c | Do you source imagery from disability-inclusive stock libraries or feature real customers? | Process-focused |

### Live Video
| Question ID | Question | Reason |
|-------------|----------|--------|
| DD-7a | What accessibility features do you include in live video content? | Unnecessary detail |
| DD-7b | Do you test live streaming accessibility features before going live? | Process-focused |
| DD-7c | Do you add corrected captions to recordings of live content? | Repetitive with caption questions |

### Platform Features
| Question ID | Question | Reason |
|-------------|----------|--------|
| PC-8 | Do you use the built-in accessibility features of the social media platforms you post on? | Redundant - outcomes covered by other questions |
| DD-8a | Do you have a checklist or process for using platform accessibility features consistently? | Process-focused |

### Media Analysis
| Question ID | Question | Reason |
|-------------|----------|--------|
| MA-1 | Upload a screenshot of a social media post for accessibility analysis | Removed from audit - will be standalone tool |
| MA-2 | Upload a screenshot or link to a video showing your caption quality | Removed from audit - will be standalone tool |

---

## B4.3 Module - Questions Added

### New Deep Dive Questions

**DD-3e: Text over images contrast**
```
Question: When you add text over images, does it have sufficient contrast to be readable?
helpText: Text overlaid on images needs strong contrast against the background to be readable by everyone.
```
- Includes placeholder example images for good/poor contrast
- Image paths: `/images/examples/text-contrast-good.png` and `/images/examples/text-contrast-poor.png`

**DD-3f: Carousel alt text**
```
Question: Do you add alt text or image descriptions to each image in carousel or multi-image posts?
helpText: Each image in a carousel needs its own description - screen reader users navigate through images one at a time.
```

---

## B4.3 Module - Questions Reworked

### DD-5b: Content warning placement
- **Before**: Multi-select "How do you communicate content warnings to viewers?"
- **After**: Yes-no "Do content warnings appear before the content begins, not just in video descriptions?"
- **Reason**: More outcome-focused - placement matters for effectiveness

### DD-8c: Emoji placement
- **Before**: "Do you limit or format emoji use for screen reader accessibility?"
- **After**: "Are emojis placed at the end of sentences rather than scattered throughout your posts?"
- **Reason**: More specific and outcome-focused

### DD-6b: Inclusive language
- Condensed helpText to one sentence
- Moved detailed guidance to helpContent tips

### DD-8b & DD-8c: Made standalone
- Removed `showWhen` dependency on PC-8 (which was removed)
- Now appear as standalone deep dive questions

---

## Tips Added to Existing Questions

### PC-3 (Alt text on social media)
Added tip:
> "Text-only images: Quote graphics or text on coloured backgrounds need alt text/ID that repeats ALL the text - unless the full text is already in your caption."

### PC-4 (Video player accessibility)
Added tip:
> "Caption controls: Ensure the CC button is visible without hovering and easy to reach by keyboard"

---

## "Areas to Explore" Wording Fix

### Problem
When users answered "unsure" or "unable to check", the summary showed affirmative statements like:
> "There are emojis placed at the end of sentences rather than scattered throughout your posts"

This implied they had confirmed it, when actually they were unsure.

### Solution
Created new `convertQuestionToExploreStatement()` function in `QuestionFlow.tsx` that converts questions to exploratory phrasing:

**Before**: "There are emojis placed at the end of sentences..."
**After**: "Check if emojis are placed at the end of sentences..."

This applies to all modules, not just B4.3.

---

## UI/UX Improvements

### Module Summary Card - Expandable Sections
**File**: `src/components/questions/ModuleSummaryCard.tsx`

The "+X more items" and "+X more actions" text is now clickable to expand/collapse each section:
- "What's going well" - shows 5, click to expand
- "Priority actions" - shows 5, click to expand
- "Areas to explore" - shows 3, click to expand
- "Professional review" - shows 3, click to expand

Features:
- Toggle between expanded/collapsed state
- Shows "Show less" when expanded
- `aria-expanded` attribute for accessibility
- Hover and focus styles

### Skip Button Accessibility Fix
**File**: `src/components/questions/media-analysis.css`

Fixed low contrast on skip button:
- **Before**: `color: #4a4a6a` on transparent background
- **After**: `color: #1a1a2e` on `rgba(255, 255, 255, 0.9)` background

---

## Files Modified

### Core Changes
- `src/data/accessModules.ts` - B4.3 module question changes
- `src/components/questions/QuestionFlow.tsx` - Added `convertQuestionToExploreStatement()` function
- `src/components/questions/ModuleSummaryCard.tsx` - Added expandable sections
- `src/components/questions/questions.css` - Added `.expand-toggle` styles
- `src/components/questions/media-analysis.css` - Fixed skip button contrast

---

## Future Work

### Media Analysis as Standalone Tool
The social media screenshot upload feature (MA-1, MA-2) was removed from the audit flow. Consider implementing as a standalone "Social Media Accessibility Checker" tool in the dashboard that users can access independently of the audit.

### Placeholder Images Needed
Create example images for DD-3e (text over images contrast):
- `/public/images/examples/text-contrast-good.png` - Good example with dark overlay
- `/public/images/examples/text-contrast-poor.png` - Poor example with no overlay

---

## Strategic Documentation Added

### Tier Differentiation Strategy
**File**: `docs/TIER-DIFFERENTIATION-STRATEGY.md`

Comprehensive strategy document outlining how to differentiate Pulse Check vs Deep Dive across five dimensions:
1. Report Deliverables
2. DIAP Workspace Access
3. Analysis Tools & AI Features
4. Resources & Support
5. Guidance Personalization

Includes:
- Detailed feature comparison tables
- 5-phase implementation roadmap
- Quick wins list
- Success metrics
- File reference guide
