import type {
  ResearchScaleWaveMaturityBand,
  ResearchScaleWaveMaturityBandEvent,
  ResearchScaleWaveMaturityOutlook,
  ResearchScaleWaveMaturitySnapshot,
} from './types.ts';

export const RESEARCH_SCALE_WAVE_MATURITY_BAND_LOG_CAP = 32;

export const RESEARCH_SCALE_WAVE_MATURITY_BANDS: ResearchScaleWaveMaturityBand[] = [40, 55, 70, 85];

function maturityScore(outlook: ResearchScaleWaveMaturityOutlook): number {
  return Math.round(Math.min(100, Math.max(0, outlook.nationalMaturityScore ?? 0)));
}

function highestLoggedBand(
  log: ResearchScaleWaveMaturityBandEvent[],
  phase: ResearchScaleWaveMaturityBandEvent['phase']
): ResearchScaleWaveMaturityBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchScaleWaveMaturityBand;
}

export function emptyScaleWaveMaturityBandLog(): ResearchScaleWaveMaturityBandEvent[] {
  return [];
}

export function rebuildScaleWaveMaturityBandLogFromSnapshot(
  snapshot: ResearchScaleWaveMaturitySnapshot | null,
  outlook: ResearchScaleWaveMaturityOutlook,
  turn: number
): ResearchScaleWaveMaturityBandEvent[] {
  if (!snapshot) return emptyScaleWaveMaturityBandLog();
  return appendScaleWaveMaturityBandEvents(emptyScaleWaveMaturityBandLog(), snapshot, outlook, turn);
}

export function appendScaleWaveMaturityBandEvents(
  previousLog: ResearchScaleWaveMaturityBandEvent[],
  previousSnapshot: ResearchScaleWaveMaturitySnapshot | null,
  outlook: ResearchScaleWaveMaturityOutlook,
  turn: number
): ResearchScaleWaveMaturityBandEvent[] {
  const score = maturityScore(outlook);
  const priorScore = previousSnapshot?.nationalMaturityScore ?? 0;
  const appended: ResearchScaleWaveMaturityBandEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(highestLoggedBand(previousLog, 'escalation'), previousSnapshot?.peakBand ?? 0);
    for (const band of RESEARCH_SCALE_WAVE_MATURITY_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        nationalMaturityScore: score,
        horizonTurns: outlook.horizonTurns,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakBand ??
      (highestLoggedBand(previousLog, 'escalation') ||
        RESEARCH_SCALE_WAVE_MATURITY_BANDS[RESEARCH_SCALE_WAVE_MATURITY_BANDS.length - 1]);
    for (const band of [...RESEARCH_SCALE_WAVE_MATURITY_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        nationalMaturityScore: score,
        horizonTurns: outlook.horizonTurns,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_SCALE_WAVE_MATURITY_BAND_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_SCALE_WAVE_MATURITY_BAND_LOG_CAP);
}
