import { formatCurrency } from "@/lib/formatters";

interface ComparisonChartProps {
  currency: string;
  bars: Array<{
    label: string;
    value: number;
    color: string;
  }>;
}

export function ComparisonChart({
  currency,
  bars,
}: ComparisonChartProps): JSX.Element {
  const highest = Math.max(...bars.map((bar) => bar.value), 1);

  return (
    <div className="grid gap-4">
      {bars.map((bar) => (
        <div key={bar.label}>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-ink/70">{bar.label}</span>
            <span className="font-semibold text-ink">
              {formatCurrency(bar.value, currency)}
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-ink/8">
            <div
              className="h-full rounded-full"
              style={{
                backgroundColor: bar.color,
                width: `${Math.max((bar.value / highest) * 100, 5)}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
