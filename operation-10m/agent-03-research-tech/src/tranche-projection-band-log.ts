import type {
  ResearchTrancheProjectionBand,
  ResearchTrancheProjectionBandEvent,
  ResearchTrancheProjectionReadinessOutlook,
  ResearchTrancheProjectionSnapshot,
} from './types.ts';

export const RESEARCH_TRANCHE_PROJECTION_BAND_LOG_CAP = 32;

export const RESEARCH_TRANCHE_PROJECTION_BANDS: ResearchTrancheProjectionBand[] = [55, 70, 85, 95];

function trancheScore(outlook: ResearchTrancheProjectionReadinessOutlook): number {
  return Math.round(Math.min(100, Math.max(0, outlook.trancheReadinessScore ?? 0)));
}

function highestLoggedBand(
  log: ResearchTrancheProjectionBandEvent[],
  phase: ResearchTrancheProjectionBandEvent['phase']
): ResearchTrancheProjectionBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchTrancheProjectionBand;
}

export function emptyTrancheProjectionBandLog(): ResearchTrancheProjectionBandEvent[] {
  return [];
}

export function rebuildTrancheProjectionBandLogFromSnapshot(
  snapshot: ResearchTrancheProjectionSnapshot | null,
  outlook: ResearchTrancheProjectionReadinessOutlook,
  turn: number
): ResearchTrancheProjectionBandEvent[] {
  if (!snapshot) return emptyTrancheProjectionBandLog();
  return appendTrancheProjectionBandEvents(emptyTrancheProjectionBandLog(), snapshot, outlook, turn);
}

export function appendTrancheProjectionBandEvents(
  previousLog: ResearchTrancheProjectionBandEvent[],
  previousSnapshot: ResearchTrancheProjectionSnapshot | null,
  outlook: ResearchTrancheProjectionReadinessOutlook,
  turn: number
): ResearchTrancheProjectionBandEvent[] {
  const score = trancheScore(outlook);
  const priorScore = previousSnapshot?.trancheReadinessScore ?? 0;
  const appended: ResearchTrancheProjectionBandEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(highestLoggedBand(previousLog, 'escalation'), previousSnapshot?.peakBand ?? 0);
    for (const band of RESEARCH_TRANCHE_PROJECTION_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        trancheReadinessScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakBand ??
      (highestLoggedBand(previousLog, 'escalation') ||
        RESEARCH_TRANCHE_PROJECTION_BANDS[RESEARCH_TRANCHE_PROJECTION_BANDS.length - 1]);
    for (const band of [...RESEARCH_TRANCHE_PROJECTION_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        trancheReadinessScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_TRANCHE_PROJECTION_BAND_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_TRANCHE_PROJECTION_BAND_LOG_CAP);
}
