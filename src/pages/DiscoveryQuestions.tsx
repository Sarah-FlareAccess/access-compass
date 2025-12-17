import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, updateDiscoveryResponses } from '../utils/session';
import { questions } from '../data/questions';
import type { ModuleType, AnswerType, QuestionResponse } from '../types';
import '../styles/questions.css';

export default function DiscoveryQuestions() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<any>({});
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession || !currentSession.selected_modules?.length) {
      navigate('/modules');
      return;
    }

    setSession(currentSession);

    // Pre-fill responses if they exist
    if (currentSession.discovery_responses) {
      setResponses(currentSession.discovery_responses);
    }
  }, [navigate]);

  if (!session) return null;

  const selectedModules = session.selected_modules;
  const currentModule = selectedModules[currentModuleIndex];
  const moduleQuestions = questions.filter((q) => q.module === currentModule);
  const currentQuestion = moduleQuestions[currentQuestionIndex];

  if (!currentQuestion) {
    // No questions for this module, move to next
    if (currentModuleIndex < selectedModules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      setCurrentQuestionIndex(0);
    } else {
      handleComplete();
    }
    return null;
  }

  const handleAnswer = (answer: AnswerType) => {
    const questionResponse: QuestionResponse = {
      answer,
      notes: notes.trim() || undefined,
    };

    const updatedResponses = {
      ...responses,
      [currentModule]: {
        ...responses[currentModule],
        [currentQuestion.question_text]: questionResponse,
      },
    };

    setResponses(updatedResponses);
    setNotes('');

    // Move to next question or module
    if (currentQuestionIndex < moduleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentModuleIndex < selectedModules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      setCurrentQuestionIndex(0);
    } else {
      // All questions answered
      updateDiscoveryResponses(updatedResponses);
      navigate('/constraints');
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
      const prevModuleQuestions = questions.filter(
        (q) => q.module === selectedModules[currentModuleIndex - 1]
      );
      setCurrentQuestionIndex(prevModuleQuestions.length - 1);
    }
  };

  const handleComplete = () => {
    updateDiscoveryResponses(responses);
    navigate('/constraints');
  };

  const progress = Math.round(
    ((currentModuleIndex * 100) / selectedModules.length +
      (currentQuestionIndex * 100) / moduleQuestions.length / selectedModules.length)
  );

  return (
    <div className="questions-page">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="container">
        <div className="questions-container">
          <div className="progress-text">
            {currentModule.replace(/-/g, ' ')} - Question {currentQuestionIndex + 1} of{' '}
            {moduleQuestions.length}
          </div>

          <h2>{currentQuestion.question_text}</h2>
          {currentQuestion.helper_text && (
            <p className="helper-text">{currentQuestion.helper_text}</p>
          )}

          <div className="answer-buttons">
            <button className="answer-btn answer-yes" onClick={() => handleAnswer('yes')}>
              Yes
            </button>
            <button className="answer-btn answer-no" onClick={() => handleAnswer('no')}>
              No
            </button>
            <button
              className="answer-btn answer-not-sure"
              onClick={() => handleAnswer('not_sure')}
            >
              Not sure
            </button>
            <button
              className="answer-btn answer-na"
              onClick={() => handleAnswer('not_applicable')}
            >
              Not applicable
            </button>
          </div>

          <div className="notes-section">
            <label htmlFor="notes">Add details (optional)</label>
            <input
              type="text"
              id="notes"
              placeholder="e.g., How many steps? Tell us more..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="navigation-buttons">
            {(currentQuestionIndex > 0 || currentModuleIndex > 0) && (
              <button className="btn btn-secondary" onClick={handleBack}>
                ← Back
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
