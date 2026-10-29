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
import { buildAgent24ReplayRestorePlan, type Agent24ReplayRestorePlan } from './replay-restore-plan.ts';
import {
  buildAgent24ArchivePublishDispatchReport,
  type Agent24ArchivePublishDispatchReport,
} from './archive-publish-dispatch.ts';
import { buildAgent24PublishReceiptLedger, type Agent24PublishReceiptLedger } from './publish-receipt-ledger.ts';
import {
  buildAgent24RestoreExecutionGateReport,
  type Agent24RestoreExecutionGateReport,
} from './restore-execution-gate.ts';
import {
  buildAgent24ArchiveFulfillmentAuditReport,
  type Agent24ArchiveFulfillmentAuditReport,
} from './archive-fulfillment-audit.ts';
import {
  buildAgent24LedgerSealContinuityReport,
  type Agent24LedgerSealContinuityReport,
} from './ledger-seal-continuity.ts';
import { buildAgent24RestoreCommitRecord, type Agent24RestoreCommitRecord } from './restore-commit-record.ts';
import {
  buildAgent24FulfillmentSealBridgeReport,
  type Agent24FulfillmentSealBridgeReport,
} from './fulfillment-seal-bridge.ts';
import {
  buildAgent24ArchiveContinuityAttestation,
  type Agent24ArchiveContinuityAttestation,
} from './archive-continuity-attestation.ts';
import {
  buildAgent24ContinuityExportGateReport,
  type Agent24ContinuityExportGateReport,
} from './continuity-export-gate.ts';
import {
  buildAgent24RestoreCommitAuditReport,
  type Agent24RestoreCommitAuditReport,
} from './restore-commit-audit.ts';
import { buildAgent24AttestationChainSeal, type Agent24AttestationChainSeal } from './attestation-chain-seal.ts';
import {
  buildAgent24AttestationChainVerificationReport,
  type Agent24AttestationChainVerificationReport,
} from './attestation-chain-verification.ts';
import { buildAgent24ContinuityExportLedger, type Agent24ContinuityExportLedger } from './continuity-export-ledger.ts';
import {
  buildAgent24ArchiveRoundtripGateReport,
  type Agent24ArchiveRoundtripGateReport,
} from './archive-roundtrip-gate.ts';
import {
  buildAgent24ArchiveRoundtripVerificationReport,
  type Agent24ArchiveRoundtripVerificationReport,
} from './archive-roundtrip-verification.ts';
import {
  buildAgent24ExportLedgerReconciliationReport,
  type Agent24ExportLedgerReconciliationReport,
} from './export-ledger-reconciliation.ts';
import { buildAgent24ArchiveHandoffSeal, type Agent24ArchiveHandoffSeal } from './archive-handoff-seal.ts';
import {
  buildAgent24ArchiveHandoffVerificationReport,
  type Agent24ArchiveHandoffVerificationReport,
} from './archive-handoff-verification.ts';
import {
  buildAgent24ReplayPipelineCloseoutReport,
  type Agent24ReplayPipelineCloseoutReport,
} from './replay-pipeline-closeout.ts';
import {
  buildAgent24ArchiveContinuityFinalizationReport,
  type Agent24ArchiveContinuityFinalizationReport,
} from './archive-continuity-finalization.ts';
import {
  buildAgent24ArchiveContinuityVerificationReport,
  type Agent24ArchiveContinuityVerificationReport,
} from './archive-continuity-verification.ts';
import {
  buildAgent24ReplayScaleWaveAcceptanceReport,
  type Agent24ReplayScaleWaveAcceptanceReport,
} from './replay-scale-wave-acceptance.ts';
import {
  buildAgent24ArchiveReleaseGateReport,
  type Agent24ArchiveReleaseGateReport,
} from './archive-release-gate.ts';
import {
  buildAgent24ArchiveReleaseVerificationReport,
  type Agent24ArchiveReleaseVerificationReport,
} from './archive-release-verification.ts';
import {
  buildAgent24ReplayScaleWaveHandoffSeal,
  type Agent24ReplayScaleWaveHandoffSeal,
} from './replay-scale-wave-handoff-seal.ts';
import {
  buildAgent24ReplayScaleWaveCloseoutReport,
  type Agent24ReplayScaleWaveCloseoutReport,
} from './replay-scale-wave-closeout.ts';

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
  replayRestorePlan: Agent24ReplayRestorePlan;
  archivePublishDispatch: Agent24ArchivePublishDispatchReport;
  publishReceiptLedger: Agent24PublishReceiptLedger;
  restoreExecutionGate: Agent24RestoreExecutionGateReport;
  archiveFulfillmentAudit: Agent24ArchiveFulfillmentAuditReport;
  ledgerSealContinuity: Agent24LedgerSealContinuityReport;
  restoreCommitRecord: Agent24RestoreCommitRecord;
  fulfillmentSealBridge: Agent24FulfillmentSealBridgeReport;
  archiveContinuityAttestation: Agent24ArchiveContinuityAttestation;
  continuityExportGate: Agent24ContinuityExportGateReport;
  restoreCommitAudit: Agent24RestoreCommitAuditReport;
  attestationChainSeal: Agent24AttestationChainSeal;
  attestationChainVerification: Agent24AttestationChainVerificationReport;
  continuityExportLedger: Agent24ContinuityExportLedger;
  archiveRoundtripGate: Agent24ArchiveRoundtripGateReport;
  archiveRoundtripVerification: Agent24ArchiveRoundtripVerificationReport;
  exportLedgerReconciliation: Agent24ExportLedgerReconciliationReport;
  archiveHandoffSeal: Agent24ArchiveHandoffSeal;
  archiveHandoffVerification: Agent24ArchiveHandoffVerificationReport;
  replayPipelineCloseout: Agent24ReplayPipelineCloseoutReport;
  archiveContinuityFinalization: Agent24ArchiveContinuityFinalizationReport;
  archiveContinuityVerification: Agent24ArchiveContinuityVerificationReport;
  replayScaleWaveAcceptance: Agent24ReplayScaleWaveAcceptanceReport;
  archiveReleaseGate: Agent24ArchiveReleaseGateReport;
  archiveReleaseVerification: Agent24ArchiveReleaseVerificationReport;
  replayScaleWaveHandoffSeal: Agent24ReplayScaleWaveHandoffSeal;
  replayScaleWaveCloseout: Agent24ReplayScaleWaveCloseoutReport;
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
  const replayRestorePlan = buildAgent24ReplayRestorePlan({
    matchId: input.matchId,
    replayRestoreGate,
    sealVerification,
    rewindSafety,
    checkpointCoverage,
  });
  const archivePublishDispatch = buildAgent24ArchivePublishDispatchReport({
    matchId: input.matchId,
    currentTurn: input.turn,
    snapshotSeal,
    archivePublishPlan,
    replayRestorePlan,
  });
  const publishReceiptLedger = buildAgent24PublishReceiptLedger({
    matchId: input.matchId,
    snapshotSeal,
    archivePublishPlan,
    publishDispatch: archivePublishDispatch,
  });
  const restoreExecutionGate = buildAgent24RestoreExecutionGateReport({
    matchId: input.matchId,
    replayRestorePlan,
    replayRestoreGate,
    playbackIntegrity,
  });
  const archiveFulfillmentAudit = buildAgent24ArchiveFulfillmentAuditReport({
    matchId: input.matchId,
    publishDispatch: archivePublishDispatch,
    publishReceiptLedger,
  });
  const ledgerSealContinuity = buildAgent24LedgerSealContinuityReport({
    matchId: input.matchId,
    compositeBundleFingerprint: compositeCore,
    snapshotSeal,
    sealVerification,
    publishReceiptLedger,
    fulfillmentAudit: archiveFulfillmentAudit,
  });
  const restoreCommitRecord = buildAgent24RestoreCommitRecord({
    matchId: input.matchId,
    currentTurn: input.turn,
    replayRestorePlan,
    restoreExecutionGate,
  });
  const fulfillmentSealBridge = buildAgent24FulfillmentSealBridgeReport({
    matchId: input.matchId,
    snapshotSeal,
    fulfillmentAudit: archiveFulfillmentAudit,
    ledgerSealContinuity,
  });
  const archiveContinuityAttestation = buildAgent24ArchiveContinuityAttestation({
    matchId: input.matchId,
    restoreCommitRecord,
    fulfillmentSealBridge,
    ledgerSealContinuity,
  });
  const continuityExportGate = buildAgent24ContinuityExportGateReport({
    matchId: input.matchId,
    archiveContinuityAttestation,
    exportReadiness: exportReadinessFinal,
    replayTransferGate,
  });
  const restoreCommitAudit = buildAgent24RestoreCommitAuditReport({
    matchId: input.matchId,
    restoreCommitRecord,
    replayRestorePlan,
    restoreExecutionGate,
  });
  const attestationChainSeal = buildAgent24AttestationChainSeal({
    matchId: input.matchId,
    snapshotSeal,
    exportManifest,
    archiveContinuityAttestation,
    continuityExportGate,
  });
  const attestationChainVerification = buildAgent24AttestationChainVerificationReport({
    matchId: input.matchId,
    attestationChainSeal,
    snapshotSeal,
    sealVerification,
  });
  const continuityExportLedger = buildAgent24ContinuityExportLedger({
    matchId: input.matchId,
    currentTurn: input.turn,
    continuityExportGate,
    restoreCommitAudit,
    attestationChainVerification,
  });
  const archiveRoundtripGate = buildAgent24ArchiveRoundtripGateReport({
    matchId: input.matchId,
    continuityExportLedger,
    importValidation,
    replayTransferGate,
  });
  const archiveRoundtripVerification = buildAgent24ArchiveRoundtripVerificationReport({
    matchId: input.matchId,
    archiveRoundtripGate,
    attestationChainVerification,
    continuityExportLedger,
  });
  const exportLedgerReconciliation = buildAgent24ExportLedgerReconciliationReport({
    matchId: input.matchId,
    continuityExportLedger,
    publishReceiptLedger,
    fulfillmentAudit: archiveFulfillmentAudit,
  });
  const archiveHandoffSeal = buildAgent24ArchiveHandoffSeal({
    matchId: input.matchId,
    attestationChainSeal,
    archiveRoundtripVerification,
    exportLedgerReconciliation,
  });
  const archiveHandoffVerification = buildAgent24ArchiveHandoffVerificationReport({
    matchId: input.matchId,
    archiveHandoffSeal,
    archiveRoundtripVerification,
    attestationChainVerification,
  });
  const replayPipelineCloseout = buildAgent24ReplayPipelineCloseoutReport({
    matchId: input.matchId,
    currentTurn: input.turn,
    archiveContinuityAttestation,
    archiveHandoffVerification,
    exportLedgerReconciliation,
  });
  const archiveContinuityFinalization = buildAgent24ArchiveContinuityFinalizationReport({
    matchId: input.matchId,
    replayPipelineCloseout,
    archiveHandoffSeal,
    archiveRoundtripGate,
  });
  const archiveContinuityVerification = buildAgent24ArchiveContinuityVerificationReport({
    matchId: input.matchId,
    archiveContinuityFinalization,
    archiveHandoffVerification,
    replayPipelineCloseout,
  });
  const replayScaleWaveAcceptance = buildAgent24ReplayScaleWaveAcceptanceReport({
    matchId: input.matchId,
    waveRound: 17,
    archiveContinuityVerification,
    exportReadiness: exportReadinessFinal,
    analyticsDepth,
  });
  const archiveReleaseGate = buildAgent24ArchiveReleaseGateReport({
    matchId: input.matchId,
    replayScaleWaveAcceptance,
    archivePublishPlan,
    archivePublishDispatch,
  });
  const archiveReleaseVerification = buildAgent24ArchiveReleaseVerificationReport({
    matchId: input.matchId,
    archiveReleaseGate,
    publishReceiptLedger,
    archiveFulfillmentAudit,
  });
  const replayScaleWaveHandoffSeal = buildAgent24ReplayScaleWaveHandoffSeal({
    matchId: input.matchId,
    replayScaleWaveAcceptance,
    archiveReleaseGate,
    archiveReleaseVerification,
  });
  const replayScaleWaveCloseout = buildAgent24ReplayScaleWaveCloseoutReport({
    matchId: input.matchId,
    replayScaleWaveAcceptance,
    replayScaleWaveHandoffSeal,
    archiveReleaseVerification,
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
    replayRestorePlan: replayRestorePlan.deterministicFingerprint,
    archivePublishDispatch: archivePublishDispatch.deterministicFingerprint,
    publishReceiptLedger: publishReceiptLedger.deterministicFingerprint,
    restoreExecutionGate: restoreExecutionGate.deterministicFingerprint,
    archiveFulfillmentAudit: archiveFulfillmentAudit.deterministicFingerprint,
    ledgerSealContinuity: ledgerSealContinuity.deterministicFingerprint,
    restoreCommitRecord: restoreCommitRecord.deterministicFingerprint,
    fulfillmentSealBridge: fulfillmentSealBridge.deterministicFingerprint,
    archiveContinuityAttestation: archiveContinuityAttestation.deterministicFingerprint,
    continuityExportGate: continuityExportGate.deterministicFingerprint,
    restoreCommitAudit: restoreCommitAudit.deterministicFingerprint,
    attestationChainSeal: attestationChainSeal.deterministicFingerprint,
    attestationChainVerification: attestationChainVerification.deterministicFingerprint,
    continuityExportLedger: continuityExportLedger.deterministicFingerprint,
    archiveRoundtripGate: archiveRoundtripGate.deterministicFingerprint,
    archiveRoundtripVerification: archiveRoundtripVerification.deterministicFingerprint,
    exportLedgerReconciliation: exportLedgerReconciliation.deterministicFingerprint,
    archiveHandoffSeal: archiveHandoffSeal.deterministicFingerprint,
    archiveHandoffVerification: archiveHandoffVerification.deterministicFingerprint,
    replayPipelineCloseout: replayPipelineCloseout.deterministicFingerprint,
    archiveContinuityFinalization: archiveContinuityFinalization.deterministicFingerprint,
    archiveContinuityVerification: archiveContinuityVerification.deterministicFingerprint,
    replayScaleWaveAcceptance: replayScaleWaveAcceptance.deterministicFingerprint,
    archiveReleaseGate: archiveReleaseGate.deterministicFingerprint,
    archiveReleaseVerification: archiveReleaseVerification.deterministicFingerprint,
    replayScaleWaveHandoffSeal: replayScaleWaveHandoffSeal.deterministicFingerprint,
    replayScaleWaveCloseout: replayScaleWaveCloseout.deterministicFingerprint,
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
    replayRestorePlan,
    archivePublishDispatch,
    publishReceiptLedger,
    restoreExecutionGate,
    archiveFulfillmentAudit,
    ledgerSealContinuity,
    restoreCommitRecord,
    fulfillmentSealBridge,
    archiveContinuityAttestation,
    continuityExportGate,
    restoreCommitAudit,
    attestationChainSeal,
    attestationChainVerification,
    continuityExportLedger,
    archiveRoundtripGate,
    archiveRoundtripVerification,
    exportLedgerReconciliation,
    archiveHandoffSeal,
    archiveHandoffVerification,
    replayPipelineCloseout,
    archiveContinuityFinalization,
    archiveContinuityVerification,
    replayScaleWaveAcceptance,
    archiveReleaseGate,
    archiveReleaseVerification,
    replayScaleWaveHandoffSeal,
    replayScaleWaveCloseout,
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
      name: 'replay_restore_plan_twin',
      passed: a.replayRestorePlan.deterministicFingerprint === b.replayRestorePlan.deterministicFingerprint,
      detail: 'Twin replay restore plan fingerprints',
    },
    {
      name: 'archive_publish_dispatch_twin',
      passed: a.archivePublishDispatch.deterministicFingerprint === b.archivePublishDispatch.deterministicFingerprint,
      detail: 'Twin archive publish dispatch fingerprints',
    },
    {
      name: 'publish_receipt_ledger_twin',
      passed: a.publishReceiptLedger.deterministicFingerprint === b.publishReceiptLedger.deterministicFingerprint,
      detail: 'Twin publish receipt ledger fingerprints',
    },
    {
      name: 'restore_execution_gate_twin',
      passed: a.restoreExecutionGate.deterministicFingerprint === b.restoreExecutionGate.deterministicFingerprint,
      detail: 'Twin restore execution gate fingerprints',
    },
    {
      name: 'archive_fulfillment_audit_twin',
      passed: a.archiveFulfillmentAudit.deterministicFingerprint === b.archiveFulfillmentAudit.deterministicFingerprint,
      detail: 'Twin archive fulfillment audit fingerprints',
    },
    {
      name: 'ledger_seal_continuity_twin',
      passed: a.ledgerSealContinuity.deterministicFingerprint === b.ledgerSealContinuity.deterministicFingerprint,
      detail: 'Twin ledger seal continuity fingerprints',
    },
    {
      name: 'restore_commit_record_twin',
      passed: a.restoreCommitRecord.deterministicFingerprint === b.restoreCommitRecord.deterministicFingerprint,
      detail: 'Twin restore commit record fingerprints',
    },
    {
      name: 'fulfillment_seal_bridge_twin',
      passed: a.fulfillmentSealBridge.deterministicFingerprint === b.fulfillmentSealBridge.deterministicFingerprint,
      detail: 'Twin fulfillment seal bridge fingerprints',
    },
    {
      name: 'archive_continuity_attestation_twin',
      passed:
        a.archiveContinuityAttestation.deterministicFingerprint === b.archiveContinuityAttestation.deterministicFingerprint,
      detail: 'Twin archive continuity attestation fingerprints',
    },
    {
      name: 'continuity_export_gate_twin',
      passed: a.continuityExportGate.deterministicFingerprint === b.continuityExportGate.deterministicFingerprint,
      detail: 'Twin continuity export gate fingerprints',
    },
    {
      name: 'restore_commit_audit_twin',
      passed: a.restoreCommitAudit.deterministicFingerprint === b.restoreCommitAudit.deterministicFingerprint,
      detail: 'Twin restore commit audit fingerprints',
    },
    {
      name: 'attestation_chain_seal_twin',
      passed: a.attestationChainSeal.deterministicFingerprint === b.attestationChainSeal.deterministicFingerprint,
      detail: 'Twin attestation chain seal fingerprints',
    },
    {
      name: 'attestation_chain_verification_twin',
      passed:
        a.attestationChainVerification.deterministicFingerprint === b.attestationChainVerification.deterministicFingerprint,
      detail: 'Twin attestation chain verification fingerprints',
    },
    {
      name: 'continuity_export_ledger_twin',
      passed: a.continuityExportLedger.deterministicFingerprint === b.continuityExportLedger.deterministicFingerprint,
      detail: 'Twin continuity export ledger fingerprints',
    },
    {
      name: 'archive_roundtrip_gate_twin',
      passed: a.archiveRoundtripGate.deterministicFingerprint === b.archiveRoundtripGate.deterministicFingerprint,
      detail: 'Twin archive roundtrip gate fingerprints',
    },
    {
      name: 'archive_roundtrip_verification_twin',
      passed:
        a.archiveRoundtripVerification.deterministicFingerprint === b.archiveRoundtripVerification.deterministicFingerprint,
      detail: 'Twin archive roundtrip verification fingerprints',
    },
    {
      name: 'export_ledger_reconciliation_twin',
      passed:
        a.exportLedgerReconciliation.deterministicFingerprint === b.exportLedgerReconciliation.deterministicFingerprint,
      detail: 'Twin export ledger reconciliation fingerprints',
    },
    {
      name: 'archive_handoff_seal_twin',
      passed: a.archiveHandoffSeal.deterministicFingerprint === b.archiveHandoffSeal.deterministicFingerprint,
      detail: 'Twin archive handoff seal fingerprints',
    },
    {
      name: 'archive_handoff_verification_twin',
      passed:
        a.archiveHandoffVerification.deterministicFingerprint === b.archiveHandoffVerification.deterministicFingerprint,
      detail: 'Twin archive handoff verification fingerprints',
    },
    {
      name: 'replay_pipeline_closeout_twin',
      passed: a.replayPipelineCloseout.deterministicFingerprint === b.replayPipelineCloseout.deterministicFingerprint,
      detail: 'Twin replay pipeline closeout fingerprints',
    },
    {
      name: 'archive_continuity_finalization_twin',
      passed:
        a.archiveContinuityFinalization.deterministicFingerprint === b.archiveContinuityFinalization.deterministicFingerprint,
      detail: 'Twin archive continuity finalization fingerprints',
    },
    {
      name: 'archive_continuity_verification_twin',
      passed:
        a.archiveContinuityVerification.deterministicFingerprint === b.archiveContinuityVerification.deterministicFingerprint,
      detail: 'Twin archive continuity verification fingerprints',
    },
    {
      name: 'replay_scale_wave_acceptance_twin',
      passed:
        a.replayScaleWaveAcceptance.deterministicFingerprint === b.replayScaleWaveAcceptance.deterministicFingerprint,
      detail: 'Twin replay scale wave acceptance fingerprints',
    },
    {
      name: 'archive_release_gate_twin',
      passed: a.archiveReleaseGate.deterministicFingerprint === b.archiveReleaseGate.deterministicFingerprint,
      detail: 'Twin archive release gate fingerprints',
    },
    {
      name: 'archive_release_verification_twin',
      passed:
        a.archiveReleaseVerification.deterministicFingerprint === b.archiveReleaseVerification.deterministicFingerprint,
      detail: 'Twin archive release verification fingerprints',
    },
    {
      name: 'replay_scale_wave_handoff_seal_twin',
      passed:
        a.replayScaleWaveHandoffSeal.deterministicFingerprint === b.replayScaleWaveHandoffSeal.deterministicFingerprint,
      detail: 'Twin replay scale wave handoff seal fingerprints',
    },
    {
      name: 'replay_scale_wave_closeout_twin',
      passed: a.replayScaleWaveCloseout.deterministicFingerprint === b.replayScaleWaveCloseout.deterministicFingerprint,
      detail: 'Twin replay scale wave closeout fingerprints',
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
