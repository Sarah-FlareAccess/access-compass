import type { Question } from '../types';

// Sample questions for MVP - Representative subset from the full inventory
export const questions: Question[] = [
  // Physical Access Module
  {
    id: 'physical-1',
    module: 'physical-access',
    question_text: 'Is there level access to your entrance?',
    helper_text: 'This means no steps or raised thresholds at the main entrance',
  },
  {
    id: 'physical-2',
    module: 'physical-access',
    question_text: 'Do you have an accessible bathroom?',
    helper_text:
      'An accessible bathroom has features like grab rails, adequate space, and accessible fittings',
  },
  {
    id: 'physical-3',
    module: 'physical-access',
    question_text: 'Can someone using a wheelchair move through your main customer areas?',
    helper_text: 'Consider aisle width, turning space, and obstacles',
  },
  {
    id: 'physical-4',
    module: 'physical-access',
    question_text: 'Are doorways at least 850mm wide?',
    helper_text: 'Measure the narrowest point when the door is fully open',
  },
  {
    id: 'physical-5',
    module: 'physical-access',
    question_text: 'Is there accessible parking nearby?',
    helper_text:
      'Designated spaces close to the entrance with adequate space for wheelchair access',
  },
  {
    id: 'physical-6',
    module: 'physical-access',
    question_text: 'Do you have seating options for people who need to rest?',
    helper_text: 'Seating with arms, varied heights, and stable support',
  },
  {
    id: 'physical-7',
    module: 'physical-access',
    question_text: 'Are pathways clear of obstacles?',
    helper_text: 'Free from furniture, displays, cords, or clutter',
  },
  {
    id: 'physical-8',
    module: 'physical-access',
    question_text: 'Is your counter at an accessible height?',
    helper_text: 'Between 750-850mm high with clear knee space underneath',
  },

  // Communication and Information Module
  {
    id: 'communication-1',
    module: 'communication-information',
    question_text: 'Are menus or information available in large print?',
    helper_text: 'Minimum 16-18 point font with clear contrast',
  },
  {
    id: 'communication-2',
    module: 'communication-information',
    question_text: 'Do you have braille or tactile information available?',
    helper_text: 'For signs, menus, or key information',
  },
  {
    id: 'communication-3',
    module: 'communication-information',
    question_text: 'Are signs clear with good contrast and readable fonts?',
    helper_text: 'High contrast, simple fonts, appropriate text sizes',
  },
  {
    id: 'communication-4',
    module: 'communication-information',
    question_text: 'Can customers access information in digital formats?',
    helper_text: 'QR codes, online menus, or screen-reader compatible versions',
  },

  // Customer Service and Staff Module
  {
    id: 'customer-service-1',
    module: 'customer-service-staff',
    question_text: 'Do you train staff on how to support customers with access needs?',
    helper_text: 'Disability awareness or accessibility training',
  },
  {
    id: 'customer-service-2',
    module: 'customer-service-staff',
    question_text: 'Do you ask customers about access needs when they book?',
    helper_text: 'A way for customers to share their requirements in advance',
  },
  {
    id: 'customer-service-3',
    module: 'customer-service-staff',
    question_text: 'Can customers contact you to ask about accessibility before visiting?',
    helper_text: 'Phone, email, or other contact methods',
  },
  {
    id: 'customer-service-4',
    module: 'customer-service-staff',
    question_text: 'Do you have a process for responding to accessibility feedback?',
    helper_text: 'A way to receive, review, and act on feedback',
  },
  {
    id: 'customer-service-5',
    module: 'customer-service-staff',
    question_text: 'Are staff aware of accessible features at your venue?',
    helper_text: 'Can direct customers to accessible facilities confidently',
  },

  // Online and Bookings Module
  {
    id: 'online-1',
    module: 'online-bookings',
    question_text: 'Can visitors easily find accessibility information on your website?',
    helper_text: 'Dedicated page or clear information about access features',
  },
  {
    id: 'online-2',
    module: 'online-bookings',
    question_text:
      'Is your booking system accessible (keyboard navigation, screen readers)?',
    helper_text: 'Can be used without a mouse and works with assistive technology',
  },
  {
    id: 'online-3',
    module: 'online-bookings',
    question_text: 'Do you provide accessibility info in confirmation emails?',
    helper_text:
      'Include information about access features, parking, or how to request support',
  },
  {
    id: 'online-4',
    module: 'online-bookings',
    question_text: 'Can customers indicate access needs when booking?',
    helper_text: 'Free text field or specific questions about requirements',
  },
  {
    id: 'online-5',
    module: 'online-bookings',
    question_text: 'Are your menus available online?',
    helper_text: 'Accessible via website or social media',
  },
  {
    id: 'online-6',
    module: 'online-bookings',
    question_text: 'Is your website mobile-friendly?',
    helper_text: 'Works well on phones and tablets without zooming or sideways scrolling',
  },

  // Wayfinding and Signage Module
  {
    id: 'wayfinding-1',
    module: 'wayfinding-signage',
    question_text: 'Is signage placed at consistent heights and locations?',
    helper_text: 'Between 1200-1600mm from floor, at decision points',
  },
  {
    id: 'wayfinding-2',
    module: 'wayfinding-signage',
    question_text: 'Are accessible facilities clearly signed?',
    helper_text: 'Toilets, lifts, accessible entrances',
  },
  {
    id: 'wayfinding-3',
    module: 'wayfinding-signage',
    question_text: 'Would a first-time visitor be able to navigate independently?',
    helper_text: 'Clear layout, logical flow, good signage',
  },
  {
    id: 'wayfinding-4',
    module: 'wayfinding-signage',
    question_text: 'Are there tactile ground indicators at key points?',
    helper_text: 'Textured surfaces to help people with vision impairment navigate',
  },

  // Sensory Considerations Module
  {
    id: 'sensory-1',
    module: 'sensory-considerations',
    question_text: 'Is lighting adequate for reading and navigation?',
    helper_text: '100-200 lux for circulation, 300-500 lux for reading areas',
  },
  {
    id: 'sensory-2',
    module: 'sensory-considerations',
    question_text: 'Are there quiet spaces available for people who need a break from noise?',
    helper_text: 'Calm area away from crowds and sensory input',
  },
  {
    id: 'sensory-3',
    module: 'sensory-considerations',
    question_text: 'Is background noise at a level that allows conversation?',
    helper_text: 'Music, machinery, and ambient noise don\'t overwhelm speech',
  },
  {
    id: 'sensory-4',
    module: 'sensory-considerations',
    question_text:
      'Are there any flashing lights or sudden loud noises that could affect some visitors?',
    helper_text: 'Consider people with sensory sensitivities, migraines, or epilepsy',
  },

  // Emergency and Safety Module
  {
    id: 'emergency-1',
    module: 'emergency-safety',
    question_text: 'Do your emergency procedures include plans for people with disabilities?',
    helper_text: 'Evacuation plans that consider different access needs',
  },
  {
    id: 'emergency-2',
    module: 'emergency-safety',
    question_text: 'Are emergency exits accessible to people with mobility aids?',
    helper_text: 'Step-free, wide enough, clearly marked',
  },
  {
    id: 'emergency-3',
    module: 'emergency-safety',
    question_text: 'Are there visual and audible alarms for emergencies?',
    helper_text: 'Both flashing lights and sound alerts',
  },
  {
    id: 'emergency-4',
    module: 'emergency-safety',
    question_text:
      'Do staff know how to assist customers with different needs during an evacuation?',
    helper_text: 'Training on supporting people with various access requirements',
  },
];
