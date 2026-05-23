import { DISCLAIMER, SITE_NAME } from "@/lib/site";

export function SiteFooter(): JSX.Element {
  return (
    <footer className="border-t border-ink/10 bg-white/65">
      <div className="shell flex flex-col gap-4 py-8 text-sm text-ink/68 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-ink">{SITE_NAME}</p>
          <p>{DISCLAIMER}</p>
        </div>
        <p>Tax rules live in editable JSON files so yearly updates stay auditable.</p>
      </div>
    </footer>
  );
}
