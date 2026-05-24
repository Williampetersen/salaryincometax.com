import { TAX_RULES } from "@/data/tax-rules";
import type {
  BlogCategoryDefinition,
  BlogCityDefinition,
  BlogCountryDefinition,
} from "@/data/blog/types";

const COUNTRY_CITY_MAP: Record<
  string,
  Array<{
    slug: string;
    name: string;
  }>
> = {
  australia: [
    { slug: "sydney", name: "Sydney" },
    { slug: "melbourne", name: "Melbourne" },
  ],
  canada: [
    { slug: "toronto", name: "Toronto" },
    { slug: "vancouver", name: "Vancouver" },
    { slug: "montreal", name: "Montreal" },
  ],
  france: [
    { slug: "paris", name: "Paris" },
    { slug: "lyon", name: "Lyon" },
  ],
  germany: [
    { slug: "berlin", name: "Berlin" },
    { slug: "munich", name: "Munich" },
    { slug: "hamburg", name: "Hamburg" },
  ],
  ireland: [
    { slug: "dublin", name: "Dublin" },
    { slug: "cork", name: "Cork" },
  ],
  japan: [
    { slug: "tokyo", name: "Tokyo" },
    { slug: "osaka", name: "Osaka" },
  ],
  netherlands: [
    { slug: "amsterdam", name: "Amsterdam" },
    { slug: "rotterdam", name: "Rotterdam" },
  ],
  singapore: [{ slug: "singapore", name: "Singapore" }],
  spain: [
    { slug: "madrid", name: "Madrid" },
    { slug: "barcelona", name: "Barcelona" },
  ],
  "united-kingdom": [
    { slug: "london", name: "London" },
    { slug: "manchester", name: "Manchester" },
    { slug: "birmingham", name: "Birmingham" },
  ],
  "united-states": [
    { slug: "new-york", name: "New York" },
    { slug: "chicago", name: "Chicago" },
    { slug: "los-angeles", name: "Los Angeles" },
    { slug: "miami", name: "Miami" },
    { slug: "san-francisco", name: "San Francisco" },
  ],
};

export const BLOG_CATEGORIES: BlogCategoryDefinition[] = [
  {
    slug: "cost-of-living",
    name: "Cost of Living",
    description:
      "Country and city guides covering rent, utilities, groceries, transport, and the salary needed to live comfortably.",
  },
  {
    slug: "income-tax",
    name: "Income Tax",
    description:
      "Guides explaining how salary tax, social contributions, allowances, and take-home pay work in each market.",
  },
  {
    slug: "minimum-wage",
    name: "Minimum Wage",
    description:
      "Minimum wage explainers with monthly and annual equivalents, after-tax context, and affordability commentary.",
  },
  {
    slug: "salary-guides",
    name: "Salary Guides",
    description:
      "Average salary, gross-versus-net, and best-city comparison articles for job seekers and relocation planning.",
  },
];

function buildCityDefinitions(
  countrySlug: string,
  countryName: string,
): BlogCityDefinition[] {
  return (COUNTRY_CITY_MAP[countrySlug] ?? []).map((city) => ({
    ...city,
    countrySlug,
    countryName,
    image: `/blog/cost-of-living-in-${city.slug}.jpg`,
  }));
}

export const BLOG_COUNTRIES: BlogCountryDefinition[] = Object.entries(TAX_RULES)
  .map(([slug, yearMap]) => {
    const latestYear = Math.max(...Object.keys(yearMap).map(Number));
    const rule = yearMap[latestYear];

    return {
      slug,
      name: rule.countryName,
      currency: rule.currency,
      region: rule.region,
      calculatorUrl: `/salary-calculator/${slug}`,
      flagSrc:
        slug === "australia"
          ? "/flag/Flag_of_Australia.svg"
          : slug === "belgium"
            ? "/flag/Flag_of_Belgium.svg.png"
            : slug === "canada"
              ? "/flag/Flag_of_Canada.png"
              : slug === "denmark"
                ? "/flag/Flag_of_Denmark.svg.webp"
                : slug === "france"
                  ? "/flag/Flag_of_France.png"
                  : slug === "germany"
                    ? "/flag/Flag_of_Germany.svg.png"
                    : slug === "ireland"
                      ? "/flag/Flag_of_Ireland.svg.png"
                      : slug === "italy"
                        ? "/flag/Flag_of_Italy.svg"
                        : slug === "japan"
                          ? "/flag/Flag_of_Japan.svg.png"
                          : slug === "luxembourg"
                            ? "/flag/Flag_of_Luxembourg.svg.webp"
                            : slug === "malta"
                              ? "/flag/Flag_of_Malta.svg.png"
                              : slug === "netherlands"
                                ? "/flag/Flag_of_the_Netherlands.png"
                                : slug === "new-zealand"
                                  ? "/flag/Flag_of_New_Zealand.svg"
                                  : slug === "norway"
                                    ? "/flag/Flag_of_Norway.png"
                                    : slug === "singapore"
                                      ? "/flag/Flag_of_Singapore.svg.png"
                                      : slug === "spain"
                                        ? "/flag/Flag_of_Spain.svg.png"
                                        : slug === "sweden"
                                          ? "/flag/Flag_of_Sweden.svg.png"
                                          : slug === "united-kingdom"
                                            ? "/flag/Flag_of_the_United_Kingdom.svg"
                                            : slug === "united-states"
                                              ? "/flag/Flag_of_the_United_States.svg.png"
                                              : undefined,
      image: `/blog/${slug}-guide.jpg`,
      cities: buildCityDefinitions(slug, rule.countryName),
    };
  })
  .sort((left, right) => left.name.localeCompare(right.name));

export function getBlogCountry(slug: string): BlogCountryDefinition | undefined {
  return BLOG_COUNTRIES.find((country) => country.slug === slug);
}
