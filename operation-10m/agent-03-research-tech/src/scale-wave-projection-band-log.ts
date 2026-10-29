import type {
  ResearchScaleWaveProjectionBand,
  ResearchScaleWaveProjectionBandEvent,
  ResearchScaleWaveProjectionOutlook,
  ResearchScaleWaveProjectionSnapshot,
} from './types.ts';

export const RESEARCH_SCALE_WAVE_PROJECTION_BAND_LOG_CAP = 32;

export const RESEARCH_SCALE_WAVE_PROJECTION_BANDS: ResearchScaleWaveProjectionBand[] = [50, 65, 80, 92];

function projectionScore(outlook: ResearchScaleWaveProjectionOutlook): number {
  return Math.round(Math.min(100, Math.max(0, outlook.projectionReadinessScore ?? 0)));
}

function highestLoggedBand(
  log: ResearchScaleWaveProjectionBandEvent[],
  phase: ResearchScaleWaveProjectionBandEvent['phase']
): ResearchScaleWaveProjectionBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchScaleWaveProjectionBand;
}

export function emptyScaleWaveProjectionBandLog(): ResearchScaleWaveProjectionBandEvent[] {
  return [];
}

export function rebuildScaleWaveProjectionBandLogFromSnapshot(
  snapshot: ResearchScaleWaveProjectionSnapshot | null,
  outlook: ResearchScaleWaveProjectionOutlook,
  turn: number
): ResearchScaleWaveProjectionBandEvent[] {
  if (!snapshot) return emptyScaleWaveProjectionBandLog();
  return appendScaleWaveProjectionBandEvents(emptyScaleWaveProjectionBandLog(), snapshot, outlook, turn);
}

export function appendScaleWaveProjectionBandEvents(
  previousLog: ResearchScaleWaveProjectionBandEvent[],
  previousSnapshot: ResearchScaleWaveProjectionSnapshot | null,
  outlook: ResearchScaleWaveProjectionOutlook,
  turn: number
): ResearchScaleWaveProjectionBandEvent[] {
  const score = projectionScore(outlook);
  const priorScore = previousSnapshot?.projectionReadinessScore ?? 0;
  const appended: ResearchScaleWaveProjectionBandEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(highestLoggedBand(previousLog, 'escalation'), previousSnapshot?.peakBand ?? 0);
    for (const band of RESEARCH_SCALE_WAVE_PROJECTION_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        projectionReadinessScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakBand ??
      (highestLoggedBand(previousLog, 'escalation') ||
        RESEARCH_SCALE_WAVE_PROJECTION_BANDS[RESEARCH_SCALE_WAVE_PROJECTION_BANDS.length - 1]);
    for (const band of [...RESEARCH_SCALE_WAVE_PROJECTION_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        projectionReadinessScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_SCALE_WAVE_PROJECTION_BAND_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_SCALE_WAVE_PROJECTION_BAND_LOG_CAP);
}
