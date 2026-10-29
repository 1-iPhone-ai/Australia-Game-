# Agent 24 — History / Replay / Late Game

Modular source for timelines, causal ledger records, replay determinism probes, and late-game checkpoint policy. Agent 25 inlines `src/history-replay-analytics.ts` (and new helpers) at `// O6K_AGENT24_INTEGRATION_ANCHOR` in `(V9.4) australia-game-with-ai.tsx`.

## Layout

| Path | Role |
|------|------|
| `src/fingerprint.ts` | FNV-1a + stable JSON stringify (no wall-clock fields) |
| `src/causal-records.ts` | Deterministic causal chain index from ledger events |
| `src/timeline-registry.ts` | Main / branch / what-if timeline registry |
| `src/late-game-replay.ts` | Endgame / overtime phase + checkpoint recommendations |
| `src/replay-determinism.ts` | Composite bundle + twin-build verification |
| `src/history-replay-analytics.ts` | Extracted V9.4 O6K block (milestones + dashboard) |
| `tests/agent24-replay.test.ts` | Node test suite |

## Tests

```bash
cd operation-10m/agent-24-replay && npm test
```

## Integration

See `operation-10m/agent-24-replay/INTEGRATION.md` and project store `internal/agents/agent-24-integration-contract.md`.
