export interface StackCascadeResonanceReport {
  resonanceIndex: number;
  notes: string[];
}

/**
 * Fusion–cascade stack resonating with resonance–pressure cascade under escalation.
 */
export function computeStackCascadeResonanceIndex(
  fusionCascadeStackIndex: number,
  resonancePressureCascadeIndex: number,
  coordinationEscalationTier: number,
): StackCascadeResonanceReport {
  const notes: string[] = [];
  if (fusionCascadeStackIndex >= 44 && resonancePressureCascadeIndex >= 44) {
    notes.push('Cascade stack and pressure cascade both elevated');
  }
  if (coordinationEscalationTier >= 2 && fusionCascadeStackIndex >= 46) {
    notes.push('Stack–cascade resonance under active escalation');
  }

  const resonanceIndex = Math.round(
    Math.min(
      100,
      fusionCascadeStackIndex * 0.38 +
        resonancePressureCascadeIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (fusionCascadeStackIndex >= 48 && resonancePressureCascadeIndex >= 46 ? 14 : 0),
    ),
  );

  return { resonanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamStackCascadeResonance(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
