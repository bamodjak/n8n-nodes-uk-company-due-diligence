# AGENTS.md

n8n community node package `n8n-nodes-uk-company-due-diligence`, generated from Apify's
`n8n-nodes-apify-template` for the Apify Actor `rejoicing_shanty/uk-company-due-diligence`
(id `4xuPNm2xxJ8bEpV1k`). The one-shot generator (`scripts/`) was removed after generation.

- Node: `nodes/ApifyUkCompanyDueDiligence/` (properties mirror the Actor input schema).
- Credentials: `credentials/ApifyApi.credentials.ts` (end user's Apify API token) and
  `credentials/ApifyOAuth2Api.credentials.ts` (OAuth2, for n8n Cloud).
- Commands: `npm install`, `npm run build`, `npm run lint` (strict, n8n Cloud rules), `npm run dev`,
  `npm run release` (bump/tag/push; GitHub Actions `publish.yml` publishes with provenance).
- If the Actor input schema changes, update `ApifyUkCompanyDueDiligence.properties.ts` (both the
  property list and `buildActorInput`).
