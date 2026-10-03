# Duran Decorations — Foundation Roadmap

This roadmap prioritizes operational leverage before large rewrites.

## Phase 0 — Project operating system

Status: **completed**

- orchestration rules;
- agent handoff;
- current-state record;
- media pipeline;
- branch/PR discipline;
- initial issue backlog;
- recurring run protocol.

Success condition: a new agent can enter the repo, understand ownership, choose a bounded task, and leave a safe handoff without relying on chat history.

## Phase 1 — Vercel + preview deployment

Goal: make every branch/PR reviewable before production.

- create/link dedicated Vercel project;
- connect GitHub repo;
- preserve static architecture initially;
- verify preview deployments;
- verify production deployment/alias;
- document rollback path;
- add environment variables only when server-side features actually exist.

Success condition: every meaningful PR gets a working preview and production is verified after merge.

## Phase 2 — Business truth + conversion hardening

- replace placeholder WhatsApp number;
- confirm Instagram handle;
- confirm service area;
- confirm travel policy/fee wording;
- confirm legal/display business name;
- verify every CTA;
- add real testimonials only;
- test quote summary on mobile.

Success condition: a customer can discover, trust, estimate, and contact without encountering placeholder data.

## Phase 3 — Media/portfolio system

- inventory real portfolio;
- classify generated concepts;
- introduce provenance manifests;
- optimize images;
- create repeatable social package workflow;
- build seasonal/event campaign queue.

Success condition: media production can scale without mixing generated concepts with verified work.

## Phase 4 — Growth system

- local SEO/service-area strategy;
- metadata/schema audit;
- Google Business/Profile content support when available;
- conversion analytics;
- campaign landing-page experiments;
- portfolio categories based on real demand.

Success condition: changes can be tied to measurable inquiry/conversion signals.

## Phase 5 — Automation

Only automate stable workflows.

Candidates:
- recurring site health/CI/Vercel audit;
- stale-placeholder scan;
- portfolio/media queue review;
- SEO content opportunity scan;
- seasonal campaign prep;
- weekly work queue/handoff summary.

Automation should create issues/drafts or review-ready outputs rather than silently changing pricing or publishing media.

## Phase 6 — Backend decision gate

Stay static unless business operations demand persistence.

A backend/framework migration becomes justified when at least one real requirement exists:

- stored leads/clients;
- deposit/checkout flow;
- availability calendar;
- admin CMS;
- authenticated client portal;
- persistent approvals/content system;
- automated email/SMS with business records.

If triggered, design the data/security model first and migrate deliberately rather than incrementally bolting state onto the static app.

## Next Step to Build

Complete Phase 1: dedicated Vercel project + GitHub integration + preview deployment verification.
