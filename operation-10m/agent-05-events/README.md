# Agent 05 — Dynamic Events & Narrative

State-triggered crisis chains with cooldowns, passive persistent modifiers, and player responses that mutate simulation state (money, stability, flags, active crisis counts).

## Layout

- `src/` — runtime engine (triggers, cooldowns, consequences, tick/resolve)
- `generated/chain-catalog-tranche2.ts` — 240 archetype chains (`scripts/generate-catalog-tranche2.py`)
- `src/chain-catalog-aggregate.ts` — merged 840-chain export
- `generated/regional-hook-catalog.ts` — 120 cross-region hooks (`scripts/generate-regional-hooks.py`)
- `src/regional-hook-engine.ts` — contagion, neighbor stability, deep follow-up arming, seasonal bypass for escalated chains
- `chunk.tsx` — Agent 25 assembly bundle (`npm run bundle:agent05`, markers `OP10M_MODULE_BEGIN agent-05-events`)
- `tests/` — Node test suite

## Commands

From repo root:

```bash
npm run generate:agent05
npm run generate:agent05-regional
npm run bundle:agent05
npm run test:agent05
```
