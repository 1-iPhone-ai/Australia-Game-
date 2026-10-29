import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24LateGameReplayAssessment } from './late-game-replay.ts';
import type { O6kHistoricalAnalyticsSnapshot } from './history-replay-analytics.ts';

export interface Agent24CheckpointGap {
  fromTurn: number;
  toTurn: number;
  spanTurns: number;
  severity: 'info' | 'warn' | 'critical';
  fingerprint: string;
}

export interface Agent24CheckpointCoverageReport {
  reportId: string;
  matchId: string;
  checkpointTurns: number[];
  checkpointCount: number;
  maxGapTurns: number;
  gaps: Agent24CheckpointGap[];
  endgameCoverageOk: boolean;
  coverageScore: number;
  deterministicFingerprint: string;
}

export interface Agent24CheckpointCoverageInput {
  matchId: string;
  snapshot: O6kHistoricalAnalyticsSnapshot;
  lateGame: Agent24LateGameReplayAssessment;
  maxTurns?: number;
  maxAllowedGapTurns?: number;
  checkpointTurns?: number[];
}

function gapSeverity(span: number, maxAllowed: number): Agent24CheckpointGap['severity'] {
  if (span <= maxAllowed) return 'info';
  if (span <= maxAllowed * 2) return 'warn';
  return 'critical';
}

export function buildAgent24CheckpointCoverageReport(input: Agent24CheckpointCoverageInput): Agent24CheckpointCoverageReport {
  const maxTurn = input.snapshot.generatedAtTurn;
  const maxAllowedGapTurns = input.maxAllowedGapTurns && input.maxAllowedGapTurns > 0 ? input.maxAllowedGapTurns : 12;
  const checkpointTurns = [...new Set(input.checkpointTurns || [])]
    .filter(t => Number.isFinite(t) && t >= 1 && t <= maxTurn)
    .sort((a, b) => a - b);
  const gaps: Agent24CheckpointGap[] = [];

  const anchors = [1, ...checkpointTurns, maxTurn];
  const uniqueAnchors = [...new Set(anchors)].sort((a, b) => a - b);

  for (let i = 1; i < uniqueAnchors.length; i++) {
    const fromTurn = uniqueAnchors[i - 1];
    const toTurn = uniqueAnchors[i];
    const spanTurns = toTurn - fromTurn;
    if (spanTurns <= 0) continue;
    if (spanTurns > maxAllowedGapTurns) {
      gaps.push({
        fromTurn,
        toTurn,
        spanTurns,
        severity: gapSeverity(spanTurns, maxAllowedGapTurns),
        fingerprint: o6kAgent24Fingerprint('checkpoint_gap', { fromTurn, toTurn, spanTurns }),
      });
    }
  }

  gaps.sort((a, b) => a.fromTurn - b.fromTurn || a.toTurn - b.toTurn);
  const maxGapTurns = gaps.reduce((m, g) => Math.max(m, g.spanTurns), 0);

  const maxTurns = input.maxTurns && input.maxTurns > 0 ? input.maxTurns : 120;
  const endgameStart = Math.floor(maxTurns * 0.75);
  const endgameCoverageOk =
    !input.lateGame.isLateGame ||
    checkpointTurns.some(t => t >= endgameStart && t <= maxTurn) ||
    gaps.filter(g => g.severity === 'critical' && g.toTurn >= endgameStart).length === 0;

  const criticalCount = gaps.filter(g => g.severity === 'critical').length;
  const warnCount = gaps.filter(g => g.severity === 'warn').length;
  let coverageScore = 100;
  coverageScore -= criticalCount * 25;
  coverageScore -= warnCount * 8;
  if (!endgameCoverageOk) coverageScore -= 15;
  coverageScore = Math.max(0, Math.min(100, coverageScore));

  const payload = {
    checkpoints: checkpointTurns,
    gaps: gaps.map(g => g.fingerprint),
    endgameCoverageOk,
    coverageScore,
  };

  return {
    reportId: o6kAgent24Fingerprint('checkpoint_coverage', { matchId: input.matchId, turn: maxTurn }),
    matchId: input.matchId,
    checkpointTurns,
    checkpointCount: checkpointTurns.length,
    maxGapTurns,
    gaps,
    endgameCoverageOk,
    coverageScore,
    deterministicFingerprint: o6kAgent24Fingerprint('checkpoint_coverage_body', payload),
  };
}

export function extractAgent24CheckpointTurnsFromReplay(replay?: {
  events?: Array<Record<string, unknown>>;
  checkpoints?: Record<string, unknown>;
} | null): number[] {
  const turns: number[] = [];
  for (const key of Object.keys(replay?.checkpoints || {})) {
    const n = Number.parseInt(key, 10);
    if (Number.isFinite(n)) turns.push(n);
  }
  for (const evt of replay?.events || []) {
    const type = String(evt?.eventType || '').toLowerCase();
    if (type.includes('checkpoint')) {
      const turn = Number(evt?.turn ?? evt?.day);
      if (Number.isFinite(turn)) turns.push(turn);
    }
  }
  return [...new Set(turns)].sort((a, b) => a - b);
}

export function runAgent24CheckpointCoverageSelfTests(): Array<{ name: string; passed: boolean; detail: string }> {
  const late = {
    isLateGame: false,
    requiresEndgameCheckpoint: false,
    fingerprint: 'x',
    phase: 'opening' as const,
    recommendedCheckpointKinds: ['turn'],
  };
  const snap = {
    matchId: 't',
    generatedAtTurn: 20,
    integrity: { replayEventCount: 2, checkpointCount: 2, fingerprint: 'i', deterministicMode: true },
    milestoneHits: [],
  } as O6kHistoricalAnalyticsSnapshot;
  const report = buildAgent24CheckpointCoverageReport({
    matchId: 't',
    snapshot: snap,
    lateGame: late,
    maxAllowedGapTurns: 6,
    checkpointTurns: [5, 15],
  });
  return [
    {
      name: 'checkpoint_coverage_counts',
      passed: report.checkpointCount >= 2 && report.coverageScore >= 0,
      detail: 'basic coverage report',
    },
  ];
}
