import type { FAQItem } from "@/lib/country-catalog";

export interface CountryHighlight {
  intro: string;
  systemFacts: string[];
  watchOuts: string[];
  faqs: FAQItem[];
}

export const COUNTRY_HIGHLIGHTS: Record<string, CountryHighlight> = {
  australia: {
    intro:
      "Australia taxes residents on a progressive federal schedule with no separate state income tax, so the 2026-27 brackets plus the Medicare levy tell most of the story for a typical payslip.",
    systemFacts: [
      "The Medicare levy is a flat 2% of taxable income on top of the ordinary income tax brackets, not a bracket of its own.",
      "There is no state or provincial income tax in Australia, unlike Canada or the US, so the federal schedule modeled here covers the full income tax picture.",
      "Superannuation (compulsory retirement contributions) is paid by the employer on top of salary in most arrangements and is not treated as an employee deduction in this model.",
    ],
    watchOuts: [
      "The Medicare levy surcharge (an extra charge for higher earners without private hospital cover) is not modeled.",
      "HELP/HECS student loan repayments, which scale with income and reduce take-home pay for many graduates, are not included.",
      "The Low Income Tax Offset and other offsets that reduce final tax payable for lower earners are not applied.",
    ],
    faqs: [
      {
        question: "Does this include the Medicare levy?",
        answer:
          "Yes. The calculator applies the flat 2% Medicare levy on top of the standard income tax brackets, matching how it appears on an Australian payslip.",
      },
      {
        question: "Does this include HECS/HELP repayments?",
        answer:
          "No. Compulsory HELP repayments depend on your specific loan balance and repayment threshold, so they are not netted out of the result.",
      },
      {
        question: "Is superannuation subtracted from my take-home pay here?",
        answer:
          "No. Superannuation guarantee contributions are paid by the employer in addition to salary in most cases, so this model treats your entered amount as pre-super gross pay.",
      },
      {
        question: "Why is my real payslip different from this estimate?",
        answer:
          "Offsets like the Low Income Tax Offset, the Medicare levy surcharge, and HELP repayments all change the final number and are not part of this baseline model.",
      },
    ],
  },

  belgium: {
    intro:
      "Belgium layers a national income tax on top of a commune-level municipal surcharge, so two people with the same salary in different towns can see different take-home pay.",
    systemFacts: [
      "A municipal surcharge is added on top of the national income tax bill; this model uses a 7% average since the real rate is set commune by commune.",
      "Professional expenses are usually deducted before tax; rather than asking for itemized costs, this model applies a flat professional-expense assumption.",
      "Employee social security contributions are deducted before the income tax calculation, which is a different order of operations than some flat-deduction countries.",
    ],
    watchOuts: [
      "Your actual commune's surcharge could sit meaningfully above or below the 7% average used here.",
      "Workers with unusually high deductible professional expenses (for example, long commutes or dedicated home-office costs) will see a different result than the flat assumption implies.",
      "Household-level tax effects, such as joint filing with a spouse, are not modeled at the country level.",
    ],
    faqs: [
      {
        question: "Why does Belgium have a municipal surcharge on top of income tax?",
        answer:
          "Belgian communes fund local services partly through a surcharge calculated on your national income tax bill, so it varies by where you live rather than being a fixed national rate.",
      },
      {
        question: "Is the municipal surcharge rate here exact for my commune?",
        answer:
          "No. This model uses a 7% average municipal surcharge as a baseline; check your commune's actual rate for a precise figure.",
      },
      {
        question: "Are my professional expenses estimated or itemized?",
        answer:
          "Estimated. The model applies a flat professional-expense deduction rather than your specific itemized costs.",
      },
    ],
  },

  canada: {
    intro:
      "This route models Canada's federal income tax, CPP, and EI only - it deliberately stops at the national layer because provincial tax rules differ enough to need their own model.",
    systemFacts: [
      "Canada Pension Plan (CPP) and Employment Insurance (EI) are both deducted as employee contributions alongside federal income tax.",
      "Provincial and territorial income tax is a separate layer on top of the federal brackets shown here and is not included in this route.",
      "The federal personal amount phases out for higher earners; this baseline does not yet apply that phaseout.",
    ],
    watchOuts: [
      "Your real total income tax will be higher once your province or territory's own income tax is added - this is a federal-only estimate, not your full tax bill.",
      "Provincial tax credits and provincial CPP/EI adjustments are outside this model.",
      "The indexed federal personal amount phaseout for high earners is not applied, so results near the top bracket can be optimistic.",
    ],
    faqs: [
      {
        question: "Does this calculator include provincial income tax?",
        answer:
          "No. This route models the federal layer only - CPP, EI, and federal brackets. Provincial or territorial income tax is a separate charge on top of this result and can change your total noticeably depending on where you live.",
      },
      {
        question: "Why is my real Canadian paycheck different from this result?",
        answer:
          "The biggest gap is usually provincial tax, which is not included here. Provincial credits and the federal personal amount phaseout for high earners are also not modeled.",
      },
      {
        question: "What deductions does this model include?",
        answer:
          "CPP and EI employee contributions are deducted alongside federal income tax brackets for the selected tax year.",
      },
    ],
  },

  denmark: {
    intro:
      "Denmark's income tax runs through a national reform schedule plus a municipal tax that is high enough to be the single biggest line on a Danish payslip, and the country has no statutory minimum wage at all.",
    systemFacts: [
      "The average municipal tax modeled here is 25.06% of taxable income, layered on top of the national state tax tiers - municipal tax alone is often larger than the national tax.",
      "AM-bidrag (the labor market contribution) is calculated before the income tax brackets, changing the taxable base that follows it.",
      "Denmark has no legally mandated national minimum wage; wage floors are instead set by sector-level collective agreements, so the minimum-wage comparison here uses a conservative benchmark rather than a statutory figure.",
    ],
    watchOuts: [
      "Your actual municipal tax rate depends on your specific municipality and can differ from the 25.06% average used here.",
      "Church tax, which applies to registered members of the Church of Denmark and varies by municipality, is not included.",
      "Because there is no statutory minimum wage, the minimum-wage comparison is an estimate, not a legal benchmark - your collective agreement may set a different floor.",
    ],
    faqs: [
      {
        question: "Why is Denmark's tax rate so high?",
        answer:
          "Danish take-home pay reflects both the national state tax tiers and a substantial municipal tax (modeled at a 25.06% average here), plus the AM-bidrag labor market contribution taken before income tax is applied.",
      },
      {
        question: "Does Denmark have a legal minimum wage?",
        answer:
          "No. Denmark has no statutory national minimum wage - wage floors come from sector collective bargaining agreements, so the figure shown here is a conservative benchmark rather than a legal minimum.",
      },
      {
        question: "Is church tax included in this estimate?",
        answer:
          "No. Church tax applies only to registered members of the Church of Denmark and varies by municipality, so it is left out of this baseline model.",
      },
    ],
  },

  france: {
    intro:
      "France's income tax is officially calculated per household using a parts-based quotient system; this model approximates that effect through status-specific brackets rather than the full formula.",
    systemFacts: [
      "A standard 10% professional expense deduction is applied automatically rather than requiring itemized work costs.",
      "Employee social contributions are deducted from gross pay before the income tax calculation.",
      "The real French system divides household income by a number of \"parts\" based on marital status and children (quotient familial); this model approximates that outcome through status-specific brackets and child allowances instead of the full parts-based formula.",
    ],
    watchOuts: [
      "Households with more complex quotient familial situations (for example, more than two children, or shared custody arrangements) will see a bigger gap between this estimate and their real notice d'impot.",
      "The 10% professional expense deduction is a standard assumption; employees who itemize higher real costs may see a different official result.",
      "Regional or municipal surtaxes that some French taxpayers encounter are not modeled at the country level.",
    ],
    faqs: [
      {
        question: "Does this model the French family quotient (quotient familial) system?",
        answer:
          "Only approximately. Real French tax divides household income by a number of parts based on marital status and children; this model instead approximates the effect through status-specific brackets and child allowances rather than the full parts-based formula.",
      },
      {
        question: "Is the 10% professional expense deduction always correct?",
        answer:
          "It is a standard assumption used automatically here. Employees with itemized deductible costs above that flat rate may see a different figure on their real tax notice.",
      },
    ],
  },

  germany: {
    intro:
      "Germany's official income tax formula is a continuous mathematical function rather than fixed brackets, so this model uses a scalable approximation of that curve and leaves out church tax entirely.",
    systemFacts: [
      "The solidarity surcharge (Solidaritatszuschlag) is calculated as 5.5% of the income tax owed, not of gross salary directly.",
      "Employee social insurance here covers three separate buckets - pension insurance, unemployment insurance, and health and care insurance - each with its own employee share.",
      "Germany's real tax formula is continuous (a smooth curve defined by law), unlike simple stepped brackets; this baseline uses a scalable approximation of that curve built from the published 2026 basic allowance thresholds.",
    ],
    watchOuts: [
      "Church tax (Kirchensteuer), which applies to registered members of a recognized church and typically adds 8-9% of the income tax bill depending on the state, is not included.",
      "Health insurance contribution rates vary slightly by insurer (Zusatzbeitrag); this model uses a representative rate rather than your specific fund's rate.",
      "Because the formula is an approximation of a continuous curve rather than the exact statutory function, results very close to bracket boundaries can differ slightly from an official payroll calculation.",
    ],
    faqs: [
      {
        question: "Does this include German church tax (Kirchensteuer)?",
        answer:
          "No. Church tax only applies to registered members of a recognized church and varies by state (typically 8-9% of your income tax bill), so it is left out of this baseline model.",
      },
      {
        question: "Why does Germany use an approximation instead of exact brackets?",
        answer:
          "Germany's official income tax formula is a continuous function defined by law, not simple stepped brackets like many other countries. This model uses a scalable approximation of that curve based on the published 2026 basic allowance thresholds.",
      },
      {
        question: "What does the solidarity surcharge apply to?",
        answer:
          "The solidarity surcharge is calculated as 5.5% of your income tax owed, not 5.5% of your gross salary.",
      },
    ],
  },

  ireland: {
    intro:
      "Ireland's PAYE system reduces tax through personal and employee tax credits rather than a personal allowance, alongside separate USC and PRSI charges that both apply on top of income tax.",
    systemFacts: [
      "Universal Social Charge (USC) and Pay Related Social Insurance (PRSI) are both modeled as separate charges alongside income tax, not folded into a single combined rate.",
      "Ireland reduces tax owed using personal and employee tax credits subtracted directly from the tax bill, rather than a tax-free personal allowance subtracted from income before brackets apply.",
      "USC has its own separate rate bands from income tax, so a change in income can move you into a new USC band without moving you into a new income tax band, or vice versa.",
    ],
    watchOuts: [
      "Joint assessment for married couples and civil partners, which can shift band thresholds between spouses, is not modeled at the country level.",
      "Pension contribution relief, which reduces taxable income for many PAYE workers, is not applied here.",
      "PRSI subclass detail (different subclasses apply to different employment types) and non-PAYE credits are outside this national baseline.",
    ],
    faqs: [
      {
        question: "Why does this show tax credits instead of a personal allowance?",
        answer:
          "Ireland's PAYE system works by subtracting personal and employee tax credits directly from the tax you owe, rather than by giving you a tax-free allowance before brackets are applied. This model follows that same credit-based mechanism.",
      },
      {
        question: "Are USC and PRSI included separately from income tax?",
        answer:
          "Yes. Universal Social Charge and PRSI both have their own rate structures and are calculated alongside - not merged into - the income tax bands.",
      },
      {
        question: "Does this account for joint assessment as a married couple?",
        answer:
          "No. Joint assessment can shift band thresholds between spouses and is not modeled at this country level; the result assumes individual assessment.",
      },
    ],
  },

  "united-kingdom": {
    intro:
      "This model covers the income tax bands used in England, Wales, and Northern Ireland; Scotland runs its own separate bands with different thresholds and rates that are not included here.",
    systemFacts: [
      "Employee National Insurance is calculated as its own deduction alongside income tax, using its own thresholds rather than being merged into the income tax bands.",
      "The tax year modeled runs 6 April 2026 to 5 April 2027, matching the UK's non-calendar tax year rather than a January-to-December year.",
      "England, Wales, and Northern Ireland share one set of income tax bands; this is the set modeled here.",
    ],
    watchOuts: [
      "Scotland has its own income tax bands, with more bands and different thresholds than the rest of the UK - a Scottish taxpayer's real result can differ meaningfully from this estimate.",
      "The personal allowance tapers away entirely for income above GBP 100,000 (losing GBP 1 of allowance for every GBP 2 earned above that threshold); this taper is not applied here.",
      "Marriage Allowance, which lets some couples transfer a small part of their personal allowance, is not modeled.",
    ],
    faqs: [
      {
        question: "Does this calculator use Scottish income tax bands?",
        answer:
          "No. This model uses the income tax bands for England, Wales, and Northern Ireland. Scotland has its own separate bands and rates, so a Scottish taxpayer's real tax will differ from this result.",
      },
      {
        question: "What happens to my personal allowance above GBP 100,000?",
        answer:
          "In the real system, the personal allowance reduces by GBP 1 for every GBP 2 earned above GBP 100,000 until it reaches zero. This taper is not applied in this baseline model, so high earners near that threshold should expect a difference.",
      },
      {
        question: "Is National Insurance included?",
        answer:
          "Yes. Employee National Insurance is calculated using its own thresholds alongside income tax, matching how it appears as a separate deduction on a UK payslip.",
      },
    ],
  },

  "united-states": {
    intro:
      "This route models US federal tax only - IRS brackets, the standard deduction, and FICA - because state and local income tax rules vary too widely to fold into one national baseline.",
    systemFacts: [
      "FICA is modeled as two components - Social Security and Medicare - plus the Additional Medicare Tax that applies above set income thresholds.",
      "The federal standard deduction is applied automatically, matching how most filers who do not itemize experience the federal system.",
      "State and city income tax are not part of this route at all; some US states (for example Texas and Florida) charge no state income tax, while others (for example California and New York) charge meaningfully more, and this baseline treats all states the same.",
    ],
    watchOuts: [
      "Your real take-home pay depends heavily on your state and city, which can add anywhere from 0% to over 13% in additional income tax - none of that is reflected here.",
      "Itemized deductions, above-the-line adjustments, and most personal tax credits (child tax credit, earned income tax credit, and similar) are not applied.",
      "This is a federal-only estimate; treat the state/local gap as the single biggest source of difference from your real paycheck.",
    ],
    faqs: [
      {
        question: "Does this include state income tax?",
        answer:
          "No. This is a federal-only model. State income tax ranges from 0% in states like Texas and Florida to over 13% in states like California, so your real take-home pay can differ substantially depending on where you live.",
      },
      {
        question: "Is the standard deduction applied automatically?",
        answer:
          "Yes, the federal standard deduction is applied by default, matching the experience of most filers who do not itemize.",
      },
      {
        question: "Does this include the Additional Medicare Tax?",
        answer:
          "Yes. Alongside standard Social Security and Medicare (FICA) withholding, the Additional Medicare Tax is applied once income crosses the relevant federal threshold.",
      },
      {
        question: "Why is my real US paycheck different from this result?",
        answer:
          "The biggest gap is almost always state and local income tax, which this federal-only route does not include, followed by itemized deductions and personal credits that are not applied here.",
      },
    ],
  },
};

export function getCountryHighlight(slug: string): CountryHighlight | undefined {
  return COUNTRY_HIGHLIGHTS[slug];
}
