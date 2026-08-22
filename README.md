# Duran Decorations 🎈

Party & event decorations by Kristina Duran — New Jersey.

Balloon arches, themed party styling, weddings, baby showers, graduations, quinceañeras, and custom decor. Bilingual (EN/ES), dark mode, mobile-first, market-beating pricing.

**Live:** https://jelfferyduran.github.io/duran-decorations/

## Stack
- Single-page site: hero, services, **pricing (market vs. our price, $75 under)**, **parametric arch design studio**, how it works, about, FAQ, contact
- Motion: GSAP + ScrollTrigger · Scroll physics: Lenis · WebGL hero: Three.js · Generative canvas background
- Data-driven: `catalog.json` (services) + `pricing.json` (market/duran prices)

## Add a new design
1. Drop the image in `assets/`
2. Add an entry to `catalog.json` (name/name_es, cat/cat_es, img, desc/desc_es, optional tag: best|new|premium)
3. Push — GitHub Pages auto-deploys.

## Add a new priced package
1. Add entry to `pricing.json`: `market` = competitor baseline, `duran` = Kristina's price (she prices $75 below market)
2. Savings badge is computed automatically
3. Push — auto-deploys.

## Business notes
Strategy + market reference prices (Tricia Mae Rentals & Decor samples) live in the Obsidian vault at `04-Personal/Duran Decorations/Business Notes.md`.
