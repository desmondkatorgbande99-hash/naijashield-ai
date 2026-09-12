import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface LoadingStage {
  icon: LucideIcon;
  label: string;
}

interface LoadingAnalysisProps {
  title: string;
  stages: LoadingStage[];
  stageDuration?: number;
  onComplete: () => void;
}

function LoadingAnalysis({
  title,
  stages,
  stageDuration = 1000,
  onComplete,
}: LoadingAnalysisProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (activeIndex >= stages.length) {
      const finishTimer = setTimeout(onComplete, 1000);
      return () => clearTimeout(finishTimer);
    }

    const stepTimer = setTimeout(() => {
      setActiveIndex((current) => current + 1);
    }, stageDuration);

    return () => clearTimeout(stepTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const progressPercent = Math.min(
    100,
    Math.round((activeIndex / stages.length) * 100),
  );

  return (
    <div className="loading-analysis" role="status" aria-live="polite">
      <div className="loading-shield">
        <ShieldCheck size={30} />
      </div>

      <h2 className="loading-title">{title}</h2>

      <div className="loading-progress-track">
        <div
          className="loading-progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="loading-stage-list">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isDone = index < activeIndex;
          const isActive = index === activeIndex;

          return (
            <div
              key={stage.label}
              className={`loading-stage ${isActive ? 'active' : ''} ${
                isDone ? 'done' : ''
              }`}
            >
              <span className="loading-stage-icon">
                <Icon size={16} />
              </span>
              <span>{stage.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LoadingAnalysis;