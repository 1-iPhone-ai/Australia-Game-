# Agent 18 — Team Intelligence / Multi-Agent

Extends Team Intelligence 2.0 with an explicit **multi-agent coordination layer**:

- **Role assignment** with exclusive region slots, hysteresis, and lock-aware reassignment.
- **Coordination orchestration** (leases, handoffs, parallel workstream barriers).
- **Duplicate-action safeguards** (idempotent action fingerprints aligned with canonical `duplicate_action_token`).

This tree is standalone TypeScript until Agent 25 assembly into `(V9.4) australia-game-with-ai.tsx`.

## Run self-tests

```bash
cd /workspace
npx --yes tsx operation-10m/agent-18-team-ai/run-self-tests.mts
```

## Layout

| Path | Purpose |
|------|---------|
| `src/types.ts` | Shared types and limits |
| `src/role-assignment-engine.ts` | Role slots + assignment |
| `src/coordination-orchestrator.ts` | Leases, mutexes, handoffs |
| `src/duplicate-action-guard.ts` | Fingerprint store + commit gate |
| `src/multi-agent-state.ts` | Layer evaluator + sanitize |
| `src/self-tests.ts` | Deterministic test suite |
| `run-self-tests.mts` | CLI runner |

See `../INTEGRATION.md` for assembly hooks.
