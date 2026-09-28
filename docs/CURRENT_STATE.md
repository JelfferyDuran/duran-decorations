# Duran Decorations — Current State

Verified from repository state on 2026-09-28.

## Repository

- Repo: `JelfferyDuran/duran-decorations`
- Production branch: `main`
- Current app: static single-page site with no framework build step
- Current repo permissions allow normal branch/PR workflow
- Open issues at inspection time: none
- Open/closed PR history returned at inspection time: none

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
- CI validation.

## Existing modular structure

### CSS
- `css/style.css`

### JavaScript
- `js/app.js`
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

CI currently checks JSON validity, required fields, pricing sanity, image paths, and EN/ES key parity.

## Current hosting/deployment state

The README currently identifies GitHub Pages as the live host.

A Duran Decorations Vercel project was not present in the Vercel project set returned during this inspection, so Vercel linkage should be treated as **not yet verified** rather than assumed.

## Known blockers / owner facts still unresolved in repo

`js/config.js` currently contains placeholders for:

- WhatsApp number;
- Instagram handle.

It also contains generic values for:

- travel label;
- service area.

Before marketing/booking automation depends on these values, confirm the owner-approved contact and business-policy data.

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

1. No established issue/PR work queue.
2. No repo-level orchestration/handoff docs before this foundation pass.
3. Vercel project linkage not yet verified.
4. No formal preview-before-production policy.
5. No media provenance/approval workflow.
6. No recurring audit loop for site, media, SEO, and booking health.
7. Placeholder customer-contact data remains in config.

## Next Step to Build

Connect the repository to a dedicated Vercel project with Git integration, verify preview deployments for branches/PRs, then make preview verification part of the merge protocol.
