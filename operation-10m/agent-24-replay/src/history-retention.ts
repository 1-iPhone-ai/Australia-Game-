import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24CheckpointCoverageReport } from './checkpoint-coverage.ts';
import type { Agent24RewindSafetyReport } from './rewind-safety.ts';

export interface Agent24HistoryRetentionBand {
  fromTurn: number;
  toTurn: number;
  checkpointCount: number;
  pruneSafe: boolean;
  fingerprint: string;
}

export interface Agent24HistoryRetentionReport {
  reportId: string;
  matchId: string;
  currentTurn: number;
  retentionWindowTurns: number;
  pruneSafeCutoffTurn: number;
  bands: Agent24HistoryRetentionBand[];
  bandCount: number;
  retentionScore: number;
  deterministicFingerprint: string;
}

export interface Agent24HistoryRetentionInput {
  matchId: string;
  currentTurn: number;
  maxTurns?: number;
  checkpointCoverage: Agent24CheckpointCoverageReport;
  rewindSafety: Agent24RewindSafetyReport;
  bandSize?: number;
  minRetentionTurns?: number;
}

export function buildAgent24HistoryRetentionReport(input: Agent24HistoryRetentionInput): Agent24HistoryRetentionReport {
  const bandSize = input.bandSize ?? 10;
  const minRetention = input.minRetentionTurns ?? Math.max(5, Math.floor(bandSize / 2));
  const maxTurns = input.maxTurns && input.maxTurns > 0 ? input.maxTurns : Math.max(input.currentTurn, bandSize);
  const retentionWindowTurns = Math.min(maxTurns, Math.max(minRetention, input.currentTurn));

  const safeTurns = new Set(
    input.rewindSafety.targets.filter(t => t.safe).map(t => t.turn),
  );
  const checkpointTurns = new Set(input.checkpointCoverage.checkpointTurns);

  const bands: Agent24HistoryRetentionBand[] = [];
  for (let from = 1; from <= input.currentTurn; from += bandSize) {
    const to = Math.min(from + bandSize - 1, input.currentTurn);
    let checkpointCount = 0;
    for (const t of checkpointTurns) {
      if (t >= from && t <= to) checkpointCount += 1;
    }
    const hasSafeRewind = [...safeTurns].some(t => t >= from && t <= to);
    const pruneSafe = from >= retentionWindowTurns ? false : hasSafeRewind || checkpointCount > 0;
    bands.push({
      fromTurn: from,
      toTurn: to,
      checkpointCount,
      pruneSafe,
      fingerprint: o6kAgent24Fingerprint('retention_band', { from, to, checkpointCount, pruneSafe }),
    });
  }

  bands.sort((a, b) => a.fromTurn - b.fromTurn);
  const pruneSafeCutoffTurn =
    bands.filter(b => b.pruneSafe).sort((a, b) => b.toTurn - a.toTurn)[0]?.toTurn ?? 0;

  let retentionScore = 100;
  if (input.checkpointCoverage.coverageScore < 50) retentionScore -= 20;
  if (input.rewindSafety.safeTargetCount === 0) retentionScore -= 25;
  if (pruneSafeCutoffTurn < minRetention && input.currentTurn > minRetention) retentionScore -= 15;
  retentionScore = Math.max(0, Math.min(100, retentionScore));

  return {
    reportId: o6kAgent24Fingerprint('history_retention', { matchId: input.matchId, turn: input.currentTurn }),
    matchId: input.matchId,
    currentTurn: input.currentTurn,
    retentionWindowTurns,
    pruneSafeCutoffTurn,
    bands,
    bandCount: bands.length,
    retentionScore,
    deterministicFingerprint: o6kAgent24Fingerprint('history_retention_body', {
      bands: bands.map(b => b.fingerprint),
      pruneSafeCutoffTurn,
      retentionScore,
    }),
  };
}

export function runAgent24HistoryRetentionSelfTests(): Array<{ name: string; passed: boolean }> {
  const coverage = {
    reportId: 'c',
    matchId: 'self',
    checkpointTurns: [4, 8, 12],
    checkpointCount: 3,
    maxGapTurns: 4,
    gaps: [],
    endgameCoverageOk: true,
    coverageScore: 85,
    deterministicFingerprint: o6kAgent24Fingerprint('ret_self_cov', { v: 1 }),
  };
  const rewind = {
    reportId: 'w',
    matchId: 'self',
    currentTurn: 15,
    targets: [
      { turn: 8, source: 'checkpoint' as const, label: 'ckpt', safe: true, fingerprint: 'f1' },
      { turn: 12, source: 'checkpoint' as const, label: 'ckpt2', safe: true, fingerprint: 'f2' },
    ],
    safeTargetCount: 2,
    recommendedTurn: 12,
    deterministicFingerprint: o6kAgent24Fingerprint('ret_self_rewind', { v: 1 }),
  };
  const report = buildAgent24HistoryRetentionReport({
    matchId: 'self',
    currentTurn: 15,
    maxTurns: 100,
    checkpointCoverage: coverage,
    rewindSafety: rewind,
    bandSize: 5,
  });
  return [
    { name: 'bands_cover_turn_range', passed: report.bandCount >= 2 && report.pruneSafeCutoffTurn >= 8 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24HistoryRetentionReport({
          matchId: 'self',
          currentTurn: 15,
          maxTurns: 100,
          checkpointCoverage: coverage,
          rewindSafety: rewind,
          bandSize: 5,
        }).deterministicFingerprint,
    },
  ];
}
