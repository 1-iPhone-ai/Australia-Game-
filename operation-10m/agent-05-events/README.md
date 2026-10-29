# Agent 05 — Dynamic Events & Narrative

State-triggered crisis chains with cooldowns, passive persistent modifiers, and player responses that mutate simulation state (money, stability, flags, active crisis counts).

## Layout

- `src/` — runtime engine (triggers, cooldowns, consequences, tick/resolve)
- `generated/chain-catalog.ts` — 600 chain descriptors (`scripts/generate-catalog.py`)
- `tests/` — Node test suite

## Commands

From repo root:

```bash
npm run generate:agent05
npm run test:agent05
```
