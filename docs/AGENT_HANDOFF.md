# Agent Handoff — Duran Decorations

## Mission

Build Duran Decorations into a polished, trustworthy, bilingual event-decoration business platform that turns visual interest into qualified quote requests while staying easy for a small family business to maintain.

## Preserve

- Bilingual EN/ES experience.
- Mobile-first usability.
- Real portfolio work as the preferred public proof.
- JSON as the source of truth for catalog/pricing/testimonials while the site remains static.
- WhatsApp-first conversion until a stronger operational need justifies a backend.
- Existing modular CSS/JS structure and current validation script unless a migration deliberately replaces them.

## Do not regress

- Do not hard-code package/add-on prices into markup or scattered JS.
- Do not publish generated/AI imagery as if it were completed client work.
- Do not replace real portfolio assets with generated concepts.
- Do not invent testimonials, contact details, service areas, travel fees, legal names, availability, or booking terms.
- Do not make visual motion mandatory for understanding or navigation.
- Do not turn `main` into a scratch branch.
- Do not introduce a framework/backend just because it is available.

## Current architecture baseline

Static single-page site:
- `index.html`
- `css/style.css`
- modular `js/`
- `catalog.json`
- `pricing.json`
- `testimonials.json`
- GitHub Actions validation via `scripts/validate.js`

See `docs/CURRENT_STATE.md` for the verified current state.

## Source of truth

- `README.md` — runtime/data usage.
- `docs/CURRENT_STATE.md` — verified present state + blockers.
- `docs/ORCHESTRATION.md` — multi-agent workflow.
- `docs/MEDIA_PIPELINE.md` — media generation, approval, provenance.
- `docs/ROADMAP.md` — prioritized infrastructure/product sequence.
- `PLAN.md` — historical premium upgrade plan; use as background, not current task queue.

## Business-data boundary

Treat these as owner-approved facts only:

- WhatsApp number;
- Instagram handle;
- service area;
- travel policy/fees;
- legal/business display name;
- package prices and add-on prices;
- availability/booking policies;
- testimonials;
- photos identified as real completed work.

If a value is missing, create a blocker instead of guessing.

`js/config.js` enforces this boundary with `CONTACT_VERIFIED`. Keep it `false` and keep `WA_NUMBER`, `IG_HANDLE`, `AREA`, and `TRAVEL_LABEL` empty until all four values are owner-approved. While false, the public estimator remains usable but outbound contact actions must stay unavailable.

## Media boundary

Every visual asset should be classifiable as one of:

- real portfolio;
- owner-supplied brand asset;
- generated concept/inspiration;
- social/marketing derivative;
- archive/deprecated.

Generated concepts must not be silently promoted into the real portfolio.

## Every meaningful implementation change should leave

- a bounded branch/PR;
- validation evidence;
- docs updated when persistent behavior changes;
- a concise handoff;
- one **Next Step to Build**.

## Hermes / future-agent handoff

Future agents should begin with:
1. latest `main`;
2. `docs/CURRENT_STATE.md`;
3. `docs/ORCHESTRATION.md`;
4. open PRs/issues;
5. the most recent relevant handoff in the PR/issue discussion.

Do not rely on chat memory alone when repo state can answer the question.
