/**
 * Per-question DIAP action steps and success indicators.
 *
 * Keyed by question id. When an entry exists, generateDIAPActions and
 * generateSuccessIndicator use it directly (specific, clean, discrete steps
 * and measurable indicators) instead of the module-domain topic fallback in
 * diapContent.ts. Authored module by module; questions without an entry fall
 * back to the topic content.
 *
 * Steps: raw imperative lines (no numbering); the generator adds "1. 2. 3.".
 * Indicators: raw measurable outcomes (no bullet); the generator adds "• ".
 */

export interface DiapQuestionContent {
  steps: string[];
  indicators: string[];
}

export const DIAP_QUESTION_CONTENT: Record<string, DiapQuestionContent> = {
  // ============================================================
  // Module 2.3 - Paths and aisles
  // ============================================================
  '2.3-1-1': {
    steps: [
      'Measure all primary circulation paths and record any below 1000mm clear width',
      'Widen sub-standard paths to at least 1000mm to meet AS 1428.1 Clause 6 and the Premises Standards',
      'Where structural widening is not feasible, relocate furniture, displays or fittings to recover clear width',
    ],
    indicators: [
      'All primary circulation paths measured and sub-standard sections identified within 3 months',
      'Paths widened to at least 1000mm clear width within 12 months, or interim clearance recovered where works are needed',
      'Path widths re-checked after any layout or fit-out change',
    ],
  },
  '2.3-1-2': {
    steps: [
      'Conduct a walk-through audit to identify obstacles, protruding objects and trip hazards on all circulation paths',
      'Remove or relocate permanent obstructions, and set clear rules for temporary items (bins, signage, stock, deliveries)',
      'Add a daily check of accessible routes to the opening or cleaning routine',
    ],
    indicators: [
      'Walk-through audit completed and identified obstructions cleared within 1 month',
      'Daily route check in place, with staff able to clear obstructions within 1 hour',
      'No recurring obstructions found on spot checks over any rolling 3-month period',
    ],
  },
  '2.3-1-3': {
    steps: [
      'Document all internal level changes (stairs, ramps, lifts, escalators) and their locations',
      'Assess each against AS 1428.1 for handrails, TGSIs and gradient, and record the gaps',
      'Prioritise remediation by risk and by how many people each level change affects',
    ],
    indicators: [
      'Register of internal level changes completed within 3 months',
      'Compliance gap assessed for each level change and a remediation order set within 6 months',
      'Register reviewed and updated after any building works',
    ],
  },
  '2.3-D-20': {
    steps: [
      'Survey all paths for overhead clearance below 2000mm (low signs, light fittings, ducts, branches)',
      'Remove, raise or guard each low-hanging hazard to restore 2000mm clearance per AS 1428.1 Cl 7',
      'Where a hazard cannot be removed, install a cane-detectable barrier beneath it (max 680mm height)',
    ],
    indicators: [
      'Overhead clearance survey completed within 3 months',
      'All accessible paths provide at least 2000mm clearance, or a detectable barrier is fitted, within 12 months',
      'Overhead clearance re-checked after any signage or fit-out change',
    ],
  },
  '2.3-D-21': {
    steps: [
      'Identify pinch points where two people cannot pass or a wheelchair cannot turn',
      'Provide at least 1000mm continuous clear width, 1800mm passing spaces and a 2070mm turning circle at key junctions per AS 1428.1 Cl 7',
      'Rearrange furniture or displays to hold the required clearances',
    ],
    indicators: [
      'Pinch points identified and passing/turning spaces provided at key junctions within 12 months',
      'Furniture layout checked monthly to maintain clearances',
      'Turning and passing spaces confirmed after any layout change',
    ],
  },
  '2.3-D-22': {
    steps: [
      'Check clear space each side of internal doors against AS 1428.1 Cl 13 (1200mm x 1200mm, and 600mm beside the latch on the pull side)',
      'Remove furniture or obstacles that restrict the door approach space',
      'Keep the required manoeuvring space clear as a standing rule',
    ],
    indicators: [
      'Door approach spaces assessed and obstructions removed within 6 months',
      'All internal doors on accessible routes meet the AS 1428.1 clear-space requirement within 12 months',
      'Approach spaces kept clear, confirmed on regular floor walks',
    ],
  },
  '2.3-D-23': {
    steps: [
      'Assess luminance contrast between floor surfaces, internal doors and adjacent walls',
      'Increase door and frame contrast to at least 30% luminance against the wall, and add contrast at floor transitions',
      'Avoid monochrome schemes when redecorating or refurbishing',
    ],
    indicators: [
      'Contrast assessment of doors, frames and floor transitions completed within 6 months',
      'Priority low-contrast doors and transitions upgraded to at least 30% luminance contrast within 12 months',
      'Contrast requirement written into the specification for future redecoration',
    ],
  },
  '2.3-D-5': {
    steps: [
      'Map the key internal destinations that need directional signage (toilets, lifts, reception, accessible routes, service areas)',
      'Install consistent, high-contrast wayfinding signage with standard symbols at every decision point',
      'Verify a first-time visitor can find each key destination from the entrance',
    ],
    indicators: [
      'Wayfinding audit completed and priority signs installed within 6 months',
      'Directional signage present at every decision point to key destinations within 12 months',
      'Signage reviewed after any layout change',
    ],
  },
  '2.3-D-6': {
    steps: [
      'Check the mounting height of existing wayfinding signage',
      'Reposition wall-mounted signs to 1400-1600mm centre height per AS 1428.1 Cl 8',
      'Relocate any signs above 1800mm that cannot be read by seated users or people of short stature',
    ],
    indicators: [
      'Signage height audit completed within 3 months',
      'All wayfinding signage repositioned to accessible heights within 12 months',
      'Mounting height included in the standard for new signage',
    ],
  },
  '2.3-D-7': {
    steps: [
      'Produce an accessible floor plan or site map marking accessible routes, lifts, toilets and exits',
      'Use clear labelling, high contrast and large text, and make it available at the entrance and on your website',
      'Consider tactile or digital versions for visitors with vision impairment',
    ],
    indicators: [
      'Accessible floor plan produced and published at the entrance and online within 6 months',
      'Map updated within 2 weeks of any layout change',
      'A tactile or digital alternative offered within 12 months where the venue is large or complex',
    ],
  },
  '2.3-D-8': {
    steps: [
      'Review internal signage for contrast, font and character height',
      'Upgrade to high-contrast (min 70% luminance contrast), sans-serif signage sized for the viewing distance (15mm per metre)',
      'Use matt finishes and avoid decorative fonts, italics and all-capitals for body text',
    ],
    indicators: [
      'Signage contrast and legibility audit completed within 3 months',
      'Priority internal signs upgraded to the high-contrast standard within 12 months',
      'Legibility standard applied to all new signage from now on',
    ],
  },
  '2.3-D-9': {
    steps: [
      'Identify key locations that need tactile or auditory wayfinding (accessible toilets, lifts, exits, main destinations)',
      'Install tactile signs with Braille and raised lettering per AS 1428.1 Cl 8, and TGSIs per AS 1428.4.1 where needed',
      'Consider auditory cues (talking signs, audio beacons) at main destinations',
    ],
    indicators: [
      'Priority rooms fitted with tactile room-identification signage within 12 months',
      'Tactile and any auditory wayfinding checked annually and repaired when damaged',
      'Tactile signage included when any new room or route is added',
    ],
  },
  '2.3-D-10': {
    steps: [
      'Identify where the accessible route differs from the most obvious path',
      'Distinguish accessible routes with signage (ISA and directional arrows), contrasting floor treatment or tactile indicators',
      'Sign the accessible route continuously so it can be followed without backtracking',
    ],
    indicators: [
      'Accessible routes signed end to end within 12 months, especially where they differ from the obvious path',
      'Route signage reviewed after any layout change',
      'Visitors can follow the accessible route without staff assistance, confirmed by a walk-through test',
    ],
  },
  '2.3-D-11': {
    steps: [
      'Identify wet-prone areas (entrances, near sinks, kitchens, bathrooms) and test current slip-resistance',
      'Replace or treat surfaces to at least R10 slip-resistance and confirm it is retained when cleaned',
      'Provide entrance matting to reduce water tracking onto paths',
    ],
    indicators: [
      'Slip-resistance of wet-prone floors assessed within 3 months',
      'Priority wet-area surfaces treated or replaced to at least R10 within 12 months',
      'Slip-resistance confirmed after any change of cleaning product or method',
    ],
  },
  '2.3-D-24': {
    steps: [
      'Survey all floor surfaces for trip hazards (cracked tiles, lifted edges, loose carpet, cable runs, abrupt thresholds)',
      'Repair or replace damaged surfaces, secure loose edges and install cable covers',
      'Establish a regular floor-condition inspection to catch new hazards promptly',
    ],
    indicators: [
      'Floor-condition survey completed and identified hazards rectified within 3 months',
      'Regular inspection schedule in place, with new hazards flagged and made safe within 48 hours',
      'No repeat trip hazards found at the same location over any rolling 6-month period',
    ],
  },
  '2.3-D-12': {
    steps: [
      'Measure lighting levels along internal circulation paths and note dark spots',
      'Increase lighting to at least 160 lux per AS 1680.1, prioritising intersections, stairs, ramps and doorways',
      'Use even, diffused lighting to avoid harsh shadows and glare',
    ],
    indicators: [
      'Lighting levels measured along all circulation paths within 3 months',
      'Path lighting brought to at least 160 lux, with dark spots resolved, within 12 months',
      'Lighting re-checked after any fit-out change and reviewed annually',
    ],
  },
  '2.3-D-13': {
    steps: [
      'Identify longer internal paths that lack rest points',
      'Install seating at regular intervals (every 30 metres as best practice) with armrests, backrests and a clear space beside each seat',
      'Position seats in alcoves so they do not obstruct the path',
    ],
    indicators: [
      'Rest seating installed on longer internal paths within 12 months',
      'Each rest seat has armrests, a backrest and an adjacent clear space for a companion or wheelchair',
      'Seating placement reviewed so it never reduces path clear width',
    ],
  },
  '2.3-D-18': {
    steps: [
      'Test the operating force and hardware of internal doors on accessible routes',
      'Reduce operating force to a maximum of 20N and replace knobs with D-pull or lever handles per AS 1428.1 Cl 13',
      'Consider hold-open devices (fire doors linked to the alarm), power-assist openers, or removing non-essential doors from the accessible path',
    ],
    indicators: [
      'Internal doors on accessible routes assessed for force and hardware within 6 months',
      'Priority doors reduced to max 20N with lever or D-pull handles within 12 months',
      'Door operability re-checked after any hardware or closer adjustment',
    ],
  },
  '2.3-D-19': {
    steps: [
      'Measure the clear opening width of internal doors on accessible routes',
      'Widen sub-standard doors to at least 850mm clear opening per AS 1428.1 Cl 13',
      'Where widening is not feasible, use offset hinges, a sliding door, or remove the door if not needed for fire or acoustic separation',
    ],
    indicators: [
      'Door clear widths measured within 3 months',
      'Doors on accessible routes provide at least 850mm clear opening within 12 months, or an accessible alternative is provided',
      'Clear width preserved when any door is replaced',
    ],
  },
  '2.3-D-25': {
    steps: [
      'Check that all internal stairs have handrails on both sides',
      'Install compliant handrails: continuous, 865-1000mm above the nosing, extending 300mm beyond top and bottom, 30-50mm graspable profile per AS 1428.1 Cl 11',
    ],
    indicators: [
      'Missing or non-compliant stair handrails identified within 3 months',
      'Compliant handrails fitted to both sides of all internal stairs within 12 months',
      'Handrail fixings inspected annually',
    ],
  },
  '2.3-D-26': {
    steps: [
      'Check every internal stair for contrasting nosing on each step',
      'Apply nosing strips with at least 30% luminance contrast against tread and riser, full width, 50-75mm on the tread and 30mm on the riser per AS 1428.1 Cl 11',
    ],
    indicators: [
      'Stairs without compliant nosing identified within 3 months',
      'Contrasting nosing applied to every internal step edge within 12 months',
      'Nosing condition inspected annually and re-applied when worn',
    ],
  },
  '2.3-D-27': {
    steps: [
      'Identify internal stairs with open risers',
      'Retrofit riser panels to close all gaps between treads per AS 1428.1 Cl 11',
    ],
    indicators: [
      'Open-riser stairs identified within 3 months',
      'All open risers on internal stairs enclosed within 12 months',
      'Riser panels checked during annual stair inspection',
    ],
  },
  '2.3-D-28': {
    steps: [
      'Check for warning TGSIs at the top and bottom of all internal stairs',
      'Install truncated-dome TGSIs extending 600mm from the nosing across the full width, with at least 30% luminance contrast, per AS 1428.4.1',
    ],
    indicators: [
      'Stairs without compliant TGSIs identified within 3 months',
      'Warning TGSIs installed at the top and bottom of all internal stairs within 12 months',
      'TGSI condition and contrast checked annually',
    ],
  },
  '2.3-D-14': {
    steps: [
      'Check that all internal ramps have handrails on both sides',
      'Install compliant handrails: continuous, 865-1000mm above the ramp surface, extending 300mm beyond top and bottom, 30-50mm graspable profile per AS 1428.1 Cl 10',
    ],
    indicators: [
      'Ramps without compliant handrails identified within 3 months',
      'Compliant handrails fitted to both sides of all internal ramps within 12 months',
      'Handrail fixings inspected annually',
    ],
  },
  '2.3-D-29': {
    steps: [
      'Measure the gradient and landings of internal ramps',
      'Regrade or rebuild ramps to max 1:14 for runs up to 9m, with level landings at top, bottom and every 9m per AS 1428.1 Cl 10',
      'Aim for 1:20 or gentler on longer ramps as best practice',
    ],
    indicators: [
      'Ramp gradients and landings measured within 3 months',
      'Non-compliant ramps regraded to at least 1:14 with compliant landings within 24 months',
      'Interim signage to a step-free alternative provided while works are planned',
    ],
  },
  '2.3-D-30': {
    steps: [
      'Check for warning TGSIs at the top and bottom of all internal ramps',
      'Install truncated-dome TGSIs extending 600mm from the ramp edge across the full width, with at least 30% luminance contrast, per AS 1428.4.1',
    ],
    indicators: [
      'Ramps without compliant TGSIs identified within 3 months',
      'Warning TGSIs installed at the top and bottom of all internal ramps within 12 months',
      'TGSI condition and contrast checked annually',
    ],
  },
  '2.3-D-16': {
    steps: [
      'Audit each lift against AS 1735.12 accessible features',
      'Upgrade to include tactile and Braille buttons at 900-1100mm, audible floor announcements, visual floor indicators, a rear mirror, handrails and a min 900mm door with adequate hold-open time',
    ],
    indicators: [
      'Lift accessibility audit completed within 3 months',
      'Priority accessible features (buttons, announcements, indicators) installed within 12 months',
      'Lift accessible features checked during routine lift servicing',
    ],
  },
  '2.3-D-17': {
    steps: [
      'Identify anything that prevents independent lift use (key locks, high controls, short door times)',
      'Remove key-lock requirements, fit call and floor buttons at 900-1100mm, and set door hold-open to at least 8 seconds per AS 1735.12',
      'Provide clear operating instructions in accessible formats',
    ],
    indicators: [
      'Barriers to independent lift use identified within 3 months',
      'Lift usable independently, without staff assistance, within 12 months',
      'Independent operation confirmed after any lift servicing or controls change',
    ],
  },
  '2.3-D-31': {
    steps: [
      'Identify each internal escalator without an accessible alternative nearby',
      'Provide a lift or ramp alternative alongside every escalator and sign it clearly with the ISA and a directional arrow',
      'Ensure the alternative is operational during all opening hours',
    ],
    indicators: [
      'Escalators without an accessible alternative identified within 3 months',
      'A signed lift or ramp alternative available alongside every escalator within 24 months',
      'The alternative confirmed operational during all opening hours',
    ],
  },
  '2.3-D-32': {
    steps: [
      'Check for warning TGSIs at the top and bottom of all internal escalators',
      'Install truncated-dome TGSIs extending 600mm from the escalator entry across the full width, with at least 30% luminance contrast, per AS 1428.4.1',
    ],
    indicators: [
      'Escalators without compliant TGSIs identified within 3 months',
      'Warning TGSIs installed at the top and bottom of all internal escalators within 12 months',
      'TGSI condition and contrast checked annually',
    ],
  },
  '2.3-D-15': {
    steps: [
      'Identify level changes that lack visual contrast (step edges, ramp transitions, floor-level changes)',
      'Apply contrasting treatments with at least 30% luminance contrast at each level change per AS 1428.1',
      'Include the top and bottom edges of ramps and each stair nosing',
    ],
    indicators: [
      'Level changes without visual contrast identified within 3 months',
      'Contrast applied at all level changes within 12 months',
      'Contrast condition inspected annually and re-applied when worn',
    ],
  },
  '2.3-1-4': {
    steps: [
      'Walk the venue as if using a wheelchair or walking frame, and again with vision obscured, noting each point where independent navigation fails',
      'Record each failure point with its location and the barrier type',
      'Turn the findings into a prioritised improvement plan with owners and timeframes',
    ],
    indicators: [
      'Independent-navigation walk-through completed within 3 months',
      'Prioritised improvement plan created, with each barrier assigned an owner and timeframe',
      'Re-walk completed annually to confirm barriers are being removed',
    ],
  },
};
