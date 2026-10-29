import type {
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealBand,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealBandEvent,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealOutlook,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot,
} from './types.ts';

export const RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_BAND_LOG_CAP = 32;

export const RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_BANDS: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealBand[] =
  [96, 98, 99, 100];

function integrationSealSealSealSealSealSealSealSealSealScore(
  outlook: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealOutlook
): number {
  return Math.round(
    Math.min(100, Math.max(0, outlook.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealScore ?? 0))
  );
}

function highestLoggedBand(
  log: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealBandEvent[],
  phase: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealBandEvent['phase']
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealBand;
}

export function emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealBandLog(): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealBandEvent[] {
  return [];
}

export function appendSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealBandEvents(
  previousLog: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealBandEvent[],
  previousSnapshot: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot | null,
  outlook: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealOutlook,
  turn: number
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealBandEvent[] {
  const score = integrationSealSealSealSealSealSealSealSealSealScore(outlook);
  const priorScore = previousSnapshot?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealScore ?? 0;
  const appended: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealBandEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(highestLoggedBand(previousLog, 'escalation'), previousSnapshot?.peakBand ?? 0);
    for (const band of RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakBand ??
      (highestLoggedBand(previousLog, 'escalation') ||
        RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_BANDS[
          RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_BANDS.length - 1
        ]);
    for (const band of [...RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) {
    return previousLog.slice(
      -RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_BAND_LOG_CAP
    );
  }
  return [...previousLog, ...appended].slice(
    -RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_BAND_LOG_CAP
  );
}
