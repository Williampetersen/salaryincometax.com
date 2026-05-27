import { BLOG_COUNTRIES } from "@/data/blog/countries";
import {
  CITY_COST_OF_LIVING_DATA,
  COUNTRY_COST_OF_LIVING_DATA,
} from "@/data/blog/costOfLivingData";
import { SALARY_DATA } from "@/data/blog/salaryData";

export interface CityAffordabilityHighlight {
  id: "cheapest" | "best-balance" | "hardest-family";
  title: string;
  cityName: string;
  monthlyBudget: number;
  rent: number;
  monthlyNet: number;
  note: string;
}

export interface CalculatorExperienceData {
  budgetDefaults: {
    single: number;
    couple: number;
    family: number;
    comfortable: number;
    averageNet: number;
    rent: number;
    groceries: number;
    transport: number;
    utilities: number;
    childcare: number;
    healthcare: number;
    entertainment: number;
    savingsTarget: number;
  };
  cityHighlights: CityAffordabilityHighlight[];
}

function roundBudget(value: number): number {
  return Math.round(value / 10) * 10;
}

export function getCalculatorExperienceData(
  countrySlug: string,
): CalculatorExperienceData {
  const countryData = COUNTRY_COST_OF_LIVING_DATA[countrySlug];
  const salaryData = SALARY_DATA[countrySlug];
  const countryDefinition = BLOG_COUNTRIES.find((country) => country.slug === countrySlug);
  const cityEntries =
    countryDefinition?.cities
      .filter((city) => city.slug !== countrySlug)
      .map((city) => CITY_COST_OF_LIVING_DATA[`${countrySlug}/${city.slug}`])
      .filter(Boolean) ?? [];

  const savingsTarget = roundBudget(
    Math.max(
      countryData.comfortableNetMonthly - countryData.singlePersonMonthly,
      salaryData.averageNetMonthly * 0.12,
    ),
  );

  const cityHighlights: CityAffordabilityHighlight[] =
    cityEntries.length > 0
      ? [
          {
            id: "cheapest",
            title: "Cheapest major city",
            cityName:
              [...cityEntries].sort(
                (left, right) => left.singlePersonMonthly - right.singlePersonMonthly,
              )[0]?.cityName ?? countryData.comparisonTargets[0] ?? "Country baseline",
            monthlyBudget:
              [...cityEntries].sort(
                (left, right) => left.singlePersonMonthly - right.singlePersonMonthly,
              )[0]?.singlePersonMonthly ?? countryData.singlePersonMonthly,
            rent:
              [...cityEntries].sort(
                (left, right) => left.singlePersonMonthly - right.singlePersonMonthly,
              )[0]?.rentOneBedroom ?? countryData.rentOneBedroom,
            monthlyNet:
              [...cityEntries].sort(
                (left, right) => left.singlePersonMonthly - right.singlePersonMonthly,
              )[0]?.averageNetMonthly ?? countryData.averageNetMonthly,
            note: "Lower single-person monthly budget than the other tracked cities in this country dataset.",
          },
          {
            id: "best-balance",
            title: "Best salary / rent balance",
            cityName:
              [...cityEntries].sort(
                (left, right) =>
                  right.averageNetMonthly - right.rentOneBedroom -
                  (left.averageNetMonthly - left.rentOneBedroom),
              )[0]?.cityName ?? countryData.comparisonTargets[0] ?? "Country baseline",
            monthlyBudget:
              [...cityEntries].sort(
                (left, right) =>
                  right.averageNetMonthly - right.rentOneBedroom -
                  (left.averageNetMonthly - left.rentOneBedroom),
              )[0]?.singlePersonMonthly ?? countryData.singlePersonMonthly,
            rent:
              [...cityEntries].sort(
                (left, right) =>
                  right.averageNetMonthly - right.rentOneBedroom -
                  (left.averageNetMonthly - left.rentOneBedroom),
              )[0]?.rentOneBedroom ?? countryData.rentOneBedroom,
            monthlyNet:
              [...cityEntries].sort(
                (left, right) =>
                  right.averageNetMonthly - right.rentOneBedroom -
                  (left.averageNetMonthly - left.rentOneBedroom),
              )[0]?.averageNetMonthly ?? countryData.averageNetMonthly,
            note: "Strongest remaining monthly margin after headline rent in the tracked city set.",
          },
          {
            id: "hardest-family",
            title: "Hardest city for families",
            cityName:
              [...cityEntries].sort(
                (left, right) => right.familyMonthly - left.familyMonthly,
              )[0]?.cityName ?? countryData.comparisonTargets[0] ?? "Country baseline",
            monthlyBudget:
              [...cityEntries].sort(
                (left, right) => right.familyMonthly - left.familyMonthly,
              )[0]?.familyMonthly ?? countryData.familyMonthly,
            rent:
              [...cityEntries].sort(
                (left, right) => right.familyMonthly - left.familyMonthly,
              )[0]?.rentFamilyHome ?? countryData.rentFamilyHome,
            monthlyNet:
              [...cityEntries].sort(
                (left, right) => right.familyMonthly - left.familyMonthly,
              )[0]?.averageNetMonthly ?? countryData.averageNetMonthly,
            note: "Highest family-budget pressure once larger housing and childcare are included.",
          },
        ]
      : [
          {
            id: "cheapest",
            title: "Cheapest major city",
            cityName: "Country-wide benchmark",
            monthlyBudget: countryData.singlePersonMonthly,
            rent: countryData.rentOneBedroom,
            monthlyNet: countryData.averageNetMonthly,
            note: "City-level cost tracking is not published for this country yet, so this card uses the national benchmark.",
          },
          {
            id: "best-balance",
            title: "Best salary / rent balance",
            cityName: "Country-wide benchmark",
            monthlyBudget: countryData.singlePersonMonthly,
            rent: countryData.rentOneBedroom,
            monthlyNet: countryData.averageNetMonthly,
            note: "Use the national benchmark as a planning reference until city-by-city salary and rent data is expanded.",
          },
          {
            id: "hardest-family",
            title: "Hardest city for families",
            cityName: "Country-wide benchmark",
            monthlyBudget: countryData.familyMonthly,
            rent: countryData.rentFamilyHome,
            monthlyNet: countryData.averageNetMonthly,
            note: "Family pressure is estimated from the current national cost baseline because city-level family data is not yet published.",
          },
        ];

  return {
    budgetDefaults: {
      single: countryData.singlePersonMonthly,
      couple: countryData.coupleMonthly,
      family: countryData.familyMonthly,
      comfortable: countryData.comfortableNetMonthly,
      averageNet: countryData.averageNetMonthly,
      rent: countryData.rentOneBedroom,
      groceries: countryData.groceries,
      transport: countryData.transportPass,
      utilities: countryData.utilities,
      childcare: countryData.childcare,
      healthcare: countryData.healthcare,
      entertainment: countryData.entertainment,
      savingsTarget,
    },
    cityHighlights,
  };
}
