import { TAX_RULES } from "@/data/tax-rules";
import type { TaxArticleData } from "@/data/blog/types";

const TAX_ARTICLE_OVERRIDES: Record<
  string,
  Partial<TaxArticleData>
> = {
  australia: {
    howItWorks: [
      "Australia taxes salary through resident income-tax bands, and payroll withholding usually follows PAYG tables during the year.",
      "The Medicare levy can materially change take-home pay, so a bracket-only estimate often understates the real gap between gross and net salary.",
      "Salary packaging, superannuation design, and tax offsets can all change the final result, especially when two offers with similar gross pay are structured differently.",
    ],
    socialSecuritySummary:
      "Australia does not use a large employee social-insurance bundle in the same way some European systems do, but income tax and the Medicare levy still create a meaningful payroll wedge.",
    personalAllowanceSummary:
      "Australia relies more on progressive bands, offsets, and levy rules than on a large standalone tax-free household allowance framework.",
    deductionSummary:
      "Work-related expenses, salary packaging choices, charitable giving, and occupation-specific deductions can all affect the final tax bill when they are valid and documented.",
    commonMistakes: [
      "Treating superannuation as if it were monthly cash pay available for rent.",
      "Ignoring the Medicare levy when comparing gross salary offers.",
      "Assuming every deduction is automatic without checking substantiation rules.",
    ],
  },
  belgium: {
    howItWorks: [
      "Belgium combines progressive income tax with employee social-security contributions, which is why the distance between gross pay and net pay can feel wide even at mid-range salaries.",
      "Municipal surcharges and household circumstances can influence the final number, so a federal bracket table alone is not enough for realistic planning.",
      "Holiday pay, thirteenth-month style arrangements, and benefit design also matter when comparing Belgian job offers.",
    ],
    socialSecuritySummary:
      "Employee social-security deductions are a major part of Belgian payroll and usually sit alongside the headline income-tax calculation rather than inside it.",
    personalAllowanceSummary:
      "Belgium uses a tax-free allowance structure and can provide household-related relief, so family context can matter even when the headline salary is unchanged.",
    deductionSummary:
      "Professional-expense rules, household deductions, and salary-structure choices can influence the final tax result beyond the standard employee baseline.",
    commonMistakes: [
      "Comparing two Belgian offers without checking holiday pay and extra-salary assumptions.",
      "Ignoring municipal tax surcharges in the final estimate.",
      "Using gross salary alone to judge cross-border or relocation decisions.",
    ],
  },
  canada: {
    howItWorks: [
      "Canada taxes employment income through federal income tax plus provincial or territorial income tax, so the province matters just as much as the salary headline.",
      "CPP or QPP and Employment Insurance deductions also reduce take-home pay, which is why a federal-bracket-only estimate is incomplete.",
      "When two Canadian jobs advertise similar gross pay, the after-tax result can still differ because of province, payroll caps, and benefit structure.",
    ],
    socialSecuritySummary:
      "Canadian payroll usually includes CPP or QPP contributions and Employment Insurance premiums in addition to income tax, with annual ceilings affecting the shape of deductions at higher pay levels.",
    personalAllowanceSummary:
      "Canada uses federal and provincial basic personal amounts, so tax-free starting points exist but they are not identical across the whole country.",
    deductionSummary:
      "Registered retirement contributions, union dues, childcare rules, and province-specific credits can all affect the final result depending on the taxpayer's situation.",
    commonMistakes: [
      "Ignoring the province or territory when comparing salaries in Canada.",
      "Treating CPP or QPP and EI as if they continue rising forever instead of checking the annual caps.",
      "Comparing offers across provinces without recalculating the net result.",
    ],
  },
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
  france: {
    howItWorks: [
      "France combines progressive income tax with payroll contributions, and the result is shaped by both the withholding framework and the household tax logic behind the annual assessment.",
      "The family quotient system means household structure can change the tax outcome materially, which is why two identical salaries do not always produce the same tax bill.",
      "French salary offers also need to be read carefully because employer charges are very high overall, even though the employee sees only part of that burden on payslips.",
    ],
    socialSecuritySummary:
      "Employee payroll deductions in France commonly include health, pension, and broader social contributions, which make the gross-to-net gap much larger than the income-tax line alone suggests.",
    personalAllowanceSummary:
      "France relies heavily on household calculation rules, dependants, and the family quotient rather than a simple one-size-fits-all personal allowance model.",
    deductionSummary:
      "The standard employment deduction is important, but real-life returns can also be affected by commuting, childcare, pension, and household-specific deductions where applicable.",
    commonMistakes: [
      "Looking only at the income-tax withholding line and ignoring social contributions.",
      "Comparing French salaries without checking whether the household will be taxed as a single person or under a family quotient scenario.",
      "Assuming gross salary says enough about disposable income in a high-contribution payroll system.",
    ],
  },
  ireland: {
    howItWorks: [
      "Ireland layers income tax, USC, and PRSI, which means the final deduction is split across several systems rather than one single bracket table.",
      "Tax credits are central to the Irish outcome, so two employees with the same gross salary can still see different net pay if their credit position differs.",
      "For planning, the useful habit is to separate the standard income-tax bands from USC and PRSI so each layer of payroll is visible.",
    ],
    socialSecuritySummary:
      "PRSI and USC are major parts of the Irish payroll calculation and should be checked separately from the standard income-tax bands.",
    personalAllowanceSummary:
      "Ireland relies more on tax credits than on a large generic personal allowance, which is why employee, personal, and household credits matter so much in net-pay calculations.",
    deductionSummary:
      "Pension contributions, approved reliefs, and household credit settings can shift the final outcome meaningfully even when gross salary stays the same.",
    commonMistakes: [
      "Ignoring USC when comparing roles in Ireland.",
      "Forgetting that tax credits are a core part of the Irish system, not a minor afterthought.",
      "Assuming a quoted monthly gross salary tells the full affordability story without checking PRSI and USC.",
    ],
  },
  italy: {
    howItWorks: [
      "Italy taxes salary mainly through IRPEF, employee social-security contributions, and additional regional and municipal surtaxes.",
      "Because local surtaxes vary and payroll arrangements can differ by contract type, a national overview is useful for orientation but not enough for an exact payslip prediction.",
      "Italian offers often need an annualized comparison because extra salary months and contract structure can materially change the monthly cash-flow picture.",
    ],
    socialSecuritySummary:
      "Employee social-security deductions are an important part of the Italian payroll result and should be read together with IRPEF, not after it.",
    personalAllowanceSummary:
      "Italy uses employee tax relief and household-sensitive adjustments rather than relying only on a single fixed allowance number.",
    deductionSummary:
      "Employment relief, family conditions, pension contributions, and local surcharges can all change the final tax result in practice.",
    commonMistakes: [
      "Ignoring regional and municipal surtaxes when comparing cities or regions.",
      "Comparing monthly offers without checking whether the contract includes extra salary months.",
      "Assuming the published IRPEF scale tells the whole payroll story.",
    ],
  },
  japan: {
    howItWorks: [
      "Japan combines national income tax with local inhabitant tax and employee social-insurance deductions, so the annual contract number is only the first step in a real net-pay estimate.",
      "The local inhabitant tax is especially important because it is not just a small detail; it can materially change monthly cash flow after the initial tax year.",
      "Year-end adjustment and household allowances can also shift the final position, so the salary headline needs structured assumptions behind it.",
    ],
    socialSecuritySummary:
      "Japanese payroll commonly includes health insurance, pension, unemployment insurance, and other mandatory employee-side charges alongside the tax lines.",
    personalAllowanceSummary:
      "Basic deductions and dependant-related reliefs matter in Japan, particularly for households that are not simply single earners with no family adjustments.",
    deductionSummary:
      "Insurance deductions, spouse or dependant relief, and local inhabitant-tax timing can all influence what the employee actually keeps.",
    commonMistakes: [
      "Ignoring local inhabitant tax when estimating long-run monthly net income.",
      "Comparing salaries before checking the effect of employee insurance deductions.",
      "Assuming first-year and later-year monthly cash flow will always look identical.",
    ],
  },
  luxembourg: {
    howItWorks: [
      "Luxembourg uses progressive income tax together with payroll contributions, and the final result is shaped heavily by tax class and household status.",
      "That means the same gross salary can produce meaningfully different net pay depending on whether the employee is taxed under a single, married, or other class framework.",
      "Cross-border work patterns can also complicate the practical outcome, so a national overview should be paired with the actual work and residence setup.",
    ],
    socialSecuritySummary:
      "Employee social-security deductions in Luxembourg usually sit alongside income tax and should be viewed as a core part of the take-home calculation.",
    personalAllowanceSummary:
      "Luxembourg relies significantly on tax classes and household treatment, so personal status matters more than in a flat single-band system.",
    deductionSummary:
      "Household conditions, pension items, and certain work-related deductions can influence the final payroll result, especially for cross-border employees.",
    commonMistakes: [
      "Ignoring tax class when comparing offers in Luxembourg.",
      "Forgetting that cross-border commuting can create extra complexity.",
      "Using a single gross number as if it implied one universal net result.",
    ],
  },
  malta: {
    howItWorks: [
      "Malta taxes employment income through progressive bands linked to personal status, with social-security contributions also affecting take-home pay.",
      "The household category matters because single, married, and parent-style tax schedules can produce different outcomes at the same income level.",
      "For salary planning, the cleanest approach is to annualize earnings first and then apply the relevant household schedule and payroll deductions.",
    ],
    socialSecuritySummary:
      "Employee social-security contributions are part of the payroll result in Malta and should be checked together with the income-tax bands.",
    personalAllowanceSummary:
      "Malta's tax result depends strongly on which household schedule applies, so personal status is a core part of the calculation rather than a minor detail.",
    deductionSummary:
      "Household structure, social-security ceilings, and approved deductions or reliefs can change the final net result in practice.",
    commonMistakes: [
      "Using the wrong household schedule for the employee's status.",
      "Ignoring social-security contributions when comparing pay.",
      "Comparing offers without converting them to a consistent annual basis first.",
    ],
  },
  netherlands: {
    howItWorks: [
      "The Netherlands taxes employment income in Box 1 and combines income tax with national-insurance style charges inside the payroll picture.",
      "Tax credits are a major part of the Dutch outcome, so the final effective rate can differ noticeably from the headline marginal rate.",
      "Holiday allowance, pension design, and benefit choices can also matter when two Dutch offers look similar on gross pay alone.",
    ],
    socialSecuritySummary:
      "Dutch payroll is shaped by the combined Box 1 structure and the social-insurance style charges that are reflected in wage withholding.",
    personalAllowanceSummary:
      "The Netherlands relies heavily on tax credits such as the general tax credit and labour-related credits rather than a large single allowance headline.",
    deductionSummary:
      "Pension contributions, commuting structure, mortgage context, and tax-credit interactions can all change the practical outcome beyond the posted rate bands.",
    commonMistakes: [
      "Ignoring holiday allowance when comparing Dutch salary offers.",
      "Looking only at the top Box 1 rate without considering tax credits.",
      "Assuming two gross salaries imply the same take-home pay even when pension design differs.",
    ],
  },
  "new-zealand": {
    howItWorks: [
      "New Zealand usually taxes salary through PAYE withholding, with progressive income-tax bands and the ACC earners' levy shaping the result.",
      "Because PAYE is familiar and automated, some employees underestimate how much the ACC levy and optional KiwiSaver choices can change take-home pay.",
      "A clean salary comparison in New Zealand still needs annualization first, especially when bonus timing or employer KiwiSaver matching differs.",
    ],
    socialSecuritySummary:
      "New Zealand does not use a broad employee social-insurance bundle like many European countries, but PAYE and the ACC earners' levy still create an important deduction layer.",
    personalAllowanceSummary:
      "New Zealand relies mainly on the progressive rate structure and targeted credits rather than a large general personal allowance model.",
    deductionSummary:
      "KiwiSaver participation, ACC treatment, and family credit context can all affect what remains after payroll deductions.",
    commonMistakes: [
      "Ignoring the ACC earners' levy in take-home planning.",
      "Confusing optional KiwiSaver deductions with tax itself.",
      "Comparing monthly offers without annualizing the full package first.",
    ],
  },
  norway: {
    howItWorks: [
      "Norway combines tax on ordinary income with bracket-style surtax layers and national-insurance contributions, so the final payroll result is multi-layered.",
      "That structure means the marginal rate a higher earner sees is not the same as the effective rate on the whole salary.",
      "Norwegian salary comparisons also work better when the full package is annualized first and then translated back into monthly take-home pay.",
    ],
    socialSecuritySummary:
      "National-insurance contributions are a core part of Norwegian payroll and should be read together with ordinary income tax and step-tax layers.",
    personalAllowanceSummary:
      "Norway uses allowance mechanisms and structured tax bases that can shift the taxable result before the highest rates are reached.",
    deductionSummary:
      "Standard deductions, commuting, and household context can all affect the final result beyond the basic national rate tables.",
    commonMistakes: [
      "Treating the top bracket rate as if it applies to the whole salary.",
      "Ignoring national-insurance contributions in cross-country comparisons.",
      "Comparing gross salary without checking what remains monthly after tax.",
    ],
  },
  singapore: {
    howItWorks: [
      "Singapore uses progressive resident income-tax bands, and the direct tax burden on salary is often lower than in many Western payroll systems.",
      "For citizens and permanent residents, CPF contributions are essential to the real gross-to-net picture, while foreign employees may face a different payroll structure.",
      "That difference means nationality or employment status can matter just as much as salary level when comparing offers in Singapore.",
    ],
    socialSecuritySummary:
      "CPF contributions are central for many local employees in Singapore, while some foreign workers are outside that contribution system and therefore see a different payroll profile.",
    personalAllowanceSummary:
      "Singapore's tax system relies on progressive resident rates and targeted personal reliefs rather than a heavy employee payroll tax structure.",
    deductionSummary:
      "Personal reliefs, CPF treatment, and employment-status differences can all shift the final take-home result in practice.",
    commonMistakes: [
      "Comparing a local CPF case with an expatriate package as if they were taxed the same way.",
      "Assuming low headline tax means no meaningful payroll deductions apply.",
      "Ignoring the effect of employment status on CPF treatment.",
    ],
  },
  spain: {
    howItWorks: [
      "Spain taxes salary through a mix of national and regional income-tax rules, with employee social-security deductions also reducing take-home pay.",
      "Because autonomous communities can influence the outcome, one national overview is useful for orientation but cannot cover every local variation precisely.",
      "Spanish offers also need to be compared on a consistent annual basis because household context and regional treatment can shift the effective rate.",
    ],
    socialSecuritySummary:
      "Employee social-security deductions are a major part of Spanish payroll and should be considered alongside the income-tax scale.",
    personalAllowanceSummary:
      "Spain includes personal and family allowances, so household context can materially change the tax result compared with a simple single-earner assumption.",
    deductionSummary:
      "Regional rules, family allowances, and certain deductible items can all change the practical outcome, especially across autonomous communities.",
    commonMistakes: [
      "Ignoring the regional element of Spanish income tax.",
      "Comparing gross salaries without including employee social-security deductions.",
      "Assuming a national headline rate tells the full local story.",
    ],
  },
  sweden: {
    howItWorks: [
      "Sweden usually taxes salary through municipal income tax first and, above certain thresholds, additional state income tax.",
      "The job-tax credit and local municipal rate can materially influence the final result, which is why two similar salaries in different municipalities can still differ.",
      "From a planning perspective, the useful comparison is still annual gross to monthly net, not the top marginal rate quoted in isolation.",
    ],
    socialSecuritySummary:
      "Large Swedish employer charges exist in the wider labour-cost picture, but for the employee the most visible tax difference usually comes through the municipal and state income-tax structure.",
    personalAllowanceSummary:
      "Sweden uses a basic allowance and tax-credit style mechanics that affect the real effective rate rather than relying only on a simple published bracket table.",
    deductionSummary:
      "Municipal variation, work-related deductions, and household context can all influence the result once the headline municipal rate is no longer the whole story.",
    commonMistakes: [
      "Confusing the employee tax picture with the wider employer social-fee burden.",
      "Ignoring municipal tax differences when comparing locations.",
      "Treating the top state rate as if it applies to all income.",
    ],
  },
  "united-states": {
    howItWorks: [
      "The United States layers federal income tax with Social Security and Medicare payroll deductions, and many employees also face state or city tax on top of that.",
      "That means a federal-only estimate is useful for orientation, but it is not a full real-world paycheck model if the job sits in a taxable state or city.",
      "Pre-tax retirement contributions, health insurance, and filing status can all shift the result materially even before state tax enters the picture.",
    ],
    socialSecuritySummary:
      "FICA withholding usually includes Social Security and Medicare, with caps and additional Medicare rules affecting higher earners differently from lower earners.",
    personalAllowanceSummary:
      "The modern US system relies more on standard deductions, filing status, and child-related rules than on a simple personal allowance model.",
    deductionSummary:
      "401(k) contributions, health-insurance payroll deductions, HSA contributions, and filing status can all materially change what an employee keeps.",
    commonMistakes: [
      "Ignoring state and city taxes when comparing US offers.",
      "Treating federal tax brackets as if they describe the full payroll result.",
      "Comparing salaries without checking pre-tax retirement and health deductions.",
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
