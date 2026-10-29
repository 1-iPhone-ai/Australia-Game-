import type {
  ResearchTrancheDryRunHandoffBand,
  ResearchTrancheDryRunHandoffBandEvent,
  ResearchTrancheDryRunHandoffOutlook,
  ResearchTrancheDryRunHandoffSnapshot,
} from './types.ts';

export const RESEARCH_DRY_RUN_HANDOFF_BAND_LOG_CAP = 32;

export const RESEARCH_DRY_RUN_HANDOFF_BANDS: ResearchTrancheDryRunHandoffBand[] = [60, 74, 88, 97];

function handoffScore(outlook: ResearchTrancheDryRunHandoffOutlook): number {
  return Math.round(Math.min(100, Math.max(0, outlook.handoffReadinessScore ?? 0)));
}

function highestLoggedBand(
  log: ResearchTrancheDryRunHandoffBandEvent[],
  phase: ResearchTrancheDryRunHandoffBandEvent['phase']
): ResearchTrancheDryRunHandoffBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchTrancheDryRunHandoffBand;
}

export function emptyDryRunHandoffBandLog(): ResearchTrancheDryRunHandoffBandEvent[] {
  return [];
}

export function appendDryRunHandoffBandEvents(
  previousLog: ResearchTrancheDryRunHandoffBandEvent[],
  previousSnapshot: ResearchTrancheDryRunHandoffSnapshot | null,
  outlook: ResearchTrancheDryRunHandoffOutlook,
  turn: number
): ResearchTrancheDryRunHandoffBandEvent[] {
  const score = handoffScore(outlook);
  const priorScore = previousSnapshot?.handoffReadinessScore ?? 0;
  const appended: ResearchTrancheDryRunHandoffBandEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(highestLoggedBand(previousLog, 'escalation'), previousSnapshot?.peakBand ?? 0);
    for (const band of RESEARCH_DRY_RUN_HANDOFF_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        handoffReadinessScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakBand ??
      (highestLoggedBand(previousLog, 'escalation') ||
        RESEARCH_DRY_RUN_HANDOFF_BANDS[RESEARCH_DRY_RUN_HANDOFF_BANDS.length - 1]);
    for (const band of [...RESEARCH_DRY_RUN_HANDOFF_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        handoffReadinessScore: score,
        horizonTurns: outlook.horizonTurns,
        waveOrdinal: outlook.waveOrdinal,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_DRY_RUN_HANDOFF_BAND_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_DRY_RUN_HANDOFF_BAND_LOG_CAP);
}
