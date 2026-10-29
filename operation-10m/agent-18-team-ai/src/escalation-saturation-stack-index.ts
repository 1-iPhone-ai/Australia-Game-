export interface EscalationSaturationStackReport {
  stackIndex: number;
  notes: string[];
}

/**
 * Coordination escalation tier stacked on saturation–deadlock coupling stress.
 */
export function computeEscalationSaturationStackIndex(
  coordinationEscalationTier: number,
  saturationDeadlockCouplingIndex: number,
  coordinationSaturationIndex: number,
): EscalationSaturationStackReport {
  const notes: string[] = [];
  if (coordinationEscalationTier >= 2 && saturationDeadlockCouplingIndex >= 40) {
    notes.push('Escalation tier elevated atop saturation–deadlock coupling');
  }
  if (coordinationEscalationTier >= 3 && coordinationSaturationIndex >= 50) {
    notes.push(`Tier ${coordinationEscalationTier} escalation under saturated coordination`);
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      coordinationEscalationTier * 18 +
        saturationDeadlockCouplingIndex * 0.36 +
        coordinationSaturationIndex * 0.22 +
        (coordinationEscalationTier >= 2 && saturationDeadlockCouplingIndex >= 44 ? 14 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamEscalationSaturationStack(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
