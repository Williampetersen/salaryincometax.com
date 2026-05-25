import { SITE_URL } from "@/lib/site";

const DEFAULT_ADSENSE_ADS_TXT =
  "google.com, pub-6566909288019503, DIRECT, f08c47fec0942fa0";

function buildAdsTxt(): string {
  const configuredValue = process.env.ADSENSE_ADS_TXT?.trim();

  if (configuredValue) {
    return configuredValue.endsWith("\n") ? configuredValue : `${configuredValue}\n`;
  }

  return `${DEFAULT_ADSENSE_ADS_TXT}\n`;
}

export async function GET(): Promise<Response> {
  return new Response(buildAdsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
