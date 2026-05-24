import { TAX_RULES } from "@/data/tax-rules";
import type { TaxArticleData } from "@/data/blog/types";

const TAX_ARTICLE_OVERRIDES: Record<
  string,
  Partial<TaxArticleData>
> = {
  germany: {
    howItWorks: [
      "Germany combines federal income tax with mandatory payroll insurance, so the number on the contract is only the starting point for take-home pay.",
      "The official tax formula works on a sliding scale rather than a simple stepped table, which is why quick calculators usually present rounded estimates instead of exact payroll cents.",
      "Church tax, health-insurance surcharges, and family circumstances can all change the final result, so any salary estimate needs clear assumptions.",
    ],
    socialSecuritySummary:
      "Employee payroll deductions usually include pension, unemployment, health, and long-term care contributions, with ceilings applied to some insurance categories.",
    personalAllowanceSummary:
      "Germany uses a tax-free basic allowance and can also provide child- or family-related relief depending on the household situation.",
    deductionSummary:
      "The employee lump-sum deduction is part of the baseline, but commuting, home-office, pension, and insurance costs often matter in real returns.",
    commonMistakes: [
      "Using gross salary without checking whether the role includes bonuses or an extra salary month.",
      "Ignoring social-insurance ceilings at higher pay levels.",
      "Assuming church tax applies to everyone when many employees are not liable for it.",
    ],
  },
  denmark: {
    howItWorks: [
      "Denmark starts with the labour-market contribution and then applies state and municipal tax to the remaining taxable income.",
      "Because several deductions interact inside the calculation, the marginal rate you hear about can differ noticeably from the effective rate you actually pay.",
      "Salary discussions in Denmark often use monthly gross pay, but planning is still much clearer when everything is annualized first.",
    ],
    socialSecuritySummary:
      "The most visible employee payroll charge is the AM-bidrag, followed by state and municipal income-tax layers.",
    personalAllowanceSummary:
      "Denmark includes a personal allowance and work-related deductions that reduce taxable income before the final state and municipal calculations are applied.",
    deductionSummary:
      "Employment deductions, job deductions, commuting rules, and pension arrangements can all change the monthly take-home result in a meaningful way.",
    commonMistakes: [
      "Comparing monthly gross offers without adjusting for paid-holiday rules and pension structures.",
      "Forgetting that municipal tax differences affect the final result.",
      "Treating the top tax threshold as if it applies to all income rather than only the slice above the threshold.",
    ],
  },
  "united-kingdom": {
    howItWorks: [
      "The UK combines PAYE income tax with employee National Insurance contributions deducted through payroll.",
      "For most employees, the important planning points are the personal allowance, the standard tax bands, and whether salary sacrifice is being used.",
      "Scotland applies separate income-tax bands, so UK-wide salary conversations often need location-specific validation.",
    ],
    socialSecuritySummary:
      "Employee National Insurance is charged separately from income tax and can materially affect monthly take-home pay.",
    personalAllowanceSummary:
      "The standard personal allowance is central to the calculation, but it can taper away as income rises.",
    deductionSummary:
      "Salary-sacrifice pensions, student loans, benefits in kind, and childcare arrangements are common adjustments to the headline tax result.",
    commonMistakes: [
      "Ignoring the personal-allowance taper for higher earners.",
      "Mixing Scotland with the England, Wales, and Northern Ireland band structure.",
      "Comparing offers without accounting for pension auto-enrolment deductions.",
    ],
  },
};

export const TAX_DATA: Record<string, TaxArticleData> = Object.entries(TAX_RULES)
  .reduce<Record<string, TaxArticleData>>((accumulator, [slug, yearMap]) => {
    const latestYear = Math.max(...Object.keys(yearMap).map(Number));
    const rule = yearMap[latestYear];
    const defaultBrackets = rule.incomeTaxBrackets.default ?? Object.values(rule.incomeTaxBrackets)[0];
    const override = TAX_ARTICLE_OVERRIDES[slug];

    accumulator[slug] = {
      topRate: defaultBrackets.at(-1)?.rate ?? 0,
      socialSecuritySummary:
        override?.socialSecuritySummary ??
        `Employment income in ${rule.countryName} usually includes employee-side payroll contributions on top of the headline income-tax calculation.`,
      personalAllowanceSummary:
        override?.personalAllowanceSummary ??
        `The ${rule.countryName} tax model includes personal allowances or tax-free bands where the jurisdiction provides them, plus child or family adjustments where configured.`,
      deductionSummary:
        override?.deductionSummary ??
        `Common deductions in ${rule.countryName} can include work-related expenses, standard employee deductions, pension contributions, and household allowances, depending on the market.`,
      howItWorks:
        override?.howItWorks ?? [
          `Income tax in ${rule.countryName} is estimated by annualizing salary first and then applying the local bracket structure and payroll assumptions for tax year ${rule.taxYear}.`,
          `In ${rule.countryName}, social contributions are often calculated on a different base from income tax, which is why gross-versus-net estimates need more than a simple bracket lookup.`,
          `Allowances, deductions, bonuses, family status, and local payroll rules in ${rule.countryName} can all move the final take-home result in a meaningful way.`,
        ],
      commonMistakes:
        override?.commonMistakes ?? [
          `Using monthly salary figures in ${rule.countryName} without first converting them into an annual tax calculation.`,
          `Ignoring bonuses and irregular pay when comparing job offers in ${rule.countryName}.`,
          `Assuming the highest bracket in ${rule.countryName} applies to the full salary instead of only the relevant slice of income.`,
        ],
      updatedAt: `${latestYear}-01-01`,
      sources: rule.source,
    };

    return accumulator;
  }, {});
