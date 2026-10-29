import type {
  ResearchCommercializationMilestone,
  ResearchCommercializationMilestoneEvent,
  ResearchCommercializationReport,
  ResearchCommercializationSnapshot,
} from './types.ts';

export const RESEARCH_COMMERCIALIZATION_MILESTONE_LOG_CAP = 32;

export const RESEARCH_COMMERCIALIZATION_MILESTONES: ResearchCommercializationMilestone[] = [30, 50, 70, 90];

export function emptyCommercializationMilestoneLog(): ResearchCommercializationMilestoneEvent[] {
  return [];
}

function highestLoggedMilestone(
  log: ResearchCommercializationMilestoneEvent[],
  phase: ResearchCommercializationMilestoneEvent['phase']
): ResearchCommercializationMilestone {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.milestone > best) best = ev.milestone;
  }
  return best as ResearchCommercializationMilestone;
}

export function rebuildCommercializationMilestoneLogFromSnapshot(
  snapshot: ResearchCommercializationSnapshot | null,
  report: ResearchCommercializationReport,
  turn: number
): ResearchCommercializationMilestoneEvent[] {
  if (!snapshot) return emptyCommercializationMilestoneLog();
  return appendCommercializationMilestoneEvents(emptyCommercializationMilestoneLog(), snapshot, report, turn);
}

export function appendCommercializationMilestoneEvents(
  previousLog: ResearchCommercializationMilestoneEvent[],
  previousSnapshot: ResearchCommercializationSnapshot | null,
  report: ResearchCommercializationReport,
  turn: number
): ResearchCommercializationMilestoneEvent[] {
  const score = Math.round(Math.min(100, Math.max(0, report.nationalExportScore)));
  const priorScore = previousSnapshot?.nationalExportScore ?? 0;
  const highPriorityCount = report.hints.filter(h => h.exportPriority === 'high').length;
  const appended: ResearchCommercializationMilestoneEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(
      highestLoggedMilestone(previousLog, 'escalation'),
      previousSnapshot?.peakMilestone ?? 0
    );
    for (const milestone of RESEARCH_COMMERCIALIZATION_MILESTONES) {
      if (milestone <= floor) continue;
      if (score < milestone) break;
      appended.push({
        seq: nextSeq++,
        turn,
        milestone,
        nationalExportScore: score,
        highPriorityBranchCount: highPriorityCount,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakMilestone ??
      (highestLoggedMilestone(previousLog, 'escalation') ||
        RESEARCH_COMMERCIALIZATION_MILESTONES[RESEARCH_COMMERCIALIZATION_MILESTONES.length - 1]);
    for (const milestone of [...RESEARCH_COMMERCIALIZATION_MILESTONES].reverse()) {
      if (milestone > ceiling) continue;
      if (score > milestone) break;
      if (priorScore < milestone) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        milestone,
        nationalExportScore: score,
        highPriorityBranchCount: highPriorityCount,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_COMMERCIALIZATION_MILESTONE_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_COMMERCIALIZATION_MILESTONE_LOG_CAP);
}
