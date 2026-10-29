# Agent 15 — Trade / diplomacy / world economy

Modular GTEL engine for Operation 10M. Canonical inline copy lives in `(V9.4) australia-game-with-ai.tsx` (SECTION 20AT); this tree is the **source of truth for expansion** until Agent 25 re-inlines.

## Run tests

```bash
npm run test:agent15
npm run build:agent15-chunk
```

## Modules

| File | Role |
|------|------|
| `trade-turn.ts` | Per-turn `advanceGlobalTradeEconomyTurn` |
| `trade-agreements.ts` | FTA templates, ratification, tariff modifiers |
| `world-shocks.ts` | Shock catalog, schedule, intensity decay |
| `commodity-shock-scenarios.ts` | Multi-shock scenario bundles |
| `sanctions.ts` | Partner sanction tiers and commodity scopes |
| `domestic-consequences.ts` | Regional employment / CPI / stability spillover |
| `diplomacy-linkage.ts` | Deal → partner/commodity deltas |
| `household-bridge.ts` | Household economy input overrides |

See `integration-contract.md`.
