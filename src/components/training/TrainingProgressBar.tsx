interface TrainingProgressBarProps {
  percentage: number;
  label?: string;
}

export function TrainingProgressBar({ percentage, label }: TrainingProgressBarProps) {
  const displayLabel = label ?? `Course progress: ${percentage}% complete`;

  return (
    <div className="training-progress-wrapper">
      <div
        className="training-progress-bar"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={displayLabel}
      >
        <div
          className="training-progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="training-progress-text">{percentage}% complete</span>
    </div>
  );
}
