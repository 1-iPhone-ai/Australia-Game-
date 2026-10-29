import type {
  ResearchScaleWavePostSealHandoffBand,
  ResearchScaleWavePostSealHandoffBandEvent,
  ResearchScaleWavePostSealHandoffOutlook,
  ResearchScaleWavePostSealHandoffSnapshot,
} from './types.ts';

export const RESEARCH_POST_SEAL_HANDOFF_BAND_LOG_CAP = 32;

export const RESEARCH_POST_SEAL_HANDOFF_BANDS: ResearchScaleWavePostSealHandoffBand[] = [68, 82, 96, 100];

function handoffScore(outlook: ResearchScaleWavePostSealHandoffOutlook): number {
  return Math.round(Math.min(100, Math.max(0, outlook.postSealHandoffScore ?? 0)));
}

function highestLoggedBand(
  log: ResearchScaleWavePostSealHandoffBandEvent[],
  phase: ResearchScaleWavePostSealHandoffBandEvent['phase']
): ResearchScaleWavePostSealHandoffBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchScaleWavePostSealHandoffBand;
}

export function emptyPostSealHandoffBandLog(): ResearchScaleWavePostSealHandoffBandEvent[] {
  return [];
}

export function appendPostSealHandoffBandEvents(
  previousLog: ResearchScaleWavePostSealHandoffBandEvent[],
  previousSnapshot: ResearchScaleWavePostSealHandoffSnapshot | null,
  outlook: ResearchScaleWavePostSealHandoffOutlook,
  turn: number
): ResearchScaleWavePostSealHandoffBandEvent[] {
  const score = handoffScore(outlook);
  const priorScore = previousSnapshot?.postSealHandoffScore ?? 0;
  const appended: ResearchScaleWavePostSealHandoffBandEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(highestLoggedBand(previousLog, 'escalation'), previousSnapshot?.peakBand ?? 0);
    for (const band of RESEARCH_POST_SEAL_HANDOFF_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        postSealHandoffScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakBand ??
      (highestLoggedBand(previousLog, 'escalation') ||
        RESEARCH_POST_SEAL_HANDOFF_BANDS[RESEARCH_POST_SEAL_HANDOFF_BANDS.length - 1]);
    for (const band of [...RESEARCH_POST_SEAL_HANDOFF_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        postSealHandoffScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_POST_SEAL_HANDOFF_BAND_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_POST_SEAL_HANDOFF_BAND_LOG_CAP);
}
