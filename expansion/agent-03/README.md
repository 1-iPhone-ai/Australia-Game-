# Agent 03 — Technology / Research / Commercialization expansion

Branch implementation for **Operation 600K**. Does **not** modify `(V9.4) australia-game-with-ai.tsx`; Agent 25 merges via `merge/` snippets.

## Design alignment (V9.4 investigation)

- **No tech tree, no science points** — V10.5 SECTION 20X; Agent 03 adds a **readiness graph** (evidence dependencies), not a research bar.
- **Productivity** — bounded hooks through `innovationCapabilityModifiers` (V10.1 industry, V10.0 networks); Agent 03 `productivity-bridge.ts` mirrors caps (`V105_LIMITS.effectCap` = 6).
- **Commercialization** — stages derived from `research_commercialization` maturity + institutions + regional adoption.
- **Institutions** — RF-faction-shaped catalog + V10.11 `innovation_coordination` stressors.
- **UI / GI / AI** — progression unlock registry maps to PLAY/LAB/GI/contract/AI directive targets.

## Verify

```bash
npm run test:agent03
```

Set `CANONICAL_SMOKE=0` to skip loading the monolith.

## Merge

See `merge/INTEGRATION.md` and `agent-03-integration-contract.md` in the Project store.
