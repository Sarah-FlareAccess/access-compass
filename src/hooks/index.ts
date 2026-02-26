export { useSupabaseSession } from './useSupabaseSession';
export { useModuleProgress } from './useModuleProgress';
export type { QuestionResponse, ModuleProgress, ModuleSummary, ActionItem, ModuleOwnership, CompletionMetadata, EvidenceFile } from './useModuleProgress';
export { useDIAPManagement } from './useDIAPManagement';
export type { DIAPItem, DIAPDocument, DIAPCategory, DIAPStatus, DIAPPriority, DIAPStats, ResponseForDIAP } from './useDIAPManagement';
export { useBranchingLogic, generateClarificationPrompt, needsProfessionalReview } from './useBranchingLogic';
export type { BranchCondition, BranchingQuestion } from './useBranchingLogic';
export { useReportGeneration } from './useReportGeneration';
export type { Report, ReportSection, QuickWin, ProfessionalSupportIndicator, ModuleCompletionEvidence, UrlAnalysisResult, MediaAnalysisReportResult } from './useReportGeneration';

export { usePageTitle } from './usePageTitle';
export { useTrainingProgress } from './useTrainingProgress';

// Access system hooks
export { useAuth } from './useAuth';
export { useAccessCheck, useDIAPAccess, usePulseAccess } from './useAccessCheck';
