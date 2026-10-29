import type {
  ResearchScaleWaveIntegrationSealHandoffBand,
  ResearchScaleWaveIntegrationSealHandoffBandEvent,
  ResearchScaleWaveIntegrationSealHandoffOutlook,
  ResearchScaleWaveIntegrationSealHandoffSnapshot,
} from './types.ts';

export const RESEARCH_INTEGRATION_SEAL_HANDOFF_BAND_LOG_CAP = 32;

export const RESEARCH_INTEGRATION_SEAL_HANDOFF_BANDS: ResearchScaleWaveIntegrationSealHandoffBand[] = [
  75, 89, 99, 100,
];

function handoffScore(outlook: ResearchScaleWaveIntegrationSealHandoffOutlook): number {
  return Math.round(Math.min(100, Math.max(0, outlook.integrationSealHandoffScore ?? 0)));
}

function highestLoggedBand(
  log: ResearchScaleWaveIntegrationSealHandoffBandEvent[],
  phase: ResearchScaleWaveIntegrationSealHandoffBandEvent['phase']
): ResearchScaleWaveIntegrationSealHandoffBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchScaleWaveIntegrationSealHandoffBand;
}

export function emptyIntegrationSealHandoffBandLog(): ResearchScaleWaveIntegrationSealHandoffBandEvent[] {
  return [];
}

export function appendIntegrationSealHandoffBandEvents(
  previousLog: ResearchScaleWaveIntegrationSealHandoffBandEvent[],
  previousSnapshot: ResearchScaleWaveIntegrationSealHandoffSnapshot | null,
  outlook: ResearchScaleWaveIntegrationSealHandoffOutlook,
  turn: number
): ResearchScaleWaveIntegrationSealHandoffBandEvent[] {
  const score = handoffScore(outlook);
  const priorScore = previousSnapshot?.integrationSealHandoffScore ?? 0;
  const appended: ResearchScaleWaveIntegrationSealHandoffBandEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(highestLoggedBand(previousLog, 'escalation'), previousSnapshot?.peakBand ?? 0);
    for (const band of RESEARCH_INTEGRATION_SEAL_HANDOFF_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        integrationSealHandoffScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakBand ??
      (highestLoggedBand(previousLog, 'escalation') ||
        RESEARCH_INTEGRATION_SEAL_HANDOFF_BANDS[RESEARCH_INTEGRATION_SEAL_HANDOFF_BANDS.length - 1]);
    for (const band of [...RESEARCH_INTEGRATION_SEAL_HANDOFF_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        integrationSealHandoffScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_INTEGRATION_SEAL_HANDOFF_BAND_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_INTEGRATION_SEAL_HANDOFF_BAND_LOG_CAP);
}
