import { TAX_RULES } from "@/data/tax-rules";
import { calculateSalaryTax } from "@/lib/tax-engine/calculate";
import { buildDefaultInput } from "@/lib/country-catalog";
import type { SalaryGuideData } from "@/data/blog/types";

const SALARY_OVERRIDES: Record<
  string,
  {
    comfortableNetSingle: number;
    comfortableNetFamily: number;
    minimumWageHourly?: number | null;
    minimumWageMonthly?: number | null;
    minimumWageAnnual?: number | null;
  }
> = {
  australia: {
    comfortableNetSingle: 4600,
    comfortableNetFamily: 8200,
    minimumWageHourly: 24,
    minimumWageMonthly: 3952,
    minimumWageAnnual: 47424,
  },
  belgium: {
    comfortableNetSingle: 2500,
    comfortableNetFamily: 4800,
    minimumWageHourly: 13.6,
    minimumWageMonthly: 2362,
    minimumWageAnnual: 28350,
  },
  canada: {
    comfortableNetSingle: 3400,
    comfortableNetFamily: 6200,
    minimumWageHourly: 18.15,
    minimumWageMonthly: 3146,
    minimumWageAnnual: 37752,
  },
  denmark: {
    comfortableNetSingle: 24500,
    comfortableNetFamily: 47000,
    minimumWageHourly: null,
    minimumWageMonthly: null,
    minimumWageAnnual: 290000,
  },
  france: {
    comfortableNetSingle: 2200,
    comfortableNetFamily: 4300,
    minimumWageHourly: 11.88,
    minimumWageMonthly: 1783,
    minimumWageAnnual: 21400,
  },
  germany: {
    comfortableNetSingle: 2400,
    comfortableNetFamily: 4600,
    minimumWageHourly: 12.82,
    minimumWageMonthly: 2166,
    minimumWageAnnual: 25990,
  },
  ireland: {
    comfortableNetSingle: 2800,
    comfortableNetFamily: 5400,
    minimumWageHourly: 14.15,
    minimumWageMonthly: 2452,
    minimumWageAnnual: 29424,
  },
  italy: {
    comfortableNetSingle: 2000,
    comfortableNetFamily: 4000,
    minimumWageAnnual: 22300,
  },
  japan: {
    comfortableNetSingle: 310000,
    comfortableNetFamily: 540000,
    minimumWageAnnual: 2118000,
  },
  luxembourg: {
    comfortableNetSingle: 3200,
    comfortableNetFamily: 5900,
    minimumWageAnnual: 33600,
  },
  malta: {
    comfortableNetSingle: 1700,
    comfortableNetFamily: 3200,
    minimumWageAnnual: 21400,
  },
  netherlands: {
    comfortableNetSingle: 2600,
    comfortableNetFamily: 5000,
    minimumWageAnnual: 29200,
  },
  "new-zealand": {
    comfortableNetSingle: 4000,
    comfortableNetFamily: 7200,
    minimumWageAnnual: 48152,
  },
  norway: {
    comfortableNetSingle: 32000,
    comfortableNetFamily: 60000,
    minimumWageAnnual: 320000,
  },
  singapore: {
    comfortableNetSingle: 3800,
    comfortableNetFamily: 7000,
    minimumWageAnnual: 24000,
  },
  spain: {
    comfortableNetSingle: 1900,
    comfortableNetFamily: 3700,
    minimumWageAnnual: 18400,
  },
  sweden: {
    comfortableNetSingle: 24000,
    comfortableNetFamily: 45000,
    minimumWageAnnual: 290000,
  },
  "united-kingdom": {
    comfortableNetSingle: 2400,
    comfortableNetFamily: 4700,
    minimumWageHourly: 12.21,
    minimumWageMonthly: 1982,
    minimumWageAnnual: 23830,
  },
  "united-states": {
    comfortableNetSingle: 4200,
    comfortableNetFamily: 7600,
    minimumWageHourly: 7.25,
    minimumWageMonthly: 1257,
    minimumWageAnnual: 15080,
  },
};

export const SALARY_DATA: Record<string, SalaryGuideData> = Object.entries(TAX_RULES)
  .reduce<Record<string, SalaryGuideData>>((accumulator, [slug, yearMap]) => {
    const latestYear = Math.max(...Object.keys(yearMap).map(Number));
    const rule = yearMap[latestYear];
    const defaultInput = buildDefaultInput(rule);
    const result = calculateSalaryTax(defaultInput, rule);
    const overrides = SALARY_OVERRIDES[slug];

    accumulator[slug] = {
      averageGrossAnnual: rule.medianSalary,
      averageNetAnnual: result.annual.net,
      averageNetMonthly: result.periodBreakdown.monthly.net,
      comfortableNetSingle: overrides?.comfortableNetSingle ?? result.periodBreakdown.monthly.net * 0.95,
      comfortableNetFamily: overrides?.comfortableNetFamily ?? result.periodBreakdown.monthly.net * 1.75,
      minimumWageHourly: overrides?.minimumWageHourly ?? null,
      minimumWageMonthly:
        overrides?.minimumWageMonthly ?? rule.minimumWage / rule.defaults.paidMonthsPerYear,
      minimumWageAnnual: overrides?.minimumWageAnnual ?? rule.minimumWage,
      updatedAt: `${latestYear}-01-01`,
      sources: rule.source,
    };

    return accumulator;
  }, {});
