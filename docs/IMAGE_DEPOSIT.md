# Image deposit guide — for AI contributors (incl. ChatGPT)

This repo accepts image deposits from AI assistants. Follow this guide exactly.
For the full media policy, read `docs/MEDIA_PIPELINE.md`. For repo-wide agent
rules, read `docs/AGENT_HANDOFF.md`.

## Step 0 — read before you touch anything

1. `assets/brand/brand.json` — the brand kit. **Status is `draft`: the logo is
   NOT finalized.** Match its colors, fonts, tone, and `imagery.style`; respect
   `imagery.avoid`. Never present the placeholder logo as the final brand mark.
2. The brief for your niche in `media/briefs/` (or copy `_template.md` for a new niche).
3. `docs/AGENT_HANDOFF.md` — especially "Do not regress" and the business-data boundary.

## Where images go

- Deposit into `assets/generated/`. Nothing else.
- **Never** add, replace, or rename files in `assets/*.jpg` (real portfolio),
  `assets/demo/`, `catalog.json`, `pricing.json`, or `testimonials.json`.

## Naming

kebab-case, descriptive, zero-padded sequence:

```
<niche>-<descriptor>-<NN>.<ext>
pastel-balloon-arch-baby-shower-01.jpg
```

Allowed formats: `.jpg`, `.webp`, `.png`. Prefer `.jpg`/`.webp` for photos.

## Quality bar

- Minimum 1600px on the long edge for website use, 1080px for social.
- sRGB. No watermarks, no borders, no fake UI chrome.
- Faces/hands must look natural; text in the image must be spelled correctly.
- Must match the brief's style anchors and the brand kit mood.

## Royalty-free rules (non-negotiable)

Every deposited image must be royalty-free **and documented**. Approved paths:

| Source | Manifest proof required |
|---|---|
| Unsplash / Pexels / Pixabay / Wikimedia Commons | `license: { source, url, terms }` — direct page URL, license name |
| AI-generated (any model) | `tool: "<model/tool name>"`, plus the brief used |

Not allowed: Google Images / Pinterest / Instagram screenshots without a clear
license, watermarked comps, trademarked characters, or "royalty-free" claims
without a source URL.

## Manifest record (required)

Append one record per image to `media/manifests/assets.json`:

```json
{
  "asset": "assets/generated/pastel-balloon-arch-baby-shower-01.jpg",
  "class": "GENERATED_CONCEPT",
  "created": "2026-10-08",
  "brief": "media/briefs/balloon-arch.md",
  "tool": "gpt-image-1",
  "license": { "source": "Unsplash", "url": "https://unsplash.com/photos/…", "terms": "Unsplash License" },
  "approval": "review",
  "surfaces": ["instagram-draft"],
  "notes": "Concept only; not portfolio proof."
}
```

- `class` must be `GENERATED_CONCEPT` — never `REAL_PORTFOLIO`.
- `approval` defaults to `review`. Only the owner moves it to `approved`/`published`.
- For AI-generated images use `tool`; for stock use `license`. One of the two is mandatory.
- Generated concepts are **never** presented as completed Duran Decorations client work.

## Validate, then PR

1. Run `node scripts/validate-gallery.js` — it must pass.
2. Run `node scripts/validate.js` — it must pass (CI runs it).
3. Open a pull request against `main`. Do not push to `main` directly.
4. PR description: what niche, how many images, sources/licenses, brief used.

## Brand is not final

The logo and brand kit are drafts. If the owner finalizes the brand, they will
update `assets/brand/brand.json` (setting `logo_finalized: true`) and replace
`assets/brand/logo.svg`. Deposited images should lean on the *imagery style*
(palette, mood, niche) rather than the placeholder logo, so they survive the
final branding pass.
