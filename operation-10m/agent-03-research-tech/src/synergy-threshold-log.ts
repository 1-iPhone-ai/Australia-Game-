import type {
  ResearchSynergyOutlook,
  ResearchSynergySnapshot,
  ResearchSynergyThreshold,
  ResearchSynergyThresholdEvent,
} from './types.ts';

export const RESEARCH_SYNERGY_THRESHOLD_LOG_CAP = 32;

export const RESEARCH_SYNERGY_THRESHOLDS: ResearchSynergyThreshold[] = [25, 50, 75, 90];

export function emptySynergyThresholdLog(): ResearchSynergyThresholdEvent[] {
  return [];
}

function highestLoggedThreshold(
  log: ResearchSynergyThresholdEvent[],
  phase: ResearchSynergyThresholdEvent['phase']
): ResearchSynergyThreshold {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.threshold > best) best = ev.threshold;
  }
  return best as ResearchSynergyThreshold;
}

export function rebuildSynergyThresholdLogFromSnapshot(
  snapshot: ResearchSynergySnapshot | null,
  outlook: ResearchSynergyOutlook,
  turn: number
): ResearchSynergyThresholdEvent[] {
  if (!snapshot) return emptySynergyThresholdLog();
  return appendSynergyThresholdEvents(emptySynergyThresholdLog(), snapshot, outlook, turn);
}

export function appendSynergyThresholdEvents(
  previousLog: ResearchSynergyThresholdEvent[],
  previousSnapshot: ResearchSynergySnapshot | null,
  outlook: ResearchSynergyOutlook,
  turn: number
): ResearchSynergyThresholdEvent[] {
  const score = Math.round(Math.min(100, Math.max(0, outlook.currentSynergyScore)));
  const priorScore = previousSnapshot?.currentSynergyScore ?? 0;
  const appended: ResearchSynergyThresholdEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(
      highestLoggedThreshold(previousLog, 'escalation'),
      previousSnapshot?.peakThreshold ?? 0
    );
    for (const threshold of RESEARCH_SYNERGY_THRESHOLDS) {
      if (threshold <= floor) continue;
      if (score < threshold) break;
      appended.push({
        seq: nextSeq++,
        turn,
        threshold,
        synergyScore: score,
        activeMultiBranchCount: outlook.activeMultiBranchCount,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakThreshold ??
      (highestLoggedThreshold(previousLog, 'escalation') ||
        RESEARCH_SYNERGY_THRESHOLDS[RESEARCH_SYNERGY_THRESHOLDS.length - 1]);
    for (const threshold of [...RESEARCH_SYNERGY_THRESHOLDS].reverse()) {
      if (threshold > ceiling) continue;
      if (score > threshold) break;
      if (priorScore < threshold) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        threshold,
        synergyScore: score,
        activeMultiBranchCount: outlook.activeMultiBranchCount,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_SYNERGY_THRESHOLD_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_SYNERGY_THRESHOLD_LOG_CAP);
}
