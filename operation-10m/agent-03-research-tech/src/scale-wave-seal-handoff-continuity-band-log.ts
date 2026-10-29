import type {
  ResearchScaleWaveSealHandoffContinuityBand,
  ResearchScaleWaveSealHandoffContinuityBandEvent,
  ResearchScaleWaveSealHandoffContinuityOutlook,
  ResearchScaleWaveSealHandoffContinuitySnapshot,
} from './types.ts';

export const RESEARCH_SEAL_HANDOFF_CONTINUITY_BAND_LOG_CAP = 32;

export const RESEARCH_SEAL_HANDOFF_CONTINUITY_BANDS: ResearchScaleWaveSealHandoffContinuityBand[] = [
  76, 90, 99, 100,
];

function continuityScore(outlook: ResearchScaleWaveSealHandoffContinuityOutlook): number {
  return Math.round(Math.min(100, Math.max(0, outlook.sealHandoffContinuityScore ?? 0)));
}

function highestLoggedBand(
  log: ResearchScaleWaveSealHandoffContinuityBandEvent[],
  phase: ResearchScaleWaveSealHandoffContinuityBandEvent['phase']
): ResearchScaleWaveSealHandoffContinuityBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchScaleWaveSealHandoffContinuityBand;
}

export function emptySealHandoffContinuityBandLog(): ResearchScaleWaveSealHandoffContinuityBandEvent[] {
  return [];
}

export function appendSealHandoffContinuityBandEvents(
  previousLog: ResearchScaleWaveSealHandoffContinuityBandEvent[],
  previousSnapshot: ResearchScaleWaveSealHandoffContinuitySnapshot | null,
  outlook: ResearchScaleWaveSealHandoffContinuityOutlook,
  turn: number
): ResearchScaleWaveSealHandoffContinuityBandEvent[] {
  const score = continuityScore(outlook);
  const priorScore = previousSnapshot?.sealHandoffContinuityScore ?? 0;
  const appended: ResearchScaleWaveSealHandoffContinuityBandEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(highestLoggedBand(previousLog, 'escalation'), previousSnapshot?.peakBand ?? 0);
    for (const band of RESEARCH_SEAL_HANDOFF_CONTINUITY_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        sealHandoffContinuityScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakBand ??
      (highestLoggedBand(previousLog, 'escalation') ||
        RESEARCH_SEAL_HANDOFF_CONTINUITY_BANDS[RESEARCH_SEAL_HANDOFF_CONTINUITY_BANDS.length - 1]);
    for (const band of [...RESEARCH_SEAL_HANDOFF_CONTINUITY_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        sealHandoffContinuityScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_SEAL_HANDOFF_CONTINUITY_BAND_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_SEAL_HANDOFF_CONTINUITY_BAND_LOG_CAP);
}
