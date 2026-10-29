# V9.4 integration snippet — Agent 24

## 1. Anchor (insert full module above default export)

Search for `O6K_AGENT24_INTEGRATION_ANCHOR` in `(V9.4) australia-game-with-ai.tsx` and paste contents of `o6k-agent-24-historical-replay-analytics.tsx` immediately **before** the anchor line (module includes its own imports — dedupe React import on merge).

## 2. Replay Dashboard tab

```typescript
type ReplayDashboardTabId = 'watch' | 'timeline' | 'decisions' | 'compare' | 'branches' | 'integrity' | 'developer' | 'historical';
const REPLAY_DASHBOARD_TAB_ORDER: ReplayDashboardTabId[] = [..., 'historical'];
const REPLAY_DASHBOARD_TAB_LABELS: Record<ReplayDashboardTabId, string> = {
  // ...
  historical: 'Historical Analytics',
};
```

In `renderReplayViewer`, when `replayDashboardTab === 'historical'`:

```typescript
const histInput: O6kHistoricalAnalyticsBuildInput = {
  matchId: gameState.match?.matchId || 'match_main',
  turn: gameState.turn,
  day: gameState.day,
  activeTimelineId: gameState.replayBranchTree?.activeNodeId,
  replayBranchTree: gameState.replayBranchTree,
  gameActivityLedger: gameState.gameActivityLedger,
  replay: gameState.replay,
  teamsById: teamsByIdRef.current,
  regionalStanding: /* existing standing selector */,
  deterministicMode: gameSettings.randomnessMode === 'deterministic',
};
const histSnap = buildO6kHistoricalAnalyticsSnapshot(histInput);
return <O6kHistoricalAnalyticsDashboard snapshot={histSnap} onClose={() => setReplayDashboardTab('watch')} />;
```

## 3. Turn-end cache (optional)

After canonical turn reducer success:

```typescript
nextState = applyO6kHistoricalAnalyticsCachePatch(nextState as any, { ...histInput, turn: nextState.turn, day: nextState.day }) as any;
```

## 4. Diagnostics

Register in developer/replay integrity panel:

```typescript
const agent24 = runO6kAgent24SelfTests();
console.log(formatO6kAgent24SelfTestReport(agent24));
```
