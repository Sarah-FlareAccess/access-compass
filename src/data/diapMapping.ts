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

import { supabase, isSupabaseEnabled } from '../utils/supabase';
import { syncRecord, deleteRecord } from '../utils/cloudSync';

// Background sync helper for non-React context
function bgSyncCategory(table: string, data: Record<string, unknown>) {
  if (!isSupabaseEnabled() || !supabase) return;
  supabase!.auth.getUser().then(({ data: userData }) => {
    const userId = userData.user?.id;
    if (!userId) return;
    supabase!.from('organisation_memberships')
      .select('organisation_id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle()
      .then(({ data: membership }) => {
        syncRecord(table, data, userId, membership?.organisation_id).catch(() => {});
      });
  }).catch(() => {});
}

function bgDeleteCategory(table: string, filters: Record<string, unknown>) {
  if (!isSupabaseEnabled() || !supabase) return;
  supabase!.auth.getUser().then(({ data: userData }) => {
    const userId = userData.user?.id;
    if (!userId) return;
    deleteRecord(table, filters, userId).catch(() => {});
  }).catch(() => {});
}

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
  // Before arrival
  '1.1': 'information-communication',  // Pre-visit information
  '1.2': 'information-communication',  // Website basics
  '1.3': 'information-communication',  // Booking & ticketing systems
  '1.4': 'information-communication',  // Social media, video & audio
  '1.5': 'information-communication',  // Communication and language
  '1.6': 'information-communication',  // Marketing and representation

  // Getting in and moving around
  '2.1': 'built-environment',          // Arrival, parking and drop-off
  '2.2': 'built-environment',          // Entry and doors
  '2.3': 'built-environment',          // Paths and aisles
  '2.4': 'built-environment',          // Queues and busy times

  // During the visit
  '3.1': 'built-environment',          // Seating, furniture and layout
  '3.2': 'built-environment',          // Toilets and amenities
  '3.3': 'built-environment',          // Lighting, sound and sensory environment
  '3.4': 'service-delivery',           // Equipment and resources
  '3.5': 'built-environment',          // Signage and wayfinding
  '3.6': 'information-communication',  // Menus and printed materials
  '3.7': 'service-delivery',           // Audio, digital and interactive content
  '3.8': 'service-delivery',           // Participating in experiences and activities
  '3.9': 'built-environment',          // Accessible accommodation
  '3.10': 'service-delivery',          // Retail and shopping accessibility

  // Service and support
  '4.2': 'customer-service-training',  // Customer service and staff confidence
  '4.3': 'service-delivery',           // Bookings and ticketing
  '4.4': 'service-delivery',           // Safety and emergencies
  '4.5': 'service-delivery',           // Feedback and reviews
  '4.6': 'information-communication',  // Staying connected

  // Policy and operations
  '5.1': 'policy-procedure',           // Policy and inclusion
  '5.2': 'policy-procedure',           // Employing people with disability
  '5.3': 'customer-service-training',  // Staff training and awareness
  '5.4': 'policy-procedure',           // Accessible procurement
  '5.5': 'policy-procedure',           // Continuous improvement and reporting

  // Event modules
  '6.1': 'service-delivery',           // Event planning
  '6.2': 'service-delivery',           // Event delivery
  '6.3': 'information-communication',  // Event communications
  '6.4': 'service-delivery',           // Event venue and logistics
  '6.5': 'service-delivery',           // Post-event

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
export function groupItemsByCategory<T extends { category?: string; priority?: string }>(
  items: T[]
): { group: DIAPCategoryGroup; subcategories: { id: string; label: string; items: T[] }[] }[] {
  const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
  const result: { group: DIAPCategoryGroup; subcategories: { id: string; label: string; items: T[] }[] }[] = [];

  DIAP_CATEGORIES.forEach(group => {
    const categoryIds = getCategoriesForGroup(group.id);
    const subcategories: { id: string; label: string; items: T[] }[] = [];

    categoryIds.forEach(categoryId => {
      const categoryItems = items
        .filter(item => item.category === categoryId)
        .sort((a, b) => (priorityOrder[a.priority || 'low'] ?? 2) - (priorityOrder[b.priority || 'low'] ?? 2));
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

export interface ObjectiveGroup<T> {
  objective: string;
  items: T[];
}

/**
 * Group items by category group, then by shared objective within each group.
 * Items sharing the same objective string are clustered together.
 */
export function groupItemsByCategoryAndObjective<T extends { category?: string; priority?: string; objective?: string }>(
  items: T[]
): { group: DIAPCategoryGroup; objectiveGroups: ObjectiveGroup<T>[]; totalItems: number }[] {
  const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
  const result: { group: DIAPCategoryGroup; objectiveGroups: ObjectiveGroup<T>[]; totalItems: number }[] = [];

  const allCats = getAllCategories();

  allCats.forEach(group => {
    const categoryIds = getCategoriesForGroup(group.id);
    // For custom categories, the group.id IS the category id directly
    if (!categoryIds.includes(group.id)) categoryIds.push(group.id);
    const allCategoryItems = items.filter(item => categoryIds.includes(item.category || ''));

    // Group by objective string
    const objectiveMap = new Map<string, T[]>();
    allCategoryItems.forEach(item => {
      const obj = (item.objective || 'Other actions').trim();
      if (!objectiveMap.has(obj)) objectiveMap.set(obj, []);
      objectiveMap.get(obj)!.push(item);
    });

    // Sort items within each objective group by priority
    const objectiveGroups: ObjectiveGroup<T>[] = [];
    objectiveMap.forEach((groupItems, objective) => {
      groupItems.sort((a, b) => (priorityOrder[a.priority || 'low'] ?? 2) - (priorityOrder[b.priority || 'low'] ?? 2));
      objectiveGroups.push({ objective, items: groupItems });
    });

    // Sort objective groups by highest-priority item in each (high-priority groups first)
    objectiveGroups.sort((a, b) => {
      const aPri = priorityOrder[a.items[0]?.priority || 'low'] ?? 2;
      const bPri = priorityOrder[b.items[0]?.priority || 'low'] ?? 2;
      return aPri - bPri;
    });

    result.push({ group, objectiveGroups, totalItems: allCategoryItems.length });
  });

  return result;
}

// Custom category name storage
const CUSTOM_CATEGORY_NAMES_KEY = 'diap_custom_category_names';
const CUSTOM_CATEGORIES_KEY = 'diap_custom_categories';

export function getCustomCategoryNames(): Record<string, string> {
  const data = localStorage.getItem(CUSTOM_CATEGORY_NAMES_KEY);
  return data ? JSON.parse(data) : {};
}

export function setCustomCategoryName(categoryId: string, name: string): void {
  const names = getCustomCategoryNames();
  const defaultGroup = DIAP_CATEGORIES.find(c => c.id === categoryId);
  if (defaultGroup && name.trim() === defaultGroup.name) {
    delete names[categoryId];
    bgDeleteCategory('diap_custom_category_names', { category_id: categoryId });
  } else {
    names[categoryId] = name.trim();
    bgSyncCategory('diap_custom_category_names', {
      category_id: categoryId,
      custom_name: name.trim(),
    });
  }
  localStorage.setItem(CUSTOM_CATEGORY_NAMES_KEY, JSON.stringify(names));
}

export function getCategoryDisplayName(categoryId: string, customNames?: Record<string, string>): string {
  const names = customNames || getCustomCategoryNames();
  if (names[categoryId]) return names[categoryId];
  const group = DIAP_CATEGORIES.find(c => c.id === categoryId);
  const custom = getCustomCategories().find(c => c.id === categoryId);
  return group?.name || custom?.name || categoryId;
}

// Custom category CRUD
export function getCustomCategories(): DIAPCategoryGroup[] {
  try {
    const data = localStorage.getItem(CUSTOM_CATEGORIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export function addCustomCategory(name: string, description?: string): DIAPCategoryGroup {
  const categories = getCustomCategories();
  const id = 'custom-' + name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const newCat: DIAPCategoryGroup = {
    id,
    name: name.trim(),
    description: description?.trim() || '',
    icon: '📌',
  };
  categories.push(newCat);
  localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(categories));
  bgSyncCategory('diap_custom_categories', {
    id,
    name: newCat.name,
    description: newCat.description,
  });
  return newCat;
}

export function removeCustomCategory(categoryId: string): void {
  const categories = getCustomCategories().filter(c => c.id !== categoryId);
  localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(categories));
  bgDeleteCategory('diap_custom_categories', { id: categoryId });
  // Also clean up any custom name for this category
  const names = getCustomCategoryNames();
  if (names[categoryId]) {
    delete names[categoryId];
    localStorage.setItem(CUSTOM_CATEGORY_NAMES_KEY, JSON.stringify(names));
    bgDeleteCategory('diap_custom_category_names', { category_id: categoryId });
  }
}

export function updateCustomCategory(categoryId: string, updates: Partial<Pick<DIAPCategoryGroup, 'name' | 'description'>>): void {
  const categories = getCustomCategories();
  const idx = categories.findIndex(c => c.id === categoryId);
  if (idx >= 0) {
    if (updates.name !== undefined) categories[idx].name = updates.name.trim();
    if (updates.description !== undefined) categories[idx].description = updates.description.trim();
    localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(categories));
    bgSyncCategory('diap_custom_categories', {
      id: categoryId,
      name: categories[idx].name,
      description: categories[idx].description,
    });
  }
}

export function getAllCategories(): DIAPCategoryGroup[] {
  return [...DIAP_CATEGORIES, ...getCustomCategories()];
}
