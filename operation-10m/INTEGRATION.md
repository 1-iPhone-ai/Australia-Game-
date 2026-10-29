# Operation 10M — Integration contracts

Modular work lives under `operation-10m/agent-NN-*` until Agent 25 assembles into `(V9.4) australia-game-with-ai.tsx`.

## Assembly rules (all agents)

- Pure planning / advisory layers only unless the canonical executor already owns the action path.
- No second team plan: extensions feed `teamOperatingSystem` and Strategic Command sync hooks.
- Deterministic evaluation: identical inputs → identical serialized state (no randomness).
- Self-tests must pass via each module's runner before merge.

## Agent 18 — Team Intelligence / Multi-Agent

| Field | Value |
|--------|--------|
| Root | `operation-10m/agent-18-team-ai/` |
| Branch | `op10m/agent-18-team-ai` |
| Canonical touchpoints | `assignTeamRoles`, `evaluateTeamOperatingSystem`, `syncTeamOsForDirectives`, action pipeline `duplicate_action_token` |
| Persisted slice (proposed) | `gameState.teamMultiAgentCoordination` |

### Import surface (assembly)

Agent 25 should wire:

```ts
import {
  evaluateTeamMultiAgentLayer,
  sanitizeTeamMultiAgentCoordinationState,
  runAgent18TeamMultiAgentSelfTests,
} from './operation-10m/agent-18-team-ai/src/index.ts';
```

Hook points:

1. **After** `assignTeamRoles` inside `evaluateTeamOperatingSystem`: pass roles + task graph through `evaluateTeamMultiAgentLayer` to attach coordination leases and duplicate-action reservations.
2. **Before** Strategic Command generates directives: call `syncMultiAgentCoordinationForDirectives(teamId, live)` (wrapper in assembly) so AI teammates never receive conflicting goals for the same exclusive slot.
3. **Action commit path**: consult `DuplicateActionGuard.tryCommit(fingerprint)` with the same `executionGeneration` the canonical executor uses; map `blocked` → `duplicate_action_token`.
4. **Region mutex**: use `buildMutexMapWithPriorityArbitration` / `coordination.arbitrationLog` so defend-vs-take and explicit/locked edge cases match Team OS tier rules before Strategic Command sync.
5. **Strategic Command**: pass directive proposals through `coordinateTeammateDirectives` before issuing AI teammate goals; persist `state.meta.directiveConstraints` and `state.auditFindings`.

### Test gate

```bash
npx --yes tsx operation-10m/agent-18-team-ai/run-self-tests.mts
npm run build:agent18-chunk
```

Expected: all tests pass, exit code 0; chunk has no top-level `import` lines.

### Assembly chunk

| Field | Value |
|--------|--------|
| Path | `operation-10m/modules/agent-18-team-ai/chunk.tsx` |
| Markers | `OP10M_MODULE_BEGIN agent-18-team-ai` … `OP10M_MODULE_END agent-18-team-ai` |
| Regenerate | `npm run build:agent18-chunk` |
