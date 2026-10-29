import type {
  ResearchScaleWaveHandoffIntegrationSealBand,
  ResearchScaleWaveHandoffIntegrationSealBandEvent,
  ResearchScaleWaveHandoffIntegrationSealOutlook,
  ResearchScaleWaveHandoffIntegrationSealSnapshot,
} from './types.ts';

export const RESEARCH_HANDOFF_INTEGRATION_SEAL_BAND_LOG_CAP = 32;

export const RESEARCH_HANDOFF_INTEGRATION_SEAL_BANDS: ResearchScaleWaveHandoffIntegrationSealBand[] = [
  74, 88, 99, 100,
];

function sealScore(outlook: ResearchScaleWaveHandoffIntegrationSealOutlook): number {
  return Math.round(Math.min(100, Math.max(0, outlook.handoffIntegrationSealScore ?? 0)));
}

function highestLoggedBand(
  log: ResearchScaleWaveHandoffIntegrationSealBandEvent[],
  phase: ResearchScaleWaveHandoffIntegrationSealBandEvent['phase']
): ResearchScaleWaveHandoffIntegrationSealBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchScaleWaveHandoffIntegrationSealBand;
}

export function emptyHandoffIntegrationSealBandLog(): ResearchScaleWaveHandoffIntegrationSealBandEvent[] {
  return [];
}

export function appendHandoffIntegrationSealBandEvents(
  previousLog: ResearchScaleWaveHandoffIntegrationSealBandEvent[],
  previousSnapshot: ResearchScaleWaveHandoffIntegrationSealSnapshot | null,
  outlook: ResearchScaleWaveHandoffIntegrationSealOutlook,
  turn: number
): ResearchScaleWaveHandoffIntegrationSealBandEvent[] {
  const score = sealScore(outlook);
  const priorScore = previousSnapshot?.handoffIntegrationSealScore ?? 0;
  const appended: ResearchScaleWaveHandoffIntegrationSealBandEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(highestLoggedBand(previousLog, 'escalation'), previousSnapshot?.peakBand ?? 0);
    for (const band of RESEARCH_HANDOFF_INTEGRATION_SEAL_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        handoffIntegrationSealScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakBand ??
      (highestLoggedBand(previousLog, 'escalation') ||
        RESEARCH_HANDOFF_INTEGRATION_SEAL_BANDS[RESEARCH_HANDOFF_INTEGRATION_SEAL_BANDS.length - 1]);
    for (const band of [...RESEARCH_HANDOFF_INTEGRATION_SEAL_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        handoffIntegrationSealScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_HANDOFF_INTEGRATION_SEAL_BAND_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_HANDOFF_INTEGRATION_SEAL_BAND_LOG_CAP);
}
