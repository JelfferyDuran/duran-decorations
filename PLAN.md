# Duran Decorations — Premium Update Plan (handoff for next dev model)

> Status: **COMPLETED (Phases A–D executed 2026-08-22)** · Owner: Kristina Duran (via Jayto) · Repo: `JelfferyDuran/duran-decorations` · Live: https://jelfferyduran.github.io/duran-decorations/
> This doc was the handoff plan. The premium upgrade (quote modal + estimator, add-ons, lightbox, testimonials, module split, CI, a11y, presets, preloader) is implemented — see README for the new architecture and data schemas. Remaining: replace placeholders in `js/config.js` (number, IG, LLC name) and add real testimonials.

---

## 0. Current state (verified Aug 2026)

**Working (v2, live):**
- Single static `index.html` + `catalog.json` (6 services) + `pricing.json` (3 packages) + `assets/` (6 AI-generated images)
- Bilingual EN/ES (inline JS `I18N` dict, `localStorage` persist) + dark mode
- GSAP + ScrollTrigger (hero timeline, section reveals, parallax), Lenis scroll, Three.js WebGL hero balloons, generative canvas background, parametric arch studio (sliders + shuffle + mouse sway)
- GitHub Pages auto-deploy from `main` (root path). `vercel.json` present but unused (no Vercel project).
- All JSON validated. All endpoints 200.

**Known placeholders / decisions the USER must supply (blocking items, ask before building):**
1. Real WhatsApp number (currently `15551234567` in `index.html` waLink)
2. Real Instagram handle (currently `@durandecorations`)
3. Real photos of Kristina's work (replaces AI placeholders in `assets/`)
4. Travel radius / travel fee policy (currently "+ travel" with no number)
5. LLC / business name exact spelling for legal footer + schema.org
6. Service area wording (currently "New Jersey")

**Known technical debt (fix in this phase, not blocking):**
- CDN scripts (GSAP/Lenis/Three) have NO failure fallback → if one CDN 404s, site JS partially breaks. Feature-detect before init.
- No schema.org structured data (LocalBusiness) → no rich results.
- No `robots.txt`/`sitemap` reference in HTML (files exist, not linked).
- i18n dict inline in HTML (~200 lines) → split to `i18n.js` or JSON for maintainability.
- No error UI if `catalog.json`/`pricing.json` fail to load (empty sections silently).
- Lenis anchor nav works, but hash-on-load (`#pricing`) isn't handled on refresh.
- Arch studio uses mouse events only → broken on touch devices (use Pointer Events).
- Generative canvas + WebGL run even on `prefers-reduced-motion` edge cases; `reduceMotion` gate exists but WebGL should also have a `matchMedia('(pointer: coarse)')` off-switch for perf on mobile.
- No build step, no minification, no caching headers (GitHub Pages default).

---

## 1. Phase A — Tidy & harden (foundation, ~1 session)

**A1. CDN resilience**
- Wrap each third-party init (`gsap`, `Lenis`, `THREE`) in `typeof X !== 'undefined'` guards (partially done — make complete).
- If `THREE` missing: hide `#heroGL`, fall back to CSS-only gradient hero. If GSAP missing: skip animations (site must be fully usable static).
- Add `<noscript>` message for JS-off users.

**A2. Schema.org + SEO**
- Add `application/ld+json` LocalBusiness (or `ProfessionalService`): name, owner, areaServed, priceRange `$$`, sameAs (IG), address NJ.
- Link `robots.txt` + `sitemap.txt` via `<link>` tags; add `<meta name="theme-color">`; `preload` hero image; `fetchpriority="high"` on hero img.
- OG image → first real photo once available.

**A3. Data robustness**
- Wrap JSON fetches: on failure show a styled inline notice ("We're updating our menu — message us for today's list") + keep WhatsApp CTA.
- Add `aria-*` + focus styles + keyboard nav on arch studio and burger menu (a11y pass).

**A4. Housekeeping**
- `.gitattributes` to stop CRLF warnings (`* text=auto eol=lf`).
- Fix any unused CSS/JS leftovers; run HTML through `npx html-validate` and JSON through `python -m json.tool` before commit.
- Bump commit convention: prefix `fix:` / `feat:` / `chore:`.

**A5. Deploy hygiene**
- Confirm GitHub Pages source = `main` / root. Keep `vercel.json` only if a Vercel deploy is intended; otherwise delete to avoid confusion.

**Verify A:** site loads with all 3 CDNs blocked (simulate) and still shows full content + WhatsApp CTA. `html-validate` clean. JSON valid. Lighthouse ≥ 85 on mobile perf (with no CDN-block simulation).

---

## 2. Phase B — Booking & quote functionality (core value add)

**B1. Quote/booking flow**
- Replace "Book This" CTAs with a **quote modal** (or dedicated section) instead of jumping straight to WhatsApp.
- Fields: name, phone, event date, event type (dropdown from catalog categories), city/zip, package or "custom", add-ons (multi-select), message.
- Submit → `https://wa.me/<NUMBER>?text=<prefilled order summary>` (no backend needed; keeps everything on WhatsApp per Kristina's workflow).
- Modal: accessible (Escape, focus trap, backdrop click), i18n EN/ES, validation inline.

**B2. Add-ons + package estimator (real money math)**
- Extend `pricing.json` with an `addons` array (from competitor sheet 2):
  - Custom welcome signs `$110` · Balloon columns `from $60` · Balloon stacks `$45` · Balloon garlands `$15/FT` · marquee numbers/letters (TBD price) · metallic balloons (TBD) · 4th color (competitor sheet 3 says `+$25`) · floral (TBD)
  - Each addon: `{ id, name, name_es, price, unit (flat|perFt), min? }`
- Live estimator: pick package (from pricing.json) → add addons → show running total + travel note → "Send via WhatsApp" builds the message. Numbers computed from JSON, never hardcoded in HTML.
- Show both market-vs-ours savings line (reuse existing pattern).

**B3. Gallery lightbox**
- Upgrade catalog cards to open a lightbox (image + name + desc + "Quote this"). Keyboard nav (arrows), swipe on touch, lazy-load images.
- When real photos arrive: rename assets to slug names (`circle-arch-1.jpg`), keep AI placeholders in an `assets/demo/` subfolder until replaced.

**B4. Testimonials**
- Add `testimonials.json` (`{ name, text, text_es, event, date }`), render as cards with stars. Empty array = section hidden (graceful). Ask Kristina for 3–5 real ones.

**Verify B:** estimator math matches JSON (write a tiny `test/pricing.test.js` node script asserting e.g. circle arch + welcome sign + garland 10ft = 275+110+150 = $535). Modal opens/closes, prefilled WhatsApp URL contains correct fields. Lightbox works on keyboard + touch.

---

## 3. Phase C — Architecture & maintainability (so future updates are cheap)

**C1. Split the monolith**
- `index.html` → semantic skeleton only.
- `css/style.css` (tokens, sections), `js/i18n.js` (dict), `js/app.js` (init + catalog + pricing + estimator), `js/motion.js` (GSAP/Lenis), `js/hero-webgl.js`, `js/gen-canvas.js`, `js/arch-studio.js`.
- Keep it static (no build framework) OR add a Vite build — **decision: stay static + plain `<script defer>`** unless user asks for a build step. Simplicity wins for a solo business site.

**C2. i18n parity guard**
- Add a tiny check (CI or pre-commit) that EN and ES dicts have identical key sets. Prevents the classic "Spanish forgot a string" bug.

**C3. CI (GitHub Actions)**
- `.github/workflows/deploy.yml`: on push to `main` → validate `catalog.json` + `pricing.json` (schema-lite: required fields, `duran < market`, positive prices) → run pricing unit test → deploy is already automatic via Pages, so CI just gates (fail the commit check on invalid data). Cheap and catches real mistakes (e.g. someone sets `duran` above `market`).

**C4. Data schema (document once)**
- `catalog.json` item: `{ id, name, name_es, cat, cat_es, img, desc, desc_es, tag? }` (tag: best|new|premium|popular)
- `pricing.json` item: `{ id, name, name_es, desc?, desc_es?, market, duran, feats[], feats_es[], tag?, addons? }`
- `testimonials.json` item: `{ name, text, text_es?, event, date }`
- Put schema in README (already partially there) so any model can edit without guessing.

**Verify C:** CI runs on push and blocks on invalid pricing. All JS files load with no console errors. `applyLang()` swaps every visible string (spot-check each section in ES).

---

## 4. Phase D — UI fluidity & polish

**D1. Motion refinements**
- Hero: add a subtle floating/tilt on the hero image (GSAP), magnetic hover on CTA buttons.
- Section transitions: use ScrollTrigger `scrub` parallax on background blobs; stagger reveal on pricing cards (exists — extend to estimator + gallery).
- Preloader: 1s branded fade (respect `prefers-reduced-motion`).

**D2. Arch studio upgrades**
- Pointer Events (touch support), inertia on drag, preset theme buttons ("Kids", "Wedding", "Quince", "Baby" → set palette + count + fullness) that also update the WhatsApp quote text with the chosen preset.
- Live caption under canvas: "28 balloons · medium fullness · palette 3".

**D3. Performance budget**
- Target: LCP < 2.5s, CLS < 0.1, no layout shift from WebGL canvas (`aspect-ratio` on hero container).
- Lazy-load everything below the fold; `decoding="async"` on imgs.
- Mobile: disable WebGL hero + generative canvas below 768px width OR `pointer: coarse` (battery/GPU).

**D4. Custom domain ready**
- Structure so `durandecorations.com` (or a `kingdomfiservices.com` subdomain) can be pointed later: keep paths relative (already true), note CNAME step in README.

**Verify D:** Lighthouse mobile perf ≥ 90 (with canvases gated), a11y ≥ 95. Touch device: arch studio drag works, no sticky hover states. Reduced-motion: everything static but complete.

---

## 5. Order of execution & handoff notes for next model

1. **Blocking first:** ask user for the 6 items in section 0 (number, IG, photos, travel, LLC name, area). Do NOT ship new CTAs on a placeholder number again — make the WhatsApp number a single constant at top of `app.js` (`const WA_NUMBER = '...'`) so it's edited once.
2. Then A → B → C → D. A is prerequisite for everything (harden the base).
3. Keep every number (prices) sourced from JSON — never hardcode in HTML/JS.
4. Commit after each phase with `feat:`/`fix:` prefix; push; verify live URL returns 200 + new content before moving on.
5. When Kristina sends real photos: put them in `assets/`, update `catalog.json` `img` paths, move old AI shots to `assets/demo/`, and swap the OG image.

## 6. Do NOT do
- No backend/database (WhatsApp-first business model — keep it that way until volumes demand otherwise).
- No competitor names on the public site — only "Market price".
- No paid fonts/plugins beyond free Google Fonts + CDN libs already in use.
- Don't delete `assets/demo/` AI images without confirmation (they're the fallback until real photos land).
