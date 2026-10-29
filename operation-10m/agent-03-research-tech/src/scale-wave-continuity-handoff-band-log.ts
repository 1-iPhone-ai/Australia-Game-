import type {
  ResearchScaleWaveContinuityHandoffBand,
  ResearchScaleWaveContinuityHandoffBandEvent,
  ResearchScaleWaveContinuityHandoffOutlook,
  ResearchScaleWaveContinuityHandoffSnapshot,
} from './types.ts';

export const RESEARCH_CONTINUITY_HANDOFF_BAND_LOG_CAP = 32;

export const RESEARCH_CONTINUITY_HANDOFF_BANDS: ResearchScaleWaveContinuityHandoffBand[] = [
  71, 85, 99, 100,
];

function handoffScore(outlook: ResearchScaleWaveContinuityHandoffOutlook): number {
  return Math.round(Math.min(100, Math.max(0, outlook.continuityHandoffScore ?? 0)));
}

function highestLoggedBand(
  log: ResearchScaleWaveContinuityHandoffBandEvent[],
  phase: ResearchScaleWaveContinuityHandoffBandEvent['phase']
): ResearchScaleWaveContinuityHandoffBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchScaleWaveContinuityHandoffBand;
}

export function emptyContinuityHandoffBandLog(): ResearchScaleWaveContinuityHandoffBandEvent[] {
  return [];
}

export function appendContinuityHandoffBandEvents(
  previousLog: ResearchScaleWaveContinuityHandoffBandEvent[],
  previousSnapshot: ResearchScaleWaveContinuityHandoffSnapshot | null,
  outlook: ResearchScaleWaveContinuityHandoffOutlook,
  turn: number
): ResearchScaleWaveContinuityHandoffBandEvent[] {
  const score = handoffScore(outlook);
  const priorScore = previousSnapshot?.continuityHandoffScore ?? 0;
  const appended: ResearchScaleWaveContinuityHandoffBandEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(highestLoggedBand(previousLog, 'escalation'), previousSnapshot?.peakBand ?? 0);
    for (const band of RESEARCH_CONTINUITY_HANDOFF_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        continuityHandoffScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakBand ??
      (highestLoggedBand(previousLog, 'escalation') ||
        RESEARCH_CONTINUITY_HANDOFF_BANDS[RESEARCH_CONTINUITY_HANDOFF_BANDS.length - 1]);
    for (const band of [...RESEARCH_CONTINUITY_HANDOFF_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        continuityHandoffScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_CONTINUITY_HANDOFF_BAND_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_CONTINUITY_HANDOFF_BAND_LOG_CAP);
}
