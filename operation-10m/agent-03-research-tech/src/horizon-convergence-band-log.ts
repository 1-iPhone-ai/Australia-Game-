import type {
  ResearchHorizonConvergenceBand,
  ResearchHorizonConvergenceBandEvent,
  ResearchHorizonConvergenceOutlook,
  ResearchHorizonConvergenceSnapshot,
} from './types.ts';

export const RESEARCH_HORIZON_CONVERGENCE_BAND_LOG_CAP = 32;

export const RESEARCH_HORIZON_CONVERGENCE_BANDS: ResearchHorizonConvergenceBand[] = [25, 40, 55, 70];

function convergenceScore(outlook: ResearchHorizonConvergenceOutlook): number {
  return Math.round(Math.min(100, Math.max(0, outlook.nationalConvergenceScore ?? 0)));
}

function highestLoggedBand(
  log: ResearchHorizonConvergenceBandEvent[],
  phase: ResearchHorizonConvergenceBandEvent['phase']
): ResearchHorizonConvergenceBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchHorizonConvergenceBand;
}

export function emptyHorizonConvergenceBandLog(): ResearchHorizonConvergenceBandEvent[] {
  return [];
}

export function rebuildHorizonConvergenceBandLogFromSnapshot(
  snapshot: ResearchHorizonConvergenceSnapshot | null,
  outlook: ResearchHorizonConvergenceOutlook,
  turn: number
): ResearchHorizonConvergenceBandEvent[] {
  if (!snapshot) return emptyHorizonConvergenceBandLog();
  return appendHorizonConvergenceBandEvents(emptyHorizonConvergenceBandLog(), snapshot, outlook, turn);
}

export function appendHorizonConvergenceBandEvents(
  previousLog: ResearchHorizonConvergenceBandEvent[],
  previousSnapshot: ResearchHorizonConvergenceSnapshot | null,
  outlook: ResearchHorizonConvergenceOutlook,
  turn: number
): ResearchHorizonConvergenceBandEvent[] {
  const score = convergenceScore(outlook);
  const priorScore = previousSnapshot?.nationalConvergenceScore ?? 0;
  const appended: ResearchHorizonConvergenceBandEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(highestLoggedBand(previousLog, 'escalation'), previousSnapshot?.peakBand ?? 0);
    for (const band of RESEARCH_HORIZON_CONVERGENCE_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        nationalConvergenceScore: score,
        horizonTurns: outlook.horizonTurns,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakBand ??
      (highestLoggedBand(previousLog, 'escalation') ||
        RESEARCH_HORIZON_CONVERGENCE_BANDS[RESEARCH_HORIZON_CONVERGENCE_BANDS.length - 1]);
    for (const band of [...RESEARCH_HORIZON_CONVERGENCE_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        nationalConvergenceScore: score,
        horizonTurns: outlook.horizonTurns,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_HORIZON_CONVERGENCE_BAND_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_HORIZON_CONVERGENCE_BAND_LOG_CAP);
}
