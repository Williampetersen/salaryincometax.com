interface CompareMetricBarsProps {
  countryAName: string;
  countryBName: string;
  metrics: Array<{
    label: string;
    valueA: number;
    valueB: number;
    formatValue: (value: number) => string;
  }>;
}

const COLOR_A = "#122029";
const COLOR_B = "#f56b4f";

export function CompareMetricBars({
  countryAName,
  countryBName,
  metrics,
}: CompareMetricBarsProps): JSX.Element {
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center gap-5 text-sm">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLOR_A }} />
          <span className="font-medium text-ink/70">{countryAName}</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLOR_B }} />
          <span className="font-medium text-ink/70">{countryBName}</span>
        </span>
      </div>
      <div className="grid gap-5">
        {metrics.map((metric) => {
          const highest = Math.max(metric.valueA, metric.valueB, 1);

          return (
            <div key={metric.label}>
              <p className="mb-2 text-sm font-semibold text-ink">{metric.label}</p>
              <div className="grid gap-1.5">
                <BarRow
                  color={COLOR_A}
                  label={countryAName}
                  ratio={metric.valueA / highest}
                  value={metric.formatValue(metric.valueA)}
                />
                <BarRow
                  color={COLOR_B}
                  label={countryBName}
                  ratio={metric.valueB / highest}
                  value={metric.formatValue(metric.valueB)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BarRow({
  color,
  label,
  ratio,
  value,
}: {
  color: string;
  label: string;
  ratio: number;
  value: string;
}): JSX.Element {
  return (
    <div className="flex items-center gap-3">
      <div className="h-3 flex-1 overflow-hidden rounded-full bg-ink/8">
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{
            backgroundColor: color,
            width: `${Math.max(ratio * 100, 4)}%`,
          }}
        />
      </div>
      <span className="w-32 shrink-0 text-right text-sm font-semibold tabular-nums text-ink sm:w-36">
        {value}
      </span>
      <span className="sr-only">{label}</span>
    </div>
  );
}
