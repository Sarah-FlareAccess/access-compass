# Session: During Visit Module Refinement (25 Feb 2026)

## Summary
Refined module 3.2 and expanded 6 During Visit modules (3.4, 3.5, 3.6, 3.7, 3.8, 3.9) to improve depth and robustness of accessibility questions.

## Module 3.2 - Toilets and Amenities (21 to 14 questions)

### Rationale
The "Not sure" path on the entry question triggered 7 measurement-focused deep-dive questions (grab rails, space, basin, fittings, mirror, seat, contrast) that are unrealistic for average users. D-6 conflated grab rails in standard toilets with ambulant toilets. D-7 (Changing Places) duplicated D-16 (adult change facilities).

### Changes
| Action | Details |
|--------|---------|
| Deleted 8 questions | D-2, D-3, D-7, D-8, D-10, D-11, D-13, D-14 (not-sure measurement questions + Changing Places duplicate) |
| Added 1-6 | Photo upload for "not sure" path (pulse-check, supportsEvidence, evidenceTypes: photo) |
| Replaced D-6 | Was "grab rails in standard toilets", now "Do you have an ambulant accessible toilet?" (AS 1428.1 Cl. 16) |
| Simplified D-16 | Removed adult-bench/changing-places split. Now yes/know-nearest/none with merged Changing Places guidance |
| Updated 1-1 | "Not sure" understanding now mentions photo upload instead of compliance checks |
| Removed 'not-sure' from showWhen | 1-3, 1-4, 1-5, D-15 |
| Renumbered | D-4 to D-1, D-5 to D-2, D-6 to D-3, D-9 to D-4, D-12 to D-5, D-15 to D-6, D-16 to D-7 |
| estimatedTimeDeepDive | 40 to 20 |

### Final structure
6 pulse-check + 7 deep-dive + 1 OTHER = 14 questions

---

## Module 3.4 - Equipment and Resources (16 to 18 questions)

### New questions
| ID | Text | Type | Compliance |
|----|------|------|------------|
| F-4 | Is equipment provided free of charge to customers? | single-select (pulse) | best-practice |
| D-7 | Does your equipment cater for a range of body sizes and needs? | single-select (deep) | best-practice |

### Renumbering
D-7 through D-12 renumbered to D-8 through D-13. D-11 showWhen updated to reference D-10.

### estimatedTimeDeepDive: 15 to 18

---

## Module 3.5 - Signage and Wayfinding (5 to 12 questions)

### Rationale
Module had zero deep-dive questions. All 4 existing questions were pulse-check only.

### New questions
| ID | Text | Type | Compliance |
|----|------|------|------------|
| D-1 | Do key signs include tactile lettering and Braille? | single-select | mandatory (AS 1428.1 Cl. 3.5) |
| D-2 | Do signs have adequate colour contrast between text and background? | single-select | mandatory (AS 1428.1 Cl. 3.5) |
| D-3 | Is there directional signage at key decision points? | yes-no-unsure | mandatory (AS 1428.2) |
| D-4 | Is there a map, floor plan, or directory? | single-select | best-practice |
| D-5 | Is there clear signage on the approach and at the entrance? | yes-no-unsure | best-practice |
| D-6 | Are emergency exit signs clearly visible and illuminated? | yes-no-unsure | mandatory (BCA Cl. E4.5-E4.8) |
| D-7 | Do you use pictures, symbols, or Easy Read formats alongside text? | single-select | best-practice |

### estimatedTimeDeepDive: 18 to 25

---

## Module 3.6 - Menus and Printed Materials (17 to 20 questions)

### New questions
| ID | Text | Type | Compliance |
|----|------|------|------------|
| D-9 | Are menus and printed materials physically easy to handle? | single-select | best-practice |
| D-10 | Are alternative format materials kept up to date when standard versions change? | single-select | best-practice |
| D-11 | Is pricing information displayed in a way that is easy to read and locate? | yes-no-unsure | best-practice |

---

## Module 3.7 - Information When You're Here (22 to 24 questions)

### New questions
| ID | Text | Type | Compliance |
|----|------|------|------------|
| DD-10a | Is emergency and safety information available in accessible formats? | single-select | best-practice |
| DD-11a | Are real-time information displays accessible? | single-select | best-practice |

### Note on overlap
Module 3.7 has pre-existing overlap with 3.5 (signage) and 3.6 (printed materials) in its PC-3, PC-4, DD-3a, DD-3b questions. New additions deliberately avoid these areas.

---

## Module 3.8 - Participating in Experiences and Activities (27 to 29 questions)

### New questions
| ID | Text | Type | Compliance | showWhen |
|----|------|------|------------|----------|
| D-24 | Do you offer relaxed or sensory-friendly sessions? | single-select | best-practice | spectator-events |
| D-25 | Is hearing augmentation available in performance or event spaces? | single-select | mandatory (AS 1428.5, APS D3.7) | spectator-events |

### Note
D-25 fills a mandatory gap: hearing augmentation was covered for conferences (D-10) but not for spectator/performance events.

---

## Module 3.9 - Accessible Accommodation (20 to 23 questions)

### New questions
| ID | Text | Type | Compliance |
|----|------|------|------------|
| D-15 | Does the bathroom have non-slip surfaces and adequate lighting? | yes-no-unsure | best-practice |
| D-16 | Are accessible rooms located close to shared facilities with a step-free path? | yes-no-unsure | best-practice |
| D-17 | Can guests store medication or medical equipment in their room? | single-select | best-practice |

---

## Verification
- `npx tsc --noEmit` passes
- `npx vite build` passes (5.76s)
- No em/en dashes in any new content
- All question IDs sequential
- All showWhen references point to valid question IDs
- Bundle size: 4,292 KB (up from 4,267 KB)
