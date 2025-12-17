/**
 * Journey Phases and Touchpoints Data
 *
 * Defines the customer journey phases and touchpoints used in the Discovery module.
 * Each touchpoint maps to specific accessibility modules.
 */

import type { JourneyPhaseData, Touchpoint } from '../types';

export const JOURNEY_PHASES: JourneyPhaseData[] = [
  {
    id: 'before-arrival',
    label: 'Before they arrive',
    subLabel: 'Planning and booking',
    description: 'How people find you, plan their visit, and decide whether to engage.',
    icon: 'search',
    bgColorClass: 'journey-before',
    blocks: [
      {
        id: 'info-planning',
        label: 'Information and planning',
        touchpointIds: ['finding-online', 'planning-visit', 'costs-policies'],
      },
      {
        id: 'booking-enquiries',
        label: 'Booking and enquiries',
        touchpointIds: ['booking', 'enquiries'],
      },
    ],
    touchpoints: [
      {
        id: 'finding-online',
        label: 'Finding information online',
        description: 'Website, social media, search, listings',
        subTouchpoints: [
          { id: 'website', label: 'Main website' },
          { id: 'social-media', label: 'Social media profiles' },
          { id: 'maps-listings', label: 'Maps and online listings' },
        ],
        moduleMapping: ['B1', 'B4.1'],
      },
      {
        id: 'planning-visit',
        label: 'Planning their visit',
        description: 'Menus, programs, schedules, photos, accessibility information',
        subTouchpoints: [
          { id: 'menus-programs', label: 'Menus or programs' },
          { id: 'schedules', label: 'Schedules and opening hours' },
          { id: 'accessibility-info', label: 'Accessibility information' },
        ],
        moduleMapping: ['B1', 'B2'],
      },
      {
        id: 'costs-policies',
        label: 'Understanding costs and policies',
        description: 'Pricing, cancellation, companion or support information',
        moduleMapping: ['B2', 'C2'],
      },
      {
        id: 'booking',
        label: 'Booking or registering',
        description: 'Online bookings, phone, email, ticketing',
        subTouchpoints: [
          { id: 'online-booking', label: 'Online booking system' },
          { id: 'phone-booking', label: 'Phone bookings' },
          { id: 'ticketing', label: 'Ticketing systems' },
        ],
        moduleMapping: ['B4.2', 'C2'],
      },
      {
        id: 'enquiries',
        label: 'Asking questions before arrival',
        description: 'Enquiries, contact methods, response handling',
        moduleMapping: ['C1', 'B4.3'],
      },
    ],
  },
  {
    id: 'when-here',
    label: "When they're here",
    subLabel: 'Space and service',
    description: 'What the experience involves once someone is onsite.',
    icon: 'map-pin',
    bgColorClass: 'journey-during',
    blocks: [
      {
        id: 'physical-access',
        label: 'Physical access',
        touchpointIds: ['getting-in', 'using-space', 'wayfinding'],
      },
      {
        id: 'experience-service',
        label: 'Experience and service',
        touchpointIds: ['sensory', 'staff-interaction'],
      },
    ],
    touchpoints: [
      {
        id: 'getting-in',
        label: 'Getting in and moving around',
        description: 'Parking, paths, entry, internal routes, queues',
        subTouchpoints: [
          { id: 'parking', label: 'Parking or drop-off' },
          { id: 'path-entrance', label: 'Path to the entrance' },
          { id: 'entry-doors', label: 'Entry doors' },
          { id: 'internal-routes', label: 'Internal routes or aisles' },
          { id: 'queues', label: 'Queues or busy times' },
        ],
        moduleMapping: ['A1', 'A2', 'A3a', 'A3b'],
      },
      {
        id: 'using-space',
        label: 'Using your space comfortably',
        description: 'Seating, counters, furniture, toilets',
        subTouchpoints: [
          { id: 'seating', label: 'Seating options' },
          { id: 'counters', label: 'Service counters' },
          { id: 'toilets', label: 'Accessible toilets' },
        ],
        moduleMapping: ['A4', 'A5', 'A6'],
      },
      {
        id: 'wayfinding',
        label: 'Finding their way',
        description: 'Signage, wayfinding, clarity of layout',
        moduleMapping: ['A3a', 'B2'],
      },
      {
        id: 'sensory',
        label: 'The sensory environment',
        description: 'Lighting, noise, smells, busy vs quieter times',
        moduleMapping: ['A4', 'A7'],
      },
      {
        id: 'staff-interaction',
        label: 'Interacting with staff',
        description: 'Customer service, communication support, assistance animals',
        subTouchpoints: [
          { id: 'customer-service', label: 'General customer service' },
          { id: 'communication-support', label: 'Communication support' },
          { id: 'assistance-animals', label: 'Assistance animals' },
        ],
        moduleMapping: ['C1', 'C2'],
      },
    ],
  },
  {
    id: 'staying-connected',
    label: 'Staying connected',
    subLabel: 'Feedback and return',
    description: 'What happens after someone has visited or engaged with you.',
    icon: 'message-circle',
    bgColorClass: 'journey-after',
    touchpoints: [
      {
        id: 'feedback',
        label: 'Gathering feedback',
        description: 'Surveys, reviews, complaints',
        moduleMapping: ['C3', 'B3'],
      },
      {
        id: 'staying-connected-touchpoint',
        label: 'Staying connected',
        description: 'Emails, newsletters, social updates',
        moduleMapping: ['B4.1', 'B4.3'],
      },
      {
        id: 'return-visits',
        label: 'Encouraging return visits',
        description: 'Loyalty, rebooking, memberships',
        moduleMapping: ['C2', 'B3'],
      },
    ],
  },
];

/**
 * Get all touchpoints as a flat array
 */
export function getAllTouchpoints(): Touchpoint[] {
  return JOURNEY_PHASES.flatMap(phase => phase.touchpoints);
}

/**
 * Get a touchpoint by ID
 */
export function getTouchpointById(id: string): Touchpoint | undefined {
  return getAllTouchpoints().find(t => t.id === id);
}

/**
 * Get the journey phase for a touchpoint
 */
export function getPhaseForTouchpoint(touchpointId: string): JourneyPhaseData | undefined {
  return JOURNEY_PHASES.find(phase =>
    phase.touchpoints.some(t => t.id === touchpointId)
  );
}

/**
 * Get touchpoint blocks for a phase (if any)
 */
export function getTouchpointBlocks(phase: JourneyPhaseData) {
  if (!phase.blocks) return undefined;
  return phase.blocks.map(block => ({
    id: block.id,
    label: block.label,
    touchpoints: phase.touchpoints.filter(t => block.touchpointIds.includes(t.id)),
  }));
}
