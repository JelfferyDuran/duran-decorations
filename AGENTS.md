# Duran Decorations — agent entry point

You are working in the Duran Decorations repo (party & event decor, bilingual EN/ES static site).

## Read first

1. `docs/AGENT_HANDOFF.md` — mission, architecture, what not to regress, business-data boundary.
2. `docs/MEDIA_PIPELINE.md` — asset classes, provenance, approval states.
3. `assets/brand/brand.json` — brand kit. **Status is `draft`; the logo is NOT finalized.** Match its style, never present the placeholder logo as final.

## Depositing images (incl. ChatGPT contributors)

Follow `docs/IMAGE_DEPOSIT.md` exactly: deposit into `assets/generated/` only,
kebab-case names, royalty-free + documented license or AI tool note, manifest
record in `media/manifests/assets.json` with `class: GENERATED_CONCEPT` and
`approval: review`. Never touch the real portfolio (`assets/*.jpg`),
`catalog.json`, `pricing.json`, or `testimonials.json`. Never present generated
concepts as completed client work.

## Validate

```bash
node scripts/validate.js          # CI gate — must pass
node scripts/validate-gallery.js  # gallery deposits + brand kit — must pass
```

## Changes

Open a pull request against `main` with validation evidence. Do not push to
`main` directly. One focused change per PR.
