# Duran Decorations — Growth and Conversion Baseline

Verified against repository state on 2026-10-02.

## Purpose

Establish a truthful, measurable starting point for growth work without adding a tracking vendor, collecting customer-entered data, or inventing business facts.

## Search metadata audit

### Present and usable

- page title and meta description;
- canonical URL for the current GitHub Pages production site;
- Open Graph and Twitter image metadata using an approved real-portfolio asset;
- `LocalBusiness` JSON-LD;
- `robots.txt` and `sitemap.txt` references;
- bilingual page content and language switching.

### Corrected in this baseline

- removed the known placeholder telephone number from JSON-LD;
- removed the unverified Instagram profile from JSON-LD.

### Blocked pending owner-confirmed facts

- WhatsApp number;
- Instagram handle;
- exact service area and any city-specific claims;
- travel policy or fee wording;
- public legal/display business name.

Do not create service-area landing pages or structured-data fields from assumptions. Issue #2 remains the source of truth for these missing facts.

## Verified offering categories

The current public catalog and pricing data support these categories:

- balloon arches;
- backdrops and sequin/grass walls;
- themed party setups;
- photo booths;
- dessert-table styling;
- stage and venue setups;
- milestone-event decor.

These categories may be used for measurement and content planning. Demand priority must come from observed inquiries or conversions, not from invented market claims.

## Conversion event contract

`js/analytics.js` creates a provider-neutral event bridge. It makes no network request. Every event is pushed to `window.dataLayer` and mirrored as a browser `dd:conversion` event.

| Conversion | When it fires | Allowed properties |
| --- | --- | --- |
| `quote_open` | A visitor opens the quote modal | `source`, `package_id`, `language` |
| `whatsapp_handoff` | A valid quote is handed off to WhatsApp | `source`, `package_id`, `addon_count`, `language` |
| `whatsapp_click` | A visitor clicks the direct contact WhatsApp CTA | `source`, `language` |

Customer-entered name, phone, event date, city/ZIP, notes, WhatsApp message text, and price totals are intentionally excluded.

### Example consumer

```js
window.addEventListener('dd:conversion', event => {
  console.log(event.detail);
});
```

An analytics provider can be connected later by consuming this contract. Provider setup must preserve the property allowlist and obtain any consent required by the selected platform or jurisdiction.

## Initial funnel

1. `quote_open`
2. `whatsapp_handoff`

Track direct contact intent separately with `whatsapp_click`.

The first useful measurements are:

- quote-to-handoff rate by source;
- handoffs by verified package ID;
- direct-contact clicks versus estimator handoffs;
- EN/ES conversion mix.

## Next Step to Build

Complete Issue #1 by linking the repository to its dedicated Vercel project and verify a branch Preview before connecting any analytics provider.
