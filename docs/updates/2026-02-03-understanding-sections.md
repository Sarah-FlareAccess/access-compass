# Understanding Sections Added to "Before They Arrive" Modules

**Date:** 3 February 2026
**Summary:** Added "understanding" sections to helpContent for all questions in the "Before They Arrive" category (6 modules, 145 questions total).

---

## What Was Added

Each question now includes an `understanding` array in its `helpContent` with 3 bullet points:
1. What the question is asking/includes
2. When to answer "Yes" (with specific criteria)
3. When to answer "Partially" (with specific criteria)

For multi-select and single-select questions, the format was adapted to explain what to select and how to approach the options.

---

## Modules Updated

| Module | Code | Questions | Status |
|--------|------|-----------|--------|
| Website & Digital | B1 | 35 | Complete |
| Online Accessibility | B4.1 | 25 | Complete |
| Booking Process | B4.2 | 38 | Complete |
| Social Media, Video & Audio | B4.3 | 20 | Complete |
| Clear & Welcoming Information | B5 | 19 | Complete (previous session) |
| Marketing & Representation | B6 | 8 | Complete |

**Total: 145 questions**

---

## Additional Improvements

### Non-Visible/Hidden Disabilities (B6 Module)

Updated the Marketing & Representation module to include non-visible/hidden disabilities alongside visible disabilities:

- **B6-PC-1 helpText:** Added mention of non-visible disabilities (chronic illness, mental health conditions, neurodivergence, hearing loss)
- **B6-PC-1 tips:** Added guidance on representing diverse disabilities including non-visible ones
- **B6-PC-1 tips:** Added examples of how to represent non-visible disabilities (hearing aids, sunflower lanyards, fidget tools)
- **B6-PC-5 tips:** Added mention of insulin pumps, sensory aids, and sunflower lanyards as visible indicators of non-visible disabilities
- **B6-DD-2a tips:** Added note about including people with non-visible disabilities in focus groups and reviews

### Technical Explanations Expanded

**B4.2-DD-5b (Screen reader error announcements):**
- Removed jargon: Explained what "announced" means in plain language
- Clarified users don't need to understand ARIA code, just test whether it works
- Added specific testing instructions: download NVDA from nvaccess.org, turn it on, submit incomplete form, listen
- Described what "good" looks like: announces error AND which field, lets you jump to fix it

**B4.3-DD-5c (PEAT tool for flashing content):**
- Explained what PEAT is and where to get it (trace.umd.edu/peat)
- Described how it works: upload video, automatically detects dangerous flashing, shows where problems are
- Added manual check guidance: watch for 3+ flashes per second
- Listed specific high-risk content: strobe effects, rapid transitions, flickering lights, lightning, camera flashes
- Emphasized why it matters: seizures are a medical emergency

---

## Files Modified

- `src/data/accessModules.ts` - Added understanding sections to all B1, B4.1, B4.2, B4.3, B6 questions

---

## Format Reference

Example of the understanding section format:

```typescript
helpContent: {
  summary: 'Brief explanation of the question...',
  understanding: [
    'What this question is asking/includes',
    'Answer "Yes" if [specific criteria with examples]',
    'Answer "Partially" if [criteria for partial answer]',
  ],
  tips: [
    // Existing tips...
  ],
}
```

---

## Next Steps

Consider applying the same understanding section format to remaining module categories:
- Getting In and Moving Around (A1, A2, A3, A4)
- During the Visit (D modules)
- Service & Support (S modules)
- Customer Service (C modules)
- Continuous Improvement (CI modules)
