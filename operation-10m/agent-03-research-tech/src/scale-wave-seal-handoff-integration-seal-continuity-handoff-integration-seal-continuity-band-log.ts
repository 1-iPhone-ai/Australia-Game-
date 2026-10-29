import type {
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBand,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandEvent,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot,
} from './types.ts';

export const RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_BAND_LOG_CAP = 32;

export const RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_BANDS: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBand[] =
  [83, 97, 99, 100];

function continuityScore(
  outlook: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook
): number {
  return Math.round(
    Math.min(100, Math.max(0, outlook.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityScore ?? 0))
  );
}

function highestLoggedBand(
  log: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandEvent[],
  phase: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandEvent['phase']
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBand;
}

export function emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandEvent[] {
  return [];
}

export function appendSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandEvents(
  previousLog: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandEvent[],
  previousSnapshot: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot | null,
  outlook: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook,
  turn: number
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandEvent[] {
  const score = continuityScore(outlook);
  const priorScore = previousSnapshot?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityScore ?? 0;
  const appended: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(highestLoggedBand(previousLog, 'escalation'), previousSnapshot?.peakBand ?? 0);
    for (const band of RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakBand ??
      (highestLoggedBand(previousLog, 'escalation') ||
        RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_BANDS[
          RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_BANDS.length - 1
        ]);
    for (const band of [...RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) {
    return previousLog.slice(
      -RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_BAND_LOG_CAP
    );
  }
  return [...previousLog, ...appended].slice(
    -RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_BAND_LOG_CAP
  );
}
