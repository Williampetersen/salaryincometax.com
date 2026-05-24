import { TAX_RULES } from "@/data/tax-rules";
import type { TaxArticleData } from "@/data/blog/types";

const TAX_ARTICLE_OVERRIDES: Record<
  string,
  Partial<TaxArticleData>
> = {
  germany: {
    howItWorks: [
      "Germany taxes employment income at the federal level and combines that with mandatory social insurance contributions paid through payroll.",
      "The official income-tax formula is continuous rather than a simple bracket jump, so quick online tools usually present rounded effective results rather than exact payroll cent values.",
      "Church tax, health-insurance surcharges, and family situations can materially change the final take-home figure, which is why calculators need assumptions.",
    ],
    socialSecuritySummary:
      "Employee payroll costs usually include pension, unemployment, health, and long-term care contributions, with ceilings applied to some insurance categories.",
    personalAllowanceSummary:
      "Germany uses a basic tax-free allowance, plus family and child-related relief in relevant situations.",
    deductionSummary:
      "The standard employee lump-sum deduction is a core baseline, but commuting, home office, pension, and insurance costs can matter in real returns.",
    commonMistakes: [
      "Using gross salary without checking whether the role includes bonuses or a 13th salary.",
      "Ignoring social insurance ceilings at higher pay levels.",
      "Assuming church tax applies everywhere when many employees are not liable for it.",
    ],
  },
  denmark: {
    howItWorks: [
      "Denmark starts with labour-market contributions, then layers state tax and municipal tax on the remaining taxable income.",
      "The system combines multiple deduction types, which means your marginal tax rate can differ noticeably from your effective tax rate.",
      "Many salary discussions in Denmark focus on monthly gross pay, but tax planning still works best when everything is annualized first.",
    ],
    socialSecuritySummary:
      "The most visible employee payroll charge is the AM-bidrag, followed by state and municipal income tax layers.",
    personalAllowanceSummary:
      "Denmark includes a personal allowance and work-related deductions that reduce the taxable base before final state and municipal tax calculations.",
    deductionSummary:
      "Employment deductions, job deductions, commuting rules, and pension arrangements can meaningfully change take-home pay.",
    commonMistakes: [
      "Comparing gross monthly offers without adjusting for paid holiday rules and pension structures.",
      "Forgetting the effect of municipal tax differences.",
      "Treating the top tax threshold as if it applies to all income instead of only the portion above the threshold.",
    ],
  },
  "united-kingdom": {
    howItWorks: [
      "The UK combines PAYE income tax with employee National Insurance contributions taken through payroll.",
      "For most employees, the main planning questions are the personal allowance, the basic and higher-rate bands, and whether salary sacrifice is used.",
      "Scotland has separate income-tax bands, so UK-wide salary conversations often need location-specific validation.",
    ],
    socialSecuritySummary:
      "Employee National Insurance is charged separately from income tax and can materially affect monthly take-home pay.",
    personalAllowanceSummary:
      "The standard personal allowance is central to the calculation, but it can taper away at higher income levels.",
    deductionSummary:
      "Salary sacrifice pensions, student loans, benefits-in-kind, and childcare arrangements are common adjustments to the headline tax result.",
    commonMistakes: [
      "Ignoring the personal allowance taper for high earners.",
      "Mixing Scotland and England/Wales/Northern Ireland tax bands.",
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
        "Employment income in this market usually includes employee-side social contributions or payroll deductions on top of the headline income-tax calculation.",
      personalAllowanceSummary:
        override?.personalAllowanceSummary ??
        "The tax model includes personal allowances or tax-free bands where the jurisdiction provides them, plus child or family adjustments where configured.",
      deductionSummary:
        override?.deductionSummary ??
        "Common deductions include work-related expenses, standard employee deductions, pension contributions, and household allowances, depending on the market.",
      howItWorks:
        override?.howItWorks ?? [
          `Income tax in ${rule.countryName} is calculated by annualizing your salary first, then applying the local bracket structure and payroll assumptions for tax year ${rule.taxYear}.`,
          "Social contributions are often calculated on a different base than income tax, which is why gross-versus-net estimates need more than a simple bracket lookup.",
          "Allowances, deductions, bonuses, family status, and local payroll rules can move the final take-home result meaningfully.",
        ],
      commonMistakes:
        override?.commonMistakes ?? [
          "Using monthly salary figures without converting them into an annual tax calculation.",
          "Ignoring bonuses and irregular pay when comparing offers.",
          "Assuming the highest bracket applies to the full salary instead of only the relevant slice.",
        ],
      updatedAt: `${latestYear}-01-01`,
      sources: rule.source,
    };

    return accumulator;
  }, {});
