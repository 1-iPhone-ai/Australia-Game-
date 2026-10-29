import type {
  ResearchExecutionBand,
  ResearchExecutionBandEvent,
  ResearchExecutionOutlook,
  ResearchExecutionSnapshot,
} from './types.ts';

export const RESEARCH_EXECUTION_BAND_LOG_CAP = 32;

export const RESEARCH_EXECUTION_BANDS: ResearchExecutionBand[] = [30, 45, 60, 75];

function executionScore(outlook: ResearchExecutionOutlook): number {
  return Math.round(Math.min(100, Math.max(0, outlook.nationalExecutionScore ?? 0)));
}

function highestLoggedBand(
  log: ResearchExecutionBandEvent[],
  phase: ResearchExecutionBandEvent['phase']
): ResearchExecutionBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchExecutionBand;
}

export function emptyResearchExecutionBandLog(): ResearchExecutionBandEvent[] {
  return [];
}

export function rebuildResearchExecutionBandLogFromSnapshot(
  snapshot: ResearchExecutionSnapshot | null,
  outlook: ResearchExecutionOutlook,
  turn: number
): ResearchExecutionBandEvent[] {
  if (!snapshot) return emptyResearchExecutionBandLog();
  return appendResearchExecutionBandEvents(emptyResearchExecutionBandLog(), snapshot, outlook, turn);
}

export function appendResearchExecutionBandEvents(
  previousLog: ResearchExecutionBandEvent[],
  previousSnapshot: ResearchExecutionSnapshot | null,
  outlook: ResearchExecutionOutlook,
  turn: number
): ResearchExecutionBandEvent[] {
  const score = executionScore(outlook);
  const priorScore = previousSnapshot?.nationalExecutionScore ?? 0;
  const appended: ResearchExecutionBandEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(highestLoggedBand(previousLog, 'escalation'), previousSnapshot?.peakBand ?? 0);
    for (const band of RESEARCH_EXECUTION_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        nationalExecutionScore: score,
        horizonTurns: outlook.horizonTurns,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakBand ??
      (highestLoggedBand(previousLog, 'escalation') ||
        RESEARCH_EXECUTION_BANDS[RESEARCH_EXECUTION_BANDS.length - 1]);
    for (const band of [...RESEARCH_EXECUTION_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        nationalExecutionScore: score,
        horizonTurns: outlook.horizonTurns,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_EXECUTION_BAND_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_EXECUTION_BAND_LOG_CAP);
}
