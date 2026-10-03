# Duran Decorations — Multi-Workstream Orchestration

## Purpose

This file defines how multiple ChatGPT sessions, coding agents, media-generation runs, scheduled loops, and human edits can work on Duran Decorations without duplicating work or creating avoidable regressions.

Production branch: `main`

Rule: **main is integration/production, not a shared scratchpad.**

## Workstream ownership

| Workstream | Branch prefix | Primary ownership |
| --- | --- | --- |
| Public website | `frontend/` | Homepage, responsive UI, navigation, motion, accessibility |
| Booking & conversion | `booking/` | Quote estimator, WhatsApp flow, forms, conversion UX |
| Catalog & pricing | `data/` | `catalog.json`, `pricing.json`, testimonials, schema integrity |
| Media & brand | `media/` | Approved photos, generated media, social assets, provenance |
| SEO & growth | `growth/` | Local SEO, structured data, landing pages, analytics experiments |
| Infrastructure | `infra/` | Vercel, CI, deployment health, repo hygiene, orchestration |
| Automation | `automation/` | Scheduled audits, content queues, recurring business checks |

## Shared/high-conflict files

Treat these as shared:

- `index.html`
- `css/style.css`
- `js/app.js`
- `js/config.js`
- `js/i18n.js`
- `catalog.json`
- `pricing.json`
- `.github/workflows/`
- deployment configuration
- project-wide docs that define architecture or workflow

A worker may edit a shared file only when required for the bounded task. Before merge, compare active PRs for overlapping edits.

## Start-of-run protocol

Use `docs/AUTOMATION_RUNBOOK.md` as the full recurring-run contract and run `node scripts/project-health.js` for the bounded local preflight.

Every implementation run should:

1. Inspect latest `main` and recent commits.
2. Read `docs/CURRENT_STATE.md`, this file, and `docs/AGENT_HANDOFF.md`.
3. Inspect open PRs/issues relevant to the lane.
4. Confirm the branch is based on a current-enough `main`.
5. Pick one bounded highest-value task.
6. List expected owned files before editing.
7. Avoid repeating completed work or silently changing pricing/brand decisions.
8. If the task needs an unverified business fact, record it as a blocker instead of inventing it.

## End-of-run protocol

Every meaningful run should leave:

- branch name;
- commit SHA(s);
- changed files;
- validation performed;
- preview/deployment status when available;
- assumptions/blockers;
- one **Next Step to Build**.

If persistent behavior or architecture changes, update the relevant docs.

## Merge protocol

Before merge:

1. Compare the branch against latest `main`.
2. Check overlap with other active PRs.
3. Run `node scripts/validate.js`.
4. Verify the preview deployment when Vercel is connected.
5. For visual work, inspect desktop + mobile before merge.
6. Merge one bounded unit at a time.
7. Verify production after merge.

## Orchestrator responsibilities

The orchestrator coordinates instead of redesigning every lane itself.

On each run:

1. Inspect latest `main`, open PRs, issues, and meaningful active branches.
2. Inspect Vercel production/preview health when linked.
3. Detect overlapping files and merge-order risks.
4. Read the newest handoff notes.
5. Maintain a concise queue: active, blocked, ready to merge, next.
6. Implement directly only when the work belongs to orchestration/infrastructure or no other lane owns it.
7. Preserve current production behavior unless a bounded task explicitly replaces it.
8. Never publish generated media as real client work.
9. Never change prices, travel policy, service area, contact data, or legal business identity from assumptions.
10. End every run with one **Next Step to Build**.

## Recommended parallel lanes

### Frontend
Visual refinement, responsive polish, accessibility, performance.

### Booking
Quote flow, estimator UX, WhatsApp summary, lead capture evolution.

### Media
Real portfolio ingestion, generated concept media, social packages, asset cleanup.

### Growth
Local SEO, service-area landing strategy, schema, metadata, analytics.

### Infrastructure
Vercel linkage, previews, CI, branch discipline, monitoring, agent handoffs.

These lanes can run concurrently when branch ownership and shared-file rules are respected.

## Conflict priority

When conflicts occur, preserve in this order:

1. business truth and pricing integrity;
2. customer-contact correctness;
3. production stability;
4. real/canonical brand assets;
5. accessibility and mobile usability;
6. current approved UX behavior;
7. new cosmetic enhancements.

## Production safety

A green preview is necessary but not sufficient. After merge, verify the production deployment, critical images, pricing/quote flow, language toggle, and customer CTA.
