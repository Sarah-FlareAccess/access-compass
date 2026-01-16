import { useState } from 'react';
import './discovery.css';

type BudgetRange = 'under-500' | '500-5k' | '5k-20k' | '20k-plus' | 'not-sure';
type PriorityTimeframe = 'immediate' | 'this-year' | 'future' | 'exploring';

interface OptionalQuestionsProps {
  onComplete: (data: { budget?: BudgetRange; priority?: PriorityTimeframe }) => void;
  onSkip: () => void;
  onBack: () => void;
}

const budgetOptions: { value: BudgetRange; label: string; description: string }[] = [
  { value: 'under-500', label: 'Under $500', description: 'Quick wins and low-cost changes' },
  { value: '500-5k', label: '$500–$5,000', description: 'Small projects and equipment' },
  { value: '5k-20k', label: '$5,000–$20,000', description: 'Moderate changes, some construction' },
  { value: '20k-plus', label: '$20,000+', description: 'Major improvements or renovations' },
  { value: 'not-sure', label: 'Not sure yet', description: '' },
];

const priorityOptions: { value: PriorityTimeframe; label: string; description: string }[] = [
  { value: 'immediate', label: 'Immediate priorities', description: 'Quick changes we can act on soon' },
  { value: 'this-year', label: 'This year', description: 'Planned improvements within the next 12 months' },
  { value: 'future', label: 'Future planning', description: 'Building understanding for 1–2 year decisions' },
  { value: 'exploring', label: 'Exploring', description: 'Learning what\'s involved before committing' },
];

export function OptionalQuestions({ onComplete, onSkip, onBack }: OptionalQuestionsProps) {
  const [budget, setBudget] = useState<BudgetRange | undefined>();
  const [priority, setPriority] = useState<PriorityTimeframe | undefined>();

  const handleContinue = () => {
    onComplete({ budget, priority });
  };

  const canContinue = budget || priority;

  return (
    <div className="discovery-page">
      <div className="discovery-container">
        {/* Header */}
        <div className="discovery-header-card">
          <h1 className="discovery-title">A couple of quick questions</h1>
          <p className="discovery-subtitle optional-tag">Optional</p>
          <p className="discovery-subtitle">
            These help us tailor resource recommendations and next steps. You can skip if you're not sure yet.
          </p>
        </div>

        {/* Budget Question */}
        <div className="optional-question-card">
          <h2 className="optional-question-title">
            What's realistic for accessibility improvements over the next year?
          </h2>
          <div className="optional-options">
            {budgetOptions.map((option) => (
              <label
                key={option.value}
                className={`optional-option ${budget === option.value ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="budget"
                  checked={budget === option.value}
                  onChange={() => setBudget(option.value)}
                  className="optional-radio"
                />
                <div className="optional-option-content">
                  <span className="optional-option-label">{option.label}</span>
                  {option.description && (
                    <span className="optional-option-desc">{option.description}</span>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Priority Question */}
        <div className="optional-question-card">
          <h2 className="optional-question-title">
            What should we prioritise right now?
          </h2>
          <div className="optional-options">
            {priorityOptions.map((option) => (
              <label
                key={option.value}
                className={`optional-option ${priority === option.value ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="priority"
                  checked={priority === option.value}
                  onChange={() => setPriority(option.value)}
                  className="optional-radio"
                />
                <div className="optional-option-content">
                  <span className="optional-option-label">{option.label}</span>
                  {option.description && (
                    <span className="optional-option-desc">{option.description}</span>
                  )}
                </div>
              </label>
            ))}
          </div>
          <p className="optional-note">
            Many organisations work across short- and long-term horizons. This just helps us order recommendations.
          </p>
        </div>

        {/* Actions */}
        <div className="discovery-actions-card">
          <div className="discovery-buttons">
            <button className="btn-back" onClick={onBack}>
              ← Back
            </button>
            {canContinue ? (
              <button className="btn-continue" onClick={handleContinue}>
                Continue →
              </button>
            ) : (
              <button className="btn-continue btn-skip" onClick={onSkip}>
                Skip for now →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
