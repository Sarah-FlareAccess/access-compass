export type TrainingAccessTier = 'free' | 'included' | 'premium';

export type TrainingCategory =
  | 'disability-inclusion'
  | 'accessible-communications'
  | 'physical-accessibility'
  | 'digital-accessibility'
  | 'leadership-culture'
  | 'ai-tools';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export type ContentBlockType =
  | 'text'
  | 'video'
  | 'exercise'
  | 'download'
  | 'checklist'
  | 'callout'
  | 'image';

export interface TrainingCategoryConfig {
  id: TrainingCategory;
  label: string;
  description: string;
  icon: string;
  color: string;
}

export interface VimeoVideo {
  vimeoId: string;
  title: string;
  duration: string;
  hasCaptions?: boolean;
  hasTranscript?: boolean;
  passwordProtected?: boolean;
}

export interface TrainingDownload {
  title: string;
  description: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
}

export interface LessonContentBlock {
  type: ContentBlockType;
  heading?: string;
  body?: string;
  video?: VimeoVideo;
  exercise?: {
    title: string;
    instructions: string;
    promptTemplate?: string;
    expectedOutcome?: string;
    tips?: string[];
    exampleOutput?: string;
  };
  download?: TrainingDownload;
  checklist?: {
    title: string;
    items: string[];
  };
  callout?: {
    variant: 'tip' | 'warning' | 'info' | 'example';
    text: string;
  };
  image?: {
    src: string;
    alt: string;
    caption?: string;
  };
}

export interface TrainingLesson {
  id: string;
  courseId: string;
  title: string;
  subtitle?: string;
  description: string;
  order: number;
  estimatedMinutes: number;
  contentBlocks: LessonContentBlock[];
  accessTier: TrainingAccessTier;
  isPreview?: boolean;
  complementaryResourceIds?: string[];
  keywords?: string[];
}

export interface TrainingCourse {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  longDescription?: string;
  coverImage?: string;
  category: TrainingCategory;
  accessTier: TrainingAccessTier;
  lessons: TrainingLesson[];
  totalEstimatedMinutes: number;
  skillLevel: SkillLevel;
  learningOutcomes: string[];
  prerequisites?: string[];
  courseDownloads?: TrainingDownload[];
  author?: string;
  publishedDate?: string;
  lastUpdated?: string;
  featured?: boolean;
  keywords?: string[];
}

export type StandaloneContentType = 'video' | 'webinar' | 'article' | 'download' | 'checklist';

export interface TrainingResource {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: TrainingCategory;
  contentType: StandaloneContentType;
  accessTier: TrainingAccessTier;
  video?: VimeoVideo;
  download?: TrainingDownload;
  body?: string;
  author?: string;
  publishedDate?: string;
  estimatedMinutes?: number;
  featured?: boolean;
  keywords?: string[];
  complementaryResourceIds?: string[];
}

export interface CourseProgress {
  courseId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  startedAt?: string;
  completedAt?: string;
  completedLessons: string[];
  lastLessonId?: string;
}

export interface TrainingProgress {
  courses: Record<string, CourseProgress>;
  viewedResources: string[];
}
