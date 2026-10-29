# Agent 17 assembly contract (Agent 25)

## Module root

`operation-10m/agent-17-command-center/`

## Public entry

- `index.ts` re-exports planning, evaluation, rollback, validation, and harness symbols.
- Stable prefix for inlined symbols after assembly: `Agent17` / existing `acc17` names must remain byte-compatible with Section 15 ACC17 block where duplicated.

## Splice anchor (canonical TSX)

Insert assembled exports adjacent to:

```text
// SECTION 15: AI COMMAND CENTER
```

Do **not** duplicate `ACC17_PROJECT_TEMPLATE_CATALOG` until dedupe audit (Agent 25); prefer importing modular catalog subset or merging catalogs with id-stable union.

## State keys (save game)

| Key | Type | Owner |
|-----|------|--------|
| `commandCenterState` | `CommandCenterState` | existing V9.4 |
| `commandCenterSettings` | `CommandCenterSettings` | existing V9.4 |
| `acc17CommandCenterOpsState` | `Acc17CommandCenterOpsState` | Agent 17 ops pipeline |

Sanitizer entrypoint: `sanitizeAcc17CommandCenterOpsState` (modular) ≡ in-file ACC17 sanitizer.

## Verification gates before merge

1. `npm run test:agent17` → exit 0
2. cloc functional delta recorded in goal ledger checkpoint row
3. In-game `runAiCommandCenterAcc17DevTests()` still passes after inline (Agent 25)

## Rollback

Use `createAgent17RollbackController()` during assembly experiments; checkpoints store sanitized ops snapshots (max 16).

## Dependencies on other agents

| Agent | Contract |
|-------|----------|
| 16 Guardian co-pilot | Delegate target `copilot` / takeover session ids |
| 18 Team intelligence | `team_os` delegate kind + team summary (future) |
| 19 AI memory | Evidence adapters on deep context (optional inject) |
| 25 Build integration | Owns inline + LOC audit |

## Goals

All delivery goals are ids `G17-*` in `goals/goal-registry.ts`, verified in CI via `validation/goal-verification.ts` (not documentation-only).
