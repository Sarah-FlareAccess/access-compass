/**
 * Help Content Data
 *
 * Rich help content for questions including images, videos, and tips.
 * Images should be placed in /public/help/ folder.
 *
 * To add a video: Use the Vimeo URL (e.g., 'https://vimeo.com/123456789')
 * To add images: Place in /public/help/ and reference as '/help/filename.jpg'
 */

import type { HelpContent } from '../hooks/useBranchingLogic';

// Map question IDs to their help content
export const HELP_CONTENT: Record<string, HelpContent> = {
  // ============================================
  // WAYFINDING & SIGNAGE (B2 module)
  // ============================================

  'B2-1-1': {
    title: 'Understanding accessible signage',
    summary:
      'Good signage uses high contrast colours, clear fonts, and appropriate sizing to ensure everyone can read important information easily.',
    examples: [
      {
        type: 'good',
        imageUrl: '/help/signage-good-contrast.jpg',
        caption: 'High contrast signage',
        details: 'Dark text on light background, simple sans-serif font, clear hierarchy.',
      },
      {
        type: 'poor',
        imageUrl: '/help/signage-poor-contrast.jpg',
        caption: 'Low contrast signage',
        details: 'Light grey text on white, decorative font that is hard to read.',
      },
      {
        type: 'good',
        imageUrl: '/help/signage-good-size.jpg',
        caption: 'Appropriate text sizing',
        details: 'Main text at least 18pt, can be read from expected viewing distance.',
      },
      {
        type: 'poor',
        imageUrl: '/help/signage-poor-size.jpg',
        caption: 'Text too small',
        details: 'Important information in small print that requires close viewing.',
      },
    ],
    tips: [
      'Aim for a contrast ratio of at least 4.5:1 between text and background',
      'Use sans-serif fonts like Arial, Helvetica, or Verdana',
      'Main headings should be at least 18pt (24px)',
      'Avoid all-caps for long text - it reduces readability',
      'Ensure signs are well-lit and avoid glare from glass covers',
    ],
    videoUrl: 'https://vimeo.com/example-signage',
    videoCaption: 'Quick guide to accessible signage',
    learnMoreUrl: 'https://www.w3.org/WAI/perspective-videos/contrast/',
  },

  // ============================================
  // PHYSICAL ACCESS (A2 module - Entrances)
  // ============================================

  'A2-F-1': {
    title: 'Understanding this question',
    summary:
      'Step-free access is essential for people with mobility aids, prams, trolleys, and anyone who finds steps difficult. Tell us what your main entrance has so we can ask the right follow-up questions about stairs, ramps, and other features.',
    understanding: [
      'Select "Level access" if the entrance is completely step-free with no threshold, step, or level change',
      'Select "Permanent ramp" if a fixed ramp provides step-free access to the entrance',
      'Select "Stairs or steps" if there are one or more steps at the entrance',
      'Select "Portable ramp" if a ramp is available but needs staff to set it up when needed',
      'Select "Step-free access at a secondary entrance" if your main entrance has steps but another entrance provides step-free access',
      'You can select more than one. For example, many entrances have both stairs and a permanent ramp alongside',
    ],
    tips: [
      'Level access at the main entrance is the gold standard because everyone uses the same door',
      'If you have stairs, a permanent ramp alongside is much better than a portable one',
      'Even a small lip or weather strip at the door can be a barrier, so select "Stairs or steps" if in doubt',
      'If your only step-free access is at a secondary entrance, clear signage from the main entrance is essential',
    ],
  },

  'A3a-1-1': {
    title: 'Wheelchair circulation space',
    summary:
      'For someone using a wheelchair to move comfortably through your space, pathways need adequate width and turning room. This also benefits people with prams, trolleys, or walking frames.',
    examples: [
      {
        type: 'good',
        imageUrl: '/help/pathway-clear.jpg',
        caption: 'Clear wide pathway',
        details: 'At least 1200mm wide, no obstacles, smooth surface.',
      },
      {
        type: 'poor',
        imageUrl: '/help/pathway-narrow.jpg',
        caption: 'Pathway too narrow',
        details: 'Furniture and displays reduce pathway to less than 900mm.',
      },
      {
        type: 'good',
        imageUrl: '/help/turning-space.jpg',
        caption: 'Adequate turning space',
        details: '1500mm x 1500mm clear area allows wheelchair to turn.',
      },
      {
        type: 'info',
        imageUrl: '/help/pathway-obstruction.jpg',
        caption: 'Temporary obstructions',
        details: 'A-frames, displays, and stock can block accessible routes.',
      },
    ],
    tips: [
      'Walk through with a tape measure - aim for 1200mm minimum pathway width',
      'Check that aisles between furniture allow passage',
      'Ensure there is turning space at the end of aisles (1500mm circle)',
      'Keep floors clear of trailing cables and mats with curled edges',
      'Regularly check that stock and displays have not narrowed pathways',
    ],
  },

  'A2-D-10': {
    title: 'Doorway widths',
    summary:
      'Standard wheelchairs need at least 850mm clear opening width to pass through comfortably. Measure the narrowest point when the door is fully open.',
    examples: [
      {
        type: 'good',
        imageUrl: '/help/doorway-wide.jpg',
        caption: 'Adequate doorway',
        details: '900mm+ clear opening, lever handle, easy to open.',
      },
      {
        type: 'poor',
        imageUrl: '/help/doorway-narrow.jpg',
        caption: 'Too narrow',
        details: 'Only 750mm clear - wheelchair users cannot pass through.',
      },
      {
        type: 'info',
        imageUrl: '/help/doorway-measure.jpg',
        caption: 'How to measure',
        details: 'Measure the clear opening with door at 90 degrees, not the frame.',
      },
    ],
    tips: [
      'Measure from the door face (when open) to the opposite frame edge',
      '850mm minimum, but 900mm+ is better for powered wheelchairs',
      'Lever handles are easier to use than round knobs',
      'Consider if the door can be held open during busy periods',
      'Automatic or push-button doors improve access significantly',
    ],
  },

  'A4-1-3': {
    title: 'Accessible counter heights',
    summary:
      'A section of counter at a lower height allows wheelchair users and people of short stature to interact comfortably. The ideal height is 750-850mm with knee clearance underneath.',
    examples: [
      {
        type: 'good',
        imageUrl: '/help/counter-accessible.jpg',
        caption: 'Lowered counter section',
        details: '800mm high with knee space underneath, well lit.',
      },
      {
        type: 'poor',
        imageUrl: '/help/counter-high.jpg',
        caption: 'Counter too high',
        details: 'Standard 1100mm counter - wheelchair user cannot see over or reach.',
      },
      {
        type: 'info',
        imageUrl: '/help/counter-knee-space.jpg',
        caption: 'Knee clearance',
        details: 'At least 700mm high and 500mm deep to allow wheelchair approach.',
      },
    ],
    tips: [
      'Even a small section (900mm wide) at lower height helps',
      'Ensure the lowered section is at a transaction point, not just decoration',
      'Keep the lowered section clear - do not stack items on it',
      'Good lighting at the counter helps everyone',
      'If structural changes are not possible, offer to come around to assist',
    ],
  },

  // ============================================
  // WAYFINDING
  // ============================================

  'B2-1-2': {
    title: 'Consistent sign placement',
    summary:
      'Placing signs at consistent heights and locations helps people navigate independently. Signs should be at eye level (1200-1600mm from floor) and at decision points.',
    examples: [
      {
        type: 'good',
        imageUrl: '/help/wayfinding-consistent.jpg',
        caption: 'Consistent placement',
        details: 'All directional signs at same height, at each junction.',
      },
      {
        type: 'poor',
        imageUrl: '/help/wayfinding-random.jpg',
        caption: 'Inconsistent placement',
        details: 'Signs at varying heights, easy to miss.',
      },
      {
        type: 'info',
        imageUrl: '/help/wayfinding-decision-point.jpg',
        caption: 'Decision points',
        details: 'Where pathways split or rooms are accessed - key sign locations.',
      },
    ],
    tips: [
      'Walk through as if visiting for the first time - where do you need guidance?',
      'Signs should be perpendicular to the direction of travel for better visibility',
      'Use symbols alongside text where possible (e.g., toilet symbols)',
      'Avoid placing signs behind glass that creates glare',
      'Check signs are not blocked by plants, furniture, or temporary displays',
    ],
  },

  'A2-F-8': {
    title: 'Understanding this question',
    summary:
      'Tactile Ground Surface Indicators (TGSIs) are standardised textured surfaces that help people who are blind or have low vision navigate and identify hazards by feel. Warning indicators (raised dots) alert to hazards like steps, ramps, or road crossings, while directional indicators (raised bars) guide people along a path.',
    understanding: [
      'Answer "Yes" if TGSIs are installed at key entry points including the top and bottom of steps/ramps, at doorways, and to guide people from parking or drop-off areas to the entrance',
      'Answer "Partially" if TGSIs exist in some locations but not consistently (e.g., at steps but not at the entrance door), or if older TGSIs are present but may not meet current standards',
      'Answer "No" if there are no TGSIs at the entrance area, or if they have been removed, worn away, or are so faded they cannot be felt',
    ],
    tips: [
      'Consider installing warning TGSIs, which have raised dots, at the top and bottom of ramps, stairs, and escalators',
      'Directional TGSIs with raised bars can guide people from key points like accessible parking to the entrance',
      'TGSIs work best when they contrast visually with the surrounding surface, such as yellow on light surfaces or light colours on dark surfaces',
      'It helps to check TGSIs regularly, as worn or damaged indicators lose their effectiveness over time',
      'Not all premises require TGSIs, but they significantly improve navigation for people with vision impairment',
    ],
  },

  // ============================================
  // SENSORY
  // ============================================

  'A6-1-1': {
    title: 'Lighting levels',
    summary:
      'Adequate lighting helps everyone read, navigate, and feel safe. Different areas need different light levels, but consistency and avoiding glare are key.',
    examples: [
      {
        type: 'good',
        imageUrl: '/help/lighting-good.jpg',
        caption: 'Well-lit space',
        details: 'Even lighting, no harsh shadows, good for reading.',
      },
      {
        type: 'poor',
        imageUrl: '/help/lighting-poor.jpg',
        caption: 'Insufficient lighting',
        details: 'Dark areas create navigation hazards and strain eyes.',
      },
      {
        type: 'poor',
        imageUrl: '/help/lighting-glare.jpg',
        caption: 'Glare issues',
        details: 'Direct sunlight or unshielded bulbs cause discomfort.',
      },
    ],
    tips: [
      'Circulation areas (corridors, aisles): 100-200 lux',
      'Reading/transaction areas: 300-500 lux',
      'Avoid dramatic light level changes between adjacent areas',
      'Ensure steps and changes in level are well lit',
      'Use matt finishes to reduce glare from floors and surfaces',
    ],
  },

  'A6-1-2': {
    title: 'Quiet spaces',
    summary:
      'A quiet space provides a retreat for people who experience sensory overload, anxiety, or need a break from noise and crowds. It does not need to be large or fancy.',
    examples: [
      {
        type: 'good',
        imageUrl: '/help/quiet-space-dedicated.jpg',
        caption: 'Dedicated quiet room',
        details: 'Small room with soft seating, reduced lighting, minimal stimulation.',
      },
      {
        type: 'good',
        imageUrl: '/help/quiet-space-corner.jpg',
        caption: 'Quiet corner',
        details: 'Screened area away from main traffic with comfortable seating.',
      },
      {
        type: 'info',
        imageUrl: '/help/quiet-space-sign.jpg',
        caption: 'Clear signage',
        details: 'Let people know quiet spaces are available.',
      },
    ],
    tips: [
      'Does not need to be a separate room - a quiet corner can work',
      'Reduce stimulation: dim lighting, no music, away from high-traffic areas',
      'Comfortable seating - does not need to be elaborate',
      'Let staff know where it is so they can direct customers',
      'Particularly valued by autistic visitors and those with anxiety',
    ],
  },

  // ============================================
  // COMMUNICATION & INFORMATION
  // ============================================

  'B3-1-1': {
    title: 'Large print materials',
    summary:
      'Large print materials help people with low vision access your information. This includes menus, brochures, and any customer-facing documents.',
    examples: [
      {
        type: 'good',
        imageUrl: '/help/large-print-menu.jpg',
        caption: 'Large print menu',
        details: '18pt font minimum, good contrast, clear layout.',
      },
      {
        type: 'poor',
        imageUrl: '/help/small-print-menu.jpg',
        caption: 'Standard print too small',
        details: '10-12pt font is difficult for many people to read.',
      },
      {
        type: 'info',
        imageUrl: '/help/large-print-comparison.jpg',
        caption: 'Font size comparison',
        details: '12pt vs 18pt - the difference is significant.',
      },
    ],
    tips: [
      'Minimum 16-18 point font for large print versions',
      'Sans-serif fonts (Arial, Verdana) are easier to read',
      'Good contrast: dark text on light background (or reverse)',
      'Avoid busy backgrounds or watermarks behind text',
      'Having a large print version available on request is a good start',
    ],
  },

  // ============================================
  // CUSTOMER SERVICE
  // ============================================

  'C1-F-1': {
    title: 'Disability awareness training',
    summary:
      'Training helps staff feel confident supporting customers with different access needs. It covers practical tips, communication, and building an inclusive attitude.',
    examples: [
      {
        type: 'info',
        imageUrl: '/help/training-interaction.jpg',
        caption: 'Customer interaction',
        details: 'Speaking directly to the person, not their companion.',
      },
      {
        type: 'info',
        imageUrl: '/help/training-assistance.jpg',
        caption: 'Offering assistance',
        details: 'Ask if help is needed, do not assume or grab.',
      },
    ],
    tips: [
      'Training does not need to be expensive - many free resources exist',
      'Focus on practical scenarios relevant to your business',
      'Include all staff, not just front-line - everyone shapes the experience',
      'Refresher sessions help maintain awareness',
      'Involve people with disability in training if possible',
    ],
    learnMoreUrl: 'https://www.jobaccess.gov.au/employers/disability-awareness-training',
  },
};

/**
 * Get help content for a question
 */
export function getHelpContent(questionId: string): HelpContent | undefined {
  return HELP_CONTENT[questionId];
}

/**
 * Generate default help content from a question's helpText
 * Used when no specific help content exists for a question
 */
export function generateDefaultHelpContent(
  helpText: string | undefined,
  _questionText?: string
): HelpContent | undefined {
  if (!helpText) return undefined;

  return {
    title: 'Understanding this question',
    summary: helpText,
    examples: [
      {
        type: 'good' as const,
        imageUrl: '/help/placeholder-good.svg',
        caption: 'Good example',
        details: 'This meets accessibility requirements',
      },
      {
        type: 'poor' as const,
        imageUrl: '/help/placeholder-poor.svg',
        caption: 'Needs improvement',
        details: 'This could be improved for better accessibility',
      },
    ],
    tips: [
      'Take your time to consider the question carefully',
      'Select "Unable to check" if you need to verify later',
      'You can add supporting evidence like photos or documents',
      'Your notes can be included in your DIAP and report if you choose',
    ],
  };
}

/**
 * Check if a question has help content available
 */
export function hasHelpContent(questionId: string): boolean {
  return questionId in HELP_CONTENT;
}
