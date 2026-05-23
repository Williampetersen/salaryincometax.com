import { NextResponse } from "next/server";

import { getCountryRule } from "@/lib/country-catalog";
import { calculateSalaryTax } from "@/lib/tax-engine/calculate";
import type { CalculationInput } from "@/lib/tax-engine/types";

function parseNumber(value: unknown, fallback = 0): number {
  const numericValue =
    typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;

  return Number.isFinite(numericValue) ? numericValue : fallback;
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as Partial<CalculationInput>;

  if (!body.country || typeof body.country !== "string") {
    return NextResponse.json({ error: "A valid country slug is required." }, { status: 400 });
  }

  const rule = getCountryRule(body.country, parseNumber(body.taxYear));

  if (!rule) {
    return NextResponse.json({ error: "Tax rules for that country were not found." }, { status: 404 });
  }

  const input: CalculationInput = {
    country: rule.slug,
    taxYear: parseNumber(body.taxYear, rule.taxYear),
    amount: parseNumber(body.amount),
    currency: typeof body.currency === "string" ? body.currency : rule.currency,
    salaryPeriod:
      body.salaryPeriod && ["yearly", "monthly", "weekly", "daily", "hourly"].includes(body.salaryPeriod)
        ? body.salaryPeriod
        : "yearly",
    paidMonthsPerYear: parseNumber(body.paidMonthsPerYear, rule.defaults.paidMonthsPerYear),
    paidWeeksPerYear: parseNumber(body.paidWeeksPerYear, rule.defaults.paidWeeksPerYear),
    workingDaysPerWeek: parseNumber(body.workingDaysPerWeek, rule.defaults.workingDaysPerWeek),
    workingHoursPerWeek: parseNumber(body.workingHoursPerWeek, rule.defaults.workingHoursPerWeek),
    extraIncome: parseNumber(body.extraIncome),
    personalStatus:
      typeof body.personalStatus === "string"
        ? body.personalStatus
        : rule.personalStatuses[0]?.key ?? "single",
    numberOfChildren: parseNumber(body.numberOfChildren),
    reverseCalculation: Boolean(body.reverseCalculation),
    description: typeof body.description === "string" ? body.description : "",
  };

  return NextResponse.json(calculateSalaryTax(input, rule));
}
