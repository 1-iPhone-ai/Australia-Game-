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
import { runAgent24ReplayScenarioSuite, type Agent24ReplayScenarioSuiteResult } from './replay-scenarios.ts';
import { buildAgent24AuditTrail, type Agent24AuditTrail, type Agent24AuditTrailAction } from './audit-trails.ts';
import { buildAgent24MultiSessionContinuity, type Agent24MultiSessionContinuity } from './multi-session.ts';
import { buildAgent24TimelineDivergenceReport, type Agent24TimelineDivergenceReport } from './timeline-divergence.ts';
import { buildAgent24HistoryRollupReport, type Agent24HistoryRollupReport } from './history-rollups.ts';
import { buildAgent24ReplayAttestation, type Agent24ReplayAttestation } from './replay-attestation.ts';

export interface Agent24ReplayDeterminismBundle {
  bundleId: string;
  snapshot: O6kHistoricalAnalyticsSnapshot;
  causalIndex: Agent24CausalRecordIndex;
  timelineRegistry: Agent24TimelineRegistry;
  lateGame: Agent24LateGameReplayAssessment;
  analyticsDepth: Agent24ReplayAnalyticsDepth;
  scenarioSuite: Agent24ReplayScenarioSuiteResult;
  auditTrail: Agent24AuditTrail;
  multiSession: Agent24MultiSessionContinuity;
  timelineDivergence: Agent24TimelineDivergenceReport;
  historyRollup: Agent24HistoryRollupReport;
  attestation: Agent24ReplayAttestation;
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
    auditTrailEntries?: Array<{
      action: Agent24AuditTrailAction;
      actorId?: string;
      summary: string;
      relatedTimelineId?: string | null;
      relatedSessionId?: string | null;
      turn?: number;
      day?: number;
    }>;
    sessions?: Array<{
      sessionId: string;
      startedAtTurn: number;
      endedAtTurn: number;
      replayEventCount: number;
      branchNodeCount: number;
    }>;
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
  const branchNodeCount = Object.keys(input.replayBranchTree?.nodesById || {}).length;
  const replayEventCount = input.replay?.events?.length ?? snapshot.integrity.replayEventCount;
  const scenarioSuite = runAgent24ReplayScenarioSuite({
    replayEventCount,
    branchNodeCount,
    isLateGame: lateGame.isLateGame,
    maxCausalDepth: causalIndex.maxDepth,
    sessionCount: input.sessions?.length ?? 1,
  });
  const defaultAudit: Array<{
    action: Agent24AuditTrailAction;
    summary: string;
    relatedTimelineId?: string | null;
  }> = [
    { action: 'replay_checkpoint', summary: 'Auto checkpoint on bundle build', relatedTimelineId: input.activeTimelineId || 'main' },
    { action: 'determinism_verified', summary: twin.passed ? 'Twin build passed' : 'Twin build failed' },
    { action: 'scenario_evaluated', summary: `Scenarios satisfied ${scenarioSuite.satisfiedCount}/${scenarioSuite.assessments.length}` },
  ];
  const auditTrail = buildAgent24AuditTrail({
    matchId: input.matchId,
    turn: input.turn,
    day: input.day,
    entries: [...defaultAudit, ...(input.auditTrailEntries || [])],
  });
  const multiSession = buildAgent24MultiSessionContinuity({
    matchId: input.matchId,
    sessions:
      input.sessions && input.sessions.length > 0
        ? input.sessions
        : [
            {
              sessionId: `${input.matchId}_session_1`,
              startedAtTurn: 1,
              endedAtTurn: input.turn,
              replayEventCount,
              branchNodeCount,
            },
          ],
  });
  const timelineDivergence = buildAgent24TimelineDivergenceReport({
    matchId: input.matchId,
    registry: timelineRegistry,
  });
  const historyRollup = buildAgent24HistoryRollupReport({
    matchId: input.matchId,
    snapshot,
    windowSize: input.maxTurns && input.maxTurns > 30 ? 15 : 10,
  });
  const partialBundle = {
    snapshot,
    causalIndex,
    timelineRegistry,
    lateGame,
    twinBuildPassed: twin.passed,
    analyticsDepth,
    scenarioSuite,
    auditTrail,
    multiSession,
  };
  const attestation = buildAgent24ReplayAttestation({ ...partialBundle, compositeFingerprint: '' });
  const compositeFingerprint = o6kAgent24Fingerprint('replay_bundle', {
    snap: snapshot.integrity.fingerprint,
    causal: causalIndex.deterministicFingerprint,
    timeline: timelineRegistry.deterministicFingerprint,
    late: lateGame.fingerprint,
    depth: analyticsDepth.deterministicFingerprint,
    scenarios: scenarioSuite.deterministicFingerprint,
    audit: auditTrail.deterministicFingerprint,
    sessions: multiSession.deterministicFingerprint,
    divergence: timelineDivergence.deterministicFingerprint,
    rollup: historyRollup.deterministicFingerprint,
    attestation: attestation.deterministicFingerprint,
  });
  const attestationFinal = buildAgent24ReplayAttestation({ ...partialBundle, compositeFingerprint });

  return {
    bundleId: o6kAgent24Fingerprint('replay_bundle_id', { matchId: input.matchId, turn: input.turn }),
    ...partialBundle,
    timelineDivergence,
    historyRollup,
    attestation: attestationFinal,
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
      name: 'scenario_suite_twin',
      passed: a.scenarioSuite.deterministicFingerprint === b.scenarioSuite.deterministicFingerprint,
      detail: 'Twin replay scenario suite fingerprints',
    },
    {
      name: 'audit_trail_twin',
      passed: a.auditTrail.deterministicFingerprint === b.auditTrail.deterministicFingerprint,
      detail: 'Twin audit trail fingerprints',
    },
    {
      name: 'multi_session_twin',
      passed: a.multiSession.deterministicFingerprint === b.multiSession.deterministicFingerprint,
      detail: 'Twin multi-session continuity fingerprints',
    },
    {
      name: 'timeline_divergence_twin',
      passed: a.timelineDivergence.deterministicFingerprint === b.timelineDivergence.deterministicFingerprint,
      detail: 'Twin timeline divergence report fingerprints',
    },
    {
      name: 'history_rollup_twin',
      passed: a.historyRollup.deterministicFingerprint === b.historyRollup.deterministicFingerprint,
      detail: 'Twin history rollup fingerprints',
    },
    {
      name: 'attestation_twin',
      passed: a.attestation.deterministicFingerprint === b.attestation.deterministicFingerprint,
      detail: 'Twin replay attestation fingerprints',
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
