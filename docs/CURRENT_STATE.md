# Duran Decorations — Current State

Verified from repository state on 2026-10-03.

## Repository

- Repo: `JelfferyDuran/duran-decorations`
- Production branch: `main`
- Current app: static single-page site with no framework build step
- Current repo permissions allow normal branch/PR workflow
- Open issues at inspection time: #1 (Vercel), #2 (owner business data), and #5 (recurring project loop)
- Open pull requests at inspection time: none

## Existing product capability

The repo already includes:

- bilingual EN/ES content;
- responsive public website;
- portfolio catalog driven by `catalog.json`;
- pricing/packages/add-ons driven by `pricing.json`;
- quote estimator;
- WhatsApp-oriented conversion flow;
- gallery/lightbox;
- testimonials data surface;
- GSAP/Lenis/Three.js/generative visual effects;
- parametric arch studio;
- accessibility and reduced-motion work;
- structured-data/SEO groundwork;
- provider-neutral, privacy-safe quote and WhatsApp conversion events;
- CI validation.

## Existing modular structure

### CSS
- `css/style.css`

### JavaScript
- `js/app.js`
- `js/analytics.js`
- `js/arch-studio.js`
- `js/config.js`
- `js/data.js`
- `js/estimator.js`
- `js/gen-canvas.js`
- `js/hero-webgl.js`
- `js/i18n.js`
- `js/motion.js`

### Data
- `catalog.json`
- `pricing.json`
- `testimonials.json`

### Validation
- `.github/workflows/validate.yml`
- `scripts/validate.js`

CI currently checks JSON validity, required fields, pricing sanity, image paths, EN/ES key parity, portfolio provenance, and the fail-closed contact-verification boundary.

## Current hosting/deployment state

The README currently identifies GitHub Pages as the live host.

A Duran Decorations Vercel project was not present in the Vercel project set returned during this inspection, so Vercel linkage should be treated as **not yet verified** rather than assumed.

## Known blockers / owner facts still unresolved in repo

`js/config.js` intentionally keeps these public fields empty while `CONTACT_VERIFIED` is false:

- WhatsApp number;
- Instagram handle.

- travel label;
- service area.

Customer-facing WhatsApp and Instagram actions fail closed until the owner-approved contact and policy data are populated together. The estimator remains usable, but cannot hand off to WhatsApp while verification is incomplete. CI enforces this boundary.

## Architectural decision for the next phase

Do **not** rewrite to Next.js yet.

Reason:
- the site is already modular;
- the current quote/portfolio experience does not require server compute;
- static hosting is cheaper and simpler;
- framework migration would add churn before operational workflow is stable.

Revisit framework/backend migration only if one of these becomes real:
- durable lead/customer records;
- customer accounts;
- private admin portal/CMS;
- availability calendar;
- online checkout/deposits;
- automated email/SMS pipeline;
- persistent media/content approvals;
- advanced analytics requiring server logic.

## Immediate infrastructure gaps

1. Vercel project linkage is not verified, so Vercel previews are unavailable.
2. Owner-confirmed WhatsApp, Instagram, service-area, and travel-policy values are still missing.
3. No analytics provider is connected; `js/analytics.js` exposes a safe event contract only.
4. The recurring repository-health loop is active, but Issue #5 remains open until its durable runbook/closure criteria are recorded.

## Growth baseline

See `docs/GROWTH_BASELINE.md` for the metadata audit, verified offering categories, conversion-event contract, privacy boundary, and measurement plan. Known placeholder telephone and unverified Instagram data were removed from JSON-LD; owner-confirmed contact and service-policy values are still required before Issue #2 can be completed.

## Next Step to Build

Connect the repository to a dedicated Vercel project with Git integration, verify preview deployments for branches/PRs, then make preview verification part of the merge protocol.
