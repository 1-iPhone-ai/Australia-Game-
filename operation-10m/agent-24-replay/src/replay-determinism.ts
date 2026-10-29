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
import {
  buildAgent24CheckpointCoverageReport,
  extractAgent24CheckpointTurnsFromReplay,
  type Agent24CheckpointCoverageReport,
} from './checkpoint-coverage.ts';
import { buildAgent24RewindSafetyReport, type Agent24RewindSafetyReport } from './rewind-safety.ts';
import {
  buildAgent24HistoryReconciliationReport,
  type Agent24HistoryReconciliationReport,
} from './history-reconciliation.ts';
import {
  buildAgent24ReplayPlaybackIntegrityReport,
  type Agent24ReplayPlaybackIntegrityReport,
} from './replay-playback-integrity.ts';
import { buildAgent24BranchLineageReport, type Agent24BranchLineageReport } from './branch-lineage.ts';
import { buildAgent24ExportReadinessReport, type Agent24ExportReadinessReport } from './export-readiness.ts';
import { buildAgent24ExportManifest, type Agent24ExportManifest } from './export-manifest.ts';
import {
  buildAgent24ImportValidationReport,
  type Agent24ImportValidationReport,
} from './import-validation.ts';
import {
  buildAgent24HistoryRetentionReport,
  type Agent24HistoryRetentionReport,
} from './history-retention.ts';
import { buildAgent24ArchiveCompactionPlan, type Agent24ArchiveCompactionPlan } from './archive-compaction.ts';
import {
  buildAgent24ReplayTransferGateReport,
  type Agent24ReplayTransferGateReport,
} from './replay-transfer-gate.ts';
import { buildAgent24SnapshotSeal, type Agent24SnapshotSeal } from './snapshot-seal.ts';
import {
  buildAgent24SealVerificationReport,
  type Agent24SealVerificationReport,
} from './seal-verification.ts';
import {
  buildAgent24ReplayRestoreGateReport,
  type Agent24ReplayRestoreGateReport,
} from './replay-restore-gate.ts';
import { buildAgent24ArchivePublishPlan, type Agent24ArchivePublishPlan } from './archive-publish-plan.ts';

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
  checkpointCoverage: Agent24CheckpointCoverageReport;
  rewindSafety: Agent24RewindSafetyReport;
  historyReconciliation: Agent24HistoryReconciliationReport;
  playbackIntegrity: Agent24ReplayPlaybackIntegrityReport;
  branchLineage: Agent24BranchLineageReport;
  exportReadiness: Agent24ExportReadinessReport;
  exportManifest: Agent24ExportManifest;
  importValidation: Agent24ImportValidationReport;
  historyRetention: Agent24HistoryRetentionReport;
  archiveCompaction: Agent24ArchiveCompactionPlan;
  replayTransferGate: Agent24ReplayTransferGateReport;
  snapshotSeal: Agent24SnapshotSeal;
  sealVerification: Agent24SealVerificationReport;
  replayRestoreGate: Agent24ReplayRestoreGateReport;
  archivePublishPlan: Agent24ArchivePublishPlan;
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
  const checkpointTurns = extractAgent24CheckpointTurnsFromReplay(input.replay);
  const checkpointCoverage = buildAgent24CheckpointCoverageReport({
    matchId: input.matchId,
    snapshot,
    lateGame,
    maxTurns: input.maxTurns,
    checkpointTurns,
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
  const attestationDraft = buildAgent24ReplayAttestation({ ...partialBundle, compositeFingerprint: '' });
  const rewindSafety = buildAgent24RewindSafetyReport({
    matchId: input.matchId,
    currentTurn: input.turn,
    registry: timelineRegistry,
    auditTrail,
    checkpointCoverage,
  });
  const historyReconciliation = buildAgent24HistoryReconciliationReport({
    matchId: input.matchId,
    multiSession,
    auditTrail,
    attestation: attestationDraft,
  });
  const playbackIntegrity = buildAgent24ReplayPlaybackIntegrityReport({
    matchId: input.matchId,
    currentTurn: input.turn,
    replay: input.replay,
  });
  const branchLineage = buildAgent24BranchLineageReport({
    matchId: input.matchId,
    registry: timelineRegistry,
    nodesById: input.replayBranchTree?.nodesById,
  });
  const exportReadiness = buildAgent24ExportReadinessReport({
    matchId: input.matchId,
    attestation: attestationDraft,
    historyReconciliation,
    checkpointCoverage,
    playbackIntegrity,
    rewindSafety,
  });
  const compositeForAttestation = o6kAgent24Fingerprint('replay_bundle', {
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
    attestation: attestationDraft.deterministicFingerprint,
    checkpointCoverage: checkpointCoverage.deterministicFingerprint,
    rewindSafety: rewindSafety.deterministicFingerprint,
    reconciliation: historyReconciliation.deterministicFingerprint,
    playbackIntegrity: playbackIntegrity.deterministicFingerprint,
    branchLineage: branchLineage.deterministicFingerprint,
    exportReadiness: exportReadiness.deterministicFingerprint,
  });
  const attestationFinal = buildAgent24ReplayAttestation({ ...partialBundle, compositeFingerprint: compositeForAttestation });
  const exportReadinessFinal = buildAgent24ExportReadinessReport({
    matchId: input.matchId,
    attestation: attestationFinal,
    historyReconciliation,
    checkpointCoverage,
    playbackIntegrity,
    rewindSafety,
  });
  const compositeCore = o6kAgent24Fingerprint('replay_bundle', {
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
    attestation: attestationFinal.deterministicFingerprint,
    checkpointCoverage: checkpointCoverage.deterministicFingerprint,
    rewindSafety: rewindSafety.deterministicFingerprint,
    reconciliation: historyReconciliation.deterministicFingerprint,
    playbackIntegrity: playbackIntegrity.deterministicFingerprint,
    branchLineage: branchLineage.deterministicFingerprint,
    exportReadiness: exportReadinessFinal.deterministicFingerprint,
  });
  const exportManifest = buildAgent24ExportManifest({
    matchId: input.matchId,
    attestation: attestationFinal,
    exportReadiness: exportReadinessFinal,
    branchLineage,
    compositeBundleFingerprint: compositeCore,
  });
  const historyRetention = buildAgent24HistoryRetentionReport({
    matchId: input.matchId,
    currentTurn: input.turn,
    maxTurns: input.maxTurns,
    checkpointCoverage,
    rewindSafety,
  });
  const importValidation = buildAgent24ImportValidationReport({
    matchId: input.matchId,
    manifest: exportManifest,
    attestation: attestationFinal,
    exportReadiness: exportReadinessFinal,
    expectedCompositeFingerprint: compositeCore,
  });
  const archiveCompaction = buildAgent24ArchiveCompactionPlan({
    matchId: input.matchId,
    currentTurn: input.turn,
    historyRetention,
    importValidation,
    replayEventCount,
  });
  const replayTransferGate = buildAgent24ReplayTransferGateReport({
    matchId: input.matchId,
    manifest: exportManifest,
    importValidation,
    historyRetention,
  });
  const snapshotSeal = buildAgent24SnapshotSeal({
    matchId: input.matchId,
    turn: input.turn,
    compositeBundleFingerprint: compositeCore,
    manifest: exportManifest,
    importValidation,
    transferGate: replayTransferGate,
    archiveCompaction,
  });
  const sealVerification = buildAgent24SealVerificationReport({
    matchId: input.matchId,
    compositeBundleFingerprint: compositeCore,
    snapshotSeal,
    manifest: exportManifest,
    importValidation,
    transferGate: replayTransferGate,
    archiveCompaction,
  });
  const replayRestoreGate = buildAgent24ReplayRestoreGateReport({
    matchId: input.matchId,
    snapshotSeal,
    sealVerification,
    rewindSafety,
    playbackIntegrity,
    archiveCompaction,
  });
  const archivePublishPlan = buildAgent24ArchivePublishPlan({
    matchId: input.matchId,
    currentTurn: input.turn,
    snapshotSeal,
    sealVerification,
    replayTransferGate,
    archiveCompaction,
  });
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
    attestation: attestationFinal.deterministicFingerprint,
    checkpointCoverage: checkpointCoverage.deterministicFingerprint,
    rewindSafety: rewindSafety.deterministicFingerprint,
    reconciliation: historyReconciliation.deterministicFingerprint,
    playbackIntegrity: playbackIntegrity.deterministicFingerprint,
    branchLineage: branchLineage.deterministicFingerprint,
    exportReadiness: exportReadinessFinal.deterministicFingerprint,
    exportManifest: exportManifest.deterministicFingerprint,
    importValidation: importValidation.deterministicFingerprint,
    historyRetention: historyRetention.deterministicFingerprint,
    archiveCompaction: archiveCompaction.deterministicFingerprint,
    replayTransferGate: replayTransferGate.deterministicFingerprint,
    snapshotSeal: snapshotSeal.deterministicFingerprint,
    sealVerification: sealVerification.deterministicFingerprint,
    replayRestoreGate: replayRestoreGate.deterministicFingerprint,
    archivePublishPlan: archivePublishPlan.deterministicFingerprint,
  });

  return {
    bundleId: o6kAgent24Fingerprint('replay_bundle_id', { matchId: input.matchId, turn: input.turn }),
    ...partialBundle,
    timelineDivergence,
    historyRollup,
    checkpointCoverage,
    rewindSafety,
    historyReconciliation,
    playbackIntegrity,
    branchLineage,
    exportReadiness: exportReadinessFinal,
    exportManifest,
    importValidation,
    historyRetention,
    archiveCompaction,
    replayTransferGate,
    snapshotSeal,
    sealVerification,
    replayRestoreGate,
    archivePublishPlan,
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
      name: 'checkpoint_coverage_twin',
      passed: a.checkpointCoverage.deterministicFingerprint === b.checkpointCoverage.deterministicFingerprint,
      detail: 'Twin checkpoint coverage fingerprints',
    },
    {
      name: 'rewind_safety_twin',
      passed: a.rewindSafety.deterministicFingerprint === b.rewindSafety.deterministicFingerprint,
      detail: 'Twin rewind safety fingerprints',
    },
    {
      name: 'history_reconciliation_twin',
      passed: a.historyReconciliation.deterministicFingerprint === b.historyReconciliation.deterministicFingerprint,
      detail: 'Twin history reconciliation fingerprints',
    },
    {
      name: 'playback_integrity_twin',
      passed: a.playbackIntegrity.deterministicFingerprint === b.playbackIntegrity.deterministicFingerprint,
      detail: 'Twin replay playback integrity fingerprints',
    },
    {
      name: 'branch_lineage_twin',
      passed: a.branchLineage.deterministicFingerprint === b.branchLineage.deterministicFingerprint,
      detail: 'Twin branch lineage fingerprints',
    },
    {
      name: 'export_readiness_twin',
      passed: a.exportReadiness.deterministicFingerprint === b.exportReadiness.deterministicFingerprint,
      detail: 'Twin export readiness fingerprints',
    },
    {
      name: 'export_manifest_twin',
      passed: a.exportManifest.deterministicFingerprint === b.exportManifest.deterministicFingerprint,
      detail: 'Twin export manifest fingerprints',
    },
    {
      name: 'import_validation_twin',
      passed: a.importValidation.deterministicFingerprint === b.importValidation.deterministicFingerprint,
      detail: 'Twin import validation fingerprints',
    },
    {
      name: 'history_retention_twin',
      passed: a.historyRetention.deterministicFingerprint === b.historyRetention.deterministicFingerprint,
      detail: 'Twin history retention fingerprints',
    },
    {
      name: 'archive_compaction_twin',
      passed: a.archiveCompaction.deterministicFingerprint === b.archiveCompaction.deterministicFingerprint,
      detail: 'Twin archive compaction fingerprints',
    },
    {
      name: 'replay_transfer_gate_twin',
      passed: a.replayTransferGate.deterministicFingerprint === b.replayTransferGate.deterministicFingerprint,
      detail: 'Twin replay transfer gate fingerprints',
    },
    {
      name: 'snapshot_seal_twin',
      passed: a.snapshotSeal.deterministicFingerprint === b.snapshotSeal.deterministicFingerprint,
      detail: 'Twin snapshot seal fingerprints',
    },
    {
      name: 'seal_verification_twin',
      passed: a.sealVerification.deterministicFingerprint === b.sealVerification.deterministicFingerprint,
      detail: 'Twin seal verification fingerprints',
    },
    {
      name: 'replay_restore_gate_twin',
      passed: a.replayRestoreGate.deterministicFingerprint === b.replayRestoreGate.deterministicFingerprint,
      detail: 'Twin replay restore gate fingerprints',
    },
    {
      name: 'archive_publish_plan_twin',
      passed: a.archivePublishPlan.deterministicFingerprint === b.archivePublishPlan.deterministicFingerprint,
      detail: 'Twin archive publish plan fingerprints',
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
