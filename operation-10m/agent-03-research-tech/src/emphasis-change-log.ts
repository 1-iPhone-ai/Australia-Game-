import type {
  ResearchBranchEmphasisState,
  ResearchBranchId,
  ResearchEmphasisChangeEvent,
  ResearchProgramEmphasis,
} from './types.ts';

export const RESEARCH_EMPHASIS_CHANGE_LOG_CAP = 32;

export function emptyEmphasisChangeLog(): ResearchEmphasisChangeEvent[] {
  return [];
}

/** Rebuild bounded log from emphasis revision history (migration / repair). */
export function rebuildEmphasisChangeLogFromBranchEmphasis(
  branchEmphasis: ResearchBranchEmphasisState[],
  emphasisRevision: number,
  turn: number
): ResearchEmphasisChangeEvent[] {
  if (emphasisRevision <= 0) return emptyEmphasisChangeLog();
  const events: ResearchEmphasisChangeEvent[] = [];
  let seq = 1;
  for (const e of branchEmphasis) {
    if (e.setTurn <= 0) continue;
    events.push({
      seq: seq++,
      turn: e.setTurn,
      branchId: e.branchId,
      fromEmphasis: 'fundamental',
      toEmphasis: e.emphasis,
      emphasisRevision: Math.min(emphasisRevision, seq),
    });
  }
  return events.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_EMPHASIS_CHANGE_LOG_CAP);
}

export function appendEmphasisChangeEvent(
  previousLog: ResearchEmphasisChangeEvent[],
  branchId: ResearchBranchId,
  fromEmphasis: ResearchProgramEmphasis,
  toEmphasis: ResearchProgramEmphasis,
  turn: number,
  emphasisRevision: number
): ResearchEmphasisChangeEvent[] {
  if (fromEmphasis === toEmphasis) return previousLog.slice(-RESEARCH_EMPHASIS_CHANGE_LOG_CAP);
  const nextSeq =
    previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq), emphasisRevision - 1) + 1 : emphasisRevision;
  const ev: ResearchEmphasisChangeEvent = {
    seq: nextSeq,
    turn,
    branchId,
    fromEmphasis,
    toEmphasis,
    emphasisRevision,
  };
  return [...previousLog, ev].slice(-RESEARCH_EMPHASIS_CHANGE_LOG_CAP);
}
