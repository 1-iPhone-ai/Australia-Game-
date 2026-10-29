# Agent 05 — Dynamic Events & Narrative

State-triggered crisis chains with cooldowns, passive persistent modifiers, and player responses that mutate simulation state (money, stability, flags, active crisis counts).

## Layout

- `src/` — runtime engine (triggers, cooldowns, consequences, tick/resolve)
- `generated/chain-catalog-tranche4.ts` — 320 national lattice chains
- `generated/chain-catalog-tranche6.ts` — 320 reconcile-wave chains (`scripts/generate-catalog-tranche6.py`)
- `generated/chain-catalog-tranche7.ts` — 320 drift-settle-wave chains (`scripts/generate-catalog-tranche7.py`)
- `generated/chain-catalog-tranche8.ts` — 320 pending-lattice chains (`scripts/generate-catalog-tranche8.py`)
- `generated/chain-catalog-tranche9.ts` — 320 stabilization-lattice chains (`scripts/generate-catalog-tranche9.py`)
- `generated/chain-catalog-tranche10.ts` — 320 closure-lattice chains (`scripts/generate-catalog-tranche10.py`)
- `src/pending-response-expiry-coordinator.ts` — expired dilemma prune + queue-clear flags on compute hook
- `src/pending-response-stabilization-coordinator.ts` — post-clear calm + stabilization wave flags on compute hook
- `src/pending-stabilization-closure-coordinator.ts` — digest closure latch after finalize on compute hook
- `src/compute-turn-reconcile.ts` — digest drift reconcile + eligibility priming on compute turn hook
- `src/compute-turn-drift-settle.ts` — drift settlement + turn-gap ack flags on compute turn hook
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
