import type {
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealBand,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvent,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot,
} from './types.ts';

export const RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_BAND_LOG_CAP = 32;

export const RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_BANDS: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealBand[] =
  [82, 96, 99, 100];

function sealScore(outlook: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook): number {
  return Math.round(
    Math.min(100, Math.max(0, outlook.sealHandoffIntegrationSealContinuityHandoffIntegrationSealScore ?? 0))
  );
}

function highestLoggedBand(
  log: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvent[],
  phase: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvent['phase']
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealBand;
}

export function emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvent[] {
  return [];
}

export function appendSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvents(
  previousLog: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvent[],
  previousSnapshot: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot | null,
  outlook: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook,
  turn: number
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvent[] {
  const score = sealScore(outlook);
  const priorScore = previousSnapshot?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealScore ?? 0;
  const appended: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(highestLoggedBand(previousLog, 'escalation'), previousSnapshot?.peakBand ?? 0);
    for (const band of RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakBand ??
      (highestLoggedBand(previousLog, 'escalation') ||
        RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_BANDS[
          RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_BANDS.length - 1
        ]);
    for (const band of [...RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) {
    return previousLog.slice(-RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_BAND_LOG_CAP);
  }
  return [...previousLog, ...appended].slice(
    -RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_BAND_LOG_CAP
  );
}
