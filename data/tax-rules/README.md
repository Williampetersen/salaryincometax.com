# Tax Rule Data

Each file in this folder is a single country and tax year in JSON format.

## Add a new country

1. Copy an existing JSON file and rename it to `country-slug-2026.json`.
2. Update `slug`, `countryName`, `region`, `currency`, rates, defaults, and notes.
3. Import and register the file in `data/tax-rules/index.ts`.

## Add a new tax year

1. Copy the previous year's JSON file.
2. Update `taxYear` and all tax values.
3. Register the new year under the same country slug in `data/tax-rules/index.ts`.

## Notes

- `implementationStatus: "complete"` means the file includes a fuller model for the market, but it is still an estimate and should be reviewed yearly.
- `implementationStatus: "example"` means the market is intentionally simplified and needs local validation before production use.
