# Agent 24 integration contract

**Anchor:** `// O6K_AGENT24_INTEGRATION_ANCHOR` in `(V9.4) australia-game-with-ai.tsx`

**Module root:** `operation-10m/agent-24-replay/`

## Assembly (Agent 25)

1. Inline `src/history-replay-analytics.ts` at the anchor (replace existing block).
2. Append or merge exports from:
   - `buildAgent24CausalRecordIndex`, `pickCausalChain`
   - `buildAgent24TimelineRegistry`
   - `assessAgent24LateGameReplay`, `classifyAgent24MatchPhase`
   - `buildAgent24ReplayDeterminismBundle`, `verifyAgent24ReplayDeterminism`
3. Wire reducer patch `applyO6kHistoricalAnalyticsCachePatch` on turn advance (existing).
4. Optional: attach `causalIndex` + `timelineRegistry` to `ExtendedGameState.o6kHistoricalAnalytics`.

## Reducer / state keys

| Key | Type |
|-----|------|
| `o6kHistoricalAnalytics.latest` | `O6kHistoricalAnalyticsSnapshot` |
| `o6kHistoricalAnalytics.history` | rolling snapshot list (max 32) |
| `o6kHistoricalAnalytics.causalIndex` | `Agent24CausalRecordIndex` (new) |
| `o6kHistoricalAnalytics.timelineRegistry` | `Agent24TimelineRegistry` (new) |

## Determinism rules

- Exclude `createdAtTimestamp`, `timestamp`, `*AtMs` from fingerprints.
- Sort object keys and branch IDs before hashing.
- Twin-build probes must pass in CI (`npm test` in module root).

## Version

- `O6K_AGENT24_MODULE_VERSION`: bump on assembly
- `AGENT24_REPLAY_MODULE_ROOT`: constant path for tooling
