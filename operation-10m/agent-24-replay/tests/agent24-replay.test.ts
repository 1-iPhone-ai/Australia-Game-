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

describe('Agent 24 history reconciliation', () => {
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
