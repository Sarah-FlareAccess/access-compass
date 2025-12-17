/**
 * DiscoveryQuestions Page
 *
 * Handles the question flow for selected modules using
 * branching logic and the new question components.
 */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, getDiscoveryData } from '../utils/session';
import { getModuleById, getQuestionsForMode } from '../data/accessModules';
import { QuestionFlow } from '../components/questions';
import ReminderBanner from '../components/ReminderBanner';
import { useModuleProgress } from '../hooks/useModuleProgress';
import { useDIAPManagement } from '../hooks/useDIAPManagement';
import type { ReviewMode } from '../types';
import type { QuestionResponse, ModuleSummary } from '../hooks/useModuleProgress';
import '../styles/questions.css';

interface ModuleState {
  moduleId: string;
  moduleCode: string;
  moduleName: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export default function DiscoveryQuestions() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [discoveryData, setDiscoveryData] = useState<any>(null);
  const [moduleStates, setModuleStates] = useState<ModuleState[]>([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [showModuleList, setShowModuleList] = useState(true);

  // Get the review mode from discovery data
  const reviewMode: ReviewMode = discoveryData?.reviewMode || 'foundation';

  // Get selected modules from session
  const selectedModuleIds: string[] = useMemo(() => {
    if (!session?.selected_modules) return [];
    return session.selected_modules;
  }, [session]);

  // Initialize module progress hook
  const {
    progress,
    isLoading,
    startModule,
    completeModule,
    saveResponse,
    getModuleProgress,
  } = useModuleProgress(selectedModuleIds);

  // Initialize DIAP management for auto-generating items
  const { generateFromResponses } = useDIAPManagement();

  // Load session and discovery data
  useEffect(() => {
    const currentSession = getSession();
    const currentDiscovery = getDiscoveryData();

    if (!currentSession || !currentSession.selected_modules?.length) {
      navigate('/discovery');
      return;
    }

    setSession(currentSession);
    setDiscoveryData(currentDiscovery);

    // Initialize module states
    const states: ModuleState[] = currentSession.selected_modules.map((moduleId: string) => {
      const module = getModuleById(moduleId);
      return {
        moduleId,
        moduleCode: module?.code || moduleId,
        moduleName: module?.name || moduleId,
        status: 'pending' as const,
      };
    });

    setModuleStates(states);
  }, [navigate]);

  // Update module states based on progress
  useEffect(() => {
    if (Object.keys(progress).length === 0) return;

    setModuleStates((prev) =>
      prev.map((state) => {
        const moduleProgress = progress[state.moduleId];
        if (!moduleProgress) return state;

        return {
          ...state,
          status: moduleProgress.status === 'completed'
            ? 'completed'
            : moduleProgress.status === 'in-progress'
            ? 'in-progress'
            : 'pending',
        };
      })
    );
  }, [progress]);

  // Get current module
  const currentModule = useMemo(() => {
    if (moduleStates.length === 0) return null;
    return moduleStates[currentModuleIndex];
  }, [moduleStates, currentModuleIndex]);

  // Get questions for current module based on review mode
  const currentQuestions = useMemo(() => {
    if (!currentModule) return [];
    const module = getModuleById(currentModule.moduleId);
    if (!module) return [];
    return getQuestionsForMode(module, reviewMode);
  }, [currentModule, reviewMode]);

  // Get initial responses for current module
  const initialResponses = useMemo(() => {
    if (!currentModule) return [];
    const moduleProgress = getModuleProgress(currentModule.moduleId);
    return moduleProgress?.responses || [];
  }, [currentModule, getModuleProgress]);

  // Handle starting a module
  const handleStartModule = (index: number) => {
    const module = moduleStates[index];
    startModule(module.moduleId, module.moduleCode);
    setCurrentModuleIndex(index);
    setShowModuleList(false);
  };

  // Handle saving a response
  const handleSaveResponse = (response: QuestionResponse) => {
    if (!currentModule) return;
    saveResponse(currentModule.moduleId, response);
  };

  // Handle completing a module
  const handleCompleteModule = (summary: ModuleSummary) => {
    if (!currentModule) return;

    // Complete the module
    completeModule(currentModule.moduleId, summary);

    // Auto-generate DIAP items from responses
    const moduleProgress = getModuleProgress(currentModule.moduleId);
    if (moduleProgress?.responses) {
      generateFromResponses(
        moduleProgress.responses,
        currentQuestions,
        currentModule.moduleName
      );
    }

    // Move to next module or show list
    const nextIncompleteIndex = moduleStates.findIndex(
      (m, i) => i > currentModuleIndex && m.status !== 'completed'
    );

    if (nextIncompleteIndex >= 0) {
      // Show module list to let user choose
      setShowModuleList(true);
    } else {
      // All modules complete
      navigate('/dashboard');
    }
  };

  // Handle going back to module list
  const handleBackToList = () => {
    setShowModuleList(true);
  };

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    const completed = moduleStates.filter((m) => m.status === 'completed').length;
    const total = moduleStates.length;
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [moduleStates]);

  if (!session || isLoading) {
    return (
      <div className="questions-page">
        <div className="container">
          <div className="loading-state">Loading...</div>
        </div>
      </div>
    );
  }

  // Show module list view
  if (showModuleList) {
    return (
      <div className="questions-page">
        <div className="container">
          <ReminderBanner
            type="info"
            compact
          />

          <div className="module-list-header">
            <h1>Your Accessibility Review</h1>
            <p>
              {reviewMode === 'foundation' ? 'Foundation Review' : 'Detailed Review'} -{' '}
              {overallProgress.completed} of {overallProgress.total} modules complete
            </p>

            <div className="overall-progress-bar">
              <div
                className="overall-progress-fill"
                style={{ width: `${overallProgress.percentage}%` }}
              />
            </div>
          </div>

          <div className="module-list">
            {moduleStates.map((module, index) => (
              <div
                key={module.moduleId}
                className={`module-list-item ${module.status}`}
                onClick={() =>
                  module.status !== 'completed' && handleStartModule(index)
                }
              >
                <div className="module-status-indicator">
                  {module.status === 'completed' && (
                    <span className="status-check">&#10003;</span>
                  )}
                  {module.status === 'in-progress' && (
                    <span className="status-progress">&#8226;</span>
                  )}
                  {module.status === 'pending' && (
                    <span className="status-pending">{index + 1}</span>
                  )}
                </div>
                <div className="module-info">
                  <h3>{module.moduleName}</h3>
                  <p className="module-code">{module.moduleCode}</p>
                </div>
                <div className="module-action">
                  {module.status === 'completed' && (
                    <span className="completed-label">Completed</span>
                  )}
                  {module.status === 'in-progress' && (
                    <button className="btn-continue-module">Continue</button>
                  )}
                  {module.status === 'pending' && (
                    <button className="btn-start-module">Start</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="module-list-actions">
            <button className="btn-back" onClick={() => navigate('/discovery')}>
              Back to Discovery
            </button>
            {overallProgress.completed === overallProgress.total && (
              <button
                className="btn-view-results"
                onClick={() => navigate('/dashboard')}
              >
                View Results
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show question flow for current module
  if (!currentModule) {
    return null;
  }

  return (
    <div className="questions-page">
      <QuestionFlow
        moduleId={currentModule.moduleId}
        moduleName={currentModule.moduleName}
        moduleCode={currentModule.moduleCode}
        questions={currentQuestions}
        reviewMode={reviewMode}
        initialResponses={initialResponses}
        onSaveResponse={handleSaveResponse}
        onComplete={handleCompleteModule}
        onBack={handleBackToList}
      />
    </div>
  );
}
