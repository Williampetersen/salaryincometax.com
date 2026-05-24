"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

import { CountryPicker } from "@/components/calculator/country-picker";
import { ComparisonChart } from "@/components/charts/comparison-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import { CountryFlag } from "@/components/shared/country-flag";
import type { CountrySummary } from "@/lib/country-catalog";
import { formatCurrency, formatPercent, formatTimestamp } from "@/lib/formatters";
import { event as trackEvent } from "@/lib/gtag";
import { DISCLAIMER } from "@/lib/site";
import type {
  CalculationInput,
  CalculationResult,
  CountryTaxRule,
  PeriodBreakdownValue,
  SalaryPeriod,
} from "@/lib/tax-engine/types";

interface HistoryItem {
  timestamp: string;
  countrySlug: string;
  countryName: string;
  description?: string;
  gross: number;
  net: number;
  currency: string;
  period: SalaryPeriod;
}

interface CalculatorShellProps {
  country: CountrySummary;
  countryGroups: Array<{
    region: string;
    countries: CountrySummary[];
  }>;
  rule: CountryTaxRule;
  initialResult: CalculationResult;
  relatedCountries: CountrySummary[];
}

const HISTORY_KEY = "salary-income-tax-history";

const PERIOD_LABELS: Record<SalaryPeriod, string> = {
  yearly: "Yearly",
  monthly: "Monthly",
  weekly: "Weekly",
  daily: "Daily",
  hourly: "Hourly",
};

export function CalculatorShell({
  country,
  countryGroups,
  rule,
  initialResult,
  relatedCountries,
}: CalculatorShellProps): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [result, setResult] = useState(initialResult);
  const [error, setError] = useState<string | null>(null);
  const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([]);
  const [form, setForm] = useState<CalculationInput>(initialResult.input);

  useEffect(() => {
    try {
      const rawHistory = window.localStorage.getItem(HISTORY_KEY);
      if (!rawHistory) {
        return;
      }

      const parsed = JSON.parse(rawHistory) as HistoryItem[];
      setRecentHistory(parsed.slice(0, 5));
    } catch {
      setRecentHistory([]);
    }
  }, []);

  function updateField<K extends keyof CalculationInput>(
    key: K,
    value: CalculationInput[K],
  ): void {
    // Track reverse-calculation intent as soon as the user enables it.
    if (key === "reverseCalculation" && value === true) {
      trackEvent({
        action: "reverse_calculation_used",
        category: "calculator",
        label: country.slug,
      });
    }

    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function saveHistory(nextResult: CalculationResult): void {
    const entry: HistoryItem = {
      timestamp: new Date().toISOString(),
      countrySlug: nextResult.countrySlug,
      countryName: nextResult.countryName,
      description: nextResult.input.description,
      gross: nextResult.annual.gross,
      net: nextResult.annual.net,
      currency: nextResult.currency,
      period: nextResult.input.salaryPeriod,
    };

    const nextHistory = [entry, ...recentHistory].slice(0, 5);
    setRecentHistory(nextHistory);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setError(null);
    trackEvent({
      action: "calculator_submit",
      category: "calculator",
      label: country.slug,
    });

    startTransition(() => {
      void (async () => {
        const response = await fetch("/api/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        const payload = (await response.json()) as
          | CalculationResult
          | { error: string };

        if (!response.ok || "error" in payload) {
          setError(
            "error" in payload ? payload.error : "Calculation request failed.",
          );
          return;
        }

        setResult(payload);
        saveHistory(payload);
        trackEvent({
          action: "salary_calculated",
          category: "calculator",
          label: `${payload.countrySlug}:${payload.input.salaryPeriod}`,
          value: Math.round(payload.annual.gross),
        });

        if (payload.input.reverseCalculation) {
          trackEvent({
            action: "reverse_calculation_completed",
            category: "calculator",
            label: payload.countrySlug,
            value: Math.round(payload.reverseEstimatedGross ?? payload.annual.gross),
          });
        }
      })();
    });
  }

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

  const comparisonBars = [
    {
      label: "Your annual gross",
      value: result.comparison.salary,
      color: "#122029",
    },
    {
      label: "Median salary",
      value: result.comparison.medianSalary,
      color: "#315f4c",
    },
    {
      label: "Minimum wage",
      value: result.comparison.minimumWage,
      color: "#f56b4f",
    },
  ];

  const periodRows = Object.entries(result.periodBreakdown) as Array<
    [SalaryPeriod, PeriodBreakdownValue]
  >;
  const summaryRows = [
    {
      label: "Gross salary",
      value: formatCurrency(result.annual.gross, result.currency),
      note: "Before income tax and payroll deductions.",
    },
    {
      label: "Net salary",
      value: formatCurrency(result.annual.net, result.currency),
      note: "Estimated take-home pay after tax and contributions.",
    },
    {
      label: "Total tax",
      value: formatCurrency(result.annual.totalTax, result.currency),
      note: "Combined income tax, social charges, and local taxes.",
    },
    {
      label: "Effective rate",
      value: formatPercent(result.effectiveTaxRate),
      note: "Share of gross pay that does not reach take-home income.",
    },
  ];
  const taxSplitRows = [
    {
      label: "Take-home pay",
      value: formatCurrency(result.annual.net, result.currency),
      note: "Estimated annual amount that reaches your bank account.",
    },
    {
      label: "Income tax",
      value: formatCurrency(result.annual.incomeTax, result.currency),
      note: "National or state income tax based on the configured tax rules.",
    },
    {
      label: "Social contributions",
      value: formatCurrency(result.annual.socialSecurity, result.currency),
      note: "Employee payroll contributions such as pensions, health, or social insurance.",
    },
    {
      label: "Regional or local tax",
      value: formatCurrency(result.annual.regionalTaxes, result.currency),
      note: "City, municipal, or regional charges included in this estimate.",
    },
  ].filter((row) => row.value !== formatCurrency(0, result.currency));
  const comparisonRows = [
    {
      label: "Your annual gross",
      value: formatCurrency(result.comparison.salary, result.currency),
      note: "The salary used for this calculation.",
    },
    {
      label: "Median salary",
      value: formatCurrency(result.comparison.medianSalary, result.currency),
      note: "A benchmark midpoint salary for the selected country.",
    },
    {
      label: "Minimum wage",
      value: formatCurrency(result.comparison.minimumWage, result.currency),
      note: "The baseline legal or modeled wage floor used in the country data.",
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(18rem,0.84fr)_minmax(0,1.16fr)]">
      <form
        className="panel h-fit p-5 sm:p-7 lg:sticky lg:top-24"
        onSubmit={handleSubmit}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">
              <CountryFlag
                className="h-5 w-5 rounded-full object-cover"
                countryCode={country.countryCode}
                countryName={country.name}
                flagSrc={country.flagSrc}
                size={20}
              />
              {country.region}
            </p>
            <h2 className="mt-4 font-[var(--font-display)] text-3xl font-bold text-ink">
              Calculator inputs
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink/66">
              Adjust the core salary inputs first, then expand more options for tax
              year, bonus, household details, and reverse calculation.
            </p>
          </div>
          <span
            className={`status-chip ${
              rule.implementationStatus === "complete"
                ? "bg-moss/10 text-moss"
                : "bg-sand/70 text-ink/70"
            }`}
          >
            {rule.implementationStatus === "complete"
              ? "Detailed"
              : "Illustrative"}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="country-picker">
              Country
            </label>
            <div id="country-picker">
              <CountryPicker currentCountry={country} groups={countryGroups} />
            </div>
          </div>

          <div>
            <label className="field-label" htmlFor="amount">
              {form.reverseCalculation ? "Desired net salary" : "Gross salary"}
            </label>
            <input
              className="form-control"
              id="amount"
              min="0"
              onChange={(event) => updateField("amount", Number(event.target.value))}
              step="0.01"
              type="number"
              value={form.amount}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="currency">
              Currency
            </label>
            <select
              className="form-control"
              id="currency"
              onChange={(event) => updateField("currency", event.target.value)}
              value={form.currency}
            >
              {rule.supportedCurrencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 rounded-4xl border border-ink/10 bg-paper/45 p-4 sm:p-5">
          <button
            aria-expanded={showAdvancedOptions}
            className="flex w-full items-center justify-between gap-4 text-left"
            onClick={() => setShowAdvancedOptions((current) => !current)}
            type="button"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink/55">
                More options
              </p>
              <p className="mt-2 text-sm leading-6 text-ink/62">
                Salary period, tax year, work schedule, extra income, family
                status, and reverse calculation.
              </p>
            </div>
            <span className="rounded-full border border-ink/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
              {showAdvancedOptions ? "Hide" : "Expand"}
            </span>
          </button>

          {showAdvancedOptions ? (
            <div className="mt-5 grid gap-4 border-t border-ink/10 pt-5 sm:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="salaryPeriod">
                  Salary period
                </label>
                <select
                  className="form-control"
                  id="salaryPeriod"
                  onChange={(event) =>
                    updateField("salaryPeriod", event.target.value as SalaryPeriod)
                  }
                  value={form.salaryPeriod}
                >
                  <option value="yearly">Yearly</option>
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="daily">Daily</option>
                  <option value="hourly">Hourly</option>
                </select>
              </div>

              <div>
                <label className="field-label" htmlFor="taxYear">
                  Tax year
                </label>
                <select
                  className="form-control"
                  id="taxYear"
                  onChange={(event) => updateField("taxYear", Number(event.target.value))}
                  value={form.taxYear}
                >
                  {country.availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="field-label" htmlFor="paidMonthsPerYear">
                  Paid months per year
                </label>
                <input
                  className="form-control"
                  id="paidMonthsPerYear"
                  min="1"
                  onChange={(event) =>
                    updateField("paidMonthsPerYear", Number(event.target.value))
                  }
                  type="number"
                  value={form.paidMonthsPerYear}
                />
              </div>

              <div>
                <label className="field-label" htmlFor="paidWeeksPerYear">
                  Paid weeks per year
                </label>
                <input
                  className="form-control"
                  id="paidWeeksPerYear"
                  min="1"
                  onChange={(event) =>
                    updateField("paidWeeksPerYear", Number(event.target.value))
                  }
                  type="number"
                  value={form.paidWeeksPerYear}
                />
              </div>

              <div>
                <label className="field-label" htmlFor="workingDaysPerWeek">
                  Working days per week
                </label>
                <input
                  className="form-control"
                  id="workingDaysPerWeek"
                  min="1"
                  onChange={(event) =>
                    updateField("workingDaysPerWeek", Number(event.target.value))
                  }
                  type="number"
                  value={form.workingDaysPerWeek}
                />
              </div>

              <div>
                <label className="field-label" htmlFor="workingHoursPerWeek">
                  Working hours per week
                </label>
                <input
                  className="form-control"
                  id="workingHoursPerWeek"
                  min="1"
                  onChange={(event) =>
                    updateField("workingHoursPerWeek", Number(event.target.value))
                  }
                  step="0.5"
                  type="number"
                  value={form.workingHoursPerWeek}
                />
              </div>

              <div>
                <label className="field-label" htmlFor="extraIncome">
                  Extra income or annual bonus
                </label>
                <input
                  className="form-control"
                  id="extraIncome"
                  min="0"
                  onChange={(event) =>
                    updateField("extraIncome", Number(event.target.value))
                  }
                  step="0.01"
                  type="number"
                  value={form.extraIncome}
                />
              </div>

              <div>
                <label className="field-label" htmlFor="personalStatus">
                  Personal status
                </label>
                <select
                  className="form-control"
                  id="personalStatus"
                  onChange={(event) => updateField("personalStatus", event.target.value)}
                  value={form.personalStatus}
                >
                  {rule.personalStatuses.map((status) => (
                    <option key={status.key} value={status.key}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="field-label" htmlFor="numberOfChildren">
                  Number of children
                </label>
                <input
                  className="form-control"
                  id="numberOfChildren"
                  min="0"
                  onChange={(event) =>
                    updateField("numberOfChildren", Number(event.target.value))
                  }
                  type="number"
                  value={form.numberOfChildren}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="description">
                  Optional description
                </label>
                <input
                  className="form-control"
                  id="description"
                  onChange={(event) => updateField("description", event.target.value)}
                  placeholder="Example: relocation offer, promotion, freelance option"
                  type="text"
                  value={form.description ?? ""}
                />
              </div>

              <label className="sm:col-span-2 flex items-start gap-3 rounded-3xl border border-ink/10 bg-white/80 p-4 text-sm text-ink/72">
                <input
                  checked={form.reverseCalculation}
                  className="mt-1 h-4 w-4 rounded border-ink/20 text-coral focus:ring-coral/20"
                  onChange={(event) =>
                    updateField("reverseCalculation", event.target.checked)
                  }
                  type="checkbox"
                />
                <span>
                  Reverse calculation: estimate the gross salary needed to reach
                  the entered net amount.
                </span>
              </label>
            </div>
          ) : null}
        </div>

        {error ? (
          <div className="mt-4 rounded-3xl border border-coral/25 bg-coral/8 px-4 py-3 text-sm text-coral">
            {error}
          </div>
        ) : null}

        <button
          className="mt-5 inline-flex w-full items-center justify-center rounded-3xl bg-ink px-5 py-4 font-semibold text-white transition hover:bg-coral disabled:cursor-wait disabled:opacity-70"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Calculating..." : "Calculate now"}
        </button>
      </form>

      <div className="min-w-0 space-y-6">
        <section className="panel min-w-0 p-5 sm:p-7">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <p className="eyebrow">Results</p>
              <h2 className="mt-4 font-[var(--font-display)] text-3xl font-bold">
                {country.name} take-home pay
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink/68">
                Status: {result.metadata.statusLabel}. Period:{" "}
                {PERIOD_LABELS[result.input.salaryPeriod]}. Tax year: {result.taxYear}.
              </p>
            </div>
            {result.reverseEstimatedGross ? (
              <div className="rounded-3xl bg-ink px-5 py-4 text-white">
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                  Estimated gross needed
                </p>
                <p className="mt-1 font-[var(--font-display)] text-2xl font-bold leading-tight">
                  {formatCurrency(result.reverseEstimatedGross, result.currency)}
                </p>
              </div>
            ) : null}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:hidden">
            <MetricCard
              label="Gross salary"
              value={formatCurrency(result.annual.gross, result.currency)}
            />
            <MetricCard
              label="Net salary"
              value={formatCurrency(result.annual.net, result.currency)}
            />
            <MetricCard
              label="Total tax"
              value={formatCurrency(result.annual.totalTax, result.currency)}
            />
            <MetricCard
              label="Effective rate"
              value={formatPercent(result.effectiveTaxRate)}
            />
          </div>

          <div className="mt-6 hidden overflow-hidden rounded-4xl border border-ink/10 bg-white xl:block">
            <div className="border-b border-ink/10 px-6 py-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/55">
                Annual pay summary
              </p>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/62">
                A desktop table view for gross pay, take-home pay, total tax, and
                the effective tax rate.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-fixed">
                <thead className="bg-ink/4 text-left text-xs uppercase tracking-[0.18em] text-ink/55">
                  <tr>
                    <th className="w-[24%] px-6 py-4 font-semibold">Metric</th>
                    <th className="w-[24%] px-6 py-4 font-semibold text-right">
                      Annual amount
                    </th>
                    <th className="px-6 py-4 font-semibold">What it means</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryRows.map((row) => (
                    <tr className="border-t border-ink/8 align-top" key={row.label}>
                      <td className="px-6 py-4 font-semibold text-ink">{row.label}</td>
                      <td className="px-6 py-4 text-right font-[var(--font-display)] text-[1.75rem] font-bold leading-none tracking-tight text-ink tabular-nums whitespace-nowrap">
                        {row.value}
                      </td>
                      <td className="px-6 py-4 text-sm leading-6 text-ink/68">
                        {row.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <div className="overflow-hidden rounded-4xl border border-ink/10 bg-white">
              <div className="border-b border-ink/10 px-5 py-5 sm:px-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/55">
                  Tax split
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/62">
                  A separate annual view of take-home pay, income tax, social
                  contributions, and local charges.
                </p>
              </div>
              <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-[minmax(18rem,20rem)_minmax(0,1fr)]">
                <div className="mx-auto w-full max-w-[20rem]">
                  <DonutChart
                    centerLabel="Annual net"
                    centerValue={formatCurrency(result.annual.net, result.currency)}
                    currency={result.currency}
                    segments={donutSegments}
                  />
                </div>
                <div className="overflow-hidden rounded-3xl border border-ink/10 bg-paper/45">
                  <table className="min-w-full table-fixed">
                    <thead className="bg-ink/4 text-left text-xs uppercase tracking-[0.18em] text-ink/55">
                      <tr>
                        <th className="w-[26%] px-5 py-4 font-semibold">Component</th>
                        <th className="w-[24%] px-5 py-4 font-semibold text-right">
                          Annual amount
                        </th>
                        <th className="px-5 py-4 font-semibold">What it covers</th>
                      </tr>
                    </thead>
                    <tbody>
                      {taxSplitRows.map((row) => (
                        <tr className="border-t border-ink/8 align-top" key={row.label}>
                          <td className="px-5 py-4 font-semibold text-ink">{row.label}</td>
                          <td className="px-5 py-4 text-right font-[var(--font-display)] text-[1.5rem] font-bold leading-none tracking-tight text-ink tabular-nums whitespace-nowrap">
                            {row.value}
                          </td>
                          <td className="px-5 py-4 text-sm leading-6 text-ink/68">
                            {row.note}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-4xl border border-ink/10 bg-paper/60">
              <div className="border-b border-ink/10 px-5 py-5 sm:px-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/55">
                  Pay breakdown
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/62">
                  Compare gross pay, take-home pay, and tax across every pay
                  period in its own full-width section.
                </p>
              </div>
              <div className="p-5 sm:p-6">
                <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white">
                  <div className="overflow-x-auto">
                    <table className="min-w-[32rem] text-sm xl:min-w-full xl:table-fixed">
                      <thead className="bg-ink/4 text-left text-xs uppercase tracking-[0.18em] text-ink/55">
                        <tr>
                          <th className="w-[22%] px-4 py-3 font-semibold">Period</th>
                          <th className="w-[26%] px-4 py-3 font-semibold text-right">
                            Gross
                          </th>
                          <th className="w-[26%] px-4 py-3 font-semibold text-right">
                            Net
                          </th>
                          <th className="w-[26%] px-4 py-3 font-semibold text-right">
                            Tax
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {periodRows.map(([period, values]) => (
                          <tr
                            className="border-t border-ink/8 text-ink/76"
                            key={period}
                          >
                            <td className="px-4 py-3 font-semibold text-ink">
                              {PERIOD_LABELS[period]}
                            </td>
                            <td className="px-4 py-3 text-right tabular-nums whitespace-nowrap">
                              {formatCurrency(values.gross, result.currency)}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold tabular-nums text-ink whitespace-nowrap">
                              {formatCurrency(values.net, result.currency)}
                            </td>
                            <td className="px-4 py-3 text-right tabular-nums whitespace-nowrap">
                              {formatCurrency(values.tax, result.currency)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-4xl border border-ink/10 bg-white">
              <div className="border-b border-ink/10 px-5 py-5 sm:px-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/55">
                  Salary comparison
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/62">
                  See how this annual gross salary compares with the country
                  median salary and the minimum wage benchmark.
                </p>
              </div>
              <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.88fr)]">
                <div className="overflow-hidden rounded-3xl border border-ink/10 bg-paper/45">
                  <table className="min-w-full table-fixed">
                    <thead className="bg-ink/4 text-left text-xs uppercase tracking-[0.18em] text-ink/55">
                      <tr>
                        <th className="w-[26%] px-5 py-4 font-semibold">Benchmark</th>
                        <th className="w-[24%] px-5 py-4 font-semibold text-right">
                          Annual amount
                        </th>
                        <th className="px-5 py-4 font-semibold">Why it matters</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonRows.map((row) => (
                        <tr className="border-t border-ink/8 align-top" key={row.label}>
                          <td className="px-5 py-4 font-semibold text-ink">{row.label}</td>
                          <td className="px-5 py-4 text-right font-[var(--font-display)] text-[1.5rem] font-bold leading-none tracking-tight text-ink tabular-nums whitespace-nowrap">
                            {row.value}
                          </td>
                          <td className="px-5 py-4 text-sm leading-6 text-ink/68">
                            {row.note}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="rounded-3xl border border-ink/10 bg-white p-5">
                  <ComparisonChart bars={comparisonBars} currency={result.currency} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)]">
          <div className="panel p-5 sm:p-6">
            <h3 className="font-[var(--font-display)] text-2xl font-bold">
              Tax details
            </h3>
            <div className="mt-5 space-y-5 text-sm">
              <TaxBlock
                amount={result.annual.totalDeductions}
                currency={result.currency}
                items={result.deductionLines}
                title="Deductions"
              />
              <TaxBlock
                amount={result.annual.socialSecurity}
                currency={result.currency}
                items={result.socialSecurityLines}
                title="Social contributions"
              />
              <TaxBlock
                amount={result.annual.regionalTaxes}
                currency={result.currency}
                items={result.regionalTaxLines}
                title="Regional and local tax"
              />
              <div className="rounded-3xl border border-ink/10 bg-paper/60 p-4">
                <p className="text-sm font-semibold text-ink">Taxable income</p>
                <p className="mt-1 text-lg font-bold tabular-nums text-ink">
                  {formatCurrency(result.annual.taxableIncome, result.currency)}
                </p>
              </div>
            </div>
          </div>

          <div className="panel p-5 sm:p-6">
            <h3 className="font-[var(--font-display)] text-2xl font-bold">
              Recent calculations
            </h3>
            <div className="mt-5 space-y-3">
              {recentHistory.length > 0 ? (
                recentHistory.map((entry) => (
                  <div
                    className="rounded-3xl border border-ink/10 bg-white p-4"
                    key={`${entry.timestamp}-${entry.countrySlug}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-ink">{entry.countryName}</p>
                        <p className="text-xs uppercase tracking-[0.18em] text-ink/50">
                          {PERIOD_LABELS[entry.period]}
                        </p>
                      </div>
                      <p className="text-xs text-ink/52">
                        {formatTimestamp(entry.timestamp)}
                      </p>
                    </div>
                    {entry.description ? (
                      <p className="mt-3 text-sm text-ink/62">{entry.description}</p>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-4 text-sm tabular-nums">
                      <span>Gross {formatCurrency(entry.gross, entry.currency)}</span>
                      <span>Net {formatCurrency(entry.net, entry.currency)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-ink/12 bg-paper/60 p-5 text-sm text-ink/58">
                  Your last five calculations will appear here after you run them.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="panel p-5 sm:p-6">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <div>
              <p className="eyebrow" id="disclaimer">
                Disclaimer
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-ink/70">
                {DISCLAIMER}
              </p>
              <p className="mt-3 text-sm leading-7 text-ink/62">
                {result.metadata.notes}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/55">
                Related calculators
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {relatedCountries.map((item) => (
                  <Link
                    className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm transition hover:border-coral/35 hover:text-coral"
                    href={`/salary-calculator/${item.slug}`}
                    key={item.slug}
                  >
                    <CountryFlag
                      className="h-5 w-5 rounded-full object-cover"
                      countryCode={item.countryCode}
                      countryName={item.name}
                      flagSrc={item.flagSrc}
                      size={20}
                    />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}): JSX.Element {
  return (
    <div className="min-w-0 rounded-3xl border border-ink/10 bg-white p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-ink/50">{label}</p>
      <p className="mt-3 break-words font-[var(--font-display)] text-[clamp(1.75rem,2vw,2.5rem)] font-bold leading-[1.02] tracking-tight text-ink tabular-nums">
        {value}
      </p>
    </div>
  );
}

function TaxBlock({
  title,
  amount,
  currency,
  items,
}: {
  title: string;
  amount: number;
  currency: string;
  items: Array<{ name: string; amount: number }>;
}): JSX.Element {
  return (
    <div className="rounded-3xl border border-ink/10 bg-white p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-ink">{title}</p>
        <p className="font-bold tabular-nums text-ink">
          {formatCurrency(amount, currency)}
        </p>
      </div>
      {items.length ? (
        <div className="mt-3 space-y-2 text-ink/62">
          {items.map((item) => (
            <div
              className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
              key={item.name}
            >
              <span>{item.name}</span>
              <span className="tabular-nums">
                {formatCurrency(item.amount, currency)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-ink/55">No items configured for this block.</p>
      )}
    </div>
  );
}
