export interface StackResonancePressureReport {
  pressureIndex: number;
  notes: string[];
}

/**
 * Cascade–resonance stack pressuring resonance–fusion pressure under escalation.
 */
export function computeStackResonancePressureIndex(
  cascadeResonanceStackIndex: number,
  resonanceFusionPressureIndex: number,
  coordinationEscalationTier: number,
): StackResonancePressureReport {
  const notes: string[] = [];
  if (cascadeResonanceStackIndex >= 44 && resonanceFusionPressureIndex >= 44) {
    notes.push('Resonance stack and fusion pressure both elevated');
  }
  if (coordinationEscalationTier >= 2 && cascadeResonanceStackIndex >= 46) {
    notes.push('Stack–resonance pressure under active escalation');
  }

  const pressureIndex = Math.round(
    Math.min(
      100,
      cascadeResonanceStackIndex * 0.38 +
        resonanceFusionPressureIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (cascadeResonanceStackIndex >= 48 && resonanceFusionPressureIndex >= 46 ? 14 : 0),
    ),
  );

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamStackResonancePressure(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
