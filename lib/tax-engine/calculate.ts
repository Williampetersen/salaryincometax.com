import {
  appliesToStatus,
  applyContributionRule,
  applyDeductionRule,
  applyProgressiveBrackets,
  applyTaxCreditRule,
  convertAnnualToPeriods,
  convertPeriodToAnnual,
  getBracketsForStatus,
  getRuleForStatus,
  normalizeInput,
  roundCurrency,
} from "@/lib/tax-engine/helpers";
import type {
  CalculationInput,
  CalculationLine,
  CalculationResult,
  CountryTaxRule,
} from "@/lib/tax-engine/types";

interface AnnualComputation {
  annualGross: number;
  annualNet: number;
  taxableIncome: number;
  totalDeductions: number;
  totalAllowances: number;
  incomeTaxBeforeCredits: number;
  incomeTaxCredits: number;
  incomeTax: number;
  socialSecurity: number;
  regionalTaxes: number;
  totalTax: number;
  deductionLines: CalculationLine[];
  incomeTaxCreditLines: CalculationLine[];
  socialSecurityLines: CalculationLine[];
  regionalTaxLines: CalculationLine[];
}

function computeAnnualBreakdown(
  annualGross: number,
  input: CalculationInput,
  rule: CountryTaxRule,
): AnnualComputation {
  const status = getRuleForStatus(rule, input.personalStatus);
  const deductionLines = rule.standardDeductions
    .map((deduction) => ({
      name: deduction.name,
      amount: applyDeductionRule(deduction, annualGross),
    }))
    .filter((line) => line.amount > 0);

  const totalDeductions = roundCurrency(
    deductionLines.reduce((sum, line) => sum + line.amount, 0) +
      (status.deductionAdjustment ?? 0),
  );

  const totalAllowances = roundCurrency(
    rule.allowances.personal +
      (status.allowanceAdjustment ?? 0) +
      input.numberOfChildren *
        (rule.allowances.child + (status.childAllowanceAdjustment ?? 0)),
  );

  const taxableIncome = roundCurrency(
    Math.max(annualGross - totalDeductions - totalAllowances, 0),
  );

  const incomeTax = roundCurrency(
    applyProgressiveBrackets(
      taxableIncome,
      getBracketsForStatus(rule, status.key),
    ),
  );

  const incomeTaxCreditLines = rule.incomeTaxCredits
    .filter((credit) => appliesToStatus(credit.statusKeys, status.key))
    .map((credit) => {
      const baseAmount =
        credit.base === "gross"
          ? annualGross
          : credit.base === "incomeTax"
            ? incomeTax
            : taxableIncome;

      return {
        name: credit.name,
        amount: applyTaxCreditRule(credit, baseAmount),
      };
    })
    .filter((line) => line.amount > 0);

  const totalIncomeTaxCredits = roundCurrency(
    Math.min(
      incomeTax,
      incomeTaxCreditLines.reduce((sum, line) => sum + line.amount, 0),
    ),
  );

  const netIncomeTax = roundCurrency(Math.max(incomeTax - totalIncomeTaxCredits, 0));

  const socialSecurityLines = rule.socialSecurityRules
    .filter((contribution) => appliesToStatus(contribution.statusKeys, status.key))
    .map((contribution) => {
      const baseAmount =
        contribution.base === "gross" ? annualGross : taxableIncome;

      return {
        name: contribution.name,
        amount: applyContributionRule(contribution, baseAmount),
      };
    })
    .filter((line) => line.amount > 0);

  const socialSecurity = roundCurrency(
    socialSecurityLines.reduce((sum, line) => sum + line.amount, 0),
  );

  const regionalTaxLines = rule.regionalTaxes
    .filter((regionalTax) => appliesToStatus(regionalTax.statusKeys, status.key))
    .map((regionalTax) => {
      const baseAmount =
        regionalTax.base === "incomeTax"
          ? netIncomeTax
          : regionalTax.base === "gross"
            ? annualGross
            : taxableIncome;

      return {
        name: regionalTax.name,
        amount: applyContributionRule(regionalTax, baseAmount),
      };
    })
    .filter((line) => line.amount > 0);

  const regionalTaxes = roundCurrency(
    regionalTaxLines.reduce((sum, line) => sum + line.amount, 0),
  );

  const totalTax = roundCurrency(netIncomeTax + socialSecurity + regionalTaxes);
  const annualNet = roundCurrency(annualGross - totalTax);

  return {
    annualGross: roundCurrency(annualGross),
    annualNet,
    taxableIncome,
    totalDeductions,
    totalAllowances,
    incomeTaxBeforeCredits: incomeTax,
    incomeTaxCredits: totalIncomeTaxCredits,
    incomeTax: netIncomeTax,
    socialSecurity,
    regionalTaxes,
    totalTax,
    deductionLines,
    incomeTaxCreditLines,
    socialSecurityLines,
    regionalTaxLines,
  };
}

function estimateGrossForTargetNet(
  targetAnnualNet: number,
  input: CalculationInput,
  rule: CountryTaxRule,
): AnnualComputation {
  const bonusAnnual = input.extraIncome;
  let low = bonusAnnual;
  let high = Math.max(targetAnnualNet * 3, bonusAnnual + rule.minimumWage * 2);
  let result = computeAnnualBreakdown(high, input, rule);

  let guard = 0;
  while (result.annualNet < targetAnnualNet && guard < 12) {
    high *= 1.5;
    result = computeAnnualBreakdown(high, input, rule);
    guard += 1;
  }

  for (let attempt = 0; attempt < 60; attempt += 1) {
    const midpoint = (low + high) / 2;
    const candidate = computeAnnualBreakdown(midpoint, input, rule);

    if (candidate.annualNet < targetAnnualNet) {
      low = midpoint;
    } else {
      high = midpoint;
      result = candidate;
    }
  }

  return result;
}

export function calculateSalaryTax(
  rawInput: CalculationInput,
  rule: CountryTaxRule,
): CalculationResult {
  const input = normalizeInput(rawInput, rule.defaults);
  const annualAmount = roundCurrency(
    convertPeriodToAnnual(input.amount, input.salaryPeriod, input),
  );

  const annualGrossForward = roundCurrency(annualAmount + input.extraIncome);
  const computation = input.reverseCalculation
    ? estimateGrossForTargetNet(annualAmount, input, rule)
    : computeAnnualBreakdown(annualGrossForward, input, rule);

  const periodBreakdown = convertAnnualToPeriods(
    computation.annualGross,
    computation.annualNet,
    input,
  );

  const status = getRuleForStatus(rule, input.personalStatus);

  return {
    countrySlug: rule.slug,
    countryName: rule.countryName,
    taxYear: rule.taxYear,
    currency: rule.currency,
    input,
    annual: {
      gross: computation.annualGross,
      taxableIncome: computation.taxableIncome,
      totalDeductions: computation.totalDeductions,
      totalAllowances: computation.totalAllowances,
      incomeTaxBeforeCredits: computation.incomeTaxBeforeCredits,
      incomeTaxCredits: computation.incomeTaxCredits,
      incomeTax: computation.incomeTax,
      socialSecurity: computation.socialSecurity,
      regionalTaxes: computation.regionalTaxes,
      totalTax: computation.totalTax,
      net: computation.annualNet,
    },
    effectiveTaxRate:
      computation.annualGross === 0
        ? 0
        : roundCurrency(computation.totalTax / computation.annualGross),
    periodBreakdown,
    deductionLines: computation.deductionLines,
    incomeTaxCreditLines: computation.incomeTaxCreditLines,
    socialSecurityLines: computation.socialSecurityLines,
    regionalTaxLines: computation.regionalTaxLines,
    comparison: {
      salary: computation.annualGross,
      medianSalary: rule.medianSalary,
      minimumWage: rule.minimumWage,
    },
    reverseEstimatedGross: input.reverseCalculation
      ? computation.annualGross
      : undefined,
    metadata: {
      statusLabel: status.label,
      implementationStatus: rule.implementationStatus,
      coverageLevel: rule.coverageLevel,
      notes: rule.notes,
      source: rule.source,
    },
  };
}
