import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { O6kHistoricalAnalyticsSnapshot } from './history-replay-analytics.ts';

export interface Agent24HistoryWindowRollup {
  windowId: string;
  fromTurn: number;
  toTurn: number;
  milestoneHitCount: number;
  milestoneWeightSum: number;
  replayEventCount: number;
  fingerprint: string;
}

export interface Agent24HistoryRollupInput {
  matchId: string;
  snapshot: O6kHistoricalAnalyticsSnapshot;
  windowSize?: number;
}

export interface Agent24HistoryRollupReport {
  reportId: string;
  matchId: string;
  windowSize: number;
  windows: Agent24HistoryWindowRollup[];
  totalMilestoneWeight: number;
  deterministicFingerprint: string;
}

export function buildAgent24HistoryRollupReport(input: Agent24HistoryRollupInput): Agent24HistoryRollupReport {
  const windowSize = input.windowSize && input.windowSize > 0 ? input.windowSize : 10;
  const maxTurn = input.snapshot.generatedAtTurn;
  const windows: Agent24HistoryWindowRollup[] = [];

  for (let from = 1; from <= maxTurn; from += windowSize) {
    const to = Math.min(maxTurn, from + windowSize - 1);
    const hits = input.snapshot.milestoneHits.filter(h => h.turn >= from && h.turn <= to);
    const weightSum = hits.reduce((s, h) => s + h.weight, 0);
    windows.push({
      windowId: o6kAgent24Fingerprint('history_window', { from, to }),
      fromTurn: from,
      toTurn: to,
      milestoneHitCount: hits.length,
      milestoneWeightSum: weightSum,
      replayEventCount: input.snapshot.integrity.replayEventCount,
      fingerprint: o6kAgent24Fingerprint('history_window_body', { from, to, count: hits.length, weightSum }),
    });
  }

  const totalMilestoneWeight = windows.reduce((s, w) => s + w.milestoneWeightSum, 0);
  const payload = windows.map(w => w.fingerprint);

  return {
    reportId: o6kAgent24Fingerprint('history_rollup', { matchId: input.matchId, windows: windows.length }),
    matchId: input.matchId,
    windowSize,
    windows,
    totalMilestoneWeight,
    deterministicFingerprint: o6kAgent24Fingerprint('history_rollup_body', payload),
  };
}
