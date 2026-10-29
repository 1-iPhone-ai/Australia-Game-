import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildAgent24CausalRecordIndex, pickCausalChain } from '../src/causal-records.ts';
import { buildAgent24TimelineRegistry } from '../src/timeline-registry.ts';
import { classifyAgent24MatchPhase, assessAgent24LateGameReplay } from '../src/late-game-replay.ts';
import {
  buildAgent24ReplayDeterminismBundle,
  verifyAgent24ReplayDeterminism,
} from '../src/replay-determinism.ts';
import {
  buildAgent24ReplayAnalyticsDepth,
  diffAgent24ReplayBundles,
  runAgent24AnalyticsDepthSelfTests,
} from '../src/analytics-depth.ts';
import { runAgent24ReplayScenarioSuite } from '../src/replay-scenarios.ts';
import { buildAgent24AuditTrail, mergeAgent24AuditTrails } from '../src/audit-trails.ts';
import { buildAgent24MultiSessionContinuity } from '../src/multi-session.ts';
import { buildAgent24TimelineDivergenceReport } from '../src/timeline-divergence.ts';
import { buildAgent24HistoryRollupReport } from '../src/history-rollups.ts';
import { buildAgent24ReplayAttestation, runAgent24AttestationSelfTests } from '../src/replay-attestation.ts';
import {
  buildAgent24CheckpointCoverageReport,
  extractAgent24CheckpointTurnsFromReplay,
  runAgent24CheckpointCoverageSelfTests,
} from '../src/checkpoint-coverage.ts';
import { buildAgent24RewindSafetyReport } from '../src/rewind-safety.ts';
import { buildAgent24HistoryReconciliationReport } from '../src/history-reconciliation.ts';
import {
  buildAgent24ReplayPlaybackIntegrityReport,
  runAgent24PlaybackIntegritySelfTests,
} from '../src/replay-playback-integrity.ts';
import { buildAgent24BranchLineageReport } from '../src/branch-lineage.ts';
import { buildAgent24ExportReadinessReport } from '../src/export-readiness.ts';
import { buildAgent24ExportManifest, runAgent24ExportManifestSelfTests } from '../src/export-manifest.ts';
import {
  buildAgent24ImportValidationReport,
  runAgent24ImportValidationSelfTests,
} from '../src/import-validation.ts';
import {
  buildAgent24HistoryRetentionReport,
  runAgent24HistoryRetentionSelfTests,
} from '../src/history-retention.ts';
import {
  buildAgent24ArchiveCompactionPlan,
  runAgent24ArchiveCompactionSelfTests,
} from '../src/archive-compaction.ts';
import {
  buildAgent24ReplayTransferGateReport,
  runAgent24ReplayTransferGateSelfTests,
} from '../src/replay-transfer-gate.ts';
import { buildAgent24SnapshotSeal, runAgent24SnapshotSealSelfTests } from '../src/snapshot-seal.ts';
import {
  buildAgent24SealVerificationReport,
  runAgent24SealVerificationSelfTests,
} from '../src/seal-verification.ts';
import {
  buildAgent24ReplayRestoreGateReport,
  runAgent24ReplayRestoreGateSelfTests,
} from '../src/replay-restore-gate.ts';
import {
  buildAgent24ArchivePublishPlan,
  runAgent24ArchivePublishPlanSelfTests,
} from '../src/archive-publish-plan.ts';
import {
  buildAgent24ReplayRestorePlan,
  runAgent24ReplayRestorePlanSelfTests,
} from '../src/replay-restore-plan.ts';
import {
  buildAgent24ArchivePublishDispatchReport,
  runAgent24ArchivePublishDispatchSelfTests,
} from '../src/archive-publish-dispatch.ts';
import {
  buildAgent24PublishReceiptLedger,
  runAgent24PublishReceiptLedgerSelfTests,
} from '../src/publish-receipt-ledger.ts';
import {
  buildAgent24RestoreExecutionGateReport,
  runAgent24RestoreExecutionGateSelfTests,
} from '../src/restore-execution-gate.ts';
import {
  buildAgent24ArchiveFulfillmentAuditReport,
  runAgent24ArchiveFulfillmentAuditSelfTests,
} from '../src/archive-fulfillment-audit.ts';
import {
  buildAgent24LedgerSealContinuityReport,
  runAgent24LedgerSealContinuitySelfTests,
} from '../src/ledger-seal-continuity.ts';
import {
  buildAgent24RestoreCommitRecord,
  runAgent24RestoreCommitRecordSelfTests,
} from '../src/restore-commit-record.ts';
import {
  buildAgent24FulfillmentSealBridgeReport,
  runAgent24FulfillmentSealBridgeSelfTests,
} from '../src/fulfillment-seal-bridge.ts';
import {
  buildAgent24ArchiveContinuityAttestation,
  runAgent24ArchiveContinuityAttestationSelfTests,
} from '../src/archive-continuity-attestation.ts';
import {
  buildAgent24ContinuityExportGateReport,
  runAgent24ContinuityExportGateSelfTests,
} from '../src/continuity-export-gate.ts';
import {
  buildAgent24RestoreCommitAuditReport,
  runAgent24RestoreCommitAuditSelfTests,
} from '../src/restore-commit-audit.ts';
import {
  buildAgent24AttestationChainSeal,
  runAgent24AttestationChainSealSelfTests,
} from '../src/attestation-chain-seal.ts';
import {
  buildAgent24AttestationChainVerificationReport,
  runAgent24AttestationChainVerificationSelfTests,
} from '../src/attestation-chain-verification.ts';
import {
  buildAgent24ContinuityExportLedger,
  runAgent24ContinuityExportLedgerSelfTests,
} from '../src/continuity-export-ledger.ts';
import {
  buildAgent24ArchiveRoundtripGateReport,
  runAgent24ArchiveRoundtripGateSelfTests,
} from '../src/archive-roundtrip-gate.ts';
import {
  buildAgent24ArchiveRoundtripVerificationReport,
  runAgent24ArchiveRoundtripVerificationSelfTests,
} from '../src/archive-roundtrip-verification.ts';
import {
  buildAgent24ExportLedgerReconciliationReport,
  runAgent24ExportLedgerReconciliationSelfTests,
} from '../src/export-ledger-reconciliation.ts';
import {
  buildAgent24ArchiveHandoffSeal,
  runAgent24ArchiveHandoffSealSelfTests,
} from '../src/archive-handoff-seal.ts';
import {
  buildAgent24ArchiveHandoffVerificationReport,
  runAgent24ArchiveHandoffVerificationSelfTests,
} from '../src/archive-handoff-verification.ts';
import {
  buildAgent24ReplayPipelineCloseoutReport,
  runAgent24ReplayPipelineCloseoutSelfTests,
} from '../src/replay-pipeline-closeout.ts';
import {
  buildAgent24ArchiveContinuityFinalizationReport,
  runAgent24ArchiveContinuityFinalizationSelfTests,
} from '../src/archive-continuity-finalization.ts';
import {
  buildAgent24ArchiveContinuityVerificationReport,
  runAgent24ArchiveContinuityVerificationSelfTests,
} from '../src/archive-continuity-verification.ts';
import {
  buildAgent24ReplayScaleWaveAcceptanceReport,
  runAgent24ReplayScaleWaveAcceptanceSelfTests,
} from '../src/replay-scale-wave-acceptance.ts';
import {
  buildAgent24ArchiveReleaseGateReport,
  runAgent24ArchiveReleaseGateSelfTests,
} from '../src/archive-release-gate.ts';
import {
  buildAgent24ArchiveReleaseVerificationReport,
  runAgent24ArchiveReleaseVerificationSelfTests,
} from '../src/archive-release-verification.ts';
import {
  buildAgent24ReplayScaleWaveHandoffSeal,
  runAgent24ReplayScaleWaveHandoffSealSelfTests,
} from '../src/replay-scale-wave-handoff-seal.ts';
import {
  buildAgent24ReplayScaleWaveCloseoutReport,
  runAgent24ReplayScaleWaveCloseoutSelfTests,
} from '../src/replay-scale-wave-closeout.ts';
import {
  buildAgent24ReplayScaleWaveVerificationReport,
  runAgent24ReplayScaleWaveVerificationSelfTests,
} from '../src/replay-scale-wave-verification.ts';
import {
  buildAgent24ArchiveScaleWaveFinalizationReport,
  runAgent24ArchiveScaleWaveFinalizationSelfTests,
} from '../src/archive-scale-wave-finalization.ts';
import {
  buildAgent24ReplayScaleWaveAttestation,
  runAgent24ReplayScaleWaveAttestationSelfTests,
} from '../src/replay-scale-wave-attestation.ts';
import {
  buildAgent24ReplayScaleWaveAttestationVerificationReport,
  runAgent24ReplayScaleWaveAttestationVerificationSelfTests,
} from '../src/replay-scale-wave-attestation-verification.ts';
import {
  buildAgent24ArchiveScaleWaveReleaseHandoffGateReport,
  runAgent24ArchiveScaleWaveReleaseHandoffGateSelfTests,
} from '../src/archive-scale-wave-release-handoff-gate.ts';
import {
  buildAgent24ReplayScaleWaveIntegrationCloseoutReport,
  runAgent24ReplayScaleWaveIntegrationCloseoutSelfTests,
  O6K_AGENT24_WAVE23_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE24_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE25_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE26_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE27_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE28_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE29_INTEGRATION_BASELINE_SHA,
} from '../src/replay-scale-wave-integration-closeout.ts';
import {
  buildAgent24ReplayScaleWaveIntegrationVerificationReport,
  runAgent24ReplayScaleWaveIntegrationVerificationSelfTests,
} from '../src/replay-scale-wave-integration-verification.ts';
import {
  buildAgent24ArchiveScaleWaveExportGateReport,
  runAgent24ArchiveScaleWaveExportGateSelfTests,
} from '../src/archive-scale-wave-export-gate.ts';
import {
  buildAgent24ReplayScaleWaveProjectionHandoffSeal,
  runAgent24ReplayScaleWaveProjectionHandoffSealSelfTests,
} from '../src/replay-scale-wave-projection-handoff.ts';
import {
  buildAgent24ReplayScaleWaveProjectionVerificationReport,
  runAgent24ReplayScaleWaveProjectionVerificationSelfTests,
} from '../src/replay-scale-wave-projection-verification.ts';
import {
  buildAgent24ArchiveScaleWavePostProjectionGateReport,
  runAgent24ArchiveScaleWavePostProjectionGateSelfTests,
} from '../src/archive-scale-wave-post-projection-gate.ts';
import {
  buildAgent24ReplayScaleWaveDryrunHandoffReport,
  runAgent24ReplayScaleWaveDryrunHandoffSelfTests,
} from '../src/replay-scale-wave-dryrun-handoff.ts';
import {
  buildAgent24ReplayScaleWaveDryrunVerificationReport,
  runAgent24ReplayScaleWaveDryrunVerificationSelfTests,
} from '../src/replay-scale-wave-dryrun-verification.ts';
import {
  buildAgent24ArchiveScaleWaveFullChunksGateReport,
  runAgent24ArchiveScaleWaveFullChunksGateSelfTests,
} from '../src/archive-scale-wave-full-chunks-gate.ts';
import {
  buildAgent24ReplayScaleWaveFullChunksHandoffSeal,
  runAgent24ReplayScaleWaveFullChunksHandoffSealSelfTests,
} from '../src/replay-scale-wave-full-chunks-handoff.ts';
import {
  buildAgent24ReplayScaleWaveFullChunksVerificationReport,
  runAgent24ReplayScaleWaveFullChunksVerificationSelfTests,
} from '../src/replay-scale-wave-full-chunks-verification.ts';
import {
  buildAgent24ArchiveScaleWaveWave23ExportGateReport,
  runAgent24ArchiveScaleWaveWave23ExportGateSelfTests,
} from '../src/archive-scale-wave-wave23-export-gate.ts';
import {
  buildAgent24ReplayScaleWaveWave23IntegrationHandoffReport,
  runAgent24ReplayScaleWaveWave23IntegrationHandoffSelfTests,
} from '../src/replay-scale-wave-wave23-integration-handoff.ts';
import {
  buildAgent24ReplayScaleWaveWave23IntegrationVerificationReport,
  runAgent24ReplayScaleWaveWave23IntegrationVerificationSelfTests,
} from '../src/replay-scale-wave-wave23-integration-verification.ts';
import {
  buildAgent24ArchiveScaleWaveWave24ExportGateReport,
  runAgent24ArchiveScaleWaveWave24ExportGateSelfTests,
} from '../src/archive-scale-wave-wave24-export-gate.ts';
import {
  buildAgent24ReplayScaleWaveWave24IntegrationHandoffReport,
  runAgent24ReplayScaleWaveWave24IntegrationHandoffSelfTests,
} from '../src/replay-scale-wave-wave24-integration-handoff.ts';
import {
  buildAgent24ReplayScaleWaveWave24IntegrationVerificationReport,
  runAgent24ReplayScaleWaveWave24IntegrationVerificationSelfTests,
} from '../src/replay-scale-wave-wave24-integration-verification.ts';
import {
  buildAgent24ArchiveScaleWaveWave25ExportGateReport,
  runAgent24ArchiveScaleWaveWave25ExportGateSelfTests,
} from '../src/archive-scale-wave-wave25-export-gate.ts';
import {
  buildAgent24ReplayScaleWaveWave25IntegrationHandoffReport,
  runAgent24ReplayScaleWaveWave25IntegrationHandoffSelfTests,
} from '../src/replay-scale-wave-wave25-integration-handoff.ts';
import {
  buildAgent24ReplayScaleWaveWave25IntegrationVerificationReport,
  runAgent24ReplayScaleWaveWave25IntegrationVerificationSelfTests,
} from '../src/replay-scale-wave-wave25-integration-verification.ts';
import {
  buildAgent24ArchiveScaleWaveWave26ExportGateReport,
  runAgent24ArchiveScaleWaveWave26ExportGateSelfTests,
} from '../src/archive-scale-wave-wave26-export-gate.ts';
import {
  buildAgent24ReplayScaleWaveWave26IntegrationHandoffReport,
  runAgent24ReplayScaleWaveWave26IntegrationHandoffSelfTests,
} from '../src/replay-scale-wave-wave26-integration-handoff.ts';
import {
  buildAgent24ReplayScaleWaveWave26IntegrationVerificationReport,
  runAgent24ReplayScaleWaveWave26IntegrationVerificationSelfTests,
} from '../src/replay-scale-wave-wave26-integration-verification.ts';
import {
  buildAgent24ArchiveScaleWaveWave27ExportGateReport,
  runAgent24ArchiveScaleWaveWave27ExportGateSelfTests,
} from '../src/archive-scale-wave-wave27-export-gate.ts';
import {
  buildAgent24ReplayScaleWaveWave27IntegrationHandoffReport,
  runAgent24ReplayScaleWaveWave27IntegrationHandoffSelfTests,
} from '../src/replay-scale-wave-wave27-integration-handoff.ts';
import {
  buildAgent24ReplayScaleWaveWave27IntegrationVerificationReport,
  runAgent24ReplayScaleWaveWave27IntegrationVerificationSelfTests,
} from '../src/replay-scale-wave-wave27-integration-verification.ts';
import {
  buildAgent24ArchiveScaleWaveWave28ExportGateReport,
  runAgent24ArchiveScaleWaveWave28ExportGateSelfTests,
} from '../src/archive-scale-wave-wave28-export-gate.ts';
import {
  buildAgent24ReplayScaleWaveWave28IntegrationHandoffReport,
  runAgent24ReplayScaleWaveWave28IntegrationHandoffSelfTests,
} from '../src/replay-scale-wave-wave28-integration-handoff.ts';
import {
  buildAgent24ReplayScaleWaveWave28IntegrationVerificationReport,
  runAgent24ReplayScaleWaveWave28IntegrationVerificationSelfTests,
} from '../src/replay-scale-wave-wave28-integration-verification.ts';
import {
  buildAgent24ArchiveScaleWaveWave29ExportGateReport,
  runAgent24ArchiveScaleWaveWave29ExportGateSelfTests,
} from '../src/archive-scale-wave-wave29-export-gate.ts';
import {
  buildAgent24ReplayScaleWaveWave29IntegrationHandoffReport,
  runAgent24ReplayScaleWaveWave29IntegrationHandoffSelfTests,
} from '../src/replay-scale-wave-wave29-integration-handoff.ts';
import { buildO6kHistoricalAnalyticsSnapshot } from '../src/history-replay-analytics.ts';
import { o6kAgent24StableStringify, runO6kAgent24SelfTests } from '../src/history-replay-analytics.ts';

describe('Agent 24 causal records', () => {
  it('indexes chains with stable ordering', () => {
    const index = buildAgent24CausalRecordIndex([
      { id: 'a', turn: 1, title: 'root', causalChainId: 'c1', causalDepth: 0 },
      { id: 'b', turn: 2, title: 'child', parentEventId: 'a', causalChainId: 'c1', causalDepth: 1 },
    ]);
    assert.equal(index.recordCount, 2);
    assert.equal(index.chainCount, 1);
    const chain = pickCausalChain(index, 'c1');
    assert.equal(chain[0]?.eventId, 'a');
    assert.equal(chain[1]?.eventId, 'b');
    const index2 = buildAgent24CausalRecordIndex([
      { id: 'a', turn: 1, title: 'root', causalChainId: 'c1', causalDepth: 0 },
      { id: 'b', turn: 2, title: 'child', parentEventId: 'a', causalChainId: 'c1', causalDepth: 1 },
    ]);
    assert.equal(index.deterministicFingerprint, index2.deterministicFingerprint);
  });
});

describe('Agent 24 timeline registry', () => {
  it('lists main and branch timelines deterministically', () => {
    const reg = buildAgent24TimelineRegistry({
      matchId: 'm1',
      activeTimelineId: 'main',
      activeNodeId: 'root',
      nodesById: {
        b2: { nodeId: 'b2', parentNodeId: 'root', branchTurn: 10, label: 'Risk fork' },
        b1: { nodeId: 'b1', parentNodeId: 'root', branchTurn: 5, label: 'Early fork' },
      },
    });
    assert.ok(reg.entries.some(e => e.timelineId === 'main'));
    assert.equal(reg.branchNodeOrder[0], 'b1');
    assert.equal(reg.branchNodeOrder[1], 'b2');
  });
});

describe('Agent 24 late game replay', () => {
  it('classifies endgame and overtime', () => {
    assert.equal(classifyAgent24MatchPhase({ turn: 10, day: 10, maxTurns: 100 }), 'opening');
    assert.equal(classifyAgent24MatchPhase({ turn: 80, day: 80, maxTurns: 100 }), 'endgame');
    assert.equal(classifyAgent24MatchPhase({ turn: 95, day: 95, maxTurns: 100 }), 'overtime');
    const late = assessAgent24LateGameReplay({ turn: 95, day: 95, maxTurns: 100, checkpointKinds: ['turn'] });
    assert.equal(late.isLateGame, true);
    assert.equal(late.requiresEndgameCheckpoint, true);
  });
});

describe('Agent 24 replay determinism bundle', () => {
  const sampleInput = () => ({
    matchId: 'test_match',
    turn: 12,
    day: 12,
    maxTurns: 100,
    gameActivityLedger: {
      events: [
        { id: 'e1', turn: 3, title: 'Regional contract completed', causalChainId: 'chain_a' },
        { id: 'e2', turn: 4, title: 'Lead change detected', parentEventId: 'e1', causalChainId: 'chain_a', causalDepth: 1 },
      ],
    },
    replay: { events: [{ eventType: 'replay_checkpoint', turn: 12 }], checkpoints: { '12': {} } },
    replayBranchTree: {
      activeNodeId: 'root',
      nodesById: { alt: { nodeId: 'alt', branchTurn: 8, label: 'Alt' } },
    },
    teamsById: { t1: { netWorth: 500 } },
    deterministicMode: true,
  });

  it('builds composite bundle with twin-build pass', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(sampleInput());
    assert.equal(bundle.twinBuildPassed, true);
    assert.ok(bundle.causalIndex.recordCount >= 2);
    assert.ok(bundle.timelineRegistry.entries.length >= 2);
  });

  it('verifies twin determinism across full bundle', () => {
    const result = verifyAgent24ReplayDeterminism(sampleInput);
    assert.equal(result.passed, true);
    assert.ok(result.probes.some(p => p.name === 'analytics_depth_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'scenario_suite_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'audit_trail_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'multi_session_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'timeline_divergence_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'history_rollup_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'attestation_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'checkpoint_coverage_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'rewind_safety_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'history_reconciliation_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'playback_integrity_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'branch_lineage_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'export_readiness_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'export_manifest_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'import_validation_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'history_retention_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'archive_compaction_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'replay_transfer_gate_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'snapshot_seal_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'seal_verification_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'replay_restore_gate_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'archive_publish_plan_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'replay_restore_plan_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'archive_publish_dispatch_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'publish_receipt_ledger_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'restore_execution_gate_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'archive_fulfillment_audit_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'ledger_seal_continuity_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'restore_commit_record_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'fulfillment_seal_bridge_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'archive_continuity_attestation_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'continuity_export_gate_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'restore_commit_audit_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'attestation_chain_seal_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'attestation_chain_verification_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'continuity_export_ledger_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'archive_roundtrip_gate_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'archive_roundtrip_verification_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'export_ledger_reconciliation_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'archive_handoff_seal_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'archive_handoff_verification_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'replay_pipeline_closeout_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'archive_continuity_finalization_twin' && p.passed));
  });

  it('includes analytics depth rollups and stable twin fingerprint', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(sampleInput());
    assert.ok(bundle.analyticsDepth.totalMilestoneWeight >= 0);
    assert.ok(bundle.analyticsDepth.longestCausalChainLength >= 1);
    const twinDepth = buildAgent24ReplayAnalyticsDepth({
      snapshot: bundle.snapshot,
      causalIndex: bundle.causalIndex,
      timelineRegistry: bundle.timelineRegistry,
      lateGame: bundle.lateGame,
      twinBuildPassed: bundle.twinBuildPassed,
    });
    assert.equal(bundle.analyticsDepth.deterministicFingerprint, twinDepth.deterministicFingerprint);
  });

  it('diffs bundles across turns', () => {
    const early = buildAgent24ReplayDeterminismBundle({ ...sampleInput(), turn: 5, day: 5 });
    const late = buildAgent24ReplayDeterminismBundle(sampleInput());
    const diff = diffAgent24ReplayBundles(early, late);
    assert.ok(diff.summary.includes('Milestones'));
  });
});

describe('Agent 24 replay scenarios', () => {
  it('evaluates scenario suite deterministically', () => {
    const suite = runAgent24ReplayScenarioSuite({
      replayEventCount: 3,
      branchNodeCount: 2,
      isLateGame: true,
      maxCausalDepth: 3,
      sessionCount: 2,
    });
    assert.equal(suite.assessments.length, 5);
    assert.ok(suite.satisfiedCount >= 4);
    const suite2 = runAgent24ReplayScenarioSuite({
      replayEventCount: 3,
      branchNodeCount: 2,
      isLateGame: true,
      maxCausalDepth: 3,
      sessionCount: 2,
    });
    assert.equal(suite.deterministicFingerprint, suite2.deterministicFingerprint);
  });
});

describe('Agent 24 audit trails', () => {
  it('builds and merges trails with stable fingerprints', () => {
    const t1 = buildAgent24AuditTrail({
      matchId: 'm',
      turn: 5,
      day: 5,
      entries: [{ action: 'session_saved', summary: 'Saved slot A', relatedSessionId: 's1' }],
    });
    const t2 = buildAgent24AuditTrail({
      matchId: 'm',
      turn: 6,
      day: 6,
      entries: [{ action: 'session_resumed', summary: 'Resumed slot A', relatedSessionId: 's1' }],
    });
    const merged = mergeAgent24AuditTrails(t1, t2);
    assert.equal(merged.entryCount, 2);
    assert.equal(merged.actionCounts.session_saved, 1);
  });
});

describe('Agent 24 multi-session continuity', () => {
  it('flags resume-safe non-overlapping sessions', () => {
    const c = buildAgent24MultiSessionContinuity({
      matchId: 'm',
      sessions: [
        { sessionId: 's1', startedAtTurn: 1, endedAtTurn: 10, replayEventCount: 4, branchNodeCount: 1 },
        { sessionId: 's2', startedAtTurn: 11, endedAtTurn: 20, replayEventCount: 5, branchNodeCount: 2 },
      ],
    });
    assert.equal(c.sessionCount, 2);
    assert.equal(c.resumeSafe, true);
    assert.equal(c.totalReplayEvents, 9);
  });
});

describe('Agent 24 timeline divergence', () => {
  it('reports branch pairs deterministically', () => {
    const reg = buildAgent24TimelineRegistry({
      matchId: 'm',
      nodesById: {
        b1: { nodeId: 'b1', branchTurn: 4, label: 'A' },
        b2: { nodeId: 'b2', branchTurn: 9, label: 'B' },
      },
    });
    const r = buildAgent24TimelineDivergenceReport({ matchId: 'm', registry: reg });
    assert.ok(r.pairCount >= 2);
    const r2 = buildAgent24TimelineDivergenceReport({ matchId: 'm', registry: reg });
    assert.equal(r.deterministicFingerprint, r2.deterministicFingerprint);
  });
});

describe('Agent 24 history rollups', () => {
  it('windows milestone weight by turn bands', () => {
    const snap = buildO6kHistoricalAnalyticsSnapshot({
      matchId: 'm',
      turn: 25,
      day: 25,
      gameActivityLedger: { events: [{ title: 'contract completed', turn: 12 }] },
      deterministicMode: true,
    });
    const report = buildAgent24HistoryRollupReport({ matchId: 'm', snapshot: snap, windowSize: 10 });
    assert.ok(report.windows.length >= 3);
    assert.ok(report.totalMilestoneWeight >= 0);
  });
});

describe('Agent 24 checkpoint coverage', () => {
  it('extracts checkpoint turns and scores gaps', () => {
    const turns = extractAgent24CheckpointTurnsFromReplay({
      checkpoints: { '4': {}, '12': {} },
      events: [{ eventType: 'replay_checkpoint', turn: 12 }],
    });
    assert.deepEqual(turns, [4, 12]);
    assert.ok(runAgent24CheckpointCoverageSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 rewind safety', () => {
  it('recommends latest safe checkpoint turn', () => {
    const bundle = buildAgent24ReplayDeterminismBundle({
      matchId: 'm',
      turn: 20,
      day: 20,
      replay: { events: [{ eventType: 'replay_checkpoint', turn: 8 }, { eventType: 'replay_checkpoint', turn: 15 }], checkpoints: { '8': {}, '15': {} } },
      deterministicMode: true,
    });
    assert.ok(bundle.rewindSafety.safeTargetCount >= 1);
    assert.equal(bundle.rewindSafety.recommendedTurn, 15);
    const twin = buildAgent24RewindSafetyReport({
      matchId: 'm',
      currentTurn: 20,
      registry: bundle.timelineRegistry,
      auditTrail: bundle.auditTrail,
      checkpointCoverage: bundle.checkpointCoverage,
    });
    assert.equal(twin.deterministicFingerprint, bundle.rewindSafety.deterministicFingerprint);
  });
});

describe('Agent 24 replay playback integrity', () => {
  it('detects turn regression in replay events', () => {
    const report = buildAgent24ReplayPlaybackIntegrityReport({
      matchId: 'm',
      currentTurn: 12,
      replay: {
        events: [
          { eventType: 'replay_checkpoint', turn: 10, sequence: 1 },
          { eventType: 'replay_checkpoint', turn: 7, sequence: 2 },
        ],
      },
    });
    assert.equal(report.monotonicTurns, false);
    assert.ok(runAgent24PlaybackIntegritySelfTests().every(t => t.passed));
  });
});

describe('Agent 24 branch lineage', () => {
  it('computes depth from nested branch nodes', () => {
    const nodesById = {
      b1: { nodeId: 'b1', parentNodeId: 'root', branchTurn: 4, label: 'Fork A' },
      b2: { nodeId: 'b2', parentNodeId: 'b1', branchTurn: 9, label: 'Fork B' },
    };
    const reg = buildAgent24TimelineRegistry({ matchId: 'm', nodesById });
    const lineage = buildAgent24BranchLineageReport({ matchId: 'm', registry: reg, nodesById });
    assert.ok(lineage.maxDepth >= 2);
    const b2 = lineage.nodes.find(n => n.nodeId === 'b2');
    assert.ok(b2 && b2.lineagePath.includes('b1'));
  });
});

describe('Agent 24 export readiness', () => {
  it('marks healthy bundles export-ready', () => {
    const bundle = buildAgent24ReplayDeterminismBundle({
      matchId: 'm',
      turn: 12,
      day: 12,
      replay: {
        events: [
          { eventType: 'replay_checkpoint', turn: 8, sequence: 1 },
          { eventType: 'replay_checkpoint', turn: 12, sequence: 2 },
        ],
        checkpoints: { '8': {}, '12': {} },
      },
      deterministicMode: true,
    });
    assert.equal(bundle.exportReadiness.ready, true);
    assert.equal(bundle.importValidation.valid, true);
    assert.ok(bundle.exportManifest.complete);
    const direct = buildAgent24ExportReadinessReport({
      matchId: 'm',
      attestation: bundle.attestation,
      historyReconciliation: bundle.historyReconciliation,
      checkpointCoverage: bundle.checkpointCoverage,
      playbackIntegrity: bundle.playbackIntegrity,
      rewindSafety: bundle.rewindSafety,
    });
    assert.equal(direct.deterministicFingerprint, bundle.exportReadiness.deterministicFingerprint);
  });
});

describe('Agent 24 export manifest', () => {
  it('lists required manifest sections', () => {
    const bundle = buildAgent24ReplayDeterminismBundle({
      matchId: 'm',
      turn: 10,
      day: 10,
      replay: { events: [{ eventType: 'replay_checkpoint', turn: 10, sequence: 1 }], checkpoints: { '10': {} } },
      deterministicMode: true,
    });
    assert.ok(bundle.exportManifest.sections.some(s => s.kind === 'composite_bundle'));
    assert.ok(runAgent24ExportManifestSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 import validation', () => {
  it('accepts aligned manifest and bundle fingerprints', () => {
    const bundle = buildAgent24ReplayDeterminismBundle({
      matchId: 'm',
      turn: 14,
      day: 14,
      replay: {
        events: [
          { eventType: 'replay_checkpoint', turn: 7, sequence: 1 },
          { eventType: 'replay_checkpoint', turn: 14, sequence: 2 },
        ],
        checkpoints: { '7': {}, '14': {} },
      },
      deterministicMode: true,
    });
    assert.equal(bundle.importValidation.valid, true);
    assert.ok(runAgent24ImportValidationSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 history retention', () => {
  it('computes prune-safe cutoff from checkpoints', () => {
    const bundle = buildAgent24ReplayDeterminismBundle({
      matchId: 'm',
      turn: 20,
      day: 20,
      maxTurns: 100,
      replay: {
        events: [
          { eventType: 'replay_checkpoint', turn: 8, sequence: 1 },
          { eventType: 'replay_checkpoint', turn: 15, sequence: 2 },
        ],
        checkpoints: { '8': {}, '15': {} },
      },
      deterministicMode: true,
    });
    assert.ok(bundle.historyRetention.bandCount >= 2);
    assert.ok(bundle.historyRetention.retentionScore >= 50);
    const direct = buildAgent24HistoryRetentionReport({
      matchId: 'm',
      currentTurn: 20,
      maxTurns: 100,
      checkpointCoverage: bundle.checkpointCoverage,
      rewindSafety: bundle.rewindSafety,
    });
    assert.equal(direct.deterministicFingerprint, bundle.historyRetention.deterministicFingerprint);
    assert.ok(runAgent24HistoryRetentionSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 archive compaction', () => {
  it('plans eligible bands below prune-safe cutoff', () => {
    const bundle = buildAgent24ReplayDeterminismBundle({
      matchId: 'm',
      turn: 20,
      day: 20,
      maxTurns: 100,
      replay: {
        events: [
          { eventType: 'replay_checkpoint', turn: 8, sequence: 1 },
          { eventType: 'replay_checkpoint', turn: 15, sequence: 2 },
        ],
        checkpoints: { '8': {}, '15': {} },
      },
      deterministicMode: true,
    });
    assert.ok(bundle.archiveCompaction.bands.length >= 1);
    const direct = buildAgent24ArchiveCompactionPlan({
      matchId: 'm',
      currentTurn: 20,
      historyRetention: bundle.historyRetention,
      importValidation: bundle.importValidation,
      replayEventCount: bundle.snapshot.integrity.replayEventCount,
    });
    assert.equal(direct.deterministicFingerprint, bundle.archiveCompaction.deterministicFingerprint);
    assert.ok(runAgent24ArchiveCompactionSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay transfer gate', () => {
  it('allows transfer when import and manifest are clean', () => {
    const bundle = buildAgent24ReplayDeterminismBundle({
      matchId: 'm',
      turn: 14,
      day: 14,
      replay: {
        events: [
          { eventType: 'replay_checkpoint', turn: 7, sequence: 1 },
          { eventType: 'replay_checkpoint', turn: 14, sequence: 2 },
        ],
        checkpoints: { '7': {}, '14': {} },
      },
      deterministicMode: true,
    });
    assert.equal(bundle.replayTransferGate.transferAllowed, true);
    const direct = buildAgent24ReplayTransferGateReport({
      matchId: 'm',
      manifest: bundle.exportManifest,
      importValidation: bundle.importValidation,
      historyRetention: bundle.historyRetention,
    });
    assert.equal(direct.deterministicFingerprint, bundle.replayTransferGate.deterministicFingerprint);
    assert.ok(runAgent24ReplayTransferGateSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 snapshot seal', () => {
  it('seals healthy export bundles with linked fingerprints', () => {
    const bundle = buildAgent24ReplayDeterminismBundle({
      matchId: 'm',
      turn: 12,
      day: 12,
      replay: {
        events: [
          { eventType: 'replay_checkpoint', turn: 8, sequence: 1 },
          { eventType: 'replay_checkpoint', turn: 12, sequence: 2 },
        ],
        checkpoints: { '8': {}, '12': {} },
      },
      deterministicMode: true,
    });
    assert.equal(bundle.snapshotSeal.sealed, true);
    assert.ok(bundle.snapshotSeal.linkCount >= 5);
    const direct = buildAgent24SnapshotSeal({
      matchId: 'm',
      turn: 12,
      compositeBundleFingerprint: bundle.exportManifest.compositeBundleFingerprint,
      manifest: bundle.exportManifest,
      importValidation: bundle.importValidation,
      transferGate: bundle.replayTransferGate,
      archiveCompaction: bundle.archiveCompaction,
    });
    assert.equal(direct.deterministicFingerprint, bundle.snapshotSeal.deterministicFingerprint);
    assert.ok(runAgent24SnapshotSealSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 seal verification', () => {
  it('verifies aligned seal links on healthy bundles', () => {
    const bundle = buildAgent24ReplayDeterminismBundle({
      matchId: 'm',
      turn: 14,
      day: 14,
      replay: {
        events: [
          { eventType: 'replay_checkpoint', turn: 7, sequence: 1 },
          { eventType: 'replay_checkpoint', turn: 14, sequence: 2 },
        ],
        checkpoints: { '7': {}, '14': {} },
      },
      deterministicMode: true,
    });
    assert.equal(bundle.sealVerification.verified, true);
    assert.equal(bundle.sealVerification.linkMatchCount, 5);
    const direct = buildAgent24SealVerificationReport({
      matchId: 'm',
      compositeBundleFingerprint: bundle.exportManifest.compositeBundleFingerprint,
      snapshotSeal: bundle.snapshotSeal,
      manifest: bundle.exportManifest,
      importValidation: bundle.importValidation,
      transferGate: bundle.replayTransferGate,
      archiveCompaction: bundle.archiveCompaction,
    });
    assert.equal(direct.deterministicFingerprint, bundle.sealVerification.deterministicFingerprint);
    assert.ok(runAgent24SealVerificationSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay restore gate', () => {
  it('allows restore when seal verified and playback is monotonic', () => {
    const bundle = buildAgent24ReplayDeterminismBundle({
      matchId: 'm',
      turn: 16,
      day: 16,
      replay: {
        events: [
          { eventType: 'replay_checkpoint', turn: 8, sequence: 1 },
          { eventType: 'replay_checkpoint', turn: 16, sequence: 2 },
        ],
        checkpoints: { '8': {}, '16': {} },
      },
      deterministicMode: true,
    });
    assert.equal(bundle.replayRestoreGate.restoreAllowed, true);
    assert.ok(bundle.replayRestoreGate.recommendedRestoreTurn !== null);
    const direct = buildAgent24ReplayRestoreGateReport({
      matchId: 'm',
      snapshotSeal: bundle.snapshotSeal,
      sealVerification: bundle.sealVerification,
      rewindSafety: bundle.rewindSafety,
      playbackIntegrity: bundle.playbackIntegrity,
      archiveCompaction: bundle.archiveCompaction,
    });
    assert.equal(direct.deterministicFingerprint, bundle.replayRestoreGate.deterministicFingerprint);
    assert.ok(runAgent24ReplayRestoreGateSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 archive publish plan', () => {
  it('marks publish-ready slots when gates and bands align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle({
      matchId: 'm',
      turn: 22,
      day: 22,
      maxTurns: 100,
      replay: {
        events: [
          { eventType: 'replay_checkpoint', turn: 8, sequence: 1 },
          { eventType: 'replay_checkpoint', turn: 15, sequence: 2 },
          { eventType: 'replay_checkpoint', turn: 22, sequence: 3 },
        ],
        checkpoints: { '8': {}, '15': {}, '22': {} },
      },
      deterministicMode: true,
    });
    assert.ok(bundle.archivePublishPlan.publishScore >= 50);
    const direct = buildAgent24ArchivePublishPlan({
      matchId: 'm',
      currentTurn: 22,
      snapshotSeal: bundle.snapshotSeal,
      sealVerification: bundle.sealVerification,
      replayTransferGate: bundle.replayTransferGate,
      archiveCompaction: bundle.archiveCompaction,
    });
    assert.equal(direct.deterministicFingerprint, bundle.archivePublishPlan.deterministicFingerprint);
    assert.ok(runAgent24ArchivePublishPlanSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay restore plan', () => {
  it('builds ordered restore steps when gate allows', () => {
    const bundle = buildAgent24ReplayDeterminismBundle({
      matchId: 'm',
      turn: 18,
      day: 18,
      replay: {
        events: [
          { eventType: 'replay_checkpoint', turn: 8, sequence: 1 },
          { eventType: 'replay_checkpoint', turn: 18, sequence: 2 },
        ],
        checkpoints: { '8': {}, '18': {} },
      },
      deterministicMode: true,
    });
    assert.ok(bundle.replayRestorePlan.stepCount >= 3);
    const direct = buildAgent24ReplayRestorePlan({
      matchId: 'm',
      replayRestoreGate: bundle.replayRestoreGate,
      sealVerification: bundle.sealVerification,
      rewindSafety: bundle.rewindSafety,
      checkpointCoverage: bundle.checkpointCoverage,
    });
    assert.equal(direct.deterministicFingerprint, bundle.replayRestorePlan.deterministicFingerprint);
    assert.ok(runAgent24ReplayRestorePlanSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 archive publish dispatch', () => {
  it('dispatches jobs when publish and restore plans align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle({
      matchId: 'm',
      turn: 24,
      day: 24,
      maxTurns: 100,
      replay: {
        events: [
          { eventType: 'replay_checkpoint', turn: 8, sequence: 1 },
          { eventType: 'replay_checkpoint', turn: 16, sequence: 2 },
          { eventType: 'replay_checkpoint', turn: 24, sequence: 3 },
        ],
        checkpoints: { '8': {}, '16': {}, '24': {} },
      },
      deterministicMode: true,
    });
    const direct = buildAgent24ArchivePublishDispatchReport({
      matchId: 'm',
      currentTurn: 24,
      snapshotSeal: bundle.snapshotSeal,
      archivePublishPlan: bundle.archivePublishPlan,
      replayRestorePlan: bundle.replayRestorePlan,
    });
    assert.equal(direct.deterministicFingerprint, bundle.archivePublishDispatch.deterministicFingerprint);
    assert.ok(runAgent24ArchivePublishDispatchSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 publish receipt ledger', () => {
  it('links dispatched jobs to snapshot seal receipts', () => {
    const bundle = buildAgent24ReplayDeterminismBundle({
      matchId: 'm',
      turn: 26,
      day: 26,
      maxTurns: 100,
      replay: {
        events: [
          { eventType: 'replay_checkpoint', turn: 8, sequence: 1 },
          { eventType: 'replay_checkpoint', turn: 18, sequence: 2 },
          { eventType: 'replay_checkpoint', turn: 26, sequence: 3 },
        ],
        checkpoints: { '8': {}, '18': {}, '26': {} },
      },
      deterministicMode: true,
    });
    const direct = buildAgent24PublishReceiptLedger({
      matchId: 'm',
      snapshotSeal: bundle.snapshotSeal,
      archivePublishPlan: bundle.archivePublishPlan,
      publishDispatch: bundle.archivePublishDispatch,
    });
    assert.equal(direct.deterministicFingerprint, bundle.publishReceiptLedger.deterministicFingerprint);
    assert.ok(runAgent24PublishReceiptLedgerSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 restore execution gate', () => {
  it('allows execution when restore plan and playback align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle({
      matchId: 'm',
      turn: 20,
      day: 20,
      replay: {
        events: [
          { eventType: 'replay_checkpoint', turn: 8, sequence: 1 },
          { eventType: 'replay_checkpoint', turn: 20, sequence: 2 },
        ],
        checkpoints: { '8': {}, '20': {} },
      },
      deterministicMode: true,
    });
    assert.equal(bundle.restoreExecutionGate.executionAllowed, true);
    const direct = buildAgent24RestoreExecutionGateReport({
      matchId: 'm',
      replayRestorePlan: bundle.replayRestorePlan,
      replayRestoreGate: bundle.replayRestoreGate,
      playbackIntegrity: bundle.playbackIntegrity,
    });
    assert.equal(direct.deterministicFingerprint, bundle.restoreExecutionGate.deterministicFingerprint);
    assert.ok(runAgent24RestoreExecutionGateSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 archive fulfillment audit', () => {
  it('marks fulfillment complete when dispatch matches ledger', () => {
    const bundle = buildAgent24ReplayDeterminismBundle({
      matchId: 'm',
      turn: 28,
      day: 28,
      maxTurns: 100,
      replay: {
        events: [
          { eventType: 'replay_checkpoint', turn: 8, sequence: 1 },
          { eventType: 'replay_checkpoint', turn: 20, sequence: 2 },
          { eventType: 'replay_checkpoint', turn: 28, sequence: 3 },
        ],
        checkpoints: { '8': {}, '20': {}, '28': {} },
      },
      deterministicMode: true,
    });
    const direct = buildAgent24ArchiveFulfillmentAuditReport({
      matchId: 'm',
      publishDispatch: bundle.archivePublishDispatch,
      publishReceiptLedger: bundle.publishReceiptLedger,
    });
    assert.equal(direct.deterministicFingerprint, bundle.archiveFulfillmentAudit.deterministicFingerprint);
    assert.ok(runAgent24ArchiveFulfillmentAuditSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 ledger seal continuity', () => {
  it('links receipt ledger entries to verified snapshot seal', () => {
    const bundle = buildAgent24ReplayDeterminismBundle({
      matchId: 'm',
      turn: 30,
      day: 30,
      maxTurns: 100,
      replay: {
        events: [
          { eventType: 'replay_checkpoint', turn: 8, sequence: 1 },
          { eventType: 'replay_checkpoint', turn: 22, sequence: 2 },
          { eventType: 'replay_checkpoint', turn: 30, sequence: 3 },
        ],
        checkpoints: { '8': {}, '22': {}, '30': {} },
      },
      deterministicMode: true,
    });
    const direct = buildAgent24LedgerSealContinuityReport({
      matchId: 'm',
      compositeBundleFingerprint: bundle.exportManifest.compositeBundleFingerprint,
      snapshotSeal: bundle.snapshotSeal,
      sealVerification: bundle.sealVerification,
      publishReceiptLedger: bundle.publishReceiptLedger,
      fulfillmentAudit: bundle.archiveFulfillmentAudit,
    });
    assert.equal(direct.deterministicFingerprint, bundle.ledgerSealContinuity.deterministicFingerprint);
    assert.ok(runAgent24LedgerSealContinuitySelfTests().every(t => t.passed));
  });
});

describe('Agent 24 restore commit record', () => {
  it('records committed restore steps when execution gate allows', () => {
    const bundle = buildAgent24ReplayDeterminismBundle({
      matchId: 'm',
      turn: 22,
      day: 22,
      replay: {
        events: [
          { eventType: 'replay_checkpoint', turn: 8, sequence: 1 },
          { eventType: 'replay_checkpoint', turn: 22, sequence: 2 },
        ],
        checkpoints: { '8': {}, '22': {} },
      },
      deterministicMode: true,
    });
    assert.equal(bundle.restoreCommitRecord.commitAllowed, true);
    const direct = buildAgent24RestoreCommitRecord({
      matchId: 'm',
      currentTurn: 22,
      replayRestorePlan: bundle.replayRestorePlan,
      restoreExecutionGate: bundle.restoreExecutionGate,
    });
    assert.equal(direct.deterministicFingerprint, bundle.restoreCommitRecord.deterministicFingerprint);
    assert.ok(runAgent24RestoreCommitRecordSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 fulfillment seal bridge', () => {
  it('bridges fulfillment audit to ledger seal continuity', () => {
    const bundle = buildAgent24ReplayDeterminismBundle({
      matchId: 'm',
      turn: 32,
      day: 32,
      maxTurns: 100,
      replay: {
        events: [
          { eventType: 'replay_checkpoint', turn: 8, sequence: 1 },
          { eventType: 'replay_checkpoint', turn: 24, sequence: 2 },
          { eventType: 'replay_checkpoint', turn: 32, sequence: 3 },
        ],
        checkpoints: { '8': {}, '24': {}, '32': {} },
      },
      deterministicMode: true,
    });
    const direct = buildAgent24FulfillmentSealBridgeReport({
      matchId: 'm',
      snapshotSeal: bundle.snapshotSeal,
      fulfillmentAudit: bundle.archiveFulfillmentAudit,
      ledgerSealContinuity: bundle.ledgerSealContinuity,
    });
    assert.equal(direct.deterministicFingerprint, bundle.fulfillmentSealBridge.deterministicFingerprint);
    assert.ok(runAgent24FulfillmentSealBridgeSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 archive continuity attestation', () => {
  it('attests verified continuity when restore, bridge, and ledger align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle({
      matchId: 'm',
      turn: 34,
      day: 34,
      maxTurns: 100,
      replay: {
        events: [
          { eventType: 'replay_checkpoint', turn: 8, sequence: 1 },
          { eventType: 'replay_checkpoint', turn: 26, sequence: 2 },
          { eventType: 'replay_checkpoint', turn: 34, sequence: 3 },
        ],
        checkpoints: { '8': {}, '26': {}, '34': {} },
      },
      deterministicMode: true,
    });
    const direct = buildAgent24ArchiveContinuityAttestation({
      matchId: 'm',
      restoreCommitRecord: bundle.restoreCommitRecord,
      fulfillmentSealBridge: bundle.fulfillmentSealBridge,
      ledgerSealContinuity: bundle.ledgerSealContinuity,
    });
    assert.equal(direct.deterministicFingerprint, bundle.archiveContinuityAttestation.deterministicFingerprint);
    assert.ok(runAgent24ArchiveContinuityAttestationSelfTests().every(t => t.passed));
  });
});

const richArchiveBundleInput = () => ({
  matchId: 'm',
  turn: 36,
  day: 36,
  maxTurns: 100,
  replay: {
    events: [
      { eventType: 'replay_checkpoint', turn: 8, sequence: 1 },
      { eventType: 'replay_checkpoint', turn: 24, sequence: 2 },
      { eventType: 'replay_checkpoint', turn: 36, sequence: 3 },
    ],
    checkpoints: { '8': {}, '24': {}, '36': {} },
  },
  deterministicMode: true,
});

describe('Agent 24 continuity export gate', () => {
  it('opens export when attestation verified and transfer ready', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    const direct = buildAgent24ContinuityExportGateReport({
      matchId: 'm',
      archiveContinuityAttestation: bundle.archiveContinuityAttestation,
      exportReadiness: bundle.exportReadiness,
      replayTransferGate: bundle.replayTransferGate,
    });
    assert.equal(direct.deterministicFingerprint, bundle.continuityExportGate.deterministicFingerprint);
    assert.ok(runAgent24ContinuityExportGateSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 restore commit audit', () => {
  it('passes audit when commit record matches plan and gate', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.restoreCommitAudit.auditPassed, true);
    const direct = buildAgent24RestoreCommitAuditReport({
      matchId: 'm',
      restoreCommitRecord: bundle.restoreCommitRecord,
      replayRestorePlan: bundle.replayRestorePlan,
      restoreExecutionGate: bundle.restoreExecutionGate,
    });
    assert.equal(direct.deterministicFingerprint, bundle.restoreCommitAudit.deterministicFingerprint);
    assert.ok(runAgent24RestoreCommitAuditSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 attestation chain seal', () => {
  it('seals attestation chain when all segments align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    const direct = buildAgent24AttestationChainSeal({
      matchId: 'm',
      snapshotSeal: bundle.snapshotSeal,
      exportManifest: bundle.exportManifest,
      archiveContinuityAttestation: bundle.archiveContinuityAttestation,
      continuityExportGate: bundle.continuityExportGate,
    });
    assert.equal(direct.deterministicFingerprint, bundle.attestationChainSeal.deterministicFingerprint);
    assert.ok(runAgent24AttestationChainSealSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 attestation chain verification', () => {
  it('verifies sealed chain against snapshot seal verification', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    const direct = buildAgent24AttestationChainVerificationReport({
      matchId: 'm',
      attestationChainSeal: bundle.attestationChainSeal,
      snapshotSeal: bundle.snapshotSeal,
      sealVerification: bundle.sealVerification,
    });
    assert.equal(direct.deterministicFingerprint, bundle.attestationChainVerification.deterministicFingerprint);
    assert.ok(runAgent24AttestationChainVerificationSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 continuity export ledger', () => {
  it('records export ledger entry when gates verify', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.continuityExportLedger.ledgerComplete, true);
    const direct = buildAgent24ContinuityExportLedger({
      matchId: 'm',
      currentTurn: bundle.restoreCommitRecord.currentTurn,
      continuityExportGate: bundle.continuityExportGate,
      restoreCommitAudit: bundle.restoreCommitAudit,
      attestationChainVerification: bundle.attestationChainVerification,
    });
    assert.equal(direct.deterministicFingerprint, bundle.continuityExportLedger.deterministicFingerprint);
    assert.ok(runAgent24ContinuityExportLedgerSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 archive roundtrip gate', () => {
  it('allows roundtrip when export ledger and import validation align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.archiveRoundtripGate.roundtripAllowed, true);
    const direct = buildAgent24ArchiveRoundtripGateReport({
      matchId: 'm',
      continuityExportLedger: bundle.continuityExportLedger,
      importValidation: bundle.importValidation,
      replayTransferGate: bundle.replayTransferGate,
    });
    assert.equal(direct.deterministicFingerprint, bundle.archiveRoundtripGate.deterministicFingerprint);
    assert.ok(runAgent24ArchiveRoundtripGateSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 archive roundtrip verification', () => {
  it('verifies roundtrip when gate, chain, and export ledger align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.archiveRoundtripVerification.verified, true);
    const direct = buildAgent24ArchiveRoundtripVerificationReport({
      matchId: 'm',
      archiveRoundtripGate: bundle.archiveRoundtripGate,
      attestationChainVerification: bundle.attestationChainVerification,
      continuityExportLedger: bundle.continuityExportLedger,
    });
    assert.equal(direct.deterministicFingerprint, bundle.archiveRoundtripVerification.deterministicFingerprint);
    assert.ok(runAgent24ArchiveRoundtripVerificationSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 export ledger reconciliation', () => {
  it('reconciles continuity export ledger with publish receipts', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.exportLedgerReconciliation.reconciled, true);
    const direct = buildAgent24ExportLedgerReconciliationReport({
      matchId: 'm',
      continuityExportLedger: bundle.continuityExportLedger,
      publishReceiptLedger: bundle.publishReceiptLedger,
      fulfillmentAudit: bundle.archiveFulfillmentAudit,
    });
    assert.equal(direct.deterministicFingerprint, bundle.exportLedgerReconciliation.deterministicFingerprint);
    assert.ok(runAgent24ExportLedgerReconciliationSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 archive handoff seal', () => {
  it('marks handoff ready when roundtrip, reconciliation, and chain seal align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.archiveHandoffSeal.handoffReady, true);
    const direct = buildAgent24ArchiveHandoffSeal({
      matchId: 'm',
      attestationChainSeal: bundle.attestationChainSeal,
      archiveRoundtripVerification: bundle.archiveRoundtripVerification,
      exportLedgerReconciliation: bundle.exportLedgerReconciliation,
    });
    assert.equal(direct.deterministicFingerprint, bundle.archiveHandoffSeal.deterministicFingerprint);
    assert.ok(runAgent24ArchiveHandoffSealSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 archive handoff verification', () => {
  it('verifies handoff when seal, roundtrip, and chain align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.archiveHandoffVerification.verified, true);
    const direct = buildAgent24ArchiveHandoffVerificationReport({
      matchId: 'm',
      archiveHandoffSeal: bundle.archiveHandoffSeal,
      archiveRoundtripVerification: bundle.archiveRoundtripVerification,
      attestationChainVerification: bundle.attestationChainVerification,
    });
    assert.equal(direct.deterministicFingerprint, bundle.archiveHandoffVerification.deterministicFingerprint);
    assert.ok(runAgent24ArchiveHandoffVerificationSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay pipeline closeout', () => {
  it('completes closeout when continuity pipeline checkpoints pass', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayPipelineCloseout.closeoutComplete, true);
    const direct = buildAgent24ReplayPipelineCloseoutReport({
      matchId: 'm',
      currentTurn: 36,
      archiveContinuityAttestation: bundle.archiveContinuityAttestation,
      archiveHandoffVerification: bundle.archiveHandoffVerification,
      exportLedgerReconciliation: bundle.exportLedgerReconciliation,
    });
    assert.equal(direct.deterministicFingerprint, bundle.replayPipelineCloseout.deterministicFingerprint);
    assert.ok(runAgent24ReplayPipelineCloseoutSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 archive continuity finalization', () => {
  it('finalizes when closeout, handoff, and roundtrip gate align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.archiveContinuityFinalization.finalized, true);
    const direct = buildAgent24ArchiveContinuityFinalizationReport({
      matchId: 'm',
      replayPipelineCloseout: bundle.replayPipelineCloseout,
      archiveHandoffSeal: bundle.archiveHandoffSeal,
      archiveRoundtripGate: bundle.archiveRoundtripGate,
    });
    assert.equal(direct.deterministicFingerprint, bundle.archiveContinuityFinalization.deterministicFingerprint);
    assert.ok(runAgent24ArchiveContinuityFinalizationSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 archive continuity verification', () => {
  it('verifies continuity when finalization, handoff, and closeout align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.archiveContinuityVerification.verified, true);
    const direct = buildAgent24ArchiveContinuityVerificationReport({
      matchId: 'm',
      archiveContinuityFinalization: bundle.archiveContinuityFinalization,
      archiveHandoffVerification: bundle.archiveHandoffVerification,
      replayPipelineCloseout: bundle.replayPipelineCloseout,
    });
    assert.equal(direct.deterministicFingerprint, bundle.archiveContinuityVerification.deterministicFingerprint);
    assert.ok(runAgent24ArchiveContinuityVerificationSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay scale wave acceptance', () => {
  it('accepts wave 29 when continuity, export, and depth align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveAcceptance.accepted, true);
    assert.equal(bundle.replayScaleWaveAcceptance.waveRound, 29);
    const direct = buildAgent24ReplayScaleWaveAcceptanceReport({
      matchId: 'm',
      waveRound: 29,
      archiveContinuityVerification: bundle.archiveContinuityVerification,
      exportReadiness: bundle.exportReadiness,
      analyticsDepth: bundle.analyticsDepth,
    });
    assert.equal(direct.deterministicFingerprint, bundle.replayScaleWaveAcceptance.deterministicFingerprint);
    assert.ok(runAgent24ReplayScaleWaveAcceptanceSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 archive release gate', () => {
  it('allows release when wave acceptance and publish pipeline align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.archiveReleaseGate.releaseAllowed, true);
    const direct = buildAgent24ArchiveReleaseGateReport({
      matchId: 'm',
      replayScaleWaveAcceptance: bundle.replayScaleWaveAcceptance,
      archivePublishPlan: bundle.archivePublishPlan,
      archivePublishDispatch: bundle.archivePublishDispatch,
    });
    assert.equal(direct.deterministicFingerprint, bundle.archiveReleaseGate.deterministicFingerprint);
    assert.ok(runAgent24ArchiveReleaseGateSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 archive release verification', () => {
  it('verifies release when gate, receipt ledger, and fulfillment align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.archiveReleaseVerification.verified, true);
    const direct = buildAgent24ArchiveReleaseVerificationReport({
      matchId: 'm',
      archiveReleaseGate: bundle.archiveReleaseGate,
      publishReceiptLedger: bundle.publishReceiptLedger,
      archiveFulfillmentAudit: bundle.archiveFulfillmentAudit,
    });
    assert.equal(direct.deterministicFingerprint, bundle.archiveReleaseVerification.deterministicFingerprint);
    assert.ok(runAgent24ArchiveReleaseVerificationSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay scale wave handoff seal', () => {
  it('seals handoff when wave acceptance and release verification align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveHandoffSeal.handoffReady, true);
    assert.equal(bundle.replayScaleWaveHandoffSeal.waveRound, 29);
    const direct = buildAgent24ReplayScaleWaveHandoffSeal({
      matchId: 'm',
      replayScaleWaveAcceptance: bundle.replayScaleWaveAcceptance,
      archiveReleaseGate: bundle.archiveReleaseGate,
      archiveReleaseVerification: bundle.archiveReleaseVerification,
    });
    assert.equal(direct.deterministicFingerprint, bundle.replayScaleWaveHandoffSeal.deterministicFingerprint);
    assert.ok(runAgent24ReplayScaleWaveHandoffSealSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay scale wave closeout', () => {
  it('completes closeout when wave handoff and release verification align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveCloseout.closeoutComplete, true);
    assert.equal(bundle.replayScaleWaveCloseout.waveRound, 29);
    const direct = buildAgent24ReplayScaleWaveCloseoutReport({
      matchId: 'm',
      replayScaleWaveAcceptance: bundle.replayScaleWaveAcceptance,
      replayScaleWaveHandoffSeal: bundle.replayScaleWaveHandoffSeal,
      archiveReleaseVerification: bundle.archiveReleaseVerification,
    });
    assert.equal(direct.deterministicFingerprint, bundle.replayScaleWaveCloseout.deterministicFingerprint);
    assert.ok(runAgent24ReplayScaleWaveCloseoutSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay scale wave verification', () => {
  it('verifies scale wave when closeout, handoff seal, and acceptance align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveVerification.verified, true);
    assert.equal(bundle.replayScaleWaveVerification.waveRound, 29);
    const direct = buildAgent24ReplayScaleWaveVerificationReport({
      matchId: 'm',
      replayScaleWaveCloseout: bundle.replayScaleWaveCloseout,
      replayScaleWaveHandoffSeal: bundle.replayScaleWaveHandoffSeal,
      replayScaleWaveAcceptance: bundle.replayScaleWaveAcceptance,
    });
    assert.equal(direct.deterministicFingerprint, bundle.replayScaleWaveVerification.deterministicFingerprint);
    assert.ok(runAgent24ReplayScaleWaveVerificationSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 archive scale wave finalization', () => {
  it('finalizes when verification, closeout, and release verification align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.archiveScaleWaveFinalization.finalized, true);
    assert.equal(bundle.archiveScaleWaveFinalization.waveRound, 29);
    const direct = buildAgent24ArchiveScaleWaveFinalizationReport({
      matchId: 'm',
      replayScaleWaveVerification: bundle.replayScaleWaveVerification,
      replayScaleWaveCloseout: bundle.replayScaleWaveCloseout,
      archiveReleaseVerification: bundle.archiveReleaseVerification,
    });
    assert.equal(direct.deterministicFingerprint, bundle.archiveScaleWaveFinalization.deterministicFingerprint);
    assert.ok(runAgent24ArchiveScaleWaveFinalizationSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay scale wave attestation', () => {
  it('attests verified scale wave when finalization stack is ready', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveAttestation.status, 'verified');
    assert.equal(bundle.replayScaleWaveAttestation.waveRound, 29);
    const direct = buildAgent24ReplayScaleWaveAttestation({
      matchId: 'm',
      replayScaleWaveVerification: bundle.replayScaleWaveVerification,
      archiveScaleWaveFinalization: bundle.archiveScaleWaveFinalization,
      replayScaleWaveCloseout: bundle.replayScaleWaveCloseout,
    });
    assert.equal(direct.deterministicFingerprint, bundle.replayScaleWaveAttestation.deterministicFingerprint);
    assert.ok(runAgent24ReplayScaleWaveAttestationSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay scale wave attestation verification', () => {
  it('verifies attestation when wave stack and finalization align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveAttestationVerification.verified, true);
    assert.equal(bundle.replayScaleWaveAttestationVerification.waveRound, 29);
    const direct = buildAgent24ReplayScaleWaveAttestationVerificationReport({
      matchId: 'm',
      replayScaleWaveAttestation: bundle.replayScaleWaveAttestation,
      replayScaleWaveVerification: bundle.replayScaleWaveVerification,
      archiveScaleWaveFinalization: bundle.archiveScaleWaveFinalization,
    });
    assert.equal(
      direct.deterministicFingerprint,
      bundle.replayScaleWaveAttestationVerification.deterministicFingerprint,
    );
    assert.ok(runAgent24ReplayScaleWaveAttestationVerificationSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 archive scale wave release handoff gate', () => {
  it('allows handoff when attestation verification and release verification align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.archiveScaleWaveReleaseHandoffGate.handoffAllowed, true);
    assert.equal(bundle.archiveScaleWaveReleaseHandoffGate.waveRound, 29);
    const direct = buildAgent24ArchiveScaleWaveReleaseHandoffGateReport({
      matchId: 'm',
      replayScaleWaveAttestationVerification: bundle.replayScaleWaveAttestationVerification,
      archiveReleaseVerification: bundle.archiveReleaseVerification,
      replayScaleWaveAttestation: bundle.replayScaleWaveAttestation,
    });
    assert.equal(
      direct.deterministicFingerprint,
      bundle.archiveScaleWaveReleaseHandoffGate.deterministicFingerprint,
    );
    assert.ok(runAgent24ArchiveScaleWaveReleaseHandoffGateSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay scale wave integration closeout', () => {
  it('completes integration closeout at O10-189 baseline', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveIntegrationCloseout.closeoutComplete, true);
    assert.equal(bundle.replayScaleWaveIntegrationCloseout.waveRound, 29);
    assert.equal(bundle.replayScaleWaveIntegrationCloseout.integrationBaselineSha, O6K_AGENT24_WAVE29_INTEGRATION_BASELINE_SHA);
    const direct = buildAgent24ReplayScaleWaveIntegrationCloseoutReport({
      matchId: 'm',
      archiveScaleWaveReleaseHandoffGate: bundle.archiveScaleWaveReleaseHandoffGate,
      replayScaleWaveAttestationVerification: bundle.replayScaleWaveAttestationVerification,
      replayScaleWaveCloseout: bundle.replayScaleWaveCloseout,
    });
    assert.equal(
      direct.deterministicFingerprint,
      bundle.replayScaleWaveIntegrationCloseout.deterministicFingerprint,
    );
    assert.ok(runAgent24ReplayScaleWaveIntegrationCloseoutSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay scale wave integration verification', () => {
  it('verifies integration when closeout, attestation verification, and handoff align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveIntegrationVerification.verified, true);
    assert.equal(bundle.replayScaleWaveIntegrationVerification.waveRound, 29);
    assert.equal(bundle.replayScaleWaveIntegrationVerification.integrationBaselineSha, O6K_AGENT24_WAVE29_INTEGRATION_BASELINE_SHA);
    const direct = buildAgent24ReplayScaleWaveIntegrationVerificationReport({
      matchId: 'm',
      replayScaleWaveIntegrationCloseout: bundle.replayScaleWaveIntegrationCloseout,
      replayScaleWaveAttestationVerification: bundle.replayScaleWaveAttestationVerification,
      archiveScaleWaveReleaseHandoffGate: bundle.archiveScaleWaveReleaseHandoffGate,
    });
    assert.equal(
      direct.deterministicFingerprint,
      bundle.replayScaleWaveIntegrationVerification.deterministicFingerprint,
    );
    assert.ok(runAgent24ReplayScaleWaveIntegrationVerificationSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 archive scale wave export gate', () => {
  it('allows export when integration verified and export readiness align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.archiveScaleWaveExportGate.exportAllowed, true);
    assert.equal(bundle.archiveScaleWaveExportGate.waveRound, 29);
    const direct = buildAgent24ArchiveScaleWaveExportGateReport({
      matchId: 'm',
      replayScaleWaveIntegrationVerification: bundle.replayScaleWaveIntegrationVerification,
      exportReadiness: bundle.exportReadiness,
      replayScaleWaveIntegrationCloseout: bundle.replayScaleWaveIntegrationCloseout,
    });
    assert.equal(direct.deterministicFingerprint, bundle.archiveScaleWaveExportGate.deterministicFingerprint);
    assert.ok(runAgent24ArchiveScaleWaveExportGateSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay scale wave projection handoff', () => {
  it('seals projection handoff at O10-189 baseline', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveProjectionHandoffSeal.handoffReady, true);
    assert.equal(bundle.replayScaleWaveProjectionHandoffSeal.waveRound, 29);
    assert.equal(bundle.replayScaleWaveProjectionHandoffSeal.projectionBaselineSha, O6K_AGENT24_WAVE29_INTEGRATION_BASELINE_SHA);
    const direct = buildAgent24ReplayScaleWaveProjectionHandoffSeal({
      matchId: 'm',
      archiveScaleWaveExportGate: bundle.archiveScaleWaveExportGate,
      replayScaleWaveIntegrationVerification: bundle.replayScaleWaveIntegrationVerification,
    });
    assert.equal(
      direct.deterministicFingerprint,
      bundle.replayScaleWaveProjectionHandoffSeal.deterministicFingerprint,
    );
    assert.ok(runAgent24ReplayScaleWaveProjectionHandoffSealSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay scale wave projection verification', () => {
  it('verifies projection when handoff, integration, and export gate align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveProjectionVerification.verified, true);
    assert.equal(bundle.replayScaleWaveProjectionVerification.waveRound, 29);
    assert.equal(bundle.replayScaleWaveProjectionVerification.projectionBaselineSha, O6K_AGENT24_WAVE29_INTEGRATION_BASELINE_SHA);
    const direct = buildAgent24ReplayScaleWaveProjectionVerificationReport({
      matchId: 'm',
      replayScaleWaveProjectionHandoffSeal: bundle.replayScaleWaveProjectionHandoffSeal,
      replayScaleWaveIntegrationVerification: bundle.replayScaleWaveIntegrationVerification,
      archiveScaleWaveExportGate: bundle.archiveScaleWaveExportGate,
    });
    assert.equal(
      direct.deterministicFingerprint,
      bundle.replayScaleWaveProjectionVerification.deterministicFingerprint,
    );
    assert.ok(runAgent24ReplayScaleWaveProjectionVerificationSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 archive scale wave post projection gate', () => {
  it('opens gate when projection verified and transfer or export paths align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.archiveScaleWavePostProjectionGate.gateOpen, true);
    assert.equal(bundle.archiveScaleWavePostProjectionGate.waveRound, 29);
    const direct = buildAgent24ArchiveScaleWavePostProjectionGateReport({
      matchId: 'm',
      replayScaleWaveProjectionVerification: bundle.replayScaleWaveProjectionVerification,
      replayTransferGate: bundle.replayTransferGate,
      continuityExportGate: bundle.continuityExportGate,
    });
    assert.equal(
      direct.deterministicFingerprint,
      bundle.archiveScaleWavePostProjectionGate.deterministicFingerprint,
    );
    assert.ok(runAgent24ArchiveScaleWavePostProjectionGateSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay scale wave dryrun handoff', () => {
  it('completes dryrun handoff at O10-189 baseline', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveDryrunHandoff.handoffComplete, true);
    assert.equal(bundle.replayScaleWaveDryrunHandoff.waveRound, 29);
    assert.equal(bundle.replayScaleWaveDryrunHandoff.dryrunBaselineSha, O6K_AGENT24_WAVE29_INTEGRATION_BASELINE_SHA);
    const direct = buildAgent24ReplayScaleWaveDryrunHandoffReport({
      matchId: 'm',
      archiveScaleWavePostProjectionGate: bundle.archiveScaleWavePostProjectionGate,
      replayScaleWaveProjectionVerification: bundle.replayScaleWaveProjectionVerification,
    });
    assert.equal(direct.deterministicFingerprint, bundle.replayScaleWaveDryrunHandoff.deterministicFingerprint);
    assert.ok(runAgent24ReplayScaleWaveDryrunHandoffSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay scale wave dryrun verification', () => {
  it('verifies dryrun when handoff, projection, and post-projection gate align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveDryrunVerification.verified, true);
    assert.equal(bundle.replayScaleWaveDryrunVerification.waveRound, 29);
    assert.equal(bundle.replayScaleWaveDryrunVerification.dryrunBaselineSha, O6K_AGENT24_WAVE29_INTEGRATION_BASELINE_SHA);
    const direct = buildAgent24ReplayScaleWaveDryrunVerificationReport({
      matchId: 'm',
      replayScaleWaveDryrunHandoff: bundle.replayScaleWaveDryrunHandoff,
      replayScaleWaveProjectionVerification: bundle.replayScaleWaveProjectionVerification,
      archiveScaleWavePostProjectionGate: bundle.archiveScaleWavePostProjectionGate,
    });
    assert.equal(direct.deterministicFingerprint, bundle.replayScaleWaveDryrunVerification.deterministicFingerprint);
    assert.ok(runAgent24ReplayScaleWaveDryrunVerificationSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 archive scale wave full chunks gate', () => {
  it('opens full-chunks gate when dryrun verified and manifest/import align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.archiveScaleWaveFullChunksGate.chunksGateOpen, true);
    assert.equal(bundle.archiveScaleWaveFullChunksGate.waveRound, 29);
    const direct = buildAgent24ArchiveScaleWaveFullChunksGateReport({
      matchId: 'm',
      replayScaleWaveDryrunVerification: bundle.replayScaleWaveDryrunVerification,
      exportManifest: bundle.exportManifest,
      importValidation: bundle.importValidation,
    });
    assert.equal(direct.deterministicFingerprint, bundle.archiveScaleWaveFullChunksGate.deterministicFingerprint);
    assert.ok(runAgent24ArchiveScaleWaveFullChunksGateSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay scale wave full chunks handoff', () => {
  it('seals full-chunks handoff at wave 29 baseline', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveFullChunksHandoffSeal.handoffReady, true);
    assert.equal(bundle.replayScaleWaveFullChunksHandoffSeal.waveRound, 29);
    assert.equal(bundle.replayScaleWaveFullChunksHandoffSeal.fullChunksBaselineSha, O6K_AGENT24_WAVE29_INTEGRATION_BASELINE_SHA);
    const direct = buildAgent24ReplayScaleWaveFullChunksHandoffSeal({
      matchId: 'm',
      archiveScaleWaveFullChunksGate: bundle.archiveScaleWaveFullChunksGate,
      replayScaleWaveDryrunVerification: bundle.replayScaleWaveDryrunVerification,
    });
    assert.equal(
      direct.deterministicFingerprint,
      bundle.replayScaleWaveFullChunksHandoffSeal.deterministicFingerprint,
    );
    assert.ok(runAgent24ReplayScaleWaveFullChunksHandoffSealSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay scale wave full chunks verification', () => {
  it('verifies full-chunks when handoff, gate, and dryrun align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveFullChunksVerification.verified, true);
    assert.equal(bundle.replayScaleWaveFullChunksVerification.waveRound, 29);
    assert.equal(bundle.replayScaleWaveFullChunksVerification.fullChunksBaselineSha, O6K_AGENT24_WAVE29_INTEGRATION_BASELINE_SHA);
    const direct = buildAgent24ReplayScaleWaveFullChunksVerificationReport({
      matchId: 'm',
      replayScaleWaveFullChunksHandoffSeal: bundle.replayScaleWaveFullChunksHandoffSeal,
      archiveScaleWaveFullChunksGate: bundle.archiveScaleWaveFullChunksGate,
      replayScaleWaveDryrunVerification: bundle.replayScaleWaveDryrunVerification,
    });
    assert.equal(direct.deterministicFingerprint, bundle.replayScaleWaveFullChunksVerification.deterministicFingerprint);
    assert.ok(runAgent24ReplayScaleWaveFullChunksVerificationSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 archive scale wave wave23 export gate', () => {
  it('allows export when full-chunks verified and seals align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.archiveScaleWaveWave23ExportGate.exportAllowed, true);
    assert.equal(bundle.archiveScaleWaveWave23ExportGate.waveRound, 29);
    const direct = buildAgent24ArchiveScaleWaveWave23ExportGateReport({
      matchId: 'm',
      replayScaleWaveFullChunksVerification: bundle.replayScaleWaveFullChunksVerification,
      snapshotSeal: bundle.snapshotSeal,
      sealVerification: bundle.sealVerification,
    });
    assert.equal(direct.deterministicFingerprint, bundle.archiveScaleWaveWave23ExportGate.deterministicFingerprint);
    assert.ok(runAgent24ArchiveScaleWaveWave23ExportGateSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay scale wave wave23 integration handoff', () => {
  it('completes integration handoff at wave 23 baseline', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveWave23IntegrationHandoff.handoffComplete, true);
    assert.equal(bundle.replayScaleWaveWave23IntegrationHandoff.waveRound, 29);
    assert.equal(bundle.replayScaleWaveWave23IntegrationHandoff.integrationBaselineSha, O6K_AGENT24_WAVE23_INTEGRATION_BASELINE_SHA);
    const direct = buildAgent24ReplayScaleWaveWave23IntegrationHandoffReport({
      matchId: 'm',
      archiveScaleWaveWave23ExportGate: bundle.archiveScaleWaveWave23ExportGate,
      replayScaleWaveFullChunksVerification: bundle.replayScaleWaveFullChunksVerification,
    });
    assert.equal(
      direct.deterministicFingerprint,
      bundle.replayScaleWaveWave23IntegrationHandoff.deterministicFingerprint,
    );
    assert.ok(runAgent24ReplayScaleWaveWave23IntegrationHandoffSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay scale wave wave23 integration verification', () => {
  it('verifies wave23 integration when handoff, export, and full-chunks align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveWave23IntegrationVerification.verified, true);
    assert.equal(bundle.replayScaleWaveWave23IntegrationVerification.waveRound, 29);
    assert.equal(
      bundle.replayScaleWaveWave23IntegrationVerification.integrationBaselineSha,
      O6K_AGENT24_WAVE23_INTEGRATION_BASELINE_SHA,
    );
    const direct = buildAgent24ReplayScaleWaveWave23IntegrationVerificationReport({
      matchId: 'm',
      replayScaleWaveWave23IntegrationHandoff: bundle.replayScaleWaveWave23IntegrationHandoff,
      archiveScaleWaveWave23ExportGate: bundle.archiveScaleWaveWave23ExportGate,
      replayScaleWaveFullChunksVerification: bundle.replayScaleWaveFullChunksVerification,
    });
    assert.equal(
      direct.deterministicFingerprint,
      bundle.replayScaleWaveWave23IntegrationVerification.deterministicFingerprint,
    );
    assert.ok(runAgent24ReplayScaleWaveWave23IntegrationVerificationSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 archive scale wave wave24 export gate', () => {
  it('allows export when wave23 integration verified and seals align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.archiveScaleWaveWave24ExportGate.exportAllowed, true);
    assert.equal(bundle.archiveScaleWaveWave24ExportGate.waveRound, 29);
    const direct = buildAgent24ArchiveScaleWaveWave24ExportGateReport({
      matchId: 'm',
      replayScaleWaveWave23IntegrationVerification: bundle.replayScaleWaveWave23IntegrationVerification,
      snapshotSeal: bundle.snapshotSeal,
      sealVerification: bundle.sealVerification,
    });
    assert.equal(direct.deterministicFingerprint, bundle.archiveScaleWaveWave24ExportGate.deterministicFingerprint);
    assert.ok(runAgent24ArchiveScaleWaveWave24ExportGateSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay scale wave wave24 integration handoff', () => {
  it('completes integration handoff at wave 24 baseline', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveWave24IntegrationHandoff.handoffComplete, true);
    assert.equal(bundle.replayScaleWaveWave24IntegrationHandoff.waveRound, 29);
    assert.equal(
      bundle.replayScaleWaveWave24IntegrationHandoff.integrationBaselineSha,
      O6K_AGENT24_WAVE24_INTEGRATION_BASELINE_SHA,
    );
    const direct = buildAgent24ReplayScaleWaveWave24IntegrationHandoffReport({
      matchId: 'm',
      archiveScaleWaveWave24ExportGate: bundle.archiveScaleWaveWave24ExportGate,
      replayScaleWaveWave23IntegrationVerification: bundle.replayScaleWaveWave23IntegrationVerification,
    });
    assert.equal(
      direct.deterministicFingerprint,
      bundle.replayScaleWaveWave24IntegrationHandoff.deterministicFingerprint,
    );
    assert.ok(runAgent24ReplayScaleWaveWave24IntegrationHandoffSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay scale wave wave24 integration verification', () => {
  it('verifies wave24 integration when handoff, export, and wave23 verification align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveWave24IntegrationVerification.verified, true);
    assert.equal(bundle.replayScaleWaveWave24IntegrationVerification.waveRound, 29);
    assert.equal(
      bundle.replayScaleWaveWave24IntegrationVerification.integrationBaselineSha,
      O6K_AGENT24_WAVE24_INTEGRATION_BASELINE_SHA,
    );
    const direct = buildAgent24ReplayScaleWaveWave24IntegrationVerificationReport({
      matchId: 'm',
      replayScaleWaveWave24IntegrationHandoff: bundle.replayScaleWaveWave24IntegrationHandoff,
      archiveScaleWaveWave24ExportGate: bundle.archiveScaleWaveWave24ExportGate,
      replayScaleWaveWave23IntegrationVerification: bundle.replayScaleWaveWave23IntegrationVerification,
    });
    assert.equal(
      direct.deterministicFingerprint,
      bundle.replayScaleWaveWave24IntegrationVerification.deterministicFingerprint,
    );
    assert.ok(runAgent24ReplayScaleWaveWave24IntegrationVerificationSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 archive scale wave wave25 export gate', () => {
  it('allows export when wave24 integration verified and seals align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.archiveScaleWaveWave25ExportGate.exportAllowed, true);
    assert.equal(bundle.archiveScaleWaveWave25ExportGate.waveRound, 29);
    const direct = buildAgent24ArchiveScaleWaveWave25ExportGateReport({
      matchId: 'm',
      replayScaleWaveWave24IntegrationVerification: bundle.replayScaleWaveWave24IntegrationVerification,
      snapshotSeal: bundle.snapshotSeal,
      sealVerification: bundle.sealVerification,
    });
    assert.equal(direct.deterministicFingerprint, bundle.archiveScaleWaveWave25ExportGate.deterministicFingerprint);
    assert.ok(runAgent24ArchiveScaleWaveWave25ExportGateSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay scale wave wave25 integration handoff', () => {
  it('completes integration handoff at wave 25 baseline', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveWave25IntegrationHandoff.handoffComplete, true);
    assert.equal(bundle.replayScaleWaveWave25IntegrationHandoff.waveRound, 29);
    assert.equal(
      bundle.replayScaleWaveWave25IntegrationHandoff.integrationBaselineSha,
      O6K_AGENT24_WAVE25_INTEGRATION_BASELINE_SHA,
    );
    const direct = buildAgent24ReplayScaleWaveWave25IntegrationHandoffReport({
      matchId: 'm',
      archiveScaleWaveWave25ExportGate: bundle.archiveScaleWaveWave25ExportGate,
      replayScaleWaveWave24IntegrationVerification: bundle.replayScaleWaveWave24IntegrationVerification,
    });
    assert.equal(
      direct.deterministicFingerprint,
      bundle.replayScaleWaveWave25IntegrationHandoff.deterministicFingerprint,
    );
    assert.ok(runAgent24ReplayScaleWaveWave25IntegrationHandoffSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay scale wave wave25 integration verification', () => {
  it('verifies wave25 integration when handoff, export, and wave24 verification align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveWave25IntegrationVerification.verified, true);
    assert.equal(bundle.replayScaleWaveWave25IntegrationVerification.waveRound, 29);
    assert.equal(
      bundle.replayScaleWaveWave25IntegrationVerification.integrationBaselineSha,
      O6K_AGENT24_WAVE25_INTEGRATION_BASELINE_SHA,
    );
    const direct = buildAgent24ReplayScaleWaveWave25IntegrationVerificationReport({
      matchId: 'm',
      replayScaleWaveWave25IntegrationHandoff: bundle.replayScaleWaveWave25IntegrationHandoff,
      archiveScaleWaveWave25ExportGate: bundle.archiveScaleWaveWave25ExportGate,
      replayScaleWaveWave24IntegrationVerification: bundle.replayScaleWaveWave24IntegrationVerification,
    });
    assert.equal(
      direct.deterministicFingerprint,
      bundle.replayScaleWaveWave25IntegrationVerification.deterministicFingerprint,
    );
    assert.ok(runAgent24ReplayScaleWaveWave25IntegrationVerificationSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 archive scale wave wave26 export gate', () => {
  it('allows export when wave25 integration verified and seals align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.archiveScaleWaveWave26ExportGate.exportAllowed, true);
    assert.equal(bundle.archiveScaleWaveWave26ExportGate.waveRound, 29);
    const direct = buildAgent24ArchiveScaleWaveWave26ExportGateReport({
      matchId: 'm',
      replayScaleWaveWave25IntegrationVerification: bundle.replayScaleWaveWave25IntegrationVerification,
      snapshotSeal: bundle.snapshotSeal,
      sealVerification: bundle.sealVerification,
    });
    assert.equal(direct.deterministicFingerprint, bundle.archiveScaleWaveWave26ExportGate.deterministicFingerprint);
    assert.ok(runAgent24ArchiveScaleWaveWave26ExportGateSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay scale wave wave26 integration handoff', () => {
  it('completes integration handoff at wave 26 baseline', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveWave26IntegrationHandoff.handoffComplete, true);
    assert.equal(bundle.replayScaleWaveWave26IntegrationHandoff.waveRound, 29);
    assert.equal(
      bundle.replayScaleWaveWave26IntegrationHandoff.integrationBaselineSha,
      O6K_AGENT24_WAVE26_INTEGRATION_BASELINE_SHA,
    );
    const direct = buildAgent24ReplayScaleWaveWave26IntegrationHandoffReport({
      matchId: 'm',
      archiveScaleWaveWave26ExportGate: bundle.archiveScaleWaveWave26ExportGate,
      replayScaleWaveWave25IntegrationVerification: bundle.replayScaleWaveWave25IntegrationVerification,
    });
    assert.equal(
      direct.deterministicFingerprint,
      bundle.replayScaleWaveWave26IntegrationHandoff.deterministicFingerprint,
    );
    assert.ok(runAgent24ReplayScaleWaveWave26IntegrationHandoffSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay scale wave wave26 integration verification', () => {
  it('verifies wave26 integration when handoff, export, and wave25 verification align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveWave26IntegrationVerification.verified, true);
    assert.equal(bundle.replayScaleWaveWave26IntegrationVerification.waveRound, 29);
    assert.equal(
      bundle.replayScaleWaveWave26IntegrationVerification.integrationBaselineSha,
      O6K_AGENT24_WAVE26_INTEGRATION_BASELINE_SHA,
    );
    const direct = buildAgent24ReplayScaleWaveWave26IntegrationVerificationReport({
      matchId: 'm',
      replayScaleWaveWave26IntegrationHandoff: bundle.replayScaleWaveWave26IntegrationHandoff,
      archiveScaleWaveWave26ExportGate: bundle.archiveScaleWaveWave26ExportGate,
      replayScaleWaveWave25IntegrationVerification: bundle.replayScaleWaveWave25IntegrationVerification,
    });
    assert.equal(
      direct.deterministicFingerprint,
      bundle.replayScaleWaveWave26IntegrationVerification.deterministicFingerprint,
    );
    assert.ok(runAgent24ReplayScaleWaveWave26IntegrationVerificationSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 archive scale wave wave27 export gate', () => {
  it('allows export when wave26 integration verified and seals align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.archiveScaleWaveWave27ExportGate.exportAllowed, true);
    assert.equal(bundle.archiveScaleWaveWave27ExportGate.waveRound, 29);
    const direct = buildAgent24ArchiveScaleWaveWave27ExportGateReport({
      matchId: 'm',
      replayScaleWaveWave26IntegrationVerification: bundle.replayScaleWaveWave26IntegrationVerification,
      snapshotSeal: bundle.snapshotSeal,
      sealVerification: bundle.sealVerification,
    });
    assert.equal(direct.deterministicFingerprint, bundle.archiveScaleWaveWave27ExportGate.deterministicFingerprint);
    assert.ok(runAgent24ArchiveScaleWaveWave27ExportGateSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay scale wave wave27 integration handoff', () => {
  it('completes integration handoff at wave 27 baseline', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveWave27IntegrationHandoff.handoffComplete, true);
    assert.equal(bundle.replayScaleWaveWave27IntegrationHandoff.waveRound, 29);
    assert.equal(
      bundle.replayScaleWaveWave27IntegrationHandoff.integrationBaselineSha,
      O6K_AGENT24_WAVE27_INTEGRATION_BASELINE_SHA,
    );
    const direct = buildAgent24ReplayScaleWaveWave27IntegrationHandoffReport({
      matchId: 'm',
      archiveScaleWaveWave27ExportGate: bundle.archiveScaleWaveWave27ExportGate,
      replayScaleWaveWave26IntegrationVerification: bundle.replayScaleWaveWave26IntegrationVerification,
    });
    assert.equal(
      direct.deterministicFingerprint,
      bundle.replayScaleWaveWave27IntegrationHandoff.deterministicFingerprint,
    );
    assert.ok(runAgent24ReplayScaleWaveWave27IntegrationHandoffSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay scale wave wave27 integration verification', () => {
  it('verifies wave27 integration when handoff, export, and wave26 verification align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveWave27IntegrationVerification.verified, true);
    assert.equal(bundle.replayScaleWaveWave27IntegrationVerification.waveRound, 29);
    assert.equal(
      bundle.replayScaleWaveWave27IntegrationVerification.integrationBaselineSha,
      O6K_AGENT24_WAVE27_INTEGRATION_BASELINE_SHA,
    );
    const direct = buildAgent24ReplayScaleWaveWave27IntegrationVerificationReport({
      matchId: 'm',
      replayScaleWaveWave27IntegrationHandoff: bundle.replayScaleWaveWave27IntegrationHandoff,
      archiveScaleWaveWave27ExportGate: bundle.archiveScaleWaveWave27ExportGate,
      replayScaleWaveWave26IntegrationVerification: bundle.replayScaleWaveWave26IntegrationVerification,
    });
    assert.equal(
      direct.deterministicFingerprint,
      bundle.replayScaleWaveWave27IntegrationVerification.deterministicFingerprint,
    );
    assert.ok(runAgent24ReplayScaleWaveWave27IntegrationVerificationSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 archive scale wave wave28 export gate', () => {
  it('allows export when wave27 integration verified and seals align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.archiveScaleWaveWave28ExportGate.exportAllowed, true);
    assert.equal(bundle.archiveScaleWaveWave28ExportGate.waveRound, 29);
    const direct = buildAgent24ArchiveScaleWaveWave28ExportGateReport({
      matchId: 'm',
      replayScaleWaveWave27IntegrationVerification: bundle.replayScaleWaveWave27IntegrationVerification,
      snapshotSeal: bundle.snapshotSeal,
      sealVerification: bundle.sealVerification,
    });
    assert.equal(direct.deterministicFingerprint, bundle.archiveScaleWaveWave28ExportGate.deterministicFingerprint);
    assert.ok(runAgent24ArchiveScaleWaveWave28ExportGateSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay scale wave wave28 integration handoff', () => {
  it('completes integration handoff at wave 28 baseline', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveWave28IntegrationHandoff.handoffComplete, true);
    assert.equal(bundle.replayScaleWaveWave28IntegrationHandoff.waveRound, 29);
    assert.equal(
      bundle.replayScaleWaveWave28IntegrationHandoff.integrationBaselineSha,
      O6K_AGENT24_WAVE28_INTEGRATION_BASELINE_SHA,
    );
    const direct = buildAgent24ReplayScaleWaveWave28IntegrationHandoffReport({
      matchId: 'm',
      archiveScaleWaveWave28ExportGate: bundle.archiveScaleWaveWave28ExportGate,
      replayScaleWaveWave27IntegrationVerification: bundle.replayScaleWaveWave27IntegrationVerification,
    });
    assert.equal(
      direct.deterministicFingerprint,
      bundle.replayScaleWaveWave28IntegrationHandoff.deterministicFingerprint,
    );
    assert.ok(runAgent24ReplayScaleWaveWave28IntegrationHandoffSelfTests().every(t => t.passed));
  });
});


describe('Agent 24 replay scale wave wave28 integration verification', () => {
  it('verifies wave28 integration when handoff, export, and wave27 verification align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveWave28IntegrationVerification.verified, true);
    assert.equal(bundle.replayScaleWaveWave28IntegrationVerification.waveRound, 29);
    assert.equal(
      bundle.replayScaleWaveWave28IntegrationVerification.integrationBaselineSha,
      O6K_AGENT24_WAVE28_INTEGRATION_BASELINE_SHA,
    );
    const direct = buildAgent24ReplayScaleWaveWave28IntegrationVerificationReport({
      matchId: 'm',
      replayScaleWaveWave28IntegrationHandoff: bundle.replayScaleWaveWave28IntegrationHandoff,
      archiveScaleWaveWave28ExportGate: bundle.archiveScaleWaveWave28ExportGate,
      replayScaleWaveWave27IntegrationVerification: bundle.replayScaleWaveWave27IntegrationVerification,
    });
    assert.equal(
      direct.deterministicFingerprint,
      bundle.replayScaleWaveWave28IntegrationVerification.deterministicFingerprint,
    );
    assert.ok(runAgent24ReplayScaleWaveWave28IntegrationVerificationSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 archive scale wave wave29 export gate', () => {
  it('allows export when wave28 integration verified and seals align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.archiveScaleWaveWave29ExportGate.exportAllowed, true);
    assert.equal(bundle.archiveScaleWaveWave29ExportGate.waveRound, 29);
    const direct = buildAgent24ArchiveScaleWaveWave29ExportGateReport({
      matchId: 'm',
      replayScaleWaveWave28IntegrationVerification: bundle.replayScaleWaveWave28IntegrationVerification,
      snapshotSeal: bundle.snapshotSeal,
      sealVerification: bundle.sealVerification,
    });
    assert.equal(direct.deterministicFingerprint, bundle.archiveScaleWaveWave29ExportGate.deterministicFingerprint);
    assert.ok(runAgent24ArchiveScaleWaveWave29ExportGateSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay scale wave wave29 integration handoff', () => {
  it('completes integration handoff at O10-189 baseline', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveWave29IntegrationHandoff.handoffComplete, true);
    assert.equal(bundle.replayScaleWaveWave29IntegrationHandoff.waveRound, 29);
    assert.equal(
      bundle.replayScaleWaveWave29IntegrationHandoff.integrationBaselineSha,
      O6K_AGENT24_WAVE29_INTEGRATION_BASELINE_SHA,
    );
    const direct = buildAgent24ReplayScaleWaveWave29IntegrationHandoffReport({
      matchId: 'm',
      archiveScaleWaveWave29ExportGate: bundle.archiveScaleWaveWave29ExportGate,
      replayScaleWaveWave28IntegrationVerification: bundle.replayScaleWaveWave28IntegrationVerification,
    });
    assert.equal(
      direct.deterministicFingerprint,
      bundle.replayScaleWaveWave29IntegrationHandoff.deterministicFingerprint,
    );
    assert.ok(runAgent24ReplayScaleWaveWave29IntegrationHandoffSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 history reconciliation', () {
  it('flags reconciled single-session bundles', () => {
    const bundle = buildAgent24ReplayDeterminismBundle({
      matchId: 'm',
      turn: 10,
      day: 10,
      replay: { events: [{ eventType: 'replay_checkpoint', turn: 10 }] },
      deterministicMode: true,
    });
    assert.equal(bundle.historyReconciliation.reconciled, true);
    assert.equal(bundle.historyReconciliation.issueCount, 0);
    const direct = buildAgent24HistoryReconciliationReport({
      matchId: 'm',
      multiSession: bundle.multiSession,
      auditTrail: bundle.auditTrail,
      attestation: bundle.attestation,
    });
    assert.equal(direct.deterministicFingerprint, bundle.historyReconciliation.deterministicFingerprint);
  });
});

describe('Agent 24 replay attestation', () => {
  it('marks verified bundles and runs self-tests', () => {
    const bundle = buildAgent24ReplayDeterminismBundle({
      matchId: 'm',
      turn: 8,
      day: 8,
      replay: { events: [{ eventType: 'replay_checkpoint', turn: 8 }] },
      deterministicMode: true,
    });
    assert.equal(bundle.attestation.status, 'verified');
    assert.ok(runAgent24AttestationSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 analytics depth self-tests', () => {
  it('runs bundled depth self-tests', () => {
    const results = runAgent24AnalyticsDepthSelfTests();
    assert.ok(results.every(r => r.passed), results.filter(r => !r.passed).map(r => r.name).join(','));
  });
});

describe('Agent 24 legacy self-tests', () => {
  it('runs inlined V9.4 self-tests', () => {
    const results = runO6kAgent24SelfTests();
    assert.ok(results.every(r => r.passed), results.filter(r => !r.passed).map(r => r.name).join(','));
  });

  it('stable stringify is key-order independent', () => {
    assert.equal(o6kAgent24StableStringify({ b: 1, a: 2 }), o6kAgent24StableStringify({ a: 2, b: 1 }));
  });
});
