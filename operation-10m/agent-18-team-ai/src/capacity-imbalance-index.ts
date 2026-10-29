export interface CapacityImbalanceReport {
  imbalanceIndex: number;
  notes: string[];
}

/**
 * Actor capacity skew: simultaneous overload and idle teammates.
 */
export function computeCapacityImbalanceIndex(
  balanceScore: number,
  overloadedActorIds: string[],
  idleActorIds: string[],
): CapacityImbalanceReport {
  const notes: string[] = [];
  const overloaded = overloadedActorIds.length;
  const idle = idleActorIds.length;
  if (overloaded > 0 && idle > 0) {
    notes.push(`Capacity skew: ${overloaded} overloaded, ${idle} idle`);
  } else if (overloaded >= 2) {
    notes.push(`${overloaded} actors overloaded without idle relief`);
  }

  const skewPairs = Math.min(overloaded, idle);
  const imbalanceIndex = Math.round(
    Math.min(
      100,
      Math.max(0, 100 - balanceScore) * 0.45 + skewPairs * 24 + overloaded * 8 + idle * 4,
    ),
  );

  return { imbalanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamCapacityImbalance(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
