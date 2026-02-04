# Events Category Enhancement - February 2025

## Overview
Major update to the Events category (E1-E5) with new assessment options, additional questions based on best practices from Ability Fest, and improved Discovery Summary editing.

## New Features

### Assessment Type: "Both" Option
- Added third assessment type option: assess **both** ongoing business operations AND events
- Updated `DiscoveryModule.tsx` with three-card selection UI
- Updated `DiscoverySummary.tsx` to allow editing assessment type
- Event modules (E1-E5) automatically added when "event" or "both" is selected
- Backward compatibility maintained for legacy boolean `isEventAssessment` values

### New Questions Added

#### E1: Event Planning & Management
- **E1-D-7**: Virtual/hybrid attendance options for people who cannot attend in person
- **E1-D-8**: Accommodations for volunteers and staff with disability
- **E1-D-9**: Procurement contracts requiring suppliers/vendors to meet accessibility standards

#### E2: Venue & Physical Access
- **E2-D-12**: Weather contingency plans for outdoor events
- **E2-D-13**: Accessible merchandise stalls, vendors, and pop-up stands
- **E2-D-14**: Elevated viewing platforms for wheelchair users and people of short stature
- **E2-D-15**: Accessible pathway surfaces (Super-trac flooring) for outdoor/temporary venues
- **E2-D-16**: Accessible transport/buggies within large venues

#### E3: Communication & Information
- **E3-D-8**: Digital navigation/wayfinding apps (like Bindi Maps) with audio directions

#### E4: Sensory Access & Technology
- **E4-D-9**: Tactile/multi-sensory music experiences (sensory vests, vibrating wristbands, subpacs)

#### E5: On-the-Day Operations
- **E5-D-11**: Re-entry policy for people with disability
- **E5-D-12**: Sunflower lanyard / hidden disability recognition
- **E5-D-13**: Medical support and first aid provisions
- **E5-D-14**: Third-party contractor/partner accessibility training (security, caterers, bar staff)

## Features Now Covered (Based on Ability Fest Best Practices)

| Feature | Module/Question |
|---------|-----------------|
| Relaxed/low-sensory sessions | E4-D-8 |
| Digital maps/navigation apps | E3-D-8 |
| Wayfinding with colours/icons | B2-D-19 |
| Accessible height counters | E2-D-13 |
| Elevated viewing platforms | E2-D-14 |
| Super-trac pathways | E2-D-15 |
| Accessible buggies | E2-D-16 |
| Tactile sensory suits | E4-D-9 |
| Auslan interpreters | E4-PC-1, E4-D-5 |
| Sunflower lanyard | E5-D-12 |
| Quiet/sensory spaces | E2-PC-5, E4-PC-3 |
| Procurement accessibility | E1-D-9 |
| Third-party training | E5-D-14 |

## Technical Changes

### Files Modified
- `src/components/discovery/DiscoveryModule.tsx` - Assessment type state management
- `src/components/discovery/discovery.css` - Both mode styling
- `src/pages/DiscoverySummary.tsx` - Assessment type editing in summary
- `src/pages/DiscoverySummary.css` - Assessment card styling
- `src/data/accessModules.ts` - 14 new questions added to Events modules

### Type Changes
```typescript
// Old
isEventAssessment: boolean

// New
type AssessmentType = 'business' | 'event' | 'both';
assessmentType: AssessmentType
```

## References
- [Ability Fest](https://www.abilityfest.com.au/) - Australia's first inclusive music festival
- [BindiMaps](https://bindimaps.com/) - Accessible navigation app partner
