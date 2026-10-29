import type {
  ResearchNationalIntegrationBand,
  ResearchNationalIntegrationBandEvent,
  ResearchNationalIntegrationOutlook,
  ResearchNationalIntegrationSnapshot,
} from './types.ts';

export const RESEARCH_NATIONAL_INTEGRATION_BAND_LOG_CAP = 32;

export const RESEARCH_NATIONAL_INTEGRATION_BANDS: ResearchNationalIntegrationBand[] = [45, 60, 75, 90];

function integrationScore(outlook: ResearchNationalIntegrationOutlook): number {
  return Math.round(Math.min(100, Math.max(0, outlook.nationalIntegrationScore ?? 0)));
}

function highestLoggedBand(
  log: ResearchNationalIntegrationBandEvent[],
  phase: ResearchNationalIntegrationBandEvent['phase']
): ResearchNationalIntegrationBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchNationalIntegrationBand;
}

export function emptyNationalIntegrationBandLog(): ResearchNationalIntegrationBandEvent[] {
  return [];
}

export function rebuildNationalIntegrationBandLogFromSnapshot(
  snapshot: ResearchNationalIntegrationSnapshot | null,
  outlook: ResearchNationalIntegrationOutlook,
  turn: number
): ResearchNationalIntegrationBandEvent[] {
  if (!snapshot) return emptyNationalIntegrationBandLog();
  return appendNationalIntegrationBandEvents(emptyNationalIntegrationBandLog(), snapshot, outlook, turn);
}

export function appendNationalIntegrationBandEvents(
  previousLog: ResearchNationalIntegrationBandEvent[],
  previousSnapshot: ResearchNationalIntegrationSnapshot | null,
  outlook: ResearchNationalIntegrationOutlook,
  turn: number
): ResearchNationalIntegrationBandEvent[] {
  const score = integrationScore(outlook);
  const priorScore = previousSnapshot?.nationalIntegrationScore ?? 0;
  const appended: ResearchNationalIntegrationBandEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(highestLoggedBand(previousLog, 'escalation'), previousSnapshot?.peakBand ?? 0);
    for (const band of RESEARCH_NATIONAL_INTEGRATION_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        nationalIntegrationScore: score,
        horizonTurns: outlook.horizonTurns,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakBand ??
      (highestLoggedBand(previousLog, 'escalation') ||
        RESEARCH_NATIONAL_INTEGRATION_BANDS[RESEARCH_NATIONAL_INTEGRATION_BANDS.length - 1]);
    for (const band of [...RESEARCH_NATIONAL_INTEGRATION_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        nationalIntegrationScore: score,
        horizonTurns: outlook.horizonTurns,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_NATIONAL_INTEGRATION_BAND_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_NATIONAL_INTEGRATION_BAND_LOG_CAP);
}
