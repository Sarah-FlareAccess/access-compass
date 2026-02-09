/**
 * DIAP Section Mapping
 *
 * Maps Access Compass modules to DIAP focus areas for seamless
 * transition from assessment to action planning.
 *
 * Items are categorized into 5 DIAP categories:
 * - Physical Access
 * - Information, Communication & Marketing
 * - Customer Service
 * - Operations, Policy & Procedure
 * - People & Culture
 */

export interface DIAPSection {
  id: string;
  name: string;
  description: string;
  categoryId: string;
}

export interface DIAPCategoryGroup {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ModuleToDIAPMapping {
  moduleId: string;
  moduleName: string;
  diapSectionId: string;
  diapSectionName: string;
}

// The 5 DIAP categories
export const DIAP_CATEGORIES: DIAPCategoryGroup[] = [
  {
    id: 'physical-access',
    name: 'Physical Access',
    description: 'Physical spaces, facilities, and navigation',
    icon: '🏢',
  },
  {
    id: 'information-communication-marketing',
    name: 'Information, Communication & Marketing',
    description: 'Digital, print, signage, and marketing materials',
    icon: '📢',
  },
  {
    id: 'customer-service',
    name: 'Customer Service',
    description: 'Service delivery and customer interactions',
    icon: '👥',
  },
  {
    id: 'operations-policy-procedure',
    name: 'Operations, Policy & Procedure',
    description: 'Organisational operations and compliance',
    icon: '📋',
  },
  {
    id: 'people-culture',
    name: 'People & Culture',
    description: 'Staff capability, training, and workplace culture',
    icon: '🤝',
  },
];

// Map DIAPCategory item types to display groups (1:1 mapping now)
export const CATEGORY_TO_GROUP: Record<string, string> = {
  'physical-access': 'physical-access',
  'information-communication-marketing': 'information-communication-marketing',
  'customer-service': 'customer-service',
  'operations-policy-procedure': 'operations-policy-procedure',
  'people-culture': 'people-culture',
};

// Standard DIAP sections based on Australian DIAP frameworks
// These map modules to DIAP focus areas; categoryId links to the 5 DIAP categories
export const DIAP_SECTIONS: DIAPSection[] = [
  {
    id: 'information-communication',
    name: 'Information & Communication',
    description: 'How accessibility information is shared with customers before and during visits',
    categoryId: 'information-communication-marketing',
  },
  {
    id: 'built-environment',
    name: 'Built Environment',
    description: 'Physical access including entry, movement, facilities, and wayfinding',
    categoryId: 'physical-access',
  },
  {
    id: 'service-delivery',
    name: 'Service Delivery',
    description: 'How services are provided and the experience during a visit',
    categoryId: 'customer-service',
  },
  {
    id: 'customer-service-training',
    name: 'Customer Service & Training',
    description: 'Staff knowledge, attitudes, and training related to disability inclusion',
    categoryId: 'people-culture',
  },
  {
    id: 'policy-procedure',
    name: 'Policy & Procedure',
    description: 'Organisational policies that support disability inclusion',
    categoryId: 'operations-policy-procedure',
  },
];

// Mapping from Access Compass modules to DIAP sections
export const MODULE_TO_DIAP_MAPPING: Record<string, string> = {
  // Before the visit
  'M01': 'information-communication',  // 1.1 - Accessibility Information

  // Getting in and around
  'M02': 'built-environment',          // 2.1 - Getting in / Entrance
  'M03': 'built-environment',          // 2.2 - Parking
  'M04': 'built-environment',          // 2.3 - Paths and aisles
  'M05': 'built-environment',          // 2.4 - Vertical movement
  'M06': 'built-environment',          // 3.1 - Wayfinding
  'M07': 'built-environment',          // 3.2 - Accessible toilets
  'M08': 'built-environment',          // 3.3 - Sensory environment

  // During the visit
  'M09': 'service-delivery',           // 3.7 - Experience
  'M10': 'service-delivery',           // D2 - Service points
  'M11': 'service-delivery',           // D3 - Seating

  // Service and support
  'M12': 'customer-service-training',  // 4.1 - Staff awareness
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

/**
 * Get sections for a given category
 */
export function getSectionsForCategory(categoryId: string): DIAPSection[] {
  return DIAP_SECTIONS.filter(s => s.categoryId === categoryId);
}

/**
 * Get category by ID
 */
export function getCategoryById(categoryId: string): DIAPCategoryGroup | undefined {
  return DIAP_CATEGORIES.find(c => c.id === categoryId);
}

/**
 * Get display label for a category
 */
export function getCategoryLabel(categoryId: string): string {
  const labels: Record<string, string> = {
    'physical-access': 'Physical Access',
    'information-communication-marketing': 'Information, Communication & Marketing',
    'customer-service': 'Customer Service',
    'operations-policy-procedure': 'Operations, Policy & Procedure',
    'people-culture': 'People & Culture',
  };
  return labels[categoryId] || categoryId;
}

/**
 * Get item categories that belong to a group
 */
export function getCategoriesForGroup(groupId: string): string[] {
  return Object.entries(CATEGORY_TO_GROUP)
    .filter(([_, group]) => group === groupId)
    .map(([category]) => category);
}

/**
 * Group items by category group, then by item category within each group
 */
export function groupItemsByCategory<T extends { category?: string }>(
  items: T[]
): { group: DIAPCategoryGroup; subcategories: { id: string; label: string; items: T[] }[] }[] {
  const result: { group: DIAPCategoryGroup; subcategories: { id: string; label: string; items: T[] }[] }[] = [];

  DIAP_CATEGORIES.forEach(group => {
    const categoryIds = getCategoriesForGroup(group.id);
    const subcategories: { id: string; label: string; items: T[] }[] = [];

    categoryIds.forEach(categoryId => {
      const categoryItems = items.filter(item => item.category === categoryId);
      subcategories.push({
        id: categoryId,
        label: getCategoryLabel(categoryId),
        items: categoryItems,
      });
    });

    result.push({ group, subcategories });
  });

  return result;
}
