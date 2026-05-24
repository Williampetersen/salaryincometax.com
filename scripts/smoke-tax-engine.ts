import { buildDefaultInput, getCountryRule } from "../lib/country-catalog";
import { calculateSalaryTax } from "../lib/tax-engine/calculate";

const countriesToCheck = [
  "australia",
  "belgium",
  "canada",
  "denmark",
  "france",
  "germany",
  "ireland",
  "italy",
  "japan",
  "luxembourg",
  "malta",
  "netherlands",
  "new-zealand",
  "norway",
  "singapore",
  "spain",
  "sweden",
  "united-kingdom",
  "united-states",
];

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

for (const slug of countriesToCheck) {
  const rule = getCountryRule(slug);

  if (!rule) {
    throw new Error(`Missing rules for ${slug}`);
  }

  const input = buildDefaultInput(rule);
  const result = calculateSalaryTax(input, rule);

  assert(result.annual.gross >= result.annual.net, `${slug}: net exceeds gross`);
  assert(result.annual.totalTax >= 0, `${slug}: total tax is negative`);
  assert(result.effectiveTaxRate >= 0, `${slug}: effective rate is negative`);
  assert(result.periodBreakdown.monthly.net > 0, `${slug}: monthly net is zero`);
  assert(["verified", "partial", "estimate"].includes(rule.coverageLevel), `${slug}: missing coverage level`);
  assert(Array.isArray(rule.incomeTaxCredits), `${slug}: income tax credits are missing`);

  console.log(
    `${slug}: gross=${result.annual.gross.toFixed(2)} net=${result.annual.net.toFixed(2)} rate=${(result.effectiveTaxRate * 100).toFixed(1)}%`,
  );
}

const irelandRule = getCountryRule("ireland");

if (!irelandRule) {
  throw new Error("Missing rules for Ireland smoke test");
}

const irelandResult = calculateSalaryTax(buildDefaultInput(irelandRule), irelandRule);
assert(
  irelandResult.annual.incomeTaxCredits > 0,
  "ireland: expected income tax credits to reduce tax",
);

const ukRule = getCountryRule("united-kingdom");

if (!ukRule) {
  throw new Error("Missing rules for UK smoke test");
}

const ukBaseInput = buildDefaultInput(ukRule);
const ukSingleResult = calculateSalaryTax(
  { ...ukBaseInput, amount: 60000, personalStatus: "single" },
  ukRule,
);
const ukMarriedResult = calculateSalaryTax(
  { ...ukBaseInput, amount: 60000, personalStatus: "married" },
  ukRule,
);

assert(
  ukSingleResult.annual.net === ukMarriedResult.annual.net,
  "united-kingdom: married status should not silently change tax without a specific allowance selection",
);

const reverseRule = getCountryRule("united-states");

if (!reverseRule) {
  throw new Error("Missing rules for reverse calculation smoke test");
}

const usHighIncomeResult = calculateSalaryTax(
  {
    ...buildDefaultInput(reverseRule),
    amount: 300000,
    personalStatus: "single",
  },
  reverseRule,
);

assert(
  usHighIncomeResult.socialSecurityLines.some((line) =>
    line.name.includes("Additional Medicare"),
  ),
  "united-states: expected Additional Medicare tax at high income",
);

const reverseResult = calculateSalaryTax(
  {
    ...buildDefaultInput(reverseRule),
    amount: 60000,
    reverseCalculation: true,
  },
  reverseRule,
);

assert(
  typeof reverseResult.reverseEstimatedGross === "number" &&
    reverseResult.reverseEstimatedGross >= 60000,
  "reverse calculation failed to estimate gross salary",
);

console.log(
  `reverse-us: targetNet=60000 estimatedGross=${reverseResult.reverseEstimatedGross?.toFixed(2)}`,
);
