# Agent 22 — scale wave round 26 (v1.26.0)

Task: **O10-183** scale wave round 26. **Push-first** on origin (gate holdout).

Wave baseline (coord): **`de3079f9`** / **1,563,481** projected. Builds on round 25 @ **`813dce7d`**.

## PR

[#332](https://github.com/1-iPhone-ai/Australia-Game-/pull/332) · `op10m/agent-22-ui` (open)

## Tests

```bash
cd operation-10m/agent-22-ui && npm test && npm run typecheck
```

**111/111** Vitest (32 files). Chunk suite: `runOp10mAgent22EvolvingUiSelfTests()` (+ embedded `runAgent22Round26SelfTests()` with 12 checks).

## Chunk

| Item | Value |
|------|--------|
| Path | `operation-10m/modules/agent-22-ui/chunk.tsx` |
| Lines | **13014** |
| Version | `1.26.0` |
| OP10M prefix | `f4f58563a2b698fc` |

## Manifest SHA

`operation-10m/modules/agent-22-ui/module.manifest.json`

```
contentSha256: f4f58563a2b698fc941206628ac82913ca68136a4dcdd5fccb6781d7a9e1e413
```

Regenerate: `npm run build:agent22-chunk`

Commit: **`25657cab`** — `feat(agent-22-ui): O10-183 scale wave round 26 (v1.26.0)`

## Round 26 depth

- **Guided learning panel day coach** — tick `guidedLearningPanelDayCoachCopy`
- **Calm recovery status day coach** — tick `calmRecoveryStatusDayCoachCopy`
- **Phase shell attention day coach** — tick `phaseShellAttentionDayCoachCopy`
- **Modal focus trap day coach** — tick `modalFocusTrapDayCoachCopy` (tick context `openModalId`)
- `runAgent22Round26SelfTests()` (12 embedded checks)

## V9.4

No canonical edits. No promote-tranche.
