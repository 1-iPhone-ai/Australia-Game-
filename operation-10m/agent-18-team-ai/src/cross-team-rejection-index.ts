export interface CrossTeamRejectionReport {
  rejectionIndex: number;
  notes: string[];
}

/**
 * Score pressure from cross-team directive rejections at the team boundary.
 */
export function computeCrossTeamRejectionIndex(
  rejectedCount: number,
  totalProposals: number,
): CrossTeamRejectionReport {
  const notes: string[] = [];
  if (rejectedCount > 0) {
    notes.push(`${rejectedCount} cross-team directive(s) rejected of ${totalProposals} proposals`);
  }

  const ratio = totalProposals === 0 ? 0 : rejectedCount / totalProposals;
  const rejectionIndex = Math.round(Math.min(100, ratio * 90 + rejectedCount * 15));

  return { rejectionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamCrossTeamRejection(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
