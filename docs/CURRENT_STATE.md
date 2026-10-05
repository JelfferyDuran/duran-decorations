# Duran Decorations — Current State

Verified from repository and connected deployment state on 2026-10-05.

## Repository

- Repo: `JelfferyDuran/duran-decorations`
- Production branch: `main`
- Current app: static single-page site with no framework build step
- Current repo permissions allow normal branch/PR workflow
- Open issues at inspection time: #2 (owner business data)
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
- `scripts/project-health.js`

CI currently checks JSON validity, required fields, pricing sanity, image paths, EN/ES key parity, portfolio provenance, the fail-closed contact-verification boundary, static DOM/runtime ID references, and repository operating-system integrity.

## Quote-flow health

The estimator modal now includes the missing `qAskNote` element used by its total calculator. Selecting “Book Now” or “Build Estimate” can open the estimator without a runtime exception, and add-ons that require a custom quote are explicitly excluded from the displayed total in both English and Spanish. CI verifies that exact `getElementById(...)` references resolve to markup IDs so this class of regression fails before deployment.

## Current hosting/deployment state

- GitHub Pages remains available at <https://jelfferyduran.github.io/duran-decorations/>.
- The GitHub repository is linked to the dedicated Vercel project `duran-decorations` (`prj_cGaGMV920T8LVKPH9xjocFzCGEhw`).
- Vercel production branch: `main`.
- Vercel production alias: <https://duran-decorations.vercel.app/>.
- The first Vercel production deployment reached `READY` from `main` commit `b3e5917a2f2d80251c73dd95142c02f0c02b346d`.

See `docs/DEPLOYMENT.md` for Preview, production-verification, and rollback steps.

## Known blockers / owner facts still unresolved in repo

`js/config.js` intentionally keeps these public fields empty while `CONTACT_VERIFIED` is false:

- WhatsApp number;
- Instagram handle;
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

1. Owner-confirmed WhatsApp, Instagram, service-area, and travel-policy values are still missing.
2. No analytics provider is connected; `js/analytics.js` exposes a safe event contract only.

## Recurring project loop

`docs/AUTOMATION_RUNBOOK.md` now defines the durable start-of-run inspection, lane-selection order, safety boundaries, Vercel handling, validation sequence, no-change behavior, and handoff template. `scripts/project-health.js` verifies that the required repository operating-system contracts are present and prints a bounded local snapshot; GitHub and Vercel external state still require fresh connected-tool inspection.

## Growth baseline

See `docs/GROWTH_BASELINE.md` for the metadata audit, verified offering categories, conversion-event contract, privacy boundary, and measurement plan. Known placeholder telephone and unverified Instagram data were removed from JSON-LD; owner-confirmed contact and service-policy values are still required before Issue #2 can be completed.

## Next Step to Build

Complete a bounded keyboard and focus-management accessibility pass without changing business data, pricing, or public media.
