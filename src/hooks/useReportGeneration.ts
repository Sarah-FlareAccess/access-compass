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
import { needsFollowUp, isNegativeResponse, isPartialResponse } from '../constants/responseOptions';
import { getReportResourceLinks } from '../utils/resourceLinks';
import { getHelpByQuestionId } from '../data/help';
import { calculateQuestionPriority } from '../utils/priorityCalculation';
import type { ReportConfig } from '../components/ReportConfigSelector';
import { generateModuleSummary } from '../utils/generateModuleSummary';

export interface CategorisedItem {
  text: string;
  moduleCode: string;
  moduleName: string;
  questionId?: string;
  priority?: 'high' | 'medium' | 'low';
  complianceLevel?: 'mandatory' | 'best-practice';
}

export interface ReportSection {
  title: string;
  content: string | string[];
  categorised?: CategorisedItem[];
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
    moduleCode: string;
    moduleName: string;
    issues: Array<{
      questionId: string;
      questionText: string;
      reasoning: string;
      priority: 'high' | 'medium' | 'low';
      recommendedActions: string[];
      resourceLinks: string[];
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
      const catStrengths: CategorisedItem[] = [];
      const catPriorityActions: CategorisedItem[] = [];
      const catAreasToExplore: CategorisedItem[] = [];
      const catProfessionalReview: CategorisedItem[] = [];

      // Build module evidence (ownership/completion metadata)
      const moduleEvidence: ModuleCompletionEvidence[] = completedModules.map(moduleProgress => {
        const module = getModuleById(moduleProgress.moduleId);
        const freshSummary = module?.questions
          ? generateModuleSummary(moduleProgress.responses, module.questions)
          : moduleProgress.summary;
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
          strengthsCount: freshSummary?.doingWell?.length || 0,
          actionsCount: freshSummary?.priorityActions?.length || 0,
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
        {
          const mod = getModuleById(moduleProgress.moduleId);
          const mCode = moduleProgress.moduleCode;
          const mName = mod?.name || mCode;

          // Regenerate summary from responses + current question data
          // so that actionText changes take effect without re-completing modules
          const summary = mod?.questions
            ? generateModuleSummary(moduleProgress.responses, mod.questions)
            : moduleProgress.summary;

          if (summary?.doingWell) {
            allStrengths.push(...summary.doingWell);
            summary.doingWell.forEach(text =>
              catStrengths.push({ text, moduleCode: mCode, moduleName: mName })
            );
          }
          if (summary?.priorityActions) {
            summary.priorityActions.forEach(a => {
              const text = a.action;
              allPriorityActions.push(`${a.action} (${a.priority} priority)`);
              catPriorityActions.push({ text, moduleCode: mCode, moduleName: mName, questionId: a.questionId, priority: a.priority, complianceLevel: a.complianceLevel });
            });
          }
          if (summary?.areasToExplore) {
            summary.areasToExplore.forEach(item => {
              const text = typeof item === 'string' ? item : item.action;
              const questionId = typeof item === 'string' ? undefined : item.questionId;
              allAreasToExplore.push(text);
              catAreasToExplore.push({ text, moduleCode: mCode, moduleName: mName, questionId });
            });
          }
          if (summary?.professionalReview) {
            allProfessionalReview.push(...summary.professionalReview);
            summary.professionalReview.forEach(text =>
              catProfessionalReview.push({ text, moduleCode: mCode, moduleName: mName })
            );
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
              const reviewText = `${getAnalysisTypeLabel(response.mediaAnalysis.analysisType)}: ${response.mediaAnalysis.professionalReviewReason}`;
              allProfessionalReview.push(reviewText);
              const mod2 = getModuleById(moduleProgress.moduleId);
              catProfessionalReview.push({
                text: reviewText,
                moduleCode: moduleProgress.moduleCode,
                moduleName: mod2?.name || moduleProgress.moduleCode,
              });
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
            categorised: catStrengths,
            type: 'list',
          },
          priorityActions: {
            title: 'Priority Actions',
            content: allPriorityActions,
            categorised: catPriorityActions,
            type: 'list',
          },
          areasToExplore: {
            title: 'Areas to Explore',
            content: allAreasToExplore,
            categorised: catAreasToExplore,
            type: 'list',
          },
          professionalReview: {
            title: 'Consider Professional Review',
            content: allProfessionalReview,
            categorised: catProfessionalReview,
            type: 'list',
          },
        },
        quickWins,
        professionalSupport,
        nextSteps,
        progressComparison,
        reportContext,
      };

      // Add detailed findings for all report types
      report.detailedFindings = generateDetailedFindings(completedModules);

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
  // Module 1.1
  '1.1-D-10': {
    actions: ['Add a "Current limitations" or "What we are working on" section to your accessibility page.', 'Describe each known barrier honestly, explain any temporary workarounds, and state what you are doing to address it with a target timeframe.', 'Frame limitations constructively: "Our upstairs gallery is not currently wheelchair accessible. We are installing a lift, expected completion March 2027. In the meantime, staff can bring items downstairs on request."', 'Update this section as barriers are resolved.'],
    reasoning: 'Honesty about barriers builds trust and prevents harmful surprises. A person with disability who discovers an undisclosed barrier upon arrival may feel deceived and excluded. Transparent communication also demonstrates compliance with the DDA 1992 requirement to make reasonable adjustments, because acknowledging barriers is the first step to addressing them.',
    resources: [],
  },
  '1.1-D-11': {
    actions: ['Add a visible feedback mechanism on your accessibility page (email, form, phone number) specifically for accessibility information accuracy.', 'Ensure the feedback channel itself is accessible (keyboard-operable form, phone option for people who cannot type, email for people who are Deaf).', 'Respond to all accessibility feedback within 5 business days and explain what action will be taken.', 'Track feedback themes to identify recurring accuracy issues.'],
    reasoning: 'People with disability are the best judges of whether accessibility information is accurate and useful. Inviting feedback shows respect, helps catch errors that internal reviews miss, and supports continuous improvement. It also provides evidence of proactive DDA compliance by demonstrating you actively seek to identify and remove barriers.',
    resources: [],
  },
  '1.1-D-12': {
    actions: ['Assign a named role (not just "the team") responsible for maintaining accessibility information, with this duty included in their position description.', 'Ensure the responsible person has authority to make changes promptly without lengthy approval chains.', 'Provide the responsible person with training on accessibility standards (AS 1428.1, WCAG 2.2, DDA 1992) so they understand what information matters.', 'Establish a backup person to cover during absences.'],
    reasoning: 'Without clear ownership, accessibility information becomes "everyone\'s job and no one\'s priority." This leads to outdated content that can mislead people with disability. A person with a spinal cord injury who relies on published lift availability information needs to trust that someone is actively maintaining its accuracy.',
    resources: [],
  },
  '1.1-D-13': {
    actions: ['Create a social story using simple language, real photographs of your venue, and a step-by-step narrative of what a visit looks like (from arrival to departure).', 'Include sensory information: expected noise levels, lighting, crowds, smells, and any sudden sounds (alarms, announcements).', 'Make the social story available as a downloadable PDF and as a web page (for screen reader access) on your accessibility page.', 'Review the social story with autistic adults and parents/carers of autistic children to ensure it is helpful and accurate.', 'Update the social story whenever the venue layout or experience changes.'],
    reasoning: 'Social stories are evidence-based tools that help autistic people, people with intellectual disabilities, and people with anxiety disorders prepare for new experiences by reducing uncertainty. They describe what will happen, what the environment looks and sounds like, and what behaviour is expected, enabling people to participate who might otherwise avoid the venue entirely.',
    resources: [],
  },
  '1.1-D-1a': {
    actions: ['Publish accessibility information on your own website as the primary source of truth, ensuring you control accuracy and timeliness.', 'Duplicate key details on your Google Business Profile accessibility attributes and any third-party listing platforms you use.', 'Ensure printed materials (brochures, flyers) include the same information and reference the website for the most current version.', 'Check that accessibility info is included on travel aggregator and event listing platforms where your venue appears.', 'Verify that all published versions are consistent. Create a single-source document that feeds all channels.'],
    reasoning: 'People with disability use diverse channels to research venues. A person who is blind may use a screen reader on your website; a person with intellectual disability may rely on a carer reading a printed brochure; an older person with low vision may use Google Maps. If information is only in one place, you are excluding people who use other channels.',
    resources: [],
  },
  '1.1-D-1b': {
    actions: ['Place an "Accessibility" or "Access Information" link in your website primary navigation or footer, visible on every page.', 'Ensure the link is reachable within one click from the homepage, not buried under sub-menus.', 'Use clear link text (not "click here") per WCAG 2.2 SC 2.4.4 Link Purpose (In Context).', 'Add the accessibility page to your site search index and verify it appears for searches like "wheelchair", "accessible", "disability".'],
    reasoning: 'If accessibility information is hard to find, people with cognitive disabilities, low digital literacy, or those using assistive technology may give up searching. The DDA 1992 principle of equivalent access means information must be as easy to find for a person with disability as general venue information is for anyone else.',
    resources: [],
  },
  '1.1-D-1c': {
    actions: ['Rewrite accessibility content from the customer perspective: focus on what they can do, how to get there, and what support is available rather than listing compliance achievements.', 'Use second person ("you") and active voice. For example, "You can enter through the automatic doors on Smith Street" rather than "The premises comply with AS 1428.1."', 'Have at least two people with disability review the content and provide feedback on whether it answers their real questions.', 'Include a FAQ section addressing the most common accessibility questions your staff receive.'],
    reasoning: 'Compliance-focused language (citing standards and regulations) does not help a person with disability plan their visit. A wheelchair user needs to know "the ramp is on the left side of the building", not "we comply with the Premises Standards." Customer-focused information reduces barriers and demonstrates genuine welcome.',
    resources: [],
  },
  '1.1-D-2a': {
    actions: ['Document and publish: entrance type (steps, ramp, level), door width (minimum 850mm clear opening per AS 1428.1), path surface and gradient, lift dimensions, and accessible toilet locations.', 'Include photos or short videos showing the accessible route from parking to entry and through key areas.', 'Add distances in metres between key points (parking to entrance, entrance to lift, lift to toilets) so people with limited stamina or mobility can plan rest stops.', 'Note any temporary barriers or construction that may affect access, with expected resolution dates.', 'Describe the gradient of ramps (maximum 1:14 per AS 1428.1:2021 for new work) and note if handrails are present.'],
    reasoning: 'Physical access details are critical for people using wheelchairs, mobility scooters, walking frames, or crutches, as well as people with heart or respiratory conditions who need to gauge walking distances. Without specific measurements, a person may arrive only to find a doorway too narrow for their chair or a ramp too steep to navigate safely.',
    resources: [],
  },
  '1.1-D-2b': {
    actions: ['Describe typical noise levels in different areas (quiet zones, louder spaces) and whether noise-cancelling headphones are available to borrow.', 'Document lighting conditions: bright fluorescent, natural light, dim areas, flashing or moving lights.', 'Note any strong smells (cleaning products, food areas, perfumed spaces) that may affect people with chemical sensitivities or sensory processing differences.', 'Describe the social environment: how busy the venue typically is, whether there are quiet times, whether crowds are expected, and whether quiet or low-sensory sessions are offered.', 'Provide a sensory map or sensory guide showing high-stimulation and low-stimulation zones.'],
    reasoning: 'Sensory and social environment information is vital for autistic people, people with sensory processing disorders, anxiety disorders, PTSD, acquired brain injuries, and migraine conditions. Without this information, a visit can trigger sensory overload, panic attacks, or pain, turning what should be an enjoyable experience into a distressing one.',
    resources: [],
  },
  '1.1-D-3a': {
    actions: ['Record the last review date on the accessibility page itself so customers can gauge currency.', 'Set a calendar reminder for quarterly reviews at minimum.', 'After each review, note the date and any changes made in an internal log to maintain an audit trail.', 'If no physical changes have occurred, still confirm and update the "last reviewed" date to show the information has been verified.'],
    reasoning: 'Stale accessibility information erodes trust. People with disability who see a "last updated 2019" date may assume the venue does not prioritise access. Regular reviews also catch gradual degradation such as faded signage, worn tactile indicators, or broken door closers that staff may not notice.',
    resources: [],
  },
  '1.1-D-3b': {
    actions: ['Conduct a physical walkthrough audit using an accessibility checklist based on AS 1428.1:2021 and the Premises Standards 2010.', 'Engage an access consultant or Disability Access Consultant (as listed on the ACAA register) for an independent review at least once every two years.', 'Cross-reference published information against feedback from customers with disability who have visited.', 'Compare your information against the Access Advisor or similar platforms to identify gaps.', 'Ask a person who uses a wheelchair, a person who is blind, and a person with an intellectual disability to each review the information for completeness.'],
    reasoning: 'Self-assessment alone often misses barriers that affect people with specific disabilities. For example, a sighted person may not notice missing tactile indicators; a person without mobility impairment may not recognise a too-steep crossfall. Third-party verification against Australian Standards ensures accuracy and legal defensibility under the DDA 1992.',
    resources: [],
  },
  '1.1-D-5a': {
    actions: ['Create a brief internal guide or FAQ document that staff can reference when answering accessibility enquiries.', 'Train frontline staff on common accessibility questions (parking, entrance, toilets, hearing loops, assistance animals) so they can answer confidently.', 'Establish a clear escalation path: if the first contact person cannot answer, they should know who to transfer to and within what timeframe.', 'Log accessibility enquiries to identify common questions and improve published information accordingly.'],
    reasoning: 'Inconsistent or uninformed responses to accessibility enquiries signal that a venue does not take access seriously. A person using a powered wheelchair who receives vague or contradictory answers about door widths may decide not to visit. Confident, accurate responses build trust and demonstrate the organisation values customers with disability.',
    resources: [],
  },
  '1.1-D-5b': {
    actions: ['Provide at least one non-voice contact channel (email, web form, live chat, or SMS) that is monitored and responded to within one business day.', 'Ensure the non-voice channel is accessible: keyboard-operable, screen-reader compatible, and not reliant on CAPTCHA that blocks assistive technology users.', 'Promote the non-voice option equally alongside the phone number so customers know it exists.', 'Consider offering webcam-based enquiry for Auslan users, or partner with an Auslan interpreting service.'],
    reasoning: 'Approximately 3.6 million Australians have hearing loss, and many people who are Deaf use Auslan as their first language. People with speech impairments, social anxiety, or autism may also be unable or unwilling to use voice calls. Without text-based alternatives, these customers are locked out of pre-visit communication.',
    resources: [],
  },
  '1.1-D-5c': {
    actions: ['Add a clear statement on your website, booking confirmation, and social media: "We welcome accessibility questions. Contact us at [details] and we will be happy to help you plan your visit."', 'Include this invitation in automated pre-visit emails or SMS messages.', 'Train staff to proactively ask "Do you have any accessibility requirements we can help with?" during phone or in-person enquiries.', 'Use inclusive language that normalises asking about access rather than framing it as a special request.'],
    reasoning: 'Many people with disability do not ask about accessibility because past experiences taught them venues are unwelcoming or unhelpful. Proactively inviting questions signals that the venue is prepared, welcoming, and will not treat accessibility as a burden. This is especially important for people with invisible disabilities who may feel their needs are not "serious enough" to ask about.',
    resources: [],
  },
  '1.1-D-5d': {
    actions: ['Conduct usability testing of each contact channel with at least one person using a screen reader, one person using keyboard-only navigation, and one person with a cognitive disability.', 'Use automated tools (axe DevTools, WAVE) to test web-based contact forms against WCAG 2.2 Level AA.', 'Test the phone experience with the National Relay Service to confirm it works smoothly.', 'Document findings and fix any identified barriers.'],
    reasoning: 'A contact channel that technically exists but is unusable with assistive technology provides a false sense of inclusion. A person who is blind encountering an unlabelled form field, or a person using voice control unable to activate a submit button, is effectively denied the ability to ask questions. Testing with real users reveals barriers automated tools cannot detect.',
    resources: [],
  },
  '1.1-D-5e': {
    actions: ['Test your phone system: does the IVR (interactive voice response) work with hearing aids via T-coil? Can someone navigate it using only voice?', 'Test your email: does the reply format use plain text or accessible HTML? Are attachments in accessible formats (not scanned image PDFs)?', 'Test your web form: keyboard operability, screen reader label associations, error handling per WCAG 2.2 SC 3.3.1 and 3.3.3.', 'Test live chat: does it work with screen readers? Are messages announced? Can keyboard users send messages?', 'Document which channels pass and which have remaining barriers.'],
    reasoning: 'Each contact channel has unique accessibility challenges. A phone IVR may be impossible for someone who is Deaf; a live chat may not work with screen readers; a web form may time out for someone who types slowly due to a motor disability. Channel-by-channel testing ensures no customer is silently excluded.',
    resources: [],
  },
  '1.1-D-5f': {
    actions: ['Share the URLs or details of each contact channel you offer.', 'Note any channels you suspect may have accessibility issues.', 'Identify which channels receive the most accessibility enquiries so the review can prioritise accordingly.'],
    reasoning: 'Professional review of contact channels can identify barriers that internal teams may miss, such as inaccessible CAPTCHA, colour contrast failures on form buttons, or phone hold music that interferes with hearing aid coupling. Resolving these barriers benefits people across the full spectrum of disability.',
    resources: [],
  },
  '1.1-D-6a': {
    actions: ['Develop a written accessibility enquiry guide covering the top 20 most common questions (parking, entrance, toilets, hearing support, assistance animals, quiet spaces, dietary needs).', 'Store the guide in an easily accessible location (shared drive, intranet, physical folder at reception).', 'Review and update the guide whenever venue changes occur or new questions emerge.', 'Include decision trees for complex scenarios (e.g., "If the customer needs a hoist, check Room X availability and confirm with facilities team").'],
    reasoning: 'Without documented guidance, responses depend on individual staff knowledge, which varies widely. A person who is blind calling on Monday might get detailed wayfinding information from an experienced staff member, while the same question on Tuesday might be met with "I am not sure." Consistent guidance ensures equitable service regardless of which staff member answers.',
    resources: [],
  },
  '1.1-D-6b': {
    actions: ['Establish a clear escalation protocol: first-contact staff should know which person or team to refer accessibility questions to, and that referral should happen in real time (transfer the call or connect via chat) rather than promising a callback.', 'Ensure the escalation contact is available during all operating hours.', 'Set a maximum response time of 2 hours for escalated accessibility enquiries that cannot be resolved immediately.', 'Track escalation frequency to identify training gaps or information that should be added to the frontline guide.'],
    reasoning: 'A customer with disability who is told "someone will call you back" and never hears from the venue has been failed. People with disability often have complex, time-sensitive planning needs (e.g., booking accessible transport, arranging support workers). Prompt escalation and resolution demonstrates respect for their time and autonomy.',
    resources: [],
  },
  '1.1-D-6c': {
    actions: ['Explicitly include "It is always okay to say I do not know" in staff training and communications.', 'Train staff to follow up promptly: "I do not know the answer to that, but I will find out and get back to you within [timeframe]."', 'Ensure staff understand that guessing or giving incorrect information is far worse than admitting uncertainty.', 'Celebrate staff who follow up effectively rather than only recognising those who have instant answers.'],
    reasoning: 'Incorrect accessibility information can cause real harm. If a staff member guesses that a doorway is wide enough and it is not, a wheelchair user may travel a long distance only to be unable to enter. Encouraging honesty protects customers with disability from dangerous or distressing situations and builds a culture of accountability.',
    resources: [],
  },
  '1.1-D-7a': {
    actions: ['If staffing is the barrier, consider self-guided familiarisation with a printed or audio guide that customers can use independently.', 'If timing is the barrier, offer familiarisation during quiet periods (first hour of opening, weekday mornings).', 'If awareness is the barrier, include familiarisation visit information prominently on your accessibility page and in booking confirmations.', 'If cost is the barrier, note that familiarisation visits need not be elaborate. Even 15 minutes of a staff member\'s time showing key routes and facilities can make a significant difference.'],
    reasoning: 'Understanding barriers to offering familiarisation visits allows targeted problem-solving. Each barrier, when removed, opens access for people with anxiety, autism, vision impairments, and cognitive disabilities who rely on predictability and spatial orientation to feel safe and welcome.',
    resources: [],
  },
  '1.1-D-7b': {
    actions: ['Mention familiarisation visits on your accessibility page with clear instructions on how to arrange one.', 'Include the option in booking confirmation emails: "Would you like to arrange a familiarisation visit before your event/appointment?"', 'Promote the option on social media and through disability community networks.', 'Ensure staff are aware of the option and proactively mention it when customers express anxiety or uncertainty about visiting.'],
    reasoning: 'A familiarisation visit option that exists but is not communicated effectively is invisible to the people who need it most. People with disability should not have to discover this option by accident. Proactive communication signals genuine welcome and helps autistic people, people with anxiety, and those with vision impairments prepare effectively.',
    resources: [],
  },
  '1.1-D-8a': {
    actions: ['Go beyond generic transport directions. Specify which bus routes have low-floor vehicles, which train stations have lifts, and which taxi companies operate wheelchair-accessible vehicles in your area.', 'Note whether ride-share pick-up/drop-off points are accessible (level surface, close to entrance, covered).', 'Include information about mobility parking permit requirements if your parking requires one.', 'Describe any barriers on the transport route that may affect specific disabilities (e.g., steep hill from bus stop, no audio announcements on local bus).'],
    reasoning: 'Generic transport information ("catch the number 42 bus") does not help a person using a wheelchair who needs to know if the bus kneels, if the stop has a raised platform, or if there is a kerb ramp between the stop and the venue. Specific accessibility details prevent failed journeys and wasted effort for people with mobility, vision, or cognitive disabilities.',
    resources: [],
  },
  '1.1-D-8b': {
    actions: ['Walk the route from each accessible transport stop to your entrance and document: surface type, gradient, kerb ramps, crossings, obstacles, and any confusing decision points.', 'Photograph or video the route and publish it on your accessibility page.', 'Note the distance and estimated travel time for someone using a manual wheelchair or walking with a mobility aid.', 'Identify any hazards in the "last 50 metres" (uneven pavement, construction, narrow paths, vehicle crossings without signals).'],
    reasoning: 'The "last 50 metres" from transport to the front door is where many accessibility journeys fail. A person who is blind may become disoriented between the bus stop and the entrance; a wheelchair user may encounter a step or narrow gap. Documenting and publishing this information prevents dangerous and frustrating situations at the point of arrival.',
    resources: [],
  },
  '1.1-D-9': {
    actions: ['Create a single-source document or content management system entry that feeds all platforms (website, Google, social media, printed materials).', 'Conduct a cross-platform audit: compare every channel where accessibility information appears and note discrepancies.', 'Assign one person or team to approve all accessibility information changes before publication on any channel.', 'Set up a quarterly consistency check across all platforms.'],
    reasoning: 'Inconsistent information across platforms creates confusion and erodes trust. A person who is Deaf may read one thing on your website and find different information on a third-party listing. Contradictory details about Auslan availability or hearing loop provision can cause a person to arrive without their preferred communication support.',
    resources: [],
  },
  '1.1-F-1': {
    actions: ['Create a dedicated accessibility page on your website that describes physical access, sensory environment, communication supports, and available adjustments.', 'Include the accessibility page link in your main navigation menu or footer so it is reachable within two clicks from the homepage.', 'Ensure the page meets WCAG 2.2 Level AA (SC 1.1.1 Non-text Content, SC 1.3.1 Info and Relationships, SC 2.4.2 Page Titled) so people using assistive technology can access the information.', 'Review and update this page at least every 6 months or whenever physical changes are made to the venue.', 'Test the page with at least two people with disability to confirm it answers the questions they would ask before visiting.'],
    reasoning: 'Pre-visit accessibility information allows people with mobility, sensory, cognitive, and psychosocial disabilities to assess whether a venue can meet their needs, reducing anxiety and preventing wasted trips. Under the DDA 1992, failing to provide this information can constitute indirect discrimination by excluding people who cannot risk visiting without knowing what to expect.',
    resources: [],
  },
  '1.1-F-2B': {
    actions: ['Audit your current information against a comprehensive checklist covering: mobility access (ramps, lifts, paths), sensory environment (noise, lighting, scents), communication supports (Auslan, captioning, Easy Read), toilets, parking, and assistance animal policies.', 'Add specific measurements and details rather than generic statements. For example, replace "wheelchair accessible" with "level entry via automatic doors, 1200mm wide corridors, accessible toilet on ground floor."', 'Include information about what is NOT accessible alongside what is, so customers can make informed decisions.', 'Ensure each piece of information follows WCAG 2.2 SC 3.1.5 Reading Level by using plain language (aim for Year 8 reading level or below).'],
    reasoning: 'Vague accessibility claims (like "wheelchair friendly") fail people with disability because they do not provide enough detail to plan safely. A person using a powered wheelchair needs door widths; a person with sensory processing differences needs noise levels; a person who is blind needs to know about tactile indicators.',
    resources: [],
  },
  '1.1-F-3A': {
    actions: ['Identify the digital channel most used by your customers (website, Google Business Profile, social media) and publish accessibility details there first.', 'Add structured data (schema.org accessibility properties) to your website so search engines surface your accessibility features.', 'Create a simple one-page fact sheet (PDF and HTML) covering parking, entrance, toilets, sensory environment, and assistance animals that can be shared across all channels.', 'Register your venue on accessibility directories such as Access Advisor (accessadvisor.com.au) or the Australian Tourism Data Warehouse.'],
    reasoning: 'People with disability often research venues across multiple platforms before deciding to visit. If accessibility information only exists in one obscure location, wheelchair users, people who are Deaf or hard of hearing, and those with anxiety disorders may not find it, effectively excluding them from the planning process.',
    resources: [],
  },
  '1.1-F-3B': {
    actions: ['Establish a scheduled review cycle (at minimum every 6 months) for all published accessibility information.', 'Assign a named person responsible for verifying that published information matches current physical and operational conditions.', 'After any renovation, layout change, equipment purchase, or seasonal setup, update accessibility information within 48 hours.', 'Create a simple checklist staff can use during weekly walkthroughs to flag any changes that would affect accessibility information accuracy.'],
    reasoning: 'Outdated accessibility information can be worse than no information at all. A person with disability who plans a visit based on published details and arrives to find a ramp under construction, a broken lift, or a relocated accessible toilet wastes time, energy, and emotional resources. This is particularly harmful for people with chronic fatigue, chronic pain, or limited transport options.',
    resources: [],
  },
  '1.1-F-4': {
    actions: ['Share the URL of your accessibility page, Google Business listing, and any other platforms where access information is published.', 'Include the URL of your booking or ticketing page if it has accessibility options.', 'Note any areas you feel may be incomplete or outdated so the review can prioritise those.'],
    reasoning: 'An expert review of published accessibility information can identify gaps, inaccuracies, and language issues that internal teams may miss. This benefits all people with disability by ensuring the information they rely on for planning is comprehensive and trustworthy.',
    resources: [],
  },
  '1.1-F-5': {
    actions: ['Offer at least three contact methods: phone/voice, email, and an online form or live chat.', 'Ensure at least one text-based option is available for people who are Deaf or have speech impairments and cannot use voice calls.', 'Publish contact details prominently on the accessibility page and in the website header or footer.', 'Include the National Relay Service (NRS) number (133 677) alongside your phone number for people who are Deaf or have speech impairments.', 'Ensure online contact forms meet WCAG 2.2 SC 1.3.5 Identify Input Purpose and SC 3.3.2 Labels or Instructions.'],
    reasoning: 'Different disabilities require different communication channels. A person who is Deaf cannot phone; a person with severe anxiety may not be able to call a stranger; a person with a motor disability may find long web forms difficult. The DDA 1992 requires equivalent service access, which means offering only one contact method can constitute indirect discrimination.',
    resources: [],
  },
  '1.1-F-6': {
    actions: ['Provide all frontline staff with disability awareness training that covers communication etiquette, common access requirements, and how to respond to specific scenarios.', 'Include role-play exercises: how to describe a route to someone who is blind, how to communicate with someone who uses a communication device, how to assist a wheelchair user without assuming they need help.', 'Create a quick-reference card or digital resource staff can consult when they are unsure.', 'Schedule refresher training at least annually.'],
    reasoning: 'Staff who lack confidence in responding to accessibility enquiries may give incorrect information, use inappropriate language, or avoid engaging altogether. This directly harms people with disability who are trying to plan safe, enjoyable visits. Confident staff also reduce the emotional labour customers with disability expend when seeking basic information.',
    resources: [],
  },
  '1.1-F-7': {
    actions: ['Offer familiarisation visits by appointment, allowing customers with disability to explore the venue at their own pace before a formal visit or event.', 'Promote the availability of familiarisation visits on your accessibility page, booking confirmation emails, and social media.', 'Train a designated staff member to conduct familiarisation visits, covering routes, facilities, emergency exits, and available supports.', 'Create a virtual familiarisation option (video walkthrough, 360-degree images, or social story) for people who cannot visit in person.'],
    reasoning: 'Familiarisation visits are particularly valuable for autistic people who need predictability, people with anxiety disorders who need to reduce uncertainty, people who are blind or have low vision who need to learn spatial layouts, and people with cognitive disabilities who benefit from rehearsal. Familiarity reduces sensory overload and anxiety on the day of the actual visit.',
    resources: [],
  },
  '1.1-F-8': {
    actions: ['Add transport information to your accessibility page covering: nearest accessible public transport stops (with walking distances), accessible parking locations, drop-off zone details, and taxi/rideshare set-down points.', 'Include links to the relevant state transport accessibility information (e.g., Transport for NSW Accessible Transport, PTV accessibility in Victoria).', 'Describe the route from the nearest accessible transport stop to your entrance, including surface type, gradient, and any obstacles.', 'Note whether assistance is available for the transport-to-venue connection (e.g., staff can meet customers at the bus stop).'],
    reasoning: 'Transport is often the most significant barrier to participation for people with disability. A venue may be perfectly accessible, but if a wheelchair user cannot get there because the nearest accessible bus stop is 800 metres away over uneven ground, the venue is effectively inaccessible. Transport information closes the gap between home and arrival.',
    resources: [],
  },
  // Module 1.2
  '1.2-1-1': {
    actions: ['Open your website in a browser, unplug or disable the mouse, and attempt to complete key tasks (navigate menus, submit forms, play videos) using only Tab, Shift+Tab, Enter, Space, and Arrow keys.', 'Document every element that cannot be reached, activated, or escaped using keyboard alone.', 'Fix focus trapping in modals and dropdowns by ensuring Escape closes overlays and focus returns to the trigger element.', 'Add tabindex="0" to custom interactive components that are not natively focusable and implement appropriate keyboard event handlers.', 'Re-test after fixes and add keyboard testing to your release checklist.'],
    reasoning: 'People who are blind, have motor impairments, or use alternative input devices rely entirely on keyboard navigation. If interactive elements cannot be reached or activated without a mouse, these users are completely locked out of website functionality.',
    resources: [],
  },
  '1.2-1-1a': {
    actions: ['Tab through every page section and record which component types (menus, carousels, date pickers, embedded maps, video players) cannot be operated by keyboard.', 'Cross-reference failures against WCAG 2.2 SC 2.1.1 (Keyboard) and SC 2.1.2 (No Keyboard Trap).', 'Prioritise fixes by user impact: navigation menus and forms first, then media players and interactive widgets.', 'Replace inaccessible third-party widgets with ARIA-compliant alternatives where native fixes are not possible.'],
    reasoning: 'Identifying exactly where keyboard access fails enables targeted remediation rather than guesswork, ensuring the most critical user journeys are fixed first.',
    resources: [],
  },
  '1.2-1-1b': {
    actions: ['Tab through your site and check whether every focused element has a visible outline or highlight.', 'Define a global CSS focus style (e.g., outline: 2px solid #FF9015) that provides at least 3:1 contrast against adjacent colours.', 'Remove any CSS that suppresses focus indicators (outline: none, outline: 0) without providing a replacement.', 'Test focus visibility on different background colours throughout the site.', 'Verify that custom components (dropdowns, sliders, tabs) also display focus indicators.'],
    reasoning: 'Keyboard users need to see which element is currently focused, just as mouse users see a cursor. Without visible focus indicators, keyboard users cannot tell where they are on the page, making navigation impossible.',
    resources: [],
  },
  '1.2-1-2': {
    actions: ['Run an automated scan (axe, WAVE, or Lighthouse) to identify all images missing alt attributes.', 'For each informative image, write alt text that conveys the same information a sighted user would gain.', 'Mark purely decorative images with alt="" so screen readers skip them.', 'Review complex images (charts, infographics, maps) and provide extended descriptions via aria-describedby or a linked text description.', 'Train content authors on writing effective alt text as part of your CMS workflow.'],
    reasoning: 'Screen reader users hear alt text instead of seeing images. Missing or poor alt text means blind users miss product details, navigation cues, and essential visual content that sighted users take for granted.',
    resources: [],
  },
  '1.2-1-2a': {
    actions: ['Audit a sample of pages from each section of the site (homepage, product pages, blog, booking flow) and record alt text quality for every image.', 'Create a scoring rubric: missing, generic ("image.jpg"), too long (over 125 characters for simple images), or appropriate.', 'Set a target of 100% appropriate alt text and assign owners to fix each section.', 'Add alt text review to your content publishing checklist.'],
    reasoning: 'Inconsistent alt text creates an unpredictable experience for screen reader users, who may get useful descriptions on some pages but meaningless or missing ones on others.',
    resources: [],
  },
  '1.2-1-2b': {
    actions: ['Identify who currently uploads images to the website (marketing team, developers, content managers, external agencies).', 'Create a brief alt text guide with examples of good and bad alt text for your specific content types.', 'Add a mandatory alt text field to your CMS image upload workflow.', 'Provide a 30-minute training session for all content contributors.'],
    reasoning: 'Alt text quality depends on who writes it. Assigning clear responsibility and providing training ensures consistent, meaningful descriptions rather than empty or auto-generated alt attributes.',
    resources: [],
  },
  '1.2-1-3': {
    actions: ['Use a contrast checking tool (e.g., WebAIM Contrast Checker, Colour Contrast Analyser) to measure text-to-background ratios on every page template.', 'Fix any normal text below 4.5:1 contrast ratio and any large text (18pt+ or 14pt bold+) below 3:1.', 'Pay special attention to text on images, coloured buttons, placeholder text in form fields, and footer content.', 'Update your brand style guide to only include colour combinations that meet WCAG 2.2 SC 1.4.3.', 'Add contrast checking to your design review process.'],
    reasoning: 'People with low vision, colour blindness, or age-related vision changes rely on adequate contrast to read text. Poor contrast effectively hides content from a large portion of the population.',
    resources: [],
  },
  '1.2-1-3a': {
    actions: ['Run a full-site automated contrast audit using axe or WAVE browser extensions.', 'Document each failure with the page URL, element, current ratio, and required ratio.', 'Prioritise fixes: body text and navigation first, then secondary content.', 'Schedule a follow-up audit after fixes are deployed.'],
    reasoning: 'A formal contrast audit provides a complete baseline of failures and measurable evidence of compliance progress, which is essential for DDA obligations and ongoing accessibility monitoring.',
    resources: [],
  },
  '1.2-1-3b': {
    actions: ['Identify all instances where text appears over images, gradients, or patterned backgrounds.', 'Add a semi-transparent dark overlay behind light text (or light overlay behind dark text) to ensure 4.5:1 contrast.', 'Consider using solid-colour text containers instead of transparent overlays for more reliable contrast.', 'Test with the browser zoom at 200% to confirm overlays scale correctly.'],
    reasoning: 'Text on variable backgrounds (photos, gradients) is one of the most common contrast failures. The contrast ratio changes across the image, making some words invisible to people with low vision.',
    resources: [],
  },
  '1.2-1-4': {
    actions: ['Test your website at 200% browser zoom on desktop and note any content that overflows, overlaps, is clipped, or requires horizontal scrolling.', 'Replace fixed-width layouts and pixel-based font sizes with responsive CSS (rem units, flexbox, CSS grid).', 'Ensure all functionality remains available at 200% zoom, including navigation, forms, and interactive elements.', 'Test at 400% zoom for SC 1.4.10 (Reflow) compliance, confirming no horizontal scroll at 320px equivalent.'],
    reasoning: 'Many people with low vision use browser zoom rather than screen magnifiers. If the layout breaks at 200% zoom, these users lose access to content and functionality that sighted users take for granted.',
    resources: [],
  },
  '1.2-1-4a': {
    actions: ['Zoom to 200% and 400% and systematically test each page template, recording screenshots of any broken layouts.', 'Categorise issues: content truncation, horizontal scrolling, overlapping elements, disappearing navigation.', 'Prioritise fixes based on severity (functional loss vs. cosmetic) and page importance.', 'Update CSS to use relative units and test responsive breakpoints.'],
    reasoning: 'Documenting specific zoom issues allows development teams to fix the exact CSS patterns causing failures rather than guessing, resulting in faster and more complete remediation.',
    resources: [],
  },
  '1.2-1-5': {
    actions: ['Test all key user journeys (browsing, booking, paying, contacting) on at least one iPhone and one Android device.', 'Verify that all content is readable without horizontal scrolling in portrait orientation.', 'Check that interactive elements (buttons, links, form fields) have minimum 24x24px tap targets with adequate spacing.', 'Test with device accessibility settings enabled (larger text, VoiceOver/TalkBack).', 'Fix any mobile-specific issues found and add mobile testing to your QA process.'],
    reasoning: 'Many people with disabilities rely on mobile devices with built-in assistive technology (VoiceOver, TalkBack, Switch Control). A poor mobile experience disproportionately affects users who depend on these tools.',
    resources: [],
  },
  '1.2-1-5a': {
    actions: ['Create a mobile testing checklist covering navigation, forms, media, checkout, and content reading.', 'Test each checklist item on both iOS Safari and Android Chrome.', 'Record any failures with screenshots and device/OS version details.', 'Prioritise fixing forms and payment flows, as these are the most critical for task completion.'],
    reasoning: 'Structured mobile testing ensures no critical user journey is overlooked, as ad-hoc testing typically only catches the most obvious issues and misses interactions that matter most to customers.',
    resources: [],
  },
  '1.2-1-5b': {
    actions: ['Acquire or borrow at least one iPhone, one Android phone (different manufacturer), and one tablet for testing.', 'Test across different screen sizes: small phone (under 375px), standard phone, and tablet.', 'Enable built-in screen readers (VoiceOver on iOS, TalkBack on Android) and verify core tasks work.', 'Document device-specific issues and browser rendering differences.'],
    reasoning: 'Different devices render content differently and have different assistive technology implementations. Testing on only one platform misses issues that affect a significant portion of users with disabilities.',
    resources: [],
  },
  '1.2-1-5c': {
    actions: ['Measure all interactive touch targets (buttons, links, checkboxes, form fields) against the 24x24 CSS pixel minimum (WCAG 2.2 SC 2.5.8).', 'Increase spacing between adjacent tap targets so accidental activation is unlikely.', 'Pay special attention to inline text links, icon buttons, and navigation items in headers and footers.', 'Test with users who have reduced fine motor control if possible.'],
    reasoning: 'People with motor impairments, tremors, or limited dexterity struggle to tap small targets accurately. Undersized buttons lead to frustration, errors, and abandonment of tasks.',
    resources: [],
  },
  '1.2-1-6': {
    actions: ['Create an inventory of all video and audio content on your website.', 'Categorise each item: pre-recorded video, live video, audio-only, or multimedia.', 'Determine which accessibility requirements apply to each type (captions, transcripts, audio descriptions).', 'Create a production plan and timeline for adding missing alternatives.'],
    reasoning: 'Deaf and hard of hearing users cannot access audio information, while blind users miss visual-only content. Without captions and transcripts, multimedia excludes significant audiences.',
    resources: [],
  },
  '1.2-1-6a': {
    actions: ['Prioritise captioning for your most-viewed and most-critical videos first.', 'Use professional captioning services or high-quality auto-caption tools, then manually review for accuracy.', 'Ensure captions are synchronised, identify speakers, and describe relevant sound effects.', 'Upload captions as closed captions (not burned-in) so users can toggle them on/off.', 'Set captions to display by default on embedded videos.'],
    reasoning: 'Deaf and hard of hearing people, and anyone in a noisy or quiet environment, depend on accurate captions to understand video content. Auto-generated captions without review often contain errors that change meaning.',
    resources: [],
  },
  '1.2-1-6b': {
    actions: ['Create a text transcript for each video that includes all spoken dialogue, speaker identification, and descriptions of important visual content.', 'Publish transcripts on the same page as the video, or link directly below the video player.', 'For complex visual content (demonstrations, diagrams), add descriptive text that conveys the visual information.', 'Consider also providing audio descriptions for videos with important visual-only content.'],
    reasoning: 'Transcripts serve people who are Deaf-blind (using Braille displays), people with cognitive disabilities who process text better than audio, and anyone who cannot play media in their current environment.',
    resources: [],
  },
  '1.2-1-7': {
    actions: ['Search your website for generic link text: "click here", "read more", "learn more", "here", "this page".', 'Rewrite each link so its text describes the destination or action (e.g., "View our accessibility guide" instead of "click here").', 'For repeated links (e.g., "Read more" on blog cards), add visually hidden text to differentiate them (e.g., aria-label="Read more about venue accessibility").', 'Check that linked images have alt text describing the link destination.'],
    reasoning: 'Screen reader users often navigate by listing all links on a page. If every link says "read more" or "click here", they cannot distinguish between destinations and must explore each one individually.',
    resources: [],
  },
  '1.2-1-8': {
    actions: ['Download NVDA (free, Windows) or enable VoiceOver (built-in, Mac/iOS) for an initial screen reader test.', 'Navigate your homepage, one content page, and your booking/contact form using only the screen reader.', 'Note any content that is skipped, read in the wrong order, unlabelled, or impossible to interact with.', 'Document findings and share them with your web development team for remediation.'],
    reasoning: 'Screen reader testing reveals issues that automated tools cannot detect, such as reading order problems, unlabelled form fields, and confusing navigation structures that prevent blind users from completing tasks.',
    resources: [],
  },
  '1.2-1-8a': {
    actions: ['Access free screen reader testing guides from WebAIM (webaim.org) or Deque University.', 'Start with a simple 15-minute test: navigate your homepage using Tab and arrow keys with a screen reader active.', 'Learn the basic commands: Tab (next interactive element), H (next heading), F (next form field), L (next list).', 'Schedule a regular monthly screen reader check of your most-visited pages.'],
    reasoning: 'Basic screen reader testing does not require expert knowledge. Even a simple test reveals major barriers that affect the daily experience of blind and low-vision website visitors.',
    resources: [],
  },
  '1.2-1-8b': {
    actions: ['Request a quote for a professional assistive technology review covering screen readers, voice control, and switch access.', 'Ensure the review scope covers your most critical user journeys (homepage, booking, payment, contact).', 'Ask for a prioritised remediation report with WCAG success criteria references.'],
    reasoning: 'Professional testing by experienced assistive technology users identifies nuanced issues that automated tools and basic manual testing miss, providing the most accurate picture of real-world barriers.',
    resources: [],
  },
  '1.2-1-9': {
    actions: ['Audit every form on your website (contact, booking, newsletter, login, search) for visible labels, programmatic association, and clear instructions.', 'Ensure each form field has a visible <label> element linked via the for attribute.', 'Add clear error messages that identify the field in error and describe how to fix it (WCAG 2.2 SC 3.3.1, SC 3.3.3).', 'Test all forms with a screen reader to verify labels are announced correctly.', 'Ensure required fields are indicated both visually and programmatically (aria-required="true").'],
    reasoning: 'Forms are critical interaction points. Unlabelled or poorly labelled form fields prevent screen reader users from knowing what information to enter, and unclear error messages prevent everyone from correcting mistakes.',
    resources: [],
  },
  '1.2-D-10': {
    actions: ['Provide a warning at least 20 seconds before any session timeout, with an option to extend per WCAG 2.2 SC 2.2.1 Timing Adjustable.', 'Allow at least 10 extensions of the timeout period, or remove the timeout entirely for key processes like booking and payment.', 'Ensure the timeout warning is announced to screen readers using aria-live="assertive".', 'Set session timeouts to at least 20 minutes for any process that requires user input.', 'If security requires a timeout, allow users to save progress and resume later.'],
    reasoning: 'People with motor disabilities may type slowly; people with cognitive disabilities may need more time to process information; people who are blind may take longer to navigate forms with a screen reader. Automatic logouts that discard entered data are particularly harmful as they force users to start over, causing frustration and potential abandonment. WCAG 2.2 SC 2.2.1 makes this a Level A requirement.',
    resources: [],
  },
  '1.2-F-10': {
    actions: ['Ensure every form field has a visible label (not just placeholder text) per WCAG 2.2 SC 3.3.2 Labels or Instructions.', 'When a validation error occurs, display a specific message next to the field explaining what went wrong and how to fix it (e.g., "Phone number must be 10 digits, starting with 0").', 'Use aria-invalid="true" and aria-describedby linking to the error message so screen readers announce the error per WCAG 2.2 SC 3.3.1 Error Identification.', 'Move focus to the first error field or provide an error summary at the top of the form that links to each error per WCAG 2.2 SC 3.3.3 Error Suggestion.', 'Test error handling with NVDA and JAWS screen readers to confirm errors are announced.'],
    reasoning: 'Unclear or invisible error messages prevent people who are blind (screen reader users), people with cognitive disabilities (who may not understand vague error text), and people with low vision (who may not see a small red asterisk) from completing forms. This is a mandatory WCAG 2.2 requirement under SC 3.3.1 and legally enforceable under the DDA 1992.',
    resources: [],
  },
  '1.2-MA-2': {
    actions: ['Engage a professional digital accessibility auditor who tests against WCAG 2.2 Level AA and uses both automated tools and manual testing with assistive technologies.', 'Request that the audit covers all key user journeys: homepage, accessibility page, booking/ticketing, contact forms, and any customer portal.', 'Ensure the auditor includes testing with screen readers (JAWS, NVDA), voice control (Dragon), switch access, and keyboard-only navigation.', 'Request a prioritised remediation report with estimated effort and impact for each issue.'],
    reasoning: 'Automated accessibility testing tools catch only about 30-40% of WCAG issues. Professional audits with real assistive technology reveal barriers that affect people who are blind, have motor impairments, or use alternative input devices. Under the DDA 1992, websites are covered as services, and inaccessible digital experiences constitute discrimination.',
    resources: [],
  },
  // Module 1.3
  '1.3-D-9': {
    actions: ['Add an accessibility requirements field to your group booking form, clearly labelled and positioned prominently.', 'Allow group organisers to specify requirements for multiple attendees (e.g., "3 wheelchair users, 1 Auslan interpreter needed, 2 attendees with dietary requirements").', 'Provide a group accessibility planning resource or checklist the organiser can distribute to group members.', 'Follow up with the group organiser to confirm all accessibility arrangements before the visit.'],
    reasoning: 'Group bookings (school excursions, corporate events, tour groups) often include participants with disability. If the booking process does not capture accessibility requirements at the group level, individual needs may be overlooked. A school group may include a student who uses a wheelchair, and the teacher booking may not think to mention it unless prompted.',
    resources: [],
  },
  '1.3-DD-1a': {
    actions: ['Systematically test each booking step with keyboard-only navigation: date selection, seat/option selection, form fields, payment, and confirmation.', 'Document which specific steps fail or are difficult (e.g., "Date picker requires mouse click", "Seat map not keyboard-navigable").', 'For each failing step, implement a keyboard-accessible alternative or fix the component.', 'Retest after fixes to confirm full keyboard flow completion.'],
    reasoning: 'Identifying the exact failure points in keyboard navigation allows targeted remediation rather than a complete rebuild. A person with motor neurone disease or quadriplegia using a mouth stick, head pointer, or switch may be able to complete most of the booking but get stuck at one step (commonly date pickers or interactive seat maps). Fixing that step unlocks the entire flow.',
    resources: [],
  },
  '1.3-DD-1b': {
    actions: ['Test the complete booking process with NVDA (free screen reader) on Firefox and JAWS on Chrome.', 'Verify that all form fields have accessible names, all buttons have descriptive labels, and all dynamic content changes are announced.', 'Test with Dragon NaturallySpeaking voice control to confirm all interactive elements can be activated by voice.', 'Ensure custom components (calendars, seat maps, accordions) have correct ARIA roles, states, and properties per WCAG 2.2 SC 4.1.2 Name, Role, Value.'],
    reasoning: 'Screen reader and voice control compatibility is mandatory under WCAG 2.2 SC 4.1.2 (Level A). People who are blind rely entirely on screen readers to navigate booking flows. People with motor disabilities may use voice control exclusively. If these tools cannot parse the booking interface, these customers are completely excluded from independent booking.',
    resources: [],
  },
  '1.3-DD-1c': {
    actions: ['Set booking session timeouts to at least 30 minutes per WCAG 2.2 SC 2.2.1 Timing Adjustable.', 'Warn users at least 60 seconds before timeout with an option to extend, and ensure the warning is announced to screen readers.', 'Allow at least 10 extensions or provide an option to disable the timeout entirely.', 'If timeout is unavoidable, save the user\'s progress so they can resume without re-entering data.'],
    reasoning: 'Screen reader users typically take 3-5 times longer to complete web forms than sighted mouse users. People with motor disabilities using switch access may take even longer. A 5-minute timeout that works fine for most users can make booking impossible for someone who is blind or has severe motor impairment. WCAG 2.2 SC 2.2.1 requires adjustable time limits.',
    resources: [],
  },
  '1.3-DD-1d': {
    actions: ['Provide a clear overview of the booking process at the start: how many steps, what information is needed, and estimated completion time.', 'Use a visible progress indicator showing current step and total steps per WCAG 2.2 SC 3.3.8 Accessible Authentication.', 'List required information upfront so customers can gather documents, cards, or details before starting.', 'Offer a downloadable or printable summary of what is needed for the booking process.'],
    reasoning: 'People with cognitive disabilities, anxiety, or fatigue benefit enormously from knowing what to expect before starting a process. Being surprised by unexpected fields or requirements mid-booking can cause confusion, anxiety, and abandonment. Clear instructions also help screen reader users who navigate sequentially and benefit from an overview before diving into form fields.',
    resources: [],
  },
  '1.3-DD-1f': {
    actions: ['Implement a "Save and continue later" feature that preserves all entered data and generates a resumption link or code.', 'Send the resumption link via email so customers can return on a different device or at a different time.', 'Ensure saved data is retained for at least 7 days.', 'If full save functionality is not possible, at minimum do not clear form data when the session expires. Use localStorage or similar to preserve entries.'],
    reasoning: 'People with chronic fatigue, chronic pain, or mental health conditions may need to take breaks during complex processes. People who are blind may need to step away to rest their concentration. Losing all entered data due to a timeout or accidental navigation forces them to start over, which can be physically and emotionally exhausting and may prevent booking completion.',
    resources: [],
  },
  '1.3-DD-1g': {
    actions: ['Test the payment step with keyboard-only navigation and screen readers (NVDA, JAWS, VoiceOver).', 'Ensure the payment iframe (if using Stripe, PayPal, etc.) is keyboard-accessible and its fields are labelled for screen readers.', 'Provide a phone payment alternative for customers who cannot complete online payment.', 'Ensure CAPTCHA on payment pages offers an accessible alternative (audio CAPTCHA or alternative verification) per WCAG 2.2 SC 3.3.8.', 'Confirm that payment confirmation is announced to screen readers and displayed with sufficient contrast.'],
    reasoning: 'Payment is the final and most critical step in booking. If a customer with disability has successfully navigated the entire booking process but cannot complete payment because the payment widget is inaccessible, the entire effort is wasted. This is a mandatory WCAG 2.2 requirement and a DDA 1992 obligation because payment access is a core component of service access.',
    resources: [],
  },
  '1.3-DD-2a': {
    actions: ['Label the accessibility field clearly using plain language: "Accessibility requirements" or "Access needs", not "Special requirements" or "Additional needs."', 'Position the field within the main booking flow, not on a separate page or behind an expand/collapse toggle.', 'Use WCAG 2.2 SC 1.3.5 Identify Input Purpose to ensure the field purpose is programmatically determinable.', 'Test with screen readers to confirm the field label is announced correctly.'],
    reasoning: 'If the accessibility field is hard to find, hidden behind a toggle, or labelled ambiguously, customers with disability may miss it entirely. A person with low vision using magnification may not see a small toggle; a person with a cognitive disability may not understand what "special requirements" means. Clear labelling and prominent placement ensure the field serves its purpose.',
    resources: [],
  },
  '1.3-DD-2b': {
    actions: ['Provide an open-text field alongside any checkbox or dropdown options so customers can describe needs that do not fit predefined categories.', 'Set a generous character limit (at least 500 characters) to accommodate detailed descriptions.', 'Avoid requiring customers to select a "disability type" or category. Many people have multiple or complex needs that do not fit neat boxes.', 'Include example prompts to help customers know what kind of information is useful: "e.g., I use a powered wheelchair and need a space at least 900mm wide" or "I have a hearing dog and need to know about quiet rest areas."'],
    reasoning: 'Predefined checkboxes cannot cover the diversity of disability experiences. A person with chronic fatigue syndrome, a person with a guide dog, or someone recovering from a stroke may have unique needs that no dropdown anticipated. Free-text fields respect autonomy and prevent people from having to force-fit their needs into someone else\'s categories.',
    resources: [],
  },
  '1.3-DD-2c': {
    actions: ['Audit every booking path (online, phone, third-party, in-person) to confirm the accessibility requirements field is present and functional on each.', 'If using a third-party platform that does not support an accessibility field, add it as a post-booking email prompt or callback.', 'Ensure the accessibility field appears for all ticket types and event types, not only those labelled "accessible."', 'Test the field on mobile booking flows to confirm it is visible and usable.'],
    reasoning: 'If the accessibility field only appears on the website but not on the mobile app or third-party platform, customers booking through those channels have no way to communicate their needs. Inconsistent availability means some customers with disability arrive with unprepared venues, leading to exclusion and distress.',
    resources: [],
  },
  '1.3-DD-3b': {
    actions: ['Send an automated confirmation email immediately upon booking that explicitly states: "We have received your accessibility requirements: [repeat their input]."', 'Include the name and contact details of the person who will be actioning their requirements.', 'If the system cannot auto-confirm, ensure a staff member confirms manually within 24 hours.', 'Ensure the confirmation email itself is accessible (plain HTML, good contrast, screen-reader friendly).'],
    reasoning: 'Without confirmation, a person with disability has no way of knowing whether their requirements were received, read, or actioned. This uncertainty is especially stressful for people with high support needs (e.g., needing a hoist, interpreter, or specific seating) where failure to prepare means they cannot participate at all.',
    resources: [],
  },
  '1.3-DD-3c': {
    actions: ['Implement an automated workflow: when an accessibility requirement is submitted, automatically create a task assigned to the accessibility lead or operations team.', 'Set automated acknowledgment emails that confirm receipt within minutes of booking.', 'For complex requirements, trigger a manual follow-up task with a 24-hour deadline.', 'Monitor the workflow monthly to ensure no requests are falling through gaps.'],
    reasoning: 'Manual-only follow-up processes are prone to human error, especially during busy periods. A person with disability whose accessibility request is forgotten experiences the worst possible outcome: arriving expecting adjustments that do not exist. Automated systems ensure consistent processing regardless of staff workload or turnover.',
    resources: [],
  },
  '1.3-DD-3d': {
    actions: ['Ensure booking confirmation emails use semantic HTML, not image-only content, so screen readers can parse them.', 'Test confirmation emails with NVDA to verify all information (booking reference, date, time, accessibility arrangements) is announced.', 'Use sufficient colour contrast (minimum 4.5:1 for text per WCAG 2.2 SC 1.4.3) in email templates.', 'Provide a plain-text alternative for email clients that do not render HTML.', 'Include the accessibility arrangements explicitly in the confirmation: "Accessible seating Row C, Seat 4. Auslan interpreter confirmed."'],
    reasoning: 'A booking confirmation that a person who is blind cannot read, or that does not mention the accessibility arrangements they requested, fails to provide equivalent service. Accessible confirmations give customers with disability the same confidence as any other customer that their booking is correct and their needs will be met.',
    resources: [],
  },
  '1.3-DD-3e': {
    actions: ['Create an automated email triggered by accessibility requirement submission that includes: your accessibility page link, relevant transport information, social story (if available), and contact details for questions.', 'Personalise where possible: if a customer mentions wheelchair use, include parking and entrance details; if they mention hearing needs, include hearing loop information.', 'Ensure the automated email itself is accessible (plain HTML, alt text on images, good contrast).'],
    reasoning: 'Proactively sending relevant accessibility information after a customer indicates requirements demonstrates that the venue is prepared and welcoming. This reduces the information-gathering burden on people with disability, who often spend significant time researching venues. It is particularly valuable for people with cognitive disabilities who may not know what questions to ask.',
    resources: [],
  },
  '1.3-DD-4b': {
    actions: ['Include accessibility request handling in staff induction and ongoing training programs.', 'Cover common scenarios: how to action a wheelchair bay request, how to arrange Auslan interpretation, how to prepare for a customer with a guide dog, how to respond to dietary requirements linked to disability.', 'Teach staff to ask clarifying questions respectfully ("Could you tell me more about what would make your visit comfortable?") rather than making assumptions.', 'Ensure staff understand that accessibility requests should be treated with the same urgency as any VIP or special event request.'],
    reasoning: 'Untrained staff may misinterpret accessibility requests, apply stereotypes, or delay action because they are unsure what to do. A customer who writes "I need a quiet space" may have autism, anxiety, PTSD, or chronic pain. Staff trained to explore needs without assumptions can deliver appropriate support. Mishandled requests can cause distress and constitute discrimination under the DDA 1992.',
    resources: [],
  },
  '1.3-DD-4c': {
    actions: ['Create a documented escalation pathway: if a request cannot be met, who decides, what alternatives can be offered, and how is the customer informed.', 'Set a maximum response time of 24 hours for escalated requests.', 'Train staff to offer alternatives rather than simply declining: "We cannot provide a portable hearing loop for that area, but we can seat you near the built-in loop in the main hall."', 'Log escalated requests to identify systemic gaps that may justify investment in new equipment or adjustments.'],
    reasoning: 'When an accessibility request cannot be met and there is no escalation process, the customer is simply told "no." Under the DDA 1992, venues must make reasonable adjustments. An escalation process ensures someone with authority considers whether an adjustment is reasonable before declining. This protects both the customer\'s rights and the organisation\'s legal position.',
    resources: [],
  },
  '1.3-DD-5b': {
    actions: ['Use role="alert" or aria-live="assertive" on error message containers so screen readers announce errors automatically when they appear.', 'Test with NVDA on Firefox and JAWS on Chrome to confirm errors are announced immediately upon form submission.', 'Ensure error messages are not conveyed solely through visual changes (colour, border) that screen readers cannot detect.', 'After announcing errors, move programmatic focus to the first error field or the error summary.'],
    reasoning: 'A screen reader user who submits a form with errors may not know anything went wrong if errors are only displayed visually. They may submit the form repeatedly, growing more frustrated each time. This is a mandatory WCAG 2.2 SC 4.1.3 Status Messages requirement (Level AA) and directly affects people who are blind or have severe low vision.',
    resources: [],
  },
  '1.3-DD-5c': {
    actions: ['Create a plain language version of booking instructions, aiming for Year 6 reading level, using the Hemingway Editor or similar readability tool.', 'Consider creating an Easy Read version with simple sentences, clear images, and step-by-step visual instructions for the booking process.', 'Use short sentences, common words, and define any technical terms.', 'Test readability with people with intellectual disability or acquired brain injury.'],
    reasoning: 'Approximately 2.9% of Australians have an intellectual disability, and many more have acquired brain injuries, low literacy, or English as a second language. Complex booking instructions with jargon, long sentences, or assumed knowledge exclude these people from independent participation. Plain language benefits everyone but is essential for people with cognitive disabilities.',
    resources: [],
  },
  '1.3-DD-6b': {
    actions: ['Ensure the phone booking option offers the same ticket types, pricing, and seating options as the online system.', 'Do not charge extra for phone bookings or impose longer processing times.', 'Train staff to avoid language that implies the customer "should" use the online system instead.', 'Monitor booking completion rates by channel to identify if alternative methods are underperforming.'],
    reasoning: 'If the phone booking alternative involves longer waits, fewer options, or surcharges, it is not an equivalent service. Under the DDA 1992, people with disability must be able to access the same services on the same terms. A person who is blind should not pay more or get fewer choices simply because the website is inaccessible.',
    resources: [],
  },
  '1.3-DD-6c': {
    actions: ['Offer live chat or callback during all booking hours for customers who need real-time assistance.', 'Ensure the live chat is accessible: keyboard-operable, screen-reader compatible, with sufficient contrast per WCAG 2.2 SC 1.4.3.', 'Train chat/phone staff to walk customers through the booking process step by step without rushing.', 'Consider co-browsing tools that allow staff to assist customers directly within the booking interface.'],
    reasoning: 'Some customers with disability can use an online booking system but need occasional help at specific steps (e.g., selecting accessible seating, applying a companion ticket). Real-time assistance at the point of need prevents abandonment and reduces the burden on customers with cognitive disabilities, low digital literacy, or vision impairments.',
    resources: [],
  },
  '1.3-DD-7b': {
    actions: ['Review your booking platform documentation and admin settings for accessibility-related configuration options (accessible ticket types, custom fields, companion tickets).', 'If configuration options exist but are not enabled, activate and test them.', 'If configuration is limited, check whether the platform API allows custom accessibility features to be built.', 'Document which accessibility features are configurable and which are not, to inform future procurement decisions.'],
    reasoning: 'Many booking platforms have accessibility features that are disabled by default or buried in settings. A venue may be paying for a platform that supports companion ticketing or accessible seating maps but never activated those features. Reviewing configuration options can unlock significant accessibility improvements without changing platforms.',
    resources: [],
  },
  '1.3-DD-7c': {
    actions: ['Conduct an accessibility audit of your booking platform (or request the vendor\'s VPAT/accessibility conformance report).', 'Document specific limitations: which steps are not keyboard-accessible, which elements lack screen reader labels, whether the seat map is accessible.', 'Report limitations to the vendor formally in writing and request a remediation timeline.', 'Develop workarounds for each identified limitation (e.g., phone booking option for steps that are not accessible online).'],
    reasoning: 'Identifying specific platform limitations allows the venue to provide appropriate alternatives and hold vendors accountable. Under the DDA 1992, the venue is responsible for ensuring booking services are accessible, regardless of which vendor provides the technology. Documented limitations also support procurement decisions when contracts are renewed.',
    resources: [],
  },
  '1.3-DD-7d': {
    actions: ['Add WCAG 2.2 Level AA conformance as a mandatory requirement in procurement criteria for booking systems.', 'Require vendors to provide a current VPAT or accessibility conformance report as part of their tender response.', 'Include accessibility testing (with real users) as part of the platform evaluation process.', 'Add accessibility maintenance and remediation SLAs to vendor contracts.', 'Reference the Australian Government\'s Digital Service Standard, which mandates WCAG 2.2 conformance.'],
    reasoning: 'Procurement is the most effective leverage point for digital accessibility. If accessibility is not in the requirements, vendors have no incentive to address it. Including WCAG 2.2 conformance in procurement protects people with disability from being excluded by future platform choices and aligns with DDA 1992 obligations to prevent foreseeable discrimination.',
    resources: [],
  },
  '1.3-DD-8b': {
    actions: ['Offer a free or discounted companion ticket that can be booked through the same process as the primary ticket.', 'Do not require proof of disability to book a companion ticket. Accept self-identification per the social model of disability.', 'Ensure companion tickets are available for the same events and sessions as standard tickets, not limited to specific performances.', 'Allow companion tickets to be booked online without requiring a phone call or email.'],
    reasoning: 'Many people with disability attend venues with a support worker, carer, or companion who provides essential assistance. Charging full price for a companion ticket effectively doubles the cost for the person with disability. The Australian Human Rights Commission has found that failing to provide companion tickets can constitute indirect discrimination under the DDA 1992.',
    resources: [],
  },
  '1.3-DD-8c': {
    actions: ['Publish accessible ticket and seating pricing alongside standard pricing on your website.', 'Ensure accessible options are not more expensive than equivalent standard options.', 'If accessible seating is in a premium area (e.g., front rows for lip-reading or sign language visibility), price it at the standard rate.', 'Clearly explain any pricing differences and the rationale.'],
    reasoning: 'Non-transparent or inflated pricing for accessible options is a form of disability discrimination. A person who uses a wheelchair should not pay more because the only wheelchair bays are in a premium section. Transparent pricing demonstrates fairness and helps people with disability budget for outings, which is especially important given the high cost of living with disability in Australia.',
    resources: [],
  },
  '1.3-DD-8d': {
    actions: ['Ensure accessible booking options (wheelchair bays, hearing loop seats, companion tickets) are available through the same online interface as standard bookings.', 'Do not require customers with disability to email, call, or visit in person to book accessible options if online booking is available for standard tickets.', 'Ensure the number of steps and amount of information required is equivalent for accessible and standard bookings.', 'Test the accessible booking flow against the standard flow and aim for parity in completion time.'],
    reasoning: 'Under the DDA 1992, people with disability must be able to access services on the same terms as others. A booking process that requires a wheelchair user to phone during business hours while everyone else books online 24/7 is not equivalent service. It imposes additional time cost and restricts when the person can book.',
    resources: [],
  },
  '1.3-DD-8e': {
    actions: ['Ensure promotional codes, early-bird pricing, group discounts, and package deals apply equally to accessible ticket types.', 'Test promotional campaigns to confirm accessible options are included in the promotion scope.', 'If a promotion is limited to online bookings and your accessible booking requires a phone call, extend the promotion to phone bookings.', 'Monitor whether customers with disability are accessing promotional offers at similar rates to other customers.'],
    reasoning: 'Excluding accessible bookings from promotions means people with disability consistently pay more or miss out on deals. This compounds the disability cost gap (estimated at $16,000+ per year in Australia). If everyone else gets a 20% early-bird discount but wheelchair bay bookings are not included, that is indirect discrimination under the DDA 1992.',
    resources: [],
  },
  '1.3-DD-8f': {
    actions: ['Ensure the "modify booking" and "cancel booking" functions in your online system work for accessible booking types.', 'Test modification and cancellation with keyboard navigation and screen readers.', 'Do not require customers to phone to modify accessible bookings if standard bookings can be modified online.', 'Provide clear, accessible instructions for how to modify or cancel.'],
    reasoning: 'People with disability may need to change plans due to health fluctuations, support worker availability, or changes in access needs. If they cannot modify or cancel independently online, they bear an additional burden compared to other customers. Independence and control over one\'s own bookings are fundamental to dignity and autonomy.',
    resources: [],
  },
  '1.3-DD-8g': {
    actions: ['Add a clause to your cancellation policy acknowledging that disability-related circumstances (health crises, support worker cancellations, flare-ups) may require last-minute changes.', 'Offer flexible cancellation (full refund or credit) when disability-related circumstances arise, even if the standard policy would not allow it.', 'Train staff to apply this policy consistently and without requiring medical evidence.', 'Publish the flexible cancellation policy on your accessibility page.'],
    reasoning: 'Chronic conditions fluctuate unpredictably. A person with multiple sclerosis, chronic fatigue syndrome, or a mental health condition may be unable to attend on the day despite planning for weeks. Rigid cancellation policies that penalise disability-related cancellations disproportionately affect people with disability and may constitute indirect discrimination under the DDA 1992.',
    resources: [],
  },
  '1.3-PC-1': {
    actions: ['Test the entire booking flow using only the Tab, Enter, Space, and Arrow keys (no mouse) per WCAG 2.2 SC 2.1.1 Keyboard.', 'Verify that focus is visible on every interactive element (buttons, links, form fields, dropdowns) per WCAG 2.2 SC 2.4.7 Focus Visible.', 'Ensure custom widgets (date pickers, seat selectors, carousels) are keyboard-operable with appropriate ARIA roles.', 'Test with both Chrome and Firefox on Windows, as keyboard handling can differ between browsers.', 'Fix any keyboard traps where focus gets stuck in a component per WCAG 2.2 SC 2.1.2 No Keyboard Trap.'],
    reasoning: 'Keyboard accessibility is fundamental because it underpins screen reader use, switch access, voice control, and sip-and-puff devices. People with motor disabilities who cannot use a mouse, people who are blind using JAWS or NVDA, and people with RSI all depend on keyboard operability. This is a mandatory WCAG 2.2 Level A requirement and enforceable under the DDA 1992.',
    resources: [],
  },
  '1.3-PC-2': {
    actions: ['Add a clearly labelled "Accessibility requirements" or "Access needs" open-text field to your booking form, placed before the final confirmation step.', 'Use inclusive framing: "Do you have any accessibility requirements we should know about to make your visit comfortable?" rather than medical language.', 'Ensure the field is optional and does not block booking completion if left empty.', 'Store accessibility requirements securely and in compliance with the Australian Privacy Principles, sharing only with staff who need to know.'],
    reasoning: 'Inviting customers to share accessibility requirements at booking time allows the venue to prepare adjustments in advance, preventing on-arrival surprises. People who use wheelchairs can have accessible seating reserved; people who are Deaf can have Auslan interpreters arranged; people with dietary requirements linked to disability can have meals prepared.',
    resources: [],
  },
  '1.3-PC-3': {
    actions: ['Establish a follow-up process: contact the customer within 48 hours of booking to confirm their accessibility requirements have been received, understood, and will be actioned.', 'Ask clarifying questions if needed, but avoid making the customer repeat information they have already provided.', 'Confirm specific arrangements: "We have reserved an accessible seating bay for you in Row C" rather than "We have noted your requirements."', 'Send a reminder communication 24-48 hours before the visit confirming arrangements are in place.'],
    reasoning: 'Follow-up communication reduces anxiety for people with disability who may be uncertain whether their needs will actually be met. A person who uses a hoist and requested a hoist-equipped accessible toilet needs to know that equipment will be ready. Confirmation also allows customers to correct misunderstandings before arrival, preventing on-the-day failures.',
    resources: [],
  },
  '1.3-PC-4': {
    actions: ['Assign a specific role or person responsible for reviewing accessibility requests from bookings daily.', 'Ensure this person has authority to make arrangements (reserve accessible seating, book interpreters, notify catering) without requiring additional approval.', 'Create a workflow: booking received with accessibility note, assign to accessibility lead, action within 24 hours, confirm back to customer.', 'Include accessibility request review in the daily operations checklist.'],
    reasoning: 'Accessibility requests that sit unread in a booking system help no one. A person who has requested Auslan interpretation and receives no confirmation may arrive to find no interpreter. Clear responsibility ensures requests are actioned, adjustments are made, and customers with disability receive the same quality of advance preparation as any other customer.',
    resources: [],
  },
  '1.3-PC-5': {
    actions: ['Display error messages in text (not just colour) adjacent to the field that has an error per WCAG 2.2 SC 3.3.1 Error Identification.', 'Include specific instructions on how to fix each error (e.g., "Date must be in DD/MM/YYYY format") per WCAG 2.2 SC 3.3.3 Error Suggestion.', 'Provide an error summary at the top of the form linking to each error field.', 'Use aria-invalid and aria-describedby to associate errors with form fields for screen reader users.', 'Do not clear correctly entered data when an error occurs elsewhere in the form.'],
    reasoning: 'Unhelpful error messages like "Please fix the errors above" or colour-only error indicators exclude people who are blind, colour-blind, or have cognitive disabilities. Clear, specific error messages are mandatory under WCAG 2.2 SC 3.3.1 (Level A) and enable all users to successfully complete bookings without frustration or repeated failures.',
    resources: [],
  },
  '1.3-PC-6': {
    actions: ['Offer at least two booking methods (e.g., online and phone) so people who cannot use one method have an alternative.', 'Ensure the alternative method provides equivalent functionality: same ticket types, same pricing, same accessibility options.', 'Promote alternative booking methods alongside the primary method, not as a hidden backup.', 'Train staff on the phone booking process so they can assist customers who need help navigating options.', 'Consider offering in-person booking for local customers who cannot use digital or phone channels.'],
    reasoning: 'Online booking systems may be inaccessible to people who are blind (if the system is not screen-reader compatible), people with motor disabilities (if it requires precise mouse movements), or people with intellectual disabilities (if it is too complex). The DDA 1992 requires equivalent service, meaning alternative booking methods must be genuine alternatives, not inferior workarounds.',
    resources: [],
  },
  '1.3-PC-7': {
    actions: ['If using a third-party booking platform, request their VPAT (Voluntary Product Accessibility Template) or accessibility conformance statement.', 'Test the third-party platform independently against WCAG 2.2 Level AA using keyboard navigation, screen readers, and mobile devices.', 'Document any accessibility gaps in the third-party platform and raise them formally with the vendor, requesting a remediation timeline.', 'If the third-party platform has significant barriers, provide an accessible alternative booking path (e.g., direct phone booking with equivalent options).'],
    reasoning: 'Under the DDA 1992, the venue (not the software vendor) bears responsibility for ensuring booking services are accessible. If a third-party ticketing platform cannot be operated by a screen reader user, the venue must provide an equivalent alternative. Many major ticketing platforms have known accessibility issues that venues should not assume are resolved.',
    resources: [],
  },
  '1.3-PC-8': {
    actions: ['Integrate accessible ticket types (wheelchair bay, companion seat, hearing loop zone) into the standard booking flow rather than requiring a separate phone call or email.', 'Show accessible seating on the same seat map as other options, clearly labelled with the International Symbol of Access.', 'Allow customers to independently select accessible options without staff approval or verification of disability.', 'Ensure accessible ticket categories are available from the first moment tickets go on sale, not reserved for later manual allocation.'],
    reasoning: 'Requiring customers with disability to use a different, often more cumbersome booking process is discriminatory under the DDA 1992. A wheelchair user should be able to book an accessible bay at 9am on the same ticketing platform as everyone else, not join a separate phone queue. Equivalent access to the booking process is a fundamental right.',
    resources: [],
  },
  '1.3-PC-9': {
    actions: ['Test the booking process on iOS VoiceOver (Safari) and Android TalkBack (Chrome) to confirm mobile screen reader compatibility.', 'Ensure touch targets are at least 24x24 CSS pixels per WCAG 2.2 SC 2.5.8 Target Size (Minimum).', 'Test at 200% zoom on mobile to confirm content remains usable without horizontal scrolling per WCAG 2.2 SC 1.4.10 Reflow.', 'Verify that mobile gestures (swipe, pinch) do not block access to functionality; provide alternatives per WCAG 2.2 SC 2.5.1 Pointer Gestures.'],
    reasoning: 'Many people with disability use mobile devices as their primary technology, often with assistive features enabled. People with vision impairments use VoiceOver or TalkBack; people with motor disabilities may use voice control or switch access on tablets. A booking process that only works on desktop with a mouse excludes these users.',
    resources: [],
  },
  // Module 1.4
  '1.4-D-9': {
    actions: ['Provide a full text transcript for every podcast episode and audio guide, published alongside the audio per WCAG 2.2 SC 1.2.1 Audio-only and Video-only (Prerecorded).', 'Include speaker identification, timestamps, and descriptions of significant non-speech audio in transcripts.', 'Publish transcripts in accessible HTML (not scanned image PDFs) on the same page as the audio player.', 'Ensure transcripts are easy to find: place a visible "Read transcript" link directly below the audio player.', 'If budget is limited, use AI transcription with mandatory human review to ensure accuracy.'],
    reasoning: 'Transcripts are essential for people who are Deaf or hard of hearing, people with auditory processing disorders, and people in situations where they cannot play audio. They also benefit people with cognitive disabilities who process written text better than spoken words, and people who are not native English speakers. WCAG 2.2 SC 1.2.1 makes this a Level A requirement.',
    resources: [],
  },
  '1.4-DD-1a': {
    actions: ['Transition from auto-generated captions to human-reviewed captions for all published video content.', 'If budget constrains full human captioning, use AI-generated captions as a starting point and have a staff member review and correct every video before publishing.', 'For high-priority content (promotional videos, instructional content), commission professional captioning services.', 'Establish a quality standard: maximum 1% error rate, correct speaker identification, and synchronisation within 1 second.'],
    reasoning: 'Auto-generated captions have significant error rates, especially with Australian accents, background noise, technical terminology, or multiple speakers. Errors can change meaning entirely, misleading Deaf viewers. A caption that reads "free parking" instead of "street parking" could send a wheelchair user to the wrong location. Human review ensures accuracy.',
    resources: [],
  },
  '1.4-DD-1b': {
    actions: ['Include speaker identification in captions when multiple people are speaking (e.g., "[Sarah]:" or "[Interviewer]:").', 'Describe relevant sounds that convey meaning: [applause], [phone rings], [alarm sounding], [background music playing].', 'Follow the Australian Captioning Guidelines from Media Access Australia for formatting standards.', 'Ensure sound descriptions are placed in context so Deaf viewers understand the significance (e.g., "[fire alarm sounding]" not just "[alarm]").'],
    reasoning: 'Captions that only transcribe speech miss critical audio information. A Deaf viewer watching a promotional video needs to know that triumphant music is playing, that the audience is cheering, or that a doorbell sound indicates someone arriving. Without sound descriptions, the emotional and informational content is incomplete, degrading the viewing experience.',
    resources: [],
  },
  '1.4-DD-1c': {
    actions: ['Review caption synchronisation: captions should appear no more than 1 second before or after the corresponding audio.', 'Check that captions do not overlap with on-screen text, graphics, or speaker faces.', 'Ensure captions remain on screen long enough to be read (minimum 1 second per line, longer for complex text).', 'Test with the video muted to confirm captions alone convey the full spoken content.'],
    reasoning: 'Poorly synchronised captions are confusing and can cause Deaf or hard of hearing viewers to miss context. If captions appear too early, they spoil the narrative; too late, and viewers cannot follow the conversation. For people with auditory processing disorders who use captions alongside audio, desynchronisation creates cognitive conflict.',
    resources: [],
  },
  '1.4-DD-1d': {
    actions: ['Use sans-serif fonts (Arial, Helvetica) for captions at a minimum size of 22px on standard video players.', 'Ensure caption text has a solid or semi-transparent background for contrast (white text on dark background or vice versa), meeting WCAG 2.2 SC 1.4.3 minimum 4.5:1 contrast ratio.', 'Avoid all-caps captions as they are harder to read for people with dyslexia.', 'Position captions in the lower third of the screen, clear of speaker faces and important visual content.'],
    reasoning: 'Captions that are small, low-contrast, or overlap with visual content are unreadable for people with low vision, dyslexia, or cognitive disabilities who rely on them. Good caption formatting ensures that the 3.6 million Australians with hearing loss and many others who use captions can actually read and benefit from them.',
    resources: [],
  },
  '1.4-DD-3d': {
    actions: ['Before reposting or sharing content across platforms, verify that alt text transfers correctly (it often does not between Instagram, Facebook, and Twitter/X).', 'When sharing user-generated content, add alt text if the original post lacks it.', 'Create a social media checklist that includes "verify alt text preserved" as a step in the sharing workflow.', 'Test by viewing shared posts with a screen reader to confirm alt text is announced.'],
    reasoning: 'Alt text is frequently stripped when content moves between social media platforms. A carefully crafted image description on Instagram may disappear when the post is shared to Facebook. People who are blind lose access to the image content despite the original creator having done the right thing. Verification ensures accessibility survives cross-platform sharing.',
    resources: [],
  },
  '1.4-DD-3e': {
    actions: ['Ensure text overlaid on images has a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text per WCAG 2.2 SC 1.4.3 Contrast (Minimum).', 'Use a contrast checker tool (e.g., WebAIM Contrast Checker, Colour Contrast Analyser by TPGi) to verify.', 'Add a solid or semi-transparent background behind text to ensure readability regardless of the underlying image.', 'Avoid placing text over busy or textured image areas.'],
    reasoning: 'Text overlaid on images without sufficient contrast is unreadable for people with low vision, colour blindness, or age-related vision decline. Social media posts often use white text over light photographs, which can be completely invisible to someone with moderate vision impairment. Approximately 575,000 Australians have low vision.',
    resources: [],
  },
  '1.4-DD-3f': {
    actions: ['Add unique, descriptive alt text to each image in a carousel or multi-image post, not just the first image.', 'Describe what each image shows in context of the post (e.g., "Slide 3 of 5: Accessible toilet with grab rails and emergency cord").', 'Test carousel navigation with VoiceOver (iOS) and TalkBack (Android) to confirm all images and their alt text are accessible.', 'If the platform does not support per-image alt text in carousels, add descriptions in the post caption in order.'],
    reasoning: 'Carousel posts are increasingly common on social media, but screen readers may only access the first image\'s alt text or skip carousel images entirely on some platforms. People who are blind miss the majority of content in a multi-image post unless each image has its own description. This is especially problematic for informational carousels that convey step-by-step instructions.',
    resources: [],
  },
  '1.4-DD-4b': {
    actions: ['Disable video autoplay on your website. If autoplay is essential for design, ensure videos start muted per WCAG 2.2 SC 1.4.2 Audio Control.', 'Provide a clearly visible, keyboard-accessible pause button that appears immediately when autoplay begins.', 'If video plays automatically for more than 5 seconds, provide a mechanism to pause, stop, or hide it per WCAG 2.2 SC 2.2.2 Pause, Stop, Hide.', 'On social media, follow platform-specific settings to minimise autoplay impact.'],
    reasoning: 'Autoplaying videos with sound can cause distress for people with anxiety, PTSD, or sensory processing differences. They can interfere with screen readers, drowning out the synthesised speech that a blind person relies on. Moving video can distract people with ADHD or cognitive disabilities. WCAG 2.2 SC 1.4.2 (Level A) requires user control over audio that plays automatically.',
    resources: [],
  },
  '1.4-DD-5b': {
    actions: ['Display content warnings as the first frame or overlay before the video plays, not buried in the description below.', 'Use clear, specific language: "Content warning: This video contains flashing lights between 1:30 and 2:00."', 'Provide a mechanism to skip the warned content and jump to a safe point in the video.', 'For social media posts, place the content warning in the first line of the caption, before the "see more" fold.'],
    reasoning: 'A content warning in the video description is useless if the person has already pressed play and been exposed to the triggering content. For someone with photosensitive epilepsy, exposure to flashing lights before seeing a warning could trigger a seizure. Warnings must appear before the content begins to be effective as a protective measure.',
    resources: [],
  },
  '1.4-DD-5c': {
    actions: ['Use the Photosensitive Epilepsy Analysis Tool (PEAT) or Harding Test to analyse videos for flashing content per WCAG 2.2 SC 2.3.1 Three Flashes or Below Threshold.', 'Remove or reduce any content that flashes more than 3 times per second or covers more than 25% of the screen.', 'Apply this testing to all published video content, not just content you suspect might flash.', 'Brief videographers and editors on flash thresholds before production.'],
    reasoning: 'Flashing or strobing content can trigger photosensitive epileptic seizures, which can be life-threatening. WCAG 2.2 SC 2.3.1 (Level A) strictly limits flashing content. In 1997, a Japanese TV broadcast caused seizures in over 600 viewers. Even mild flashing can cause discomfort for people with migraine, vestibular disorders, or visual sensitivity. This is a mandatory safety requirement.',
    resources: [],
  },
  '1.4-DD-6b': {
    actions: ['Adopt the Australian Government Style Manual and People with Disability Australia language guidance for all video scripts and social media copy.', 'Use "person with disability" (person-first) or "disabled person" (identity-first) based on community preference. Avoid "differently abled", "handicapped", "suffers from", or "confined to a wheelchair."', 'Focus on what people do, not their disability: "Sarah, who uses a wheelchair, enjoyed the gallery" not "Despite being wheelchair-bound, Sarah visited the gallery."', 'Have people with disability review scripts for language before production.'],
    reasoning: 'Language shapes attitudes. Outdated or pitying language reinforces stereotypes and signals that the organisation views disability as a deficit rather than a form of human diversity. For people with disability, encountering disrespectful language in marketing is alienating and can deter engagement. Inclusive language demonstrates organisational maturity and respect.',
    resources: [],
  },
  '1.4-DD-8b': {
    actions: ['Write all hashtags in CamelCase (e.g., #AccessibleTravel not #accessibletravel) so screen readers announce each word separately.', 'Audit existing hashtag libraries and update any that are not in CamelCase.', 'Include CamelCase hashtag formatting in your social media style guide.', 'Train all social media staff on this practice and its importance.'],
    reasoning: 'Screen readers read hashtags as single strings. #accessibletraveltips is announced as one unintelligible word, while #AccessibleTravelTips is announced as three separate words. For the approximately 575,000 Australians who are blind or have low vision and use screen readers, CamelCase hashtags are the difference between comprehension and gibberish.',
    resources: [],
  },
  '1.4-DD-8c': {
    actions: ['Place emojis at the end of text, not between words or as bullet point replacements.', 'Limit emoji use to 1-3 per post. Each emoji is announced by its full name by screen readers (e.g., "smiling face with open mouth and smiling eyes").', 'Never use emojis to convey essential meaning that is not also stated in text.', 'Test how your posts sound with VoiceOver or NVDA to understand the screen reader experience.'],
    reasoning: 'Screen readers announce every emoji by its full descriptive name. A post with 10 emojis scattered throughout becomes an exhausting auditory experience for a blind person: "Fire emoji party popper emoji star-struck face emoji..." placed between words disrupts sentence comprehension. Grouping emojis at the end keeps the text content clean and accessible.',
    resources: [],
  },
  '1.4-PC-1': {
    actions: ['Add accurate captions to all pre-recorded video content. Use human review rather than relying solely on auto-generated captions, which typically have 10-15% error rates.', 'Ensure captions include speaker identification and descriptions of relevant sound effects per WCAG 2.2 SC 1.2.2 Captions (Prerecorded).', 'Use closed captions (CC) rather than open captions (burned in) so users can toggle them on/off and adjust styling.', 'For live video content, use real-time captioning services (CART or AI-assisted with human correction).', 'Test captions for synchronisation: they should appear within 1 second of the corresponding audio.'],
    reasoning: 'Captions are essential for people who are Deaf or hard of hearing (approximately 3.6 million Australians). They also benefit people with auditory processing disorders, people in noisy environments, and non-native English speakers. WCAG 2.2 SC 1.2.2 makes pre-recorded captions a Level A requirement, and the DDA 1992 covers digital content as a service.',
    resources: [],
  },
  '1.4-PC-2': {
    actions: ['Add audio descriptions to videos where important visual content is not conveyed by the existing audio track per WCAG 2.2 SC 1.2.5 Audio Description (Prerecorded).', 'Describe visual elements such as on-screen text, scene changes, facial expressions, and actions that are not otherwise narrated.', 'For simple videos, consider extended audio description or a supplementary described version.', 'If audio description is not feasible for all content, prioritise high-traffic and key informational videos first.', 'Use Australian audio description guidelines from Audio Description Australia.'],
    reasoning: 'Audio descriptions are essential for people who are blind or have significant low vision. Without descriptions, a video showing venue features, wayfinding routes, or promotional content conveys nothing meaningful. WCAG 2.2 SC 1.2.5 makes this a Level AA requirement for pre-recorded video content.',
    resources: [],
  },
  '1.4-PC-3': {
    actions: ['Write alt text for every image posted on social media that describes the image content and context (not just "photo of event").', 'Use the built-in alt text feature on platforms (Instagram, Twitter/X, Facebook, LinkedIn) rather than adding descriptions in the post body.', 'For complex images (infographics, charts), provide a detailed description in the post text or a linked accessible document.', 'Train social media managers on writing effective alt text: be specific, concise (under 150 characters where possible), and describe function not just appearance.'],
    reasoning: 'Social media images without alt text are invisible to people who are blind or have severe low vision using screen readers. They hear "image" or nothing at all. This excludes them from engaging with promotional content, event announcements, and community-building posts. Alt text also helps people with slow internet connections or data limits.',
    resources: [],
  },
  '1.4-PC-4': {
    actions: ['Ensure embedded video players are keyboard-accessible: play/pause, volume, fullscreen, and caption toggle must all work with Tab, Enter, and Space keys per WCAG 2.2 SC 2.1.1.', 'Verify that custom video players expose controls to screen readers with appropriate ARIA labels.', 'Avoid autoplay. If autoplay is used, ensure the video starts muted and a visible pause button is immediately accessible per WCAG 2.2 SC 1.4.2 Audio Control.', 'Test video playback with Dragon NaturallySpeaking to confirm voice control users can operate all controls.'],
    reasoning: 'Video players that require mouse interaction exclude people with motor disabilities who use keyboards, switch devices, or voice control. People who are blind need screen readers to announce player controls and state (playing/paused). Without accessible controls, these users cannot access video content at all, regardless of whether it has captions or audio descriptions.',
    resources: [],
  },
  '1.4-PC-5': {
    actions: ['Add content warnings before videos that include: flashing/strobing, loud or sudden sounds, distressing imagery, depictions of medical procedures, or crowded/chaotic scenes.', 'Use text-based warnings that appear before the video plays, not just in the video description below.', 'Provide specific warnings rather than generic "content warning" labels: "This video contains flashing lights during the concert sequence."', 'Allow users to skip directly to content after the potentially triggering segment.'],
    reasoning: 'Content warnings protect people with photosensitive epilepsy (flashing content can trigger seizures), people with PTSD or anxiety disorders (distressing imagery can trigger episodes), people with hyperacusis or sensory processing differences (loud sounds can cause pain), and autistic people who may become overwhelmed by unexpected sensory input.',
    resources: [],
  },
  '1.4-PC-6': {
    actions: ['Audit your current marketing and social media imagery for disability representation. If absent, commit to including people with visible and invisible disabilities.', 'Feature people with disability as active participants (customers enjoying your venue) rather than passive recipients of help.', 'Source imagery from disability-inclusive stock libraries (e.g., Disability:IN, Center for Disability Rights image library) or photograph real customers with their consent.', 'Ensure representation covers diverse disabilities: mobility, vision, hearing, cognitive, psychosocial, not just wheelchair users.'],
    reasoning: 'When people with disability never see themselves in your marketing, they receive a clear message: "This place is not for you." Inclusive representation signals welcome and belonging. It also challenges harmful stereotypes and normalises disability as part of everyday life, benefiting the 4.4 million Australians with disability and their families and friends.',
    resources: [],
  },
  '1.4-PC-7': {
    actions: ['For live streams and webinars, provide real-time captioning (CART services or AI-assisted with human correction).', 'Enable Auslan interpretation for live content reaching large audiences, displayed in a visible signing window.', 'Ensure live chat or Q&A features are keyboard-accessible and screen-reader compatible.', 'Provide a recorded, fully captioned version after the live event for people who could not participate in real time.', 'Test the live platform (Zoom, YouTube Live, etc.) for screen reader compatibility before the event.'],
    reasoning: 'Live content without real-time accessibility excludes people who are Deaf (no captions), people who are blind (inaccessible chat), and people with cognitive disabilities (no replay option). Live events are increasingly important for community engagement and marketing, and excluding people with disability from real-time participation undermines inclusion efforts.',
    resources: [],
  },
  // Module 1.5
  '1.5-DD-1a': {
    actions: ['Run your website content through the Hemingway Editor (hemingwayapp.com) or Readable (readable.com) to get a readability score.', 'Aim for a Flesch-Kincaid Grade Level of 8 or below (equivalent to Year 8 reading level).', 'Prioritise testing on high-traffic pages: homepage, accessibility page, booking page, contact page.', 'Set a readability target in your content guidelines and test all new content before publishing.'],
    reasoning: 'Without objective testing, content creators tend to write at their own reading level, which for university-educated staff is often Year 12+. This excludes the 44% of Australians with limited literacy, people with intellectual disabilities, acquired brain injuries, and those for whom English is a second language. Readability tools provide objective measurement.',
    resources: [],
  },
  '1.5-DD-1b': {
    actions: ['Create or update your content style guide to include: readability targets, plain language principles, disability language guidance, alt text requirements, and heading structure rules.', 'Include examples of good and poor accessible writing.', 'Make the style guide accessible and easily available to all content creators.', 'Review the style guide annually against updated accessibility standards and community preferences.'],
    reasoning: 'Without documented guidelines, accessible writing depends on individual knowledge and motivation, which varies across teams and staff turnover. A style guide creates a consistent baseline, ensuring all content meets minimum accessibility standards. This benefits people with cognitive disabilities who need consistency and people with vision impairments who rely on proper heading structures.',
    resources: [],
  },
  '1.5-DD-1c': {
    actions: ['Provide plain language and accessible writing training for all staff who create public-facing content (web, social media, brochures, emails).', 'Include practical exercises: rewriting complex sentences, creating alt text, structuring content with headings.', 'Offer refresher sessions annually and require training for new content team members.', 'Consider Australian providers such as the Centre for Inclusive Design, Media Access Australia, or the Plain English Foundation.'],
    reasoning: 'Training transforms knowledge into practice. Most content creators have never been taught plain language techniques or accessible writing. Training helps them understand the real-world impact of complex language on people with cognitive disabilities and dyslexia, and builds skills that improve all content quality, not just accessibility.',
    resources: [],
  },
  '1.5-DD-2a': {
    actions: ['Provide disability language training based on the People with Disability Australia (PWDA) language guide.', 'Cover: person-first vs identity-first language, outdated terms to avoid, respectful ways to discuss disability, and the social model of disability.', 'Include people with disability as trainers or co-facilitators to provide authentic perspective.', 'Make training mandatory for all customer-facing and content-creating staff.'],
    reasoning: 'Language training prevents well-meaning staff from using harmful terms that alienate customers with disability. Terms like "wheelchair-bound", "mentally retarded", or "afflicted by" cause real harm. Trained staff write better content and communicate more respectfully, which directly affects whether people with disability feel welcome and respected.',
    resources: [],
  },
  '1.5-DD-2b': {
    actions: ['Conduct a systematic audit of all public-facing materials: website, brochures, signage, social media profiles, automated emails, and policies.', 'Search for outdated terms: "disabled toilet" (use "accessible toilet"), "wheelchair-bound" (use "wheelchair user"), "special needs" (use "access requirements"), "handicapped" (use "accessible").', 'Create a find-and-replace list for common problematic terms and apply it across all materials.', 'Schedule annual language audits to catch drift.'],
    reasoning: 'Outdated language in official materials signals organisational attitudes. A website that says "handicapped parking" or "special needs" tells customers with disability that the organisation has not engaged with the disability community in years. Systematic auditing catches inherited language that individual content creators may not question.',
    resources: [],
  },
  '1.5-DD-5a': {
    actions: ['Review your accessibility information against a comprehensive topic checklist: mobility access (entrances, paths, lifts, toilets), sensory environment (noise, lighting, scents), communication (hearing loops, Auslan, captioning), assistance animals, transport, parking, emergency procedures, quiet spaces, food/dietary, assistance available.', 'Identify gaps where topics are missing or only partially covered.', 'Prioritise adding information about the most commonly requested topics (check enquiry logs).', 'Engage people with different disability types to identify what information they look for.'],
    reasoning: 'Most venue accessibility pages focus heavily on mobility access (ramps and lifts) while neglecting sensory, cognitive, and communication access. This inadvertently signals that the venue only considers wheelchair users. Comprehensive topic coverage ensures people with hearing loss, vision impairments, cognitive disabilities, mental health conditions, and other disabilities can also find the information they need.',
    resources: [],
  },
  '1.5-DD-6a': {
    actions: ['Communicate your accessibility commitment through multiple channels: website accessibility page, social media, email newsletters, staff interactions, signage, and annual reports.', 'Go beyond listing features: explain why you are committed and what it means in practice.', 'Share progress updates on accessibility improvements to demonstrate ongoing commitment.', 'Consider publishing a DIAP (Disability Inclusion Action Plan) and making it publicly available.'],
    reasoning: 'A commitment communicated only once on a buried webpage does not reach most customers with disability. Using multiple channels ensures the message reaches people across different platforms and contexts. Visible commitment helps people with disability feel confident choosing your venue over competitors who may not demonstrate the same values.',
    resources: [],
  },
  '1.5-DD-7a': {
    actions: ['Prepare templates for key documents in: Large Print (minimum 18pt), Easy Read (simple language with supporting images), accessible PDF (tagged, with reading order), and audio format.', 'Ensure digital documents are compatible with text-to-speech software (searchable text, proper heading structure, alt text on images).', 'Consider providing Braille versions for critical documents if requested, using a professional Braille production service.', 'Test accessible PDFs with NVDA screen reader to confirm they are navigable.'],
    reasoning: 'Alternative formats remove information barriers for people with diverse needs. Large Print helps people with low vision; Easy Read helps people with intellectual disabilities; audio helps people who are blind; tagged PDFs help screen reader users; Braille helps people who are Deaf-blind. Without these options, critical information is locked in formats some people cannot use.',
    resources: [],
  },
  '1.5-DD-7b': {
    actions: ['Publish a clear process for requesting alternative formats: who to contact, how to make the request, expected turnaround time, and available formats.', 'Place this information on the accessibility page and in the footer of key documents.', 'Set a realistic turnaround time (e.g., 5 business days for most formats) and meet it consistently.', 'Track requests to understand demand and pre-prepare popular documents in common alternative formats.'],
    reasoning: 'Without a clear process, people with disability may not know they can request alternative formats, or may make a request that goes nowhere. A defined process with published timeframes sets expectations and ensures accountability. It also helps the organisation plan and resource alternative format production appropriately.',
    resources: [],
  },
  '1.5-DD-8a': {
    actions: ['Publish photographs of key accessible features: entrance, parking, toilets, hearing loop signage, wayfinding, quiet spaces.', 'Create a video walkthrough showing the accessible route through your venue.', 'Consider a 360-degree virtual tour using platforms like Google Street View or Matterport.', 'Develop a social story (visual narrative) showing a step-by-step visit for autistic visitors.', 'If offering virtual tours, ensure they are keyboard-navigable and have text alternatives for blind users.'],
    reasoning: 'Visual content serves different purposes for different disabilities. Autistic people use social stories to reduce anxiety about new environments. People with cognitive disabilities benefit from video walkthroughs showing what to expect. People using wheelchairs can assess physical spaces from photos. Virtual tours let people with agoraphobia or severe fatigue explore before committing to an in-person visit.',
    resources: [],
  },
  '1.5-DD-8b': {
    actions: ['Add descriptive alt text to all photographs on your website per WCAG 2.2 SC 1.1.1 Non-text Content.', 'Caption all videos and provide transcripts per WCAG 2.2 SC 1.2.2 and 1.2.5.', 'Ensure virtual tour platforms are keyboard-navigable and have text descriptions of each viewpoint.', 'Test visual content with a screen reader to confirm a blind user can understand what is being shown.'],
    reasoning: 'Visual content that is itself inaccessible creates an ironic double barrier: information about accessibility that cannot be accessed. A blind person trying to understand venue accessibility through photos without alt text receives no information at all. Ensuring visual accessibility content is accessible in its own right is both a WCAG requirement and a basic consistency issue.',
    resources: [],
  },
  '1.5-PC-1': {
    actions: ['Test your website and key communications for readability using the Hemingway Editor or Flesch-Kincaid readability tool. Aim for Year 8 reading level or below per WCAG 2.2 SC 3.1.5 Reading Level.', 'Use short sentences (under 20 words), common words, and active voice.', 'Define or avoid jargon, acronyms, and technical terms. If they must be used, provide a glossary.', 'Break long paragraphs into short sections with clear headings.', 'Have someone with no specialist knowledge read the content and flag anything confusing.'],
    reasoning: 'Approximately 44% of Australian adults have literacy levels below the minimum needed for everyday life (ABS Adult Literacy and Life Skills Survey). Plain language is essential for people with intellectual disabilities, acquired brain injuries, dyslexia, and those for whom English is not their first language. Complex language excludes people from accessing information they need.',
    resources: [],
  },
  '1.5-PC-2': {
    actions: ['Adopt the language guidance from People with Disability Australia (PWDA). Use "person with disability" or "disabled person" based on context; avoid "special needs", "handicapped", "suffers from", or "wheelchair-bound."', 'Replace "disabled toilet" with "accessible toilet"; "disabled parking" with "accessible parking."', 'Focus on access features, not disability labels: "level entry available" not "entry for the disabled."', 'Audit all website pages, brochures, and signage for outdated language and update systematically.'],
    reasoning: 'Language reflects and reinforces attitudes. Terms like "wheelchair-bound" imply restriction when a wheelchair actually provides freedom. "Suffers from" assumes every person with disability is suffering. Outdated language signals that an organisation has not engaged with the disability community and may not be a welcoming environment. Approximately 4.4 million Australians have a disability.',
    resources: [],
  },
  '1.5-PC-3': {
    actions: ['Reframe accessibility information to lead with what IS available: "Level entry on Smith Street" rather than "No steps at Smith Street entrance."', 'Describe features as positive offerings, not compensations: "We offer hearing loops in the main auditorium" not "For those who cannot hear properly, we have hearing loops."', 'Avoid qualifying language like "unfortunately" or "sorry" when describing access features.', 'Still include honest descriptions of limitations, but frame them as "What we are working on" rather than apologies.'],
    reasoning: 'Deficit-based language ("Unfortunately, we do not have...") signals that accessibility is an afterthought or burden. Positive framing ("We provide...") normalises accessibility as a standard part of the venue experience. This matters psychologically for people with disability who are tired of being treated as problems to accommodate rather than valued customers to welcome.',
    resources: [],
  },
  '1.5-PC-4': {
    actions: ['Place an "Accessibility" link in the main navigation or footer of every page, reachable within one click.', 'Include accessibility in your site search: ensure searching "wheelchair", "accessible", "hearing loop" returns relevant results.', 'Add a visible accessibility icon (International Symbol of Access or equivalent) in the navigation to draw attention.', 'Do not bury accessibility under "About Us" or "FAQs" where people are unlikely to look first.'],
    reasoning: 'People with disability often spend significant time searching for accessibility information on venue websites. If it is hidden under sub-menus or labelled vaguely, people with cognitive disabilities may not find it at all, and people with motor or vision impairments waste limited energy navigating. Easy findability is a basic courtesy and an accessibility requirement in itself.',
    resources: [],
  },
  '1.5-PC-5': {
    actions: ['Cover all key access topics: parking, transport, entrance, internal navigation, toilets, hearing support, assistance animals, quiet spaces, food/dietary, emergency procedures, and staff assistance.', 'Include specific measurements and details: door widths, ramp gradients, distances, noise levels.', 'Address different disability types: mobility, vision, hearing, cognitive, sensory, psychosocial.', 'Answer the questions customers actually ask (check your enquiry logs) rather than what you think they want to know.', 'Include photos of accessible features to supplement text descriptions.'],
    reasoning: 'Generic accessibility pages that only mention wheelchair ramps ignore the majority of disabilities. A person who is Deaf needs to know about hearing loops and captioning; an autistic person needs sensory information; a person with chronic fatigue needs to know about rest areas and distances. Comprehensive practical details enable informed decision-making for all disability types.',
    resources: [],
  },
  '1.5-PC-6': {
    actions: ['Add a statement of commitment to accessibility on your website, signed by leadership, that goes beyond listing features.', 'Describe your ongoing accessibility improvement journey: what you have done, what you are doing, and what you plan to do.', 'Publish an Accessibility Action Plan or reference your DIAP (Disability Inclusion Action Plan).', 'Share stories or testimonials (with permission) from customers with disability about positive experiences.'],
    reasoning: 'A list of accessibility features is helpful but impersonal. A commitment statement signals that the organisation values inclusion as a core principle, not just a compliance obligation. For people with disability who have experienced discrimination, a visible commitment from leadership provides reassurance that the venue will treat them with dignity and respect.',
    resources: [],
  },
  '1.5-PC-7': {
    actions: ['Add a clear statement: "Information is available in alternative formats including Large Print, Easy Read, audio, and digital formats. Please contact us at [details] to request an alternative format."', 'Ensure the statement itself is easy to find on the accessibility page and in key documents.', 'Prepare templates for the most commonly requested formats so they can be provided quickly.', 'Set a target turnaround time for alternative format requests (e.g., 5 business days) and communicate this.'],
    reasoning: 'People with vision impairments need large print or audio; people with intellectual disabilities need Easy Read; people with dyslexia may need specific digital formats compatible with text-to-speech software. If people do not know alternative formats are available, they will not ask. Proactive communication ensures people with disability can access the same information as everyone else.',
    resources: [],
  },
  '1.5-PC-8': {
    actions: ['Publish photos showing: accessible entrance, accessible parking, accessible toilet, hearing loop signage, internal pathways, and any assistive equipment available.', 'Create a short video walkthrough of the accessible route from parking to key areas.', 'Consider a 360-degree virtual tour that allows customers to explore the venue remotely.', 'Ensure all visual content is itself accessible: alt text on photos, captions on videos, per WCAG 2.2 SC 1.1.1.'],
    reasoning: 'Visual content helps people with cognitive disabilities, anxiety disorders, and autism understand what to expect. Photos showing the actual ramp, toilet, and entrance are more useful than text descriptions. They also help people with low vision (who can zoom into photos) and Deaf people (who process visual information as primary). Virtual tours allow everyone to explore before committing to visit.',
    resources: [],
  },
  // Module 1.6
  '1.6-DD-1a': {
    actions: ['Develop formal representation guidelines that specify: minimum percentage of disability representation in imagery, approved language, review process involving people with disability, and diversity across disability types.', 'Include guidelines in marketing team briefs, agency briefs, and content creation workflows.', 'Review guidelines annually with input from disability advisory panel or consultants.', 'Track compliance with guidelines through regular content audits.'],
    reasoning: 'Without formal guidelines, disability representation depends on individual staff awareness and motivation, which leads to inconsistency. A guideline that says "at least 15% of imagery should include people with disability" creates accountability and a measurable target. Guidelines also help new staff and external agencies maintain standards.',
    resources: [],
  },
  '1.6-DD-2a': {
    actions: ['Engage people with disability as paid reviewers of marketing materials before publication.', 'Include people with diverse disabilities: mobility, vision, hearing, cognitive, psychosocial, and neurological.', 'Ask specific review questions: "Does this imagery feel authentic? Does the language feel respectful? Would this marketing make you want to visit?"', 'Establish an ongoing advisory relationship rather than one-off consultations.'],
    reasoning: 'Organisations cannot accurately assess representation without input from the people being represented. What seems inclusive to a non-disabled marketing team may contain subtle stereotypes, inaccurate depictions, or missed opportunities that people with lived experience will immediately identify. Paid review respects the expertise and time of disability consultants.',
    resources: [],
  },
  '1.6-DD-3a': {
    actions: ['Test all printed and digital marketing materials for colour contrast using the TPGi Colour Contrast Analyser or WebAIM Contrast Checker, verifying at least 4.5:1 for normal text per WCAG 2.2 SC 1.4.3.', 'Check readability: font size (minimum 12pt print, 16px digital), font type (sans-serif preferred), line spacing (at least 1.5x), and paragraph spacing.', 'Verify that information is not conveyed through colour alone per WCAG 2.2 SC 1.4.1.', 'Test digital materials (PDFs, email campaigns) with NVDA or JAWS screen reader for accessibility.'],
    reasoning: 'Marketing materials that fail contrast or readability standards exclude people with low vision (575,000 Australians), colour blindness (8% of men), dyslexia (10% of the population), and age-related vision decline. Testing ensures materials are accessible to the widest possible audience and demonstrates the organisation practices what it promotes regarding accessibility.',
    resources: [],
  },
  '1.6-DD-4a': {
    actions: ['Create at least one marketing campaign per year that centres accessibility as a feature (e.g., promoting a new accessible experience, celebrating International Day of People with Disability on 3 December).', 'Feature accessibility improvements in your newsletter, social media, and website news section.', 'Include accessible experiences in your "what is new" or seasonal marketing alongside other venue highlights.', 'Share behind-the-scenes content showing your accessibility improvement journey to build authentic engagement.'],
    reasoning: 'Actively promoting accessibility helps reach the disability market (4.4 million Australians plus their families and friends). It also builds brand reputation as inclusive and socially responsible. Many people with disability share positive accessibility experiences within their communities, creating valuable word-of-mouth marketing that reaches an audience traditional campaigns miss.',
    resources: [],
  },
  '1.6-DD-4b': {
    actions: ['Use available platform analytics (social media insights, website analytics, email metrics) to segment and understand engagement from disability community audiences.', 'Monitor engagement on accessibility-related posts compared to general content.', 'Track traffic to your accessibility page and identify referral sources.', 'Consider surveying customers about disability status (optional, anonymous) to understand audience composition.', 'Partner with disability organisations to understand reach within their communities.'],
    reasoning: 'Without engagement data, organisations cannot tell whether their inclusion efforts are reaching people with disability. Tracking helps identify which channels, messages, and content types resonate with the disability community, allowing more effective targeting. It also provides evidence of impact that supports ongoing investment in accessible marketing.',
    resources: [],
  },
  '1.6-DD-5a': {
    actions: ['Identify and advertise through disability-specific media channels: disability publications (e.g., Disability Support Guide), disability community social media groups, disability organisation newsletters, and disability podcast sponsorships.', 'Partner with disability peak bodies (PWDA, AFDO, state disability councils) for co-promotion.', 'Ensure all advertising on disability channels is itself accessible (captioned video, alt text, plain language).', 'Budget for disability-specific marketing as part of your standard marketing plan, not as a one-off initiative.'],
    reasoning: 'Mainstream advertising often does not reach people with disability effectively, particularly those who rely on disability-specific information networks. Advertising through disability channels demonstrates genuine commitment to inclusion and reaches an audience that actively seeks accessible venues. It also builds relationships with the disability community.',
    resources: [],
  },
  '1.6-DD-5b': {
    actions: ['Identify relevant disability organisations in your area or sector (local disability advocacy organisations, state peak bodies, specific impairment organisations like Vision Australia or Deaf Australia).', 'Propose mutually beneficial partnerships: discounted group visits, joint events, cross-promotion, or accessibility advisory arrangements.', 'Ensure partnership offers are genuine and equitable, not tokenistic. Pay for advisory services and offer real value.', 'Maintain relationships long-term rather than approaching organisations only when you need something.'],
    reasoning: 'Relationships with disability organisations provide authentic connections to the disability community, informed advice on improving accessibility, and credible endorsement that no amount of self-promotion can replicate. These partnerships also signal to people with disability that the venue is genuinely engaged with the community rather than performing inclusion for marketing purposes.',
    resources: [],
  },
  '1.6-PC-1': {
    actions: ['Audit your current marketing imagery across all channels (website, brochures, social media, advertisements) for disability representation.', 'Set a target: at least 15-20% of marketing imagery should include people with disability (reflecting Australian prevalence).', 'Feature diverse disabilities: wheelchair users, people with vision canes, people with hearing aids, people with Down syndrome, and people with non-visible disabilities.', 'Include people with disability as active participants enjoying your venue, not as passive subjects or recipients of care.'],
    reasoning: 'Approximately 18% of Australians have a disability. Marketing imagery that excludes people with disability sends a message that the venue is not for them. Representation matters because it signals belonging, influences perceptions, and helps people with disability feel confident that they will be welcome. Lack of representation is a form of social exclusion.',
    resources: [],
  },
  '1.6-PC-2': {
    actions: ['Review imagery for "inspiration porn" patterns: people with disability shown as heroic for doing ordinary activities, disability used as a prop for emotional response, or disability portrayed as something to overcome.', 'Show people with disability in everyday contexts: enjoying a meal, attending an event, shopping, working. Not just "overcoming" or "inspiring."', 'Consult disability media guides (e.g., PWDA media guide, ABC Disability Affairs guide) for representation best practices.', 'Have people with disability review marketing materials before publication.'],
    reasoning: 'Inspiration porn (using disability to make non-disabled people feel grateful or motivated) objectifies people with disability and reduces them to their condition. It signals that the organisation views disability as inherently tragic rather than as one aspect of human diversity. Authentic representation shows people with disability as complex, ordinary people, which is both respectful and more effective marketing.',
    resources: [],
  },
  '1.6-PC-3': {
    actions: ['Ensure printed materials use a minimum 12pt sans-serif font with high contrast (at least 4.5:1 ratio) per WCAG 2.2 SC 1.4.3.', 'Provide digital versions of all printed materials in accessible PDF (tagged, with alt text and reading order).', 'Avoid conveying information through colour alone (e.g., colour-coded categories should also have text labels) per WCAG 2.2 SC 1.4.1.', 'Offer materials in alternative formats (Large Print, Easy Read, audio) on request.', 'Test printed materials with people with low vision and cognitive disabilities.'],
    reasoning: 'Inaccessible marketing materials exclude the very people the venue is trying to reach. A brochure in tiny font with low contrast text over images is unreadable for people with low vision. An untagged PDF is inaccessible to screen reader users. If marketing materials are themselves barriers, they undermine any accessibility message they contain.',
    resources: [],
  },
  '1.6-PC-4': {
    actions: ['Feature accessibility as a venue highlight, not a footnote. For example, "Explore our sensory-friendly gallery experience" rather than a small icon in the corner.', 'Create marketing campaigns that centre accessibility as a positive feature: "Designed for everyone" messaging that showcases inclusive design.', 'Highlight specific accessibility investments: "New hearing loop installed in our main auditorium" or "Quiet sessions every Tuesday morning."', 'Share customer stories (with permission) about positive accessible experiences.'],
    reasoning: 'Positioning accessibility as a positive brand attribute rather than a compliance obligation attracts customers with disability and their friends and families (a significant market). It also differentiates the venue from competitors who treat accessibility as an afterthought. Positive framing normalises inclusion and shifts cultural attitudes.',
    resources: [],
  },
  '1.6-PC-5': {
    actions: ['Source imagery from disability-inclusive stock libraries: Getty Images disability collection, Disability:IN, The Ability People, or Scope\'s inclusive image library.', 'Better yet, photograph real customers with disability (with informed consent) enjoying your venue for authentic representation.', 'Commission photo shoots that intentionally include people with diverse disabilities as models.', 'Avoid using only stock images of wheelchair users to represent "disability." Include people with various visible and non-visible disabilities.'],
    reasoning: 'Generic stock photos of smiling wheelchair users have become a cliche that the disability community recognises and critiques. Authentic imagery (real customers, diverse disabilities, genuine activities) is more credible and respectful. Real photos also accurately represent your specific venue and its features, helping customers with disability plan their visit.',
    resources: [],
  },
  // Module 2.1
  '2.1-D-10': {
    actions: ['Install covered walkways or awnings along the accessible path from parking to the entrance, prioritising the section closest to the entrance.', 'If full coverage is not feasible, provide shelter at key rest points along the route.', 'Ensure any shelter structures do not reduce the path width below 1000mm or introduce head-height hazards below 2000mm per AS 1428.1:2021 Clause 7.', 'Select non-slip surfaces under covered areas to prevent water runoff from creating slippery zones at shelter edges.'],
    reasoning: 'Rain, sun, and wind exposure along the arrival path can be debilitating for people with heat sensitivity, chronic fatigue, pain conditions, or those who need to stop and rest. Wet surfaces also increase fall risk for everyone using mobility aids.',
    resources: [],
  },
  '2.1-D-11': {
    actions: ['Install seating at intervals of no more than 60 metres along longer paths per AS 1428.1:2021 Clause 7 (recommended best practice).', 'Ensure seats have backrests and armrests to assist people with balance impairments when sitting and standing.', 'Provide a firm, level surface pad (at least 800mm x 1300mm) adjacent to seating for a wheelchair user to park alongside a companion.', 'Position seating off the main path width so it does not obstruct the accessible path of travel.', 'Include shade or weather protection at rest points where practicable.'],
    reasoning: 'People with chronic pain, reduced stamina, heart conditions, or respiratory conditions may need to rest during even short walks. Without seating, they may be forced to sit on the ground or turn back, unable to reach the entrance.',
    resources: [],
  },
  '2.1-D-12b': {
    actions: ['Install kerb ramps at every point where the accessible path crosses a kerb or changes level, per AS 1428.1:2021 Clause 10.7.', 'Ensure kerb ramps have a maximum gradient of 1:8 (preferred 1:10) and a minimum width of 1000mm per AS 1428.1:2021 Clause 10.7.', 'Provide tactile ground surface indicators (TGSIs) at the base of each kerb ramp to warn people with vision impairment of the road interface per AS 1428.4.1.', 'Ensure kerb ramp surfaces are slip-resistant and the transition to the road surface is flush (max 5mm lip).', 'Align kerb ramps with the direction of pedestrian travel and with marked pedestrian crossings where they exist.'],
    reasoning: 'Kerbs are impassable barriers for wheelchair users, dangerous trip hazards for people with vision impairment, and difficult obstacles for pram and walking frame users. Compliant kerb ramps are essential wherever the path crosses a level change to a road or carpark.',
    resources: [],
  },
  '2.1-D-12c': {
    actions: ['Install a kerb (minimum 65mm high), raised garden border, or tactile edge along open sides of the path per AS 1428.1:2021 Clause 7.', 'Ensure edge treatments are continuous and do not have gaps that a cane tip could miss.', 'Use a contrasting colour or material at the path edge to provide visual cueing for people with low vision (minimum 30% luminance contrast per AS 1428.1:2021 Clause 8).', 'Avoid using only paint lines as path edges, as they are not detectable by cane.', 'Where bollards are used to define edges, space them no more than 1500mm apart so they function as a detectable barrier.'],
    reasoning: 'People who use white canes rely on detectable edges (kerbs, tactile strips, raised borders) to identify path boundaries. Without them, a vision-impaired person can veer off the path into vehicle areas, garden beds, or unprotected drop-offs.',
    resources: [],
  },
  '2.1-D-13': {
    actions: ['Install a vertical sign with the International Symbol of Access at the head of each accessible space, visible from the driver position, at 1500-1700mm height per AS/NZS 2890.6:2009 Clause 2.4.', 'Apply ground-level ISA markings (minimum 1000mm x 1000mm) centred in the parking space per AS/NZS 2890.6:2009 Clause 2.4.', 'Paint boundary lines and shared area hatching in contrasting colour (typically white or yellow on dark pavement).', 'Include "ACCESSIBLE PARKING ONLY" or equivalent text on the vertical sign or an additional plate.', 'Inspect markings and signs every 6 months and repaint or replace as needed to maintain visibility.'],
    reasoning: 'Without both ground markings and vertical signage, accessible spaces may not be detected by drivers approaching from a distance or by enforcement officers. People with low vision rely on the vertical sign; ground markings define the boundary of the shared area.',
    resources: [],
  },
  '2.1-D-15': {
    actions: ['Publish clear arrival instructions on your website accessibility page, including location of accessible parking, drop-off zones, and the accessible entrance.', 'Include a map or diagram with the accessible route marked, available in a format compatible with screen readers (alt text or text description).', 'Provide specific details: number of accessible spaces, surface type, distance to entrance, gradient information.', 'Offer arrival information in multiple formats (text, audio description, Easy Read) to serve different disability needs.', 'Keep arrival information updated whenever construction, events, or seasonal changes affect the accessible route.'],
    reasoning: 'Pre-visit information about arrival logistics reduces anxiety for people with cognitive disabilities, autism, and vision impairment. Without it, visitors may arrive at the wrong entrance, miss accessible parking, or face unexpected barriers that prevent entry.',
    resources: [],
  },
  '2.1-D-16': {
    actions: ['Provide lighting of at least 20 lux at ground level along the full accessible path from parking to entrance, increasing to 40 lux at decision points and entrance areas.', 'Ensure wayfinding signage is either illuminated or uses retroreflective material so it remains readable in low light.', 'Avoid lighting that creates pools of brightness alternating with dark patches, as this causes difficulty for people adjusting between light levels.', 'Position lights to illuminate surface hazards (edges, ramps, level changes) and maintain even coverage.', 'Conduct an after-dark walk-through at least annually to verify lighting adequacy and identify failed luminaires.'],
    reasoning: 'Inadequate lighting after dark makes surface hazards invisible to people with low vision, hides signage, and increases the risk of falls and disorientation. People with vision impairment who can navigate safely in daylight may be completely unable to do so at night.',
    resources: [],
  },
  '2.1-D-17': {
    actions: ['Use the current ISA (white on blue background) on all signs directing to or identifying accessible features per AS 1428.1:2021 Clause 8.', 'Apply the ISA consistently on parking signage, route markers, entrance identification, and facility signs throughout the site.', 'Do not modify the ISA symbol or use non-standard accessibility icons that visitors may not recognise.', 'Ensure the ISA is large enough to be visible at the intended reading distance (minimum 70mm high for close-range, larger for distance).', 'Audit all existing signage for ISA consistency and replace any outdated, non-standard, or damaged ISA signs.'],
    reasoning: 'The International Symbol of Access (ISA) is the universally recognised indicator of accessible features. Inconsistent use confuses visitors, undermines wayfinding, and may cause people to miss accessible routes or facilities, particularly affecting those with cognitive and vision impairments.',
    resources: [],
  },
  '2.1-D-18': {
    actions: ['Identify all decision points on the path from parking to entrance (turns, intersections, building corners, entry choices) and install wayfinding signage at each one.', 'Position signs before the decision point, at a height of 1400-1600mm, on the approach side per AS 1428.1:2021 Clause 8.', 'Use directional arrows combined with the ISA and destination name on each sign.', 'Ensure consecutive signs use consistent design, fonts, and colour scheme to create a recognisable wayfinding system.', 'Complement visual signage with tactile maps or audio beacons at key decision points for people with vision impairment.'],
    reasoning: 'Decision points (intersections, forks, building entries) are where visitors most need directional information. Missing signage at these points causes disorientation, particularly for people with cognitive disabilities, autism, or vision impairment who rely on sequential wayfinding cues.',
    resources: [],
  },
  '2.1-D-19': {
    actions: ['Ensure sign text has a minimum luminance contrast of 70% between characters and background per AS 1428.1:2021 Clause 8.2.', 'Use a minimum character height of 15mm per metre of intended reading distance (e.g. 75mm for a sign read at 5 metres) per AS 1428.1:2021 Clause 8.2.', 'Select sans-serif fonts (e.g. Arial, Helvetica) with consistent stroke width for maximum legibility.', 'Avoid glossy or reflective sign surfaces that create glare in sunlight or artificial lighting.', 'Use a matte, non-reflective finish and ensure the sign background contrasts with the wall or surface it is mounted on.'],
    reasoning: 'Small, low-contrast signage is effectively invisible to people with low vision, cataracts, or colour vision deficiency. If wayfinding signs cannot be read at a reasonable distance, they fail their purpose and the visitor remains lost.',
    resources: [],
  },
  '2.1-D-20': {
    actions: ['Install directional TGSIs (elongated bars oriented in the direction of travel) along the accessible path from parking to the entrance per AS 1428.4.1.', 'Install warning TGSIs (truncated domes/cones) at hazard points including kerb ramps, stairs, ramps, and level changes per AS 1428.4.1.', 'Ensure TGSIs contrast with the surrounding surface by at least 30% luminance contrast per AS 1428.4.1.', 'Maintain TGSIs so they remain raised, firmly fixed, and free of debris that could reduce detectability.', 'Position directional TGSIs to connect to the building entrance TGSI array, creating a continuous tactile path.'],
    reasoning: 'Tactile ground surface indicators (TGSIs) are the primary navigation aid for people who are blind or have severe vision impairment. Without them, a person using a white cane cannot detect the path to the entrance, hazard locations, or direction changes.',
    resources: [],
  },
  '2.1-D-22': {
    actions: ['Conduct a quarterly visual audit of all wayfinding signage on the arrival route, checking for fading, physical damage, and obstruction by vegetation.', 'Replace or repaint any sign where luminance contrast has dropped below 70% or text is no longer fully legible.', 'Trim vegetation, remove cobwebs, and clean signage surfaces during routine maintenance.', 'Establish a signage maintenance schedule and assign responsibility to a specific maintenance role.', 'Keep spare signage components (ISA plates, directional arrows) in stock for rapid replacement.'],
    reasoning: 'Faded, damaged, or overgrown signage is equivalent to no signage. It fails people with low vision who need high-contrast text, confuses visitors with cognitive disabilities, and communicates neglect of accessibility to all visitors.',
    resources: [],
  },
  '2.1-D-23': {
    actions: ['Ensure exit signage is visible, high-contrast, and includes the ISA where the exit route differs from the general exit.', 'Position exit wayfinding at decision points inside the venue, guiding visitors back to accessible parking or the pick-up zone.', 'Make checkout or farewell processes accessible: lowered counters (max 870mm per AS 1428.1:2021 Clause 13), accessible EFTPOS, and staff trained to assist.', 'Ensure the exit path is the same quality as the entry path: level, wide, lit, and obstacle-free.', 'Test the departure experience from the perspective of a wheelchair user and a person with vision impairment, identifying any barriers not present on arrival.'],
    reasoning: 'The departure experience is often overlooked, but people with disabilities face the same barriers leaving as arriving. Poor exit wayfinding, inaccessible checkout processes, or unclear exit routes can strand someone inside or send them to a non-accessible exit.',
    resources: [],
  },
  '2.1-D-24': {
    actions: ['Designate a pick-up or waiting area near the accessible exit or entrance, with a firm, level surface and weather protection.', 'Provide seating with backrests and armrests, plus a clear space for wheelchair users to wait alongside.', 'Ensure the pick-up area is well-lit (minimum 40 lux) and has a kerb ramp or level transition to the vehicle loading zone.', 'Install signage indicating the pick-up area location, visible from both inside the venue and the road approach.', 'Provide a way for visitors to request pick-up assistance (e.g. a call button, phone number, or staff at a nearby desk).'],
    reasoning: 'After a visit, people who rely on taxis, rideshare, or carer pick-up need a safe, accessible waiting area. Without one, visitors may wait in vehicle lanes, in the rain, or in areas without seating, which is untenable for people with fatigue, pain, or mobility impairments.',
    resources: [],
  },
  '2.1-D-9': {
    actions: ['Implement a policy that accessible parking spaces must never be repurposed, blocked, or reduced, even during events or construction.', 'Use physical barriers (bollards, wheel stops) that prevent non-authorised vehicles from using the shared area.', 'Brief event coordinators, delivery personnel, and contractors that accessible parking is protected and non-negotiable.', 'Designate a staff member to monitor and enforce accessible parking availability during high-demand periods.', 'If temporary works genuinely require displacement, provide equivalent accessible parking at equal or closer proximity and sign the temporary route per Premises Standards 2010 Schedule 1.'],
    reasoning: 'Accessible parking spaces are often co-opted for event overflow, delivery trucks, skip bins, or temporary installations. This forces people with disabilities to park in non-accessible areas, navigate unsafe surfaces, or be unable to visit at all.',
    resources: [],
  },
  '2.1-D-9a': {
    actions: ['Ensure accessible parking surfaces are concrete, sealed asphalt, or equivalent firm material per AS/NZS 2890.6:2009 Clause 2.3.', 'Verify the surface is slip-resistant in both wet and dry conditions (minimum R10 slip resistance rating per AS 4586).', 'Repair any cracks, potholes, or surface degradation that could trap wheelchair castors or trip cane users.', 'Ensure the shared area surface is continuous and flush with adjacent paths, with transitions no greater than 5mm.', 'Apply anti-slip coating or texturing if existing surfaces become slippery when wet.'],
    reasoning: 'A loose, crumbling, or slippery parking surface can cause wheelchairs to lose traction, walking frames to sink, and canes to slip. This creates a direct fall and injury risk for people with mobility and balance impairments.',
    resources: [],
  },
  '2.1-D-9c': {
    actions: ['Ensure parking payment machines are mounted with controls between 900mm and 1100mm from ground level per AS 1428.1:2021 Clause 13.', 'Provide at least one machine with a screen readable by people with low vision (high contrast, adjustable font or audio output).', 'Accept contactless payment (tap-and-go) as an alternative to coin or ticket insertion.', 'Offer mobile phone payment options that work with screen readers (iOS VoiceOver, Android TalkBack).', 'Ensure clear space of at least 800mm x 1300mm in front of the machine for wheelchair approach per AS 1428.1:2021 Clause 13.'],
    reasoning: 'Inaccessible parking meters or ticket machines prevent people with limited reach, hand dexterity, or vision impairment from paying. Touch-only screens without audio, high-mounted slots, and small buttons are common barriers.',
    resources: [],
  },
  '2.1-F-1': {
    actions: ['Provide the minimum number of accessible spaces required by AS/NZS 2890.6:2009 Table 1 (e.g. 1 space for up to 50 total, 2 for 51-200, then 1 per additional 200).', 'Ensure each accessible space is at least 2400mm wide with a 2400mm-wide shared area adjacent, per AS/NZS 2890.6:2009 Clause 2.2.', 'Install vertical signage displaying the International Symbol of Access (ISA) at a height of 1500-1700mm, visible from the roadway approach.', 'Mark spaces with ground-level ISA markings and "ACCESSIBLE PARKING ONLY" text using compliant paint or thermoplastic per AS/NZS 2890.6:2009 Clause 2.4.', 'Ensure the surface is firm, level (max 1:40 crossfall per AS 1428.1:2021 Clause 10.1), and slip-resistant across the full shared area.', 'Include a compliant kerb ramp or level transition from the shared area to the adjacent pedestrian path per AS 1428.1:2021 Clause 10.7.'],
    reasoning: 'Designated accessible parking spaces are a legal requirement under the Disability Discrimination Act 1992 and Premises Standards 2010. Without them, people who use wheelchairs, have limited mobility, or need extra door-opening clearance cannot safely arrive at your venue.',
    resources: [],
  },
  '2.1-F-2': {
    actions: ['Position accessible parking spaces as close as practicable to the main accessible entrance, ideally within 30 metres of the entrance door.', 'Ensure the path from spaces to the entrance is continuous, level, and unobstructed per AS 1428.1:2021 Clause 7.', 'Where the closest spaces cannot be adjacent to the main entrance, provide clear wayfinding signage from the accessible parking to the entrance.', 'Avoid placing accessible spaces in locations that require crossing vehicle traffic lanes without a marked pedestrian crossing.', 'Consider installing a covered walkway or shelter between distant accessible parking and the entrance to reduce weather exposure.'],
    reasoning: 'Proximity to the entrance minimises the distance a person with reduced stamina, chronic pain, or mobility limitation needs to travel. Longer distances can cause fatigue, pain, or make a visit impossible for people who use walking frames or manual wheelchairs.',
    resources: [],
  },
  '2.1-F-3': {
    actions: ['Provide a designated drop-off zone within 30 metres of the main accessible entrance.', 'Ensure the drop-off zone is at least 3200mm long and 2400mm wide to accommodate wheelchair-accessible vehicles with rear or side ramps.', 'Install a kerb ramp or level transition adjacent to the drop-off zone connecting directly to the pedestrian path, compliant with AS 1428.1:2021 Clause 10.7.', 'Mark the drop-off zone with signage indicating it is for passenger loading only and include a time limit (e.g. 2-5 minutes).', 'Ensure the drop-off zone does not obstruct accessible parking spaces or pedestrian paths when a vehicle is present.'],
    reasoning: 'Drop-off zones are critical for people who arrive by taxi, rideshare, or with a carer-driver who cannot park. People who use power wheelchairs, have severe mobility impairments, or experience vertigo need a safe, level area to alight and assemble mobility aids.',
    resources: [],
  },
  '2.1-F-3a': {
    actions: ['Ensure the drop-off surface is firm, level (max crossfall 1:40 per AS 1428.1:2021 Clause 10.1), and slip-resistant.', 'Provide a level transition or compliant kerb ramp (max gradient 1:8, preferred 1:10) between the drop-off area and footpath per AS 1428.1:2021 Clause 10.7.', 'Eliminate any gaps, grates, or uneven joints greater than 5mm in the drop-off zone and connecting path.', 'Ensure the connection between the drop-off zone and footpath is at least 1200mm wide to allow wheelchair manoeuvring.', 'Regularly maintain the surface to prevent potholes, gravel accumulation, or water pooling that could destabilise mobility aids.'],
    reasoning: 'If the drop-off zone surface is uneven, sloped, or disconnected from the footpath, a person transferring from a vehicle to a wheelchair risks tipping, falling, or being unable to reach the path. This is a safety-critical transition point for wheelchair users and people with balance impairments.',
    resources: [],
  },
  '2.1-F-4': {
    actions: ['Ensure the continuous accessible path of travel is firm, level, and slip-resistant per AS 1428.1:2021 Clause 7.', 'Maintain a maximum gradient of 1:14 for any ramped sections, with landings every 9 metres of ramp length per AS 1428.1:2021 Clause 10.3.', 'Maintain a maximum crossfall of 1:40 across the full path width per AS 1428.1:2021 Clause 7.2.', 'Repair any cracks, lifted pavers, or surface discontinuities exceeding 5mm.', 'Eliminate loose gravel, mulch, or sand surfaces in the accessible path; replace with concrete, asphalt, or compacted pavement.', 'Ensure drainage grates along the path have openings no greater than 13mm and are oriented perpendicular to the direction of travel per AS 1428.1:2021 Clause 7.5.'],
    reasoning: 'An uneven, gravel, or steeply sloped path between parking and the entrance can make it impossible for wheelchair users, people with walking frames, or vision-impaired visitors using canes to travel safely. Loose surfaces and cracks are trip and tip-over hazards.',
    resources: [],
  },
  '2.1-F-5': {
    actions: ['Ensure the continuous accessible path of travel is at least 1000mm wide unobstructed, with 1200mm preferred for comfortable travel per AS 1428.1:2021 Clause 7.', 'At passing points where two wheelchair users may meet, provide 1800mm width or a 2000mm x 2000mm passing bay every 20 metres per AS 1428.1:2021 Clause 7.1.', 'Trim vegetation, relocate bins, and remove temporary signage that encroach on the minimum width.', 'Audit the path at its narrowest point (often at bollards, garden beds, or building projections) and rectify any pinch points below 1000mm.', 'Include detectable edges (kerb, raised garden border, or tactile edge) along open-sided paths for cane detection by people with vision impairment.'],
    reasoning: 'Insufficient path width prevents wheelchair users from passing, blocks people using guide dogs from walking safely, and creates hazards where people with low vision may step off the edge. A companion walking alongside a person in a wheelchair needs adequate clearance.',
    resources: [],
  },
  '2.1-F-6': {
    actions: ['Install directional signage with the International Symbol of Access (ISA) and an arrow at all key vehicle decision points on the road approach.', 'Position signs at a height and location visible to drivers (typically 1500-2500mm from ground level) per AS 1428.1:2021 Clause 8.', 'Use high-contrast colours (white on blue for ISA, per AS 1428.1:2021 and AS/NZS 2890.6:2009) that are visible in daylight and at night.', 'If your venue is approached from multiple directions, provide directional signage on each approach route.'],
    reasoning: 'Directional signage on the road approach helps drivers with cognitive disabilities, anxiety, or unfamiliarity locate accessible parking without circling. Without clear signage, drivers may miss the accessible bay and park in a non-accessible area far from the entrance.',
    resources: [],
  },
  '2.1-F-6a': {
    actions: ['Install wayfinding signage at every decision point between the parking area and accessible entrance per AS 1428.1:2021 Clause 8.', 'Include the International Symbol of Access on all signs directing to the accessible route.', 'Use high-contrast text (minimum 70% luminance contrast) at a minimum character height of 15mm per metre of reading distance per AS 1428.1:2021 Clause 8.2.', 'Position signs at a consistent height of 1400-1600mm from ground level for readability by both standing and seated users.', 'Ensure signs are illuminated or reflective for visibility after dark.'],
    reasoning: 'Without clear wayfinding between parking and the entrance, visitors with cognitive disabilities, vision impairment, or anxiety may become disoriented or take a non-accessible route that includes stairs or steep gradients.',
    resources: [],
  },
  '2.1-F-6b': {
    actions: ['Install a sign at the point where the accessible route diverges from the main path, clearly indicating the direction of the accessible route with the ISA.', 'Include estimated distance or travel time on the sign if the accessible route is notably longer.', 'Ensure the alternative route is well-lit, maintained, and does not feel isolated or unsafe.', 'Place a secondary sign at the end of the accessible route confirming arrival at the entrance.', 'Review the need for an alternative route entirely; ideally, make the main path accessible to eliminate the need for a separate route (Premises Standards Schedule 1, Part D3.3).'],
    reasoning: 'When the accessible route is separate from the main pedestrian path, people with disabilities can become lost, isolated, or take the non-accessible path by mistake. Clear signage protects independence and dignity.',
    resources: [],
  },
  '2.1-F-7': {
    actions: ['Include accessible parking and entry point locations in staff induction and refresher training.', 'Provide front-of-house staff with a simple map or directions sheet showing accessible parking, drop-off, and the accessible route to the entrance.', 'Train staff to offer assistance proactively and respectfully when they see someone who may need help locating accessible features.', 'Post a map of accessible parking and routes at reception or customer service for quick reference.'],
    reasoning: 'Visitors who are confused or cannot locate accessible parking may ask staff for directions. If staff are uninformed, the visitor wastes time, feels unsupported, and may end up in an unsafe location. This affects people with cognitive, vision, and mobility impairments.',
    resources: [],
  },
  '2.1-F-8': {
    actions: ['Provide lighting of at least 40 lux at ground level across all accessible parking spaces and shared areas per AS/NZS 2890.6:2009 Clause 2.5.', 'Ensure lighting is even and avoids harsh shadows or glare that can disorient people with low vision.', 'Illuminate the path from accessible parking to the entrance at a minimum of 20 lux along its full length.', 'Use warm-to-neutral colour temperature (3000-4000K) lights that support colour distinction for people with colour vision deficiency.', 'Maintain lights regularly and replace failed globes promptly; consider motion-activated or timer lighting if not 24/7 operation.'],
    reasoning: 'Poor lighting in parking areas increases fall risk for people with low vision, creates hazards for wheelchair users who cannot see surface irregularities, and raises safety concerns for people with disabilities who may be more vulnerable in low-visibility environments.',
    resources: [],
  },
  // Module 2.2
  '2.2-D-11': {
    actions: ['Ensure the door handle is positioned at 900-1100mm from finished floor level per AS 1428.1:2021 Clause 13.', 'Use D-type lever handles that can be operated with a closed fist or single finger, not round knobs per AS 1428.1:2021 Clause 12.', 'Ensure the handle contrasts visually with the door surface for people with low vision.', 'If a lock or latch accompanies the handle, ensure it too is operable at accessible height and with one hand.'],
    reasoning: 'A door handle mounted too high or too low is unreachable for wheelchair users, children, and people of short stature, and uncomfortable for people with shoulder injuries or limited reach. Handle height directly determines whether a person can independently open a door.',
    resources: [],
  },
  '2.2-D-12': {
    actions: ['Provide at least 1200mm of clear, level floor space in front of the entrance door on both sides per AS 1428.1:2021 Clause 12.', 'On the pull side of the door, provide at least 600mm of clear space beside the latch edge for wheelchair approach per AS 1428.1:2021 Clause 12.', 'Ensure the clear space is level (maximum 1:40 gradient) and free of obstructions (planters, furniture, signage).', 'Remove door mats, rugs, or display items that reduce the usable clear space.', 'If the clear space cannot be provided due to building constraints, consider converting to an automatic door to eliminate the need for manual operation.'],
    reasoning: 'Wheelchair users and people with walking frames need clear floor space in front of a door to position themselves, reach the handle, and pull or push the door open. Without this space, they cannot operate the door independently and may be trapped or blocked.',
    resources: [],
  },
  '2.2-D-13': {
    actions: ['Measure the threshold height at the entrance door. Maximum permitted is 13mm per AS 1428.1:2021 Clause 12.3.', 'If the threshold exceeds 13mm, install a threshold ramp with a maximum gradient of 1:8 to create a smooth transition.', 'Ensure any remaining threshold is bevelled (not square-edged) to reduce catching on wheelchair castors and shoe toes.', 'Where possible, install a flush (zero-height) threshold as the preferred solution.', 'Check that weather seals and door sweeps do not create additional height at the threshold.'],
    reasoning: 'A door threshold higher than 13mm is a trip hazard for people with gait impairments, a barrier for wheelchair front castors, and can catch walking frame legs. Even small thresholds can cause falls for people with foot drop or neuropathy.',
    resources: [],
  },
  '2.2-D-14': {
    actions: ['Apply contrasting manifestation (strips, patterns, or decals) to glass doors at two heights: 900-1000mm and 1400-1600mm from floor level per AS 1428.1:2021 Clause 12.', 'Ensure manifestation has at least 30% luminance contrast against both the glass and the background visible through it.', 'Use a continuous band or pattern at least 75mm high; avoid small logos or dots that are insufficient to alert someone approaching at speed.', 'Ensure manifestation is visible from both sides of the door.', 'Extend manifestation to sidelights and floor-to-ceiling glass panels adjacent to the entrance.'],
    reasoning: 'Glass doors without contrast markings are invisible to people with low vision, depth perception difficulties, or cognitive distraction. Walking into a glass door can cause facial injuries, broken noses, and concussions. This is a documented safety hazard.',
    resources: [],
  },
  '2.2-D-15a': {
    actions: ['Establish a policy that the entrance area and a minimum 1200mm-wide path through it must remain clear of all obstructions at all times.', 'Relocate A-frame signs, display racks, umbrellas, and potted plants outside the accessible path envelope.', 'Brief staff daily on maintaining the clear entrance zone, especially after deliveries, new stock, or promotional setups.', 'Conduct a weekly walk-through to identify and remove any encroaching items.', 'If promotional signage is needed near the entrance, mount it on the wall at an accessible height rather than placing free-standing items on the floor.'],
    reasoning: 'A-frames, product displays, planters, and sandwich boards in the entrance area create obstacles that people with vision impairment cannot detect at head or body height with a cane, and that narrow the path for wheelchair users. They are among the most common and easily preventable barriers.',
    resources: [],
  },
  '2.2-D-15b': {
    actions: ['Design crowd management plans that maintain a minimum 1000mm clear path through the entrance at all times.', 'Position queue barriers to leave the accessible entrance path unobstructed.', 'Brief event and peak-period staff on the requirement to maintain entrance accessibility regardless of crowd size.', 'If temporary barriers or furniture are placed near the entrance during busy periods, verify the accessible path remains compliant before opening.', 'Provide an alternative accessible entry arrangement if the main entrance becomes temporarily compromised, and sign it clearly.'],
    reasoning: 'During peak periods, queues may spill into the entrance, outdoor seating may expand, or crowd control barriers may narrow the accessible path. This can block wheelchair access entirely and create a confusing, overwhelming environment for people with sensory or cognitive disabilities.',
    resources: [],
  },
  '2.2-D-16': {
    actions: ['Mount the intercom or bell button at 900-1200mm from ground level per AS 1428.1:2021 Clause 13.', 'Use a large, tactile button (minimum 25mm diameter) that can be pressed with a closed fist, elbow, or single finger.', 'Ensure the intercom includes both audio and visual indicators (e.g. a light confirming the call has been placed) for people who are deaf or hard of hearing.', 'Position the intercom within reach of a person in a wheelchair without requiring leaning forward more than 300mm.', 'Label the intercom button in high-contrast text and Braille per AS 1428.1:2021 Clause 8.'],
    reasoning: 'An intercom or bell mounted too high or requiring fine motor skills (tiny buttons, recessed switches) prevents wheelchair users, people with limb differences, and people with limited dexterity from announcing their arrival. They may be unable to enter at all.',
    resources: [],
  },
  '2.2-D-17': {
    actions: ['Set automatic door hold-open time to at least 5 seconds per AS 1428.1:2021 Clause 12.', 'Install safety sensors that detect a person or object in the doorway and prevent the door from closing.', 'Ensure the door opens fully before a person reaches it (activation sensor positioned far enough in advance).', 'Set the door closing speed to slow (at least 3 seconds from fully open to closed) to avoid striking slow-moving visitors.', 'Test door timing regularly, especially after power outages or maintenance, as settings can reset to factory defaults.'],
    reasoning: 'Automatic doors that close too quickly can strike people who move slowly, trap wheelchair footrests, or slam on guide dogs. People with mobility impairments, pain conditions, or those using walking aids need significantly more time to clear a door opening than an ambulant person.',
    resources: [],
  },
  '2.2-D-18': {
    actions: ['Ensure entrance mats are recessed flush with the surrounding floor (maximum 5mm edge height) per AS 1428.1:2021 Clause 7.', 'Use firm, low-pile mats (maximum 6mm pile height) that do not compress excessively under wheelchair wheels.', 'Secure all edges of non-recessed mats with bevelled edging or adhesive to prevent curling and tripping.', 'Avoid coir (coconut fibre) mats, which are too soft for wheelchair travel and create uneven surfaces.', 'Replace any mat that has become warped, bunched, or has lifted edges.'],
    reasoning: 'Loose, thick, or recessed entrance mats catch wheelchair castors, trip people with shuffling gaits, and destabilise walking frames. Surface changes at mat edges create fall hazards for people with vision impairment who cannot see the transition.',
    resources: [],
  },
  '2.2-D-18c': {
    actions: ['Install a vision panel (glazed section) in or adjacent to the entrance door per AS 1428.1:2021 Clause 12.', 'Ensure the vision panel extends from at least 900mm to 1500mm from floor level, allowing visibility for both standing and seated users.', 'Use safety glass (tempered or laminated) for all vision panels.', 'If the door is opaque and a vision panel cannot be retrofitted, consider replacing the door or installing a convex mirror to show approaching traffic.', 'Apply contrast manifestation to the vision panel per AS 1428.1:2021 if it is full-height glass.'],
    reasoning: 'A door without a vision panel creates a collision risk: a person approaching from one side cannot see someone approaching from the other. This is particularly dangerous for wheelchair users who are lower and less visible, and for people with hearing impairment who cannot hear someone on the other side.',
    resources: [],
  },
  '2.2-D-18d': {
    actions: ['Ensure the door leaf contrasts with the door frame and surrounding wall by at least 30% luminance contrast per AS 1428.1:2021 Clause 8.', 'Paint or finish the door frame in a colour that contrasts with both the door and the wall.', 'Ensure the door handle also contrasts with the door face so it can be located visually.', 'If the building facade is a uniform colour, use a contrasting surround, canopy, or highlighting to define the entrance zone.', 'Verify contrast with a luminance contrast meter or use an online contrast checker with measured colour values.'],
    reasoning: 'When a door and frame are the same colour as the surrounding wall, people with low vision cannot distinguish the door from the wall. They may not find the entrance, or may walk into the wall beside the door. Visual contrast is a simple, low-cost way to make the entrance obvious.',
    resources: [],
  },
  '2.2-D-21': {
    actions: ['Install a directional sign at or just inside the entrance listing key internal destinations (reception, toilets, lift, service counter) with arrows.', 'Position the sign at 1400-1600mm height, readable by both standing and seated users per AS 1428.1:2021 Clause 8.', 'Use high-contrast text (minimum 70% luminance contrast) and sans-serif fonts at a size readable from 2-3 metres.', 'Include tactile and Braille elements on the directory sign per AS 1428.1:2021 Clause 8 for people with vision impairment.', 'For larger venues, complement the sign with a tactile map at the entrance.'],
    reasoning: 'Once inside, visitors need to know where to go. Without directional signage at the entrance indicating key destinations (reception, lifts, toilets), people with cognitive disabilities or vision impairment may become immediately disoriented in an unfamiliar environment.',
    resources: [],
  },
  '2.2-D-22': {
    actions: ['Use a distinctive colour, signage style, or canopy to visually separate your entrance from neighbouring businesses.', 'Display your business name prominently at the entrance in high-contrast lettering at a size readable from the footpath.', 'Ensure your street number is clearly displayed at an accessible height (1400-1600mm) per AS 1428.1:2021 Clause 8.', 'Use consistent branding elements (colour, logo) from the street approach through to the entrance to create recognition cues.', 'Avoid entrance designs that are recessed or set back from the street facade in a way that makes them less visible than neighbours.'],
    reasoning: 'In a strip of shops or a shared building, indistinguishable entrances cause confusion for everyone, but particularly for people with cognitive disabilities, dementia, or vision impairment who rely on clear differentiation to identify the correct business.',
    resources: [],
  },
  '2.2-D-23': {
    actions: ['Install continuous handrails on both sides of all entrance stairs per AS 1428.1:2021 Clause 11.1.', 'Ensure handrails are 865-1000mm above the stair nosing line per AS 1428.1:2021 Clause 11.1.', 'Extend handrails at least 300mm horizontally beyond the top and bottom of the stair flight per AS 1428.1:2021 Clause 11.1.', 'Use circular or oval handrail profiles of 30-50mm diameter that can be gripped without wrist rotation per AS 1428.1:2021 Clause 11.1.', 'Ensure handrails contrast with the wall or surroundings by at least 30% luminance for visibility by people with low vision.', 'Fix handrails firmly so they support a person\'s full body weight without movement.'],
    reasoning: 'Stairs without handrails are a serious fall risk for people with balance impairments, reduced lower limb strength, or prosthetic limbs. Handrails on both sides allow a person to grip with their stronger hand regardless of approach direction. This is safety-critical.',
    resources: [],
  },
  '2.2-D-24': {
    actions: ['Apply contrasting strip nosings to every step edge, on both the tread and the riser face per AS 1428.1:2021 Clause 11.1.', 'Ensure nosing strips are 50-75mm wide on the tread and 30-50mm on the riser, with at least 30% luminance contrast against the stair surface.', 'Use non-slip nosing materials that remain visible and slip-resistant when wet.', 'Ensure nosings do not project beyond the riser face (no protruding bull-nose profiles) to prevent tripping per AS 1428.1:2021 Clause 11.1.', 'Replace any worn, chipped, or missing nosing strips immediately as part of routine maintenance.'],
    reasoning: 'Without contrasting nosing strips, individual step edges are invisible to people with low vision, depth perception difficulties, or cataracts. Misjudging a step edge is a leading cause of stair falls, which can cause serious injury. This is safety-critical.',
    resources: [],
  },
  '2.2-D-25': {
    actions: ['Enclose all stair risers so there are no open gaps between treads per AS 1428.1:2021 Clause 11.1.', 'If existing stairs have open risers, install riser infill panels that are flush with the tread edge.', 'Ensure riser height is consistent across all steps in a flight (max 190mm per AS 1428.1:2021 Clause 11.1).', 'Ensure tread depth (going) is at least 250mm per AS 1428.1:2021 Clause 11.1.', 'Verify that the infill material is securely fixed, rigid, and does not flex under foot pressure.'],
    reasoning: 'Open risers (gaps between steps) create a trapping hazard for cane tips, shoe toes, and small wheelchair front castors. People with vision impairment who use the riser face to gauge step position are disoriented by open risers. The visual transparency also causes depth perception confusion.',
    resources: [],
  },
  '2.2-D-26': {
    actions: ['Install warning TGSIs (truncated domes/cones) across the full width of the stair at both top and bottom landings per AS 1428.4.1.', 'Position warning TGSIs 300mm from the stair edge (measured from the nosing of the first/last step) per AS 1428.4.1.', 'Ensure TGSIs extend at least the full width of the stair flight.', 'Use TGSIs that contrast with the surrounding floor by at least 30% luminance contrast.', 'Maintain TGSIs so domes remain raised, firmly fixed, and free of wear that reduces detectability.'],
    reasoning: 'TGSIs at stairs warn people who are blind or have severe vision impairment that they are approaching a level change. Without this warning, a person using a cane could walk directly onto descending stairs, risking a serious fall.',
    resources: [],
  },
  '2.2-D-27': {
    actions: ['Install continuous handrails on both sides of all entrance ramps per AS 1428.1:2021 Clause 10.3.', 'Ensure handrails are at two heights: 865-1000mm (primary) and a secondary rail at 665-750mm for children and seated users per AS 1428.1:2021 Clause 10.3.', 'Extend handrails 300mm beyond the top and bottom of the ramp per AS 1428.1:2021 Clause 10.3.', 'Use circular or oval profiles of 30-50mm diameter, grippable without excessive wrist rotation.', 'Ensure handrails are continuous through intermediate landings and do not terminate or change height at landings.'],
    reasoning: 'A ramp without handrails forces wheelchair users to rely entirely on arm strength for braking and propulsion, and gives people with balance or mobility impairments nothing to hold. This increases fall and tip-over risk, particularly on steeper ramps.',
    resources: [],
  },
  '2.2-D-28': {
    actions: ['Measure the ramp gradient using a digital inclinometer or spirit level. Maximum permitted gradient is 1:14 per AS 1428.1:2021 Clause 10.3.', 'If the existing ramp exceeds 1:14, redesign or rebuild to achieve 1:14 or flatter (1:20 preferred for longer ramps).', 'Provide level landings (minimum 1200mm long) at the top, bottom, and every 9 metres of ramp run per AS 1428.1:2021 Clause 10.3.', 'Ensure the ramp width is at least 1000mm between handrails per AS 1428.1:2021 Clause 10.3.', 'If gradient cannot be reduced due to site constraints, consider a platform lift as an alternative per Premises Standards D3.2.'],
    reasoning: 'A ramp that is too steep is dangerous for manual wheelchair users (risk of rolling backward), exhausting for people with limited upper body strength, and unstable for walking frame users. Excessive gradient is the most common ramp compliance failure.',
    resources: [],
  },
  '2.2-D-29': {
    actions: ['Install warning TGSIs (truncated domes/cones) at the top and bottom landings of the ramp per AS 1428.4.1.', 'Position TGSIs 300mm from the start of the ramp slope per AS 1428.4.1.', 'Ensure TGSIs extend across the full width of the ramp.', 'Ensure TGSI colour contrasts with the landing surface by at least 30% luminance.', 'Where a ramp has intermediate landings, install TGSIs at each landing transition.'],
    reasoning: 'TGSIs at ramps warn people who are blind or have severe vision impairment of an approaching gradient change. Without them, a person using a cane cannot distinguish between a level path and the start of a downward slope.',
    resources: [],
  },
  '2.2-D-30': {
    actions: ['Verify the ramp surface has a slip resistance rating of at least R11 (or P4 for wet areas) per AS 4586.', 'If the surface is polished concrete, tiles, or painted metal, apply anti-slip coating or adhesive strips.', 'Ensure the ramp surface is free of moss, algae, or leaf litter that reduces grip, especially in shaded or damp locations.', 'Install drainage at the base of outdoor ramps to prevent water pooling on the ramp surface.', 'Test slip resistance annually using a pendulum slip test or equivalent per AS 4586.'],
    reasoning: 'A slippery ramp surface is extremely dangerous: wheelchairs lose traction, walking frames slide, and people with impaired balance have no way to recover on a slope. Wet conditions (rain, cleaning, spills) significantly increase this risk.',
    resources: [],
  },
  '2.2-D-31': {
    actions: ['Ensure the lift door opening is at least 900mm clear width per AS 1735.12 and AS 1428.1:2021 Clause 15.', 'Ensure the lift cabin is at least 1100mm wide x 1400mm deep to accommodate a wheelchair user per AS 1735.12.', 'Install tactile and Braille buttons at 900-1100mm height per AS 1735.12.', 'Provide auditory floor indicators and visual floor indicators for people with hearing and vision impairments.', 'Ensure lift doors remain open for at least 8 seconds and have a sensor to detect people or mobility aids in the doorway.'],
    reasoning: 'If an entrance lift is too small for a wheelchair or has a narrow door opening, it excludes the very people it was installed to serve. Power wheelchair users and people with attendants need adequate cabin size and door clearance to enter and exit safely.',
    resources: [],
  },
  '2.2-D-32': {
    actions: ['Ensure the lift can be called and operated without a key, staff assistance, or special authorisation.', 'If the lift is key-operated for security reasons, provide an intercom or call button at the lift landing that connects to a staff member who can respond within 60 seconds.', 'Install standard tactile call buttons on each landing at 900-1100mm height per AS 1735.12.', 'Ensure lift controls inside the cabin are labelled in Braille and raised tactile characters.', 'Test that the lift is operational during all hours the venue is open to the public.'],
    reasoning: 'A lift that requires a staff member to operate (key-operated, requires unlocking, or has non-standard controls) removes independence and creates a dependency that may not be available outside business hours or when staff are busy. It affects wheelchair users, people with limited mobility, and parents with prams.',
    resources: [],
  },
  '2.2-D-33': {
    actions: ['Provide a lift or compliant ramp as an accessible alternative adjacent to every escalator per Premises Standards 2010 D3.2.', 'Ensure the alternative is clearly signed with the ISA and directional arrows visible from the escalator location.', 'Ensure the lift or ramp provides access to the same levels as the escalator without requiring a significantly longer route.', 'If the alternative is a lift, ensure it meets AS 1735.12 requirements for accessible lifts.', 'If the alternative is a ramp, ensure it meets AS 1428.1:2021 Clause 10.3 gradient and handrail requirements.'],
    reasoning: 'Escalators are completely inaccessible to wheelchair users, dangerous for people with balance impairments, and frightening for people with anxiety or sensory processing disorders. Without an accessible alternative at the same location, these visitors are excluded from upper or lower levels.',
    resources: [],
  },
  '2.2-F-1': {
    actions: ['Document every entrance feature: steps, ramp, level entry, lift, escalator, or combination.', 'Identify which entrance is the designated accessible entrance per Premises Standards 2010 D3.2.', 'Where steps are the only entrance feature, plan for installation of a ramp or lift as a priority remediation to meet DDA obligations.', 'Ensure at least one entrance provides step-free access at ground level or via a compliant ramp or lift.', 'If multiple entrance types exist, ensure the accessible entrance provides equivalent dignity (not a back door or service entry).'],
    reasoning: 'The type of entrance feature (steps, ramp, level, lift, escalator) determines whether the building is physically accessible. This entry-point question identifies which follow-up assessments are needed and directly relates to Premises Standards D3.2 (access to buildings).',
    resources: [],
  },
  '2.2-F-2': {
    actions: ['Measure the clear opening width of the entrance door when fully open. Minimum 850mm clear per AS 1428.1:2021 Clause 12.1.', 'If the door is less than 850mm, consider replacing with a wider door, or installing an automatic sliding door.', 'For double doors, ensure at least one leaf provides 850mm clear opening independently.', 'Measure from the door face to the opposite frame/stop at 90 degrees open, not the frame-to-frame dimension.', 'If structural constraints prevent widening, consult an access consultant for alternative solutions such as a powered door opener on the existing door.'],
    reasoning: 'A door opening less than 850mm wide prevents many wheelchair users from passing through. Power wheelchairs can be 700-750mm wide, and manual wheelchair users need additional clearance for their hands on the push rims. Even 800mm is insufficient for larger chairs.',
    resources: [],
  },
  '2.2-F-3': {
    actions: ['Install automatic (sensor-activated) sliding or swinging doors as the preferred solution per AS 1428.1:2021 Clause 12.', 'If automatic doors are not feasible, ensure manual doors require no more than 20N of force to open per AS 1428.1:2021 Clause 12.', 'Replace round doorknobs with D-type lever handles operable with one hand without tight grasping or twisting per AS 1428.1:2021 Clause 12.', 'Adjust door closer mechanisms to reduce resistance while maintaining fire safety compliance.', 'Consider installing a power-assisted door opener (push-button activated) as a mid-cost alternative to full automation.'],
    reasoning: 'Heavy, stiff, or round-handled doors exclude people with limited hand strength, arthritis, upper limb amputation, or those using a wheelchair (who have one hand occupied with wheel control). Door resistance above 20N is difficult for many people with disabilities.',
    resources: [],
  },
  '2.2-F-4': {
    actions: ['Ensure the entrance is visually distinct through contrasting colour, signage, canopy, or lighting treatment per AS 1428.1:2021 Clause 8.', 'Install a sign identifying the entrance with text, the venue name, and the ISA where it is the accessible entrance.', 'Provide adequate lighting at the entrance (minimum 100 lux at the door per AS 1680) so it is visible after dark.', 'Avoid entrance designs that blend into the facade or are recessed in a way that makes them difficult to locate from the approach path.', 'Consider installing a beacon or audio wayfinding device near the entrance for people with severe vision impairment.'],
    reasoning: 'If visitors cannot identify the entrance visually, they may approach the wrong part of the building, attempt locked or staff-only doors, or wander the perimeter. This particularly affects people with cognitive disabilities, vision impairment, and anxiety disorders.',
    resources: [],
  },
  '2.2-F-5': {
    actions: ['Install directional signage at the main entrance indicating the location and direction of the accessible entrance, with the ISA and an arrow.', 'Include estimated distance or route description on the sign.', 'Ensure the route to the alternative entrance is itself accessible (level, wide, lit, signed).', 'Place a sign at the accessible entrance confirming it is the accessible entry point.', 'Work toward making the main entrance accessible so that a separate accessible entrance is not needed, as this is the preferred outcome under the DDA.'],
    reasoning: 'If the main entrance has steps and the accessible entrance is elsewhere, a lack of signage means wheelchair users and others must search the building perimeter. This wastes time and energy, causes frustration, and may result in the person leaving without entering.',
    resources: [],
  },
  '2.2-F-6': {
    actions: ['Include entrance assistance protocols in staff training, covering how to assist with doors, lifts, ramps, and navigation without patronising the customer.', 'Train staff to ask "Would you like any help?" rather than assuming help is needed or grabbing wheelchair handles without consent.', 'Ensure at least one staff member is available near the entrance during opening hours to provide assistance if requested.', 'Provide staff with a brief guide on the accessible entrance features, including how to operate any powered doors, lifts, or intercoms.', 'Include disability awareness and communication etiquette (e.g. speaking directly to the person, not their companion) in training.'],
    reasoning: 'People with disabilities may need assistance opening heavy doors, navigating a complex entrance, or communicating their needs upon arrival. Staff who are unprepared may inadvertently create a negative experience through hesitation, inappropriate assistance, or refusal.',
    resources: [],
  },
  '2.2-F-7': {
    actions: ['Ensure entrance lighting provides at least 100 lux at the door face and threshold per AS 1680 and AS 1428.1:2021.', 'Avoid uplighting or backlighting that creates glare or silhouettes, which are problematic for people with low vision or photosensitivity.', 'Ensure lighting is consistent from the approach path through the entrance to the interior, avoiding abrupt transitions between dark and bright.', 'Illuminate entrance signage, door handles, intercom buttons, and threshold edges.', 'Use lighting that renders colours accurately (CRI > 80) to support colour-based wayfinding cues.'],
    reasoning: 'Insufficient lighting at the entrance makes it dangerous for people with low vision, who may misjudge steps, thresholds, or door positions. It also makes signage unreadable and door hardware invisible, preventing independent entry.',
    resources: [],
  },
  '2.2-F-8': {
    actions: ['Install warning TGSIs (truncated domes/cones) at the entrance threshold per AS 1428.4.1.', 'Install directional TGSIs (elongated bars) leading to the entrance from the external approach path per AS 1428.4.1.', 'Ensure TGSIs contrast with the surrounding ground surface by at least 30% luminance contrast.', 'Position TGSIs to align with the accessible approach path and direct users to the door handle side of the entrance.', 'Maintain TGSIs to ensure they remain raised, securely fixed, and free from paint, grime, or wear that reduces detectability.'],
    reasoning: 'TGSIs at entry points alert people who are blind or have severe vision impairment to the building entrance, helping them transition from outdoor wayfinding to the indoor environment. Without TGSIs, they may pass the entrance or approach incorrectly.',
    resources: [],
  },
  // Module 2.3
  '2.3-1-1': {
    actions: ['Measure the clear width of all main circulation paths using a tape measure or laser distance meter.', 'Identify any sections narrower than 1000mm and document the cause (furniture, displays, structural narrowing).', 'Relocate movable obstructions and consider structural modifications for permanently narrow sections.', 'Ensure paths to all key facilities (toilets, lifts, exits, service counters) maintain minimum 1000mm width.', 'Schedule quarterly path width audits to prevent gradual encroachment.'],
    reasoning: 'Wheelchair users, people with walking frames, and those with guide dogs need at least 1 metre of clear width to travel safely. Narrow paths force people to turn back or risk injury navigating tight spaces.',
    resources: [],
  },
  '2.3-1-2': {
    actions: ['Walk all circulation paths and photograph every obstacle, protruding object, and trip hazard.', 'Remove or relocate bins, plant pots, A-frame signs, stock, and temporary displays that encroach on paths.', 'Secure loose mats, cables, and rugs that could catch wheels or cause trips.', 'Create a daily opening checklist that includes clearing all circulation paths.', 'Install wall-mounted alternatives for items currently placed on the floor (bins, sanitiser stations).'],
    reasoning: 'Trip hazards and obstacles are a safety risk for everyone, but especially dangerous for people who are blind, have low vision, use mobility aids, or have balance difficulties. Falls can cause serious injury.',
    resources: [],
  },
  '2.3-1-3': {
    actions: ['Survey and document every internal level change: stairs, ramps, lifts, escalators, and single steps.', 'Assess each against AS 1428.1 requirements: handrails on both sides of stairs and ramps, TGSIs at top and bottom, nosing strips on stairs, and compliant ramp gradients.', 'Identify any level changes that lack an accessible alternative (e.g., stairs without a nearby lift or ramp).', 'Prioritise adding accessible alternatives to the most critical routes first.'],
    reasoning: 'Level changes are the primary barrier for wheelchair users, people with prams, and anyone with reduced mobility. Documenting all level changes is the first step toward ensuring every part of the venue is reachable.',
    resources: [],
  },
  '2.3-1-4': {
    actions: ['Conduct a simulated journey through your venue using a wheelchair or walking frame, or while wearing a blindfold with a guide.', 'Note every point where independent navigation fails: heavy doors, missing tactile cues, confusing layouts, narrow passages.', 'Prioritise the barriers by severity (complete block vs. difficulty) and frequency (main route vs. secondary area).', 'Create an action plan addressing the highest-priority barriers first.', 'Invite people with disabilities to provide feedback on navigability.'],
    reasoning: 'Independent navigation is fundamental to dignity and participation. When people must rely on others to move through a space, it creates dependence and often leads to people avoiding the venue altogether.',
    resources: [],
  },
  '2.3-D-10': {
    actions: ['Sign accessible routes with the ISA and directional arrows at every point where they diverge from the main path.', 'Ensure accessible route signage is visible from the point where a visitor would need to make a choice (e.g. at the top of stairs, near an escalator).', 'Where possible, design the main circulation route to be the accessible route, eliminating the need for separate paths.', 'Provide distance or travel time indicators on signs where the accessible route is longer than the main route.', 'Audit the accessible route to ensure it does not pass through back-of-house, service, or less-dignified areas.'],
    reasoning: 'When the accessible route (e.g. via lift or ramp) differs from the main circulation path (via stairs), people with disabilities need clear signage to find it. Without marking, they may follow the crowd to stairs and have to backtrack, wasting energy and time.',
    resources: [],
  },
  '2.3-D-11': {
    actions: ['Verify all floor surfaces along accessible paths achieve a minimum R10 slip resistance rating (R11 for wet areas) per AS 4586.', 'Apply anti-slip treatment to any existing polished, glazed, or naturally smooth surfaces (marble, polished concrete, glazed tiles).', 'Ensure wet area floors near entrances, bathrooms, and food service achieve P4 or higher wet pendulum rating per AS 4586.', 'Implement immediate spill cleanup procedures and use "wet floor" signs with both visual and tactile warning.', 'Test slip resistance annually and after resurfacing or recoating.'],
    reasoning: 'Slippery floors are a major fall hazard for people using crutches, prosthetics, or walking frames, and for people with gait impairments or balance disorders. Wet areas (near kitchens, bathrooms, entrances in rain) are particularly dangerous.',
    resources: [],
  },
  '2.3-D-12': {
    actions: ['Provide at least 100 lux of even lighting along all internal circulation paths per AS 1680.', 'Increase lighting to 200 lux at decision points, stairs, ramps, and level changes.', 'Avoid creating pools of brightness alternating with dark patches; use consistent, diffused lighting.', 'Ensure lighting does not create glare from reflective floors (reposition fittings or use diffusers).', 'Maintain all light fittings and replace failed globes promptly; a single dark section can block the entire accessible path for someone with low vision.'],
    reasoning: 'Dim or uneven lighting on circulation paths prevents people with low vision from detecting obstacles, level changes, and signage. Sudden changes between bright and dark areas can temporarily blind anyone, but are particularly disabling for people with photosensitivity or slow visual adaptation.',
    resources: [],
  },
  '2.3-D-13': {
    actions: ['Provide seating at intervals of no more than 60 metres along longer internal paths.', 'Select seats with backrests and armrests that assist people with balance impairments when sitting and standing.', 'Provide a firm, level 800mm x 1300mm space beside seating for a wheelchair user to park alongside.', 'Position seating off the main path so it does not reduce the accessible path width.', 'Include seating in lift lobbies, corridor intersections, and outside frequently visited facilities (toilets, consultation rooms).'],
    reasoning: 'Internal rest points provide critical support for people with chronic fatigue, pain conditions, cardiac conditions, or respiratory impairments. In larger venues, the absence of seating along longer corridors means some people physically cannot reach their destination.',
    resources: [],
  },
  '2.3-D-14': {
    actions: ['Install continuous handrails on both sides of all internal ramps per AS 1428.1:2021 Clause 10.3.', 'Provide handrails at two heights: 865-1000mm (primary) and 665-750mm (secondary) per AS 1428.1:2021 Clause 10.3.', 'Extend handrails 300mm horizontally beyond the top and bottom of the ramp slope.', 'Use a grippable circular or oval profile of 30-50mm diameter.', 'Ensure handrails contrast visually with the wall and are continuous through any intermediate landings.'],
    reasoning: 'Internal ramps without handrails provide no support for people with balance impairments and no braking assistance for wheelchair users descending the slope. A person who loses balance on a ramp with no handrail has nothing to catch.',
    resources: [],
  },
  '2.3-D-15': {
    actions: ['Apply contrasting colour or material at every level change, including single steps, ramp edges, raised platforms, and sunken areas per AS 1428.1:2021 Clause 8.', 'Use contrasting nosing strips on all steps and contrast strips at ramp edges.', 'Ensure the contrast is at least 30% luminance difference between the level change edge and the surrounding floor.', 'Install tactile warning TGSIs at level changes where required per AS 1428.4.1.', 'Avoid using feature flooring patterns that visually mimic level changes (optical illusions created by striped or geometric patterns).'],
    reasoning: 'Level changes (single steps, ramp starts, platform edges) that blend into the surrounding floor are invisible to people with low vision or depth perception difficulties. A single unmarked step can cause a severe fall.',
    resources: [],
  },
  '2.3-D-16': {
    actions: ['Ensure the lift cabin is at least 1100mm wide x 1400mm deep with a 900mm clear door opening per AS 1735.12.', 'Install tactile and Braille buttons inside the cabin and at each landing, positioned at 900-1100mm height per AS 1735.12.', 'Provide auditory floor announcements and audible door-open chimes per AS 1735.12.', 'Provide visual floor indicators for people who are deaf or hard of hearing.', 'Ensure doors remain open for at least 8 seconds and include reopening sensors to detect people or mobility aids.', 'Install a mirror on the rear wall of the lift to allow wheelchair users who cannot turn around to see when reversing out.'],
    reasoning: 'A lift without accessible features (tactile buttons, audible announcements, adequate size, Braille labelling) excludes people with vision impairment, hearing impairment, and wheelchair users. The lift may exist but still be functionally inaccessible.',
    resources: [],
  },
  '2.3-D-17': {
    actions: ['Ensure the lift can be called and operated at all floors without a key, PIN, or staff assistance during operating hours.', 'If security restrictions require controlled access to certain floors, use a system that does not prevent access to publicly available levels.', 'Install standard call buttons on every landing at 900-1100mm height per AS 1735.12.', 'If the lift must be locked outside operating hours, provide an alternative accessible route or clearly communicate lift operating times.', 'Test the lift is operational daily before opening and immediately after any power interruption.'],
    reasoning: 'A lift that requires a key, PIN, or staff assistance to operate strips independence from people with disabilities. If staff are not available or the key holder is absent, the person is stranded on one level.',
    resources: [],
  },
  '2.3-D-18': {
    actions: ['Replace round knobs with D-type lever handles on all internal doors along accessible routes per AS 1428.1:2021 Clause 12.', 'Ensure door opening force does not exceed 20N per AS 1428.1:2021 Clause 12.', 'Adjust or replace door closers that create excessive resistance.', 'Consider hold-open devices (magnetic, on the fire alarm circuit) for frequently used internal doors in non-fire-separation locations.', 'For fire doors that must self-close, install electromagnetic hold-open devices that release on fire alarm activation per AS 1428.1:2021 Clause 12.'],
    reasoning: 'Internal doors that are heavy, have round knobs, or resist opening exclude people with arthritis, upper limb weakness, spinal cord injury, or single-hand use. In a wheelchair, one hand is typically occupied with positioning, leaving only one hand for the door.',
    resources: [],
  },
  '2.3-D-19': {
    actions: ['Measure the clear opening width of all internal doors along accessible routes. Minimum 850mm per AS 1428.1:2021 Clause 12.1.', 'For double doors, ensure at least one leaf provides 850mm clear independently.', 'If widening is not structurally feasible, consider replacing hinged doors with sliding doors that reclaim the door-swing space.', 'Install offset hinges (swing-clear hinges) on existing doors to gain an additional 50-60mm of clear width without frame modification.', 'Prioritise high-traffic doors (toilet entries, meeting rooms, main corridors) for remediation.'],
    reasoning: 'An internal door narrower than 850mm blocks wheelchair passage and makes it difficult for people using walking frames, crutches, or guide dogs to pass through comfortably. Narrow doors force awkward body positions that risk injury.',
    resources: [],
  },
  '2.3-D-20': {
    actions: ['Ensure a minimum 2000mm overhead clearance along all internal accessible paths per AS 1428.1:2021 Clause 7.', 'Audit for protruding objects: open cabinet doors, hanging merchandise, decorative elements, A/C units, signage, and light fittings.', 'Where an overhead obstruction cannot be raised (structural beam, ductwork), install a barrier or tactile warning at floor level beneath it that a cane user will detect before reaching the obstruction.', 'Retract or relocate any wall-mounted objects that protrude more than 100mm into the path at a height between 680mm and 2000mm per AS 1428.1:2021 Clause 7.', 'Include overhead clearance in your routine maintenance checklist, as temporary items (bunting, seasonal decorations) often create new hazards.'],
    reasoning: 'Overhead obstructions below 2000mm (hanging signs, open cabinets, low beams, branches) are undetectable by a white cane and cause head strike injuries for people with vision impairment. Tall wheelchair users and people on mobility scooters are also at risk.',
    resources: [],
  },
  '2.3-D-21': {
    actions: ['Ensure internal paths are at least 1000mm wide, with 1200mm preferred for comfortable single-direction wheelchair travel per AS 1428.1:2021 Clause 7.', 'Provide passing spaces of 1800mm width or 2000mm x 2000mm turning areas at intervals of no more than 20 metres per AS 1428.1:2021 Clause 7.1.', 'Ensure dead-end corridors have a turning space of at least 1540mm x 2070mm (or 2070mm diameter circle) per AS 1428.1:2021 Clause 7.1.', 'Audit aisle widths in retail areas, between furniture, and in waiting areas to ensure minimum clearances are maintained.', 'Remove or relocate any items (display stands, bins, stored equipment) that reduce path width below the minimum.'],
    reasoning: 'If two wheelchair users, or a wheelchair user and a person with a pram, cannot pass each other, one must reverse to a wider point. This is physically demanding, stressful, and sometimes impossible in longer corridors. Turning space is also needed at dead ends and in front of facilities.',
    resources: [],
  },
  '2.3-D-22': {
    actions: ['Provide at least 1200mm of clear, level space in front of internal doors on both sides per AS 1428.1:2021 Clause 12.', 'On the pull side, provide at least 600mm clear space beside the latch edge per AS 1428.1:2021 Clause 12.', 'On the push side, provide at least 300mm clear space beside the latch edge.', 'Ensure the clear space is unobstructed by furniture, fire extinguishers, wall-mounted items, or door closers.', 'Where clear space cannot be achieved, consider converting the door to an automatic or power-assisted model, or replacing with a sliding door.'],
    reasoning: 'A wheelchair user approaching a hinged door needs clear space on the latch side to position themselves, reach the handle, and swing the door open without the door hitting their wheelchair. Without this clearance, the door is effectively inoperable for them.',
    resources: [],
  },
  '2.3-D-23': {
    actions: ['Ensure floor surfaces contrast with walls by at least 30% luminance contrast per AS 1428.1:2021 Clause 8.', 'Ensure door leaves contrast with the door frame and surrounding wall by at least 30% luminance contrast.', 'Use skirting boards or floor edging in a contrasting colour to define the wall-floor junction.', 'Ensure door handles contrast with the door face for locatability.', 'Avoid decorating with feature walls or patterns that reduce the distinction between floor, wall, and door elements.'],
    reasoning: 'When floor surfaces and internal doors are the same colour as walls, people with low vision cannot perceive spatial boundaries, doorways, or path edges. This causes disorientation, collision with walls, and missed doorways.',
    resources: [],
  },
  '2.3-D-24': {
    actions: ['Walk the entire accessible path checking for surface discontinuities greater than 5mm; repair or replace any found per AS 1428.1:2021 Clause 7.', 'Eliminate abrupt thresholds between rooms; use threshold ramps or flush transitions.', 'Repair cracked tiles, lifted vinyl seams, and loose carpet edges immediately upon discovery.', 'Ensure expansion joints and construction joints are flush and filled to prevent cane tips or wheelchair castors catching.', 'Include floor condition in weekly or monthly maintenance inspections, with a documented repair escalation process.', 'Pay special attention to transitions between different flooring materials (carpet to tile, timber to concrete) where level differences commonly occur.'],
    reasoning: 'Cracked tiles, lifted carpet edges, uneven pavers, and abrupt thresholds are trip hazards that cause falls for people with gait impairments, vision impairment, or neuropathy in their feet. This is one of the most common injury causes in built environments. Safety-critical.',
    resources: [],
  },
  '2.3-D-25': {
    actions: ['Install continuous handrails on both sides of all internal stair flights per AS 1428.1:2021 Clause 11.1.', 'Ensure handrails are 865-1000mm above the stair nosing line per AS 1428.1:2021 Clause 11.1.', 'Extend handrails 300mm horizontally beyond the top and bottom risers per AS 1428.1:2021 Clause 11.1.', 'Use a grippable circular or oval profile of 30-50mm diameter per AS 1428.1:2021 Clause 11.1.', 'Ensure handrails are firmly fixed, contrast visually with the wall, and are continuous through intermediate landings.'],
    reasoning: 'Internal stairs without handrails on both sides create a fall risk for people with balance impairments, hemiplegia (weakness on one side), or reduced lower limb strength. A person must be able to grip a rail on their strong side regardless of direction of travel.',
    resources: [],
  },
  '2.3-D-26': {
    actions: ['Apply contrasting nosing strips to every step edge on internal stairs per AS 1428.1:2021 Clause 11.1.', 'Ensure nosings are 50-75mm wide on the tread and 30-50mm on the riser face, with at least 30% luminance contrast.', 'Use non-slip nosing materials that remain visible and slip-resistant in all conditions.', 'Ensure nosings do not protrude beyond the riser face (flush or recessed profile to prevent tripping).', 'Replace worn, chipped, or peeling nosing strips as part of routine maintenance.'],
    reasoning: 'Internal stair nosings that do not contrast with the tread surface are invisible to people with low vision, cataracts, or depth perception difficulties. Misjudging a step causes falls down stairs, which are among the most serious injury events in buildings. Safety-critical.',
    resources: [],
  },
  '2.3-D-27': {
    actions: ['Enclose all risers on internal stairs to eliminate gaps per AS 1428.1:2021 Clause 11.1.', 'Install riser infill panels that are flush with the tread nosing edge if retrofitting existing open-riser stairs.', 'Ensure riser height is consistent across all steps (max 190mm) per AS 1428.1:2021 Clause 11.1.', 'Verify that going (tread depth) is at least 250mm per AS 1428.1:2021 Clause 11.1.', 'Use a solid, rigid material for infill that does not flex or rattle underfoot.'],
    reasoning: 'Open risers on internal stairs create the same hazards as at entrances: cane tips and shoe toes can catch in the gap, and the visual transparency disorients people with depth perception difficulties. It is a particular risk for children and people with smaller feet.',
    resources: [],
  },
  '2.3-D-28': {
    actions: ['Install warning TGSIs (truncated domes/cones) at the top and bottom of all internal stair flights per AS 1428.4.1.', 'Position TGSIs 300mm from the nosing of the first/last step, extending across the full width of the stairway.', 'Ensure TGSIs contrast with the landing surface by at least 30% luminance contrast.', 'Maintain TGSIs so domes remain raised and firmly fixed; replace any worn or loose TGSIs promptly.', 'Where stairs are in a stairwell with intermediate landings, install TGSIs at every landing-to-stair transition.'],
    reasoning: 'TGSIs at internal stairs alert people with vision impairment that they are approaching a descending (or ascending) level change. Stairs are the highest-risk hazard point in a building for someone who is blind. TGSIs are the primary safety warning mechanism.',
    resources: [],
  },
  '2.3-D-29': {
    actions: ['Measure the gradient of all internal ramps using a digital inclinometer. Maximum gradient is 1:14 per AS 1428.1:2021 Clause 10.3.', 'If any ramp exceeds 1:14, rebuild to achieve 1:14 or install a platform lift as an alternative.', 'Provide level landings (minimum 1200mm long) at the top, bottom, and every 9 metres of ramp run per AS 1428.1:2021 Clause 10.3.', 'Ensure the ramp is at least 1000mm wide between handrails per AS 1428.1:2021 Clause 10.3.', 'A gradient of 1:20 or flatter is preferred for longer ramps as it requires significantly less effort.'],
    reasoning: 'An excessively steep internal ramp is dangerous for wheelchair users (risk of tipping forward on descent or rolling backward on ascent), exhausting for manual wheelchair users and walking frame users, and creates a trip hazard for everyone.',
    resources: [],
  },
  '2.3-D-30': {
    actions: ['Install warning TGSIs (truncated domes/cones) at the top and bottom of all internal ramps per AS 1428.4.1.', 'Position TGSIs 300mm from the start of the ramp slope at each end.', 'Ensure TGSIs extend across the full width of the ramp.', 'Ensure TGSI colour contrasts with the landing surface by at least 30% luminance.', 'Where ramps have intermediate landings, install TGSIs at each landing-to-slope transition.'],
    reasoning: 'TGSIs at internal ramps alert people with vision impairment to the start and end of the slope. Without them, a person using a cane may step unexpectedly onto a descending ramp and lose balance.',
    resources: [],
  },
  '2.3-D-31': {
    actions: ['Provide a lift or compliant ramp adjacent to every internal escalator per Premises Standards 2010 D3.2.', 'Sign the accessible alternative with the ISA and directional arrows, visible from the escalator location.', 'Ensure the alternative serves the same levels as the escalator.', 'Ensure the alternative lift meets AS 1735.12 requirements or the ramp meets AS 1428.1:2021 Clause 10.3.', 'If the alternative is not immediately adjacent, provide clear, continuous wayfinding signage from the escalator to the alternative.'],
    reasoning: 'Escalators are a complete barrier for wheelchair users and a significant hazard for people with balance impairments, vision impairment, or anxiety. Without an accessible alternative at the same location, people with disabilities cannot access other levels.',
    resources: [],
  },
  '2.3-D-32': {
    actions: ['Install warning TGSIs (truncated domes/cones) at the top and bottom of all escalators per AS 1428.4.1.', 'Position TGSIs 300mm from the escalator comb plate.', 'Ensure TGSIs extend across the full width of the approach area.', 'Ensure TGSI colour contrasts with the floor by at least 30% luminance.', 'Combine TGSIs with directional signage pointing to the accessible alternative (lift or ramp).'],
    reasoning: 'Escalators are hazardous for people with vision impairment: the moving steps are difficult to judge, and the entry/exit points are where falls most commonly occur. TGSIs warn the person that they are approaching an escalator, giving them time to seek the accessible alternative.',
    resources: [],
  },
  '2.3-D-5': {
    actions: ['Install directional signage at every internal decision point (corridor intersections, lift lobbies, stairwell entries) pointing to key destinations.', 'Sign at minimum: toilets, lifts, reception/service counter, emergency exits, and any accessible-specific routes.', 'Use consistent sign design (font, colour, ISA placement, arrow style) throughout the venue for recognisability.', 'Position signs at 1400-1600mm height for readability by both standing and seated users per AS 1428.1:2021 Clause 8.', 'Supplement visual signage with tactile or Braille room identification signs at key destinations.'],
    reasoning: 'Internal wayfinding signage prevents disorientation and reduces the need to ask staff for help, which matters greatly for people with anxiety, cognitive disabilities, hearing impairment (who may struggle with verbal directions), and vision impairment.',
    resources: [],
  },
  '2.3-D-6': {
    actions: ['Mount directional and identification signage at 1400-1600mm from floor level per AS 1428.1:2021 Clause 8.', 'For room identification signs (tactile), mount on the wall beside the door latch at 1200-1600mm per AS 1428.1:2021 Clause 8.', 'For overhead/suspended signs (e.g. aisle markers), ensure the bottom edge is at least 2100mm high and text is sized appropriately for the reading distance.', 'Avoid placing signs behind glass, on cluttered walls, or in recessed areas where they are partially hidden.', 'Check that signs are visible from a wheelchair height (approximately 1100mm eye level) without obstruction by furniture, plants, or other people.'],
    reasoning: 'Signage mounted too high is unreadable for wheelchair users and people of short stature. Signage too low may be obscured by crowds or furniture. Consistent, accessible height placement ensures everyone can locate and read wayfinding information.',
    resources: [],
  },
  '2.3-D-7': {
    actions: ['Provide a floor plan or site map at the main entrance and at each level entry point (lift lobby, stairwell landing).', 'Offer the map in multiple formats: printed large-print version, tactile raised-line version, and digital version accessible via screen reader.', 'Include "You Are Here" markers on physical maps, oriented to match the viewer\'s perspective.', 'Highlight the accessible route, accessible toilets, lifts, and rest areas on the map.', 'Make portable copies available at reception or as a downloadable PDF on your website.'],
    reasoning: 'Large or complex venues (hospitals, airports, universities, shopping centres) are difficult to navigate for anyone, but particularly challenging for people with cognitive disabilities, autism, or vision impairment who may become severely anxious when disoriented.',
    resources: [],
  },
  '2.3-D-8': {
    actions: ['Ensure all internal signage has a minimum 70% luminance contrast between text and background per AS 1428.1:2021 Clause 8.2.', 'Use dark text on a light background (or light text on dark background) using solid, non-patterned colours.', 'Select sans-serif fonts at a minimum height of 15mm per metre of reading distance per AS 1428.1:2021 Clause 8.2.', 'Avoid glossy sign surfaces that create reflective glare under overhead lighting.', 'Test signage readability with older adults or people with low vision as part of your accessibility review.'],
    reasoning: 'Low-contrast signage is the most common wayfinding failure. People with low vision, cataracts, or age-related vision changes cannot read signs with insufficient contrast between text and background, rendering the wayfinding system useless for them.',
    resources: [],
  },
  '2.3-D-9': {
    actions: ['Install tactile ground surface indicators (TGSIs) along primary circulation routes and at all hazard points per AS 1428.4.1.', 'Provide tactile and Braille room identification signs at key destinations (toilets, lifts, exits) per AS 1428.1:2021 Clause 8.', 'Consider an audio wayfinding system (Bluetooth beacons, NaviLens, or similar) for complex venues.', 'Install audible signals in lifts (floor announcements, door open chimes) per AS 1735.12.', 'Offer a verbal orientation or guided familiarisation tour for first-time visitors who request it.'],
    reasoning: 'People who are blind or have severe vision impairment cannot use visual wayfinding at all. Without tactile or auditory alternatives, they are entirely dependent on staff assistance or a sighted companion, which limits independence and dignity.',
    resources: [],
  },
  // Module 2.4
  '2.4-1-1': {
    actions: ['Assess queue areas and identify where seating can be added without blocking the queue path.', 'Install fixed or provide portable fold-down seats at regular intervals in longer queue areas.', 'Ensure seated customers can see queue movement and maintain their position without needing to stand.', 'Add signage indicating that seating is available for people who need it.'],
    reasoning: 'Many people with chronic pain, fatigue conditions, heart conditions, or hidden disabilities cannot stand for extended periods. Without seating, they may collapse, experience pain flare-ups, or be forced to leave.',
    resources: [],
  },
  '2.4-1-2': {
    actions: ['Develop a written priority access policy that does not require customers to disclose their specific condition.', 'Train all customer-facing staff to offer priority access proactively and respond positively to requests.', 'Display signage at queue entry points informing customers that priority access is available.', 'Include the priority access option in your pre-visit information (website, booking confirmations).'],
    reasoning: 'People with hidden disabilities (chronic fatigue, pain conditions, anxiety disorders) often cannot endure long queues but may feel unable to ask for help. A clear, visible priority access system removes this barrier.',
    resources: [],
  },
  '2.4-1-2a': {
    actions: ['Designate an accessible entry point that bypasses the main queue, with clear signage and level access.', 'Ensure staff at this entry point are trained to welcome customers and process entry efficiently.', 'Publish the accessible entry option on your website, accessibility page, and booking confirmations.', 'Test the route with a wheelchair user to confirm it is genuinely accessible and dignified.'],
    reasoning: 'Standard queues often have barriers (narrow lanes, rope barriers, uneven surfaces) that exclude wheelchair users and people with mobility aids. A dedicated accessible entry preserves dignity and ensures equal access.',
    resources: [],
  },
  '2.4-1-3': {
    actions: ['Include queue accommodation scenarios in staff induction training: assisting wheelchair users through barriers, communicating with Deaf customers, guiding blind customers.', 'Create a quick-reference card for staff listing common accommodation requests and appropriate responses.', 'Run refresher training at least annually and after any changes to queue layouts.', 'Empower staff to use their judgement to offer assistance without needing manager approval.'],
    reasoning: 'Staff who are unsure how to help may avoid offering assistance or respond inappropriately, leaving customers with disabilities without support during a stressful waiting experience.',
    resources: [],
  },
  '2.4-D-10': {
    actions: ['Provide at least some queue seating with armrests, positioned alongside or within the queue area.', 'Ensure seats with armrests have a seat height of 450-480mm per AS 1428.1:2021 Clause 25.', 'Provide a firm, level 800mm x 1300mm space beside armrest seating for a wheelchair user to park alongside a companion.', 'Ensure seating does not obstruct the accessible queue path.', 'Select seats with backrests and armrests that are sturdy enough to support a person pulling themselves up.'],
    reasoning: 'Standard bench-style queue seating without armrests is very difficult for people with reduced lower limb strength, hip replacements, or balance impairments to sit down on and, more critically, to stand up from. Armrests provide the leverage needed for safe transfers.',
    resources: [],
  },
  '2.4-D-11': {
    actions: ['Use queue barriers in a high-contrast colour (e.g. bright red, yellow, or blue belt on a silver post) that stands out against the floor and background per AS 1428.1:2021 Clause 8.', 'Ensure barrier belts are at a detectable height (cane-detectable at the base, or with a bottom rail at 150-200mm).', 'If using rope barriers, select a thick, visible rope rather than thin cord.', 'Ensure stanchion posts have a contrasting base or are positioned on a contrasting surface so they are visible to people with low vision.', 'Avoid transparent or glass barriers in queue areas unless they have contrast manifestation applied.'],
    reasoning: 'Queue barriers made of thin rope, dark tape, or transparent stanchion belts are invisible to people with low vision, causing collisions that are painful and embarrassing. Belt barriers at waist height also create a tripping hazard.',
    resources: [],
  },
  '2.4-D-12': {
    actions: ['Ensure queue area flooring is firm, level (no more than 1:40 gradient), and slip-resistant per AS 1428.1:2021 Clause 7 and AS 4586.', 'Verify slip resistance is at least R10 (R11 if the area may get wet) per AS 4586.', 'Remove or securely recess any mats or mat edges that could trip cane users or catch wheelchair castors.', 'Repair any uneven joins, cracked tiles, or lifted flooring in the queue area promptly.', 'Ensure drainage is adequate to prevent water pooling in outdoor or semi-outdoor queue areas.'],
    reasoning: 'Queue areas with loose mats, slippery tiles, or uneven surfaces create fall hazards for people using mobility aids, crutches, or prosthetics. People standing for long periods are also more prone to slipping on poor surfaces.',
    resources: [],
  },
  '2.4-D-13': {
    actions: ['Provide queue announcements in both audio and visual formats (e.g. a spoken call plus a screen displaying the ticket number).', 'Ensure audio announcements are clear and amplified above background noise levels.', 'If using a hearing loop (audio induction loop), install it in the queue/waiting area and sign it with the loop symbol per AS 1428.5.', 'Ensure visual displays use large, high-contrast text readable from the waiting area.', 'Consider vibrating pagers or SMS notifications as an alternative for people who cannot hear or see queue call systems.'],
    reasoning: 'Queue announcements that rely solely on audio exclude people who are deaf or hard of hearing, while visual-only systems exclude people with vision impairment. Multi-modal communication ensures everyone knows when it is their turn.',
    resources: [],
  },
  '2.4-D-14': {
    actions: ['Document your accessible entry and priority access system in a clear, written policy.', 'Publish the policy on your website accessibility page, including eligibility, how to request, and what to expect.', 'Include accessible entry information in booking confirmations, event tickets, and pre-visit emails.', 'Train all customer-facing staff on the policy so they can explain it consistently.', 'Review and update the policy at least annually or whenever the entry process changes.'],
    reasoning: 'If priority or accessible entry processes are not documented and communicated in advance, people with disabilities cannot plan for a smooth arrival. They arrive uncertain whether assistance is available, which increases anxiety and may deter the visit entirely.',
    resources: [],
  },
  '2.4-D-15': {
    actions: ['Register as a Companion Card affiliate at companioncard.gov.au (or your state equivalent).', 'Train ticketing and front-of-house staff to recognise and accept Companion Card without question or delay.', 'Display the Companion Card logo at ticket counters and on your website ticketing page.', 'Extend recognition to other access passes (e.g. Carer Card, NDIS support worker identification) as appropriate.', 'Ensure online ticketing systems can process a free companion ticket when the cardholder is purchasing.'],
    reasoning: 'Companion Card is an Australian program that provides a second ticket free for a person who requires a companion due to disability. Not recognising it creates a financial barrier, as the person must pay for two tickets. Similar programs (e.g. NDIS-funded support workers) should also be accommodated.',
    resources: [],
  },
  '2.4-D-16': {
    actions: ['Ensure digital queue number boards use large, high-contrast text (minimum 50mm character height for a 5-metre reading distance).', 'Provide both visual and audio notifications when a number is called (dual-mode output).', 'If using a touch-screen ticket kiosk, ensure it has high-contrast mode, large buttons, and screen reader compatibility.', 'Position digital displays at a height and angle readable from both standing and seated positions.', 'Provide a manual alternative (staff-issued numbered ticket, verbal call) for anyone who cannot use the digital system.'],
    reasoning: 'Digital queue displays that rely solely on small visual numbers exclude people with vision impairment, while audio-only call systems exclude people who are deaf. If the queue system is inaccessible, the person may miss their turn entirely.',
    resources: [],
  },
  '2.4-D-4': {
    actions: ['Ensure queue lanes are at least 1000mm wide (1200mm preferred) to accommodate wheelchairs and mobility aids per AS 1428.1:2021 Clause 7.', 'Provide 1800mm x 1800mm turning space at queue entry and exit points.', 'Use retractable belt barriers rather than fixed posts so lane width can be adjusted when needed.', 'Ensure queue barriers do not create dead ends; provide an exit option if a wheelchair user needs to leave the queue.', 'Offer a priority access lane or alternative service arrangement for people who cannot use the standard queue.'],
    reasoning: 'Standard queue layouts with narrow rope-and-stanchion mazes are impassable for wheelchair users, people with walking frames, or parents with large strollers. If the queue is not accessible, the person cannot reach the service point at all.',
    resources: [],
  },
  '2.4-D-5': {
    actions: ['Install signage at the queue entry point and service counter indicating that accessible queuing assistance is available.', 'Include the ISA on the signage along with a brief statement such as "Please ask staff if you need queuing assistance."', 'Position the sign at 1400-1600mm height, in high-contrast text, readable from the queue entry area.', 'Include the same information on your website, booking confirmation, and any pre-visit communications.', 'Train staff to recognise when a customer may need queue assistance and offer it proactively.'],
    reasoning: 'Without signage indicating that queue assistance is available, people with disabilities may not know they can request priority access, a seated waiting option, or staff assistance. They may endure pain, fatigue, or distress rather than ask.',
    resources: [],
  },
  '2.4-D-6': {
    actions: ['Offer at least one alternative to standing in a physical queue: text/SMS notification, numbered ticket system, pager, or app-based virtual queue.', 'Ensure the alternative system is accessible: text notifications work for Deaf people; numbered tickets are large-print and high-contrast; apps are screen-reader compatible.', 'Allow people to sit in a nearby waiting area and return to their queue position when called.', 'Display clear instructions for how to use the alternative system at the queue entry and on your website.', 'Train staff to offer the alternative proactively, not only when a customer requests it.'],
    reasoning: 'Standing in a queue for extended periods is impossible for people with chronic pain, fatigue conditions (ME/CFS, fibromyalgia), cardiac conditions, or anxiety disorders. Alternative arrangements preserve access to the service without requiring physical endurance.',
    resources: [],
  },
  '2.4-D-7': {
    actions: ['Display estimated wait times visually (digital screen or whiteboard) at the queue entry point.', 'Update wait time estimates regularly (at least every 15 minutes during busy periods).', 'Provide wait time information in a format accessible to people with vision impairment (staff verbal notification, audio announcement).', 'Where possible, publish live wait times on your website or app so people can plan before arriving.', 'Train staff to communicate wait times honestly when asked, including any priority access options that may reduce the wait.'],
    reasoning: 'Unknown wait times cause significant anxiety for people with autism, cognitive disabilities, or anxiety disorders. They also prevent people with pain or fatigue from making informed decisions about whether they can physically endure the wait.',
    resources: [],
  },
  '2.4-D-8': {
    actions: ['Include accessible path maintenance in your crowd management plan, ensuring a minimum 1000mm clear path is maintained at all times per AS 1428.1:2021 Clause 7.', 'Designate specific overflow areas that do not encroach on accessible routes.', 'Brief staff at the start of each busy period to monitor and maintain clear pathways.', 'Use physical markers (floor tape, fixed bollards) to delineate the minimum accessible path that must not be obstructed.', 'Conduct a walk-through during your busiest period to identify where pathways are most at risk of being blocked.'],
    reasoning: 'During peak times, crowds, extra furniture, temporary barriers, and queues can spill into accessible pathways, blocking wheelchair access and creating confusing environments for people with cognitive or sensory disabilities.',
    resources: [],
  },
  '2.4-D-9': {
    actions: ['Publish typical busy periods and expected wait times on your website accessibility page or FAQ.', 'Describe your queue assistance options (priority access, alternative queuing, seated waiting) in pre-visit information.', 'If you offer a booking or reservation system that allows queue-skipping, highlight this as an accessibility benefit.', 'Provide a phone number or email for visitors to contact in advance to arrange accessible entry or queue assistance.', 'Update this information seasonally or when operational changes affect wait times.'],
    reasoning: 'Pre-visit information about queuing and busy periods allows people with disabilities to plan their visit at a quieter time, arrange for queue assistance in advance, or mentally prepare for waiting. This is essential for people with anxiety, autism, and chronic pain.',
    resources: [],
  },
  // Module 3.1
  '3.1-1-1': {
    actions: ['Audit current seating and categorise by type: with arms, without arms, high seat, low seat, firm cushion, soft cushion.', 'Add seats with armrests for people who need support to sit down and stand up.', 'Include at least some seats at 450-500mm seat height (standard wheelchair transfer height).', 'Ensure some seats have firm cushions for people with back pain or joint conditions.', 'Label or distinguish accessible seating options so customers can identify them easily.'],
    reasoning: 'People with arthritis, joint replacements, chronic pain, or reduced strength need armrests and appropriate seat heights. Without variety, some customers physically cannot sit down or stand up safely.',
    resources: [],
  },
  '3.1-1-2': {
    actions: ['Designate wheelchair companion spaces (minimum 800mm x 1300mm clear space) adjacent to standard seating.', 'Ensure companion spaces are distributed throughout the venue, not limited to one area.', 'Remove any fixed furniture that blocks wheelchair access to companion spaces.', 'Mark companion spaces with the International Symbol of Access and include them in venue maps.'],
    reasoning: 'Wheelchair users want to sit with their family and friends, not be segregated to a separate area. Without adjacent companion spaces, wheelchair users are physically separated from their group.',
    resources: [],
  },
  '3.1-1-3': {
    actions: ['Measure clearance under all tables and counters used by customers (minimum 750mm height, 500mm depth for knee clearance).', 'Ensure at least one service counter per area has a lowered section (maximum 850mm high).', 'Replace any pedestal-base tables that block knee clearance with four-leg or cantilever designs.', 'Test access by sitting in a wheelchair and attempting to use each table and counter.'],
    reasoning: 'Wheelchair users need knee clearance under tables to pull up and use them comfortably. Counter heights above 1100mm prevent wheelchair users from seeing staff, making payments, or completing transactions.',
    resources: [],
  },
  '3.1-1-4': {
    actions: ['Identify which furniture is fixed and which can be moved.', 'Replace heavy fixed furniture in key areas with lighter movable alternatives where feasible.', 'Train staff to offer to rearrange furniture on request and respond positively.', 'Keep spare folding chairs available for creating additional companion spaces.'],
    reasoning: 'Fixed furniture cannot accommodate the varied spatial needs of wheelchair users, mobility aid users, and people with service animals. Flexible layouts enable genuine inclusion rather than a one-size-fits-all approach.',
    resources: [],
  },
  '3.1-D-1': {
    actions: ['Audit all public seating areas and record which types are available: standard chairs, chairs with armrests, high-back chairs, bariatric/extra-wide seats (min 600 mm wide, rated to 200 kg+), stools, benches, and movable/stackable options.', 'Ensure at least some seating has armrests to assist people who need support when sitting or standing; armrest height should be 200-250 mm above the seat per AS 1428.2 Clause 27.', 'Provide a mix of seat heights (400-480 mm from floor to seat top) so people of different statures, including those with hip or knee conditions, can sit comfortably (AS 1428.2 Clause 27.2).', 'Confirm that at least some chairs are movable so companions can sit beside wheelchair users or so seating can be rearranged to suit groups with different needs.', 'Include seating without armrests in the mix for people who transfer laterally from a wheelchair or need extra width.', 'Document available seating types in your pre-visit accessibility information so customers can plan ahead.'],
    reasoning: 'Offering a range of seating options (movable chairs, bench seating, bariatric options) ensures people with varying mobility, pain, and body-size needs can participate comfortably. A one-size-fits-all approach excludes many customers.',
    resources: [],
  },
  '3.1-D-10': {
    actions: ['Provide at least one writing surface or desk at a height of 750-870 mm above floor level, with knee and toe clearance underneath of at least 700 mm high and 500 mm deep (AS 1428.2 Clause 24).', 'Ensure the surface is at least 900 mm wide to allow space for paperwork and an arm rest.', 'Position the accessible writing surface on the accessible path of travel, near where forms are issued.', 'Offer alternatives to handwritten forms where possible (online forms, staff assistance, verbal responses) for people who cannot write.', 'Ensure pens and clipboards are available at the accessible surface without needing to ask.'],
    reasoning: 'Requiring customers to complete forms at a high counter or standing desk excludes wheelchair users and people who need to be seated. An accessible writing surface ensures equitable service delivery.',
    resources: [],
  },
  '3.1-D-12': {
    actions: ['Verify that wheelchair spaces provide sightlines comparable to surrounding seated patrons, including when the audience stands (AS 1428.1 Clause 16.3 requires enhanced sightlines).', 'Position wheelchair spaces so the line of sight is not obstructed by safety barriers, sound equipment, columns, or the heads of people in the row in front.', 'Provide wheelchair spaces at multiple levels or locations (stalls, dress circle) to offer a choice of viewing experience.', 'Test sightlines from each wheelchair space during actual events or rehearsals and document findings.', 'Ensure companion seating does not block the wheelchair user\'s sightline and is at a comparable height.'],
    reasoning: 'Wheelchair spaces with obstructed sightlines provide a lesser experience and may breach anti-discrimination obligations. Equivalent sightlines ensure wheelchair users can enjoy performances, presentations, and events on the same terms as others.',
    resources: [],
  },
  '3.1-D-13': {
    actions: ['Ensure accessible seating options are visible and bookable through all standard booking channels (website, app, box office) without requiring a phone call or special request.', 'Display accessible seating on seat maps with clear labelling (wheelchair space, companion seat, enhanced amenity area).', 'Avoid requiring proof of disability to book accessible seating; instead, use a simple self-declaration or checkbox.', 'Set the price of accessible seating at the same rate as equivalent standard seating in the same zone.', 'Provide a companion seat booking option at the same time, ideally at a free or discounted rate in line with the Companion Card scheme.', 'Test the end-to-end booking flow for accessible seating to confirm it works with screen readers and keyboard-only navigation (WCAG 2.2 Level AA).'],
    reasoning: 'If accessible seating can only be booked by phone or requires a separate process, it creates an additional barrier and signals that people with disability are an afterthought in your booking system.',
    resources: [],
  },
  '3.1-D-14': {
    actions: ['Ensure furniture edges contrast with the floor by at least 30% luminance contrast (AS 1428.1 Clause 6). For example, dark chairs on a light floor or light tables on a dark floor.', 'Pay particular attention to glass tables, transparent barriers, and light-coloured furniture on pale floors, which are common hazards.', 'Apply contrasting strips, caps, or edging to furniture legs if the overall contrast is insufficient.', 'Audit contrast under all lighting conditions (daytime, evening, dimmed) as contrast can change significantly.', 'Consider tactile or colour-contrasting floor treatments around furniture clusters to aid detection with a long cane.'],
    reasoning: 'Furniture that blends with the floor is a collision and trip hazard for people with low vision. Luminance contrast helps people detect and navigate around furniture safely.',
    resources: [],
  },
  '3.1-D-15': {
    actions: ['Ensure at least one accessible path connects the indoor accessible path of travel to outdoor seating areas, with a firm, level surface and no steps or lips greater than 5 mm (AS 1428.1 Clause 7.5).', 'Provide a level, firm surface under and around outdoor seating (concrete, compacted pavers, or decking; not loose gravel, sand, or grass that impedes wheels).', 'Include shade structures or umbrellas at accessible outdoor tables for people with heat sensitivity, photosensitivity, or medication-related sun sensitivity.', 'Position at least some outdoor accessible seating within 50 m of the nearest accessible toilet.', 'Ensure outdoor furniture includes options with armrests and appropriate heights, matching the indoor accessible seating standards.'],
    reasoning: 'Outdoor areas that are inaccessible deny customers the choice of where to sit, dine, or relax. Many customers with disability prefer outdoor settings but are excluded by steps, gravel, or lack of shade.',
    resources: [],
  },
  '3.1-D-2': {
    actions: ['Measure all primary aisles between furniture: minimum 1000 mm clear width for a single passage, 1800 mm where two wheelchairs need to pass, per AS 1428.1 Clause 7.2.', 'Check that furniture placement does not create pinch points narrower than 850 mm at any location along the accessible path of travel (Premises Standards Schedule 1).', 'Ensure aisles are free of trip hazards such as chair legs extending into the path, loose cables, or uneven floor transitions greater than 5 mm (AS 1428.1 Clause 7.5).', 'Verify that at least one accessible route connects the entrance to all key service areas, seating zones, and amenities without requiring furniture to be moved.', 'Review aisle widths after any furniture rearrangement (e.g., for events or seasonal changes) to confirm ongoing compliance.', 'Mark or fix furniture positions with floor guides or non-slip pads where layouts tend to drift over time.'],
    reasoning: 'Narrow aisles between furniture are a direct barrier for wheelchair users, people using walking frames, and those with vision impairment. The Premises Standards require continuous accessible paths of travel.',
    resources: [],
  },
  '3.1-D-3': {
    actions: ['Provide at least one section of service counter with a maximum height of 870 mm above finished floor level, measured to the top of the counter surface (AS 1428.2 Clause 24.1).', 'Ensure the lowered section is at least 800 mm wide to allow comfortable approach and use, with knee clearance underneath of at least 700 mm high and 500 mm deep (AS 1428.2 Clause 24.2).', 'Position the lowered counter on an accessible path of travel, not tucked away in a side area or behind other obstacles.', 'If a permanent lowered counter is not feasible, provide a portable clipboard, side table, or alternative service point where staff can attend to customers at an accessible height.', 'Ensure the lowered counter is clearly signed and that staff are trained to direct customers to it without being asked.', 'Confirm that EFTPOS machines and other point-of-sale equipment at the lowered counter are within reach range (400-1100 mm above floor, AS 1428.1 Clause 11.1).'],
    reasoning: 'Standard-height counters can be unusable for wheelchair users, people of short stature, and those who cannot stand for long periods. The Premises Standards require accessible service counters in public buildings.',
    resources: [],
  },
  '3.1-D-4': {
    actions: ['Provide wheelchair spaces in proportion to total seating: at least 1 space per 100 seats (or part thereof) as a minimum, with a target of 1-2% of total capacity for best practice.', 'Each wheelchair space must be at least 900 mm wide and 1300 mm deep on a level surface, with a companion seat immediately adjacent (AS 1428.1 Clause 16.2).', 'Offer wheelchair spaces in a variety of locations throughout the venue (front, middle, rear) so wheelchair users have comparable choices to other patrons, not just one zone.', 'Provide WCA (Wheelchair Companion Area), EAA (Enhanced Amenity Area), and extra-width seating where practical to cater for people with larger wheelchairs, service animals, or carer support needs.', 'Ensure all accessible seating locations have an accessible path of travel from the entrance, including to amenities such as toilets and refreshments.'],
    reasoning: 'In fixed seating venues (theatres, stadiums, lecture halls), wheelchair-accessible spaces and companion seating are a legal requirement under the Premises Standards and the Disability Discrimination Act 1992.',
    resources: [],
  },
  '3.1-D-5': {
    actions: ['Install rest seating at intervals no greater than 60 m along primary walking routes, as recommended by AS 1428.2 Clause 27.', 'Position rest seating near high-traffic areas (entry, lift lobbies, service counters), at points of interest, and near toilets.', 'Ensure rest seats have backrests and at least one armrest; seat height of 450-480 mm to aid sitting and standing (AS 1428.2 Clause 27.2).', 'Include a clear floor space of at least 900 mm x 1300 mm adjacent to each rest seat so a wheelchair user can sit alongside a companion.', 'Ensure rest seating does not obstruct the accessible path of travel or reduce aisle width below 1000 mm.', 'Consider weather protection (shade, cover) for outdoor rest seating.'],
    reasoning: 'Rest seating along walking routes is essential for people with chronic pain, fatigue conditions, cardiac or respiratory conditions, and older people. Without it, the venue may be unusable beyond a short distance.',
    resources: [],
  },
  '3.1-D-6': {
    actions: ['Confirm your venue policy explicitly allows assistance animals (guide dogs, hearing dogs, other accredited assistance animals) in all public areas, including dining and seating areas.', 'Ensure sufficient floor space beside or under seating for an assistance animal to lie down comfortably (approximately 1200 mm x 600 mm clear floor area).', 'Train all staff on assistance animal rights: they must not ask the person to prove disability, only whether the animal is an assistance animal if not obvious.', 'Provide a water bowl or water station for assistance animals.', 'Review seating arrangements to ensure at least some tables/seats have enough space for a large dog without blocking aisles or exits.'],
    reasoning: 'Under Australian law (Disability Discrimination Act 1992), assistance animals must be permitted in all public premises. Refusing or failing to accommodate a service animal is unlawful discrimination.',
    resources: [],
  },
  '3.1-D-7': {
    actions: ['Designate an outdoor relief area with a suitable surface (grass or gravel, not bare concrete), ideally within 100 m of the main entrance.', 'Provide a waste bag dispenser and bin at the relief area.', 'Ensure the path from the venue to the relief area is accessible (smooth, level, minimum 1000 mm wide, well-lit).', 'Include the location of the relief area in your pre-visit accessibility information and in any venue map or guide.', 'Sign the area clearly so it is easy to find, and train front-of-house staff to direct people to it.'],
    reasoning: 'Assistance animals may need a relief area during longer visits. Without a designated area, handlers must leave the venue entirely, disrupting their experience and potentially missing parts of events.',
    resources: [],
  },
  '3.1-D-8': {
    actions: ['Install coat hooks and shelving at a height range of 900-1100 mm above finished floor level to suit seated and standing users (AS 1428.1 Clause 11.1).', 'Where lockers are provided, ensure at least 50% are within the accessible reach range (400-1200 mm above floor), with lock mechanisms operable with one hand and without tight gripping or twisting.', 'Verify clear floor space of at least 800 mm x 1300 mm in front of accessible hooks, lockers, and shelves to allow wheelchair approach.', 'Avoid placing items behind doors or in narrow alcoves that would prevent wheelchair access.', 'Label accessible lockers and hooks with tactile numbering for people with vision impairment.'],
    reasoning: 'Coat hooks, lockers, and shelving placed too high or too low exclude wheelchair users, people of short stature, and those with limited reach. Accessible heights are defined in AS 1428.1.',
    resources: [],
  },
  '3.1-D-9': {
    actions: ['Position all operable controls (light switches, power outlets, thermostats, intercoms) between 900 mm and 1100 mm above finished floor level (AS 1428.1 Clause 11.1).', 'Ensure controls can be operated with one hand, without tight grasping, pinching, or twisting of the wrist, and with a maximum force of 22 N (AS 1428.1 Clause 11.2).', 'Provide a clear floor space of 800 mm x 1300 mm in front of each control panel for wheelchair approach.', 'Ensure controls have adequate visual contrast against the wall surface (minimum 30% luminance contrast per AS 1428.1 Clause 6).', 'Consider rocker-style or touch switches instead of small toggle switches, and lever-handle or push-button locks instead of twist-knobs.'],
    reasoning: 'Controls that are out of reach, require tight gripping, or need excessive force exclude people with limited mobility, dexterity impairments, and wheelchair users from independently managing their environment.',
    resources: [],
  },
  // Module 3.10
  '3.10-1-1': {
    actions: ['Document your retail environment type (clothing, supermarket, department store, pharmacy, specialty, market stall).', 'Map the specific accessibility requirements for your retail type (fitting rooms, aisle widths, counter heights, product display heights).', 'Identify which areas of your store present the most significant barriers for people with disabilities.'],
    reasoning: 'Different retail environments have distinct accessibility challenges. A clothing store needs accessible fitting rooms while a supermarket needs reachable shelves. Identifying your environment type focuses your improvement efforts.',
    resources: [],
  },
  '3.10-D-1': {
    actions: ['Provide at least one fitting room with a minimum clear floor space of 1400 x 1500 mm (or larger, per AS 1428.1 recommendations for accessible sanitary facilities used as a sizing benchmark).', 'Install an outward-opening door or curtain entry with a minimum 850 mm clear opening width.', 'Fit horizontal grab rails on at least two walls for support when standing or transferring.', 'Provide a fixed or fold-down seat at approximately 450-480 mm height and a full-length mirror usable from a seated position.', 'Ensure the accessible fitting room is located on an accessible path and clearly signed with the International Symbol of Access.'],
    reasoning: 'Fitting rooms that are too small for a wheelchair, have inward-opening doors, or lack grab rails exclude people with mobility disability from trying on clothes. Accessible fitting rooms are mandatory under the Premises Standards where fitting rooms are provided. This is also a safety concern as falls in small, cluttered spaces are common.',
    resources: [],
  },
  '3.10-D-2': {
    actions: ['Install an emergency call button or pull cord in every accessible fitting room, reachable from the floor (cord to within 100 mm of the floor) and from the seat.', 'Connect the alarm to a continuously staffed point (checkout, customer service) with a defined response procedure.', 'Ensure the alarm produces an audible and visual alert outside the fitting room so staff respond promptly.', 'Test the system weekly and log results.', 'Train all staff in the emergency response procedure, including how to enter the fitting room, communicate with the customer, and when to call 000.'],
    reasoning: 'A customer who falls or becomes unwell in a fitting room may be unable to leave or call for help. An emergency call button is a critical safety feature, especially in accessible fitting rooms where the occupant may have a condition that increases fall risk. This is mandatory where accessible facilities are provided.',
    resources: [],
  },
  '3.10-D-3': {
    actions: ['Establish a policy that fitting room assistance is available on request and communicate this via in-store signage and your website.', 'Train staff to assist respectfully and with appropriate boundaries, including asking for consent before touching garments on the customer.', 'Offer same-gender assistance if the customer prefers it.', 'Provide a way to summon assistance from inside the fitting room (call button or bell) so the customer does not need to leave and re-enter.', 'Ensure fitting room staff are trained in disability etiquette, including not making assumptions about what the customer can or cannot do.'],
    reasoning: 'Some customers need assistance with trying on clothes due to limited mobility, dexterity, or visual impairment. If staff are unwilling or untrained to assist, the customer cannot use the fitting room effectively.',
    resources: [],
  },
  '3.10-D-4': {
    actions: ['Ensure at least one self-checkout machine has a screen height and scanner position accessible from a seated position (screen centre no higher than 1200 mm).', 'Enable audio guidance on at least one machine so customers with vision impairment can navigate the checkout process via headphone jack or speaker.', 'Adjust bagging area weight tolerance on the accessible machine to accommodate items placed by people with limited control or who use adaptive techniques.', 'Provide clear, large-print, step-by-step instructions on or beside the machine.', 'Ensure a staff member is always stationed nearby to assist customers using self-checkout and to override machine errors promptly.'],
    reasoning: 'Self-checkout machines that are too high, lack audio guidance, have small touchscreens, or penalise unexpected items in the bagging area create barriers for wheelchair users, people with vision impairment, and people with cognitive or motor disabilities.',
    resources: [],
  },
  '3.10-D-5': {
    actions: ['Train checkout staff to offer bag packing assistance to all customers as a standard service, normalising it for everyone.', 'Display signage at checkout indicating that packing assistance is available.', 'Provide an option for customers to request assistance before arriving at checkout (e.g., a card or badge they can pick up at the entrance).', 'Ensure reusable bags with wide handles are available for purchase at an accessible height beside the checkout.'],
    reasoning: 'Packing bags requires grip strength, two-handed dexterity, and the ability to reach across a counter. People with upper-limb differences, chronic pain, or limited mobility may be unable to pack their own bags, and should not have to ask or feel like a burden.',
    resources: [],
  },
  '3.10-D-6': {
    actions: ['Offer multiple return channels: in-store (with accessible service counter), online, by post (with pre-paid labels), and via phone.', 'Ensure the in-store returns counter is at an accessible height with wheelchair approach space and is on an accessible path of travel.', 'Provide clear, plain-language return instructions in accessible formats (large print, digital, verbal).', 'Allow extended return periods for customers with disability who may need more time to try products at home.', 'Train returns staff to process returns without requiring excessive physical handling from the customer (e.g., staff unpack and inspect the item).'],
    reasoning: 'Returns and exchanges that require travelling to a store, standing in queues, or navigating inaccessible processes disadvantage people with disability. Flexible return options ensure equitable post-purchase service.',
    resources: [],
  },
  '3.10-D-7': {
    actions: ['Offer click-and-collect with a designated accessible pickup point that has step-free access, shelter, and clear signage.', 'Provide curbside pickup where staff bring items to the customer vehicle, reducing the need to enter the store.', 'Ensure your online ordering platform is WCAG 2.2 Level AA compliant so customers using screen readers, magnification, or switch access can place orders independently.', 'Offer home delivery with the option to request delivery to a specific location (e.g., inside the front door, on a table) for customers who cannot lift or carry packages.', 'Communicate all alternative shopping options prominently on your website, in-store signage, and through customer service channels.'],
    reasoning: 'Click-and-collect, curbside pickup, and home delivery are not just conveniences; for some people with disability, they are the only viable way to shop. These services eliminate barriers posed by inaccessible store layouts, parking, or physical stamina.',
    resources: [],
  },
  '3.10-D-8': {
    actions: ['Train staff to provide verbal product descriptions on request, including ingredients, care instructions, size, and price.', 'Offer a magnifying sheet or digital magnification tool at the customer service desk.', 'Provide product information via an accessible website or app that customers can search by product name or barcode scan.', 'Produce large-print versions of frequently requested product information (ingredient lists for common allergens, sizing charts).', 'Explore tactile or QR-coded product labels that link to accessible digital information for key product lines.'],
    reasoning: 'Standard product labels and packaging may be unreadable for people with vision impairment, cognitive disability, or low literacy. Providing product information in accessible formats supports informed decision-making and consumer rights.',
    resources: [],
  },
  '3.10-D-9': {
    actions: ['Maintain a minimum clear aisle width of 1000 mm throughout the store, with 1200 mm preferred for comfortable wheelchair passage and 1800 mm at key intersections for passing, per AS 1428.1:2021.', 'Conduct weekly walkthrough audits to check that merchandise, promotional displays, and restocking trolleys are not reducing aisle widths below the minimum.', 'Train staff to keep aisles clear during restocking and to remove temporary obstructions immediately.', 'Position end-of-aisle and freestanding displays so they do not encroach on the accessible path of travel or obscure sightlines.', 'Include aisle width maintenance in your store planogram standards and communicate requirements to visual merchandising and stock teams.'],
    reasoning: 'Narrow aisles and cluttered display layouts prevent wheelchair users, people with mobility aids, and people with prams or assistance animals from navigating the store. Maintaining accessible clearance widths is mandatory under the Premises Standards.',
    resources: [],
  },
  '3.10-PC-1': {
    actions: ['Train all floor staff to offer assistance proactively but respectfully, without assuming the customer needs help.', 'Install call buttons or service bells at accessible heights (900-1100 mm) in key aisle locations so customers can summon help without searching for staff.', 'Ensure staff are trained in guiding techniques for customers with vision impairment, including verbal descriptions of product location and features.', 'Provide a personal shopping assistance service (by phone, online pre-order, or in-store) for customers who need support navigating the store.', 'Display clear signage indicating how to request assistance, using both text and symbols.'],
    reasoning: 'Customers with disability may need help locating products in unfamiliar layouts, reaching items on high or low shelves, or handling products with limited grip or vision. If assistance is not easy to request, the customer cannot shop independently.',
    resources: [],
  },
  '3.10-PC-2': {
    actions: ['Use a minimum 14pt sans-serif font for shelf labels and price tags with a contrast ratio of at least 4.5:1 against the background.', 'Position price labels and product information between 600 mm and 1400 mm from the floor so they are readable from both standing and seated positions.', 'Ensure price labels are consistently positioned relative to the product they describe (directly below or to the left) to avoid confusion.', 'Offer a handheld magnifier or digital magnification tool at the customer service desk for customers who need it.', 'Provide a digital product catalogue (accessible website or app) where customers can search for products, prices, and aisle locations.'],
    reasoning: 'Product labels, price tags, and shelf information that are too small, low-contrast, or positioned at inaccessible heights exclude customers with low vision, those using wheelchairs, and people with cognitive disabilities from making informed purchasing decisions.',
    resources: [],
  },
  '3.10-PC-3': {
    actions: ['Provide accessible shopping trolleys (wheelchair-mountable baskets or trolleys designed for one-handed use) and make them available near accessible entrances.', 'Offer motorised scooters or powered shopping carts for customers with mobility impairment, with simple controls and clear operating instructions.', 'Ensure lightweight baskets with wide, comfortable handles are available as an alternative to standard trolleys.', 'Provide a personal shopping assistance service where staff gather items for customers who cannot navigate the store.', 'Promote the availability of shopping aids on your website, at the entrance, and via in-store signage.'],
    reasoning: 'Standard shopping trolleys and baskets require grip strength, two-handed use, and the ability to walk. People who use wheelchairs, have chronic pain, or have limited upper-limb function need alternative shopping aids to participate in the retail experience.',
    resources: [],
  },
  '3.10-PC-4': {
    actions: ['Provide at least one checkout counter at an accessible height (maximum 850 mm) with knee clearance for wheelchair approach, per AS 1428.2.', 'Ensure the accessible checkout has a minimum 850 mm clear approach width and a turning space of at least 1540 mm diameter in front.', 'Position the EFTPOS terminal at an accessible height and angle, reachable from a seated position, with tactile keypad markings.', 'Ensure checkout queuing areas have a minimum 1200 mm clear width for wheelchair passage and are free of obstructions.', 'Train checkout staff to offer bag packing and other assistance proactively and respectfully.'],
    reasoning: 'The checkout area is the final interaction point. If it is inaccessible, the customer cannot complete their purchase independently. Accessible checkout is mandatory under the Premises Standards for retail premises.',
    resources: [],
  },
  // Module 3.2
  '3.2-1-1': {
    actions: ['If you have an accessible toilet, audit it against AS 1428.1 Clause 15 for circulation space, grab rails, door width, and fixtures.', 'If you do not have one on-site, identify the nearest public accessible toilet and document its location and hours.', 'Plan installation of an accessible toilet if your premises undergo renovation.', 'Ensure the accessible toilet is clearly signed from the entrance and reception.'],
    reasoning: 'Without an accessible toilet, wheelchair users and people with mobility impairments cannot visit your venue for any extended period. This is one of the most fundamental accessibility requirements under the Premises Standards.',
    resources: [],
  },
  '3.2-1-2': {
    actions: ['Confirm the location of the nearest accessible toilet (on-site or within the immediate area).', 'Add the location to staff induction materials and a quick-reference guide at reception.', 'Include the accessible toilet location on your website accessibility page and any venue maps.', 'Verify the toilet is available during all hours your venue is open.'],
    reasoning: 'Customers with disabilities should not have to search for an accessible toilet or ask multiple staff members. Prompt, confident directions from any staff member demonstrate preparation and respect.',
    resources: [],
  },
  '3.2-1-3': {
    actions: ['Audit toilet signage for the International Symbol of Access, tactile lettering (raised minimum 1mm), and Grade 1 Braille.', 'Install compliant signs at 1200-1600mm height on the latch side of each toilet door.', 'Add directional signage from the main entrance, reception, and corridor junctions.', 'Ensure signs have high contrast (light text on dark background or vice versa).'],
    reasoning: 'People who are blind or have low vision rely on tactile and Braille signage to identify toilets independently. Without these elements, they must ask for help every time, which undermines independence and dignity.',
    resources: [],
  },
  '3.2-1-4': {
    actions: ['Immediately remove all items stored in the accessible toilet (cleaning supplies, chairs, boxes, stock).', 'Implement a clear policy: accessible toilets are never to be used for storage.', 'Add a sign inside the toilet for staff: "This facility must remain clear of storage at all times."', 'Include accessible toilet checks in daily opening and closing routines.'],
    reasoning: 'Items stored in accessible toilets reduce the circulation space wheelchair users need to transfer. A toilet that technically exists but is full of cleaning supplies is effectively unusable.',
    resources: [],
  },
  '3.2-1-5': {
    actions: ['Install an emergency alarm with a pull cord that extends to within 100mm of the floor (per AS 1428.1 Clause 15).', 'Connect the alarm to a monitored point (reception desk, security office) where staff will respond immediately.', 'Test the alarm weekly and document test results.', 'Train all staff on the alarm response procedure, including which toilet the alarm is in and how to assist.', 'Ensure the alarm button or cord contrasts visually with the wall.'],
    reasoning: 'People who fall in an accessible toilet may be on the floor and unable to reach a standard-height alarm. A floor-level cord can be the difference between a quick rescue and an extended, dangerous wait.',
    resources: [],
  },
  '3.2-D-1': {
    actions: ['Ensure the accessible toilet door requires no more than 20 N of force to open (AS 1428.1 Clause 13.5.2).', 'Fit a D-type pull handle on the outside and a horizontal grab rail on the inside of the door to assist closing from a wheelchair (AS 1428.1 Clause 13.5.3).', 'Install a privacy lock that can be operated with one hand without gripping or twisting, and can be unlocked from outside in an emergency (AS 1428.1 Clause 13.5.5).', 'Verify the door provides a minimum clear opening width of 850 mm (AS 1428.1 Clause 13.2).', 'Ensure an outward-opening or sliding door is used so the door does not swing into the required circulation space (AS 1428.1 Clause 13.3).', 'Test the lock mechanism regularly, as wear can make locks progressively harder to operate.'],
    reasoning: 'A toilet door that is too heavy, has inaccessible hardware, or cannot be locked from a seated position prevents independent toilet use. This is one of the most commonly reported access barriers.',
    resources: [],
  },
  '3.2-D-10': {
    actions: ['Install the washbasin rim at a maximum height of 830 mm above finished floor level (AS 1428.1 Clause 15.3.6).', 'Provide knee clearance under the basin of at least 700 mm high and 500 mm deep to allow a forward wheelchair approach.', 'Insulate or guard exposed hot water pipes under the basin to prevent burn injuries to people with reduced sensation (AS 1428.1 Clause 15.3.6).', 'Position the basin so it can be reached without leaving the wheelchair, ideally within the same clear floor space or adjacent to the toilet circulation area.', 'Ensure the basin is securely wall-mounted and rated to support people leaning on it (minimum 150 kg load).'],
    reasoning: 'A washbasin that is too high, has no knee clearance, or is too far from the toilet forces people to skip handwashing or attempt unsafe transfers. Accessible basin positioning is mandated by AS 1428.1.',
    resources: [],
  },
  '3.2-D-11': {
    actions: ['Mount the flush control on the transfer side of the toilet or provide a large push-plate flush on the wall behind, reachable without twisting, at 900-1100 mm above floor (AS 1428.1 Clause 15.3.3).', 'Position the toilet paper holder on the wall beside the toilet within 300 mm reach from the front of the toilet pan and at 600-700 mm above floor level.', 'Install a coat hook at 1200 mm above floor level on the wall adjacent to the toilet or behind the door, within reach from the toilet seat (AS 1428.1 Clause 15.3.5).', 'Ensure all fittings can be operated with one hand and without tight gripping (AS 1428.1 Clause 11.2).', 'Test reachability from the seated position on the toilet by having a person in a wheelchair or seated on the toilet confirm each fitting is accessible.'],
    reasoning: 'Fittings placed out of reach from the toilet seat mean a person must stand, twist, or overreach while unsupported, risking falls. All fittings must be reachable from a seated position on the toilet.',
    resources: [],
  },
  '3.2-D-12': {
    actions: ['Install a mirror that extends from at least 900 mm above floor level to at least 1850 mm above floor level, so it is usable by both seated and standing people (AS 1428.1 Clause 15.3.6).', 'Alternatively, install a full-length mirror (bottom edge at no more than 900 mm above floor) or a tilted mirror that provides a seated view.', 'Position the mirror above or adjacent to the washbasin so it can be used during handwashing without additional manoeuvring.', 'Ensure the mirror has minimal frame or distortion and is well-lit (minimum 200 lux at the mirror surface).', 'If a tilt-adjustable mirror is provided, ensure it can be operated with one hand and locks in position.'],
    reasoning: 'A mirror mounted at standard standing height is unusable for wheelchair users and people of short stature. The Premises Standards require mirrors to serve both standing and seated users.',
    resources: [],
  },
  '3.2-D-13': {
    actions: ['Install a backrest on the cistern or wall behind the toilet if the cistern does not provide adequate support. The backrest should be padded and extend at least 150 mm above the toilet seat (AS 1428.1 Clause 15.3.5).', 'If a concealed cistern or wall-hung toilet is used, install a padded backrest at 150-200 mm behind the toilet seat, securely wall-mounted.', 'Ensure the backrest is smooth, padded, and easy to clean, with no sharp edges or protrusions.', 'Verify the backrest can support a load of at least 1100 N (AS 1428.1 Clause 12).', 'Check that the backrest does not interfere with the flush mechanism or the grab rail behind the toilet.'],
    reasoning: 'A backrest prevents people from falling backwards off the toilet, which is a real risk for people with trunk instability, cerebral palsy, spinal injuries, or fatigue conditions. It is required by AS 1428.1.',
    resources: [],
  },
  '3.2-D-14': {
    actions: ['Ensure a minimum 30% luminance contrast between critical elements and their backgrounds: toilet seat against the pan, grab rails against the wall, flush button against the wall, and the door handle against the door (AS 1428.1 Clause 6).', 'Use a contrasting toilet seat colour (e.g., dark blue or dark grey on a white pan) as this is the simplest and most impactful single change.', 'Ensure the floor contrasts with the walls, and the washbasin contrasts with the surrounding surfaces.', 'Avoid all-white or all-grey colour schemes in accessible toilets; use strategic colour on key fixtures.', 'Test contrast using a luminance contrast meter or the Colour Contrast Analyser tool to verify the 30% minimum is met under typical lighting.'],
    reasoning: 'In a white-on-white bathroom, people with low vision cannot distinguish the toilet from the wall, find grab rails, or locate fittings. Visual contrast is a mandatory requirement under AS 1428.1.',
    resources: [],
  },
  '3.2-D-2': {
    actions: ['Locate at least one baby change table inside or adjacent to the accessible toilet or in a separate unisex facility accessible from the main circulation path.', 'Install the change table at a height usable from a seated position (approximately 750-850 mm) or provide a fold-down table that lowers to this height.', 'Ensure the change table does not encroach on the required wheelchair circulation space (1500 mm x 2000 mm minimum) when folded down (AS 1428.1 Clause 15).', 'Provide a strap or restraint on the change table and ensure a waste bin is within reach.', 'If a change table is wall-mounted, test that it locks securely open and supports at least 80 kg.'],
    reasoning: 'Baby change facilities placed only in standard cubicles or women-only rooms exclude fathers, grandparents, and carers who use accessible toilets. Accessible baby change supports all parents and carers.',
    resources: [],
  },
  '3.2-D-3': {
    actions: ['Provide at least one ambulant accessible cubicle per toilet block, in addition to the fully accessible unisex toilet (AS 1428.1 Clause 15.4).', 'Ensure the ambulant cubicle is a minimum of 900 mm wide and 1500 mm deep with an outward-opening door (AS 1428.1 Clause 15.4.2).', 'Install horizontal grab rails on both side walls at 800-810 mm above floor level (AS 1428.1 Clause 15.4.5).', 'Set the toilet seat height at 460-480 mm above finished floor level to assist sitting and standing (AS 1428.1 Clause 15.3.1).', 'Ensure the door lock is operable with one hand and can be unlocked from outside in an emergency.'],
    reasoning: 'Ambulant accessible toilets serve people who can walk but need grab rails, extra space, or specific toilet heights, such as people with arthritis, hip replacements, or balance conditions. They fill the gap between standard and fully accessible cubicles.',
    resources: [],
  },
  '3.2-D-4': {
    actions: ['Replace all taps in accessible toilets with lever-type, push-pad, or sensor-operated taps that can be operated without grasping, pinching, or twisting (AS 1428.1 Clause 15.3.6).', 'If sensor taps are used, ensure the sensor response time is appropriate (activates within 1 second) and that water runs long enough for handwashing (minimum 10 seconds).', 'Verify hot water temperature is regulated to a maximum of 45 degrees Celsius to prevent scalding (AS 1428.1 Clause 15.3.6).', 'Ensure taps are within reach from a seated position and do not require reaching over the basin (maximum 300 mm reach from the front of the basin).', 'Test taps for force: they should be operable with a maximum of 22 N (AS 1428.1 Clause 11.2).'],
    reasoning: 'Twist-knob or cross-handle taps require grip strength and wrist rotation that people with arthritis, limited dexterity, prosthetics, or tremor conditions cannot achieve. Lever or sensor taps provide equitable access.',
    resources: [],
  },
  '3.2-D-5': {
    actions: ['Position soap dispensers between 900 mm and 1100 mm above floor level and within 300 mm reach from the front edge of the washbasin (AS 1428.1 Clause 15.3.6).', 'Use push-button, lever, or automatic soap dispensers rather than pump-action types that require gripping.', 'Provide a hand dryer or paper towel dispenser at 900-1100 mm height, operable with one hand or automatically (AS 1428.1 Clause 11.1).', 'Ensure both soap and drying facilities are within the reach envelope of a person seated in a wheelchair (forward reach maximum 1100 mm above floor).', 'Verify that dispensers are regularly refilled and maintained so they do not require excessive force when nearly empty.'],
    reasoning: 'If soap and hand-drying facilities are out of reach, poorly positioned, or require fine motor skills to operate, people with mobility and dexterity impairments cannot complete basic hygiene independently.',
    resources: [],
  },
  '3.2-D-6': {
    actions: ['Provide a sanitary disposal unit within the accessible toilet cubicle, reachable from the toilet without requiring a transfer (within 300 mm of the toilet, AS 1428.1 guidance).', 'Use bins with lids that can be opened with one hand, by pushing or with a sensor, not pedal-operated.', 'Position the general waste bin within the accessible reach range (400-1100 mm above floor) and not behind the door or in a corner that requires manoeuvring.', 'Ensure bins do not encroach on the wheelchair circulation space or obstruct the transfer area beside the toilet.', 'Include a sharps disposal container if your venue serves people who may need to administer injections (e.g., medical facilities, airports, large venues).'],
    reasoning: 'Inaccessible waste bins force people to leave rubbish on the floor or ask for assistance with a private task. Pedal-operated bins are unusable for many wheelchair users and people with limited leg mobility.',
    resources: [],
  },
  '3.2-D-7': {
    actions: ['Where feasible, install a Changing Places facility that meets the Changing Places Design Specifications: minimum 12 sqm room with a ceiling-mounted or portable hoist, height-adjustable adult-sized change table, height-adjustable washbasin, toilet with space on both sides, and a privacy screen.', 'If a full Changing Places facility is not possible, consider an enhanced accessible toilet with a fold-down change bench (minimum 1800 mm x 750 mm when unfolded).', 'Locate the facility on an accessible path of travel, clearly signed, and close to main public areas.', 'Register the facility on the Changing Places Australia website (changingplaces.org.au) so people can find it.', 'Ensure the facility has an emergency alarm that is accessible from the floor and the change table.'],
    reasoning: 'Adult change facilities (Changing Places) are essential for people with severe or profound disability who cannot use a standard accessible toilet and require a hoist, height-adjustable bench, and carer space.',
    resources: [],
  },
  '3.2-D-8': {
    actions: ['Install a horizontal grab rail on the wall beside the toilet at 800-810 mm above finished floor level, extending at least 250 mm in front of and 150 mm behind the front of the toilet pan (AS 1428.1 Clause 15.3.4).', 'Install a drop-down or swing-away grab rail on the transfer side of the toilet at the same height, so it can be raised for wheelchair transfer and lowered for support (AS 1428.1 Clause 15.3.4).', 'Ensure grab rails can support a minimum load of 1100 N (approximately 110 kg) applied in any direction (AS 1428.1 Clause 12).', 'Use grab rails with a circular cross-section of 30-40 mm diameter and a clearance of 50-60 mm between the rail and the wall (AS 1428.1 Clause 12.2).', 'Verify grab rails contrast visually with the wall (minimum 30% luminance contrast, AS 1428.1 Clause 6).', 'Inspect grab rail fixings annually for loosening, corrosion, or wall damage.'],
    reasoning: 'Grab rails are critical safety features that prevent falls during transfers to and from the toilet and while seated. Missing or incorrectly placed grab rails are one of the most common non-compliance findings.',
    resources: [],
  },
  '3.2-D-9': {
    actions: ['Provide a clear transfer space of at least 900 mm wide between the side of the toilet and the nearest wall or fixture to allow lateral transfer from a wheelchair (AS 1428.1 Clause 15.3.2).', 'Ensure the overall accessible toilet room provides a minimum circulation space of 1500 mm x 2000 mm clear of all fixtures, door swing, and fittings (AS 1428.1 Clause 15.2).', 'Verify that the toilet pan centreline is 450-460 mm from the side wall with the fixed grab rail (AS 1428.1 Clause 15.3.2).', 'Check that no portable items (bins, cleaning supplies, spare toilet rolls) are stored in the transfer space.', 'Test the layout by wheeling a standard wheelchair (approximately 700 mm wide) into the room and confirming a transfer can be performed.'],
    reasoning: 'Without adequate space beside the toilet, a wheelchair user cannot perform a lateral transfer. This is a fundamental requirement of an accessible toilet under the Premises Standards.',
    resources: [],
  },
  // Module 3.3
  '3.3-1-1': {
    actions: ['Walk through the venue and assess lighting at all areas: entrances, corridors, service counters, seating areas, and toilets.', 'Replace flickering fluorescent tubes, which can trigger migraines and seizures.', 'Ensure even lighting at service counters and information points to support lip-reading.', 'Reduce harsh shadows and glare at transition zones (indoor/outdoor, bright/dim areas).', 'Aim for consistent, diffused lighting of at least 200 lux in circulation areas.'],
    reasoning: 'Poor lighting affects everyone but especially impacts people with low vision (who need good light to see), people who lip-read (who need to see faces clearly), and people with photosensitivity (who react to flickering or harsh light).',
    resources: [],
  },
  '3.3-1-2': {
    actions: ['Identify a room or area that can serve as a quiet/reset space (away from main traffic, music, and crowds).', 'Furnish it with comfortable seating, dimmed lighting, and minimal visual stimulation.', 'Add signage directing people to the space and include it on venue maps.', 'Ensure the space is available during all opening hours without needing to ask staff.'],
    reasoning: 'Autistic people, people with anxiety, PTSD, or sensory processing differences can become overwhelmed in busy environments. A quiet space allows them to self-regulate and continue their visit rather than leaving.',
    resources: [],
  },
  '3.3-1-3': {
    actions: ['Measure background noise levels in key areas using a sound level meter app.', 'Identify the main noise sources: music, kitchen equipment, air conditioning, open-plan chatter.', 'Add acoustic panels, soft furnishings, or carpet in the noisiest areas to absorb sound.', 'Designate quieter zones for customers who need them and indicate these on your venue map.'],
    reasoning: 'Hearing aid users experience amplified background noise that drowns out conversation. People with auditory processing difficulties cannot filter background noise from speech. Excessive noise excludes these customers from participation.',
    resources: [],
  },
  '3.3-1-4': {
    actions: ['Audit the venue for all sources of flashing lights: strobe effects, LED signage, emergency beacons, decorative lighting.', 'Remove or replace any lighting that flashes more than 3 times per second (WCAG 2.2 SC 2.3.1 threshold).', 'Identify sources of sudden loud noises (alarms, PA announcements, machinery) and add warnings or reduce volume.', 'Provide advance warnings on your website and at the venue entrance about any unavoidable sensory hazards.'],
    reasoning: 'Flashing lights can trigger photosensitive epileptic seizures, which are a medical emergency. Sudden loud noises can cause panic attacks, distress for autistic people, and startle responses in people with PTSD.',
    resources: [],
  },
  '3.3-1-5': {
    actions: ['Ensure heating and cooling systems are functional and can maintain comfortable temperatures.', 'Identify areas with temperature extremes (near entrances, windows, kitchens) and provide solutions (draught excluders, fans, shade).', 'Consider offering blankets or fans for customers who need personal temperature adjustment.', 'Note temperature-controlled areas on your venue map or pre-visit information.'],
    reasoning: 'People with multiple sclerosis, Raynaud syndrome, autonomic dysfunction, and chronic pain conditions have impaired temperature regulation. Extreme heat or cold can worsen symptoms and make a venue visit physically impossible.',
    resources: [],
  },
  '3.3-1-6': {
    actions: ['Assemble sensory support kits containing noise-reducing headphones or ear plugs, fidget tools, sunglasses, and a communication card.', 'Make kits available at reception or entry points without requiring customers to explain their need.', 'Advertise kit availability on your website and in pre-visit information.', 'Clean and restock kits regularly and include single-use items (ear plugs) for hygiene.'],
    reasoning: 'Sensory kits give autistic people, people with anxiety, and those with sensory sensitivities practical tools to manage their environment, enabling them to participate in activities they would otherwise avoid.',
    resources: [],
  },
  '3.3-1-7': {
    actions: ['Research sensory-friendly session formats used by similar venues (cinemas, museums, theatres, swimming pools).', 'Plan a trial session with reduced lighting, lower music, smaller crowds, and additional staff support.', 'Create a social story or visual guide for the session and publish it on your website.', 'Gather feedback from attendees with disabilities to refine future sessions.', 'Schedule regular sensory-friendly sessions (at least monthly) and promote them through disability networks.'],
    reasoning: 'Standard venue environments overwhelm many autistic people, people with anxiety, and families with children with disabilities. Sensory-friendly sessions provide a welcoming alternative that opens your venue to entirely new audiences.',
    resources: [],
  },
  '3.3-1-8': {
    actions: ['Install a permanent hearing loop in your main service area (reception, counter, meeting room) per AS 1428.5.', 'Purchase a portable hearing loop for use in other areas as needed.', 'Display the international hearing loop symbol at every equipped location.', 'Test the loop regularly and train staff on how to use and troubleshoot it.', 'Include hearing loop availability in your website accessibility information.'],
    reasoning: 'Hearing loops transmit audio directly to hearing aids with telecoil (T-coil) settings, cutting out background noise. Without a loop, hearing aid users hear amplified noise rather than clear speech.',
    resources: [],
  },
  '3.3-D-1': {
    actions: ['Install dimmable lighting in key customer areas (dining, waiting, conference rooms) to allow brightness adjustment.', 'Provide at least one area with lower-intensity lighting (100-200 lux) for people who find bright environments overwhelming, while maintaining a minimum of 200 lux on accessible paths of travel (AS 1428.2 Clause 19).', 'Use warm-tone LED lighting (2700-3500K colour temperature) in rest and waiting areas to reduce harsh glare.', 'Ensure lighting controls are accessible (900-1100 mm height, operable with one hand) per AS 1428.1 Clause 11.', 'Document which areas have adjustable lighting in pre-visit information so customers can plan.'],
    reasoning: 'Adjustable lighting helps people with photosensitivity, migraine conditions, autism, and low vision tailor the environment to their needs. Fixed bright lighting excludes people with sensory processing differences.',
    resources: [],
  },
  '3.3-D-10': {
    actions: ['Create a sensory map or guide that identifies noise levels, lighting conditions, crowds, and potential sensory triggers for each zone or area of your venue.', 'Use a simple rating system (e.g., low/medium/high for noise and brightness) and plain language descriptions.', 'Make the sensory guide available online before the visit and in print at the venue entrance.', 'Ensure the guide is available in accessible formats: large print (minimum 18 pt), high contrast, and digital (accessible PDF or web page).', 'Update the sensory guide when venue conditions change (renovations, event setups, seasonal changes).'],
    reasoning: 'A sensory map or guide helps people with autism, anxiety, sensory processing conditions, and noise sensitivity plan their route through the venue, avoiding areas that may cause distress.',
    resources: [],
  },
  '3.3-D-11': {
    actions: ['Develop and publish a scent/fragrance policy that prohibits or minimises the use of strong air fresheners, scented candles, and essential oil diffusers in public areas.', 'Switch to fragrance-free cleaning products and ensure this is specified in cleaning contracts.', 'Train staff to avoid wearing strong perfumes or colognes when working in customer-facing roles.', 'Provide advance notice of any unavoidable scent exposures (e.g., fresh paint, pest treatment) through your website and at the venue entrance.', 'Consider designating fragrance-free zones in areas where people spend extended time (waiting rooms, meeting spaces).'],
    reasoning: 'Strong scents from cleaning products, air fresheners, perfumes, and essential oils can trigger migraines, asthma attacks, and severe allergic reactions. A fragrance policy protects people with chemical sensitivities.',
    resources: [],
  },
  '3.3-D-12': {
    actions: ['Include a dedicated sensory information section on your venue website covering noise levels, lighting, crowds, scents, and available supports.', 'Describe what to expect at different times (quiet mornings vs. busy afternoons, scheduled noisy activities).', 'List available sensory supports: quiet space, ear defenders, sensory map, low-sensory sessions.', 'Publish a Social Story or visual guide for people who benefit from step-by-step visit preparation.', 'Update sensory information seasonally and before major events that change venue conditions.'],
    reasoning: 'If sensory conditions are not communicated before the visit, people with sensory sensitivities cannot prepare or make informed decisions about whether and when to attend, reducing their autonomy and increasing anxiety.',
    resources: [],
  },
  '3.3-D-13': {
    actions: ['Use a consistent colour-coding system for different zones, levels, or wings of your venue, applied to walls, floor markings, signage, and maps.', 'Identify and sign distinctive landmarks (artworks, architectural features, plants) at key decision points to aid orientation for people who navigate by landmarks rather than signs.', 'Ensure colour choices provide sufficient contrast between zones and avoid relying solely on colour by also using shapes, numbers, or icons (for colour-blind users).', 'Apply colour-coding and landmarks consistently between physical signage and any printed or digital maps.', 'Test wayfinding with people with cognitive disability and vision impairment to confirm it is intuitive.'],
    reasoning: 'Colour-coded or landmark-based wayfinding is especially helpful for people with cognitive disabilities, learning disabilities, and non-English speakers who may not rely on text-based signage.',
    resources: [],
  },
  '3.3-D-14': {
    actions: ['Include raised tactile lettering and Grade 2 Braille on all room identification signs, toilet signs, and level/floor signs (AS 1428.1 Clause 8, AS 1428.5 Clause 3).', 'Install tactile ground surface indicators (TGSIs) at hazard areas (stairs, ramps, escalators) and at key decision points per AS 1428.4.1.', 'Consider tactile maps or 3D models at venue entrances for orientation.', 'Ensure tactile signage is mounted at a consistent height of 1200-1600 mm above floor level and on the latch side of doors (AS 1428.1 Clause 8.2).', 'Add tactile elements to interactive exhibits or displays where possible (raised graphics, texture variations, audio descriptions).'],
    reasoning: 'Tactile elements in signage and wayfinding provide critical information to people who are blind or have low vision through touch, supplementing visual information with a non-visual channel.',
    resources: [],
  },
  '3.3-D-15': {
    actions: ['Install visual fire alarm indicators (flashing lights or strobes) in all public areas, including toilets, change rooms, and any enclosed spaces where the main alarm may not be visible (AS 1428.5 Clause 3.3).', 'Ensure visual alarms flash at a rate of 1-3 Hz with a minimum intensity of 75 cd (candela) in general areas (AS 1670.4 and AS 1428.5 guidance).', 'Synchronise visual and audible alarms so they activate simultaneously.', 'Test visual alarms as part of your regular fire alarm testing schedule (at least every 6 months).', 'Ensure visual alarms are connected to the main fire alarm panel and cannot be disabled independently.', 'Include visual alarm locations in your emergency evacuation plan and brief staff on their purpose.'],
    reasoning: 'Visual emergency alerts are the only way to notify Deaf and hard of hearing people of an emergency. Without them, these individuals are in danger during fire, evacuation, or lockdown situations. This is a mandatory safety requirement.',
    resources: [],
  },
  '3.3-D-2': {
    actions: ['Ensure lighting at service counters, reception desks, and information points provides at least 300 lux measured at the counter surface, evenly distributed without deep shadows (AS 1428.2 Clause 19).', 'Position light sources in front of or above staff faces (not directly behind) so that faces are illuminated and not silhouetted.', 'Use diffused lighting fixtures rather than exposed bulbs or direct spotlights at communication points to minimise glare.', 'Check that under-counter or task lighting does not create upward glare into the eyes of seated customers.', 'Review lighting at all points where lip-reading, sign language, or document reading is likely (help desks, consultation areas, payment points).'],
    reasoning: 'Even, shadow-free lighting at communication points helps people with hearing impairment lip-read, people with low vision see facial expressions and documents, and reduces visual fatigue for everyone.',
    resources: [],
  },
  '3.3-D-3': {
    actions: ['Use non-reflective or matte finishes on floors, walls, and counter surfaces in public areas (AS 1428.2 Clause 19.3).', 'Install window treatments (blinds, tinted film, or curtains) on windows that create direct or reflected glare in customer areas.', 'Provide transition zones at building entries where customers move from bright outdoor light to interior lighting, avoiding abrupt light-level changes greater than a 10:1 ratio.', 'Ensure wet-area floors (entrance lobbies, pool surrounds) use non-reflective finishes as water increases reflectivity.', 'Test for glare at different times of day, particularly at east and west-facing windows during morning and afternoon sun.'],
    reasoning: 'Glare from reflective surfaces, windows, and polished floors causes disorientation, pain, and temporary blindness for people with low vision, cataracts, albinism, and photosensitivity. It is also a safety hazard.',
    resources: [],
  },
  '3.3-D-4': {
    actions: ['Install sound-absorbing materials (acoustic panels, ceiling tiles, soft furnishings, carpet) in areas where verbal communication occurs. Target a reverberation time of no more than 0.6-0.8 seconds in service areas.', 'Use acoustic zoning to separate noisy areas (kitchens, play areas, machinery) from communication areas (service counters, meeting rooms) with physical barriers or distance.', 'Install rubber feet or pads on chair and table legs to reduce scraping noise on hard floors.', 'Review HVAC and mechanical noise levels and ensure they do not exceed 40 dB(A) in areas where speech communication is important.', 'Consider acoustic consultancy for venues with persistent noise issues, particularly open-plan spaces with hard surfaces.'],
    reasoning: 'Background noise makes it difficult or impossible for people with hearing impairment, auditory processing conditions, or hearing aid users to understand speech. Acoustic design directly affects communication access.',
    resources: [],
  },
  '3.3-D-5': {
    actions: ['Ensure background music can be adjusted zone-by-zone so quiet areas can be maintained while other areas have music.', 'Keep background music at least 15 dB below the expected speech level in areas where customers communicate with staff (signal-to-noise ratio per AS 1428.5 guidance).', 'Train staff to reduce volume when requested, and empower them to make this decision without management approval.', 'Consider scheduled quiet times (e.g., first hour of trading) with no background music for people who find it overwhelming.', 'Avoid sudden volume changes or high-bass tracks that can startle or cause discomfort for people with anxiety or sensory sensitivity.'],
    reasoning: 'Background music that is too loud interferes with hearing aids, masks speech, and causes distress for people with hyperacusis or sensory processing conditions. Controllable volume is a simple but impactful measure.',
    resources: [],
  },
  '3.3-D-6': {
    actions: ['Supplement all PA announcements with simultaneous visual displays (text on screens, LED tickers, or digital notice boards) in all public areas.', 'Ensure emergency announcements trigger both audible alarms and visual alerts (flashing lights) throughout the venue, including in toilets and isolated areas (AS 1428.5 Clause 3.3).', 'Position visual display screens at key locations: reception, waiting areas, service counters, and along main circulation routes.', 'Use clear, simple language for text displays with a minimum character height of 25 mm for close viewing or proportional to viewing distance.', 'Test the system regularly (at least quarterly) to confirm both audio and visual components activate simultaneously.'],
    reasoning: 'PA announcements that are audio-only exclude Deaf and hard of hearing people from critical information, including safety announcements. This is a mandatory requirement under the Premises Standards for emergency communication.',
    resources: [],
  },
  '3.3-D-7': {
    actions: ['Install a hearing loop system at all service counters, ticket desks, and reception points as a minimum. Consider area loops for meeting rooms, theatres, and worship spaces (AS 1428.5 Clause 5.2).', 'Ensure loop systems comply with AS 60118.4 for field strength (minimum 100 mA/m, target 400 mA/m at 1.2 m above floor).', 'Test loop coverage regularly (at least every 6 months) using a hearing loop receiver or field strength meter, and document the results.', 'Install signage with the international hearing loop symbol (ear with T) at all locations where a loop is available (AS 1428.5 Clause 5.4).', 'Train staff to activate portable loop systems and inform customers of their availability without being asked.', 'Consider supplementary systems (FM, infrared, or Bluetooth) for areas where an induction loop is impractical.'],
    reasoning: 'Hearing loops (audio induction loops) transmit sound directly to hearing aids set to T-coil mode, cutting through background noise. They are the primary assistive listening technology required in public buildings under AS 1428.5.',
    resources: [],
  },
  '3.3-D-8': {
    actions: ['Display the international hearing loop symbol (blue ear icon with T) at every counter and area where a loop is installed (AS 1428.5 Clause 5.4).', 'Position the sign at eye level (1200-1600 mm above floor) and at the point of approach so it is visible before the customer reaches the counter.', 'Include text alongside the symbol: "Hearing loop available - switch to T" in a minimum 15 mm character height.', 'Ensure signage contrasts visually with its background (minimum 30% luminance contrast, AS 1428.1 Clause 6).', 'Include hearing loop availability in your website accessibility information and at the venue entrance.'],
    reasoning: 'A hearing loop that exists but is not signed is effectively invisible to the people who need it. Clear signage is mandatory under AS 1428.5 and ensures hearing aid users know to switch to T-coil mode.',
    resources: [],
  },
  '3.3-D-9': {
    actions: ['Provide a dedicated quiet space that is enclosed or semi-enclosed, away from high-traffic and noisy areas, with controllable lighting (dimmable to low levels).', 'Include comfortable seating with options (beanbag, firm chair with arms, floor space) to accommodate different sensory preferences.', 'Remove or minimise visual clutter, bright colours, and patterned surfaces in the space.', 'Consider providing sensory regulation tools: noise-cancelling headphones, weighted blankets, fidget items, and visual timers.', 'Sign the space clearly and include its location in your venue map, pre-visit guide, and staff training so it can be recommended proactively.', 'Ensure the space is monitored (with a visible camera or periodic staff checks) for safety without being intrusive.'],
    reasoning: 'A quiet or sensory space helps people experiencing sensory overload, anxiety, meltdown, or fatigue to regulate and recover, enabling them to continue their visit rather than leaving the venue entirely.',
    resources: [],
  },
  // Module 3.4
  '3.4-D-1': {
    actions: ['Create a complete inventory of all assistive and accessible equipment, including: wheelchairs, mobility scooters, walking frames, portable ramps, hearing loop receivers, FM systems, magnifiers, large-print materials, sensory kits, communication boards, and fidget items.', 'Record the quantity, condition, location, and last-checked date for each item.', 'Identify which customer needs each item addresses (mobility, hearing, vision, sensory, cognitive, communication).', 'Compare your inventory against industry benchmarks and disability organisation recommendations for your venue type.', 'Schedule quarterly inventory reviews to check condition and completeness.'],
    reasoning: 'Knowing exactly what equipment is available allows you to identify gaps, plan procurement, and provide accurate information to customers. An incomplete inventory means some needs go unmet.',
    resources: [],
  },
  '3.4-D-10': {
    actions: ['Provide at least one accessible entry method: pool hoist (rated to at least 150 kg), zero-depth (beach) entry with a gradient no steeper than 1:14, or a submersible wheelchair ramp.', 'If a hoist is provided, ensure it is operable by the user or a single carer, with clear operating instructions displayed at the poolside.', 'Install accessible pool ladders with wide, non-slip treads and continuous handrails on both sides as a secondary entry for ambulant users.', 'Ensure the accessible entry point is located on an accessible path of travel from the change rooms and does not require walking across slippery, unprotected pool surrounds.', 'Test all accessible entry equipment weekly for mechanical function and safety, and log inspections.'],
    reasoning: 'Pools and aquatic facilities without accessible entry options completely exclude wheelchair users and people with severe mobility impairment. The Premises Standards require equitable access to aquatic facilities.',
    resources: [],
  },
  '3.4-D-11': {
    actions: ['Provide at least one aquatic wheelchair (stainless steel or PVC frame, waterproof, with brakes and footrests) for customer use at your pool facility.', 'Ensure the aquatic wheelchair is compatible with your pool hoist or ramp system.', 'Store the wheelchair in an accessible location near the pool entrance, clearly signed and visible.', 'Train pool staff in the safe operation of the aquatic wheelchair, including transfer assistance and hygiene procedures.', 'Inspect the chair weekly for corrosion, brake function, and wheel condition given the chlorine/saltwater environment.'],
    reasoning: 'Standard wheelchairs cannot enter a pool; aquatic wheelchairs are specifically designed for water use and allow people to move from the change room to the pool and into the water with dignity.',
    resources: [],
  },
  '3.4-D-12': {
    actions: ['Provide at least one accessible change room near the pool with: minimum 1900 mm x 2400 mm clear floor space, a fold-down bench (minimum 600 mm wide, 450-480 mm height), grab rails, a hook at 1200 mm, and a mirror usable from a seated position.', 'Provide an accessible shower with: hobless (zero-step) entry, fold-down shower seat, grab rails, hand-held shower head on a vertical rail, and lever-type taps (AS 1428.1 Clause 15.5).', 'Ensure the path between the accessible change room and the pool is level, non-slip (even when wet), and at least 1000 mm wide.', 'Provide a dry area within the change room for dressing that is separate from the wet shower zone.', 'Include a lockable door operable with one hand and an emergency alarm accessible from the floor (AS 1428.1 Clause 15.5.4).'],
    reasoning: 'If changing and shower facilities near the pool are not accessible, a person who can enter the pool cannot get changed beforehand or shower afterwards. This is a mandatory requirement under the Premises Standards.',
    resources: [],
  },
  '3.4-D-13': {
    actions: ['Provide both audible (horn or siren) and visual (flashing lights) warnings at least 30 seconds before wave machines or water features activate.', 'Ensure warnings are visible and audible from all areas within the affected zone, including underwater viewing areas.', 'Display permanent signage at each water feature explaining the warning system and when features operate.', 'Offer a quiet or low-wave session for people who find sudden water movement distressing or dangerous.', 'Train lifeguards to provide personal warnings to visually or hearing-impaired swimmers before activation.'],
    reasoning: 'Wave pools and water features that activate suddenly can disorient, frighten, or physically endanger people with vision impairment, hearing impairment, or cognitive conditions who cannot perceive the warnings.',
    resources: [],
  },
  '3.4-D-14': {
    actions: ['Provide free, reliable WiFi throughout all public areas of your venue, including outdoor spaces and basement levels.', 'Ensure WiFi bandwidth is sufficient for real-time applications (video relay, live captioning) with a target of at least 5 Mbps per user in high-demand areas.', 'Display WiFi access details (network name and password or login process) at the entrance, reception, and in pre-visit information.', 'Ensure the WiFi login portal (captive portal) is accessible: keyboard-navigable, screen-reader compatible, and does not rely on CAPTCHA that excludes people with vision impairment (WCAG 2.2 Level AA).', 'Test WiFi coverage in all public areas, including toilets and quiet spaces, and address dead spots.'],
    reasoning: 'Many assistive technologies rely on internet connectivity: real-time captioning apps, indoor navigation, AAC communication apps, and hearing aid streaming. Without WiFi, these tools do not function.',
    resources: [],
  },
  '3.4-D-15': {
    actions: ['Provide accessible power outlets (at least two) in public areas at a height of 900-1100 mm above floor level (AS 1428.1 Clause 11.1) for device charging.', 'Consider dedicated charging stations near rest seating, the quiet space, and cafe/dining areas.', 'Include both standard Australian 3-pin outlets and USB charging ports to cover most devices.', 'Ensure charging points do not create trip hazards (recess outlets or use cable management).', 'Sign charging locations and include them in venue maps and pre-visit information.'],
    reasoning: 'Powered wheelchairs, hearing aids, communication devices, and insulin pumps can run low during a venue visit. Without charging access, people may be stranded or lose essential functions.',
    resources: [],
  },
  '3.4-D-2': {
    actions: ['Designate a room or enclosed area as a quiet/sensory space, clearly signed and shown on your venue map.', 'Equip the space with: dimmable lighting, comfortable seating (variety of types), minimal visual clutter, and sensory regulation tools.', 'Locate the space away from noisy areas but on an accessible path of travel, with an accessible door (minimum 850 mm clear width, lever handle).', 'Set clear expectations about the space (e.g., "This is a low-stimulation space. Please keep noise and device use to a minimum").', 'Ensure the space is clean, maintained, and monitored periodically for safety.'],
    reasoning: 'A quiet space or sensory room gives people experiencing overload, anxiety, or meltdown a safe place to regulate without having to leave the venue. This is increasingly expected in public-facing venues.',
    resources: [],
  },
  '3.4-D-3': {
    actions: ['Provide at least one wheelchair (preferably two) available for customer loan, stored in a visible, signed, and accessible location near the main entrance.', 'Ensure loan wheelchairs are standard manual wheelchairs in good working order: functional brakes, inflated tyres, clean seat, and footrests.', 'Offer at least one bariatric wheelchair (rated to 200 kg+, seat width 550 mm or more) if space and budget allow.', 'Establish a simple borrowing process (name and return time only, no deposit or ID required for standard wheelchairs).', 'Inspect loan wheelchairs weekly for safety and cleanliness, and service them at least annually.'],
    reasoning: 'Customers whose personal wheelchair breaks down, who have limited stamina, or who do not use a wheelchair daily but cannot walk venue distances need loan wheelchairs to access your venue.',
    resources: [],
  },
  '3.4-D-4': {
    actions: ['Assemble a sensory support kit containing: noise-cancelling headphones or ear defenders (adult and child sizes), sunglasses, fidget items (tangle, stress ball), visual timers, and communication cards.', 'Store kits in a hygienic, accessible location and clean items between uses (or provide single-use ear plugs as a disposable alternative).', 'Advertise the availability of sensory items in your pre-visit information, at the entrance, and on your website.', 'Consult autistic adults and people with sensory processing conditions about which items are most useful for your venue type.', 'Budget for regular replacement and expansion of sensory items.'],
    reasoning: 'Sensory support items (ear defenders, sunglasses, fidget tools, weighted lap pads) can make the difference between a comfortable visit and an impossible one for autistic people, people with ADHD, and those with sensory processing conditions.',
    resources: [],
  },
  '3.4-D-5': {
    actions: ['Provide at least one communication board or picture symbol set relevant to your venue (e.g., food ordering, directions, requests for help) in an accessible location.', 'Offer pen and paper, whiteboard, or a tablet with a text-to-speech app for impromptu communication.', 'Train staff to use communication aids confidently: point to symbols, allow extra time, and confirm understanding.', 'Consider an Auslan (Australian Sign Language) video relay service subscription for more complex interactions.', 'Include communication aid availability in your accessibility information and staff induction.'],
    reasoning: 'Communication aids (picture boards, symbol charts, pen and paper, tablet-based AAC) enable people who are non-speaking, have speech impairments, or are Deaf to communicate with staff and navigate the venue.',
    resources: [],
  },
  '3.4-D-6': {
    actions: ['Establish a maintenance schedule: weekly visual checks for all assistive equipment and formal servicing at least annually.', 'Create a checklist per item type (e.g., wheelchair: brakes, tyres, seat condition, footrests; hearing loop: signal strength, battery, signage).', 'Assign maintenance responsibility to a named staff member with a backup.', 'Keep a log of maintenance checks, issues found, and repairs completed.', 'Have a procedure for taking defective equipment out of service immediately and notifying customers when an item is temporarily unavailable.'],
    reasoning: 'Equipment that is broken, flat, dirty, or out of date is worse than no equipment at all: it signals neglect and can be unsafe. Regular maintenance ensures reliability when customers need it.',
    resources: [],
  },
  '3.4-D-7': {
    actions: ['Offer wheelchairs in at least two sizes (standard 450 mm seat and bariatric 550 mm+ seat) if you provide loan chairs.', 'Ensure hearing loop receivers and sensory items are available in adult and child configurations.', 'Provide adjustable-height equipment where possible (e.g., adjustable walking sticks, telescoping reachers).', 'Test equipment with people of different body sizes during procurement to ensure suitability.', 'Include size/weight limits on equipment information cards so customers can self-select appropriately.'],
    reasoning: 'One-size equipment excludes people with larger bodies, very tall or short stature, and children. A range of sizes ensures equitable access and dignity for all customers.',
    resources: [],
  },
  '3.4-D-8': {
    actions: ['Include assistive equipment in all staff induction training: what is available, where it is stored, how to provide it, and how to operate it (e.g., turning on a hearing loop, unfolding a portable ramp).', 'Create a quick-reference card or poster for staff areas listing all equipment, its location, and who to contact if it needs restocking or repair.', 'Conduct refresher training at least annually and whenever new equipment is added.', 'Empower all front-of-house staff (not just managers) to issue equipment without seeking approval.', 'Include equipment awareness as part of mystery shopper or audit checks.'],
    reasoning: 'Staff who do not know what equipment exists, where it is, or how to provide it cannot help customers. Equipment awareness must be part of standard induction, not specialist knowledge.',
    resources: [],
  },
  '3.4-D-9': {
    actions: ['Survey staff about what equipment customers most frequently request or need but is not currently available.', 'Research grant and funding opportunities for accessible equipment through state disability services, local government, and disability peak bodies.', 'Explore equipment-sharing partnerships with neighbouring venues or local disability organisations to reduce individual cost.', 'Investigate low-cost alternatives: printed communication boards (free online), donated wheelchairs, volunteer-run sensory kit assembly.', 'Develop a business case showing how equipment investment increases customer reach, satisfaction, and compliance with the Disability Discrimination Act 1992.'],
    reasoning: 'Understanding what prevents your organisation from offering more equipment helps prioritise investment, apply for grants, or find low-cost solutions. Common barriers include budget, storage, and awareness.',
    resources: [],
  },
  '3.4-F-1': {
    actions: ['Conduct an audit of what assistive equipment is currently available (wheelchairs, hearing loops, magnifiers, sensory items, communication boards) and identify gaps.', 'Benchmark against comparable venues in your industry to identify standard equipment offerings.', 'Consult with people with disability and disability organisations about what equipment would be most valuable for your venue type.', 'Develop a priority list of equipment to acquire, starting with high-impact, low-cost items (portable ramps, magnifying sheets, noise-cancelling headphones).', 'Set a budget and timeline for acquiring priority equipment.'],
    reasoning: 'Offering assistive equipment signals that your venue anticipates the needs of people with disability rather than treating accessibility as an afterthought. It directly impacts whether some customers can participate at all.',
    resources: [],
  },
  '3.4-F-2': {
    actions: ['List all available assistive equipment on your website accessibility page, with photos and brief descriptions of each item.', 'Include equipment availability in booking confirmation emails and pre-visit information.', 'Display available equipment in your venue entrance, reception area, or welcome signage.', 'Train front-of-house staff to proactively mention available equipment during customer interactions, not only when asked.', 'Update equipment listings whenever items are added, removed, or temporarily unavailable.'],
    reasoning: 'Equipment that customers do not know about before arriving cannot be factored into their visit planning. Many people with disability only visit venues where they know their needs can be met.',
    resources: [],
  },
  '3.4-F-3': {
    actions: ['Establish a simple process for customers to access equipment: either self-service from a visible, signed location or a single request to any front-of-house staff member.', 'Avoid requiring forms, deposits, or identification to borrow standard assistive equipment.', 'Ensure equipment is stored in a location accessible to wheelchair users (not behind a counter, upstairs, or in a locked room without staff nearby).', 'Provide clear signage at the equipment location showing what is available and how to request it.', 'Consider a QR code or digital request system for people who prefer not to ask verbally.'],
    reasoning: 'If requesting equipment requires finding a specific staff member, filling in a form, or paying a deposit, the barrier to access negates the benefit of having the equipment at all.',
    resources: [],
  },
  '3.4-F-4': {
    actions: ['Review your current equipment lending policy and remove any charges for standard assistive equipment (wheelchairs, hearing devices, sensory items).', 'If a deposit is required for high-value items, offer a card-hold rather than cash deposit to reduce barriers.', 'Ensure there is no hire charge differential between accessibility equipment and standard equipment (e.g., if you offer free standard trolleys, wheelchair trolleys should also be free).', 'Publicise that equipment is free of charge in your accessibility information to encourage uptake.', 'Include the free-of-charge policy in staff training so it is applied consistently.'],
    reasoning: 'Charging for assistive equipment creates inequity: non-disabled customers do not pay to access the standard environment, so disabled customers should not pay to access the equivalent experience.',
    resources: [],
  },
  // Module 3.5
  '3.5-1-1': {
    actions: ['Audit all signs for contrast ratio (minimum 3:1 between text and background for large text per AS 1428.1).', 'Measure character heights against AS 1428.1 requirements based on reading distance.', 'Replace signs that use decorative, italic, or serif fonts with clear sans-serif alternatives.', 'Ensure all signs are well-lit and free from glare.'],
    reasoning: 'People with low vision rely on clear, high-contrast signage to navigate independently. Small, decorative, or low-contrast signs are effectively invisible to a significant portion of visitors.',
    resources: [],
  },
  '3.5-1-2': {
    actions: ['Standardise mounting heights: room identification signs at 1400-1600mm on the latch side of doors, directional signs at eye level for both standing and seated users.', 'Place signs consistently on the same side of doorways throughout the venue.', 'Ensure signs are not obscured by open doors, plants, or other fixtures.', 'Create a signage placement standard document for future installations.'],
    reasoning: 'Consistent sign placement allows people with low vision and cognitive disabilities to develop a predictable search pattern. If signs move around, these users must search each area anew, causing fatigue and disorientation.',
    resources: [],
  },
  '3.5-1-3': {
    actions: ['Install directional signs pointing to accessible toilets, lifts, parking, entrances, and exits from all major decision points.', 'Use the International Symbol of Access and other standard accessibility symbols on all relevant signs.', 'Add tactile lettering and Braille to room identification signs at accessible facilities.', 'Verify signage coverage by walking the route from the main entrance to each accessible facility.'],
    reasoning: 'Customers cannot use accessible facilities they cannot find. Clear signage for toilets, lifts, and accessible entrances is essential for independent navigation and is required under AS 1428.1.',
    resources: [],
  },
  '3.5-1-4': {
    actions: ['Ask someone unfamiliar with your venue to navigate to key destinations (toilets, main service area, exit) using only existing signage.', 'Note every point where they hesitate, take a wrong turn, or need to ask for help.', 'Install additional directional signs at each identified decision point.', 'Consider adding a printed or digital venue map available at the entrance.'],
    reasoning: 'Independent wayfinding is fundamental to inclusion. People with cognitive disabilities, anxiety, or memory difficulties may not feel comfortable asking for help and will leave rather than risk getting lost.',
    resources: [],
  },
  '3.5-D-1': {
    actions: ['Install tactile and Braille signage on all room identification signs, toilet signs, exit signs, floor level signs, and stairway signs (AS 1428.1 Clause 8).', 'Use raised tactile characters that are 15-55 mm high, in a sans-serif font, raised 1-1.5 mm from the surface (AS 1428.1 Clause 8.3).', 'Include Grade 2 Braille positioned directly below the corresponding tactile text, with a minimum 8 mm gap between text and Braille (AS 1428.1 Clause 8.4).', 'Mount tactile signs on the wall on the latch side of the door (or the approach side for rooms without doors) at a height of 1200-1600 mm above floor level (AS 1428.1 Clause 8.2).', 'Ensure signs are located where they can be found by trailing a hand along the wall, not recessed into alcoves or behind objects.', 'Verify Braille accuracy with a Braille-literate reviewer before installation.'],
    reasoning: 'Tactile and Braille signage is the primary way people who are blind or have severe low vision identify rooms, floors, and facilities. It is a mandatory requirement under AS 1428.1 for key signs in public buildings.',
    resources: [],
  },
  '3.5-D-2': {
    actions: ['Ensure all signage has a minimum 30% luminance contrast between text/symbols and the sign background (AS 1428.1 Clause 6).', 'Use light text on a dark background or dark text on a light background; avoid medium-tone combinations (e.g., mid-blue on mid-grey).', 'Ensure the sign itself contrasts with the wall or surface it is mounted on by at least 30% luminance contrast so it can be located.', 'Avoid glossy or reflective sign surfaces that cause glare and reduce effective contrast.', 'Test contrast using a luminance contrast meter or the Colour Contrast Analyser tool, measuring under the actual lighting conditions of each location.'],
    reasoning: 'Without adequate contrast, signs are invisible to people with low vision, which includes a significant proportion of older Australians. Contrast is a mandatory requirement under AS 1428.1.',
    resources: [],
  },
  '3.5-D-3': {
    actions: ['Install directional signs at every decision point: corridor intersections, lift lobbies, stairway entries, building entries, and any point where a customer must choose a direction (AS 1428.1 Clause 8).', 'Include clear directional arrows and the name/icon of the destination (toilets, exit, reception, lifts, key facilities).', 'Use consistent sign design (same font, same colour scheme, same symbol set) throughout the venue.', 'Ensure directional signs are visible from the approach direction and not obscured by doors, columns, or other people.', 'Mount directional signs at 1400-1700 mm above floor level (eye height for standing and seated people) or overhead at a minimum 2100 mm with appropriately scaled text.'],
    reasoning: 'Without directional signage at decision points (intersections, lift lobbies, floor entries), people with cognitive disability, vision impairment, or unfamiliarity with the venue cannot independently navigate.',
    resources: [],
  },
  '3.5-D-4': {
    actions: ['Provide a tactile or high-contrast map/floor plan at the main entrance, at a height of 900-1300 mm to be usable by seated and standing people.', 'Make printed maps available in large print (minimum 18 pt, sans-serif) and high contrast (dark on light or reverse).', 'Offer a digital map on your website or app that is screen-reader compatible and zoomable (WCAG 2.2 Level AA).', 'Include key accessibility features on the map: accessible toilets, lifts, hearing loops, quiet space, assistance animal relief area, accessible parking.', 'Use simple language, clear icons, and a "You Are Here" marker on physical maps.'],
    reasoning: 'A map, floor plan, or directory at the entrance gives people with cognitive disability, anxiety, and low vision a mental model of the venue before navigating it, reducing stress and improving independence.',
    resources: [],
  },
  '3.5-D-5': {
    actions: ['Install a clearly visible sign at the street frontage that identifies your venue, readable from at least 10 m away (character height proportional to viewing distance, approximately 25 mm per 1 m of distance).', 'Provide directional signage from nearby public transport stops, car parks, and pedestrian routes to your entrance.', 'Ensure the entrance is clearly signed with the venue name and an accessible entrance symbol if the accessible entrance differs from the main entrance.', 'Light approach signage adequately for use after dark (minimum 100 lux on the sign face).', 'Avoid placing approach signs behind landscaping, vehicles, or temporary structures that obscure them.'],
    reasoning: 'If a customer cannot identify your venue from the street or find the entrance, the rest of your accessibility efforts are wasted. Approach signage is the first and most critical wayfinding element.',
    resources: [],
  },
  '3.5-D-6': {
    actions: ['Ensure all emergency exit signs comply with AS 2293.1: continuously illuminated (maintained or self-luminous), visible from the approach direction, and positioned at door height or overhead at each exit and along the egress path.', 'Install low-level exit signs (within 200-500 mm of floor level) along exit routes for visibility in smoke conditions (AS 2293.1 Clause 3.3).', 'Verify that exit signs are visible from any point along the evacuation route, with no more than 20 m between signs in open areas.', 'Test emergency lighting and exit signs every 6 months and replace any that have dimmed, failed, or become obscured.', 'Include tactile exit signage at exit doors for people who are blind (AS 1428.1 Clause 8).', 'Ensure evacuation routes from accessible areas are themselves accessible (no stairs-only routes from wheelchair-accessible zones).'],
    reasoning: 'Emergency exit signs are life-safety elements. People with low vision who cannot see exit signs, and people with hearing impairment who cannot hear fire alarms, depend on illuminated and visible exit signage to evacuate safely.',
    resources: [],
  },
  '3.5-D-7': {
    actions: ['Add internationally recognised pictograms or symbols alongside text on all key signs (toilets, exits, lifts, information, first aid).', 'Use symbols that comply with ISO 7001 (public information symbols) or AS 1428.1 Clause 8.6 for accessibility-specific symbols.', 'Consider Easy Read formatting for longer informational signs: short sentences, simple words, large font (minimum 16 pt), and supporting images.', 'Test symbol recognition with people with intellectual disability to ensure symbols are intuitive, not abstract.', 'Maintain consistency: use the same symbol set and style across all signage in the venue.'],
    reasoning: 'Text-only signage excludes people with cognitive disability, intellectual disability, low literacy, and non-English speaking backgrounds. Symbols and Easy Read formats make signage universally understandable.',
    resources: [],
  },
  // Module 3.6
  '3.6-1-1': {
    actions: ['Identify your most-used customer documents (menus, brochures, forms, price lists, programs).', 'Create large print versions at minimum 18pt using a clear sans-serif font (Arial, Helvetica, Verdana).', 'Print on matt (non-glossy) paper with good contrast (dark text on light background).', 'Keep large print copies stocked at reception and service points, and replace them when content changes.'],
    reasoning: 'Over 450,000 Australians have low vision. Standard 10-12pt text is unreadable for many of them, and not everyone has a smartphone to magnify digital content. Large print is a simple, low-cost accommodation.',
    resources: [],
  },
  '3.6-1-2': {
    actions: ['Train all customer-facing staff to offer to read materials aloud proactively, not just when asked.', 'Coach staff on clear reading technique: steady pace, natural tone, describing layout and options.', 'Ensure staff offer this service in a private or semi-private manner to protect customer dignity.', 'Include this as a standard part of new staff induction.'],
    reasoning: 'People who are blind, have low literacy, or have cognitive disabilities may be unable to read printed materials independently. Staff who can read aloud provide immediate, no-cost access to information.',
    resources: [],
  },
  '3.6-1-3': {
    actions: ['Create mobile-friendly, screen-reader-accessible versions of key documents and host them on your website.', 'Generate QR codes linking to these accessible digital versions and display them alongside printed materials.', 'Test the linked content with a screen reader and at 200% zoom to confirm accessibility.', 'Ensure QR codes are large enough to scan easily (minimum 2cm x 2cm) and have a text URL alternative nearby.'],
    reasoning: 'Digital alternatives enable people with low vision to zoom in, screen reader users to hear content, and people with motor impairments to navigate at their own pace. QR codes bridge the gap between physical and digital.',
    resources: [],
  },
  '3.6-1-4': {
    actions: ['Identify which key documents would benefit most from Easy Read or Plain English versions (safety information, welcome guides, instructions).', 'Commission or create Easy Read versions using simple sentences, common words, and supporting images.', 'Have Easy Read versions reviewed by people with intellectual disability or their advocacy organisations.', 'Make Easy Read versions available alongside standard versions at all distribution points.'],
    reasoning: 'People with intellectual disability, acquired brain injury, limited English proficiency, and some learning disabilities need simplified information to understand and act on content. Complex language creates a barrier to participation.',
    resources: [],
  },
  '3.6-1-5': {
    actions: ['Audit all menus and food displays for clear allergen labelling using consistent, recognisable symbols.', 'Include common allergens (gluten, dairy, nuts, eggs, soy, seafood) and dietary categories (vegetarian, vegan, halal).', 'Use plain language and avoid abbreviations that customers may not understand.', 'Ensure allergen information is available in accessible formats (large print, digital) and that staff can explain it verbally.'],
    reasoning: 'People with food allergies and intolerances face serious health risks from unlabelled food. Clear labelling is also essential for people with cognitive disabilities who may not be able to ask detailed questions about ingredients.',
    resources: [],
  },
  '3.6-D-1': {
    actions: ['Audit every QR-code destination URL for WCAG 2.2 Level AA compliance, including keyboard operability, screen-reader compatibility, and sufficient colour contrast.', 'Ensure linked pages use semantic HTML headings, alt text on images, and logical reading order so assistive technology can parse the content.', 'Provide the same information in at least one alternative format (large print, verbal explanation by staff, or printed accessible version) for people who cannot use a smartphone.', 'Test QR-code landing pages on both iOS VoiceOver and Android TalkBack to confirm they are navigable without sighted interaction.', 'Include a short text URL alongside each QR code so people using desktop magnification or browser-based assistive technology can type the address manually.'],
    reasoning: 'QR codes are increasingly used as a replacement for printed materials, but the linked content must itself be accessible or the QR code becomes another barrier. People using screen readers, magnification, or switch access need the destination page to meet WCAG 2.2 Level AA.',
    resources: [],
  },
  '3.6-D-10': {
    actions: ['Establish a documented update process that triggers simultaneous revision of all format versions (standard print, large print, Braille, audio, digital) whenever content changes.', 'Assign a named staff member or role as responsible for ensuring alternative formats are current.', 'Add version dates to all materials (including Braille and audio) so staff and customers can verify currency.', 'Schedule quarterly audits comparing alternative format content against the current standard version.', 'Remove outdated alternative format copies from circulation immediately when new versions are issued.'],
    reasoning: 'Outdated alternative format materials can cause confusion, embarrassment, or even safety risks (for example, if allergen information has changed). Maintaining parity between standard and accessible versions is essential for equitable service.',
    resources: [],
  },
  '3.6-D-11': {
    actions: ['Display prices in a minimum 14pt sans-serif font with a contrast ratio of at least 4.5:1 against the background, consistent with WCAG 2.2 SC 1.4.3.', 'Position pricing information at eye level for both standing and seated customers (between 900 mm and 1500 mm from the floor).', 'Use consistent, predictable placement of prices relative to product names so customers using magnification or screen readers can associate items with costs.', 'Avoid handwritten pricing or decorative fonts that are difficult to read for people with low vision or dyslexia.', 'Ensure digital pricing displays (screens, tablets) meet the same contrast and font-size standards as printed materials.'],
    reasoning: 'If customers cannot independently read pricing information, they may feel unable to make informed choices or may avoid engaging altogether. Clear, accessible pricing supports dignity and autonomy for people with low vision, cognitive disability, or literacy challenges.',
    resources: [],
  },
  '3.6-D-2': {
    actions: ['Print QR codes at a minimum of 30 x 30 mm to allow scanning from a comfortable distance and with camera autofocus.', 'Position QR codes between 900 mm and 1200 mm from the floor, consistent with AS 1428.1 reach-range guidance for wheelchair users.', 'Use high-contrast colours (dark module on light background) and avoid placing codes on reflective, curved, or textured surfaces.', 'Test scanning under the actual lighting conditions at each location, including low-light areas.', 'Add a brief label beside the QR code explaining what it links to, so customers can decide whether to scan.'],
    reasoning: 'A QR code that is too small, positioned too high, or printed on a reflective surface may be impossible to scan for people with low vision, limited reach, or who use a wheelchair. Placement directly affects independent access to information.',
    resources: [],
  },
  '3.6-D-3': {
    actions: ['Identify the most critical printed materials (menus, safety information, room directories, wayfinding maps) and commission Grade 2 contracted Braille versions from an accredited transcription service.', 'Ensure Braille materials are kept alongside standard print versions so customers can locate them independently.', 'Train front-of-house staff to know where Braille materials are stored and to offer them proactively.', 'Review and reprint Braille versions whenever the standard print version is updated to avoid outdated information.', 'Consider Braille labels on key physical items (lift buttons, room numbers, amenity dispensers) as a complement to full Braille documents, consistent with AS 1428.1 tactile signage requirements.'],
    reasoning: 'Braille is a primary reading medium for many people who are blind and is sometimes the only way a person can independently access printed information. Offering Braille demonstrates a commitment to equitable access beyond digital-only solutions.',
    resources: [],
  },
  '3.6-D-4': {
    actions: ['Record clear, professionally narrated audio versions of key printed materials such as menus, brochures, and visitor guides.', 'Host audio files on an accessible platform and link them via QR codes, NFC tags, or a simple URL printed on the physical material.', 'Ensure audio descriptions include all meaningful visual information (layout cues, images, icons) not just the text content.', 'Provide volume control, pause, and rewind functionality within the audio player interface.', 'Offer personal audio guide devices with induction-loop or Bluetooth neckloop output for people using hearing aids with telecoil.'],
    reasoning: 'Audio descriptions and audio guides provide access to printed information for people who are blind, have low vision, have cognitive disability, or have low literacy. They also benefit people who prefer auditory learning.',
    resources: [],
  },
  '3.6-D-5': {
    actions: ['Identify the most common community languages spoken by your customer base using local demographic data from the Australian Bureau of Statistics.', 'Translate key materials (menus, safety information, wayfinding) into at least the top two to three community languages relevant to your area.', 'Use plain English (aim for Year 6 reading level) as the base version before translation, making the content easier for translators and readers alike.', 'Engage accredited NAATI translators to ensure accuracy and cultural appropriateness.', 'Consider Auslan video translations for critical information, hosted online and linked via QR code.'],
    reasoning: 'Australia is a multilingual society. People from culturally and linguistically diverse (CALD) backgrounds, including Deaf community members who use Auslan, may not read English fluently. Language barriers compound disability barriers.',
    resources: [],
  },
  '3.6-D-6': {
    actions: ['Commission tactile maps from a specialist provider, incorporating raised lines, Braille labels, and distinct textures for different zones (as guided by AS 1428.4.1 and international best practice).', 'Install tactile maps at main entry points and key decision points at a height of 900-1100 mm, angled for comfortable touch reading.', 'Include a "You Are Here" tactile indicator and orient the map to match the viewer direction.', 'Pair tactile maps with audio description (via QR code or NFC tag) so users can cross-reference touch and audio information.', 'Review and update tactile maps whenever the physical layout changes.'],
    reasoning: 'Tactile maps and models allow people who are blind or have low vision to independently orient themselves in a space. They convey spatial relationships that verbal descriptions or Braille text alone cannot fully communicate.',
    resources: [],
  },
  '3.6-D-7': {
    actions: ['Caption all pre-recorded video and multimedia content to WCAG 2.2 Level A (SC 1.2.2), including speaker identification, sound effects, and music descriptions.', 'Use open captions (burned in) for content displayed in public areas where viewers cannot activate closed captions themselves.', 'Ensure caption text meets minimum contrast requirements (white text on a solid dark background or equivalent) and uses a clear sans-serif font at a readable size.', 'For live or streaming content, engage an accredited CART (Communication Access Realtime Translation) provider or use live auto-captioning with human review.', 'Test captions for synchronisation accuracy; captions should appear within one second of the corresponding audio.'],
    reasoning: 'Captions are essential for people who are Deaf or hard of hearing and also benefit people in noisy environments, those with cognitive disability, and non-native English speakers. WCAG 2.2 Level A requires captions on all pre-recorded multimedia (SC 1.2.2).',
    resources: [],
  },
  '3.6-D-8': {
    actions: ['Add audio description tracks to all pre-recorded videos that contain meaningful visual-only information, in line with WCAG 2.2 SC 1.2.3 and SC 1.2.5.', 'Describe on-screen text, actions, scene changes, and graphics that are not conveyed by the existing soundtrack.', 'Provide a secondary audio channel or a separate described version so users can choose their preferred format.', 'Engage a professional audio describer familiar with Australian English conventions for public-facing content.', 'Where full audio description is not yet feasible, provide an extended text transcript that includes all visual information.'],
    reasoning: 'Audio description narrates visual elements of video content that a person who is blind or has low vision cannot see. Without it, significant portions of video communication are inaccessible. WCAG 2.2 Level A requires audio description or a media alternative (SC 1.2.3).',
    resources: [],
  },
  '3.6-D-9': {
    actions: ['Use rigid, lightweight menu holders or single-page laminated cards that can be propped up or laid flat, reducing the need for grip strength.', 'Print text at a minimum of 14pt (ideally 16pt) in a clear sans-serif font with strong contrast (dark text on light, matte background).', 'Avoid glossy or reflective surfaces that create glare for people with low vision.', 'Ensure materials can be read with one hand, without needing to hold pages open or flip through many pages simultaneously.', 'Offer a digital version accessible on a personal device as an alternative for people who find physical materials difficult to handle.'],
    reasoning: 'Menus and printed materials that are heavy, floppy, small-print, or require two hands to hold create barriers for people with limited grip strength, tremor, upper limb differences, or low vision. The physical design of a document is as important as its content.',
    resources: [],
  },
  // Module 3.7
  '3.7-DD-10a': {
    actions: ['Provide emergency and safety information in large print, Braille, Easy Read, and audio formats, covering evacuation routes, assembly points, and emergency contacts.', 'Install visual fire alarms (flashing beacons) in all public areas and accessible accommodation rooms, as required by the National Construction Code and AS 1670.4.', 'Ensure emergency wayfinding signage includes tactile and high-contrast elements per AS 1428.1 and AS 2700 for luminance contrast.', 'Include people with disability in emergency evacuation planning and drills, providing Personal Emergency Evacuation Plans (PEEPs) where needed.', 'Test that emergency announcements are audible, visible, and comprehensible throughout all public areas including noisy zones.'],
    reasoning: 'Emergency and safety information is arguably the most critical content to make accessible. A person who cannot read an evacuation map, hear a fire alarm, or understand safety instructions is at serious risk. This is a safety-related item.',
    resources: [],
  },
  '3.7-DD-11a': {
    actions: ['Ensure all real-time displays use a minimum 24pt sans-serif font with a contrast ratio of at least 4.5:1, and avoid scrolling or auto-rotating content faster than 5 seconds per item.', 'Provide the same real-time information via an accessible digital channel (website, app, or SMS) that works with screen readers.', 'Pair visual displays with audio announcements for critical updates (schedule changes, delays, gate or room changes).', 'Position displays at heights visible from a seated position and ensure they are not obscured by glare or physical obstructions.', 'Test displays with people who have low vision to confirm readability at the typical viewing distance.'],
    reasoning: 'Real-time information displays (departure boards, event schedules, queue status screens) are often inaccessible to people with vision or cognitive impairments. If the same information is not available in alternative ways, these customers are excluded from time-sensitive updates.',
    resources: [],
  },
  '3.7-DD-1a': {
    actions: ['Conduct a stocktake of all current alternative format materials, noting format type, content covered, version date, and storage location.', 'Compare your inventory against the needs of the four main groups: vision (large print, Braille, audio), hearing (captions, Auslan), cognitive (Easy Read, visual guides), and physical (digital, hands-free).', 'Prioritise production of the formats you are missing, starting with safety-critical and high-use content.', 'Set a schedule for periodic review (at least annually) to ensure coverage keeps pace with new content.'],
    reasoning: 'Knowing which formats are already available allows you to identify gaps and prioritise investment. A venue that has large print but no audio, for example, is still excluding people who are blind.',
    resources: [],
  },
  '3.7-DD-1b': {
    actions: ['Train staff to mention alternative formats as part of the standard welcome or orientation script (e.g., "We also have large print and audio guide versions available").', 'Display signage at entry points and information desks listing the formats available, using clear icons.', 'Include alternative format availability in pre-visit information on your website and booking confirmation.', 'Monitor uptake of alternative formats and use low usage as a prompt to improve visibility rather than to discontinue the format.'],
    reasoning: 'Many customers with disability will not ask for alternative formats due to past negative experiences, social pressure, or simply not knowing they are available. Proactive offers normalise accessibility and increase uptake.',
    resources: [],
  },
  '3.7-DD-2a': {
    actions: ['Ensure touchscreens are mounted at a height accessible from a seated position (centre of screen no higher than 1200 mm, operable zone starting at 400 mm, per AS 1428.1 reach-range principles).', 'Provide alternative input methods (physical buttons, switch access, voice control) alongside touchscreen interaction.', 'Ensure all on-screen content meets WCAG 2.2 Level AA: sufficient contrast, resizable text, keyboard operability, and screen-reader compatibility.', 'Add audio output with headphone jack and volume control for exhibits with visual-only information.', 'Include tactile elements or physical models as a non-digital alternative for key exhibit content.', 'Test interactive exhibits with people with disability before deployment and after updates.'],
    reasoning: 'Interactive exhibits and digital displays that rely solely on touch, vision, or hearing exclude people with sensory or motor disabilities. Multi-modal design ensures everyone can engage with the content.',
    resources: [],
  },
  '3.7-DD-5a': {
    actions: ['Audit all tactile installations against AS 1428.1:2021 (signage) and AS 1428.4.1 (TGSIs), recording location, condition, and compliance status.', 'Verify that TGSIs are installed at the top and bottom of stairs, at ramp landings, and at pedestrian crossings within your site as required by AS 1428.4.1.', 'Check that Braille on signs uses Grade 2 contracted Braille and is positioned below the corresponding raised text.', 'Repair or replace any damaged, worn, or non-compliant tactile elements immediately, as deterioration renders them ineffective or hazardous.', 'Document all tactile installations on a site plan for maintenance scheduling and future planning.'],
    reasoning: 'Tactile elements such as TGSIs, Braille signage, and tactile maps are mandatory in certain locations under AS 1428.1 and AS 1428.4.1. Knowing what is currently installed helps identify compliance gaps and plan remediation.',
    resources: [],
  },
  '3.7-DD-6a': {
    actions: ['Map all current hearing loop and assistive listening device installations against AS 1428.5 requirements (reception counters, auditoriums, meeting rooms, service counters).', 'Ensure a hearing loop is installed at every staffed service point where spoken communication occurs, as required by AS 1428.5.', 'Verify that installed loops meet the IEC 60118-4 standard for field strength and frequency response by commissioning a professional loop test.', 'Display the international hearing loop symbol at every equipped location.', 'Maintain a register of loop locations, installation dates, and last test dates.'],
    reasoning: 'Hearing loops must be installed in specific locations under the Premises Standards and AS 1428.5. Knowing where systems are installed versus where they are needed identifies gaps in coverage that may constitute non-compliance.',
    resources: [],
  },
  '3.7-DD-6b': {
    actions: ['Schedule professional hearing loop testing at least annually, or more frequently in high-use areas, to IEC 60118-4 standards.', 'Conduct a quick daily or weekly functional check using a loop listener or hearing loop test app before opening.', 'Keep a maintenance log recording test dates, results, and any remedial actions taken.', 'Engage the original installer or a qualified audio engineer for annual certification testing.', 'Replace batteries in portable loop receivers on a fixed schedule and keep spares on hand.'],
    reasoning: 'Hearing loops degrade over time and can be affected by electromagnetic interference from nearby equipment. An untested loop may appear functional but deliver poor audio quality, rendering it useless for hearing aid users.',
    resources: [],
  },
  '3.7-DD-7a': {
    actions: ['Identify and establish a standing arrangement with at least one accredited CART provider, ideally one familiar with your venue and subject matter.', 'Confirm the provider can deliver both on-site and remote captioning to give you flexibility.', 'Negotiate a service agreement that includes response times, cancellation terms, and technology requirements.', 'Keep the provider briefed on your typical event types, terminology, and any specialist vocabulary.', 'Maintain a backup provider contact in case your primary provider is unavailable.'],
    reasoning: 'CART (Communication Access Realtime Translation) providers require advance booking, especially in regional areas. Having an established relationship means you can arrange captioning quickly when needed rather than scrambling at the last minute.',
    resources: [],
  },
  '3.7-DD-7b': {
    actions: ['Add an accessibility requirements field to all event registration, tour booking, and group visit forms, specifically asking about captioning and Auslan needs.', 'Frame the question positively (e.g., "Let us know how we can make this event accessible for you") rather than asking customers to disclose a disability.', 'Set an internal deadline for accessibility requests that gives you enough lead time to book CART or interpreters (typically 2-4 weeks).', 'Follow up with anyone who indicates a captioning need to confirm arrangements and provide details of what will be available.', 'Include a general statement in event promotions that captioning and Auslan can be arranged on request.'],
    reasoning: 'Captioning needs must be known in advance to arrange CART or Auslan interpreters. If registration or booking forms do not ask, the venue cannot prepare, and the customer arrives to find the service unavailable.',
    resources: [],
  },
  '3.7-DD-8a': {
    actions: ['Ensure audio guides cover all major exhibits and key wayfinding points, not just a highlights selection.', 'Include audio description of visual elements (colours, shapes, spatial relationships, facial expressions in artworks) alongside factual narration.', 'Offer multiple depth levels (brief overview and detailed description) so users can choose their engagement level.', 'Update audio guide content whenever exhibits change, rotate, or are removed.', 'Test audio guides with people who are blind or have low vision to ensure descriptions are useful and accurate.'],
    reasoning: 'The depth and quality of audio guide content determines whether it genuinely provides equitable access or merely checks a box. Guides that only cover a fraction of exhibits or skip visual descriptions fail their intended purpose.',
    resources: [],
  },
  '3.7-DD-9a': {
    actions: ['Include venue-specific symbols alongside universal ones: for example, symbols for your key services (cafe, gift shop, exhibit names), ticket types, accessibility features (lift, accessible toilet), and common requests (help, stop, more time).', 'Use a recognised symbol set (such as Boardmaker PCS, SymbolStix, or ARASAAC) for consistency with what AAC users already know.', 'Include "yes," "no," "I don\'t know," and an alphabet board for spelling out specific words.', 'Laminate boards for durability and hygiene, and ensure they are available at every staffed interaction point.', 'Consult a speech pathologist or AAC specialist when designing boards to ensure they are practical and effective.'],
    reasoning: 'Communication boards are only effective if they contain the right symbols for your specific venue context. A generic board may lack the vocabulary customers need to ask about your services, products, or spaces.',
    resources: [],
  },
  '3.7-DD-9b': {
    actions: ['Include AAC awareness and communication board training in the standard staff induction program for all customer-facing roles.', 'Cover practical skills: pointing to symbols, following the customer lead, allowing processing time, confirming understanding, and not speaking for the person.', 'Use role-play scenarios in training so staff practise using boards before encountering a real situation.', 'Engage a speech pathologist or disability awareness trainer to deliver or review the training content.', 'Refresh training annually and whenever new communication tools are introduced.'],
    reasoning: 'Communication boards are useless if staff do not know how to use them or feel uncomfortable offering them. Training transforms a wall-mounted resource into an active communication tool.',
    resources: [],
  },
  '3.7-PC-1': {
    actions: ['Produce large-print versions (minimum 18pt, sans-serif, high contrast) of key visitor information including maps, guides, and safety instructions.', 'Create Easy Read versions of essential information using short sentences, common words, and supporting images, following Australian Easy Read guidelines.', 'Offer audio guides or audio versions of printed content, available via personal devices or provided equipment.', 'Store alternative format materials at the main reception or entry point and train staff to offer them proactively.', 'Review and update all alternative formats whenever the standard version changes.'],
    reasoning: 'Providing information in only one format excludes people with different sensory, cognitive, or literacy needs. Alternative formats ensure that key on-site information is available to the widest possible audience.',
    resources: [],
  },
  '3.7-PC-10': {
    actions: ['Communicate changes in multiple formats simultaneously: visual signage (large print, high contrast), audio announcements, and digital notifications (app, SMS, website update).', 'Use plain language and clear, specific details (what changed, where, until when, and what alternative is available).', 'Position temporary signage at decision points before a customer encounters the disruption, not only at the disrupted location.', 'Ensure digital disruption notices meet WCAG 2.2 Level AA and are announced by screen readers (using aria-live regions on websites).', 'Brief all staff on current disruptions at the start of each shift so they can proactively inform and assist customers.'],
    reasoning: 'Unexpected changes such as closures, maintenance, or schedule alterations can be disorienting and unsafe for people with disability, particularly those with vision, hearing, or cognitive impairments who may not pick up on informal cues.',
    resources: [],
  },
  '3.7-PC-2': {
    actions: ['Provide QR codes at key exhibit or information points that link to WCAG 2.2 Level AA compliant web content.', 'Ensure your venue Wi-Fi is free, reliable, and easy to connect to so customers can access digital content without mobile data.', 'Test all linked digital content on screen readers (VoiceOver, TalkBack) and with browser zoom at 200% to verify usability.', 'Offer a downloadable guide or app that works offline for areas with poor connectivity.', 'Include a text URL alongside every QR code for people who cannot scan codes.'],
    reasoning: 'Digital access via personal devices gives customers control over font size, contrast, screen reader use, and reading pace. QR codes, apps, and mobile-friendly websites extend accessibility beyond what fixed physical signage can achieve.',
    resources: [],
  },
  '3.7-PC-5': {
    actions: ['Install tactile signs with raised lettering and Grade 2 Braille at all key decision points, as required by AS 1428.1:2021 Clause 8 and the Premises Standards.', 'Ensure tactile signs are located on the wall on the latch side of the door, with the centreline between 1200 mm and 1600 mm from the floor (AS 1428.1:2021).', 'Provide tactile ground surface indicators (TGSIs) at stairways, ramps, and hazards in accordance with AS 1428.4.1.', 'Commission tactile maps or models of complex exhibit layouts from a specialist provider.', 'Include Braille labels on key interactive elements and exhibit labels where feasible.'],
    reasoning: 'Tactile information is a mandatory requirement under the Disability Discrimination Act 1992 and AS 1428.1 for signage in public buildings. People who are blind rely on tactile and Braille elements for independent wayfinding and information access.',
    resources: [],
  },
  '3.7-PC-6': {
    actions: ['Display the international hearing loop symbol at every location where a hearing loop or assistive listening system is installed, as required by AS 1428.5.', 'Position signage at the point of entry and at service counters, ticket desks, and information points within the looped area.', 'Include the symbol on your venue map and in pre-visit information so customers can plan ahead.', 'Ensure signage specifies the type of system (hearing loop, FM, infrared) so users know which receiver mode to select.', 'Train reception and front-of-house staff to direct customers to hearing-augmented areas.'],
    reasoning: 'The international hearing loop symbol indicates where assistive listening is available. Without clear signage, people with hearing aids fitted with telecoils will not know the system exists. Signage is required under AS 1428.5 and the Premises Standards where hearing augmentation is installed.',
    resources: [],
  },
  '3.7-PC-7': {
    actions: ['Engage an accredited CART (Communication Access Realtime Translation) provider for all scheduled live presentations, tours, and talks.', 'Display captions on a screen or monitor positioned where all audience members, including wheelchair users, have a clear sightline.', 'For recurring or regular presentations, explore auto-captioning platforms with human review to reduce cost while maintaining accuracy.', 'Ask attendees about captioning needs during booking or registration so you can arrange the service in advance.', 'Provide a post-event transcript of captioned content for attendees who wish to review it.'],
    reasoning: 'Real-time captioning (CART) provides immediate text access to spoken content for people who are Deaf, hard of hearing, or who process written language more effectively than spoken language. It is the only way some people can access live presentations.',
    resources: [],
  },
  '3.7-PC-8': {
    actions: ['Develop audio guides covering key exhibits, wayfinding, and safety information, available on personal devices via an app or web link.', 'Provide loaner audio guide devices with a 3.5 mm jack and Bluetooth for neckloop or hearing aid connectivity.', 'Include audio descriptions of visual elements (artworks, artefacts, scenery) not just readings of text labels.', 'Offer verbal information proactively through staff or volunteer guides trained in descriptive techniques.', 'Ensure audio content has adjustable volume and pause/rewind controls.'],
    reasoning: 'Audio information serves people who are blind, have low vision, have low literacy, or have cognitive disabilities that affect reading. Without an audio alternative, exhibit labels, safety notices, and directional information remain inaccessible.',
    resources: [],
  },
  '3.7-PC-9': {
    actions: ['Stock at least one AAC (augmentative and alternative communication) board with common venue-specific symbols (tickets, toilets, help, directions) at each staffed point.', 'Provide pen and paper or a whiteboard at service counters as a simple backup communication method.', 'Make a tablet with a text-to-speech app available for customers who can type but not speak.', 'Train all customer-facing staff in basic strategies for communicating with people who use AAC, including allowing extra time and not finishing sentences.', 'Display a sign indicating that communication supports are available, using the international symbol for communication access.'],
    reasoning: 'Communication supports bridge the gap for people with speech disability, autism, intellectual disability, aphasia, or those who are temporarily non-verbal. Having tools on hand means staff can serve every customer, not just those who communicate verbally.',
    resources: [],
  },
  // Module 3.8
  '3.8-1-1': {
    actions: ['List every experience and activity type your venue offers (spectator events, guided tours, recreational activities, conferences, etc.).', 'Map each activity type to its specific accessibility considerations (physical access, communication, sensory, cognitive).', 'Identify which activities currently have no accessibility accommodations and prioritise them for review.'],
    reasoning: 'Different activity types present different barriers. A guided tour has different accessibility needs than a gym class or a conference. Documenting activity types is the foundation for targeted accessibility improvements.',
    resources: [],
  },
  '3.8-1-2': {
    actions: ['Review each activity and identify at least two ways it could be modified (slower pace, seated option, audio description, simplified instructions, companion participation).', 'Document modifications in a staff guide so they are offered consistently.', 'Advertise available modifications in pre-visit information and activity descriptions.', 'Gather feedback from participants with disabilities to identify additional modification opportunities.', 'Train activity leaders on how to offer and implement modifications.'],
    reasoning: 'Rigid, one-format activities exclude people with diverse abilities. Simple modifications like allowing a seated option, providing written instructions alongside verbal ones, or adjusting timing can open activities to many more participants.',
    resources: [],
  },
  '3.8-1-3': {
    actions: ['Review scheduled activities and identify where pacing is fixed (timed tours, group classes, performances).', 'Introduce options for self-paced alternatives (self-guided tours, recorded presentations, flexible class structures).', 'Train facilitators to check in with participants and allow extra time without pressure.', 'Communicate pacing expectations in advance so participants can choose the right option for them.'],
    reasoning: 'People with chronic fatigue, chronic pain, cognitive processing differences, or mobility impairments may need more time. A rigid pace forces them to either keep up at the cost of their health or drop out entirely.',
    resources: [],
  },
  '3.8-D-1': {
    actions: ['Establish a clear policy that customers can pause and resume experiences (tours, classes, performances) without penalty or loss of place.', 'Identify and communicate designated rest or quiet areas along activity routes where customers can take a break.', 'Train guides and facilitators to offer natural pause points and check in with participants about pacing.', 'For timed or ticketed experiences, offer a re-entry system (stamp, wristband, or digital pass) so customers who step out can return.', 'Include break policy information in pre-visit and at-the-door communications.'],
    reasoning: 'People with chronic pain, fatigue conditions, anxiety, sensory overload, or mobility impairment may need to pause during an experience. If breaks are not supported, customers either push through at risk of harm or abandon the activity.',
    resources: [],
  },
  '3.8-D-10': {
    actions: ['Install a hearing loop or equivalent assistive listening system in all meeting and conference rooms, as required by AS 1428.5 and the Premises Standards.', 'Ensure the loop covers the entire audience area, not just the front rows, and meets IEC 60118-4 field-strength standards.', 'Display the international hearing loop symbol at the room entrance and on booking information.', 'Test the hearing loop before every meeting or event and keep a portable loop system as a backup.', 'Provide receivers for guests who do not have telecoil-equipped hearing aids.'],
    reasoning: 'Hearing augmentation in meeting rooms is mandatory under the Premises Standards where the room is used for spoken communication. Without it, people who use hearing aids with telecoils cannot effectively participate in meetings.',
    resources: [],
  },
  '3.8-D-11': {
    actions: ['Offer Auslan interpreting for meetings and conferences when requested, engaging NAATI-certified interpreters with experience in the relevant subject matter.', 'Provide CART (Communication Access Realtime Translation) captioning as an alternative or complement to Auslan, particularly for large-group settings.', 'Ask about communication access needs in meeting invitations and registration forms, with a lead time of at least two weeks for booking interpreters.', 'Position interpreters where Deaf participants have a clear, well-lit sightline and can see both the interpreter and the presenter.', 'Budget for accessibility services as a standard meeting cost, not an add-on that requires special approval.'],
    reasoning: 'Auslan is the primary language of the Australian Deaf community. Captioning supports people who are hard of hearing or deafened. Without at least one of these services, Deaf and hard of hearing participants are excluded from spoken content in meetings.',
    resources: [],
  },
  '3.8-D-12': {
    actions: ['Provide tables with a minimum 700 mm knee clearance height, 500 mm knee depth, and 800 mm width at each accessible seating position, consistent with AS 1428.2.', 'Distribute accessible tables throughout the room rather than isolating them in one corner.', 'Ensure table surfaces are at a comfortable working height of 730-750 mm from the floor.', 'Avoid tables with central pedestal bases or crossbars that obstruct wheelchair footrests.', 'Have a supply of portable accessible tables available for rooms that do not have fixed accessible furniture.'],
    reasoning: 'Tables without adequate knee clearance prevent wheelchair users from pulling in close enough to work comfortably. This is a mandatory requirement under AS 1428.2 for accessible furniture in public buildings.',
    resources: [],
  },
  '3.8-D-13': {
    actions: ['Install seating at maximum 60 m intervals along activity routes, consistent with AS 1428.2 guidance for outdoor rest points.', 'Ensure seats have backs and armrests to support people who have difficulty sitting down or standing up.', 'Provide a mix of seat heights (standard 450 mm and higher 500-520 mm) to accommodate different needs.', 'Position seats on firm, level ground with space alongside for a wheelchair user or companion.', 'Mark rest-point locations on route maps and in pre-visit information.'],
    reasoning: 'People with mobility impairment, chronic pain, or fatigue conditions need to rest during activities. Without seating along routes, they may be unable to complete an experience or may push beyond safe limits.',
    resources: [],
  },
  '3.8-D-14': {
    actions: ['Provide accessible shuttle buses, golf buggies, or other transport with wheelchair ramps or lifts between key locations on large sites.', 'Ensure transport vehicles have securement systems for wheelchairs and mobility aids that meet Australian vehicle accessibility standards.', 'Communicate transport options, schedules, and pick-up points in pre-visit information and at key on-site locations.', 'Allow assistance animals to travel on all transport services.', 'Offer transport on demand (not just scheduled runs) for people who need it during the visit.'],
    reasoning: 'When activity locations are spread across a large site, people with mobility impairment may be unable to move between them independently. Accessible transport options remove this barrier and enable full participation.',
    resources: [],
  },
  '3.8-D-15': {
    actions: ['Survey all activity routes and identify every point where stairs, steep gradients (greater than 1:14), or rough terrain create a barrier.', 'Provide an alternative accessible route for each barrier point, ensuring it reaches the same destination or an equivalent experience.', 'Mark alternative routes clearly on maps and with on-site directional signage, including distance and gradient information.', 'Ensure alternative routes are maintained to the same standard as primary routes (surface, lighting, vegetation clearance).', 'Where no alternative is possible, provide clear advance notice and offer an equivalent experience (e.g., a virtual tour, viewing platform, or guided description).'],
    reasoning: 'Stairs, steep gradients, and rough terrain are impassable for many wheelchair users and dangerous for people with mobility, balance, or vision impairments. Alternative routes must exist to ensure safe, equitable access. This is a safety-related item.',
    resources: [],
  },
  '3.8-D-16': {
    actions: ['Publish detailed route information on your website and in booking confirmations, including distance, surface type, gradient, width, rest points, shade, and water availability.', 'Use a standardised grading or rating system (such as the Australian Trail Grading System adapted with accessibility-specific annotations) for consistency.', 'Include photographs or video of the route to help people assess conditions for themselves.', 'Provide the information in accessible digital format (screen-reader compatible, with alt text on images).', 'Update route information seasonally and after any weather events or maintenance that change conditions.'],
    reasoning: 'Providing route details in advance allows people with disability to assess whether they can participate, plan their energy, arrange assistance, or choose alternatives. Without this information, customers face uncertainty that may deter them from attending.',
    resources: [],
  },
  '3.8-D-17': {
    actions: ['Assess your activity offerings and identify where adaptive or modified equipment could enable participation by people with different disabilities.', 'Procure adaptive equipment appropriate to your activities, consulting with disability sport or recreation organisations for recommendations.', 'Train staff in the safe setup, adjustment, and use of all adaptive equipment.', 'List available adaptive equipment on your website and in pre-visit information, including how to request or book it.', 'Maintain adaptive equipment to the same safety and quality standard as all other equipment, with regular inspections logged.'],
    reasoning: 'Adaptive equipment (such as hand-cycles, sit-skis, beach wheelchairs, modified game controllers, or adaptive fishing rods) enables people with disability to participate in activities alongside everyone else. Without it, participation is impossible for many people.',
    resources: [],
  },
  '3.8-D-18': {
    actions: ['Develop at least one inclusive program, session, or class for your most popular activities, designed with input from people with disability.', 'Promote inclusive programs through disability organisations, Auslan social media, Easy Read flyers, and accessible digital channels.', 'Ensure inclusive programs are offered at reasonable times, not only at off-peak or inconvenient hours.', 'Train facilitators in disability-inclusive practice, including communication, pacing, sensory considerations, and positive behaviour support.', 'Collect participant feedback after every inclusive session and use it to improve future offerings.'],
    reasoning: 'Inclusive programs (such as sensory-friendly sessions, all-abilities classes, or supported programs) create structured opportunities for people with disability to participate in a welcoming, adapted environment. They complement mainstream access by addressing specific needs.',
    resources: [],
  },
  '3.8-D-19': {
    actions: ['Provide at least one accessible changing room and shower per facility that meets AS 1428.1:2021 requirements for size (minimum 2400 mm x 2600 mm), grab rails, shower seat, and turning space.', 'Include a privacy curtain or lockable door that can be operated from a seated position.', 'Install a height-adjustable or fixed adult-size change table where the facility is used for swimming, sport, or physical activity.', 'Ensure the accessible change facility is located on an accessible path of travel from the activity area, not in a separate distant location.', 'Maintain all grab rails, shower seats, and alarm pull cords in working order, checking weekly.'],
    reasoning: 'Accessible changing rooms and showers are mandatory under the Premises Standards where change facilities are provided. Without them, people with disability cannot participate in swimming, fitness, sports, or any activity requiring a change of clothing.',
    resources: [],
  },
  '3.8-D-19a': {
    actions: ['Provide a range of accessible gym equipment including machines with wheelchair-transfer access, adjustable-height benches, and equipment operable with limited grip strength.', 'Maintain a minimum 1200 mm clear pathway between all equipment to allow wheelchair and mobility aid passage.', 'Ensure at least one piece of cardio equipment (e.g., arm ergometer or recumbent bike with low step-through) is accessible for wheelchair users.', 'Label equipment with large-print, high-contrast instructions and offer staff-guided orientation sessions.', 'Consult an exercise physiologist or accredited exercise scientist with disability experience when selecting equipment.'],
    reasoning: 'Standard gym equipment often has fixed seats, narrow access points, or controls that require fine motor skills. Without accessible equipment and clear pathways, people with disability cannot participate in fitness activities independently.',
    resources: [],
  },
  '3.8-D-2': {
    actions: ['Publish walking distances, estimated times, terrain type, gradient information, and rest-point locations for all experiences and activity routes.', 'Use consistent, specific language (e.g., "400 m on sealed path, gentle slope, two bench seats along the route") rather than vague terms like "easy walk."', 'Include this information on your website, in booking confirmations, and at the activity start point.', 'Provide the information in accessible formats including large print and digital (screen-reader compatible).', 'Review and update physical demand information seasonally or whenever routes change.'],
    reasoning: 'Customers with mobility impairment, chronic fatigue, pain conditions, or respiratory conditions need to know physical demands in advance so they can plan energy use, bring aids, or choose an alternative. Surprises about distance or terrain can be dangerous.',
    resources: [],
  },
  '3.8-D-20': {
    actions: ['Ensure treatment rooms have a minimum 1540 mm diameter wheelchair turning space and a doorway width of at least 850 mm clear.', 'Provide a height-adjustable treatment bed or table that lowers to wheelchair-transfer height (approximately 450-500 mm).', 'Remove unnecessary furniture from accessible treatment rooms to maximise manoeuvring space.', 'Ensure the accessible path from the main entrance to the treatment room is continuous and step-free.', 'Train therapists and session facilitators on safe and respectful transfer assistance and to ask customers about their preferred approach.'],
    reasoning: 'Treatment and session spaces in spas, therapy rooms, consulting areas, and class studios must physically accommodate wheelchair users and people with mobility aids. If the room is too small or the furniture is immovable, the customer cannot receive the service.',
    resources: [],
  },
  '3.8-D-21': {
    actions: ['Develop a process for discussing and agreeing on modifications before a treatment or session begins, including positioning, pressure, duration, and equipment use.', 'Train practitioners to ask about physical needs, pain, and preferred positions without making assumptions.', 'Maintain a record of agreed modifications for returning customers (with consent) to avoid repeated explanations.', 'Offer alternatives when a standard treatment cannot be safely modified (e.g., a seated massage instead of a table massage).', 'Promote your willingness to modify treatments in your marketing and pre-visit information.'],
    reasoning: 'Not all bodies are the same, and rigid treatment protocols exclude people with different physical needs. Flexibility in how treatments and sessions are delivered demonstrates genuine inclusion and enables participation.',
    resources: [],
  },
  '3.8-D-22': {
    actions: ['Schedule audio-described performances for your main productions, aiming for at least one described performance per production run.', 'Engage a professional audio describer with experience in live performance description.', 'Provide audio description via personal receivers (headsets) so it does not affect other audience members.', 'Offer a pre-show touch tour or stage tour so audio description users can familiarise themselves with the set, props, and costumes.', 'Promote audio-described performances on your website, through vision-impairment organisations, and in accessible format promotional materials.'],
    reasoning: 'Audio description narrates the visual elements of a live performance (stage action, set, costumes, expressions) for people who are blind or have low vision. Without it, these audience members miss much of what makes a performance compelling.',
    resources: [],
  },
  '3.8-D-23': {
    actions: ['Schedule captioned performances for main productions, aiming for at least one captioned performance per run.', 'Use either open captions (displayed on a screen visible to all) or personal captioning devices, depending on your venue and audience preference.', 'Position caption displays where Deaf and hard of hearing audience members can see both the stage and the captions without excessive head turning.', 'Engage an accredited captioning provider and ensure they receive the script or lyrics in advance for accuracy.', 'Promote captioned performances through Deaf community organisations and accessible communication channels.'],
    reasoning: 'Live captioning or surtitles provide text access to spoken and sung content for people who are Deaf, hard of hearing, or who process text more effectively than audio. For theatrical performances and live events, this is the primary access method for many audience members.',
    resources: [],
  },
  '3.8-D-24': {
    actions: ['Offer relaxed or sensory-friendly sessions for your most popular experiences, with adjusted lighting (no strobes, reduced intensity), lower audio levels, and freedom for attendees to move, make noise, or leave and return.', 'Publish a visual story or social narrative for the event in advance so attendees know what to expect.', 'Designate a quiet room or calm-down space near the venue or activity area for attendees who need a break.', 'Train all staff working relaxed sessions in autism awareness, sensory needs, and non-judgmental communication.', 'Schedule relaxed sessions at accessible times (not only very early or very late) and promote them through autism and disability organisations.'],
    reasoning: 'Relaxed or sensory-friendly sessions modify the environment (reduced lighting, lower volume, freedom to move and vocalise) for people with autism, sensory processing differences, learning disability, or anxiety. They enable attendance by people who find standard sessions overwhelming.',
    resources: [],
  },
  '3.8-D-25': {
    actions: ['Install a hearing loop or equivalent assistive listening system (FM or infrared) in all performance and event spaces, as required by AS 1428.5 and the Premises Standards.', 'Ensure the system covers all designated hearing-augmented seating areas and meets IEC 60118-4 field-strength standards.', 'Display the international hearing loop symbol at the venue entrance, box office, and within the auditorium.', 'Test the hearing augmentation system before every performance and log the results.', 'Provide portable receivers for patrons who do not have telecoil-equipped hearing aids.'],
    reasoning: 'Hearing augmentation in performance and event spaces is mandatory under the Premises Standards where the space is used for amplified speech or music. Without it, audience members with hearing aids or cochlear implants cannot access the audio content clearly.',
    resources: [],
  },
  '3.8-D-26': {
    actions: ['Establish and communicate a clear policy that customers with dietary needs may bring their own food and drinks into your venue.', 'Train staff to respond positively and without judgment when customers explain they need to bring their own food.', 'Ensure the policy is visible on your website, in booking confirmations, and at the venue entrance.', 'Provide a designated area where customers can eat their own food comfortably if they prefer not to eat at the main dining area.', 'Review any existing "no outside food" policy and amend it to include a disability and dietary needs exception.'],
    reasoning: 'People with specific dietary needs (allergies, intolerances, cultural requirements, medical conditions, or sensory-based food restrictions) may not be able to eat anything on a standard menu. Allowing customers to bring their own food is a simple, low-cost accommodation.',
    resources: [],
  },
  '3.8-D-27': {
    actions: ['Train kitchen staff to accommodate requests for food modifications: not touching, specific textures (pureed, soft, diced), served in a particular order, or at a specific temperature.', 'Include a note on your menu or ordering system inviting customers to discuss dietary or sensory needs with staff.', 'Develop a simple communication process between front-of-house and kitchen for conveying modification requests accurately.', 'Avoid charging extra for simple modifications that use the same ingredients.', 'Consider offering a "build your own" or customisable menu option that naturally accommodates sensory preferences.'],
    reasoning: 'Some people have sensory needs related to food texture, temperature, or presentation. Foods touching each other, unexpected textures, or unfamiliar presentations can be distressing and prevent eating. Modifying preparation is a reasonable adjustment.',
    resources: [],
  },
  '3.8-D-28': {
    actions: ['Stock a supply of divided or segmented plates in your kitchen and make them available on request.', 'Include a note on your menu or service information that divided plates are available.', 'Train serving staff to offer divided plates without requiring customers to explain why they need them.', 'Source plates that are visually appropriate for adults, not children-themed, to maintain dignity.', 'Ensure divided plates are durable, dishwasher safe, and available in sufficient quantity for peak service.'],
    reasoning: 'Divided or segmented plates help people who need foods kept separate due to sensory processing differences, autism-related food preferences, or swallowing difficulties. It is a small, inexpensive provision that significantly improves the dining experience for some customers.',
    resources: [],
  },
  '3.8-D-29': {
    actions: ['Install accessible paths or boardwalks on the most popular routes through natural areas, with a minimum width of 1200 mm (1800 mm preferred for passing) and a firm, even surface.', 'Ensure boardwalk surfaces are non-slip, well-maintained, and free of trip hazards (gaps no wider than 13 mm, flush transitions).', 'Provide edge protection (kerbs or rails) on elevated boardwalks for wheelchair users and people with vision impairment.', 'Include rest points with accessible seating at regular intervals (maximum 60 m) along the accessible path.', 'Communicate the accessible path route, surface type, and gradient on your website and at the trailhead.'],
    reasoning: 'Natural areas without accessible paths exclude wheelchair users and people with mobility impairments from experiencing the environment. Boardwalks and accessible paths provide a way to access nature while protecting both the visitor and the ecosystem. This is a safety-related item.',
    resources: [],
  },
  '3.8-D-3': {
    actions: ['Provide wheelchair spaces that meet AS 1428.1:2021 minimum dimensions (800 mm wide x 1300 mm deep for a forward-facing space).', 'Distribute wheelchair spaces across different price categories and viewing locations rather than clustering them in one area, consistent with the Disability Discrimination Act 1992 principle of equitable access.', 'Ensure wheelchair spaces are on an accessible path of travel from the entrance, accessible toilets, and concessions.', 'Mark wheelchair spaces clearly on seating maps and make them bookable through the same channels as standard seats.', 'Provide a minimum number of wheelchair spaces proportional to total seating capacity (e.g., 1% of total capacity or a minimum of 6, whichever is greater, as a best-practice benchmark).'],
    reasoning: 'Designated wheelchair spaces in spectator and audience seating are a mandatory requirement under the Premises Standards (referencing AS 1428.1). Without them, wheelchair users are excluded from events, performances, and spectator experiences.',
    resources: [],
  },
  '3.8-D-30': {
    actions: ['Provide beach wheelchairs (floating and sand-capable models) available for free loan, with a simple booking or walk-up process.', 'Install mobi-mats or firm-surface pathways from the accessible car park or drop-off point to the water edge.', 'Ensure beach access paths connect to accessible facilities including parking, toilets, showers, and shade areas.', 'Train lifeguards or beach staff in safe beach wheelchair use, water entry assistance, and communicating with people with disability.', 'Promote beach accessibility features on your website, at the beach entrance, and through local tourism and disability organisations.'],
    reasoning: 'Beaches are inherently inaccessible for wheelchair users due to sand, slopes, and water entry barriers. Beach wheelchairs, mobi-mats, and constructed access points transform an impossible experience into a possible one.',
    resources: [],
  },
  '3.8-D-31': {
    actions: ['Include transfer platforms, ramps, and ground-level play elements so children using wheelchairs or mobility aids can access play equipment.', 'Install accessible swings (supportive-seat swings, platform swings) and ensure at least one of every play type has an accessible option.', 'Use accessible surfacing (rubber softfall, synthetic turf) that allows wheelchair movement and meets Australian fall-height safety standards (AS 4685).', 'Provide accessible pathways connecting all play zones, the accessible car park, toilets, and seating areas.', 'Design sensory play elements (musical instruments, tactile panels, water play) alongside physical equipment to cater to a range of abilities.'],
    reasoning: 'Inclusive playgrounds allow children and adults with disability to play alongside peers, supporting social inclusion, physical development, and family participation. Standard playgrounds with only ladder or step access exclude many children.',
    resources: [],
  },
  '3.8-D-32': {
    actions: ['Provide at least one accessible camping site per campground with a firm, level surface (compacted gravel or concrete pad), close to accessible toilets and showers.', 'Offer glamping or cabin options with step-free entry, accessible bathroom, and sufficient internal circulation space for a wheelchair.', 'Ensure pathways between the accessible campsite and all shared facilities (amenities block, camp kitchen, water tap) are firm, stable, and well-lit.', 'Provide accessible picnic tables (with wheelchair knee clearance) and fire pits or BBQs at an accessible height at the campsite.', 'List accessible camping options on your website with specific details (surface, slope, proximity to facilities, photos) so people can assess suitability before booking.'],
    reasoning: 'Accessible camping or glamping options give people with disability the opportunity to experience the outdoors and travel to remote areas. Without them, camping is effectively unavailable to many people.',
    resources: [],
  },
  '3.8-D-33': {
    actions: ['Ensure at least one lookout or viewing platform per site is accessible via a step-free path with a gradient no steeper than 1:14 (AS 1428.1).', 'Install guard rails at an appropriate height and with a design that allows views from a seated position (e.g., transparent or open lower panels).', 'Provide accessible seating and shade at the lookout, with space for a wheelchair alongside.', 'Position interpretive signage and viewing aids (binoculars, telescopes) at heights usable from a seated position (approximately 1000-1200 mm).', 'Include the accessibility status of each lookout in your trail guide and website information.'],
    reasoning: 'Lookouts and viewing platforms are often the highlight of an outdoor experience. If they are inaccessible, people with disability miss the most rewarding part of the visit. Accessible rest points along the route ensure people can reach them safely. This is a safety-related item.',
    resources: [],
  },
  '3.8-D-34': {
    actions: ['Adopt or adapt a trail grading system that includes accessibility-specific fields: surface type, average and maximum gradient, path width, step count, rest-point spacing, and hazard descriptions.', 'Publish trail accessibility information on your website, at the trailhead, and in trail guide materials in accessible formats.', 'Include photographs or video of key sections so users can assess conditions visually.', 'Review trail information after significant weather events, seasonal changes, or maintenance works.', 'Consult with people with disability (wheelchair users, blind walkers, people with chronic conditions) when developing accessibility ratings to ensure the information is genuinely useful.'],
    reasoning: 'Standard trail difficulty ratings (easy, moderate, hard) do not tell a person with disability whether they can do the trail. Accessibility-specific information (surface, gradient, width, obstacles, rest points) enables informed decisions and safe participation.',
    resources: [],
  },
  '3.8-D-4': {
    actions: ['Provide ambulant accessible seating (WCA, EAA, or Extra-Width seats) with step-free access, extra legroom, and aisle-adjacent positioning.', 'Locate ambulant seats near accessible entrances and exits so users do not need to traverse long distances or negotiate stairs.', 'Ensure seats have armrests for support when sitting and standing, or offer a mix of seats with and without armrests to cater to different needs.', 'Label ambulant accessible seats clearly on your seating map and make them specifically bookable.', 'Include ambulant accessible options across multiple price tiers, not just one location.'],
    reasoning: 'Ambulant accessible seating (also called Easy Access seating) serves people who can walk short distances but cannot navigate stairs or climb over other seats. This includes people using crutches, walking frames, prosthetic limbs, or those with joint conditions. It is required under the Premises Standards.',
    resources: [],
  },
  '3.8-D-5': {
    actions: ['Provide at least one companion seat directly adjacent to every wheelchair space, at the same level and with a clear sightline.', 'Ensure companion seats are the same type and quality as surrounding standard seats, not fold-out stools or inferior alternatives.', 'Allow companion seats to be booked at the same time and through the same booking system as wheelchair spaces.', 'Price companion seats equivalently to standard seats in that section; do not charge a premium.', 'For events with high demand, consider providing two companion seats per wheelchair space to accommodate varying support needs.'],
    reasoning: 'Wheelchair users almost always attend events with a companion. If companion seating is not adjacent, the wheelchair user is isolated from their support person, which affects safety, communication, and social participation. Companion seating is required under AS 1428.1.',
    resources: [],
  },
  '3.8-D-6': {
    actions: ['Position wheelchair spaces so that sightlines remain clear even when all surrounding audience members stand, typically by elevating the wheelchair platform or placing spaces at the front or on raised tiers.', 'Conduct a sightline assessment from the seated wheelchair position with surrounding seats occupied by standing adults.', 'Include sightline protection in any venue refurbishment or new-build design brief, referencing AS 1428.1 requirements.', 'Brief event staff to manage standing audiences so that wheelchair users\' sightlines are maintained, including reallocating spaces if needed.', 'Seek feedback from wheelchair users about sightline quality after events and adjust positioning accordingly.'],
    reasoning: 'If wheelchair spaces are positioned where standing audience members block the view, the wheelchair user effectively has no access to the performance or event. Sightline equity is a fundamental requirement of accessible seating design under AS 1428.1.',
    resources: [],
  },
  '3.8-D-7': {
    actions: ['Make accessible seating available through the same online, phone, and in-person booking channels as all other seats.', 'Release accessible seating at the same time as general tickets, not in a separate or delayed allocation.', 'Ensure your online booking system clearly identifies and allows selection of wheelchair, companion, and ambulant seats.', 'Test the booking flow with assistive technology (screen readers, keyboard-only navigation) to confirm it is fully accessible.', 'Provide a dedicated accessible booking support line or chat for customers who encounter barriers with the standard system.'],
    reasoning: 'If accessible seating can only be booked by phone, during limited hours, or after general sales, wheelchair users miss out on popular events and have less choice. Equitable booking access is a requirement under the Disability Discrimination Act 1992.',
    resources: [],
  },
  '3.8-D-8': {
    actions: ['Ensure a step-free, accessible path of travel connects the main entrance to every spectator area, including premium and VIP sections.', 'Where level changes are unavoidable, provide lifts or ramps compliant with AS 1428.1:2021 (ramp gradient max 1:14, minimum width 1000 mm, handrails both sides).', 'Include accessible toilets, concessions, and emergency exits within a reasonable travel distance from each spectator area.', 'Audit all spectator areas for wheelchair turning space (minimum 1540 mm diameter or 1600 mm x 2000 mm T-turn) and doorway width (minimum 850 mm clear).', 'Address any non-compliant areas in your capital works plan with a defined timeline.'],
    reasoning: 'If premium areas (corporate boxes, VIP lounges, members sections) lack step-free access, people with mobility disability are excluded from the highest-quality experience. This is a mandatory requirement under the Premises Standards and the Disability Discrimination Act 1992.',
    resources: [],
  },
  '3.8-D-9': {
    actions: ['Ensure all meeting rooms have step-free access via a doorway with a minimum 850 mm clear opening width (AS 1428.1:2021).', 'Provide wheelchair circulation space within the room (minimum 1540 mm turning circle) and ensure furniture layout does not obstruct movement.', 'Position accessible power outlets, data ports, and presentation controls at wheelchair-accessible heights (between 600 mm and 1100 mm from the floor).', 'Include at least one height-adjustable or accessible-height table in each room.', 'Verify that the accessible path from the building entrance to the meeting room is continuous, including lifts, corridors, and lobby areas.'],
    reasoning: 'Meeting and conference rooms that are not wheelchair accessible exclude delegates, presenters, and organisers with mobility disability. This creates barriers to professional participation and is likely to breach the Disability Discrimination Act 1992.',
    resources: [],
  },
  // Module 3.9
  '3.9-1-1': {
    actions: ['Create an inventory of all accommodation types (standard rooms, suites, apartments, cabins, camping, etc.).', 'Assess each type against AS 1428.1 and Premises Standards requirements for accessible accommodation.', 'Document current accessible features and gaps for each accommodation type.', 'Create a priority plan for adding accessible options across all room categories.'],
    reasoning: 'Different accommodation types present different accessibility challenges. A comprehensive inventory ensures no accommodation category is overlooked and guests with disabilities have genuine choice across your offerings.',
    resources: [],
  },
  '3.9-1-2': {
    actions: ['Measure clear floor space in accessible rooms, ensuring a minimum 1540mm turning circle or 1500mm x 2000mm rectangle clear of all furniture.', 'Rearrange or replace furniture that reduces wheelchair circulation space.', 'Ensure the path from the door to the bed, bathroom, and wardrobe maintains minimum 1000mm clear width.', 'Test the layout by navigating with a wheelchair to confirm adequate manoeuvring space.'],
    reasoning: 'Wheelchair users need sufficient room to enter, turn around, approach the bed, and access all room features. Rooms advertised as accessible but crammed with furniture are unusable and a source of complaint and distress.',
    resources: [],
  },
  '3.9-1-3': {
    actions: ['Audit accessible room bathrooms against AS 1428.1 Clause 15: hobless shower entry, grab rails, fold-down shower seat, accessible washbasin.', 'Install grab rails at correct heights and positions per AS 1428.1.', 'Ensure shower recess is at least 1160mm x 1100mm with a hobless (zero-threshold) entry.', 'Provide a securely mounted fold-down shower seat and hand-held shower head on an adjustable rail.', 'Test the emergency alarm cord reaches to within 100mm of the floor.'],
    reasoning: 'Bathroom accessibility is the most critical feature for guests with mobility impairments. An inaccessible bathroom means guests cannot shower, use the toilet, or maintain personal hygiene independently during their stay.',
    resources: [],
  },
  '3.9-1-4': {
    actions: ['Check that room entry doors have lever handles (not knobs) and a clear width of at least 850mm.', 'Ensure door closers allow sufficient time for a person with mobility impairment to pass through.', 'Verify that all in-room paths are clear of obstacles and all controls (lights, air conditioning, TV) are reachable from a seated position.', 'Test electronic key card systems for ease of use with one hand and limited grip strength.'],
    reasoning: 'Independent room access is essential for guest dignity and safety. If guests cannot enter their own room or navigate within it without assistance, they lose the independence that accommodation is meant to provide.',
    resources: [],
  },
  '3.9-1-5': {
    actions: ['Review your room inventory and confirm accessible rooms exist across standard, premium, and any other categories.', 'Ensure accessible rooms are not limited to the lowest-quality or least-desirable locations.', 'Price accessible rooms the same as equivalent standard rooms (no surcharge for accessibility).', 'Allow accessible rooms to be booked through the same channels as standard rooms.'],
    reasoning: 'Guests with disabilities deserve the same choice as anyone else. Limiting accessible rooms to one category forces guests to accept a room type they may not want or cannot afford, which is discriminatory under the DDA 1992.',
    resources: [],
  },
  '3.9-D-1': {
    actions: ['Set accessible room bed height to approximately 500-520 mm from the floor to the top of the mattress, matching standard wheelchair seat height for lateral transfer.', 'Ensure there is at least 800 mm clear space on the transfer side of the bed and at the foot for hoist access.', 'Use a bed base that allows a portable hoist to slide underneath (minimum 150 mm clearance from the floor).', 'Provide bed raisers or an adjustable-height bed frame so the height can be modified for individual guests on request.', 'Document bed height and hoist compatibility in your room accessibility information available at booking.'],
    reasoning: 'Bed height directly affects whether a wheelchair user can transfer independently or requires a hoist. A bed that is too high or too low creates a manual handling risk and removes independence from the guest.',
    resources: [],
  },
  '3.9-D-10': {
    actions: ['Install tactile room numbers with raised characters and Grade 2 Braille on the latch side of every accessible room door, per AS 1428.1:2021 Clause 8.', 'Ensure the sign centreline is between 1200 mm and 1600 mm from the floor, positioned consistently at every door.', 'Use high luminance contrast between the characters and the sign background, and between the sign and the wall (minimum 30% contrast per AS 1428.1).', 'Extend tactile and high-contrast numbering to all rooms and key locations (lifts, stairs, amenities) as best practice.', 'Inspect signs regularly and replace any that are damaged, faded, or have lost tactile definition.'],
    reasoning: 'Tactile and high-contrast room numbers enable guests who are blind or have low vision to independently identify their room. This is a mandatory requirement under AS 1428.1:2021 for signage in public buildings and accessible accommodation.',
    resources: [],
  },
  '3.9-D-11': {
    actions: ['Provide key guest information (room directory, safety procedures, check-out instructions, Wi-Fi details) in large print (minimum 16pt), high-contrast format within the accessible room.', 'Offer a digital version (QR code link to an accessible web page) that works with screen readers.', 'Produce Braille versions of the most critical documents (emergency procedures, contact numbers) and make them available on request.', 'Include Easy Read versions of safety and evacuation information with simple language and supporting images.', 'Update all accessible format versions whenever the standard version changes.'],
    reasoning: 'Room directories, safety cards, TV guides, and hotel information are provided to every guest in print. If they are not available in accessible formats, guests with vision, cognitive, or literacy barriers miss important information including emergency procedures.',
    resources: [],
  },
  '3.9-D-12': {
    actions: ['Add accessibility requirements fields to your online booking system, allowing guests to specify needs such as wheelchair access, visual alerts, hoist-compatible bed, shower chair, and hearing kit.', 'Train reservations staff to ask about accessibility needs as a standard part of the booking conversation.', 'Confirm accessibility arrangements in the booking confirmation email, with a contact for further discussion.', 'Maintain a register of available accessibility equipment (shower chairs, bed raisers, alert kits) and assign them to bookings before arrival.', 'Follow up with the guest 24-48 hours before arrival to confirm arrangements and address any additional needs.'],
    reasoning: 'If guests cannot specify their accessibility needs at the time of booking, they arrive to find a room that does not meet their requirements. This leads to a poor experience, potential safety issues, and often no viable alternative at short notice.',
    resources: [],
  },
  '3.9-D-13': {
    actions: ['Implement a booking system rule that holds accessible rooms for guests with disability until a defined period before arrival (e.g., 48-72 hours) before releasing them to general inventory.', 'Train reservations and front-desk staff to prioritise accessible rooms for guests who need them and to offer standard rooms as upgrades to other guests.', 'Track accessible room demand and turnaway data to build a business case for additional accessible room stock if needed.', 'Ensure accessible rooms are distributed across room types and price points, not limited to one category.', 'Review your accessible room ratio against the Premises Standards minimum and industry benchmarks (typically 1-5% of total rooms depending on jurisdiction).'],
    reasoning: 'Accessible rooms are a finite resource. Poor inventory management (such as selling accessible rooms to guests who do not need them when availability is limited) results in guests with disability being turned away. Effective management maximises availability.',
    resources: [],
  },
  '3.9-D-14': {
    actions: ['Audit all shared guest facilities (pool, spa, gym, laundry, breakfast room, business centre, lounge) for step-free access, doorway width, circulation space, and accessible amenities.', 'Provide pool or spa access via a hoist, ramp, or zero-depth entry, with an accessible change facility nearby.', 'Ensure laundry equipment has front-loading machines at accessible height with controls that are operable from a seated position.', 'Position breakfast buffet items and self-service equipment at accessible heights (between 600 mm and 1200 mm) with clear approach space.', 'Include the accessibility status of each shared facility in your room information and on your website.'],
    reasoning: 'A guest may have an accessible room but find the pool, gym, breakfast area, or laundry inaccessible. Shared facilities are used by all guests and must meet accessibility standards to provide an equitable stay experience.',
    resources: [],
  },
  '3.9-D-15': {
    actions: ['Install non-slip flooring throughout the accessible bathroom with a wet-pendulum slip resistance of P4 or higher (or R11 ramp test value) per HB 198.', 'Apply non-slip strips or coating inside the shower recess and bath (if present).', 'Provide even, shadow-free lighting at a minimum of 300 lux in the bathroom, with additional task lighting at the mirror and shower.', 'Ensure light switches are located outside the bathroom door and inside the room at an accessible height (900-1100 mm), so the guest does not enter a dark room.', 'Inspect non-slip surfaces regularly and re-treat or replace when effectiveness diminishes.'],
    reasoning: 'Bathroom falls are one of the most common injuries in accommodation settings. Non-slip surfaces and adequate lighting are basic safety measures that are especially critical for guests with mobility, balance, or vision impairments. This is mandatory under AS 1428.1.',
    resources: [],
  },
  '3.9-D-16': {
    actions: ['Locate accessible rooms on ground level or close to lifts, with the shortest possible travel distance to key shared facilities.', 'Ensure the path from accessible rooms to the nearest emergency exit is short, step-free, and clearly marked with tactile and visual indicators.', 'Position accessible rooms near the breakfast area, pool, and reception rather than in the most remote wing of the property.', 'Map and publish the walking distances from accessible rooms to key facilities on your website and in booking information.', 'Consider guest feedback when allocating accessible rooms and offer room moves if a closer option becomes available.'],
    reasoning: 'Accessible rooms located far from lifts, dining areas, or emergency exits force guests with mobility impairments to travel longer distances, increasing fatigue and reducing independence. Proximity matters for practical daily use and for emergency evacuation.',
    resources: [],
  },
  '3.9-D-17': {
    actions: ['Provide a bar fridge in accessible rooms that can store medication at the required temperature, with a thermometer available on request.', 'Ensure there are sufficient power outlets near the bedside for medical equipment such as CPAP machines, oxygen concentrators, or charging devices.', 'Offer additional bedside tables or clear surfaces for medical supplies if needed.', 'Train housekeeping staff to not unplug, move, or interfere with medical equipment during room servicing.', 'Include a question about medical storage needs in the booking accessibility requirements form so arrangements are made before arrival.'],
    reasoning: 'Guests with chronic conditions, diabetes, epilepsy, or other medical needs may require refrigerated medication storage, space for medical equipment (CPAP, nebuliser, dialysis), or a clean surface for medical procedures. Without these provisions, they cannot stay safely.',
    resources: [],
  },
  '3.9-D-2': {
    actions: ['Provide a minimum 1540 mm diameter turning circle in the bedroom clear of all furniture, per AS 1428.1.', 'Install wardrobe rails and shelves at accessible heights (between 600 mm and 1200 mm) with at least one low-hanging rail reachable from a seated position.', 'Ensure all light switches, power outlets, and climate controls are between 600 mm and 1100 mm from the floor and operable with one hand and minimal force.', 'Provide a clear, level path from the room door to the bed, bathroom, and wardrobe without requiring furniture rearrangement.', 'Include a visual or vibrating alarm connected to the fire alarm system in every accessible room.'],
    reasoning: 'Accessible bedroom features (such as clear floor space, accessible wardrobe, appropriate lighting, and reachable controls) determine whether a guest with disability can use the room independently. Missing features undermine the purpose of designating a room as accessible.',
    resources: [],
  },
  '3.9-D-3': {
    actions: ['Install visual fire alarms (flashing strobe lights) in the bedroom and bathroom of all accessible rooms, as required by the NCC and AS 1670.4.', 'Provide a vibrating alarm clock or pillow shaker that connects to the room alarm system for overnight alerting.', 'Install a visual doorbell or door-knock indicator (flashing light) visible from the bed and bathroom.', 'Offer a portable alerting kit (vibrating pager, flashing light unit) for rooms that do not have hardwired systems.', 'Test all alerting devices as part of your room turnover checklist to confirm they are functioning.'],
    reasoning: 'Deaf and hard of hearing guests cannot hear door knocks, phone rings, alarm clocks, or fire alarms without alerting devices. This is both an access and a safety issue. Alerting systems in accessible rooms are mandatory under the National Construction Code and AS 1428.1.',
    resources: [],
  },
  '3.9-D-4': {
    actions: ['Install an emergency call cord or button in the accessible bathroom, reachable from the floor (cord to extend to within 100 mm of the floor) and from the toilet and shower seat positions, per AS 1428.1:2021.', 'Connect the call system to a continuously monitored point (reception, duty manager, or nurse station) with a defined response procedure.', 'Ensure the alarm produces both an audible and visual alert at the monitoring location.', 'Test the system during every room service or turnover and log the results.', 'Train all staff in the response procedure, including how to enter the bathroom, communicate with the guest, and when to call emergency services.'],
    reasoning: 'Bathrooms are the most common location for falls and medical emergencies in accommodation. An emergency call system allows a guest who has fallen, become unwell, or is unable to get up to summon help. This is mandatory under AS 1428.1 and the Premises Standards.',
    resources: [],
  },
  '3.9-D-5': {
    actions: ['Install a tilting mirror or a full-length mirror in the accessible bathroom that is usable from a seated position, with the bottom edge no higher than 900 mm from the floor.', 'Alternatively, install the mirror at an angle or extending on an adjustable arm so both seated and standing guests can use it.', 'Ensure the mirror area is well-lit with even, non-glare lighting to support people with low vision.', 'Verify that the mirror does not obstruct grab rails or other bathroom fixtures.', 'Check mirror position and functionality as part of your accessible room audit.'],
    reasoning: 'A mirror mounted at standard height is useless for a person seated in a wheelchair. An accessible mirror supports grooming, hygiene, and personal care independently, which is fundamental to dignity during a stay.',
    resources: [],
  },
  '3.9-D-6': {
    actions: ['Set at least one section of kitchen counter at a maximum height of 850 mm with knee clearance underneath (minimum 700 mm high, 500 mm deep) for wheelchair approach.', 'Position the most-used appliances (kettle, microwave, toaster) on the accessible counter section within reach from a seated position.', 'Ensure sink taps are lever-operated or sensor-activated and the sink has knee clearance, with insulated pipes to prevent burns.', 'Install cupboard and drawer hardware that is operable with one hand and minimal force (D-pull handles recommended).', 'Provide an induction cooktop (if a stovetop is included) at accessible height with front-mounted controls.'],
    reasoning: 'Kitchenette counters and appliances at standard heights are unreachable for wheelchair users. If the room has a kitchenette, it must be usable or the guest loses the ability to prepare food and drinks independently.',
    resources: [],
  },
  '3.9-D-7': {
    actions: ['Label appliance controls with large-print, high-contrast, or tactile markings so guests with low vision can identify settings.', 'Provide contrasting-colour chopping boards, mugs, and utensils to assist guests with low vision.', 'Ensure at least one shelf of storage is between 600 mm and 1200 mm from the floor for reachable access.', 'Install task lighting under overhead cupboards or provide a portable task light for the food preparation area.', 'Include written or pictorial operating instructions for all appliances in large print and plain language.'],
    reasoning: 'Kitchenette accessibility goes beyond counter height. Features like tactile appliance controls, contrasting surfaces, and reachable storage determine whether a guest can safely and independently prepare meals.',
    resources: [],
  },
  '3.9-D-8': {
    actions: ['Provide a TV remote with large, tactile, high-contrast buttons, or ensure the TV is controllable via a voice-activated system or accessible app.', 'Install curtain or blind controls that are reachable from a seated position (electric or wand-operated at accessible height) rather than requiring reach above 1200 mm.', 'Position the room safe at a height between 600 mm and 1000 mm from the floor with a keypad or lever mechanism operable with one hand.', 'Ensure wardrobe storage includes an accessible iron and ironing board or a clothes steamer, positioned within reach.', 'Provide a clear written or pictorial guide to all in-room technology in large print and accessible digital format.'],
    reasoning: 'In-room amenities (TV remote, climate control, safe, iron, curtains) are used daily by every guest. If these are inaccessible, the guest must call for staff assistance for basic tasks, removing independence and privacy.',
    resources: [],
  },
  '3.9-D-9': {
    actions: ['Install the key card reader or lock at a height between 900 mm and 1100 mm from the floor, per AS 1428.1:2021.', 'Use a lever door handle rather than a knob, operable with one hand without tight grip, pinching, or wrist rotation.', 'Ensure the door opening force does not exceed 20 N for internal doors (AS 1428.1:2021) and that self-closing mechanisms allow adequate time to pass through.', 'Provide a minimum 850 mm clear door opening width with level or ramped threshold (maximum 5 mm step).', 'Offer an alternative key type (physical key, smartphone-based lock) for guests who cannot use a card reader.'],
    reasoning: 'If a guest cannot open their own room door due to key card reader height, handle type, door weight, or self-closing speed, they are dependent on staff for the most basic function. Door accessibility is mandatory under AS 1428.1 and the Premises Standards.',
    resources: [],
  },
  // Module 4.1
  '4.1-DD-10a': {
    actions: ['Log every alternative format request and fulfilment in your CRM, recording format type, turnaround time, and customer satisfaction.', 'Review logs quarterly to identify the most requested formats and pre-prepare common documents in those formats.', 'Ensure you can provide at minimum: large print (18pt+), plain language/Easy Read, audio (recorded or phone), email/digital, and Braille on request.', 'Set a service-level target (e.g., 5 business days) for alternative format delivery and track performance against it.'],
    reasoning: 'Tracking which alternative formats you have actually provided reveals whether your process works in practice or only exists on paper. It also helps forecast demand and budget.',
    resources: [],
  },
  '4.1-DD-11a': {
    actions: ['Audit your contact page against WCAG 2.2 Level AA: keyboard operability (2.1.1), form labels (1.3.1), error identification (3.3.1), focus visible (2.4.7), and target size (2.5.8).', 'Replace image-based CAPTCHAs with accessible alternatives such as honeypot fields, server-side validation, or Google reCAPTCHA v3 (invisible).', 'Test the contact page with at least one screen reader (NVDA or JAWS) and keyboard-only navigation.', 'Ensure the page works on mobile devices and meets reflow requirements at 320px width (WCAG 2.2 SC 1.4.10).', 'Include your NRS number and alternative contact methods directly on the contact page.'],
    reasoning: 'The contact page is often the first interaction point. If it contains inaccessible CAPTCHAs, missing labels, or broken keyboard navigation, customers with disabilities cannot even begin to reach you.',
    resources: [],
  },
  '4.1-DD-12a': {
    actions: ['Provide at least one non-phone after-hours contact option (email monitored overnight, SMS, or online chat).', 'If you use an after-hours answering service, ensure they are NRS-trained and can handle relay calls.', 'Clearly publish after-hours contact options on your website, voicemail message, and in-venue signage.', 'Include after-hours accessibility contact information in booking confirmations and pre-visit communications (DDA 1992 s 24).'],
    reasoning: 'Emergencies and urgent issues do not only occur during business hours. If after-hours contact is phone-only, Deaf customers or those with speech disabilities cannot access urgent support.',
    resources: [],
  },
  '4.1-DD-1a': {
    actions: ['Audit your current non-phone channels against customer needs: email, SMS/text, live chat, social media messaging, video call, in-person, and postal.', 'Ensure each promoted alternative is tested for accessibility with assistive technology (WCAG 2.2 Level AA compliance for digital channels).', 'Promote alternatives on all materials where a phone number appears, not on a hidden accessibility page.', 'Review channel usage data quarterly to identify which channels are actually being used and whether any are underperforming.'],
    reasoning: 'Knowing which alternatives you actively promote helps identify gaps. If you only offer email but not SMS or live chat, customers who struggle with email (e.g., people with low vision using small screens) still lack access.',
    resources: [],
  },
  '4.1-DD-1b': {
    actions: ['Display non-phone contact options at the same size and prominence as your phone number on your website header, footer, and contact page.', 'Include alternative contact methods in your Google Business listing and social media profiles.', 'Review printed materials (brochures, flyers, signage) to ensure non-phone options appear alongside the phone number.', 'Test with users to confirm the alternative channels are discoverable within two clicks or taps from the homepage (WCAG 2.2 SC 2.4.5, multiple ways).'],
    reasoning: 'If phone alternatives are buried in small print or a sub-page while the phone number is large and prominent, customers may not discover that accessible options exist. Equal visibility is essential.',
    resources: [],
  },
  '4.1-DD-2a': {
    actions: ['Train all front-line staff, not just reception, to handle NRS calls, including customer service, bookings, and complaints teams.', 'Include NRS training in standard onboarding so new staff are equipped from day one.', 'Maintain a quick-reference card near all phones summarising the NRS call flow: allow extra time, speak directly to the customer (not the relay officer), speak in short sentences.', 'Log NRS calls in your system to track volume and ensure staff are maintaining competence.'],
    reasoning: 'NRS training limited to one person creates a single point of failure. If that person is absent, Deaf customers or those with speech disabilities may be turned away.',
    resources: [],
  },
  '4.1-DD-3a': {
    actions: ['Map all systems that hold customer data (CRM, booking platform, email marketing tool, accounts software) and identify where a communication preferences field can be added.', 'Ensure preferences sync across systems or are stored in a central CRM that other systems reference.', 'Include format preferences (large print, Easy Read, audio, Braille, Auslan) and channel preferences (email, SMS, phone, post).', 'Document the data flow so staff know where to update preferences and where they will take effect (DDA 1992 s 24, reasonable adjustment to systems).'],
    reasoning: 'Communication preferences captured in one system but not accessible to other teams (e.g., marketing, accounts, events) means customers still receive inaccessible communications from parts of your organisation.',
    resources: [],
  },
  '4.1-DD-3b': {
    actions: ['Ensure communication preferences display prominently on the customer record screen, not buried in a secondary tab.', 'Configure pop-up alerts or flags in your CRM that notify staff of special communication needs when they open a customer record.', 'Train staff to check preferences before initiating contact, and to ask "Is this still the best way to reach you?" periodically.', 'Test the workflow end-to-end: create a test record with preferences and verify a staff member from each team can see and act on them.'],
    reasoning: 'Stored preferences are useless if staff cannot quickly access them at the point of contact. The customer should never need to re-explain their needs.',
    resources: [],
  },
  '4.1-DD-5a': {
    actions: ['Source or develop training that specifically covers speech disabilities: dysarthria, apraxia, stuttering, voice disorders, and the use of AAC devices.', 'Include practical role-play scenarios where staff practise listening to different speech patterns and confirming understanding.', 'Teach active listening techniques: maintain eye contact, do not pretend to understand, ask the customer to repeat or rephrase without embarrassment.', 'Refresh training annually and include feedback from people with speech disabilities on staff performance (DDA 1992 s 5).'],
    reasoning: 'Generic disability awareness training may not cover communication with people who have speech differences. Specific training builds confidence and reduces the risk of staff avoiding or rushing these interactions.',
    resources: [],
  },
  '4.1-DD-6a': {
    actions: ['Provide a basic picture communication board at your main service counter, covering common interactions (greetings, common requests, yes/no, numbers, directions).', 'Keep pen and paper or a whiteboard readily accessible at all service points for written communication.', 'Consider a tablet with a free AAC app (e.g., Proloquo2Go trial, Google Lookout) available for customer use.', 'Train staff on when and how to offer these resources without making assumptions about who needs them.'],
    reasoning: 'Having AAC resources on hand (communication boards, pen and paper, tablet with communication app) means staff can facilitate communication even when the customer does not have their own device.',
    resources: [],
  },
  '4.1-DD-8a': {
    actions: ['Make written confirmation the default for all substantive interactions (bookings, complaints, service agreements), with an opt-out rather than opt-in approach.', 'Send confirmations in the customer\'s preferred format, defaulting to email with a plain-text option.', 'Use plain language in all confirmations: short sentences, clear headings, and a summary of next steps (WCAG 2.2 SC 3.1.5, reading level).', 'Review confirmation templates annually for accessibility: proper heading structure, adequate colour contrast, and screen reader compatibility.'],
    reasoning: 'If written confirmation is only provided on request, customers who do not know to ask (or who find it difficult to ask) miss out. Standard practice ensures equitable service.',
    resources: [],
  },
  '4.1-DD-9a': {
    actions: ['Offer feedback through at least four channels: in-person, phone/NRS, email, online form, and postal mail.', 'Ensure each digital feedback channel meets WCAG 2.2 Level AA, including form validation (3.3.1, 3.3.3) and keyboard navigation (2.1.1).', 'Display feedback options prominently in-venue (at service counters, on receipts) and online (footer link, post-transaction page).', 'Accept verbal feedback and have staff record it on the customer\'s behalf when needed (DDA 1992 s 24, reasonable adjustment).'],
    reasoning: 'Understanding which feedback channels are available reveals whether any customer groups are excluded. If the only option is an online form, digitally excluded customers cannot provide feedback.',
    resources: [],
  },
  '4.1-PC-1': {
    actions: ['Offer at least three non-phone contact methods: email, live chat, SMS, and an accessible online contact form (DDA 1992 s 24, indirect discrimination).', 'Ensure the online contact form meets WCAG 2.2 Level AA, including keyboard operability (2.1.1), visible focus (2.4.7), and proper labels (1.3.1).', 'Display non-phone contact options with equal prominence to the phone number on your website and printed materials.', 'Register with the National Relay Service (NRS) and display your NRS number alongside your standard phone number.', 'Test each contact channel with assistive technology (screen reader, voice control) at least annually.'],
    reasoning: 'Many people with disabilities cannot use voice telephone, including Deaf people, people with speech disabilities, and people with anxiety disorders. Providing alternatives is a core obligation under the DDA 1992 to ensure equivalent access to services.',
    resources: [],
  },
  '4.1-PC-10': {
    actions: ['Establish a process for producing responses in alternative formats: large print (minimum 18pt), audio recording, Easy Read, Braille, or Auslan video.', 'Record format preferences in your CRM so that future correspondence automatically uses the right format (DDA 1992 s 24).', 'Set a reasonable turnaround target for alternative format responses (e.g., within 5 business days of the standard response).', 'Budget for alternative format production costs as part of your accessibility allocation, not as an ad-hoc expense.'],
    reasoning: 'Responding in a customer\'s preferred format (e.g., large print, audio, Easy Read, Auslan video) is a reasonable adjustment under the DDA 1992. Failing to do so means the response may be inaccessible.',
    resources: [],
  },
  '4.1-PC-2': {
    actions: ['Provide NRS awareness training to all customer-facing staff and reception teams, covering TTY, Speak and Listen, SMS Relay, and internet relay call types.', 'Display NRS call identification tips near all phones so staff recognise incoming relay calls and do not treat them as spam or hang up.', 'Include NRS training in new staff induction programs and refresh annually (DDA 1992 s 5, direct discrimination for refusing to take relay calls).', 'Add the NRS number (133 677) and relay instructions to your website contact page, email signatures, and printed materials.', 'Conduct a test NRS call at least once per year to verify your team handles it correctly.'],
    reasoning: 'The National Relay Service enables people who are Deaf, hard of hearing, or who have a speech disability to make and receive phone calls. Staff who do not understand NRS calls may hang up, effectively denying service.',
    resources: [],
  },
  '4.1-PC-3': {
    actions: ['Add a "communication preferences" field to your CRM or customer database, covering preferred contact method, format needs (large print, Easy Read, audio), and language preferences.', 'Ask about communication preferences at the first point of contact, not just when a problem arises, and record them systematically.', 'Ensure preferences are accessible to all staff who may contact the customer, not locked in one team or system (DDA 1992 s 24, reasonable adjustment).', 'Review and confirm stored preferences with customers periodically (at least annually) to keep them current.'],
    reasoning: 'Capturing communication preferences (e.g., email only, large print, Auslan) prevents customers from having to repeat their needs at every interaction, reducing friction and demonstrating respect for their autonomy.',
    resources: [],
  },
  '4.1-PC-4': {
    actions: ['Set equivalent service-level targets for all contact channels (e.g., if phone is answered within 2 minutes, aim for email response within 2 hours, not 5 business days).', 'Monitor response times across channels monthly and flag any disparity for management review (DDA 1992 s 24, indirect discrimination).', 'Assign adequate staff to non-phone channels so that workload does not create systemic delays for customers using accessible alternatives.', 'Publish expected response times for each channel on your website so customers can plan accordingly.'],
    reasoning: 'If email or chat enquiries receive slower responses than phone calls, customers who cannot use the phone are receiving a lesser standard of service. This creates indirect discrimination under the DDA 1992.',
    resources: [],
  },
  '4.1-PC-5': {
    actions: ['Train all customer-facing staff in patient communication techniques: allow extra time, do not finish sentences, confirm understanding by repeating back key points (DDA 1992 s 5, direct discrimination).', 'Include speech disability scenarios in role-play training exercises so staff practise real interactions.', 'Provide a protocol for longer calls: reassure the caller there is no rush, and avoid transferring them repeatedly.', 'Offer to follow up via email or text if a voice conversation is proving difficult, rather than abandoning the interaction.', 'Document these protocols in your customer service manual and review them during staff performance check-ins.'],
    reasoning: 'People with speech disabilities, strong accents, or who use AAC devices often face impatience or premature call termination. Staff patience and technique directly affect whether the person can access the service.',
    resources: [],
  },
  '4.1-PC-6': {
    actions: ['Provide staff training covering common AAC types: picture/symbol boards, speech-generating devices, text-to-speech apps, and partner-assisted scanning.', 'Instruct staff to always address the AAC user directly, not their companion or support person (DDA 1992 s 5, dignity and direct discrimination).', 'Allow extra time for AAC-mediated conversations without showing impatience or suggesting the customer come back later.', 'Keep a simple picture communication board at your service counter for basic interactions (yes/no, common requests).'],
    reasoning: 'AAC (Augmentative and Alternative Communication) devices range from picture boards to sophisticated speech-generating devices. Staff unfamiliarity can lead to ignoring the customer or speaking only to their companion, which is discriminatory.',
    resources: [],
  },
  '4.1-PC-7': {
    actions: ['Designate at least one quiet or low-stimulation area where staff can have private conversations with customers who need a calmer environment.', 'Ensure the quiet space is physically accessible (wheelchair accessible, no steps, adequate door width per AS 1428.1).', 'Train staff to proactively offer the quiet space when they notice a customer struggling with the noise or stimulation level.', 'Include signage indicating the availability of a quiet consultation area, using clear text and symbols.'],
    reasoning: 'Background noise and busy environments make communication extremely difficult for people with hearing loss, sensory processing differences, or anxiety. A quiet space removes a significant barrier to service access.',
    resources: [],
  },
  '4.1-PC-8': {
    actions: ['Offer written confirmation (email, letter, SMS) after any substantive phone or in-person conversation about services, bookings, or complaints.', 'Use plain language (aim for Year 6 reading level) in all written follow-ups to support people with cognitive or learning disabilities.', 'Ensure written confirmations are sent in the customer\'s preferred format (DDA 1992 s 24, reasonable adjustment).', 'Make written follow-up a standard practice for all customers, not just those who disclose a disability, to avoid singling people out.'],
    reasoning: 'Verbal conversations can be difficult to recall for people with cognitive disabilities, hearing loss, or processing differences. Written follow-up ensures important information is not lost and provides a reference.',
    resources: [],
  },
  '4.1-PC-9': {
    actions: ['Offer at least three complaint channels: online form, email, phone/NRS, and in-person or by post (DDA 1992 s 24, indirect discrimination).', 'Ensure your online complaint form meets WCAG 2.2 Level AA: proper form labels (1.3.1), error identification (3.3.1), error suggestion (3.3.3), and keyboard access (2.1.1).', 'Accept complaints made verbally and have staff document them on the customer\'s behalf if requested.', 'Publish your complaint channels prominently on your website and in-venue, and include the Australian Human Rights Commission as an escalation pathway.'],
    reasoning: 'If complaints can only be lodged through an online form, customers who cannot use digital technology, or whose disability prevents form completion, are excluded from the complaints process. This undermines accountability.',
    resources: [],
  },
  // Module 4.2
  '4.2-D-10': {
    actions: ['Train staff in Deaf communication etiquette: face the customer, maintain eye contact, speak clearly at a normal pace, do not shout or exaggerate mouth movements.', 'Provide written communication options (pen and paper, tablet) at all service points for immediate use.', 'Learn and use basic Auslan greetings (hello, thank you, how can I help) to build rapport.', 'Know how to book an Auslan interpreter for planned interactions and have the booking process documented.', 'Ensure hearing loop systems are working and that staff know how to direct customers to them.'],
    reasoning: 'Deaf and hard of hearing customers face significant communication barriers. Staff who default to shouting or exaggerated lip movements create frustration rather than understanding.',
    resources: [],
  },
  '4.2-D-11': {
    actions: ['Keep pen and paper at every customer service point, register, and reception desk.', 'Train staff to proactively offer written communication when verbal communication is difficult, without waiting to be asked.', 'Consider also providing a whiteboard or digital tablet for longer written exchanges.', 'Ensure writing instruments have good contrast (black pen on white paper) for customers with low vision.'],
    reasoning: 'Pen and paper is the simplest and most universally understood communication aid. Its absence forces reliance on verbal communication, excluding people who are Deaf, hard of hearing, or who have speech disabilities.',
    resources: [],
  },
  '4.2-D-12': {
    actions: ['Train staff to allow extra time without displaying impatience: do not rush, do not complete the customer\'s sentences, and be prepared to repeat or rephrase information.', 'Use plain language and short sentences when communicating, and confirm understanding by asking the customer to repeat back key points.', 'Offer written summaries of important information for the customer to take away and review later.', 'Provide visual aids (pictures, diagrams, maps) to supplement verbal explanations where possible.'],
    reasoning: 'Customers with cognitive disabilities, intellectual disabilities, or acquired brain injuries may need extra processing time, simplified language, or repeated information. Rushing them creates an exclusionary experience.',
    resources: [],
  },
  '4.2-D-13': {
    actions: ['Designate a quiet, low-stimulation space with dim lighting, minimal noise, and comfortable seating, away from high-traffic areas.', 'Ensure the space is physically accessible (wheelchair accessible, no steps, clear floor space) per AS 1428.1.', 'Train staff to offer the quiet space proactively and without judgment when a customer appears distressed or overwhelmed.', 'Include the quiet space location on your accessibility information page and in pre-visit materials.'],
    reasoning: 'Sensory overload, anxiety attacks, and meltdowns can occur for people with autism, PTSD, anxiety disorders, or sensory processing differences. A quiet retreat space can prevent escalation and allow recovery.',
    resources: [],
  },
  '4.2-D-14': {
    actions: ['Develop a customer service accessibility policy covering: communication, assistance animals, reasonable adjustments, complaints, and staff training requirements.', 'Reference the DDA 1992, Disability Standards for Accessible Public Transport (if applicable), and WCAG 2.2 in the policy.', 'Make the policy available to all staff and include it in onboarding materials.', 'Review and update the policy annually, incorporating feedback from customers with disabilities.', 'Publish a customer-facing summary of the policy on your website and in-venue.'],
    reasoning: 'A documented policy sets expectations, ensures consistency across all staff and shifts, and provides evidence that the organisation takes its obligations seriously under the DDA 1992.',
    resources: [],
  },
  '4.2-D-15': {
    actions: ['Include disability awareness and accessibility training in mandatory onboarding, completed within the first two weeks of employment.', 'Cover at minimum: legal obligations (DDA 1992), respectful language, assistance animals, communication strategies, and location of accessible facilities.', 'Ensure onboarding materials themselves are accessible (captioned videos, readable documents, not relying solely on audio).', 'Track onboarding completion rates and ensure 100% of new staff complete accessibility training before serving customers independently.'],
    reasoning: 'If accessibility training only happens as an optional add-on months after starting, new staff may serve customers with disabilities without any preparation, risking discrimination and poor experiences.',
    resources: [],
  },
  '4.2-D-16': {
    actions: ['Train all staff in accessible emergency evacuation procedures, including Personal Emergency Evacuation Plans (PEEPs) and the use of evacuation chairs (DDA 1992 s 24; AS 1428.1 refuge area requirements).', 'Ensure staff know the locations of refuge areas, evacuation equipment, and accessible exits.', 'Include disability scenarios in every evacuation drill: a person in a wheelchair, a Deaf person, a person with vision loss, a person with cognitive disability.', 'Designate specific staff as evacuation wardens with additional training on assisting people with disabilities.', 'Review and update emergency procedures after each drill, incorporating lessons learned.'],
    reasoning: 'During an emergency, people with disabilities face the highest risk if staff do not know how to assist. This includes people who cannot hear alarms, cannot use stairs, or become disoriented in emergencies.',
    resources: [],
  },
  '4.2-D-17': {
    actions: ['Create an inventory of all accessibility equipment available on-site: hearing loops, portable ramps, wheelchairs, shower chairs, magnifiers, TTY phones, communication boards.', 'Include equipment locations and operating instructions in staff training and display a reference list in staff areas.', 'Assign responsibility for checking that equipment is working and charged (e.g., hearing loop batteries) at the start of each shift.', 'Train staff to proactively mention available equipment to customers who may benefit, rather than waiting to be asked.'],
    reasoning: 'Staff cannot direct customers to equipment they do not know exists. Awareness of hearing loops, portable ramps, wheelchairs for loan, and magnifiers enables staff to proactively offer support.',
    resources: [],
  },
  '4.2-D-18': {
    actions: ['Identify and provide equipment relevant to your venue type: loan wheelchairs, hearing loop receivers, portable induction loops, magnifying glasses, large-print menus, sensory kits.', 'Maintain equipment in good working order with regular cleaning and functionality checks.', 'Advertise available equipment on your website, booking confirmations, and in-venue signage so customers know what is available.', 'Allow advance booking of equipment (especially wheelchairs) to guarantee availability (DDA 1992 s 24, reasonable adjustment).'],
    reasoning: 'Assistive technology and equipment for loan (wheelchairs, hearing loop receivers, magnifiers) can transform a visit from impossible to enjoyable. Not offering them means relying entirely on customers bringing their own.',
    resources: [],
  },
  '4.2-D-18b': {
    actions: ['Establish a relationship with at least one Auslan interpreting service and know the booking process, lead times, and costs.', 'Budget for Auslan interpretation as a standard accessibility cost, not an exceptional expense.', 'For planned events or appointments, offer to arrange Auslan interpretation when the customer indicates they are Deaf or use Auslan.', 'For unplanned interactions, have a protocol: use written communication, and offer to reschedule with an interpreter if needed.', 'Consider Video Remote Interpreting (VRI) services for immediate access to Auslan interpreters via video call.'],
    reasoning: 'Auslan interpretation is essential for Deaf customers in situations requiring detailed communication: medical consultations, legal matters, complaints, or complex service interactions.',
    resources: [],
  },
  '4.2-D-19': {
    actions: ['Accept the Companion Card, which provides free entry for the companion of a person with disability who requires attendant care support.', 'Train staff to welcome support people warmly and offer them seating, refreshments, and inclusion in the experience alongside the customer.', 'Always address the customer with disability directly, not through their support person, unless the customer indicates otherwise (DDA 1992 s 5, dignity).', 'Ensure your pricing and ticketing clearly state companion/carer policies so customers know what to expect before arriving.'],
    reasoning: 'Carers, support workers, and companions play a vital role for many people with disabilities. If they are charged entry, denied seating, or treated as an afterthought, the customer with disability is effectively penalised.',
    resources: [],
  },
  '4.2-D-20': {
    actions: ['Establish a documented process for producing information in alternative formats: large print (18pt minimum), Easy Read, audio, Braille, and digital (accessible PDF or HTML).', 'Set a turnaround target for alternative format requests (e.g., 5 business days) and communicate this to customers.', 'Pre-prepare your most commonly requested documents (menus, safety information, maps, T&Cs) in at least large print and digital formats.', 'Train staff to offer alternative formats proactively rather than waiting for a request (DDA 1992 s 24, reasonable adjustment).'],
    reasoning: 'Providing information only in standard print excludes people with vision loss, cognitive disabilities, or low literacy. A process for alternative formats ensures everyone can access the information they need.',
    resources: [],
  },
  '4.2-D-21': {
    actions: ['Document a policy that explicitly permits assistance animals (not limited to dogs) in all areas open to the public, consistent with DDA 1992 s 9.', 'Include in the policy: what staff may ask, what they may not ask, how to respond to other customers who complain, and where the animal relief area is.', 'Distribute the policy to all staff and include it in onboarding training.', 'Display a "Service animals welcome" sign at your entrance.', 'Review the policy against each state and territory\'s assistance animal laws, as requirements vary.'],
    reasoning: 'A documented assistance animal policy prevents ad-hoc decisions that may be discriminatory. It ensures every staff member applies the same rules, protecting both the customer and the organisation.',
    resources: [],
  },
  '4.2-D-22': {
    actions: ['Train staff to explain that assistance animals are permitted by law (DDA 1992 s 9) and that removal is not an option.', 'Prepare a scripted response: "This is an assistance animal and is legally permitted to be here. I understand your concern, and I can offer you an alternative [table/seat/area] if you would prefer."', 'Document the protocol for managing competing needs (e.g., severe allergy vs. assistance animal) and escalate to a manager if needed.', 'Never ask the assistance animal handler to move to accommodate the complainant; offer the complainant an alternative instead (DDA 1992 s 9).'],
    reasoning: 'Other customers sometimes complain about assistance animals due to allergies, phobias, or misunderstanding. Staff need a clear response that upholds the law while being empathetic to both parties.',
    resources: [],
  },
  '4.2-D-23': {
    actions: ['Offer priority access or queue alternatives for customers who cannot stand for extended periods or who experience significant distress from waiting (DDA 1992 s 24).', 'Communicate expected wait times clearly and update customers if times change, using visual displays and verbal announcements.', 'Allow customers to wait seated and be called when it is their turn, rather than requiring standing in a queue.', 'Train staff to recognise when a customer may need priority service without requiring them to explain or justify their disability.'],
    reasoning: 'Rigid queuing and service processes can be a significant barrier. Priority access for people who cannot stand for long periods, and clear wait time communication for people with anxiety, are reasonable adjustments.',
    resources: [],
  },
  '4.2-D-25': {
    actions: ['Identify all points where your standard service may be inaccessible and develop alternatives: table service instead of self-service, delivery to a seated area, phone ordering, kerb-side pickup.', 'Ensure alternatives provide an equivalent experience in quality, timeliness, and dignity, not a lesser version of the service (DDA 1992 s 24).', 'Train staff to offer alternatives proactively and without requiring the customer to explain why they need them.', 'Advertise available service alternatives on your website and in-venue so customers can plan ahead.'],
    reasoning: 'When standard service delivery is inaccessible (e.g., upstairs restaurant, self-service only), alternative delivery ensures the customer still receives an equivalent service rather than being turned away.',
    resources: [],
  },
  '4.2-D-26': {
    actions: ['Train staff to make general offers of assistance to all customers (e.g., "Can I help you with anything today?") to avoid singling out people with visible disabilities.', 'Teach staff to read cues: a customer looking around for signage, struggling with a door, or appearing uncertain, and to offer help naturally.', 'Ensure offers are genuine and followed through, not performative. If a customer declines, respect their decision without further insistence.', 'Include proactive service in your customer service standards and recognise staff who demonstrate it well.'],
    reasoning: 'Many people with disabilities will not ask for help due to past negative experiences, embarrassment, or not knowing what assistance is available. Proactive offers remove this barrier.',
    resources: [],
  },
  '4.2-D-27': {
    actions: ['Provide a structured process for customers to give feedback on staff interactions, including positive feedback and complaints.', 'Offer multiple feedback channels: in-person, phone/NRS, email, online form, and comment cards (DDA 1992 s 24, accessible process).', 'Review interaction feedback monthly, identify patterns, and use findings to inform training priorities.', 'Close the loop with customers who provide feedback by acknowledging receipt and describing any action taken.'],
    reasoning: 'Feedback on staff interactions reveals whether training is translating into practice. Without it, organisations cannot identify staff who need additional support or recognise those who excel.',
    resources: [],
  },
  '4.2-D-28': {
    actions: ['Include intersectionality in disability awareness training, covering cultural considerations, gender diversity, age-related needs, and trauma-informed practice.', 'Train staff to avoid assumptions about a person\'s needs based on one characteristic (e.g., do not assume all Deaf people can lip-read, or all wheelchair users need help).', 'Provide materials in community languages where your customer base warrants it, in addition to English Easy Read.', 'Seek diverse representation on any advisory panels or co-design groups, not just people from one demographic.'],
    reasoning: 'Disability does not exist in isolation. A person may be Aboriginal, from a CALD background, LGBTQIA+, elderly, or have experienced trauma. Intersectionality affects how they experience your service and what support they need.',
    resources: [],
  },
  '4.2-D-31': {
    actions: ['Offer options for different service levels, such as a "just browsing" badge or a "happy to chat" indicator, so customers can signal their preference without verbal explanation.', 'Train staff to respect a customer\'s chosen service level and check in periodically without being intrusive.', 'Consider implementing low-sensory or "quiet hours" where reduced interaction is the default for all customers.', 'Include service level preferences in your pre-arrival information so customers can indicate their needs in advance.'],
    reasoning: 'Some customers with social anxiety, autism, or energy-limiting conditions prefer minimal interaction, while others benefit from more attentive service. Flexible service levels respect individual preferences.',
    resources: [],
  },
  '4.2-D-32': {
    actions: ['Establish a paid advisory panel or regular consultation sessions with people with diverse disabilities to review customer service practices.', 'Include people with disabilities in service design, testing, and review processes, not just as an afterthought.', 'Compensate participants fairly for their time and expertise (DDA 1992 principle of equitable participation).', 'Act on co-design findings and report back to participants on what changes were made and why (closing the feedback loop).'],
    reasoning: 'Services designed without input from people with disabilities often miss the mark. Co-design ensures that real barriers are addressed and that solutions work in practice, not just in theory.',
    resources: [],
  },
  '4.2-D-33': {
    actions: ['Provide a private area or step-aside option where customers can discuss their accessibility needs away from other customers and general foot traffic.', 'Train staff to offer a private conversation proactively when a customer begins discussing access needs at a public counter.', 'Enable pre-arrival disclosure (online form, email, phone) so customers can communicate needs without doing so in a public setting.', 'Ensure digital channels for disclosing access needs are secure and that data is stored in compliance with the Privacy Act 1988.'],
    reasoning: 'Discussing access needs at a public counter forces customers to disclose their disability in front of other people. This violates their privacy and may deter them from requesting the adjustments they need.',
    resources: [],
  },
  '4.2-D-9': {
    actions: ['Train staff to offer assistance by asking "Can I help you with anything?" and then following the customer\'s lead, rather than assuming what help is needed.', 'Teach the principle: always ask before touching a person, their wheelchair, or their equipment (DDA 1992 s 5, dignity).', 'Include examples of patronising behaviour in training (speaking to a companion instead of the customer, using childlike language, excessive praise for routine activities).', 'Use role-play scenarios so staff can practise appropriate assistance and receive feedback.'],
    reasoning: 'Over-helping (grabbing a wheelchair without asking, speaking loudly to a person with vision loss) undermines autonomy and dignity. Under-helping (ignoring someone) denies service. The balance requires training.',
    resources: [],
  },
  '4.2-F-1': {
    actions: ['Provide disability awareness and inclusion training to all staff, not just front-line roles, covering the social model of disability, respectful language, and practical scenarios (DDA 1992 s 5, s 24).', 'Source training delivered or co-designed by people with lived experience of disability for authenticity and impact.', 'Ensure training covers the full spectrum of disability: physical, sensory, cognitive, psychosocial, and invisible/episodic disabilities.', 'Schedule refresher training at least annually and include disability inclusion in new staff onboarding within the first month.', 'Document training completion in HR records and set a target of 100% staff completion.'],
    reasoning: 'Disability awareness training is the foundation of inclusive customer service. Without it, staff may rely on assumptions, use inappropriate language, or inadvertently discriminate.',
    resources: [],
  },
  '4.2-F-2': {
    actions: ['Train all staff to recognise and welcome assistance animals, understanding that not all are dogs and not all wear vests (DDA 1992 s 9, Disability Standards).', 'Develop a clear policy that assistance animals are permitted in all public areas, including food service areas, and communicate this to all staff.', 'Train staff on what they can and cannot ask: they may ask whether the animal is an assistance animal required for disability, but cannot demand documentation in most states.', 'Ensure water bowls and a relief area are available for assistance animals.', 'Display signage welcoming assistance animals at your entrance.'],
    reasoning: 'Under Australian law (DDA 1992 s 9), assistance animals must be allowed in all areas open to the public. Refusing entry to an assistance animal is direct discrimination and can result in complaints to the AHRC.',
    resources: [],
  },
  '4.2-F-3': {
    actions: ['Assess staff confidence through anonymous surveys before and after training to measure improvement and identify gaps.', 'Provide practical scenario-based training covering common situations: guiding a person with vision loss, communicating with a Deaf customer, assisting a wheelchair user.', 'Create a supportive environment where staff can ask questions without judgment, and designate accessibility champions in each team.', 'Share positive customer feedback about inclusive service to reinforce good practice.'],
    reasoning: 'Staff confidence directly affects service quality. Unconfident staff may avoid customers with disabilities, over-help in patronising ways, or freeze and provide no assistance at all.',
    resources: [],
  },
  '4.2-F-4': {
    actions: ['Provide a clear process for pre-arrival assistance requests through your website, booking system, and phone/email channels.', 'Ensure the request process is itself accessible: keyboard navigable, screen reader compatible, and available via non-digital channels (phone, NRS, email).', 'Assign responsibility for reviewing and actioning pre-arrival requests to a specific role or team, with backup coverage.', 'Confirm receipt of requests and outline what the customer can expect on arrival (DDA 1992 s 24, reasonable adjustment).'],
    reasoning: 'Allowing customers to communicate their needs before arrival means staff can prepare, reducing stress for both the customer and the team. It prevents on-the-spot scrambling that leads to poor experiences.',
    resources: [],
  },
  '4.2-F-5': {
    actions: ['Train staff in multiple communication strategies: clear speech (facing the customer, not covering mouth), written notes, gesture and pointing, visual aids, and basic Auslan greetings.', 'Provide communication tools at service points: pen and paper, picture boards, a tablet with communication apps.', 'Teach staff to ask "How would you like me to communicate with you?" rather than assuming (DDA 1992 s 5, dignity).', 'Include communication strategy training in onboarding and refresh annually with new scenarios.'],
    reasoning: 'A single communication approach will not work for everyone. Staff need a toolkit of strategies covering visual, verbal, written, and gestural communication to serve all customers effectively.',
    resources: [],
  },
  '4.2-F-6': {
    actions: ['Create an accessible facilities map for staff reference, listing locations of accessible toilets, lifts, hearing loops, quiet spaces, wheelchair charging, and accessible parking.', 'Include this information in staff induction and display it in staff areas.', 'Update the map whenever facilities change and ensure all staff are notified of updates.', 'Train staff to accompany or guide customers to facilities when asked, rather than just pointing (DDA 1992 s 24).'],
    reasoning: 'Customers frequently ask staff for directions to accessible toilets, lifts, parking, quiet spaces, and other facilities. If staff do not know, the customer is left to search independently, which may be impossible.',
    resources: [],
  },
  '4.2-F-7': {
    actions: ['Document a formal process for handling accessibility complaints, including receipt, investigation, response, and resolution timeframes.', 'Ensure the complaints process itself is accessible through multiple channels (DDA 1992 s 24).', 'Assign a named person or role responsible for accessibility complaints with authority to authorise reasonable adjustments.', 'Log all accessibility complaints and review them quarterly to identify systemic issues.', 'Inform complainants of their right to escalate to the Australian Human Rights Commission if unsatisfied.'],
    reasoning: 'Without a clear complaints process, accessibility issues are handled inconsistently, repeat problems are not identified, and the organisation cannot demonstrate it takes reasonable steps to prevent discrimination.',
    resources: [],
  },
  // Module 4.3
  '4.3-1-1': {
    actions: ['Review your booking modification process and ensure it is available online, by phone, and in person.', 'Remove penalties or surcharges for disability-related booking changes.', 'Train booking staff to handle modification requests efficiently and with understanding.', 'Clearly communicate the modification process in booking confirmations and on your website.'],
    reasoning: 'People with fluctuating conditions (chronic pain, mental health conditions, episodic disabilities) often cannot predict their capacity. Inflexible booking systems penalise them for their disability, which may constitute indirect discrimination under the DDA 1992.',
    resources: [],
  },
  '4.3-1-2': {
    actions: ['Measure the height and approach space of all payment terminals.', 'Reposition terminals to 800-1100mm height with clear wheelchair approach space (minimum 800mm wide, 1200mm deep).', 'Ensure the screen is angled for both standing and seated users.', 'Check that PIN entry is shielded for privacy regardless of user height.'],
    reasoning: 'Wheelchair users, short-statured people, and those who cannot stand need to reach and see the payment terminal. An unreachable terminal forces them to share their PIN or rely on others to complete their transaction.',
    resources: [],
  },
  '4.3-1-3': {
    actions: ['Ensure at least one portable or wireless payment terminal is available at each service area.', 'Train staff to proactively offer to bring the terminal to customers rather than waiting to be asked.', 'Include table-side payment in your service procedures for all customers, not just those who request it.', 'Test that wireless terminals maintain connection throughout the service area.'],
    reasoning: 'Fixed terminals positioned on high counters or behind barriers exclude wheelchair users and people who cannot stand at the counter. Portable terminals provide equal, dignified payment access.',
    resources: [],
  },
  '4.3-1-4': {
    actions: ['Create a formal flexible cancellation policy for disability-related changes, documented in your terms and conditions.', 'Specify that no proof of disability is required beyond a reasonable statement from the customer.', 'Train all booking and customer service staff on the policy and its compassionate application.', 'Communicate the policy on your website, in booking confirmations, and at point of sale.'],
    reasoning: 'Health crises, carer cancellations, and symptom flare-ups are common realities for people with disability. Rigid cancellation policies financially penalise people for circumstances beyond their control and discourage future bookings.',
    resources: [],
  },
  '4.3-D-1': {
    actions: ['Audit your online booking system against WCAG 2.2 Level AA, focusing on keyboard navigation (2.1.1), form labels (1.3.1), error handling (3.3.1, 3.3.3), and colour contrast (1.4.3).', 'Test the booking flow end-to-end with a screen reader (NVDA or JAWS) and keyboard-only navigation.', 'Ensure the booking system works on mobile devices and meets reflow requirements at 320px viewport width (WCAG 2.2 SC 1.4.10).', 'If using a third-party booking platform, request their VPAT/accessibility conformance report and include accessibility requirements in your procurement contract.', 'Provide a phone/NRS and email booking alternative for customers who cannot use the online system (DDA 1992 s 24).'],
    reasoning: 'An inaccessible online booking system means customers with disabilities must find an alternative way to book or simply cannot access the service. This is indirect discrimination under the DDA 1992.',
    resources: [],
  },
  '4.3-D-10': {
    actions: ['Display concession information prominently on your website, at your entrance, and in your booking system alongside standard pricing.', 'Use plain language to describe eligibility, and list accepted forms of ID or proof clearly.', 'Train staff to mention concessions proactively when they apply, rather than waiting for the customer to ask.', 'Review concession uptake data quarterly to assess whether eligible customers are finding and using them.'],
    reasoning: 'Concessions that are not clearly communicated go unused. Complex eligibility rules or hidden discounts mean the people who need them most may never find out they exist.',
    resources: [],
  },
  '4.3-D-11': {
    actions: ['Ensure at least one payment terminal is at a height accessible from a wheelchair (850mm-1000mm above floor level, per AS 1428.1 reach ranges).', 'Offer contactless/tap payment as an alternative to PIN entry for customers with motor disabilities.', 'Provide staff-assisted payment where a customer holds their card to the terminal operated by staff, with privacy safeguards (DDA 1992 s 24).', 'Test payment processes with customers using mobility aids and those with limited hand function.'],
    reasoning: 'If the only payment terminal is at a counter height inaccessible from a wheelchair, or requires PIN entry that a person with motor disability cannot manage, the customer is denied equal access to payment.',
    resources: [],
  },
  '4.3-D-12': {
    actions: ['Select terminals with tactile buttons or raised markings for key functions, or ensure tap-to-pay is available as a fully tactile alternative.', 'Ensure the terminal screen has adequate contrast and font size for customers with low vision.', 'Position terminals so they can be reached from a seated position (wheelchair, mobility scooter) per AS 1428.1.', 'Offer audio confirmation of the transaction amount for customers who cannot see the screen.', 'Train staff to read the amount aloud before the customer taps or enters their PIN.'],
    reasoning: 'EFTPOS terminals with flat touchscreens, no audio feedback, and poor contrast are inaccessible to people with vision loss and many people with motor disabilities. Terminal choice is a critical access point.',
    resources: [],
  },
  '4.3-D-13': {
    actions: ['Provide receipts in accessible digital formats (email, SMS, or accessible PDF) as an alternative to printed-only receipts.', 'Ensure digital receipts use proper heading structure, adequate font size, and sufficient colour contrast (WCAG 2.2 SC 1.4.3).', 'Offer large-print receipts on request and train staff to provide them.', 'Ensure invoices are not sent as image-only PDFs; use tagged, accessible PDFs with proper reading order.'],
    reasoning: 'Inaccessible receipts and invoices mean customers with disabilities cannot verify charges, claim expenses, or resolve billing disputes. This affects financial autonomy.',
    resources: [],
  },
  '4.3-D-14': {
    actions: ['Ensure at least one kiosk is at a height accessible from a wheelchair (screen centre no higher than 1200mm, controls within reach range per AS 1428.1).', 'Provide screen reader compatibility or audio output with a headphone jack for customers with vision loss.', 'Ensure touchscreen targets are large enough (minimum 44x44px equivalent) and high contrast for low vision users (WCAG 2.2 SC 2.5.8).', 'Offer an accessible alternative (staff-assisted service, phone ordering) for customers who cannot use the kiosk.', 'Test kiosks with users who have different disabilities before deployment.'],
    reasoning: 'Self-service kiosks are increasingly common for check-in, ordering, and payment. If they are inaccessible, customers with disabilities are forced to find a staff member or go without the service.',
    resources: [],
  },
  '4.3-D-15': {
    actions: ['Ensure digital queue displays use large, high-contrast text and are positioned at a height visible from a seated position.', 'Provide audio announcements or vibrating pager alternatives so customers who cannot see the display know when it is their turn.', 'If using an app-based queue, ensure the app meets WCAG 2.2 Level AA and works with screen readers.', 'Offer a staff-assisted queuing alternative for customers who cannot use the digital system (DDA 1992 s 24, reasonable adjustment).'],
    reasoning: 'Digital queuing systems (take-a-number, app-based queues) often rely on visual-only displays or inaccessible apps, excluding people with vision loss, Deaf people, and those without smartphones.',
    resources: [],
  },
  '4.3-D-16': {
    actions: ['Ensure at least one self-checkout is at an accessible height (screen and scanner reachable from a seated wheelchair position, per AS 1428.1).', 'Adjust weight tolerance settings on accessible checkouts to accommodate wheelchair trays, mobility aid bags, and assistive devices in the bagging area.', 'Provide audio feedback options for customers with vision loss (headphone jack or speaker option for transaction prompts).', 'Offer staff-assisted checkout as an equivalent alternative, available at all times self-checkout is open.', 'Test accessible self-checkout with wheelchair users, people with vision loss, and people with limited hand function.'],
    reasoning: 'Self-checkout machines often have inaccessible screen heights, no audio feedback, strict weight tolerances that reject wheelchair trays, and small bagging areas. These barriers exclude many customers with disabilities.',
    resources: [],
  },
  '4.3-D-2': {
    actions: ['Add a clearly labelled accessibility requirements field to your booking process, using an open text field so customers can describe needs in their own words.', 'Position the field prominently in the booking flow, not hidden in optional extras or fine print.', 'Ensure the field is available on all booking paths (online, phone, in-person, third-party platforms).', 'Establish a process for reviewing and actioning accessibility requirements before the customer\'s visit (DDA 1992 s 24, reasonable adjustment).'],
    reasoning: 'If customers cannot indicate their accessibility requirements during booking, the organisation cannot prepare. This leads to on-the-day scrambling, unmet needs, and a poor customer experience.',
    resources: [],
  },
  '4.3-D-3': {
    actions: ['Register as a Companion Card affiliate in your state/territory if you charge admission or entry fees.', 'Train all ticketing and front-of-house staff to recognise the Companion Card and process free companion entry.', 'Display the Companion Card logo at your entrance and on your website to signal acceptance.', 'Include Companion Card information in your pricing page and booking flow so cardholders know before arriving.'],
    reasoning: 'The Companion Card is an Australian scheme ensuring that people who require attendant care support can participate in community activities without paying for their companion\'s entry. Not recognising it creates a financial barrier.',
    resources: [],
  },
  '4.3-D-4': {
    actions: ['Offer concession pricing for people with disability, carers, and Centrelink concession card holders.', 'Ensure concession eligibility criteria are clearly stated and do not require intrusive documentation.', 'Accept a range of proof: Disability Support Pension card, NDIS participant letter, state concession card, Companion Card.', 'Communicate concession availability prominently on your website, at your entrance, and in booking systems (DDA 1992 s 24).'],
    reasoning: 'People with disabilities face higher costs of living (equipment, support, transport). Concession pricing acknowledges this and removes a financial barrier to participation.',
    resources: [],
  },
  '4.3-D-5': {
    actions: ['Accept multiple payment methods: contactless/tap, chip and PIN, cash, EFTPOS, and online payment.', 'Ensure at least one payment method does not require fine motor skills (e.g., contactless tap).', 'If you accept online payment, ensure the payment page meets WCAG 2.2 Level AA (keyboard operable, labelled fields, error handling).', 'Offer assisted payment for customers who need help (e.g., holding a card to the terminal) with appropriate privacy safeguards.'],
    reasoning: 'Limited payment methods can exclude people with disabilities. For example, cash-only excludes people with motor disabilities who cannot handle coins; card-only excludes people without bank accounts.',
    resources: [],
  },
  '4.3-D-6': {
    actions: ['Provide booking confirmations and receipts in accessible digital formats (HTML email or accessible PDF with proper heading structure, alt text, and adequate contrast).', 'Offer alternative format confirmations on request: large print, plain text, or audio summary.', 'Ensure automated confirmation emails are tested with screen readers and meet WCAG 2.2 Level AA (1.3.1, 1.4.3, 2.4.2).', 'Include all essential information (date, time, location, accessibility arrangements) in the confirmation body text, not just in an attached PDF.'],
    reasoning: 'Inaccessible confirmations and receipts mean customers with disabilities cannot verify their booking or transaction, manage their records, or resolve disputes. This is a service gap.',
    resources: [],
  },
  '4.3-D-7': {
    actions: ['Enable advance booking of accessible spaces, seating, equipment, and services through your standard booking system.', 'Clearly display accessible options in the booking interface alongside standard options, not on a separate page or process.', 'Hold a reasonable allocation of accessible spaces and do not release them to general sale until close to the event/date.', 'Confirm accessible bookings with specific details about what has been arranged (DDA 1992 s 24, reasonable adjustment).'],
    reasoning: 'If accessible spaces or equipment (wheelchair spots, hearing loop seats, accessible rooms) cannot be booked in advance, customers with disabilities face uncertainty about whether they can participate.',
    resources: [],
  },
  '4.3-D-8': {
    actions: ['Provide at least three ways to request additional assistance: in the booking form, by phone/NRS, by email, and in-person on arrival.', 'Ensure each request channel has a clear process for logging and actioning the request before the customer\'s visit.', 'Train staff to respond to assistance requests with specific commitments ("We will have someone meet you at the entrance") rather than vague assurances.', 'Follow up with the customer to confirm arrangements and ask if anything else is needed.'],
    reasoning: 'Customers may need to request assistance beyond standard accessibility features (e.g., a guide to their seat, help with luggage, a specific table). Multiple request channels ensure nobody is excluded.',
    resources: [],
  },
  '4.3-D-9': {
    actions: ['Publish pricing information on your website in accessible HTML (not image-only), with proper heading structure and adequate colour contrast (WCAG 2.2 SC 1.4.3).', 'Provide large-print pricing at your venue (minimum 18pt, high contrast).', 'Make pricing available verbally (staff can read it out) and in digital format that works with screen readers.', 'Include accessibility-related pricing (concessions, Companion Card, accessible upgrades) alongside standard pricing.'],
    reasoning: 'If pricing information is only available in small print on a wall-mounted board or in an image-based PDF, customers with vision loss or cognitive disabilities cannot access it independently.',
    resources: [],
  },
  // Module 4.4
  '4.4-1-1': {
    actions: ['Review your current emergency management plan and identify gaps for people with mobility, sensory, cognitive, and psychosocial disabilities.', 'Add specific procedures for each disability type: wheelchair evacuation, guiding blind people, alerting Deaf people, supporting people with cognitive confusion or panic.', 'Include Personal Emergency Evacuation Plans (PEEPs) as a standard procedure for visitors and staff who need them.', 'Conduct an evacuation drill that includes disability scenarios and document lessons learned.', 'Review and update the plan annually and after any building or layout changes.'],
    reasoning: 'Standard evacuation plans assume everyone can hear alarms, see exit signs, walk down stairs, and process instructions quickly. Without disability-specific procedures, people with disabilities are at serious risk during emergencies.',
    resources: [],
  },
  '4.4-1-2': {
    actions: ['Audit every emergency exit for step-free access, door width (minimum 850mm per AS 1428.1), and clear approach path.', 'Identify at least one fully accessible emergency exit on each level and sign it clearly with the International Symbol of Access.', 'Ensure accessible exits are not blocked by furniture, stock, or locked doors.', 'Include accessible exit routes in your fire safety plan and on evacuation maps.'],
    reasoning: 'Wheelchair users and people with mobility aids cannot use stairs during emergencies. If no accessible exit exists, they are trapped. This is both a safety risk and a legal obligation under fire safety regulations and the DDA 1992.',
    resources: [],
  },
  '4.4-1-3': {
    actions: ['Audit alarm coverage: ensure audible alarms are present in all areas including toilets and quiet spaces.', 'Install visual strobe alarms alongside audible alarms in all areas, per AS 1670.4.', 'Test both alarm types regularly (weekly for functionality, annually for full evacuation).', 'Ensure alarm volume is sufficient in noisy areas and that visual strobes are visible from all positions in each room.'],
    reasoning: 'Deaf and hard of hearing people cannot hear audible-only alarms and may remain in danger unaware of an emergency. Visual alarms are also critical for people wearing noise-cancelling headphones or working in loud environments.',
    resources: [],
  },
  '4.4-1-4': {
    actions: ['Develop a disability-inclusive evacuation training module covering: wheelchair users (evacuation chairs, carry techniques), blind and low vision (sighted guide technique), Deaf (visual signals, written instructions), cognitive and psychosocial (clear, calm instructions, reassurance).', 'Train all staff including casuals, contractors, and volunteers.', 'Run practical evacuation drills at least annually that include disability scenarios.', 'Maintain a training register and ensure new staff are trained within their first week.', 'Debrief after each drill and update procedures based on lessons learned.'],
    reasoning: 'Staff who have never practised assisting people with disabilities during evacuation will be unprepared in a real emergency, putting lives at risk. Regular training builds confidence and competence that saves lives.',
    resources: [],
  },
  '4.4-D-1': {
    actions: ['Develop a PEEP template that covers mobility, sensory, cognitive, and psychosocial needs, and assign a trained staff member to complete PEEPs with individuals who need them.', 'Offer PEEPs to all staff and regular visitors with disabilities, and make them available to customers on request or through pre-arrival information.', 'Review PEEPs at least annually and whenever the building layout, the individual\'s needs, or emergency procedures change.', 'Store PEEPs where emergency wardens can access them immediately during an evacuation (DDA 1992 s 24; Work Health and Safety Act 2011).', 'Practise PEEP procedures during evacuation drills to ensure they work in practice.'],
    reasoning: 'Personal Emergency Evacuation Plans (PEEPs) are a legal requirement under workplace health and safety legislation and a DDA 1992 obligation. Without them, people with disabilities are at disproportionate risk during emergencies.',
    resources: [],
  },
  '4.4-D-10': {
    actions: ['Establish a protocol for communicating the presence and location of visitors with disabilities to arriving emergency services (fire brigade, ambulance, police).', 'Maintain a live or shift-based register of known disability needs on-site (from PEEPs, pre-arrival requests, and check-in data) that can be handed to emergency services.', 'Designate a specific person (e.g., chief warden) responsible for briefing emergency services on disability-related information.', 'Practise the handover process during evacuation drills to ensure it works under pressure (DDA 1992 s 24; WHS Act 2011).'],
    reasoning: 'When emergency services arrive, they need to know if anyone on-site has specific needs (wheelchair user on level 3, Deaf person in refuge area). Without this information, rescue efforts may miss people.',
    resources: [],
  },
  '4.4-D-2': {
    actions: ['Identify and clearly mark designated refuge areas on each floor that has stairs-only egress, in accordance with the National Construction Code and AS 1428.1.', 'Ensure refuge areas have two-way communication (intercom or phone) to the building fire control room or emergency services.', 'Mark refuge areas on evacuation maps and include their locations in all emergency signage using tactile and Braille indicators.', 'Train all emergency wardens on the refuge area protocol: who goes there, how to communicate with them, and how to coordinate their assisted evacuation.', 'Test communication equipment in refuge areas during every evacuation drill.'],
    reasoning: 'Refuge areas (also called areas of rescue assistance) allow people who cannot use stairs to wait safely for assisted evacuation. Without them, wheelchair users and others are trapped in a building during a fire.',
    resources: [],
  },
  '4.4-D-3': {
    actions: ['Provide appropriate evacuation equipment (evacuation chairs, carry chairs, or evacuation mattresses) on every floor with stairs-only egress.', 'Train sufficient staff on each floor to operate the equipment safely, and ensure coverage across all shifts and days.', 'Conduct hands-on practice with the equipment during evacuation drills, including with a weighted mannequin or volunteer (DDA 1992 s 24; WHS Act 2011).', 'Maintain equipment regularly and record inspections, ensuring it is stored in marked, unlocked, accessible locations.'],
    reasoning: 'Evacuation chairs, carry chairs, and evacuation mats enable safe stairway descent for people who cannot walk. Without equipment, staff may attempt unsafe manual carries or simply leave people behind.',
    resources: [],
  },
  '4.4-D-4': {
    actions: ['Install visual emergency alerts (flashing strobe lights) in all public areas, toilets, and any areas where a Deaf person may be alone, in accordance with AS 1670.4.', 'Consider vibrating pager or wristband alert systems for venues where Deaf visitors are common.', 'Train staff to personally alert any Deaf customers they are aware of during an emergency, using visual signals or written notes.', 'Include Deaf communication protocols in your emergency plan and practise them during drills (DDA 1992 s 24).', 'Ensure emergency public address announcements are supplemented by visual message boards or digital signage.'],
    reasoning: 'Standard audible fire alarms are useless for Deaf and hard of hearing people. Without visual or tactile alert systems, these individuals may not know an emergency is occurring until it is too late.',
    resources: [],
  },
  '4.4-D-5': {
    actions: ['Provide emergency procedures in multiple formats: large print with high contrast, Braille, tactile evacuation maps, pictograms/Easy Read, and digital/audio versions.', 'Ensure evacuation maps include tactile elements and are mounted at a height accessible from a wheelchair (AS 1428.1 reach ranges).', 'Display procedures in common community languages where appropriate for your customer base.', 'Include accessible emergency information in pre-arrival materials and on your website (DDA 1992 s 24).', 'Review all emergency signage annually for legibility, accuracy, and compliance with AS 1428.1 signage requirements.'],
    reasoning: 'Emergency procedures displayed only in standard print text exclude people with vision loss, cognitive disabilities, and those who do not read English. Accessible formats are essential for safety.',
    resources: [],
  },
  '4.4-D-6': {
    actions: ['Train staff in trauma-informed emergency support: use calm, simple language, give one instruction at a time, offer physical grounding techniques if appropriate.', 'Identify that some people may freeze rather than flee and train emergency wardens to check all areas, including quiet spaces and toilets.', 'Create a simple visual emergency instruction card that can be shown to someone in distress (pictograms, arrows to exit).', 'Include cognitive and psychosocial disability scenarios in evacuation drills.', 'Consider sensory aspects of alarms (volume, pitch, flashing) and how they may affect people with sensory sensitivities.'],
    reasoning: 'People with anxiety disorders, PTSD, autism, or cognitive disabilities may become frozen, panicked, or disoriented during emergencies. Without specific support strategies, they are at heightened risk.',
    resources: [],
  },
  '4.4-D-7': {
    actions: ['Include in your emergency plan that assistance animals remain with their handler during evacuation and are evacuated together (DDA 1992 s 9).', 'Train emergency wardens to recognise and accommodate assistance animals during evacuations.', 'Ensure refuge areas and assembly points can accommodate assistance animals.', 'Do not attempt to handle or move an assistance animal without the handler\'s direction.', 'Include assistance animal scenarios in evacuation drills.'],
    reasoning: 'Assistance animals must stay with their handler during an evacuation. Separating them causes distress to both the handler and the animal, and removes the handler\'s support system at a critical time.',
    resources: [],
  },
  '4.4-D-8': {
    actions: ['Conduct evacuation drills at least twice per year, with at least one drill per year explicitly including disability scenarios (DDA 1992 s 24; WHS Act 2011).', 'Rotate scenarios across drill cycles: wheelchair user on upper floor, Deaf visitor in bathroom, person with vision loss in unfamiliar area, person with cognitive disability who freezes.', 'Debrief after each drill, document lessons learned, and update procedures accordingly.', 'Include PEEPs in drill execution and test whether the plans work in practice.', 'Time the evacuation of people with disabilities to identify bottlenecks and improve response.'],
    reasoning: 'Evacuation drills that do not include disability scenarios give false confidence. When a real emergency occurs, staff discover they do not know how to assist people with disabilities, with potentially fatal consequences.',
    resources: [],
  },
  '4.4-D-9': {
    actions: ['Provide emergency orientation information to visitors with disabilities on arrival or check-in: nearest accessible exit, refuge area location, and how to summon help.', 'Include this information in pre-arrival communications for customers who have disclosed accessibility needs.', 'Display accessible emergency orientation signage at key decision points (entrances, lifts, reception) with tactile and high-contrast elements.', 'Train front-line staff to deliver a brief emergency orientation as part of their welcome for customers who may need it (DDA 1992 s 24).'],
    reasoning: 'A visitor with a disability who does not know where the nearest exit or refuge area is cannot self-evacuate effectively. Orientation on arrival is a critical safety measure.',
    resources: [],
  },
  // Module 4.5
  '4.5-D-1': {
    actions: ['Offer at least four feedback channels: in-person (staff or comment box), phone/NRS, email, online form, and postal mail.', 'Ensure each channel is promoted equally and none is treated as the "real" channel while others are afterthoughts.', 'Accept feedback in alternative formats: audio recordings, video messages, and dictated notes taken by staff on behalf of the customer.', 'Test each channel for accessibility annually (DDA 1992 s 24; WCAG 2.2 for digital channels).'],
    reasoning: 'Offering only one feedback channel (e.g., online form) excludes customers who cannot use that channel. Multiple options ensure everyone can share their experience.',
    resources: [],
  },
  '4.5-D-10': {
    actions: ['Participate in the Australian Network on Disability (AND) Access & Inclusion Index or similar industry benchmarking program.', 'Compare your accessibility performance against published standards: DDA 1992 obligations, WCAG 2.2 Level AA, AS 1428.1, and industry-specific best practice guides.', 'Review competitor or peer organisation accessibility pages, reviews, and public commitments to identify gaps in your own offering.', 'Set measurable accessibility KPIs informed by benchmarking data and track progress annually.'],
    reasoning: 'Benchmarking reveals how your organisation compares to peers and identifies areas where you are falling behind or leading. Without it, you operate in a vacuum with no external reference point.',
    resources: [],
  },
  '4.5-D-2': {
    actions: ['Develop response templates for common accessibility review themes (positive, negative, mixed) that are empathetic, specific, and action-oriented.', 'Respond within 48 hours to negative accessibility reviews, acknowledging the issue, apologising for the experience, and describing corrective action.', 'Avoid defensive language or excuses. If the barrier exists, own it and explain what you are doing to address it.', 'Use accessibility reviews in training as real-world case studies for staff development.'],
    reasoning: 'How you respond to accessibility reviews signals your organisational values. A defensive or dismissive response can cause reputational damage, while a thoughtful response builds trust.',
    resources: [],
  },
  '4.5-D-3': {
    actions: ['Categorise all accessibility feedback by type (physical access, communication, service, digital, sensory environment) and by location or service area.', 'Produce a quarterly summary identifying the top 3-5 recurring themes and their frequency.', 'Use pattern data to prioritise capital works, training investments, and policy changes.', 'Share pattern data with senior leadership and any disability advisory group to inform strategic planning.'],
    reasoning: 'Tracking individual complaints is not enough. Pattern analysis reveals systemic issues (e.g., the same door keeps being reported as too heavy, or multiple Deaf customers report poor hearing loop coverage).',
    resources: [],
  },
  '4.5-D-4': {
    actions: ['Set target response times for accessibility complaints that are at least equivalent to general complaint targets (e.g., acknowledge within 2 business days, resolve within 10 business days).', 'Track actual response times monthly and report any breaches to management.', 'Prioritise safety-related accessibility complaints (e.g., broken ramp, non-functioning fire alarm) for immediate action.', 'Communicate your complaint response timeframes on your website and in acknowledgement messages to complainants.'],
    reasoning: 'Without target response times, accessibility complaints may languish in a queue while other complaints are prioritised. This signals that accessibility is a lower priority.',
    resources: [],
  },
  '4.5-D-5': {
    actions: ['Notify customers who provided accessibility feedback when their issue has been resolved, describing the specific improvement made.', 'Publish accessibility improvements on your website, social media, and in newsletters (e.g., "You told us the hearing loop in Theatre 2 was not working. We have now installed a new system.").', 'Include accessibility improvement highlights in your annual report or DIAP progress report.', 'Thank customers for their feedback publicly (with their permission) to encourage others to speak up.'],
    reasoning: 'Customers who report barriers want to know their feedback made a difference. Communicating improvements closes the loop, builds trust, and encourages future feedback.',
    resources: [],
  },
  '4.5-D-6': {
    actions: ['Document an escalation process for serious accessibility complaints, including who has authority to approve immediate reasonable adjustments, issue refunds, or authorise emergency works.', 'Define what constitutes a "serious" complaint: any incident involving denied service, injury, assistance animal refusal, or systemic access barrier.', 'Ensure the escalation path reaches senior management and, for very serious matters, the Board or CEO.', 'Inform complainants of external escalation options: the Australian Human Rights Commission, state/territory anti-discrimination bodies, and the Disability Discrimination Commissioner.'],
    reasoning: 'Serious accessibility complaints (e.g., denied entry, assistance animal refusal, injury due to inaccessible facilities) require escalation beyond front-line staff. Without a clear path, they may be mishandled.',
    resources: [],
  },
  '4.5-D-7': {
    actions: ['Offer anonymous feedback options: physical comment box in-venue, anonymous online form (no login required), and anonymous survey links.', 'Do not require contact details as mandatory fields on feedback forms; make them optional for customers who want a response.', 'Clearly state that feedback can be provided anonymously and that there will be no negative consequences for providing it.', 'Review anonymous feedback alongside attributed feedback to ensure it receives equal weight in your improvement process.'],
    reasoning: 'Some customers fear negative consequences if they complain (e.g., being labelled as "difficult" or losing service). Anonymous feedback removes this barrier and captures honest input.',
    resources: [],
  },
  '4.5-D-8': {
    actions: ['Establish a formal disability advisory panel or regular co-design sessions with people who have diverse disabilities (physical, sensory, cognitive, psychosocial).', 'Compensate participants fairly for their time and expertise; do not rely on volunteers or treat it as a favour.', 'Include advisory panel input in major service changes, new builds, policy reviews, and technology procurement.', 'Report back to the panel on what recommendations were adopted and explain any that were not, closing the feedback loop.', 'Aim for a panel that reflects the diversity of your customer base, including Aboriginal and Torres Strait Islander people and people from CALD backgrounds.'],
    reasoning: 'Co-design with people with disabilities ensures that improvements address real barriers and that solutions work in practice. Without it, organisations risk investing in changes that miss the mark.',
    resources: [],
  },
  '4.5-D-9': {
    actions: ['Commission at least one accessibility audit or mystery visit by people with lived experience of disability annually.', 'Ensure auditors include people with diverse disabilities: wheelchair users, people with vision loss, Deaf people, people with cognitive disabilities.', 'Act on audit findings within documented timeframes and track progress against recommendations.', 'Consider the Australian Network on Disability (AND) Access & Inclusion Index or similar benchmarking tools.'],
    reasoning: 'Internal assessments have blind spots. Accessibility audits and mystery visits by people with lived experience reveal barriers that able-bodied staff or consultants may not notice.',
    resources: [],
  },
  '4.5-F-1': {
    actions: ['Create a specific accessibility feedback mechanism, either as a dedicated form or as a clearly labelled section within your general feedback process.', 'Ensure the feedback mechanism is accessible: keyboard navigable, screen reader compatible, available in multiple formats and channels (WCAG 2.2 Level AA; DDA 1992 s 24).', 'Promote the feedback mechanism on your website, in-venue, on receipts, and in post-visit communications.', 'Assign responsibility for monitoring and responding to accessibility feedback to a named person or role.'],
    reasoning: 'Without a dedicated mechanism for accessibility feedback, issues go unreported. General feedback channels may not prompt customers to share accessibility-specific concerns.',
    resources: [],
  },
  '4.5-F-2': {
    actions: ['Audit your surveys and feedback forms against WCAG 2.2 Level AA: keyboard access (2.1.1), form labels (1.3.1), error messages (3.3.1), colour contrast (1.4.3), and no CAPTCHA barriers.', 'Test forms with screen readers (NVDA, JAWS) and voice control software.', 'Offer alternative feedback methods (phone/NRS, email, in-person, postal) for customers who cannot use digital forms.', 'Keep surveys short and in plain language to reduce cognitive load and improve completion rates.'],
    reasoning: 'If your survey or feedback form is itself inaccessible (e.g., image-based CAPTCHA, no keyboard navigation, poor contrast), you are excluding the very people whose feedback you need most.',
    resources: [],
  },
  '4.5-F-3': {
    actions: ['Monitor online review platforms weekly for accessibility-related mentions (keywords: wheelchair, accessible, disability, Deaf, blind, hearing loop, ramp, elevator).', 'Respond to accessibility reviews promptly, thanking the reviewer and describing any actions taken or planned.', 'Log accessibility-related reviews in your feedback tracking system alongside formal complaints to identify patterns.', 'Use positive accessibility reviews in staff recognition and marketing (with permission) to reinforce good practice.'],
    reasoning: 'Online reviews on Google, TripAdvisor, and social media are a major source of unsolicited accessibility feedback. Ignoring them means missing both problems and opportunities.',
    resources: [],
  },
  '4.5-F-4': {
    actions: ['Schedule quarterly reviews of all accessibility feedback (formal complaints, survey responses, online reviews, verbal reports).', 'Identify recurring themes and prioritise actions based on impact, frequency, and legal risk (DDA 1992 s 24, reasonable adjustment obligation).', 'Assign each action to a responsible person with a target completion date.', 'Report back to the organisation on actions taken, including to senior leadership and any disability advisory panel.'],
    reasoning: 'Collecting feedback without acting on it erodes trust. Customers who took the time to report a barrier expect it to be addressed. Regular review ensures feedback drives improvement.',
    resources: [],
  },
  // Module 4.6
  '4.6-D-1': {
    actions: ['Offer SMS or text-based communication as an alternative to email for appointment reminders, booking confirmations, and important updates.', 'Keep SMS messages concise and in plain language, with a clear call to action.', 'Ensure customers can opt into SMS as their primary communication channel through your preference settings.', 'Comply with Australian spam laws (Spam Act 2003) by obtaining consent and including opt-out instructions in every SMS.'],
    reasoning: 'Email is not accessible for everyone. Customers with cognitive disabilities, low digital literacy, or who use basic mobile phones may rely on SMS. Offering alternatives ensures broader reach.',
    resources: [],
  },
  '4.6-D-10': {
    actions: ['Caption all video content, including marketing videos, tutorials, social media clips, and live streams (WCAG 2.2 SC 1.2.2 for pre-recorded, 1.2.4 for live).', 'Use human-edited captions rather than auto-generated only; auto-captions are a starting point but typically have 10-15% error rates.', 'Provide audio description for video content where visual information is essential to understanding (WCAG 2.2 SC 1.2.5).', 'Include a transcript for all video content as a downloadable or expandable text alternative.'],
    reasoning: 'Uncaptioned and non-audio-described video content excludes Deaf and hard of hearing viewers (captions) and people with vision loss (audio description). Both are increasingly expected under the DDA 1992.',
    resources: [],
  },
  '4.6-D-11': {
    actions: ['Design event invitations in accessible formats: HTML email with proper structure, adequate contrast, and alt text on images (WCAG 2.2 Level AA).', 'Include an accessibility requirements field in the RSVP process so attendees can communicate their needs in advance.', 'Ensure the RSVP mechanism is keyboard accessible and works with screen readers.', 'Provide event details in plain language and include accessibility information: venue access, hearing loops, Auslan, quiet spaces, and how to request adjustments.', 'Offer non-digital RSVP options (phone, NRS, email) alongside any online form.'],
    reasoning: 'Inaccessible event invitations mean customers with disabilities cannot RSVP, request accommodations, or even know the event is happening. This is both a participation barrier and a missed opportunity.',
    resources: [],
  },
  '4.6-D-12': {
    actions: ['Create a dedicated accessibility page on your website describing your physical access features, communication options, assistive technology, policies, and how to request assistance.', 'Link the accessibility page prominently from your homepage, header or footer navigation, and contact page (not buried in a sub-menu).', 'Include practical details: accessible parking (number of spaces, locations), entrance access, accessible toilets, hearing loops, quiet spaces, assistance animal policy.', 'Write in plain language and include photos or a virtual tour to help customers plan their visit.', 'Review and update the page at least quarterly and whenever facilities or services change.'],
    reasoning: 'A dedicated accessibility page is the single most important piece of online content for customers with disabilities planning a visit. It centralises critical information and signals organisational commitment.',
    resources: [],
  },
  '4.6-D-2': {
    actions: ['Ensure your referral program can be accessed and shared through multiple methods: email, SMS, phone, and in-person (not just social media sharing).', 'Make referral landing pages accessible (WCAG 2.2 Level AA) and ensure the referral code or link is easy to copy and paste.', 'Provide staff-assisted referral processing for customers who cannot use the digital system.', 'Communicate referral program details in plain language and accessible formats.'],
    reasoning: 'Referral programs that rely solely on sharing a digital link or code via social media exclude customers who do not use those platforms or who use assistive technology that makes sharing difficult.',
    resources: [],
  },
  '4.6-D-3': {
    actions: ['Include a brief accessibility section in regular newsletters and email communications, highlighting available features, recent improvements, and how to request assistance.', 'Feature accessibility information in social media posts periodically, not only during disability awareness events.', 'Ensure pre-visit communications (booking confirmations, event reminders) include relevant accessibility details.', 'Use inclusive imagery that represents people with disabilities naturally, not as an afterthought (DDA 1992, positive duty to promote inclusion).'],
    reasoning: 'Proactively including accessibility information in regular communications (not just on a hidden page) normalises disability inclusion and ensures customers know what is available before they need it.',
    resources: [],
  },
  '4.6-D-4': {
    actions: ['Add alt text/image descriptions to all social media images across all platforms (Facebook, Instagram, LinkedIn, X).', 'Caption all video content, including Stories, Reels, and live streams (auto-captions are a start but should be checked for accuracy).', 'Use camelCase or PascalCase in hashtags for screen reader readability (e.g., #AccessibleTourism not #accessibletourism).', 'Write in plain language, avoid jargon, and limit emoji use (screen readers read each emoji aloud, so clusters are disruptive).', 'Provide content warnings for posts containing flashing images, loud audio, or distressing content.'],
    reasoning: 'Social media posts without alt text, captions, or plain language exclude the very audience you may be trying to reach. Accessible social media is also a legal grey area under the DDA 1992 where best practice is evolving.',
    resources: [],
  },
  '4.6-D-5': {
    actions: ['Audit your live chat or messaging widget against WCAG 2.2 Level AA: keyboard operability (2.1.1), screen reader compatibility (4.1.2), focus management (2.4.3), and no keyboard traps (2.1.2).', 'Ensure chat transcripts can be saved or emailed for customers who need a record of the conversation.', 'If using a third-party chat tool, request their VPAT/accessibility conformance report and switch to an accessible provider if necessary.', 'Provide alternative real-time communication options (phone, NRS, video call) for customers who cannot use chat.'],
    reasoning: 'Live chat and messaging are increasingly important contact channels, but many chat widgets are inaccessible: they trap keyboard focus, lack screen reader support, or disappear on magnification.',
    resources: [],
  },
  '4.6-D-6': {
    actions: ['Implement a preference storage system in your CRM that records accessibility needs: communication format, seating preferences, assistance animal, mobility needs, and sensory requirements.', 'Ensure preferences are accessible to all relevant staff and systems (front desk, booking, events, marketing) (DDA 1992 s 24).', 'Obtain explicit consent before storing accessibility preferences and comply with the Privacy Act 1988.', 'Allow customers to update or delete their preferences at any time through an accessible interface.'],
    reasoning: 'When accessibility preferences are remembered, customers do not need to re-explain their needs at every visit. This reduces effort, demonstrates care, and enables proactive service delivery.',
    resources: [],
  },
  '4.6-D-7': {
    actions: ['Notify customers who have previously provided accessibility feedback when relevant improvements are completed.', 'Publish accessibility improvements on your website, social media, and in newsletters to reach a broader audience.', 'Frame improvements positively: "We have installed a new hearing loop in the main auditorium" rather than "We fixed our non-compliant hearing loop."', 'Include accessibility milestones in your DIAP progress reports and annual reviews.'],
    reasoning: 'Customers who have reported barriers or expressed interest in accessibility want to know when improvements are made. Proactive notification builds trust and encourages return visits.',
    resources: [],
  },
  '4.6-D-8': {
    actions: ['Test push notifications with VoiceOver (iOS) and TalkBack (Android) to ensure content is read aloud correctly.', 'Ensure notification text is self-contained and does not require viewing an image or taking an inaccessible action to understand the message.', 'Provide an accessible in-app notification centre where past notifications can be reviewed.', 'Offer email or SMS as an alternative notification channel for customers who cannot use push notifications (WCAG 2.2 SC 4.1.2, 4.1.3).'],
    reasoning: 'Push notifications that do not work with VoiceOver, TalkBack, or other assistive technology mean customers with vision loss miss time-sensitive information that other customers receive.',
    resources: [],
  },
  '4.6-D-9': {
    actions: ['Identify your highest-priority communications for Auslan translation: welcome messages, safety information, key service descriptions, and major announcements.', 'Engage qualified Auslan interpreters (preferably NAATI-certified) for video content production.', 'Publish Auslan videos on your website and social media with captions (for Deaf people who do not use Auslan and for hearing audiences).', 'Consider Auslan interpretation for live events, launches, and important announcements, booking interpreters with at least 2 weeks\' notice.'],
    reasoning: 'Auslan is the first language of many Deaf Australians. Providing Auslan content demonstrates genuine inclusion and ensures Deaf customers receive information in their preferred language.',
    resources: [],
  },
  '4.6-F-1': {
    actions: ['Design all marketing emails to be accessible: use semantic HTML headings, descriptive alt text on images, adequate colour contrast (4.5:1 for text), and a plain-text alternative.', 'Ensure emails are readable with images disabled, as many screen reader users and some email clients default to this.', 'Use a single-column layout with a minimum font size of 14px for body text and avoid justified alignment.', 'Test every email template with a screen reader (NVDA or VoiceOver) before deployment (WCAG 2.2 SC 1.1.1, 1.3.1, 1.4.3).', 'Include a "View in browser" link as a fallback for email clients that render poorly.'],
    reasoning: 'Inaccessible marketing emails exclude customers who use screen readers, have low vision, or have cognitive disabilities. If they cannot read your promotions, they miss out on offers and information.',
    resources: [],
  },
  '4.6-F-2': {
    actions: ['Provide an accessible preference centre where customers can choose their communication channel (email, SMS, post, phone), frequency, and content topics.', 'Ensure the preference centre meets WCAG 2.2 Level AA: keyboard navigation (2.1.1), form labels (1.3.1), and adequate contrast (1.4.3).', 'Include a prominent, easy-to-find unsubscribe link in every email, meeting minimum target size requirements (WCAG 2.2 SC 2.5.8).', 'Offer a phone/NRS option for managing preferences for customers who cannot use the digital preference centre.'],
    reasoning: 'Customers need to control how they receive communications. If preferences are hard to manage (tiny unsubscribe links, inaccessible preference centres), customers with disabilities cannot opt in or out effectively.',
    resources: [],
  },
  '4.6-F-3': {
    actions: ['Ensure all promotional offers are available through at least one accessible channel: accessible web page, phone, or email (DDA 1992 s 24, equivalent access).', 'Provide offer terms and conditions in plain language and accessible formats (large print, screen reader compatible).', 'If using QR codes, provide an alternative URL or text code alongside the QR code for customers who cannot scan.', 'Test promotional landing pages against WCAG 2.2 Level AA before launch.'],
    reasoning: 'If promotional offers require inaccessible actions (scanning a QR code without alt text, using a touchscreen kiosk, reading small print), customers with disabilities are excluded from the same deals as everyone else.',
    resources: [],
  },
  '4.6-F-4': {
    actions: ['Audit your loyalty program interface (app, website, in-store) against WCAG 2.2 Level AA for keyboard access, screen reader compatibility, and clear navigation.', 'Provide non-digital alternatives for earning and redeeming points (e.g., staff can process points via a physical card or verbal confirmation).', 'Use plain language to explain how the program works, how points are earned, and how to redeem them.', 'Ensure program communications (balance updates, offers, expiry warnings) are sent in the customer\'s preferred accessible format.'],
    reasoning: 'Loyalty programs with inaccessible apps, complex point systems, or exclusive digital redemption exclude customers with disabilities from rewards they have earned through their patronage.',
    resources: [],
  },
  // Module 4.7
  '4.7-DD-1a': {
    actions: ['Conduct an audit of all written communication types your organisation produces: letters, emails, invoices, receipts, contracts, terms and conditions, menus, maps, safety information, and internal documents.', 'Categorise each by accessibility status: reviewed and accessible, reviewed with issues, or never reviewed.', 'Prioritise review of customer-facing documents with legal or safety implications (contracts, safety info, terms) first.', 'Create a review schedule to bring all document types up to accessible standards within 12 months.'],
    reasoning: 'Knowing which documents have been reviewed for accessibility reveals your coverage gaps. Often, only marketing materials are reviewed while invoices, contracts, and operational documents are overlooked.',
    resources: [],
  },
  '4.7-DD-2a': {
    actions: ['Test all email templates with NVDA or JAWS screen reader to verify heading structure, link text, alt text, and reading order.', 'Test with images disabled in at least two email clients (Outlook, Gmail) to confirm the email makes sense without visual content.', 'Test in dark mode to ensure colour contrast holds and no information is lost.', 'Document test results and fix issues before templates go into production use.'],
    reasoning: 'Testing emails with screen readers and with images disabled reveals barriers that visual inspection cannot catch. Many emails that "look" accessible fail basic assistive technology tests.',
    resources: [],
  },
  '4.7-DD-3a': {
    actions: ['List all document types your organisation creates (Word, PDF, Excel, PowerPoint, InDesign, Google Docs) and assess which are produced accessibly.', 'For each type, identify the accessibility features required: heading styles, alt text, table headers, reading order, colour contrast, and tagged structure.', 'Prioritise training and template creation for the most commonly produced document types.', 'Set a target date for all document types to be produced accessibly by default.'],
    reasoning: 'Understanding which document types are already created accessibly helps target training and tool investment toward the gaps. Often, Word documents are handled but PDFs, spreadsheets, and presentations are not.',
    resources: [],
  },
  '4.7-DD-3b': {
    actions: ['Provide practical training on accessible document creation covering: heading styles (not just bold text), alt text for images, table headers, reading order, list formatting, and colour contrast.', 'Make training mandatory for all staff who create customer-facing documents and include it in onboarding.', 'Provide quick-reference guides or checklists at staff desks summarising the key steps for Word, PDF, and PowerPoint.', 'Run the Microsoft Accessibility Checker or equivalent as the final step before any document is published or sent (WCAG 2.2 SC 1.3.1).'],
    reasoning: 'Heading styles, alt text, and document structure are the foundation of accessible documents. If staff do not know how to use them, even well-intentioned documents will be inaccessible.',
    resources: [],
  },
  '4.7-DD-4a': {
    actions: ['Map all email communication types: marketing newsletters, booking confirmations, receipts, complaint responses, reminders, welcome emails, and ad-hoc correspondence.', 'Identify which types currently use accessible templates and which are sent without templates (free-form staff emails).', 'Prioritise template creation for high-volume, customer-facing email types.', 'Ensure automated/transactional emails generated by your booking or CRM system use accessible HTML templates.'],
    reasoning: 'Understanding which email types have accessible templates reveals coverage. Transactional emails (receipts, confirmations) are often automated and may have been set up before accessibility was considered.',
    resources: [],
  },
  '4.7-DD-5a': {
    actions: ['Create accessible templates for the most common document types: letters, reports, proposals, flyers, presentations, and spreadsheets.', 'Configure heading styles, colour palette, font choices, and placeholder alt text within each template.', 'Distribute templates through your document management system and set them as the default in Microsoft Office or Google Workspace.', 'Retire legacy non-accessible templates and communicate the change to all staff.'],
    reasoning: 'Document templates for staff ensure consistency and reduce the risk of individual staff producing inaccessible documents. Without templates, accessibility depends entirely on individual knowledge and effort.',
    resources: [],
  },
  '4.7-DD-6a': {
    actions: ['Document a standard process for handling alternative format requests: who receives the request, what formats are available, the turnaround time, and how to escalate delays.', 'Assign a single point of contact or team responsible for coordinating alternative format production.', 'Establish relationships with Braille production services, Easy Read writers, and audio production services so they can be engaged quickly.', 'Track all requests and fulfilment times to identify bottlenecks and improve the process (DDA 1992 s 24).'],
    reasoning: 'An ad-hoc process for alternative format requests (different staff, different responses, no timeline) results in inconsistent service. A documented process ensures reliability and accountability.',
    resources: [],
  },
  '4.7-DD-7a': {
    actions: ['Map all systems that generate customer communications (CRM, email platform, finance, booking, marketing) and identify where preferences are stored.', 'Consolidate preferences into a central system or ensure preferences sync across all communication-generating systems.', 'Ensure staff from all teams can view and apply preferences when generating communications.', 'Audit annually to confirm that preferences are being applied consistently across all communication types.'],
    reasoning: 'Preferences stored in one system (e.g., CRM) but not accessible to another (e.g., finance for invoices) means the customer receives accessible marketing but inaccessible invoices. Integrated storage solves this.',
    resources: [],
  },
  '4.7-DD-7b': {
    actions: ['Configure your CRM or communication platform to automatically apply format preferences when generating correspondence (e.g., auto-select 18pt font template for large-print customers).', 'If full automation is not possible, implement system prompts that alert staff to apply preferences before sending.', 'Test automated preference application end-to-end with sample customer records.', 'Review automation accuracy quarterly and fix any cases where preferences are not being applied.'],
    reasoning: 'Manual application of preferences (staff remembering to print in large print each time) is error-prone. Automated preference application eliminates human error and ensures consistent accessible delivery.',
    resources: [],
  },
  '4.7-DD-8a': {
    actions: ['Test the full subscription journey (sign up, confirm, manage preferences, unsubscribe) with a screen reader and keyboard-only navigation.', 'Verify that the unsubscribe link meets minimum target size (WCAG 2.2 SC 2.5.8, 24x24px minimum) and colour contrast requirements.', 'Ensure the process does not require CAPTCHA completion, account login, or more than two steps to unsubscribe.', 'Offer alternative unsubscribe methods (reply email, phone/NRS, postal request) and test these as well (DDA 1992 s 24; Spam Act 2003).'],
    reasoning: 'Mailing list subscription and unsubscribe processes are often overlooked in accessibility testing. An inaccessible unsubscribe process is both an accessibility failure and a potential Spam Act 2003 compliance issue.',
    resources: [],
  },
  '4.7-PC-1': {
    actions: ['Review all standard written communications for accessibility: minimum 12pt font for print (14px for digital), sans-serif typeface, high contrast (4.5:1 ratio), and plain language.', 'Use clear heading structure and short paragraphs to aid comprehension and screen reader navigation (WCAG 2.2 SC 1.3.1, 2.4.6).', 'Avoid conveying information through colour alone (e.g., red text for overdue); use text labels as well (WCAG 2.2 SC 1.4.1).', 'Provide contact details for requesting alternative formats at the bottom of every communication.'],
    reasoning: 'Written communications (letters, emails, invoices) that use small fonts, poor contrast, complex language, or image-only content are inaccessible to people with vision loss, cognitive disabilities, or low literacy.',
    resources: [],
  },
  '4.7-PC-2': {
    actions: ['Design emails with a semantic HTML structure: headings (h1-h3), paragraphs, lists, and meaningful link text (not "click here").', 'Provide descriptive alt text for all images, and ensure the email is fully comprehensible with images disabled.', 'Offer a plain-text version of every marketing and transactional email.', 'Ensure colour contrast meets 4.5:1 for text and 3:1 for large text (WCAG 2.2 SC 1.4.3).', 'Test emails with at least one screen reader and one email client in dark mode before sending.'],
    reasoning: 'Emails that rely on images for critical content, lack headings, or have no plain-text version are unreadable for many screen reader users and customers who disable images for data or preference reasons.',
    resources: [],
  },
  '4.7-PC-3': {
    actions: ['Create all PDF documents with proper tags (headings, paragraphs, lists, tables with headers), a logical reading order, and alt text on images.', 'Use the PDF accessibility checker in Adobe Acrobat or equivalent tool before publishing any PDF.', 'Ensure documents pass the WCAG 2.2 SC 1.3.1 (info and relationships), 1.3.2 (meaningful sequence), and 1.1.1 (non-text content) criteria.', 'Where possible, provide an accessible HTML version alongside the PDF as an alternative.', 'Train all staff who create PDFs in accessible document creation techniques.'],
    reasoning: 'Untagged PDFs are the most common digital accessibility barrier. Without tags, screen readers cannot navigate the document, and the reading order may be nonsensical.',
    resources: [],
  },
  '4.7-PC-4': {
    actions: ['Create a library of accessible email templates for common communications: booking confirmations, newsletters, receipts, complaint responses, and general correspondence.', 'Ensure each template uses semantic HTML, proper heading hierarchy, alt text placeholders, and adequate colour contrast.', 'Distribute templates through your email platform so they are the default choice for staff, not an optional extra.', 'Review and update templates annually and whenever your branding changes, ensuring accessibility is maintained.'],
    reasoning: 'Without accessible email templates, each staff member creates emails differently, often without headings, alt text, or proper structure. Templates enforce consistency and reduce the burden on individual staff.',
    resources: [],
  },
  '4.7-PC-5': {
    actions: ['Create accessible document templates for Word, PowerPoint, InDesign, and any other tools your team uses, with pre-configured heading styles, colour palette, font choices, and alt text reminders.', 'Include instructions within the template on how to maintain accessibility (e.g., "Add alt text to this image placeholder").', 'Distribute templates through your intranet or document management system and retire non-accessible legacy templates.', 'Test templates with the Microsoft Accessibility Checker or Adobe Accessibility Checker before distribution.'],
    reasoning: 'Document templates (Word, InDesign, PowerPoint) with built-in accessible styles ensure that every document starts from an accessible foundation, rather than relying on staff to remember accessibility steps.',
    resources: [],
  },
  '4.7-PC-6': {
    actions: ['Establish a documented process for handling alternative format requests: who to contact, expected turnaround, and available formats (large print 18pt+, audio, Braille, Easy Read, digital).', 'Include an "Alternative formats available on request" statement on all standard communications and your website.', 'Pre-prepare high-demand documents (terms and conditions, menus, safety info, maps) in large print and accessible digital formats.', 'Set a maximum turnaround time (e.g., 5 business days) for alternative format requests and track performance (DDA 1992 s 24).'],
    reasoning: 'The right to request alternative formats is implicit in the DDA 1992 reasonable adjustment obligation. Customers who need large print, audio, Braille, or Easy Read should not face long delays or refusal.',
    resources: [],
  },
  '4.7-PC-7': {
    actions: ['Record communication preferences in your CRM and configure systems to apply them automatically to future correspondence.', 'Flag customer records with format preferences (large print, audio, Easy Read, Braille, email-only, SMS) so any staff member can see them.', 'Test your system by creating a record with preferences and verifying that the next communication is generated in the correct format.', 'Confirm preferences with customers annually to ensure they remain accurate (DDA 1992 s 24, ongoing reasonable adjustment).'],
    reasoning: 'If a customer has told you they need large print, sending them standard 10pt correspondence next time means you are not applying what you know. This wastes the customer\'s time and erodes trust.',
    resources: [],
  },
  '4.7-PC-8': {
    actions: ['Ensure subscription and unsubscribe processes are keyboard accessible, screen reader compatible, and meet WCAG 2.2 Level AA (2.1.1, 1.3.1, 2.5.8).', 'Provide one-click unsubscribe links that do not require a login, CAPTCHA, or multi-step process.', 'Offer alternative unsubscribe methods (reply "STOP" to email, phone/NRS, postal request) for customers who cannot use the digital link.', 'Test the subscription process end-to-end with assistive technology at least annually.'],
    reasoning: 'Inaccessible mailing lists (e.g., unsubscribe links that require CAPTCHA, preference centres with poor contrast, or tiny click targets) trap customers in communications they cannot manage.',
    resources: [],
  },
  // Module 5.1
  '5.1-D-10': {
    actions: ['Allocate a specific line item in your annual operating budget for accessibility improvements.', 'Include capital expenditure provisions for physical access upgrades (ramps, lifts, accessible toilets) and technology (assistive tech, WCAG remediation).', 'Budget for recurring costs such as Auslan interpreters, captioning services, accessible document conversion, and disability awareness training.', 'Align budget priorities with your DIAP action items and accessibility audit findings.', 'Benchmark your accessibility spend against industry peers and the Australian Network on Disability recommendations.'],
    reasoning: 'Without a dedicated budget, accessibility improvements compete with other priorities and are often deferred. Ring-fenced funding ensures consistent progress on inclusion commitments.',
    resources: [],
  },
  '5.1-D-11': {
    actions: ['Provide training on the Disability Discrimination Act 1992 (Cth) and relevant state/territory anti-discrimination legislation.', 'Cover the Disability Standards for Accessible Public Transport 2002, Premises Standards 2010 (as amended 2024), and any sector-specific standards.', 'Explain the concept of reasonable adjustments and the unjustifiable hardship defence as defined in the DDA.', 'Include real Australian case studies and AHRC conciliated outcomes to illustrate consequences of non-compliance.', 'Make legal awareness a component of staff induction and annual refresher training.'],
    reasoning: 'Staff awareness of legal obligations reduces the risk of unlawful discrimination complaints to the Australian Human Rights Commission and state tribunals, and builds a culture of proactive inclusion.',
    resources: [],
  },
  '5.1-D-12': {
    actions: ['Create a documented complaints procedure that is accessible in multiple formats (online form, phone, email, in-person, Auslan video relay).', 'Set clear timeframes for acknowledgement (within 2 business days) and resolution (within 20 business days).', 'Train complaints-handling staff on disability awareness, respectful communication, and reasonable adjustments during the complaints process.', 'Log all accessibility-related complaints in a central register and analyse trends quarterly.', 'Ensure the process aligns with AS/NZS 10002:2022 Guidelines for complaint management in organizations.'],
    reasoning: 'A robust complaints process demonstrates responsiveness, helps resolve issues before they escalate to the AHRC or state tribunals, and provides data to drive systemic improvements.',
    resources: [],
  },
  '5.1-D-13': {
    actions: ['Investigate relevant Australian accessibility accreditation programs such as the Australian Network on Disability Accessibility Confident Recruiter program.', 'Consider international certifications such as the Disability Confident Employer scheme or ISO 21542 (accessibility of the built environment).', 'Pursue sector-specific recognition (e.g., Accessible Tourism accreditation through your state tourism body).', 'Use accreditation frameworks as a roadmap for improvement even before formal certification.', 'Display any achieved certifications prominently on your website and marketing materials.'],
    reasoning: 'Accreditation or certification provides external validation, builds customer confidence, and drives continuous improvement through structured assessment frameworks.',
    resources: [],
  },
  '5.1-D-14': {
    actions: ['Add accessibility and disability inclusion as a standing agenda item at Board or senior leadership meetings (at least quarterly).', 'Include DIAP progress reporting in Board papers alongside financial and risk reporting.', 'Ensure at least one Board member has accessibility expertise or lived experience of disability.', 'Report on accessibility KPIs, complaint trends, and audit findings at each meeting.', 'Align accessibility governance with your organisation risk management framework.'],
    reasoning: 'Board-level attention ensures accessibility remains a strategic priority with adequate governance, oversight, and resource allocation rather than being siloed in operations.',
    resources: [],
  },
  '5.1-D-15': {
    actions: ['Structure your DIAP to address all four national outcome areas: attitudes and behaviours, liveable communities, employment, and systems and processes.', 'Map DIAP actions to every business unit and functional area, not just customer-facing operations.', 'Include actions for digital accessibility, procurement, internal communications, HR practices, and physical premises.', 'Conduct a gap analysis against the AHRC guidelines and your state DIAP framework to identify coverage holes.', 'Assign a responsible owner and timeline to every action, ensuring no area is left without specific commitments.'],
    reasoning: 'A comprehensive DIAP covering all organisational areas prevents gaps where people with disability experience barriers in employment, service delivery, or community engagement.',
    resources: [],
  },
  '5.1-D-16': {
    actions: ['Set targets for representation of people with disability on your Board, senior leadership team, and advisory committees.', 'Actively recruit people with disability to governance roles through disability-specific networks and organisations.', 'Ensure governance processes are accessible (meeting formats, documents, venues, communication methods).', 'Consider establishing a dedicated disability advisory committee with direct input to the Board.', 'Align with Australia Disability Strategy 2021-2031 outcome area on inclusive leadership and civic participation.'],
    reasoning: 'Representation of people with disability in leadership ensures lived experience informs strategy and decision-making, moving beyond consultation to genuine power-sharing.',
    resources: [],
  },
  '5.1-D-17': {
    actions: ['Offer key documents in accessible formats including large print, Easy Read, Auslan video, audio, and accessible digital (HTML or tagged PDF).', 'Include a statement on all publications offering alternative formats on request, with a clear contact method.', 'Ensure your website meets WCAG 2.2 Level AA as the primary accessible format for digital content.', 'Use the Australian Government Easy Read style guide for plain language versions of important documents.', 'Budget for professional Auslan translation, Easy Read conversion, and audio recording services.'],
    reasoning: 'Proactively offering alternative formats removes the burden from individuals to request accommodations and ensures equitable access to information for people with diverse disabilities.',
    resources: [],
  },
  '5.1-D-18': {
    actions: ['Publish an accessibility statement on your website that is easy to find (linked from the footer on every page).', 'Include the WCAG conformance level you target (Level AA minimum), known limitations, and a timeline for fixes.', 'Provide a clear contact method for reporting accessibility barriers, including phone, email, and an accessible web form.', 'Reference the DDA 1992 and any applicable Disability Standards.', 'Review and update the statement at least annually or after significant website changes, following the W3C accessibility statement generator format.'],
    reasoning: 'An accessibility statement demonstrates transparency, sets expectations for users, and provides a mechanism for reporting barriers, aligning with WCAG 2.2 and international best practice.',
    resources: [],
  },
  '5.1-D-19': {
    actions: ['Expand your accessibility policy to explicitly cover your website, mobile apps, social media accounts, online booking systems, and email communications.', 'Set WCAG 2.2 Level AA as the minimum standard for all digital channels.', 'Include requirements for accessible PDFs, captioned videos, and social media alt text in your digital content guidelines.', 'Require third-party digital platforms and SaaS providers to demonstrate WCAG compliance through VPATs or accessibility conformance reports.', 'Schedule regular automated and manual accessibility testing of all digital channels (at least quarterly).'],
    reasoning: 'Digital channels are increasingly the primary point of interaction. Without explicit digital coverage in your policy, web, app, and social media barriers may go unaddressed.',
    resources: [],
  },
  '5.1-D-20': {
    actions: ['Add accessibility-related risks to your organisation risk register, including non-compliance with the DDA 1992 and Premises Standards.', 'Assess the impact of service disruptions on customers and staff with disability (e.g., loss of accessible transport, website outage, evacuation).', 'Include accessible communication channels in your crisis communication plan (Auslan, Easy Read, captioned updates).', 'Ensure business continuity plans address the needs of employees with disability, including remote work accommodations and assistive technology access.', 'Review accessibility risks quarterly alongside other organisational risks.'],
    reasoning: 'Including accessibility in risk management and business continuity ensures that people with disability are not disproportionately affected during disruptions and that legal obligations continue to be met.',
    resources: [],
  },
  '5.1-D-6': {
    actions: ['Include accessibility in your marketing strategy, covering imagery, language, and format choices.', 'Use inclusive imagery that authentically represents people with disability (not tokenistic stock photos).', 'Ensure all digital marketing meets WCAG 2.2 Level AA, including social media posts with alt text, captioned videos, and accessible PDFs.', 'Write marketing copy in plain language (aim for a Year 8 reading level) following the Australian Government Style Manual.', 'Consult the Australian Human Rights Commission and People with Disability Australia guidelines on respectful language and representation.'],
    reasoning: 'Marketing and communications that consider accessibility reach a broader audience and ensure people with disability can learn about and engage with your services.',
    resources: [],
  },
  '5.1-D-7': {
    actions: ['Establish a disability advisory group or reference panel that includes people with diverse disabilities.', 'Pay participants fairly for their time and expertise, following NDIS or sector benchmarks for consulting fees.', 'Involve the advisory group at the design stage of new services, renovations, or programs, not just for review.', 'Partner with disability organisations such as People with Disability Australia, Disability Advocacy Network Australia, or local Disabled Peoples Organisations.', 'Document how community input has influenced decisions and feed outcomes back to participants.'],
    reasoning: 'Co-design with people with disability ensures services genuinely meet needs rather than relying on assumptions, aligning with the "Nothing About Us Without Us" principle central to the UN Convention on the Rights of Persons with Disabilities.',
    resources: [],
  },
  '5.1-D-8': {
    actions: ['Establish baseline accessibility metrics across physical access, digital access, employment, and customer experience.', 'Set up a reporting dashboard or tracking spreadsheet that aligns with your DIAP outcome areas.', 'Include accessibility progress in regular Board or leadership reporting cycles.', 'Track both quantitative metrics (e.g., number of barriers removed, complaint volumes) and qualitative data (customer and staff feedback).', 'Publish an annual accessibility progress report publicly, as required or encouraged under state DIAP legislation.'],
    reasoning: 'Tracking accessibility improvements demonstrates accountability, supports DIAP reporting requirements, and helps identify where further investment is needed.',
    resources: [],
  },
  '5.1-D-9': {
    actions: ['Appoint a senior leader (C-suite or direct report to CEO) as the executive sponsor for accessibility and inclusion.', 'Define the sponsor role to include chairing or attending disability advisory meetings, championing budget allocation, and reporting to the Board.', 'Ensure the executive sponsor has access to disability inclusion expertise, either in-house or through external advisory arrangements.', 'Include accessibility leadership as a formal part of the sponsor role description and performance objectives.', 'Communicate the appointment internally and externally to demonstrate commitment.'],
    reasoning: 'Executive sponsorship signals organisational commitment, secures resources, and ensures accessibility is embedded in strategic decision-making rather than treated as an operational afterthought.',
    resources: [],
  },
  '5.1-F-1': {
    actions: ['Draft a standalone accessibility or disability inclusion policy that references the DDA 1992, Disability Standards, and your state/territory equal opportunity legislation.', 'Include specific commitments covering physical access, digital accessibility (WCAG 2.2 AA), communication, employment, and customer service.', 'Assign an executive sponsor and policy owner with authority to drive implementation.', 'Consult with people with disability and disability organisations (e.g., state disability peak bodies) during drafting.', 'Have the policy endorsed by your Board or senior leadership and publish it on your website.', 'Schedule annual reviews aligned with your DIAP cycle and any legislative changes.'],
    reasoning: 'A documented accessibility policy provides the foundation for consistent, organisation-wide inclusion efforts and demonstrates commitment under the Disability Discrimination Act 1992 (Cth).',
    resources: [],
  },
  '5.1-F-3': {
    actions: ['Review your state or territory DIAP requirements (e.g., NSW Disability Inclusion Act 2014, Vic Disability Act 2006, Qld Disability Services Act 2006).', 'Structure your DIAP around the four nationally recognised outcome areas: inclusive communities, employment, service delivery, and systems and processes.', 'Set SMART goals with clear timeframes, responsible owners, and measurable KPIs for each outcome area.', 'Consult with people with disability, staff with disability, and relevant disability organisations during development.', 'Register or lodge your DIAP with the relevant state authority if required (e.g., NSW Disability Council).', 'Publish the DIAP publicly and report progress annually.'],
    reasoning: 'A Disability Inclusion Action Plan (DIAP) translates policy into measurable actions and is required or strongly encouraged under most state and territory disability inclusion legislation across Australia.',
    resources: [],
  },
  '5.1-F-4': {
    actions: ['Register as a Companion Card affiliate through your state or territory program (e.g., Companion Card Victoria, NSW Companion Card).', 'Train all front-of-house and ticketing staff to recognise and accept the Companion Card.', 'Update your ticketing system to allow a free companion ticket when a Companion Card number is entered.', 'Display the Companion Card logo on your website, at entry points, and in promotional materials.', 'Include Companion Card acceptance information in your accessibility statement and event listings.'],
    reasoning: 'The Companion Card is an Australian scheme ensuring carers or support workers attend free of charge, removing a significant financial barrier for people with disability who require attendant support.',
    resources: [],
  },
  '5.1-F-5': {
    actions: ['Introduce a disability concession rate or ensure your existing concession pricing is clearly available to people with disability.', 'Accept recognised concession cards including Disability Support Pension cards, NDIS participant cards, and state concession cards.', 'Clearly communicate pricing options and concession eligibility on your website and at point of sale.', 'Consider offering free or reduced-rate tickets for support workers or carers beyond the Companion Card scheme.', 'Review pricing annually to ensure it remains equitable and competitive with sector benchmarks.'],
    reasoning: 'Accessible pricing acknowledges the additional costs people with disability often face (transport, support workers, equipment) and reduces financial barriers to participation.',
    resources: [],
  },
  '5.1-F-6': {
    actions: ['Develop a written assistance animal policy that aligns with the DDA 1992 (s.9) definition covering dogs and other animals trained to assist with disability.', 'Train all staff (including security, front-of-house, and management) to understand that assistance animals must be permitted in all public areas.', 'Ensure staff know they may ask for evidence of the animal being an assistance animal (e.g., ID card, coat, or harness) but cannot require specific documentation in all states.', 'Provide a relief area for assistance animals and communicate its location clearly.', 'Include your assistance animal policy on your website and in your accessibility statement.', 'Review the policy against state-specific legislation (e.g., Guide, Hearing and Assistance Dogs Act 2009 (Vic)) as requirements vary.'],
    reasoning: 'Under the DDA 1992 and all state/territory laws, refusing entry to an assistance animal is unlawful. A clear policy protects both the organisation and the rights of handlers.',
    resources: [],
  },
  // Module 5.2
  '5.2-D-1': {
    actions: ['Create a simple, confidential adjustment request form available in accessible formats (online, paper, verbal).', 'Set a clear timeline for responding to requests (e.g., initial response within 5 business days, implementation within 20 business days).', 'Designate a central contact point (e.g., HR accessibility coordinator) who has authority to approve and fund adjustments.', 'Maintain confidential records of all adjustment requests, outcomes, and reviews in compliance with privacy legislation.', 'Promote the adjustment process during onboarding and through regular internal communications.'],
    reasoning: 'A formal adjustment request process ensures consistency, reduces reliance on individual manager goodwill, and creates an auditable record that demonstrates compliance with the DDA.',
    resources: [],
  },
  '5.2-D-10': {
    actions: ['Audit your diversity and inclusion data for intersectional representation (e.g., First Nations people with disability, women with disability, culturally diverse employees with disability).', 'Ensure disability inclusion strategies consider cultural differences in understanding and disclosing disability.', 'Partner with organisations that work at intersections, such as First Peoples Disability Network Australia.', 'Provide translated and culturally appropriate information about workplace adjustments and support.', 'Include intersectionality as a standing consideration in DIAP development and review.'],
    reasoning: 'People with disability who also experience other forms of marginalisation (First Nations, CALD, LGBTQIA+) face compounded barriers. An intersectional approach prevents people falling through gaps between separate diversity programs.',
    resources: [],
  },
  '5.2-D-11': {
    actions: ['Include disability-related questions in your regular employee engagement surveys (voluntary and confidential).', 'Track retention rates for employees with disability compared to overall workforce rates.', 'Conduct exit interviews with departing employees with disability to identify systemic barriers.', 'Analyse satisfaction data by business unit to identify where inclusion is strongest and weakest.', 'Report retention and satisfaction findings in your DIAP progress report and use them to set improvement actions.'],
    reasoning: 'Without tracking retention and satisfaction, you cannot identify whether inclusive hiring is translating into inclusive workplaces. High turnover among employees with disability signals systemic barriers.',
    resources: [],
  },
  '5.2-D-12': {
    actions: ['Ask all new employees (not only those who disclosed disability) about adjustment needs as part of pre-boarding.', 'Ensure onboarding documents, systems, and training materials meet WCAG 2.2 Level AA and are available in alternative formats.', 'Include disability awareness and adjustment request information in all induction programs.', 'Provide accessible IT setup from day one, including assistive technology and accessible software licences.', 'Assign an onboarding buddy who has completed disability awareness training.'],
    reasoning: 'Inaccessible onboarding creates an immediate negative experience, signals that disability was not anticipated, and can delay an employee ability to perform their role effectively.',
    resources: [],
  },
  '5.2-D-13': {
    actions: ['Offer flexible work as a standard option for all employees, reducing the need for disability-specific disclosure to access it.', 'Include working from home, flexible start/finish times, compressed weeks, job sharing, and part-time options in your flexibility policy.', 'Ensure flexible work technology (video conferencing, collaboration tools, VPN) is accessible and compatible with assistive technology.', 'Train managers to assess flexible work requests based on business outcomes rather than visibility or presence.', 'Review flexible work arrangements regularly to ensure they continue to meet employee needs.'],
    reasoning: 'Flexible work is one of the most effective and low-cost adjustments for many disabilities, supporting both physical and psychosocial needs. It also aligns with the modern award flexibility provisions.',
    resources: [],
  },
  '5.2-D-14': {
    actions: ['Ensure all internal communication platforms (intranet, email, Slack/Teams) meet WCAG 2.2 Level AA.', 'Provide captions on all internal videos and recorded meetings. Enable live captioning in video conferencing tools.', 'Offer Auslan interpretation for important all-staff meetings and events.', 'Send meeting agendas and materials in advance in accessible formats to allow preparation time.', 'Use accessible document templates (Word, PowerPoint) with proper heading structure, alt text, and sufficient colour contrast.'],
    reasoning: 'Inaccessible internal communications and meetings exclude employees with disability from information, decision-making, and social connection, creating a two-tier workforce experience.',
    resources: [],
  },
  '5.2-D-2': {
    actions: ['Implement voluntary, confidential disability disclosure surveys aligned with the ABS disability definitions.', 'Track representation data at each stage: application, shortlisting, hiring, retention, promotion, and exit.', 'Report disability employment data in your DIAP progress reports and annual reports (aggregated to protect privacy).', 'Benchmark against the Australian Public Service disability employment target (currently 7%) or your sector standards.', 'Use data to identify and address barriers at specific stages of the employee lifecycle.'],
    reasoning: 'Tracking disability employment data reveals whether inclusion initiatives are working, identifies barriers to retention, and supports DIAP and Australia Disability Strategy reporting.',
    resources: [],
  },
  '5.2-D-3': {
    actions: ['Deliver targeted disability confidence training for all people managers, covering legal obligations, adjustment processes, and inclusive leadership.', 'Include practical scenarios such as responding to disclosure, implementing adjustments, and supporting return-to-work.', 'Use training delivered or co-designed by people with lived experience of disability.', 'Make disability management training a prerequisite for management roles and include it in leadership development programs.', 'Evaluate training effectiveness through staff surveys and adjustment request outcomes.'],
    reasoning: 'Managers are the primary enablers or barriers to workplace inclusion. Without specific training, they may inadvertently create barriers or fail to provide required adjustments.',
    resources: [],
  },
  '5.2-D-4': {
    actions: ['Rewrite job descriptions to focus on essential outcomes and competencies rather than specific physical or cognitive methods.', 'Distinguish between inherent requirements (genuinely necessary) and preferred attributes, as defined in the DDA 1992.', 'Remove unnecessary requirements such as "must hold a drivers licence" unless driving is an inherent requirement.', 'Use inclusive language guidelines from the Australian Network on Disability or JobAccess.', 'Have job descriptions reviewed by an accessibility specialist or disability employment service before advertising.'],
    reasoning: 'Prescriptive job descriptions that specify methods rather than outcomes unnecessarily exclude people with disability who may achieve the same results through different approaches.',
    resources: [],
  },
  '5.2-D-5': {
    actions: ['Develop a formal return-to-work program that complies with your state or territory workers compensation legislation and Safe Work Australia guidelines.', 'Include graduated return options (reduced hours, modified duties, phased re-entry) and workplace adjustment provisions.', 'Appoint a return-to-work coordinator trained in disability-inclusive practices.', 'Ensure the program covers non-work-related disability acquisition, not just workplace injuries.', 'Provide ongoing support post-return including check-ins, adjustment reviews, and access to EAP services.'],
    reasoning: 'Many employees acquire disability during their working life. A structured return-to-work program supports retention, reduces workers compensation costs, and meets obligations under state WHS and workers compensation legislation.',
    resources: [],
  },
  '5.2-D-6': {
    actions: ['Audit promotion and career development data by disability status to identify disparities.', 'Ensure all training, mentoring, and development programs are accessible (physically, digitally, and in communication format).', 'Provide adjustments for professional development activities such as conferences, courses, and networking events.', 'Include disability inclusion metrics in manager performance reviews related to team development.', 'Establish mentoring or sponsorship programs specifically connecting employees with disability to senior leaders.'],
    reasoning: 'Equal access to career development and promotion prevents systemic disadvantage and ensures people with disability are not stuck in entry-level roles, addressing the "disability career ceiling" documented in Australian research.',
    resources: [],
  },
  '5.2-D-7': {
    actions: ['Partner with disability employment services (DES) providers to offer internships, traineeships, or work experience placements.', 'Investigate the Australian Government Disabled Australian Apprentice Wage Support and other incentive programs.', 'Connect with universities disability services to offer graduate internships for students with disability.', 'Ensure work experience placements include meaningful work, mentoring, and a pathway to ongoing employment where possible.', 'Track conversion rates from placements to permanent employment and set improvement targets.'],
    reasoning: 'Supported employment pathways create entry points for people with disability who face additional barriers to traditional recruitment, building a pipeline of diverse talent.',
    resources: [],
  },
  '5.2-D-8': {
    actions: ['Support the establishment of a disability employee resource group (ERG) with executive sponsorship and a modest budget.', 'Ensure the ERG is open to employees with disability, allies, and carers.', 'Provide the ERG with a formal channel to influence policy (e.g., regular meetings with HR leadership, input into DIAP development).', 'Allocate paid time for ERG participation and leadership roles.', 'Connect the ERG with external networks such as the Australian Network on Disability member community.'],
    reasoning: 'Employee disability networks provide peer support, reduce isolation, inform policy, and create a visible internal culture of inclusion that encourages disclosure and help-seeking.',
    resources: [],
  },
  '5.2-D-9': {
    actions: ['Ensure your EAP provider has expertise in disability-related mental health, including psychosocial disability.', 'Address the intersection of mental health and disability in your wellbeing strategy, covering anxiety around disclosure, adjustment fatigue, and ableism.', 'Train mental health first aiders on disability-specific considerations.', 'Provide flexible leave options for disability-related medical appointments and mental health days.', 'Include psychosocial risk assessment in your WHS framework as required under model WHS regulations.'],
    reasoning: 'Mental health conditions are the most common form of disability in the Australian workforce, yet workplace mental health programs often fail to address disability-specific needs such as psychosocial disability under the NDIS.',
    resources: [],
  },
  '5.2-F-1': {
    actions: ['Partner with disability employment services (DES) providers and Australian Disability Enterprises to reach candidates with disability.', 'Advertise positions through disability-specific job boards and networks such as the Australian Network on Disability Job Board.', 'Include a diversity and disability encouragement statement in all job advertisements.', 'Set disability employment targets aligned with Australia Disability Strategy 2021-2031 goals.', 'Review recruitment channels and outreach strategies annually to improve reach into the disability community.'],
    reasoning: 'Actively recruiting people with disability addresses underrepresentation (the disability employment gap in Australia remains over 30 percentage points) and builds a workforce that reflects the community.',
    resources: [],
  },
  '5.2-F-2': {
    actions: ['Ensure job advertisements, application forms, and career pages meet WCAG 2.2 Level AA.', 'Offer alternative application methods (phone, video, in-person) alongside online forms.', 'Proactively ask all candidates if they need adjustments for interviews or assessments, without requiring disability disclosure.', 'Train hiring managers on making reasonable adjustments during recruitment (e.g., extra time, alternative formats, Auslan interpreters).', 'Audit your recruitment platforms (ATS, video interview tools) for accessibility compliance.'],
    reasoning: 'An inaccessible recruitment process excludes qualified candidates with disability from the outset, breaching DDA obligations and narrowing your talent pool.',
    resources: [],
  },
  '5.2-F-3': {
    actions: ['Establish a clear, confidential process for employees to request workplace adjustments at any stage of employment.', 'Fund adjustments centrally (not from team budgets) to remove manager reluctance. Leverage the JobAccess Employment Assistance Fund for eligible costs.', 'Provide a range of adjustments including flexible hours, modified duties, assistive technology, ergonomic equipment, and remote work options.', 'Document all adjustment agreements and review them at least annually or when circumstances change.', 'Train managers on their legal obligations under the DDA and how to implement adjustments effectively.'],
    reasoning: 'Providing workplace adjustments is a legal obligation under the DDA 1992 (s.5, s.6) and state anti-discrimination laws. Failure to provide reasonable adjustments constitutes unlawful disability discrimination.',
    resources: [],
  },
  // Module 5.3
  '5.3-D-1': {
    actions: ['Schedule disability awareness refresher training at least annually for all customer-facing staff.', 'Use refresher sessions to cover updates such as new accessibility features, legislative changes, or feedback received.', 'Vary training formats to maintain engagement: e-learning modules, guest speakers with lived experience, team discussions, and practical exercises.', 'Track training completion dates and send automated reminders for overdue refreshers.', 'Tie training currency to performance reviews or compliance requirements.'],
    reasoning: 'One-off training fades quickly. Regular refresher training maintains awareness, covers new legislation or equipment, and reinforces the organisation commitment to inclusion.',
    resources: [],
  },
  '5.3-D-10': {
    actions: ['Include a dedicated module on autism and neurodivergence in your training program, developed with input from autistic people.', 'Cover common neurodivergent experiences: sensory sensitivities, need for routine, literal communication, executive function differences, and social interaction preferences.', 'Train staff on practical adjustments: reducing sensory input, providing clear instructions, allowing processing time, and offering quiet spaces.', 'Address neurodivergent masking and the energy cost of navigating neurotypical environments.', 'Reference Autism Spectrum Australia (Aspect) and AMAZE resources for Australian context.'],
    reasoning: 'Approximately 1 in 7 Australians are neurodivergent. Without specific training, staff may misinterpret neurodivergent behaviours (stimming, avoiding eye contact, literal communication) as rudeness or non-compliance.',
    resources: [],
  },
  '5.3-D-11': {
    actions: ['Require all contractors, casual staff, and agency workers to complete disability awareness training before commencing customer-facing duties.', 'Develop a condensed but comprehensive induction module that can be completed within 1-2 hours for short-term staff.', 'Include disability awareness requirements in contracts with labour hire agencies and contractor agreements.', 'Provide quick-reference accessibility guides that temporary staff can carry during shifts.', 'Verify training completion for all non-permanent staff and maintain records.'],
    reasoning: 'Contractors, casuals, and agency staff often have the most customer contact but the least training. This gap creates inconsistent experiences and liability risk for your organisation.',
    resources: [],
  },
  '5.3-D-12': {
    actions: ['Include assistive technology awareness in your training covering screen readers (JAWS, NVDA), hearing aids, cochlear implants, communication devices, and mobility aids.', 'Demonstrate how common assistive technologies interact with your services, products, and digital platforms.', 'Train staff to offer assistance without assuming incompetence, following the "ask, don not assume" principle.', 'Provide hands-on experience with assistive technologies available at your premises (hearing loop receivers, magnification devices, communication boards).', 'Keep staff updated as new assistive technologies become available in your context.'],
    reasoning: 'Assistive technology is increasingly common (screen readers, hearing aids, speech-to-text, switch devices). Staff who understand these tools can better support customers and avoid accidentally creating barriers.',
    resources: [],
  },
  '5.3-D-13': {
    actions: ['Design role-play scenarios covering common situations: assisting a wheelchair user, communicating with a Deaf customer, supporting someone in sensory overload, handling an accessibility complaint.', 'Use scenarios co-designed with people with disability to ensure realism and avoid stereotypes.', 'Include both straightforward scenarios and complex situations (e.g., intersecting needs, equipment failure, emergency evacuation).', 'Debrief after each scenario to discuss what went well and what could improve.', 'Rotate new scenarios annually based on real customer feedback and incident reports.'],
    reasoning: 'Practical scenarios build muscle memory and confidence. Staff who have practised responding to realistic situations are far more likely to respond well under real conditions than those with only theoretical knowledge.',
    resources: [],
  },
  '5.3-D-2': {
    actions: ['Engage disability awareness trainers with lived experience through organisations such as Disability Awareness Training Australia or state disability peak bodies.', 'Pay lived experience trainers at professional consulting rates, not token honorariums.', 'Include a mix of disability perspectives (physical, sensory, cognitive, psychosocial, neurological) across your training program.', 'Supplement formal training with staff exposure to customer stories and feedback from people with disability.', 'Evaluate the impact of lived-experience-led training through staff feedback and observable behaviour change.'],
    reasoning: 'Training delivered by people with lived experience is consistently rated as more impactful and authentic than trainer-only delivery. It challenges assumptions and builds genuine empathy.',
    resources: [],
  },
  '5.3-D-3': {
    actions: ['Create a centralised accessibility resource hub on your staff intranet with guides, videos, and quick-reference cards.', 'Include links to key external resources: JobAccess, Australian Human Rights Commission, People with Disability Australia.', 'Provide equipment-specific guides, floor plans showing accessibility features, and escalation contacts.', 'Update resources when new equipment is installed, services change, or feedback identifies knowledge gaps.', 'Make resources available in accessible formats and promote them regularly through internal communications.'],
    reasoning: 'Ongoing access to resources ensures staff can look up information between training sessions, handle unfamiliar situations, and continuously deepen their understanding.',
    resources: [],
  },
  '5.3-D-4': {
    actions: ['Dedicate a specific training module to non-apparent disabilities, covering mental health, chronic conditions, neurodivergence, and invisible physical disabilities.', 'Emphasise that staff should never assume someone does or does not have a disability based on appearance.', 'Cover the Sunflower Lanyard scheme for hidden disabilities and how to respond appropriately.', 'Include scenarios where non-apparent disability affects service interactions (e.g., cognitive fatigue, sensory overload, chronic pain).', 'Reference the DDA definition of disability, which explicitly includes conditions that may not be visible.'],
    reasoning: 'Hidden and non-apparent disabilities (chronic pain, mental health conditions, autism, epilepsy, diabetes) affect more people than visible disabilities. Staff who only recognise visible disability will miss the majority of access needs.',
    resources: [],
  },
  '5.3-D-5': {
    actions: ['Train staff on communication techniques for different disabilities: facing Deaf people when speaking, offering written communication, allowing extra time for speech differences, using plain language for cognitive access.', 'Teach basic Auslan greetings and key service phrases relevant to your context.', 'Train staff to use communication boards, picture exchange systems, or digital AAC tools available at your premises.', 'Cover phone and digital communication accessibility including TTY/relay services, email alternatives, and SMS options.', 'Practice techniques through role-play scenarios during training sessions.'],
    reasoning: 'Effective communication is fundamental to service delivery. Staff who lack techniques for communicating with people who are Deaf, blind, or have speech or cognitive differences will create barriers regardless of physical accessibility.',
    resources: [],
  },
  '5.3-D-6': {
    actions: ['Train all staff on the Personal Emergency Evacuation Plan (PEEP) process and their role in assisting people with disability during evacuation.', 'Cover the location and use of evacuation equipment such as evacuation chairs, refuge areas, and visual/auditory alarms.', 'Include people with disability in evacuation drills at least twice per year, as required under WHS regulations.', 'Designate specific staff as evacuation wardens for areas likely to have people with disability (accessible seating, ground floor, lifts).', 'Review and update evacuation procedures after every drill, following AS 3745:2010 Planning for emergencies in facilities.'],
    reasoning: 'Accessible emergency evacuation is a legal obligation under WHS legislation and the Premises Standards. Untrained staff may inadvertently leave people with disability behind during an emergency.',
    resources: [],
  },
  '5.3-D-7': {
    actions: ['Evaluate training at multiple levels: participant satisfaction (Level 1), knowledge gain (Level 2), behaviour change (Level 3), and customer outcomes (Level 4) using the Kirkpatrick model.', 'Collect post-training feedback surveys from all participants immediately after and at 3-month follow-up.', 'Use mystery shopping or observational audits by people with disability to assess real-world behaviour change.', 'Compare accessibility complaint volumes and customer satisfaction data before and after training rollout.', 'Use evaluation findings to continuously improve training content and delivery methods.'],
    reasoning: 'Without evaluation, you cannot determine whether training is changing staff behaviour, improving customer experiences, or representing good value for investment.',
    resources: [],
  },
  '5.3-D-8': {
    actions: ['Designate an accessibility champion or coordinator as the primary contact for staff accessibility queries.', 'Publish the contact details prominently on staff intranet, in break rooms, and in onboarding materials.', 'Establish an escalation pathway: front-line staff to team leader to accessibility coordinator to external specialist.', 'Provide the accessibility contact with authority and budget to resolve issues quickly.', 'Consider establishing a network of accessibility champions across teams and locations for distributed support.'],
    reasoning: 'Staff confidence in handling accessibility queries depends on knowing who to escalate to. Without a clear contact, staff may give incorrect information or fail to resolve issues for customers with disability.',
    resources: [],
  },
  '5.3-D-9': {
    actions: ['Include Auslan awareness and basic Deaf culture in your disability training program.', 'Teach staff basic Auslan greetings and key service phrases relevant to your organisation.', 'Train staff to book Auslan interpreters through accredited providers (NAATI-certified) and use video relay services.', 'Ensure staff understand the difference between Deaf (cultural identity) and deaf/hard of hearing, and ask individuals about their preferred communication method.', 'Provide information about the National Relay Service (NRS) options including TTY, Speak and Listen, SMS Relay, and Video Relay.'],
    reasoning: 'Australia has approximately 30,000 Auslan users. Staff awareness of Auslan and Deaf culture ensures respectful, effective service for Deaf and hard of hearing customers.',
    resources: [],
  },
  '5.3-F-1': {
    actions: ['Deliver disability awareness training to 100% of customer-facing staff, including casual and seasonal workers.', 'Use training developed or co-delivered by people with lived experience of disability, as recommended by the Australian Human Rights Commission.', 'Cover the social model of disability, respectful language, practical assistance techniques, and your organisation-specific accessibility features.', 'Include role-specific scenarios relevant to each staff member job function.', 'Achieve a minimum training completion rate of 95% and track this as a DIAP KPI.'],
    reasoning: 'Customer-facing staff are the human touchpoint that can make or break an accessible experience. Without training, well-intentioned staff may inadvertently create barriers or cause offence.',
    resources: [],
  },
  '5.3-F-2': {
    actions: ['Add a dedicated disability awareness module to your standard onboarding program for all new starters.', 'Cover your accessibility policy, DIAP commitments, adjustment request process, and key accessibility features of your premises.', 'Include a guided tour of accessibility features (accessible toilets, hearing loops, quiet spaces, evacuation points) during physical orientation.', 'Provide new starters with an accessibility quick-reference guide specific to their role.', 'Ensure the onboarding module is itself accessible (captioned videos, screen reader compatible content, Auslan option).'],
    reasoning: 'Including disability awareness from day one in onboarding establishes expectations early and ensures every new employee understands their role in creating an inclusive experience.',
    resources: [],
  },
  '5.3-F-3': {
    actions: ['Create a register of all accessibility features and equipment at your premises (hearing loops, portable ramps, wheelchairs, communication boards, etc.).', 'Develop short how-to guides or videos for each piece of equipment, stored in an accessible location (e.g., staff intranet, laminated at point of use).', 'Include hands-on equipment training in onboarding and annual refresher sessions.', 'Assign responsibility for regular equipment checks and maintenance to specific staff roles.', 'Test equipment knowledge through practical demonstrations during training assessments.'],
    reasoning: 'Accessibility equipment is only effective if staff know how to operate and offer it. Unused hearing loops, portable ramps, and communication boards represent wasted investment.',
    resources: [],
  },
  // Module 5.4
  '5.4-D-1': {
    actions: ['Include accessibility questions in your standard supplier questionnaire or pre-qualification process.', 'Ask suppliers about their own DIAP, accessibility testing practices, and track record of supplying accessible products.', 'Request evidence of accessibility compliance such as audit reports, VPATs, or certification.', 'Ask about the supplier experience of working with people with disability as customers, employees, or testers.', 'Document supplier responses and use them as part of your evaluation scoring.'],
    reasoning: 'Asking suppliers about their accessibility practices signals that accessibility matters to your organisation and helps identify suppliers who genuinely prioritise inclusion.',
    resources: [],
  },
  '5.4-D-10': {
    actions: ['Set a measurable social procurement target for disability enterprises (e.g., 3-5% of addressable spend within 3 years).', 'Align targets with your state government social procurement framework if applicable (e.g., Victorian Social Procurement Framework).', 'Report progress against targets in your annual report, DIAP, and social impact reporting.', 'Identify procurement categories where disability enterprises can compete effectively and actively seek them out.', 'Join buying cooperatives or networks that facilitate purchasing from disability enterprises.'],
    reasoning: 'Social procurement targets create accountability and drive systemic change by directing spending toward organisations that employ and are led by people with disability.',
    resources: [],
  },
  '5.4-D-11': {
    actions: ['Ensure tender documents are available in accessible formats (tagged PDF, Word, HTML) and your e-procurement platform meets WCAG 2.2 Level AA.', 'Offer alternative submission methods (email, post, in-person) alongside online portals.', 'Allow reasonable extensions for suppliers who require additional time due to disability.', 'Write tender documents in plain language with clear evaluation criteria.', 'Include a statement in all tenders inviting suppliers to request adjustments to participate in the procurement process.'],
    reasoning: 'If your tender process itself is inaccessible (complex forms, tight timelines, inaccessible platforms), you exclude suppliers with disability from competing and miss diverse perspectives.',
    resources: [],
  },
  '5.4-D-12': {
    actions: ['Include accessibility remediation costs in total cost-of-ownership calculations for all significant purchases.', 'Factor in potential costs of complaints, legal action, and reputational damage from inaccessible products.', 'Calculate the customer and staff productivity benefits of accessible products (e.g., reduced support calls, faster task completion).', 'Compare the cost of buying accessible from the start versus retrofitting accessibility later.', 'Present total cost-of-ownership analysis to decision-makers alongside upfront price comparisons.'],
    reasoning: 'A cheaper inaccessible product often costs more over its lifetime when remediation, complaints, lost customers, and legal risk are factored in. Total cost of ownership reveals the true value of accessible procurement.',
    resources: [],
  },
  '5.4-D-2': {
    actions: ['Weight accessibility performance in your supplier evaluation scorecard (e.g., 10-15% of total evaluation).', 'Give preference to suppliers who can demonstrate accessibility conformance with evidence, not just self-declaration.', 'Include accessibility as a factor in preferred supplier agreements and panel arrangements.', 'Track and report the percentage of procurement spend with accessibility-conformant suppliers.', 'Communicate your accessibility expectations to the supplier market through pre-tender briefings.'],
    reasoning: 'Prioritising accessible suppliers rewards good practice, drives market change, and reduces the risk of procuring products or services that create barriers for your customers or staff.',
    resources: [],
  },
  '5.4-D-3': {
    actions: ['Include accessibility acceptance testing in your procurement acceptance process for all relevant purchases.', 'Commission independent accessibility audits for significant technology or infrastructure purchases.', 'Test digital products with assistive technologies (screen readers, keyboard-only navigation, magnification) before accepting delivery.', 'Require the supplier to remediate identified accessibility defects within a specified timeframe at their cost.', 'Involve people with disability in user acceptance testing where possible.'],
    reasoning: 'Without verification, accessibility requirements in contracts are merely aspirational. Testing delivered products against stated standards ensures you receive what you paid for.',
    resources: [],
  },
  '5.4-D-4': {
    actions: ['Identify Australian Disability Enterprises and disability-led businesses relevant to your procurement categories through the ADE directory.', 'Set a social procurement target for spending with disability enterprises (e.g., percentage of addressable spend).', 'Include disability enterprise participation requirements in relevant tenders.', 'Partner with organisations like Social Traders or Supply Nation (for First Nations disability enterprises) to identify suppliers.', 'Report social procurement outcomes in your annual report and DIAP progress updates.'],
    reasoning: 'Purchasing from Australian Disability Enterprises (ADEs) and disability-led businesses supports economic participation of people with disability and aligns with social procurement objectives.',
    resources: [],
  },
  '5.4-D-5': {
    actions: ['Require all ICT purchases to meet WCAG 2.2 Level AA and EN 301 549 (European ICT accessibility standard, widely referenced in Australia).', 'Request VPATs or Accessibility Conformance Reports from all technology vendors before purchase.', 'Test ICT products with assistive technologies during the evaluation phase, not after deployment.', 'Include accessibility compliance as a mandatory (pass/fail) criterion for ICT procurement, not just a desirable.', 'Reference the Australian Government ICT Procurement Framework accessibility requirements as a benchmark.'],
    reasoning: 'ICT products are used daily by staff and customers. Inaccessible technology creates persistent barriers and may breach DDA and WCAG obligations for digital services.',
    resources: [],
  },
  '5.4-D-6': {
    actions: ['Develop a venue accessibility checklist covering entrances, pathways, toilets, hearing loops, lighting, signage, and emergency egress.', 'Require venue operators to confirm accessibility features in writing before booking.', 'Conduct or commission a physical accessibility audit for venues used regularly or for major events.', 'Include accessibility compliance as a non-negotiable requirement in venue hire contracts.', 'Maintain a register of vetted accessible venues for staff use when organising meetings and events.'],
    reasoning: 'Selecting inaccessible venues or partner locations for events, meetings, or collaborations excludes people with disability and undermines your inclusion commitments.',
    resources: [],
  },
  '5.4-D-7': {
    actions: ['Include an accessibility subject matter expert (internal or external consultant) in evaluation panels for significant procurements.', 'Provide procurement staff with accessibility training covering key standards (WCAG, AS 1428.1, EN 301 549) relevant to common purchases.', 'Develop procurement decision guides that outline minimum accessibility requirements by category.', 'Create a procurement accessibility helpdesk or advisory service that buyers can consult.', 'Engage external accessibility consultants for complex or high-value procurements.'],
    reasoning: 'Procurement teams often lack accessibility expertise. Including specialist input in decision-making ensures requirements are technically sound and purchases genuinely deliver accessible outcomes.',
    resources: [],
  },
  '5.4-D-8': {
    actions: ['Include accessibility performance review clauses in contracts, requiring annual accessibility audits or conformance reports.', 'Schedule periodic accessibility spot-checks of key supplier deliverables.', 'Require suppliers to notify you of any changes that may affect accessibility and to remediate any regressions.', 'Include accessibility as a topic in regular supplier performance reviews.', 'Maintain an escalation process for accessibility failures, including contract remedies and termination for persistent non-compliance.'],
    reasoning: 'Ongoing supplier monitoring ensures accessibility does not degrade over time, particularly for technology platforms that receive regular updates which may introduce new barriers.',
    resources: [],
  },
  '5.4-D-9': {
    actions: ['Require key partners to provide evidence of their accessibility commitment (DIAP, policy, certification, or track record).', 'Include accessibility in partnership agreements and memoranda of understanding.', 'Share your accessibility expectations and resources with partners to support their development.', 'Jointly review accessibility outcomes with partners at least annually.', 'Consider accessibility track record when renewing or extending partnership agreements.'],
    reasoning: 'Partners and suppliers who share your accessibility commitment create a consistent, end-to-end inclusive experience. Partners with poor practices undermine your own efforts.',
    resources: [],
  },
  '5.4-F-1': {
    actions: ['Add accessibility as a weighted evaluation criterion in your procurement assessment framework.', 'Develop an accessibility requirements checklist for common procurement categories (technology, furniture, signage, services, venues).', 'Train procurement staff on disability access requirements and how to assess supplier accessibility claims.', 'Reference the Australian Government Digital Service Standard and WCAG 2.2 for ICT procurement.', 'Align procurement accessibility requirements with your DIAP commitments.'],
    reasoning: 'Procurement decisions lock in accessibility (or inaccessibility) for years. Choosing inaccessible products or services creates barriers that are expensive to retrofit and may breach DDA obligations.',
    resources: [],
  },
  '5.4-F-2': {
    actions: ['Include specific accessibility clauses in all contracts and tender documents, referencing relevant standards (WCAG 2.2, AS 1428.1:2021, EN 301 549).', 'Require suppliers to provide a VPAT (Voluntary Product Accessibility Template) or accessibility conformance report with their response.', 'Include accessibility acceptance criteria in contracts, with the right to reject deliverables that do not meet stated accessibility standards.', 'Add ongoing accessibility maintenance and remediation obligations for the contract duration.', 'Use the Australian Government model accessibility clauses as a starting template.'],
    reasoning: 'Contract clauses create enforceable obligations. Without accessibility requirements in contracts, suppliers have no obligation to deliver accessible products or maintain accessibility over time.',
    resources: [],
  },
  // Module 5.5
  '5.5-D-1': {
    actions: ['Conduct formal accessibility audits covering physical premises (against AS 1428.1:2021 and Premises Standards 2010), digital platforms (WCAG 2.2 AA), and service delivery.', 'Engage accredited access consultants who are members of the Association of Consultants in Access Australia (ACAA) for built environment audits.', 'Schedule full audits annually and targeted audits after any significant changes to premises, services, or technology.', 'Include user testing with people with disability as part of the audit methodology.', 'Maintain an audit findings register with remediation actions, owners, and target dates.'],
    reasoning: 'Regular accessibility audits provide objective, evidence-based assessment of your current state, identify emerging barriers, and create a prioritised remediation plan.',
    resources: [],
  },
  '5.5-D-10': {
    actions: ['Add disability-specific questions to your customer satisfaction surveys (e.g., "Were your accessibility needs met?", "How easy was it to access our services?").', 'Offer survey completion in multiple accessible formats (online, phone, Easy Read, Auslan video).', 'Analyse satisfaction data for customers with disability separately and compare to overall satisfaction scores.', 'Use Net Promoter Score or similar metrics segmented by disability status to track loyalty and advocacy.', 'Act on findings with specific improvement actions and report results back to respondents.'],
    reasoning: 'Generic customer satisfaction surveys miss the specific experiences of people with disability. Targeted measurement reveals whether your accessibility efforts are translating into better experiences.',
    resources: [],
  },
  '5.5-D-11': {
    actions: ['Create an accessibility-specific category in your complaints management system.', 'Train complaints staff to correctly categorise accessibility-related complaints, including those that are not explicitly framed as disability issues.', 'Report accessibility complaint volumes, themes, and resolution times separately in leadership reports.', 'Benchmark complaint volumes against customer numbers and accessibility investment to track return on effort.', 'Use complaint data to inform DIAP priorities and demonstrate compliance with reasonable adjustment obligations.'],
    reasoning: 'Separating accessibility complaints from general complaints reveals the true volume and nature of accessibility issues, enabling targeted improvement and demonstrating DIAP accountability.',
    resources: [],
  },
  '5.5-D-12': {
    actions: ['Develop a 3-5 year accessibility roadmap aligned with your DIAP, strategic plan, and capital works program.', 'Phase improvements logically: foundational compliance first, then enhanced access, then innovation and leadership.', 'Include milestone checkpoints and stage-gate reviews to adjust priorities based on progress and changing circumstances.', 'Align the roadmap with major planned investments (renovations, technology replacements, service redesigns) to embed accessibility into existing budgets.', 'Present the roadmap to the Board for endorsement and publish a summary version externally.'],
    reasoning: 'Annual goals risk a piecemeal approach. A multi-year roadmap ensures strategic, sequenced investment that builds capability progressively toward a mature accessibility program.',
    resources: [],
  },
  '5.5-D-13': {
    actions: ['Present accessibility case studies and learnings at industry conferences, webinars, and sector forums.', 'Publish blog posts, articles, or reports about your accessibility journey, including challenges and failures, not just successes.', 'Contribute to industry working groups developing accessibility guidelines or standards for your sector.', 'Mentor peer organisations that are earlier in their accessibility journey.', 'Share tools, templates, and resources you have developed with the broader sector (e.g., checklists, training materials, audit frameworks).'],
    reasoning: 'Sharing learnings accelerates progress across your industry, builds your reputation as an accessibility leader, and contributes to the broader goal of a more accessible Australia.',
    resources: [],
  },
  '5.5-D-2': {
    actions: ['Define accessibility KPIs across key areas: physical access compliance percentage, digital WCAG conformance score, training completion rate, complaint resolution time, and customer satisfaction.', 'Establish baseline measurements for each KPI and set improvement targets.', 'Collect data through regular audits, customer surveys, complaint registers, and training management systems.', 'Report KPIs to leadership monthly or quarterly through an accessibility dashboard.', 'Review and refine KPIs annually to ensure they remain meaningful and aligned with strategic priorities.'],
    reasoning: 'Metrics and KPIs provide objective evidence of progress, enable benchmarking, and support data-driven decision-making about where to focus accessibility investment.',
    resources: [],
  },
  '5.5-D-3': {
    actions: ['Publish your accessibility policy, DIAP, and annual progress reports on your website in accessible formats.', 'Include an honest assessment of current accessibility strengths and known gaps.', 'Provide specific details about accessibility features at your premises and services, not just generic statements.', 'Publish your digital accessibility conformance level and any known WCAG issues with remediation timelines.', 'Make published information easy to find from your homepage (within 2 clicks maximum).'],
    reasoning: 'Public transparency about accessibility builds trust with the disability community, demonstrates accountability, and positions your organisation as a genuine inclusion leader.',
    resources: [],
  },
  '5.5-D-4': {
    actions: ['Participate in industry accessibility benchmarking programs such as the Australian Network on Disability Access and Inclusion Index.', 'Compare your DIAP actions and outcomes against similar organisations in your sector.', 'Review accessibility leaders in your industry (both domestic and international) for ideas and targets.', 'Attend sector conferences and forums focused on accessibility to learn from peer organisations.', 'Use benchmarking data to set stretch targets and identify quick wins from peer practices.'],
    reasoning: 'Benchmarking reveals how your accessibility compares to peers and identifies practices you can adopt from leading organisations in your sector.',
    resources: [],
  },
  '5.5-D-5': {
    actions: ['Conduct a root cause analysis for every accessibility complaint or incident, not just surface-level resolution.', 'Identify whether the issue is systemic (policy, process, design) or situational (individual, one-off) and address accordingly.', 'Track complaint themes and trends quarterly to identify patterns requiring strategic intervention.', 'Close the feedback loop by informing complainants of actions taken to prevent recurrence.', 'Share de-identified learnings across the organisation to build collective understanding.'],
    reasoning: 'Complaints and incidents contain valuable intelligence about real barriers. Systematic learning from these events prevents recurrence and drives genuine improvement.',
    resources: [],
  },
  '5.5-D-6': {
    actions: ['Commission external accessibility audits from accredited consultants at least every 2-3 years for physical premises and annually for digital platforms.', 'Engage auditors who are ACAA members for built environment reviews and who use WCAG-EM methodology for digital audits.', 'Request audits that include testing by people with disability, not just technical compliance checking.', 'Obtain a written audit report with prioritised findings, remediation recommendations, and estimated costs.', 'Track remediation progress against external audit findings and commission re-audit to verify completion.'],
    reasoning: 'External audits provide independent, expert assessment that is more objective than internal reviews and carries greater credibility with stakeholders and regulators.',
    resources: [],
  },
  '5.5-D-7': {
    actions: ['Establish ongoing relationships with disability organisations relevant to your sector and location.', 'Invite disability organisations to participate in advisory panels, user testing, and service design activities.', 'Offer fair payment for community engagement time and expertise.', 'Conduct regular accessibility feedback sessions (in-person and online) with customers with disability.', 'Partner with disability organisations for annual accessibility reviews and DIAP consultations.'],
    reasoning: 'Disability organisations and community members provide authentic insight into lived experience barriers that audits and metrics alone cannot capture.',
    resources: [],
  },
  '5.5-D-8': {
    actions: ['Subscribe to key Australian accessibility information sources: AHRC updates, Australian Network on Disability newsletters, Centre for Accessibility Australia, and W3C WAI updates.', 'Attend accessibility conferences and webinars (e.g., A11y Camp, OZeWAI, GAAD events).', 'Assign a staff member or team to monitor accessibility developments and brief the organisation regularly.', 'Join industry accessibility working groups or communities of practice.', 'Pilot emerging accessibility technologies (e.g., AI captioning, indoor navigation, sensory wayfinding) to evaluate their potential.'],
    reasoning: 'Accessibility standards, technologies, and community expectations evolve rapidly. Organisations that stay informed can adopt improvements proactively rather than reactively.',
    resources: [],
  },
  '5.5-D-9': {
    actions: ['Recognise staff accessibility contributions through existing awards or a dedicated accessibility champion award.', 'Celebrate International Day of People with Disability (3 December) and Global Accessibility Awareness Day (third Thursday of May) with organisation-wide activities.', 'Share accessibility success stories in internal and external communications.', 'Acknowledge team and individual contributions to DIAP milestones in leadership communications.', 'Nominate for external accessibility awards to benchmark and celebrate your achievements.'],
    reasoning: 'Celebrating achievements reinforces positive culture change, motivates ongoing effort, and publicly signals that accessibility is valued by the organisation.',
    resources: [],
  },
  '5.5-F-1': {
    actions: ['Conduct a formal accessibility performance review at least annually, covering physical access, digital access, customer experience, and employment.', 'Use a structured assessment framework aligned with your DIAP outcome areas.', 'Include quantitative metrics (audit scores, complaint volumes, training completion) and qualitative data (customer stories, staff observations).', 'Present findings to senior leadership with clear recommendations and resource requirements.', 'Use review findings to update your DIAP priorities and budget allocation for the next period.'],
    reasoning: 'Regular performance review identifies whether accessibility investments are delivering outcomes and where new barriers have emerged, supporting continuous improvement and DIAP compliance.',
    resources: [],
  },
  '5.5-F-2': {
    actions: ['Set SMART accessibility improvement goals (Specific, Measurable, Achievable, Relevant, Time-bound) for each DIAP outcome area.', 'Include both short-term targets (quarterly or annual) and longer-term aspirations (3-5 years).', 'Align goals with Australia Disability Strategy 2021-2031 outcome areas and your state DIAP framework.', 'Communicate goals to all staff and stakeholders so everyone understands priorities.', 'Review and adjust goals annually based on performance data and changing circumstances.'],
    reasoning: 'Without specific, measurable goals, accessibility remains aspirational. Goals create accountability, enable progress tracking, and communicate what the organisation is working toward.',
    resources: [],
  },
  '5.5-F-3': {
    actions: ['Report accessibility progress to your Board or senior leadership at least quarterly.', 'Publish an annual accessibility progress report publicly, aligned with your DIAP reporting obligations.', 'Include accessibility outcomes in your annual report alongside financial and operational performance.', 'Share progress with the disability community and advisory groups for transparency and feedback.', 'Use standardised reporting formats that allow year-on-year comparison of key metrics.'],
    reasoning: 'Reporting to leadership and stakeholders creates accountability, maintains momentum, and ensures accessibility receives the governance attention and resources needed for sustained progress.',
    resources: [],
  },
  // Module 6.1
  '6.1-D-1': {
    actions: ['Allocate a specific accessibility line item in your event budget (industry guidance suggests 5-15% of total event budget).', 'Include costs for Auslan interpreters, live captioning, audio description, accessible transport, equipment hire, and signage.', 'Budget for contingency accommodations to handle last-minute or on-the-day requests.', 'Track accessibility spending separately to build a cost evidence base for future events.', 'Apply for grants or subsidies that support accessible events (e.g., state arts, tourism, or community development funds).'],
    reasoning: 'Without a dedicated accessibility budget, accommodations compete with other event costs and are often the first to be cut, undermining inclusion commitments.',
    resources: [],
  },
  '6.1-D-10': {
    actions: ['Send a personalised confirmation to each attendee who requested accommodations at least 1 week before the event.', 'Include specific details of what has been arranged (e.g., "Auslan interpreter confirmed for Session 3", "wheelchair space reserved in Row B").', 'Provide a direct contact number for the day-of accessibility coordinator in case of issues.', 'Ask if the confirmed arrangements still meet their needs or if anything has changed.', 'Follow up on the day of the event to ensure accommodations are in place before the attendee arrives.'],
    reasoning: 'Confirming arrangements before the event gives attendees confidence, allows time to resolve issues, and demonstrates that their accommodation request was taken seriously and acted upon.',
    resources: [],
  },
  '6.1-D-11': {
    actions: ['Actively seek speakers, performers, and panellists with disability for your event program.', 'Ensure speaker calls and selection processes are accessible and include disability representation criteria.', 'Pay speakers with disability at the same rates as other speakers, plus cover any disability-related costs (support worker, accessible transport).', 'Ask all speakers about their presentation accessibility needs and provide accommodations (e.g., accessible stage, chair option, autocue, Auslan co-presenter).', 'Avoid tokenistic representation: include people with disability as experts on all topics, not just disability topics.'],
    reasoning: 'Representation of people with disability as speakers, performers, and panellists challenges stereotypes, provides role models, and ensures diverse perspectives are heard, not just accommodated.',
    resources: [],
  },
  '6.1-D-12': {
    actions: ['Designate a named accessibility contact person with their direct phone number and email on all event communications.', 'Ensure this person has authority and budget to arrange accommodations and resolve issues quickly.', 'Make the contact available before, during, and after the event (or designate a handover to an on-day contact).', 'Train the accessibility contact on common accommodation requests, your venue accessibility features, and emergency procedures for people with disability.', 'List the accessibility contact prominently on your event website, registration confirmation, and printed materials.'],
    reasoning: 'A named accessibility contact provides a clear escalation point, builds trust with attendees, and ensures someone has dedicated responsibility for resolving access issues.',
    resources: [],
  },
  '6.1-D-2': {
    actions: ['Invite people with diverse disabilities onto your event planning committee or advisory group.', 'Pay advisory participants for their time and expertise at professional consulting rates.', 'Consult on all aspects: venue selection, program design, communication, catering, and emergency planning.', 'Engage local disability organisations and peak bodies for broader community input.', 'Document how consultation has influenced event decisions and share this with participants.'],
    reasoning: 'Consulting people with disability during planning ensures the event genuinely meets access needs rather than relying on assumptions that may miss real barriers.',
    resources: [],
  },
  '6.1-D-3': {
    actions: ['Publish a detailed accessibility statement covering: venue access (entrances, lifts, ramps), accessible parking and transport, accessible toilets (including Changing Places), hearing services (loop, captioning, Auslan), vision services (audio description, large print), quiet/sensory spaces, service animal provisions, and emergency procedures.', 'Include a venue map showing accessible routes, facilities, and features.', 'Describe what is and is not accessible honestly, including known limitations or barriers.', 'Provide the statement in multiple formats (web page, downloadable PDF, Easy Read version).', 'Update the statement as event details are confirmed and after any venue changes.'],
    reasoning: 'A comprehensive event accessibility statement sets expectations, enables informed attendance decisions, and demonstrates proactive commitment to inclusion.',
    resources: [],
  },
  '6.1-D-4': {
    actions: ['Produce event promotional materials in accessible digital formats (HTML, accessible PDF) as a minimum.', 'Provide large print, Easy Read, and Auslan video versions for key promotional materials.', 'Ensure all images in promotional materials include descriptive alt text.', 'Caption all promotional videos and provide audio-described versions where visual content is significant.', 'Test promotional emails and social media content with assistive technologies before distribution.'],
    reasoning: 'Promotional materials in only one format exclude people who cannot access that format, whether due to vision, hearing, cognitive, or language barriers.',
    resources: [],
  },
  '6.1-D-5': {
    actions: ['Set the accommodation request deadline no earlier than the general registration deadline, and ideally allow requests up to 1-2 weeks before the event.', 'Accept late and on-the-day requests on a best-efforts basis and communicate this policy clearly.', 'Confirm accommodations with requestors at least 1 week before the event.', 'Have contingency plans for common last-minute requests (extra wheelchair spaces, dietary needs, quiet space access).', 'Follow up with all registrants who indicated accommodation needs to confirm arrangements are satisfactory.'],
    reasoning: 'Accommodation request deadlines that are too early or too rigid exclude people who register late or whose needs change, while no deadline at all makes preparation difficult.',
    resources: [],
  },
  '6.1-D-6': {
    actions: ['Offer concession pricing for attendees with disability, accepting recognised Australian concession and pension cards.', 'Provide free tickets for personal care attendants and support workers beyond the Companion Card scheme.', 'Consider offering a limited number of free tickets for people with disability who face financial hardship.', 'Ensure discounted ticket options are available through the same channels as full-price tickets (not requiring a separate process).', 'Clearly communicate pricing options and concession eligibility on your event website and registration page.'],
    reasoning: 'People with disability face higher costs of participation (transport, support, equipment). Discounted or free tickets reduce financial barriers and demonstrate genuine commitment to inclusion.',
    resources: [],
  },
  '6.1-D-7': {
    actions: ['Offer a virtual attendance option via an accessible streaming or video conferencing platform.', 'Ensure the virtual experience includes captioning, Auslan interpretation (picture-in-picture), and audio description where relevant.', 'Provide accessible interaction methods for virtual attendees (chat, Q&A, polls that work with screen readers).', 'Test the virtual platform for accessibility before the event using assistive technologies.', 'Record sessions and make accessible recordings available post-event for people who could not attend live.'],
    reasoning: 'Hybrid or virtual options enable participation by people who cannot attend in person due to mobility, fatigue, anxiety, immune compromise, or geographic barriers.',
    resources: [],
  },
  '6.1-D-8': {
    actions: ['Include accommodation options in volunteer and staff registration processes.', 'Ensure volunteer briefing materials and training are accessible (captioned videos, accessible documents, Auslan).', 'Provide flexible volunteer shift options to accommodate fatigue, medical needs, or support schedules.', 'Ensure staff and volunteer areas (break rooms, briefing spaces, storage) are physically accessible.', 'Actively recruit volunteers with disability through disability organisations and employment services.'],
    reasoning: 'Volunteers and staff with disability contribute valuable perspectives. Without accommodations, you lose this resource and send a message that inclusion applies only to attendees.',
    resources: [],
  },
  '6.1-D-9': {
    actions: ['Include accessibility requirements in all supplier and vendor contracts, specifying relevant standards.', 'Require vendors to confirm their stall setup, signage, and customer interactions meet your accessibility standards.', 'Brief all vendors on your event accessibility expectations and provide a vendor accessibility guide.', 'Conduct accessibility checks of vendor setups during bump-in before doors open.', 'Include accessibility compliance in vendor evaluation criteria for future events.'],
    reasoning: 'Supplier and vendor compliance ensures the entire event experience is accessible, not just the elements you control directly. Non-compliant vendors create barriers and liability.',
    resources: [],
  },
  '6.1-PC-1': {
    actions: ['Include accessibility as a standing item in your event planning checklist and project timeline from concept stage.', 'Appoint an accessibility lead or coordinator for each event with dedicated responsibility and budget authority.', 'Conduct an accessibility needs assessment during the planning phase, considering physical, sensory, cognitive, and communication access.', 'Consult with people with disability during event concept and design, not just as a review step before launch.', 'Reference the Australian Human Rights Commission event accessibility guidelines and your state event accessibility resources.'],
    reasoning: 'Embedding accessibility from the earliest planning stages avoids costly retrofits and ensures inclusion is designed in rather than bolted on after key decisions are made.',
    resources: [],
  },
  '6.1-PC-2': {
    actions: ['Include a dedicated accessibility section in all event promotion materials covering venue access, available services, and how to request accommodations.', 'Ensure promotional materials are themselves accessible: alt text on images, captioned videos, accessible PDFs, and WCAG 2.2 AA compliant web content.', 'Use the international accessibility symbol and describe available features in plain language, avoiding jargon.', 'Distribute promotional materials through disability community networks and organisations.', 'Provide a direct contact for accessibility queries in all promotional materials (name, phone, email).'],
    reasoning: 'Event promotion that lacks accessibility information prevents people with disability from determining whether they can attend, effectively excluding them before the event even begins.',
    resources: [],
  },
  '6.1-PC-3': {
    actions: ['Add an open-text accessibility accommodation request field to your registration form, supplemented by common options as checkboxes (Auslan, captioning, wheelchair space, dietary, quiet space).', 'Ensure the question is asked of all attendees in a normalised way, not requiring disability disclosure.', 'Set up a process to acknowledge accommodation requests within 2 business days and confirm arrangements at least 1 week before the event.', 'Train registration staff to handle accommodation requests confidentially and knowledgeably.', 'Ensure your registration platform is accessible (keyboard navigable, screen reader compatible, WCAG 2.2 AA).'],
    reasoning: 'Registration that includes accommodation requests ensures you can prepare appropriate support and is a reasonable adjustment obligation under the DDA 1992.',
    resources: [],
  },
  '6.1-PC-4': {
    actions: ['Register as a Companion Card affiliate through your state or territory program if not already affiliated.', 'Enable free companion tickets in your ticketing system when a valid Companion Card number is provided.', 'Clearly promote Companion Card acceptance on your event website, ticketing page, and at entry points.', 'Train ticketing and door staff to recognise and process Companion Cards smoothly.', 'Display the Companion Card logo alongside other accepted concession information.'],
    reasoning: 'The Companion Card scheme ensures people with disability who need attendant care can participate without bearing the cost of a second ticket, removing a significant financial barrier.',
    resources: [],
  },
  '6.1-PC-5': {
    actions: ['Ensure your online registration and ticketing platform meets WCAG 2.2 Level AA, including form labels, error handling, keyboard navigation, and screen reader compatibility.', 'Provide alternative registration methods (phone, email, in-person) for people who cannot use the online system.', 'Test the registration process with assistive technologies (screen readers, keyboard-only, magnification) before launch.', 'Ensure session timeouts are generous and provide warnings, particularly for people who need additional time to complete forms.', 'Include an accessibility help contact on the registration page for people experiencing barriers.'],
    reasoning: 'An inaccessible registration or ticketing process creates a barrier at the very first point of engagement, violating the DDA obligation to provide services without discrimination.',
    resources: [],
  },
  // Module 6.2
  '6.2-D-1': {
    actions: ['Conduct an accessibility site visit at least 4-6 weeks before the event to allow time for modifications.', 'Include a person with disability or an accredited access consultant in the site visit.', 'Assess all areas attendees will use: arrival, entrance, registration, session rooms, toilets, catering areas, quiet spaces, and emergency exits.', 'Document barriers found and agree on remediation actions with the venue operator.', 'Revisit during bump-in to verify that temporary setups (stalls, staging, cables) have not introduced new barriers.'],
    reasoning: 'A pre-event site visit identifies barriers that may not be apparent from venue marketing materials and allows time to arrange remediation or alternative solutions.',
    resources: [],
  },
  '6.2-D-10': {
    actions: ['Mark all stage and platform edges with high-contrast (luminance contrast ratio of at least 30%) edge strips per AS 1428.1:2021.', 'Install edge protection or guarding on platforms higher than 1000mm per AS 1657.', 'Ensure edge marking is maintained throughout the event (reapply tape if it loosens).', 'Provide tactile warning at the edge of any raised platform accessible to the public.', 'Brief performers and presenters on stage edge locations during sound check and rehearsal.'],
    reasoning: 'Undefined stage and platform edges are a fall hazard, particularly for people with vision impairment who may not perceive the drop-off. This is both a safety and legal compliance issue.',
    resources: [],
  },
  '6.2-D-11': {
    actions: ['Designate a secure, supervised area for storing mobility aids, wheelchairs, and equipment during events.', 'Locate the storage area near the main event space for easy retrieval.', 'Ensure the storage area is physically accessible and large enough to accommodate multiple items.', 'Provide a check-in/check-out system to prevent loss or damage.', 'Communicate the mobility aid storage option in your accessibility statement and on-site wayfinding.'],
    reasoning: 'Wheelchair users and people with mobility aids need a safe, supervised area to leave equipment when transferring to event seating or participating in activities.',
    resources: [],
  },
  '6.2-D-12': {
    actions: ['Develop a weather contingency plan that specifically addresses maintaining accessible routes in wet conditions.', 'Pre-position additional temporary pathway surfaces, non-slip matting, and drainage solutions.', 'Identify indoor or undercover alternatives for key event areas that can be activated if weather deteriorates.', 'Assign staff to monitor and maintain accessible pathways during wet weather.', 'Communicate weather contingency information to attendees who registered accessibility needs.'],
    reasoning: 'Wet weather can make outdoor event surfaces impassable for wheelchair users and dangerous for people with mobility impairments. Without a contingency plan, accessibility fails at the first drop of rain.',
    resources: [],
  },
  '6.2-D-13': {
    actions: ['Require all merchandise stalls and vendor stands to have step-free access and a clear approach path of at least 1200mm.', 'Ensure at least one section of each counter is at accessible height (750-850mm above floor level).', 'Require vendors to display menus, price lists, and product information at readable height and in minimum 18pt font.', 'Provide an accessible payment option at each stall (contactless payment at accessible height).', 'Include accessibility requirements in vendor agreements and check compliance during bump-in.'],
    reasoning: 'Merchandise stalls and vendor stands that are physically inaccessible or have high counters exclude wheelchair users and people with mobility impairments from participating in a core part of the event experience.',
    resources: [],
  },
  '6.2-D-14': {
    actions: ['Provide purpose-built elevated viewing platforms that can accommodate wheelchair users and companions.', 'Ensure platforms comply with AS 1657 for guarding, access ramps, and structural integrity.', 'Position platforms with optimal sightlines to the main stage or performance area.', 'Include platforms within the hearing loop coverage zone and with clear view of Auslan interpreters.', 'Manage platform capacity to prevent overcrowding while maximising access for people who need it.'],
    reasoning: 'Without elevated viewing, wheelchair users and people of short stature at standing or tiered events have their view blocked by standing crowds, effectively denying them the event experience they paid for.',
    resources: [],
  },
  '6.2-D-15': {
    actions: ['Install temporary accessible pathway surfaces (portable roadway panels, interlocking tiles, or heavy-duty matting) on all primary routes.', 'Ensure pathways are at least 1200mm wide (1800mm for two-way traffic) with a firm, stable, slip-resistant surface.', 'Extend accessible pathways to all key areas: entrance, stages, toilets, food vendors, quiet spaces, and emergency exits.', 'Secure pathway edges to prevent tripping and ensure smooth transitions between surfaces.', 'Inspect and maintain pathways throughout the event, particularly after rain or high foot traffic.'],
    reasoning: 'Temporary and outdoor venues often have surfaces that are impassable for wheelchairs and mobility aids. Accessible pathway surfaces transform an inaccessible site into a usable venue.',
    resources: [],
  },
  '6.2-D-16': {
    actions: ['Provide accessible buggies, golf carts, or shuttle vehicles with wheelchair ramps or lifts for large venue events.', 'Establish clearly marked accessible transport pick-up and drop-off points across the venue.', 'Ensure transport operates on regular schedules with short wait times, and is available on request.', 'Train transport drivers on disability awareness and safe wheelchair securing.', 'Communicate internal transport options and schedules in your accessibility statement and on-site signage.'],
    reasoning: 'Large-scale events with extensive grounds require internal transport options. Without accessible internal transport, wheelchair users face exhaustion or inability to reach distant areas.',
    resources: [],
  },
  '6.2-D-17': {
    actions: ['Provide accessible power outlets or dedicated charging stations for electric wheelchairs and mobility devices.', 'Locate charging points near the main event area and the quiet/rest space.', 'Offer both standard Australian power outlets and USB charging.', 'Sign charging locations on your event map and in your accessibility statement.', 'Ensure charging points are supervised or secure to prevent interference with equipment.'],
    reasoning: 'Electric wheelchair and powered mobility device users need charging access during long events. A flat battery can leave someone stranded and unable to move independently.',
    resources: [],
  },
  '6.2-D-18': {
    actions: ['Ensure all crowd management barriers have wheelchair-accessible gaps (minimum 900mm clear width) at regular intervals.', 'Use barriers that are detectable by cane (bottom rail no higher than 200mm above ground).', 'Provide a separate accessible queuing lane that bypasses narrow or stepped queue areas.', 'Brief crowd management and security staff on assisting people with disability through barrier systems.', 'Test barrier layouts with a wheelchair user during setup to verify accessibility.'],
    reasoning: 'Standard crowd barriers and queuing systems (rope barriers, retractable belts, narrow corridors) are often impassable for wheelchair users and create hazards for people with vision impairment.',
    resources: [],
  },
  '6.2-D-19': {
    actions: ['Designate accessible drop-off and pick-up areas as close to the main accessible entrance as possible.', 'Mark drop-off areas with high-contrast signage and the international accessibility symbol.', 'Assign traffic management staff to keep drop-off areas clear and assist attendees as needed.', 'Ensure the path from drop-off to entrance is step-free, well-lit, and weather-protected where possible.', 'Communicate drop-off location details (including GPS coordinates) in pre-event information and on event day via your app or social media.'],
    reasoning: 'Clearly marked and managed drop-off areas prevent people with disability from being stranded in traffic or walking long distances from uncontrolled drop-off points.',
    resources: [],
  },
  '6.2-D-2': {
    actions: ['Ensure the stage or presentation area has step-free access via a compliant ramp (1:14 gradient maximum per AS 1428.1) or platform lift.', 'Provide a lectern that is height-adjustable or offer an alternative presentation position for seated presenters.', 'Ensure adequate space on stage for a wheelchair user, Auslan interpreter, and any required support equipment.', 'Check that stage lighting does not create glare that impairs vision for presenters or the audience.', 'Test audio equipment (microphones, monitors) from the accessible presenter position before the event.'],
    reasoning: 'An inaccessible stage excludes speakers, performers, and presenters with disability from participating fully, contradicting inclusion commitments.',
    resources: [],
  },
  '6.2-D-3': {
    actions: ['Check whether the venue has a Changing Places facility or identify the nearest one using the Changing Places Australia locator.', 'If no Changing Places facility exists on-site, investigate hiring a mobile Changing Places unit for multi-day or large-scale events.', 'Communicate the availability and location of Changing Places facilities in your event accessibility statement.', 'Ensure Changing Places facilities are unlocked or accessible via a key from event staff during event hours.', 'Include Changing Places access in your venue selection criteria for future events.'],
    reasoning: 'Standard accessible toilets do not meet the needs of people with high support needs. Changing Places facilities with hoists and adult-sized change tables provide dignity and safety.',
    resources: [],
  },
  '6.2-D-4': {
    actions: ['Research and publish accessible transport options to the venue: accessible public transport stops/stations, accessible taxi and rideshare availability, and accessible shuttle services.', 'Arrange an accessible shuttle service from major accessible transport hubs to the venue for large events.', 'Ensure the path of travel from transport stops to the venue entrance is step-free and clearly signed.', 'Provide detailed transport information in your accessibility statement, including distances, gradients, and surface types from transport stops.', 'Coordinate with local accessible taxi providers to ensure availability at event start and finish times.'],
    reasoning: 'Accessible transport options determine whether people with disability can actually reach the event. Without transport information, a physically accessible venue may still be unreachable.',
    resources: [],
  },
  '6.2-D-5': {
    actions: ['Assess all ground surfaces for firmness, stability, and slip resistance as required by AS 1428.1:2021.', 'Provide temporary accessible pathway surfaces (e.g., portable roadway panels, rubber matting) over grass, gravel, sand, or uneven terrain.', 'Ensure pathways are at least 1200mm wide and free of lips, gaps, or sudden level changes greater than 5mm.', 'Maintain pathway surfaces throughout the event, especially in wet weather (have additional matting and barriers available).', 'Mark any unavoidable uneven surfaces or level changes with high-contrast tactile warning and signage.'],
    reasoning: 'Uneven, soft, or slippery surfaces prevent wheelchair and mobility aid users from moving safely through the event space and create trip and fall hazards for all attendees.',
    resources: [],
  },
  '6.2-D-6': {
    actions: ['Reserve accessible seating through the ticketing system so spaces are guaranteed for people who need them.', 'Assign stewards to manage accessible seating areas and ensure they remain available for ticket holders.', 'Provide a process for attendees to book accessible seating in advance during registration.', 'Have additional accessible seating options available for walk-up requests on the day.', 'Ensure companion seats are held adjacent to accessible spaces and released together.'],
    reasoning: 'Without active management, accessible seating may be taken by people who do not need it, leaving wheelchair users and others with disability without a place when they arrive.',
    resources: [],
  },
  '6.2-D-7': {
    actions: ['Provide an elevated viewing platform or raised area for wheelchair users and people of short stature at standing events.', 'Ensure the platform has step-free access, edge protection, and compliant guarding per AS 1657.', 'Locate the viewing area with clear sightlines to the stage and in the hearing loop coverage area.', 'Provide companion spaces adjacent to accessible viewing positions.', 'Assign stewards to manage access to the viewing area and prevent overcrowding.'],
    reasoning: 'At standing events (concerts, festivals, markets), wheelchair users and people of short stature cannot see over standing crowds without elevated viewing options.',
    resources: [],
  },
  '6.2-D-8': {
    actions: ['Route all cables and wiring away from pedestrian pathways where possible.', 'Cover all cables crossing pathways with high-contrast cable covers that are flush with the floor surface (no more than 5mm height change).', 'Secure temporary fixtures, A-frames, and equipment so they cannot be knocked into pathways.', 'Conduct trip hazard inspections at bump-in, before doors open, and periodically during the event.', 'Assign a safety officer to monitor and remediate trip hazards throughout the event duration.'],
    reasoning: 'Cables, temporary fixtures, and equipment are the leading cause of trip hazards at events. Unsecured wiring is particularly dangerous for people with vision impairment or mobility aids.',
    resources: [],
  },
  '6.2-D-9': {
    actions: ['Ensure at least one baby change facility is located within or adjacent to an accessible toilet.', 'Check that the baby change area has adequate circulation space for a wheelchair user (minimum 1500mm turning circle).', 'Verify the change table is at an accessible height or height-adjustable.', 'Include the location of accessible baby change facilities on your event map.', 'For outdoor events, ensure portable baby change facilities meet the same accessibility standards.'],
    reasoning: 'Parents with disability need accessible baby change facilities. Standard baby change rooms are often inaccessible, and accessible toilets rarely include baby change equipment.',
    resources: [],
  },
  '6.2-PC-1': {
    actions: ['Select venues that comply with AS 1428.1:2021 Design for access and mobility, covering entrances, corridors, ramps, lifts, and floor surfaces.', 'Verify that all public areas of the venue are step-free or have compliant ramp or lift access.', 'Check door widths meet the minimum 850mm clear opening width required under AS 1428.1.', 'Ensure pathways within the venue meet the minimum 1200mm width (1800mm for two-way traffic) with compliant gradient.', 'Conduct a venue accessibility audit or request the venue current access audit report before signing the hire agreement.'],
    reasoning: 'Physical venue accessibility is a fundamental legal requirement under the Premises Standards 2010 and the DDA 1992. Inaccessible venues exclude wheelchair users and people with mobility impairments entirely.',
    resources: [],
  },
  '6.2-PC-2': {
    actions: ['Ensure accessible parking spaces comply with AS/NZS 2890.6:2009, including the required number, dimensions (minimum 3200mm wide with shared area), and proximity to the accessible entrance.', 'Provide clearly signed accessible drop-off and pick-up zones as close to the main entrance as possible.', 'Ensure the path of travel from accessible parking and drop-off to the entrance is step-free, well-lit, and clearly marked.', 'Arrange traffic management to prevent accessible parking and drop-off zones from being blocked.', 'Communicate parking and drop-off information (including GPS coordinates or what3words addresses) in pre-event communications.'],
    reasoning: 'Accessible parking and drop-off are often the first physical touchpoint. Without them, people with disability may not be able to reach the event entrance.',
    resources: [],
  },
  '6.2-PC-3': {
    actions: ['Ensure accessible toilets comply with AS 1428.1:2021, including dimensions (minimum 2300mm x 1900mm for standard, larger for ambulant), grab rails, and circulation space.', 'Verify the number of accessible toilets meets the ratio required for your expected attendance (at least 1 per floor, more for large events).', 'Check that accessible toilets are clearly signed, unlocked (or with a key easily available), and maintained throughout the event.', 'For outdoor or temporary events, hire fully accessible portable toilets (not just standard portables with a wider door).', 'Include the location of accessible toilets on your event map and in your accessibility statement.'],
    reasoning: 'Accessible toilets are a non-negotiable legal requirement under the Premises Standards 2010 and a practical necessity for attendees with disability to be able to stay at the event.',
    resources: [],
  },
  '6.2-PC-4': {
    actions: ['Provide designated wheelchair spaces integrated within the general seating layout (not segregated at the back or sides).', 'Offer companion seating adjacent to wheelchair spaces so attendees can sit with their support person.', 'Include seating options with armrests, extra width, and extra legroom for people with mobility impairments or larger body types.', 'Provide chairs with back support as alternatives to bleacher or bench seating.', 'Ensure accessible seating locations have clear sightlines to the stage, screen, and Auslan interpreters.'],
    reasoning: 'Diverse seating options ensure people with different mobility and physical needs can attend comfortably, including wheelchair users, people who need extra legroom, and those who require back support.',
    resources: [],
  },
  '6.2-PC-5': {
    actions: ['Designate a quiet room or low-sensory area with comfortable seating, dim lighting, and minimal noise.', 'Locate the quiet space close to the main event area but acoustically separated.', 'Clearly sign the quiet space on your event map and wayfinding signage.', 'Provide sensory tools in the space (noise-cancelling headphones, fidget tools, weighted blankets) as recommended by Autism Spectrum Australia.', 'Ensure the quiet space is staffed or monitored for safety without being intrusive.'],
    reasoning: 'Quiet or low-sensory spaces are essential for autistic people, people with anxiety, sensory processing differences, or anyone experiencing sensory overload at events.',
    resources: [],
  },
  // Module 6.3
  '6.3-D-1': {
    actions: ['Add QR codes to key event signage linking to accessible web pages with equivalent information.', 'Ensure linked web content meets WCAG 2.2 Level AA and is optimised for mobile viewing.', 'Include QR codes on venue maps, session information, and accessibility feature signs.', 'Test QR codes with multiple devices and screen readers before printing.', 'Provide alternative access to QR-linked content for people who cannot scan codes (e.g., short URL, NFC tag, or text-to-number service).'],
    reasoning: 'QR codes linking to digital information provide a bridge between physical signage and detailed accessible content that can be read with screen readers, magnification, or translation tools.',
    resources: [],
  },
  '6.3-D-10': {
    actions: ['Write all event communications at a Year 8 reading level or below, following the Australian Government Style Manual plain language guidelines.', 'Use short sentences (15-20 words maximum), common words, and active voice.', 'Avoid jargon, acronyms (or explain them on first use), and complex sentence structures.', 'Test key communications with readability tools (e.g., Hemingway Editor) and with people who have cognitive disability.', 'Provide Easy Read versions of essential information (how to get there, what to bring, schedule, emergency contacts).'],
    reasoning: 'Plain language ensures event communications are understood by people with cognitive disability, people who speak English as an additional language, and the general public.',
    resources: [],
  },
  '6.3-D-11': {
    actions: ['Require your event app provider to confirm WCAG 2.2 Level AA compliance and compatibility with iOS VoiceOver and Android TalkBack.', 'Test the app with screen readers, keyboard navigation, and magnification before launch.', 'Ensure all app features (schedule, maps, notifications, Q&A, polls) are accessible.', 'Provide an accessible web alternative for attendees who cannot use the app.', 'Include accessibility testing in your app procurement criteria and contract requirements.'],
    reasoning: 'An inaccessible event app excludes attendees who rely on assistive technology from accessing the schedule, maps, notifications, and interactive features.',
    resources: [],
  },
  '6.3-D-2': {
    actions: ['Install tactile ground surface indicators (TGSIs) compliant with AS 1428.4.1:2009 at key decision points, hazards, and transitions.', 'Provide tactile maps or models of the event layout at the entrance and information desk.', 'Use tactile signage with raised text and Braille at room entrances and key locations per AS 1428.1.', 'Ensure handrails on ramps and stairs include Braille and tactile floor level indicators.', 'Brief orientation and mobility specialists about your tactile wayfinding setup if providing guided services.'],
    reasoning: 'Tactile wayfinding elements enable people with vision impairment to navigate independently using touch and texture, complementing visual signage.',
    resources: [],
  },
  '6.3-D-3': {
    actions: ['Create a sensory map that identifies noise levels, lighting conditions, crowd density, and sensory triggers in each area of the venue.', 'Mark quiet zones, sensory-friendly spaces, and areas with potential triggers (music stages, strobe lighting, smoke machines) clearly.', 'Provide the sensory map in advance on your event website and in your accessibility statement.', 'Offer printed and digital versions of the sensory map at the information desk.', 'Update the sensory map if conditions change during the event and communicate changes via your app or social media.'],
    reasoning: 'A sensory map helps neurodivergent attendees and people with sensory sensitivities plan their visit, identifying loud, bright, crowded, or calm areas across the venue.',
    resources: [],
  },
  '6.3-D-4': {
    actions: ['Develop a social story for your event following Autism Spectrum Australia (Aspect) guidelines.', 'Include photos or illustrations of: the approach and entrance, registration/check-in, the main event spaces, toilets, food areas, quiet spaces, and how to get help.', 'Describe what will happen at each stage, what it might feel, sound, and look like, and what the attendee can do if they feel overwhelmed.', 'Publish the social story at least 2 weeks before the event in PDF and web formats.', 'Share with disability organisations, schools, and support services in your promotion.'],
    reasoning: 'Social stories help autistic people and people with intellectual disability prepare for unfamiliar environments by providing a step-by-step visual narrative of what to expect.',
    resources: [],
  },
  '6.3-D-5': {
    actions: ['Communicate program changes via multiple channels simultaneously: PA, visual displays, event app push notifications, and SMS.', 'Ensure display screens showing schedule updates are at accessible height and in high-contrast, large text.', 'Brief volunteers and information desk staff on changes so they can communicate accurately to attendees who ask.', 'Directly notify attendees who booked accessibility accommodations if changes affect their arrangements.', 'Provide advance warning of changes where possible, allowing time for attendees to adjust plans.'],
    reasoning: 'Program changes and delays cause anxiety for many attendees, particularly those who are neurodivergent or have pre-arranged support (interpreters, carers). Accessible communication of changes is essential.',
    resources: [],
  },
  '6.3-D-6': {
    actions: ['Provide communication boards (picture-based and text-based) at the information desk and key service points.', 'Equip staff with a simple communication toolkit: pen and paper, a tablet with a text-to-speech app, and key phrases in Easy English.', 'Train staff to allow extra time for communication, use yes/no questions where helpful, and not finish sentences for the person.', 'Consider providing AAC (Augmentative and Alternative Communication) device lending for the event.', 'Include communication support information in your accessibility statement.'],
    reasoning: 'People with speech or communication differences (aphasia, motor speech disorders, autism, intellectual disability) need alternative communication methods to participate in the event and seek help.',
    resources: [],
  },
  '6.3-D-7': {
    actions: ['Provide a range of microphone options: lapel/lavalier, headset, handheld, and podium, so presenters can choose what suits them.', 'Ensure microphones can be operated one-handed and without fine motor control.', 'Position foldback monitors so seated presenters can hear audience questions.', 'Test the audio setup from the accessible presentation position during sound check.', 'Ask all presenters about their audio and equipment needs in advance and confirm arrangements.'],
    reasoning: 'Standard podium microphones and audio setups can exclude presenters with disability who use wheelchairs, have limited hand use, or need to move while presenting.',
    resources: [],
  },
  '6.3-D-8': {
    actions: ['Consider providing a digital wayfinding or event navigation app that is accessible (WCAG 2.2 AA, screen reader compatible, voice navigation).', 'Include indoor mapping with accessible route options that avoid stairs and uneven surfaces.', 'Integrate real-time information: schedule changes, wait times, and accessibility feature locations.', 'Test the app with assistive technologies and users with disability before the event.', 'Provide an alternative for attendees who do not use smartphones (printed maps, staffed assistance).'],
    reasoning: 'Digital wayfinding apps can provide turn-by-turn accessible navigation, real-time updates, and information in the user preferred format (audio, visual, large text).',
    resources: [],
  },
  '6.3-D-9': {
    actions: ['Provide all speakers with an accessible presentation guide covering: minimum 28pt font, high-contrast colours, alt text for images, captioned videos, and clear speech pace.', 'Require speakers to submit slides in advance so they can be checked for accessibility and provided to attendees who need them.', 'Brief speakers to describe visual content verbally for attendees with vision impairment.', 'Ask speakers to face the audience when speaking, use the microphone consistently, and pause for interpreters.', 'Provide a speaker accessibility checklist as part of your speaker pack.'],
    reasoning: 'Speakers who use small text, low-contrast slides, inaccessible videos, or speak too quickly create barriers for attendees with sensory, cognitive, or language differences.',
    resources: [],
  },
  '6.3-PC-1': {
    actions: ['Design event wayfinding signage to comply with AS 1428.1:2021 requirements for signage: high contrast (minimum 30% luminance contrast), sans-serif font, minimum character heights based on viewing distance.', 'Position signs at consistent heights and locations throughout the venue.', 'Use pictograms alongside text to support people with cognitive disability and those who speak languages other than English.', 'Ensure signs for accessible features (toilets, lifts, quiet spaces) use the international accessibility symbol.', 'Include tactile and Braille elements on key directional signs per AS 1428.1 Clause 8.'],
    reasoning: 'Clear wayfinding signage enables independent navigation for all attendees, with particular importance for people with vision impairment, cognitive disability, or those unfamiliar with the venue.',
    resources: [],
  },
  '6.3-PC-2': {
    actions: ['Provide event programs, schedules, and information in accessible digital formats (HTML, accessible PDF) and large print (minimum 18pt).', 'Offer Easy Read versions of key event information for people with cognitive disability.', 'Provide audio or Auslan video versions of event information on request.', 'Ensure printed materials use high-contrast colours, sans-serif fonts, and adequate spacing.', 'Make event information available in advance (not just on the day) so attendees can plan.'],
    reasoning: 'Event information in only one format excludes people who cannot access that format. Multiple accessible formats ensure everyone can engage with the event program and logistics.',
    resources: [],
  },
  '6.3-PC-3': {
    actions: ['Deliver all announcements in both auditory and visual formats simultaneously (PA system plus visual displays or text messages).', 'Ensure emergency announcements trigger visual alarms (flashing lights) in compliance with AS 1670.4 and the National Construction Code.', 'Use SMS or push notifications via your event app to supplement PA announcements for attendees with hearing impairment.', 'Brief announcers to speak clearly, at moderate pace, and face the audience when using microphones.', 'Ensure announcements are within hearing loop coverage areas.'],
    reasoning: 'Announcements that are only auditory exclude Deaf and hard of hearing attendees. Announcements that are only visual exclude people with vision impairment. Both situations create safety risks for emergency communications.',
    resources: [],
  },
  '6.3-PC-4': {
    actions: ['Set up a staffed information or help desk at a central, accessible location near the main entrance.', 'Ensure the desk has a lowered section (750-850mm) for wheelchair users.', 'Equip staff with communication aids (communication board, pen and paper, tablet for typing) and train them in disability awareness.', 'Display the accessibility symbol prominently and list available accessibility services at the desk.', 'Provide the desk phone number or app contact for attendees who need remote assistance within the venue.'],
    reasoning: 'An information or help desk provides a human touchpoint for attendees who need assistance, cannot navigate independently, or have accessibility questions.',
    resources: [],
  },
  // Module 6.4
  '6.4-D-1': {
    actions: ['Position Auslan interpreters on the stage beside the speaker, not in the audience or off to the side.', 'Ensure the interpreter is well-lit (face and hands clearly visible) with a plain, dark background.', 'Reserve front-row or near-front seating for Deaf attendees with clear sightlines to both the interpreter and the speaker/screen.', 'Provide interpreters in teams of two (minimum) who rotate every 20-30 minutes for sessions longer than 30 minutes.', 'Brief presenters on working with interpreters: pace, pausing for interpretation, and facing the audience.'],
    reasoning: 'Poorly positioned Auslan interpreters negate the benefit of providing the service. Deaf attendees need clear, well-lit sightlines to the interpreter and the speaker simultaneously.',
    resources: [],
  },
  '6.4-D-10': {
    actions: ['Implement a scent-aware policy requesting attendees, vendors, and staff to minimise fragrance use.', 'Communicate the policy in pre-event communications and at registration.', 'Use unscented cleaning products in event spaces and toilets.', 'Ensure food vendors manage cooking odours and position them considering airflow.', 'Provide a scent-free zone near the quiet space for attendees with chemical sensitivity.'],
    reasoning: 'Fragrances and strong scents can trigger migraines, asthma, anaphylaxis, and sensory distress for people with chemical sensitivity, asthma, or sensory processing differences.',
    resources: [],
  },
  '6.4-D-11': {
    actions: ['Maintain adequate ambient lighting (minimum 200 lux) in circulation areas, toilets, and wayfinding routes per AS 1680.1.', 'Avoid sudden transitions between very bright and very dark areas.', 'Ensure faces of speakers, interpreters, and information desk staff are well-lit for lip-reading.', 'Provide options for attendees with photosensitivity: dimmer areas, sunglasses availability, and advance notice of lighting effects.', 'Brief lighting technicians on accessibility requirements alongside artistic direction.'],
    reasoning: 'Poor or harsh lighting creates barriers for people with vision impairment, photosensitivity, migraine conditions, and epilepsy. Thoughtful lighting management supports access for diverse needs.',
    resources: [],
  },
  '6.4-D-12': {
    actions: ['Offer a pre-event touch tour or familiarisation visit for attendees with disability, scheduled 30-60 minutes before doors open.', 'Include tactile exploration of the venue layout, stage, key features, and accessibility facilities.', 'Provide a guided walk-through of accessible routes from entrance to all key areas.', 'Train tour guides in sighted guide techniques and descriptive narration.', 'Promote touch tour availability during registration and in your accessibility statement, with a booking mechanism.'],
    reasoning: 'Touch tours and pre-event familiarisation reduce anxiety, build confidence, and enable independent navigation for people with vision impairment, autism, or anxiety about unfamiliar environments.',
    resources: [],
  },
  '6.4-D-2': {
    actions: ['Display live captions on a dedicated screen or section of the main screen, positioned near the speaker for easy visual tracking.', 'Use minimum 48pt white text on a dark background with adequate line spacing.', 'Ensure captions are visible from all accessible seating areas, including wheelchair spaces.', 'Test captioning display with real content before the event to verify readability and latency.', 'Provide individual caption viewing options (tablet, phone app) as a supplement for attendees far from screens.'],
    reasoning: 'Live captioning display method significantly affects usability. Captions that are too small, poorly positioned, or laggy fail to provide meaningful access for people who are deaf or hard of hearing.',
    resources: [],
  },
  '6.4-D-3': {
    actions: ['Install or hire a hearing loop system compliant with AS 60118.4 (IEC 60118-4) for all event session areas.', 'Test the hearing loop with a field strength meter before the event to verify coverage and signal quality across the seating area.', 'Display the international hearing loop symbol at all entrances and within the looped area.', 'Provide portable hearing loop receivers with headphones for people whose hearing aids do not have telecoil.', 'Brief AV technicians to maintain audio input levels to the loop system throughout the event.'],
    reasoning: 'Hearing loops (audio induction loops) are a mandatory requirement in many public assembly areas under the Premises Standards 2010 (referencing AS 1428.5) and provide direct audio feed to hearing aids with telecoil.',
    resources: [],
  },
  '6.4-D-4': {
    actions: ['Provide live audio description for performances and presentations with significant visual content.', 'Engage professional audio describers with experience in your event type (theatre, conference, exhibition).', 'Deliver audio description via a dedicated audio channel (FM transmitter or app) and provide receivers/headsets.', 'Brief audio describers on the event content in advance and provide access to rehearsals where possible.', 'Communicate audio description availability in your event promotion and provide instructions for accessing the service.'],
    reasoning: 'Audio description makes visual content accessible to people with vision impairment, enabling them to engage with performances, presentations, and exhibitions on equal terms.',
    resources: [],
  },
  '6.4-D-5': {
    actions: ['Provide personal assistive listening devices (FM, infrared, or digital) for loan at the information desk.', 'Stock a range of receiver types with neckloops, headphones, and earbuds to suit different hearing aid configurations.', 'Ensure sufficient quantity (recommend 5-10% of expected attendance) and have a check-out/return system.', 'Test all devices before the event and have spare batteries available.', 'Train information desk staff to set up and explain devices to users.'],
    reasoning: 'Assistive listening devices supplement hearing loops by serving people in areas without loop coverage or those whose hearing aids lack telecoil functionality.',
    resources: [],
  },
  '6.4-D-6': {
    actions: ['Investigate haptic technology providers (e.g., SubPac, Woojer, or similar vibration-based wearables) for music events.', 'Provide haptic devices for loan at a dedicated accessibility equipment desk.', 'Position Deaf attendees using haptic devices near subwoofers or bass speakers for enhanced vibration experience.', 'Combine haptic devices with visual music interpretation (Auslan music interpreter, visual effects synchronised to music).', 'Promote haptic device availability in your accessibility statement and through Deaf community networks.'],
    reasoning: 'Haptic devices allow Deaf attendees to experience music through vibration, providing an alternative sensory experience that conveys rhythm, bass, and dynamics.',
    resources: [],
  },
  '6.4-D-7': {
    actions: ['Publish specific sensory trigger warnings on your event website, at the entrance, and in the program for every session that includes strobes, lasers, haze, pyrotechnics, or sudden loud effects.', 'Include trigger warnings in pre-event communications sent to all registrants.', 'Display warnings on screens before affected sessions begin, with countdown timing.', 'Provide specific information about the type, intensity, and duration of effects so attendees can make informed decisions.', 'Ensure the quiet space is available and staffed during sessions with sensory triggers.', 'Review strobe flash rates against the Ofcom guidance (no more than 3 flashes per second) to reduce seizure risk.'],
    reasoning: 'Strobe lights, pyrotechnics, and sudden loud noises can trigger seizures in people with photosensitive epilepsy, cause distress for autistic attendees, and exacerbate PTSD. Advance warnings are both a safety and legal obligation.',
    resources: [],
  },
  '6.4-D-8': {
    actions: ['Offer at least one relaxed or sensory-friendly session with reduced lighting, lower volume, no sudden effects, and a relaxed atmosphere.', 'Allow movement, noise, and different responses during relaxed sessions without judgment.', 'Reduce audience capacity for relaxed sessions to lower crowd density and noise.', 'Communicate relaxed session options prominently in your event promotion and accessibility statement.', 'Base your approach on the Relaxed Performance guidelines from Arts Access Australia.'],
    reasoning: 'Relaxed or sensory-friendly sessions provide access for people who cannot attend standard sessions due to sensory sensitivities, anxiety, or the need for a calmer environment.',
    resources: [],
  },
  '6.4-D-9': {
    actions: ['Provide visual music interpretation by Auslan music interpreters who convey rhythm, lyrics, and emotion through sign.', 'Synchronise visual effects (lighting, projections) with music to create a visual representation of the audio experience.', 'Offer tactile bass stations or vibrating floor panels near the stage for Deaf attendees.', 'Position Deaf attendees near speakers for maximum vibration transmission.', 'Consult with Deaf music enthusiasts and organisations (e.g., Deaf Australia) during planning to ensure the experience is genuinely meaningful.'],
    reasoning: 'Multi-sensory music experiences go beyond sound to include vibration, visual interpretation, and movement, making music events genuinely inclusive for Deaf and hard of hearing attendees.',
    resources: [],
  },
  '6.4-PC-1': {
    actions: ['Provide Auslan interpreters for all key sessions, booked through NAATI-certified providers with event experience.', 'Offer live captioning (CART or AI-assisted with human correction) displayed on screens visible from accessible seating areas.', 'Ensure hearing loop or hearing augmentation systems cover all main session areas, tested and certified before the event.', 'Communicate available hearing access services in your event promotion and accessibility statement.', 'Ask attendees about hearing access preferences during registration to right-size services.'],
    reasoning: 'Hearing access services are essential for the approximately 3.6 million Australians with hearing loss to participate in event content. Auslan, captioning, and hearing augmentation serve different needs.',
    resources: [],
  },
  '6.4-PC-2': {
    actions: ['Provide audio description for visual presentations, performances, and exhibitions where visual content is significant.', 'Offer large print programs, schedules, and key information (minimum 18pt, high contrast).', 'Provide event materials in accessible digital formats that work with screen readers.', 'Ensure good ambient lighting throughout the venue (minimum 200 lux in circulation areas per AS 1680.1).', 'Offer sighted guide assistance from trained volunteers for attendees who request it.'],
    reasoning: 'Vision access services enable people with low vision or blindness to engage with visual content, navigate the venue, and participate fully in the event experience.',
    resources: [],
  },
  '6.4-PC-3': {
    actions: ['Identify and communicate sensory triggers in each event area (volume levels, lighting effects, crowd density, scents).', 'Provide a quiet or low-sensory space with dim lighting, minimal noise, and comfortable seating.', 'Offer sensory kits (earplugs, noise-cancelling headphones, fidget tools, sunglasses) for loan at the information desk.', 'Consider offering a relaxed or sensory-friendly session with reduced lighting, lower volume, and no sudden effects.', 'Train all event staff to recognise signs of sensory distress and respond appropriately.'],
    reasoning: 'Events can be overwhelming sensory environments. Proactive sensory considerations enable neurodivergent attendees and people with sensory sensitivities to attend safely and comfortably.',
    resources: [],
  },
  // Module 6.5
  '6.5-D-1': {
    actions: ['Appoint a named accessibility manager for each event day with authority to make decisions and allocate resources.', 'Ensure the accessibility manager is easily identifiable (distinct lanyard, vest, or badge) and contactable by all staff.', 'Brief the accessibility manager on all pre-registered accommodation requests and the plan for each.', 'Provide the accessibility manager with a mobile phone number published to attendees for real-time issue reporting.', 'Conduct a handover briefing if the accessibility manager role is shared across shifts.'],
    reasoning: 'A designated accessibility lead on the day ensures there is one person with authority, knowledge, and responsibility to resolve access issues quickly and coordinate across teams.',
    resources: [],
  },
  '6.5-D-10': {
    actions: ['Deploy trained accessibility stewards in high-traffic areas, accessible seating sections, and near key accessibility features.', 'Equip stewards with radios or phones to communicate with the accessibility manager.', 'Train stewards on disability awareness, communication techniques, equipment operation, and emergency evacuation.', 'Make stewards easily identifiable with a distinctive vest, badge, or lanyard.', 'Position stewards proactively at transition points (entrances, lift queues, food areas) rather than only responding to requests.'],
    reasoning: 'Dedicated accessibility stewards provide on-the-ground support, proactive assistance, and rapid issue resolution that general event staff may not have the training or time to provide.',
    resources: [],
  },
  '6.5-D-11': {
    actions: ['Implement a flexible re-entry policy that accommodates disability-related reasons for temporary exit.', 'Train entry staff to process re-entry for people with disability efficiently and respectfully.', 'Use wristbands, hand stamps, or digital passes that allow re-entry without requiring explanation each time.', 'Communicate the re-entry policy in your accessibility statement and at entry points.', 'Ensure the re-entry process does not require queuing in the general admission line.'],
    reasoning: 'Strict no-re-entry policies disproportionately affect people with disability who may need to leave temporarily for medical reasons, sensory breaks, service animal relief, or medication.',
    resources: [],
  },
  '6.5-D-12': {
    actions: ['Register as a Sunflower lanyard recognised venue and train all staff to recognise the lanyard.', 'Stock Sunflower lanyards at the information desk for attendees who want one.', 'Train staff to offer proactive (but not intrusive) assistance to lanyard wearers: check-ins, priority queuing, quiet space directions.', 'Include Sunflower lanyard recognition in your accessibility statement and event promotion.', 'Display the Sunflower scheme logo at entry points and the information desk.'],
    reasoning: 'The Sunflower lanyard is widely recognised in Australia as an indicator of hidden disability. Recognition enables staff to offer proactive, discreet support without requiring disclosure.',
    resources: [],
  },
  '6.5-D-13': {
    actions: ['Ensure first aid staff are trained in disability-related emergencies: seizure management, anaphylaxis (EpiPen), diabetic emergencies, and respiratory distress.', 'Stock first aid stations with AEDs, EpiPens, glucose, and oxygen equipment beyond standard first aid kits.', 'Ensure the first aid area is physically accessible and located near the main event space.', 'Provide a medical information option during registration for attendees to share relevant medical conditions confidentially.', 'Have a clear communication protocol with local emergency services, including the accessible entrance and lift locations for paramedic access.', 'Ensure first aid staff can communicate with Deaf and non-verbal attendees (communication boards, basic Auslan).'],
    reasoning: 'People with disability may have complex medical needs requiring specialised first aid response. Standard first aid provisions may not cover seizure management, anaphylaxis, or diabetes emergencies.',
    resources: [],
  },
  '6.5-D-14': {
    actions: ['Include accessibility training requirements in all contractor and partner agreements.', 'Provide a condensed accessibility briefing for all contractors covering: respectful interaction, service animal policy, hearing loop/captioning awareness, and emergency evacuation roles.', 'Distribute your event accessibility quick-reference guide to all contractor staff.', 'Conduct spot checks during the event to verify contractor staff behaviour meets accessibility standards.', 'Include accessibility compliance in post-event contractor evaluation.'],
    reasoning: 'Third-party contractors (security, catering, AV, cleaning) interact directly with attendees. Without accessibility training, they become weak links in an otherwise accessible event.',
    resources: [],
  },
  '6.5-D-15': {
    actions: ['Train security staff on screening people with disability: wheelchair users (hand-held wand instead of walk-through detector), people with prosthetics, medical devices, and sensory sensitivities.', 'Offer a private screening option for people who request it.', 'Ensure security staff understand that medical devices, medication, and assistive technology must be permitted entry.', 'Provide a separate, calmer screening area for people who are distressed by standard screening queues and procedures.', 'Brief security staff that service animals must be permitted through screening without being separated from their handler.'],
    reasoning: 'Standard security screening (bag checks, metal detectors, pat-downs) can be distressing, confusing, or physically impossible for people with disability. Inaccessible screening creates barriers at the entry point.',
    resources: [],
  },
  '6.5-D-16': {
    actions: ['Develop a protocol for supporting distressed or disoriented attendees, including de-escalation techniques and safe spaces.', 'Train staff to recognise signs of distress (meltdown, shutdown, confusion, panic) and respond with calm, patient, non-judgmental support.', 'Provide a quiet space where distressed attendees can be taken to recover safely.', 'Have a reunification process for attendees separated from their group, including a designated meeting point and PA/text announcement capability.', 'Ensure the protocol covers communication with attendees who may not be able to verbally explain their needs.', 'Maintain emergency contact information for attendees who provided it during registration.'],
    reasoning: 'Attendees with cognitive disability, dementia, anxiety, or autism may become disoriented, distressed, or separated from their group. Without a plan, staff may respond inappropriately or the person may be at risk.',
    resources: [],
  },
  '6.5-D-17': {
    actions: ['Create an accommodation management checklist for the day, listing every pre-registered request and the responsible staff member.', 'Verify all accommodations are in place during bump-in: wheelchair spaces set up, interpreters confirmed and positioned, captioning tested, hearing loop active, quiet space ready.', 'Brief the accessibility manager on every accommodation and provide the attendee contact details in case of issues.', 'Conduct a mid-event check to confirm accommodations are still functioning and being maintained.', 'Follow up with attendees who requested accommodations during the event to confirm their needs are being met.'],
    reasoning: 'Pre-registered accommodations that are not actively managed on the day result in broken promises, exclusion, and loss of trust. Active management ensures that planning translates into delivery.',
    resources: [],
  },
  '6.5-D-2': {
    actions: ['Provide event feedback in multiple accessible formats: accessible online survey, paper form in large print, phone feedback line, and email option.', 'Include specific questions about the accessibility experience in your feedback survey.', 'Offer feedback options during the event (not just post-event) so issues can be resolved in real time.', 'Ensure online surveys meet WCAG 2.2 Level AA and are compatible with screen readers.', 'Analyse accessibility feedback separately and report findings to the event team and leadership.'],
    reasoning: 'Accessible feedback mechanisms ensure people with disability can share their experience, report barriers, and contribute to improvement. Inaccessible feedback forms exclude the very voices you most need to hear.',
    resources: [],
  },
  '6.5-D-3': {
    actions: ['Provide equipment for loan at a clearly signed, accessible equipment desk near the entrance.', 'Stock wheelchairs, hearing loop receivers, noise-cancelling headphones, magnifying devices, communication boards, and sensory kits.', 'Implement a simple check-out/return system (ID or phone number, not requiring a deposit that creates financial barriers).', 'Train desk staff to fit and explain each piece of equipment.', 'Ensure sufficient stock based on expected attendance and pre-registered requests.'],
    reasoning: 'Equipment loans enable attendees to access services they may not have brought their own equipment for, supporting independence and comfort.',
    resources: [],
  },
  '6.5-D-4': {
    actions: ['Empower the accessibility manager to approve and implement reasonable accommodations on the day without lengthy approval chains.', 'Maintain a contingency budget and equipment reserve for unplanned requests.', 'Brief all staff on the escalation process: direct attendees with accessibility requests to the information desk or accessibility manager immediately.', 'Document on-the-day requests and outcomes to improve pre-event planning for future events.', 'Have contact details for on-call Auslan interpreters, captioning services, and accessible transport providers for urgent requests.'],
    reasoning: 'Not all accessibility needs can be anticipated in advance. A responsive process for on-the-day requests demonstrates genuine commitment and meets the DDA reasonable adjustment obligation.',
    resources: [],
  },
  '6.5-D-5': {
    actions: ['Provide a designated rest area for carers and companions with seating, water, phone charging, and toilet access nearby.', 'Locate the rest area close to the main event space so carers can return quickly when needed.', 'Communicate the rest area location on your event map and to attendees who registered companion tickets.', 'Staff the rest area or provide a way for carers to contact the person they are supporting if needed.', 'Ensure the rest area is distinct from the quiet/sensory space to maintain the low-stimulation environment of that space.'],
    reasoning: 'Carers and companions provide essential support throughout the event. Without a rest area, they face fatigue that compromises their ability to support the person they are with.',
    resources: [],
  },
  '6.5-D-6': {
    actions: ['Conduct a formal post-event accessibility review within 2 weeks, while experiences are fresh.', 'Include input from: the accessibility manager, staff and volunteers, attendees with disability (via feedback), and disability advisory group members.', 'Review all accessibility feedback, complaints, and on-the-day incident reports.', 'Document what worked well, what did not, and specific improvement actions for future events.', 'Share the review findings with event leadership and incorporate actions into planning for the next event.'],
    reasoning: 'Without a post-event accessibility review, lessons are lost, the same barriers recur at future events, and the organisation misses the opportunity for continuous improvement.',
    resources: [],
  },
  '6.5-D-7': {
    actions: ['Reserve a section of front-row or near-front seating for Deaf and hard of hearing attendees at sessions with interpreters.', 'Mark reserved seating clearly and assign stewards to manage the section.', 'Ensure reserved seats have clear sightlines to both the interpreter and the speaker/screen.', 'Allow booking of these seats during registration for attendees who indicate hearing access needs.', 'Position reserved seating within the hearing loop coverage area.'],
    reasoning: 'Deaf and hard of hearing attendees who lip-read or use Auslan interpreters need front-row seating with clear sightlines. Without reserved seats, they arrive to find the best positions taken.',
    resources: [],
  },
  '6.5-D-8': {
    actions: ['Include finger food, bite-sized items, and easy-to-eat options in your catering menu.', 'Provide adaptive cutlery (built-up handles, rocker knives) and non-slip mats at catering stations.', 'Offer pre-cut food and straws (paper or reusable, not just on request) as standard.', 'Ensure food service staff are trained to offer assistance discreetly and respectfully when requested.', 'Label food options clearly at accessible height, including which items are easy to eat without assistance.'],
    reasoning: 'People with limited hand function, tremor, or arm mobility need food they can eat independently without cutlery or with minimal fine motor control. Dignified dining is part of the event experience.',
    resources: [],
  },
  '6.5-D-9': {
    actions: ['Ensure speakers and Auslan interpreters are lit from the front (not back-lit or silhouetted) with even, warm lighting.', 'Maintain lighting on the interpreter even during dimmed-house segments (e.g., video playback, performance lighting changes).', 'Use a minimum of 300 lux on the interpreter position per best practice for sign language visibility.', 'Brief lighting technicians specifically on the need to maintain interpreter and speaker visibility at all times.', 'Check lighting from the Deaf seating section during technical rehearsal.'],
    reasoning: 'Without adequate lighting on speakers and interpreters, lip-reading and Auslan comprehension become impossible, negating the benefit of providing these services.',
    resources: [],
  },
  '6.5-PC-1': {
    actions: ['Deliver disability awareness training to all event staff and volunteers before the event, covering respectful interaction, communication techniques, and available accessibility features.', 'Include event-specific content: venue accessibility features, accommodation processes, quiet space location, emergency procedures for people with disability.', 'Use training developed or delivered by people with lived experience of disability.', 'Provide quick-reference accessibility cards that staff can carry during the event.', 'Conduct a pre-event briefing on the day covering any last-minute accessibility arrangements or changes.'],
    reasoning: 'Event staff and volunteers are the human face of accessibility on the day. Without disability awareness training, even the best physical setup fails when staff cannot provide appropriate support.',
    resources: [],
  },
  '6.5-PC-2': {
    actions: ['Provide a dedicated priority entry lane for people with disability, wheelchair users, and their companions.', 'Clearly sign the priority entry lane with the international accessibility symbol.', 'Train entry staff to offer priority entry proactively and accept diverse evidence of disability (Companion Card, mobility aid, Sunflower lanyard, verbal request).', 'Ensure the priority entry lane is step-free and wide enough for wheelchairs.', 'Manage priority entry flow to prevent congestion while maintaining a respectful, efficient process.'],
    reasoning: 'Long queues and crowded entry points are physically exhausting and distressing for many people with disability. Priority entry removes a significant barrier to participation.',
    resources: [],
  },
  '6.5-PC-3': {
    actions: ['Ensure food and beverage service areas are physically accessible (step-free, reachable counters at 750-850mm).', 'Provide clear allergen and ingredient information in large print and accessible digital formats.', 'Offer food options for diverse dietary needs: allergen-free, soft/modified texture, halal, kosher, and clearly labelled.', 'Ensure service staff can describe menu items to people with vision impairment and handle dietary queries confidently.', 'Provide accessible seating near food service areas with space for wheelchair users and companions.'],
    reasoning: 'Inaccessible food and beverage services exclude people with disability from a core part of the event social experience and can pose health and safety risks for those with allergies or dysphagia.',
    resources: [],
  },
  '6.5-PC-4': {
    actions: ['Confirm your service animal policy with all staff, security, vendors, and contractors before the event.', 'Provide a designated relief area for service animals with waste disposal, water, and shade.', 'Communicate the relief area location on your event map and in pre-event accessibility information.', 'Train all staff, including security, to permit service animals in all public areas without question or challenge beyond reasonable identification.', 'Brief food vendors and catering staff on the legal requirement to permit service animals in food service areas.', 'Consider providing a cool, quiet rest area for service animals during long events.'],
    reasoning: 'Refusing entry to or failing to accommodate service animals is unlawful under the DDA 1992. Comprehensive provisions ensure animal welfare and handler comfort throughout the event.',
    resources: [],
  },
  '6.5-PC-5': {
    actions: ['Develop an event-specific emergency evacuation plan that addresses the needs of people with mobility, sensory, cognitive, and psychosocial disability.', 'Identify refuge areas (safe points) for people who cannot use stairs, and brief staff on evacuation chair use.', 'Ensure emergency alarms include both audible and visual alerts (flashing lights) per AS 1670.4.', 'Brief all staff and volunteers on their role in accessible evacuation during pre-event training.', 'Conduct a walkthrough of accessible evacuation routes before doors open and ensure they remain clear throughout the event.', 'Identify attendees who may need evacuation assistance through registration data and brief relevant staff.'],
    reasoning: 'People with disability face disproportionate risk during emergencies if evacuation plans do not account for their needs. An accessible emergency plan is required under WHS legislation and can be life-saving.',
    resources: [],
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
    keywords: ['website', 'digital', 'online', 'app', 'web', 'wcag', 'screen reader', 'keyboard', 'alt text', 'mobile', 'readability', 'font size', 'colour contrast', 'color contrast'],
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
  // Social media and content
  {
    keywords: ['social media', 'hashtag', 'camelcase', 'repost', 'sharing content', 'instagram', 'facebook', 'post', 'caption', 'emoji', 'image description', 'content warning', 'trigger warning', 'video description', 'transcript'],
    specificActions: [
      'Write hashtags in CamelCase so screen readers can distinguish individual words',
      'Add image descriptions or alt text to all social media posts with images',
      'Include captions on all video content posted to social media',
      'Place content warnings before sensitive content, not buried in descriptions',
      'Verify that alt text is preserved when content is reposted or shared across platforms',
      'Place emojis at the end of posts rather than inline to avoid screen reader interruptions',
      'Use plain language and avoid excessive use of special characters or symbols',
    ],
    reasoning: 'Social media is often the first point of contact for potential visitors. Inaccessible posts exclude people who use screen readers, have cognitive disabilities, or who need content warnings.',
    resources: ['[Guide: Accessible Social Media]', '[Social Media Accessibility Checklist]'],
  },
  // Communications and content creation
  {
    keywords: ['communication', 'newsletter', 'email', 'flyer', 'plain language', 'plain english', 'language', 'readable', 'readability', 'invitation', 'marketing', 'advertising', 'promotion'],
    specificActions: [
      'Write all communications in plain language with short sentences and simple words',
      'Use minimum 12pt font in emails and digital communications',
      'Ensure email templates are tested with screen readers',
      'Offer communications in alternative formats on request (large print, Easy Read)',
      'Include accessibility contact details in all event invitations and promotions',
      'Test readability level of public-facing content (aim for Grade 8 reading level)',
    ],
    reasoning: 'Accessible communications ensure everyone can receive and understand your messages. Complex language and inaccessible formats exclude people with cognitive, vision, and learning disabilities.',
    resources: ['[Plain Language Writing Guide]', '[Accessible Email Checklist]'],
  },
  // Accessibility features and equipment
  {
    keywords: ['hearing loop', 'wheelchair', 'mobility aid', 'walking frame', 'scooter', 'assistive', 'equipment', 'device', 'charging', 'wifi', 'induction loop', 'portable'],
    specificActions: [
      'Maintain a list of available accessibility equipment and communicate it to visitors',
      'Regularly test and maintain all accessibility equipment (hearing loops, ramps, etc.)',
      'Train staff on how to set up, operate, and troubleshoot accessibility equipment',
      'Provide charging points for powered mobility devices',
      'Ensure equipment is clean, in working order, and stored in an accessible location',
      'Display signage indicating where accessibility equipment is available',
    ],
    reasoning: 'Accessibility equipment enables participation for people with disabilities. Equipment that is unavailable, broken, or poorly maintained creates barriers.',
    resources: ['[Accessibility Equipment Maintenance Guide]', '[Hearing Loop Testing Checklist]'],
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
const CATEGORY_GUIDANCE: Record<string, string> = {
  measurement: 'Take measurements and compare against Australian Standards minimum requirements',
  policy: 'Review your policies and update to include this accessibility requirement',
  training: 'Incorporate this topic into staff accessibility training and awareness programs',
  physical: 'Assess the physical environment and plan modifications to improve accessibility',
  information: 'Review how this information is provided and ensure it is available in accessible formats',
  feedback: 'Establish a process to collect and act on accessibility feedback from customers',
  employment: 'Review employment practices to ensure inclusive recruitment and workplace adjustments',
  procurement: 'Include accessibility requirements in procurement criteria and supplier agreements',
  digital: 'Audit digital content and platforms for accessibility compliance (WCAG 2.2 AA)',
  safety: 'Review safety procedures to ensure they are inclusive of people with disability',
  'sensory-environment': 'Assess the sensory environment and plan adjustments for people with sensory sensitivities',
  communication: 'Ensure communication methods are inclusive and available in multiple formats',
  evidence: 'Document and gather evidence of current accessibility provisions',
};

const ACTION_CONVERSIONS: Array<[RegExp, string]> = [
  [/^Do you have /i, 'Provide '],
  [/^Do you /i, 'Ensure you '],
  [/^Do staff /i, 'Ensure staff '],
  [/^Does your /i, 'Ensure your '],
  [/^Does the /i, 'Ensure the '],
  [/^Do /i, 'Ensure '],
  [/^Are you /i, 'Ensure you are '],
  [/^Are your /i, 'Ensure your '],
  [/^Are there /i, 'Ensure there are '],
  [/^Are /i, 'Ensure '],
  [/^Is your /i, 'Ensure your '],
  [/^Is there /i, 'Ensure there is '],
  [/^Is /i, 'Ensure '],
  [/^Can you /i, 'Ensure you can '],
  [/^Can customers /i, 'Ensure customers can '],
  [/^Can visitors /i, 'Ensure visitors can '],
  [/^Can /i, 'Ensure '],
  [/^Have you /i, 'Ensure you have '],
  [/^Has your /i, 'Ensure your '],
  [/^What have you /i, 'Review what you have '],
  [/^What (.+?) do you /i, 'Review your '],
  [/^How /i, 'Review how '],
];

function getSpecificRecommendations(
  questionId: string,
  questionText: string,
  moduleCode: string,
  answer: string | null,
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

  // Look up the question for Tier 2.5 and Tier 3
  const module = getModuleById(moduleCode);
  const question = module?.questions.find(q => q.id === questionId);

  // Tier 2.5a: Rich help content (solutions with steps from help system)
  const richHelp = getHelpByQuestionId(questionId);
  if (richHelp) {
    if (richHelp.solutions && richHelp.solutions.length > 0) {
      const sorted = [...richHelp.solutions].sort((a, b) => {
        const order = { low: 0, medium: 1, high: 2 };
        return order[a.resourceLevel] - order[b.resourceLevel];
      });
      // Use steps from the best solution, falling back to description
      const actions: string[] = [];
      for (const sol of sorted) {
        if (sol.steps && sol.steps.length > 0) {
          actions.push(...sol.steps);
        } else {
          actions.push(sol.description);
        }
        if (actions.length >= 5) break;
      }
      if (userNotes?.trim()) {
        actions.unshift(`Address noted issue: "${userNotes.trim()}"`);
      }
      return {
        actions: actions.slice(0, 6),
        reasoning: richHelp.whyItMatters?.text || richHelp.summary,
        resources: [],
        needsAdminReview: false,
      };
    }
    // Use howToCheck steps as actions (these are assessment-focused instructions)
    if (richHelp.howToCheck?.steps && richHelp.howToCheck.steps.length > 0) {
      const actions = richHelp.howToCheck.steps.slice(0, 5).map(s => s.text);
      if (userNotes?.trim()) {
        actions.unshift(`Address noted issue: "${userNotes.trim()}"`);
      }
      return {
        actions: actions.slice(0, 6),
        reasoning: richHelp.whyItMatters?.text || richHelp.summary,
        resources: [],
        needsAdminReview: false,
      };
    }
  }

  // Tier 2.5b: Inline helpContent summary + category guidance
  if (question?.helpContent?.summary) {
    const actions: string[] = [];
    if (userNotes?.trim()) {
      actions.push(`Address noted issue: "${userNotes.trim()}"`);
    }
    const catAction = CATEGORY_GUIDANCE[question.category || ''];
    if (catAction) actions.push(catAction);
    // Convert question to action
    let qAction = questionText.replace(/\?$/, '').trim();
    for (const [pattern, replacement] of ACTION_CONVERSIONS) {
      if (pattern.test(qAction)) {
        qAction = qAction.replace(pattern, replacement);
        break;
      }
    }
    actions.push(qAction.charAt(0).toUpperCase() + qAction.slice(1));
    actions.push('Document current state with photos and measurements where applicable');
    return {
      actions: actions.slice(0, 6),
      reasoning: question.helpContent.summary,
      resources: [],
      needsAdminReview: false,
    };
  }

  // Tier 3: Enhanced fallback with category-specific guidance
  const fallbackActions: string[] = [];

  if (userNotes?.trim()) {
    fallbackActions.push(`Address noted issue: "${userNotes.trim()}"`);
  }

  const catAction = CATEGORY_GUIDANCE[question?.category || ''];
  if (catAction) {
    fallbackActions.push(catAction);
  }

  // Convert question text to an actionable recommendation
  let fallbackAction = questionText.replace(/\?$/, '').trim();
  let matched = false;
  for (const [pattern, replacement] of ACTION_CONVERSIONS) {
    if (pattern.test(fallbackAction)) {
      fallbackAction = fallbackAction.replace(pattern, replacement);
      matched = true;
      break;
    }
  }
  if (!matched && !catAction) {
    fallbackAction = 'Review: ' + fallbackAction;
  }
  fallbackAction = fallbackAction.charAt(0).toUpperCase() + fallbackAction.slice(1);
  fallbackActions.push(fallbackAction);

  if (question?.complianceLevel === 'mandatory') {
    fallbackActions.push(`This is a mandatory compliance requirement${question.complianceRef ? ` (${question.complianceRef})` : ''}. Prioritise addressing this item.`);
  }

  fallbackActions.push('Document current state with photos and measurements where applicable');

  const reasoning = question?.helpText
    || (question?.helpContent?.summary)
    || 'Review the recommended actions and consider how they apply to your venue.';

  return {
    actions: fallbackActions.slice(0, 5),
    reasoning,
    resources: [],
    needsAdminReview: true,
  };
}

// Helper: Generate detailed findings for deep-dive mode
function generateDetailedFindings(completedModules: ModuleProgress[]): Report['detailedFindings'] {
  return completedModules.map(moduleProgress => {
    const module = getModuleById(moduleProgress.moduleId);
    if (!module) return null;

    // --- Pass 1: build issues from responses (no/partially/unable-to-check) ---
    const coveredQuestionIds = new Set<string>();

    const issuesFromResponses = moduleProgress.responses
      .filter(response =>
        isNegativeResponse(response.answer) ||
        needsFollowUp(response.answer) ||
        isPartialResponse(response.answer)
      )
      .map(response => {
        const question = module.questions.find(q => q.id === response.questionId);
        if (!question) return null;

        coveredQuestionIds.add(question.id);

        const priority = calculateQuestionPriority({
          complianceLevel: question.complianceLevel,
          safetyRelated: question.safetyRelated,
          impactLevel: question.impactLevel,
          answer: response.answer,
        });

        const recommendations = getSpecificRecommendations(
          question.id,
          question.text,
          module.code,
          response.answer,
          response.notes
        );

        const reasoning: string = recommendations.reasoning;

        const recommendedActions: string[] = [];
        if (isNegativeResponse(response.answer)) {
          recommendedActions.push(...recommendations.actions);
        } else if (isPartialResponse(response.answer)) {
          recommendedActions.push(...recommendations.actions.slice(0, 5));
        } else {
          recommendedActions.push(
            'Conduct a site walk-through to verify current accessibility features',
            'Take photos or measurements to document current state',
            'Consult with team members who may have more information',
            'Update your accessibility records based on findings',
          );
        }

        const resourceLinks = getReportResourceLinks(question.id, module.code);

        return {
          questionId: question.id,
          questionText: question.text,
          reasoning,
          priority,
          recommendedActions,
          resourceLinks,
          complianceLevel: question.complianceLevel,
          complianceRef: question.complianceRef,
        };
      })
      .filter((issue): issue is NonNullable<typeof issue> => issue !== null);

    // --- Pass 2: backfill from priority actions that weren't covered by responses ---
    const backfilledIssues: typeof issuesFromResponses = [];
    const freshSummary = generateModuleSummary(moduleProgress.responses, module.questions);
    const priorityActions = freshSummary.priorityActions;

    for (const actionItem of priorityActions) {
      if (coveredQuestionIds.has(actionItem.questionId)) continue;
      coveredQuestionIds.add(actionItem.questionId);

      const question = module.questions.find(q => q.id === actionItem.questionId);
      const questionText = question?.text || actionItem.questionText;

      const recommendations = getSpecificRecommendations(
        actionItem.questionId,
        questionText,
        module.code,
        'no',
        undefined
      );

      const recommendedActions = [actionItem.action, ...recommendations.actions];
      const resourceLinks = getReportResourceLinks(actionItem.questionId, module.code);

      backfilledIssues.push({
        questionId: actionItem.questionId,
        questionText,
        reasoning: actionItem.impactStatement || recommendations.reasoning,
        priority: actionItem.priority,
        recommendedActions,
        resourceLinks,
        complianceLevel: question?.complianceLevel,
        complianceRef: question?.complianceRef,
      });
    }

    const issues = [...issuesFromResponses, ...backfilledIssues];

    return {
      moduleId: moduleProgress.moduleId,
      moduleCode: moduleProgress.moduleCode,
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
