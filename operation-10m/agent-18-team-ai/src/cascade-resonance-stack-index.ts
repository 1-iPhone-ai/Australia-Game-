export interface CascadeResonanceStackReport {
  stackIndex: number;
  notes: string[];
}

/**
 * Fusion–cascade resonance stacking with resonance–pressure stack under escalation.
 */
export function computeCascadeResonanceStackIndex(
  fusionCascadeResonanceIndex: number,
  resonancePressureStackIndex: number,
  coordinationEscalationTier: number,
): CascadeResonanceStackReport {
  const notes: string[] = [];
  if (fusionCascadeResonanceIndex >= 44 && resonancePressureStackIndex >= 44) {
    notes.push('Cascade resonance and pressure stack both elevated');
  }
  if (coordinationEscalationTier >= 2 && fusionCascadeResonanceIndex >= 46) {
    notes.push('Cascade–resonance stack under active escalation');
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      fusionCascadeResonanceIndex * 0.38 +
        resonancePressureStackIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (fusionCascadeResonanceIndex >= 48 && resonancePressureStackIndex >= 46 ? 14 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamCascadeResonanceStack(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
