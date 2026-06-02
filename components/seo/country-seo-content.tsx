import Link from "next/link";

import {
  getCoverageDescription,
  getCoverageLabel,
  type CountrySummary,
} from "@/lib/country-catalog";
import { formatCurrency, formatPercent } from "@/lib/formatters";
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
  const bracketSummary = buildBracketSummary(rule);
  const deductionSummary = rule.standardDeductions
    .map((deduction) => deduction.name)
    .join(", ");
  const contributionSummary = rule.socialSecurityRules
    .map((contribution) => contribution.name)
    .join(", ");
  const regionalSummary = rule.regionalTaxes
    .map((regionalTax) => regionalTax.name)
    .join(", ");

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
            <p>
              Model note: {rule.notes}
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
            How this {rule.countryName} model is built
          </h3>
          <div className="mt-4 space-y-3 text-sm leading-7 text-ink/70">
            <p>
              The {rule.taxYear} rule starts from a median salary benchmark of{" "}
              {formatCurrency(rule.medianSalary, rule.currency)} and a minimum-wage
              benchmark of {formatCurrency(rule.minimumWage, rule.currency)}. The
              default calculator amount uses the median salary so users see a
              realistic first result before editing the input.
            </p>
            <p>
              Income tax brackets in this model are summarized as {bracketSummary}.
              Standard deductions include {deductionSummary || "no configured standard deduction"},
              while employee contribution rules include{" "}
              {contributionSummary || "no configured employee contribution"}.
            </p>
            <p>
              {regionalSummary
                ? `Regional or local payroll layers include ${regionalSummary}.`
                : "No regional or local payroll layer is configured for this country model."}{" "}
              Because payroll rules can vary by household, employer, local authority,
              and benefit package, the result should be treated as a planning
              estimate rather than a final tax assessment.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-4xl border border-ink/10 bg-paper/50 p-5">
          <h3 className="font-[var(--font-display)] text-2xl font-bold">
            Practical ways to use this page
          </h3>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-ink/70">
            <li>Compare a written job offer with the default median salary benchmark.</li>
            <li>Switch from yearly to monthly or weekly pay if your offer uses another period.</li>
            <li>Use extra income for a bonus or allowance that should be included in annual gross pay.</li>
            <li>Run reverse mode when you know the net salary you want to negotiate toward.</li>
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

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-4xl border border-ink/10 bg-white p-5">
          <h3 className="font-[var(--font-display)] text-2xl font-bold">
            Common mistakes when estimating {rule.countryName} net pay
          </h3>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-ink/70">
            <li>Comparing a gross annual offer with monthly rent before converting salary to monthly net pay.</li>
            <li>Treating the top tax bracket as if it applies to the full salary instead of the relevant taxable slice.</li>
            <li>Forgetting that bonuses, paid months, pension choices, benefits, and local payroll layers can change the payslip.</li>
            <li>Using the default median salary result without replacing it with the actual offer or target salary.</li>
          </ul>
        </div>

        <div className="rounded-4xl border border-ink/10 bg-paper/50 p-5">
          <h3 className="font-[var(--font-display)] text-2xl font-bold">
            Before you rely on the result
          </h3>
          <ol className="mt-4 space-y-3 text-sm leading-7 text-ink/70">
            <li>1. Confirm the tax year and make sure the salary period matches your offer.</li>
            <li>2. Add recurring taxable bonuses or allowances as extra income when they are part of the package.</li>
            <li>3. Compare the monthly net result with housing, commute, childcare, insurance, and savings needs.</li>
            <li>4. Ask payroll, HR, or a qualified adviser to confirm edge cases before making a binding decision.</li>
          </ol>
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

function buildBracketSummary(rule: CountryTaxRule): string {
  const brackets =
    rule.incomeTaxBrackets.default ?? Object.values(rule.incomeTaxBrackets)[0] ?? [];

  if (brackets.length === 0) {
    return "no configured progressive brackets";
  }

  return brackets
    .map((bracket) => {
      const threshold =
        bracket.upTo == null
          ? "remaining taxable income"
          : `income up to ${formatCurrency(bracket.upTo, rule.currency)}`;

      return `${formatPercent(bracket.rate)} on ${threshold}`;
    })
    .join("; ");
}
