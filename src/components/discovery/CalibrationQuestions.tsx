import { useState } from 'react';
import type { CalibrationData, InvestmentLevel, WorkApproach, ActionTiming } from '../../types';
import './discovery.css';

interface CalibrationQuestionsProps {
  onComplete: (data: CalibrationData) => void;
  onBack: () => void;
  touchpointCount: number;
}

const investmentOptions: { value: InvestmentLevel; label: string }[] = [
  { value: 'minimal', label: 'Minimal — small changes only' },
  { value: 'moderate', label: 'Moderate — some budget available' },
  { value: 'significant', label: 'Significant — ready to invest properly' },
  { value: 'not-sure', label: 'Not sure yet' },
];

const workApproachOptions: { value: WorkApproach; label: string }[] = [
  { value: 'myself', label: 'Mostly myself' },
  { value: 'with-team', label: 'With my team' },
  { value: 'external-support', label: 'With external support' },
];

const timingOptions: { value: ActionTiming; label: string }[] = [
  { value: 'now', label: 'Now' },
  { value: 'next-3-months', label: 'Next 3 months' },
  { value: 'later', label: 'Later' },
];

export function CalibrationQuestions({ onComplete, onBack, touchpointCount: _touchpointCount }: CalibrationQuestionsProps) {
  const [budget, setBudget] = useState<InvestmentLevel | undefined>();
  const [workApproach, setWorkApproach] = useState<WorkApproach | undefined>();
  const [timing, setTiming] = useState<ActionTiming | undefined>();

  const handleContinue = () => {
    onComplete({ budget, workApproach, timing });
  };

  // Allow continue even if not all answered - these inform recommendations but aren't required

  return (
    <div className="discovery-page">
      <div className="discovery-container calibration-container">
        {/* Header */}
        <div className="calibration-header">
          <h1 className="calibration-title">A couple of quick questions to help us guide you well</h1>
          <p className="calibration-subtitle">
            This helps us recommend the right level of detail and avoid wasting your time.
          </p>
        </div>

        {/* Questions */}
        <div className="calibration-questions">
          {/* Investment Question */}
          <div className="calibration-question">
            <h2 className="calibration-question-text">
              What level of investment feels realistic right now?
            </h2>
            <div className="calibration-options">
              {investmentOptions.map((option) => (
                <label
                  key={option.value}
                  className={`calibration-option ${budget === option.value ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="budget"
                    checked={budget === option.value}
                    onChange={() => setBudget(option.value)}
                    className="calibration-radio"
                  />
                  <span className="calibration-option-label">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Work Approach Question */}
          <div className="calibration-question">
            <h2 className="calibration-question-text">
              How do you expect to work on improvements?
            </h2>
            <div className="calibration-options">
              {workApproachOptions.map((option) => (
                <label
                  key={option.value}
                  className={`calibration-option ${workApproach === option.value ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="workApproach"
                    checked={workApproach === option.value}
                    onChange={() => setWorkApproach(option.value)}
                    className="calibration-radio"
                  />
                  <span className="calibration-option-label">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Timing Question */}
          <div className="calibration-question">
            <h2 className="calibration-question-text">
              When are you aiming to take action?
            </h2>
            <div className="calibration-options calibration-options-inline">
              {timingOptions.map((option) => (
                <label
                  key={option.value}
                  className={`calibration-option ${timing === option.value ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="timing"
                    checked={timing === option.value}
                    onChange={() => setTiming(option.value)}
                    className="calibration-radio"
                  />
                  <span className="calibration-option-label">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="calibration-actions">
          <button className="btn-back" onClick={onBack}>
            ← Back
          </button>
          <button
            className="btn-continue"
            onClick={handleContinue}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
