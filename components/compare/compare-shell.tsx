"use client";

import { useState, useTransition } from "react";

import { CompareMetricBars } from "@/components/compare/compare-metric-bars";
import { DonutChart } from "@/components/charts/donut-chart";
import { CountryCombobox } from "@/components/shared/country-combobox";
import { CountryFlag } from "@/components/shared/country-flag";
import type { CountrySummary } from "@/lib/country-catalog";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { event as trackEvent } from "@/lib/gtag";
import type { CalculationResult, SalaryPeriod } from "@/lib/tax-engine/types";

interface CompareShellProps {
  countries: CountrySummary[];
  groups: Array<{ region: string; countries: CountrySummary[] }>;
  defaultAmounts: Record<string, number>;
  initialCountryASlug: string;
  initialCountryBSlug: string;
  initialResultA: CalculationResult;
  initialResultB: CalculationResult;
}

const SALARY_PERIOD: SalaryPeriod = "yearly";

async function fetchResult(
  countrySlug: string,
  amount: number,
): Promise<CalculationResult | { error: string }> {
  const response = await fetch("/api/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      country: countrySlug,
      amount,
      salaryPeriod: SALARY_PERIOD,
    }),
  });

  return response.json() as Promise<CalculationResult | { error: string }>;
}

export function CompareShell({
  countries,
  groups,
  defaultAmounts,
  initialCountryASlug,
  initialCountryBSlug,
  initialResultA,
  initialResultB,
}: CompareShellProps): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [countrySlugA, setCountrySlugA] = useState(initialCountryASlug);
  const [countrySlugB, setCountrySlugB] = useState(initialCountryBSlug);
  const [amountA, setAmountA] = useState(initialResultA.annual.gross);
  const [amountB, setAmountB] = useState(initialResultB.annual.gross);
  const [resultA, setResultA] = useState(initialResultA);
  const [resultB, setResultB] = useState(initialResultB);

  const countryA =
    countries.find((country) => country.slug === countrySlugA) ?? countries[0];
  const countryB =
    countries.find((country) => country.slug === countrySlugB) ?? countries[0];

  function runComparison(
    nextCountryA: string,
    nextAmountA: number,
    nextCountryB: string,
    nextAmountB: number,
  ): void {
    setError(null);

    startTransition(() => {
      void (async () => {
        const [payloadA, payloadB] = await Promise.all([
          fetchResult(nextCountryA, nextAmountA),
          fetchResult(nextCountryB, nextAmountB),
        ]);

        if ("error" in payloadA || "error" in payloadB) {
          setError(
            "error" in payloadA
              ? payloadA.error
              : "error" in payloadB
                ? payloadB.error
                : "Comparison request failed.",
          );
          return;
        }

        setResultA(payloadA);
        setResultB(payloadB);
        trackEvent({
          action: "country_comparison_run",
          category: "compare",
          label: `${nextCountryA}:${nextCountryB}`,
        });
      })();
    });
  }

  function handleCountryAChange(slug: string): void {
    const nextAmount = defaultAmounts[slug] ?? amountA;
    setCountrySlugA(slug);
    setAmountA(nextAmount);
    runComparison(slug, nextAmount, countrySlugB, amountB);
  }

  function handleCountryBChange(slug: string): void {
    const nextAmount = defaultAmounts[slug] ?? amountB;
    setCountrySlugB(slug);
    setAmountB(nextAmount);
    runComparison(countrySlugA, amountA, slug, nextAmount);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    runComparison(countrySlugA, amountA, countrySlugB, amountB);
  }

  const lowerEffectiveRate =
    resultA.effectiveTaxRate === resultB.effectiveTaxRate
      ? null
      : resultA.effectiveTaxRate < resultB.effectiveTaxRate
        ? resultA
        : resultB;

  const sameCurrency = resultA.currency === resultB.currency;
  const higherNetSameCurrency =
    sameCurrency && resultA.annual.net !== resultB.annual.net
      ? resultA.annual.net > resultB.annual.net
        ? resultA
        : resultB
      : null;

  const metrics = [
    {
      label: "Annual gross salary",
      valueA: resultA.annual.gross,
      valueB: resultB.annual.gross,
    },
    {
      label: "Annual net salary (take-home)",
      valueA: resultA.annual.net,
      valueB: resultB.annual.net,
    },
    {
      label: "Total annual tax",
      valueA: resultA.annual.totalTax,
      valueB: resultB.annual.totalTax,
    },
  ];

  return (
    <div className="mt-4 space-y-6">
      <form
        className="panel grid gap-5 p-5 sm:p-7 lg:grid-cols-[1fr_auto_1fr]"
        onSubmit={handleSubmit}
      >
        <CompareSide
          amount={amountA}
          country={countryA}
          groups={groups}
          onAmountChange={setAmountA}
          onCountryChange={handleCountryAChange}
          sideId="a"
        />

        <div
          aria-hidden="true"
          className="hidden items-center justify-center text-2xl font-bold text-ink/25 lg:flex"
        >
          vs
        </div>

        <CompareSide
          amount={amountB}
          country={countryB}
          groups={groups}
          onAmountChange={setAmountB}
          onCountryChange={handleCountryBChange}
          sideId="b"
        />

        {error ? (
          <div className="rounded-3xl border border-coral/25 bg-coral/8 px-4 py-3 text-sm text-coral lg:col-span-3">
            {error}
          </div>
        ) : null}

        <button
          className="inline-flex items-center justify-center rounded-3xl bg-ink px-5 py-4 font-semibold text-white transition hover:bg-coral disabled:cursor-wait disabled:opacity-70 lg:col-span-3"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Comparing..." : "Compare"}
        </button>
      </form>

      <section className="panel p-5 sm:p-7">
        <p className="eyebrow">Head-to-head</p>
        <h2 className="mt-4 font-[var(--font-display)] text-3xl font-bold">
          {countryA?.name} vs {countryB?.name}
        </h2>

        <div className="mt-5 rounded-3xl border border-ink/10 bg-paper/60 p-5 text-sm leading-6 text-ink/72">
          {lowerEffectiveRate ? (
            <p>
              <span className="font-semibold text-ink">
                {lowerEffectiveRate.countryName}
              </span>{" "}
              has the lower effective tax rate at these salary levels (
              {formatPercent(resultA.effectiveTaxRate)} in {resultA.countryName}{" "}
              vs {formatPercent(resultB.effectiveTaxRate)} in{" "}
              {resultB.countryName}). Effective tax rate is currency-independent,
              so it is the fairest single comparison when the two countries use
              different currencies.
            </p>
          ) : (
            <p>
              Both countries currently show the same effective tax rate at these
              salary levels ({formatPercent(resultA.effectiveTaxRate)}).
            </p>
          )}
          {higherNetSameCurrency ? (
            <p className="mt-3">
              Since both results are in {resultA.currency}, net pay is also
              directly comparable:{" "}
              <span className="font-semibold text-ink">
                {higherNetSameCurrency.countryName}
              </span>{" "}
              leaves more annual take-home pay.
            </p>
          ) : !sameCurrency ? (
            <p className="mt-3">
              {resultA.countryName} results are in {resultA.currency} and{" "}
              {resultB.countryName} results are in {resultB.currency}. This tool
              does not convert between currencies, so compare net pay figures
              only after converting them yourself.
            </p>
          ) : null}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <ResultColumn country={countryA} result={resultA} />
          <ResultColumn country={countryB} result={resultB} />
        </div>

        {sameCurrency ? (
          <div className="mt-8 rounded-4xl border border-ink/10 bg-white p-5 sm:p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/55">
              Metric comparison
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/62">
              Bar length is relative within each metric, so it is easiest to
              read gross, net, and tax separately rather than across rows.
            </p>
            <div className="mt-6">
              <CompareMetricBars
                countryAName={resultA.countryName}
                countryBName={resultB.countryName}
                metrics={metrics.map((metric) => ({
                  ...metric,
                  formatValue: (value: number) =>
                    formatCurrency(value, resultA.currency),
                }))}
              />
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-4xl border border-dashed border-ink/12 bg-paper/60 p-5 text-sm leading-6 text-ink/62 sm:p-7">
            A direct gross/net/tax bar comparison is only shown when both
            countries share the same currency, since bar length would
            otherwise compare two different currencies as if they were equal.
            Use the effective tax rate comparison and the per-country cards
            and tax-split charts above to compare {resultA.countryName} (
            {resultA.currency}) and {resultB.countryName} ({resultB.currency})
            directly.
          </div>
        )}
      </section>
    </div>
  );
}

function CompareSide({
  sideId,
  country,
  groups,
  amount,
  onCountryChange,
  onAmountChange,
}: {
  sideId: string;
  country: CountrySummary;
  groups: Array<{ region: string; countries: CountrySummary[] }>;
  amount: number;
  onCountryChange: (slug: string) => void;
  onAmountChange: (amount: number) => void;
}): JSX.Element {
  return (
    <div className="space-y-4">
      <CountryCombobox
        groups={groups}
        id={`compare-country-${sideId}`}
        label={sideId === "a" ? "Country A" : "Country B"}
        onChange={onCountryChange}
        value={country}
      />
      <div>
        <label className="field-label" htmlFor={`compare-amount-${sideId}`}>
          Gross annual salary ({country.currency})
        </label>
        <input
          className="form-control"
          id={`compare-amount-${sideId}`}
          min="0"
          onChange={(event) => onAmountChange(Number(event.target.value))}
          step="0.01"
          type="number"
          value={amount}
        />
      </div>
    </div>
  );
}

function ResultColumn({
  country,
  result,
}: {
  country: CountrySummary;
  result: CalculationResult;
}): JSX.Element {
  const donutSegments = [
    { label: "Take-home pay", value: result.annual.net, color: "#315f4c" },
    { label: "Income tax", value: result.annual.incomeTax, color: "#f56b4f" },
    {
      label: "Social contributions",
      value: result.annual.socialSecurity,
      color: "#9ac6d9",
    },
    {
      label: "Regional or local tax",
      value: result.annual.regionalTaxes,
      color: "#f1d4ad",
    },
  ].filter((segment) => segment.value > 0);

  return (
    <div className="rounded-4xl border border-ink/10 bg-paper/50 p-5">
      <div className="flex items-center gap-3">
        <CountryFlag
          className="h-9 w-9 rounded-full border border-ink/10 object-cover"
          countryCode={country.countryCode}
          countryName={country.name}
          flagSrc={country.flagSrc}
          size={36}
        />
        <div>
          <p className="font-[var(--font-display)] text-xl font-bold text-ink">
            {result.countryName}
          </p>
          <p className="text-xs uppercase tracking-[0.18em] text-ink/50">
            Tax year {result.taxYear}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <MiniMetric
          label="Gross"
          value={formatCurrency(result.annual.gross, result.currency)}
        />
        <MiniMetric
          label="Net"
          value={formatCurrency(result.annual.net, result.currency)}
        />
        <MiniMetric
          label="Total tax"
          value={formatCurrency(result.annual.totalTax, result.currency)}
        />
        <MiniMetric
          label="Effective rate"
          value={formatPercent(result.effectiveTaxRate)}
        />
      </div>

      <div className="mt-5 flex justify-center rounded-3xl border border-white/70 bg-white/80 p-4 shadow-card">
        <DonutChart
          centerLabel="Annual net"
          centerValue={formatCurrency(result.annual.net, result.currency)}
          currency={result.currency}
          segments={donutSegments}
        />
      </div>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-3">
      <p className="text-[10px] uppercase tracking-[0.18em] text-ink/50">
        {label}
      </p>
      <p className="mt-1 break-words font-[var(--font-display)] text-lg font-bold tabular-nums text-ink">
        {value}
      </p>
    </div>
  );
}
