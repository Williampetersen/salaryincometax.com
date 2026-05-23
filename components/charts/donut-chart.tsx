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
  const size = 220;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;

  let dashOffset = circumference * 0.25;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative h-[220px] w-[220px]">
        <svg className="-rotate-90" height={size} width={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            fill="none"
            r={radius}
            stroke="rgba(18, 32, 41, 0.08)"
            strokeWidth={strokeWidth}
          />
          {segments.map((segment) => {
            const dashLength = (segment.value / total) * circumference;
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
              />
            );

            dashOffset -= dashLength;
            return circle;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xs uppercase tracking-[0.24em] text-ink/55">
            {centerLabel}
          </span>
          <span className="mt-2 max-w-[138px] break-words font-[var(--font-display)] text-[clamp(1.45rem,1.8vw,2rem)] font-bold leading-tight tabular-nums">
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
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-ink/70">{segment.label}</span>
            </div>
            <span className="text-right font-semibold tabular-nums text-ink">
              {formatCurrency(segment.value, currency)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
