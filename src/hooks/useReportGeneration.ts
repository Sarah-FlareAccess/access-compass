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
  questionText: string,
  moduleCode: string,
  _answer: string | null
): { actions: string[]; reasoning: string; resources: string[] } {
  const questionLower = questionText.toLowerCase();
  const codeLower = moduleCode.toLowerCase();

  // Find matching context based on keywords
  for (const context of RECOMMENDATION_CONTEXTS) {
    const matchesKeyword = context.keywords.some(
      keyword => questionLower.includes(keyword) || codeLower.includes(keyword)
    );
    if (matchesKeyword) {
      return {
        actions: context.specificActions.slice(0, 6), // Take top 6 actions
        reasoning: context.reasoning,
        resources: context.resources,
      };
    }
  }

  // Default recommendations if no specific match
  return {
    actions: [
      'Document current state with photos and measurements',
      'Consult Australian Standards AS1428.1 for specific requirements',
      'Consider engaging an access consultant for professional assessment',
      'Develop a costed action plan with realistic timeframes',
      'Communicate planned improvements on your accessibility page',
      'Track and report on progress',
    ],
    reasoning: 'This accessibility feature is not currently in place, creating a potential barrier for customers with disabilities.',
    resources: ['[Australian Human Rights Commission - Disability Standards]', '[Access Consultants Australia Directory]'],
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
          question.text,
          module.code,
          response.answer
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
