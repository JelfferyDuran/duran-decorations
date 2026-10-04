# Duran Decorations — Deployment

## Vercel project

- Team: `Kingdom Noel`
- Team ID: `team_AsCnWWcWP4PoqLQ5aWsbGG2L`
- Project: `duran-decorations`
- Project ID: `prj_cGaGMV920T8LVKPH9xjocFzCGEhw`
- Git repository: `JelfferyDuran/duran-decorations`
- Production branch: `main`
- Framework preset: none (static site)
- Production alias: <https://duran-decorations.vercel.app/>

GitHub Pages remains available at <https://jelfferyduran.github.io/duran-decorations/>. Do not remove either host until the owner deliberately chooses a canonical public URL and verifies any required redirects, analytics, and search metadata.

## Preview verification

Every non-`main` branch push should create a Vercel Preview deployment through the Git integration.

Before merge:

1. Confirm the deployment state is `READY`.
2. Open the Preview URL and verify the page returns HTTP 200.
3. Check the portfolio images, pricing cards, language toggle, quote estimator, and disabled contact actions.
4. Confirm the deployment metadata references the expected branch and commit SHA.
5. Record the deployment ID and URL in the PR handoff.

## Production verification

After merge to `main`:

1. Wait for the new production deployment to reach `READY`.
2. Confirm the deployment metadata references the merged `main` commit.
3. Verify <https://duran-decorations.vercel.app/> returns HTTP 200.
4. Repeat the critical-surface checks used for Preview.
5. Record the deployment ID and production alias in the PR or issue handoff.

The first verified production deployment was `dpl_wZbq9pVyjWw4amnMsGR65DykMY4E`, built from `main` commit `b3e5917a2f2d80251c73dd95142c02f0c02b346d`.

## Rollback

Use the Vercel project deployment history to select the last known-good production deployment and request a rollback or promote that deployment. Verify the production alias after the rollback completes, and record the restored deployment ID in the incident or PR discussion.

Do not roll back by force-pushing `main`. If the bad change also needs to leave repository history, create a normal revert PR after production is stable.

## Safety boundaries

- Do not add environment variables unless a real server-side requirement exists.
- Do not copy secrets or private deployment tokens into the repository.
- Do not change contact facts, pricing, service policy, testimonials, or media provenance during deployment work.
- A successful build is not production verification; verify the deployed URL and critical customer paths.
