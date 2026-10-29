import type {
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBand,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvent,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot,
} from './types.ts';

export const RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_BAND_LOG_CAP = 32;

export const RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_BANDS: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBand[] =
  [85, 98, 99, 100];

function sealScore(
  outlook: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook
): number {
  return Math.round(
    Math.min(100, Math.max(0, outlook.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealScore ?? 0))
  );
}

function highestLoggedBand(
  log: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvent[],
  phase: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvent['phase']
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBand;
}

export function emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvent[] {
  return [];
}

export function appendSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvents(
  previousLog: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvent[],
  previousSnapshot: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot | null,
  outlook: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook,
  turn: number
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvent[] {
  const score = sealScore(outlook);
  const priorScore = previousSnapshot?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealScore ?? 0;
  const appended: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(highestLoggedBand(previousLog, 'escalation'), previousSnapshot?.peakBand ?? 0);
    for (const band of RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakBand ??
      (highestLoggedBand(previousLog, 'escalation') ||
        RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_BANDS[
          RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_BANDS.length - 1
        ]);
    for (const band of [...RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) {
    return previousLog.slice(
      -RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_BAND_LOG_CAP
    );
  }
  return [...previousLog, ...appended].slice(
    -RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_BAND_LOG_CAP
  );
}
