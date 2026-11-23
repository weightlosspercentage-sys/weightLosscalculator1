import React from 'react';

interface ScaleMilestoneRuleProps {
  /** Current weight-loss percentage (0 or positive for loss) */
  percentLoss: number;
  /** Maximum scale mark on the rule; defaults to 15 (shows 0%, 5%, 10%, 15%) */
  maxPercent?: 15 | 20;
  /** Optional label above the scale rule */
  label?: string;
  /** Optional status caption shown on the right of the header */
  statusText?: string;
  /** Optional compact density for embedded cards */
  compact?: boolean;
}

/**
 * Quiet weighing-scale milestone track: 5%, 10%, 15% (and optional 20%)
 * rendered as hairline ticks on a thin horizontal rule with terracotta accent
 * strictly on reached milestone ticks and the current position indicator.
 */
export const ScaleMilestoneRule: React.FC<ScaleMilestoneRuleProps> = ({
  percentLoss,
  maxPercent = 15,
  label = 'Clinical milestones',
  statusText,
  compact = false,
}) => {
  const safePercent = Number.isFinite(percentLoss) ? Math.max(0, percentLoss) : 0;
  const clampedRatio = Math.min(100, (safePercent / maxPercent) * 100);
  const ticks = maxPercent === 20 ? [0, 5, 10, 15, 20] : [0, 5, 10, 15];

  return (
    <div className={compact ? 'space-y-2' : 'space-y-3'}>
      {(label || statusText) && (
        <div className="flex items-baseline justify-between gap-2 text-xs">
          <span className="font-medium text-[#57534e] dark:text-[#b5afa6]">{label}</span>
          {statusText && (
            <span className="tabular-nums font-medium text-[#1c1917] dark:text-[#f5f3ef]">
              {statusText}
            </span>
          )}
        </div>
      )}

      {/* Ruled scale track */}
      <div className="relative pt-2 pb-5 select-none" aria-label={`Weight loss progress: ${safePercent.toFixed(1)}%`}>
        {/* Base 1px neutral rule */}
        <div className="relative h-px w-full bg-[#d6d0c4] dark:bg-[#3f3a34]">
          {/* Subtle terracotta filled rule up to current loss */}
          <div
            className="absolute left-0 top-0 h-[2px] -translate-y-[0.5px] bg-[#c2410c] dark:bg-[#ea580c] transition-all duration-200"
            style={{ width: `${clampedRatio}%` }}
          />

          {/* Minor intermediate hairlines every 2.5% */}
          {Array.from({ length: maxPercent === 20 ? 9 : 7 }).map((_, idx) => {
            const val = idx * 2.5;
            if (ticks.includes(val)) return null;
            const pos = (val / maxPercent) * 100;
            return (
              <span
                key={val}
                className="absolute top-0 h-1.5 w-px -translate-x-1/2 bg-[#e5e1d8] dark:bg-[#332f2b]"
                style={{ left: `${pos}%` }}
                aria-hidden="true"
              />
            );
          })}

          {/* Major milestone ticks (0%, 5%, 10%, 15%[, 20%]) */}
          {ticks.map((tick) => {
            const pos = (tick / maxPercent) * 100;
            const isMilestone = tick > 0;
            const reached = isMilestone && safePercent >= tick;
            const alignClass =
              tick === 0
                ? 'translate-x-0'
                : tick === maxPercent
                ? '-translate-x-full'
                : '-translate-x-1/2';

            return (
              <div
                key={tick}
                className="absolute top-0"
                style={{ left: `${pos}%` }}
              >
                <span
                  className={`block -translate-x-1/2 -translate-y-1 transition-colors duration-200 ${
                    reached
                      ? 'h-3 w-[2px] bg-[#c2410c] dark:bg-[#ea580c]'
                      : isMilestone
                      ? 'h-2.5 w-px bg-[#a8a29e] dark:bg-[#57534e]'
                      : 'h-2 w-px bg-[#d6d0c4] dark:bg-[#3f3a34]'
                  }`}
                  aria-hidden="true"
                />
                <span
                  className={`block mt-1.5 text-[11px] leading-none tabular-nums whitespace-nowrap ${alignClass} ${
                    reached
                      ? 'font-medium text-[#c2410c] dark:text-[#ea580c]'
                      : 'font-normal text-[#78716c] dark:text-[#8c857d]'
                  }`}
                >
                  {tick}%
                </span>
              </div>
            );
          })}

          {/* Current position needle tick */}
          {safePercent > 0 && (
            <span
              className="absolute top-0 -translate-x-1/2 -translate-y-1.5 h-3.5 w-[2px] bg-[#c2410c] dark:bg-[#ea580c] transition-all duration-200"
              style={{ left: `${clampedRatio}%` }}
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </div>
  );
};
