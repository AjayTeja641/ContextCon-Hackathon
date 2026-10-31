# Development status — 31 October 2026

## Implemented / present in source
- Dashboard and investigation workspace, founder/company/document/relationship tabs, reports, staged orchestrator and synthetic demo
- Restored package.json, tsconfig, PostCSS, environment example, gitignore
- Fixed Crustdata company enrichment request to use documented `domains`/`names`, fields, and `matches[].company_data`
- Fixed Crustdata posts endpoint and payload field; aligned people enrichment normalization to its `matches[].person_data` response
- Removed made-up firmographic defaults and unverifiable founder work history from API-fallback views
- Relabeled non-official evidence/graph associations and removed anonymous Supabase all-access policies from SQL
- Synchronous real investigation execution, avoiding unawaited serverless background work

## Verified tests
- `tsc --noEmit`: PASS on unpacked dependencies from uploaded source archive
- `next build`: BLOCKED by missing Linux SWC native binary and no network access to registry.npmjs.org. Build success NOT claimed.

## Unfinished / blockers
- No API keys were provided, so **no live Crustdata or Gemini request was run or verified**.
- Supabase Auth, server-side persistence, private storage upload/read endpoints, and owner authorization checks are NOT fully implemented; currently store is in memory.
- Real document upload is not ready for sensitive supplier data; require signed authenticated storage and provider privacy review before enabling.
- Add Zod parsing of all Gemini responses, adversarial prompt-injection tests, provider credit/rate-limit handling, source freshness checks, and error/status visibility for every stage.
- Add official company/registry verification only if an authorized source is integrated.
- Deployment to Vercel not attempted because external account authorization is unavailable.

## API / credential status
- Crustdata: documented endpoints wired, live access unverified; requires `CRUSTDATA_API_KEY`.
- Gemini: existing SDK client wired, live access unverified; requires `GEMINI_API_KEY`.
- Supabase: schema only, runtime integration pending.
- Vercel: deployment not configured.

## Immediate next actions
1. Install dependencies on a machine with npm registry access; run `npm run build` and `npm run dev`.
2. Exercise company / person / posts calls with test company data; check account entitlement and API credits.
3. Connect Supabase Auth, storage and persistent investigation records before handling private user data.
4. Run full nine-stage investigation, validate JSON output, run security checks, deploy and verify.
