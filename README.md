# Duran Decorations 🎈

Party & event decorations by Kristina Duran — New Jersey.

Real portfolio, market-beating pricing, bilingual (EN/ES), dark mode, mobile-first.

**Live:** https://jelfferyduran.github.io/duran-decorations/

## Stack
- Static single-page app (no build step)
- **CSS:** `css/style.css` (tokens + all sections + modal + lightbox)
- **JS modules** (`js/`): `config.js` (contact constants) · `i18n.js` (EN/ES dict) · `data.js` (rendering + lightbox) · `estimator.js` (quote modal) · `motion.js` (GSAP/Lenis/preloader) · `hero-webgl.js` (Three.js) · `gen-canvas.js` (background) · `arch-studio.js` (parametric) · `app.js` (orchestrator)
- **Data:** `catalog.json` (portfolio) · `pricing.json` (packages + add-ons) · `testimonials.json` (hidden when empty)
- **CI:** `.github/workflows/validate.yml` runs `scripts/validate.js` on every push — validates JSON, pricing math (`duran < market`), image paths, and i18n EN/ES parity. Run locally with `node scripts/validate.js`.

## Data schemas

### catalog.json — one entry per portfolio item
```json
{
  "id": "unique-slug",
  "name": "English Name", "name_es": "Nombre en Español",
  "cat": "Category", "cat_es": "Categoría",
  "img": "assets/photo.jpg",
  "desc": "English description", "desc_es": "Descripción en español",
  "tag": ""            // optional: "best" | "new" | "premium" | "popular"
}
```

### pricing.json — packages + add-ons
```json
{
  "packages": [{
    "id": "circle-arch",
    "name": "7FT Circle Arch", "name_es": "Arco Circular 7FT",
    "cat": "Arches", "cat_es": "Arcos",
    "desc": "...", "desc_es": "...",
    "market": 350,      // competitor baseline (NOT shown as a brand)
    "duran": 275,       // Kristina's price — MUST be below market
    "feats": ["..."], "feats_es": ["..."],
    "tag": "popular"
  }],
  "addons": [{
    "id": "balloon-garland",
    "name": "Balloon Garland", "name_es": "Guirnalda de Globos",
    "price": 15,        // number, or null = "Ask for quote" (not added to total)
    "unit": "ft"        // "flat" = one-time cost | "ft" = per foot with qty input
  }]
}
```

### testimonials.json — empty array hides the section
```json
[{ "name": "Client", "text": "...", "text_es": "...", "event": "Baby Shower", "date": "2026", "stars": 5 }]
```

## Contact constants
Edit **`js/config.js`** — `WA_NUMBER`, `IG_HANDLE`, `WA_MSG`, `AREA`. Single source of truth (search "TODO" for the current placeholders).

## Add a new design
1. Drop the real photo in `assets/` (slug name, e.g. `theme-name.jpg`)
2. Add entry to `catalog.json`
3. Push — CI validates, Pages auto-deploys.

## Add a new priced package / add-on
1. Add to `pricing.json` (market = competitor baseline, duran = Kristina's price, $75 under)
2. Savings badge + estimator total compute automatically from the JSON
3. Push — CI enforces `duran < market`.

## Business notes
Strategy, market reference prices, and proposed pricing live in the Obsidian vault at `04-Personal/Duran Decorations/`. Phase plan: `PLAN.md`.
