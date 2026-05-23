import australia2026 from "@/data/tax-rules/australia-2026.json";
import belgium2026 from "@/data/tax-rules/belgium-2026.json";
import canada2026 from "@/data/tax-rules/canada-2026.json";
import denmark2026 from "@/data/tax-rules/denmark-2026.json";
import france2026 from "@/data/tax-rules/france-2026.json";
import germany2026 from "@/data/tax-rules/germany-2026.json";
import ireland2026 from "@/data/tax-rules/ireland-2026.json";
import italy2026 from "@/data/tax-rules/italy-2026.json";
import japan2026 from "@/data/tax-rules/japan-2026.json";
import luxembourg2026 from "@/data/tax-rules/luxembourg-2026.json";
import malta2026 from "@/data/tax-rules/malta-2026.json";
import netherlands2026 from "@/data/tax-rules/netherlands-2026.json";
import newZealand2026 from "@/data/tax-rules/new-zealand-2026.json";
import norway2026 from "@/data/tax-rules/norway-2026.json";
import singapore2026 from "@/data/tax-rules/singapore-2026.json";
import spain2026 from "@/data/tax-rules/spain-2026.json";
import sweden2026 from "@/data/tax-rules/sweden-2026.json";
import unitedKingdom2026 from "@/data/tax-rules/united-kingdom-2026.json";
import unitedStates2026 from "@/data/tax-rules/united-states-2026.json";
import type { CountryTaxRule } from "@/lib/tax-engine/types";

// To add a new country or year:
// 1. Create a new JSON file in this directory using the existing schema.
// 2. Import it here.
// 3. Register it under the correct country slug and tax year.
export const TAX_RULES: Record<string, Record<number, CountryTaxRule>> = {
  australia: { 2026: australia2026 as CountryTaxRule },
  belgium: { 2026: belgium2026 as CountryTaxRule },
  canada: { 2026: canada2026 as CountryTaxRule },
  denmark: { 2026: denmark2026 as CountryTaxRule },
  france: { 2026: france2026 as CountryTaxRule },
  germany: { 2026: germany2026 as CountryTaxRule },
  ireland: { 2026: ireland2026 as CountryTaxRule },
  italy: { 2026: italy2026 as CountryTaxRule },
  japan: { 2026: japan2026 as CountryTaxRule },
  luxembourg: { 2026: luxembourg2026 as CountryTaxRule },
  malta: { 2026: malta2026 as CountryTaxRule },
  netherlands: { 2026: netherlands2026 as CountryTaxRule },
  "new-zealand": { 2026: newZealand2026 as CountryTaxRule },
  norway: { 2026: norway2026 as CountryTaxRule },
  singapore: { 2026: singapore2026 as CountryTaxRule },
  spain: { 2026: spain2026 as CountryTaxRule },
  sweden: { 2026: sweden2026 as CountryTaxRule },
  "united-kingdom": { 2026: unitedKingdom2026 as CountryTaxRule },
  "united-states": { 2026: unitedStates2026 as CountryTaxRule },
};
