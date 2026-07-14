import type { Module, BusinessSnapshot } from '../types';

export const modules: Module[] = [
  {
    id: 'physical-access',
    title: 'Physical access',
    icon: '🚪',
    description:
      'Entrances, doorways, bathrooms, parking and moving through your space',
    recommended_if: (snapshot: BusinessSnapshot) => snapshot.has_physical_venue === true,
  },
  {
    id: 'communication-information',
    title: 'Communication and information',
    icon: '💬',
    description:
      'Menus, signs, brochures, audio announcements and other ways you share information',
    recommended_if: () => true, // Always recommended
  },
  {
    id: 'customer-service-staff',
    title: 'Customer service and staff',
    icon: '👥',
    description: 'How your team supports customers with different access needs',
    recommended_if: (snapshot: BusinessSnapshot) =>
      snapshot.serves_public_customers === true,
  },
  {
    id: 'online-bookings',
    title: 'Online and bookings',
    icon: '💻',
    description: 'Website accessibility, booking systems and digital information',
    recommended_if: (snapshot: BusinessSnapshot) => snapshot.has_online_presence === true,
  },
  {
    id: 'wayfinding-signage',
    title: 'Wayfinding and signage',
    icon: '🗺️',
    description: 'Signs, maps, directions and helping people find their way around',
    recommended_if: (snapshot: BusinessSnapshot) =>
      snapshot.has_physical_venue === true &&
      (snapshot.business_types?.includes('attractions') ||
        snapshot.business_types?.includes('hospitality')),
  },
  {
    id: 'sensory-considerations',
    title: 'Sensory considerations',
    icon: '👂👃',
    description:
      'Lighting, noise, sounds, smells and creating comfortable environments',
    recommended_if: (snapshot: BusinessSnapshot) => snapshot.has_physical_venue === true,
  },
  {
    id: 'emergency-safety',
    title: 'Emergency and safety',
    icon: '🚨',
    description: 'Evacuation plans, emergency communication and safety procedures',
    recommended_if: (snapshot: BusinessSnapshot) => snapshot.has_physical_venue === true,
  },
];
