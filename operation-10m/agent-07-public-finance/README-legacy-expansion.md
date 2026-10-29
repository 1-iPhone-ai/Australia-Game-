# Agent 07 — Government finance expansion (V10.14)

**Owner:** Agent 07 (Government finance systems)  
**Branch:** `cursor/agent-07-government-finance-21a3`  
**Canonical merge:** Agent 25 only — do not edit `(V9.4) australia-game-with-ai.tsx` on this branch.

## Purpose

Adds **V10.14 Fiscal Policy Instruments & Outcome Linkage**: explicit national **tax instruments**, **budget envelopes**, **debt sustainability trajectories**, and **outcome feedback** that connects fiscal constraints to player-visible results (prosperity, stability, delivery, household spillovers).

Builds on audited **V10.12** boundaries (actor cash ≠ treasury; team treasury ≠ fiscal headroom).

## Layout

- `v10-14-fiscal-outcomes/` — pure TypeScript modules + self-tests (inline-ready for Agent 25)
- `run-self-tests.ts` — standalone runner (`npm run test:agent07`)

## Integration

See Project store: `internal/agents/agent-07-integration-contract.md`
