/**
 * DIAP Section Mapping
 *
 * Maps Access Compass modules to DIAP focus areas for seamless
 * transition from assessment to action planning.
 */

export interface DIAPSection {
  id: string;
  name: string;
  description: string;
}

export interface ModuleToDIAPMapping {
  moduleId: string;
  moduleName: string;
  diapSectionId: string;
  diapSectionName: string;
}

// Standard DIAP sections based on Australian DIAP frameworks
export const DIAP_SECTIONS: DIAPSection[] = [
  {
    id: 'information-communication',
    name: 'Information & Communication',
    description: 'How accessibility information is shared with customers before and during visits',
  },
  {
    id: 'built-environment',
    name: 'Built Environment',
    description: 'Physical access including entry, movement, facilities, and wayfinding',
  },
  {
    id: 'service-delivery',
    name: 'Service Delivery',
    description: 'How services are provided and the experience during a visit',
  },
  {
    id: 'customer-service-training',
    name: 'Customer Service & Training',
    description: 'Staff knowledge, attitudes, and training related to disability inclusion',
  },
  {
    id: 'policy-procedure',
    name: 'Policy & Procedure',
    description: 'Organisational policies that support disability inclusion',
  },
];

// Mapping from Access Compass modules to DIAP sections
export const MODULE_TO_DIAP_MAPPING: Record<string, string> = {
  // Before the visit
  'M01': 'information-communication',  // B1 - Accessibility Information

  // Getting in and around
  'M02': 'built-environment',          // A1 - Getting in / Entrance
  'M03': 'built-environment',          // A2 - Parking
  'M04': 'built-environment',          // A3a - Paths and aisles
  'M05': 'built-environment',          // A3b - Vertical movement
  'M06': 'built-environment',          // A4 - Wayfinding
  'M07': 'built-environment',          // A5 - Accessible toilets
  'M08': 'built-environment',          // A6 - Sensory environment

  // During the visit
  'M09': 'service-delivery',           // D1 - Experience
  'M10': 'service-delivery',           // D2 - Service points
  'M11': 'service-delivery',           // D3 - Seating

  // Service and support
  'M12': 'customer-service-training',  // S1 - Staff awareness
  'M13': 'customer-service-training',  // S2 - Communication support

  // Fallback for any unmapped modules
  'default': 'policy-procedure',
};

/**
 * Get the DIAP section for a given module
 */
export function getDIAPSectionForModule(moduleId: string): DIAPSection | undefined {
  const sectionId = MODULE_TO_DIAP_MAPPING[moduleId] || MODULE_TO_DIAP_MAPPING['default'];
  return DIAP_SECTIONS.find(s => s.id === sectionId);
}

/**
 * Get all modules that map to a given DIAP section
 */
export function getModulesForDIAPSection(diapSectionId: string): string[] {
  return Object.entries(MODULE_TO_DIAP_MAPPING)
    .filter(([_, sectionId]) => sectionId === diapSectionId && _ !== 'default')
    .map(([moduleId]) => moduleId);
}

/**
 * Group items by their DIAP section
 */
export function groupItemsByDIAPSection<T extends { moduleSource?: string }>(
  items: T[]
): Record<string, T[]> {
  const grouped: Record<string, T[]> = {};

  // Initialize all sections
  DIAP_SECTIONS.forEach(section => {
    grouped[section.id] = [];
  });

  // Group items
  items.forEach(item => {
    const sectionId = item.moduleSource
      ? (MODULE_TO_DIAP_MAPPING[item.moduleSource] || 'policy-procedure')
      : 'policy-procedure';

    if (!grouped[sectionId]) {
      grouped[sectionId] = [];
    }
    grouped[sectionId].push(item);
  });

  return grouped;
}
