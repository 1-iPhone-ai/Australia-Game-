import type {
  ResearchScaleWaveIntegrationSealBand,
  ResearchScaleWaveIntegrationSealBandEvent,
  ResearchScaleWaveIntegrationSealOutlook,
  ResearchScaleWaveIntegrationSealSnapshot,
} from './types.ts';

export const RESEARCH_INTEGRATION_SEAL_BAND_LOG_CAP = 32;

export const RESEARCH_INTEGRATION_SEAL_BANDS: ResearchScaleWaveIntegrationSealBand[] = [66, 80, 94, 100];

function sealScore(outlook: ResearchScaleWaveIntegrationSealOutlook): number {
  return Math.round(Math.min(100, Math.max(0, outlook.integrationSealScore ?? 0)));
}

function highestLoggedBand(
  log: ResearchScaleWaveIntegrationSealBandEvent[],
  phase: ResearchScaleWaveIntegrationSealBandEvent['phase']
): ResearchScaleWaveIntegrationSealBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchScaleWaveIntegrationSealBand;
}

export function emptyIntegrationSealBandLog(): ResearchScaleWaveIntegrationSealBandEvent[] {
  return [];
}

export function appendIntegrationSealBandEvents(
  previousLog: ResearchScaleWaveIntegrationSealBandEvent[],
  previousSnapshot: ResearchScaleWaveIntegrationSealSnapshot | null,
  outlook: ResearchScaleWaveIntegrationSealOutlook,
  turn: number
): ResearchScaleWaveIntegrationSealBandEvent[] {
  const score = sealScore(outlook);
  const priorScore = previousSnapshot?.integrationSealScore ?? 0;
  const appended: ResearchScaleWaveIntegrationSealBandEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(highestLoggedBand(previousLog, 'escalation'), previousSnapshot?.peakBand ?? 0);
    for (const band of RESEARCH_INTEGRATION_SEAL_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        integrationSealScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakBand ??
      (highestLoggedBand(previousLog, 'escalation') ||
        RESEARCH_INTEGRATION_SEAL_BANDS[RESEARCH_INTEGRATION_SEAL_BANDS.length - 1]);
    for (const band of [...RESEARCH_INTEGRATION_SEAL_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        integrationSealScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_INTEGRATION_SEAL_BAND_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_INTEGRATION_SEAL_BAND_LOG_CAP);
}
