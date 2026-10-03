# Duran Decorations — Recurring Project Runbook

This is the durable execution contract for recurring repository-health and work-queue runs. Scheduling and credentials remain outside the repository; this file defines what every run must inspect, preserve, validate, and hand off.

## Start-of-run checklist

1. Inspect the latest `main` commit and recent commit history.
2. Read `docs/CURRENT_STATE.md`, `docs/ORCHESTRATION.md`, and `docs/AGENT_HANDOFF.md` completely.
3. Inspect open pull requests before choosing a lane.
4. Inspect open issues and their latest handoffs.
5. Inspect meaningful active branches for overlap.
6. Inspect the connected Vercel project, deployments, and Preview/production state when the project exists.
7. Run `node scripts/project-health.js` for the bounded repository snapshot.
8. Choose one highest-value task that is safe, unowned, and small enough to validate in one run.

The local preflight cannot prove GitHub or Vercel state. Those external checks must be refreshed through the connected tools on every run.

## Lane-selection order

1. Resolve or safely merge an already-active PR when it owns the highest-value work.
2. Address a production regression or customer-safety risk.
3. Advance the highest-value unblocked issue.
4. Improve validation, accessibility, performance, or documentation without changing business facts.
5. If every useful task is blocked, leave a precise blocker handoff; do not create cosmetic churn.

Do not duplicate another active lane. Treat a merged-but-not-deleted branch as historical unless an open PR or current handoff says it is active.

## Non-negotiable boundaries

- Never invent contact details, service area, travel policy, legal identity, availability, testimonials, or prices.
- Never hard-code prices outside `pricing.json`.
- Never publish generated media as completed client work.
- Never move an asset into the public catalog without a valid provenance record.
- Never make motion necessary for navigation or understanding.
- Never overwrite another active lane or use `main` as a scratch branch.
- Never modify an unrelated Vercel project when the Duran Decorations project is absent.
- Never treat a successful build alone as production verification.

## Bounded implementation protocol

1. Create a workstream branch from current `main`.
2. List the files owned by the task.
3. Change only what the bounded outcome requires.
4. Preserve pricing, provenance, bilingual parity, accessibility, and current production behavior.
5. Run at minimum:
   - `git diff --check`
   - `node scripts/validate.js`
   - `node scripts/project-health.js`
6. Run syntax, targeted, or visual checks appropriate to the changed files.
7. Open a PR and wait for required checks.
8. Merge only when the branch is current, mergeable, and validated.
9. Verify the production surface after merge.

## Vercel handling

When a dedicated Duran Decorations project exists:

- record the project ID;
- verify the branch/PR Preview deployment;
- inspect build output when Preview fails;
- verify the production deployment and alias after merge;
- record deployment IDs/URLs in the handoff.

When no dedicated project exists, state that explicitly. Do not infer linkage from another project name and do not deploy into an unrelated project.

## Durable handoff template

Leave the handoff in the relevant PR or issue discussion and include:

```md
## Completed handoff

- Branch:
- Source commit:
- PR:
- Main commit:
- Changed files:

### Result

### Validation

### Deployment / preview

### Risks / blockers

### Next Step to Build
```

The handoff must distinguish what was verified from what remains inferred, unavailable, or owner-blocked.

## No-change runs

Do not create a commit just to prove that a run occurred. If repository, issue, PR, and deployment state have not produced a safe new action, leave the code untouched and report only a newly changed blocker or risk.

## Next Step to Build

Connect `JelfferyDuran/duran-decorations` to its own Vercel project, then exercise this runbook against a real branch Preview and production deployment.
