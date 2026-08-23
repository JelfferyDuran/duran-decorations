# Duran Decorations 🎈

Party & event decorations by Kristina Duran — New Jersey.

Real portfolio, market-beating pricing, bilingual (EN/ES), dark mode, mobile-first.

**Live:** https://jelfferyduran.github.io/duran-decorations/

## Stack
- Single-page site: hero, real-work portfolio, pricing (market vs. our price, $75 under), parametric arch design studio, how it works, about, FAQ, contact
- Motion: GSAP + ScrollTrigger · Scroll physics: Lenis · WebGL hero: Three.js · Generative canvas background
- Data-driven: `catalog.json` (portfolio) + `pricing.json` (packages)

## Assets
- `assets/` — **real event photos** (Kristina's actual work)
- `assets/demo/` — earlier AI-generated placeholders (fallback; delete when no longer needed)

## Add a new design
1. Drop the real photo in `assets/` (slug name, e.g. `theme-name.jpg`)
2. Add entry to `catalog.json` (name/name_es, cat/cat_es, img, desc/desc_es, optional tag: best|new|premium|popular)
3. Push — GitHub Pages auto-deploys.

## Add a new priced package
1. Add entry to `pricing.json`: `market` = competitor baseline, `duran` = Kristina's price (she prices $75 below market)
2. Savings badge computes automatically. Push — auto-deploys.

## Business notes
Strategy, market reference prices, and proposed pricing live in the Obsidian vault at `04-Personal/Duran Decorations/`. Phase plan: `PLAN.md`.
