# Operation 111 — Agent 51 Government Simulation Integration Contract

**Canonical copy (Project Context):** see Project store  
`docs/operation-111-agent-51-government-integration-contract.md`

This file exists on branch `op111/agent-51-gov` so Agent 111 can diff repo artifacts without opening Context.

## Quick reference

| Item | Value |
|------|--------|
| National government sim | V10.11 §20AD ~164351–169831 |
| Team governance | §15 `evaluateGovernanceProposal`; settings `teamGovernanceMode` |
| Guardian “governance” framing | §10 ~42713–43604 |
| Settings | `nationalSystemsEnabled` + `stateCapacityEnabled` |
| Persisted key | `gameState.stateCapacity` via `sanitizeStateCapacityPersisted` |
| Regression | LAB `v1011` — 52 tests (`runV1011AdaptiveGovernanceSelfTests`) |
| Live hook | ~214562 `buildStateCapacityInputs` → `computeNationalStateCapacity` |

Full contract text is maintained in Project Context (link above). Agent 51 does **not** merge into `(V9.4) australia-game-with-ai.tsx`; Agent 111 integrates using this contract.
