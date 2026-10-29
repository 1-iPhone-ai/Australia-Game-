export interface WorkstreamDeadlockPressureReport {
  pressureIndex: number;
  notes: string[];
}

/**
 * Deadlock pressure amplified by in-flight workstream parallelism load.
 */
export function computeWorkstreamDeadlockPressureIndex(
  deadlockCount: number,
  deadlockedWorkstreamIds: string[],
  parallelismIndex: number,
): WorkstreamDeadlockPressureReport {
  const notes: string[] = [];
  const deadlocked = deadlockedWorkstreamIds.length;
  if (deadlockCount > 0) {
    notes.push(`${deadlockCount} workstream deadlock(s) detected`);
  }
  if (deadlockCount > 0 && parallelismIndex >= 55) {
    notes.push(`Deadlocks under high parallelism load (${parallelismIndex})`);
  }

  const pressureIndex = Math.round(
    Math.min(
      100,
      deadlockCount * 28 +
        deadlocked * 12 +
        (deadlockCount > 0 && parallelismIndex >= 50
          ? Math.floor(parallelismIndex * 0.25)
          : 0) +
        (deadlockCount >= 2 ? 15 : 0),
    ),
  );

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamWorkstreamDeadlockPressure(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
