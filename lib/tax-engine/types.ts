export const REGION_ORDER = [
  "Europe",
  "North America",
  "Pacific",
  "Asia",
] as const;

export const SALARY_PERIODS = [
  "yearly",
  "monthly",
  "weekly",
  "daily",
  "hourly",
] as const;

export type Region = (typeof REGION_ORDER)[number];
export type SalaryPeriod = (typeof SALARY_PERIODS)[number];

export interface RateBracket {
  upTo: number | null;
  rate: number;
}

export interface StandardDeductionRule {
  name: string;
  type: "flat" | "percentage";
  amount?: number;
  rate?: number;
  cap?: number | null;
  threshold?: number;
}

export interface ContributionRule {
  name: string;
  type: "flat" | "progressive";
  base: "gross" | "taxableIncome" | "incomeTax";
  statusKeys?: string[];
  rate?: number;
  threshold?: number;
  cap?: number | null;
  brackets?: RateBracket[];
}

export interface TaxCreditRule {
  name: string;
  type: "flat" | "percentage";
  base: "gross" | "taxableIncome" | "incomeTax";
  statusKeys?: string[];
  amount?: number;
  rate?: number;
  threshold?: number;
  cap?: number | null;
}

export interface PersonalStatusConfig {
  key: string;
  label: string;
  allowanceAdjustment?: number;
  deductionAdjustment?: number;
  childAllowanceAdjustment?: number;
}

export interface TaxRuleDefaults {
  paidMonthsPerYear: number;
  paidWeeksPerYear: number;
  workingDaysPerWeek: number;
  workingHoursPerWeek: number;
}

export interface TaxRuleAllowances {
  personal: number;
  child: number;
}

export interface CountryTaxRule {
  countryCode: string;
  countryName: string;
  slug: string;
  region: Region;
  currency: string;
  supportedCurrencies: string[];
  taxYear: number;
  implementationStatus: "complete" | "example";
  coverageLevel: "verified" | "partial" | "estimate";
  defaults: TaxRuleDefaults;
  allowances: TaxRuleAllowances;
  personalStatuses: PersonalStatusConfig[];
  incomeTaxBrackets: Record<string, RateBracket[]>;
  standardDeductions: StandardDeductionRule[];
  incomeTaxCredits: TaxCreditRule[];
  socialSecurityRules: ContributionRule[];
  regionalTaxes: ContributionRule[];
  medianSalary: number;
  minimumWage: number;
  notes: string;
  source: string[];
}

export interface CalculationInput {
  country: string;
  taxYear: number;
  amount: number;
  currency: string;
  salaryPeriod: SalaryPeriod;
  paidMonthsPerYear: number;
  paidWeeksPerYear: number;
  workingDaysPerWeek: number;
  workingHoursPerWeek: number;
  extraIncome: number;
  personalStatus: string;
  numberOfChildren: number;
  reverseCalculation: boolean;
  description?: string;
}

export interface CalculationLine {
  name: string;
  amount: number;
}

export interface AnnualBreakdown {
  gross: number;
  taxableIncome: number;
  totalDeductions: number;
  totalAllowances: number;
  incomeTaxBeforeCredits: number;
  incomeTaxCredits: number;
  incomeTax: number;
  socialSecurity: number;
  regionalTaxes: number;
  totalTax: number;
  net: number;
}

export interface PeriodBreakdownValue {
  gross: number;
  net: number;
  tax: number;
}

export type PeriodBreakdown = Record<SalaryPeriod, PeriodBreakdownValue>;

export interface CalculationResult {
  countrySlug: string;
  countryName: string;
  taxYear: number;
  currency: string;
  input: CalculationInput;
  annual: AnnualBreakdown;
  effectiveTaxRate: number;
  periodBreakdown: PeriodBreakdown;
  deductionLines: CalculationLine[];
  incomeTaxCreditLines: CalculationLine[];
  socialSecurityLines: CalculationLine[];
  regionalTaxLines: CalculationLine[];
  comparison: {
    salary: number;
    medianSalary: number;
    minimumWage: number;
  };
  reverseEstimatedGross?: number;
  metadata: {
    statusLabel: string;
    implementationStatus: CountryTaxRule["implementationStatus"];
    coverageLevel: CountryTaxRule["coverageLevel"];
    notes: string;
    source: string[];
  };
}
