import * as React from "react";
import { cn } from "@/lib/utils";

type ProgressProps = {
  value: number;
  max?: number;
  className?: string;
  indicatorClassName?: string;
  showLabel?: boolean;
  label?: string;
  labelClassName?: string;
};

const Progress = ({
  value,
  max = 100,
  className,
  indicatorClassName,
  showLabel = false,
  label,
  labelClassName,
}: ProgressProps) => {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

  return (
    <div className="w-full space-y-2">
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className={cn("text-sm font-medium text-neutral-700", labelClassName)}>
            {label || `${percentage.toFixed(0)}%`}
          </span>
          {!label && <span className="text-sm font-medium text-neutral-700">{percentage.toFixed(0)}%</span>}
        </div>
      )}
      <div className={cn("progress-bar-container", className)}>
        <div
          className={cn("progress-bar", indicatorClassName)}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

export { Progress };
