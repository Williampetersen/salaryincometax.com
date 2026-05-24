import { SITE_URL } from "@/lib/site";

function buildAdsTxt(): string {
  const configuredValue = process.env.ADSENSE_ADS_TXT?.trim();

  if (configuredValue) {
    return configuredValue.endsWith("\n") ? configuredValue : `${configuredValue}\n`;
  }

  return [
    "# salaryincometax.com ads.txt",
    "# Add your real Google AdSense publisher line after approval.",
    "# Example format:",
    "# google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0",
    `# Site: ${SITE_URL}`,
    "",
  ].join("\n");
}

export async function GET(): Promise<Response> {
  return new Response(buildAdsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
