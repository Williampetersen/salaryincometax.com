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

## Contact form SMTP setup

The contact form is sent server-side through Simply.com SMTP. Add these values in `.env.local` for local development and in your Vercel project environment variables for production:

- `SMTP_HOST=smtp.simply.com`
- `SMTP_PORT=587`
- `SMTP_USER=support@salaryincometax.com`
- `SMTP_PASSWORD=your_email_password_here`
- `MAIL_FROM=support@salaryincometax.com`
- `MAIL_TO=support@salaryincometax.com`

The backend uses STARTTLS on port `587`, keeps `support@salaryincometax.com` as the sender address, and sets the visitor's email as `Reply-To`.

### Vercel deployment steps

The live `503` error means the serverless function cannot read one or more required SMTP variables at runtime. Vercel does not read your local `.env.local` file, so you must add the same variables in the Vercel dashboard:

1. Open the Vercel project for `salaryincometax.com`.
2. Go to `Settings`.
3. Open `Environment Variables`.
4. Add each variable below for the `Production` environment:
   - `SMTP_HOST=smtp.simply.com`
   - `SMTP_PORT=587`
   - `SMTP_USER=support@salaryincometax.com`
   - `SMTP_PASSWORD=your real Simply.com mailbox password`
   - `MAIL_FROM=support@salaryincometax.com`
   - `MAIL_TO=support@salaryincometax.com`
5. Save the variables.
6. Redeploy the latest production deployment.

If one or more variables are missing, the contact API logs the missing key names server-side and returns HTTP `503` with a clean JSON error to the browser.

To test the SMTP connection locally, run:

- `corepack pnpm check:smtp`

To test the full contact form locally:

1. Start the dev server with `corepack pnpm dev`.
2. Open `/contact`.
3. Submit the form with a real email address.
4. Confirm the message arrives at `support@salaryincometax.com`.

## Google Analytics deployment

The Google tag is emitted from the root App Router layout and must be available at build time through `NEXT_PUBLIC_GA_ID`.

For Vercel production:

1. Open the `salaryincometax.com` project in Vercel.
2. Go to `Settings`.
3. Open `Environment Variables`.
4. Add `NEXT_PUBLIC_GA_ID=G-JKSYLWLEVD` to the `Production` environment.
5. Save the variable.
6. Redeploy the latest production deployment.

The production build now fails intentionally if `NEXT_PUBLIC_GA_ID` is missing, so the site cannot silently deploy without the Google tag.
