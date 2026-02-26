import type {
  TrainingCourse,
  TrainingResource,
  TrainingCategory,
  TrainingCategoryConfig,
  TrainingAccessTier,
} from './types';
import { aiAccessibleResourcesCourse } from './courses/ai-accessible-resources';
import { standaloneResources } from './resources/index';

export const TRAINING_CATEGORIES: TrainingCategoryConfig[] = [
  {
    id: 'ai-tools',
    label: 'AI Tools',
    description: 'Learn to use AI to create accessible resources',
    icon: 'sparkles',
    color: '#8b5cf6',
  },
  {
    id: 'disability-inclusion',
    label: 'Disability Inclusion',
    description: 'Foundational disability awareness and inclusion training',
    icon: 'heart',
    color: '#ec4899',
  },
  {
    id: 'accessible-communications',
    label: 'Accessible Communications',
    description: 'Create accessible documents, signage, and communications',
    icon: 'message-circle',
    color: '#3b82f6',
  },
  {
    id: 'physical-accessibility',
    label: 'Physical Accessibility',
    description: 'Understanding physical access requirements and standards',
    icon: 'building',
    color: '#22c55e',
  },
  {
    id: 'digital-accessibility',
    label: 'Digital Accessibility',
    description: 'Web, app, and digital content accessibility',
    icon: 'monitor',
    color: '#f59e0b',
  },
  {
    id: 'leadership-culture',
    label: 'Leadership & Culture',
    description: 'Building an inclusive organisational culture',
    icon: 'users',
    color: '#06b6d4',
  },
];

export const allCourses: TrainingCourse[] = [
  aiAccessibleResourcesCourse,
];

export const allResources: TrainingResource[] = [
  ...standaloneResources,
];

const courseBySlug = new Map<string, TrainingCourse>();
const courseById = new Map<string, TrainingCourse>();
allCourses.forEach((course) => {
  courseBySlug.set(course.slug, course);
  courseById.set(course.id, course);
});

const resourceBySlug = new Map<string, TrainingResource>();
const resourceById = new Map<string, TrainingResource>();
allResources.forEach((resource) => {
  resourceBySlug.set(resource.slug, resource);
  resourceById.set(resource.id, resource);
});

export function getCourseBySlug(slug: string): TrainingCourse | undefined {
  return courseBySlug.get(slug);
}

export function getCourseById(id: string): TrainingCourse | undefined {
  return courseById.get(id);
}

export function getResourceBySlug(slug: string): TrainingResource | undefined {
  return resourceBySlug.get(slug);
}

export function getResourceById(id: string): TrainingResource | undefined {
  return resourceById.get(id);
}

export function getCoursesByCategory(category: TrainingCategory): TrainingCourse[] {
  return allCourses.filter((c) => c.category === category);
}

export function getResourcesByCategory(category: TrainingCategory): TrainingResource[] {
  return allResources.filter((r) => r.category === category);
}

export function getFeaturedCourses(): TrainingCourse[] {
  return allCourses.filter((c) => c.featured);
}

export function getFeaturedResources(): TrainingResource[] {
  return allResources.filter((r) => r.featured);
}

export function searchTraining(query: string): {
  courses: TrainingCourse[];
  resources: TrainingResource[];
} {
  const q = query.toLowerCase().trim();
  if (!q) return { courses: allCourses, resources: allResources };

  const courses = allCourses.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.keywords?.some((k) => k.toLowerCase().includes(q)) ||
      c.lessons.some((l) => l.title.toLowerCase().includes(q))
  );

  const resources = allResources.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.keywords?.some((k) => k.toLowerCase().includes(q))
  );

  return { courses, resources };
}

export function filterByAccessTier(
  items: (TrainingCourse | TrainingResource)[],
  tier: TrainingAccessTier
): (TrainingCourse | TrainingResource)[] {
  return items.filter((item) => item.accessTier === tier);
}

export function getCategoryConfig(category: TrainingCategory): TrainingCategoryConfig | undefined {
  return TRAINING_CATEGORIES.find((c) => c.id === category);
}

export * from './types';
