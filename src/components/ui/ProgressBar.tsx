import * as React from 'react';
import { cn } from '@/utils/cn';

interface ProgressBarProps {
  current: number;
  max: number;
  min: number;
  height?: string;
  showLabel?: boolean;
}

export const ProgressBar = ({
  current,
  max,
  min,
  height = '6px',
  showLabel = true,
}: ProgressBarProps) => {
  const percent = Math.min(100, (current / max) * 100);
  const minPercent = Math.min(100, (min / max) * 100);

  return (
    <div className="relative w-full">
      <div className="w-full overflow-hidden rounded-xs bg-gray-50" style={{ height }}>
        <div
          className={cn('bg-grad-600a h-full transition-all duration-500 ease-in-out')}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <div
          className="absolute top-3.5 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          style={{ left: `${minPercent}%` }}>
          <div className="relative flex h-3 w-3 items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-[var(--color-pink-200)] bg-white shadow-sm"></div>
            <div className="relative z-10 h-1 w-1 animate-ping rounded-full bg-[var(--color-pink-500)]"></div>
          </div>
          <span className="text-[10px] font-bold text-nowrap text-[var(--color-pink-600)]">
            개설 확정
          </span>
        </div>
      )}
    </div>
  );
};
