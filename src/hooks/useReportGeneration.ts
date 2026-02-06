/**
 * Report Generation Hook
 *
 * Generates comprehensive reports based on review mode:
 * - Pulse Check: 1-page summary
 * - Deep Dive: Detailed report with issues, reasoning, priorities, and resources
 */

import { useMemo } from 'react';
import { useModuleProgress } from './useModuleProgress';
import type { ModuleProgress, ModuleRun } from './useModuleProgress';
import { useDIAPManagement } from './useDIAPManagement';
import type { DIAPItem } from './useDIAPManagement';
import { getModuleById } from '../data/accessModules';
import type { ReviewMode } from '../types/index';
import { needsFollowUp, isNegativeResponse } from '../constants/responseOptions';
import { getReportResourceLinks } from '../utils/resourceLinks';
import type { ReportConfig } from '../components/ReportConfigSelector';

export interface ReportSection {
  title: string;
  content: string | string[];
  type: 'text' | 'list' | 'stats';
}

export interface QuickWin {
  title: string;
  description: string;
  effort: 'low' | 'medium';
  impact: 'high' | 'medium';
}

export interface ProfessionalSupportIndicator {
  category: string;
  reason: string;
  detected: boolean;
}

// Module completion evidence for reports
export interface ModuleCompletionEvidence {
  moduleId: string;
  moduleName: string;
  moduleCode: string;
  completedAt?: string;
  completedBy?: string;
  completedByRole?: string;
  assignedTo?: string;
  targetCompletionDate?: string;
  confidenceSnapshot?: 'strong' | 'mixed' | 'needs-work';
  strengthsCount: number;
  actionsCount: number;
}

// URL Analysis result for the report
export interface UrlAnalysisResult {
  url: string;
  questionText: string;
  overallScore: number;
  overallStatus: 'excellent' | 'good' | 'needs-improvement' | 'missing';
  summary: string;
  strengths: string[];
  improvements: string[];
}

// Media Analysis result for the report
export interface MediaAnalysisReportResult {
  id: string;
  questionText: string;
  analysisType: string;
  inputType: 'photo' | 'document' | 'url' | 'screenshot';
  fileName?: string;
  url?: string;
  thumbnailDataUrl?: string;
  overallScore: number;
  overallStatus: 'excellent' | 'good' | 'needs-improvement' | 'poor' | 'not-assessable';
  summary: string;
  strengths: string[];
  improvements: string[];
  quickWins: string[];
  standardsAssessed: string[];
  needsProfessionalReview: boolean;
  professionalReviewReason?: string;
}

// User notes from question responses
export interface QuestionNote {
  moduleId: string;
  moduleName: string;
  questionId: string;
  questionText: string;
  answer: string | null;
  notes: string;
  timestamp: string;
}

// Evidence file attached to a question
export interface QuestionEvidence {
  moduleId: string;
  moduleName: string;
  questionId: string;
  questionText: string;
  evidenceType: 'photo' | 'document' | 'link';
  fileName: string;
  dataUrl?: string;
  url?: string;
  description?: string;
  uploadedAt: string;
}

export interface Report {
  reportType: 'pulse-check' | 'deep-dive';
  generatedAt: string;
  organisation: string;

  // Executive summary
  executiveSummary: {
    modulesCompleted: number;
    totalModules: number;
    strengthsCount: number;
    actionsCount: number;
    areasToExploreCount: number;
    completionPercentage: number;
  };

  // Module completion evidence (who did what, when)
  moduleEvidence: ModuleCompletionEvidence[];

  // URL Analysis results
  urlAnalysisResults: UrlAnalysisResult[];

  // Media Analysis results
  mediaAnalysisResults: MediaAnalysisReportResult[];

  // User notes from questions
  questionNotes: QuestionNote[];

  // Evidence files attached to questions
  questionEvidence: QuestionEvidence[];

  // Main content sections
  sections: {
    strengths: ReportSection;
    priorityActions: ReportSection;
    areasToExplore: ReportSection;
    professionalReview: ReportSection;
  };

  // Deep dive specific content
  detailedFindings?: {
    moduleId: string;
    moduleName: string;
    issues: Array<{
      questionText: string;
      reasoning: string;
      priority: 'high' | 'medium' | 'low';
      recommendedActions: string[];
      resourceLinks: string[];
      // Compliance information
      complianceLevel?: 'mandatory' | 'best-practice';
      complianceRef?: string;
    }>;
  }[];

  // Quick wins analysis
  quickWins: QuickWin[];

  // Professional support indicators
  professionalSupport: {
    recommended: boolean;
    indicators: ProfessionalSupportIndicator[];
  };

  // Next steps
  nextSteps: {
    exploreNow: string[];
    planForLater: string[];
  };

  // Progress comparison (when comparing runs)
  progressComparison?: {
    enabled: boolean;
    comparisons: Array<{
      moduleId: string;
      moduleName: string;
      currentRun: {
        contextName: string;
        completedAt?: string;
      };
      previousRun: {
        contextName: string;
        completedAt?: string;
      };
      improvements: number;
      regressions: number;
      unchanged: number;
      trend: 'improving' | 'declining' | 'stable' | 'mixed';
      scoreChange: number;
    }>;
    overallSummary: {
      totalImprovements: number;
      totalRegressions: number;
      overallTrend: 'improving' | 'declining' | 'stable' | 'mixed';
    };
  };

  // Report context/filter info
  reportContext?: {
    filterType: 'all' | 'context' | 'custom';
    contextName?: string;
    modulesIncluded: number;
    modulesExcluded: number;
  };
}

interface UseReportGenerationReturn {
  generateReport: (reviewMode: ReviewMode, organisationName?: string, reportConfig?: ReportConfig) => Report;
  isReady: boolean;
  getModuleRuns: (moduleId: string) => ModuleRun[];
}

export function useReportGeneration(selectedModuleIds: string[]): UseReportGenerationReturn {
  const { progress, isLoading, getModuleRuns, compareRuns } = useModuleProgress(selectedModuleIds);
  const { items: diapItems } = useDIAPManagement();

  const isReady = !isLoading && Object.keys(progress).length > 0;

  const generateReport = useMemo(() => {
    return (reviewMode: ReviewMode, organisationName: string = 'Your Organisation', reportConfig?: ReportConfig): Report => {
      const now = new Date().toISOString();

      // Build module progress list based on report config
      let completedModules: ModuleProgress[];
      let modulesIncluded = 0;
      let modulesExcluded = 0;

      if (reportConfig && reportConfig.filterType !== 'all') {
        // Filter based on selected runs
        completedModules = [];
        reportConfig.moduleSelections.forEach(selection => {
          if (selection.selectedRunId) {
            const moduleProgress = progress[selection.moduleId];
            if (moduleProgress) {
              const run = moduleProgress.runs?.find(r => r.id === selection.selectedRunId);
              if (run && run.status === 'completed') {
                // Create a progress object from the specific run
                completedModules.push({
                  ...moduleProgress,
                  responses: run.responses,
                  summary: run.summary,
                  completedAt: run.completedAt,
                  ownership: run.ownership,
                  confidenceSnapshot: run.confidenceSnapshot,
                });
                modulesIncluded++;
              } else {
                modulesExcluded++;
              }
            }
          } else {
            modulesExcluded++;
          }
        });
      } else {
        // Use all current/default progress
        completedModules = Object.values(progress).filter(p => p.status === 'completed');
        modulesIncluded = completedModules.length;
        modulesExcluded = selectedModuleIds.length - completedModules.length;
      }

      // Aggregate all summaries
      const allStrengths: string[] = [];
      const allPriorityActions: string[] = [];
      const allAreasToExplore: string[] = [];
      const allProfessionalReview: string[] = [];

      // Build module evidence (ownership/completion metadata)
      const moduleEvidence: ModuleCompletionEvidence[] = completedModules.map(moduleProgress => {
        const module = getModuleById(moduleProgress.moduleId);
        return {
          moduleId: moduleProgress.moduleId,
          moduleName: module?.name || moduleProgress.moduleCode,
          moduleCode: moduleProgress.moduleCode,
          completedAt: moduleProgress.completedAt,
          completedBy: moduleProgress.ownership?.completedBy,
          completedByRole: moduleProgress.ownership?.completedByRole,
          assignedTo: moduleProgress.ownership?.assignedTo,
          targetCompletionDate: moduleProgress.ownership?.targetCompletionDate,
          confidenceSnapshot: moduleProgress.confidenceSnapshot,
          strengthsCount: moduleProgress.summary?.doingWell?.length || 0,
          actionsCount: moduleProgress.summary?.priorityActions?.length || 0,
        };
      });

      // Extract URL analysis results
      const urlAnalysisResults: UrlAnalysisResult[] = [];

      // Extract Media analysis results
      const mediaAnalysisResults: MediaAnalysisReportResult[] = [];

      // Extract user notes from questions
      const questionNotes: QuestionNote[] = [];

      // Extract evidence files from questions
      const questionEvidence: QuestionEvidence[] = [];

      completedModules.forEach(moduleProgress => {
        if (moduleProgress.summary) {
          if (moduleProgress.summary.doingWell) {
            allStrengths.push(...moduleProgress.summary.doingWell);
          }
          if (moduleProgress.summary.priorityActions) {
            allPriorityActions.push(...moduleProgress.summary.priorityActions.map(a =>
              `${a.action} (${a.priority} priority)`
            ));
          }
          if (moduleProgress.summary.areasToExplore) {
            allAreasToExplore.push(...moduleProgress.summary.areasToExplore);
          }
          if (moduleProgress.summary.professionalReview) {
            allProfessionalReview.push(...moduleProgress.summary.professionalReview);
          }
        }

        // Extract URL analysis from responses
        const module = getModuleById(moduleProgress.moduleId);
        moduleProgress.responses.forEach(response => {
          if (response.urlAnalysis) {
            const question = module?.questions.find(q => q.id === response.questionId);
            urlAnalysisResults.push({
              url: response.urlAnalysis.url,
              questionText: question?.text || 'Website accessibility review',
              overallScore: response.urlAnalysis.overallScore,
              overallStatus: response.urlAnalysis.overallStatus,
              summary: response.urlAnalysis.summary,
              strengths: response.urlAnalysis.strengths || [],
              improvements: response.urlAnalysis.improvements || [],
            });
          }

          // Extract media analysis from responses
          if (response.mediaAnalysis) {
            const question = module?.questions.find(q => q.id === response.questionId);
            mediaAnalysisResults.push({
              id: response.mediaAnalysis.id,
              questionText: question?.text || 'Media analysis',
              analysisType: response.mediaAnalysis.analysisType,
              inputType: response.mediaAnalysis.inputType,
              fileName: response.mediaAnalysis.fileName,
              url: response.mediaAnalysis.url,
              thumbnailDataUrl: response.mediaAnalysis.thumbnailDataUrl,
              overallScore: response.mediaAnalysis.overallScore,
              overallStatus: response.mediaAnalysis.overallStatus,
              summary: response.mediaAnalysis.summary,
              strengths: response.mediaAnalysis.strengths || [],
              improvements: response.mediaAnalysis.improvements || [],
              quickWins: response.mediaAnalysis.quickWins || [],
              standardsAssessed: response.mediaAnalysis.standardsAssessed || [],
              needsProfessionalReview: response.mediaAnalysis.needsProfessionalReview,
              professionalReviewReason: response.mediaAnalysis.professionalReviewReason,
            });

            // Add media analysis recommendations to professional review if needed
            if (response.mediaAnalysis.needsProfessionalReview && response.mediaAnalysis.professionalReviewReason) {
              allProfessionalReview.push(
                `${getAnalysisTypeLabel(response.mediaAnalysis.analysisType)}: ${response.mediaAnalysis.professionalReviewReason}`
              );
            }
          }

          // Extract user notes
          if (response.notes && response.notes.trim()) {
            const question = module?.questions.find(q => q.id === response.questionId);
            questionNotes.push({
              moduleId: moduleProgress.moduleId,
              moduleName: module?.name || moduleProgress.moduleCode,
              questionId: response.questionId,
              questionText: question?.text || 'Question',
              answer: response.answer,
              notes: response.notes,
              timestamp: response.timestamp,
            });
          }

          // Extract evidence files
          if (response.evidence && response.evidence.length > 0) {
            const question = module?.questions.find(q => q.id === response.questionId);
            response.evidence.forEach(ev => {
              questionEvidence.push({
                moduleId: moduleProgress.moduleId,
                moduleName: module?.name || moduleProgress.moduleCode,
                questionId: response.questionId,
                questionText: question?.text || 'Question',
                evidenceType: ev.type,
                fileName: ev.name,
                dataUrl: ev.dataUrl,
                url: ev.url,
                description: ev.description,
                uploadedAt: ev.uploadedAt,
              });
            });
          }
        });
      });

      // Identify quick wins (areas with low effort, high impact)
      const quickWins = identifyQuickWins(completedModules, diapItems);

      // Assess professional support needs
      const professionalSupport = assessProfessionalSupport(completedModules, allProfessionalReview);

      // Generate next steps
      const nextSteps = generateNextSteps(allAreasToExplore, completedModules, selectedModuleIds);

      // Create executive summary
      const executiveSummary = {
        modulesCompleted: completedModules.length,
        totalModules: selectedModuleIds.length,
        strengthsCount: allStrengths.length,
        actionsCount: allPriorityActions.length,
        areasToExploreCount: allAreasToExplore.length,
        completionPercentage: selectedModuleIds.length > 0
          ? Math.round((completedModules.length / selectedModuleIds.length) * 100)
          : 0,
      };

      // Generate progress comparison if enabled
      let progressComparison: Report['progressComparison'] = undefined;

      if (reportConfig?.includeProgressComparison) {
        const comparisons: NonNullable<Report['progressComparison']>['comparisons'] = [];
        let totalImprovements = 0;
        let totalRegressions = 0;

        // For each module, compare selected run with previous run
        reportConfig.moduleSelections.forEach(selection => {
          if (!selection.selectedRunId) return;

          const moduleProgress = progress[selection.moduleId];
          if (!moduleProgress?.runs || moduleProgress.runs.length < 2) return;

          const currentRun = moduleProgress.runs.find(r => r.id === selection.selectedRunId);
          if (!currentRun) return;

          // Find the most recent completed run before the current one
          const currentRunDate = new Date(currentRun.startedAt);
          const previousRuns = moduleProgress.runs
            .filter(r => r.id !== selection.selectedRunId && r.status === 'completed')
            .filter(r => new Date(r.startedAt) < currentRunDate)
            .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

          const previousRun = previousRuns[0];
          if (!previousRun) return;

          // Calculate comparison
          const comparison = compareRuns(selection.moduleId, previousRun.id, currentRun.id);
          if (!comparison) return;

          const module = getModuleById(selection.moduleId);
          comparisons.push({
            moduleId: selection.moduleId,
            moduleName: module?.name || selection.moduleName,
            currentRun: {
              contextName: currentRun.context.name,
              completedAt: currentRun.completedAt,
            },
            previousRun: {
              contextName: previousRun.context.name,
              completedAt: previousRun.completedAt,
            },
            improvements: comparison.improvements.length,
            regressions: comparison.regressions.length,
            unchanged: comparison.unchanged.length,
            trend: comparison.overallTrend,
            scoreChange: comparison.scoreChange,
          });

          totalImprovements += comparison.improvements.length;
          totalRegressions += comparison.regressions.length;
        });

        if (comparisons.length > 0) {
          // Determine overall trend
          let overallTrend: 'improving' | 'declining' | 'stable' | 'mixed';
          if (totalImprovements > totalRegressions * 2) {
            overallTrend = 'improving';
          } else if (totalRegressions > totalImprovements * 2) {
            overallTrend = 'declining';
          } else if (totalImprovements === 0 && totalRegressions === 0) {
            overallTrend = 'stable';
          } else {
            overallTrend = 'mixed';
          }

          progressComparison = {
            enabled: true,
            comparisons,
            overallSummary: {
              totalImprovements,
              totalRegressions,
              overallTrend,
            },
          };
        }
      }

      // Build report context info
      const reportContext: Report['reportContext'] = reportConfig ? {
        filterType: reportConfig.filterType,
        contextName: reportConfig.contextFilter,
        modulesIncluded,
        modulesExcluded,
      } : undefined;

      const report: Report = {
        reportType: reviewMode === 'pulse-check' ? 'pulse-check' : 'deep-dive',
        generatedAt: now,
        organisation: organisationName,
        executiveSummary,
        moduleEvidence,
        urlAnalysisResults,
        mediaAnalysisResults,
        questionNotes,
        questionEvidence,
        sections: {
          strengths: {
            title: "What's Going Well",
            content: allStrengths,
            type: 'list',
          },
          priorityActions: {
            title: 'Priority Actions',
            content: allPriorityActions,
            type: 'list',
          },
          areasToExplore: {
            title: 'Areas to Explore',
            content: allAreasToExplore,
            type: 'list',
          },
          professionalReview: {
            title: 'Consider Professional Review',
            content: allProfessionalReview,
            type: 'list',
          },
        },
        quickWins,
        professionalSupport,
        nextSteps,
        progressComparison,
        reportContext,
      };

      // Add detailed findings for deep-dive mode
      if (reviewMode === 'deep-dive') {
        report.detailedFindings = generateDetailedFindings(completedModules);
      }

      return report;
    };
  }, [progress, diapItems, selectedModuleIds, compareRuns]);

  return {
    generateReport,
    isReady,
    getModuleRuns,
  };
}

// Helper: Identify quick wins
function identifyQuickWins(_completedModules: ModuleProgress[], diapItems: DIAPItem[]): QuickWin[] {
  const quickWins: QuickWin[] = [];

  // Look for low-effort, high-impact actions
  const lowEffortActions = diapItems.filter(item =>
    item.timeframe === '0-30 days' &&
    (item.priority === 'high' || item.priority === 'medium')
  );

  lowEffortActions.slice(0, 5).forEach(action => {
    quickWins.push({
      title: action.action,
      description: action.impactStatement || 'Quick improvement with significant accessibility benefit',
      effort: 'low',
      impact: action.priority === 'high' ? 'high' : 'medium',
    });
  });

  return quickWins;
}

// Helper: Assess need for professional support
function assessProfessionalSupport(
  completedModules: ModuleProgress[],
  professionalReviewItems: string[]
): {
  recommended: boolean;
  indicators: ProfessionalSupportIndicator[];
} {
  const indicators: ProfessionalSupportIndicator[] = [];

  // Check for structural barriers
  const structuralKeywords = ['entrance', 'ramp', 'lift', 'stairs', 'doorway', 'threshold'];
  let structuralIssuesDetected = false;

  completedModules.forEach(module => {
    module.responses.forEach(response => {
      if (isNegativeResponse(response.answer) || needsFollowUp(response.answer)) {
        const hasStructuralKeyword = structuralKeywords.some(keyword =>
          JSON.stringify(response).toLowerCase().includes(keyword)
        );
        if (hasStructuralKeyword) {
          structuralIssuesDetected = true;
        }
      }
    });
  });

  indicators.push({
    category: 'Structural Barriers',
    reason: 'You identified structural barriers that are hard to change',
    detected: structuralIssuesDetected,
  });

  // Check for items needing follow-up ("Unable to check" responses)
  const followUpCount = completedModules.reduce((count, module) => {
    return count + module.responses.filter(r => needsFollowUp(r.answer)).length;
  }, 0);

  indicators.push({
    category: 'Areas to Confirm',
    reason: 'Some items need follow-up or verification',
    detected: followUpCount > 5,
  });

  // Check for professional review items
  indicators.push({
    category: 'Expert Assessment Needed',
    reason: 'Some areas require professional expertise to evaluate properly',
    detected: professionalReviewItems.length > 0,
  });

  // Check for planned major changes
  const plannedChangesKeywords = ['renovation', 'refurbishment', 'building work', 'major change'];
  let plannedChangesDetected = false;

  completedModules.forEach(module => {
    module.responses.forEach(response => {
      if (response.notes) {
        const hasPlannedChange = plannedChangesKeywords.some(keyword =>
          response.notes!.toLowerCase().includes(keyword)
        );
        if (hasPlannedChange) {
          plannedChangesDetected = true;
        }
      }
    });
  });

  indicators.push({
    category: 'Significant Changes Planned',
    reason: "You're planning significant changes or improvements",
    detected: plannedChangesDetected,
  });

  const recommended = indicators.filter(i => i.detected).length >= 2;

  return { recommended, indicators };
}

// Helper: Generate next steps
function generateNextSteps(
  areasToExplore: string[],
  completedModules: ModuleProgress[],
  selectedModuleIds: string[]
): {
  exploreNow: string[];
  planForLater: string[];
} {
  const exploreNow: string[] = [];
  const planForLater: string[] = [];

  // Things to explore now
  if (areasToExplore.length > 0) {
    exploreNow.push('Review areas marked as opportunities to improve');
  }

  const toConfirmResponses = completedModules.reduce((count, module) => {
    return count + module.responses.filter(r => needsFollowUp(r.answer)).length;
  }, 0);

  if (toConfirmResponses > 0) {
    exploreNow.push('Follow up on "Unable to check" items with your team');
  }

  exploreNow.push('Identify quick wins that require minimal effort');
  exploreNow.push('Share this report with relevant stakeholders');

  // Things to plan for later
  const highPriorityCount = completedModules.reduce((count, module) => {
    return count + (module.summary?.priorityActions.filter(a => a.priority === 'high').length || 0);
  }, 0);

  if (highPriorityCount > 0) {
    planForLater.push('Schedule improvements that need budget or time');
  }

  if (completedModules.length < selectedModuleIds.length) {
    planForLater.push('Complete any modules you haven\'t reviewed yet');
  }

  if (completedModules.length === selectedModuleIds.length) {
    planForLater.push('Consider a more detailed review if needed');
  }

  planForLater.push('Set review dates to track progress');

  return { exploreNow, planForLater };
}

// Specific recommendations based on question/module context
interface RecommendationContext {
  keywords: string[];
  specificActions: string[];
  reasoning: string;
  resources: string[];
}

// Question-specific recommendations for precise, relevant guidance
// Organized by module for maintainability
const QUESTION_SPECIFIC_RECOMMENDATIONS: Record<string, {
  actions: string[];
  reasoning: string;
  resources: string[];
}> = {
  // ============================================
  // B1: PRE-VISIT INFORMATION
  // ============================================
  'B1-F-1': {
    actions: [
      'Create a dedicated accessibility page on your website',
      'Include specific details: entrance type, parking, toilets, assistance available',
      'Add photos showing accessible features and routes',
      'Describe the sensory environment (noise levels, lighting, crowds)',
      'Include contact details for accessibility enquiries',
      'Link to the accessibility page from your main navigation',
    ],
    reasoning: 'Pre-visit accessibility information allows customers with disabilities to plan their visit with confidence. Without this information, they may not know if they can access your venue.',
    resources: ['[Creating an Accessibility Page Guide]', '[Pre-visit Information Checklist]'],
  },
  'B1-F-2A': {
    actions: [
      'Check if your accessibility page is linked from the main navigation or footer',
      'Ensure accessibility info is findable within 2 clicks from the homepage',
      'Add "Accessibility" to your site search keywords',
      'Consider adding accessibility info to your Google Business Profile',
    ],
    reasoning: 'Even great accessibility information is useless if customers cannot find it. Most people will not dig through multiple pages to find what they need.',
    resources: ['[Website Navigation Best Practices]'],
  },
  'B1-F-4': {
    actions: [
      'Add a dedicated phone number or email for accessibility enquiries',
      'Offer multiple contact options: phone, email, online form, live chat',
      'Ensure contact channels are accessible (e.g., phone relay service compatible)',
      'Include a prompt inviting accessibility questions on your website',
      'Train staff to handle accessibility enquiries confidently',
    ],
    reasoning: 'Customers often have specific questions about their needs that may not be covered on your website. Easy contact channels build confidence and show you welcome enquiries.',
    resources: ['[Accessible Customer Contact Guide]'],
  },
  'B1-F-5': {
    actions: [
      'Document accurate measurements: doorway widths, corridor widths, counter heights',
      'Include photos of entrances, pathways, accessible toilets, and parking',
      'Describe surfaces (carpet, tiles, gravel) and any level changes',
      'Note the location and dimensions of accessible features',
      'Update information whenever changes are made to your venue',
    ],
    reasoning: 'Vague statements like "wheelchair accessible" are not helpful. Customers need specific details to assess whether your venue meets their particular needs.',
    resources: ['[Physical Access Documentation Checklist]'],
  },
  'B1-F-6': {
    actions: [
      'Describe typical noise levels and sources (music, crowds, machinery)',
      'Note lighting conditions: natural light, fluorescent, dimmable options',
      'Explain any strong smells (food, chemicals, perfumes)',
      'Describe visual environment: busy patterns, open spaces, enclosed areas',
      'Publish sensory maps or guides for complex venues',
    ],
    reasoning: 'Sensory information helps people with autism, sensory processing differences, migraines, and anxiety plan their visit and decide on the best time to come.',
    resources: ['[Sensory Environment Guide Template]'],
  },
  'B1-F-7': {
    actions: [
      'Offer a familiarisation visit before the main visit or event',
      'Provide a virtual tour video showing key areas and routes',
      'Send photos of the venue, staff, and key locations in advance',
      'Offer to meet customers at the entrance if requested',
      'Create a social story for your venue (especially for family attractions)',
    ],
    reasoning: 'Familiarisation visits reduce anxiety and help customers prepare for what to expect. They are particularly valuable for autistic visitors and those with anxiety.',
    resources: ['[Familiarisation Visit Guide]', '[Social Story Template]'],
  },
  'B1-F-8': {
    actions: [
      'List accessible transport options: accessible parking, drop-off zones, public transport',
      'Describe the approach from parking/drop-off to the entrance (distance, surface, gradient)',
      'Note any barriers in the "last 50 metres" (steps, gravel, slopes)',
      'Include GPS coordinates or what3words for precise navigation',
      'Provide instructions for different arrival methods',
    ],
    reasoning: 'The journey to your door is part of the customer experience. Many visits fail at the final approach due to unexpected barriers.',
    resources: ['[Transport Information Checklist]'],
  },

  // ============================================
  // B4.1: WEBSITE BASICS
  // ============================================
  'B4.1-1-1': {
    actions: [
      'Test all interactive elements (links, buttons, forms, menus) using only Tab, Shift+Tab, Enter, and arrow keys',
      'Ensure a visible focus indicator appears on every interactive element when tabbing',
      'Fix any "keyboard traps" where users cannot Tab out of a section',
      'Ensure dropdown menus can be opened with Enter and navigated with arrow keys',
      'Test the complete booking or enquiry journey using only the keyboard',
      'Ask your web developer to audit and fix any elements that require a mouse',
    ],
    reasoning: 'Keyboard access is fundamental for people who cannot use a mouse, including screen reader users, people with motor impairments, and power users. Without keyboard access, these visitors cannot navigate or use your website at all.',
    resources: ['[WebAIM Keyboard Accessibility Guide]', '[WCAG 2.1.1 Keyboard Accessible]'],
  },
  'B4.1-1-1a': {
    actions: [
      'Document which specific areas fail keyboard testing (navigation, forms, booking, etc.)',
      'Prioritise fixing keyboard issues in the booking/checkout process first',
      'Share this list with your web developer for targeted fixes',
      'Consider using an accessibility overlay tool temporarily while fixes are made',
    ],
    reasoning: 'Understanding exactly where keyboard access breaks down helps prioritise fixes. Issues in critical user journeys like booking have the highest business impact.',
    resources: ['[Keyboard Testing Checklist]'],
  },
  'B4.1-1-1b': {
    actions: [
      'Add CSS focus styles to make the focus indicator highly visible (e.g., 2px solid outline in a contrasting colour)',
      'Never use "outline: none" without providing an alternative focus style',
      'Ensure focus is visible on ALL interactive elements, not just some',
      'Use a consistent focus style across the entire website',
    ],
    reasoning: 'Without a visible focus indicator, keyboard users cannot see where they are on the page. This makes navigation nearly impossible and is one of the most common accessibility failures.',
    resources: ['[WCAG 2.4.7 Focus Visible]', '[CSS Focus Styles Examples]'],
  },
  'B4.1-1-2': {
    actions: [
      'Audit all images on key pages and add meaningful alt text that describes the image purpose',
      'For venue photos: describe what the photo shows that helps visitors plan (e.g., "Wide entrance with automatic doors and level access")',
      'For decorative images: use empty alt text (alt="") so screen readers skip them',
      'For complex images like maps or infographics: provide a longer description in nearby text',
      'Train staff who upload images to always add alt text as part of the process',
    ],
    reasoning: 'Alt text allows screen reader users to understand images they cannot see. Good alt text describes what matters about the image in context, helping visitors understand your venue and services.',
    resources: ['[WebAIM Alt Text Guide]', '[WCAG 1.1.1 Non-text Content]'],
  },
  'B4.1-1-3': {
    actions: [
      'Test text contrast using a free tool like WebAIM Contrast Checker',
      'Ensure body text has at least 4.5:1 contrast ratio against its background',
      'Check commonly missed areas: footer text, placeholder text, links, captions, navigation',
      'Avoid text over images unless using an overlay to ensure contrast',
      'Ask your designer to update the colour palette if multiple areas fail',
    ],
    reasoning: 'Good contrast is essential for people with low vision, colour blindness, or anyone viewing in bright light. Poor contrast affects up to 8% of men and makes content hard to read for everyone.',
    resources: ['[WebAIM Contrast Checker]', '[WCAG 1.4.3 Contrast Minimum]'],
  },
  'B4.1-1-4': {
    actions: [
      'Test your website at 200% and 400% zoom using browser zoom (Ctrl/Cmd + Plus)',
      'Fix any text that overlaps, gets cut off, or requires horizontal scrolling',
      'Ensure navigation menus remain usable at increased zoom levels',
      'Use responsive design techniques so content reflows rather than breaks',
      'Avoid fixed-height containers that clip text when zoomed',
    ],
    reasoning: 'Many people with low vision rely on zooming to read content. If your website breaks when zoomed, these users cannot access your information.',
    resources: ['[WCAG 1.4.4 Resize Text]', '[Responsive Design for Accessibility]'],
  },
  'B4.1-1-5': {
    actions: [
      'Test your website on actual mobile devices, not just browser resizing',
      'Ensure touch targets (buttons, links) are at least 44x44 pixels',
      'Check that all content and functionality works on mobile, including booking',
      'Ensure forms are easy to complete on mobile with appropriate keyboard types',
      'Test with screen readers on mobile (VoiceOver on iOS, TalkBack on Android)',
    ],
    reasoning: 'Many people with disabilities rely on mobile devices as their primary way to access the internet. Mobile accessibility is increasingly critical for all users.',
    resources: ['[Mobile Accessibility Guidelines]', '[WCAG 2.5.5 Target Size]'],
  },
  'B4.1-1-6': {
    actions: [
      'Ensure all auto-playing content can be paused, stopped, or hidden',
      'Provide visible controls for carousels, sliders, and video players',
      'Avoid content that flashes more than 3 times per second',
      'Give users control over any moving or updating content',
      'Consider making auto-play opt-in rather than default',
    ],
    reasoning: 'Automatic content can be disorienting for screen reader users and distracting for people with attention difficulties. Flashing content can trigger seizures in people with photosensitive epilepsy.',
    resources: ['[WCAG 2.2.2 Pause, Stop, Hide]', '[WCAG 2.3.1 Three Flashes]'],
  },
  'B4.1-1-7': {
    actions: [
      'Audit all PDFs on your website for accessibility',
      'Ensure PDFs have proper heading structure, alt text, and reading order',
      'Provide HTML alternatives for key PDF documents',
      'Use accessible PDF creation tools (Adobe Acrobat Pro, Microsoft Word export)',
      'Test PDFs with a screen reader before publishing',
    ],
    reasoning: 'PDFs are often inaccessible barriers. Many screen readers struggle with poorly structured PDFs, locking out blind and low vision users from important information.',
    resources: ['[PDF Accessibility Guide]', '[Creating Accessible PDFs]'],
  },
  'B4.1-1-8': {
    actions: [
      'Run automated accessibility tests using free tools (WAVE, axe, Lighthouse)',
      'Fix all critical and serious issues identified by automated tools',
      'Conduct manual testing for issues automation cannot detect',
      'Schedule regular accessibility audits (at least annually)',
      'Include accessibility in your website update processes',
    ],
    reasoning: 'Automated tools catch about 30-40% of accessibility issues quickly and cheaply. They are a good starting point but should be combined with manual testing.',
    resources: ['[WAVE Web Accessibility Tool]', '[axe Browser Extension]'],
  },

  // ============================================
  // B4.2: BOOKING SYSTEMS AND FORMS
  // ============================================
  'B4.2-1-1': {
    actions: [
      'Test your booking form using only a keyboard (Tab, Enter, arrow keys)',
      'Ensure all form fields have visible labels (not just placeholders)',
      'Add clear error messages that explain how to fix problems',
      'Ensure date pickers and custom controls are keyboard accessible',
      'Test the entire booking journey with a screen reader',
    ],
    reasoning: 'If customers cannot complete a booking independently, they cannot access your services. Inaccessible booking forms are a significant business barrier.',
    resources: ['[Accessible Forms Guide]', '[WCAG 3.3 Input Assistance]'],
  },
  'B4.2-1-2': {
    actions: [
      'Add a field for customers to note accessibility requirements during booking',
      'Make the accessibility field visible and easy to find (not hidden in "notes")',
      'Follow up on accessibility requests before the visit',
      'Train staff to check for and respond to accessibility requests',
      'Store accessibility preferences for returning customers (with consent)',
    ],
    reasoning: 'Capturing accessibility requirements at booking allows you to prepare and ensures customers get the support they need on arrival.',
    resources: ['[Accessibility Requirements Capture Guide]'],
  },

  // ============================================
  // B4.3: VIDEO AND SOCIAL MEDIA
  // ============================================
  'B4.3-1-1': {
    actions: [
      'Add captions to all video content (auto-captions are a start but should be edited)',
      'Provide audio descriptions for videos where visual content is not described in the main audio',
      'Upload caption files (SRT/VTT) rather than burning captions into videos',
      'Ensure captions are accurate, synchronised, and identify speakers',
      'Include transcripts for audio-only content like podcasts',
    ],
    reasoning: 'Captions are essential for deaf and hard of hearing viewers, and also help people watching in noisy environments or without sound. Audio descriptions make visual content accessible to blind viewers.',
    resources: ['[Video Captioning Guide]', '[Audio Description Basics]'],
  },
  'B4.3-1-2': {
    actions: [
      'Add alt text to images on social media posts',
      'Use camelCase or underscores in hashtags (#AccessibleTourism not #accessibletourism)',
      'Limit emoji use and avoid using emoji as bullet points',
      'Add captions to video content on social platforms',
      'Avoid posting text as images without providing the text in the post',
    ],
    reasoning: 'Social media is increasingly important for customer engagement. Accessible social media reaches more customers and demonstrates your commitment to inclusion.',
    resources: ['[Accessible Social Media Guide]'],
  },
  'B4.3-1-3': {
    actions: [
      'Review video content for flashing or strobing effects',
      'Add seizure warnings to content that contains necessary flashing',
      'Avoid flashing content where possible in favour of alternatives',
      'Test videos against photosensitive epilepsy guidelines',
    ],
    reasoning: 'Flashing content can trigger seizures in people with photosensitive epilepsy. This is a serious safety issue, not just an inconvenience.',
    resources: ['[WCAG 2.3.1 Seizure Prevention]'],
  },
  // Pulse Check questions for B4.3
  'B4.3-PC-1': {
    actions: [
      'Add captions to all video content - this is the single most important accessibility feature for video',
      'Start with auto-generated captions from YouTube/Facebook, then review and correct errors',
      'Ensure captions include speaker identification when multiple people speak',
      'Add sound descriptions for important non-speech audio [music playing], [applause]',
      'Upload caption files (SRT/VTT) for better accuracy and control',
    ],
    reasoning: 'Captions are essential for deaf and hard of hearing viewers. They also benefit people in noisy environments, non-native speakers, and those who prefer to read. If you create video content, captions should be a priority.',
    resources: ['[Video Captioning Guide]', '[Caption File Formats]'],
  },
  'B4.3-PC-2': {
    actions: [
      'Review videos to identify where visual content is not described in the audio',
      'Add audio descriptions or integrate descriptions into the main narration',
      'Prioritise videos showing your venue, products, or demonstrations',
      'Consider creating separate audio-described versions for complex visual content',
    ],
    reasoning: 'Audio descriptions help blind and low vision viewers understand what is happening on screen. They are most important when visual content carries meaning not conveyed in speech.',
    resources: ['[Audio Description Basics]'],
  },
  'B4.3-PC-3': {
    actions: [
      'Add alt text or image descriptions to all social media images',
      'Use platform-specific alt text features (Instagram, Facebook, Twitter/X, LinkedIn)',
      'Or write image descriptions in captions starting with [ID:]',
      'Focus on what the image communicates, not every visual detail',
    ],
    reasoning: 'Alt text and image descriptions make your social media images accessible to screen reader users. Either method works - choose the one that fits your content.',
    resources: ['[Accessible Social Media Guide]'],
  },

  // ============================================
  // A1: ARRIVAL, PARKING AND DROP-OFF
  // ============================================
  'A1-F-1': {
    actions: [
      'Provide designated accessible parking spaces meeting Australian Standards',
      'Locate accessible parking closest to the accessible entrance (within 30m)',
      'Ensure spaces are minimum 2400mm wide with adequate transfer space',
      'Install clear signage with international accessibility symbol',
      'Paint ground markings in contrasting colour',
    ],
    reasoning: 'Accessible parking is often the starting point for a visit. Spaces that are too far, too narrow, or poorly marked create immediate barriers.',
    resources: ['[AS2890.6 Accessible Parking]', '[Parking Space Requirements]'],
  },
  'A1-F-2': {
    actions: [
      'Create a designated drop-off zone close to the accessible entrance',
      'Ensure the drop-off area has level access to the footpath',
      'Install a kerb ramp or level transition at the drop-off point',
      'Provide shelter at the drop-off area if possible',
      'Add signage directing to the drop-off zone',
    ],
    reasoning: 'Many customers with disabilities use taxis, rideshare, or are dropped off by others. A safe drop-off zone close to the entrance is essential.',
    resources: ['[Drop-off Zone Design Guide]'],
  },
  'A1-F-3': {
    actions: [
      'Ensure the path from parking to entrance is step-free',
      'Check path surface is firm, level, and non-slip',
      'Remove or clearly mark any obstacles (poles, signs, garden beds)',
      'Provide adequate lighting along the path (minimum 20 lux)',
      'Install tactile ground surface indicators at hazards',
    ],
    reasoning: 'The path from parking to entrance is part of the customer journey. Uneven surfaces, obstacles, or poor lighting create safety risks.',
    resources: ['[Accessible Path Design]', '[AS1428.1 Path Requirements]'],
  },
  'A1-F-4': {
    actions: [
      'Measure and document path gradient (maximum 1:20 for paths, 1:14 for ramps)',
      'Install handrails on ramps with gradient steeper than 1:20',
      'Ensure paths are minimum 1200mm wide (1800mm for passing)',
      'Add rest areas on long paths (every 60m maximum)',
    ],
    reasoning: 'Steep gradients are difficult or impossible for many wheelchair users and people with mobility impairments. Gradients above 1:8 are not compliant.',
    resources: ['[Gradient Requirements AS1428.1]'],
  },

  // ============================================
  // A2: ENTRY AND DOORS
  // ============================================
  'A2-F-1': {
    actions: [
      'Provide step-free access to the main entrance',
      'If main entrance has steps, provide a clearly signed accessible alternative',
      'Ensure accessible entrance is dignified (not via back door or loading dock)',
      'Keep accessible entrance available during all opening hours',
    ],
    reasoning: 'Step-free access is fundamental. Without it, wheelchair users, people with prams, and many others cannot enter your venue.',
    resources: ['[Accessible Entrance Design]'],
  },
  'A2-F-2': {
    actions: [
      'Measure doorway clear opening width (minimum 850mm required)',
      'Check for obstructions that reduce effective doorway width',
      'Ensure double doors have at least one leaf that provides 850mm clear',
      'Consider widening doorways if they do not meet requirements',
    ],
    reasoning: 'Standard wheelchair width is about 700mm, but users need clearance for hands and to navigate. Doorways under 850mm create barriers.',
    resources: ['[AS1428.1 Door Requirements]'],
  },
  'A2-F-3': {
    actions: [
      'Measure door opening force (maximum 20 Newtons for hinged doors)',
      'Install automatic doors if force cannot be reduced',
      'Consider power-assisted or low-force door closers',
      'Ensure automatic doors have adequate opening time and sensor coverage',
    ],
    reasoning: 'Heavy doors are barriers for people with reduced strength, including many elderly people, people with arthritis, and wheelchair users.',
    resources: ['[Door Force Requirements]', '[Automatic Door Guide]'],
  },
  'A2-F-4': {
    actions: [
      'Install lever-style door handles (not knobs)',
      'Position handles at 900-1100mm height',
      'Ensure handles contrast visually with the door',
      'Check handles can be operated with one hand without tight grip',
    ],
    reasoning: 'Round door knobs require grip strength and wrist rotation that many people cannot achieve. Lever handles are universally easier to use.',
    resources: ['[Accessible Door Hardware]'],
  },
  'A2-F-5': {
    actions: [
      'Install clear signage at the accessible entrance',
      'Use the international accessibility symbol',
      'Ensure signage is visible from the approach and parking areas',
      'Add directional signage if accessible entrance differs from main entrance',
    ],
    reasoning: 'Clear signage helps customers find the accessible entrance quickly, reducing confusion and frustration.',
    resources: ['[Accessibility Signage Guide]'],
  },

  // ============================================
  // A3a: PATHS AND AISLES
  // ============================================
  'A3a-1-1': {
    actions: [
      'Measure aisle widths throughout your venue (minimum 1000mm, ideally 1200mm)',
      'Ensure clear turning space at key points (1500mm x 1500mm minimum)',
      'Remove or relocate any obstacles blocking pathways',
      'Keep paths consistently wide rather than having narrow pinch points',
    ],
    reasoning: 'Narrow aisles prevent wheelchair users from navigating independently and make the venue difficult for many others including parents with prams.',
    resources: ['[Aisle Width Requirements]', '[AS1428.1 Circulation Spaces]'],
  },
  'A3a-1-2': {
    actions: [
      'Check floor surfaces are firm, level, and slip-resistant',
      'Fix any uneven surfaces, loose carpets, or damaged flooring',
      'Ensure transitions between floor surfaces are smooth (maximum 5mm)',
      'Avoid deep-pile carpet, loose rugs, or gravel surfaces',
    ],
    reasoning: 'Uneven or slippery floors are trip hazards for everyone and particularly difficult for wheelchair users and people with mobility aids.',
    resources: ['[Floor Surface Requirements]'],
  },
  'A3a-1-3': {
    actions: [
      'Identify and remove unnecessary obstacles from pathways',
      'Relocate any displays, furniture, or equipment blocking paths',
      'Ensure chairs and moveable items are kept clear of circulation routes',
      'Train staff to maintain clear pathways throughout the day',
    ],
    reasoning: 'Obstacles in pathways create barriers and safety risks. What seems like minor clutter can completely block access for some customers.',
    resources: ['[Pathway Obstruction Checklist]'],
  },

  // ============================================
  // A3b: QUEUES AND BUSY TIMES
  // ============================================
  'A3b-1-1': {
    actions: [
      'Offer priority queuing for people with disabilities',
      'Provide seating in or near queue areas for people who cannot stand',
      'Train staff to offer queue assistance proactively',
      'Consider separate accessible queuing during busy periods',
    ],
    reasoning: 'Long periods of standing are impossible for many people with disabilities. Priority queuing is a reasonable adjustment that costs nothing to implement.',
    resources: ['[Queue Management for Accessibility]'],
  },
  'A3b-1-2': {
    actions: [
      'Publish expected busy times on your website',
      'Offer quieter times for customers who need them',
      'Consider dedicated "relaxed" sessions with reduced crowds and sensory input',
      'Allow pre-booking to avoid queue waiting',
    ],
    reasoning: 'Crowded environments can be overwhelming for autistic people, anxiety sufferers, and many others. Quieter options expand your customer base.',
    resources: ['[Relaxed Sessions Guide]'],
  },

  // ============================================
  // A4: SEATING, FURNITURE AND LAYOUT
  // ============================================
  'A4-1-1': {
    actions: [
      'Provide a range of seating options: with and without arms, different heights',
      'Ensure some seating has firm seats and backs (not low sofas)',
      'Position accessible seating on main pathways, not in corners',
      'Provide companion seating next to wheelchair spaces',
    ],
    reasoning: 'Seating needs vary widely. People with mobility impairments often need firm, higher seats with arms to stand up independently.',
    resources: ['[Accessible Seating Options Guide]'],
  },
  'A4-1-2': {
    actions: [
      'Check counter and table heights (750-850mm for wheelchair access)',
      'Ensure knee clearance under counters (minimum 700mm high, 500mm deep)',
      'Lower at least one section of high counters to accessible height',
      'Provide portable lowered surfaces if fixed counters cannot be modified',
    ],
    reasoning: 'High counters make transactions difficult or impossible for wheelchair users and people of short stature. A lowered section costs little but makes a big difference.',
    resources: ['[Counter Height Requirements]'],
  },
  'A4-1-3': {
    actions: [
      'Designate wheelchair spaces in key areas (dining, events, waiting areas)',
      'Ensure wheelchair spaces have clear floor space (minimum 900mm x 1400mm)',
      'Provide companion seating adjacent to wheelchair spaces',
      'Do not fill wheelchair spaces with removable chairs',
    ],
    reasoning: 'Wheelchair users need designated spaces that are not obstructed. "We can move a chair" is not the same as having a proper wheelchair space.',
    resources: ['[Wheelchair Space Requirements]'],
  },

  // ============================================
  // A5: TOILETS AND AMENITIES
  // ============================================
  'A5-1-1': {
    actions: [
      'Ensure accessible toilet meets Australian Standards dimensions',
      'Minimum dimensions: 1900mm x 2300mm (or 1600mm x 2300mm with specific layout)',
      'Install grab rails at correct positions and heights',
      'Ensure door opens outward or is a sliding door with 850mm clear opening',
    ],
    reasoning: 'Accessible toilets are essential. A toilet that does not meet standards may be unusable for many wheelchair users.',
    resources: ['[AS1428.1 Accessible Toilet Requirements]', '[Toilet Layout Diagrams]'],
  },
  'A5-1-2': {
    actions: [
      'Keep accessible toilet clear of storage, bins, and cleaning equipment',
      'Check daily that toilet is clean, stocked, and unobstructed',
      'Ensure toilet is not locked or "staff only"',
      'Repair any damaged fixtures, grab rails, or emergency cords promptly',
    ],
    reasoning: 'An accessible toilet full of mops and boxes is not accessible. Regular checks ensure the facility remains usable.',
    resources: ['[Accessible Toilet Maintenance Checklist]'],
  },
  'A5-1-3': {
    actions: [
      'Install an emergency pull cord reaching to floor level',
      'Ensure alarm is connected and monitored',
      'Test emergency alarm regularly',
      'Train staff on emergency toilet alarm response procedures',
    ],
    reasoning: 'Emergency cords save lives. Someone who falls in an accessible toilet may not be able to reach a cord mounted at wall height.',
    resources: ['[Emergency Alarm Requirements]'],
  },
  'A5-1-4': {
    actions: [
      'Provide a Changing Places facility if your venue is large or destination',
      'At minimum, provide adult change table in accessible toilet',
      'Ensure change table is sturdy and weight-rated for adults',
      'Provide hoist or ceiling track if possible',
    ],
    reasoning: 'Standard accessible toilets do not meet the needs of people who require assistance with personal care. Changing Places facilities are increasingly expected.',
    resources: ['[Changing Places Australia]', '[Adult Change Facility Guide]'],
  },

  // ============================================
  // A6: LIGHTING, SOUND AND SENSORY ENVIRONMENT
  // ============================================
  'A6-1-1': {
    actions: [
      'Ensure adequate lighting levels throughout (minimum 150 lux in circulation, 300 lux in task areas)',
      'Avoid dark areas that create contrast problems',
      'Ensure lighting is even without harsh shadows',
      'Check lighting at different times of day',
    ],
    reasoning: 'Adequate lighting helps people with low vision navigate safely and read signs and menus. It also improves safety for everyone.',
    resources: ['[Lighting Level Requirements]', '[AS1680 Interior Lighting]'],
  },
  'A6-1-2': {
    actions: [
      'Reduce glare from windows, reflective surfaces, and direct lighting',
      'Position lighting to avoid shining directly into eyes',
      'Use matte rather than glossy surfaces where practical',
      'Provide blinds or shading for windows',
    ],
    reasoning: 'Glare is particularly problematic for people with certain eye conditions, migraines, and autism. It can make spaces uncomfortable or unusable.',
    resources: ['[Glare Reduction Strategies]'],
  },
  'A6-1-3': {
    actions: [
      'Measure and manage background noise levels',
      'Add acoustic treatment to reduce echo and reverberation',
      'Position noisy equipment away from customer areas',
      'Offer quieter seating areas or times',
    ],
    reasoning: 'High noise levels make communication difficult for everyone and particularly for hearing aid users and people with auditory processing difficulties.',
    resources: ['[Acoustic Accessibility Guide]'],
  },
  'A6-1-4': {
    actions: [
      'Install a hearing loop system at service counters and key areas',
      'Display the hearing loop symbol where systems are installed',
      'Test hearing loop coverage regularly',
      'Train staff to use and troubleshoot hearing loop systems',
    ],
    reasoning: 'Hearing loops connect directly to hearing aids, providing clear audio without background noise. They are essential for many hearing aid users.',
    resources: ['[Hearing Loop Installation Guide]', '[Loop System Testing]'],
  },
  'A6-1-5': {
    actions: [
      'Create a designated quiet space or room',
      'Reduce sensory input in the quiet space: dim lighting, minimal decoration',
      'Make the quiet space easy to find and access',
      'Communicate the availability of quiet spaces to customers',
    ],
    reasoning: 'Quiet spaces provide essential respite for autistic people, those with sensory processing differences, and anyone experiencing overwhelm.',
    resources: ['[Quiet Space Design Guide]'],
  },

  // ============================================
  // A6a: EQUIPMENT AND RESOURCES
  // ============================================
  'A6a-F-1': {
    actions: [
      'Provide wheelchairs for customer use if appropriate for your venue',
      'Offer mobility aids such as walking frames or walking sticks',
      'Provide sensory kits with items like ear plugs, sunglasses, fidget tools',
      'Ensure equipment is clean, well-maintained, and readily available',
    ],
    reasoning: 'Equipment loans enable customers who might otherwise struggle to access your venue independently. They show you have considered customer needs.',
    resources: ['[Equipment Loan Program Guide]'],
  },
  'A6a-F-2': {
    actions: [
      'Advertise available equipment on your website and at reception',
      'Train staff to offer equipment proactively',
      'Include equipment availability in pre-visit information',
      'Consider whether equipment can be pre-booked',
    ],
    reasoning: 'Equipment is only useful if customers know about it. Many people are hesitant to ask, so proactive communication is important.',
    resources: ['[Equipment Communication Guide]'],
  },

  // ============================================
  // B2: SIGNAGE AND WAYFINDING
  // ============================================
  'B2-1-1': {
    actions: [
      'Audit all signage for readability: font size, contrast, positioning',
      'Use clear sans-serif fonts (Arial, Helvetica) at appropriate sizes',
      'Ensure minimum 30% luminance contrast between text and background',
      'Position signs at consistent heights throughout venue',
    ],
    reasoning: 'Clear signage helps everyone navigate independently. Poor signage creates confusion and can make customers dependent on staff assistance.',
    resources: ['[Signage Design Guidelines]', '[AS1428.1 Signage Requirements]'],
  },
  'B2-1-2': {
    actions: [
      'Add Braille to permanent room identification signs',
      'Install tactile signs at key decision points',
      'Ensure Braille is correctly positioned below printed text',
      'Use tactile ground surface indicators at key navigation points',
    ],
    reasoning: 'Braille and tactile signage enables independent navigation for blind and low vision customers. It is required on permanent room signs.',
    resources: ['[Tactile Signage Requirements]', '[Braille Signage Guide]'],
  },
  'B2-1-3': {
    actions: [
      'Create a clear wayfinding strategy with consistent signage throughout',
      'Position directional signs at key decision points',
      'Use landmarks and colour coding to aid navigation',
      'Provide maps in accessible formats (large print, tactile, audio)',
    ],
    reasoning: 'Consistent wayfinding reduces anxiety and enables independent navigation. This benefits all customers, especially those with cognitive disabilities.',
    resources: ['[Wayfinding Strategy Guide]'],
  },

  // ============================================
  // B3: MENUS AND PRINTED MATERIALS
  // ============================================
  'B3-1-1': {
    actions: [
      'Provide large print menus (minimum 18pt, ideally 24pt)',
      'Use high contrast colours (dark text on light background)',
      'Use clear, simple fonts without decorative elements',
      'Offer menus in digital format accessible by screen readers',
    ],
    reasoning: 'Standard menus with small decorative fonts are difficult or impossible to read for many customers with low vision.',
    resources: ['[Large Print Guidelines]', '[Accessible Menu Design]'],
  },
  'B3-1-2': {
    actions: [
      'Offer Braille menus on request or have them readily available',
      'Keep Braille menus up to date with current offerings',
      'Train staff to know where Braille materials are located',
      'Partner with a Braille transcription service for updates',
    ],
    reasoning: 'Braille menus enable independent ordering for blind customers without requiring staff to read options aloud.',
    resources: ['[Braille Menu Services]'],
  },
  'B3-1-3': {
    actions: [
      'Create Easy Read versions of key information',
      'Use simple words, short sentences, and supporting images',
      'Test Easy Read materials with the intended audience',
      'Make Easy Read versions available on request',
    ],
    reasoning: 'Easy Read materials help people with intellectual disabilities, learning difficulties, and those for whom English is not their first language.',
    resources: ['[Easy Read Guidelines]', '[Easy Read Style Guide]'],
  },

  // ============================================
  // C1: CUSTOMER SERVICE AND STAFF CONFIDENCE
  // ============================================
  'C1-F-1': {
    actions: [
      'Provide disability awareness training for all customer-facing staff',
      'Include practical scenarios and role-play in training',
      'Ensure training covers a range of disabilities, not just mobility',
      'Include people with lived experience of disability in training delivery',
      'Refresh training annually and when significant changes occur',
    ],
    reasoning: 'Staff attitudes can make or break the customer experience. Well-trained staff create welcoming environments; poorly trained staff create barriers.',
    resources: ['[Disability Awareness Training Resources]', '[Training Provider Directory]'],
  },
  'C1-F-2': {
    actions: [
      'Train staff to offer assistance without making assumptions',
      'Use "How can I help?" rather than assuming what is needed',
      'Train staff to ask before providing assistance',
      'Ensure staff know not to touch mobility aids without permission',
    ],
    reasoning: 'Well-meaning but inappropriate assistance can be unhelpful or offensive. The key principle is to ask, not assume.',
    resources: ['[Offering Assistance Guidelines]'],
  },
  'C1-F-3': {
    actions: [
      'Ensure all staff know the accessibility features of your venue',
      'Create a quick reference guide to accessibility features',
      'Include accessibility in staff induction programs',
      'Update staff when accessibility features change',
    ],
    reasoning: 'Staff who do not know where the accessible toilet is or how to activate the hearing loop cannot help customers who need these features.',
    resources: ['[Staff Accessibility Knowledge Checklist]'],
  },
  'C1-F-4': {
    actions: [
      'Train staff on assistance animal rights and responsibilities',
      'Develop a clear policy welcoming assistance animals',
      'Display "Assistance Animals Welcome" signage',
      'Ensure staff know they cannot request proof of disability',
    ],
    reasoning: 'Assistance animals have legal rights of access. Staff who question or refuse assistance animals create discrimination issues.',
    resources: ['[Assistance Animal Guidelines]', '[Disability Discrimination Act]'],
  },
  'C1-F-5': {
    actions: [
      'Establish clear procedures for handling accessibility complaints',
      'Train staff on complaint handling and escalation',
      'Respond to accessibility complaints promptly and seriously',
      'Use complaints as opportunities to improve',
    ],
    reasoning: 'How you handle complaints matters as much as avoiding them. A well-handled complaint can create a loyal customer; a poorly handled one creates negative publicity.',
    resources: ['[Complaint Handling Guide]'],
  },

  // ============================================
  // C2: BOOKINGS, PAYMENTS AND FLEXIBILITY
  // ============================================
  'C2-1-1': {
    actions: [
      'Offer multiple booking methods: online, phone, email, in-person',
      'Ensure at least one booking method is fully accessible',
      'Allow customers to book accessibility requirements in advance',
      'Follow up on accessibility requirements before arrival',
    ],
    reasoning: 'Different customers have different access needs for booking. Offering only one method may exclude some customers.',
    resources: ['[Multi-channel Booking Guide]'],
  },
  'C2-1-2': {
    actions: [
      'Offer multiple payment methods including contactless',
      'Ensure payment terminals are at accessible heights',
      'Position payment terminals where customers can reach them',
      'Allow extra time for payment without rushing customers',
    ],
    reasoning: 'Payment should not be a barrier. Terminals positioned out of reach or complex payment processes exclude some customers.',
    resources: ['[Accessible Payment Guide]'],
  },
  'C2-1-3': {
    actions: [
      'Register as a Companion Card affiliate',
      'Display Companion Card acceptance on your website and at entrance',
      'Train staff on Companion Card procedures',
      'Ensure booking systems can record Companion Card requirements',
    ],
    reasoning: 'Companion Card provides free entry for carers accompanying people with disabilities. Not accepting it creates financial barriers.',
    resources: ['[Companion Card Australia]', '[Affiliate Registration]'],
  },

  // ============================================
  // A7: SAFETY AND EMERGENCIES
  // ============================================
  'A7-1-1': {
    actions: [
      'Develop emergency procedures that include people with disabilities',
      'Identify evacuation routes accessible to wheelchair users',
      'Designate and sign evacuation refuges or safe waiting areas',
      'Train staff on accessible emergency procedures',
    ],
    reasoning: 'Standard emergency procedures may not work for people with disabilities. Without planning, these customers may be at greater risk.',
    resources: ['[Emergency Evacuation Planning Guide]', '[AS3745 Emergency Planning]'],
  },
  'A7-1-2': {
    actions: [
      'Install visual fire alarms (flashing beacons) in all public areas',
      'Include visual alarms in accessible toilets and private spaces',
      'Ensure visual alarms are visible from all areas',
      'Test visual alarms as part of regular fire drills',
    ],
    reasoning: 'Audible-only alarms do not alert deaf and hard of hearing people to emergencies. Visual alarms are essential for safety.',
    resources: ['[Visual Alarm Requirements]', '[AS1670.4 Fire Detection]'],
  },
  'A7-1-3': {
    actions: [
      'Create Personal Emergency Evacuation Plans (PEEPs) for staff with disabilities',
      'Offer PEEPs to regular visitors or members with disabilities',
      'Train evacuation wardens on assisting people with disabilities',
      'Practice evacuation procedures with people with disabilities',
    ],
    reasoning: 'Personal emergency plans ensure individuals get appropriate assistance during evacuation rather than being left behind or assisted incorrectly.',
    resources: ['[PEEP Template and Guide]'],
  },
  'A7-1-4': {
    actions: [
      'Provide evacuation chairs at stair locations in multi-storey buildings',
      'Train staff on evacuation chair operation',
      'Ensure evacuation chairs are regularly maintained',
      'Identify who is responsible for assisting during evacuations',
    ],
    reasoning: 'Wheelchair users and others who cannot use stairs need alternative evacuation methods. Evacuation chairs or refuges provide this.',
    resources: ['[Evacuation Chair Training]'],
  },

  // ============================================
  // C3: FEEDBACK AND REVIEWS
  // ============================================
  'C3-F-1': {
    actions: [
      'Create accessible channels for feedback (online, email, phone)',
      'Ensure feedback forms are accessible to screen readers',
      'Actively invite feedback on accessibility specifically',
      'Respond to accessibility feedback promptly',
    ],
    reasoning: 'Feedback helps you improve. If feedback channels are inaccessible, you will not hear from the customers who have the most relevant insights.',
    resources: ['[Accessible Feedback Systems Guide]'],
  },
  'C3-F-2': {
    actions: [
      'Monitor reviews on Google, TripAdvisor, and social media',
      'Respond to accessibility-related reviews professionally',
      'Use negative feedback as improvement opportunities',
      'Thank reviewers who highlight accessibility features',
    ],
    reasoning: 'Online reviews influence other customers decisions. How you respond to accessibility feedback signals your commitment to inclusion.',
    resources: ['[Review Response Guidelines]'],
  },

  // ============================================
  // C4: STAYING CONNECTED
  // ============================================
  'C4-F-1': {
    actions: [
      'Offer email newsletters in accessible HTML format',
      'Provide text alternatives to any image-based content',
      'Test newsletters with screen readers before sending',
      'Allow subscribers to choose their preferred format',
    ],
    reasoning: 'Inaccessible email marketing excludes customers and can violate accessibility requirements for digital communications.',
    resources: ['[Accessible Email Design Guide]'],
  },
  'C4-F-2': {
    actions: [
      'Capture communication preferences including accessibility needs',
      'Offer large print or Braille correspondence where requested',
      'Store accessibility preferences for future communications',
      'Respect customer preferences consistently',
    ],
    reasoning: 'Remembering customer preferences shows you value them as individuals and avoids them having to repeat their needs every time.',
    resources: ['[Customer Preference Management]'],
  },

  // ============================================
  // P1: POLICY, PROCUREMENT AND INCLUSION
  // ============================================
  'P1-F-1': {
    actions: [
      'Develop a formal accessibility policy',
      'Publish the policy on your website',
      'Communicate the policy to all staff',
      'Review and update the policy annually',
    ],
    reasoning: 'A formal policy demonstrates commitment and creates accountability. It guides staff behaviour and decision-making.',
    resources: ['[Accessibility Policy Template]'],
  },
  'P1-F-2': {
    actions: [
      'Create a Disability Inclusion Action Plan (DIAP)',
      'Include measurable goals and timeframes',
      'Assign responsibility for each action',
      'Report on progress publicly',
    ],
    reasoning: 'A DIAP turns good intentions into action. It provides a roadmap for improvement and creates accountability.',
    resources: ['[DIAP Development Guide]', '[DIAP Examples]'],
  },
  'P1-F-3': {
    actions: [
      'Include accessibility requirements in procurement decisions',
      'Require suppliers to demonstrate accessibility compliance',
      'Add accessibility clauses to contracts',
      'Audit new purchases for accessibility before deployment',
    ],
    reasoning: 'Procurement decisions affect accessibility. Buying inaccessible products or services creates barriers that are costly to fix later.',
    resources: ['[Accessible Procurement Guide]'],
  },
  'P1-F-4': {
    actions: [
      'Engage people with disabilities in planning and decision-making',
      'Create a disability advisory group or consult regularly',
      'Pay people with disabilities for their expertise',
      'Include accessibility in customer research activities',
    ],
    reasoning: 'Nothing about us without us. People with disabilities are the experts on their own needs and should be involved in decisions that affect them.',
    resources: ['[Disability Consultation Guide]'],
  },

  // ============================================
  // P2: EMPLOYING PEOPLE WITH DISABILITY
  // ============================================
  'P2-F-1': {
    actions: [
      'Audit your recruitment process for accessibility barriers',
      'Ensure job ads are accessible and highlight your commitment to inclusion',
      'Offer alternative application methods (phone, email, in-person)',
      'Train hiring managers on inclusive recruitment',
    ],
    reasoning: 'Inaccessible recruitment excludes talented candidates with disabilities. Accessible hiring expands your talent pool.',
    resources: ['[Inclusive Recruitment Guide]', '[JobAccess Employer Toolkit]'],
  },
  'P2-F-2': {
    actions: [
      'Provide reasonable workplace adjustments for employees with disabilities',
      'Create a process for requesting and implementing adjustments',
      'Explore Employment Assistance Fund (EAF) for adjustment costs',
      'Review adjustments regularly and when circumstances change',
    ],
    reasoning: 'Workplace adjustments enable people with disabilities to work effectively. Many adjustments are free or low-cost.',
    resources: ['[JobAccess Employment Assistance Fund]', '[Workplace Adjustment Guide]'],
  },
  'P2-F-3': {
    actions: [
      'Set targets for employing people with disabilities',
      'Partner with disability employment services',
      'Create internship or traineeship programs',
      'Track and report on disability employment metrics',
    ],
    reasoning: 'People with disabilities face significant barriers to employment. Proactive efforts are needed to achieve representative workforces.',
    resources: ['[Disability Employment Services]', '[Employment Target Setting]'],
  },

  // ============================================
  // P3: STAFF TRAINING AND AWARENESS
  // ============================================
  'P3-F-1': {
    actions: [
      'Include disability awareness in staff induction programs',
      'Make disability awareness training mandatory for customer-facing roles',
      'Provide refresher training annually',
      'Track training completion rates',
    ],
    reasoning: 'Induction is the best time to establish expectations. Making training mandatory ensures consistent service quality.',
    resources: ['[Training Program Development]'],
  },
  'P3-F-2': {
    actions: [
      'Use trainers with lived experience of disability',
      'Include practical exercises and scenarios',
      'Cover a range of disabilities, not just mobility',
      'Evaluate training effectiveness through feedback and observation',
    ],
    reasoning: 'Effective training changes behaviour. Lived experience trainers bring authenticity and real-world insights.',
    resources: ['[Disability Awareness Training Providers]'],
  },
  'P3-F-3': {
    actions: [
      'Develop accessibility champions in each team or location',
      'Provide additional training for champions',
      'Give champions time and support to fulfil the role',
      'Connect champions across the organisation',
    ],
    reasoning: 'Champions embed accessibility in day-to-day operations and maintain momentum between formal training sessions.',
    resources: ['[Accessibility Champion Program Guide]'],
  },

  // ============================================
  // P4: ACCESSIBLE PROCUREMENT
  // ============================================
  'P4-F-1': {
    actions: [
      'Include accessibility in procurement policies and procedures',
      'Develop accessibility requirements for common purchase categories',
      'Weight accessibility in evaluation criteria',
      'Require accessibility statements from suppliers',
    ],
    reasoning: 'Procurement decisions have long-term accessibility impacts. It is much cheaper to buy accessible products than to retrofit later.',
    resources: ['[Accessible Procurement Policy Template]'],
  },
  'P4-F-2': {
    actions: [
      'Test products for accessibility before purchase',
      'Require accessibility documentation from vendors',
      'Include accessibility warranties in contracts',
      'Plan for ongoing accessibility updates and support',
    ],
    reasoning: 'Vendor claims about accessibility are often overstated. Testing and documentation requirements ensure you get what you pay for.',
    resources: ['[Product Accessibility Testing Guide]'],
  },

  // ============================================
  // P5: CONTINUOUS IMPROVEMENT AND REPORTING
  // ============================================
  'P5-F-1': {
    actions: [
      'Set accessibility improvement targets',
      'Measure progress against targets regularly',
      'Report on accessibility in annual reports or sustainability reports',
      'Benchmark against industry standards and competitors',
    ],
    reasoning: 'What gets measured gets managed. Reporting creates accountability and demonstrates commitment to stakeholders.',
    resources: ['[Accessibility Reporting Guide]'],
  },
  'P5-F-2': {
    actions: [
      'Conduct regular accessibility audits (annually or more frequently)',
      'Include both physical and digital accessibility',
      'Act on audit findings with prioritised action plans',
      'Track completion of audit recommendations',
    ],
    reasoning: 'Regular audits identify issues before customers do. They also ensure improvements are maintained over time.',
    resources: ['[Accessibility Audit Framework]'],
  },
  'P5-F-3': {
    actions: [
      'Establish accessibility governance at senior level',
      'Include accessibility in business planning and budgeting',
      'Create accessibility KPIs for relevant roles',
      'Review accessibility performance in executive meetings',
    ],
    reasoning: 'Accessibility requires ongoing commitment and resources. Senior governance ensures it remains a priority.',
    resources: ['[Accessibility Governance Model]'],
  },
};

const RECOMMENDATION_CONTEXTS: RecommendationContext[] = [
  // Pre-visit information
  {
    keywords: ['pre-visit', 'website', 'accessibility information', 'online', 'accessibility page'],
    specificActions: [
      'Include specific measurements: doorway widths, ramp gradients, lift dimensions, and accessible parking space sizes',
      'Add high-quality photos or videos showing accessible features, entrances, and pathways',
      'Include clear contact information for accessibility enquiries (phone, email, and operating hours)',
      'Provide a map or directions to accessible entrances and parking',
      'List available accessibility equipment (wheelchairs, hearing loops, large print)',
      'Describe sensory environment (lighting, noise levels, crowd expectations)',
    ],
    reasoning: 'Pre-visit accessibility information allows people with disabilities to plan their visit with confidence. Without detailed information, potential visitors may not feel safe visiting or may encounter unexpected barriers.',
    resources: ['[Guide: Creating Accessible Website Content]', '[Checklist: Pre-visit Information Essentials]'],
  },
  // Entrance and access
  {
    keywords: ['entrance', 'entry', 'door', 'doorway', 'accessible entrance'],
    specificActions: [
      'Measure and document doorway width (minimum 850mm clear opening under AS1428.1)',
      'Install automatic or power-assisted doors if doorway force exceeds 20 Newtons',
      'Ensure there are no steps or lips at the entrance (maximum threshold 5mm)',
      'Add high-contrast tactile ground surface indicators at entrance',
      'Install accessible door hardware (lever handles, not knobs)',
      'Add clear signage directing to accessible entrance if main entrance is not accessible',
      'Consider installing a video intercom for after-hours accessible entry',
    ],
    reasoning: 'An accessible entrance is the first point of contact for visitors. Barriers at the entrance can prevent people from accessing your venue entirely.',
    resources: ['[AS1428.1 Door Requirements]', '[Guide: Accessible Entrance Design]'],
  },
  // Ramps and gradients
  {
    keywords: ['ramp', 'gradient', 'slope', 'incline'],
    specificActions: [
      'Measure ramp gradient (maximum 1:14 for new builds, 1:8 for short ramps under AS1428.1)',
      'Ensure ramp width is minimum 1000mm (1200mm preferred)',
      'Install handrails on both sides at 865-1000mm height',
      'Add landing platforms at top and bottom (minimum 1200mm x 1200mm)',
      'Install tactile ground surface indicators at top and bottom of ramp',
      'Ensure ramp surface is non-slip, especially when wet',
      'Add edge protection (kerbs or rails) to prevent wheelchairs rolling off',
    ],
    reasoning: 'Ramps that are too steep, too narrow, or lack handrails create significant safety risks and barriers for wheelchair users and people with mobility impairments.',
    resources: ['[AS1428.1 Ramp Specifications]', '[Ramp Gradient Calculator]'],
  },
  // Lifts and vertical circulation
  {
    keywords: ['lift', 'elevator', 'vertical'],
    specificActions: [
      'Ensure lift dimensions meet minimum requirements (1400mm deep x 1100mm wide for AS1428.2)',
      'Install tactile and Braille buttons at appropriate height (900-1100mm)',
      'Add audible announcements for floor levels',
      'Install mirror on back wall to assist wheelchair users exiting',
      'Ensure adequate lighting inside lift car (minimum 100 lux)',
      'Provide emergency communication system accessible from seated position',
      'Display lift capacity and wheelchair capacity clearly',
    ],
    reasoning: 'Lifts are essential for multi-level access. Inaccessible lifts can strand people with mobility impairments on a single level.',
    resources: ['[AS1735.12 Accessible Lift Requirements]', '[Lift Accessibility Checklist]'],
  },
  // Toilets and amenities
  {
    keywords: ['toilet', 'bathroom', 'amenities', 'restroom', 'washroom', 'accessible toilet'],
    specificActions: [
      'Ensure accessible toilet meets minimum dimensions (2400mm x 1700mm turning space)',
      'Install grab rails at correct height and position (800-810mm height, specific placement required)',
      'Ensure toilet seat height is 460-480mm from floor',
      'Install accessible basin at 800-840mm height with knee clearance',
      'Add emergency pull cord reaching to floor level',
      'Ensure door opens outward or is a sliding door (minimum 850mm clear opening)',
      'Install accessible coat hook at 1200mm height and full-length mirror',
      'Provide adequate colour contrast on fixtures and grab rails',
    ],
    reasoning: 'Accessible toilets are a fundamental requirement. Toilets that do not meet standards can prevent people from staying at your venue for any length of time.',
    resources: ['[AS1428.1 Accessible Toilet Design]', '[Toilet Accessibility Audit Checklist]'],
  },
  // Parking
  {
    keywords: ['parking', 'car park', 'accessible parking'],
    specificActions: [
      'Ensure accessible spaces are minimum 2400mm wide with 2400mm shared space or 3200mm wide for single spaces',
      'Locate accessible parking closest to accessible entrance (within 30m where possible)',
      'Install bollard-mounted signage showing international symbol of access',
      'Paint ground markings in contrasting colour with access symbol',
      'Ensure path from parking to entrance is step-free with appropriate gradient',
      'Provide adequate lighting for safety (minimum 40 lux)',
      'Remove any overhanging obstacles below 2000mm height',
    ],
    reasoning: 'Accessible parking is often the starting point for a visit. Spaces that are too far from the entrance, too narrow, or lack kerb ramps create significant barriers.',
    resources: ['[AS2890.6 Accessible Parking Requirements]', '[Parking Space Calculator]'],
  },
  // Wayfinding and signage
  {
    keywords: ['signage', 'wayfinding', 'signs', 'navigation', 'directions'],
    specificActions: [
      'Ensure signage uses high colour contrast (minimum 30% luminance contrast)',
      'Use clear, simple fonts (sans-serif, minimum 15mm character height for close reading)',
      'Install signs at consistent heights throughout venue (1400-1600mm for standing, 1200mm for seated)',
      'Add Braille and tactile signage on permanent room identification signs',
      'Use internationally recognised accessibility symbols',
      'Ensure signage is well-lit (minimum 100 lux) and glare-free',
      'Provide floor plans or maps with tactile elements at key decision points',
    ],
    reasoning: 'Clear wayfinding helps everyone navigate your venue independently. Poor signage can cause confusion and anxiety, particularly for people with vision or cognitive disabilities.',
    resources: ['[AS1428.1 Signage Requirements]', '[Accessible Signage Design Guide]'],
  },
  // Hearing and communication
  {
    keywords: ['hearing', 'loop', 'audio', 'amplification', 'deaf', 'auslan', 'captioning'],
    specificActions: [
      'Install a hearing loop system in key service areas (reception, counters, meeting rooms)',
      'Display the hearing loop symbol where systems are installed',
      'Test hearing loop coverage regularly with a loop listener',
      'Provide portable assistive listening devices for tours or presentations',
      'Offer Auslan interpretation for events and key services (book interpreters in advance)',
      'Add captions to video content and live presentations where possible',
      'Train staff in basic deaf awareness and communication strategies',
    ],
    reasoning: 'Approximately 1 in 6 Australians experience hearing loss. Without hearing augmentation, people may miss critical information or be unable to participate in activities.',
    resources: ['[Access to Premises Standard - Hearing Augmentation]', '[Hearing Loop Installation Guide]'],
  },
  // Vision and lighting
  {
    keywords: ['vision', 'blind', 'lighting', 'contrast', 'braille', 'tactile', 'low vision'],
    specificActions: [
      'Ensure adequate lighting levels (minimum 150 lux in circulation areas, 300 lux in task areas)',
      'Avoid glare from reflective surfaces and direct sunlight',
      'Provide high colour contrast on stairs, doors, and hazards (minimum 30% luminance contrast)',
      'Install tactile ground surface indicators at hazards and decision points',
      'Offer information in alternative formats: large print (minimum 18pt), Braille, audio',
      'Train staff to offer verbal descriptions and sighted guide assistance',
      'Ensure digital content meets WCAG 2.1 AA standards',
    ],
    reasoning: 'Adequate lighting and contrast are essential for people with low vision to navigate safely. Tactile indicators and alternative formats enable independence for people who are blind.',
    resources: ['[AS1428.1 Vision and Lighting Requirements]', '[Guide: Creating Alternative Formats]'],
  },
  // Sensory and autism-friendly
  {
    keywords: ['sensory', 'autism', 'quiet', 'relaxed', 'calm'],
    specificActions: [
      'Create or designate a quiet space with reduced sensory stimulation',
      'Provide sensory kits with items like ear plugs, fidget tools, sunglasses',
      'Offer relaxed or sensory-friendly sessions with reduced crowds, lighting, and sounds',
      'Publish sensory maps or guides describing noise levels, lighting, and crowds',
      'Train staff in autism awareness and sensory sensitivities',
      'Provide visual supports: schedules, social stories, wayfinding aids',
      'Allow early or priority entry to avoid crowded periods',
    ],
    reasoning: 'Sensory overload can prevent autistic people and others with sensory sensitivities from accessing spaces. Simple accommodations can make a significant difference.',
    resources: ['[Guide: Creating Sensory-Friendly Spaces]', '[Sensory Kit Contents Checklist]'],
  },
  // Staff training
  {
    keywords: ['staff', 'training', 'disability awareness', 'customer service'],
    specificActions: [
      'Provide disability awareness training for all customer-facing staff',
      'Include accessibility procedures in staff induction programs',
      'Train staff on how to use accessibility equipment (hearing loops, wheelchairs)',
      'Develop communication protocols for assisting customers with different needs',
      'Ensure staff know accessibility features and can direct visitors appropriately',
      'Include people with lived experience of disability in training delivery',
      'Refresh training annually and when accessibility features change',
    ],
    reasoning: 'Even the best physical accessibility can be undermined by staff who do not know how to assist customers with disabilities appropriately and respectfully.',
    resources: ['[Disability Awareness Training Resources]', '[Staff Accessibility Induction Checklist]'],
  },
  // Printed materials
  {
    keywords: ['print', 'brochure', 'menu', 'material', 'document', 'large print', 'easy read'],
    specificActions: [
      'Offer large print versions of key documents (minimum 18pt, preferably 24pt)',
      'Use sans-serif fonts (Arial, Helvetica, Verdana) for better readability',
      'Ensure high contrast between text and background (black on white or cream)',
      'Avoid text over images or patterned backgrounds',
      'Create Easy Read versions for people with intellectual disability',
      'Use plain English: short sentences, simple words, clear headings',
      'Make digital versions available that work with screen readers',
    ],
    reasoning: 'Printed materials that are too small, use poor contrast, or are written in complex language exclude people with vision or cognitive disabilities.',
    resources: ['[Guide: Creating Accessible Documents]', '[Easy Read Style Guide]'],
  },
  // Companion card and pricing
  {
    keywords: ['companion', 'pricing', 'discount', 'concession', 'carer'],
    specificActions: [
      'Register as a Companion Card affiliate to provide free entry for carers',
      'Display Companion Card acceptance on your website and at entry points',
      'Train staff on Companion Card procedures and eligibility',
      'Offer accessible pricing information in alternative formats',
      'Consider concession pricing for people with disabilities',
      'Ensure online booking systems have options for accessibility requirements',
    ],
    reasoning: 'Many people with disabilities require a support person to access venues. Charging full price for carers creates a financial barrier to participation.',
    resources: ['[Companion Card Program Information]', '[Accessible Pricing Strategies]'],
  },
  // Emergency and evacuation
  {
    keywords: ['emergency', 'evacuation', 'fire', 'egress', 'refuge'],
    specificActions: [
      'Develop Personal Emergency Evacuation Plans (PEEPs) for staff and regular visitors with disabilities',
      'Identify and sign evacuation refuges or safe waiting areas on each floor',
      'Install visual fire alarms (flashing beacons) in addition to audible alarms',
      'Ensure evacuation routes are accessible and clearly marked',
      'Train staff on evacuation procedures for people with disabilities',
      'Provide evacuation chairs or equipment at stair locations',
      'Test emergency procedures with people with different disabilities',
    ],
    reasoning: 'People with disabilities may need different evacuation procedures. Without planning, they may be at greater risk during emergencies.',
    resources: ['[Emergency Evacuation Planning Guide]', '[PEEP Template]'],
  },
  // Website and digital
  {
    keywords: ['website', 'digital', 'online', 'app', 'web', 'wcag'],
    specificActions: [
      'Conduct a WCAG 2.1 AA audit of your website and fix critical issues',
      'Ensure all images have meaningful alt text',
      'Provide captions and transcripts for video content',
      'Ensure keyboard navigation works for all interactive elements',
      'Test with screen readers (NVDA, VoiceOver, JAWS)',
      'Ensure sufficient colour contrast (4.5:1 for text, 3:1 for large text)',
      'Provide clear link text that makes sense out of context',
      'Make forms accessible with proper labels and error messaging',
    ],
    reasoning: 'Digital accessibility is essential for people to find information and engage with your services. Inaccessible websites exclude people with vision, motor, and cognitive disabilities.',
    resources: ['[WCAG 2.1 Quick Reference]', '[Website Accessibility Testing Tools]'],
  },
  // Policy and DIAP
  {
    keywords: ['policy', 'diap', 'disability inclusion', 'action plan', 'procurement'],
    specificActions: [
      'Develop a formal accessibility policy and publish it on your website',
      'Create a Disability Inclusion Action Plan (DIAP) with measurable goals',
      'Include accessibility requirements in procurement and contract documents',
      'Appoint an accessibility champion or coordinator',
      'Engage people with disabilities in planning and review processes',
      'Set regular review dates and track progress against actions',
      'Report on accessibility progress in annual reports or publications',
    ],
    reasoning: 'Formal policies and action plans demonstrate commitment and create accountability for accessibility improvements over time.',
    resources: ['[DIAP Development Guide]', '[Accessible Procurement Checklist]'],
  },
];

// Helper: Get specific recommendations based on question context
function getSpecificRecommendations(
  questionId: string,
  questionText: string,
  moduleCode: string,
  _answer: string | null,
  userNotes?: string
): { actions: string[]; reasoning: string; resources: string[]; needsAdminReview?: boolean } {
  // First, check for question-specific recommendations (most precise)
  if (QUESTION_SPECIFIC_RECOMMENDATIONS[questionId]) {
    const specific = QUESTION_SPECIFIC_RECOMMENDATIONS[questionId];
    let actions = [...specific.actions];

    // If user provided notes, add context-aware first action
    if (userNotes?.trim()) {
      actions.unshift(`Address noted issue: "${userNotes.trim()}"`);
    }

    return {
      actions: actions.slice(0, 6),
      reasoning: specific.reasoning,
      resources: specific.resources,
      needsAdminReview: false,
    };
  }

  const questionLower = questionText.toLowerCase();
  const codeLower = moduleCode.toLowerCase();

  // Find matching context based on keywords
  for (const context of RECOMMENDATION_CONTEXTS) {
    const matchesKeyword = context.keywords.some(
      keyword => questionLower.includes(keyword) || codeLower.includes(keyword)
    );
    if (matchesKeyword) {
      let actions = [...context.specificActions];

      // If user provided notes, add context-aware first action
      if (userNotes?.trim()) {
        actions.unshift(`Address noted issue: "${userNotes.trim()}"`);
      }

      return {
        actions: actions.slice(0, 6), // Take top 6 actions
        reasoning: context.reasoning,
        resources: context.resources,
        needsAdminReview: false,
      };
    }
  }

  // ADMIN FALLBACK: No specific recommendation available
  // Flag for admin review and provide generic guidance
  let fallbackActions = [
    '⚠️ This item requires tailored guidance - contact Access Compass support for specific recommendations',
    'Document current state with photos and measurements to share with our team',
    'Note any specific constraints or requirements unique to your venue',
  ];

  // If user provided notes, include them as context
  if (userNotes?.trim()) {
    fallbackActions.splice(1, 0, `Your notes: "${userNotes.trim()}" - our team will consider this context`);
  }

  // Add some general guidance
  fallbackActions.push(
    'In the meantime, consult Australian Standards AS1428.1 for general requirements',
    'Consider engaging a local access consultant for on-site assessment',
    'Contact support@accesscompass.com.au for personalised recommendations'
  );

  return {
    actions: fallbackActions.slice(0, 6),
    reasoning: 'This question requires specific guidance that our automated system cannot provide. Our team will review your response and provide tailored recommendations. In the meantime, the general actions above may help you make progress.',
    resources: ['[Contact Access Compass Support]', '[Australian Human Rights Commission - Disability Standards]'],
    needsAdminReview: true,
  };
}

// Helper: Generate detailed findings for deep-dive mode
function generateDetailedFindings(completedModules: ModuleProgress[]): Report['detailedFindings'] {
  return completedModules.map(moduleProgress => {
    const module = getModuleById(moduleProgress.moduleId);
    if (!module) return null;

    const issues = moduleProgress.responses
      .filter(response => isNegativeResponse(response.answer) || needsFollowUp(response.answer))
      .map(response => {
        // Find the question
        const question = module.questions.find(q => q.id === response.questionId);
        if (!question) return null;

        // Determine priority based on answer and question metadata
        const priority: 'high' | 'medium' | 'low' =
          isNegativeResponse(response.answer) ? 'high' :
          needsFollowUp(response.answer) ? 'medium' : 'low';

        // Get specific recommendations based on question context
        const recommendations = getSpecificRecommendations(
          question.id,
          question.text,
          module.code,
          response.answer,
          response.notes
        );

        // Generate contextual reasoning
        const reasoning = isNegativeResponse(response.answer)
          ? recommendations.reasoning
          : 'This item needs follow-up to confirm. Conduct an internal audit to clarify current status and document findings for your team.';

        // Build recommended actions
        const recommendedActions: string[] = [];
        if (isNegativeResponse(response.answer)) {
          recommendedActions.push(...recommendations.actions);
        } else {
          // For "unable to check" responses
          recommendedActions.push(
            'Conduct a site walk-through to verify current accessibility features',
            'Take photos or measurements to document current state',
            'Consult with team members who may have more information',
            'Update your accessibility records based on findings',
            'Schedule follow-up review to confirm status',
          );
        }

        // Build resource links - use real Resource Centre links
        const resourceLinks = getReportResourceLinks(question.id, module.code);

        return {
          questionText: question.text,
          reasoning,
          priority,
          recommendedActions,
          resourceLinks,
          // Include compliance information from question metadata
          complianceLevel: question.complianceLevel,
          complianceRef: question.complianceRef,
        };
      })
      .filter((issue): issue is NonNullable<typeof issue> => issue !== null);

    return {
      moduleId: moduleProgress.moduleId,
      moduleName: module.name,
      issues,
    };
  }).filter((finding): finding is NonNullable<typeof finding> => finding !== null && finding.issues.length > 0);
}

// Helper: Get human-readable label for analysis type
function getAnalysisTypeLabel(analysisType: string): string {
  const labels: Record<string, string> = {
    'menu': 'Menu Analysis',
    'brochure': 'Brochure Analysis',
    'flyer': 'Flyer Analysis',
    'large-print': 'Large Print Analysis',
    'signage': 'Signage Analysis',
    'lighting': 'Lighting Analysis',
    'ground-surface': 'Ground Surface Analysis',
    'pathway': 'Pathway Analysis',
    'entrance': 'Entrance Analysis',
    'ramp': 'Ramp Analysis',
    'stairs': 'Stairs Analysis',
    'door': 'Door Analysis',
    'social-media-post': 'Social Media Post Analysis',
    'social-media-url': 'Social Media Profile Analysis',
    'website-wave': 'Website Accessibility Audit',
  };
  return labels[analysisType] || 'Media Analysis';
}
