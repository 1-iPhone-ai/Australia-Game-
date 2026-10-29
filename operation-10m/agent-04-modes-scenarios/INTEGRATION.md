# Agent 04 — Modes / Missions / Scenarios

## Assembly target

Canonical merge path (Agent 25 only): append exports from `src/index.ts` into `(V9.4) australia-game-with-ai.tsx` via controlled assembly — **workers do not edit canonical TSX**.

## Exports

| Symbol | Purpose |
|--------|---------|
| `CANONICAL_GAME_MODE_SELECTIONS` | Frozen list matching `GameModeSelection` — regression guard |
| `O10M_OPERATION_SCENARIOS` | New preset scenarios (`o10m_*` ids) |
| `O10M_CHALLENGE_MODES` | Challenge overlays (AP, ironman, speed) |
| `O10M_MISSION_MILESTONES` | Cross-run milestone definitions |
| `O10M_ALT_VICTORY_RULES` | Optional / alternate victory evaluators |
| `mergePlayableScenarioCatalog` | `canonicalPresets + o10m` without id collision |
| `resolveModeInteraction` | Validates base mode + scenario + challenge combo |
| `evaluateO10mAltVictory` | Alt victory pass after primary scenario eval |
| `evaluateMissionMilestones` | Milestone progress from snapshot |
| `O10M_SCENARIO_CHAINS` | Multi-step scenario arcs (`o10m_chain_*`) |
| `advanceChainAfterRun` / `validateChainStepSelection` | Chain progression and gating |
| `O10M_SANDBOX_KNOB_PROFILES` | Named sandbox difficulty/economy profiles |
| `applySandboxKnobsToForcedSettings` | Merge validated knobs into forced settings |

## Dependencies on canonical (at assembly time)

Uses the same shapes as `ScenarioDefinition`, `GameModeSelection`, and scenario objective evaluators. Standalone copies live in `src/types.ts` until assembly replaces imports with canonical types.

## Assembly chunk (Agent 25)

| Path | Purpose |
|------|---------|
| `operation-10m/modules/agent-04-modes-scenarios/chunk.tsx` | `OP10M_MODULE_BEGIN/END agent-04-modes-scenarios` bundled body |
| `operation-10m/modules/agent-04-modes-scenarios/module.manifest.json` | Content hash + persist field hints |

Regenerate after `src/` changes:

```bash
cd operation-10m/agent-04-modes-scenarios && npm run bundle:agent-04-chunk
```

Chunk exports `runAgent04ModesScenariosSelfTests()` and `OP10M_AGENT04_MODULE_META`.

## Verification

From repo root:

```bash
cd operation-10m/agent-04-modes-scenarios && npm test && npm run typecheck
```
