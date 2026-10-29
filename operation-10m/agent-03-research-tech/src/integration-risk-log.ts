import type {
  ResearchIntegrationRiskBand,
  ResearchIntegrationRiskEvent,
  ResearchIntegrationRiskOutlook,
  ResearchIntegrationRiskSnapshot,
} from './types.ts';

export const RESEARCH_INTEGRATION_RISK_LOG_CAP = 32;

export const RESEARCH_INTEGRATION_RISK_BANDS: ResearchIntegrationRiskBand[] = [40, 60, 80];

export function emptyIntegrationRiskLog(): ResearchIntegrationRiskEvent[] {
  return [];
}

function highestLoggedBand(
  log: ResearchIntegrationRiskEvent[],
  phase: ResearchIntegrationRiskEvent['phase']
): ResearchIntegrationRiskBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchIntegrationRiskBand;
}

export function rebuildIntegrationRiskLogFromSnapshot(
  snapshot: ResearchIntegrationRiskSnapshot | null,
  outlook: ResearchIntegrationRiskOutlook,
  turn: number
): ResearchIntegrationRiskEvent[] {
  if (!snapshot) return emptyIntegrationRiskLog();
  return appendIntegrationRiskEvents(emptyIntegrationRiskLog(), snapshot, outlook, turn);
}

export function appendIntegrationRiskEvents(
  previousLog: ResearchIntegrationRiskEvent[],
  previousSnapshot: ResearchIntegrationRiskSnapshot | null,
  outlook: ResearchIntegrationRiskOutlook,
  turn: number
): ResearchIntegrationRiskEvent[] {
  const score = Math.round(Math.min(100, Math.max(0, outlook.nationalRiskScore)));
  const priorScore = previousSnapshot?.nationalRiskScore ?? 0;
  const appended: ResearchIntegrationRiskEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(highestLoggedBand(previousLog, 'escalation'), previousSnapshot?.peakRiskBand ?? 0);
    for (const band of RESEARCH_INTEGRATION_RISK_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        nationalRiskScore: score,
        criticalBranchCount: outlook.criticalBranchCount,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakRiskBand ??
      (highestLoggedBand(previousLog, 'escalation') || RESEARCH_INTEGRATION_RISK_BANDS[RESEARCH_INTEGRATION_RISK_BANDS.length - 1]);
    for (const band of [...RESEARCH_INTEGRATION_RISK_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        nationalRiskScore: score,
        criticalBranchCount: outlook.criticalBranchCount,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_INTEGRATION_RISK_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_INTEGRATION_RISK_LOG_CAP);
}
