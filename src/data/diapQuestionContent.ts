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
};
