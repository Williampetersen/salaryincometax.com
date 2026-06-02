function splitConfiguredUrls(value: string | undefined): string[] {
  return (value ?? "")
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function uniqueHttpsUrls(values: string[]): string[] {
  return Array.from(new Set(values)).filter(isHttpsUrl);
}

export const GOOGLE_CERTIFIED_CMP_SCRIPT_SRC =
  process.env.NEXT_PUBLIC_GOOGLE_CERTIFIED_CMP_SCRIPT_SRC?.trim() ||
  process.env.GOOGLE_CERTIFIED_CMP_SCRIPT_SRC?.trim() ||
  "";

export const GOOGLE_CERTIFIED_CMP_ACTIVE =
  /^(1|true|yes)$/i.test(
    process.env.NEXT_PUBLIC_GOOGLE_CERTIFIED_CMP_ACTIVE?.trim() ||
      process.env.GOOGLE_CERTIFIED_CMP_ACTIVE?.trim() ||
      "",
  ) || Boolean(GOOGLE_CERTIFIED_CMP_SCRIPT_SRC);

export const ADDITIONAL_HEAD_SCRIPT_URLS = uniqueHttpsUrls(
  splitConfiguredUrls(process.env.ADDITIONAL_HEAD_SCRIPT_URLS).concat(
    splitConfiguredUrls(process.env.NEXT_PUBLIC_ADDITIONAL_HEAD_SCRIPT_URLS),
  ),
);
