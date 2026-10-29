import type {
  ResearchScaleWaveIntegrationContinuityBand,
  ResearchScaleWaveIntegrationContinuityBandEvent,
  ResearchScaleWaveIntegrationContinuityOutlook,
  ResearchScaleWaveIntegrationContinuitySnapshot,
} from './types.ts';

export const RESEARCH_INTEGRATION_CONTINUITY_BAND_LOG_CAP = 32;

export const RESEARCH_INTEGRATION_CONTINUITY_BANDS: ResearchScaleWaveIntegrationContinuityBand[] = [
  70, 84, 98, 100,
];

function continuityScore(outlook: ResearchScaleWaveIntegrationContinuityOutlook): number {
  return Math.round(Math.min(100, Math.max(0, outlook.integrationContinuityScore ?? 0)));
}

function highestLoggedBand(
  log: ResearchScaleWaveIntegrationContinuityBandEvent[],
  phase: ResearchScaleWaveIntegrationContinuityBandEvent['phase']
): ResearchScaleWaveIntegrationContinuityBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchScaleWaveIntegrationContinuityBand;
}

export function emptyIntegrationContinuityBandLog(): ResearchScaleWaveIntegrationContinuityBandEvent[] {
  return [];
}

export function appendIntegrationContinuityBandEvents(
  previousLog: ResearchScaleWaveIntegrationContinuityBandEvent[],
  previousSnapshot: ResearchScaleWaveIntegrationContinuitySnapshot | null,
  outlook: ResearchScaleWaveIntegrationContinuityOutlook,
  turn: number
): ResearchScaleWaveIntegrationContinuityBandEvent[] {
  const score = continuityScore(outlook);
  const priorScore = previousSnapshot?.integrationContinuityScore ?? 0;
  const appended: ResearchScaleWaveIntegrationContinuityBandEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(highestLoggedBand(previousLog, 'escalation'), previousSnapshot?.peakBand ?? 0);
    for (const band of RESEARCH_INTEGRATION_CONTINUITY_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        integrationContinuityScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakBand ??
      (highestLoggedBand(previousLog, 'escalation') ||
        RESEARCH_INTEGRATION_CONTINUITY_BANDS[RESEARCH_INTEGRATION_CONTINUITY_BANDS.length - 1]);
    for (const band of [...RESEARCH_INTEGRATION_CONTINUITY_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        integrationContinuityScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_INTEGRATION_CONTINUITY_BAND_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_INTEGRATION_CONTINUITY_BAND_LOG_CAP);
}
