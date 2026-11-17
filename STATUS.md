# Status – n8n-nodes-uk-company-due-diligence (2026-11-15)

- Generated with Apify's official template (github.com/apify/n8n-nodes-apify-template, `npm run create-actor-app`, Actor 4xuPNm2xxJ8bEpV1k).
- Upgraded to @n8n/node-cli 0.56.4 with strict (n8n Cloud) lint; added GitHub Actions publish.yml (provenance) from n8n-nodes-starter.
- `npm run build`, `npm run lint`, `npx tsc --noEmit` all pass (0 errors, 0 warnings).
- Smoke test against the live Actor (company name only) returned 1 item per company with apifyRun ref.
- npm name `n8n-nodes-uk-company-due-diligence` was free on 2026-11-15.
- NOT published. Placeholder left: `repository.url` GITHUB_USERNAME in package.json.
- Install deps with `npm install` on Node 24 (or `npm install --ignore-scripts` on Node 22: isolated-vm, pulled in by n8n-workflow, needs Node >= 24 to compile).
