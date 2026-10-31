# Supplier Reality AI — Hackathon MVP

Supplier investigation workspace using Next.js, Crustdata, and Gemini. The supplied fictional Apex record is **DEMO DATA** and must never be mistaken for a real investigation.

## Architecture

- **Next.js 16 App Router / React 19**: dashboard, intake, investigation workspace, company/founder/document tabs, React Flow relationship graph, findings, print-ready report.
- **Server-side modules**: `src/server/agents` contains the nine-stage orchestrator and specialized company, founder, document, relationship agents. `src/server/evidence` contains evidence tracking.
- **Crustdata**: company enrichment (`POST /company/enrich`), people enrichment (`POST /person/enrich`), and professional-network posts search (`POST /social_post/professional_network/search/live`), invoked on the server. Enrichment is *third-party reported*, not official registry verification. Social-post search may require additional account entitlement and consume credits.
- **Gemini**: official `@google/genai` SDK with configurable `GEMINI_MODEL`. Model output is not authoritative evidence.
- **Supabase**: `supabase/schema.sql` contains the proposed database tables and owner-based RLS policies. **Application persistence/auth integration is not yet connected.** Sessions are in-memory and are not reliable under Vercel/serverless.

## Local start

Requires Node.js 20.9+ (Node.js 22 recommended).

```bash
npm install
cp .env.example .env.local
npm run dev
```

Visit `http://localhost:3000`. Open the existing synthetic demo to explore all four modules without API credentials. For a real investigation configure `CRUSTDATA_API_KEY` and `GEMINI_API_KEY` in `.env.local`; real APIs consume provider credits or quota. Do not paste secret keys into client-side fields or commit `.env.local`.

## Important safety/coverage constraints

1. The demo is synthetic. A real API outage or missing data must remain explicitly unverified, not be substituted with demo data.
2. This app does **not** verify GSTIN, CIN, legal standing, directorship, sanctions, or document authenticity against a government registry. A third-party professional profile does not prove that two similarly named people are identical.
3. **Do not upload confidential supplier documents.** A complete per-user authentication, private Supabase file-storage lifecycle, authorization check, and retention controls still need to be implemented.
4. The live creation path uses an in-memory store; data can disappear after a process restart. Before production deployment, wire `src/server/store.ts` to authenticated Supabase records and confirm storage policies.
5. Source URL fields indicate the original public source where available; the Crustdata dataset itself may not supply a public source URL.

## Source files

- `src/app` routes, screens, APIs
- `src/lib/crustdata/client.ts` provider client, normalized company and person data
- `src/lib/gemini/client.ts` AI client
- `src/server/agents` orchestration and intelligence modules
- `src/components` dashboard UI modules
- `src/lib/demo-data` preloaded synthetic dataset
- `supabase/schema.sql` proposed SQL schema and RLS
- `DEVELOPMENT_STATUS.md` current status and outstanding work
- `HACKATHON_DEMO.md` short walkthrough

## Four-member division

Product/integration lead: coordinate repository, test end-to-end, deploy; frontend engineer: screens and responsive design; data engineer: Crustdata requests and normalization; AI engineer: Gemini, evidence validation, document analysis and graph. Assign distinct file owners.

## Deployment

After installing dependencies and testing locally, deploy to Vercel with environment variables set server-side. **No live URL or end-to-end API run is claimed here.** This delivery is a source-code improvement, not a verified deployed product.

Official documentation checked: https://crustdata.com/company-data-api , https://crustdata.com/people-api , https://crustdata.com/blog/subject-matter-experts-social-post-signals , https://ai.google.dev/gemini-api/docs/structured-output
