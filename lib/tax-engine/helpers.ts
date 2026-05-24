import type {
  CalculationInput,
  ContributionRule,
  CountryTaxRule,
  PeriodBreakdown,
  RateBracket,
  SalaryPeriod,
  StandardDeductionRule,
  TaxCreditRule,
  TaxRuleDefaults,
} from "@/lib/tax-engine/types";

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function clampMinimum(value: number, minimum = 0): number {
  return Number.isFinite(value) ? Math.max(value, minimum) : minimum;
}

export function getRuleForStatus(
  rule: CountryTaxRule,
  requestedStatus: string,
): CountryTaxRule["personalStatuses"][number] {
  return (
    rule.personalStatuses.find((status) => status.key === requestedStatus) ??
    rule.personalStatuses[0]
  );
}

export function getBracketsForStatus(
  rule: CountryTaxRule,
  statusKey: string,
): RateBracket[] {
  return (
    rule.incomeTaxBrackets[statusKey] ??
    rule.incomeTaxBrackets.default ??
    Object.values(rule.incomeTaxBrackets)[0]
  );
}

export function applyProgressiveBrackets(
  amount: number,
  brackets: RateBracket[],
): number {
  let previousUpperLimit = 0;
  let total = 0;

  for (const bracket of brackets) {
    const upperLimit = bracket.upTo ?? Number.POSITIVE_INFINITY;
    const taxableWithinBracket =
      Math.min(amount, upperLimit) - previousUpperLimit;

    if (taxableWithinBracket > 0) {
      total += taxableWithinBracket * bracket.rate;
    }

    previousUpperLimit = upperLimit;

    if (amount <= upperLimit) {
      break;
    }
  }

  return roundCurrency(total);
}

export function calculateFlatRuleBase(
  amount: number,
  threshold = 0,
  cap?: number | null,
): number {
  const cappedAmount = cap == null ? amount : Math.min(amount, cap);
  return Math.max(cappedAmount - threshold, 0);
}

export function applyContributionRule(
  rule: ContributionRule,
  baseAmount: number,
): number {
  if (rule.type === "progressive" && rule.brackets) {
    return applyProgressiveBrackets(baseAmount, rule.brackets);
  }

  if (rule.type === "flat" && typeof rule.rate === "number") {
    const taxableBase = calculateFlatRuleBase(
      baseAmount,
      rule.threshold ?? 0,
      rule.cap,
    );

    return roundCurrency(taxableBase * rule.rate);
  }

  return 0;
}

export function appliesToStatus(
  statusKeys: string[] | undefined,
  statusKey: string,
): boolean {
  return !statusKeys?.length || statusKeys.includes(statusKey);
}

export function applyDeductionRule(
  rule: StandardDeductionRule,
  baseAmount: number,
): number {
  if (rule.type === "flat") {
    return roundCurrency(rule.amount ?? 0);
  }

  if (rule.type === "percentage") {
    const taxableBase = calculateFlatRuleBase(
      baseAmount,
      rule.threshold ?? 0,
      rule.cap,
    );

    return roundCurrency(taxableBase * (rule.rate ?? 0));
  }

  return 0;
}

export function applyTaxCreditRule(
  rule: TaxCreditRule,
  baseAmount: number,
): number {
  if (rule.type === "flat") {
    return roundCurrency(rule.amount ?? 0);
  }

  if (rule.type === "percentage") {
    const taxableBase = calculateFlatRuleBase(
      baseAmount,
      rule.threshold ?? 0,
      rule.cap,
    );

    return roundCurrency(taxableBase * (rule.rate ?? 0));
  }

  return 0;
}

export function convertPeriodToAnnual(
  amount: number,
  salaryPeriod: SalaryPeriod,
  defaults: TaxRuleDefaults | CalculationInput,
): number {
  switch (salaryPeriod) {
    case "yearly":
      return amount;
    case "monthly":
      return amount * defaults.paidMonthsPerYear;
    case "weekly":
      return amount * defaults.paidWeeksPerYear;
    case "daily":
      return amount * defaults.workingDaysPerWeek * defaults.paidWeeksPerYear;
    case "hourly":
      return amount * defaults.workingHoursPerWeek * defaults.paidWeeksPerYear;
  }
}

export function convertAnnualToPeriods(
  annualGross: number,
  annualNet: number,
  defaults: TaxRuleDefaults | CalculationInput,
): PeriodBreakdown {
  const annualTax = annualGross - annualNet;

  const yearly = {
    gross: roundCurrency(annualGross),
    net: roundCurrency(annualNet),
    tax: roundCurrency(annualTax),
  };

  const monthly = {
    gross: roundCurrency(annualGross / defaults.paidMonthsPerYear),
    net: roundCurrency(annualNet / defaults.paidMonthsPerYear),
    tax: roundCurrency(annualTax / defaults.paidMonthsPerYear),
  };

  const weekly = {
    gross: roundCurrency(annualGross / defaults.paidWeeksPerYear),
    net: roundCurrency(annualNet / defaults.paidWeeksPerYear),
    tax: roundCurrency(annualTax / defaults.paidWeeksPerYear),
  };

  const daily = {
    gross: roundCurrency(weekly.gross / defaults.workingDaysPerWeek),
    net: roundCurrency(weekly.net / defaults.workingDaysPerWeek),
    tax: roundCurrency(weekly.tax / defaults.workingDaysPerWeek),
  };

  const hourly = {
    gross: roundCurrency(weekly.gross / defaults.workingHoursPerWeek),
    net: roundCurrency(weekly.net / defaults.workingHoursPerWeek),
    tax: roundCurrency(weekly.tax / defaults.workingHoursPerWeek),
  };

  return {
    yearly,
    monthly,
    weekly,
    daily,
    hourly,
  };
}

export function normalizeInput(
  input: CalculationInput,
  defaults: TaxRuleDefaults,
): CalculationInput {
  return {
    ...input,
    amount: clampMinimum(input.amount),
    extraIncome: clampMinimum(input.extraIncome),
    numberOfChildren: Math.max(0, Math.floor(input.numberOfChildren)),
    paidMonthsPerYear: clampMinimum(
      input.paidMonthsPerYear || defaults.paidMonthsPerYear,
      1,
    ),
    paidWeeksPerYear: clampMinimum(
      input.paidWeeksPerYear || defaults.paidWeeksPerYear,
      1,
    ),
    workingDaysPerWeek: clampMinimum(
      input.workingDaysPerWeek || defaults.workingDaysPerWeek,
      1,
    ),
    workingHoursPerWeek: clampMinimum(
      input.workingHoursPerWeek || defaults.workingHoursPerWeek,
      1,
    ),
  };
}
