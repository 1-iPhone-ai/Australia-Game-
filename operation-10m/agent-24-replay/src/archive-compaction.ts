import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24HistoryRetentionReport } from './history-retention.ts';
import type { Agent24ImportValidationReport } from './import-validation.ts';

export interface Agent24ArchiveCompactionBand {
  fromTurn: number;
  toTurn: number;
  eligible: boolean;
  reason: string;
  estimatedEventSlots: number;
  fingerprint: string;
}

export interface Agent24ArchiveCompactionPlan {
  planId: string;
  matchId: string;
  currentTurn: number;
  eligibleBandCount: number;
  protectedBandCount: number;
  estimatedSlotsReclaimed: number;
  compactionSafe: boolean;
  bands: Agent24ArchiveCompactionBand[];
  compactionScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveCompactionInput {
  matchId: string;
  currentTurn: number;
  historyRetention: Agent24HistoryRetentionReport;
  importValidation: Agent24ImportValidationReport;
  replayEventCount?: number;
}

export function buildAgent24ArchiveCompactionPlan(input: Agent24ArchiveCompactionInput): Agent24ArchiveCompactionPlan {
  const replayEventCount = input.replayEventCount ?? Math.max(1, input.currentTurn);
  const eventsPerTurn = Math.max(1, Math.ceil(replayEventCount / Math.max(1, input.currentTurn)));

  const bands: Agent24ArchiveCompactionBand[] = input.historyRetention.bands.map(band => {
    const eligible = !band.pruneSafe && band.toTurn < input.historyRetention.pruneSafeCutoffTurn;
    let reason = eligible ? 'outside_prune_safe_window' : 'protected_by_checkpoint_or_rewind';
    if (band.pruneSafe) reason = 'retention_band_marked_prune_safe';
    const estimatedEventSlots = eligible ? (band.toTurn - band.fromTurn + 1) * eventsPerTurn : 0;
    return {
      fromTurn: band.fromTurn,
      toTurn: band.toTurn,
      eligible,
      reason,
      estimatedEventSlots,
      fingerprint: o6kAgent24Fingerprint('archive_compaction_band', {
        from: band.fromTurn,
        to: band.toTurn,
        eligible,
        reason,
      }),
    };
  });

  bands.sort((a, b) => a.fromTurn - b.fromTurn);
  const eligibleBandCount = bands.filter(b => b.eligible).length;
  const protectedBandCount = bands.length - eligibleBandCount;
  const estimatedSlotsReclaimed = bands.reduce((sum, b) => sum + b.estimatedEventSlots, 0);

  let compactionScore = 100;
  if (input.importValidation.valid === false) compactionScore -= 35;
  if (input.historyRetention.retentionScore < 60) compactionScore -= 20;
  if (eligibleBandCount === 0 && input.currentTurn > 15) compactionScore -= 15;
  compactionScore = Math.max(0, Math.min(100, compactionScore));

  const compactionSafe =
    input.importValidation.valid &&
    input.historyRetention.pruneSafeCutoffTurn > 0 &&
    eligibleBandCount >= 0;

  return {
    planId: o6kAgent24Fingerprint('archive_compaction', { matchId: input.matchId, turn: input.currentTurn }),
    matchId: input.matchId,
    currentTurn: input.currentTurn,
    eligibleBandCount,
    protectedBandCount,
    estimatedSlotsReclaimed,
    compactionSafe,
    bands,
    compactionScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_compaction_body', {
      bands: bands.map(b => b.fingerprint),
      eligibleBandCount,
      estimatedSlotsReclaimed,
      compactionSafe,
      compactionScore,
    }),
  };
}

export function runAgent24ArchiveCompactionSelfTests(): Array<{ name: string; passed: boolean }> {
  const retention = {
    reportId: 'r',
    matchId: 'self',
    currentTurn: 20,
    retentionWindowTurns: 20,
    pruneSafeCutoffTurn: 11,
    bands: [
      {
        fromTurn: 1,
        toTurn: 5,
        checkpointCount: 1,
        pruneSafe: true,
        fingerprint: o6kAgent24Fingerprint('rb1', { v: 1 }),
      },
      {
        fromTurn: 6,
        toTurn: 10,
        checkpointCount: 0,
        pruneSafe: false,
        fingerprint: o6kAgent24Fingerprint('rb2', { v: 1 }),
      },
      {
        fromTurn: 11,
        toTurn: 15,
        checkpointCount: 1,
        pruneSafe: true,
        fingerprint: o6kAgent24Fingerprint('rb3', { v: 1 }),
      },
    ],
    bandCount: 3,
    retentionScore: 80,
    deterministicFingerprint: o6kAgent24Fingerprint('ret_self', { v: 1 }),
  };
  const importOk = {
    reportId: 'i',
    matchId: 'self',
    valid: true,
    issueCount: 0,
    issues: [],
    validationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('imp_self', { v: 1 }),
  };
  const plan = buildAgent24ArchiveCompactionPlan({
    matchId: 'self',
    currentTurn: 20,
    historyRetention: retention,
    importValidation: importOk,
    replayEventCount: 40,
  });
  return [
    {
      name: 'eligible_bands_below_cutoff',
      passed: plan.eligibleBandCount >= 1 && plan.compactionSafe,
    },
    {
      name: 'deterministic_fingerprint',
      passed:
        plan.deterministicFingerprint ===
        buildAgent24ArchiveCompactionPlan({
          matchId: 'self',
          currentTurn: 20,
          historyRetention: retention,
          importValidation: importOk,
          replayEventCount: 40,
        }).deterministicFingerprint,
    },
  ];
}
