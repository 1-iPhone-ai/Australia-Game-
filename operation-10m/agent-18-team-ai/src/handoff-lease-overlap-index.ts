export interface HandoffLeaseOverlapReport {
  overlapIndex: number;
  notes: string[];
}

/**
 * Pending handoffs targeting regions with expiring or expired leases.
 */
export function computeHandoffLeaseOverlapIndex(
  overlappingPendingHandoffCount: number,
  pendingHandoffCount: number,
  expiringLeaseCount: number,
  expiredLeaseCount: number,
): HandoffLeaseOverlapReport {
  const notes: string[] = [];
  if (overlappingPendingHandoffCount > 0) {
    notes.push(
      `${overlappingPendingHandoffCount} pending handoff(s) overlap lease-at-risk regions`,
    );
  } else if (pendingHandoffCount > 0 && (expiringLeaseCount > 0 || expiredLeaseCount > 0)) {
    notes.push('Lease risk present but no region overlap with pending handoffs');
  }

  const leaseRisk = expiringLeaseCount + expiredLeaseCount * 2;
  const overlapIndex = Math.round(
    Math.min(
      100,
      overlappingPendingHandoffCount * 26 +
        leaseRisk * 8 +
        (pendingHandoffCount > 0
          ? Math.floor((overlappingPendingHandoffCount / pendingHandoffCount) * 40)
          : 0),
    ),
  );

  return { overlapIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamHandoffLeaseOverlap(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
