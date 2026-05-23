import { buildDefaultInput, getCountryRule } from "../lib/country-catalog";
import { calculateSalaryTax } from "../lib/tax-engine/calculate";

const countriesToCheck = [
  "france",
  "belgium",
  "germany",
  "denmark",
  "united-kingdom",
  "united-states",
  "canada",
  "australia",
  "japan",
  "singapore",
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

  console.log(
    `${slug}: gross=${result.annual.gross.toFixed(2)} net=${result.annual.net.toFixed(2)} rate=${(result.effectiveTaxRate * 100).toFixed(1)}%`,
  );
}

const reverseRule = getCountryRule("united-states");

if (!reverseRule) {
  throw new Error("Missing rules for reverse calculation smoke test");
}

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
