# Operation 10M — Integration contracts

Modular work lives under `operation-10m/agent-NN-*` until Agent 25 controlled assembly into `(V9.4) australia-game-with-ai.tsx`.

## Agent 19 — AI memory, evaluation, explainability

| Field | Value |
|--------|--------|
| Root | `operation-10m/agent-19-ai-memory/` |
| Assembly chunk | `operation-10m/modules/agent-19-ai-memory/chunk.tsx` (`OP10M_MODULE_BEGIN agent-19-ai-memory`) |
| Regenerate | `npm run build:agent19-chunk` |
| Canonical anchor | V9.4 `SECTION 1B` (inlined AI memory) + Agent 19 horizon / influence slices |
| Assembly | Agent 25 inlines `chunk.tsx` or merges modular sources after parity tests pass |

### Exported surface (pre-assembly)

- `buildAiMemoryHorizonSnapshot` — match vs cross-match prior labeling (`horizon.ts`)
- `auditMemoryInfluenceDecisions` — bounded influence + trace integrity (`influence-audit.ts`)
- `buildMemoryExplainabilityBrief` — player-facing explainability lines (`explainability.ts`)
- `buildTurnExplainabilityPack` — turn rollup for horizon diff + influence + timeline (`turn-explainability-pack.ts`)
- `runAgent19MemoryEvalSuite` — modular eval + canonical Phase 7 parity (`eval/run-suite.ts`)

### Invariants (must hold after merge)

1. Memory influence never removes decision options (cardinality preserved).
2. `memoryInfluence` deltas stay within documented caps; slices sum ≈ total influence.
3. Rival inspection redaction unchanged; horizon snapshot always present on inspection views.
4. Explainability disclaimer states rule-based, non-neural, non-veto behavior.

### Verification

```bash
npm run test:agent19
```
