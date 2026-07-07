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

  // ============================================================
  // Module 2.1 - Arrival, parking and drop-off
  // ============================================================
  '2.1-F-1': {
    steps: [
      'Provide at least one designated accessible parking space per the Premises Standards and AS/NZS 2890.6',
      'Size each space to min 2400mm wide with a 2400mm shared area (3200mm for a single space) and 5400mm long',
      'Mark the space with both ground-level and vertical ISA signage',
    ],
    indicators: [
      'At least one compliant accessible parking space provided within 12 months',
      'Space dimensions and shared area confirmed against AS/NZS 2890.6',
      'Bay markings and signage inspected and kept clear on a regular schedule',
    ],
  },
  '2.1-F-2': {
    steps: [
      'Identify the parking space nearest the accessible entry path',
      'Relocate or redesignate accessible parking as close as practicable to the main entrance per AS/NZS 2890.6',
    ],
    indicators: [
      'Accessible parking sited on the shortest practicable route to the entrance within 12 months',
      'Route from the accessible bay to the entrance confirmed step-free and continuous',
    ],
  },
  '2.1-F-3': {
    steps: [
      'Establish a designated drop-off zone near the main entrance, marked with clear signage',
      'Connect the drop-off zone to the accessible path of travel',
      'Allow a minimum 6000mm length to accommodate larger accessible vehicles',
    ],
    indicators: [
      'Signed accessible drop-off zone provided near the entrance within 12 months',
      'Drop-off zone connects to a step-free accessible path',
      'Zone kept clear and usable during operating hours',
    ],
  },
  '2.1-F-3a': {
    steps: [
      'Regrade or modify the drop-off zone to a firm, level surface flush with the adjacent footpath',
      'Install a kerb ramp or dropped kerb per AS 1428.1 Cl 10 where there is a level change between roadway and path',
    ],
    indicators: [
      'Drop-off zone made level and flush with the footpath within 12 months',
      'Any level change resolved with a compliant kerb ramp',
      'Surface checked for trip hazards on a regular schedule',
    ],
  },
  '2.1-F-4': {
    steps: [
      'Survey the path from accessible parking to the entrance for surface condition, trip hazards and crossfall',
      'Resurface or regrade to a firm, slip-resistant, continuous accessible path with max 1:40 crossfall per AS 1428.1 Cl 7',
      'Repair or remove trip hazards along the route',
    ],
    indicators: [
      'Path from accessible parking to the entrance surveyed within 3 months',
      'Continuous firm, slip-resistant accessible path with compliant crossfall within 12 months',
      'Path condition inspected on a regular schedule and after any works',
    ],
  },
  '2.1-F-5': {
    steps: [
      'Measure the path to the entrance and identify sections below 1000mm clear width',
      'Widen to at least 1000mm (1200mm preferred, 1800mm at passing points) per AS 1428.1 Cl 7',
      'Remove obstructions that narrow the effective width (overhanging vegetation, bins, signage)',
    ],
    indicators: [
      'Path widths measured within 3 months',
      'Path widened to at least 1000mm clear width within 12 months, with 1800mm passing points where feasible',
      'Effective width kept clear of obstructions on a regular schedule',
    ],
  },
  '2.1-F-6': {
    steps: [
      'Install directional signage on the road approach to accessible parking, using the ISA with a directional arrow',
      'Position signs at each decision point, visible from the vehicle approach',
    ],
    indicators: [
      'Directional signage to accessible parking installed on the road approach within 6 months',
      'ISA and arrows visible from the vehicle approach at each decision point',
      'Signage condition checked on a regular schedule',
    ],
  },
  '2.1-F-6a': {
    steps: [
      'Install wayfinding signage from accessible parking to the entrance with the ISA and directional arrows',
      'Position signs at each turn or decision point, compliant with AS 1428.1 Cl 8 for height and contrast',
    ],
    indicators: [
      'Wayfinding signage from parking to entrance installed within 6 months',
      'Signs present at every decision point along the route',
      'Signage reviewed after any layout change',
    ],
  },
  '2.1-F-6b': {
    steps: [
      'Sign the point where the accessible route diverges from the main pedestrian path, using the ISA and directional arrows',
      'Make signs visible from both directions and add distance or travel time where helpful',
    ],
    indicators: [
      'Divergence point signed within 6 months',
      'Accessible route can be followed without backtracking, confirmed by a walk-through',
      'Signage reviewed after any layout change',
    ],
  },
  '2.1-F-7': {
    steps: [
      'Train customer-facing staff on the location of accessible parking, the accessible entry route and how to give clear directions',
      'Include this in induction and refresher training, with a simple reference map at reception',
    ],
    indicators: [
      'All customer-facing staff briefed on accessible parking and entry routes within 3 months',
      'Reference map available at reception',
      'Accessible arrival routes included in induction for new staff from now on',
    ],
  },
  '2.1-F-8': {
    steps: [
      'Assess lighting across the parking area, accessible bays, the path to the entrance and any level changes',
      'Provide uniform illumination of at least 40 lux at ground level per AS/NZS 1158',
    ],
    indicators: [
      'Parking-area lighting assessed within 3 months',
      'At least 40 lux at ground level achieved across bays and the path within 12 months',
      'Lighting checked and lamps replaced on a regular schedule',
    ],
  },
  '2.1-D-9': {
    steps: [
      'Identify how accessible bays get blocked during busy periods, events or temporary setups',
      'Put protection measures in place (bollards, no-standing enforcement, staff monitoring)',
      'Address accessible bays explicitly in event and traffic management plans',
    ],
    indicators: [
      'Accessible bays kept available during busy periods, confirmed by spot checks',
      'Event and traffic management plans explicitly protect accessible bays',
      'Blocking incidents logged and reduced over time',
    ],
  },
  '2.1-D-9a': {
    steps: [
      'Inspect the surface of accessible parking spaces for firmness and slip-resistance',
      'Resurface with a firm, slip-resistant material (sealed concrete or asphalt); replace gravel, loose pebbles or worn bitumen',
    ],
    indicators: [
      'Accessible bay surfaces inspected within 3 months',
      'Bays resurfaced to a firm, slip-resistant standard within 12 months',
      'Surface condition checked on a regular schedule',
    ],
  },
  '2.1-D-9c': {
    steps: [
      'Review the parking payment method for accessibility barriers',
      'Provide an accessible option: contactless tap-and-go, a screen-reader-compatible app, or a meter at 900-1100mm with large buttons and a high-contrast display',
      'Avoid touch-screen-only meters without an alternative',
    ],
    indicators: [
      'Parking payment reviewed for accessibility within 6 months',
      'At least one accessible payment method available within 12 months',
      'Accessible payment confirmed after any change to the payment system',
    ],
  },
  '2.1-D-13': {
    steps: [
      'Mark accessible bays with ground-level ISA symbols painted on the bay surface',
      'Add vertical signage on a post or wall at min 1200mm height, per AS/NZS 2890.6 Cl 2.4',
    ],
    indicators: [
      'Accessible bays marked with both ground and vertical ISA signage within 6 months',
      'Signage compliant with AS/NZS 2890.6 Cl 2.4',
      'Markings and signs repainted or replaced when worn',
    ],
  },
  '2.1-D-10': {
    steps: [
      'Identify the most weather-exposed sections of the path from parking to the entrance',
      'Install weather protection (awnings, covered walkways or canopies), prioritising the drop-off zone and entrance',
    ],
    indicators: [
      'Most-exposed path sections identified within 6 months',
      'Weather protection installed on priority sections within 24 months',
      'Weather protection maintained in good condition',
    ],
  },
  '2.1-D-11': {
    steps: [
      'Identify longer sections of the path to the entrance that lack rest points',
      'Install seating with armrests and backrests, best practice every 30 metres',
    ],
    indicators: [
      'Rest seating installed on longer arrival paths within 12 months',
      'Each seat has armrests and a backrest, with a clear space alongside',
      'Seating positioned so it does not reduce path clear width',
    ],
  },
  '2.1-D-12b': {
    steps: [
      'Identify every point where the accessible path crosses a vehicle area or changes level',
      'Install kerb ramps or dropped kerbs with max 1:8 gradient, warning TGSIs at the base and a slip-resistant surface per AS 1428.1 Cl 10',
    ],
    indicators: [
      'Level changes and vehicle crossings identified within 3 months',
      'Compliant kerb ramps installed at each point within 12 months',
      'Ramp gradient, TGSIs and surface confirmed against AS 1428.1',
    ],
  },
  '2.1-D-12c': {
    steps: [
      'Identify paths that blend into surrounding surfaces without a detectable edge',
      'Define path edges with contrasting materials, raised kerbs or tactile edging',
    ],
    indicators: [
      'Paths without detectable edges identified within 6 months',
      'Detectable edges provided on accessible routes within 12 months',
      'Edge definition maintained and re-checked after resurfacing',
    ],
  },
  '2.1-D-15': {
    steps: [
      'Add arrival information to your website: accessible parking location, drop-off zones, the route to the entrance, public transport and any steps or ramps',
      'Include photos or a map where possible',
    ],
    indicators: [
      'Arrival and access information published on the website within 3 months',
      'Information covers parking, drop-off, the entrance route and public transport',
      'Information reviewed for accuracy every 6 months and after any changes',
    ],
  },
  '2.1-D-16': {
    steps: [
      'Assess lighting along the walking route from parking to the entrance after dark',
      'Upgrade lighting so surfaces and signage are clearly visible, targeting at least 40 lux at ground level per AS/NZS 1158',
      'Make wayfinding signs illuminated or retroreflective',
    ],
    indicators: [
      'After-dark lighting on the arrival route assessed within 3 months',
      'At least 40 lux at ground level achieved within 12 months',
      'Signage legible after dark, confirmed on a night check',
    ],
  },
  '2.1-D-17': {
    steps: [
      'Audit wayfinding signage for consistent use of the International Symbol of Access',
      'Replace outdated or non-standard accessibility symbols so the ISA appears at every accessible bay, junction and entrance',
    ],
    indicators: [
      'Signage audited for consistent ISA use within 3 months',
      'ISA standardised across all accessibility signage within 12 months',
      'ISA applied to any new signage from now on',
    ],
  },
  '2.1-D-18': {
    steps: [
      'Map decision points (intersections, turns, forks) along the route from parking and public transport to the entrance',
      'Install wayfinding signage at each, visible from the previous sign',
    ],
    indicators: [
      'Decision points mapped within 3 months',
      'Wayfinding signage present at every decision point within 12 months',
      'Visitors can navigate independently, confirmed by a walk-through',
    ],
  },
  '2.1-D-19': {
    steps: [
      'Check wayfinding signage against AS 1428.1 Cl 8 for contrast, font and character height',
      'Upgrade to min 70% luminance contrast, sans-serif font and character height suited to the viewing distance (min 15mm per metre)',
      'Use matt finishes to avoid glare',
    ],
    indicators: [
      'Signage legibility audited within 3 months',
      'Wayfinding signage upgraded to the AS 1428.1 Cl 8 standard within 12 months',
      'Legibility standard applied to new signage from now on',
    ],
  },
  '2.1-D-20': {
    steps: [
      'Install directional TGSIs (elongated bars) along the accessible route and warning TGSIs (truncated domes) at hazards and decision points per AS 1428.4.1',
      'Ensure min 30% luminance contrast with the surrounding surface',
    ],
    indicators: [
      'TGSIs installed along the accessible route to the entrance within 12 months',
      'Directional and warning TGSIs used correctly per AS 1428.4.1',
      'TGSI condition and contrast checked annually',
    ],
  },
  '2.1-D-22': {
    steps: [
      'Inspect all wayfinding signage for fading, damage, obscuring vegetation or inaccuracy',
      'Repair or replace substandard signs and set a maintenance schedule of at least quarterly',
    ],
    indicators: [
      'Full signage inspection completed within 3 months',
      'Faded, damaged or obscured signs repaired or replaced within 6 months',
      'Quarterly signage maintenance schedule in place',
    ],
  },
  '2.1-D-23': {
    steps: [
      'Review the departure experience: exit wayfinding, checkout counter height, farewell communication and a step-free route to the exit',
      'Provide a lowered checkout section and exit wayfinding as clear as the entry wayfinding',
    ],
    indicators: [
      'Departure experience reviewed for accessibility within 6 months',
      'Step-free exit route and clear exit wayfinding confirmed',
      'Checkout has a lowered accessible section',
    ],
  },
  '2.1-D-24': {
    steps: [
      'Designate an accessible waiting area near the main exit for customers awaiting pick-up',
      'Include weather protection, seating with armrests and backrests, adequate lighting and clear signage',
      'Connect it to a level kerb or drop-off zone accessible to vehicles',
    ],
    indicators: [
      'Accessible pick-up waiting area designated within 12 months',
      'Area has seating, weather protection, lighting and signage',
      'Area connects to a level, vehicle-accessible kerb or drop-off zone',
    ],
  },

  // ============================================================
  // Module 2.2 - Entry and doors
  // ============================================================
  '2.2-F-1': {
    steps: [
      'Assess your main entrance for level access, ramps, steps, lifts or escalators',
      'Provide at least one step-free entry as required under the Premises Standards',
      'Plan modifications where no step-free entry currently exists',
    ],
    indicators: [
      'Main entrance access assessed and any step-free gap identified within 3 months',
      'At least one compliant step-free entrance provided or scheduled within 24 months',
      'Interim access arrangements provided while works are planned',
    ],
  },
  '2.2-D-23': {
    steps: [
      'Check entrance stairs for handrails on both sides',
      'Install compliant handrails: continuous, 865-1000mm above the nosing, extending 300mm beyond top and bottom, 30-50mm graspable profile per AS 1428.1 Cl 11',
    ],
    indicators: [
      'Missing or non-compliant entrance-stair handrails identified within 3 months',
      'Compliant handrails fitted to both sides within 12 months',
      'Handrail fixings inspected annually',
    ],
  },
  '2.2-D-24': {
    steps: [
      'Check every entrance step for contrasting nosing',
      'Apply nosing strips with min 30% luminance contrast against tread and riser, full width, 50-75mm on the tread and 30mm on the riser per AS 1428.1 Cl 11',
    ],
    indicators: [
      'Entrance steps without compliant nosing identified within 3 months',
      'Contrasting nosing applied to every entrance step edge within 12 months',
      'Nosing condition inspected annually and re-applied when worn',
    ],
  },
  '2.2-D-25': {
    steps: [
      'Identify open risers on entrance stairs',
      'Install riser panels to close all gaps per AS 1428.1 Cl 11',
    ],
    indicators: [
      'Open-riser entrance stairs identified within 3 months',
      'All open risers enclosed within 12 months',
      'Riser panels checked during annual stair inspection',
    ],
  },
  '2.2-D-26': {
    steps: [
      'Check for warning TGSIs at the top and bottom of entrance stairs',
      'Install truncated-dome TGSIs extending 600mm from the nosing across the full width, min 30% luminance contrast, per AS 1428.4.1',
    ],
    indicators: [
      'Entrance stairs without compliant TGSIs identified within 3 months',
      'Warning TGSIs installed at the top and bottom within 12 months',
      'TGSI condition and contrast checked annually',
    ],
  },
  '2.2-D-27': {
    steps: [
      'Check the entrance ramp for handrails on both sides',
      'Install compliant handrails: continuous, 865-1000mm above the ramp surface, extending 300mm beyond top and bottom, 30-50mm graspable profile per AS 1428.1 Cl 10',
    ],
    indicators: [
      'Missing or non-compliant entrance-ramp handrails identified within 3 months',
      'Compliant handrails fitted to both sides within 12 months',
      'Handrail fixings inspected annually',
    ],
  },
  '2.2-D-28': {
    steps: [
      'Measure the entrance ramp gradient and landings',
      'Regrade or rebuild to max 1:14 for runs up to 9m (1:8 for kerb ramps), with min 1200mm landings at top, bottom and every 9m per AS 1428.1 Cl 10',
      'Aim for 1:20 or gentler as best practice',
    ],
    indicators: [
      'Entrance ramp gradient and landings measured within 3 months',
      'Non-compliant ramp regraded within 24 months',
      'Interim signage to an accessible alternative provided while works are planned',
    ],
  },
  '2.2-D-29': {
    steps: [
      'Check for warning TGSIs at the top and bottom of the entrance ramp',
      'Install truncated-dome TGSIs extending 600mm from the ramp edge across the full width, min 30% luminance contrast, per AS 1428.4.1',
    ],
    indicators: [
      'Entrance ramp without compliant TGSIs identified within 3 months',
      'Warning TGSIs installed at the top and bottom within 12 months',
      'TGSI condition and contrast checked annually',
    ],
  },
  '2.2-D-30': {
    steps: [
      'Test the entrance ramp surface for slip-resistance in wet and dry conditions',
      'Apply a slip-resistant finish (broomed concrete, anti-slip coating or R11+ tiles) per AS 1428.1 Cl 10',
    ],
    indicators: [
      'Ramp slip-resistance tested within 3 months',
      'Slip-resistant finish applied within 12 months',
      'Slip-resistance confirmed after any resurfacing or cleaning-method change',
    ],
  },
  '2.2-D-31': {
    steps: [
      'Check the entrance lift internal dimensions and door opening against AS 1735.12 (min 1400mm deep x 1100mm wide, 900mm door)',
      'Plan replacement or modification where the lift does not meet the minimums',
    ],
    indicators: [
      'Entrance lift dimensions checked within 3 months',
      'Lift meets AS 1735.12 minimums, or replacement scheduled, within 24 months',
      'Lift accessibility confirmed during routine servicing',
    ],
  },
  '2.2-D-32': {
    steps: [
      'Identify anything preventing independent use of the entrance lift',
      'Install call buttons at 900-1100mm, set door hold-open to at least 8 seconds per AS 1735.12, and provide accessible operating instructions',
    ],
    indicators: [
      'Barriers to independent lift use identified within 3 months',
      'Entrance lift usable independently within 12 months',
      'Independent operation confirmed after any servicing',
    ],
  },
  '2.2-D-33': {
    steps: [
      'Identify whether a step-free alternative exists where the escalator is a primary means of access',
      'Provide a lift or ramp adjacent to or clearly signed from the escalator per the Premises Standards',
    ],
    indicators: [
      'Escalator-only access points identified within 3 months',
      'Signed step-free alternative available within 24 months',
      'Alternative confirmed operational during all opening hours',
    ],
  },
  '2.2-D-13': {
    steps: [
      'Measure the entrance door threshold height',
      'Reduce to max 5mm (bevelled if 5-13mm) per AS 1428.1 Cl 13 by grinding down, adding a threshold ramp or replacing the strip',
    ],
    indicators: [
      'Threshold height measured within 3 months',
      'Threshold reduced to a compliant height within 12 months',
      'Threshold checked for wear on a regular schedule',
    ],
  },
  '2.2-D-18': {
    steps: [
      'Check entrance mats and surface changes are flush and secure (max 3mm lip)',
      'Replace mats that curl, have thick pile or sit in a raised-edge frame',
    ],
    indicators: [
      'Entrance mats and surface changes checked within 3 months',
      'Non-compliant mats replaced within 6 months',
      'Mat condition monitored on a regular schedule',
    ],
  },
  '2.2-D-12': {
    steps: [
      'Provide a level clear space of at least 1200mm x 1200mm on both sides of the entrance door per AS 1428.1 Cl 13',
      'Remove any obstructions from the door approach',
    ],
    indicators: [
      'Door approach clear space assessed within 3 months',
      'Compliant clear space provided on both sides within 12 months',
      'Approach space kept clear, confirmed on regular floor walks',
    ],
  },
  '2.2-F-2': {
    steps: [
      'Measure the main entrance door clear opening width',
      'Widen to at least 850mm (900-950mm preferred) per AS 1428.1 Cl 13',
    ],
    indicators: [
      'Entrance door width measured within 3 months',
      'Door provides at least 850mm clear opening within 24 months, or an accessible alternative entrance is provided',
      'Clear width preserved when the door is replaced',
    ],
  },
  '2.2-F-3': {
    steps: [
      'Test the opening force and hardware of entrance doors',
      'Fit automatic openers, power-assist devices or lever handles, keeping opening force within AS 1428.1 Cl 13 limits',
    ],
    indicators: [
      'Entrance door force and hardware assessed within 6 months',
      'Doors openable with minimal force and no tight grip within 12 months',
      'Door operation re-checked after any hardware or closer adjustment',
    ],
  },
  '2.2-D-11': {
    steps: [
      'Check entrance door handle height',
      'Reposition to 900-1100mm from the floor and fit D-pull or lever handles operable with one hand per AS 1428.1 Cl 13',
    ],
    indicators: [
      'Door handle height and type checked within 3 months',
      'Handles repositioned and upgraded within 12 months',
      'Handle standard applied to any door replacement',
    ],
  },
  '2.2-D-16': {
    steps: [
      'Relocate the intercom or bell to 900-1200mm from the floor',
      'Ensure it is operable with one hand, has a visual activation indicator and a visual or vibrating response option for Deaf visitors',
    ],
    indicators: [
      'Intercom or bell height and operability checked within 3 months',
      'Accessible intercom or bell provided within 12 months',
      'Visual response option available for Deaf visitors',
    ],
  },
  '2.2-F-4': {
    steps: [
      'Improve entrance visibility with contrasting colours on the door and frame, prominent signage and adequate lighting',
      'Add the ISA where the accessible entrance is elsewhere',
    ],
    indicators: [
      'Entrance visibility reviewed within 6 months',
      'Entrance visually distinguishable from the surrounding facade within 12 months',
      'ISA displayed where the accessible entrance differs from the main one',
    ],
  },
  '2.2-F-5': {
    steps: [
      'Install prominent signage at the main entrance directing visitors to the accessible alternative',
      'Include the ISA, a directional arrow and estimated distance, at accessible height and high contrast per AS 1428.1 Cl 8',
    ],
    indicators: [
      'Signage to the accessible entrance installed within 6 months',
      'Sign includes ISA, direction and distance at accessible height',
      'Accessible route can be followed without staff help, confirmed by a walk-through',
    ],
  },
  '2.2-F-6': {
    steps: [
      'Train customer-facing staff to assist visitors entering the building: door holding, guiding someone with vision impairment, wheelchair etiquette (always ask first) and the accessible entrance location',
      'Include this in induction and refresher training',
    ],
    indicators: [
      'Staff briefed on entrance assistance within 3 months',
      'Entrance assistance included in induction for new staff from now on',
      'Refresher completed each year',
    ],
  },
  '2.2-F-7': {
    steps: [
      'Increase entrance lighting to at least 150 lux at floor level, evenly, without harsh glare or deep shadows',
      'Light the door, threshold, any steps or ramp, intercom and signage',
    ],
    indicators: [
      'Entrance lighting assessed within 3 months',
      'At least 150 lux at floor level achieved within 12 months',
      'Lighting checked and lamps replaced on a regular schedule',
    ],
  },
  '2.2-F-8': {
    steps: [
      'Identify entry points that need warning TGSIs (steps, ramps) or directional TGSIs (where the path is not otherwise detectable)',
      'Install warning TGSIs at the top and bottom of steps and ramps, and directional TGSIs along the route, per AS 1428.4.1',
      'Confirm min 30% luminance contrast between the TGSIs and the surrounding surface',
    ],
    indicators: [
      'Key entry points without TGSIs identified within 3 months',
      'TGSIs installed at key entry points within 12 months',
      'TGSI condition and contrast checked annually',
    ],
  },
  '2.2-D-14': {
    steps: [
      'Apply contrasting manifestation to all full-height glass doors and sidelights',
      'Use 75mm strips at 1000mm and 1500mm from the floor, min 30% luminance contrast, per AS 1428.1 Cl 13',
    ],
    indicators: [
      'Unmarked glass doors and sidelights identified within 3 months',
      'Compliant manifestation applied within 6 months',
      'Manifestation checked for wear on a regular schedule',
    ],
  },
  '2.2-D-15a': {
    steps: [
      'Remove obstructions from the entrance area (A-frames, display stands, stacked stock, outdoor furniture)',
      'Maintain a minimum 1200mm clear path and set a daily checklist to keep the entrance zone clear',
    ],
    indicators: [
      'Entrance obstructions cleared within 1 month',
      'Minimum 1200mm clear path maintained, confirmed by daily checks',
      'No recurring obstructions found on spot checks over any rolling 3-month period',
    ],
  },
  '2.2-D-15b': {
    steps: [
      'Develop a busy-period plan covering queue overflow, propped doors, temporary signage and crowd management',
      'Assign a staff member to monitor entrance access during peak times',
    ],
    indicators: [
      'Busy-period access plan in place within 3 months',
      'Entrance access maintained during peak times, confirmed by spot checks',
      'Plan reviewed after each major event or peak season',
    ],
  },
  '2.2-D-17': {
    steps: [
      'Adjust automatic door timing to stay open at least 8 seconds or until the sensor detects the person has cleared the doorway',
      'Set a slow closing speed and use presence sensors rather than motion-only activation',
    ],
    indicators: [
      'Automatic door timing checked within 3 months',
      'Doors hold open long enough for slow-moving visitors within 6 months',
      'Door timing and sensors confirmed during routine servicing',
    ],
  },
  '2.2-D-18c': {
    steps: [
      'Install a vision panel in the entrance door extending from at least 500mm to 1500mm above the floor per AS 1428.1 Cl 13',
      'Use safety glass and ensure clear visibility',
    ],
    indicators: [
      'Doors without a vision panel identified within 3 months',
      'Compliant vision panel installed within 12 months',
      'Vision panel kept clear and unobstructed',
    ],
  },
  '2.2-D-18d': {
    steps: [
      'Apply at least 30% luminance contrast between the door, frame and surrounding wall per AS 1428.1',
      'Paint the frame a contrasting colour or use a distinctly different door finish',
    ],
    indicators: [
      'Door and frame contrast assessed within 6 months',
      'Compliant contrast applied within 12 months',
      'Contrast requirement written into the redecoration specification',
    ],
  },
  '2.2-D-21': {
    steps: [
      'Install directional signage inside the entrance to reception, toilets, lifts and main service areas',
      'Position at eye level (1400-1600mm), high-contrast, with standard symbols alongside text',
    ],
    indicators: [
      'Internal directional signage installed within 6 months',
      'Signs present for key destinations at accessible height',
      'Signage reviewed after any layout change',
    ],
  },
  '2.2-D-22': {
    steps: [
      'Add prominent name signage at accessible reading height, contrasting door or frame colours, or a canopy to distinguish your entrance from neighbouring businesses',
      'Confirm the entrance is identifiable from the street and main approach, including after dark',
    ],
    indicators: [
      'Entrance distinctiveness reviewed within 6 months',
      'Clear identifying signage and visual cues in place within 12 months',
      'Signage kept in good condition',
    ],
  },

  // ============================================================
  // Module 2.4 - Queues and busy times
  // ============================================================
  '2.4-1-1': {
    steps: [
      'Provide seating (fixed or portable) in queue areas for people who cannot stand for long',
      'Position it so people can keep their place in the queue',
    ],
    indicators: [
      'Seating available in queue areas within 6 months',
      'Seating positioned so a place in the queue is kept',
      'Seating condition and placement checked on a regular schedule',
    ],
  },
  '2.4-1-2': {
    steps: [
      'Establish a clear priority-access process and train customer-facing staff to offer it',
      'Display signage informing customers that priority access is available',
    ],
    indicators: [
      'Priority-access process documented and staff trained within 3 months',
      'Signage advertising priority access displayed at queue areas',
      'Priority access offered consistently, reviewed via customer feedback',
    ],
  },
  '2.4-1-2a': {
    steps: [
      'Create a streamlined accessible entry pathway that bypasses the main queue',
      'Sign it clearly and brief staff so customers can use it independently',
    ],
    indicators: [
      'Accessible bypass entry established within 6 months',
      'Clear signage in place and staff aware of the pathway',
      'Customers can use it without staff prompting, confirmed by feedback',
    ],
  },
  '2.4-1-3': {
    steps: [
      'Train front-of-house staff on queue accommodation: when to offer priority access, assisting people with mobility aids and communicating with Deaf customers',
      'Give staff a short reference procedure covering priority access and the assistance options available',
    ],
    indicators: [
      'Front-of-house staff trained on queue accommodation within 3 months',
      'Queue accommodation included in induction for new staff',
      'Refresher completed each year',
    ],
  },
  '2.4-D-4': {
    steps: [
      'Redesign the queue layout for at least 1000mm clear width throughout and a 2070mm turning circle at the service point',
      'Remove barriers that impede wheelchairs (narrow stanchion spacing, high rope barriers) and ensure a level, firm surface',
    ],
    indicators: [
      'Queue layout assessed within 3 months',
      'Queue provides 1000mm clear width and a compliant turning circle within 12 months',
      'Layout re-checked after any reconfiguration',
    ],
  },
  '2.4-D-5': {
    steps: [
      'Install signage at the entrance to queue areas stating assistance is available, with the ISA and a brief prompt (e.g. "Ask a team member for queue assistance")',
      'Position it at eye level (1400-1600mm)',
    ],
    indicators: [
      'Queue-assistance signage installed within 6 months',
      'Signs at eye level with the ISA and a clear prompt',
      'Signage reviewed after any layout change',
    ],
  },
  '2.4-D-6': {
    steps: [
      'Introduce at least one alternative queue option (SMS or app notification, numbered tickets, call-ahead, or queue-from-seated)',
      'Advertise it with signage and on your website',
    ],
    indicators: [
      'At least one alternative queue option offered within 12 months',
      'Alternative advertised on signage and the website',
      'Uptake reviewed and the option refined as needed',
    ],
  },
  '2.4-D-7': {
    steps: [
      'Implement a way to communicate expected wait times (digital display, staff announcements, app or chalkboard), updated at regular intervals',
      'Provide the information in both visual and auditory formats',
    ],
    indicators: [
      'Wait-time communication in place within 6 months',
      'Information provided in both visual and auditory formats',
      'Estimates updated at regular intervals during opening hours',
    ],
  },
  '2.4-D-8': {
    steps: [
      'Develop a crowd-management plan that protects accessible pathways during peak periods',
      'Assign staff to monitor key routes, use barriers that keep 1000mm clear width, and never block accessible paths, ramps or lifts with overflow',
    ],
    indicators: [
      'Crowd-management plan protecting accessible routes in place within 3 months',
      'Accessible pathways kept clear during peaks, confirmed by spot checks',
      'Plan reviewed after each major event or peak season',
    ],
  },
  '2.4-D-9': {
    steps: [
      'Publish queuing and busy-period information on your website and booking confirmations: typical wait times, peak periods, quieter alternatives and priority-access options',
      'Update regularly for seasonal or event changes',
    ],
    indicators: [
      'Queuing and busy-period information published within 3 months',
      'Information covers wait times, peaks, quieter times and priority access',
      'Information reviewed for accuracy every 6 months',
    ],
  },
  '2.4-D-10': {
    steps: [
      'Provide seating with armrests in or beside queue areas, with a mix of seat heights and firm backrests',
      'Leave a clear space for a wheelchair beside the seating',
    ],
    indicators: [
      'Armrest seating provided in queue areas within 6 months',
      'Seat-height variety and a wheelchair space alongside provided',
      'Seating condition checked on a regular schedule',
    ],
  },
  '2.4-D-11': {
    steps: [
      'Make queue barriers (ropes, tapes, stanchions) visually detectable with min 30% luminance contrast against the floor and background',
      'Add cane-detectable elements at the base and avoid clear or thin barriers',
    ],
    indicators: [
      'Low-visibility queue barriers identified within 3 months',
      'Barriers made detectable and contrasting within 12 months',
      'Barrier visibility maintained as equipment is replaced',
    ],
  },
  '2.4-D-12': {
    steps: [
      'Check queue-area floors are firm, level and slip-resistant',
      'Repair uneven surfaces and cracks, apply anti-slip treatment where needed, and avoid matting with raised edges',
    ],
    indicators: [
      'Queue-area floors assessed within 3 months',
      'Surfaces made firm, level and slip-resistant within 12 months',
      'Floor condition monitored on a regular schedule',
    ],
  },
  '2.4-D-13': {
    steps: [
      'Improve audibility of announcements in queue areas (PA, portable speakers or staff positioned to project clearly)',
      'Supplement audio with visual displays (screens, number boards) for Deaf and hard of hearing customers',
    ],
    indicators: [
      'Announcement audibility reviewed within 6 months',
      'Announcements provided in both audio and visual formats within 12 months',
      'Coverage confirmed across all queue areas',
    ],
  },
  '2.4-D-14': {
    steps: [
      'Document your accessible entry and priority-access policy: what is offered, who is eligible and how to request it',
      'Publish it on your website, in booking confirmations and at the venue entrance',
    ],
    indicators: [
      'Accessible entry and priority-access policy documented within 3 months',
      'Policy published on the website, in confirmations and at the entrance',
      'Policy applied consistently, reviewed via feedback',
    ],
  },
  '2.4-D-15': {
    steps: [
      'Register as a Companion Card affiliate (or your state equivalent) and brief staff on accepting it',
      'Display the Companion Card logo at the entrance and ticketing points, and consider other relevant access schemes',
    ],
    indicators: [
      'Companion Card affiliation in place within 6 months',
      'Logo displayed and staff able to accept the card',
      'Other relevant access schemes considered and adopted where suitable',
    ],
  },
  '2.4-D-16': {
    steps: [
      'Provide large, high-contrast visual displays with number or name callouts alongside audible announcements',
      'Position screens at accessible viewing heights (1200-1600mm) and consider a vibrating pager or SMS option',
    ],
    indicators: [
      'Queue display accessibility reviewed within 3 months',
      'Displays provide synchronised visual and audible information within 12 months',
      'Screens at accessible viewing heights, with a pager or SMS alternative offered',
    ],
  },

  // ============================================================
  // Module 3.1 - Seating, furniture and layout
  // ============================================================
  '3.1-1-1': {
    steps: [
      'Review seating for variety in arm, height and depth options',
      'Provide a mix so people with different mobility, size and support needs can find comfortable seating',
    ],
    indicators: [
      'Seating variety reviewed within 3 months',
      'A mix of seat heights, and seats with and without arms, available within 12 months',
      'Seating mix maintained as furniture is replaced',
    ],
  },
  '3.1-D-1': {
    steps: [
      'Audit current seating provision',
      'Introduce a variety of options: movable chairs, seats with armrests, and spaces for wheelchair users alongside companions',
    ],
    indicators: [
      'Seating provision audited within 3 months',
      'Movable chairs, armrest seats and wheelchair-companion spaces provided within 12 months',
      'Provision reviewed as furniture is replaced',
    ],
  },
  '3.1-1-2': {
    steps: [
      'Identify seating areas that lack a wheelchair space beside standard seating',
      'Designate clear wheelchair spaces (min 800mm x 1300mm per AS 1428.1) adjacent to standard seating, on an accessible path',
    ],
    indicators: [
      'Wheelchair companion spaces provided within 12 months',
      'Spaces meet the AS 1428.1 minimum dimensions',
      'Spaces kept clear and available',
    ],
  },
  '3.1-1-3': {
    steps: [
      'Measure table and counter heights and the knee clearance underneath',
      'Provide tables and counters with at least 750mm knee clearance and a surface no higher than 850mm',
    ],
    indicators: [
      'Table and counter heights checked within 3 months',
      'Accessible-height tables and counters provided within 12 months',
      'Accessible surfaces kept available and unobstructed',
    ],
  },
  '3.1-1-4': {
    steps: [
      'Replace or supplement fixed furniture with movable options',
      'Enable staff to rearrange layouts for wheelchair users, mobility aids or service animals',
    ],
    indicators: [
      'Movable furniture options provided within 12 months',
      'Staff able to rearrange layouts on request',
      'Flexibility maintained as furniture is replaced',
    ],
  },
  '3.1-D-2': {
    steps: [
      'Measure aisles and pathways between furniture',
      'Rearrange to achieve min 1000mm clear width (1200mm preferred, 1800mm at passing points) per AS 1428.1:2021 Cl 7',
    ],
    indicators: [
      'Aisle widths measured within 3 months',
      'Minimum 1000mm clear width achieved throughout within 12 months',
      'Furniture layout checked regularly to maintain clearances',
    ],
  },
  '3.1-D-3': {
    steps: [
      'Review the service counter for a wheelchair-accessible section',
      'Install a lowered counter section at max 830mm height with min 800mm knee clearance depth, or establish a clearly signed alternative service point, per AS 1428.1:2021',
    ],
    indicators: [
      'Counter accessibility reviewed within 3 months',
      'Lowered counter section or signed alternative service point provided within 12 months',
      'Accessible service point kept staffed and available',
    ],
  },
  '3.1-D-4': {
    steps: [
      'Provide wheelchair spaces, extra-width seats, companion seating and Easy Access (ambulant) seats in fixed seating areas',
      'Ensure wheelchair spaces are on an accessible path with 900mm min width and 1300mm depth per AS 1428.1:2021',
    ],
    indicators: [
      'Fixed-seating accessibility reviewed within 3 months',
      'Range of accessible seat types provided within 24 months',
      'Wheelchair spaces confirmed on an accessible path',
    ],
  },
  '3.1-D-5': {
    steps: [
      'Install rest seating at regular intervals along walking routes (every 60m recommended), near high-traffic areas and at points of interest',
      'Include seats with armrests and backrests at 450mm seat height',
    ],
    indicators: [
      'Rest-seating gaps identified within 3 months',
      'Rest seating installed at recommended intervals within 12 months',
      'Seating condition checked on a regular schedule',
    ],
  },
  '3.1-D-6': {
    steps: [
      'Ensure seating areas can accommodate assistance animals with floor space beside or under tables, without blocking exits',
      'Brief staff that recognised assistance animals must not be refused entry under the DDA 1992',
    ],
    indicators: [
      'Seating reviewed for assistance-animal space within 3 months',
      'Adequate space provided and exits kept clear',
      'Staff briefed on assistance-animal rights within 3 months',
    ],
  },
  '3.1-D-7': {
    steps: [
      'Establish a designated assistance-animal relief area with a suitable surface, drainage, waste disposal and clear signage',
      'Locate it within reasonable distance of main areas and communicate its location to visitors',
    ],
    indicators: [
      'Assistance-animal relief area established within 12 months',
      'Area has surface, drainage, waste disposal and signage',
      'Location communicated on the website and by staff',
    ],
  },
  '3.1-D-8': {
    steps: [
      'Install coat hooks and shelving at two heights: 900-1100mm and 1500-1700mm',
      'Provide lockers with accessible locks at 900-1100mm',
    ],
    indicators: [
      'Hook, locker and shelf heights reviewed within 3 months',
      'Accessible-height options provided within 12 months',
      'Accessible options kept available',
    ],
  },
  '3.1-D-9': {
    steps: [
      'Relocate or supplement controls (light switches, outlets, thermostats) to 900-1100mm from the floor',
      'Ensure they are operable with one hand from a seated position without tight grasping or twisting, per AS 1428.1:2021 Cl 16',
    ],
    indicators: [
      'Control heights and operability reviewed within 6 months',
      'Accessible controls provided within 12 months',
      'Control standard applied to any fit-out change',
    ],
  },
  '3.1-D-10': {
    steps: [
      'Identify the points where customers complete forms or paperwork',
      'Provide an accessible writing surface there: a table or counter at 750-830mm height with min 800mm knee clearance and clear floor space for a wheelchair',
    ],
    indicators: [
      'Writing-surface accessibility reviewed within 3 months',
      'Accessible writing surface provided at form-completion points within 12 months',
      'Surface kept clear and available',
    ],
  },
  '3.1-D-12': {
    steps: [
      'Reposition wheelchair spaces or install raised platforms so wheelchair users have equivalent sightlines, including when others stand',
      'Ensure sightlines are not obstructed by barriers or railings per AS 1428.1:2021',
    ],
    indicators: [
      'Wheelchair-space sightlines reviewed within 6 months',
      'Equivalent sightlines provided within 24 months',
      'Sightlines confirmed after any seating reconfiguration',
    ],
  },
  '3.1-D-13': {
    steps: [
      'Enable accessible seating booking through all standard channels (online, phone, in-person) with no separate process',
      'Remove any special-number or proof-of-disability requirements',
    ],
    indicators: [
      'Accessible-seating booking process reviewed within 3 months',
      'Accessible seating bookable through all standard channels within 6 months',
      'No proof-of-disability barrier remains',
    ],
  },
  '3.1-D-14': {
    steps: [
      'Improve visual contrast between furniture and flooring using colour and luminance',
      'Aim for at least 30% luminance contrast between furniture edges and the floor',
    ],
    indicators: [
      'Furniture-floor contrast reviewed within 6 months',
      'At least 30% luminance contrast achieved on key furniture within 12 months',
      'Contrast written into future furniture selection',
    ],
  },
  '3.1-D-15': {
    steps: [
      'Provide a level, firm surface, shade or weather protection, an accessible path from indoors and proximity to accessible toilets',
      'Include movable furniture and a wheelchair-accessible table',
    ],
    indicators: [
      'Outdoor seating accessibility reviewed within 6 months',
      'Level surface, shade, accessible path and wheelchair table provided within 24 months',
      'Outdoor access maintained through seasonal changes',
    ],
  },

  // ============================================================
  // Module 3.2 - Toilets and amenities
  // ============================================================
  '3.2-1-1': {
    steps: [
      'Assess whether you have a compliant accessible toilet, or identify the nearest one',
      'Install or upgrade to meet AS 1428.1 Clause 15 (circulation space, grab rails, accessible fixtures)',
      'Sign the accessible toilet clearly and brief staff so they can direct customers to it',
    ],
    indicators: [
      'Accessible toilet provision assessed within 3 months',
      'A compliant accessible toilet available or scheduled within 24 months',
      'Facility checked against AS 1428.1 after any works',
    ],
  },
  '3.2-1-2': {
    steps: [
      'Identify the nearest accessible toilet (on-site or nearby) and confirm its availability and compliance',
      'Brief all staff so they can direct customers to it',
      'Add the location to your website and pre-visit information',
    ],
    indicators: [
      'Nearest accessible toilet identified and its location documented within 1 month',
      'All staff able to direct customers to it within 3 months',
      'Availability re-confirmed on a regular schedule',
    ],
  },
  '3.2-1-3': {
    steps: [
      'Install signage with tactile lettering, Braille and the International Symbol of Access at each accessible toilet',
      'Position it at 1200-1600mm height on the latch side of the door per AS 1428.1',
      'Confirm the signage can be read by touch and is not obstructed',
    ],
    indicators: [
      'Accessible-toilet signage reviewed within 3 months',
      'Compliant tactile and Braille signage installed within 12 months',
      'Signage condition checked on a regular schedule',
    ],
  },
  '3.2-1-4': {
    steps: [
      'Remove all stored items (cleaning supplies, spare furniture, stock) from the accessible toilet',
      'Put a policy in place prohibiting storage in the facility',
      'Add a check to the daily cleaning routine to keep it clear',
    ],
    indicators: [
      'Accessible toilet cleared of storage within 1 month',
      'No-storage policy in place and communicated to staff',
      'Toilet confirmed clear on regular checks',
    ],
  },
  '3.2-1-5': {
    steps: [
      'Install an emergency alarm cord or button reachable from floor level per AS 1428.1 Clause 15, connected to a monitored point',
      'Set a regular test schedule',
      'Train staff on how to respond when the alarm is activated',
    ],
    indicators: [
      'Emergency alarm installed within 12 months',
      'Alarm connected to a monitored point and reachable from floor level',
      'Alarm tested on a regular schedule and staff know how to respond',
    ],
  },
  '3.2-D-1': {
    steps: [
      'Replace toilet door hardware with lever handles or D-pulls and a sliding-bolt lock operable with one hand',
      'Ensure the accessible toilet door opens outward or slides, with min 850mm clear opening per AS 1428.1:2021 Cl 19',
      'Test the door and lock can be operated one-handed with minimal force',
    ],
    indicators: [
      'Toilet door hardware and swing reviewed within 3 months',
      'Compliant handles, lock and clear opening provided within 12 months',
      'Door operation re-checked after any hardware change',
    ],
  },
  '3.2-D-2': {
    steps: [
      'Install at least one baby change station at accessible height (max 900mm folded down) with clear wheelchair floor space',
      'Make it accessible from the accessible toilet or a separate accessible room, not female-only',
      'Sign the location and include it in your facility information',
    ],
    indicators: [
      'Baby change accessibility reviewed within 3 months',
      'Accessible, non-gender-restricted baby change provided within 12 months',
      'Change facility kept clear and available',
    ],
  },
  '3.2-D-3': {
    steps: [
      'Confirm whether an ambulant accessible cubicle is needed and identify a suitable location',
      'Install an ambulant accessible cubicle per AS 1428.1:2021 Cl 20: min 900mm width, side-wall grab rail, 540mm from the pan centreline to the near wall, and an outward-opening door',
      'Sign the cubicle with the ambulant accessible symbol',
    ],
    indicators: [
      'Ambulant toilet need assessed within 3 months',
      'Compliant ambulant cubicle provided within 24 months',
      'Cubicle confirmed against AS 1428.1 Cl 20',
    ],
  },
  '3.2-D-4': {
    steps: [
      'Review taps in accessible facilities for grip or twist operation',
      'Replace with lever, sensor or push-type taps usable without gripping or twisting per AS 1428.1:2021 Cl 19.5',
      'Set sensor taps to stay on for at least 10 seconds',
    ],
    indicators: [
      'Taps reviewed within 3 months',
      'Compliant taps installed within 12 months',
      'Tap operation confirmed after any fixture change',
    ],
  },
  '3.2-D-5': {
    steps: [
      'Install soap dispensers and hand dryers at 900-1100mm, reachable from a seated position, push-button or sensor-operated',
      'Position them near the washbasin with visual contrast against the wall',
      'Confirm they can be operated one-handed from a seated position',
    ],
    indicators: [
      'Dispenser and dryer heights reviewed within 3 months',
      'Accessible dispensers and dryers installed within 12 months',
      'Fittings kept in working order on a regular schedule',
    ],
  },
  '3.2-D-6': {
    steps: [
      'Provide sanitary disposal and waste bins in the accessible toilet at 500-1100mm, within reach of the toilet, operable with one hand',
      'Provide them regardless of the user\'s gender',
      'Add the bins to the regular servicing schedule',
    ],
    indicators: [
      'Bin provision and placement reviewed within 3 months',
      'Accessible bins provided in the accessible toilet within 6 months',
      'Bins kept serviced and within reach',
    ],
  },
  '3.2-D-7': {
    steps: [
      'Assess the need and space for an adult change facility (Changing Places standard)',
      'Install a height-adjustable adult change table (min 1800x750mm), ceiling hoist, clear floor space and a privacy screen, separate from the standard accessible toilet',
      'Register the facility on the National Changing Places map and set a servicing schedule',
    ],
    indicators: [
      'Adult change facility need and feasibility assessed within 6 months',
      'Changing Places facility provided or scheduled within 24 months',
      'Facility registered and serviced where installed',
    ],
  },
  '3.2-D-8': {
    steps: [
      'Review grab rail compliance against AS 1428.1:2021 Cl 19.3',
      'Install a 600mm drop-down rail on the transfer side at 800-810mm and a fixed rail on the wall side',
      'Confirm both rails support 1100N with 30-40mm diameter and 35-45mm wall clearance',
    ],
    indicators: [
      'Grab rail compliance reviewed within 3 months',
      'Compliant grab rails installed within 12 months',
      'Rail fixings load-tested and inspected on a regular schedule',
    ],
  },
  '3.2-D-9': {
    steps: [
      'Assess the transfer-side and circulation space in the accessible toilet',
      'Reconfigure to provide min 900mm clear space on the transfer side and 1160mm circulation space per AS 1428.1:2021 Cl 19',
      'Remove any obstructions in the transfer zone and keep it clear',
    ],
    indicators: [
      'Transfer-space layout reviewed within 3 months',
      'Compliant transfer and circulation space provided within 24 months',
      'Transfer zone kept clear of obstructions',
    ],
  },
  '3.2-D-10': {
    steps: [
      'Review the washbasin height, knee clearance and pipe protection',
      'Install a washbasin with the rim at max 830mm, min 600mm knee clearance and insulated or recessed pipes per AS 1428.1:2021 Cl 19.5',
      'Confirm it is reachable from a wheelchair without obstruction',
    ],
    indicators: [
      'Washbasin accessibility reviewed within 3 months',
      'Compliant washbasin installed within 12 months',
      'Pipe insulation and clearance confirmed after any plumbing change',
    ],
  },
  '3.2-D-11': {
    steps: [
      'Check the reach to fittings from the toilet (flush, toilet paper, coat hook)',
      'Reposition them to compliant, reachable locations: flush within 300mm of the cistern front on the transfer side, toilet paper 600-700mm from the floor within arm reach, and coat hook at 1200mm per AS 1428.1:2021',
      'Confirm each fitting can be reached from the seated position on the toilet',
    ],
    indicators: [
      'Fitting positions reviewed within 3 months',
      'Fittings repositioned to compliant, reachable locations within 12 months',
      'Reach confirmed after any refit',
    ],
  },
  '3.2-D-12': {
    steps: [
      'Check whether the mirror is usable from both standing and seated positions',
      'Install a mirror with the bottom edge at 900mm or lower and the top edge at 1850mm or higher, or a tilted mirror, per AS 1428.1:2021',
      'Confirm the reflection is usable from a seated position',
    ],
    indicators: [
      'Mirror height reviewed within 3 months',
      'Compliant mirror installed within 12 months',
      'Mirror kept clean and undamaged',
    ],
  },
  '3.2-D-13': {
    steps: [
      'Assess whether the toilet provides trunk support for users who need it',
      'Install a padded backrest behind the cistern or wall-mounted at an appropriate height, as specified in AS 1428.1:2021',
      'Confirm the backrest is securely fixed and positioned for support',
    ],
    indicators: [
      'Backrest need reviewed within 3 months',
      'Compliant backrest installed within 12 months',
      'Backrest fixings inspected on a regular schedule',
    ],
  },
  '3.2-D-14': {
    steps: [
      'Review the visual contrast of toilet fittings (grab rails, flush buttons, door handles, sanitary fittings) against their background',
      'Upgrade fittings to min 30% luminance contrast per AS 1428.1:2021 Cl 19',
      'Apply the contrast requirement to any future fixture replacement',
    ],
    indicators: [
      'Fitting contrast reviewed within 3 months',
      'Compliant contrast provided on key fittings within 12 months',
      'Contrast written into future fixture selection',
    ],
  },

  // ============================================================
  // Module 3.3 - Lighting, sound and sensory environment
  // ============================================================
  '3.3-1-1': {
    steps: [
      'Assess lighting levels throughout the venue for flickering, harsh fluorescents and dark spots',
      'Address issues that affect people with low vision, migraines or sensory sensitivities',
    ],
    indicators: [
      'Lighting assessment completed within 3 months',
      'Flicker, harsh lighting and dark spots resolved within 12 months',
      'Lighting reviewed after any fit-out change',
    ],
  },
  '3.3-1-2': {
    steps: [
      'Identify a suitable location for a quiet space, away from noise and on an accessible path',
      'Set it up with reduced lighting, minimal noise and comfortable seating for a sensory break',
      'Sign it and let visitors and staff know where it is',
    ],
    indicators: [
      'Quiet space identified and available within 6 months',
      'Space has reduced lighting, low noise and comfortable seating',
      'Location communicated to visitors and staff',
    ],
  },
  '3.3-1-3': {
    steps: [
      'Measure noise levels in key areas',
      'Reduce background noise through acoustic treatment, music volume limits or quieter zones for hearing aid users and people who lip-read',
    ],
    indicators: [
      'Noise levels measured in key areas within 3 months',
      'Noise reduced in problem areas within 12 months',
      'Quieter zones or times offered where suitable',
    ],
  },
  '3.3-1-4': {
    steps: [
      'Audit the venue for flashing lights (strobes, digital signage, beacons) and sudden loud noises',
      'Eliminate them or provide advance warnings, per WCAG 2.2 SC 2.3.1 (three-flash threshold)',
    ],
    indicators: [
      'Flashing-light and loud-noise audit completed within 3 months',
      'Triggers eliminated or clearly warned within 12 months',
      'Checked when new equipment or content is introduced',
    ],
  },
  '3.3-1-5': {
    steps: [
      'Confirm temperature controls are available and functioning',
      'Consider designating warmer or cooler zones for people with temperature regulation difficulties',
    ],
    indicators: [
      'Temperature control reviewed within 6 months',
      'Controls functioning and a warmer or cooler option available where practical',
      'Temperature comfort reviewed via feedback',
    ],
  },
  '3.3-1-6': {
    steps: [
      'Create sensory support kits (noise-reducing headphones, fidget tools, sunglasses, communication cards)',
      'Make them available for loan at reception or entry points',
    ],
    indicators: [
      'Sensory support kits available for loan within 6 months',
      'Kits promoted on the website and by staff',
      'Kit contents maintained and restocked on a regular schedule',
    ],
  },
  '3.3-1-7': {
    steps: [
      'Plan and trial a relaxed or sensory-friendly session with reduced lighting, lower music and fewer crowds',
      'Provide advance social stories or visual guides',
    ],
    indicators: [
      'A relaxed session trialled within 12 months',
      'Advance social story or visual guide published',
      'Sessions reviewed via participant feedback and repeated where valued',
    ],
  },
  '3.3-1-8': {
    steps: [
      'Install a hearing loop or portable hearing augmentation in key service areas (reception, meeting rooms, counters)',
      'Display the hearing loop symbol per AS 1428.5',
    ],
    indicators: [
      'Hearing augmentation installed in key service areas within 12 months',
      'Hearing loop symbol displayed at each location',
      'System tested monthly and confirmed operational',
    ],
  },
  '3.3-D-1': {
    steps: [
      'Install dimmable lighting or provide areas with adjustable light levels',
      'Ensure controls are accessible at 900-1100mm height',
    ],
    indicators: [
      'Adjustable lighting provided in key areas within 12 months',
      'Lighting controls at accessible height',
      'Lighting flexibility maintained after any fit-out',
    ],
  },
  '3.3-D-2': {
    steps: [
      'Measure lighting levels at service counters, reception and information points',
      'Improve lighting to min 300 lux, evenly distributed, without shadows on faces',
      'Confirm faces are evenly lit for lipreading, without glare',
    ],
    indicators: [
      'Service-point lighting measured within 3 months',
      'Min 300 lux even lighting achieved at service points within 12 months',
      'Lighting re-checked after any change',
    ],
  },
  '3.3-D-3': {
    steps: [
      'Identify glare sources (reflective floors, glossy counters, windows, entrance transitions)',
      'Address them with non-reflective floor surfaces, matte counter finishes, blinds or window film, and transitional lighting at entrances',
    ],
    indicators: [
      'Glare sources identified within 3 months',
      'Priority glare issues resolved within 12 months',
      'Glare re-checked after any surface or lighting change',
    ],
  },
  '3.3-D-4': {
    steps: [
      'Introduce acoustic measures (sound-absorbing ceiling panels, carpet or soft flooring, fabric furnishings, acoustic screens)',
      'Target background noise below 45dB in customer service areas',
    ],
    indicators: [
      'Acoustic assessment completed within 6 months',
      'Background noise reduced below 45dB in service areas within 24 months',
      'Acoustic performance re-checked after any refurbishment',
    ],
  },
  '3.3-D-5': {
    steps: [
      'Install zone controls so background music can be reduced or muted in service areas',
      'Keep music below 50dB where communication happens',
    ],
    indicators: [
      'Music zone controls installed within 12 months',
      'Music kept below 50dB in service areas',
      'Volume management briefed to staff',
    ],
  },
  '3.3-D-6': {
    steps: [
      'Install visual display screens showing text versions of PA announcements at key locations',
      'Ensure safety and emergency alerts always have a visual alternative per the DDA',
    ],
    indicators: [
      'Visual announcement displays installed at key locations within 12 months',
      'All emergency announcements have a visual alternative',
      'Displays tested during emergency drills',
    ],
  },
  '3.3-D-7': {
    steps: [
      'Install hearing (induction) loops at service counters, ticketing, information desks and performance or meeting spaces per AS 1428.5 and AS 60118.4',
      'Confirm field strength of 400mA/m within plus or minus 3dB',
    ],
    indicators: [
      'Hearing loops installed at key points within 12 months',
      'Field strength confirmed against AS 60118.4',
      'Loops tested monthly and confirmed operational',
    ],
  },
  '3.3-D-8': {
    steps: [
      'Install the international hearing loop symbol (blue ear with T) at every operational loop, at eye level and visible before the counter',
      'Ensure signs comply with AS 1428.1 for size and contrast',
    ],
    indicators: [
      'Hearing loop signage installed at every loop within 6 months',
      'Symbols visible before reaching the counter',
      'Signage reviewed when loops are added or moved',
    ],
  },
  '3.3-D-9': {
    steps: [
      'Equip the quiet space with dimmable lighting, comfortable seating, minimal visual stimuli, noise-reducing features and clear signage',
      'Add a timer or visual cue and locate it away from noisy areas',
    ],
    indicators: [
      'Quiet space equipped within 12 months',
      'Space located away from noise with the listed features',
      'Space condition maintained on a regular schedule',
    ],
  },
  '3.3-D-10': {
    steps: [
      'Create a sensory map showing noise levels, lighting, quiet zones and potential triggers',
      'Make it available online and in print at reception',
    ],
    indicators: [
      'Sensory map created and published within 12 months',
      'Map available online and at reception',
      'Map updated after any layout change',
    ],
  },
  '3.3-D-11': {
    steps: [
      'Develop a scent and fragrance policy avoiding strong air fresheners and reducing scented cleaning products',
      'Communicate fragrance expectations to staff',
    ],
    indicators: [
      'Scent and fragrance policy in place within 6 months',
      'Scented products reduced in public areas',
      'Policy communicated to staff and reviewed annually',
    ],
  },
  '3.3-D-12': {
    steps: [
      'Gather the sensory details visitors need: noise levels, lighting, quiet spaces and potential triggers',
      'Publish them on your website and in pre-visit materials',
    ],
    indicators: [
      'Sensory information published within 3 months',
      'Information covers noise, lighting, quiet spaces and triggers',
      'Information reviewed for accuracy every 6 months',
    ],
  },
  '3.3-D-13': {
    steps: [
      'Identify where visitors get disoriented or lose their way',
      'Introduce colour-coded zones, visual landmarks or themed wayfinding to aid navigation for people with cognitive disability or unfamiliar visitors',
    ],
    indicators: [
      'Wayfinding aids reviewed within 6 months',
      'Colour-coded or landmark wayfinding introduced within 12 months',
      'Wayfinding reviewed after any layout change',
    ],
  },
  '3.3-D-14': {
    steps: [
      'Identify key locations that would benefit from tactile elements (entries, room signage, decision points)',
      'Incorporate TGSIs at key locations, raised lettering on room signage, and tactile maps or models at entry points per AS 1428.4.1',
    ],
    indicators: [
      'Tactile wayfinding reviewed within 6 months',
      'Tactile elements provided at key points within 12 months',
      'Tactile elements maintained and replaced when worn',
    ],
  },
  '3.3-D-15': {
    steps: [
      'Install visual emergency alerting (flashing strobes) throughout the venue, including accessible toilets, meeting rooms and all public areas',
      'Set flash rate between 1-3Hz per AS 1670.4 and the NCC',
    ],
    indicators: [
      'Visual emergency alerting coverage reviewed within 3 months',
      'Strobes installed across all public areas within 24 months',
      'Visual alerts tested during emergency drills',
    ],
  },

  // ============================================================
  // Module 3.4 - Equipment and resources
  // ============================================================
  '3.4-F-1': {
    steps: [
      'Introduce equipment and resources customers can use during their visit',
      'Start with high-impact items (portable hearing loops, magnifiers, wheelchairs, sensory kits)',
    ],
    indicators: [
      'Equipment provision reviewed within 3 months',
      'High-impact equipment available within 12 months',
      'Range reviewed against visitor needs on a regular schedule',
    ],
  },
  '3.4-F-2': {
    steps: [
      'Add available equipment information to your website, booking confirmations and social media',
      'Include what is available, how to request it and whether booking is required',
    ],
    indicators: [
      'Equipment information published within 3 months',
      'Information covers availability, the request process and booking',
      'Information reviewed for accuracy every 6 months',
    ],
  },
  '3.4-F-3': {
    steps: [
      'Create a simple on-arrival process: place items at reception or a clearly signed collection point',
      'Train front-line staff on what is available and require no justification from customers',
    ],
    indicators: [
      'On-arrival equipment process in place within 3 months',
      'Staff provide equipment without customers having to justify need',
      'Collection point clearly signed',
    ],
  },
  '3.4-F-4': {
    steps: [
      'Remove charges for accessibility equipment',
      'Factor equipment costs into general operating budgets',
    ],
    indicators: [
      'Charges for accessibility equipment removed within 3 months',
      'Equipment costs included in the operating budget',
      'No-charge policy communicated to staff',
    ],
  },
  '3.4-D-1': {
    steps: [
      'Build an equipment library (portable hearing loops, wheelchairs, magnifiers, communication boards, sensory kits, large-print materials)',
      'Prioritise based on your visitor profile and venue type',
    ],
    indicators: [
      'Equipment library established within 12 months',
      'Range prioritised to the visitor profile',
      'Inventory reviewed and expanded on a regular schedule',
    ],
  },
  '3.4-D-2': {
    steps: [
      'Establish a designated quiet space with dimmable lighting, comfortable seating, low-stimulation decor and clear signage',
      'Locate it away from noisy areas on an accessible path',
    ],
    indicators: [
      'Quiet space established within 12 months',
      'Space on an accessible path away from noise',
      'Space maintained on a regular schedule',
    ],
  },
  '3.4-D-3': {
    steps: [
      'Provide a range of manual wheelchairs (regular and bariatric), and consider motorised scooters for larger venues',
      'Store them near the entrance and train staff on safe operation and basic adjustments',
    ],
    indicators: [
      'Wheelchairs and mobility aids provided within 12 months',
      'Range includes bariatric sizes, stored near the entrance',
      'Staff trained on safe operation',
    ],
  },
  '3.4-D-4': {
    steps: [
      'Assemble sensory support kits (noise-cancelling headphones, fidget tools, sunglasses, weighted lap pads, visual timers)',
      'Make them available at reception for free loan',
    ],
    indicators: [
      'Sensory support kits available within 6 months',
      'Kits offered free at reception',
      'Kit contents maintained and restocked regularly',
    ],
  },
  '3.4-D-5': {
    steps: [
      'Provide communication aids (picture communication boards, pen and paper, a tablet with a communication app, clear face masks for lipreading)',
      'Train staff to use them confidently',
    ],
    indicators: [
      'Communication aids provided within 6 months',
      'Staff trained and confident using them',
      'Aids maintained and kept accessible',
    ],
  },
  '3.4-D-6': {
    steps: [
      'Establish a maintenance schedule (cleaning, battery checks, functionality testing, prompt repair or replacement)',
      'Log checks and assign responsibility',
    ],
    indicators: [
      'Equipment maintenance schedule in place within 3 months',
      'Checks logged with clear responsibility',
      'Faulty equipment repaired or replaced promptly',
    ],
  },
  '3.4-D-7': {
    steps: [
      'Review your equipment range against different body sizes and needs',
      'Expand it to include bariatric wheelchairs (min 600mm seat width), extra-large sensory headphones and adjustable-height mobility aids',
    ],
    indicators: [
      'Equipment size range reviewed within 3 months',
      'Options for a range of body sizes provided within 12 months',
      'Range reviewed against demand on a regular schedule',
    ],
  },
  '3.4-D-8': {
    steps: [
      'Train customer-facing staff on the full inventory, storage, operation of each item, and how to offer it proactively and respectfully',
      'Include this in onboarding',
    ],
    indicators: [
      'Staff trained on the equipment inventory within 3 months',
      'Equipment training included in onboarding',
      'Refresher completed each year',
    ],
  },
  '3.4-D-9': {
    steps: [
      'Conduct a needs assessment via customer feedback, staff observations and benchmarking against similar venues',
      'Identify which additional equipment would have the greatest impact',
    ],
    indicators: [
      'Equipment needs assessment completed within 6 months',
      'Priority additions identified and planned',
      'Needs reassessed annually',
    ],
  },
  '3.4-D-10': {
    steps: [
      'Install accessible pool entry per AS 1428.1:2021 (pool hoist min 136kg, zero-depth/beach entry, or submersible ramp)',
      'Provide at least one independent entry option',
    ],
    indicators: [
      'Pool entry accessibility reviewed within 6 months',
      'At least one compliant independent entry option provided within 24 months',
      'Entry equipment maintained and tested regularly',
    ],
  },
  '3.4-D-11': {
    steps: [
      'Provide at least one aquatic wheelchair rated for pool use, including a bariatric option for larger venues',
      'Store it near the pool entrance with clear instructions and train lifeguards on safe use',
    ],
    indicators: [
      'Aquatic wheelchair provided within 12 months',
      'Stored near the pool with instructions',
      'Lifeguards trained on safe use',
    ],
  },
  '3.4-D-12': {
    steps: [
      'Provide accessible change rooms and showers near the pool per AS 1428.1:2021 (roll-in shower with fold-down seat, grab rails, non-slip flooring, min 1540mm turning circle)',
      'Ensure a direct accessible route to the pool',
    ],
    indicators: [
      'Poolside change and shower accessibility reviewed within 6 months',
      'Compliant accessible change and shower provided within 24 months',
      'Direct accessible route to the pool confirmed',
    ],
  },
  '3.4-D-13': {
    steps: [
      'Install visual (flashing lights) and audible (alarm/siren) warnings that activate before wave machines or water features start',
      'Give at least 30 seconds warning and add signage explaining the system',
    ],
    indicators: [
      'Water-feature warning system reviewed within 6 months',
      'Visual and audible warnings with 30 seconds notice provided within 12 months',
      'Warning system tested on a regular schedule',
    ],
  },
  '3.4-D-14': {
    steps: [
      'Provide free WiFi throughout public areas to support assistive technology apps (navigation, communication, hearing, translation)',
      'Ensure coverage includes outdoor areas and all levels',
    ],
    indicators: [
      'WiFi coverage reviewed within 3 months',
      'Free WiFi available across public areas within 12 months',
      'Coverage confirmed across levels and outdoor areas',
    ],
  },
  '3.4-D-15': {
    steps: [
      'Install accessible charging points (USB and power outlets) at reception, waiting areas and rest seating',
      'Position them at 600-1100mm height so wheelchair users can reach them independently',
    ],
    indicators: [
      'Charging point provision reviewed within 3 months',
      'Accessible charging points installed at key locations within 12 months',
      'Charging points kept working on a regular schedule',
    ],
  },

  // ============================================================
  // Module 3.5 - Signage and wayfinding
  // ============================================================
  '3.5-1-1': {
    steps: [
      'Audit all signage for contrast (min 3:1 for large text per AS 1428.1), font size (min 15mm character height at 1m) and sans-serif legibility',
      'Upgrade signs that fall short',
    ],
    indicators: [
      'Signage audit completed within 3 months',
      'Substandard signs upgraded to the AS 1428.1 legibility standard within 12 months',
      'Legibility standard applied to new signage from now on',
    ],
  },
  '3.5-1-2': {
    steps: [
      'Standardise sign mounting heights to 1200-1600mm per AS 1428.1',
      'Place signs consistently on the same side of doorways throughout the venue',
    ],
    indicators: [
      'Sign placement reviewed within 3 months',
      'Signs standardised to consistent heights and positions within 12 months',
      'Placement standard applied when signs are added or moved',
    ],
  },
  '3.5-1-3': {
    steps: [
      'Identify all accessible facilities that need directional signage (toilets, lifts, parking, entrances)',
      'Install directional signage to each using the ISA, tactile lettering and Braille per AS 1428.1',
    ],
    indicators: [
      'Accessible-facility signage reviewed within 3 months',
      'Directional signage to all accessible facilities installed within 12 months',
      'Signage reviewed after any layout change',
    ],
  },
  '3.5-1-4': {
    steps: [
      'Walk the venue as a first-time visitor and note every decision point where signage is missing, confusing or not visible',
      'Add directional signage at each',
    ],
    indicators: [
      'First-time-visitor walk-through completed within 3 months',
      'Directional signage added at each gap within 12 months',
      'Re-walked after any layout change',
    ],
  },
  '3.5-D-1': {
    steps: [
      'Add tactile lettering and Grade 1 Braille to key signs (room identification, toilets, exits, level indicators) per AS 1428.1:2021 Cl 18 and AS 1428.4.2',
      'Mount at 1250-1500mm on the latch side of doors',
    ],
    indicators: [
      'Key signs without tactile/Braille identified within 3 months',
      'Tactile and Braille signage installed on key signs within 12 months',
      'Tactile signage maintained and replaced when worn',
    ],
  },
  '3.5-D-2': {
    steps: [
      'Upgrade signage to min 70% luminance contrast between text and background per AS 1428.1:2021 Cl 18',
      'Use sans-serif characters and avoid patterned backgrounds',
    ],
    indicators: [
      'Signage contrast reviewed within 3 months',
      'Compliant contrast achieved on key signs within 12 months',
      'Contrast standard applied to new signage',
    ],
  },
  '3.5-D-3': {
    steps: [
      'Install directional signage at every navigation decision point (corridor intersections, floor landings, major room entries)',
      'Include arrows, distances and key facility locations (toilets, exits, lifts) per AS 1428.1:2021',
    ],
    indicators: [
      'Decision points mapped within 3 months',
      'Directional signage present at every decision point within 12 months',
      'Signage reviewed after any layout change',
    ],
  },
  '3.5-D-4': {
    steps: [
      'Create an accessible map or directory showing accessible toilets, lifts, exits, quiet spaces, hearing loops and accessible parking',
      'Provide it in large print, digital and tactile formats at the entrance',
    ],
    indicators: [
      'Accessible map or directory produced within 12 months',
      'Available in large print, digital and tactile formats',
      'Map updated within 2 weeks of any layout change',
    ],
  },
  '3.5-D-5': {
    steps: [
      'Install clear, high-contrast signage on the approach and at the entrance, including the venue name, entrance location and accessibility symbols',
      'Ensure signs are visible from the street and car park',
    ],
    indicators: [
      'Approach and entrance signage reviewed within 3 months',
      'Clear signage visible from the street and car park within 12 months',
      'Signage condition checked on a regular schedule',
    ],
  },
  '3.5-D-6': {
    steps: [
      'Install illuminated emergency exit signs per AS 2293 at all exits and along escape routes, with the running-person pictogram and battery backup',
      'Ensure they are visible from the accessible path of travel',
    ],
    indicators: [
      'Emergency exit signage reviewed within 3 months',
      'Compliant illuminated exit signs installed within 12 months',
      'Exit signs and battery backup tested during emergency checks',
    ],
  },
  '3.5-D-7': {
    steps: [
      'Add universally recognised pictograms to key signs (toilets, exits, lifts, reception)',
      'Provide Easy Read versions of complex information (venue rules, instructions) for people with intellectual disability',
    ],
    indicators: [
      'Pictogram and Easy Read gaps identified within 3 months',
      'Pictograms added to key signs within 12 months',
      'At least one Easy Read version of key information provided',
    ],
  },

  // ============================================================
  // Module 3.6 - Menus and printed materials
  // ============================================================
  '3.6-1-1': {
    steps: [
      'Identify key customer-facing documents (menus, brochures, forms, pricelists)',
      'Produce large print versions (min 18pt, sans-serif font)',
    ],
    indicators: [
      'Key documents identified within 1 month',
      'Large print versions available within 6 months',
      'Large print updated whenever the standard version changes',
    ],
  },
  '3.6-1-2': {
    steps: [
      'Train staff to read menus, forms and information aloud on request, using clear speech, an appropriate pace and privacy awareness',
      'Give staff a discreet way to offer this so customers do not have to ask',
    ],
    indicators: [
      'Staff trained to offer reading assistance within 3 months',
      'Reading assistance offered proactively, confirmed via feedback',
      'Reading assistance included in induction for new staff',
    ],
  },
  '3.6-1-3': {
    steps: [
      'Create digital versions of key materials accessible via QR codes or short URLs',
      'Ensure the digital content meets WCAG 2.2 Level AA',
    ],
    indicators: [
      'Digital versions of key materials available within 6 months',
      'Digital content meets WCAG 2.2 AA',
      'Digital versions kept in step with the printed ones',
    ],
  },
  '3.6-1-4': {
    steps: [
      'Develop Easy Read or Plain English versions of key documents using simple sentences, common words and supporting images',
      'Follow recognised Easy Read guidelines',
    ],
    indicators: [
      'Easy Read or Plain English versions of key documents produced within 12 months',
      'Versions follow recognised Easy Read guidelines',
      'Versions updated whenever the standard version changes',
    ],
  },
  '3.6-1-5': {
    steps: [
      'Ensure dietary information and allergen labelling is clearly visible on all menus and food displays',
      'Use consistent symbols, plain language and accessible formats',
    ],
    indicators: [
      'Allergen and dietary labelling reviewed within 3 months',
      'Clear, consistent labelling on all menus within 6 months',
      'Labelling updated whenever menu items change',
    ],
  },
  '3.6-D-1': {
    steps: [
      'Test QR code destinations for WCAG 2.2 AA (heading structure, alt text, colour contrast, keyboard navigation, screen reader compatibility)',
      'Fix issues found, testing with VoiceOver and TalkBack',
    ],
    indicators: [
      'QR destinations tested for WCAG 2.2 AA within 3 months',
      'Critical issues fixed within 6 months',
      'Accessibility check included when QR content changes',
    ],
  },
  '3.6-D-2': {
    steps: [
      'Resize QR codes to at least 30x30mm and position them 900-1200mm high, on a contrasting background away from glare',
      'Add a short text description of where the code leads',
    ],
    indicators: [
      'QR code size and placement reviewed within 3 months',
      'Compliant QR codes in place within 6 months',
      'New QR codes follow the size and placement standard',
    ],
  },
  '3.6-D-3': {
    steps: [
      'Engage a certified Braille transcription service to produce Braille versions of key materials (menus, safety information, visitor guides)',
      'Store copies at reception and advertise their availability in pre-visit information',
    ],
    indicators: [
      'Braille versions of key materials produced within 12 months',
      'Copies available at reception and advertised',
      'Braille updated whenever the standard version changes',
    ],
  },
  '3.6-D-4': {
    steps: [
      'Develop audio descriptions or audio guides for key content, exhibitions or experiences with professional narration and wayfinding cues',
      'Make them available via an app, QR code or loanable audio player',
    ],
    indicators: [
      'Audio guide need scoped within 6 months',
      'Audio descriptions or guides available within 24 months',
      'Audio content kept in step with the experience',
    ],
  },
  '3.6-D-5': {
    steps: [
      'Identify the most common languages spoken by your visitors',
      'Produce translations of key materials, and consider Auslan video for Deaf visitors, prioritising safety and wayfinding information',
    ],
    indicators: [
      'Top community languages identified within 3 months',
      'Key materials translated into priority languages within 12 months',
      'Safety and wayfinding available in the top community languages',
    ],
  },
  '3.6-D-6': {
    steps: [
      'Commission tactile maps or models for key areas, with raised pathways, textured zones and Braille labels',
      'Position them at the main entrance at a height accessible from a seated position',
    ],
    indicators: [
      'Tactile map or model provided within 24 months',
      'Positioned at the entrance at accessible height',
      'Map updated after any layout change',
    ],
  },
  '3.6-D-7': {
    steps: [
      'Identify all video and multimedia content lacking accurate captions',
      'Add accurate captions (not auto-generated) including dialogue, speaker identification and relevant sound effects per WCAG 2.2 SC 1.2.2',
    ],
    indicators: [
      'Uncaptioned video identified within 3 months',
      'All new video captioned before publishing',
      'Top existing videos captioned within 12 months',
    ],
  },
  '3.6-D-8': {
    steps: [
      'Add audio description to videos with important visual information not conveyed by the soundtrack',
      'Describe key visual elements during natural pauses per WCAG 2.2 SC 1.2.5',
    ],
    indicators: [
      'Videos needing audio description identified within 3 months',
      'Audio description added to priority videos within 12 months',
      'Audio description considered for all new video',
    ],
  },
  '3.6-D-9': {
    steps: [
      'Provide materials that are easy to handle: sturdy card or rigid clipboards, large-print versions (min 16pt), pages turnable with one hand',
      'Avoid laminated surfaces that cause glare',
    ],
    indicators: [
      'Handling of printed materials reviewed within 3 months',
      'Easy-to-handle, glare-free materials provided within 12 months',
      'Handling considered when materials are reprinted',
    ],
  },
  '3.6-D-10': {
    steps: [
      'Establish a process to update alternative format materials (Braille, large print, audio, Easy Read) whenever the standard version changes',
      'Assign responsibility and set review dates',
    ],
    indicators: [
      'Update process for alternative formats in place within 3 months',
      'Responsibility assigned with review dates set',
      'Alternative formats confirmed current at each review',
    ],
  },
  '3.6-D-11': {
    steps: [
      'Display prices in large, high-contrast text (min 18pt) at a readable height (1000-1600mm)',
      'Include prices on menus, product labels and digital displays, avoiding small print or awkward placement',
    ],
    indicators: [
      'Pricing display reviewed within 3 months',
      'Large, high-contrast pricing at readable height within 12 months',
      'Pricing legibility maintained when displays change',
    ],
  },

  // ============================================================
  // Module 3.7 - Information when you're here
  // ============================================================
  '3.7-PC-1': {
    steps: [
      'Produce alternative formats of key information: large print (min 18pt, sans-serif), Easy Read and audio',
      'Make them available at reception and key information points without a special request',
    ],
    indicators: [
      'Alternative formats produced within 12 months',
      'Available at reception and key points without special request',
      'Formats updated whenever the standard version changes',
    ],
  },
  '3.7-PC-2': {
    steps: [
      'Provide digital access to venue information via QR codes, a mobile-friendly website or a dedicated app',
      'Ensure digital content is WCAG 2.2 AA and works with screen readers and assistive technology',
    ],
    indicators: [
      'Digital access to venue information available within 6 months',
      'Digital content meets WCAG 2.2 AA',
      'Digital content re-checked when it changes',
    ],
  },
  '3.7-PC-5': {
    steps: [
      'Install tactile signage (raised lettering and Braille) per AS 1428.4.2 and provide tactile maps at entry points',
      'Mount all tactile signs at 1250-1500mm height, and consider tactile models of key features',
    ],
    indicators: [
      'Tactile information reviewed within 6 months',
      'Tactile signage and maps installed within 24 months',
      'Tactile elements maintained and replaced when worn',
    ],
  },
  '3.7-PC-6': {
    steps: [
      'Install the international hearing loop symbol (blue ear with T) at every location where hearing support is available, at eye level',
      'Add signage at reception indicating what hearing support is available venue-wide',
    ],
    indicators: [
      'Hearing support signage reviewed within 3 months',
      'Symbols displayed at every support location within 6 months',
      'Signage updated when support locations change',
    ],
  },
  '3.7-PC-7': {
    steps: [
      'Engage a CART (Communication Access Realtime Translation) provider for live presentations, tours and events',
      'Position the caption display clearly visible from accessible seating and allow captioning to be booked when events are scheduled',
    ],
    indicators: [
      'CART provider relationship established within 6 months',
      'Captioning offered for scheduled events within 12 months',
      'Caption display visibility confirmed from accessible seating',
    ],
  },
  '3.7-PC-8': {
    steps: [
      'Develop audio guides, verbal descriptions or announcements covering key content for visitors who are blind, have low vision or have print disability',
      'Deliver via app, loanable devices or staff-led descriptions',
    ],
    indicators: [
      'Audio information scoped within 6 months',
      'Audio guides or descriptions available within 24 months',
      'Audio content kept in step with the venue',
    ],
  },
  '3.7-PC-9': {
    steps: [
      'Provide communication supports: picture communication boards (with venue-specific vocabulary), pen and paper, and a tablet with a communication app',
      'Make them visible at reception and key service points',
    ],
    indicators: [
      'Communication supports provided within 6 months',
      'Supports visible at reception and key service points',
      'Supports maintained and kept accessible',
    ],
  },
  '3.7-PC-10': {
    steps: [
      'Develop a process to communicate changes (closures, event modifications, disruptions) in multiple accessible formats: visual displays, website, social media, email and verbal announcements',
      'Ensure emergency changes include visual alerts',
    ],
    indicators: [
      'Accessible change-communication process in place within 6 months',
      'Changes communicated in multiple accessible formats',
      'Emergency changes always include a visual alert',
    ],
  },
  '3.7-DD-1a': {
    steps: [
      'Develop large print (min 18pt sans-serif), Easy Read, Braille and audio versions of key visitor information',
      'Prioritise safety information, venue maps and exhibit guides',
    ],
    indicators: [
      'Priority information identified within 3 months',
      'Alternative formats of priority information produced within 12 months',
      'Formats updated whenever the standard version changes',
    ],
  },
  '3.7-DD-1b': {
    steps: [
      'Train staff to proactively offer alternative formats rather than waiting for requests, including it in greeting scripts and induction',
      'Display signs at service points listing available formats',
    ],
    indicators: [
      'Staff trained to proactively offer formats within 3 months',
      'Available formats signed at service points',
      'Proactive offering included in induction for new staff',
    ],
  },
  '3.7-DD-2a': {
    steps: [
      'Audit interactive exhibits and touchscreens for screen reader access and touchscreen-only barriers',
      'Provide physical alternatives (buttons, switches), position at 900-1100mm and include audio and visual output',
    ],
    indicators: [
      'Interactive exhibits audited for accessibility within 6 months',
      'Physical alternatives and audio/visual output provided within 24 months',
      'New interactive displays specified as accessible',
    ],
  },
  '3.7-DD-5a': {
    steps: [
      'Install TGSIs at stairs, ramps and escalators per AS 1428.4.1',
      'Add tactile and Braille room signs per AS 1428.4.2, and consider tactile maps and models at main entry points',
    ],
    indicators: [
      'Tactile elements reviewed within 6 months',
      'TGSIs and tactile signage installed within 24 months',
      'Tactile elements maintained and replaced when worn',
    ],
  },
  '3.7-DD-6a': {
    steps: [
      'Install hearing loops at service counters, presentation spaces, tour gathering points and meeting rooms per AS 60118.4',
      'Display the international symbol at each',
    ],
    indicators: [
      'Hearing loops installed at key points within 12 months',
      'Field strength and frequency response confirmed against AS 60118.4',
      'Loops tested monthly and confirmed operational',
    ],
  },
  '3.7-DD-6b': {
    steps: [
      'Establish a monthly testing schedule for all hearing loops using a loop listener or field-strength meter, checking for interference',
      'Keep a maintenance log and engage a specialist for annual calibration',
    ],
    indicators: [
      'Monthly loop testing schedule in place within 3 months',
      'Maintenance log kept and up to date',
      'Annual specialist calibration completed',
    ],
  },
  '3.7-DD-7a': {
    steps: [
      'Research and establish a relationship with an accredited CART or captioning provider',
      'Agree response times, pricing and technical requirements so captioning can be arranged promptly',
    ],
    indicators: [
      'CART or captioning provider engaged within 6 months',
      'Response times and requirements agreed',
      'Provider relationship reviewed annually',
    ],
  },
  '3.7-DD-7b': {
    steps: [
      'Add a question about captioning or communication needs to event registration, tour booking and group enquiry forms',
      'Allow adequate lead time (min 2 weeks) to arrange services',
    ],
    indicators: [
      'Captioning/communication needs question added to booking forms within 3 months',
      'Minimum 2 weeks lead time built into the process',
      'Requests actioned and tracked',
    ],
  },
  '3.7-DD-8a': {
    steps: [
      'Develop audio content covering permanent exhibitions, key displays, wayfinding and safety information',
      'Include vivid descriptions of visual elements and spatial orientation cues, delivered via app, QR codes or loanable devices',
    ],
    indicators: [
      'Audio content scope agreed within 6 months',
      'Audio guides covering key content available within 24 months',
      'Audio content updated when displays change',
    ],
  },
  '3.7-DD-9a': {
    steps: [
      'Develop communication boards with venue-specific symbols covering common requests (toilet, help, pain, drink, directions), emotions and key activities',
      'Use standardised symbol sets (e.g. Boardmaker or SymbolStix) and laminate for durability',
    ],
    indicators: [
      'Communication boards developed within 6 months',
      'Boards cover common requests using standardised symbols',
      'Boards replaced when worn or when needs change',
    ],
  },
  '3.7-DD-9b': {
    steps: [
      'Install communication boards at key service points with simple instructions for use',
      'Train staff to use them and to support customers who communicate differently',
    ],
    indicators: [
      'Communication boards installed at key service points within 6 months',
      'Staff trained to use the boards within 3 months',
      'Board use included in induction for new staff',
    ],
  },
  '3.7-DD-10a': {
    steps: [
      'Produce emergency and safety information in large print, Easy Read, Braille and audio formats, covering evacuation, assembly points and how to request assistance',
      'Display it at key locations and include it in room information packs',
    ],
    indicators: [
      'Accessible emergency information produced within 12 months',
      'Displayed at key locations and in room packs',
      'Updated whenever procedures change',
    ],
  },
  '3.7-DD-11a': {
    steps: [
      'Ensure real-time displays (screens, timetables, boards) have min 20mm character height, high contrast and no reliance on colour alone',
      'Provide an audible alternative and position at a readable height and angle for seated users',
    ],
    indicators: [
      'Real-time displays reviewed within 3 months',
      'Accessible displays with an audible alternative provided within 12 months',
      'New displays specified to the accessible standard',
    ],
  },

  // ============================================================
  // Module 3.8 - Participating in experiences and activities
  // ============================================================
  '3.8-1-1': {
    steps: [
      'Document all experience and activity types offered at your venue',
      'Determine which accessibility requirements apply to each',
    ],
    indicators: [
      'All experience and activity types documented within 3 months',
      'Accessibility requirements mapped to each type',
      'Register reviewed when offerings change',
    ],
  },
  '3.8-1-2': {
    steps: [
      'Review each activity or experience for how it can be modified (alternative formats, adjusted pace, adaptive equipment, companion support)',
      'Build the modifications into how each activity is delivered',
    ],
    indicators: [
      'Modification options identified for each activity within 6 months',
      'Modifications available on request within 12 months',
      'Options reviewed with community feedback',
    ],
  },
  '3.8-1-3': {
    steps: [
      'Review activities for where participants are forced to keep pace',
      'Redesign scheduling to allow self-paced participation, including options to pause, repeat segments or take breaks without disadvantage',
    ],
    indicators: [
      'Self-paced options introduced within 12 months',
      'Participants can pause or repeat without disadvantage',
      'Approach reviewed via participant feedback',
    ],
  },
  '3.8-D-1': {
    steps: [
      'Introduce a pause or break policy so customers can step away and return without penalty or restarting',
      'Communicate this option clearly at the start of experiences',
    ],
    indicators: [
      'Pause/break policy in place within 6 months',
      'Option communicated at the start of experiences',
      'Staff apply it consistently, confirmed via feedback',
    ],
  },
  '3.8-D-2': {
    steps: [
      'Publish specific information about walking distances (in metres), terrain, gradient, physical demands and rest points for all experiences',
      'Include it on the website, booking page and at the start of each activity',
    ],
    indicators: [
      'Physical-demand information published within 6 months',
      'Information covers distance, terrain, gradient and rest points',
      'Information reviewed for accuracy every 6 months',
    ],
  },
  '3.8-D-3': {
    steps: [
      'Provide designated wheelchair spaces per AS 1428.1:2021 and the Premises Standards, dispersed across price categories on an accessible path',
      'Ensure each is at least 900mm x 1300mm on a level surface',
    ],
    indicators: [
      'Wheelchair spaces reviewed within 6 months',
      'Compliant, dispersed wheelchair spaces provided within 24 months',
      'Spaces confirmed on an accessible path',
    ],
  },
  '3.8-D-4': {
    steps: [
      'Provide ambulant accessible (Easy Access) seats with wider dimensions, armrests, extra legroom and step-free aisle access',
      'Locate them at end-of-row positions near accessible paths',
    ],
    indicators: [
      'Easy Access seating reviewed within 6 months',
      'Easy Access seats provided near accessible paths within 24 months',
      'Seating confirmed against accessibility requirements',
    ],
  },
  '3.8-D-5': {
    steps: [
      'Install companion seats immediately adjacent to every wheelchair space, at the same level',
      'Provide at least one companion seat per wheelchair space',
    ],
    indicators: [
      'Companion seating reviewed within 3 months',
      'A companion seat provided beside every wheelchair space within 12 months',
      'Companion seating maintained when seating is reconfigured',
    ],
  },
  '3.8-D-6': {
    steps: [
      'Reposition wheelchair spaces or install raised platforms so wheelchair users keep clear sightlines when patrons stand',
      'Consider elevated or front-of-section placement where standing is likely',
    ],
    indicators: [
      'Wheelchair sightlines reviewed within 6 months',
      'Clear sightlines maintained when patrons stand, within 24 months',
      'Sightlines confirmed after any seating reconfiguration',
    ],
  },
  '3.8-D-7': {
    steps: [
      'Make accessible seating available through all standard booking channels from the moment tickets go on sale',
      'Remove any separate process, callback or proof-of-disability requirement',
    ],
    indicators: [
      'Accessible seating booking reviewed within 3 months',
      'Accessible seating bookable through all channels at on-sale within 6 months',
      'No proof-of-disability barrier remains',
    ],
  },
  '3.8-D-8': {
    steps: [
      'Identify spectator areas (including premium, VIP and hospitality) that lack step-free access',
      'Provide step-free access (ramps, lifts or level routes) to all spectator areas',
    ],
    indicators: [
      'Step-free access to all spectator areas reviewed within 6 months',
      'Step-free access to premium and standard areas alike within 24 months',
      'Interim access arrangements provided while works are planned',
    ],
  },
  '3.8-D-9': {
    steps: [
      'Ensure meeting rooms have level access, min 1540mm turning circle and 900mm clear aisles with an accessible presentation area',
      'Include hearing augmentation and adjustable lighting',
    ],
    indicators: [
      'Meeting room accessibility reviewed within 6 months',
      'Rooms provide level access, turning space and accessible layout within 24 months',
      'Accessibility confirmed after any reconfiguration',
    ],
  },
  '3.8-D-10': {
    steps: [
      'Install hearing loops or infrared/FM assistive listening in all meeting rooms per AS 1428.5 and AS 60118.4',
      'Display the international hearing loop symbol and test systems monthly',
    ],
    indicators: [
      'Meeting room hearing augmentation installed within 12 months',
      'Systems confirmed against AS 60118.4 and signed',
      'Systems tested monthly and confirmed operational',
    ],
  },
  '3.8-D-11': {
    steps: [
      'Establish capability for Auslan interpreting and live captioning in meeting spaces',
      'Provide interpreter lighting, clear sightlines from accessible seating and a screen for captions',
    ],
    indicators: [
      'Auslan and captioning capability established within 12 months',
      'Interpreter lighting and caption screen provided',
      'Requests arranged with adequate lead time',
    ],
  },
  '3.8-D-12': {
    steps: [
      'Provide tables at 750-830mm height with min 700mm knee clearance height and 500mm depth per AS 1428.1:2021',
      'Ensure some tables in each room let wheelchair users sit alongside other participants',
    ],
    indicators: [
      'Table accessibility reviewed within 3 months',
      'Accessible-height tables available in each room within 12 months',
      'Accessible tables kept in each room layout',
    ],
  },
  '3.8-D-13': {
    steps: [
      'Install rest seating with backrests and armrests at regular intervals (every 60m maximum) along activity routes',
      'Include shade outdoors and ensure seats are on firm level ground accessible from the path',
    ],
    indicators: [
      'Rest-point gaps identified within 3 months',
      'Rest seating installed along activity routes within 12 months',
      'Seating condition checked on a regular schedule',
    ],
  },
  '3.8-D-14': {
    steps: [
      'Provide accessible transport (wheelchair-accessible vehicle, buggy or ramped cart) between activity locations for visitors who cannot walk the distance',
      'Communicate availability in advance and on arrival',
    ],
    indicators: [
      'Accessible transport need reviewed within 6 months',
      'Accessible transport available between locations within 24 months',
      'Availability communicated in advance and on site',
    ],
  },
  '3.8-D-15': {
    steps: [
      'Map and sign alternative accessible routes that avoid stairs, steep gradients (over 1:14) and rough terrain',
      'Communicate alternatives in advance and with on-site signage, leading to the same destinations',
    ],
    indicators: [
      'Alternative routes mapped within 6 months',
      'Accessible alternative routes signed within 12 months',
      'Alternatives reviewed after any layout change',
    ],
  },
  '3.8-D-16': {
    steps: [
      'Publish detailed route information for all experiences: distance in metres, surface type, gradient, rest points, shade and accessibility rating',
      'Include it on the website, at trailheads and in booking information',
    ],
    indicators: [
      'Route information published within 6 months',
      'Information covers distance, surface, gradient and rest points',
      'Information reviewed for accuracy every 6 months',
    ],
  },
  '3.8-D-17': {
    steps: [
      'Source adaptive equipment appropriate to your activities (sports wheelchairs, tandem bikes, modified bats or racquets, seated options)',
      'Partner with disability sport organisations for guidance on selection',
    ],
    indicators: [
      'Adaptive equipment need scoped within 6 months',
      'Appropriate adaptive equipment provided within 24 months',
      'Equipment maintained and range reviewed regularly',
    ],
  },
  '3.8-D-18': {
    steps: [
      'Develop inclusive programs (sensory-friendly sessions, adaptive classes, quiet hours, guided experiences) designed for people with disability',
      'Co-design them with community members and disability organisations',
    ],
    indicators: [
      'Inclusive programs co-designed within 12 months',
      'At least one inclusive program offered regularly',
      'Programs reviewed via participant feedback',
    ],
  },
  '3.8-D-19': {
    steps: [
      'Provide accessible change rooms with min 1540mm turning circle, an accessible shower with fold-down seat and grab rails, non-slip flooring and coat hooks at two heights per AS 1428.1:2021',
      'Locate them near the activity area',
    ],
    indicators: [
      'Activity change-room accessibility reviewed within 6 months',
      'Compliant accessible change and shower provided within 24 months',
      'Facility maintained on a regular schedule',
    ],
  },
  '3.8-D-19a': {
    steps: [
      'Review gym and fitness equipment for accessibility (adjustable machines, pathways, benches, heights)',
      'Provide accessible gym equipment: adjustable machines usable from a wheelchair, min 900mm pathways, accessible weight benches, and at least one of each major type at accessible height',
    ],
    indicators: [
      'Gym equipment accessibility reviewed within 6 months',
      'Accessible equipment and pathways provided within 24 months',
      'At least one of each major equipment type accessible',
    ],
  },
  '3.8-D-20': {
    steps: [
      'Review treatment rooms for wheelchair access (turning circle, table height, clear floor space)',
      'Reconfigure to provide min 1540mm turning circle, height-adjustable tables (or an accessible transfer option) and clear floor space beside the treatment area',
    ],
    indicators: [
      'Treatment space accessibility reviewed within 6 months',
      'Accessible treatment space provided within 24 months',
      'Accessible option available on request',
    ],
  },
  '3.8-D-21': {
    steps: [
      'Identify where treatments and sessions may need modifying for different physical needs',
      'Develop a modification framework so staff can adapt them (seated alternatives, adjusted intensity, flexible timing, individual consultation)',
    ],
    indicators: [
      'Treatment modification framework in place within 6 months',
      'Staff able to adapt treatments to individual needs',
      'Framework reviewed via client feedback',
    ],
  },
  '3.8-D-22': {
    steps: [
      'Engage professional audio describers for performances with significant visual content',
      'Provide descriptions via a dedicated headset channel, offer a pre-show touch tour where possible, and advertise described performances',
    ],
    indicators: [
      'Audio description capability established within 12 months',
      'Described performances scheduled and advertised',
      'Uptake reviewed and the offering adjusted',
    ],
  },
  '3.8-D-23': {
    steps: [
      'Provide live captioning or surtitles for spoken and sung performances, positioned visible from accessible seating',
      'Schedule regular captioned performances and advertise them',
    ],
    indicators: [
      'Captioning capability established within 12 months',
      'Regular captioned performances scheduled and advertised',
      'Caption visibility confirmed from accessible seating',
    ],
  },
  '3.8-D-24': {
    steps: [
      'Introduce relaxed or sensory-friendly sessions with reduced lighting and sound, no sudden effects and a relaxed attitude to movement and noise',
      'Sign quiet spaces nearby and publish pre-visit information about the session',
    ],
    indicators: [
      'Relaxed session trialled within 12 months',
      'Pre-visit information and signed quiet spaces provided',
      'Sessions reviewed via participant feedback and repeated where valued',
    ],
  },
  '3.8-D-25': {
    steps: [
      'Install a hearing loop (or infrared/FM system) in performance and event spaces per AS 1428.5 and AS 60118.4, covering the entire accessible seating area',
      'Display the international hearing loop symbol and test before every event',
    ],
    indicators: [
      'Performance-space hearing augmentation installed within 12 months',
      'Coverage confirmed across accessible seating',
      'System tested before every event',
    ],
  },
  '3.8-D-26': {
    steps: [
      'Allow customers to bring their own food and drinks when they have specific dietary, allergy or medical needs',
      'Communicate the policy on the website and at entry, and train staff to support it without challenge',
    ],
    indicators: [
      'Own-food policy in place within 3 months',
      'Policy communicated on the website and at entry',
      'Staff support it consistently, confirmed via feedback',
    ],
  },
  '3.8-D-27': {
    steps: [
      'Train kitchen and service staff to accommodate sensory food needs (foods not touching, specific textures, plain options, consistent presentation)',
      'Include these options on the menu or make them available on request',
    ],
    indicators: [
      'Staff trained on sensory food accommodations within 6 months',
      'Options available on the menu or on request',
      'Accommodations included in kitchen and service induction',
    ],
  },
  '3.8-D-28': {
    steps: [
      'Source divided or segmented plates',
      'Offer them proactively to customers who need foods kept separate',
    ],
    indicators: [
      'Divided plates available within 3 months',
      'Plates offered proactively where helpful',
      'Stock maintained and replaced as needed',
    ],
  },
  '3.8-D-29': {
    steps: [
      'Install accessible boardwalks, compacted gravel paths or sealed surfaces through key natural areas, with min 1200mm width, max 1:14 gradient, edge protection and rest points',
      'Prioritise routes to main attractions and viewpoints',
    ],
    indicators: [
      'Natural-area access reviewed within 6 months',
      'Accessible paths to key attractions provided within 24 months',
      'Paths maintained and re-checked after weather damage',
    ],
  },
  '3.8-D-30': {
    steps: [
      'Provide beach wheelchairs (floating and sand models) and install mobi-mats or accessible boardwalks to the water edge',
      'Advertise availability online and at the beach entry, and train lifeguards on beach wheelchair use',
    ],
    indicators: [
      'Beach access reviewed within 6 months',
      'Beach wheelchairs and matting provided within 24 months',
      'Lifeguards trained and equipment maintained',
    ],
  },
  '3.8-D-31': {
    steps: [
      'Upgrade playground equipment to include transfer platforms, accessible swings, ground-level sensory play and accessible rubber surfacing',
      'Provide a wheelchair-accessible path to all play zones',
    ],
    indicators: [
      'Playground accessibility reviewed within 6 months',
      'Inclusive equipment and accessible surfacing provided within 24 months',
      'Accessible path to all play zones confirmed',
    ],
  },
  '3.8-D-32': {
    steps: [
      'Develop accessible camping or glamping options with firm level surfaces, accessible platforms or hard-floor cabins, and accessible paths to common areas',
      'Include at least one fully accessible option near accessible amenities',
    ],
    indicators: [
      'Accessible camping option scoped within 6 months',
      'At least one fully accessible option provided within 24 months',
      'Option kept bookable and maintained',
    ],
  },
  '3.8-D-33': {
    steps: [
      'Review lookouts and viewing platforms for accessibility (railing height, level surface, path from the trail)',
      'Construct accessible lookouts with wheelchair-height railings (max 1000mm for seated views), level surfaces, rest seating and accessible paths from the main trail',
    ],
    indicators: [
      'Lookout accessibility reviewed within 6 months',
      'Accessible lookouts provided within 24 months',
      'Accessible path from the trail confirmed',
    ],
  },
  '3.8-D-34': {
    steps: [
      'Implement an accessibility trail rating system covering surface type, average and maximum gradient, width, rest-point spacing, hazards and wheelchair suitability',
      'Display it at trailheads, on the website and in trail brochures',
    ],
    indicators: [
      'Trail rating system implemented within 12 months',
      'Ratings displayed at trailheads and online',
      'Ratings reviewed after trail changes or weather damage',
    ],
  },

  // ============================================================
  // Module 3.9 - Accessible accommodation
  // ============================================================
  '3.9-1-1': {
    steps: [
      'Document all accommodation types offered',
      'Assess each for accessibility features, gaps and compliance with AS 1428.1 and the Premises Standards',
    ],
    indicators: [
      'All accommodation types documented within 3 months',
      'Accessibility gaps identified for each type within 6 months',
      'Register reviewed when room offerings change',
    ],
  },
  '3.9-1-2': {
    steps: [
      'Measure clear floor space in accessible rooms',
      'Provide a min 1540mm turning circle (or 1500mm x 2000mm rectangle) clear of furniture per AS 1428.1 Cl 7',
    ],
    indicators: [
      'Clear floor space measured within 3 months',
      'Compliant wheelchair circulation space provided within 24 months',
      'Furniture layout checked to maintain the clear space',
    ],
  },
  '3.9-1-3': {
    steps: [
      'Review in-room bathrooms in accessible rooms for roll-in shower, grab rails and shower seat',
      'Install a hobless (roll-in) shower, grab rails per AS 1428.1 Cl 15 and a fold-down shower seat',
    ],
    indicators: [
      'Accessible-room bathrooms reviewed within 6 months',
      'Compliant roll-in shower, rails and seat provided within 24 months',
      'Bathroom fittings inspected on a regular schedule',
    ],
  },
  '3.9-1-4': {
    steps: [
      'Check room doors and in-room paths for accessible handles, clear width and obstructions',
      'Fit lever handles, provide min 850mm clear width per AS 1428.1 and keep in-room paths free of obstructions',
    ],
    indicators: [
      'Room door and path accessibility reviewed within 3 months',
      'Lever handles and compliant clear width provided within 12 months',
      'In-room paths kept clear, confirmed at housekeeping',
    ],
  },
  '3.9-1-5': {
    steps: [
      'Review the distribution of accessible rooms across room categories',
      'Ensure accessible rooms are available across standard, premium and suite categories and price points',
    ],
    indicators: [
      'Accessible room distribution reviewed within 6 months',
      'Accessible rooms available across categories and price points within 24 months',
      'Distribution maintained as room stock changes',
    ],
  },
  '3.9-D-1': {
    steps: [
      'Check the bed height and under-bed clearance in accessible rooms',
      'Provide beds at 480-500mm to the top of the mattress with min 150mm clearance for portable hoists',
      'Offer bed blocks or adjustable bases on request',
    ],
    indicators: [
      'Bed height and clearance reviewed within 3 months',
      'Compliant bed height and hoist clearance provided within 12 months',
      'Adjustable options offered at booking',
    ],
  },
  '3.9-D-2': {
    steps: [
      'Equip accessible rooms with clear turning space (1540mm circle), accessible wardrobe (rail at 1200mm, shelf at 900-1100mm), bedside controls, visual and vibrating alerts and lever handles throughout',
      'Confirm each feature against AS 1428.1',
    ],
    indicators: [
      'Accessible bedroom features reviewed within 3 months',
      'Full set of accessible bedroom features provided within 24 months',
      'Features maintained and checked on a regular schedule',
    ],
  },
  '3.9-D-3': {
    steps: [
      'Provide vibrating pillow alerts for fire alarm, door knock and phone, a visual door-knock indicator, visual fire strobe, TTY or captioned phone and a portable hearing loop for the in-room TV',
      'Keep the alerting kit maintained and offer it at booking',
    ],
    indicators: [
      'Deaf and hard-of-hearing alerting aids reviewed within 3 months',
      'Alerting and communication kit available within 12 months',
      'Kit tested and maintained on a regular schedule',
    ],
  },
  '3.9-D-4': {
    steps: [
      'Install an emergency call cord or button beside the toilet, reachable from floor level (within 150mm), connected to a monitored system with visual and audible alerts per AS 1428.1:2021',
      'Train staff on how to respond when the call is activated',
    ],
    indicators: [
      'Bathroom emergency call reviewed within 3 months',
      'Compliant monitored call system installed within 12 months',
      'Alarm tested regularly and staff know how to respond',
    ],
  },
  '3.9-D-5': {
    steps: [
      'Check the bathroom mirror is usable from a seated position',
      'Install a mirror with the bottom edge at 900mm or lower (or a tilting mirror) extending to at least 1850mm for standing users',
    ],
    indicators: [
      'Mirror height reviewed within 3 months',
      'Compliant mirror installed within 12 months',
      'Mirror kept clean and undamaged',
    ],
  },
  '3.9-D-6': {
    steps: [
      'Review kitchenette counters and appliance controls for accessible height',
      'Lower countertops to max 830mm with 700mm knee clearance, position appliances on the accessible benchtop, and provide front-mounted controls operable with one hand',
    ],
    indicators: [
      'Kitchenette accessibility reviewed within 6 months',
      'Accessible counter heights and controls provided within 24 months',
      'Appliance accessibility maintained when equipment changes',
    ],
  },
  '3.9-D-7': {
    steps: [
      'Equip the accessible kitchenette with lever taps, D-pull handles, front-controlled cooktop, side-opening oven, pull-out lower shelves and benchtop appliances',
      'Position power points at 900-1100mm',
    ],
    indicators: [
      'Kitchenette features reviewed within 6 months',
      'Full set of accessible kitchenette features provided within 24 months',
      'Features maintained on a regular schedule',
    ],
  },
  '3.9-D-8': {
    steps: [
      'Provide accessible in-room amenities: grab rails, portable magnifying mirror, non-slip bath mat, accessible ironing height, lever-operated or motorised blinds and easy-open toiletry packaging',
      'Confirm amenities are in place and maintained in each accessible room',
    ],
    indicators: [
      'In-room amenities reviewed within 3 months',
      'Accessible amenities provided in each accessible room within 12 months',
      'Amenities checked and restocked at housekeeping',
    ],
  },
  '3.9-D-9': {
    steps: [
      'Check the key card reader height, door handle, operating force and one-handed operation',
      'Position the reader at 900-1100mm, fit a lever handle, keep operating force under 20N and consider contactless entry',
    ],
    indicators: [
      'Room entry system reviewed within 3 months',
      'Accessible reader height, handle and force provided within 12 months',
      'Entry system re-checked after any upgrade',
    ],
  },
  '3.9-D-10': {
    steps: [
      'Install tactile room numbers with raised lettering and Braille at 1250-1500mm on the latch side of accessible room doors per AS 1428.1:2021 Cl 18',
      'Ensure min 70% luminance contrast between text and background',
    ],
    indicators: [
      'Accessible room signage reviewed within 3 months',
      'Compliant tactile, high-contrast room numbers installed within 12 months',
      'Signage maintained and replaced when worn',
    ],
  },
  '3.9-D-11': {
    steps: [
      'Produce the room directory, safety card, TV guide and hotel information in large print (min 18pt), accessible digital format and Braille, with audio on request',
      'Include evacuation procedures in all formats',
    ],
    indicators: [
      'Guest information formats reviewed within 3 months',
      'Accessible guest information available within 12 months',
      'Formats updated whenever the standard version changes',
    ],
  },
  '3.9-D-12': {
    steps: [
      'Add accessibility feature fields to the booking process (online and phone) so guests can specify needs (shower chair, bed height, hearing kit, room location)',
      'Ensure requests are actioned before arrival',
    ],
    indicators: [
      'Booking accessibility fields added within 6 months',
      'Guest requests actioned before arrival',
      'Request handling reviewed via guest feedback',
    ],
  },
  '3.9-D-13': {
    steps: [
      'Implement an accessible room management policy: never sell accessible rooms to non-disabled guests when other rooms are available',
      'Maintain equipment in good condition and track accessible room bookings separately in the property management system',
    ],
    indicators: [
      'Accessible room management policy in place within 3 months',
      'Accessible rooms held for guests who need them, tracked in the PMS',
      'Policy reviewed via booking data and feedback',
    ],
  },
  '3.9-D-14': {
    steps: [
      'Audit shared facilities (laundry, pool, gym, breakfast area) for wheelchair access, accessible controls and clear paths',
      'Ensure at least one of each type is fully accessible, prioritising the most used',
    ],
    indicators: [
      'Shared facilities audited within 6 months',
      'At least one of each facility type made fully accessible within 24 months',
      'Facility access maintained on a regular schedule',
    ],
  },
  '3.9-D-15': {
    steps: [
      'Install non-slip flooring (min R10 wet) in the bathroom and shower',
      'Ensure lighting is min 300 lux at floor level with no dark spots per AS 1428.1:2021',
    ],
    indicators: [
      'Bathroom slip-resistance and lighting reviewed within 3 months',
      'Non-slip flooring and compliant lighting provided within 12 months',
      'Slip-resistance and lighting confirmed after any refurbishment',
    ],
  },
  '3.9-D-16': {
    steps: [
      'Review the location of accessible rooms relative to lifts and shared facilities',
      'Locate accessible rooms close to amenities with step-free paths of min 1000mm width, avoiding isolated locations',
    ],
    indicators: [
      'Accessible room locations reviewed within 6 months',
      'Accessible rooms near amenities with step-free paths within 24 months',
      'Location considered in any refurbishment or expansion',
    ],
  },
  '3.9-D-17': {
    steps: [
      'Provide an in-room bar fridge for medication, adequate power points for medical equipment and secure storage for supplies',
      'Offer these as standard in accessible rooms and on request in other rooms',
    ],
    indicators: [
      'Medication and equipment storage reviewed within 3 months',
      'Fridge, power points and secure storage provided in accessible rooms within 12 months',
      'Available on request in other rooms',
    ],
  },

  // ============================================================
  // Module 3.10 - Retail and shopping accessibility
  // ============================================================
  '3.10-1-1': {
    steps: [
      'Document the types of retail environment you operate',
      'Determine which accessibility requirements apply to your layout and customer interactions',
    ],
    indicators: [
      'Retail environment documented within 3 months',
      'Applicable accessibility requirements identified',
      'Review repeated when the store layout changes',
    ],
  },
  '3.10-PC-1': {
    steps: [
      'Train staff to offer assistance proactively when they notice someone browsing or struggling with products',
      'Install call buttons or service bells at accessible height in aisles, and ensure staff can reach, carry and describe products',
    ],
    indicators: [
      'Staff trained to offer product assistance within 3 months',
      'Accessible-height call points provided within 12 months',
      'Assistance offered proactively, confirmed via feedback',
    ],
  },
  '3.10-PC-2': {
    steps: [
      'Review product labels, price tags and shelf information for readability and height',
      'Improve to min 14pt text, high-contrast tags and shelf-edge labels at 900-1400mm, avoiding handwritten tags',
    ],
    indicators: [
      'Labelling and pricing reviewed within 3 months',
      'Readable, high-contrast labels at accessible height within 12 months',
      'Labelling standard applied to new stock',
    ],
  },
  '3.10-PC-3': {
    steps: [
      'Provide accessible shopping aids: shallow trolleys or baskets with accessible-height handles, motorised scooters for large stores, personal shopping assistance and trolleys with magnifier attachments',
      'Promote availability and keep the aids maintained',
    ],
    indicators: [
      'Shopping aids reviewed within 3 months',
      'Accessible shopping aids available within 12 months',
      'Aids promoted and maintained on a regular schedule',
    ],
  },
  '3.10-PC-4': {
    steps: [
      'Ensure at least one checkout has a lowered counter (max 830mm), clear floor space, an EFTPOS terminal at 900-1100mm and wheelchair width',
      'Maintain a staffed checkout as an alternative to self-service',
    ],
    indicators: [
      'Checkout accessibility reviewed within 3 months',
      'At least one fully accessible checkout provided within 12 months',
      'A staffed checkout kept available at all times',
    ],
  },
  '3.10-D-1': {
    steps: [
      'Provide at least one wheelchair-accessible fitting room with min 1400x1500mm clear space, outward-opening or curtain door (min 850mm), grab rails, fold-down seat, angled full-length mirror and coat hooks at two heights',
      'Confirm the fitting room against AS 1428.1',
    ],
    indicators: [
      'Fitting room accessibility reviewed within 6 months',
      'At least one compliant accessible fitting room provided within 24 months',
      'Fitting room kept clear and maintained',
    ],
  },
  '3.10-D-2': {
    steps: [
      'Install an emergency call button or pull cord in all accessible fitting rooms, reachable from floor level (within 150mm), connected to a monitored staff alert with visual and audible notification',
      'Train staff on how to respond when the call is activated',
    ],
    indicators: [
      'Fitting room emergency call reviewed within 3 months',
      'Compliant monitored call system installed within 12 months',
      'Alarm tested regularly and staff know how to respond',
    ],
  },
  '3.10-D-3': {
    steps: [
      'Train staff to offer fitting room assistance respectfully when requested (garments, size alternatives, bringing items), maintaining privacy',
      'Ensure a same-gender staff member can be made available',
    ],
    indicators: [
      'Staff trained on fitting room assistance within 3 months',
      'Assistance offered respectfully on request',
      'Assistance included in induction for new staff',
    ],
  },
  '3.10-D-4': {
    steps: [
      'Review self-checkout machines for accessibility (screen height/angle, audio, timing, reach, weight tolerance)',
      'Configure adjustable screen height, audio guidance, extended time, reachable scanner and bagging, and a weight tolerance that does not reject items on a wheelchair tray',
    ],
    indicators: [
      'Self-checkout accessibility reviewed within 6 months',
      'Accessible self-checkout configuration in place within 12 months',
      'Accessibility settings confirmed after any software update',
    ],
  },
  '3.10-D-5': {
    steps: [
      'Offer bag packing assistance at checkout for customers who need it, proactively without being asked',
      'Ensure it is available at all checkout types including self-checkout',
    ],
    indicators: [
      'Bag packing assistance reviewed within 3 months',
      'Assistance offered proactively at all checkout types',
      'Assistance included in checkout staff induction',
    ],
  },
  '3.10-D-6': {
    steps: [
      'Ensure the returns process is accessible via multiple channels (in-store, online, phone, post)',
      'Remove original-packaging requirements where they create a barrier, extend windows for access-related reasons and provide accessible forms',
    ],
    indicators: [
      'Returns process reviewed for accessibility within 6 months',
      'Accessible returns available through multiple channels within 12 months',
      'Access-related flexibility applied consistently',
    ],
  },
  '3.10-D-7': {
    steps: [
      'Introduce accessible alternatives to in-store shopping: click-and-collect with accessible pickup points, curbside collection and home delivery',
      'Ensure the online ordering platform meets WCAG 2.2 AA',
    ],
    indicators: [
      'Accessible shopping alternatives reviewed within 6 months',
      'Click-and-collect, curbside or delivery offered within 12 months',
      'Online ordering platform meets WCAG 2.2 AA',
    ],
  },
  '3.10-D-8': {
    steps: [
      'Enable staff to provide product information verbally, in large print or digitally (emailed or on a tablet)',
      'Ensure staff can describe products including colour, material, care instructions and ingredients when asked',
    ],
    indicators: [
      'Accessible product information reviewed within 3 months',
      'Staff able to provide information in accessible formats within 6 months',
      'Included in staff induction',
    ],
  },
  '3.10-D-9': {
    steps: [
      'Rearrange displays and stock to maintain min 1000mm clear aisle width (1200mm preferred) throughout the store per AS 1428.1:2021',
      'Avoid temporary displays, promotional bins or stock trolleys that reduce clearance, and audit after restocking',
    ],
    indicators: [
      'Aisle widths measured within 3 months',
      'Minimum 1000mm clear aisles maintained within 12 months',
      'Aisle clearance checked after every restock',
    ],
  },

  // ============================================================
  // Module 3.11 - Outdoor spaces and grounds
  // ============================================================
  '3.11-PC-1': {
    steps: [
      'Assess outdoor path surfaces, widths and gradients against DDA requirements, prioritising the main route from parking to key areas',
      'Resurface, widen or regrade paths that fall short',
    ],
    indicators: [
      'Outdoor paths assessed within 6 months',
      'Priority paths made firm, level and wide enough within 24 months',
      'Path condition inspected on a regular schedule',
    ],
  },
  '3.11-PC-2': {
    steps: [
      'Review outdoor seating for variety of heights and wheelchair-adjacent space',
      'Add varied seating with wheelchair-adjacent space in key outdoor areas',
    ],
    indicators: [
      'Outdoor seating reviewed within 3 months',
      'Varied accessible seating provided within 12 months',
      'Seating condition checked on a regular schedule',
    ],
  },
  '3.11-PC-3': {
    steps: [
      'Assess outdoor lighting along paths, seating, steps and transitions',
      'Install even, glare-free lighting, prioritising the route from parking to key destinations',
    ],
    indicators: [
      'Outdoor lighting assessed within 6 months',
      'Even, glare-free lighting on priority routes within 24 months',
      'Lighting checked and lamps replaced on a regular schedule',
    ],
  },
  '3.11-PC-4': {
    steps: [
      'Identify key seating and activity areas that lack shade or weather protection',
      'Install shade structures (sails, pergolas or shelters) over key rest, eating and waiting areas',
    ],
    indicators: [
      'Shade needs identified within 6 months',
      'Shade or weather protection provided in priority areas within 24 months',
      'Structures maintained in good condition',
    ],
  },
  '3.11-PC-5': {
    steps: [
      'Audit all outdoor hazards (steps, drop-offs, water features, level changes)',
      'Install TGSIs, contrasting edge strips, barriers or fencing as required, prioritising high-traffic areas and the main accessible path',
    ],
    indicators: [
      'Outdoor hazard audit completed within 3 months',
      'Priority hazards marked or guarded within 12 months',
      'Hazard marking re-checked after weather or works',
    ],
  },
  '3.11-PC-6': {
    steps: [
      'Identify key outdoor areas that can only be reached by stairs',
      'Provide step-free alternatives (ramps, graded paths or alternative routes) to all key outdoor areas',
    ],
    indicators: [
      'Step-only outdoor areas identified within 3 months',
      'Step-free access to key outdoor areas provided within 24 months',
      'Interim access arrangements provided while works are planned',
    ],
  },
  '3.11-D-1': {
    steps: [
      'Install TGSIs at the top and bottom of all outdoor stairs, at path edges near drop-offs and at key transitions per AS 1428.4.1',
      'Ensure 30% luminance contrast with surrounding surfaces',
    ],
    indicators: [
      'Outdoor hazard points without TGSIs identified within 3 months',
      'Compliant TGSIs installed within 12 months',
      'TGSI condition and contrast checked annually',
    ],
  },
  '3.11-D-2': {
    steps: [
      'Identify outdoor paths lacking rest points',
      'Install seating with back support and armrests at max 60m intervals, positioned off the path with adjacent wheelchair space',
    ],
    indicators: [
      'Rest-point gaps identified within 3 months',
      'Rest seating installed at recommended intervals within 12 months',
      'Seating condition checked on a regular schedule',
    ],
  },
  '3.11-D-3': {
    steps: [
      'Trim overhanging vegetation and reposition ground planters',
      'Maintain at least 1200mm clear width and 2000mm height clearance on all paths, adding path clearance to the maintenance schedule',
    ],
    indicators: [
      'Path clearance reviewed within 3 months',
      'Minimum 1200mm width and 2000mm height clearance maintained within 6 months',
      'Vegetation clearance added to the maintenance schedule',
    ],
  },
  '3.11-D-4': {
    steps: [
      'Install or retrofit at least one drinking fountain at wheelchair-accessible height (750-800mm) with lever or push-button controls',
      'Ensure clear approach space for wheelchair users',
    ],
    indicators: [
      'Drinking fountain accessibility reviewed within 3 months',
      'At least one accessible fountain provided within 12 months',
      'Approach space kept clear and fountain maintained',
    ],
  },
  '3.11-D-5': {
    steps: [
      'Review outdoor signage for contrast, font and height',
      'Upgrade to high-contrast, sans-serif signage at 1400-1700mm, with directional signs at all decision points',
    ],
    indicators: [
      'Outdoor signage reviewed within 3 months',
      'High-contrast signage at decision points within 12 months',
      'Signage condition checked on a regular schedule',
    ],
  },
  '3.11-D-6': {
    steps: [
      'Implement a regular outdoor surface inspection and repair schedule',
      'Address tree root damage, cracked pavers, loose materials and pooling water on priority paths first',
    ],
    indicators: [
      'Outdoor surface inspection schedule in place within 3 months',
      'Priority trip hazards repaired within 6 months',
      'New hazards flagged and made safe promptly',
    ],
  },
  '3.11-D-7': {
    steps: [
      'Designate a quiet outdoor area away from main activity zones, with seating, shade and natural screening',
      'Mark it on your venue map',
    ],
    indicators: [
      'Quiet outdoor zone identified within 6 months',
      'Quiet area provided and marked on the map within 12 months',
      'Area maintained on a regular schedule',
    ],
  },
  '3.11-D-8': {
    steps: [
      'Provide accessible outdoor dining tables (750-800mm height, 700mm knee clearance, no centre pedestal)',
      'Ensure level ground surfaces and maintain 1200mm circulation space between tables',
    ],
    indicators: [
      'Outdoor dining accessibility reviewed within 3 months',
      'Accessible tables and circulation space provided within 12 months',
      'Layout checked to maintain circulation space',
    ],
  },
  '3.11-D-9': {
    steps: [
      'Provide accessible toilets within reasonable distance (approx 100m) of outdoor areas, connected by an accessible path',
      'Install clear directional signage with the ISA',
    ],
    indicators: [
      'Toilet access from outdoor areas reviewed within 6 months',
      'Accessible toilet and signed accessible path provided within 24 months',
      'Signage and path maintained on a regular schedule',
    ],
  },
  '3.11-D-10': {
    steps: [
      'Develop emergency procedures for outdoor areas with accessible evacuation routes, visible signage and accessible assembly points',
      'Include communication methods for people with disability',
    ],
    indicators: [
      'Outdoor emergency procedures in place within 6 months',
      'Accessible routes and assembly points established',
      'Procedures tested in a drill at least annually',
    ],
  },
  '3.11-D-11': {
    steps: [
      'Map the routes between outdoor zones (garden to dining, pool to seating, trail to facilities)',
      'Create accessible routes with at least 1200mm width, firm surfaces and wayfinding at decision points',
    ],
    indicators: [
      'Inter-zone routes mapped within 6 months',
      'Accessible routes between outdoor zones provided within 24 months',
      'Routes reviewed after any grounds change',
    ],
  },
  '3.11-D-12': {
    steps: [
      'Make communal outdoor facilities accessible: BBQ controls at 900-1100mm with front approach, wheelchair-accessible picnic tables and firm level ground',
      'Maintain 1200mm circulation space',
    ],
    indicators: [
      'Communal outdoor facilities reviewed within 6 months',
      'Accessible BBQ, tables and surfaces provided within 24 months',
      'Facilities maintained on a regular schedule',
    ],
  },
  '3.11-D-13': {
    steps: [
      'Develop accessible information for outdoor areas: large-print maps, QR codes to audio or web content, tactile maps at decision points and Easy Read guides',
      'Keep the information current and available at entry points',
    ],
    indicators: [
      'Accessible outdoor information produced within 12 months',
      'Information available in multiple formats at entry points',
      'Information updated after any grounds change',
    ],
  },
  '3.11-D-14': {
    steps: [
      'Establish a maintenance schedule covering outdoor accessibility features: path condition, lighting, TGSIs, signage and vegetation clearance',
      'Include a reporting mechanism for emerging issues',
    ],
    indicators: [
      'Outdoor accessibility maintenance schedule in place within 3 months',
      'Reporting mechanism for issues established',
      'Scheduled checks completed and logged',
    ],
  },

  // ============================================================
  // Module 3.12 - Playgrounds and play spaces
  // ============================================================
  '3.12-PC-1': {
    steps: [
      'Assess the path from parking, drop-off and amenities to the playground for gaps (gravel sections, missing kerb ramps)',
      'Provide a continuous accessible path (at least 1200mm wide, firm, level) to the playground entry',
    ],
    indicators: [
      'Path to the playground assessed within 6 months',
      'Continuous accessible path provided within 24 months',
      'Path condition inspected on a regular schedule',
    ],
  },
  '3.12-PC-2': {
    steps: [
      'Assess the playground surface and transitions for wheelchair and mobility aid access',
      'Replace or supplement loose-fill with rubber soft fall or synthetic turf on key routes, with flush transitions from path to play surface',
    ],
    indicators: [
      'Playground surface assessed within 6 months',
      'Firm, level surface on key routes provided within 24 months',
      'Surface condition and transitions checked on a regular schedule',
    ],
  },
  '3.12-PC-3': {
    steps: [
      'Review play equipment for options children of different abilities can use together',
      'Add inclusive equipment (basket swings, flush carousels, ground-level trampolines, sensory panels) co-located with standard equipment',
    ],
    indicators: [
      'Inclusive play provision reviewed within 6 months',
      'Inclusive equipment installed alongside standard equipment within 24 months',
      'Equipment maintained and range reviewed regularly',
    ],
  },
  '3.12-PC-4': {
    steps: [
      'Review the playground for sensory play elements alongside physical equipment',
      'Add sensory elements (musical instruments, sand and water play, textured panels, nature play) reachable from a seated position',
    ],
    indicators: [
      'Sensory play reviewed within 6 months',
      'Sensory play elements provided within 24 months',
      'Elements maintained on a regular schedule',
    ],
  },
  '3.12-PC-5': {
    steps: [
      'Assess the playground boundary for containment needs',
      'Install fencing with self-closing gates to allow full enclosure',
    ],
    indicators: [
      'Playground enclosure reviewed within 6 months',
      'Fencing with self-closing gates installed within 24 months',
      'Fencing and gates maintained on a regular schedule',
    ],
  },
  '3.12-PC-6': {
    steps: [
      'Review seating near the playground for back support, armrests, shade and wheelchair space',
      'Install seating with shade and clear sight lines to play zones, with space alongside for wheelchair users',
    ],
    indicators: [
      'Caregiver seating reviewed within 3 months',
      'Shaded accessible seating with sight lines provided within 12 months',
      'Seating condition checked on a regular schedule',
    ],
  },
  '3.12-PC-7': {
    steps: [
      'Review supporting facilities (toilets, drinking water, bins) for accessibility and proximity to the playground',
      'Provide accessible toilets (with adult change), drinking water at accessible heights and bins within a short accessible walk',
    ],
    indicators: [
      'Supporting facilities reviewed within 6 months',
      'Accessible facilities provided within a short accessible walk within 24 months',
      'Facilities maintained on a regular schedule',
    ],
  },
  '3.12-D-1': {
    steps: [
      'Install a transfer platform or ramp on at least one elevated play structure at wheelchair seat height with a firm approach',
      'Connect it to a meaningful play experience',
    ],
    indicators: [
      'Transfer access reviewed within 6 months',
      'Transfer platform or ramp provided on an elevated structure within 24 months',
      'Transfer point maintained and kept clear',
    ],
  },
  '3.12-D-2': {
    steps: [
      'Create a quiet area adjacent to the playground with natural screening, comfortable seating and reduced noise and visual stimulation',
      'Mark it and let caregivers know it is there',
    ],
    indicators: [
      'Quiet zone need reviewed within 6 months',
      'Quiet area provided and marked within 12 months',
      'Area maintained on a regular schedule',
    ],
  },
  '3.12-D-3': {
    steps: [
      'Add visual symbols, pictographs or photographs to playground signage',
      'Include a visual layout map at the entry to support children with cognitive disabilities and pre-readers',
    ],
    indicators: [
      'Playground signage reviewed within 3 months',
      'Visual signage and entry layout map provided within 12 months',
      'Signage maintained and updated after changes',
    ],
  },
  '3.12-D-4': {
    steps: [
      'Review water play features for seated or ground-level access',
      'Provide ground-level splash pads, raised water tables with knee clearance and lever-handle taps on firm, non-slip surfaces',
    ],
    indicators: [
      'Water play accessibility reviewed within 6 months',
      'Accessible water play features provided within 24 months',
      'Features maintained on a regular schedule',
    ],
  },
  '3.12-D-5': {
    steps: [
      'Assess playground surfaces against AS 4422 (impact attenuation) and AS 4685 (general requirements)',
      'Upgrade to rubber soft fall or other compliant surfaces on key routes and fall zones',
    ],
    indicators: [
      'Surface compliance assessed within 6 months',
      'Compliant surfaces on key routes and fall zones within 24 months',
      'Surface condition inspected on a regular schedule',
    ],
  },
  '3.12-D-6': {
    steps: [
      'Assess playground circulation for wheelchair-using caregivers, including around and under equipment',
      'Provide firm surfaces throughout, remove lip edges at zone boundaries and maintain 1200mm clearance between equipment',
    ],
    indicators: [
      'Caregiver circulation assessed within 6 months',
      'Firm surfaces and 1200mm clearance provided within 24 months',
      'Circulation maintained after any equipment change',
    ],
  },
  '3.12-D-7': {
    steps: [
      'Review the playground for nature play elements in accessible locations',
      'Incorporate nature play (logs, boulders, plants, sand, water) via firm surfaces, with raised beds and sand tables for wheelchair users',
    ],
    indicators: [
      'Nature play reviewed within 6 months',
      'Accessible nature play elements provided within 24 months',
      'Elements maintained on a regular schedule',
    ],
  },
  '3.12-D-8': {
    steps: [
      'Review playground facilities (drinking fountains, bins, hand wash stations) for child and wheelchair-user heights',
      'Install dual-height facilities operable by both children and wheelchair users',
    ],
    indicators: [
      'Facility heights reviewed within 3 months',
      'Dual-height accessible facilities provided within 12 months',
      'Facilities maintained on a regular schedule',
    ],
  },
  '3.12-D-9': {
    steps: [
      'Review the range of play experiences across heights and challenge levels',
      'Add equipment at multiple heights and difficulties, with low-level options alongside climbing structures',
    ],
    indicators: [
      'Range of play experiences reviewed within 6 months',
      'Multiple heights and challenge levels provided within 24 months',
      'Range reviewed as equipment is renewed',
    ],
  },
  '3.12-D-10': {
    steps: [
      'Engage local community, including Aboriginal and Torres Strait Islander groups, on the playground design',
      'Incorporate local stories, materials and cultural elements',
    ],
    indicators: [
      'Community engagement undertaken within 12 months',
      'Local cultural elements incorporated into the design',
      'Community input sought for future upgrades',
    ],
  },
  '3.12-D-11': {
    steps: [
      'Create a maintenance schedule covering inclusive equipment (harness swings, carousels, sensory panels) and accessible surfaces',
      'Include checks for trip hazards, flush edges and equipment wear',
    ],
    indicators: [
      'Inclusive-play maintenance schedule in place within 3 months',
      'Scheduled checks completed and logged',
      'Faults repaired promptly to keep features usable',
    ],
  },
  '3.12-D-12': {
    steps: [
      'Install entry signage with a layout map showing equipment, accessible routes and facilities (toilets, water, parking)',
      'Use pictographs, high contrast and mount at 1000-1200mm centre height for wheelchair readability',
    ],
    indicators: [
      'Entry signage reviewed within 3 months',
      'Accessible entry layout signage provided within 12 months',
      'Signage updated after any layout change',
    ],
  },

  // ============================================================
  // Module 4.1 - Ways to reach us
  // ============================================================
  '4.1-PC-1': {
    steps: [
      'Provide at least two non-phone contact options (email, live chat, SMS, online form)',
      'Display them alongside your phone number across your channels',
    ],
    indicators: [
      'Non-phone contact options provided within 3 months',
      'Options displayed alongside the phone number on all channels',
      'Response times monitored across channels',
    ],
  },
  '4.1-PC-2': {
    steps: [
      'Register with the National Relay Service (NRS) and display the NRS number alongside your main phone number',
      'Train all customer-facing staff to receive and handle NRS calls',
    ],
    indicators: [
      'NRS registered and number displayed within 3 months',
      'Customer-facing staff trained to handle NRS calls within 6 months',
      'NRS handling included in induction for new staff',
    ],
  },
  '4.1-PC-3': {
    steps: [
      'Add a communication preferences field to your customer records (preferred contact method, format needs)',
      'Ask at first contact and store the preference for future use',
    ],
    indicators: [
      'Communication preferences captured within 6 months',
      'Preferences recorded at first contact',
      'Preferences applied on future contact',
    ],
  },
  '4.1-PC-4': {
    steps: [
      'Set equivalent service-level targets for non-phone channels',
      'Enforce them so email and chat receive responses within the same window as phone calls',
    ],
    indicators: [
      'Equivalent response-time targets set within 3 months',
      'Non-phone channels meeting the same targets as phone within 6 months',
      'Response times reviewed on a regular schedule',
    ],
  },
  '4.1-PC-5': {
    steps: [
      'Provide staff training on communicating with people who have speech disabilities, strong accents or who use AAC devices',
      'Include practical scenarios and allow extra time in interactions',
    ],
    indicators: [
      'Communication training delivered within 6 months',
      'Training included in induction for new staff',
      'Refresher completed each year',
    ],
  },
  '4.1-PC-6': {
    steps: [
      'Train staff on what AAC devices are, how they work and how to interact respectfully with people who use them',
      'Include examples of low-tech (picture boards) and high-tech (speech apps) AAC',
    ],
    indicators: [
      'AAC awareness training delivered within 6 months',
      'Staff able to interact respectfully with AAC users',
      'Included in induction for new staff',
    ],
  },
  '4.1-PC-7': {
    steps: [
      'Designate a quiet, low-stimulus space for conversations with customers who need a calmer environment (private office, meeting room or screened area)',
      'Let staff know when and how to use it',
    ],
    indicators: [
      'Quiet communication space identified within 3 months',
      'Space available and known to staff within 6 months',
      'Space kept available and suitable',
    ],
  },
  '4.1-PC-8': {
    steps: [
      'Offer written confirmation (email, SMS or letter) after important phone or in-person conversations',
      'Cover bookings, service changes and access arrangements',
    ],
    indicators: [
      'Written confirmation process in place within 3 months',
      'Confirmation offered after important conversations',
      'Offered in the customer\'s preferred format',
    ],
  },
  '4.1-PC-9': {
    steps: [
      'Offer at least three feedback channels (phone, email, in-person, mail, SMS)',
      'Ensure at least one does not require internet and at least one does not require verbal communication',
    ],
    indicators: [
      'At least three feedback channels available within 6 months',
      'Channels span internet-free and voice-free options',
      'Channel use reviewed on a regular schedule',
    ],
  },
  '4.1-PC-10': {
    steps: [
      'Establish a process for responding to customers in their stated preferred format (large print, email instead of phone, Easy Read)',
      'Document preferences and ensure all staff follow them',
    ],
    indicators: [
      'Preferred-format response process in place within 6 months',
      'Customers responded to in their preferred format',
      'Process followed consistently, confirmed via feedback',
    ],
  },
  '4.1-DD-1a': {
    steps: [
      'Identify at least two non-phone contact options to actively promote',
      'Display them alongside your phone number on your website, signage and printed materials',
    ],
    indicators: [
      'Promoted non-phone options identified within 3 months',
      'Options displayed alongside the phone number within 6 months',
      'Promotion reviewed when channels change',
    ],
  },
  '4.1-DD-1b': {
    steps: [
      'Review where phone alternatives appear relative to your phone number',
      'Display non-phone options with equal prominence on your website, Google Business listing and printed materials, not buried in sub-pages',
    ],
    indicators: [
      'Prominence of contact options reviewed within 3 months',
      'Non-phone options given equal prominence within 6 months',
      'Prominence maintained on new materials',
    ],
  },
  '4.1-DD-2a': {
    steps: [
      'Deliver NRS training to all customer-facing, reception and phone-handling staff',
      'Include practical exercises handling NRS voice relay and TTY relay calls',
    ],
    indicators: [
      'NRS training delivered to relevant staff within 6 months',
      'Staff confident handling relay calls',
      'Training included in induction for new staff',
    ],
  },
  '4.1-DD-3a': {
    steps: [
      'Add communication preference fields to your CRM, booking system or customer database',
      'Capture preferred contact method, document format and communication support needs at first interaction',
    ],
    indicators: [
      'Preference fields added to systems within 6 months',
      'Preferences captured at first interaction',
      'Preference data reviewed for completeness',
    ],
  },
  '4.1-DD-3b': {
    steps: [
      'Make communication preferences visible in the customer record before staff make outbound contact',
      'Add preference flags or alerts to your CRM or booking system',
    ],
    indicators: [
      'Preferences visible to staff before outbound contact within 6 months',
      'Preference flags in place in the CRM',
      'Staff use preferences consistently, confirmed via feedback',
    ],
  },
  '4.1-DD-5a': {
    steps: [
      'Deliver practical training on communicating with people who have speech disabilities (allowing extra time, using yes/no questions, offering writing materials, working with AAC)',
      'Include it in induction for new staff',
    ],
    indicators: [
      'Speech-communication training delivered within 6 months',
      'Included in induction for new staff',
      'Refresher completed each year',
    ],
  },
  '4.1-DD-6a': {
    steps: [
      'Provide staff with basic AAC resources: a communication board with common service phrases, a picture menu (if applicable), pen and paper and a reference guide',
      'Keep the resources at key service points',
    ],
    indicators: [
      'AAC resources provided within 6 months',
      'Resources available at key service points',
      'Resources maintained and replaced when worn',
    ],
  },
  '4.1-DD-8a': {
    steps: [
      'Make written confirmation of important conversations (bookings, service changes, complaints) a standard practice offered to all customers',
      'Brief staff to offer it proactively, not only on request',
    ],
    indicators: [
      'Standard written-confirmation practice in place within 3 months',
      'Confirmation offered proactively to all customers',
      'Practice included in staff induction',
    ],
  },
  '4.1-DD-9a': {
    steps: [
      'Establish at least three feedback channels spanning different access needs (online form, email, phone, in-person, postal)',
      'Ensure at least one works without internet and one without voice',
    ],
    indicators: [
      'At least three accessible feedback channels available within 6 months',
      'Channels cover internet-free and voice-free options',
      'Channel accessibility reviewed on a regular schedule',
    ],
  },
  '4.1-DD-10a': {
    steps: [
      'Develop the capability to respond in alternative formats: large print (min 18pt), Easy Read, audio, email and Braille (via a transcription service if needed)',
      'Offer the format the customer requested',
    ],
    indicators: [
      'Alternative response formats available within 12 months',
      'Customers responded to in their requested format',
      'Format capability reviewed on a regular schedule',
    ],
  },
  '4.1-DD-11a': {
    steps: [
      'Audit your website contact page against WCAG 2.2 AA (keyboard navigation, screen reader compatibility, no inaccessible CAPTCHAs, labelled fields, clear errors)',
      'Fix the issues found',
    ],
    indicators: [
      'Contact page audited for WCAG 2.2 AA within 3 months',
      'Critical issues fixed within 6 months',
      'Accessibility re-checked when the contact page changes',
    ],
  },
  '4.1-DD-12a': {
    steps: [
      'Provide accessible after-hours or emergency contact options',
      'Ensure at least one non-phone option (email, SMS, online form) is monitored outside business hours for urgent accessibility enquiries',
    ],
    indicators: [
      'After-hours accessible contact provided within 6 months',
      'At least one non-phone option monitored outside business hours',
      'Response performance reviewed on a regular schedule',
    ],
  },

  // ============================================================
  // Module 4.2 - Customer service and staff confidence
  // ============================================================
  '4.2-F-1': {
    steps: [
      'Implement disability awareness and inclusion training for all customer-facing staff',
      'Source training that includes lived-experience perspectives and practical scenario-based exercises, not just online modules',
    ],
    indicators: [
      'Disability awareness training delivered within 6 months',
      'Training included in induction for new staff',
      'Refresher completed each year',
    ],
  },
  '4.2-F-2': {
    steps: [
      'Train all staff on assistance animal rights under the DDA 1992',
      'Ensure staff know they cannot refuse entry, request proof of disability or charge extra for assistance animals',
    ],
    indicators: [
      'Assistance animal training delivered within 3 months',
      'Staff correctly welcome assistance animals, confirmed via feedback',
      'Included in induction for new staff',
    ],
  },
  '4.2-F-3': {
    steps: [
      'Provide practical communication training covering interactions with people who are Deaf, blind, have intellectual disabilities, use wheelchairs or have speech differences',
      'Include role-play exercises',
    ],
    indicators: [
      'Communication training delivered within 6 months',
      'Staff report increased confidence, confirmed via survey',
      'Refresher completed each year',
    ],
  },
  '4.2-F-4': {
    steps: [
      'Create a process for customers to request assistance before arriving, in the booking flow, website contact page and confirmations',
      'Nominate a staff member to action requests',
    ],
    indicators: [
      'Pre-arrival assistance process in place within 3 months',
      'Requests actioned before arrival',
      'Process reviewed via customer feedback',
    ],
  },
  '4.2-F-5': {
    steps: [
      'Train staff in varied communication strategies: clear moderate-pace speech, plain language, written information, gestures or visual aids',
      'Teach them to adjust their approach based on customer cues',
    ],
    indicators: [
      'Communication strategy training delivered within 6 months',
      'Strategies used consistently, confirmed via feedback',
      'Included in induction for new staff',
    ],
  },
  '4.2-F-6': {
    steps: [
      'Ensure all staff know the location of accessible toilets, lifts, hearing loops, quiet spaces and accessible parking',
      'Include it in onboarding and display a staff reference map',
    ],
    indicators: [
      'Staff briefed on accessible facility locations within 3 months',
      'Reference map available to staff',
      'Included in onboarding for new staff',
    ],
  },
  '4.2-F-7': {
    steps: [
      'Document a clear process for handling accessibility complaints and feedback (who receives them, response timeframes, escalation)',
      'Communicate outcomes back to the customer',
    ],
    indicators: [
      'Complaints process documented within 3 months',
      'Complaints responded to within the set timeframe',
      'Complaint trends reviewed to inform improvements',
    ],
  },
  '4.2-D-9': {
    steps: [
      'Train staff to offer assistance respectfully: ask "Can I help with anything?" rather than assuming, and speak directly to the customer',
      'Have staff follow the customer\'s lead on what help they want',
    ],
    indicators: [
      'Respectful-assistance training delivered within 6 months',
      'Assistance offered respectfully, confirmed via feedback',
      'Included in induction for new staff',
    ],
  },
  '4.2-D-10': {
    steps: [
      'Train staff on communicating with Deaf and hard of hearing customers: face them, reduce background noise, offer pen and paper, use gestures',
      'Ensure staff know how to book an Auslan interpreter when needed',
    ],
    indicators: [
      'Deaf-communication training delivered within 6 months',
      'Staff able to book an interpreter when needed',
      'Included in induction for new staff',
    ],
  },
  '4.2-D-11': {
    steps: [
      'Keep pen and paper (or a whiteboard and marker) at all customer service points',
      'Brief staff to offer written communication when helpful',
    ],
    indicators: [
      'Written-communication materials at all service points within 1 month',
      'Staff offer written communication when helpful',
      'Materials restocked on a regular schedule',
    ],
  },
  '4.2-D-12': {
    steps: [
      'Train staff to allow extra time for customers with cognitive, intellectual or psychosocial disabilities',
      'Teach them to use plain language, break information into steps, offer to repeat or write things down, and avoid rushing',
    ],
    indicators: [
      'Extra-time communication training delivered within 6 months',
      'Staff adapt pace and language, confirmed via feedback',
      'Included in induction for new staff',
    ],
  },
  '4.2-D-13': {
    steps: [
      'Designate a quiet, low-stimulus space where overwhelmed customers can decompress',
      'Ensure staff know where it is and can offer it proactively when a customer appears distressed',
    ],
    indicators: [
      'Quiet space identified within 3 months',
      'Space available and offered proactively within 6 months',
      'Space kept available and suitable',
    ],
  },
  '4.2-D-14': {
    steps: [
      'Develop and document a policy on serving customers with disabilities',
      'Bring existing procedures together into a single accessible document all staff can consult',
    ],
    indicators: [
      'Customer service disability policy documented within 6 months',
      'Policy accessible to all staff',
      'Policy reviewed at least annually',
    ],
  },
  '4.2-D-15': {
    steps: [
      'Include accessibility and disability awareness training as a mandatory part of new staff onboarding',
      'Cover assistance animal rights, communication strategies, accessible facility locations and the complaints process',
    ],
    indicators: [
      'Accessibility training added to onboarding within 3 months',
      'All new staff complete it before customer contact',
      'Onboarding content reviewed annually',
    ],
  },
  '4.2-D-16': {
    steps: [
      'Ensure staff are aware of accessible evacuation procedures, including refuge area locations and how to assist customers with different needs',
      'Reinforce this in emergency drills',
    ],
    indicators: [
      'Staff briefed on accessible evacuation within 3 months',
      'Accessible evacuation practised in drills at least annually',
      'Included in induction for new staff',
    ],
  },
  '4.2-D-17': {
    steps: [
      'Ensure all staff know what accessibility equipment is available (hearing loops, wheelchairs, portable ramps, magnifiers)',
      'Train them on where it is and how to operate or deploy it',
    ],
    indicators: [
      'Staff briefed on available equipment within 3 months',
      'Staff able to locate and operate equipment',
      'Included in induction for new staff',
    ],
  },
  '4.2-D-18': {
    steps: [
      'Assess what assistive technology or equipment would benefit your customers (hearing loop, magnifying sheet, loan wheelchair, portable ramp, communication tablet)',
      'Procure and make available the most impactful items',
    ],
    indicators: [
      'Assistive technology needs assessed within 6 months',
      'High-impact items procured and available within 12 months',
      'Range reviewed against demand regularly',
    ],
  },
  '4.2-D-18b': {
    steps: [
      'Establish a relationship with an Auslan interpreting service so you can arrange interpretation for planned appointments',
      'Set up access to on-demand video remote interpreting (VRI)',
    ],
    indicators: [
      'Auslan interpreting arrangement in place within 6 months',
      'Interpretation arranged promptly when requested',
      'VRI available for on-demand needs',
    ],
  },
  '4.2-D-19': {
    steps: [
      'Develop guidelines for welcoming carers and support people: offer a seat, direct conversation to the customer, honour the Companion Card (no charge)',
      'Ask the customer how they would like to be supported',
    ],
    indicators: [
      'Carer and support-person guidelines in place within 3 months',
      'Companion Card honoured and carers welcomed, confirmed via feedback',
      'Guidelines included in staff induction',
    ],
  },
  '4.2-D-20': {
    steps: [
      'Establish a process for providing key documents in alternative formats (large print, Easy Read, audio, Braille, digital), with a responsible person and response timeframes',
      'Train staff to offer this proactively',
    ],
    indicators: [
      'Alternative-format process in place within 6 months',
      'Requests fulfilled within the set timeframe',
      'Staff offer formats proactively',
    ],
  },
  '4.2-D-21': {
    steps: [
      'Document an assistance animal policy aligned with the DDA 1992 (permitted in all public areas, no proof requests, no surcharges)',
      'Train all staff on the policy',
    ],
    indicators: [
      'Assistance animal policy documented within 3 months',
      'All staff trained on the policy',
      'Policy reviewed at least annually',
    ],
  },
  '4.2-D-22': {
    steps: [
      'Train staff to respond to complaints about assistance animals by explaining the handler\'s legal right under the DDA 1992, and that the animal must not be removed',
      'Offer the complaining customer an alternative seat or area if possible',
    ],
    indicators: [
      'Staff trained to handle assistance animal complaints within 3 months',
      'Handlers\' rights upheld in practice',
      'Included in induction for new staff',
    ],
  },
  '4.2-D-23': {
    steps: [
      'Implement priority access options for customers who cannot stand or wait for extended periods',
      'Communicate expected wait times in accessible formats and allow flexible service delivery',
    ],
    indicators: [
      'Priority access options in place within 6 months',
      'Wait times communicated in accessible formats',
      'Flexible service delivery available on request',
    ],
  },
  '4.2-D-25': {
    steps: [
      'Identify barriers to your standard service for some customers',
      'Offer alternatives: home delivery, phone ordering, assisted shopping, table service or appointment-based service',
    ],
    indicators: [
      'Service barriers identified within 6 months',
      'At least one alternative service method offered within 12 months',
      'Alternatives promoted and reviewed via feedback',
    ],
  },
  '4.2-D-26': {
    steps: [
      'Train staff to proactively offer assistance when they notice a customer may need support, using a respectful approach ("Is there anything I can help you with?")',
      'Include it in induction for new staff',
    ],
    indicators: [
      'Proactive-assistance training delivered within 6 months',
      'Assistance offered proactively and respectfully, confirmed via feedback',
      'Included in induction for new staff',
    ],
  },
  '4.2-D-27': {
    steps: [
      'Create a simple feedback mechanism for service interactions (receipts, follow-up emails, a visible feedback point)',
      'Review results regularly to inform staff training',
    ],
    indicators: [
      'Service-interaction feedback mechanism in place within 3 months',
      'Feedback reviewed on a regular schedule',
      'Findings used to inform training',
    ],
  },
  '4.2-D-28': {
    steps: [
      'Include intersectionality in disability awareness training (culture, gender identity, age, language, past negative experiences)',
      'Teach staff to avoid one-size-fits-all assumptions',
    ],
    indicators: [
      'Intersectionality included in training within 6 months',
      'Staff apply an individualised approach, confirmed via feedback',
      'Included in induction for new staff',
    ],
  },
  '4.2-D-31': {
    steps: [
      'Allow customers to request increased or reduced levels of service interaction',
      'Offer a way to signal preference (assistance-available badges, quiet shopping options)',
    ],
    indicators: [
      'Service-level options in place within 6 months',
      'Customers can signal their preference',
      'Options reviewed via customer feedback',
    ],
  },
  '4.2-D-32': {
    steps: [
      'Involve people with disabilities in reviewing or co-designing your customer service approach (paid consultants, advisory panel or co-design workshop)',
      'Ensure participants are compensated',
    ],
    indicators: [
      'People with disability engaged in review or co-design within 12 months',
      'Participants compensated for their input',
      'Their recommendations acted on and tracked',
    ],
  },
  '4.2-D-33': {
    steps: [
      'Provide a way for customers to discuss accessibility needs privately, away from public counters (quiet consultation area, phone/email option or discreet card system)',
      'Brief staff to offer the private option',
    ],
    indicators: [
      'Private-discussion option in place within 6 months',
      'Staff offer the private option when appropriate',
      'Option reviewed via customer feedback',
    ],
  },

  // ============================================================
  // Module 4.3 - Bookings and ticketing
  // ============================================================
  '4.3-1-1': {
    steps: [
      'Enable flexible booking modifications (date, time, accessibility requirements) through all booking channels',
      'Communicate the process clearly to customers',
    ],
    indicators: [
      'Flexible booking modifications available within 6 months',
      'Modification process communicated at booking',
      'Modifications handled consistently, confirmed via feedback',
    ],
  },
  '4.3-1-2': {
    steps: [
      'Check payment terminal height and approach space',
      'Reposition terminals to be usable from a seated position (800-1100mm per AS 1428.1) with clear approach space',
    ],
    indicators: [
      'Payment terminal heights reviewed within 3 months',
      'Accessible terminal height and approach provided within 12 months',
      'Approach space kept clear',
    ],
  },
  '4.3-1-3': {
    steps: [
      'Provide portable or wireless payment terminals',
      'Train staff to offer table-side or counter-side payment when a customer cannot reach the fixed terminal',
    ],
    indicators: [
      'Portable payment option available within 6 months',
      'Staff offer table-side payment when needed',
      'Portable terminals maintained and charged',
    ],
  },
  '4.3-1-4': {
    steps: [
      'Introduce flexible cancellation and modification terms for disability-related changes (health flare-ups, carer unavailability)',
      'Communicate this policy clearly during booking',
    ],
    indicators: [
      'Flexible cancellation policy in place within 3 months',
      'Policy communicated at booking',
      'Policy applied consistently, confirmed via feedback',
    ],
  },
  '4.3-D-1': {
    steps: [
      'Audit your online booking system against WCAG 2.2 AA (keyboard navigation, screen reader compatibility, clear labels and errors, 200% zoom)',
      'Fix the issues found and provide a phone or email alternative',
    ],
    indicators: [
      'Booking system audited for WCAG 2.2 AA within 3 months',
      'Critical issues fixed within 12 months',
      'A phone or email booking alternative available',
    ],
  },
  '4.3-D-2': {
    steps: [
      'Add an accessibility requirements field to your booking process (wheelchair access, hearing loop, Auslan interpreter, quiet seating, assistance animal, free text)',
      'Ensure requests are actioned before the visit',
    ],
    indicators: [
      'Accessibility requirements field added within 6 months',
      'Requests actioned before the visit',
      'Request handling reviewed via feedback',
    ],
  },
  '4.3-D-3': {
    steps: [
      'Register as a Companion Card affiliate through your state or territory scheme',
      'Train staff to recognise and accept the card, and apply the companion concession automatically',
    ],
    indicators: [
      'Companion Card affiliation in place within 6 months',
      'Staff recognise and accept the card',
      'Companion concession applied automatically',
    ],
  },
  '4.3-D-4': {
    steps: [
      'Review what concession pricing or reduced fees you could offer people with disability and their companions',
      'Establish clear eligibility criteria and a simple verification process',
    ],
    indicators: [
      'Concession pricing reviewed within 6 months',
      'Concession offered with clear eligibility within 12 months',
      'Uptake reviewed and criteria refined',
    ],
  },
  '4.3-D-5': {
    steps: [
      'Accept a range of payment methods including contactless (tap-and-go), chip and PIN, cash and online payment',
      'Promote contactless as important for customers with fine motor difficulties',
    ],
    indicators: [
      'Payment methods reviewed within 3 months',
      'A range of accessible payment methods accepted within 6 months',
      'Payment options confirmed after any system change',
    ],
  },
  '4.3-D-6': {
    steps: [
      'Ensure booking confirmations and receipts are well-structured HTML email (not image-only), with a plain-text option',
      'Provide large print on request and screen-reader-compatible PDFs',
    ],
    indicators: [
      'Confirmation and receipt formats reviewed within 3 months',
      'Accessible confirmations and receipts provided within 6 months',
      'Formats re-checked when templates change',
    ],
  },
  '4.3-D-7': {
    steps: [
      'Enable customers to book accessible spaces, seating or equipment (wheelchair spaces, hearing loop seats, accessible rooms) in advance through your standard booking system',
      'Confirm the booked feature is held and ready',
    ],
    indicators: [
      'Advance booking of accessible features available within 6 months',
      'Booked features held and ready on arrival',
      'Booking reliability reviewed via feedback',
    ],
  },
  '4.3-D-8': {
    steps: [
      'Offer multiple ways to request assistance when booking (online field, dedicated phone line, email, note option in third-party platforms)',
      'Ensure requests are actioned before the visit',
    ],
    indicators: [
      'Multiple assistance-request channels available within 6 months',
      'Requests actioned before the visit',
      'Request handling reviewed via feedback',
    ],
  },
  '4.3-D-9': {
    steps: [
      'Publish pricing information in accessible formats: website (WCAG 2.2 AA), large print at the venue, Easy Read or audio on request',
      'Avoid pricing only in images or non-tagged PDFs',
    ],
    indicators: [
      'Pricing formats reviewed within 3 months',
      'Accessible pricing available within 6 months',
      'Pricing formats updated when prices change',
    ],
  },
  '4.3-D-10': {
    steps: [
      'Promote concessions and discounts on your website, at point of sale and in confirmations',
      'Include eligibility, how to claim and what evidence is needed, without requiring customers to ask',
    ],
    indicators: [
      'Concessions clearly promoted within 3 months',
      'Eligibility and claiming process published',
      'Uptake reviewed on a regular schedule',
    ],
  },
  '4.3-D-11': {
    steps: [
      'Confirm customers with disability can use all the same payment methods as other customers',
      'Where any method is inaccessible, provide an equally convenient alternative',
    ],
    indicators: [
      'Payment accessibility reviewed within 3 months',
      'Equally convenient alternatives provided where needed within 12 months',
      'Payment accessibility confirmed after any system change',
    ],
  },
  '4.3-D-12': {
    steps: [
      'Audit EFTPOS and payment terminals for accessibility (tactile buttons, audio feedback, screen contrast, reachable height 900-1100mm, handheld option)',
      'Replace or supplement inaccessible terminals',
    ],
    indicators: [
      'Payment terminals audited within 3 months',
      'Accessible terminals in place within 12 months',
      'Accessibility confirmed when terminals are replaced',
    ],
  },
  '4.3-D-13': {
    steps: [
      'Ensure receipts and invoices are min 12pt on print, well-structured HTML email and tagged PDF',
      'Provide large print or audio on request',
    ],
    indicators: [
      'Receipt and invoice formats reviewed within 3 months',
      'Accessible receipts and invoices provided within 6 months',
      'Formats re-checked when templates change',
    ],
  },
  '4.3-D-14': {
    steps: [
      'Audit self-service kiosks for accessibility (reachable screen height, screen reader or audio output, high contrast, timeout extensions, tactile controls)',
      'Ensure a staffed alternative is always available',
    ],
    indicators: [
      'Self-service kiosks audited within 6 months',
      'Accessible kiosk features provided within 24 months',
      'A staffed alternative always available',
    ],
  },
  '4.3-D-15': {
    steps: [
      'Audit your digital queuing or ticket system for accessibility (screen reader compatibility, keyboard navigation, visual and audio queue alerts)',
      'Provide an alternative for customers who cannot use the digital system',
    ],
    indicators: [
      'Digital queuing system audited within 6 months',
      'Accessible queuing features and an alternative provided within 12 months',
      'Accessibility re-checked when the system changes',
    ],
  },
  '4.3-D-16': {
    steps: [
      'Audit self-checkout machines for accessibility (screen height, audio feedback and screen reader mode, bagging layout for wheelchair trays, weight tolerance, clear instructions)',
      'Ensure a staffed checkout is always available',
    ],
    indicators: [
      'Self-checkout accessibility audited within 6 months',
      'Accessible self-checkout configuration in place within 12 months',
      'A staffed checkout always available',
    ],
  },

  // ============================================================
  // Module 4.4 - Safety and emergencies
  // ============================================================
  '4.4-1-1': {
    steps: [
      'Update your emergency management plan to include specific procedures for evacuating people with mobility, sensory, cognitive and psychosocial disabilities',
      'Confirm the plan meets DDA 1992 obligations',
    ],
    indicators: [
      'Emergency plan updated for disability-inclusive evacuation within 6 months',
      'Plan confirmed against DDA obligations',
      'Plan reviewed at least annually',
    ],
  },
  '4.4-1-2': {
    steps: [
      'Audit all emergency exits for step-free access, min 850mm door width per AS 1428.1 and clear approach paths',
      'Rectify exits that are not accessible',
    ],
    indicators: [
      'Emergency exits audited within 3 months',
      'Accessible emergency egress provided within 24 months',
      'Exit paths kept clear, confirmed on regular checks',
    ],
  },
  '4.4-1-3': {
    steps: [
      'Install dual-mode alarm systems with both audible alarms and visual strobes in all areas, including toilets and quiet spaces, per AS 1670.4 and the Premises Standards',
      'Test both modes during regular alarm checks',
    ],
    indicators: [
      'Alarm coverage reviewed within 3 months',
      'Audible and visual alarms provided across all areas within 24 months',
      'Both modes tested during regular alarm checks',
    ],
  },
  '4.4-1-4': {
    steps: [
      'Conduct disability-inclusive evacuation training for all staff (wheelchair assistance, guiding a blind person, communicating with Deaf people, supporting people with anxiety or confusion)',
      'Reinforce it in regular drills',
    ],
    indicators: [
      'Disability-inclusive evacuation training delivered within 6 months',
      'Practised in drills at least every six months',
      'Included in induction for new staff',
    ],
  },
  '4.4-D-1': {
    steps: [
      'Implement Personal Emergency Evacuation Plans (PEEPs) for staff and regular visitors who need them',
      'Develop generic PEEPs for casual visitors covering common disability types',
    ],
    indicators: [
      'PEEPs implemented within 6 months',
      'Generic PEEPs available for casual visitors',
      'PEEPs reviewed at least annually',
    ],
  },
  '4.4-D-2': {
    steps: [
      'Identify and clearly sign designated refuge areas on all floors above and below ground level',
      'Ensure each is fire-rated with two-way communication to the control point and included in your emergency procedures, per the NCC and AS 1428.1',
    ],
    indicators: [
      'Refuge area provision reviewed within 6 months',
      'Compliant, signed refuge areas provided within 24 months',
      'Refuge communication tested during drills',
    ],
  },
  '4.4-D-3': {
    steps: [
      'Procure appropriate evacuation equipment (evacuation chairs, slide sheets or carry chairs) for all multi-storey areas',
      'Train designated staff in their use and run regular practice sessions',
    ],
    indicators: [
      'Evacuation equipment need reviewed within 3 months',
      'Equipment procured and staff trained within 12 months',
      'Equipment maintained and practised regularly',
    ],
  },
  '4.4-D-4': {
    steps: [
      'Implement visual emergency alerts (flashing beacons, digital signage) alongside audible alarms',
      'Train staff to use written instructions, gestures and physical guidance to direct Deaf visitors during evacuation',
    ],
    indicators: [
      'Visual emergency alerts installed within 24 months',
      'Staff trained to direct Deaf visitors in an emergency',
      'Visual alerts tested during drills',
    ],
  },
  '4.4-D-5': {
    steps: [
      'Display emergency procedures in accessible formats: tactile and Braille evacuation maps at key points, large print, high-contrast schemes and Easy Read at reception',
      'Include accessible formats in pre-visit information',
    ],
    indicators: [
      'Emergency procedure formats reviewed within 3 months',
      'Accessible emergency information provided within 12 months',
      'Formats updated whenever procedures change',
    ],
  },
  '4.4-D-6': {
    steps: [
      'Develop procedures for supporting people with anxiety, autism, intellectual disability or cognitive differences during emergencies',
      'Train staff on calm communication, sensory overload management and buddy systems',
    ],
    indicators: [
      'Support procedures developed within 6 months',
      'Staff trained on calm communication and buddy systems',
      'Procedures practised in drills',
    ],
  },
  '4.4-D-7': {
    steps: [
      'Include assistance animals in your emergency evacuation procedures, keeping the animal with its handler',
      'Train staff never to separate an assistance animal from its handler and plan for animal welfare at assembly points',
    ],
    indicators: [
      'Assistance animals included in evacuation procedures within 3 months',
      'Staff trained never to separate animal from handler',
      'Animal welfare planned for at assembly points',
    ],
  },
  '4.4-D-8': {
    steps: [
      'Conduct evacuation drills at least every six months that include disability scenarios (wheelchair user, blind person, Deaf visitor, person with cognitive disability)',
      'Document outcomes and improve procedures based on findings',
    ],
    indicators: [
      'Disability scenarios included in drills within 6 months',
      'Drills held at least every six months',
      'Findings documented and procedures improved',
    ],
  },
  '4.4-D-9': {
    steps: [
      'Brief visitors with disabilities on emergency procedures on arrival: nearest accessible exit, refuge location, how alarms are communicated and who to contact',
      'Include this in any pre-visit information pack',
    ],
    indicators: [
      'Arrival emergency briefing process in place within 6 months',
      'Visitors with disabilities briefed on arrival',
      'Briefing included in pre-visit information',
    ],
  },
  '4.4-D-10': {
    steps: [
      'Develop a process to communicate visitor disability information to external emergency services on arrival',
      'Maintain a register of visitors with PEEPs (location, mobility and communication needs, assistance animal) available to the chief warden',
    ],
    indicators: [
      'Emergency-services communication process in place within 6 months',
      'PEEP register maintained and available to the chief warden',
      'Process tested during drills',
    ],
  },

  // ============================================================
  // Module 4.5 - Feedback and reviews
  // ============================================================
  '4.5-F-1': {
    steps: [
      'Create a way for customers to provide feedback specifically about accessibility',
      'Offer both general channels and a dedicated accessibility feedback option (email, form or phone line)',
    ],
    indicators: [
      'Accessibility feedback option in place within 3 months',
      'Option promoted across channels',
      'Feedback reviewed on a regular schedule',
    ],
  },
  '4.5-F-2': {
    steps: [
      'Audit your surveys and feedback forms against WCAG 2.2 AA (keyboard navigation, screen reader compatibility, clear labels, adequate time)',
      'Provide alternative formats (phone, paper, Easy Read)',
    ],
    indicators: [
      'Surveys and forms audited within 3 months',
      'Accessible surveys and alternative formats provided within 6 months',
      'Accessibility re-checked when forms change',
    ],
  },
  '4.5-F-3': {
    steps: [
      'Set up monitoring for accessibility-related mentions in Google Reviews, TripAdvisor, social media and industry platforms',
      'Respond to accessibility concerns promptly and publicly, showing you are acting on them',
    ],
    indicators: [
      'Review monitoring in place within 3 months',
      'Accessibility concerns responded to promptly',
      'Review themes fed into improvements',
    ],
  },
  '4.5-F-4': {
    steps: [
      'Establish a regular review cycle (at least quarterly) for accessibility feedback, with assigned responsibility for reviewing, categorising and prioritising',
      'Report back to customers on changes made',
    ],
    indicators: [
      'Regular feedback review cycle in place within 3 months',
      'Feedback reviewed at least quarterly with clear responsibility',
      'Changes communicated back to customers',
    ],
  },
  '4.5-D-1': {
    steps: [
      'Offer at least three feedback channels (online form, email, phone, in-person, postal)',
      'Ensure at least one does not require internet and one does not require verbal communication',
    ],
    indicators: [
      'At least three feedback channels available within 6 months',
      'Channels span internet-free and voice-free options',
      'Channel accessibility reviewed on a regular schedule',
    ],
  },
  '4.5-D-2': {
    steps: [
      'Respond to accessibility-related reviews publicly and promptly, acknowledging the concern and explaining what action you are taking',
      'Invite the reviewer to contact you directly, avoiding defensive language',
    ],
    indicators: [
      'Review response approach in place within 3 months',
      'Accessibility reviews responded to promptly and constructively',
      'Response quality reviewed on a regular schedule',
    ],
  },
  '4.5-D-3': {
    steps: [
      'Implement a system for tracking and categorising accessibility feedback (date, channel, category, action taken, outcome)',
      'Review it quarterly for patterns',
    ],
    indicators: [
      'Feedback tracking system in place within 3 months',
      'Feedback categorised and logged consistently',
      'Patterns reviewed quarterly to inform priorities',
    ],
  },
  '4.5-D-4': {
    steps: [
      'Set target response times for accessibility complaints (acknowledge within 24 hours, substantive response within 5 business days, resolve within 20)',
      'Communicate these timeframes to customers',
    ],
    indicators: [
      'Target response times set within 3 months',
      'Timeframes met and communicated to customers',
      'Performance against targets reviewed on a regular schedule',
    ],
  },
  '4.5-D-5': {
    steps: [
      'Develop a process for communicating accessibility improvements back to customers (update your accessibility page, newsletters, social media)',
      'Directly notify customers who provided the original feedback',
    ],
    indicators: [
      'Improvement-communication process in place within 6 months',
      'Improvements shared with customers and the community',
      'Original feedback-givers notified of changes',
    ],
  },
  '4.5-D-6': {
    steps: [
      'Document an escalation process for serious accessibility complaints (define what is serious, who it escalates to, expected resolution timeframe)',
      'Brief staff on when and how to escalate',
    ],
    indicators: [
      'Escalation process documented within 3 months',
      'Staff know when and how to escalate',
      'Escalated complaints resolved within the set timeframe',
    ],
  },
  '4.5-D-7': {
    steps: [
      'Offer at least one anonymous feedback channel (anonymous online form, suggestion box or third-party service)',
      'Make sure customers know the option exists',
    ],
    indicators: [
      'Anonymous feedback channel available within 3 months',
      'Anonymous option promoted to customers',
      'Anonymous feedback reviewed on a regular schedule',
    ],
  },
  '4.5-D-8': {
    steps: [
      'Engage people with disabilities in reviewing and improving your services (paid advisory panel, co-design workshops or commissioned reviews)',
      'Ensure participants are compensated',
    ],
    indicators: [
      'People with disability engaged in service review within 12 months',
      'Participants compensated for their input',
      'Their recommendations acted on and tracked',
    ],
  },
  '4.5-D-9': {
    steps: [
      'Commission accessibility audits or mystery visits by people with lived experience of disability, covering physical, sensory, digital and customer service',
      'Act on findings and re-audit annually',
    ],
    indicators: [
      'Lived-experience audit commissioned within 12 months',
      'Findings acted on with a clear plan',
      'Re-audit completed annually',
    ],
  },
  '4.5-D-10': {
    steps: [
      'Benchmark your accessibility performance against industry standards, peer organisations or frameworks (Australia\'s Disability Strategy outcome indicators, AHRC reporting guidance)',
      'Use results to set targets and track progress',
    ],
    indicators: [
      'Accessibility performance benchmarked within 12 months',
      'Targets set from the benchmark',
      'Progress against targets tracked and reported',
    ],
  },

  // ============================================================
  // Module 4.6 - Staying connected
  // ============================================================
  '4.6-F-1': {
    steps: [
      'Audit your marketing emails and newsletters for accessibility (semantic HTML, alt text, colour contrast, single-column layout)',
      'Test with a screen reader before sending',
    ],
    indicators: [
      'Email accessibility audited within 3 months',
      'Accessible email templates in use within 6 months',
      'Screen reader check built into the send process',
    ],
  },
  '4.6-F-2': {
    steps: [
      'Ensure customers can manage communication preferences: frequency, format (HTML, plain text, large print), channel and content interests',
      'Make the preference centre accessible and keyboard navigable',
    ],
    indicators: [
      'Preference centre reviewed within 3 months',
      'Accessible preference management available within 12 months',
      'Preferences applied consistently across channels',
    ],
  },
  '4.6-F-3': {
    steps: [
      'Ensure promotional offers are accessible: available in text (not image-only), redeemable through accessible channels, with clear plain-language terms',
      'Avoid time-limited offers that disadvantage people who need more time',
    ],
    indicators: [
      'Promotional accessibility reviewed within 3 months',
      'Offers available in accessible formats within 6 months',
      'Redemption channels confirmed accessible',
    ],
  },
  '4.6-F-4': {
    steps: [
      'Audit your loyalty or rewards program for accessibility (join and manage with assistive technology, keyboard-navigable signup)',
      'Communicate points and rewards in accessible formats',
    ],
    indicators: [
      'Loyalty program audited within 6 months',
      'Accessible signup and account management provided within 12 months',
      'Rewards communicated in accessible formats',
    ],
  },
  '4.6-D-1': {
    steps: [
      'Offer SMS or text alternatives to email for key communications (appointment reminders, confirmations, service updates, offers)',
      'Allow customers to opt in to SMS as their preferred channel',
    ],
    indicators: [
      'SMS alternative available within 6 months',
      'Customers can opt in to SMS as preferred channel',
      'SMS delivery reviewed on a regular schedule',
    ],
  },
  '4.6-D-2': {
    steps: [
      'Audit your referral program for accessibility (keyboard navigation, screen reader compatibility, non-digital channels)',
      'Make referral codes easy to share in any format',
    ],
    indicators: [
      'Referral program audited within 6 months',
      'Accessible referral process available within 12 months',
      'Referral codes shareable in any format',
    ],
  },
  '4.6-D-3': {
    steps: [
      'Include accessibility information in regular communications (mention accessible facilities in newsletters, highlight new features)',
      'Include access details in event promotions',
    ],
    indicators: [
      'Accessibility information included in communications within 3 months',
      'Access details included in event promotions',
      'Approach reviewed on a regular schedule',
    ],
  },
  '4.6-D-4': {
    steps: [
      'Make social media posts accessible: alt text on images, captions on videos, camelCase hashtags, no information conveyed by colour alone',
      'Write in plain language and avoid flashing or rapidly moving content',
    ],
    indicators: [
      'Social media accessibility reviewed within 3 months',
      'Accessible posting practices adopted within 6 months',
      'Practices included in the social media style guide',
    ],
  },
  '4.6-D-5': {
    steps: [
      'Audit your live chat or online messaging against WCAG 2.2 AA (keyboard navigation, screen reader compatibility, timeout warnings, zoom)',
      'Fix the issues found',
    ],
    indicators: [
      'Live chat audited for WCAG 2.2 AA within 6 months',
      'Critical issues fixed within 12 months',
      'Accessibility re-checked when the tool changes',
    ],
  },
  '4.6-D-6': {
    steps: [
      'Implement a system for storing customer accessibility preferences (seating, communication format, assistance needs) applied automatically on future visits',
      'Store the data securely with customer consent',
    ],
    indicators: [
      'Preference storage implemented within 12 months',
      'Preferences applied automatically on future visits',
      'Data stored securely with consent',
    ],
  },
  '4.6-D-7': {
    steps: [
      'Communicate accessibility improvements to customers (update your website, post on social media, include in newsletters)',
      'Send targeted notifications to customers who previously flagged related needs',
    ],
    indicators: [
      'Improvement-notification approach in place within 6 months',
      'Improvements communicated across channels',
      'Customers who raised issues notified of changes',
    ],
  },
  '4.6-D-8': {
    steps: [
      'Test app push notifications with VoiceOver (iOS) and TalkBack (Android)',
      'Ensure notifications are announced by screen readers, contain meaningful text and link to accessible content',
    ],
    indicators: [
      'Push notifications tested with screen readers within 6 months',
      'Notifications accessible and meaningful within 12 months',
      'Accessibility re-checked with each app release',
    ],
  },
  '4.6-D-9': {
    steps: [
      'Identify key information to provide in Auslan (welcome messages, safety information, service explanations)',
      'Engage qualified Auslan interpreters to produce the content',
    ],
    indicators: [
      'Auslan content need scoped within 6 months',
      'Key information available in Auslan within 24 months',
      'Content produced by qualified interpreters',
    ],
  },
  '4.6-D-10': {
    steps: [
      'Caption all video content to WCAG 2.2 AA accuracy standards',
      'Provide audio description for videos that convey important visual information, across website, social media and in-venue',
    ],
    indicators: [
      'Uncaptioned video identified within 3 months',
      'All new video captioned before publishing',
      'Audio description added to priority videos within 12 months',
    ],
  },
  '4.6-D-11': {
    steps: [
      'Ensure event invitations are accessible (alt text, structured HTML, plain language) with an accessibility requirements field on RSVPs',
      'Send invitations in multiple formats and provide a non-digital RSVP option',
    ],
    indicators: [
      'Event invitation accessibility reviewed within 3 months',
      'Accessible invitations and RSVP options in use within 6 months',
      'Accessibility requirements captured at RSVP',
    ],
  },
  '4.6-D-12': {
    steps: [
      'Create a dedicated accessibility page describing your accessible features, services, equipment and any known limitations',
      'Link to it from your main navigation, footer and Google Business listing, and keep it updated',
    ],
    indicators: [
      'Accessibility page published within 3 months',
      'Linked from navigation, footer and Google Business listing',
      'Page reviewed for accuracy every 6 months',
    ],
  },

  // ============================================================
  // Module 4.7 - Keeping in touch
  // ============================================================
  '4.7-PC-1': {
    steps: [
      'Review your written communications (letters, emails, invoices) against accessibility basics (min 12pt sans-serif, left-aligned, clear headings, plain language, white space)',
      'Update templates to remove justified text and decorative fonts',
    ],
    indicators: [
      'Written communications reviewed within 3 months',
      'Accessible templates in use within 6 months',
      'Standard applied to new communications',
    ],
  },
  '4.7-PC-2': {
    steps: [
      'Design emails for accessibility: semantic HTML headings, alt text, readable with images disabled, plain-text version, sufficient contrast, meaningful link text',
      'Test them before sending',
    ],
    indicators: [
      'Email accessibility reviewed within 3 months',
      'Accessible email design in use within 6 months',
      'Screen reader check built into the send process',
    ],
  },
  '4.7-PC-3': {
    steps: [
      'Create PDFs accessibly: tagged structure, heading hierarchy, alt text, meaningful links, specified language and logical reading order, using PDF/UA as the benchmark',
      'Never distribute scanned image-only PDFs',
    ],
    indicators: [
      'PDF accessibility reviewed within 3 months',
      'New PDFs created to PDF/UA within 6 months',
      'No image-only PDFs distributed',
    ],
  },
  '4.7-PC-4': {
    steps: [
      'Create accessible email templates for common communications (confirmations, receipts, newsletters, updates) with heading structure, alt text placeholders, high contrast and meaningful links',
      'Test each with a screen reader before use',
    ],
    indicators: [
      'Accessible email templates created within 6 months',
      'Templates tested with a screen reader',
      'Staff use the accessible templates by default',
    ],
  },
  '4.7-PC-5': {
    steps: [
      'Create accessible Word and InDesign templates for common document types (letters, reports, flyers, menus, forms) with pre-set heading styles, alt text prompts, accessible palettes and min 12pt body text',
      'Roll them out as the default for staff',
    ],
    indicators: [
      'Accessible document templates created within 6 months',
      'Templates adopted as the default within 12 months',
      'Templates reviewed and updated as needs change',
    ],
  },
  '4.7-PC-6': {
    steps: [
      'Establish a process for providing important documents in alternative formats on request (large print min 18pt, audio, Easy Read, Braille, tagged PDF/HTML)',
      'Set turnaround time targets',
    ],
    indicators: [
      'Alternative-format process in place within 6 months',
      'Requests fulfilled within the set turnaround targets',
      'Process reviewed via customer feedback',
    ],
  },
  '4.7-PC-7': {
    steps: [
      'Record customer communication preferences (format, channel, font size) in your CRM',
      'Apply them automatically to ongoing correspondence, flagged so all staff can see and follow them',
    ],
    indicators: [
      'Communication preferences recorded within 6 months',
      'Preferences applied to ongoing correspondence',
      'Preferences visible to all relevant staff',
    ],
  },
  '4.7-PC-8': {
    steps: [
      'Audit your subscription and unsubscribe process for accessibility (keyboard navigation, screen reader compatibility, clear confirmations, accessible preference centre)',
      'Simplify unsubscribe to avoid multi-step login requirements',
    ],
    indicators: [
      'Subscription and unsubscribe process audited within 3 months',
      'Accessible, simple subscription management provided within 6 months',
      'Accessibility re-checked when the tool changes',
    ],
  },
  '4.7-DD-1a': {
    steps: [
      'Conduct an accessibility review of all customer-facing written communications (letters, emails, invoices, receipts, forms, policies, terms)',
      'Check for plain language, font size, heading structure and alternative format availability',
    ],
    indicators: [
      'Written communications reviewed within 6 months',
      'Priority communications remediated within 12 months',
      'Accessible creation set as the default',
    ],
  },
  '4.7-DD-2a': {
    steps: [
      'Test your customer emails with a screen reader (NVDA or VoiceOver) and with images disabled',
      'Verify keyboard navigation and contrast on desktop and mobile',
    ],
    indicators: [
      'Email accessibility testing completed within 3 months',
      'Issues found fixed within 6 months',
      'Testing built into the email production process',
    ],
  },
  '4.7-DD-3a': {
    steps: [
      'Identify all document types you produce and assess which are created accessibly',
      'Remediate the most frequently used first and make accessible creation the default',
    ],
    indicators: [
      'Document types assessed for accessibility within 6 months',
      'Most-used documents remediated within 12 months',
      'Accessible creation set as the default',
    ],
  },
  '4.7-DD-3b': {
    steps: [
      'Create accessible document templates with built-in heading styles, alt text prompts and correct table structure',
      'Add an accessibility checklist to your document review process',
    ],
    indicators: [
      'Accessible document templates provided within 6 months',
      'Accessibility checklist added to document review',
      'Staff use the templates and checklist consistently',
    ],
  },
  '4.7-DD-4a': {
    steps: [
      'Create accessible email templates for each communication type (transactional, marketing, service)',
      'Test each with a screen reader before deployment',
    ],
    indicators: [
      'Accessible email templates created for each type within 6 months',
      'Templates tested with a screen reader',
      'Templates used by default for each communication type',
    ],
  },
  '4.7-DD-5a': {
    steps: [
      'Create accessible templates for all document types staff produce (letters, reports, proposals, flyers, menus, forms, signage)',
      'Include built-in heading styles, accessible palettes, alt text prompts and minimum font sizes',
    ],
    indicators: [
      'Accessible templates provided for all document types within 12 months',
      'Templates adopted as the default',
      'Templates reviewed and updated as needs change',
    ],
  },
  '4.7-DD-6a': {
    steps: [
      'Document a process for alternative format requests (who receives it, turnaround targets, approved suppliers, tracking)',
      'Set targets (48 hours large print, 5 days Easy Read, 10 days Braille)',
    ],
    indicators: [
      'Alternative-format request process documented within 3 months',
      'Requests fulfilled within the set targets',
      'Requests tracked to completion',
    ],
  },
  '4.7-DD-7a': {
    steps: [
      'Store customer communication preferences in your CRM, booking system or database (preferred format, channel and specific needs)',
      'Make them visible to staff before contact',
    ],
    indicators: [
      'Communication preferences stored within 6 months',
      'Preferences visible to staff before contact',
      'Preference data reviewed for completeness',
    ],
  },
  '4.7-DD-7b': {
    steps: [
      'Configure your systems to automatically apply customer communication preferences (e.g. generate large-print versions by default)',
      'Where automation is not possible, implement staff checklists',
    ],
    indicators: [
      'Automatic preference application configured within 12 months',
      'Preferences applied automatically where possible',
      'Staff checklists in place where automation is not possible',
    ],
  },
  '4.7-DD-8a': {
    steps: [
      'Test your mailing list subscription and unsubscribe process with keyboard and screen reader, including confirmation emails and the preference centre',
      'Fix any barriers found',
    ],
    indicators: [
      'Subscription and unsubscribe process tested within 3 months',
      'Barriers found fixed within 6 months',
      'Accessibility re-checked when the process changes',
    ],
  },

  // ============================================================
  // Module 5.1 - Policy and inclusion
  // ============================================================
  '5.1-F-1': {
    steps: [
      'Develop a formal accessibility or disability inclusion policy referencing the DDA 1992 as the legal baseline',
      'Align it with AHRC guidance on inclusive service delivery and communicate it to staff',
    ],
    indicators: [
      'Accessibility policy documented within 6 months',
      'Policy communicated to all staff',
      'Policy reviewed at least annually',
    ],
  },
  '5.1-F-3': {
    steps: [
      'Develop a Disability Inclusion Action Plan (DIAP) with measurable targets, timeframes and accountability',
      'Use the AHRC framework or your state disability inclusion legislation as a guide',
    ],
    indicators: [
      'DIAP developed within 12 months',
      'Targets, timeframes and owners assigned',
      'Progress against the DIAP reported to leadership',
    ],
  },
  '5.1-F-4': {
    steps: [
      'Register as a Companion Card affiliate with your state or territory program',
      'Train staff to accept it so carers and support people attend free of charge',
    ],
    indicators: [
      'Companion Card affiliation in place within 6 months',
      'Staff trained to accept the card',
      'Companion concession applied consistently',
    ],
  },
  '5.1-F-5': {
    steps: [
      'Introduce concession pricing for people with disability (free or discounted entry for Companion Card holders, pensioners, NDIS participants)',
      'Make the pricing clear and easy to find',
    ],
    indicators: [
      'Concession pricing introduced within 6 months',
      'Pricing published clearly and easy to find',
      'Uptake reviewed on a regular schedule',
    ],
  },
  '5.1-F-6': {
    steps: [
      'Establish a formal assistance animal policy aligned with the DDA 1992 and state legislation (refusing entry is unlawful)',
      'Train all staff on their obligations, including recognising different types of accreditation',
    ],
    indicators: [
      'Assistance animal policy documented within 3 months',
      'All staff trained on the policy',
      'Policy reviewed at least annually',
    ],
  },
  '5.1-F-7': {
    steps: [
      'Establish a single accessibility information register covering physical access, sensory access, communication options, support services and exceptions',
      'Map every customer-facing channel to it as a downstream reference',
    ],
    indicators: [
      'Accessibility information register established within 6 months',
      'All customer-facing channels reference the register',
      'Register kept current by a named owner',
    ],
  },
  '5.1-D-6': {
    steps: [
      'Include accessibility considerations in your marketing and communications strategy, with diverse representation including people with disability',
      'Produce all content in accessible formats',
    ],
    indicators: [
      'Accessibility built into the marketing strategy within 6 months',
      'Diverse representation featured in marketing',
      'Marketing content produced in accessible formats',
    ],
  },
  '5.1-D-7': {
    steps: [
      'Establish formal mechanisms to engage people with disability in service planning and review (advisory committee, consultation sessions, co-design workshops)',
      'Compensate participants and act on their input',
    ],
    indicators: [
      'Engagement mechanism established within 12 months',
      'Participants compensated for their input',
      'Recommendations acted on and tracked',
    ],
  },
  '5.1-D-8': {
    steps: [
      'Implement a system to track accessibility improvements over time (what changed, when, impact)',
      'Report progress to leadership at least quarterly',
    ],
    indicators: [
      'Improvement tracking system in place within 6 months',
      'Improvements logged with impact',
      'Progress reported to leadership at least quarterly',
    ],
  },
  '5.1-D-9': {
    steps: [
      'Appoint a senior leader as executive sponsor for accessibility',
      'Give the role authority to allocate resources, champion accessibility at board level and hold teams accountable',
    ],
    indicators: [
      'Executive sponsor appointed within 3 months',
      'Sponsor has authority over resources and accountability',
      'Sponsor reports on accessibility to the board',
    ],
  },
  '5.1-D-10': {
    steps: [
      'Allocate a dedicated budget line for accessibility improvements',
      'Include both capital works and ongoing operational costs',
    ],
    indicators: [
      'Dedicated accessibility budget allocated within 12 months',
      'Budget covers capital and operational costs',
      'Budget reviewed each planning cycle',
    ],
  },
  '5.1-D-11': {
    steps: [
      'Brief all staff on obligations under the DDA 1992, relevant state anti-discrimination legislation and the Premises Standards where applicable',
      'Make this part of mandatory induction',
    ],
    indicators: [
      'Staff briefed on legal obligations within 6 months',
      'Obligations included in mandatory induction',
      'Refresher completed periodically',
    ],
  },
  '5.1-D-12': {
    steps: [
      'Establish a formal process for handling accessibility-related complaints (logging, investigating, resolving, following up)',
      'Ensure the process itself is accessible (multiple contact methods, accessible forms, plain language)',
    ],
    indicators: [
      'Complaints process documented within 3 months',
      'Process itself is accessible',
      'Complaints resolved within set timeframes',
    ],
  },
  '5.1-D-13': {
    steps: [
      'Investigate accessibility accreditation or certification relevant to your sector (registering a DIAP with the AHRC, sector programs, Australia\'s Disability Strategy alignment)',
      'Pursue the option that best fits and provides a framework for improvement',
    ],
    indicators: [
      'Accreditation options investigated within 12 months',
      'A suitable accreditation or framework adopted',
      'Progress against the framework tracked',
    ],
  },
  '5.1-D-14': {
    steps: [
      'Add accessibility as a standing item on your board or senior leadership meeting agenda',
      'Provide regular reporting to ensure strategic visibility and accountability',
    ],
    indicators: [
      'Accessibility a standing agenda item within 3 months',
      'Regular reporting provided at board level',
      'Decisions and actions tracked to completion',
    ],
  },
  '5.1-D-15': {
    steps: [
      'Expand your DIAP to cover service delivery, employment, community engagement and organisational culture',
      'Use the AHRC DIAP framework to ensure no area is overlooked',
    ],
    indicators: [
      'DIAP scope expanded within 12 months',
      'All key areas covered against the AHRC framework',
      'Coverage reviewed each DIAP cycle',
    ],
  },
  '5.1-D-16': {
    steps: [
      'Create clear progression pathways into leadership for people with disability (mentoring and sponsorship, inclusive promotion and selection criteria, leadership development)',
      'Set representation targets and track progress',
    ],
    indicators: [
      'Leadership progression pathways established within 12 months',
      'Representation targets set and tracked',
      'Progress reviewed with leadership annually',
    ],
  },
  '5.1-D-17': {
    steps: [
      'Make key information available in alternative formats without a specific request (Easy Read, large print, Auslan video, audio description, accessible digital)',
      'Advertise format availability',
    ],
    indicators: [
      'Key information available in alternative formats within 12 months',
      'Format availability advertised',
      'Formats updated whenever the standard version changes',
    ],
  },
  '5.1-D-18': {
    steps: [
      'Publish an accessibility statement on your website covering current features, known limitations, planned improvements and how to request assistance',
      'Follow WCAG 2.2 guidance on accessibility statements',
    ],
    indicators: [
      'Accessibility statement published within 3 months',
      'Statement covers features, limitations and how to get help',
      'Statement reviewed for accuracy every 6 months',
    ],
  },
  '5.1-D-19': {
    steps: [
      'Extend your accessibility policy to explicitly cover all digital channels (website, apps, social media, online booking, email, kiosks)',
      'Reference WCAG 2.2 Level AA as the minimum standard for web content',
    ],
    indicators: [
      'Policy extended to digital channels within 6 months',
      'WCAG 2.2 AA set as the minimum standard',
      'Digital accessibility reviewed against the policy',
    ],
  },
  '5.1-D-20': {
    steps: [
      'Add accessibility to your risk register and business continuity planning (DDA non-compliance, inaccessible emergency procedures, digital failures, reputational impact)',
      'Assign risk owners and mitigation actions',
    ],
    indicators: [
      'Accessibility risks added to the register within 6 months',
      'Risk owners and mitigations assigned',
      'Risks reviewed each risk cycle',
    ],
  },
  '5.1-D-21': {
    steps: [
      'Name a specific role (not a committee) as owner of the accessibility register',
      'Establish a monthly review cadence and quarterly full audit, documenting leave cover',
    ],
    indicators: [
      'Register owner named within 1 month',
      'Monthly review and quarterly audit cadence in place',
      'Leave cover documented',
    ],
  },
  '5.1-D-22': {
    steps: [
      'Document a change-propagation process listing every channel that publishes accessibility information',
      'Set a 24-hour SLA for updates after any access change, including third-party listings',
    ],
    indicators: [
      'Change-propagation process documented within 3 months',
      'All access changes propagated within 24 hours',
      'Third-party listings kept current',
    ],
  },

  // ============================================================
  // Module 5.3 - Staff training and awareness
  // ============================================================
  '5.3-F-1': {
    steps: [
      'Implement disability awareness training for all customer-facing staff, developed or delivered by people with lived experience',
      'Cover respectful communication, common barriers, assistance animal obligations and how to offer help appropriately',
    ],
    indicators: [
      'Disability awareness training delivered within 6 months',
      'Training drawn on lived experience',
      'All customer-facing staff trained',
    ],
  },
  '5.3-F-2': {
    steps: [
      'Add disability awareness to your staff onboarding program (legal obligations under the DDA 1992, your accessibility policy, respectful communication)',
      'Include where to find accessibility resources and support',
    ],
    indicators: [
      'Disability awareness added to onboarding within 3 months',
      'All new staff complete it before customer contact',
      'Onboarding content reviewed annually',
    ],
  },
  '5.3-F-3': {
    steps: [
      'Ensure all relevant staff can operate the accessibility features and equipment at your venue',
      'Create a quick-reference guide covering each item, its location and basic operation',
    ],
    indicators: [
      'Staff trained on accessibility features within 3 months',
      'Quick-reference guide available to staff',
      'Included in induction for new staff',
    ],
  },
  '5.3-D-1': {
    steps: [
      'Schedule regular disability training refreshers, at minimum annually',
      'Update content as standards, technology and best practice evolve',
    ],
    indicators: [
      'Refresher schedule in place within 3 months',
      'Refresher completed at least annually',
      'Content kept current with standards and practice',
    ],
  },
  '5.3-D-3': {
    steps: [
      'Create an internal resource hub or toolkit with quick-reference guides, external links (JobAccess, AHRC) and your accessibility policies',
      'Keep it current and accessible to all staff',
    ],
    indicators: [
      'Accessibility resource hub available within 6 months',
      'Staff can access resources when needed',
      'Hub reviewed and updated on a regular schedule',
    ],
  },
  '5.3-D-4': {
    steps: [
      'Expand training to cover hidden and non-apparent disabilities (chronic pain, mental health, autism, ADHD, learning disabilities, epilepsy, chronic fatigue)',
      'Emphasise that most disabilities are not visible',
    ],
    indicators: [
      'Hidden disabilities covered in training within 6 months',
      'Staff understand non-apparent disabilities, confirmed via evaluation',
      'Included in induction for new staff',
    ],
  },
  '5.3-D-5': {
    steps: [
      'Include practical communication techniques in training (speak directly to the person, offer assistance without assuming, plain language, facing Deaf people, AAC)',
      'Reinforce them with practice',
    ],
    indicators: [
      'Communication techniques included in training within 6 months',
      'Techniques used in practice, confirmed via feedback',
      'Included in induction for new staff',
    ],
  },
  '5.3-D-6': {
    steps: [
      'Include disability-specific scenarios in your emergency evacuation training',
      'Ensure training covers the procedures and equipment in your emergency preparedness plan',
    ],
    indicators: [
      'Disability scenarios in evacuation training within 6 months',
      'Training aligned to the emergency plan',
      'Practised in drills at least annually',
    ],
  },
  '5.3-D-7': {
    steps: [
      'Implement evaluation of disability training effectiveness beyond satisfaction surveys (observe interactions, survey customers with disability, track complaint trends)',
      'Use the results to improve training',
    ],
    indicators: [
      'Training effectiveness evaluation in place within 6 months',
      'Behaviour change measured, not just satisfaction',
      'Findings used to improve training',
    ],
  },
  '5.3-D-8': {
    steps: [
      'Designate and publicise a clear point of contact for accessibility advice (accessibility champion, dedicated role or external advisory service)',
      'Ensure staff know how to reach them',
    ],
    indicators: [
      'Accessibility contact designated within 3 months',
      'Contact publicised to all staff',
      'Staff use the contact when they need advice',
    ],
  },
  '5.3-D-9': {
    steps: [
      'Include Auslan and Deaf communication awareness in training (basic greetings, booking an interpreter, the National Relay Service, communication tips)',
      'Provide a quick-reference for staff',
    ],
    indicators: [
      'Auslan and Deaf awareness in training within 6 months',
      'Staff able to book an interpreter and use the NRS',
      'Quick-reference available to staff',
    ],
  },
  '5.3-D-10': {
    steps: [
      'Add autism and neurodivergence training (sensory sensitivities, communication preferences, predictability, social stories, quiet spaces)',
      'Cover how to respond supportively during sensory overload',
    ],
    indicators: [
      'Autism and neurodivergence covered in training within 6 months',
      'Staff respond supportively, confirmed via feedback',
      'Included in induction for new staff',
    ],
  },
  '5.3-D-11': {
    steps: [
      'Extend disability awareness training to contractors, casuals and agency staff',
      'Provide an abbreviated accessibility induction as a minimum for short-term staff',
    ],
    indicators: [
      'Training extended to contractors and casuals within 6 months',
      'Short-term staff complete an accessibility induction',
      'Coverage tracked across all staff types',
    ],
  },
  '5.3-D-12': {
    steps: [
      'Include assistive technology awareness in training (screen readers, magnification, hearing aids and cochlear implants and their interaction with hearing loops, mobility aids, communication devices)',
      'Reinforce it with practical examples',
    ],
    indicators: [
      'Assistive technology covered in training within 6 months',
      'Staff understand common assistive technologies',
      'Included in induction for new staff',
    ],
  },
  '5.3-D-13': {
    steps: [
      'Incorporate practical scenarios and role-playing exercises into disability training, using realistic venue-specific situations',
      'Debrief to reinforce learning',
    ],
    indicators: [
      'Practical scenarios included in training within 6 months',
      'Staff report increased confidence, confirmed via survey',
      'Scenarios kept relevant to your venue and services',
    ],
  },

  // ============================================================
  // Module 5.4 - Accessible procurement
  // ============================================================
  '5.4-F-1': {
    steps: [
      'Integrate accessibility criteria into your supplier and partner selection process as a weighted evaluation criterion',
      'Weight it alongside price, quality and delivery',
    ],
    indicators: [
      'Accessibility criteria added to supplier selection within 6 months',
      'Accessibility weighted in evaluations',
      'Approach reviewed each procurement cycle',
    ],
  },
  '5.4-F-2': {
    steps: [
      'Add accessibility requirements to all contracts and tenders, specifying standards (WCAG 2.2 AA for digital, AS 1428.1 for physical)',
      'Require compliance evidence and include remediation clauses',
    ],
    indicators: [
      'Accessibility requirements in contracts and tenders within 6 months',
      'Compliance evidence required and checked',
      'Remediation clauses enforced where needed',
    ],
  },
  '5.4-D-1': {
    steps: [
      'Include accessibility questions in your supplier assessment (accessibility policy, WCAG compliance, physical accessibility, employment of people with disability)',
      'Use the responses in your selection decision',
    ],
    indicators: [
      'Accessibility questions added to supplier assessment within 6 months',
      'Responses factored into selection',
      'Approach reviewed each procurement cycle',
    ],
  },
  '5.4-D-2': {
    steps: [
      'Give preference to suppliers with strong accessibility practices where capability and price are comparable',
      'Make the preference explicit in your evaluation criteria',
    ],
    indicators: [
      'Accessibility preference in evaluation criteria within 6 months',
      'Preference applied in comparable bids',
      'Impact reviewed on a regular schedule',
    ],
  },
  '5.4-D-3': {
    steps: [
      'Implement accessibility verification for delivered products and services (WCAG 2.2 AA for digital, AS 1428.1 for physical works)',
      'Include people with disability in user acceptance testing where possible',
    ],
    indicators: [
      'Accessibility verification process in place within 6 months',
      'Deliverables verified against the relevant standard',
      'People with disability involved in testing where possible',
    ],
  },
  '5.4-D-4': {
    steps: [
      'Review your supply categories for products and services suitable to source from Australian Disability Enterprises (ADEs) or disability-led businesses',
      'Use the DSS information on ADE programs and pathways to find suppliers',
    ],
    indicators: [
      'ADE and disability-led supply opportunities identified within 6 months',
      'At least one category sourced from an ADE or disability-led business within 12 months',
      'Opportunities reviewed each procurement cycle',
    ],
  },
  '5.4-D-5': {
    steps: [
      'Apply EN 301 549 or equivalent ICT accessibility standards when purchasing technology, requiring WCAG 2.2 AA for web products',
      'Request VPATs or Accessibility Conformance Reports from vendors',
    ],
    indicators: [
      'ICT accessibility standards applied to purchasing within 6 months',
      'VPATs or conformance reports requested and reviewed',
      'Standard applied to all new technology purchases',
    ],
  },
  '5.4-D-6': {
    steps: [
      'Include physical accessibility as a mandatory criterion when selecting event venues or partner locations',
      'Use an accessibility checklist (entrances, pathways, toilets, hearing augmentation, signage, emergency egress) before confirming any venue',
    ],
    indicators: [
      'Venue accessibility checklist in use within 3 months',
      'Physical accessibility checked before confirming any venue',
      'Checklist kept current with standards',
    ],
  },
  '5.4-D-7': {
    steps: [
      'Include people with accessibility expertise in procurement decision-making (internal specialist, external consultant or advisory panel including people with disability)',
      'Use their input on specification and evaluation',
    ],
    indicators: [
      'Accessibility expertise included in procurement within 6 months',
      'Input used on specifications and evaluations',
      'Approach reviewed each procurement cycle',
    ],
  },
  '5.4-D-8': {
    steps: [
      'Implement regular accessibility reviews of ongoing suppliers and partners (contract renewals, annual reviews, performance assessments)',
      'Address any decline in standards through formal contract management',
    ],
    indicators: [
      'Ongoing supplier accessibility reviews in place within 6 months',
      'Accessibility included in renewals and reviews',
      'Declines addressed through contract management',
    ],
  },
  '5.4-D-9': {
    steps: [
      'Require key partners and suppliers to demonstrate their own accessibility commitments (policy, DIAP or accreditation evidence)',
      'Factor this into partner selection and renewal',
    ],
    indicators: [
      'Partner accessibility commitments requested within 6 months',
      'Commitments factored into selection and renewal',
      'Shared commitment reviewed on a regular schedule',
    ],
  },
  '5.4-D-10': {
    steps: [
      'Set social procurement targets for purchasing from disability enterprises (even 3-5% of addressable spend)',
      'Track and report progress against the targets',
    ],
    indicators: [
      'Social procurement targets set within 12 months',
      'Spend with disability enterprises tracked',
      'Progress against targets reported to leadership',
    ],
  },
  '5.4-D-11': {
    steps: [
      'Review your procurement and tendering processes for accessibility (accessible tender documents, assistive-technology-compatible portals, accessible briefing venues)',
      'Provide alternative submission methods',
    ],
    indicators: [
      'Procurement process accessibility reviewed within 6 months',
      'Accessible tender documents and portals provided within 12 months',
      'Alternative submission methods available',
    ],
  },
  '5.4-D-12': {
    steps: [
      'Factor accessibility into total cost-of-ownership calculations',
      'Include remediation, support and potential complaint or legal costs, not just purchase price',
    ],
    indicators: [
      'Accessibility included in total cost-of-ownership within 6 months',
      'Remediation and support costs factored into evaluations',
      'Approach applied to major purchases',
    ],
  },

  // ============================================================
  // Module 5.5 - Continuous improvement and reporting
  // ============================================================
  '5.5-F-1': {
    steps: [
      'Establish a regular cadence (at least quarterly) for reviewing accessibility performance (complaint trends, DIAP progress, audit findings, customer feedback)',
      'Use the results to adjust priorities and allocate resources',
    ],
    indicators: [
      'Regular accessibility performance review in place within 3 months',
      'Review held at least quarterly',
      'Findings used to adjust priorities',
    ],
  },
  '5.5-F-2': {
    steps: [
      'Set specific, measurable, time-bound accessibility improvement goals linked to your DIAP or strategic plan',
      'Track progress against them',
    ],
    indicators: [
      'Accessibility improvement goals set within 6 months',
      'Goals measurable and time-bound',
      'Progress tracked and reported',
    ],
  },
  '5.5-F-3': {
    steps: [
      'Implement regular reporting on accessibility progress to leadership and stakeholders (DIAP progress, complaints, audits, training, budget)',
      'Consider publishing an annual accessibility progress report',
    ],
    indicators: [
      'Regular accessibility reporting in place within 6 months',
      'Reports provided to leadership on a regular schedule',
      'An annual progress report published',
    ],
  },
  '5.5-D-1': {
    steps: [
      'Implement a regular accessibility audit program (physical against AS 1428.1, digital against WCAG 2.2 AA, service delivery)',
      'Engage people with disability as auditors where possible',
    ],
    indicators: [
      'Accessibility audit program in place within 12 months',
      'Physical, digital and service audits completed',
      'People with disability involved where possible',
    ],
  },
  '5.5-D-2': {
    steps: [
      'Define and track accessibility KPIs (WCAG 2.2 AA coverage, physical access compliance, training completion, complaint resolution time, satisfaction)',
      'Report them on a regular schedule',
    ],
    indicators: [
      'Accessibility KPIs defined within 6 months',
      'KPIs tracked and reported regularly',
      'KPIs used to prioritise improvements',
    ],
  },
  '5.5-D-3': {
    steps: [
      'Publish accessibility information publicly (annual accessibility report, DIAP and progress updates, accessibility statement)',
      'Consider registering the DIAP with the AHRC and reporting against Australia\'s Disability Strategy',
    ],
    indicators: [
      'Accessibility information published publicly within 12 months',
      'Progress updates published on a regular schedule',
      'Reporting aligned to a recognised framework',
    ],
  },
  '5.5-D-4': {
    steps: [
      'Benchmark your accessibility against industry standards and peer organisations',
      'Align with Australia\'s Disability Strategy outcome indicators and use a relevant maturity framework',
    ],
    indicators: [
      'Accessibility benchmarked within 12 months',
      'Targets set from the benchmark',
      'Progress against peers tracked',
    ],
  },
  '5.5-D-5': {
    steps: [
      'Implement a systematic process for learning from accessibility complaints and incidents (root cause analysis, systemic issues, corrective actions)',
      'Share learnings across the organisation to prevent recurrence',
    ],
    indicators: [
      'Learning process for complaints in place within 6 months',
      'Root causes analysed and corrective actions taken',
      'Recurrence of the same issues reduced over time',
    ],
  },
  '5.5-D-6': {
    steps: [
      'Commission an external accessibility audit or review by qualified access consultants (physical, digital, service delivery)',
      'Act on the findings and benchmark performance',
    ],
    indicators: [
      'External accessibility audit commissioned within 12 months',
      'Findings acted on with a clear plan',
      'Re-audit scheduled to confirm progress',
    ],
  },
  '5.5-D-7': {
    steps: [
      'Establish ongoing engagement with disability organisations and community groups (advisory panel, consultation sessions, partnership with peak bodies)',
      'Compensate participants for their time and expertise',
    ],
    indicators: [
      'Ongoing community engagement established within 12 months',
      'Participants compensated for their input',
      'Their input acted on and tracked',
    ],
  },
  '5.5-D-8': {
    steps: [
      'Establish processes to stay informed about emerging accessibility practices and technology (sector publications, AHRC, conferences, Standards Australia)',
      'Feed relevant changes into your plans',
    ],
    indicators: [
      'Horizon-scanning process in place within 6 months',
      'Relevant changes tracked and assessed',
      'Plans updated as standards and practice evolve',
    ],
  },
  '5.5-D-9': {
    steps: [
      'Celebrate accessibility achievements and recognise staff who contribute (internal communications, awards nominations, individual acknowledgement)',
      'Reinforce that accessibility matters',
    ],
    indicators: [
      'Recognition approach in place within 6 months',
      'Achievements celebrated and contributions recognised',
      'Recognition sustained over time',
    ],
  },
  '5.5-D-10': {
    steps: [
      'Implement specific satisfaction measurement for customers with disability (accessibility-specific questions, accessible survey formats)',
      'Consider partnering with disability organisations for independent feedback',
    ],
    indicators: [
      'Disability-specific satisfaction measurement in place within 6 months',
      'Surveys offered in accessible formats',
      'Results used to improve services',
    ],
  },
  '5.5-D-11': {
    steps: [
      'Implement separate tracking and reporting for accessibility-related complaints (tag by type, track resolution times)',
      'Analyse trends and use the data to prioritise improvements',
    ],
    indicators: [
      'Separate accessibility complaint tracking in place within 6 months',
      'Complaints tagged and resolution times tracked',
      'Trends used to prioritise improvements',
    ],
  },
  '5.5-D-12': {
    steps: [
      'Develop a multi-year accessibility roadmap with phased targets (physical works, digital compliance, training maturity, cultural change)',
      'Align it with capital planning and budget cycles',
    ],
    indicators: [
      'Multi-year accessibility roadmap developed within 12 months',
      'Roadmap aligned to capital and budget planning',
      'Roadmap reviewed and updated each cycle',
    ],
  },
  '5.5-D-13': {
    steps: [
      'Share your accessibility learnings and best practices with your industry or sector (conferences, case studies, working groups)',
      'Contribute to sector-specific accessibility guidelines',
    ],
    indicators: [
      'Learnings shared with the sector within 12 months',
      'Contribution made to industry working groups or guidelines',
      'Sharing sustained over time',
    ],
  },

  // ============================================================
  // Module 5.6 - Supplier and third-party accessibility
  // ============================================================
  '5.6-PC-1': {
    steps: [
      'Develop documented accessibility standards for third-party service delivery, with briefing packs covering venue features, customer communication and emergency procedures',
      'Require disability awareness induction for all provider staff',
    ],
    indicators: [
      'Third-party accessibility standards documented within 6 months',
      'Provider staff complete a disability awareness induction',
      'Standards included in provider agreements',
    ],
  },
  '5.6-PC-2': {
    steps: [
      'Test all third-party booking or ticketing platforms for accessibility (screen reader, keyboard) and request VPATs from providers',
      'Offer alternative booking methods (phone, email) for customers who cannot use the platform',
    ],
    indicators: [
      'Third-party booking platforms tested within 6 months',
      'VPATs requested and reviewed',
      'An alternative booking method available',
    ],
  },
  '5.6-PC-3': {
    steps: [
      'Brief all delivery and service partners on your accessibility standards',
      'Include accessibility in SLAs and specify accessible delivery locations and service expectations',
    ],
    indicators: [
      'Delivery and service partners briefed within 6 months',
      'Accessibility included in SLAs',
      'Partner performance reviewed against the standards',
    ],
  },
  '5.6-PC-4': {
    steps: [
      'Include disability awareness in all vendor briefings and induction packs',
      'Observe third-party interactions, collect customer feedback and raise accessibility in vendor reviews',
    ],
    indicators: [
      'Disability awareness in vendor briefings within 6 months',
      'Third-party service observed and feedback collected',
      'Accessibility raised in vendor reviews',
    ],
  },
  '5.6-PC-5': {
    steps: [
      'Establish a single accessibility standard for all service providers on your premises and brief contractors on it',
      'Monitor consistency through observation or mystery shopping and collect customer feedback',
    ],
    indicators: [
      'Single accessibility standard for providers in place within 6 months',
      'Consistency monitored through observation or mystery shopping',
      'Gaps addressed with specific providers',
    ],
  },
  '5.6-D-1': {
    steps: [
      'Add accessibility as a scored criterion in procurement and tender evaluations',
      'Specify DDA compliance, WCAG for digital and disability awareness training as minimum requirements',
    ],
    indicators: [
      'Accessibility scored in procurement within 6 months',
      'Minimum accessibility requirements specified',
      'Criteria applied to all new procurements',
    ],
  },
  '5.6-D-2': {
    steps: [
      'Assess all third-party digital platforms (apps, payment systems, kiosks) against WCAG 2.1 AA, requesting VPATs from providers',
      'Test with screen readers and keyboard navigation',
    ],
    indicators: [
      'Third-party digital platforms assessed within 6 months',
      'VPATs obtained and issues raised with providers',
      'Assessment repeated when platforms change',
    ],
  },
  '5.6-D-3': {
    steps: [
      'Create an accessibility induction sheet for all contractors, temporary staff and event vendors',
      'Include it in your standard site induction alongside safety procedures',
    ],
    indicators: [
      'Accessibility induction sheet created within 3 months',
      'Included in the standard site induction',
      'All contractors and vendors complete it',
    ],
  },
  '5.6-D-4': {
    steps: [
      'Establish an accessible feedback process for customers to report accessibility issues with third-party services',
      'Track complaints by provider and address patterns with specific vendors',
    ],
    indicators: [
      'Third-party feedback process in place within 6 months',
      'Complaints tracked by provider',
      'Patterns addressed with specific vendors',
    ],
  },
  '5.6-D-5': {
    steps: [
      'Add accessibility performance as a formal criterion in contract renewals and vendor assessments',
      'Review customer complaints, observation findings and compliance with contractual accessibility clauses',
    ],
    indicators: [
      'Accessibility included in vendor assessments within 6 months',
      'Performance reviewed at renewal',
      'Underperformance addressed through contract management',
    ],
  },
  '5.6-D-6': {
    steps: [
      'Assess all franchise, brand or platform templates (menus, signage, booking forms) for accessibility (font sizes, contrast, digital accessibility, layout)',
      'Raise gaps with the provider',
    ],
    indicators: [
      'Brand and platform templates assessed within 6 months',
      'Gaps raised with the provider',
      'Local accessible alternatives used where the provider cannot fix gaps',
    ],
  },

  // ============================================================
  // Module 5.7 - Inclusive job design and advertising
  // ============================================================
  '5.7-PC-1': {
    steps: [
      'Review all job description templates and identify inherent requirements (genuine, non-negotiable)',
      'Reclassify the rest as desirable and remove requirements like a driver\'s licence unless core to the role',
    ],
    indicators: [
      'Job description templates reviewed within 6 months',
      'Inherent requirements separated from desirable ones',
      'Non-essential requirements removed from ads',
    ],
  },
  '5.7-PC-2': {
    steps: [
      'Rewrite ad templates in plain language and test readability before posting',
      'Commit to disclosing salary ranges on all ads',
    ],
    indicators: [
      'Ad templates rewritten in plain language within 6 months',
      'Salary ranges disclosed on all ads',
      'Readability tested before posting',
    ],
  },
  '5.7-PC-3': {
    steps: [
      'Add a named-contact access statement to every ad template, inviting candidates to request adjustments',
      'Offer multiple formats and contact methods, and make clear disclosure is not required',
    ],
    indicators: [
      'Access statement on every ad template within 3 months',
      'A named contact provided for adjustment requests',
      'Requests actioned promptly',
    ],
  },
  '5.7-PC-4': {
    steps: [
      'Identify one or two DES providers or disability-led networks for your sector',
      'Build ongoing relationships and advertise roles through them, not one-off posts',
    ],
    indicators: [
      'Disability-led advertising channels identified within 6 months',
      'Roles advertised through them ongoing',
      'Reach and outcomes reviewed on a regular schedule',
    ],
  },
  '5.7-PC-5': {
    steps: [
      'Test your ATS with a screen reader and keyboard only and document failures',
      'Offer a named alternative application path on every ad and request VPATs from vendors at renewal',
    ],
    indicators: [
      'Application process tested for accessibility within 6 months',
      'An alternative application path offered on every ad',
      'Vendor VPATs requested at renewal',
    ],
  },
  '5.7-PC-6': {
    steps: [
      'Plan a careers content update, inviting Disabled staff to contribute (paid)',
      'Replace generic DEI statements with visible, authentic representation',
    ],
    indicators: [
      'Careers content update planned within 6 months',
      'Authentic disability representation featured within 12 months',
      'Contributors compensated for their input',
    ],
  },
  '5.7-DD-1': {
    steps: [
      'Name a reviewer responsible for signing off inherent requirements before a role is advertised',
      'Add a short sign-off step to the hiring workflow',
    ],
    indicators: [
      'Sign-off owner named within 3 months',
      'Inherent requirements signed off before advertising',
      'Sign-off step embedded in the hiring workflow',
    ],
  },
  '5.7-DD-2': {
    steps: [
      'Add a flexibility review to the pre-advertising checklist for every role',
      'Consider part-time, job-share or flexible arrangements before advertising full-time only',
    ],
    indicators: [
      'Flexibility review added to the checklist within 3 months',
      'Every role considered for flexibility before advertising',
      'Flexible arrangements offered where feasible',
    ],
  },
  '5.7-DD-3': {
    steps: [
      'Offer job ads and application information in plain text email as a minimum',
      'Plan Easy Read and Auslan versions for high-volume or strategic roles',
    ],
    indicators: [
      'Plain text application information available within 3 months',
      'Easy Read and Auslan planned for key roles',
      'Alternative formats provided on request',
    ],
  },
  '5.7-DD-4': {
    steps: [
      'Pilot CV-blind or name-blind shortlisting on two or three high-volume roles',
      'Measure the change in shortlist diversity',
    ],
    indicators: [
      'Blind shortlisting piloted within 12 months',
      'Shortlist diversity change measured',
      'Approach scaled where it improves outcomes',
    ],
  },
  '5.7-DD-5': {
    steps: [
      'Draft a recruiter accessibility brief covering your standards and access statement wording',
      'Share it with existing agencies and add a clause at the next contract renewal',
    ],
    indicators: [
      'Recruiter accessibility brief drafted within 3 months',
      'Shared with all current agencies',
      'Accessibility clause added at renewal',
    ],
  },
  '5.7-DD-6': {
    steps: [
      'Extend your inclusive advertising templates and standards to volunteer, casual, contractor and intern advertising',
      'Apply them consistently across all advertising',
    ],
    indicators: [
      'Standards extended to all advertising types within 6 months',
      'Templates applied consistently',
      'Coverage reviewed on a regular schedule',
    ],
  },
  '5.7-DD-7': {
    steps: [
      'Pull ABS disability prevalence for your sector and compare it to your last 12 months of applicant data',
      'Review applicant diversity (disclosure, shortlist, offer) annually against the benchmark',
    ],
    indicators: [
      'Applicant diversity benchmarked within 12 months',
      'Diversity reviewed annually against the benchmark',
      'Findings used to improve recruitment',
    ],
  },
  '5.7-DD-8': {
    steps: [
      'Add careers page, employer-brand video and candidate testimonial content to the annual accessibility audit scope',
      'Audit the ATS portal specifically against WCAG 2.2 AA',
    ],
    indicators: [
      'Careers content added to the audit scope within 6 months',
      'Careers content and ATS audited annually against WCAG 2.2 AA',
      'Issues found remediated',
    ],
  },
  '5.7-DD-9': {
    steps: [
      'Identify one disability-led or sector-specific partner and scope a small pilot (two or three placements)',
      'Measure the outcomes and scale what works',
    ],
    indicators: [
      'Pipeline partner identified within 12 months',
      'A small pilot placement program run',
      'Outcomes measured and the program scaled where successful',
    ],
  },

  // ============================================================
  // Module 5.8 - Accessible interviews and selection
  // ============================================================
  '5.8-PC-1': {
    steps: [
      'Update the interview SOP to send questions 24-48 hours in advance to every shortlisted candidate',
      'Train hiring managers on the rationale',
    ],
    indicators: [
      'Interview SOP updated within 3 months',
      'Questions sent in advance to all shortlisted candidates',
      'Hiring managers briefed on the practice',
    ],
  },
  '5.8-PC-2': {
    steps: [
      'Add a choice of interview format (in person, video, phone, written) to the interview SOP',
      'Train panels to run each format fairly and review scoring rubrics for format neutrality',
    ],
    indicators: [
      'Format choice added to the interview SOP within 3 months',
      'Panels able to run each format fairly',
      'Scoring rubrics checked for format neutrality',
    ],
  },
  '5.8-PC-3': {
    steps: [
      'Audit all interview venues and document their access (entry, lift, accessible toilet, parking)',
      'Add access information to every interview invitation by default',
    ],
    indicators: [
      'Interview venue access documented within 3 months',
      'Access information included in every invitation',
      'Venue access re-checked if venues change',
    ],
  },
  '5.8-PC-4': {
    steps: [
      'Schedule disability-confident interviewing and lawful-questioning training for interview panels',
      'Require completion before interviewing',
    ],
    indicators: [
      'Panel training scheduled within 3 months',
      'Panellists trained before interviewing',
      'Refresher completed periodically',
    ],
  },
  '5.8-PC-5': {
    steps: [
      'Identify two or three roles where a panel interview is a weak signal',
      'Design and pilot an alternative (paid work trial, portfolio review, scenario-based task) and measure outcomes over 12 months',
    ],
    indicators: [
      'Roles for alternative assessment identified within 6 months',
      'An alternative assessment piloted within 12 months',
      'Outcomes measured and the approach scaled where it works',
    ],
  },
  '5.8-PC-6': {
    steps: [
      'Add a voluntary disclosure field at application',
      'Build a simple quarterly drop-off report by stage and review it annually with leadership',
    ],
    indicators: [
      'Voluntary disclosure field added within 3 months',
      'Drop-off reported quarterly by stage',
      'Findings reviewed annually with leadership',
    ],
  },
  '5.8-DD-1': {
    steps: [
      'Build behavioural anchors for your most-used interview questions, starting with one role family',
      'Use the structured rubric to score every interview',
    ],
    indicators: [
      'Behavioural anchors built for key questions within 6 months',
      'Structured rubric used to score interviews',
      'Rubrics extended to more role families over time',
    ],
  },
  '5.8-DD-2': {
    steps: [
      'Add a sensory check to the interview prep checklist (lighting, background noise, camera framing)',
      'Default to captions on video interviews',
    ],
    indicators: [
      'Sensory check added to the prep checklist within 3 months',
      'Captions on by default for video interviews',
      'Sensory conditions confirmed before each interview',
    ],
  },
  '5.8-DD-3': {
    steps: [
      'Add a break offer to the interview open and train panels to honour mid-interview pauses',
      'Offer extended time or multi-session interviews where helpful',
    ],
    indicators: [
      'Break flexibility added to the interview process within 3 months',
      'Breaks and extra time offered as standard',
      'Panels honour pauses, confirmed via candidate feedback',
    ],
  },
  '5.8-DD-4': {
    steps: [
      'Audit your current psychometric, cognitive and technical assessments for disability bias',
      'Replace or supplement the worst offenders',
    ],
    indicators: [
      'Assessment tools audited for bias within 6 months',
      'Biased tools replaced or supplemented within 12 months',
      'New tools checked for bias before use',
    ],
  },
  '5.8-DD-5': {
    steps: [
      'Add the offer to bring a support person, interpreter or advocate to interview invitations',
      'Brief panels on how to work with a support person',
    ],
    indicators: [
      'Support person offer added to invitations within 3 months',
      'Panels briefed on working with support persons',
      'Requests accommodated consistently',
    ],
  },
  '5.8-DD-6': {
    steps: [
      'Introduce a simple reimbursement policy for interview-related costs (travel, support person, care, assistive tech rental) with a modest cap',
      'Communicate it to candidates',
    ],
    indicators: [
      'Interview cost reimbursement policy in place within 6 months',
      'Policy communicated to candidates',
      'Reimbursements processed promptly',
    ],
  },
  '5.8-DD-7': {
    steps: [
      'Structure your reference questions',
      'Add a bias review step acknowledging that disabled candidates may have gaps or complicated relationships with past employers',
    ],
    indicators: [
      'Reference questions structured within 6 months',
      'Bias review step added to reference checking',
      'Reference process reviewed for fairness',
    ],
  },
  '5.8-DD-8': {
    steps: [
      'Design a tiered feedback process',
      'Provide specific, respectful feedback to interviewed candidates as a minimum',
    ],
    indicators: [
      'Tiered feedback process designed within 6 months',
      'Interviewed candidates receive specific feedback',
      'Feedback quality reviewed via candidate experience surveys',
    ],
  },
  '5.8-DD-9': {
    steps: [
      'Establish a named candidate complaints contact for selection decisions with a defined escalation path',
      'Include it in every rejection communication',
    ],
    indicators: [
      'Candidate complaints contact established within 3 months',
      'Contact included in every rejection communication',
      'Complaints handled within a set timeframe',
    ],
  },

  // ============================================================
  // Module 5.9 - Onboarding and workplace adjustments
  // ============================================================
  '5.9-PC-1': {
    steps: [
      'Add a workplace adjustment meeting to the onboarding checklist for every new hire in their first two weeks',
      'Train managers on how to run it',
    ],
    indicators: [
      'Adjustment meeting added to onboarding within 3 months',
      'Every new hire offered the conversation in their first two weeks',
      'Managers trained to run it',
    ],
  },
  '5.9-PC-2': {
    steps: [
      'Design a workplace adjustment passport template and pilot it with volunteer employees',
      'Roll it out via HR communications with manager training, so it travels with employees across role changes',
    ],
    indicators: [
      'Adjustment passport piloted within 6 months',
      'Passport rolled out with manager training within 12 months',
      'Passport travels with employees across role changes',
    ],
  },
  '5.9-PC-3': {
    steps: [
      'Brief HR and hiring managers on the JobAccess Employment Assistance Fund (EAF) and add it to the adjustment workflow',
      'Identify current or recent adjustments that might have qualified',
    ],
    indicators: [
      'HR and managers briefed on the EAF within 3 months',
      'EAF built into the adjustment workflow',
      'EAF used for eligible adjustments',
    ],
  },
  '5.9-PC-4': {
    steps: [
      'Audit onboarding content and fix captions, PDF tagging and readability',
      'Set a standard that new content meets WCAG 2.2 AA before publishing',
    ],
    indicators: [
      'Onboarding content audited within 3 months',
      'Accessible onboarding content within 12 months',
      'WCAG 2.2 AA set as the standard for new content',
    ],
  },
  '5.9-PC-5': {
    steps: [
      'Schedule disability-confident management training for all people managers, covering how to have adjustment conversations',
      'Require completion within 6 months of starting',
    ],
    indicators: [
      'Manager training scheduled within 3 months',
      'People managers complete it within 6 months of starting',
      'Refresher completed periodically',
    ],
  },
  '5.9-PC-6': {
    steps: [
      'Draft a documented workplace adjustment process with timeframes and escalation, and publish it',
      'Train HR and managers on it',
    ],
    indicators: [
      'Adjustment process documented and published within 6 months',
      'HR and managers trained on the process',
      'Requests handled within the set timeframes',
    ],
  },
  '5.9-DD-1': {
    steps: [
      'Designate a Workplace Adjustment Champion or coordinator to own the process across the organisation',
      'Allocate time and budget and publish the role',
    ],
    indicators: [
      'Adjustment coordinator designated within 3 months',
      'Time and budget allocated to the role',
      'Role published and known to staff',
    ],
  },
  '5.9-DD-2': {
    steps: [
      'Redesign the induction process to personalise from day one',
      'Explicitly cover each new hire\'s adjustment needs and communication preferences',
    ],
    indicators: [
      'Personalised induction process in place within 6 months',
      'Adjustment needs and preferences covered from day one',
      'Approach reviewed via new-hire feedback',
    ],
  },
  '5.9-DD-3': {
    steps: [
      'Establish a PEEP process and offer a PEEP to every employee with disability',
      'Practise each PEEP, not just document it, before the next drill',
    ],
    indicators: [
      'PEEP process established within 6 months',
      'PEEP offered to every employee who needs one',
      'PEEPs practised in drills, not only documented',
    ],
  },
  '5.9-DD-4': {
    steps: [
      'Design a structured 30/60/90-day check-in template with explicit adjustment prompts',
      'Review adjustments, workload and inclusion experience, not only performance',
    ],
    indicators: [
      'Structured 30/60/90 check-in template in place within 6 months',
      'Check-ins cover adjustments and inclusion, not just performance',
      'Check-ins completed for all new hires',
    ],
  },
  '5.9-DD-5': {
    steps: [
      'Build a pre-approved assistive technology list with a standing budget',
      'Cut the approval cycle so equipment is provisioned within 2 weeks of identified need',
    ],
    indicators: [
      'Pre-approved assistive technology list and budget in place within 6 months',
      'Equipment provisioned within 2 weeks of identified need',
      'Provisioning times tracked and reviewed',
    ],
  },
  '5.9-DD-6': {
    steps: [
      'Build a targeted module for first-time managers on supporting employees with disability',
      'Mandate it before they first manage someone with a disclosed disability',
    ],
    indicators: [
      'First-time manager module built within 6 months',
      'Completed before first managing a disclosed report',
      'Module reviewed and updated periodically',
    ],
  },
  '5.9-DD-7': {
    steps: [
      'Build a structured return-to-work process for return after disability-related leave (injury, mental health, chronic illness flare)',
      'Train HR and managers to run it',
    ],
    indicators: [
      'Return-to-work process in place within 6 months',
      'HR and managers trained to run it',
      'Process applied consistently, confirmed via feedback',
    ],
  },
  '5.9-DD-8': {
    steps: [
      'Add a named second-level review step for probation decisions involving disabled staff',
      'Review adjustment implementation evidence before a probation fails',
    ],
    indicators: [
      'Second-level probation review step added within 6 months',
      'Adjustment evidence reviewed before any probation fails',
      'Probation outcomes monitored for bias',
    ],
  },
  '5.9-DD-9': {
    steps: [
      'Audit the promotion channels for the EAP, occupational health and mental health support',
      'Refresh visibility quarterly so entry paths are known',
    ],
    indicators: [
      'Support-service promotion audited within 3 months',
      'Entry paths refreshed and promoted quarterly',
      'Staff awareness of support services confirmed via survey',
    ],
  },

  // ============================================================
  // Module 5.10 - Retention, ERGs and inclusive culture
  // ============================================================
  '5.10-PC-1': {
    steps: [
      'Add a voluntary disclosure field to HR records',
      'Build an annual retention analysis by disclosure status and review it with leadership',
    ],
    indicators: [
      'Voluntary disclosure field added within 3 months',
      'Retention analysed annually by disclosure status',
      'Findings reviewed with leadership',
    ],
  },
  '5.10-PC-2': {
    steps: [
      'Invite interested staff to co-design an Employee Resource Group for staff with disability',
      'Allocate time, budget and an executive sponsor before launch',
    ],
    indicators: [
      'ERG co-designed within 12 months',
      'ERG resourced with time, budget and an exec sponsor',
      'ERG input acted on by the organisation',
    ],
  },
  '5.10-PC-3': {
    steps: [
      'Add disclosure status to promotion data and review senior representation honestly',
      'Set representation targets and track progress',
    ],
    indicators: [
      'Promotion data captures disclosure status within 6 months',
      'Representation targets set and tracked',
      'Progress reviewed with leadership annually',
    ],
  },
  '5.10-PC-4': {
    steps: [
      'Add disability-specific prompts to exit interviews',
      'Build an annual review cycle and act on what you hear',
    ],
    indicators: [
      'Disability prompts added to exit interviews within 3 months',
      'Exit themes reviewed annually',
      'Actions taken in response to findings',
    ],
  },
  '5.10-PC-5': {
    steps: [
      'Identify current and upcoming policy work affecting disabled staff',
      'Rebuild the processes to include co-design with disabled staff from day one',
    ],
    indicators: [
      'Policy work affecting disabled staff identified within 6 months',
      'Co-design built into policy processes',
      'Disabled staff compensated for their input',
    ],
  },
  '5.10-PC-6': {
    steps: [
      'Add disability-specific items to the next culture or engagement survey cycle',
      'Report on the results publicly',
    ],
    indicators: [
      'Disability items added to the culture survey within 12 months',
      'Results reported on',
      'Findings used to improve inclusion',
    ],
  },
  '5.10-DD-1': {
    steps: [
      'Publish meeting inclusion norms (agendas in advance, recording option, captions, break pacing, clear speaking order)',
      'Workshop them with leadership to embed them',
    ],
    indicators: [
      'Meeting inclusion norms published within 3 months',
      'Norms adopted across the organisation',
      'Norms reviewed via staff feedback',
    ],
  },
  '5.10-DD-2': {
    steps: [
      'Build a visible channel for development opportunities (conferences, training, stretch projects, mentoring)',
      'Proactively offer them to disabled staff and track allocation by disclosure status',
    ],
    indicators: [
      'Development opportunity channel in place within 6 months',
      'Opportunities offered proactively, not only on request',
      'Allocation tracked by disclosure status',
    ],
  },
  '5.10-DD-3': {
    steps: [
      'Add disclosure status to your pay equity analysis',
      'Report the results and act on any gaps',
    ],
    indicators: [
      'Pay equity analysis includes disclosure status within 12 months',
      'Results reported to leadership',
      'Gaps addressed with a clear plan',
    ],
  },
  '5.10-DD-4': {
    steps: [
      'Identify upcoming customer-facing decisions where disabled staff expertise is relevant',
      'Invite and pay disabled staff to contribute',
    ],
    indicators: [
      'Relevant customer-facing decisions identified within 6 months',
      'Disabled staff invited and paid to contribute',
      'Their input reflected in decisions',
    ],
  },
  '5.10-DD-5': {
    steps: [
      'Introduce a short recurring psychological safety pulse survey, cut by disclosure status',
      'Build team-level reporting with action plans owned at team level',
    ],
    indicators: [
      'Psychological safety pulse survey introduced within 6 months',
      'Results cut by disclosure status',
      'Team-level action plans owned and tracked',
    ],
  },
  '5.10-DD-6': {
    steps: [
      'Identify one or two relevant Disabled-led organisations (DPOs)',
      'Propose a paid pilot engagement, not goodwill',
    ],
    indicators: [
      'Relevant DPOs identified within 6 months',
      'A paid pilot engagement established within 12 months',
      'Engagement sustained and reviewed',
    ],
  },
  '5.10-DD-7': {
    steps: [
      'Identify priority intersections (disability x gender, Aboriginal and Torres Strait Islander status, LGBTQ+, age)',
      'Add them to the next analytical cycle where sample size allows',
    ],
    indicators: [
      'Priority intersections identified within 6 months',
      'Intersectional data analysed where sample size allows',
      'Findings used to target inclusion efforts',
    ],
  },
  '5.10-DD-8': {
    steps: [
      'Build a disability inclusion dashboard for the Board and Executive (recruitment, retention, engagement)',
      'Tie leadership accountability to the measurable outcomes',
    ],
    indicators: [
      'Disability inclusion dashboard built within 12 months',
      'Reviewed at Board or Executive level',
      'Leadership KPIs tied to the outcomes',
    ],
  },
  '5.10-DD-9': {
    steps: [
      'Design a pilot mentoring or sponsorship program for disabled staff',
      'Recruit trained mentors, match voluntarily and measure progression outcomes',
    ],
    indicators: [
      'Mentoring program piloted within 12 months',
      'Mentors trained and matches voluntary',
      'Progression outcomes measured and the program scaled',
    ],
  },
  '5.10-DD-10': {
    steps: [
      'Audit current leave policies for chronic illness and mental health fit',
      'Draft additions beyond statutory minimums (flexible sick leave banking, recovery leave, flexible start/end times for medication cycles)',
    ],
    indicators: [
      'Leave policies audited within 6 months',
      'Flexible arrangements beyond the minimum introduced within 12 months',
      'Arrangements reviewed via staff feedback',
    ],
  },
  '5.10-DD-11': {
    steps: [
      'Create ways to include Disabled staff in relevant customer-facing decisions (product, service, venue) as a valued, resourced part of their role',
      'Keep participation voluntary, never assume disclosure, and engage external experts (paid) where in-house expertise is limited',
    ],
    indicators: [
      'Ways to include Disabled staff in decisions created within 12 months',
      'Participation voluntary and resourced',
      'External experts engaged and paid where needed',
    ],
  },

  // ============================================================
  // Module 6.1 - Event planning and promotion
  // ============================================================
  '6.1-PC-1': {
    steps: [
      'Integrate accessibility into your event planning checklist from the earliest concept stage',
      'Design accommodations in rather than retrofitting them',
    ],
    indicators: [
      'Accessibility in the event planning checklist within 3 months',
      'Accessibility considered from the concept stage of each event',
      'Approach reviewed after each event',
    ],
  },
  '6.1-PC-2': {
    steps: [
      'Add accessibility details to all event promotion (what accommodations are available, how to request support, who to contact)',
      'Publish it on the event website, social media and printed collateral',
    ],
    indicators: [
      'Accessibility information in event promotion within 3 months',
      'Published across all promotional channels',
      'Information reviewed for each event',
    ],
  },
  '6.1-PC-3': {
    steps: [
      'Add an accessibility accommodation request field to your registration or ticketing process',
      'Provide a clear, private way to communicate needs before the event, per the DDA 1992 duty to make reasonable adjustments',
    ],
    indicators: [
      'Accommodation request field added within 3 months',
      'Requests captured privately and actioned before the event',
      'Request handling reviewed via attendee feedback',
    ],
  },
  '6.1-PC-4': {
    steps: [
      'Register as a Companion Card affiliate',
      'Offer free companion tickets to Companion Card holders',
    ],
    indicators: [
      'Companion Card affiliation in place within 6 months',
      'Free companion tickets offered',
      'Card recognised at ticketing and entry',
    ],
  },
  '6.1-PC-5': {
    steps: [
      'Audit your registration and ticketing platform against WCAG 2.2 Level AA (screen reader, keyboard, contrast)',
      'Provide an alternative booking method (phone or email) for people who cannot use the online system',
    ],
    indicators: [
      'Registration platform audited for WCAG 2.2 AA within 3 months',
      'Critical issues fixed within 6 months',
      'An alternative booking method available',
    ],
  },
  '6.1-D-1': {
    steps: [
      'Allocate a specific accessibility budget line for your event (Auslan, captioning, hearing augmentation, accessible materials, equipment hire, contingency)',
      'Set it at a realistic proportion of the overall event budget (typically 5-15%)',
    ],
    indicators: [
      'Accessibility budget line allocated within 3 months',
      'Budget covers interpreting, captioning, equipment and contingency',
      'Budget reviewed against actual spend after each event',
    ],
  },
  '6.1-D-2': {
    steps: [
      'Engage people with disability in your event planning (advisory group, paid consultants or partnership with disability organisations)',
      'Consult early enough to influence decisions and compensate participants',
    ],
    indicators: [
      'People with disability engaged in planning within 6 months',
      'Consultation happens early enough to influence decisions',
      'Participants compensated for their input',
    ],
  },
  '6.1-D-3': {
    steps: [
      'Develop an event accessibility statement covering physical access, available supports, sensory environment, quiet spaces, accessible transport, food, service animal policy and a contact',
      'Publish it across event channels',
    ],
    indicators: [
      'Event accessibility statement published within 3 months',
      'Statement covers access, supports, sensory and contacts',
      'Statement updated for each event',
    ],
  },
  '6.1-D-4': {
    steps: [
      'Produce promotional materials in accessible formats (WCAG 2.2 AA digital documents, captioned video, audio-described content, Easy Read, large print)',
      'Include alt text on images in digital channels',
    ],
    indicators: [
      'Promotional materials produced in accessible formats within 6 months',
      'Video captioned and images have alt text',
      'Accessible production set as the standard',
    ],
  },
  '6.1-D-5': {
    steps: [
      'Set a clear deadline for accommodation requests (typically 2-4 weeks before) and communicate it prominently',
      'Establish a process for handling late or on-the-day requests',
    ],
    indicators: [
      'Accommodation request deadline set and communicated within 3 months',
      'A process for late and on-the-day requests in place',
      'Requests met within the timeframe',
    ],
  },
  '6.1-D-6': {
    steps: [
      'Consider offering discounted or free tickets for people with disability',
      'Establish clear eligibility and make the concession easy to access',
    ],
    indicators: [
      'Concession ticketing reviewed within 6 months',
      'A concession offered with clear eligibility',
      'Uptake reviewed after each event',
    ],
  },
  '6.1-D-7': {
    steps: [
      'Explore virtual or hybrid attendance options (livestream, recorded sessions, virtual participation)',
      'Provide at least partial hybrid coverage for people who cannot attend in person',
    ],
    indicators: [
      'Virtual or hybrid options scoped within 6 months',
      'At least partial hybrid coverage offered within 12 months',
      'Virtual attendance reviewed via participant feedback',
    ],
  },
  '6.1-D-8': {
    steps: [
      'Ensure volunteers and staff with disability can fully participate (accessible briefing materials, access to staff-only areas, flexible shifts)',
      'Offer them the same accommodation request process as attendees',
    ],
    indicators: [
      'Volunteer and staff accessibility reviewed within 3 months',
      'Accessible briefings and staff areas provided',
      'Same accommodation process available to staff and volunteers',
    ],
  },
  '6.1-D-9': {
    steps: [
      'Include accessibility requirements in all supplier and vendor contracts (stalls, stages, temporary structures, digital platforms, services)',
      'Hold suppliers accountable to the relevant standards',
    ],
    indicators: [
      'Accessibility requirements in vendor contracts within 6 months',
      'Suppliers held accountable to the standards',
      'Compliance checked before and during the event',
    ],
  },
  '6.1-D-10': {
    steps: [
      'Contact all attendees who requested accommodations at least one week before the event to confirm arrangements and provide specific details',
      'Offer a point of contact for the day',
    ],
    indicators: [
      'Confirmation process in place within 3 months',
      'Requesting attendees confirmed at least a week before',
      'A day-of contact provided',
    ],
  },
  '6.1-D-11': {
    steps: [
      'Actively seek to include people with disability as speakers, performers, panellists or facilitators',
      'Provide accessible presentation conditions and pay them fairly',
    ],
    indicators: [
      'People with disability included in programming within 12 months',
      'Accessible presentation conditions provided',
      'Presenters paid fairly',
    ],
  },
  '6.1-D-12': {
    steps: [
      'Designate a named accessibility contact person with authority to make decisions and arrange accommodations',
      'Include their details on all event communications and signage',
    ],
    indicators: [
      'Named accessibility contact designated within 3 months',
      'Contact listed on all event communications',
      'Contact empowered to arrange accommodations',
    ],
  },

  // ============================================================
  // Module 6.2 - Venue and physical access
  // ============================================================
  '6.2-PC-1': {
    steps: [
      'Assess the venue for wheelchair accessibility (entrances, circulation, stages, amenities, emergency egress) against the Premises Standards',
      'Identify modifications or choose an alternative venue where there are barriers',
    ],
    indicators: [
      'Venue accessibility assessed before booking',
      'Barriers addressed or an accessible alternative chosen',
      'Assessment repeated for each new venue',
    ],
  },
  '6.2-PC-2': {
    steps: [
      'Provide accessible parking compliant with AS/NZS 2890.6 and a drop-off zone close to an accessible entrance',
      'Where on-site parking is unavailable, arrange accessible shuttle services',
    ],
    indicators: [
      'Accessible parking and drop-off provided for the event',
      'Compliant with AS/NZS 2890.6',
      'Accessible shuttle arranged where parking is unavailable',
    ],
  },
  '6.2-PC-3': {
    steps: [
      'Provide accessible toilets compliant with AS 1428.1 (hire accessible portable units for temporary or outdoor events)',
      'Ensure at least 1 accessible toilet per 100 attendees, on level ground, signed and connected by accessible paths',
    ],
    indicators: [
      'Accessible toilets provided at the required ratio',
      'Toilets compliant with AS 1428.1 and signed',
      'Toilets on level ground with accessible paths',
    ],
  },
  '6.2-PC-4': {
    steps: [
      'Provide diverse accessible seating: integrated wheelchair spaces, companion seating, extra-width seats, end-of-row seats and back support',
      'Ensure wheelchair spaces have clear dimensions and sightlines per AS 1428.1',
    ],
    indicators: [
      'Diverse accessible seating provided for the event',
      'Wheelchair spaces integrated, not segregated',
      'Clear dimensions and sightlines confirmed',
    ],
  },
  '6.2-PC-5': {
    steps: [
      'Designate a quiet or low-sensory space away from the main event area with comfortable seating, reduced lighting and minimal noise',
      'Staff or monitor it and promote its location in event materials',
    ],
    indicators: [
      'Quiet space provided at the event',
      'Space away from noise with the right features',
      'Location promoted in event materials',
    ],
  },
  '6.2-D-1': {
    steps: [
      'Conduct an accessibility site visit well before the event, walking the full attendee journey (arrival, entry, registration, seating, amenities, food, exits)',
      'Include a person with disability or access consultant in the walk-through',
    ],
    indicators: [
      'Accessibility site visit completed before the event',
      'Full attendee journey walked',
      'A person with disability or consultant involved',
    ],
  },
  '6.2-D-2': {
    steps: [
      'Ensure the stage has step-free access via a ramp (1:14 or gentler) or platform lift',
      'Provide an accessible height-adjustable lectern, presenter lighting and hearing augmentation coverage',
    ],
    indicators: [
      'Step-free stage access provided for the event',
      'Accessible lectern and presenter lighting provided',
      'Hearing augmentation covers the presentation area',
    ],
  },
  '6.2-D-3': {
    steps: [
      'Check the Changing Places website for a facility near your venue',
      'For large events, consider hiring a temporary Changing Places unit, and communicate the nearest facility in your accessibility information',
    ],
    indicators: [
      'Nearest Changing Places facility identified before the event',
      'Temporary unit considered for large events',
      'Facility location communicated to attendees',
    ],
  },
  '6.2-D-4': {
    steps: [
      'Research accessible transport options (public transport stops, accessible taxi/rideshare, shuttles, parking)',
      'Communicate specific details like distance from stops to entrance and surface conditions',
    ],
    indicators: [
      'Accessible transport options researched before the event',
      'Specific details communicated to attendees',
      'Information reviewed for each event',
    ],
  },
  '6.2-D-5': {
    steps: [
      'Assess all surfaces and terrain for firmness, level and slip-resistance',
      'Provide temporary accessible pathways over grass, gravel or uneven ground, and address gradients and cross-falls',
    ],
    indicators: [
      'Surfaces and terrain assessed before the event',
      'Temporary accessible pathways provided where needed',
      'Surfaces maintained throughout the event',
    ],
  },
  '6.2-D-6': {
    steps: [
      'Implement an accessible seating management plan: reserve and mark wheelchair spaces and companion seats',
      'Train staff to manage them and set a process for reallocating seats if demand exceeds supply',
    ],
    indicators: [
      'Accessible seating management plan in place for the event',
      'Wheelchair and companion seats reserved and marked',
      'Staff trained to manage them',
    ],
  },
  '6.2-D-7': {
    steps: [
      'Provide designated accessible viewing areas at standing events with clear sightlines, level firm ground and companion spaces',
      'Position them where the atmosphere is still part of the experience and protect them from crowd crush',
    ],
    indicators: [
      'Accessible viewing areas provided at standing events',
      'Clear sightlines and companion spaces provided',
      'Areas protected from crowd crush',
    ],
  },
  '6.2-D-8': {
    steps: [
      'Implement trip hazard management: mobility-aid-rated cable covers, secured wiring, marked or eliminated level changes',
      'Conduct regular walk-throughs during the event',
    ],
    indicators: [
      'Trip hazard management in place for the event',
      'Cable covers rated for mobility aids used',
      'Regular walk-throughs conducted during the event',
    ],
  },
  '6.2-D-9': {
    steps: [
      'Provide at least one accessible baby change facility with wheelchair space, an accessible-height change table and disposal facilities',
      'Locate it in a gender-neutral position',
    ],
    indicators: [
      'Accessible baby change provided at the event',
      'Facility gender-neutral and accessible',
      'Facility kept clean and stocked',
    ],
  },
  '6.2-D-10': {
    steps: [
      'Mark all stage and platform edges with a high-contrast, non-slip strip (min 50mm) that is visually and tactilely detectable',
      'Provide adequate edge lighting and guardrails where the drop exceeds 250mm',
    ],
    indicators: [
      'Stage and platform edges marked for the event',
      'Edges visually and tactilely detectable',
      'Guardrails provided where the drop exceeds 250mm',
    ],
  },
  '6.2-D-11': {
    steps: [
      'Designate a secure, staffed area near the main event space for storing mobility aids and equipment',
      'Make it accessible and clearly signed, and brief staff to handle equipment carefully',
    ],
    indicators: [
      'Mobility aid storage provided at the event',
      'Area secure, staffed and accessible',
      'Staff briefed to handle equipment carefully',
    ],
  },
  '6.2-D-12': {
    steps: [
      'Develop a weather contingency plan for accessible routes and facilities (temporary coverings, alternative paths, cooling/heating stations)',
      'Communicate changes to attendees with disability',
    ],
    indicators: [
      'Weather contingency plan for accessible routes in place',
      'Alternative accessible paths planned',
      'Changes communicated to attendees with disability',
    ],
  },
  '6.2-D-13': {
    steps: [
      'Require all stalls, vendors and pop-up stands to be accessible: counters at 850mm or lower, clear approach space, readable price labels, accessible payment',
      'Include this in vendor agreements',
    ],
    indicators: [
      'Vendor accessibility requirements set for the event',
      'Requirements included in vendor agreements',
      'Compliance checked during the event',
    ],
  },
  '6.2-D-14': {
    steps: [
      'Provide elevated viewing platforms for wheelchair users and people of short stature with ramp access, guardrails and companion spaces',
      'Position them for sightlines equivalent to a standing adult and a genuine event experience',
    ],
    indicators: [
      'Elevated viewing platforms provided where needed',
      'Ramp access, guardrails and companion spaces provided',
      'Sightlines equivalent to a standing adult',
    ],
  },
  '6.2-D-15': {
    steps: [
      'Install accessible pathway surfaces (aluminium trackway, interlocking event matting or compacted surfaces) across all pedestrian routes',
      'Keep them firm, level, slip-resistant, securely fixed and maintained throughout the event',
    ],
    indicators: [
      'Accessible pathway surfaces installed across routes',
      'Surfaces firm, level and securely fixed',
      'Surfaces maintained throughout the event',
    ],
  },
  '6.2-D-16': {
    steps: [
      'Provide accessible transport within the venue for large events (accessible golf carts, shuttle buses or buggies)',
      'Make it available on request and at regular intervals on accessible routes',
    ],
    indicators: [
      'In-venue accessible transport provided for large events',
      'Available on request and at regular intervals',
      'Operates on accessible routes',
    ],
  },
  '6.2-D-17': {
    steps: [
      'Provide accessible charging points for electric wheelchairs and mobility devices near seating areas',
      'Ensure standard outlets at accessible heights and include the locations in your event map',
    ],
    indicators: [
      'Accessible charging points provided at the event',
      'Outlets at accessible heights near seating',
      'Locations shown on the event map',
    ],
  },
  '6.2-D-18': {
    steps: [
      'Ensure all crowd barriers, bollards and queuing systems provide wheelchair-width gaps (min 900mm, ideally 1000mm)',
      'Train crowd management staff to assist people with disability and avoid dead-ends without accessible alternatives',
    ],
    indicators: [
      'Crowd barriers provide wheelchair-width gaps',
      'Crowd management staff trained to assist',
      'No dead-ends without an accessible alternative',
    ],
  },
  '6.2-D-19': {
    steps: [
      'Establish clearly marked accessible drop-off and pick-up areas close to the accessible entrance, with firm surfaces, kerb ramps and lighting',
      'Staff them to manage traffic flow and communicate the location in pre-event information and signage',
    ],
    indicators: [
      'Accessible drop-off and pick-up areas established for the event',
      'Areas marked, lit and actively managed',
      'Location communicated in pre-event information and signage',
    ],
  },

  // ============================================================
  // Module 6.3 - Communication and information
  // ============================================================
  '6.3-PC-1': {
    steps: [
      'Install clear, accessible wayfinding signage (min 70% contrast, sans-serif min 18pt, consistent placement, pictograms)',
      'Make signs to accessible facilities (toilets, quiet rooms, lifts) prominent',
    ],
    indicators: [
      'Accessible wayfinding signage installed for the event',
      'Signs to accessible facilities prominent',
      'Signage reviewed at each event',
    ],
  },
  '6.3-PC-2': {
    steps: [
      'Provide event information in accessible formats (large print, WCAG 2.2 AA digital, Easy Read, audio, Braille on request)',
      'Ensure at minimum that digital information is screen-reader compatible',
    ],
    indicators: [
      'Event information available in accessible formats',
      'Digital information screen-reader compatible',
      'Formats reviewed for each event',
    ],
  },
  '6.3-PC-3': {
    steps: [
      'Implement multi-modal announcements: audio PA plus visual displays, text/app notifications and Auslan interpretation for live announcements',
      'Ensure emergency announcements are both audible and visible, per the DDA 1992',
    ],
    indicators: [
      'Multi-modal announcements in place for the event',
      'Emergency announcements both audible and visible',
      'Announcement channels tested before the event',
    ],
  },
  '6.3-PC-4': {
    steps: [
      'Set up an information or help desk near the main entrance with an accessible counter section (max 850mm for part of it)',
      'Staff it with people trained in disability awareness and sign it clearly',
    ],
    indicators: [
      'Accessible information desk provided at the event',
      'Desk staffed by disability-aware people',
      'Desk clearly signed near the entrance',
    ],
  },
  '6.3-D-1': {
    steps: [
      'Add QR codes to key signage linking to accessible digital versions of event information',
      'Ensure the linked pages meet WCAG 2.2 AA',
    ],
    indicators: [
      'QR codes to accessible information on key signage',
      'Linked pages meet WCAG 2.2 AA',
      'QR content updated for each event',
    ],
  },
  '6.3-D-2': {
    steps: [
      'Provide tactile wayfinding: TGSIs at key decision points (per AS 1428.4.1), tactile signage with raised lettering and Braille at room entries, and tactile maps at information points',
      'Maintain the elements through the event',
    ],
    indicators: [
      'Tactile wayfinding provided at the event',
      'TGSIs and tactile signage compliant with AS 1428.4.1',
      'Tactile elements maintained through the event',
    ],
  },
  '6.3-D-3': {
    steps: [
      'Create a sensory map or guide indicating noise levels, lighting, crowd density and sensory hotspots, including quiet spaces and low-sensory routes',
      'Make it available in advance online and on the day at the information desk',
    ],
    indicators: [
      'Sensory map created for the event',
      'Available online in advance and on the day',
      'Map updated for each event',
    ],
  },
  '6.3-D-4': {
    steps: [
      'Develop social stories or visual narratives covering arrival, what the event looks like, where to get help and what happens at key moments',
      'Publish them on the event website at least two weeks beforehand',
    ],
    indicators: [
      'Social story or visual narrative developed for the event',
      'Published at least two weeks beforehand',
      'Content updated for each event',
    ],
  },
  '6.3-D-5': {
    steps: [
      'Establish multiple channels for communicating program changes (PA, on-screen displays, app notifications, SMS, information desk)',
      'Ensure at least two channels are accessible for each sensory modality',
    ],
    indicators: [
      'Multiple change-communication channels in place for the event',
      'At least two accessible channels per sensory modality',
      'Channels tested before the event',
    ],
  },
  '6.3-D-6': {
    steps: [
      'Provide communication aids at the event (picture boards, communication apps on tablets, key-word signing guides, pen and paper)',
      'Train staff to use them patiently without assumptions about cognitive ability',
    ],
    indicators: [
      'Communication aids available at the event',
      'Staff trained to use them respectfully',
      'Aids maintained and available at service points',
    ],
  },
  '6.3-D-7': {
    steps: [
      'Provide a range of microphone options for diverse presenters (lapel, headset, gooseneck at adjustable lecterns, handheld) and feed the sound system into the hearing loop',
      'Test all equipment with presenters before their session',
    ],
    indicators: [
      'Range of microphone options provided for the event',
      'Sound system feeds the hearing loop',
      'Equipment tested with presenters beforehand',
    ],
  },
  '6.3-D-8': {
    steps: [
      'Consider providing an accessible digital wayfinding or navigation app (screen-reader compatible, high contrast, accessible routes, key facilities)',
      'Prioritise it for large events to improve independence and reduce anxiety',
    ],
    indicators: [
      'Digital wayfinding option scoped for large events',
      'App accessible and shows accessible routes',
      'App reviewed via attendee feedback',
    ],
  },
  '6.3-D-9': {
    steps: [
      'Brief all speakers on accessible presentation practices (describe visuals, face the audience, plain language, pause for interpreters, slides in advance, high-contrast design)',
      'Circulate a written accessibility guide as part of speaker onboarding',
    ],
    indicators: [
      'Speakers briefed on accessible presentation before the event',
      'Written accessibility guide part of speaker onboarding',
      'Practices followed, confirmed via feedback',
    ],
  },
  '6.3-D-10': {
    steps: [
      'Write all event communications in plain language (short sentences, common words, active voice, clear structure, no jargon)',
      'Test key documents with a readability tool, aiming for a Grade 8 reading level',
    ],
    indicators: [
      'Event communications written in plain language',
      'Key documents tested for readability',
      'Plain-language standard applied to new communications',
    ],
  },
  '6.3-D-11': {
    steps: [
      'Test your event app against WCAG 2.2 Level AA (screen readers, keyboard, contrast, text resizing, 24x24px touch targets)',
      'Fix critical issues before launch and provide a non-app alternative for any inaccessible features',
    ],
    indicators: [
      'Event app tested for WCAG 2.2 AA before launch',
      'Critical issues fixed before launch',
      'A non-app alternative available for key features',
    ],
  },

  // ============================================================
  // Module 6.4 - Sensory access and technology
  // ============================================================
  '6.4-PC-1': {
    steps: [
      'Plan hearing access services (Auslan interpreters, live captioning/CART, hearing loops, assistive listening devices)',
      'Communicate availability in advance so attendees can plan, per the DDA 1992 duty to make reasonable adjustments',
    ],
    indicators: [
      'Hearing access services planned for the event',
      'Availability communicated in advance',
      'Services confirmed before the event',
    ],
  },
  '6.4-PC-2': {
    steps: [
      'Plan vision access services (audio description, large print, screen-reader-compatible content, sighted guide volunteers, tactile maps)',
      'Communicate available services in advance so attendees can plan',
    ],
    indicators: [
      'Vision access services planned for the event',
      'Availability communicated in advance',
      'Services confirmed before the event',
    ],
  },
  '6.4-PC-3': {
    steps: [
      'Address sensory needs for neurodivergent attendees (quiet room, ear defenders, advance trigger warnings, sensory map, early entry, low-stimulation routes)',
      'Promote these supports in pre-event information',
    ],
    indicators: [
      'Sensory supports provided at the event',
      'Supports promoted in pre-event information',
      'Supports reviewed via attendee feedback',
    ],
  },
  '6.4-D-1': {
    steps: [
      'Position Auslan interpreters where clearly visible (well-lit, plain dark background, close to the speaker, at the same level) and reserve front-of-house seating for Deaf attendees',
      'Consult your interpreters on optimal positioning',
    ],
    indicators: [
      'Interpreter positioning planned for the event',
      'Front-of-house seating reserved for Deaf attendees',
      'Interpreters consulted on positioning',
    ],
  },
  '6.4-D-2': {
    steps: [
      'Display live captioning on screens visible from all accessible seating (dedicated screen or lower-third overlay)',
      'Use minimum 48pt, high-contrast text positioned so attendees can see both the speaker and the captions',
    ],
    indicators: [
      'Live captioning displayed at the event',
      'Captions visible from all accessible seating',
      'Caption text meets size and contrast requirements',
    ],
  },
  '6.4-D-3': {
    steps: [
      'Install or hire hearing loop systems covering all presentation and seated areas, meeting AS 60118.4',
      'Test coverage with a loop receiver before the event and display the hearing loop symbol prominently',
    ],
    indicators: [
      'Hearing loop coverage provided for the event',
      'Coverage confirmed against AS 60118.4',
      'Loop symbol displayed prominently',
    ],
  },
  '6.4-D-4': {
    steps: [
      'Arrange audio description for visual content (live describers, pre-recorded description, described programs) with receivers or a dedicated audio channel',
      'Promote availability in pre-event communications',
    ],
    indicators: [
      'Audio description arranged for the event',
      'Receivers or a dedicated channel provided',
      'Availability promoted before the event',
    ],
  },
  '6.4-D-5': {
    steps: [
      'Provide assistive listening devices (FM receivers, infrared systems or personal amplifiers) for areas without hearing loop coverage',
      'Ensure an adequate supply and a simple sign-out process',
    ],
    indicators: [
      'Assistive listening devices provided at the event',
      'Adequate supply and a simple sign-out process',
      'Devices tested and maintained',
    ],
  },
  '6.4-D-6': {
    steps: [
      'Explore haptic devices for music events (wearable bass vests, vibrating wristbands, tactile flooring)',
      'Partner with specialist providers and promote availability in advance',
    ],
    indicators: [
      'Haptic device options explored for music events',
      'Provided in partnership with specialist providers where feasible',
      'Availability promoted in advance',
    ],
  },
  '6.4-D-7': {
    steps: [
      'Provide advance warnings for sensory triggers (strobe lights, pyrotechnics, loud noises, smoke/haze, strong scents)',
      'Display warnings in pre-event materials, at venue entry and immediately before the trigger, per DDA obligations',
    ],
    indicators: [
      'Sensory trigger warnings provided for the event',
      'Warnings in pre-event materials, at entry and before triggers',
      'Warnings reviewed for each event',
    ],
  },
  '6.4-D-8': {
    steps: [
      'Offer relaxed or low-sensory sessions (reduced volume, house lights up, no strobe or smoke, flexible audience behaviour, lower crowd density)',
      'Schedule them at practical times and promote them as part of your main program',
    ],
    indicators: [
      'Relaxed session offered for the event',
      'Scheduled at a practical time',
      'Promoted as part of the main program',
    ],
  },
  '6.4-D-9': {
    steps: [
      'Explore multi-sensory music experiences for Deaf attendees (tactile sound floors, signed song or visual DJ, bass-heavy speaker placement, LED wristbands synced to music)',
      'Promote them as part of the experience',
    ],
    indicators: [
      'Multi-sensory music options explored for the event',
      'At least one provided where feasible',
      'Promoted as part of the experience',
    ],
  },
  '6.4-D-10': {
    steps: [
      'Implement a fragrance-free or scent-aware policy and communicate it to attendees, staff and vendors in advance',
      'Avoid scented cleaning products, manage food odours, and provide a scent-free zone',
    ],
    indicators: [
      'Scent-aware policy in place for the event',
      'Communicated to attendees, staff and vendors',
      'A scent-free zone provided',
    ],
  },
  '6.4-D-11': {
    steps: [
      'Manage lighting for accessibility: maintain ambient lighting for lip-reading and wayfinding, avoid flashing over 3 flashes per second (WCAG 2.3.1), keep consistent lighting on interpreters and captioning',
      'Provide warnings before lighting changes',
    ],
    indicators: [
      'Lighting managed for accessibility at the event',
      'Flashing kept within WCAG 2.3.1 limits',
      'Warnings provided before lighting changes',
    ],
  },
  '6.4-D-12': {
    steps: [
      'Offer touch tours or pre-event familiarisation visits so attendees can explore the venue layout and locate key facilities before crowds arrive',
      'Schedule at least one session before the event and promote it during registration',
    ],
    indicators: [
      'Touch tour or familiarisation session offered before the event',
      'At least one session scheduled',
      'Promoted during registration',
    ],
  },

  // ============================================================
  // Module 6.5 - On-the-day operations
  // ============================================================
  '6.5-PC-1': {
    steps: [
      'Provide disability awareness training to all staff and volunteers before the event',
      'Cover the specific accessibility provisions you have planned so staff can deliver them confidently',
    ],
    indicators: [
      'Staff and volunteers trained before the event',
      'Training covers the planned accessibility provisions',
      'Included in the event onboarding for each event',
    ],
  },
  '6.5-PC-2': {
    steps: [
      'Implement priority entry or express queuing for people with disability',
      'Communicate it in pre-event information and clearly sign the priority entry point',
    ],
    indicators: [
      'Priority entry provided at the event',
      'Communicated in pre-event information',
      'Priority entry point clearly signed',
    ],
  },
  '6.5-PC-3': {
    steps: [
      'Develop an accessible food and beverage policy (allergen labelling, dietary options, accessible serving heights, adaptive utensils, seated eating, staff assistance)',
      'Communicate options in advance',
    ],
    indicators: [
      'Accessible food and beverage policy in place for the event',
      'Options communicated in advance',
      'Policy applied by catering on the day',
    ],
  },
  '6.5-PC-4': {
    steps: [
      'Develop a service animal policy compliant with the DDA 1992 (access to all areas, a relief area, no proof requests, no refusal)',
      'Brief security and door staff and include the policy in event information',
    ],
    indicators: [
      'Service animal policy in place for the event',
      'Security and door staff briefed',
      'Relief area provided and policy published',
    ],
  },
  '6.5-PC-5': {
    steps: [
      'Develop an accessible emergency evacuation plan (PEEPs, accessible egress, refuge points, evacuation equipment, multi-modal alarms, trained marshals)',
      'Test the plan before the event',
    ],
    indicators: [
      'Accessible evacuation plan in place for the event',
      'Plan tested before the event',
      'Marshals trained on the plan',
    ],
  },
  '6.5-D-1': {
    steps: [
      'Designate a named person responsible for accessibility on the day with authority to make decisions and allocate resources',
      'Make them identifiable and reachable by radio, briefed on all pre-registered accommodations, and named in the run sheet',
    ],
    indicators: [
      'Accessibility lead designated for the day',
      'Lead identifiable, reachable and briefed on accommodations',
      'Named in the event run sheet',
    ],
  },
  '6.5-D-2': {
    steps: [
      'Provide accessible feedback channels during and after the event (on-site paper and digital forms, text/app option, WCAG 2.2 AA post-event survey, direct contact)',
      'Ask specifically about the accessibility experience',
    ],
    indicators: [
      'Accessible feedback channels available for the event',
      'Feedback asks specifically about accessibility',
      'Findings used to improve the next event',
    ],
  },
  '6.5-D-3': {
    steps: [
      'Provide equipment for loan (wheelchairs, hearing loop receivers, ear defenders, magnifying sheets, portable seats, chargers, communication boards)',
      'Advertise availability in pre-event communications and at the information desk',
    ],
    indicators: [
      'Loan equipment available at the event',
      'Availability advertised before and during the event',
      'Equipment maintained and signed out simply',
    ],
  },
  '6.5-D-4': {
    steps: [
      'Develop a protocol for handling late or on-the-day accessibility requests, with a contingency budget and backup supplier contacts',
      'Empower the accessibility lead to approve reasonable requests without escalation',
    ],
    indicators: [
      'Late-request protocol in place for the event',
      'Contingency budget and backup suppliers available',
      'Reasonable requests approved without escalation',
    ],
  },
  '6.5-D-5': {
    steps: [
      'Provide a rest area for carers and companions, separate from the quiet/sensory room, with comfortable seating, power outlets and water',
      'Locate it close to the main event area',
    ],
    indicators: [
      'Carer rest area provided at the event',
      'Area separate from the sensory room with the right facilities',
      'Located close to the main event area',
    ],
  },
  '6.5-D-6': {
    steps: [
      'Conduct a structured post-event accessibility review (analyse feedback, review incidents, document lessons, set targets)',
      'Include people with disability in the review process',
    ],
    indicators: [
      'Post-event accessibility review completed',
      'Lessons documented and targets set',
      'People with disability involved in the review',
    ],
  },
  '6.5-D-7': {
    steps: [
      'Reserve front-row or near-front seating for attendees who are Deaf or hard of hearing, for clear sightlines to interpreters, captioning and speaker faces',
      'Mark these seats clearly and brief front-of-house staff to manage them',
    ],
    indicators: [
      'Front seating reserved for Deaf attendees at the event',
      'Seats clearly marked',
      'Front-of-house staff manage them',
    ],
  },
  '6.5-D-8': {
    steps: [
      'Include finger foods, pre-cut items and food in handled bowls, avoiding items that require two-handed use or precise utensil work',
      'Provide straws, adaptive utensils and seated eating areas',
    ],
    indicators: [
      'Easy-to-eat catering options provided at the event',
      'Adaptive utensils and seated eating available',
      'Options communicated to attendees',
    ],
  },
  '6.5-D-9': {
    steps: [
      'Ensure consistent, adequate lighting on speakers, presenters and Auslan interpreters, illuminating faces for lip-reading and avoiding backlighting',
      'Test lighting under actual event conditions',
    ],
    indicators: [
      'Adequate lighting on speakers and interpreters at the event',
      'Faces clearly lit for lip-reading',
      'Lighting tested under event conditions',
    ],
  },
  '6.5-D-10': {
    steps: [
      'Assign dedicated accessibility stewards, clearly identifiable and trained, positioned at key locations (entry, information desk, accessible seating)',
      'Empower them to resolve issues and brief them on all pre-registered accommodations',
    ],
    indicators: [
      'Accessibility stewards on site for the event',
      'Stewards identifiable, trained and positioned at key points',
      'Briefed on pre-registered accommodations',
    ],
  },
  '6.5-D-11': {
    steps: [
      'Implement a re-entry policy that accommodates sensory breaks, medical management, assistance animal relief and equipment charging',
      'Use a hand stamp, wristband or ticket system that does not penalise people who need to step out',
    ],
    indicators: [
      'Accessible re-entry policy in place for the event',
      'Re-entry allowed for access-related reasons',
      'Policy communicated to attendees',
    ],
  },
  '6.5-D-12': {
    steps: [
      'Adopt the Sunflower lanyard scheme (or equivalent hidden disability indicator) and include recognition in your event accessibility information',
      'Train all staff and volunteers to recognise it and respond appropriately without requiring people to explain their disability',
    ],
    indicators: [
      'Sunflower lanyard scheme adopted for the event',
      'Staff and volunteers trained to recognise it',
      'Recognition included in event accessibility information',
    ],
  },
  '6.5-D-13': {
    steps: [
      'Provide first aid officers trained in disability-specific scenarios (seizures, insulin management, communication with non-verbal patients) and accessible first aid stations',
      'Provide medical equipment storage and a clear escalation path to emergency services',
    ],
    indicators: [
      'Disability-aware medical support provided at the event',
      'First aid stations accessible',
      'Escalation path to emergency services in place',
    ],
  },
  '6.5-D-14': {
    steps: [
      'Require all third-party contractors and partners (security, catering, AV, cleaning) to complete accessibility awareness training before the event',
      'Include accessibility requirements in contractor agreements and verify compliance during setup',
    ],
    indicators: [
      'Contractors trained on accessibility before the event',
      'Accessibility requirements in contractor agreements',
      'Compliance verified during setup',
    ],
  },
  '6.5-D-15': {
    steps: [
      'Review security screening for accessibility (private screening option, remaining seated, visual instructions for Deaf attendees)',
      'Train security staff to interact respectfully with people with disability',
    ],
    indicators: [
      'Security screening reviewed for accessibility before the event',
      'Private and seated screening options available',
      'Security staff trained to interact respectfully',
    ],
  },
  '6.5-D-16': {
    steps: [
      'Develop a protocol for supporting attendees who become distressed, disoriented or separated (recognise signs, approach calmly, offer specific assistance)',
      'Set a designated meeting point, a plan for finding carers and a calm space to wait',
    ],
    indicators: [
      'Distress-support protocol in place for the event',
      'Staff trained to recognise and respond',
      'A meeting point and calm space provided',
    ],
  },
  '6.5-D-17': {
    steps: [
      'Create a system to actively manage pre-registered accommodations on the day, with staff verifying each is in place before opening',
      'Check in with attendees who requested support and resolve issues immediately, using a checklist linked to registration data',
    ],
    indicators: [
      'Accommodation management system in place for the event',
      'Each accommodation verified before opening',
      'Requesting attendees checked in with on the day',
    ],
  },

  // ============================================================
  // Module 7.1 - Precinct and multi-venue coordination
  // ============================================================
  '7.1-PC-1': {
    steps: [
      'Develop a multi-venue accessibility coordination plan, defining your minimum venue standard',
      'Name a single owner accountable across all venues',
    ],
    indicators: [
      'Multi-venue coordination plan documented within 6 months',
      'A single owner named across all venues',
      'Plan reviewed for each major event',
    ],
  },
  '7.1-PC-2': {
    steps: [
      'Name a senior role as precinct-wide accessibility owner',
      'Give them documented authority, budget and direct reporting to the Event Director',
    ],
    indicators: [
      'Precinct accessibility owner named within 3 months',
      'Owner has documented authority and budget',
      'Owner reports directly to the Event Director',
    ],
  },
  '7.1-PC-3': {
    steps: [
      'Establish a central accessibility register covering every venue accurately',
      'Set a 24-hour SLA for updates across all customer-facing channels',
    ],
    indicators: [
      'Central venue accessibility register established within 6 months',
      'Every venue covered accurately',
      'Updates propagated within 24 hours',
    ],
  },
  '7.1-PC-4': {
    steps: [
      'Develop a documented minimum venue accessibility standard',
      'Make it a contract requirement for all participating venues',
    ],
    indicators: [
      'Minimum venue accessibility standard documented within 6 months',
      'Standard a contract requirement for all venues',
      'Compliance verified before contracting',
    ],
  },
  '7.1-PC-5': {
    steps: [
      'Develop a precinct-wide wayfinding standard with a consistent visual style across all venues',
      'Provide accessible alternatives (tactile maps, audio descriptions in the event app)',
    ],
    indicators: [
      'Precinct wayfinding standard in place within 12 months',
      'Consistent wayfinding across all venues',
      'Accessible wayfinding alternatives provided',
    ],
  },
  '7.1-PC-6': {
    steps: [
      'Produce an accessible event-wide map (WCAG 2.2 AA digital, high-contrast large-type print)',
      'Add tactile and Easy Read versions for major events',
    ],
    indicators: [
      'Accessible event-wide map produced within 6 months',
      'Digital map meets WCAG 2.2 AA',
      'Tactile and Easy Read versions provided for major events',
    ],
  },
  '7.1-DD-1': {
    steps: [
      'Introduce pre-audit of at least main-stage and high-traffic venues against your minimum standard before contracting',
      'Use an accessibility consultant or trained internal auditor',
    ],
    indicators: [
      'Venue pre-audit process in place within 6 months',
      'Main-stage and high-traffic venues pre-audited',
      'Audits conducted by a qualified auditor',
    ],
  },
  '7.1-DD-2': {
    steps: [
      'Add per-venue access summaries to your program using a consistent template',
      'Include limitations honestly, not just positive features',
    ],
    indicators: [
      'Per-venue access summaries in the program within 6 months',
      'Summaries use a consistent template',
      'Limitations disclosed honestly',
    ],
  },
  '7.1-DD-3': {
    steps: [
      'Investigate accessible inter-venue transport options',
      'At minimum, partner with a local accessible taxi service and list their contact in the access information',
    ],
    indicators: [
      'Inter-venue transport options investigated within 6 months',
      'At least one accessible option listed in access information',
      'Options reviewed for each major event',
    ],
  },
  '7.1-DD-4': {
    steps: [
      'Audit accessible parking and drop-off at every venue',
      'Add it to the central map and per-venue access summaries',
    ],
    indicators: [
      'Accessible parking audited at every venue within 6 months',
      'Parking mapped centrally and in venue summaries',
      'Mapping kept current',
    ],
  },
  '7.1-DD-5': {
    steps: [
      'Set up venue manager briefings on event-specific accessibility expectations',
      'Document the expectations and provide a one-page briefing card for on-day reference',
    ],
    indicators: [
      'Venue manager briefings held before the event',
      'Expectations documented',
      'Briefing card provided for on-day reference',
    ],
  },
  '7.1-DD-6': {
    steps: [
      'Develop a precinct-wide evacuation strategy with disability-access scenarios, coordinated with emergency services',
      'Run a drill before the event opens',
    ],
    indicators: [
      'Precinct evacuation strategy in place before the event',
      'Coordinated with emergency services',
      'Drill run before the event opens',
    ],
  },
  '7.1-DD-7': {
    steps: [
      'Establish a single accessibility complaint channel with a named owner and publish it prominently',
      'Run a daily review during the event',
    ],
    indicators: [
      'Single accessibility complaint channel in place for the event',
      'Channel published prominently',
      'Complaints reviewed daily during the event',
    ],
  },
  '7.1-DD-8': {
    steps: [
      'Document a real-time access status update process (lift outage, accessible toilet closure), defining the trigger and pre-writing templates',
      'Assign a single channel owner',
    ],
    indicators: [
      'Real-time update process documented before the event',
      'Templates pre-written and a channel owner assigned',
      'Access changes communicated in real time during the event',
    ],
  },
  '7.1-DD-9': {
    steps: [
      'Introduce basic venue-level accessibility metrics (complaint count and satisfaction score per venue)',
      'Compare them venue by venue to target improvements',
    ],
    indicators: [
      'Venue-level accessibility metrics introduced within 12 months',
      'Metrics compared across venues',
      'Findings used to target improvements',
    ],
  },
  '7.1-DD-10': {
    steps: [
      'Add a precinct-wide post-event accessibility review, aggregating venue data',
      'Run a focus group with disabled attendees and publish key findings',
    ],
    indicators: [
      'Precinct-wide post-event review completed',
      'Focus group with disabled attendees held',
      'Key findings published',
    ],
  },
  '7.1-DD-11': {
    steps: [
      'Track accessible parking demand year over year and use disclosure data to anticipate demographic demand',
      'Expand capacity beyond minimum compliance for accessibility-engaged audiences',
    ],
    indicators: [
      'Accessible parking demand tracked year over year',
      'Capacity planned against anticipated demand',
      'Capacity expanded beyond minimum where needed',
    ],
  },
  '7.1-DD-12': {
    steps: [
      'Establish intra-precinct accessible transport (scheduled loop or on-call buggy service) for large sites',
      'Train operators on disability-confident transport',
    ],
    indicators: [
      'Intra-precinct accessible transport provided for large sites',
      'Operators trained on disability-confident transport',
      'Service reviewed via attendee feedback',
    ],
  },

  // ============================================================
  // Module 7.2 - Accessibility programming curation
  // ============================================================
  '7.2-PC-1': {
    steps: [
      'Begin curating an accessibility programming track (relaxed, audio-described, captioned, Auslan-interpreted formats)',
      'Apply the formats across your main programming strands',
    ],
    indicators: [
      'Accessibility programming track curated within 12 months',
      'Formats applied across main programming strands',
      'Track grown year on year',
    ],
  },
  '7.2-PC-2': {
    steps: [
      'Develop an artist accessibility brief and include it in every contract pack',
      'Follow up with a conversation for first-time artists or those new to inclusive performance design',
    ],
    indicators: [
      'Artist accessibility brief in every contract pack within 6 months',
      'First-time artists briefed directly',
      'Brief reviewed and updated periodically',
    ],
  },
  '7.2-PC-3': {
    steps: [
      'Bring accessibility-formatted shows into mainstream marketing with consistent icons',
      'Include them in trailers and social posts and quote disabled artists',
    ],
    indicators: [
      'Accessibility-formatted shows in mainstream marketing within 6 months',
      'Consistent access icons used across marketing',
      'Disabled artists featured in promotion',
    ],
  },
  '7.2-PC-4': {
    steps: [
      'Establish a named accessibility programming budget line, separate from contingency',
      'Apply for accessibility-specific grants to seed it and present it at Board level annually',
    ],
    indicators: [
      'Accessibility programming budget line established within 12 months',
      'Grants pursued to seed the budget',
      'Budget presented at Board level annually',
    ],
  },
  '7.2-PC-5': {
    steps: [
      'Identify and engage one or two disability-led arts partners',
      'Start with a paid advisory relationship before moving to programming partnerships',
    ],
    indicators: [
      'Disability-led arts partners engaged within 12 months',
      'Advisory relationship paid',
      'Partnership deepened over time',
    ],
  },
  '7.2-PC-6': {
    steps: [
      'Add detailed content warnings to every show listing',
      'Cover sensory and thematic factors using a standardised format',
    ],
    indicators: [
      'Content warnings on every show listing within 6 months',
      'Standardised format covering sensory and thematic factors',
      'Warnings reviewed for accuracy each program',
    ],
  },
  '7.2-DD-1': {
    steps: [
      'Develop written guidelines for inclusive performance design, co-designed with disability-led arts organisations',
      'Make them part of every artist contract pack',
    ],
    indicators: [
      'Inclusive performance guidelines developed within 12 months',
      'Guidelines co-designed with disability-led organisations',
      'Guidelines included in every contract pack',
    ],
  },
  '7.2-DD-2': {
    steps: [
      'Add accessibility to every programming brief as a standard line',
      'Include supports available, formats expected and budget',
    ],
    indicators: [
      'Accessibility a standard line in programming briefs within 6 months',
      'Briefs specify supports, formats and budget',
      'Approach applied to all programming',
    ],
  },
  '7.2-DD-3': {
    steps: [
      'Engage paid autistic and sensory-sensitive consultants to design relaxed performances',
      'Pilot one performance before full rollout',
    ],
    indicators: [
      'Consultants engaged to design relaxed performances within 12 months',
      'One relaxed performance piloted',
      'Consultants paid for their input',
    ],
  },
  '7.2-DD-4': {
    steps: [
      'Engage certified human audio description and captioning providers',
      'Avoid auto-generated alternatives, which damage trust',
    ],
    indicators: [
      'Certified AD and captioning providers engaged within 6 months',
      'No auto-generated captioning used for programmed access',
      'Provider quality reviewed via feedback',
    ],
  },
  '7.2-DD-5': {
    steps: [
      'Add standard accessibility clauses to artist contracts',
      'Cover both what the event provides and what the artist commits to',
    ],
    indicators: [
      'Accessibility clauses in artist contracts within 6 months',
      'Clauses cover event and artist commitments',
      'Commitments tracked to delivery',
    ],
  },
  '7.2-DD-6': {
    steps: [
      'Run a workshop on inclusive performance design, partnering with a disability arts organisation for delivery',
      'Pay all participants',
    ],
    indicators: [
      'Inclusive performance workshop run within 12 months',
      'Delivered in partnership with a disability arts organisation',
      'All participants paid',
    ],
  },
  '7.2-DD-7': {
    steps: [
      'Establish baseline accessibility programming metrics',
      'Set 3-year growth targets and report annually to leadership and in your DIAP',
    ],
    indicators: [
      'Baseline programming metrics established within 6 months',
      '3-year growth targets set',
      'Progress reported annually and in the DIAP',
    ],
  },
  '7.2-DD-8': {
    steps: [
      'Adopt a paid-consultancy policy for any accessibility advice from disabled artists, on top of their performance fee',
      'Set hourly rates and end the unpaid-labour expectation',
    ],
    indicators: [
      'Paid-consultancy policy adopted within 6 months',
      'Disabled artists paid for accessibility advice',
      'Rates set and applied consistently',
    ],
  },
  '7.2-DD-9': {
    steps: [
      'Publish detailed sensory information per show (decibel ranges, lighting effects, themes), captured during tech rehearsal',
      'Use a standardised template across the program',
    ],
    indicators: [
      'Per-show sensory information published within 6 months',
      'Information captured during tech rehearsal',
      'Standardised template used across the program',
    ],
  },
  '7.2-DD-10': {
    steps: [
      'Reschedule accessibility-formatted shows into peak attendance times',
      'Audit scheduling annually to prevent drift',
    ],
    indicators: [
      'Accessibility-formatted shows scheduled at peak times within 12 months',
      'Scheduling audited annually',
      'Shows not buried in off-peak slots',
    ],
  },
  '7.2-DD-11': {
    steps: [
      'Develop standard accessibility programming agreements for partner venues',
      'Use the agreements to fund capability uplift over time',
    ],
    indicators: [
      'Accessibility programming agreements with partner venues within 12 months',
      'Agreements fund capability uplift',
      'Venue capability reviewed over time',
    ],
  },
  '7.2-DD-12': {
    steps: [
      'Introduce basic attendance and satisfaction measurement for accessibility-programmed events',
      'Use even simple post-show surveys to inform future programming',
    ],
    indicators: [
      'Attendance and satisfaction measured for accessibility programming within 6 months',
      'Post-show surveys collected',
      'Findings used to inform future programming',
    ],
  },

  // ============================================================
  // Module 7.3 - Ticketing and box office accessibility
  // ============================================================
  '7.3-PC-1': {
    steps: [
      'Configure your ticketing platform to support companion ticketing across multiple shows in one transaction',
      'Register as a Companion Card affiliate',
    ],
    indicators: [
      'Companion ticketing across shows supported within 12 months',
      'Companion Card affiliation in place',
      'Companion concession applied automatically',
    ],
  },
  '7.3-PC-2': {
    steps: [
      'Commission an independent WCAG 2.2 AA audit of your booking flow end-to-end',
      'Address critical issues before the next event opening',
    ],
    indicators: [
      'Booking flow audited for WCAG 2.2 AA within 6 months',
      'Critical issues fixed before the next event opening',
      'Accessibility re-checked when the flow changes',
    ],
  },
  '7.3-PC-3': {
    steps: [
      'Add voluntary disability disclosure at booking, using opt-in language with clear privacy assurance',
      'Use the information to plan support before the event',
    ],
    indicators: [
      'Voluntary disclosure at booking added within 6 months',
      'Disclosure used to plan support before the event',
      'Privacy assurance provided at disclosure',
    ],
  },
  '7.3-PC-4': {
    steps: [
      'Establish formal box office disability-confident customer service training with a specialist provider',
      'Run it before each event opens, not just at onboarding',
    ],
    indicators: [
      'Box office accessibility training established within 6 months',
      'Training run before each event opens',
      'Delivered by a specialist provider',
    ],
  },
  '7.3-PC-5': {
    steps: [
      'Surface accessible pricing options (concession, companion-free, support worker) at the point of selection',
      'Audit pricing pages annually',
    ],
    indicators: [
      'Accessible pricing options surfaced at selection within 6 months',
      'Pricing pages audited annually',
      'Options easy to find without asking',
    ],
  },
  '7.3-PC-6': {
    steps: [
      'Add detailed access information at the point of ticket purchase (venue access, seat accessibility, sensory factors, formats)',
      'Keep it visible, not buried',
    ],
    indicators: [
      'Access information shown at point of purchase within 6 months',
      'Information covers venue, seat, sensory and formats',
      'Information updated for each event',
    ],
  },
  '7.3-DD-1': {
    steps: [
      'Add multiple ticket delivery formats: accessible HTML email, SMS and accessible PDF',
      'Let customers choose their format',
    ],
    indicators: [
      'Multiple accessible ticket formats available within 6 months',
      'Customers can choose their format',
      'Formats tested with assistive technology',
    ],
  },
  '7.3-DD-2': {
    steps: [
      'Establish a phone booking option staffed by trained agents during sales periods',
      'Accept National Relay Service calls',
    ],
    indicators: [
      'Staffed phone booking available during sales periods within 6 months',
      'National Relay Service calls accepted',
      'Agents trained on accessibility',
    ],
  },
  '7.3-DD-3': {
    steps: [
      'Develop a written accessibility refund/exchange policy covering common triggers',
      'Brief box office staff on it',
    ],
    indicators: [
      'Accessibility refund/exchange policy in place within 6 months',
      'Box office staff briefed on the policy',
      'Policy applied consistently, confirmed via feedback',
    ],
  },
  '7.3-DD-4': {
    steps: [
      'Request an accessibility audit from your booking platform vendor',
      'Make audit availability a procurement requirement going forward',
    ],
    indicators: [
      'Vendor accessibility audit requested within 3 months',
      'Audit availability a procurement requirement',
      'Vendor accessibility reviewed at renewal',
    ],
  },
  '7.3-DD-5': {
    steps: [
      'Audit box office physical accessibility (counter height, hearing loop, accessible queue)',
      'Upgrade to meet the baseline',
    ],
    indicators: [
      'Box office physical accessibility audited within 6 months',
      'Counter height, hearing loop and queue accessibility provided within 24 months',
      'Accessibility maintained on a regular schedule',
    ],
  },
  '7.3-DD-6': {
    steps: [
      'Procure EFTPOS terminals with a tactile keypad and contactless',
      'Avoid touchscreen-only EFTPOS, which excludes vision-impaired users',
    ],
    indicators: [
      'Accessible EFTPOS terminals procured within 12 months',
      'Tactile keypad and contactless available',
      'No touchscreen-only EFTPOS without an alternative',
    ],
  },
  '7.3-DD-7': {
    steps: [
      'Add group booking support for support workers and personal care attendants',
      'Allocate accessible seats in groups',
    ],
    indicators: [
      'Group booking for support workers available within 6 months',
      'Accessible seats allocated in groups',
      'Group bookings handled smoothly, confirmed via feedback',
    ],
  },
  '7.3-DD-8': {
    steps: [
      'Document the in-person booking process for accessibility needs',
      'Make it available at all box office workstations',
    ],
    indicators: [
      'In-person accessibility booking process documented within 3 months',
      'Available at all box office workstations',
      'Process followed consistently',
    ],
  },
  '7.3-DD-9': {
    steps: [
      'Set up automated post-purchase access communication (what to expect, where to ask, who to contact)',
      'Trigger it a week before the event, personalised to the seat purchased',
    ],
    indicators: [
      'Post-purchase access communication set up within 6 months',
      'Triggered a week before the event',
      'Personalised to the seat purchased',
    ],
  },
  '7.3-DD-10': {
    steps: [
      'Implement an accessible seat allocation policy',
      'Hold accessible allocations longer than standard seats before releasing to general sale',
    ],
    indicators: [
      'Accessible seat allocation policy in place within 6 months',
      'Allocations held longer than standard seats',
      'Release decisions reviewed for each event',
    ],
  },

  // ============================================================
  // Module 7.4 - Performer and talent accessibility
  // ============================================================
  '7.4-PC-1': {
    steps: [
      'Audit performer access to every stage',
      'For raised stages add ramps (max 1:14 gradient) or lifts',
      'Specify accessibility in stage hire contracts',
    ],
    indicators: [
      'Performer stage access audited within 6 months',
      'Ramps or lifts provided for raised stages within 24 months',
      'Accessibility specified in stage hire contracts',
    ],
  },
  '7.4-PC-2': {
    steps: [
      'Audit dressing rooms for counter heights, accessible toilet and fitting space for mobility aids',
      'Specify accessibility in venue contracts',
      'Communicate dimensions to touring artists in advance',
    ],
    indicators: [
      'Dressing rooms audited within 6 months',
      'Accessibility specified in venue contracts',
      'Dimensions communicated to touring artists in advance',
    ],
  },
  '7.4-PC-3': {
    steps: [
      'Establish an accessible green room with quiet space and sensory regulation',
      'Provide accessible refreshments and charging',
    ],
    indicators: [
      'Accessible green room established within 12 months',
      'Quiet space and sensory regulation provided',
      'Accessible refreshments and charging available',
    ],
  },
  '7.4-PC-4': {
    steps: [
      'Develop a performer accessibility brief and include it in every contract pack',
      'Pair it with a Q&A for first-time artists',
    ],
    indicators: [
      'Performer accessibility brief developed within 3 months',
      'Brief included in every contract pack',
      'Q&A offered to first-time artists',
    ],
  },
  '7.4-PC-5': {
    steps: [
      'Establish a paid production accessibility advisor role',
      'Develop a disabled-performer mentoring programme',
    ],
    indicators: [
      'Paid accessibility advisor role established within 12 months',
      'Disabled-performer mentoring programme running',
      'Advisor engaged on every production',
    ],
  },
  '7.4-PC-6': {
    steps: [
      'Develop multi-day welfare provisions covering rest, sensory recovery and mental health support',
      'Include nutrition provisions',
    ],
    indicators: [
      'Multi-day welfare provisions developed within 6 months',
      'Rest, sensory recovery and mental health support provided',
      'Nutrition provisions included',
    ],
  },
  '7.4-DD-1': {
    steps: [
      'Develop a pre-show accessibility check covering performer-side and audience-side needs',
      'Complete it before every show',
    ],
    indicators: [
      'Pre-show accessibility check developed within 3 months',
      'Check completed before every show',
      'Both performer and audience needs covered',
    ],
  },
  '7.4-DD-2': {
    steps: [
      'Establish accessible talent transport partnerships and train operators',
      'Factor accessible transport into talent rider negotiations',
    ],
    indicators: [
      'Accessible talent transport partnerships in place within 12 months',
      'Operators trained on accessibility',
      'Accessible transport factored into rider negotiations',
    ],
  },
  '7.4-DD-3': {
    steps: [
      'Stock multiple mic types (handheld, lapel, headset)',
      'Ask performer preference at the production meeting',
    ],
    indicators: [
      'Multiple mic types stocked within 6 months',
      'Performer preference asked at production meeting',
      'Preferred mic provided on the day',
    ],
  },
  '7.4-DD-4': {
    steps: [
      'Add a performer accessibility review to lighting design (sensory considerations, cueing visibility)',
      'Run a pre-show check with performers',
    ],
    indicators: [
      'Performer accessibility review added to lighting design within 6 months',
      'Pre-show check run with performers',
      'Sensory and cueing needs accommodated',
    ],
  },
  '7.4-DD-5': {
    steps: [
      'Establish a pre-production briefing between performers, stage management and the access lead',
      'Cover cueing alternatives, communication preferences and mobility considerations',
    ],
    indicators: [
      'Pre-production accessibility briefing established within 6 months',
      'Cueing, communication and mobility needs covered',
      'Briefing held for every production',
    ],
  },
  '7.4-DD-6': {
    steps: [
      'Add accessibility provisions to the standard tour rider',
      'Make them default, not an add-on requested individually',
    ],
    indicators: [
      'Accessibility provisions added to standard tour rider within 6 months',
      'Provisions applied by default',
      'No retrofitting on individual request',
    ],
  },
  '7.4-DD-7': {
    steps: [
      'Document reasonable adjustments at contract and share them across the full production team',
      'Brief the adjustments at the production meeting',
    ],
    indicators: [
      'Reasonable adjustments documented at contract within 3 months',
      'Adjustments shared across the production team',
      'Adjustments honoured, confirmed via performer feedback',
    ],
  },
  '7.4-DD-8': {
    steps: [
      'Develop an on-site disabled artist mentoring programme',
      'Partner with disability arts organisations',
    ],
    indicators: [
      'On-site disabled artist mentoring programme developed within 12 months',
      'Partnership with a disability arts organisation in place',
      'Paid mentor pairs offered',
    ],
  },
  '7.4-DD-9': {
    steps: [
      'Develop accessible press provisions covering interview rooms, captioned recording and NRS contact',
      'Apply them to all performer press',
    ],
    indicators: [
      'Accessible press provisions developed within 6 months',
      'Interview rooms, captioned recording and NRS contact covered',
      'Provisions applied to all performer press',
    ],
  },
  '7.4-DD-10': {
    steps: [
      'Establish a backstage accessibility kit (sensory tools, communication boards, charging) in the green room',
      'Brief stage management to offer it proactively',
    ],
    indicators: [
      'Backstage accessibility kit established within 6 months',
      'Kit located in the green room',
      'Stage management briefed to offer it proactively',
    ],
  },
  '7.4-DD-11': {
    steps: [
      'Develop performer evacuation processes',
      'Drill them with disability-access scenarios before opening',
    ],
    indicators: [
      'Performer evacuation processes documented within 6 months',
      'Processes drilled with disability-access scenarios before opening',
      'Processes reviewed after each event',
    ],
  },

  // ============================================================
  // Module 7.5 - Workforce and cross-event coordination
  // ============================================================
  '7.5-PC-1': {
    steps: [
      'Develop a scaled volunteer accessibility briefing system that covers all volunteers consistently',
      'Use a train-the-trainer model to reach hundreds of volunteers',
    ],
    indicators: [
      'Scaled volunteer briefing system developed within 6 months',
      'All volunteers briefed consistently, not just the access team',
      'Train-the-trainer model in place',
    ],
  },
  '7.5-PC-2': {
    steps: [
      'Standardise identifying clothing for all staff showing role',
      'Make the access team distinctly identifiable with colour and clear "ACCESS" text',
    ],
    indicators: [
      'Identifying clothing standardised within 6 months',
      'Access team distinctly identifiable',
      'Attendees can locate access support on sight',
    ],
  },
  '7.5-PC-3': {
    steps: [
      'Develop inclusive evacuation processes covering visual alerts, accessible refuge, sensory awareness and a trained support team',
      'Drill them before opening',
    ],
    indicators: [
      'Inclusive evacuation processes developed within 6 months',
      'Visual alerts, accessible refuge and sensory awareness covered',
      'Processes drilled before opening',
    ],
  },
  '7.5-PC-4': {
    steps: [
      'Set up a dedicated access communication channel for real-time issues',
      'Include all venue leads, rovers, info points and the central team',
    ],
    indicators: [
      'Dedicated access communication channel set up within 3 months',
      'All venue leads, rovers and info points included',
      'Real-time issues resolved through the channel',
    ],
  },
  '7.5-PC-5': {
    steps: [
      'Develop accessibility planning for VIP, sponsor and press cohorts',
      'Brief cohort hosts and managers',
    ],
    indicators: [
      'Cohort accessibility planning developed within 6 months',
      'VIP, sponsor and press cohorts covered',
      'Cohort hosts and managers briefed',
    ],
  },
  '7.5-PC-6': {
    steps: [
      'Establish an Auslan rover team and captioned screens at info points',
      'Brief PA announcers to cue the captioner',
    ],
    indicators: [
      'Auslan rovers and captioned info screens established within 12 months',
      'Access extended beyond programmed shows',
      'PA announcers cue the captioner',
    ],
  },
  '7.5-DD-1': {
    steps: [
      'Develop a comprehensive volunteer accessibility kit (lanyard, scripts, location maps, communication boards)',
      'Issue it at onboarding and brief volunteers on its use',
    ],
    indicators: [
      'Volunteer accessibility kit developed within 6 months',
      'Kit issued at onboarding',
      'Volunteers briefed on its use',
    ],
  },
  '7.5-DD-2': {
    steps: [
      'Recruit and train an access champion network',
      'Distribute champions across venue clusters, not a single point',
    ],
    indicators: [
      'Access champion network established within 12 months',
      'Champions distributed across venue clusters',
      'Every cluster has a trained champion',
    ],
  },
  '7.5-DD-3': {
    steps: [
      'Engage paid disabled trainers for volunteer training',
      'Co-design the content with them',
    ],
    indicators: [
      'Paid disabled trainers engaged for next event',
      'Training content co-designed with them',
      'Trainers paid at professional rates',
    ],
  },
  '7.5-DD-4': {
    steps: [
      'Add an access update as a standard agenda item at every shift briefing',
      'Carry forward issues from previous shifts',
    ],
    indicators: [
      'Access update a standard briefing agenda item within 3 months',
      'Issues carried forward between shifts',
      'Volunteers act on previous-shift updates',
    ],
  },
  '7.5-DD-5': {
    steps: [
      'Establish volunteer welfare provisions: dedicated rest area, food and water, sensory regulation',
      'Provide a mental health contact',
    ],
    indicators: [
      'Volunteer welfare provisions established within 6 months',
      'Rest area, food, water and sensory regulation available',
      'Mental health contact provided',
    ],
  },
  '7.5-DD-6': {
    steps: [
      'Build active recruitment partnerships and audit role descriptions for assumed-ability barriers',
      'Document the adjustment process',
    ],
    indicators: [
      'Recruitment partnerships built within 12 months',
      'Role descriptions audited for assumed-ability barriers',
      'Adjustment process documented',
    ],
  },
  '7.5-DD-7': {
    steps: [
      'Develop a sponsor activation accessibility checklist',
      'Make it a sponsorship contract requirement',
    ],
    indicators: [
      'Sponsor activation accessibility checklist developed within 6 months',
      'Checklist a sponsorship contract requirement',
      'Activations vetted before approval',
    ],
  },
  '7.5-DD-8': {
    steps: [
      'Audit press provisions: camera positions, press release format, interview spaces and contact channel',
      'Address each gap',
    ],
    indicators: [
      'Press provisions audited within 6 months',
      'Camera positions, formats, spaces and contact addressed',
      'Press areas accessible before the next event',
    ],
  },
  '7.5-DD-9': {
    steps: [
      'Specify accessibility requirements in VIP and hospitality design (counter heights, knee clearance, accessible toilets nearby)',
      'Audit during set-up',
    ],
    indicators: [
      'Accessibility specified in VIP and hospitality design within 6 months',
      'Counter heights, knee clearance and nearby accessible toilets provided',
      'Audited during set-up',
    ],
  },
  '7.5-DD-10': {
    steps: [
      'Redesign accreditation with large print, tactile elements and accessible lanyards',
      'Apply the design to all passes',
    ],
    indicators: [
      'Accreditation redesigned for accessibility within 12 months',
      'Large print, tactile elements and accessible lanyards used',
      'Design applied to all passes',
    ],
  },
  '7.5-DD-11': {
    steps: [
      'Run an inclusive evacuation drill before opening with multiple disability-access scenarios',
      'Engage paid disabled actors for authenticity',
    ],
    indicators: [
      'Inclusive evacuation drill run before opening',
      'Multiple disability-access scenarios included',
      'Paid disabled actors engaged',
    ],
  },

  // ============================================================
  // Module 7.6 - Precinct-wide sensory and experience provisions
  // ============================================================
  '7.6-PC-1': {
    steps: [
      'Establish at least one quiet sensory room at a hub and one stimulating sensory room',
      'For multi-venue events, distribute sensory rooms across the precinct',
    ],
    indicators: [
      'Quiet and stimulating sensory rooms established within 12 months',
      'Rooms distributed across the precinct for multi-venue events',
      'Rooms staffed and signposted',
    ],
  },
  '7.6-PC-2': {
    steps: [
      'Introduce app-based ordering or pre-order options for food and merchandise',
      'Offer seat delivery as an optional paid service',
    ],
    indicators: [
      'App-based ordering or pre-order introduced within 12 months',
      'Queue burden reduced for attendees',
      'Seat delivery offered as an option',
    ],
  },
  '7.6-PC-3': {
    steps: [
      'Develop social stories with photos for major venues',
      'Add in-person sensory preview sessions before opening day',
    ],
    indicators: [
      'Social stories with photos developed within 6 months',
      'In-person sensory previews offered before opening',
      'Familiarisation reaches attendees pre-event',
    ],
  },
  '7.6-PC-4': {
    steps: [
      'Develop a precinct-wide coloured zoning system with WCAG-compliant colour selection',
      'Apply it consistently across maps, signs and staff scripts',
    ],
    indicators: [
      'Precinct-wide coloured zoning system developed within 12 months',
      'WCAG-compliant colours selected',
      'Zoning applied across maps, signs and staff scripts',
    ],
  },
  '7.6-PC-5': {
    steps: [
      'Establish a QR-code info network at every venue and key zone',
      'Link it to live info via your central accessibility register',
    ],
    indicators: [
      'QR-code info network established within 12 months',
      'Live access info available at every venue and key zone',
      'Linked to the central accessibility register',
    ],
  },
  '7.6-PC-6': {
    steps: [
      'Schedule at least one precinct-wide sensory-friendly window per event',
      'Brief all venues, vendors and entertainment',
    ],
    indicators: [
      'Precinct-wide sensory-friendly window scheduled each event',
      'All venues, vendors and entertainment briefed',
      'Low-stim conditions delivered during the window',
    ],
  },
  '7.6-DD-1': {
    steps: [
      'Establish service animal relief areas across the precinct with water and clear signage',
      'Brief all staff on service animal access rights',
    ],
    indicators: [
      'Service animal relief areas established within 12 months',
      'Water and clear signage provided',
      'All staff briefed on service animal access rights',
    ],
  },
  '7.6-DD-2': {
    steps: [
      'Audit major routes between venues for rest gaps',
      'Hire portable rest seating to fill the gaps',
      'Mark rest seating on the event map',
    ],
    indicators: [
      'Major routes audited for rest gaps within 6 months',
      'Rest seating provided at appropriate intervals',
      'Rest seating marked on the event map',
    ],
  },
  '7.6-DD-3': {
    steps: [
      'Develop accessible food and drink standards and apply them to vendor selection',
      'Publish vendor-by-vendor dietary info',
    ],
    indicators: [
      'Accessible food and drink standards developed within 6 months',
      'Standards applied to vendor selection',
      'Vendor-by-vendor dietary info published',
    ],
  },
  '7.6-DD-4': {
    steps: [
      'Add captioned signs and app notifications to lost-and-found communication',
      'Do not rely on PA announcements alone',
    ],
    indicators: [
      'Captioned signs and app notifications added within 6 months',
      'Lost-and-found communication not reliant on PA alone',
      'Multiple formats reach attendees',
    ],
  },
  '7.6-DD-5': {
    steps: [
      'Develop a sensory map and distribute it in the pre-event pack to all ticket buyers',
      'Co-design it with autistic adults',
    ],
    indicators: [
      'Sensory map developed within 6 months',
      'Distributed in the pre-event pack to all ticket buyers',
      'Co-designed with autistic adults',
    ],
  },
  '7.6-DD-6': {
    steps: [
      'Develop social stories with photos for major venues, co-designed with the autistic community',
      'Distribute them in pre-event communication',
    ],
    indicators: [
      'Per-venue social stories developed within 6 months',
      'Co-designed with the autistic community',
      'Distributed in pre-event communication',
    ],
  },
  '7.6-DD-7': {
    steps: [
      'Add virtual familiarisation tours for low-cost, high reach',
      'Add in-person tours for major events',
    ],
    indicators: [
      'Virtual familiarisation tours offered within 12 months',
      'In-person tours added for major events',
      'Tours promoted pre-event',
    ],
  },
  '7.6-DD-8': {
    steps: [
      'Add visual schedules at every venue in high-contrast, sans-serif, large type',
      'Position them at each entrance',
    ],
    indicators: [
      'Visual schedules added at every venue within 12 months',
      'High-contrast, sans-serif, large type used',
      'Positioned at each entrance',
    ],
  },
  '7.6-DD-9': {
    steps: [
      'Audit hearing augmentation per venue',
      'Map it on the event map with standardised symbols and pickup info',
    ],
    indicators: [
      'Hearing augmentation audited per venue within 6 months',
      'Availability mapped with standardised symbols',
      'Pickup info published',
    ],
  },
  '7.6-DD-10': {
    steps: [
      'Establish a rover team with identifiable clothing',
      'Set up contact channels (SMS, app, phone)',
    ],
    indicators: [
      'Roving access support team established within 6 months',
      'Team clearly identifiable',
      'Contactable by SMS, app and phone',
    ],
  },
  '7.6-DD-11': {
    steps: [
      'Develop a documented access rest pass / re-entry policy for sensory breaks',
      'Communicate it in the pre-event email',
    ],
    indicators: [
      'Access rest pass / re-entry policy documented within 6 months',
      'Policy communicated in the pre-event email',
      'Re-entry for sensory breaks honoured',
    ],
  },
  '7.6-DD-12': {
    steps: [
      'Develop a communication board with trained staff at info points',
      'Co-design it with AAC users',
    ],
    indicators: [
      'Communication boards available at info points within 6 months',
      'Staff trained to use them',
      'Co-designed with AAC users',
    ],
  },
  '7.6-DD-13': {
    steps: [
      'Develop sensory kits with input from autistic adults',
      'Stock them at multiple info points',
      'Train staff to offer them proactively',
    ],
    indicators: [
      'Sensory kits developed within 6 months',
      'Stocked at multiple info points',
      'Staff trained to offer them proactively',
    ],
  },
  '7.6-DD-14': {
    steps: [
      'Pilot haptic devices at the next event, hired from accessibility tech specialists',
      'Promote them to the Deaf community',
    ],
    indicators: [
      'Haptic devices piloted at the next event',
      'Hired from accessibility tech specialists',
      'Promoted to the Deaf community',
    ],
  },
  '7.6-DD-15': {
    steps: [
      'Audit accessible viewing platforms at every stage',
      'Add companion seating',
      'Test sight lines from every position',
    ],
    indicators: [
      'Viewing platforms audited at every stage within 6 months',
      'Companion seating added',
      'Sight lines tested from every position',
    ],
  },
  '7.6-DD-16': {
    steps: [
      'Pilot a multisensory zone at the next event, co-designed with disabled artists',
      'Position it as artistic programming, not just an accessibility provision',
    ],
    indicators: [
      'Multisensory zone piloted at the next event',
      'Co-designed with disabled artists',
      'Positioned as artistic programming',
    ],
  },
  '7.6-DD-17': {
    steps: [
      'Establish a support worker rest area with food, water and charging',
      'Communicate the provisions proactively',
    ],
    indicators: [
      'Support worker rest area established within 6 months',
      'Food, water and charging provided',
      'Provisions communicated proactively',
    ],
  },
  '7.6-DD-18': {
    steps: [
      'Produce pocket communication cards for every customer-facing staff member',
      'Co-design the icons with AAC users',
    ],
    indicators: [
      'Pocket communication cards produced within 6 months',
      'Carried by every customer-facing staff member',
      'Icons co-designed with AAC users',
    ],
  },
  '7.6-DD-19': {
    steps: [
      'Establish an equipment loan service with a range of mobility equipment',
      'Source it from medical hire or build a pool',
    ],
    indicators: [
      'Equipment loan service established within 12 months',
      'Range of mobility equipment available',
      'Loans taken up by attendees',
    ],
  },
  '7.6-DD-20': {
    steps: [
      'Establish charging stations, medicine fridges and an accessible medical waiting room',
      'Communicate availability proactively',
    ],
    indicators: [
      'Charging, medicine fridges and accessible medical room established within 12 months',
      'Availability communicated proactively',
      'Facilities used by attendees who need them',
    ],
  },
  '7.6-DD-21': {
    steps: [
      'Programme inclusive interactive activities',
      'Co-design them with disability sport bodies or disability arts',
      'Pay the facilitators',
    ],
    indicators: [
      'Inclusive interactive activities programmed within 12 months',
      'Co-designed with disability sport or arts bodies',
      'Facilitators paid',
    ],
  },

  // ============================================================
  // Module 1.1 - Pre-visit information
  // ============================================================
  '1.1-F-1': {
    steps: [
      'Create and publish accessibility information covering physical access, sensory environment and available supports',
      'Publish it before customers visit, as expected under the DDA 1992',
    ],
    indicators: [
      'Accessibility information published within 3 months',
      'Physical access, sensory environment and supports covered',
      'Information available to customers before they visit',
    ],
  },
  '1.1-F-3A': {
    steps: [
      'Identify the channel most customers use to plan visits (website, Google Business Profile or social media)',
      'Start sharing accessibility information there',
    ],
    indicators: [
      'Primary planning channel identified within 1 month',
      'Accessibility information shared on that channel',
      'Customers can find it where they already look',
    ],
  },
  '1.1-F-2B': {
    steps: [
      'Share specific accessibility information: physical access, sensory environment, supports and equipment, transport options and what to expect on arrival',
      'Cover each type rather than a single generic statement',
    ],
    indicators: [
      'Specific accessibility information shared within 3 months',
      'All key information types covered',
      'Generic statements replaced with detail',
    ],
  },
  '1.1-D-2a': {
    steps: [
      'Add specific physical access details: entrance type, step counts, ramp availability, door widths, surface types, accessible parking proximity and lift access',
      'Keep the detail concrete so customers can plan confidently',
    ],
    indicators: [
      'Specific physical access details published within 3 months',
      'Entrance, steps, ramps, doors and lift access covered',
      'Customers able to plan from the detail provided',
    ],
  },
  '1.1-D-2b': {
    steps: [
      'Add sensory and social environment descriptions covering noise, lighting, crowd density and background music',
      'Flag any potentially overwhelming stimuli',
    ],
    indicators: [
      'Sensory and social environment described within 3 months',
      'Noise, lighting, crowd and music covered',
      'Overwhelming stimuli flagged for planning',
    ],
  },
  '1.1-D-1a': {
    steps: [
      'Publish your accessibility information as a dedicated page on your website',
      'Add it to your Google Business Profile, social media and third-party listings',
    ],
    indicators: [
      'Dedicated accessibility page published within 3 months',
      'Information added to Google Business Profile and listings',
      'Consistent across platforms',
    ],
  },
  '1.1-D-1b': {
    steps: [
      'Make accessibility information findable within two clicks from your homepage',
      'Add a prominent link in your main navigation, footer or header',
    ],
    indicators: [
      'Accessibility information reachable within two clicks',
      'Prominent link added to navigation, footer or header',
      'Information not buried under generic headings',
    ],
  },
  '1.1-F-3B': {
    steps: [
      'Conduct a physical walkthrough comparing published details against actual conditions',
      'Establish a process to verify accuracy going forward',
    ],
    indicators: [
      'Verification walkthrough completed within 3 months',
      'Published details confirmed against actual conditions',
      'Ongoing accuracy process established',
    ],
  },
  '1.1-D-3a': {
    steps: [
      'Review your accessibility information now',
      'Establish a regular review cycle at least every 6 months, or whenever physical changes occur',
    ],
    indicators: [
      'Accessibility information reviewed within 1 month',
      'Regular review cycle established at least every 6 months',
      'Information updated whenever the venue changes',
    ],
  },
  '1.1-D-3b': {
    steps: [
      'Verify your accessibility information against a physical site audit and customer feedback',
      'Cross-reference relevant Australian Standards (AS 1428.1)',
    ],
    indicators: [
      'Information verified against a site audit within 3 months',
      'Customer feedback used to check accuracy',
      'Cross-referenced against AS 1428.1',
    ],
  },
  '1.1-D-9': {
    steps: [
      'Audit all platforms where your accessibility information appears',
      'Align them so website, Google listing, social media and third-party platforms match',
    ],
    indicators: [
      'All platforms audited for consistency within 3 months',
      'Discrepancies between platforms resolved',
      'Information matches across all channels',
    ],
  },
  '1.1-D-10': {
    steps: [
      'Clearly state known barriers or limitations on your accessibility page',
      'Give customers honest information so they can plan rather than discover barriers on arrival',
    ],
    indicators: [
      'Known barriers stated on the accessibility page within 3 months',
      'Limitations described honestly',
      'Customers can plan around barriers in advance',
    ],
  },
  '1.1-D-11': {
    steps: [
      'Add a clear invitation for customers to give feedback on the accuracy of your accessibility information',
      'Include a contact method and indicate how feedback will be used',
    ],
    indicators: [
      'Feedback invitation added within 3 months',
      'Contact method provided',
      'Feedback used to improve accuracy',
    ],
  },
  '1.1-D-12': {
    steps: [
      'Assign a specific person or role to maintain your accessibility information',
      'Make ownership clear so information does not become outdated',
    ],
    indicators: [
      'Ownership of accessibility information assigned within 1 month',
      'Named person or role responsible',
      'Information kept current under clear ownership',
    ],
  },
  '1.1-F-5': {
    steps: [
      'Provide multiple ways to ask accessibility questions before visiting: phone, email, online chat, contact form and social media messaging',
      'Avoid relying on a single channel',
    ],
    indicators: [
      'Multiple contact channels available within 3 months',
      'Phone and non-phone options both provided',
      'No customer excluded by a single-channel approach',
    ],
  },
  '1.1-D-5a': {
    steps: [
      'Establish a clear process for handling accessibility enquiries: who responds, response times, escalation paths and how to source accurate answers',
      'Document it so handling is consistent',
    ],
    indicators: [
      'Enquiry-handling process established within 3 months',
      'Responder, response times and escalation defined',
      'Enquiries handled consistently',
    ],
  },
  '1.1-D-5b': {
    steps: [
      'Provide at least one non-phone option for accessibility questions, such as email, live chat or an online contact form',
      'Make it available to customers who cannot use phone-only channels',
    ],
    indicators: [
      'Non-phone contact option available within 3 months',
      'Accessible to Deaf, hard-of-hearing and speech-disability customers',
      'Enquiries received through the channel',
    ],
  },
  '1.1-D-5c': {
    steps: [
      'Add a clear prompt inviting accessibility questions on your website, in booking confirmations and on marketing materials',
      'Use welcoming phrasing that signals openness',
    ],
    indicators: [
      'Proactive prompt added within 3 months',
      'Prompt shown on website, confirmations and marketing',
      'Customers encouraged to ask before visiting',
    ],
  },
  '1.1-D-5d': {
    steps: [
      'Have people with disability attempt to use each contact channel',
      'Check forms are keyboard-accessible, chat supports screen readers and phone systems work with TTY/relay',
    ],
    indicators: [
      'Contact channels tested with people with disability within 6 months',
      'Keyboard, screen reader and relay compatibility checked',
      'Barriers found in testing addressed',
    ],
  },
  '1.1-D-5e': {
    steps: [
      'Prioritise testing your most-used contact channels for accessibility',
      'Test at least your website contact form for keyboard and screen reader compatibility per WCAG 2.2 AA',
    ],
    indicators: [
      'Most-used channels tested within 6 months',
      'Contact form meets WCAG 2.2 AA',
      'Priority channels confirmed accessible',
    ],
  },
  '1.1-D-5f': {
    steps: [
      'Request an Access Compass review of your contact channels',
      'Use it to identify barriers not apparent through internal testing',
    ],
    indicators: [
      'Contact channel review requested within 3 months',
      'Barriers beyond internal testing identified',
      'Findings actioned',
    ],
  },
  '1.1-F-6': {
    steps: [
      'Prepare a reference guide of common accessibility enquiries and accurate answers',
      'Include accessible parking location, entrance type, available supports and who to escalate to',
    ],
    indicators: [
      'Staff reference guide prepared within 3 months',
      'Common enquiries and accurate answers covered',
      'Staff respond confidently, confirmed via feedback',
    ],
  },
  '1.1-D-6a': {
    steps: [
      'Create formal guidance for responding to accessibility enquiries, such as an FAQ, response templates or a knowledge base',
      'Replace ad hoc approaches so experiences are consistent',
    ],
    indicators: [
      'Formal enquiry guidance created within 3 months',
      'Guidance accessible to all relevant staff',
      'Responses consistent across staff',
    ],
  },
  '1.1-D-6b': {
    steps: [
      'Establish a clear escalation path for questions front-line staff cannot answer',
      'Designate a knowledgeable person and set expected turnaround times',
    ],
    indicators: [
      'Escalation path established within 3 months',
      'Knowledgeable escalation point designated',
      'Turnaround times set and met',
    ],
  },
  '1.1-F-7': {
    steps: [
      'Offer familiarisation visits or virtual orientation sessions for customers with disability',
      'Use them to help customers plan their route and understand the sensory environment',
    ],
    indicators: [
      'Familiarisation visits or virtual orientation offered within 12 months',
      'Customers can plan route and sensory environment in advance',
      'Uptake tracked',
    ],
  },
  '1.1-D-7a': {
    steps: [
      'Identify and document the specific barriers preventing familiarisation visits',
      'Explore low-resource alternatives such as virtual tours or detailed photo guides',
    ],
    indicators: [
      'Barriers to familiarisation visits documented within 3 months',
      'Low-resource alternatives explored',
      'A pre-visit option offered within 12 months',
    ],
  },
  '1.1-D-7b': {
    steps: [
      'Promote familiarisation visits on your accessibility page, in the booking process and social media',
      'Mention them when responding to accessibility enquiries',
    ],
    indicators: [
      'Familiarisation visits promoted within 3 months',
      'Promoted across accessibility page, booking and social media',
      'Mentioned when answering accessibility enquiries',
    ],
  },
  '1.1-F-8': {
    steps: [
      'Add accessible transport information: nearest accessible public transport stops, taxi and rideshare drop-off, and walking route details',
      'Cover the route from transport stops to your entrance',
    ],
    indicators: [
      'Accessible transport information published within 3 months',
      'Public transport, taxi and rideshare options covered',
      'Route from transport to entrance described',
    ],
  },
  '1.1-D-8a': {
    steps: [
      'Make transport information specific to accessibility needs: lift access at nearby stations, kerb ramp locations, accessible taxi ranks and gradients',
      'Replace generic directions with accessible-feature detail',
    ],
    indicators: [
      'Accessibility-specific transport detail published within 3 months',
      'Lift access, kerb ramps and gradients covered',
      'Generic directions replaced with specifics',
    ],
  },
  '1.1-D-8b': {
    steps: [
      'Describe the last 50 metres from the nearest transport stop or parking to your entrance',
      'Include surface type, gradient, kerb ramps, crossings and any obstacles',
    ],
    indicators: [
      'Last-50-metres description published within 3 months',
      'Surface, gradient, kerb ramps and crossings covered',
      'Obstacles flagged for planning',
    ],
  },
  '1.1-D-13': {
    steps: [
      'Create a social story or visual narrative showing what to expect from arrival to departure',
      'Make it a step-by-step visual guide',
    ],
    indicators: [
      'Social story or visual narrative created within 6 months',
      'Covers arrival through to departure step by step',
      'Distributed to customers pre-visit',
    ],
  },
};
