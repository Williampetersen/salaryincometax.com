"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";

import { CountryPicker } from "@/components/calculator/country-picker";
import { ComparisonChart } from "@/components/charts/comparison-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import { CountryFlag } from "@/components/shared/country-flag";
import type {
  CalculatorExperienceData,
  CityAffordabilityHighlight,
} from "@/lib/calculator-experience";
import {
  getCoverageDescription,
  getCoverageLabel,
  type CountrySummary,
} from "@/lib/country-catalog";
import { formatCurrency, formatPercent, formatTimestamp } from "@/lib/formatters";
import { event as trackEvent } from "@/lib/gtag";
import { DISCLAIMER } from "@/lib/site";
import { calculateSalaryTax } from "@/lib/tax-engine/calculate";
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

interface SavedPlan {
  id: string;
  name: string;
  createdAt: string;
  countrySlug: string;
  countryName: string;
  input: CalculationInput;
}

interface CompareCountryResult {
  slug: string;
  name: string;
  countryCode: string;
  flagSrc?: string;
  result: CalculationResult;
}

interface HeatmapPoint {
  annualGross: number;
  annualNet: number;
  monthlyNet: number;
  keepRate: number;
}

interface MarginalTaxPoint {
  label: string;
  netGain: number;
  taxGain: number;
  keepShare: number;
  taxShare: number;
}

interface HighlightBadge {
  label: string;
  tone: "moss" | "coral" | "sky" | "sand";
}

interface CalculatorShellProps {
  country: CountrySummary;
  countryGroups: Array<{
    region: string;
    countries: CountrySummary[];
  }>;
  experienceData: CalculatorExperienceData;
  rule: CountryTaxRule;
  initialResult: CalculationResult;
  relatedCountries: CountrySummary[];
}

const HISTORY_KEY = "salary-income-tax-history";
const SAVED_PLANS_KEY = "salary-income-tax-saved-plans";
const MAX_SAVED_PLANS = 8;

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
  experienceData,
  rule,
  initialResult,
  relatedCountries,
}: CalculatorShellProps): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [result, setResult] = useState(initialResult);
  const [error, setError] = useState<string | null>(null);
  const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([]);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [planName, setPlanName] = useState("");
  const [form, setForm] = useState<CalculationInput>(initialResult.input);
  const [resultAnimationKey, setResultAnimationKey] = useState(0);
  const [budgetMode, setBudgetMode] = useState<"single" | "couple" | "family">(
    "single",
  );
  const [budgetBuilder, setBudgetBuilder] = useState(() => ({
    rent: experienceData.budgetDefaults.rent,
    groceries: experienceData.budgetDefaults.groceries,
    transport: experienceData.budgetDefaults.transport,
    utilities: experienceData.budgetDefaults.utilities,
    childcare: experienceData.budgetDefaults.childcare,
    healthcare: experienceData.budgetDefaults.healthcare,
    entertainment: experienceData.budgetDefaults.entertainment,
    savingsTarget: experienceData.budgetDefaults.savingsTarget,
  }));
  const [compareCountrySlugs, setCompareCountrySlugs] = useState<string[]>(() =>
    relatedCountries.slice(0, 2).map((item) => item.slug),
  );
  const [compareResults, setCompareResults] = useState<CompareCountryResult[]>([]);
  const [isCompareLoading, setIsCompareLoading] = useState(false);
  const taxSplitRef = useRef<HTMLDivElement | null>(null);
  const coverageLabel = getCoverageLabel(rule.coverageLevel);
  const coverageDescription = getCoverageDescription(rule.coverageLevel);
  const allCountries = countryGroups.flatMap((group) => group.countries);
  const currentMonthlyNet = result.periodBreakdown.monthly.net;

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

  useEffect(() => {
    try {
      const rawPlans = window.localStorage.getItem(SAVED_PLANS_KEY);
      if (!rawPlans) {
        return;
      }

      const parsed = JSON.parse(rawPlans) as SavedPlan[];
      setSavedPlans(parsed.slice(0, MAX_SAVED_PLANS));
    } catch {
      setSavedPlans([]);
    }
  }, []);

  useEffect(() => {
    setBudgetBuilder({
      rent: experienceData.budgetDefaults.rent,
      groceries: experienceData.budgetDefaults.groceries,
      transport: experienceData.budgetDefaults.transport,
      utilities: experienceData.budgetDefaults.utilities,
      childcare: experienceData.budgetDefaults.childcare,
      healthcare: experienceData.budgetDefaults.healthcare,
      entertainment: experienceData.budgetDefaults.entertainment,
      savingsTarget: experienceData.budgetDefaults.savingsTarget,
    });
    setBudgetMode("single");
  }, [experienceData]);

  useEffect(() => {
    const activeCompareSlugs = compareCountrySlugs
      .filter((slug, index, array) => slug && array.indexOf(slug) === index)
      .filter((slug) => slug !== country.slug);

    if (activeCompareSlugs.length === 0) {
      setCompareResults([]);
      return;
    }

    let isCancelled = false;
    setIsCompareLoading(true);

    void (async () => {
      try {
        const compareCatalog = countryGroups.flatMap((group) => group.countries);
        const responses: Array<CompareCountryResult | null> = await Promise.all(
          activeCompareSlugs.map(async (slug) => {
            const compareCountry = compareCatalog.find((item) => item.slug === slug);

            if (!compareCountry) {
              return null;
            }

            const response = await fetch("/api/calculate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...result.input,
                country: slug,
                taxYear: compareCountry.availableYears[0] ?? result.taxYear,
                amount: Math.max(result.annual.gross - result.input.extraIncome, 0),
                salaryPeriod: "yearly",
                reverseCalculation: false,
                currency: compareCountry.currency,
              } satisfies CalculationInput),
            });

            if (!response.ok) {
              return null;
            }

            const payload = (await response.json()) as CalculationResult | { error: string };

            if ("error" in payload) {
              return null;
            }

            return {
              slug,
              name: compareCountry.name,
              countryCode: compareCountry.countryCode,
              flagSrc: compareCountry.flagSrc,
              result: payload,
            } satisfies CompareCountryResult;
          }),
        );

        if (!isCancelled) {
          setCompareResults(
            responses.filter((item): item is CompareCountryResult => item !== null),
          );
        }
      } finally {
        if (!isCancelled) {
          setIsCompareLoading(false);
        }
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [compareCountrySlugs, country.slug, countryGroups, result]);

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

  function savePlan(currentForm: CalculationInput): void {
    const trimmedName = planName.trim();
    const planCountry =
      allCountries.find((item) => item.slug === currentForm.country) ?? country;
    const nextPlan: SavedPlan = {
      id: `${currentForm.country}-${Date.now()}`,
      name:
        trimmedName ||
        currentForm.description?.trim() ||
        `${planCountry.name} ${new Date().toLocaleDateString("en-US")}`,
      createdAt: new Date().toISOString(),
      countrySlug: currentForm.country,
      countryName: planCountry.name,
      input: currentForm,
    };

    const nextPlans = [nextPlan, ...savedPlans].slice(0, MAX_SAVED_PLANS);
    setSavedPlans(nextPlans);
    setPlanName("");
    window.localStorage.setItem(SAVED_PLANS_KEY, JSON.stringify(nextPlans));
  }

  function deletePlan(planId: string): void {
    const nextPlans = savedPlans.filter((plan) => plan.id !== planId);
    setSavedPlans(nextPlans);
    window.localStorage.setItem(SAVED_PLANS_KEY, JSON.stringify(nextPlans));
  }

  function updateCompareCountrySelection(index: number, nextSlug: string): void {
    setCompareCountrySlugs((current) => {
      const next = [...current];
      next[index] = nextSlug;

      return next.map((slug, slugIndex) =>
        slug !== nextSlug || nextSlug === "" || slugIndex === index ? slug : "",
      );
    });
  }

  function runCalculation(nextForm: CalculationInput): void {
    setError(null);

    startTransition(() => {
      void (async () => {
        const response = await fetch("/api/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nextForm),
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

        setForm(nextForm);
        setResult(payload);
        setResultAnimationKey((current) => current + 1);
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

        window.setTimeout(() => {
          if (window.matchMedia("(max-width: 1023px)").matches) {
            taxSplitRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 80);
      })();
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    trackEvent({
      action: "calculator_submit",
      category: "calculator",
      label: country.slug,
    });
    runCalculation(form);
  }

  function applyScenario(
    scenario:
      | "single"
      | "family"
      | "bonus"
      | "reverse"
      | "four-day-week",
  ): void {
    const nextForm: CalculationInput =
      scenario === "single"
        ? {
            ...form,
            personalStatus: rule.personalStatuses[0]?.key ?? form.personalStatus,
            numberOfChildren: 0,
            extraIncome: 0,
            reverseCalculation: false,
            description: "Single scenario",
          }
        : scenario === "family"
          ? {
              ...form,
              personalStatus:
                rule.personalStatuses.find((status) =>
                  status.key.includes("married") || status.key.includes("joint"),
                )?.key ??
                rule.personalStatuses.at(-1)?.key ??
                form.personalStatus,
              numberOfChildren: 2,
              reverseCalculation: false,
              description: "Family scenario",
            }
          : scenario === "bonus"
            ? {
                ...form,
                extraIncome:
                  form.extraIncome > 0
                    ? form.extraIncome
                    : Math.round(result.annual.gross * 0.1),
                reverseCalculation: false,
                description: "Bonus scenario",
              }
            : scenario === "reverse"
              ? {
                  ...form,
                  amount: Math.round(currentMonthlyNet),
                  salaryPeriod: "monthly",
                  reverseCalculation: true,
                  description: "Reverse salary target",
                }
              : {
                  ...form,
                  workingDaysPerWeek: 4,
                  workingHoursPerWeek: Math.min(form.workingHoursPerWeek, 32),
                  reverseCalculation: false,
                  description: "Four-day week",
                };

    setShowAdvancedOptions(true);
    trackEvent({
      action: "scenario_testing_used",
      category: "calculator",
      label: `${country.slug}:${scenario}`,
    });
    runCalculation(nextForm);
  }

  function applySavedPlan(plan: SavedPlan): void {
    setShowAdvancedOptions(true);
    trackEvent({
      action: "saved_plan_opened",
      category: "calculator",
      label: `${plan.countrySlug}:${plan.name}`,
    });
    runCalculation(plan.input);
  }

  function updateBudgetField(
    key: keyof typeof budgetBuilder,
    value: number,
  ): void {
    setBudgetBuilder((current) => ({
      ...current,
      [key]: Math.max(0, value),
    }));
  }

  const heatmapPoints = buildSalaryHeatmapPoints(rule, result.input, result.annual.gross);
  const marginalTaxPoints = buildMarginalTaxPoints(heatmapPoints);
  const budgetTarget =
    budgetMode === "single"
      ? experienceData.budgetDefaults.single
      : budgetMode === "couple"
        ? experienceData.budgetDefaults.couple
        : experienceData.budgetDefaults.family;
  const familyBudgetCards = [
    {
      key: "single" as const,
      label: "Single",
      monthlyBudget: experienceData.budgetDefaults.single,
    },
    {
      key: "couple" as const,
      label: "Couple",
      monthlyBudget: experienceData.budgetDefaults.couple,
    },
    {
      key: "family" as const,
      label: "Family",
      monthlyBudget: experienceData.budgetDefaults.family,
    },
  ];
  const budgetBuilderTotal =
    budgetBuilder.rent +
    budgetBuilder.groceries +
    budgetBuilder.transport +
    budgetBuilder.utilities +
    budgetBuilder.childcare +
    budgetBuilder.healthcare +
    budgetBuilder.entertainment +
    budgetBuilder.savingsTarget;
  const requiredBudgetResult = calculateSalaryTax(
    {
      ...result.input,
      amount: budgetBuilderTotal,
      salaryPeriod: "monthly",
      reverseCalculation: true,
    },
    rule,
  );
  const highlightBadges = buildHighlightBadges(
    result,
    experienceData,
    budgetTarget,
  );
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
  const currentCountrySavedPlans = savedPlans.filter(
    (plan) => plan.countrySlug === country.slug,
  );
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
          </div>
          <span
            className={`status-chip ${
              rule.coverageLevel === "verified"
                ? "bg-moss/10 text-moss"
                : rule.coverageLevel === "partial"
                  ? "bg-sky/15 text-sky"
                  : "bg-sand/70 text-ink/70"
            }`}
          >
            {coverageLabel}
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

        <div className="mt-5 rounded-4xl border border-ink/10 bg-white/78 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink/55">
                Scenario testing
              </p>
              <p className="mt-2 text-sm leading-6 text-ink/68">
                Apply a quick setup and recalculate instantly.
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className="rounded-full border border-ink/10 bg-paper/70 px-4 py-2 text-sm font-semibold text-ink transition hover:border-sky/30 hover:text-sky"
              onClick={() => applyScenario("single")}
              type="button"
            >
              Single baseline
            </button>
            <button
              className="rounded-full border border-ink/10 bg-paper/70 px-4 py-2 text-sm font-semibold text-ink transition hover:border-sky/30 hover:text-sky"
              onClick={() => applyScenario("family")}
              type="button"
            >
              Couple + 2 children
            </button>
            <button
              className="rounded-full border border-ink/10 bg-paper/70 px-4 py-2 text-sm font-semibold text-ink transition hover:border-sky/30 hover:text-sky"
              onClick={() => applyScenario("bonus")}
              type="button"
            >
              Add 10% bonus
            </button>
            <button
              className="rounded-full border border-ink/10 bg-paper/70 px-4 py-2 text-sm font-semibold text-ink transition hover:border-sky/30 hover:text-sky"
              onClick={() => applyScenario("four-day-week")}
              type="button"
            >
              Four-day week
            </button>
            <button
              className="rounded-full border border-ink/10 bg-paper/70 px-4 py-2 text-sm font-semibold text-ink transition hover:border-sky/30 hover:text-sky"
              onClick={() => applyScenario("reverse")}
              type="button"
            >
              Net target mode
            </button>
          </div>
        </div>

        <div className="mt-5 rounded-4xl border border-sky/35 bg-sky/12 p-4 sm:p-5">
          <button
            aria-expanded={showAdvancedOptions}
            className="flex w-full items-center justify-between gap-4 text-left"
            onClick={() => setShowAdvancedOptions((current) => !current)}
            type="button"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky">
                More options
              </p>
              <p className="mt-2 text-sm leading-6 text-ink/72">
                Salary period, tax year, work schedule, extra income, family
                status, and reverse calculation.
              </p>
            </div>
            <span
              aria-hidden="true"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-sky/35 bg-white text-xl font-semibold leading-none text-sky"
            >
              {showAdvancedOptions ? "-" : "+"}
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

        <div className="mt-4 rounded-4xl border border-ink/10 bg-white/78 p-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink/55">
            Saved plans
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              className="form-control"
              onChange={(event) => setPlanName(event.target.value)}
              placeholder="Name this setup"
              type="text"
              value={planName}
            />
            <button
              className="rounded-2xl bg-sky px-4 py-3 text-sm font-semibold text-white transition hover:bg-ink"
              onClick={() => savePlan(form)}
              type="button"
            >
              Save plan
            </button>
          </div>
          <p className="mt-3 text-xs leading-6 text-ink/58">
            Save scenarios locally and reopen them later from the results area.
          </p>
        </div>
      </form>

      <div className="min-w-0 space-y-6">
        <section className="panel relative min-w-0 overflow-hidden p-5 sm:p-7">
          {resultAnimationKey > 0 ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -left-1/2 z-10 w-1/2 bg-white/65 blur-[1px] animate-result-sweep"
              key={resultAnimationKey}
            />
          ) : null}
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
                  <AnimatedNumber
                    animationKey={resultAnimationKey}
                    value={formatCurrency(result.reverseEstimatedGross, result.currency)}
                  />
                </p>
              </div>
            ) : null}
          </div>

          <div
            className="mt-6 scroll-mt-24 overflow-hidden rounded-4xl border border-ink/10 bg-white"
            ref={taxSplitRef}
          >
            <div className="border-b border-ink/10 px-5 py-5 sm:px-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/55">
                Tax split
              </p>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/62">
                A separate annual view of take-home pay, income tax, social
                contributions, and local charges.
              </p>
            </div>
            <div className="bg-paper/35 p-5 sm:p-6">
              <div className="mx-auto w-full max-w-[24rem] rounded-4xl border border-white/70 bg-white/80 p-5 shadow-card">
                <DonutChart
                  centerLabel="Annual net"
                  centerValue={formatCurrency(result.annual.net, result.currency)}
                  currency={result.currency}
                  segments={donutSegments}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-ink/10 bg-white/84 px-4 py-3 text-sm leading-6 text-ink/70">
            <span className="font-semibold text-ink">{coverageLabel} coverage:</span>{" "}
            {coverageDescription} {rule.notes}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {highlightBadges.map((badge) => (
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                  badge.tone === "coral"
                    ? "bg-coral/10 text-coral"
                    : badge.tone === "moss"
                      ? "bg-moss/10 text-moss"
                      : badge.tone === "sky"
                        ? "bg-sky/12 text-sky"
                        : "bg-sand/50 text-ink/72"
                }`}
                key={badge.label}
              >
                {badge.label}
              </span>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:hidden">
            <MetricCard
              animationKey={resultAnimationKey}
              label="Gross salary"
              value={formatCurrency(result.annual.gross, result.currency)}
            />
            <MetricCard
              animationKey={resultAnimationKey}
              label="Net salary"
              value={formatCurrency(result.annual.net, result.currency)}
            />
            <MetricCard
              animationKey={resultAnimationKey}
              label="Total tax"
              value={formatCurrency(result.annual.totalTax, result.currency)}
            />
            <MetricCard
              animationKey={resultAnimationKey}
              label="Effective rate"
              value={formatPercent(result.effectiveTaxRate)}
            />
          </div>

          <div
            className="mt-6 scroll-mt-24 overflow-hidden rounded-4xl border border-ink/10 bg-white"
          >
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
              <table className="min-w-[38rem] table-fixed xl:min-w-full">
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
                        <AnimatedNumber
                          animationKey={resultAnimationKey}
                          value={row.value}
                        />
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
              <div className="p-5 sm:p-6">
                <div className="rounded-3xl border border-ink/10 bg-white p-5">
                  <ComparisonChart bars={comparisonBars} currency={result.currency} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <section className="overflow-hidden rounded-4xl border border-ink/10 bg-white">
              <div className="border-b border-ink/10 px-5 py-5 sm:px-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/55">
                  Net-pay heatmap
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/62">
                  Click a salary level to load it into the calculator and see how
                  take-home pay changes as income rises.
                </p>
              </div>
              <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
                {heatmapPoints.map((point) => (
                  <button
                    className="rounded-3xl border border-white/80 p-4 text-left text-white transition hover:-translate-y-0.5"
                    key={point.annualGross}
                    onClick={() => {
                      const nextForm = {
                        ...form,
                        amount: convertAnnualAmountToPeriod(point.annualGross, form),
                        reverseCalculation: false,
                      };
                      setForm(nextForm);
                      runCalculation(nextForm);
                    }}
                    style={{
                      background: `linear-gradient(180deg, rgba(49,95,76,${0.55 + point.keepRate * 0.3}) 0%, rgba(26,48,39,0.96) 100%)`,
                    }}
                    type="button"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-white/68">
                      Gross
                    </p>
                    <p className="mt-2 font-[var(--font-display)] text-2xl font-bold tracking-tight">
                      {formatCurrency(point.annualGross, result.currency)}
                    </p>
                    <div className="mt-4 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-white/68">
                          Net / month
                        </p>
                        <p className="mt-1 text-sm font-semibold">
                          {formatCurrency(point.monthlyNet, result.currency)}
                        </p>
                      </div>
                      <span className="rounded-full bg-white/14 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                        Keep {formatPercent(point.keepRate)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="overflow-hidden rounded-4xl border border-ink/10 bg-white">
              <div className="border-b border-ink/10 px-5 py-5 sm:px-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/55">
                  Keep more vs lose more
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/62">
                  Each bar shows how much of the next salary jump stays with you
                  versus how much is absorbed by extra tax.
                </p>
              </div>
              <div className="space-y-4 p-5 sm:p-6">
                {marginalTaxPoints.map((point) => (
                  <div key={point.label}>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <p className="font-semibold text-ink">{point.label}</p>
                      <p className="text-ink/62">
                        Keep {formatPercent(point.keepShare)} / Tax{" "}
                        {formatPercent(point.taxShare)}
                      </p>
                    </div>
                    <div className="mt-2 h-4 overflow-hidden rounded-full bg-paper/80">
                      <div
                        className="h-full rounded-l-full bg-moss"
                        style={{ width: `${Math.max(point.keepShare * 100, 6)}%` }}
                      />
                      <div
                        className="-mt-4 ml-auto h-4 rounded-r-full bg-coral"
                        style={{ width: `${Math.max(point.taxShare * 100, 6)}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-3 text-xs text-ink/58">
                      <span>Extra net {formatCurrency(point.netGain, result.currency)}</span>
                      <span>Extra tax {formatCurrency(point.taxGain, result.currency)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <section className="overflow-hidden rounded-4xl border border-ink/10 bg-white">
              <div className="border-b border-ink/10 px-5 py-5 sm:px-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/55">
                  Visual family budget
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/62">
                  Compare your current monthly take-home pay with single, couple,
                  and family budget benchmarks instantly.
                </p>
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap gap-2">
                  {familyBudgetCards.map((card) => (
                    <button
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        budgetMode === card.key
                          ? "bg-ink text-white"
                          : "border border-ink/10 bg-paper/70 text-ink hover:border-sky/30 hover:text-sky"
                      }`}
                      key={card.key}
                      onClick={() => {
                        setBudgetMode(card.key);
                        setBudgetBuilder((current) => ({
                          ...current,
                          childcare:
                            card.key === "family"
                              ? experienceData.budgetDefaults.childcare
                              : card.key === "couple"
                                ? Math.round(experienceData.budgetDefaults.childcare * 0.25)
                                : 0,
                          savingsTarget:
                            card.key === "family"
                              ? Math.round(experienceData.budgetDefaults.savingsTarget * 1.4)
                              : card.key === "couple"
                                ? Math.round(experienceData.budgetDefaults.savingsTarget * 1.1)
                                : experienceData.budgetDefaults.savingsTarget,
                        }));
                      }}
                      type="button"
                    >
                      {card.label}
                    </button>
                  ))}
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {familyBudgetCards.map((card) => (
                    <FamilyBudgetCard
                      currentMonthlyNet={currentMonthlyNet}
                      isActive={budgetMode === card.key}
                      key={card.key}
                      label={card.label}
                      monthlyBudget={card.monthlyBudget}
                      onSelect={() => setBudgetMode(card.key)}
                      currency={result.currency}
                    />
                  ))}
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-4xl border border-ink/10 bg-white">
              <div className="border-b border-ink/10 px-5 py-5 sm:px-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/55">
                  City affordability
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/62">
                  Three quick city signals inside this market: cheapest entry
                  budget, best salary / rent balance, and hardest family setup.
                </p>
              </div>
              <div className="grid gap-4 p-5 sm:p-6">
                {experienceData.cityHighlights.map((highlight) => (
                  <CityHighlightCard
                    currency={result.currency}
                    highlight={highlight}
                    key={`${highlight.id}-${highlight.cityName}`}
                  />
                ))}
              </div>
            </section>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)]">
            <section className="overflow-hidden rounded-4xl border border-ink/10 bg-white">
              <div className="border-b border-ink/10 px-5 py-5 sm:px-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/55">
                  Salary vs cost-of-living builder
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/62">
                  Build a monthly budget, then see the gross salary required to
                  fund it after tax in {country.name}.
                </p>
              </div>
              <div className="space-y-5 p-5 sm:p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <BudgetBuilderField
                    currency={result.currency}
                    label="Rent"
                    onChange={(value) => updateBudgetField("rent", value)}
                    value={budgetBuilder.rent}
                  />
                  <BudgetBuilderField
                    currency={result.currency}
                    label="Groceries"
                    onChange={(value) => updateBudgetField("groceries", value)}
                    value={budgetBuilder.groceries}
                  />
                  <BudgetBuilderField
                    currency={result.currency}
                    label="Transport"
                    onChange={(value) => updateBudgetField("transport", value)}
                    value={budgetBuilder.transport}
                  />
                  <BudgetBuilderField
                    currency={result.currency}
                    label="Utilities"
                    onChange={(value) => updateBudgetField("utilities", value)}
                    value={budgetBuilder.utilities}
                  />
                  <BudgetBuilderField
                    currency={result.currency}
                    label="Healthcare"
                    onChange={(value) => updateBudgetField("healthcare", value)}
                    value={budgetBuilder.healthcare}
                  />
                  <BudgetBuilderField
                    currency={result.currency}
                    label="Entertainment"
                    onChange={(value) => updateBudgetField("entertainment", value)}
                    value={budgetBuilder.entertainment}
                  />
                  <BudgetBuilderField
                    currency={result.currency}
                    label="Childcare"
                    onChange={(value) => updateBudgetField("childcare", value)}
                    value={budgetBuilder.childcare}
                  />
                  <BudgetBuilderField
                    currency={result.currency}
                    label="Savings target"
                    onChange={(value) => updateBudgetField("savingsTarget", value)}
                    value={budgetBuilder.savingsTarget}
                  />
                </div>
                <div className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                  <div className="rounded-3xl border border-ink/10 bg-paper/55 p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-ink/52">
                      Monthly target
                    </p>
                    <p className="mt-3 font-[var(--font-display)] text-4xl font-bold leading-none tracking-tight text-ink">
                      {formatCurrency(budgetBuilderTotal, result.currency)}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-ink/62">
                      This combines daily spending, housing, savings, and family
                      costs into one monthly take-home target.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-ink/10 bg-ink p-5 text-white">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/66">
                      Gross salary needed
                    </p>
                    <p className="mt-3 font-[var(--font-display)] text-4xl font-bold leading-none tracking-tight">
                      {formatCurrency(
                        requiredBudgetResult.periodBreakdown.monthly.gross,
                        result.currency,
                      )}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/72">
                      Estimated monthly gross required to land this budget after
                      tax in the selected year.
                    </p>
                    <button
                      className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-sky hover:text-white"
                      onClick={() => {
                        const nextForm = {
                          ...form,
                          amount: budgetBuilderTotal,
                          salaryPeriod: "monthly" as const,
                          reverseCalculation: true,
                          description: `${budgetMode} budget target`,
                        };
                        setShowAdvancedOptions(true);
                        setForm(nextForm);
                        runCalculation(nextForm);
                      }}
                      type="button"
                    >
                      Use as reverse target
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-4xl border border-ink/10 bg-white">
              <div className="border-b border-ink/10 px-5 py-5 sm:px-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/55">
                  Country comparison
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/62">
                  Compare this salary against other countries using the same
                  annual gross amount and current household settings.
                </p>
              </div>
              <div className="space-y-5 p-5 sm:p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[0, 1].map((index) => (
                    <div key={index}>
                      <label
                        className="field-label"
                        htmlFor={`compare-country-${index + 1}`}
                      >
                        Compare slot {index + 1}
                      </label>
                      <select
                        className="form-control"
                        id={`compare-country-${index + 1}`}
                        onChange={(event) =>
                          updateCompareCountrySelection(index, event.target.value)
                        }
                        value={compareCountrySlugs[index] ?? ""}
                      >
                        <option value="">Choose a country</option>
                        {allCountries
                          .filter((item) => item.slug !== country.slug)
                          .map((item) => (
                            <option key={item.slug} value={item.slug}>
                              {item.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  ))}
                </div>
                <div className="grid gap-4">
                  <CompareCountryCard
                    countryCode={country.countryCode}
                    countryName={country.name}
                    currency={result.currency}
                    effectiveTaxRate={result.effectiveTaxRate}
                    flagSrc={country.flagSrc}
                    isCurrent
                    monthlyNet={result.periodBreakdown.monthly.net}
                    totalTax={result.annual.totalTax}
                  />
                  {isCompareLoading ? (
                    <div className="rounded-3xl border border-dashed border-ink/12 bg-paper/55 p-4 text-sm text-ink/58">
                      Building comparison cards...
                    </div>
                  ) : compareResults.length > 0 ? (
                    compareResults.map((item) => (
                      <CompareCountryCard
                        countryCode={item.countryCode}
                        countryName={item.name}
                        currency={item.result.currency}
                        effectiveTaxRate={item.result.effectiveTaxRate}
                        flagSrc={item.flagSrc}
                        key={item.slug}
                        monthlyNet={item.result.periodBreakdown.monthly.net}
                        totalTax={item.result.annual.totalTax}
                      />
                    ))
                  ) : (
                    <div className="rounded-3xl border border-dashed border-ink/12 bg-paper/55 p-4 text-sm text-ink/58">
                      Choose one or two countries to compare how the same annual
                      gross salary behaves across different tax systems.
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)]">
          <div className="panel p-5 sm:p-6">
            <h3 className="font-[var(--font-display)] text-2xl font-bold">
              Tax details
            </h3>
            <div className="mt-5 space-y-5 text-sm">
              <TaxBlock
                amount={result.annual.incomeTax}
                currency={result.currency}
                items={
                  result.incomeTaxCreditLines.length > 0
                    ? [
                        {
                          name: "Income tax before credits",
                          amount: result.annual.incomeTaxBeforeCredits,
                        },
                        {
                          name: "Income tax credits",
                          amount: -result.annual.incomeTaxCredits,
                        },
                      ]
                    : [
                        {
                          name: "Tax due at configured brackets",
                          amount: result.annual.incomeTax,
                        },
                      ]
                }
                title="Income tax"
              />
              {result.incomeTaxCreditLines.length > 0 ? (
                <TaxBlock
                  amount={result.annual.incomeTaxCredits}
                  currency={result.currency}
                  items={result.incomeTaxCreditLines}
                  title="Income tax credits"
                />
              ) : null}
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
            <div className="mt-6 border-t border-ink/10 pt-6">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-[var(--font-display)] text-xl font-bold text-ink">
                  Saved plans
                </h4>
                <span className="text-xs uppercase tracking-[0.16em] text-ink/50">
                  Local only
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {currentCountrySavedPlans.length > 0 ? (
                  currentCountrySavedPlans.map((plan) => (
                    <SavedPlanCard
                      currency={plan.input.currency}
                      key={plan.id}
                      onDelete={() => deletePlan(plan.id)}
                      onOpen={() => applySavedPlan(plan)}
                      plan={plan}
                    />
                  ))
                ) : (
                  <div className="rounded-3xl border border-dashed border-ink/12 bg-paper/60 p-5 text-sm text-ink/58">
                    Save a plan from the left panel to reopen {country.name}{" "}
                    scenarios, salary targets, or household setups later.
                  </div>
                )}
              </div>
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
  animationKey,
}: {
  label: string;
  value: string;
  animationKey: number;
}): JSX.Element {
  return (
    <div className="min-w-0 rounded-3xl border border-ink/10 bg-white p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-ink/50">{label}</p>
      <p className="mt-3 break-words font-[var(--font-display)] text-[clamp(1.75rem,2vw,2.5rem)] font-bold leading-[1.02] tracking-tight text-ink tabular-nums">
        <AnimatedNumber animationKey={animationKey} value={value} />
      </p>
    </div>
  );
}

function AnimatedNumber({
  animationKey,
  value,
}: {
  animationKey: number;
  value: string;
}): JSX.Element {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (animationKey === 0) {
      setDisplayValue(value);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayValue(value);
      return;
    }

    let index = 0;
    setDisplayValue("");

    const interval = window.setInterval(() => {
      index += 1;
      setDisplayValue(value.slice(0, index));

      if (index >= value.length) {
        window.clearInterval(interval);
      }
    }, 28);

    return () => window.clearInterval(interval);
  }, [animationKey, value]);

  return <span>{displayValue}</span>;
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

function BudgetBuilderField({
  label,
  value,
  currency,
  onChange,
}: {
  label: string;
  value: number;
  currency: string;
  onChange: (value: number) => void;
}): JSX.Element {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-ink/45">
          {currency}
        </span>
        <input
          className="form-control pl-16"
          min="0"
          onChange={(event) => onChange(Number(event.target.value))}
          step="1"
          type="number"
          value={value}
        />
      </div>
    </label>
  );
}

function FamilyBudgetCard({
  label,
  monthlyBudget,
  currentMonthlyNet,
  currency,
  isActive,
  onSelect,
}: {
  label: string;
  monthlyBudget: number;
  currentMonthlyNet: number;
  currency: string;
  isActive: boolean;
  onSelect: () => void;
}): JSX.Element {
  const gap = currentMonthlyNet - monthlyBudget;

  return (
    <button
      className={`rounded-3xl border p-4 text-left transition ${
        isActive
          ? "border-sky bg-sky/8 shadow-card"
          : "border-ink/10 bg-white hover:-translate-y-0.5 hover:border-sky/30"
      }`}
      onClick={onSelect}
      type="button"
    >
      <p className="text-xs uppercase tracking-[0.18em] text-ink/52">{label}</p>
      <p className="mt-3 font-[var(--font-display)] text-3xl font-bold leading-none tracking-tight text-ink">
        {formatCurrency(monthlyBudget, currency)}
      </p>
      <p className="mt-2 text-sm leading-6 text-ink/62">Estimated monthly budget target</p>
      <div className="mt-4 rounded-2xl bg-paper/70 px-3 py-3 text-sm">
        <p className="text-ink/58">Gap vs your current monthly net</p>
        <p
          className={`mt-1 font-semibold ${
            gap >= 0 ? "text-moss" : "text-coral"
          }`}
        >
          {gap >= 0 ? "Above by " : "Short by "}
          {formatCurrency(Math.abs(gap), currency)}
        </p>
      </div>
    </button>
  );
}

function CityHighlightCard({
  highlight,
  currency,
}: {
  highlight: CityAffordabilityHighlight;
  currency: string;
}): JSX.Element {
  return (
    <div className="rounded-3xl border border-ink/10 bg-paper/45 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-ink/52">
            {highlight.title}
          </p>
          <p className="mt-2 font-[var(--font-display)] text-2xl font-bold tracking-tight text-ink">
            {highlight.cityName}
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink/62">
          {highlight.id === "cheapest"
            ? "Lower entry"
            : highlight.id === "best-balance"
              ? "Best balance"
              : "Family pressure"}
        </span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <CityMetric label="Monthly budget" value={formatCurrency(highlight.monthlyBudget, currency)} />
        <CityMetric label="Headline rent" value={formatCurrency(highlight.rent, currency)} />
        <CityMetric label="Average net" value={formatCurrency(highlight.monthlyNet, currency)} />
      </div>
      <p className="mt-4 text-sm leading-6 text-ink/62">{highlight.note}</p>
    </div>
  );
}

function CityMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}): JSX.Element {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/85 p-3">
      <p className="text-xs uppercase tracking-[0.18em] text-ink/48">{label}</p>
      <p className="mt-2 font-semibold text-ink">{value}</p>
    </div>
  );
}

function CompareCountryCard({
  countryName,
  countryCode,
  flagSrc,
  monthlyNet,
  totalTax,
  effectiveTaxRate,
  currency,
  isCurrent = false,
}: {
  countryName: string;
  countryCode: string;
  flagSrc?: string;
  monthlyNet: number;
  totalTax: number;
  effectiveTaxRate: number;
  currency: string;
  isCurrent?: boolean;
}): JSX.Element {
  return (
    <div
      className={`rounded-3xl border p-4 ${
        isCurrent ? "border-ink/10 bg-ink text-white" : "border-ink/10 bg-white"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <CountryFlag
            className="h-10 w-10 rounded-full object-cover"
            countryCode={countryCode}
            countryName={countryName}
            flagSrc={flagSrc}
            size={40}
          />
          <div>
            <p
              className={`font-semibold ${
                isCurrent ? "text-white" : "text-ink"
              }`}
            >
              {countryName}
            </p>
            <p
              className={`text-xs uppercase tracking-[0.18em] ${
                isCurrent ? "text-white/62" : "text-ink/48"
              }`}
            >
              {isCurrent ? "Current country" : "Comparison market"}
            </p>
          </div>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
            isCurrent ? "bg-white/10 text-white/78" : "bg-paper/80 text-ink/58"
          }`}
        >
          Local currency view
        </span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <CompareMetric
          label="Monthly net"
          value={formatCurrency(monthlyNet, currency)}
          isCurrent={isCurrent}
        />
        <CompareMetric
          label="Total tax"
          value={formatCurrency(totalTax, currency)}
          isCurrent={isCurrent}
        />
        <CompareMetric
          label="Effective rate"
          value={formatPercent(effectiveTaxRate)}
          isCurrent={isCurrent}
        />
      </div>
    </div>
  );
}

function CompareMetric({
  label,
  value,
  isCurrent,
}: {
  label: string;
  value: string;
  isCurrent: boolean;
}): JSX.Element {
  return (
    <div
      className={`rounded-2xl border p-3 ${
        isCurrent
          ? "border-white/10 bg-white/8"
          : "border-ink/10 bg-paper/55"
      }`}
    >
      <p className={`text-xs uppercase tracking-[0.18em] ${isCurrent ? "text-white/56" : "text-ink/48"}`}>
        {label}
      </p>
      <p className={`mt-2 font-semibold ${isCurrent ? "text-white" : "text-ink"}`}>
        {value}
      </p>
    </div>
  );
}

function SavedPlanCard({
  plan,
  currency,
  onOpen,
  onDelete,
}: {
  plan: SavedPlan;
  currency: string;
  onOpen: () => void;
  onDelete: () => void;
}): JSX.Element {
  return (
    <div className="rounded-3xl border border-ink/10 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-ink">{plan.name}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-ink/50">
            {plan.countryName} • {formatTimestamp(plan.createdAt)}
          </p>
        </div>
        <button
          className="rounded-full border border-ink/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink/58 transition hover:border-coral/35 hover:text-coral"
          onClick={onDelete}
          type="button"
        >
          Remove
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-ink/62">
        <span>
          {plan.input.reverseCalculation ? "Net target" : "Salary"}{" "}
          {formatCurrency(plan.input.amount, currency)}
        </span>
        <span>{PERIOD_LABELS[plan.input.salaryPeriod]}</span>
        <span>{plan.input.personalStatus}</span>
      </div>
      <button
        className="mt-4 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky"
        onClick={onOpen}
        type="button"
      >
        Open plan
      </button>
    </div>
  );
}

function buildSalaryHeatmapPoints(
  rule: CountryTaxRule,
  input: CalculationInput,
  currentAnnualGross: number,
): HeatmapPoint[] {
  const anchor = Math.max(currentAnnualGross, rule.medianSalary, rule.minimumWage * 1.25);
  const step = getFriendlySalaryStep(anchor);
  const candidateAnnuals = [
    rule.minimumWage,
    anchor * 0.65,
    anchor * 0.85,
    anchor,
    anchor * 1.2,
    anchor * 1.5,
  ]
    .map((value) => roundToStep(Math.max(value, step), step))
    .filter((value, index, values) => values.indexOf(value) === index)
    .sort((left, right) => left - right);

  return candidateAnnuals.map((annualGross) => {
    const calculation = calculateSalaryTax(
      {
        ...input,
        amount: Math.max(annualGross - input.extraIncome, 0),
        salaryPeriod: "yearly",
        reverseCalculation: false,
      },
      rule,
    );

    return {
      annualGross: calculation.annual.gross,
      annualNet: calculation.annual.net,
      monthlyNet: calculation.periodBreakdown.monthly.net,
      keepRate:
        calculation.annual.gross === 0
          ? 0
          : calculation.annual.net / calculation.annual.gross,
    };
  });
}

function buildMarginalTaxPoints(points: HeatmapPoint[]): MarginalTaxPoint[] {
  return points.slice(1).map((point, index) => {
    const previousPoint = points[index];
    const grossGain = point.annualGross - previousPoint.annualGross;
    const netGain = point.annualNet - previousPoint.annualNet;
    const taxGain = Math.max(grossGain - netGain, 0);
    const keepShare = grossGain === 0 ? 0 : netGain / grossGain;
    const taxShare = grossGain === 0 ? 0 : taxGain / grossGain;

    return {
      label: `${compactSalaryLabel(previousPoint.annualGross)} to ${compactSalaryLabel(point.annualGross)}`,
      netGain,
      taxGain,
      keepShare,
      taxShare,
    };
  });
}

function buildHighlightBadges(
  result: CalculationResult,
  experienceData: CalculatorExperienceData,
  budgetTarget: number,
): HighlightBadge[] {
  const monthlyNet = result.periodBreakdown.monthly.net;
  const keepRate =
    result.annual.gross === 0 ? 0 : result.annual.net / result.annual.gross;

  return [
    experienceData.budgetDefaults.single <=
    experienceData.budgetDefaults.averageNet * 0.72
      ? { label: "Best for singles", tone: "sky" }
      : { label: "Rent-heavy for singles", tone: "sand" },
    result.effectiveTaxRate >= 0.35
      ? { label: "High tax", tone: "coral" }
      : { label: "Balanced tax", tone: "sky" },
    keepRate >= 0.68 || monthlyNet >= experienceData.budgetDefaults.averageNet
      ? { label: "Strong net pay", tone: "moss" }
      : { label: "Net below average", tone: "sand" },
    monthlyNet >= budgetTarget
      ? { label: "Good family balance", tone: "moss" }
      : { label: "Family budget pressure", tone: "coral" },
  ];
}

function convertAnnualAmountToPeriod(
  annualGross: number,
  input: CalculationInput,
): number {
  const annualBaseAmount = Math.max(annualGross - input.extraIncome, 0);

  switch (input.salaryPeriod) {
    case "yearly":
      return annualBaseAmount;
    case "monthly":
      return annualBaseAmount / input.paidMonthsPerYear;
    case "weekly":
      return annualBaseAmount / input.paidWeeksPerYear;
    case "daily":
      return annualBaseAmount / (input.paidWeeksPerYear * input.workingDaysPerWeek);
    case "hourly":
      return annualBaseAmount / (input.paidWeeksPerYear * input.workingHoursPerWeek);
  }
}

function getFriendlySalaryStep(anchor: number): number {
  if (anchor >= 200_000) {
    return 10_000;
  }

  if (anchor >= 80_000) {
    return 5_000;
  }

  if (anchor >= 30_000) {
    return 2_500;
  }

  return 1_000;
}

function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function compactSalaryLabel(value: number): string {
  const roundedValue = Math.round(value / 1000);
  return `${roundedValue}k`;
}
