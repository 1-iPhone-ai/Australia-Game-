import type {
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffBand,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffBandEvent,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffOutlook,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffSnapshot,
} from './types.ts';

export const RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_BAND_LOG_CAP = 32;

export const RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_BANDS: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffBand[] =
  [80, 94, 99, 100];

function handoffScore(outlook: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffOutlook): number {
  return Math.round(Math.min(100, Math.max(0, outlook.sealHandoffIntegrationSealContinuityHandoffScore ?? 0)));
}

function highestLoggedBand(
  log: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffBandEvent[],
  phase: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffBandEvent['phase']
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffBand;
}

export function emptySealHandoffIntegrationSealContinuityHandoffBandLog(): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffBandEvent[] {
  return [];
}

export function appendSealHandoffIntegrationSealContinuityHandoffBandEvents(
  previousLog: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffBandEvent[],
  previousSnapshot: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffSnapshot | null,
  outlook: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffOutlook,
  turn: number
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffBandEvent[] {
  const score = handoffScore(outlook);
  const priorScore = previousSnapshot?.sealHandoffIntegrationSealContinuityHandoffScore ?? 0;
  const appended: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffBandEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(highestLoggedBand(previousLog, 'escalation'), previousSnapshot?.peakBand ?? 0);
    for (const band of RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        sealHandoffIntegrationSealContinuityHandoffScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakBand ??
      (highestLoggedBand(previousLog, 'escalation') ||
        RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_BANDS[
          RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_BANDS.length - 1
        ]);
    for (const band of [...RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        sealHandoffIntegrationSealContinuityHandoffScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) {
    return previousLog.slice(-RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_BAND_LOG_CAP);
  }
  return [...previousLog, ...appended].slice(-RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_BAND_LOG_CAP);
}
