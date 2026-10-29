export interface HandoffSlaVelocityReport {
  velocityIndex: number;
  notes: string[];
}

/**
 * Pending handoff SLA stress: overdue share of pending handoffs.
 */
export function computeHandoffSlaVelocityIndex(
  pendingCount: number,
  overdueHandoffIds: string[],
): HandoffSlaVelocityReport {
  const notes: string[] = [];
  const overdue = overdueHandoffIds.length;
  if (pendingCount === 0) {
    return { velocityIndex: 0, notes: ['No pending handoffs'] };
  }

  const ratio = overdue / pendingCount;
  if (ratio >= 0.5) {
    notes.push(`Handoff SLA stress: ${overdue}/${pendingCount} overdue`);
  }

  const velocityIndex = Math.round(Math.min(100, ratio * 100 + overdue * 8));

  return { velocityIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamHandoffSlaVelocity(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
