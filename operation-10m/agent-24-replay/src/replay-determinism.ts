import { o6kAgent24Fingerprint } from './fingerprint.ts';
import {
  buildAgent24CausalRecordIndex,
  type Agent24CausalRecordIndex,
  type Agent24LedgerEventLike,
} from './causal-records.ts';
import { buildAgent24TimelineRegistry, type Agent24TimelineRegistry } from './timeline-registry.ts';
import { assessAgent24LateGameReplay, type Agent24LateGameReplayAssessment } from './late-game-replay.ts';
import {
  buildO6kHistoricalAnalyticsSnapshot,
  probeO6kReplayDeterminismTwice,
  type O6kHistoricalAnalyticsBuildInput,
  type O6kHistoricalAnalyticsSnapshot,
} from './history-replay-analytics.ts';
import { buildAgent24ReplayAnalyticsDepth, type Agent24ReplayAnalyticsDepth } from './analytics-depth.ts';

export interface Agent24ReplayDeterminismBundle {
  bundleId: string;
  snapshot: O6kHistoricalAnalyticsSnapshot;
  causalIndex: Agent24CausalRecordIndex;
  timelineRegistry: Agent24TimelineRegistry;
  lateGame: Agent24LateGameReplayAssessment;
  analyticsDepth: Agent24ReplayAnalyticsDepth;
  twinBuildPassed: boolean;
  compositeFingerprint: string;
}

export interface Agent24ReplayDeterminismVerifyResult {
  passed: boolean;
  probes: Array<{ name: string; passed: boolean; detail: string }>;
  compositeFingerprint: string;
}

export function buildAgent24ReplayDeterminismBundle(
  input: O6kHistoricalAnalyticsBuildInput & {
    maxTurns?: number;
    endgameStartTurn?: number;
    victoryDeclared?: boolean;
    checkpointKinds?: string[];
  },
): Agent24ReplayDeterminismBundle {
  const ledgerEvents = (input.gameActivityLedger?.events || []) as Agent24LedgerEventLike[];
  const causalIndex = buildAgent24CausalRecordIndex(ledgerEvents);
  const timelineRegistry = buildAgent24TimelineRegistry({
    matchId: input.matchId,
    activeTimelineId: input.activeTimelineId,
    activeNodeId: input.replayBranchTree?.activeNodeId,
    nodesById: input.replayBranchTree?.nodesById,
  });
  const lateGame = assessAgent24LateGameReplay({
    turn: input.turn,
    day: input.day,
    maxTurns: input.maxTurns,
    endgameStartTurn: input.endgameStartTurn,
    victoryDeclared: input.victoryDeclared,
    checkpointKinds: input.checkpointKinds,
  });
  const snapshot = buildO6kHistoricalAnalyticsSnapshot(input);
  const twin = probeO6kReplayDeterminismTwice(() => input);
  const partial = {
    snapshot,
    causalIndex,
    timelineRegistry,
    lateGame,
    twinBuildPassed: twin.passed,
  };
  const analyticsDepth = buildAgent24ReplayAnalyticsDepth(partial);
  const compositeFingerprint = o6kAgent24Fingerprint('replay_bundle', {
    snap: snapshot.integrity.fingerprint,
    causal: causalIndex.deterministicFingerprint,
    timeline: timelineRegistry.deterministicFingerprint,
    late: lateGame.fingerprint,
    depth: analyticsDepth.deterministicFingerprint,
  });

  return {
    bundleId: o6kAgent24Fingerprint('replay_bundle_id', { matchId: input.matchId, turn: input.turn }),
    ...partial,
    analyticsDepth,
    compositeFingerprint,
  };
}

export function verifyAgent24ReplayDeterminism(
  build: () => Parameters<typeof buildAgent24ReplayDeterminismBundle>[0],
): Agent24ReplayDeterminismVerifyResult {
  const a = buildAgent24ReplayDeterminismBundle(build());
  const b = buildAgent24ReplayDeterminismBundle(build());
  const probes = [
    {
      name: 'historical_snapshot_twin',
      passed: a.snapshot.integrity.fingerprint === b.snapshot.integrity.fingerprint,
      detail: 'Twin snapshot integrity fingerprints',
    },
    {
      name: 'causal_index_twin',
      passed: a.causalIndex.deterministicFingerprint === b.causalIndex.deterministicFingerprint,
      detail: 'Twin causal index fingerprints',
    },
    {
      name: 'timeline_registry_twin',
      passed: a.timelineRegistry.deterministicFingerprint === b.timelineRegistry.deterministicFingerprint,
      detail: 'Twin timeline registry fingerprints',
    },
    {
      name: 'late_game_twin',
      passed: a.lateGame.fingerprint === b.lateGame.fingerprint,
      detail: 'Twin late-game assessment fingerprints',
    },
    {
      name: 'analytics_depth_twin',
      passed: a.analyticsDepth.deterministicFingerprint === b.analyticsDepth.deterministicFingerprint,
      detail: 'Twin analytics depth fingerprints',
    },
    {
      name: 'composite_twin',
      passed: a.compositeFingerprint === b.compositeFingerprint,
      detail: 'Twin composite bundle fingerprint',
    },
  ];
  return {
    passed: probes.every(p => p.passed),
    probes,
    compositeFingerprint: a.compositeFingerprint,
  };
}
