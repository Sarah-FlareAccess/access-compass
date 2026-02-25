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
    labelOnline: 'Before they engage',
    subLabel: 'Planning and booking',
    subLabelOnline: 'Discovery and booking',
    description: 'How people find you, plan their visit, and decide whether to engage.',
    descriptionOnline: 'How people find you, explore your offering, and decide to get started.',
    tip: 'Think about how customers research, prepare, and make decisions before they interact with you in person.',
    tipOnline: 'Think about how customers discover your services and what information they need before getting started.',
    icon: 'search',
    bgColorClass: 'journey-before',
    blocks: [
      {
        id: 'info-planning',
        label: 'Information and planning',
        labelOnline: 'Information and discovery',
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
        example: 'e.g. Your website homepage, Google Business profile, Facebook page, TripAdvisor listing',
        subTouchpoints: [
          { id: 'website', label: 'Main website' },
          { id: 'social-media', label: 'Social media profiles' },
          { id: 'maps-listings', label: 'Maps and online listings' },
        ],
        moduleMapping: ['1.1', '1.2', '1.4', '1.5'],
      },
      {
        id: 'planning-visit',
        label: 'Planning their visit',
        labelOnline: 'Exploring your offering',
        description: 'Menus, programs, schedules, photos, accessibility information',
        descriptionOnline: 'Services, programs, pricing, and what to expect',
        example: 'e.g. Menu PDFs, class timetables, facility photos, accessibility statements',
        subTouchpoints: [
          { id: 'menus-programs', label: 'Menus or programs' },
          { id: 'schedules', label: 'Schedules and opening hours' },
          { id: 'accessibility-info', label: 'Accessibility information' },
        ],
        moduleMapping: ['1.1', '3.5', '1.5', '1.6'],
      },
      {
        id: 'costs-policies',
        label: 'Understanding costs and policies',
        description: 'Pricing, cancellation, companion or support information',
        example: 'e.g. Price lists, refund policies, carer discount information, Companion Card acceptance',
        moduleMapping: ['3.5', '4.3'],
      },
      {
        id: 'booking',
        label: 'Booking or registering',
        description: 'Online bookings, phone, email, ticketing',
        example: 'e.g. Online reservation forms, event registration, appointment booking systems',
        subTouchpoints: [
          { id: 'online-booking', label: 'Online booking system' },
          { id: 'phone-booking', label: 'Phone bookings' },
          { id: 'ticketing', label: 'Ticketing systems' },
        ],
        moduleMapping: ['1.3', '4.3'],
      },
      {
        id: 'enquiries',
        label: 'Asking questions before arrival',
        labelOnline: 'Asking questions before engaging',
        description: 'Enquiries, contact methods, response handling',
        example: 'e.g. Contact forms, phone enquiries, email responses, live chat',
        moduleMapping: ['4.2', '1.4', '1.5'],
      },
    ],
  },
  {
    id: 'when-here',
    label: "When they're here",
    subLabel: 'Space, environment and experiences',
    description: 'What the experience involves once someone is onsite.',
    tip: 'Consider the physical journey, the environment, and the activities or experiences a customer might take part in.',
    icon: 'map-pin',
    bgColorClass: 'journey-during',
    blocks: [
      {
        id: 'physical-access',
        label: 'Physical access',
        touchpointIds: ['getting-in', 'using-space', 'accommodation-rooms', 'wayfinding'],
      },
      {
        id: 'experiences-activities',
        label: 'Experiences and activities',
        touchpointIds: ['experiences-activities', 'sensory'],
      },
    ],
    touchpoints: [
      {
        id: 'getting-in',
        label: 'Getting in and moving around',
        description: 'Parking, paths, entry, internal routes, queues',
        example: 'e.g. Disabled parking bays, ramps, automatic doors, clear aisles, queue management',
        subTouchpoints: [
          { id: 'parking', label: 'Parking or drop-off' },
          { id: 'path-entrance', label: 'Path to the entrance' },
          { id: 'entry-doors', label: 'Entry doors' },
          { id: 'internal-routes', label: 'Internal routes or aisles' },
          { id: 'queues', label: 'Queues or busy times' },
        ],
        moduleMapping: ['2.1', '2.2', '2.3', '2.4'],
      },
      {
        id: 'using-space',
        label: 'Using your space comfortably',
        description: 'Seating, counters, furniture, toilets',
        example: 'e.g. Chairs with arms, lowered counters, clear floor space, accessible bathroom facilities',
        subTouchpoints: [
          { id: 'seating', label: 'Seating options' },
          { id: 'counters', label: 'Service counters' },
          { id: 'toilets', label: 'Accessible toilets' },
        ],
        moduleMapping: ['3.1', '3.2', '3.3', '3.7'],
      },
      {
        id: 'accommodation-rooms',
        label: 'Accommodation and guest rooms',
        description: 'Accessible rooms, in-room facilities, guest amenities',
        example: 'e.g. Bed height, roll-in showers, visual alarms, kitchenette access, room entry',
        subTouchpoints: [
          { id: 'guest-rooms', label: 'Guest room accessibility' },
          { id: 'in-room-bathroom', label: 'In-room bathroom' },
          { id: 'in-room-amenities', label: 'In-room amenities and features' },
        ],
        moduleMapping: ['3.9'],
      },
      {
        id: 'wayfinding',
        label: 'Finding their way',
        description: 'Signage, wayfinding, clarity of layout',
        example: 'e.g. Clear directional signs, maps, colour-coded zones, staff available to assist',
        moduleMapping: ['2.3', '3.5', '3.7'],
      },
      {
        id: 'sensory',
        label: 'The sensory environment',
        description: 'Lighting, noise, smells, busy vs quieter times',
        example: 'e.g. Adjustable lighting, quiet hours, scent-free areas, visual alerts alongside audio',
        moduleMapping: ['3.1', '4.4'],
      },
      {
        id: 'experiences-activities',
        label: 'Experiences and activities',
        description: 'Events, performances, tours, recreation, meetings, health services',
        example: 'e.g. Spectator events, guided tours, gym or pool, conference rooms, therapy or wellness services',
        subTouchpoints: [
          { id: 'events-performances', label: 'Events or performances' },
          { id: 'tours-experiences', label: 'Tours or guided experiences' },
          { id: 'recreation-sports', label: 'Recreation or sports' },
          { id: 'meetings-conferences', label: 'Meetings or conferences' },
          { id: 'health-wellbeing', label: 'Health or wellbeing services' },
        ],
        moduleMapping: ['3.8'],
      },
    ],
  },
  {
    id: 'customer-service',
    label: 'Customer service',
    subLabel: 'Staff and communication',
    description: 'How your team interacts with and supports customers.',
    tip: 'Think about every interaction between your staff and customers — from greeting to problem-solving.',
    icon: 'users',
    bgColorClass: 'journey-service',
    touchpoints: [
      {
        id: 'staff-interaction',
        label: 'Interacting with staff',
        description: 'Customer service, communication support, assistance animals',
        example: 'e.g. Front desk interactions, waitstaff, sales assistants, phone support',
        subTouchpoints: [
          { id: 'customer-service', label: 'General customer service' },
          { id: 'communication-support', label: 'Communication support' },
          { id: 'assistance-animals', label: 'Assistance animals' },
        ],
        moduleMapping: ['4.2', '4.3'],
      },
      {
        id: 'service-flexibility',
        label: 'Service flexibility',
        description: 'Adjustments, accommodations, and alternative options',
        example: 'e.g. Modified service delivery, extra time, alternative formats, dietary accommodations',
        moduleMapping: ['4.2', '4.3', '3.8'],
      },
    ],
  },
  {
    id: 'staying-connected',
    label: 'After the visit',
    subLabel: 'Feedback and engagement',
    description: 'What happens after someone has visited or engaged with you.',
    tip: 'Consider how you gather feedback and stay connected with customers over time.',
    icon: 'message-circle',
    bgColorClass: 'journey-after',
    touchpoints: [
      {
        id: 'feedback',
        label: 'Complaints and feedback',
        description: 'Handling complaints, general feedback',
        example: 'e.g. Feedback forms, comment cards, complaints handling process',
        moduleMapping: ['4.5'],
      },
      {
        id: 'surveys-forms',
        label: 'Surveys and forms',
        description: 'Post-visit surveys, feedback questionnaires',
        example: 'e.g. Customer satisfaction surveys, Net Promoter Score, feedback questionnaires',
        moduleMapping: ['4.5'],
      },
      {
        id: 'online-reviews',
        label: 'Online reviews and ratings',
        description: 'Google, TripAdvisor, social media reviews',
        example: 'e.g. Google reviews, TripAdvisor ratings, Facebook recommendations, responding to reviews',
        moduleMapping: ['4.5'],
      },
      {
        id: 'newsletters-email',
        label: 'Newsletters and emails',
        description: 'Marketing emails, updates, announcements',
        example: 'e.g. Email newsletters, promotional emails, event announcements',
        moduleMapping: ['4.6', '1.4', '1.5', '1.6'],
      },
      {
        id: 'offers-promotions',
        label: 'Offers and promotions',
        description: 'Discounts, special offers, deals',
        example: 'e.g. Discount codes, seasonal promotions, member-only offers',
        moduleMapping: ['4.6', '4.3', '1.6'],
      },
      {
        id: 'loyalty-programs',
        label: 'Loyalty and rewards',
        description: 'Points, memberships, repeat customer benefits',
        example: 'e.g. Loyalty cards, points programs, membership tiers, VIP benefits',
        moduleMapping: ['4.6', '4.3'],
      },
      {
        id: 'referrals',
        label: 'Referral programs',
        description: 'Word of mouth, refer-a-friend incentives',
        example: 'e.g. Refer-a-friend discounts, affiliate programs, ambassador programs',
        moduleMapping: ['4.6'],
      },
    ],
  },
  {
    id: 'policy-operations',
    label: 'Organisational commitment',
    subLabel: 'Policies, employment and operations',
    description: 'How your organisation embeds accessibility into policies, employment, and decision-making.',
    tip: 'Think about the systems, policies, and practices that guide how your organisation approaches accessibility.',
    icon: 'clipboard',
    bgColorClass: 'journey-policy',
    touchpoints: [
      {
        id: 'accessibility-policy',
        label: 'Accessibility policies',
        description: 'Documented commitment, inclusion statements, staff guidelines',
        example: 'e.g. Disability inclusion policy, accessibility statement, customer service charter',
        moduleMapping: ['5.1'],
      },
      {
        id: 'inclusive-employment',
        label: 'Inclusive employment',
        description: 'Recruiting, hiring, and retaining employees with disability',
        example: 'e.g. Inclusive job ads, accessible recruitment, disability employment programs',
        moduleMapping: ['5.2'],
      },
      {
        id: 'workplace-adjustments',
        label: 'Workplace adjustments',
        description: 'Reasonable adjustments, flexible work, assistive technology',
        example: 'e.g. Modified workstations, flexible hours, screen readers, job coaches',
        moduleMapping: ['5.2', '5.1'],
      },
      {
        id: 'staff-training',
        label: 'Staff training and awareness',
        description: 'Onboarding, ongoing training, disability confidence',
        example: 'e.g. Accessibility training modules, disability awareness sessions, onboarding checklists',
        moduleMapping: ['5.3', '4.2'],
      },
      {
        id: 'procurement-partnerships',
        label: 'Procurement and partnerships',
        description: 'Supplier requirements, contractor guidelines, partner expectations',
        example: 'e.g. Accessibility clauses in contracts, supplier diversity, accessible product sourcing',
        moduleMapping: ['5.4'],
      },
      {
        id: 'supplier-accessibility',
        label: 'Supplier accessibility standards',
        description: 'Vendor assessments, accessibility requirements, contract terms',
        example: 'e.g. Accessibility questionnaires for vendors, VPAT requirements, accessibility SLAs',
        moduleMapping: ['5.4'],
      },
      {
        id: 'continuous-improvement',
        label: 'Continuous improvement',
        description: 'Action plans, audits, progress tracking',
        example: 'e.g. Disability Inclusion Action Plan (DIAP), accessibility audits, annual reviews',
        moduleMapping: ['5.5', '4.5'],
      },
      {
        id: 'accessibility-reporting',
        label: 'Accessibility reporting',
        description: 'Metrics, progress reports, compliance tracking',
        example: 'e.g. Annual accessibility reports, KPIs, compliance dashboards',
        moduleMapping: ['5.5', '5.1'],
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
