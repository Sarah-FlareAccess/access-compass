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
        label: 'Can customers find you online?',
        description: 'Your website, social media, search results, and online listings',
        example: 'e.g. Website homepage, Google Business profile, Facebook page, council community directory',
        subTouchpoints: [
          { id: 'website', label: 'Main website' },
          { id: 'social-media', label: 'Social media profiles' },
          { id: 'maps-listings', label: 'Maps and online listings' },
        ],
        moduleMapping: ['1.1', '1.2', '1.4', '1.5'],
      },
      {
        id: 'planning-visit',
        label: 'Do customers plan or research before visiting?',
        labelOnline: 'Do customers explore your offering beforehand?',
        description: 'Programs, schedules, service information, and visitor guides they might look at',
        descriptionOnline: 'Services, programs, pricing, and what to expect before getting started',
        example: 'e.g. Class timetables, library catalog, pool session times, facility photos, service guides',
        subTouchpoints: [
          { id: 'menus-programs', label: 'Menus or programs' },
          { id: 'schedules', label: 'Schedules and opening hours' },
          { id: 'accessibility-info', label: 'Visitor guides and information' },
        ],
        moduleMapping: ['1.1', '3.5', '1.5', '1.6'],
      },
      {
        id: 'costs-policies',
        label: 'Do customers need to understand pricing or policies?',
        description: 'Fees, memberships, concessions, permits, and terms and conditions',
        example: 'e.g. Membership fees, concession pricing, permit costs, refund policies, library borrowing rules',
        moduleMapping: ['3.5', '4.3'],
      },
      {
        id: 'booking',
        label: 'Do customers book, register, or apply?',
        description: 'Bookings, registrations, applications, permits, and ticketing',
        example: 'e.g. Room or facility bookings, program registrations, permit applications, event ticketing',
        subTouchpoints: [
          { id: 'online-booking', label: 'Online booking system' },
          { id: 'phone-booking', label: 'Phone bookings' },
          { id: 'ticketing', label: 'Ticketing systems' },
        ],
        moduleMapping: ['1.3', '4.3'],
      },
      {
        id: 'enquiries',
        label: 'Do customers contact you with questions beforehand?',
        labelOnline: 'Do customers contact you with questions before engaging?',
        description: 'Enquiries, contact methods, and how you respond',
        example: 'e.g. Phone enquiries, contact forms, service centre front desk, email responses, live chat',
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
        label: 'Your space and facilities',
        touchpointIds: ['getting-in', 'using-space', 'accommodation-rooms', 'wayfinding'],
      },
      {
        id: 'experiences-activities',
        label: 'Experiences and activities',
        touchpointIds: ['experiences-activities', 'sensory', 'retail-shopping', 'outdoor-grounds', 'events-management'],
      },
    ],
    touchpoints: [
      {
        id: 'getting-in',
        label: 'How do customers get in and move around?',
        description: 'Parking, paths, entry, internal routes, and queues',
        example: 'e.g. Car park, drop-off area, front entrance, hallways, waiting areas, library entrance, pool entry',
        autoInclude: 'physical',
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
        label: 'How do customers use your space?',
        description: 'Seating, counters, furniture, shared equipment, and toilets',
        example: 'e.g. Waiting area seating, service counters, public computers, study desks, meeting rooms, bathrooms',
        autoInclude: 'physical',
        subTouchpoints: [
          { id: 'seating', label: 'Seating options' },
          { id: 'counters', label: 'Service counters' },
          { id: 'toilets', label: 'Toilets and bathrooms' },
        ],
        moduleMapping: ['3.1', '3.2', '3.3', '3.7'],
      },
      {
        id: 'accommodation-rooms',
        label: 'Do you offer accommodation or guest rooms?',
        description: 'Guest rooms, in-room facilities, and amenities',
        example: 'e.g. Room layout, bathroom, kitchenette, lighting, room entry',
        subTouchpoints: [
          { id: 'guest-rooms', label: 'Guest rooms and layout' },
          { id: 'in-room-bathroom', label: 'In-room bathroom' },
          { id: 'in-room-amenities', label: 'In-room amenities and features' },
        ],
        moduleMapping: ['3.9'],
      },
      {
        id: 'wayfinding',
        label: 'How do customers find their way around?',
        description: 'Signage, wayfinding, and clarity of layout',
        example: 'e.g. Clear directional signs, maps, colour-coded zones, staff available to assist',
        autoInclude: 'physical',
        moduleMapping: ['2.3', '3.5', '3.7'],
      },
      {
        id: 'sensory',
        label: 'What is the sensory environment like?',
        description: 'Lighting, noise, smells, and busy vs quieter times',
        example: 'e.g. Lighting levels, background music, noise levels, scents, busy periods',
        autoInclude: 'physical',
        moduleMapping: ['3.1', '4.4'],
      },
      {
        id: 'experiences-activities',
        label: 'Do customers take part in programs, activities, or experiences?',
        description: 'Programs, classes, recreation, tours, community activities, and health services',
        example: 'e.g. Library programs, swim classes, community workshops, guided tours, gym sessions, public consultations',
        subTouchpoints: [
          { id: 'events-performances', label: 'Events or performances' },
          { id: 'tours-experiences', label: 'Tours or guided experiences' },
          { id: 'recreation-sports', label: 'Recreation or sports' },
          { id: 'meetings-conferences', label: 'Meetings or conferences' },
          { id: 'health-wellbeing', label: 'Health or wellbeing services' },
        ],
        moduleMapping: ['3.8'],
      },
      {
        id: 'retail-shopping',
        label: 'Do customers browse or purchase products?',
        description: 'How customers browse, try on, and buy products in your space',
        example: 'e.g. Store layout, fitting rooms, checkout counters, product labels, shopping baskets',
        moduleMapping: ['3.10', '4.3'],
      },
      {
        id: 'outdoor-grounds',
        label: 'Do customers use outdoor areas or playgrounds?',
        description: 'Gardens, courtyards, outdoor dining, walking trails, playgrounds, and exterior grounds',
        example: 'e.g. Beer gardens, courtyards, walking paths, picnic areas, playgrounds, pools, outdoor event spaces',
        subTouchpoints: [
          { id: 'outdoor-paths', label: 'Outdoor paths and walkways' },
          { id: 'outdoor-seating', label: 'Outdoor seating and dining' },
          { id: 'playgrounds', label: 'Playgrounds and play spaces' },
        ],
        moduleMapping: ['3.11', '3.12'],
      },
      {
        id: 'events-management',
        label: 'Do you plan or run events?',
        description: 'Planning, running, and managing events at your venue or in the community',
        example: 'e.g. Community festivals, public meetings, library events, markets, conferences, on-the-day operations',
        subTouchpoints: [
          { id: 'event-planning', label: 'Event planning and promotion' },
          { id: 'event-venue', label: 'Event venue and access' },
          { id: 'event-comms', label: 'Event communications' },
          { id: 'event-sensory', label: 'Sensory and technology' },
          { id: 'event-operations', label: 'On-the-day operations' },
        ],
        moduleMapping: ['6.1', '6.2', '6.3', '6.4', '6.5'],
      },
    ],
  },
  {
    id: 'customer-service',
    label: 'Customer service',
    subLabel: 'Staff and communication',
    description: 'How your team interacts with and supports customers.',
    tip: 'Think about every interaction between your staff and customers, from greeting to problem-solving.',
    icon: 'users',
    bgColorClass: 'journey-service',
    touchpoints: [
      {
        id: 'staff-interaction',
        label: 'How do customers interact with your staff?',
        description: 'Customer service, communication support, and assistance animals',
        example: 'e.g. Front desk staff, librarians, service officers, lifeguards, phone support',
        autoInclude: 'physical',
        subTouchpoints: [
          { id: 'customer-service', label: 'General customer service' },
          { id: 'communication-support', label: 'Communication support' },
          { id: 'assistance-animals', label: 'Assistance animals' },
        ],
        moduleMapping: ['4.2', '4.3'],
      },
      {
        id: 'service-flexibility',
        label: 'Can your service adapt to different customer needs?',
        description: 'Adjustments, alternative service channels, and flexible options',
        autoInclude: 'physical',
        example: 'e.g. Home library services, alternative formats, extra time, modified service delivery, phone alternatives',
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
        label: 'Do customers give feedback or leave reviews?',
        description: 'How customers share their experience afterwards',
        example: 'e.g. Feedback forms, Google reviews, formal complaints, community satisfaction surveys, public submissions',
        moduleMapping: ['4.5'],
      },
      {
        id: 'staying-connected-touchpoint',
        label: 'Do you stay in touch with customers afterwards?',
        description: 'Ongoing communication and engagement with the community',
        example: 'e.g. Newsletters, community updates, program announcements, social media, loyalty programs',
        moduleMapping: ['4.6', '1.4', '1.5', '1.6', '4.3', '4.7'],
      },
    ],
  },
  {
    id: 'policy-operations',
    label: 'How you operate',
    subLabel: 'Policies, people, and improvement',
    description: 'The internal practices that shape how your organisation runs.',
    tip: 'Think about your policies, how you hire and train staff, and how you work with suppliers.',
    icon: 'clipboard',
    bgColorClass: 'journey-policy',
    touchpoints: [
      {
        id: 'accessibility-policy',
        label: 'Do you have documented policies and guidelines?',
        description: 'Customer service standards, staff guidelines, and operational policies',
        example: 'e.g. Customer service charter, inclusion policy, council access policy, staff conduct guidelines',
        autoInclude: 'physical',
        moduleMapping: ['5.1'],
      },
      {
        id: 'inclusive-employment',
        label: 'How do you recruit and support your team?',
        description: 'Hiring, onboarding, and supporting your staff',
        example: 'e.g. Job advertisements, recruitment process, onboarding, workplace adjustments',
        autoInclude: 'physical',
        moduleMapping: ['5.2'],
      },
      {
        id: 'staff-training',
        label: 'How do you train and develop your staff?',
        description: 'Onboarding, ongoing training, and professional development',
        example: 'e.g. Induction programs, training modules, awareness sessions, skill development',
        autoInclude: 'physical',
        moduleMapping: ['5.3', '4.2'],
      },
      {
        id: 'procurement-partnerships',
        label: 'Do you work with suppliers or partners?',
        description: 'How you manage suppliers, contractors, and partner relationships',
        example: 'e.g. Supplier contracts, tender requirements, vendor agreements, community partners',
        autoInclude: 'physical',
        moduleMapping: ['5.4'],
      },
      {
        id: 'continuous-improvement',
        label: 'How do you track progress and improve?',
        description: 'Action plans, audits, reviews, and progress tracking',
        example: 'e.g. Action plans, access audits, annual reviews, DIAP reporting, community satisfaction tracking',
        autoInclude: 'physical',
        moduleMapping: ['5.5', '4.5'],
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
