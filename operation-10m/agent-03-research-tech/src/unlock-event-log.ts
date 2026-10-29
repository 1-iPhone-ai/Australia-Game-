import { RESEARCH_NODE_BY_ID } from './branches.ts';
import type { ResearchBranchId, ResearchUnlockEvent, UnlockedResearchNode } from './types.ts';

export const RESEARCH_UNLOCK_EVENT_LOG_CAP = 64;

export function emptyUnlockEventLog(): ResearchUnlockEvent[] {
  return [];
}

/** Rebuild bounded log from unlock list (migration / repair). */
export function rebuildUnlockEventLogFromNodes(
  nodes: UnlockedResearchNode[],
  startSeq = 1
): ResearchUnlockEvent[] {
  const sorted = [...nodes].sort(
    (a, b) => a.unlockedTurn - b.unlockedTurn || a.nodeId.localeCompare(b.nodeId)
  );
  return sorted.slice(-RESEARCH_UNLOCK_EVENT_LOG_CAP).map((u, i) => ({
    seq: startSeq + i,
    turn: u.unlockedTurn,
    nodeId: u.nodeId,
    branchId: u.branchId,
    hookIds: RESEARCH_NODE_BY_ID[u.nodeId]?.hookIds ?? [],
  }));
}

export function appendUnlockEvents(
  previousLog: ResearchUnlockEvent[],
  previousNodes: UnlockedResearchNode[],
  currentNodes: UnlockedResearchNode[],
  turn: number,
  unlockSeq: number
): ResearchUnlockEvent[] {
  const prevIds = new Set(previousNodes.map(n => n.nodeId));
  const fresh = currentNodes.filter(n => !prevIds.has(n.nodeId));
  if (fresh.length === 0) return previousLog.slice(-RESEARCH_UNLOCK_EVENT_LOG_CAP);

  let nextSeq =
    previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq), unlockSeq - fresh.length) + 1 : unlockSeq;

  const appended: ResearchUnlockEvent[] = fresh
    .sort((a, b) => a.unlockedTurn - b.unlockedTurn || a.nodeId.localeCompare(b.nodeId))
    .map(u => {
      const ev: ResearchUnlockEvent = {
        seq: nextSeq++,
        turn: u.unlockedTurn || turn,
        nodeId: u.nodeId,
        branchId: u.branchId as ResearchBranchId,
        hookIds: RESEARCH_NODE_BY_ID[u.nodeId]?.hookIds ?? [],
      };
      return ev;
    });

  return [...previousLog, ...appended].slice(-RESEARCH_UNLOCK_EVENT_LOG_CAP);
}
