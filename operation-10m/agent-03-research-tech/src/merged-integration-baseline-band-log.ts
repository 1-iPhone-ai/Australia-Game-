import type {
  ResearchMergedIntegrationBaselineBand,
  ResearchMergedIntegrationBaselineBandEvent,
  ResearchMergedIntegrationBaselineOutlook,
  ResearchMergedIntegrationBaselineSnapshot,
} from './types.ts';

export const RESEARCH_MERGED_INTEGRATION_BASELINE_BAND_LOG_CAP = 32;

export const RESEARCH_MERGED_INTEGRATION_BASELINE_BANDS: ResearchMergedIntegrationBaselineBand[] = [
  62, 76, 90, 98,
];

function mergedScore(outlook: ResearchMergedIntegrationBaselineOutlook): number {
  return Math.round(Math.min(100, Math.max(0, outlook.mergedBaselineScore ?? 0)));
}

function highestLoggedBand(
  log: ResearchMergedIntegrationBaselineBandEvent[],
  phase: ResearchMergedIntegrationBaselineBandEvent['phase']
): ResearchMergedIntegrationBaselineBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchMergedIntegrationBaselineBand;
}

export function emptyMergedIntegrationBaselineBandLog(): ResearchMergedIntegrationBaselineBandEvent[] {
  return [];
}

export function appendMergedIntegrationBaselineBandEvents(
  previousLog: ResearchMergedIntegrationBaselineBandEvent[],
  previousSnapshot: ResearchMergedIntegrationBaselineSnapshot | null,
  outlook: ResearchMergedIntegrationBaselineOutlook,
  turn: number
): ResearchMergedIntegrationBaselineBandEvent[] {
  const score = mergedScore(outlook);
  const priorScore = previousSnapshot?.mergedBaselineScore ?? 0;
  const appended: ResearchMergedIntegrationBaselineBandEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(
      highestLoggedBand(previousLog, 'escalation'),
      previousSnapshot?.peakBand ?? 0
    );
    for (const band of RESEARCH_MERGED_INTEGRATION_BASELINE_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        mergedBaselineScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakBand ??
      (highestLoggedBand(previousLog, 'escalation') ||
        RESEARCH_MERGED_INTEGRATION_BASELINE_BANDS[
          RESEARCH_MERGED_INTEGRATION_BASELINE_BANDS.length - 1
        ]);
    for (const band of [...RESEARCH_MERGED_INTEGRATION_BASELINE_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        mergedBaselineScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_MERGED_INTEGRATION_BASELINE_BAND_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_MERGED_INTEGRATION_BASELINE_BAND_LOG_CAP);
}
