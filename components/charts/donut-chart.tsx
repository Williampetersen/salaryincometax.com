"use client";

import { useEffect, useState } from "react";

import { formatCurrency } from "@/lib/formatters";

interface DonutChartProps {
  currency: string;
  segments: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  centerLabel: string;
  centerValue: string;
}

export function DonutChart({
  currency,
  segments,
  centerLabel,
  centerValue,
}: DonutChartProps): JSX.Element {
  const [progress, setProgress] = useState(0);
  const size = 240;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;
  const centerFill = Math.min(progress + 0.08, 1);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }

    let frameId = 0;
    const duration = 1000;
    const startedAt = performance.now();

    function animate(now: number): void {
      const elapsed = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setProgress(eased);

      if (elapsed < 1) {
        frameId = window.requestAnimationFrame(animate);
      }
    }

    setProgress(0);
    frameId = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(frameId);
  }, [centerValue, segments]);

  let dashOffset = circumference * 0.25;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative h-[240px] w-[240px]">
        <div className="absolute inset-1 rounded-full bg-sky/10 blur-xl motion-safe:animate-pulse" />
        <div className="absolute inset-4 rounded-full bg-white shadow-[inset_0_0_24px_rgba(18,32,41,0.08),0_18px_45px_rgba(18,32,41,0.10)]" />
        <svg
          className="-rotate-90 drop-shadow-[0_10px_22px_rgba(18,32,41,0.14)]"
          height={size}
          width={size}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            fill="none"
            r={radius}
            stroke="rgba(18, 32, 41, 0.08)"
            strokeWidth={strokeWidth}
          />
          {segments.map((segment) => {
            const dashLength = (segment.value / total) * circumference * progress;
            const dashArray = `${dashLength} ${circumference - dashLength}`;
            const circle = (
              <circle
                cx={size / 2}
                cy={size / 2}
                fill="none"
                key={segment.label}
                r={radius}
                stroke={segment.color}
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                strokeWidth={strokeWidth}
                style={{
                  filter: "drop-shadow(0 2px 5px rgba(18, 32, 41, 0.2))",
                  transition: "stroke-dasharray 120ms linear",
                }}
              />
            );

            dashOffset -= (segment.value / total) * circumference;
            return circle;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div
            aria-hidden="true"
            className="absolute h-[122px] w-[122px] rounded-full bg-paper/70 transition-transform duration-150"
            style={{ transform: `scale(${0.82 + centerFill * 0.18})` }}
          />
          <span className="relative z-10 text-xs uppercase tracking-[0.24em] text-ink/55">
            {centerLabel}
          </span>
          <span className="relative z-10 mt-2 max-w-[138px] break-words font-[var(--font-display)] text-[clamp(1.45rem,1.8vw,2rem)] font-bold leading-tight tabular-nums">
            {centerValue}
          </span>
        </div>
      </div>
      <div className="grid w-full gap-2">
        {segments.map((segment) => (
          <div
            className="flex items-center justify-between gap-3 text-sm"
            key={segment.label}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-ink/70">{segment.label}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink/6">
                <span
                  className="block h-full rounded-full transition-[width] duration-150"
                  style={{
                    backgroundColor: segment.color,
                    width: `${(segment.value / total) * 100 * progress}%`,
                  }}
                />
              </div>
            </div>
            <div className="text-right">
              <span className="block font-semibold tabular-nums text-ink">
                {formatCurrency(segment.value, currency)}
              </span>
              <span className="text-xs font-semibold tabular-nums text-ink/45">
                {Math.round((segment.value / total) * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
