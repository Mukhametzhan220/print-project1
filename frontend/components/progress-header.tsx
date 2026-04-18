type ProgressHeaderProps = {
  step: number;
  total: number;
};

export function ProgressHeader({ step, total }: ProgressHeaderProps) {
  return (
    <div className="progress-wrap" aria-label={`Step ${step} of ${total}`}>
      <div className="progress-meta">
        <span>Step {step}</span>
        <span>{total}</span>
      </div>
      <div className="progress-bar">
        <span style={{ width: `${(step / total) * 100}%` }} />
      </div>
    </div>
  );
}
