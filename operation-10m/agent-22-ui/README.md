# Agent 22 — Evolving UI & Accessibility

Progression-dependent panel visibility with **legacy UI path preservation**, accessibility helpers aligned with V9.4 `AccessibilitySettings`, React shells, Vitest coverage, and story fixtures for assembly QA.

## Commands

```bash
cd operation-10m/agent-22-ui
npm install
npm test
npm run typecheck
```

## Design principles

1. **Progressive disclosure** — panels unlock by signals (interface level, turn/day, guided-learning concepts, milestones).
2. **Never trap the player** — `resolveLegacyUiAccess` and nav deep-links always reach the target surface; progression only affects *default* chrome and rail ordering.
3. **A11y first** — ARIA builders, live regions, focus restore, and reduced-motion policies mirror canonical settings.

Assembly: see [INTEGRATION.md](./INTEGRATION.md).
