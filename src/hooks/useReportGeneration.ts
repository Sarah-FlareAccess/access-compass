/**
 * Report Generation Hook
 *
 * Generates comprehensive reports based on review mode:
 * - Pulse Check: 1-page summary
 * - Deep Dive: Detailed report with issues, reasoning, priorities, and resources
 */

import { useMemo } from 'react';
import { useModuleProgress } from './useModuleProgress';
import type { ModuleProgress, QuestionResponse } from './useModuleProgress';
import { useDIAPManagement } from './useDIAPManagement';
import type { DIAPItem } from './useDIAPManagement';
import { getModuleById } from '../data/accessModules';
import type { ReviewMode } from '../types/index';

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
}

interface UseReportGenerationReturn {
  generateReport: (reviewMode: ReviewMode, organisationName?: string) => Report;
  isReady: boolean;
}

export function useReportGeneration(selectedModuleIds: string[]): UseReportGenerationReturn {
  const { progress, isLoading } = useModuleProgress(selectedModuleIds);
  const { items: diapItems } = useDIAPManagement();

  const isReady = !isLoading && Object.keys(progress).length > 0;

  const generateReport = useMemo(() => {
    return (reviewMode: ReviewMode, organisationName: string = 'Your Organisation'): Report => {
      const now = new Date().toISOString();
      const completedModules = Object.values(progress).filter(p => p.status === 'completed');

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

      const report: Report = {
        reportType: reviewMode === 'pulse-check' ? 'pulse-check' : 'deep-dive',
        generatedAt: now,
        organisation: organisationName,
        executiveSummary,
        moduleEvidence,
        urlAnalysisResults,
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
      };

      // Add detailed findings for deep-dive mode
      if (reviewMode === 'deep-dive') {
        report.detailedFindings = generateDetailedFindings(completedModules);
      }

      return report;
    };
  }, [progress, diapItems, selectedModuleIds]);

  return {
    generateReport,
    isReady,
  };
}

// Helper: Identify quick wins
function identifyQuickWins(completedModules: ModuleProgress[], diapItems: DIAPItem[]): QuickWin[] {
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
      if (response.answer === 'no' || response.answer === 'not-sure') {
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

  // Check for uncertainty
  const uncertaintyCount = completedModules.reduce((count, module) => {
    return count + module.responses.filter(r => r.answer === 'not-sure' || r.answer === 'too-hard').length;
  }, 0);

  indicators.push({
    category: 'Complex Assessment',
    reason: "You're unsure how different access elements work together",
    detected: uncertaintyCount > 5,
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

  const uncertainResponses = completedModules.reduce((count, module) => {
    return count + module.responses.filter(r => r.answer === 'not-sure').length;
  }, 0);

  if (uncertainResponses > 0) {
    exploreNow.push('Clarify any "Not sure" responses with your team');
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

// Helper: Generate detailed findings for deep-dive mode
function generateDetailedFindings(completedModules: ModuleProgress[]): Report['detailedFindings'] {
  return completedModules.map(moduleProgress => {
    const module = getModuleById(moduleProgress.moduleId);
    if (!module) return null;

    const issues = moduleProgress.responses
      .filter(response => response.answer === 'no' || response.answer === 'not-sure')
      .map(response => {
        // Find the question
        const question = module.questions.find(q => q.id === response.questionId);
        if (!question) return null;

        // Determine priority based on answer and question metadata
        const priority: 'high' | 'medium' | 'low' =
          response.answer === 'no' ? 'high' :
          response.answer === 'not-sure' ? 'medium' : 'low';

        // Generate reasoning
        const reasoning = response.answer === 'no'
          ? 'This accessibility feature is currently not in place, creating a potential barrier for customers with disabilities.'
          : 'There is uncertainty about this accessibility feature, which may indicate a gap in current knowledge or inconsistent implementation.';

        // Generate recommended actions based on question type
        const recommendedActions: string[] = [];
        if (response.answer === 'no') {
          recommendedActions.push(`Assess feasibility of implementing ${question.text.toLowerCase().replace(/\?$/, '')}`);
          recommendedActions.push('Consult with accessibility expert if needed');
          recommendedActions.push('Create action plan with timeline and budget');
        } else {
          recommendedActions.push('Conduct internal audit to clarify current status');
          recommendedActions.push('Document findings and share with team');
          recommendedActions.push('Update accessibility information based on findings');
        }

        // Placeholder resource links (will be replaced with actual resource center links)
        const resourceLinks = [
          `[Resource: ${module.name}] (Coming soon)`,
          '[General Accessibility Guidelines] (Coming soon)',
        ];

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
