# Agent 14 — Housing / education / healthcare / wellbeing

Modular slice for **public service delivery capacity** and **delayed spending → KPI effects**, aligned with V10.14 boundaries in `(V9.4) australia-game-with-ai.tsx`.

## Run tests

```bash
npm run test:agent-14-wellbeing
```

## Modules

| File | Role |
|------|------|
| `public-service-capacity.ts` | National program slots, fiscal absorption cap, workforce utilization, binding constraints |
| `delayed-spending-effects.ts` | Multi-turn fiscal load with lagged/ramped KPI uplift |
| `turn-advance.ts` | Per-turn orchestration producing enriched inputs for `computeNationalPublicServices` |

Agent 25 merges per [INTEGRATION.md](./INTEGRATION.md).
