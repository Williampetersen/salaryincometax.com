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
  rate?: number;
  threshold?: number;
  cap?: number | null;
  brackets?: RateBracket[];
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
  defaults: TaxRuleDefaults;
  allowances: TaxRuleAllowances;
  personalStatuses: PersonalStatusConfig[];
  incomeTaxBrackets: Record<string, RateBracket[]>;
  standardDeductions: StandardDeductionRule[];
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
    notes: string;
    source: string[];
  };
}
