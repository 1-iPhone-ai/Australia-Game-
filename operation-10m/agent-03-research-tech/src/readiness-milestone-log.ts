import { RESEARCH_BRANCHES } from './branches.ts';
import type {
  ResearchBranchId,
  ResearchReadinessBranchSnapshot,
  ResearchReadinessMilestone,
  ResearchReadinessMilestoneEvent,
} from './types.ts';

export const RESEARCH_READINESS_MILESTONE_LOG_CAP = 48;

export const RESEARCH_READINESS_MILESTONES: ResearchReadinessMilestone[] = [25, 50, 75, 90];

export function emptyReadinessMilestoneLog(): ResearchReadinessMilestoneEvent[] {
  return [];
}

function highestLoggedMilestone(
  log: ResearchReadinessMilestoneEvent[],
  branchId: ResearchBranchId
): ResearchReadinessMilestone {
  let best = 0;
  for (const ev of log) {
    if (ev.branchId !== branchId) continue;
    if (ev.milestone > best) best = ev.milestone;
  }
  return best as ResearchReadinessMilestone;
}

/** Rebuild bounded log from a captured readiness snapshot (migration / repair). */
export function rebuildReadinessMilestoneLogFromSnapshot(
  snapshot: ResearchReadinessBranchSnapshot | null,
  turn: number
): ResearchReadinessMilestoneEvent[] {
  if (!snapshot) return emptyReadinessMilestoneLog();
  return appendReadinessMilestoneEvents(
    emptyReadinessMilestoneLog(),
    null,
    snapshot.readinessByBranch,
    turn
  );
}

export function appendReadinessMilestoneEvents(
  previousLog: ResearchReadinessMilestoneEvent[],
  previousSnapshot: ResearchReadinessBranchSnapshot | null,
  readinessByBranch: Record<ResearchBranchId, number>,
  turn: number
): ResearchReadinessMilestoneEvent[] {
  const priorFloor: Partial<Record<ResearchBranchId, number>> = {};
  if (previousSnapshot) {
    for (const b of RESEARCH_BRANCHES) {
      priorFloor[b.id] = previousSnapshot.readinessByBranch[b.id] ?? 0;
    }
  }

  const appended: ResearchReadinessMilestoneEvent[] = [];
  let nextSeq =
    previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  for (const branch of RESEARCH_BRANCHES) {
    const readiness = Math.round(Math.min(100, Math.max(0, readinessByBranch[branch.id] ?? 0)));
    const floor = Math.max(highestLoggedMilestone(previousLog, branch.id), priorFloor[branch.id] ?? 0);
    for (const milestone of RESEARCH_READINESS_MILESTONES) {
      if (milestone <= floor) continue;
      if (readiness < milestone) break;
      appended.push({
        seq: nextSeq++,
        turn,
        branchId: branch.id,
        milestone,
        readiness,
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_READINESS_MILESTONE_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_READINESS_MILESTONE_LOG_CAP);
}
