# Agent 05 — Dynamic Events & Narrative

State-triggered crisis chains with cooldowns, passive persistent modifiers, and player responses that mutate simulation state (money, stability, flags, active crisis counts).

## Layout

- `src/` — runtime engine (triggers, cooldowns, consequences, tick/resolve)
- `generated/chain-catalog.ts` — 600 chain descriptors (`scripts/generate-catalog.py`)
- `generated/regional-hook-catalog.ts` — 120 cross-region hooks (`scripts/generate-regional-hooks.py`)
- `src/regional-hook-engine.ts` — contagion, neighbor stability, deep follow-up arming, seasonal bypass for escalated chains
- `tests/` — Node test suite

## Commands

From repo root:

```bash
npm run generate:agent05
npm run generate:agent05-regional
npm run test:agent05
```
