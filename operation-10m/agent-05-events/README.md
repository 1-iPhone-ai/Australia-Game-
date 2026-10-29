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
- `generated/chain-catalog-tranche11.ts` — 320 integration-sync-lattice chains (`scripts/generate-catalog-tranche11.py`)
- `generated/chain-catalog-tranche12.ts` — 320 assembly-handoff-lattice chains (`scripts/generate-catalog-tranche12.py`)
- `generated/chain-catalog-tranche13.ts` — 320 chunk-assembly-seal lattice chains (`scripts/generate-catalog-tranche13.py`)
- `generated/chain-catalog-tranche14.ts` — 320 module-manifest-anchor lattice chains (`scripts/generate-catalog-tranche14.py`)
- `generated/chain-catalog-tranche15.ts` — 320 inline-assembly-lock lattice chains (`scripts/generate-catalog-tranche15.py`)
- `generated/chain-catalog-tranche16.ts` — 320 post-crisis-slot-commit lattice chains (`scripts/generate-catalog-tranche16.py`)
- `generated/chain-catalog-tranche17.ts` — 320 scale-wave-bundle-latch lattice chains (`scripts/generate-catalog-tranche17.py`)
- `generated/chain-catalog-tranche18.ts` — 320 scale-wave-catalog-commit lattice chains (`scripts/generate-catalog-tranche18.py`)
- `generated/chain-catalog-tranche19.ts` — 320 scale-wave-origin-gate lattice chains (`scripts/generate-catalog-tranche19.py`)
- `generated/chain-catalog-tranche20.ts` — 320 scale-wave-projection-latch lattice chains (`scripts/generate-catalog-tranche20.py`)
- `generated/chain-catalog-tranche21.ts` — 320 scale-wave-dry-run-gate lattice chains (`scripts/generate-catalog-tranche21.py`)
- `generated/chain-catalog-tranche22.ts` — 320 scale-wave-gate-closure-latch lattice chains (`scripts/generate-catalog-tranche22.py`)
- `generated/chain-catalog-tranche23.ts` — 320 scale-wave-post-closure-commit lattice chains (`scripts/generate-catalog-tranche23.py`)
- `generated/chain-catalog-tranche24.ts` — 320 scale-wave-tranche-sync-latch lattice chains (`scripts/generate-catalog-tranche24.py`)
- `generated/chain-catalog-tranche25.ts` — 320 scale-wave-tranche-ready-commit lattice chains (`scripts/generate-catalog-tranche25.py`)
- `generated/chain-catalog-tranche26.ts` — 320 scale-wave-full-chunks-latch lattice chains (`scripts/generate-catalog-tranche26.py`)
- `generated/chain-catalog-tranche27.ts` — 320 scale-wave-full-chunks-commit lattice chains (`scripts/generate-catalog-tranche27.py`)
- `generated/chain-catalog-tranche28.ts` — 320 scale-wave-full-chunks-sync-latch lattice chains (`scripts/generate-catalog-tranche28.py`)
- `generated/chain-catalog-tranche29.ts` — 320 scale-wave-full-chunks-sync-commit lattice chains (`scripts/generate-catalog-tranche29.py`)
- `generated/chain-catalog-tranche30.ts` — 320 scale-wave-full-chunks-handoff-latch lattice chains (`scripts/generate-catalog-tranche30.py`)
- `src/pending-response-expiry-coordinator.ts` — expired dilemma prune + queue-clear flags on compute hook
- `src/pending-response-stabilization-coordinator.ts` — post-clear calm + stabilization wave flags on compute hook
- `src/pending-stabilization-closure-coordinator.ts` — digest closure latch after finalize on compute hook
- `src/compute-turn-integration-sync-coordinator.ts` — integration sync gate for Agent 25 assembly after closure
- `src/compute-turn-assembly-handoff-coordinator.ts` — sync manifest latch for chunk assembly handoff
- `src/compute-turn-chunk-assembly-seal-coordinator.ts` — handoff manifest commit after assembly handoff
- `src/compute-turn-module-manifest-anchor-coordinator.ts` — chunk inline readiness after assembly seal
- `src/compute-turn-inline-assembly-lock-coordinator.ts` — Agent 25 slot readiness after manifest anchor
- `src/compute-turn-post-crisis-slot-commit-coordinator.ts` — chunk manifest sealed after inline assembly lock
- `src/compute-turn-scale-wave-bundle-latch-coordinator.ts` — Agent 25 assembly wave readiness after manifest seal
- `src/compute-turn-scale-wave-catalog-commit-coordinator.ts` — scale-wave catalog commit after bundle latch
- `src/compute-turn-scale-wave-origin-gate-coordinator.ts` — scale-wave origin gate after catalog commit
- `src/compute-turn-scale-wave-projection-latch-coordinator.ts` — projection wave latch after origin gate
- `src/compute-turn-scale-wave-dry-run-gate-coordinator.ts` — dry-run gate after projection latch
- `src/compute-turn-scale-wave-gate-closure-latch-coordinator.ts` — gate closure latch after dry-run gate
- `src/compute-turn-scale-wave-post-closure-commit-coordinator.ts` — post-closure commit after gate closure latch
- `src/compute-turn-scale-wave-tranche-sync-latch-coordinator.ts` — tranche sync latch after post-closure commit
- `src/compute-turn-scale-wave-tranche-ready-commit-coordinator.ts` — tranche ready commit after sync latch
- `src/compute-turn-scale-wave-full-chunks-latch-coordinator.ts` — full-chunks wave latch after tranche ready commit
- `src/compute-turn-scale-wave-full-chunks-commit-coordinator.ts` — full-chunks wave commit after full-chunks latch
- `src/compute-turn-scale-wave-full-chunks-sync-latch-coordinator.ts` — full-chunks sync latch after full-chunks commit
- `src/compute-turn-scale-wave-full-chunks-sync-commit-coordinator.ts` — full-chunks sync commit after sync latch
- `src/compute-turn-scale-wave-full-chunks-handoff-latch-coordinator.ts` — full-chunks handoff latch after sync commit
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
