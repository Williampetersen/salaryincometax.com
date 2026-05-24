import Link from "next/link";

import {
  getCoverageDescription,
  getCoverageLabel,
  type CountrySummary,
} from "@/lib/country-catalog";
import { formatCurrency } from "@/lib/formatters";
import type { CountryTaxRule } from "@/lib/tax-engine/types";

interface CountrySeoContentProps {
  country: CountrySummary;
  rule: CountryTaxRule;
  relatedCountries: CountrySummary[];
}

export function CountrySeoContent({
  country,
  rule,
  relatedCountries,
}: CountrySeoContentProps): JSX.Element {
  const topBracket = rule.incomeTaxBrackets.default?.at(-1)?.rate;
  const statusLabels = rule.personalStatuses.map((status) => status.label).join(", ");
  const coverageLabel = getCoverageLabel(rule.coverageLevel);
  const coverageDescription = getCoverageDescription(rule.coverageLevel);

  return (
    <section className="panel p-6 sm:p-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div>
          <p className="eyebrow">Country guide</p>
          <h2 className="mt-4 font-[var(--font-display)] text-3xl font-bold">
            Salary after tax in {rule.countryName}
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-ink/70">
            <p>
              Use this {rule.countryName} salary calculator to estimate salary after
              tax, net salary, income tax, and employee deductions for tax year{" "}
              {rule.taxYear}. It is designed for common search intents such as
              <code className="rounded bg-ink/5 px-1 py-0.5 text-[0.95em]">
                {rule.countryName} salary after tax
              </code>
              ,{" "}
              <code className="rounded bg-ink/5 px-1 py-0.5 text-[0.95em]">
                how much tax do I pay in {rule.countryName}
              </code>
              , and{" "}
              <code className="rounded bg-ink/5 px-1 py-0.5 text-[0.95em]">
                {rule.countryName} net salary calculator
              </code>
              .
            </p>
            <p>
              The calculator annualizes the amount you enter, applies the configured
              income tax brackets, tax credits, social contributions, allowances,
              and local tax rules from our JSON tax model, then converts the result
              back into yearly, monthly, weekly, daily, and hourly pay.
            </p>
            <p>
              This route also helps people comparing job offers, relocation packages,
              freelance alternatives, and bonus scenarios in {rule.countryName}. It
              supports personal status options such as {statusLabels.toLowerCase()},
              plus children, extra income, and reverse net-to-gross planning.
            </p>
          </div>
        </div>

        <div className="rounded-4xl border border-ink/10 bg-white p-5">
          <h3 className="font-[var(--font-display)] text-2xl font-bold">
            {rule.countryName} tax assumptions
          </h3>
          <dl className="mt-5 space-y-3 text-sm">
            <InfoRow label="Tax year" value={String(rule.taxYear)} />
            <InfoRow label="Currency" value={rule.currency} />
            <InfoRow
              label="Median salary"
              value={formatCurrency(rule.medianSalary, rule.currency)}
            />
            <InfoRow
              label="Minimum wage benchmark"
              value={formatCurrency(rule.minimumWage, rule.currency)}
            />
            <InfoRow
              label="Personal allowance"
              value={formatCurrency(rule.allowances.personal, rule.currency)}
            />
            <InfoRow
              label="Child allowance"
              value={formatCurrency(rule.allowances.child, rule.currency)}
            />
            <InfoRow
              label="Top income tax bracket"
              value={topBracket != null ? `${Math.round(topBracket * 100)}%` : "Varies"}
            />
            <InfoRow
              label="Coverage status"
              value={`${coverageLabel} model`}
            />
          </dl>
          <p className="mt-4 text-sm leading-7 text-ink/68">{coverageDescription}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-4xl border border-ink/10 bg-paper/50 p-5">
          <h3 className="font-[var(--font-display)] text-2xl font-bold">
            What affects take-home pay?
          </h3>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-ink/70">
            <li>Salary period, paid months, paid weeks, working days, and working hours.</li>
            <li>Extra income or annual bonus added to taxable annual gross pay.</li>
            <li>Personal status and child-related allowances where the rule supports them.</li>
            <li>Country-specific income tax bands, social contributions, and regional taxes.</li>
          </ul>
        </div>

        <div className="rounded-4xl border border-ink/10 bg-white p-5">
          <h3 className="font-[var(--font-display)] text-2xl font-bold">
            Source and update notes
          </h3>
          <p className="mt-4 text-sm leading-7 text-ink/70">
            Tax assumptions for {rule.countryName} are stored in editable JSON so the
            site can be updated every tax year without rebuilding the calculator from
            scratch. This page currently points to official or reference sources for
            the configured rule set.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-ink/70">
            {rule.source.map((source) => (
              <li key={source}>
                <a
                  className="underline decoration-ink/20 underline-offset-4 transition hover:text-coral"
                  href={source}
                  rel="noreferrer"
                  target="_blank"
                >
                  {source}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 rounded-4xl border border-ink/10 bg-white p-5">
        <h3 className="font-[var(--font-display)] text-2xl font-bold">
          Compare with other countries
        </h3>
        <p className="mt-3 text-sm leading-7 text-ink/70">
          If you are researching relocation, compensation planning, or salary
          benchmarks across countries, these related calculators provide nearby tax
          contexts and similar search paths.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            className="rounded-full border border-ink/10 bg-paper px-4 py-2 text-sm transition hover:border-coral/35 hover:text-coral"
            href="/salary-calculator"
          >
            All salary calculators
          </Link>
          {relatedCountries.map((item) => (
            <Link
              className="rounded-full border border-ink/10 bg-paper px-4 py-2 text-sm transition hover:border-coral/35 hover:text-coral"
              href={`/salary-calculator/${item.slug}`}
              key={item.slug}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}): JSX.Element {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-ink/8 pb-3 last:border-b-0 last:pb-0">
      <dt className="text-ink/58">{label}</dt>
      <dd className="text-right font-semibold text-ink">{value}</dd>
    </div>
  );
}
