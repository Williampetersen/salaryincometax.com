import { getAllCountries } from "@/lib/country-catalog";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export async function GET(): Promise<Response> {
  const countries = getAllCountries();

  const body = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "This site provides country-specific salary after tax calculators with editable tax-year JSON rules.",
    "Use the country calculator pages for gross-to-net estimates, net-to-gross estimates, and tax breakdowns.",
    "",
    "## Primary pages",
    `- [Homepage](${SITE_URL})`,
    `- [All salary calculators](${SITE_URL}/salary-calculator)`,
    "",
    "## Country calculators",
    ...countries.map(
      (country) =>
        `- [${country.name} salary calculator](${SITE_URL}/salary-calculator/${country.slug})`,
    ),
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
