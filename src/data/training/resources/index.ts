import type { TrainingResource } from '../types';

// 'resource-intro-disability-inclusion' and 'resource-wcag-overview' were
// removed here because their body was still "Coming soon" placeholder text.
// Re-add once real article content is written.
export const standaloneResources: TrainingResource[] = [
  {
    id: 'resource-accessible-events-checklist',
    slug: 'accessible-events-checklist',
    title: 'Accessible Events Planning Checklist',
    description: 'A downloadable checklist covering venue selection, communications, catering, presentations and emergency planning for accessible events.',
    category: 'disability-inclusion',
    contentType: 'checklist',
    accessTier: 'free',
    download: {
      title: 'Accessible Events Planning Checklist',
      description: 'Printable checklist for event organisers',
      fileName: 'accessible-events-checklist.pdf',
      fileUrl: '/training/downloads/accessible-events-checklist.pdf',
      fileType: 'PDF',
      fileSize: '420 KB',
    },
    author: 'Flare Access',
    publishedDate: '2026-02-27',
    estimatedMinutes: 5,
    keywords: ['events', 'checklist', 'planning', 'accessible events'],
  },
];
