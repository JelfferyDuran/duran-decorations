# Canvas fallback

Decorative rendering is optional. Keep real portfolio imagery visible when WebGL is unavailable.

The design studio uses Canvas 2D and remains available without WebGL. When 2D fails, its controls are disabled and a bilingual status is shown.

## Handoff — 2026-10-08

- Branch: `frontend/canvas-failure-fallback` (not merged).
- Base main: `e1f1504a95d408a39887a6fd5d94df80b08d8f07`.
- Changed: `js/hero-webgl.js`, `js/arch-studio.js`, `js/gen-canvas.js`, `scripts/test-canvas.js`, this document.
- Validation: syntax parsing passed; 22 mocked runtime assertions passed.
- Preview: Vercel deployment `dpl_32toXSPFksNaz5NWT9XpeUMH9ivF` READY for commit `9adb0466c75cc9db20db35badce5ccb0f2933cd9`.
- Production: unchanged at `e1f1504a95d408a39887a6fd5d94df80b08d8f07`.
- Blocker: PR creation and CI-workflow update were not permitted through the connected write tool; branch is ready for review, not for automatic promotion.
- Next Step to Build: open a PR for this branch, run standard CI and the canvas check, review Preview in a constrained browser, then merge only if all checks pass.
