import type {
  ResearchScaleWaveHandoffIntegrationBand,
  ResearchScaleWaveHandoffIntegrationBandEvent,
  ResearchScaleWaveHandoffIntegrationOutlook,
  ResearchScaleWaveHandoffIntegrationSnapshot,
} from './types.ts';

export const RESEARCH_HANDOFF_INTEGRATION_BAND_LOG_CAP = 32;

export const RESEARCH_HANDOFF_INTEGRATION_BANDS: ResearchScaleWaveHandoffIntegrationBand[] = [
  73, 87, 98, 100,
];

function integrationScore(outlook: ResearchScaleWaveHandoffIntegrationOutlook): number {
  return Math.round(Math.min(100, Math.max(0, outlook.handoffIntegrationScore ?? 0)));
}

function highestLoggedBand(
  log: ResearchScaleWaveHandoffIntegrationBandEvent[],
  phase: ResearchScaleWaveHandoffIntegrationBandEvent['phase']
): ResearchScaleWaveHandoffIntegrationBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchScaleWaveHandoffIntegrationBand;
}

export function emptyHandoffIntegrationBandLog(): ResearchScaleWaveHandoffIntegrationBandEvent[] {
  return [];
}

export function appendHandoffIntegrationBandEvents(
  previousLog: ResearchScaleWaveHandoffIntegrationBandEvent[],
  previousSnapshot: ResearchScaleWaveHandoffIntegrationSnapshot | null,
  outlook: ResearchScaleWaveHandoffIntegrationOutlook,
  turn: number
): ResearchScaleWaveHandoffIntegrationBandEvent[] {
  const score = integrationScore(outlook);
  const priorScore = previousSnapshot?.handoffIntegrationScore ?? 0;
  const appended: ResearchScaleWaveHandoffIntegrationBandEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(highestLoggedBand(previousLog, 'escalation'), previousSnapshot?.peakBand ?? 0);
    for (const band of RESEARCH_HANDOFF_INTEGRATION_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        handoffIntegrationScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakBand ??
      (highestLoggedBand(previousLog, 'escalation') ||
        RESEARCH_HANDOFF_INTEGRATION_BANDS[RESEARCH_HANDOFF_INTEGRATION_BANDS.length - 1]);
    for (const band of [...RESEARCH_HANDOFF_INTEGRATION_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        handoffIntegrationScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_HANDOFF_INTEGRATION_BAND_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_HANDOFF_INTEGRATION_BAND_LOG_CAP);
}
