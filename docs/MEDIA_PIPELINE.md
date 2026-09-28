# Duran Decorations — Media Generation & Asset Pipeline

## Goal

Use media generation aggressively for concepts, ads, mockups, social content, and design exploration while keeping the public portfolio truthful.

## Asset classes

Every asset must belong to one class:

1. **REAL_PORTFOLIO** — verified photo/video of Duran Decorations work.
2. **BRAND_CANONICAL** — owner-approved logo/brand element.
3. **GENERATED_CONCEPT** — AI/generated concept, inspiration, mockup, background, or campaign art.
4. **MARKETING_DERIVATIVE** — crop/composite/edit made from an approved real or canonical source.
5. **ARCHIVE** — deprecated or superseded asset retained for traceability.

## Non-negotiable rule

**Generated concepts are never labeled or presented as completed Duran Decorations client work.**

## Recommended future folder model

Do not mass-move current live assets until references are migrated safely.

Target structure:

```
assets/
  portfolio/        # verified real work
  brand/            # canonical logos/marks
  generated/        # generated concepts and campaign art
  social/           # approved social derivatives
  archive/          # deprecated assets
media/
  manifests/        # provenance records
  briefs/           # generation briefs/prompts
```

## Media manifest

Each important generated/edited asset should eventually have a manifest record containing:

- asset path;
- asset class;
- created date;
- source assets;
- generation/edit brief;
- model/tool when known;
- whether faces/people were altered;
- approval state;
- intended surfaces;
- notes/restrictions.

Example:

```json
{
  "asset": "assets/generated/pastel-baby-shower-concept.webp",
  "class": "GENERATED_CONCEPT",
  "created": "2026-09-28",
  "sources": [],
  "brief": "Pastel baby shower arch concept for social inspiration post",
  "tool": "image generation",
  "approval": "review",
  "surfaces": ["instagram-draft"],
  "notes": "Concept only; not portfolio proof"
}
```

## Generation workflow

1. Start from a bounded brief.
2. Identify whether the output is portfolio, concept, or marketing derivative.
3. Preserve any owner-supplied canonical logo exactly unless the task explicitly asks for redesign.
4. Generate/edit.
5. Review for brand fit, realism, text accuracy, faces/hands, and misleading claims.
6. Save with descriptive filenames.
7. Record provenance for assets that may reappear.
8. Publish only to the surfaces allowed by the approval state.

## Approval states

- `draft`
- `review`
- `approved`
- `published`
- `rejected`
- `archived`

No scheduled media loop should auto-publish by default. Scheduled loops should produce review-ready packages unless the owner explicitly changes this policy.

## Social package standard

A review-ready package should contain:

- objective;
- target service/event type;
- hook;
- caption EN;
- caption ES when useful;
- CTA;
- visual brief;
- aspect ratio(s);
- asset provenance;
- whether imagery is real work or concept imagery;
- proposed publication surface.

## Portfolio ingestion

For every new real event:

1. Preserve original images.
2. Create web-optimized copies.
3. Add descriptive alt text.
4. Add/update `catalog.json`.
5. Validate with `node scripts/validate.js`.
6. Prefer real work in hero/gallery surfaces over generated concepts.
7. Keep originals out of destructive editing workflows.

## Next Step to Build

Create a lightweight media manifest format and the first owner-approved brand/portfolio inventory before starting a recurring media-generation loop.
