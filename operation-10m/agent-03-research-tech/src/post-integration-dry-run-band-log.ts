import type {
  ResearchScaleWavePostIntegrationDryRunBand,
  ResearchScaleWavePostIntegrationDryRunBandEvent,
  ResearchScaleWavePostIntegrationDryRunOutlook,
  ResearchScaleWavePostIntegrationDryRunSnapshot,
} from './types.ts';

export const RESEARCH_POST_INTEGRATION_DRY_RUN_BAND_LOG_CAP = 32;

export const RESEARCH_POST_INTEGRATION_DRY_RUN_BANDS: ResearchScaleWavePostIntegrationDryRunBand[] = [
  64, 78, 92, 99,
];

function dryRunScore(outlook: ResearchScaleWavePostIntegrationDryRunOutlook): number {
  return Math.round(Math.min(100, Math.max(0, outlook.postIntegrationDryRunScore ?? 0)));
}

function highestLoggedBand(
  log: ResearchScaleWavePostIntegrationDryRunBandEvent[],
  phase: ResearchScaleWavePostIntegrationDryRunBandEvent['phase']
): ResearchScaleWavePostIntegrationDryRunBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchScaleWavePostIntegrationDryRunBand;
}

export function emptyPostIntegrationDryRunBandLog(): ResearchScaleWavePostIntegrationDryRunBandEvent[] {
  return [];
}

export function appendPostIntegrationDryRunBandEvents(
  previousLog: ResearchScaleWavePostIntegrationDryRunBandEvent[],
  previousSnapshot: ResearchScaleWavePostIntegrationDryRunSnapshot | null,
  outlook: ResearchScaleWavePostIntegrationDryRunOutlook,
  turn: number
): ResearchScaleWavePostIntegrationDryRunBandEvent[] {
  const score = dryRunScore(outlook);
  const priorScore = previousSnapshot?.postIntegrationDryRunScore ?? 0;
  const appended: ResearchScaleWavePostIntegrationDryRunBandEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(
      highestLoggedBand(previousLog, 'escalation'),
      previousSnapshot?.peakBand ?? 0
    );
    for (const band of RESEARCH_POST_INTEGRATION_DRY_RUN_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        postIntegrationDryRunScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakBand ??
      (highestLoggedBand(previousLog, 'escalation') ||
        RESEARCH_POST_INTEGRATION_DRY_RUN_BANDS[RESEARCH_POST_INTEGRATION_DRY_RUN_BANDS.length - 1]);
    for (const band of [...RESEARCH_POST_INTEGRATION_DRY_RUN_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        postIntegrationDryRunScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_POST_INTEGRATION_DRY_RUN_BAND_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_POST_INTEGRATION_DRY_RUN_BAND_LOG_CAP);
}
