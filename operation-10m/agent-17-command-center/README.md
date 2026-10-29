# Agent 17 — Game Intelligence / AI Command Center

Modular slice of ACC17 command-center **planning**, **validation**, **rollback**, and **goal verification** for Operation 10M. Canonical UI and full template catalog remain in `(V9.4) australia-game-with-ai.tsx` until Agent 25 assembly.

## Run verified tests

```bash
npm run test:agent17
```

Exit code `0` only when:

1. ACC17 dev harness passes (6 checks).
2. Recovery path harness passes (8 checks).
3. Planning, delegation, coordination, and execution depth harnesses pass.
4. All registered goals (`G17-001` … `G17-036`) pass measured checks.
5. Goal registry coverage is complete.

## Layout

| Path | Role |
|------|------|
| `goals/` | Measurable goal registry |
| `planning/deep-templates.ts` | 4–6 step templates with prerequisite chains |
| `planning/recovery-paths.ts` | Signal detection, lane selection, replan on blocked steps |
| `planning/execution-pacing.ts` | Turn budget, verification-gated advance, delegate cooldown |
| `planning/resilience-scorecard.ts` | Recovery pressure + verification stability composite |
| `evaluation/` | Operations evaluator + deep context bundle |
| `validation/` | Goal verification pipeline |
| `rollback/` | Checkpoint stack + migration helper |
| `harness/` | Dev test report (parity with in-game ACC17 harness) |
| `tests/` | Node entrypoint |
| `scripts/build-chunk.mjs` | Emits `operation-10m/modules/agent-17-command-center/chunk.tsx` |

Regenerate assembly chunk: `npm run build:agent17-chunk`.

## Integration

See [INTEGRATION.md](./INTEGRATION.md).
