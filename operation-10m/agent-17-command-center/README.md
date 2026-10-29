# Agent 17 — Game Intelligence / AI Command Center

Modular slice of ACC17 command-center **planning**, **validation**, **rollback**, and **goal verification** for Operation 10M. Canonical UI and full template catalog remain in `(V9.4) australia-game-with-ai.tsx` until Agent 25 assembly.

## Run verified tests

```bash
npm run test:agent17
```

Exit code `0` only when:

1. ACC17 dev harness passes (fingerprint, plans, evaluation, sanitize).
2. All registered goals (`G17-001` … `G17-012`) pass measured checks.
3. Goal registry coverage is complete.

## Layout

| Path | Role |
|------|------|
| `goals/` | Measurable goal registry |
| `planning/` | Fingerprints, ops state, templates, verification gates |
| `evaluation/` | Operations evaluator + deep context bundle |
| `validation/` | Goal verification pipeline |
| `rollback/` | Checkpoint stack + migration helper |
| `harness/` | Dev test report (parity with in-game ACC17 harness) |
| `tests/` | Node entrypoint |

## Integration

See [INTEGRATION.md](./INTEGRATION.md).
