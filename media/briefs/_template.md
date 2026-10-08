# Brief template — copy for each new niche

> Read `assets/brand/brand.json` first. Every image deposited against a brief
> must match the brand kit's `imagery.style` and respect its `imagery.avoid` list.

## Niche

One line: what decor niche this brief covers.

## Objective

What the images are for (inspiration gallery, social draft, campaign art…).
Generated concepts are NEVER presented as completed Duran Decorations client work.

## Style anchors

- Palette: pull from `brand.json` colors (gold/plum for premium, candy brights for playful).
- Light: warm, soft, celebratory. No flat gray studio renders.
- Composition: <describe framing, e.g. "arch fills frame, slight low angle, negative space top for headline">
- Text in image: avoid unless the brief explicitly requires it; AI text must be spelled correctly.

## Shot list

1. …
2. …

## Must avoid

- …
- (plus everything in `brand.json` → `imagery.avoid`)

## License

Every deposited image needs a manifest record in `media/manifests/assets.json`
with `class: GENERATED_CONCEPT`, `approval: review` (default), a `created` date,
and either a `license` object (source, url, terms) for royalty-free stock or a
`tool` field for AI-generated imagery. See `docs/IMAGE_DEPOSIT.md`.
