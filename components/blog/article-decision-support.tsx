import Link from "next/link";

import type { BlogArticleType, BlogPost } from "@/data/blog/types";

interface ArticleDecisionSupportProps {
  post: BlogPost;
}

const ARTICLE_TYPE_LABELS: Record<BlogArticleType, string> = {
  "country-cost-of-living": "cost-of-living guide",
  "city-cost-of-living": "city cost guide",
  "income-tax": "income-tax guide",
  "minimum-wage": "minimum-wage guide",
  "average-salary": "average-salary guide",
  "gross-vs-net": "gross-versus-net guide",
  expensive: "affordability guide",
  "best-cities": "city-comparison guide",
};

export function ArticleDecisionSupport({
  post,
}: ArticleDecisionSupportProps): JSX.Element {
  const locationName = post.cityName
    ? `${post.cityName}, ${post.countryName}`
    : post.countryName;
  const typeLabel = ARTICLE_TYPE_LABELS[post.articleType];
  const mistakes = buildCommonMistakes(post, locationName);
  const alternatives = buildAlternatives(post, locationName);

  return (
    <section className="panel p-5 sm:p-6" id="decision-checklist">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
        Decision checklist
      </p>
      <h2 className="mt-4 font-[var(--font-display)] text-3xl font-bold tracking-tight text-ink">
        How to use this {typeLabel}
      </h2>
      <p className="mt-4 text-base leading-8 text-ink/72">
        Use this page as a decision aid, not as a final payroll or relocation
        verdict. The most reliable workflow is to compare the guide numbers with
        your own salary, housing choice, household status, and any employer
        benefits that affect monthly cash flow.
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <ChecklistCard
          title="1. Start with net pay"
          text={`Open the ${post.countryName} salary calculator and test the gross salary that matches your offer or target role. Convert the result into monthly net pay before comparing it with ${locationName} living costs.`}
        />
        <ChecklistCard
          title="2. Replace benchmarks"
          text="Swap any benchmark rent, childcare, insurance, or transport figure with a quote from the city, employer, landlord, or provider you are actually considering."
        />
        <ChecklistCard
          title="3. Keep a margin"
          text="Treat a plan as fragile if the result only works with perfect assumptions. Leave room for exchange rates, tax-year changes, bonus timing, deposits, and first-month relocation costs."
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <InsightList title="Common mistakes to avoid" items={mistakes} />
        <InsightList title="Alternatives to compare" items={alternatives} />
      </div>

      <div className="mt-6 rounded-3xl border border-sand/70 bg-sand/35 p-4 text-sm leading-7 text-ink/72">
        <p className="font-semibold text-ink">Expert note</p>
        <p className="mt-2">
          The strongest salary decision is usually not the highest gross number.
          It is the offer that leaves a stable monthly remainder after tax,
          housing, compulsory deductions, and the costs that match your real
          household. When the result is close, ask payroll or HR for a sample
          payslip and compare it with the calculator output before committing.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-coral"
          href={post.calculatorUrl}
        >
          Open {post.countryName} calculator
        </Link>
        <Link
          className="rounded-full border border-ink/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-coral/25 hover:text-coral"
          href="/sources"
        >
          Review methodology
        </Link>
      </div>
    </section>
  );
}

function ChecklistCard({
  text,
  title,
}: {
  text: string;
  title: string;
}): JSX.Element {
  return (
    <div className="rounded-3xl border border-ink/10 bg-white p-4">
      <p className="font-semibold text-ink">{title}</p>
      <p className="mt-2 text-sm leading-7 text-ink/68">{text}</p>
    </div>
  );
}

function InsightList({
  items,
  title,
}: {
  items: string[];
  title: string;
}): JSX.Element {
  return (
    <div className="rounded-3xl border border-ink/10 bg-white p-4">
      <h3 className="font-semibold text-ink">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-7 text-ink/68">
        {items.map((item) => (
          <li className="flex gap-3" key={item}>
            <span className="mt-3 h-1.5 w-1.5 rounded-full bg-coral" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function buildCommonMistakes(post: BlogPost, locationName: string): string[] {
  switch (post.articleType) {
    case "income-tax":
    case "gross-vs-net":
    case "average-salary":
      return [
        `Treating the top marginal tax rate in ${post.countryName} as if it applies to the whole salary.`,
        "Ignoring payroll deductions, pension choices, social contributions, or benefit deductions that do not appear in simple bracket tables.",
        "Comparing a yearly gross offer with monthly living costs without converting both sides to the same period.",
      ];
    case "minimum-wage":
      return [
        `Using minimum wage in ${post.countryName} as a comfort target instead of a legal or labour-market floor.`,
        "Forgetting to convert hourly wage into realistic paid hours, weeks, and months before estimating net pay.",
        "Ignoring rent and commuting costs, which often decide whether minimum wage is workable in practice.",
      ];
    case "best-cities":
      return [
        `Choosing the highest-profile city in ${post.countryName} without testing rent, commute, and net pay together.`,
        "Ranking cities by gross salary alone instead of disposable income after housing.",
        "Assuming family, single-person, and remote-worker budgets point to the same best city.",
      ];
    default:
      return [
        `Using a national or city benchmark for ${locationName} as if it were a quote for your exact neighbourhood.`,
        "Comparing gross salary with living costs instead of using take-home pay after tax.",
        "Leaving out deposits, first-month setup costs, childcare, insurance, or transport changes that happen during relocation.",
      ];
  }
}

function buildAlternatives(post: BlogPost, locationName: string): string[] {
  switch (post.articleType) {
    case "income-tax":
    case "gross-vs-net":
    case "average-salary":
      return [
        "Run a reverse net-to-gross estimate if you already know the monthly take-home pay you need.",
        `Compare ${post.countryName} with one or two nearby countries using the same gross salary and household assumptions.`,
        "Ask the employer for a sample payroll estimate if bonuses, pension, health insurance, or relocation benefits are material.",
      ];
    case "minimum-wage":
      return [
        "Compare minimum wage with the median-salary benchmark before using it for long-term planning.",
        "Test part-time and full-time schedules separately because paid hours change the annual result.",
        `Check whether a cheaper city or shared housing changes the affordability answer in ${post.countryName}.`,
      ];
    case "best-cities":
      return [
        "Compare the capital with at least one secondary city before deciding where the salary goes furthest.",
        "Use rent-adjusted net income rather than salary alone as the first ranking metric.",
        "Add commute time, childcare, and job-market depth as tie-breakers when the budget difference is small.",
      ];
    default:
      return [
        `Test a cheaper housing option in ${locationName} before assuming the salary is too low.`,
        `Compare ${post.countryName} with a second country or city using the same household and salary assumptions.`,
        "Use the budget as a first screen, then replace estimates with current listings, employer benefits, and official tax data.",
      ];
  }
}
