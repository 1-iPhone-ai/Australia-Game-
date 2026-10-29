export interface SaturationDeadlockCouplingReport {
  couplingIndex: number;
  notes: string[];
}

/**
 * Coordination saturation amplified when workstream deadlock pressure is elevated.
 */
export function computeSaturationDeadlockCouplingIndex(
  coordinationSaturationIndex: number,
  workstreamDeadlockPressureIndex: number,
  deadlockCount: number,
): SaturationDeadlockCouplingReport {
  const notes: string[] = [];
  if (coordinationSaturationIndex >= 40 && workstreamDeadlockPressureIndex >= 35) {
    notes.push('Coordination saturation and deadlock pressure both elevated');
  }
  if (deadlockCount > 0 && coordinationSaturationIndex >= 50) {
    notes.push(`${deadlockCount} deadlock(s) under saturated coordination load`);
  }

  const couplingIndex = Math.round(
    Math.min(
      100,
      coordinationSaturationIndex * 0.32 +
        workstreamDeadlockPressureIndex * 0.38 +
        deadlockCount * 14 +
        (coordinationSaturationIndex >= 45 && workstreamDeadlockPressureIndex >= 40 ? 16 : 0),
    ),
  );

  return { couplingIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSaturationDeadlockCoupling(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
