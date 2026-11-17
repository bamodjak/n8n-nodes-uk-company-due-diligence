# n8n-nodes-uk-company-due-diligence

This is an n8n community node. It lets you run a full **UK company due-diligence check** from your n8n workflows: Companies House profile, directors and secretaries (officers), persons with significant control (PSC / beneficial owners), registered charges, ready-made risk flags and parsed iXBRL financial figures.

It runs the Apify Actor [UK Company Due Diligence](https://apify.com/rejoicing_shanty/uk-company-due-diligence) on your own Apify account and returns **one n8n item per company**.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

- [Installation](#installation)
- [Operations](#operations)
- [Credentials](#credentials)
- [Compatibility](#compatibility)
- [Usage](#usage)
- [Resources](#resources)
- [Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation and install the package `n8n-nodes-uk-company-due-diligence`.

## Operations

**Check UK companies** – for each company number or company name you enter, the node returns:

- **Profile** – name, status, company type, incorporation date, registered office, SIC codes, previous names
- **Filing deadlines** – accounts and confirmation statement due dates
- **Officers** – directors and secretaries with role, appointment/resignation dates, nationality, country of residence
- **PSC / beneficial ownership** – persons with significant control plus PSC statements or exemptions
- **Charges** – registered mortgages/secured lending, outstanding vs satisfied, lender names
- **Financials** – key balance sheet and P&L figures (net assets, cash, turnover, profit, employees…) parsed from iXBRL accounts, with links to the filings
- **Risk flags** – accounts overdue, confirmation statement overdue, outstanding charges, insolvency history, PSC exemption, negative net assets

Each output item also carries `apifyRun` (run ID, dataset ID, start and finish time) so you can trace it back in Apify Console. Invalid or unknown company numbers come back as an error record instead of failing the whole run.

The node can also be used as a **tool by n8n AI Agents**.

## Credentials

You need an [Apify account](https://console.apify.com/sign-up) (the free plan works to try it).

- **API key** (self-hosted n8n): copy your token from [Apify Console → Settings → API & Integrations](https://console.apify.com/settings/integrations) and create an *Apify API* credential with it.
- **OAuth2** (n8n Cloud): choose *OAuth2* as the authentication method and sign in to Apify.

Runs are billed to your Apify account according to the Actor's pricing shown on its [Apify Store page](https://apify.com/rejoicing_shanty/uk-company-due-diligence). No Companies House API key is needed.

## Compatibility

Built with `@n8n/node-cli` and tested against n8n 1.x node API version 1.

## Usage

1. Add the **UK Company Due Diligence** node to a workflow.
2. Enter one or more **Company Numbers** (for example `00445790`, `SC123456`, `NI012345`, `OC300001`) or **Company Names**. Numbers are padded automatically (`445790` → `00445790`). Prefer numbers – names are resolved to the first active match.
3. Choose what to include (financials, officers, PSCs, charges) and the limits.
4. Run it. You get one item per company, ready for Google Sheets, a CRM, Slack or an AI step.

Tip: to check a list of companies coming from an earlier node, map the company number field with an expression, for example `{{ $json.companyNumber }}`. Each incoming item starts one Actor run.

Companies that file PDF/paper accounts (common for large groups) return filing links but no parsed figures.

Data comes from Companies House and is provided under the [Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/). Personal data about officers and PSCs is subject to UK GDPR – make sure you have a lawful basis for processing it.

## Resources

- [Actor page on Apify Store](https://apify.com/rejoicing_shanty/uk-company-due-diligence)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Apify API documentation](https://docs.apify.com/api/v2)

## Version history

- **0.1.0** – first release.
