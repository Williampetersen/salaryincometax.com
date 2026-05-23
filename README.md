# salaryincometax.com

Global salary income tax calculator built with Next.js App Router, TypeScript, Tailwind CSS, a reusable tax engine, and editable country-year JSON tax rules.

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- API route for calculations
- JSON tax rules per country and tax year

## Scripts

- `corepack pnpm dev`
- `corepack pnpm lint`
- `corepack pnpm typecheck`
- `corepack pnpm build`
- `corepack pnpm check:tax`

## Project structure

- `app/`
  App Router pages, metadata routes, and the calculation API.
- `components/`
  Homepage, calculator, charts, and layout components.
- `lib/tax-engine/`
  Shared calculation logic, helpers, and types.
- `data/tax-rules/`
  Editable country-year JSON files plus the registry.
- `scripts/smoke-tax-engine.ts`
  Lightweight calculation verification across several countries.

## Updating tax data

1. Copy the prior year's JSON file in `data/tax-rules/`.
2. Rename it to the new year, for example `france-2027.json`.
3. Update `taxYear`, brackets, deductions, allowances, social rules, benchmarks, notes, and source links.
4. Register the new file in `data/tax-rules/index.ts`.
5. Run:
   - `corepack pnpm check:tax`
   - `corepack pnpm lint`
   - `corepack pnpm typecheck`
   - `corepack pnpm build`

## Notes

- Eight requested markets ship with fuller baseline models: France, Belgium, Germany, Denmark, United Kingdom, United States, Canada, and Australia.
- Remaining countries are intentionally marked as `example` in their JSON to make update status explicit in the UI.
- The site displays this disclaimer in the UI: `This calculator provides an estimate only and should not be considered financial, tax, or legal advice.`
