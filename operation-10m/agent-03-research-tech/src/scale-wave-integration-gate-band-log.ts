import type {
  ResearchScaleWaveIntegrationGateBand,
  ResearchScaleWaveIntegrationGateBandEvent,
  ResearchScaleWaveIntegrationGateOutlook,
  ResearchScaleWaveIntegrationGateSnapshot,
} from './types.ts';

export const RESEARCH_INTEGRATION_GATE_BAND_LOG_CAP = 32;

export const RESEARCH_INTEGRATION_GATE_BANDS: ResearchScaleWaveIntegrationGateBand[] = [58, 72, 86, 96];

function gateScore(outlook: ResearchScaleWaveIntegrationGateOutlook): number {
  return Math.round(Math.min(100, Math.max(0, outlook.integrationGateScore ?? 0)));
}

function highestLoggedBand(
  log: ResearchScaleWaveIntegrationGateBandEvent[],
  phase: ResearchScaleWaveIntegrationGateBandEvent['phase']
): ResearchScaleWaveIntegrationGateBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchScaleWaveIntegrationGateBand;
}

export function emptyIntegrationGateBandLog(): ResearchScaleWaveIntegrationGateBandEvent[] {
  return [];
}

export function appendIntegrationGateBandEvents(
  previousLog: ResearchScaleWaveIntegrationGateBandEvent[],
  previousSnapshot: ResearchScaleWaveIntegrationGateSnapshot | null,
  outlook: ResearchScaleWaveIntegrationGateOutlook,
  turn: number
): ResearchScaleWaveIntegrationGateBandEvent[] {
  const score = gateScore(outlook);
  const priorScore = previousSnapshot?.integrationGateScore ?? 0;
  const appended: ResearchScaleWaveIntegrationGateBandEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(highestLoggedBand(previousLog, 'escalation'), previousSnapshot?.peakBand ?? 0);
    for (const band of RESEARCH_INTEGRATION_GATE_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        integrationGateScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakBand ??
      (highestLoggedBand(previousLog, 'escalation') ||
        RESEARCH_INTEGRATION_GATE_BANDS[RESEARCH_INTEGRATION_GATE_BANDS.length - 1]);
    for (const band of [...RESEARCH_INTEGRATION_GATE_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        integrationGateScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_INTEGRATION_GATE_BAND_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_INTEGRATION_GATE_BAND_LOG_CAP);
}
