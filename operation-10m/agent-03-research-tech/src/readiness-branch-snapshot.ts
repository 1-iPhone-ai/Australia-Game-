import { RESEARCH_BRANCHES } from './branches.ts';
import type { ResearchBranchId, ResearchReadinessBranchSnapshot } from './types.ts';

/** Compact persisted digest of branch readiness for replay / merge guards (round 7). */
export function computeReadinessBranchSnapshot(
  readinessByBranch: Record<ResearchBranchId, number>,
  turn: number
): ResearchReadinessBranchSnapshot {
  const readiness: ResearchReadinessBranchSnapshot['readinessByBranch'] = {} as ResearchReadinessBranchSnapshot['readinessByBranch'];
  for (const b of RESEARCH_BRANCHES) {
    readiness[b.id] = Math.round(Math.min(100, Math.max(0, readinessByBranch[b.id] ?? 0)));
  }
  const payload = RESEARCH_BRANCHES.map(b => `${b.id}:${readiness[b.id]}`).join('|');
  let h = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  const values = RESEARCH_BRANCHES.map(b => readiness[b.id]);
  const branchAbove75Count = values.filter(v => v >= 75).length;
  const nationalMeanReadiness =
    values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
  return {
    capturedAtTurn: turn,
    readinessByBranch: readiness,
    digest: h.toString(36),
    branchAbove75Count,
    nationalMeanReadiness,
  };
}

export function mergeReadinessBranchSnapshots(
  local: ResearchReadinessBranchSnapshot | undefined,
  remote: ResearchReadinessBranchSnapshot | undefined
): ResearchReadinessBranchSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
