export type BlogCategorySlug =
  | "cost-of-living"
  | "income-tax"
  | "minimum-wage"
  | "salary-guides";

export type BlogArticleType =
  | "country-cost-of-living"
  | "city-cost-of-living"
  | "income-tax"
  | "minimum-wage"
  | "average-salary"
  | "gross-vs-net"
  | "expensive"
  | "best-cities";

export type BlogTemplateStatus = "detailed" | "template";

export interface BlogCategoryDefinition {
  slug: BlogCategorySlug;
  name: string;
  description: string;
}

export interface BlogCityDefinition {
  slug: string;
  name: string;
  countrySlug: string;
  countryName: string;
  image: string;
}

export interface BlogCountryDefinition {
  slug: string;
  name: string;
  currency: string;
  region: string;
  calculatorUrl: string;
  flagSrc?: string;
  image: string;
  cities: BlogCityDefinition[];
}

export interface SalaryGuideData {
  averageGrossAnnual: number;
  averageNetAnnual: number;
  averageNetMonthly: number;
  comfortableNetSingle: number;
  comfortableNetFamily: number;
  minimumWageHourly?: number | null;
  minimumWageMonthly?: number | null;
  minimumWageAnnual?: number | null;
  updatedAt: string;
  sources: string[];
}

export interface TaxArticleData {
  topRate: number;
  socialSecuritySummary: string;
  personalAllowanceSummary: string;
  deductionSummary: string;
  howItWorks: string[];
  commonMistakes: string[];
  updatedAt: string;
  sources: string[];
}

export interface CostBreakdownData {
  rentOneBedroom: number;
  rentFamilyHome: number;
  propertyPerSqm: number;
  utilities: number;
  internetAndMobile: number;
  transportPass: number;
  groceries: number;
  eatingOut: number;
  healthcare: number;
  childcare: number;
  education: number;
  sportsAndFitness: number;
  entertainment: number;
  singlePersonMonthly: number;
  coupleMonthly: number;
  familyMonthly: number;
  comfortableNetMonthly: number;
  expensiveAnswer: string;
  comfortableSalaryAnswer: string;
  averageRentAnswer: string;
  singlePersonAnswer: string;
  familyAnswer: string;
  moneySavingTips: string[];
  comparisonTargets: string[];
  updatedAt: string;
  sources: string[];
}

export interface CostOfLivingArticleData extends CostBreakdownData {
  averageGrossAnnual: number;
  averageNetAnnual: number;
  averageNetMonthly: number;
  housingNote: string;
  propertyNote: string;
  utilitiesNote: string;
  internetNote: string;
  transportNote: string;
  groceriesNote: string;
  eatingOutNote: string;
  healthcareNote: string;
  childcareNote: string;
  educationNote: string;
  sportsNote: string;
  entertainmentNote: string;
  comparisonNote: string;
}

export interface BlogTable {
  title?: string;
  columns: string[];
  rows: string[][];
}

export interface BlogSection {
  id: string;
  title: string;
  paragraphs: string[];
  table?: BlogTable;
  note?: string;
}

export interface BlogFaqItem {
  question: string;
  answer: string;
}

export interface BlogQuickAnswer {
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: BlogCategorySlug;
  categoryLabel: string;
  countrySlug: string;
  countryName: string;
  cityName?: string;
  articleType: BlogArticleType;
  keyword: string;
  image: string;
  calculatorUrl: string;
  updatedAt: string;
  author: string;
  readingTime: string;
  heroEyebrow: string;
  heroSummary: string;
  heroHighlights: string[];
  templateStatus: BlogTemplateStatus;
  quickAnswers: BlogQuickAnswer[];
  quickFactsTable: BlogTable;
  sections: BlogSection[];
  faqItems: BlogFaqItem[];
  verdictTitle: string;
  verdictSummary: string;
  sources: string[];
  relatedSlugs: string[];
}
