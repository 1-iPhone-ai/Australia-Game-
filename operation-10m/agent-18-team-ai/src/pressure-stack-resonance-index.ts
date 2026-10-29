export interface PressureStackResonanceReport {
  resonanceIndex: number;
  notes: string[];
}

/**
 * Convergence–fusion pressure resonating with synthesis–cascade stack under escalation.
 */
export function computePressureStackResonanceIndex(
  convergenceFusionPressureIndex: number,
  synthesisCascadeStackIndex: number,
  coordinationEscalationTier: number,
): PressureStackResonanceReport {
  const notes: string[] = [];
  if (convergenceFusionPressureIndex >= 44 && synthesisCascadeStackIndex >= 44) {
    notes.push('Fusion pressure and cascade stack both elevated');
  }
  if (coordinationEscalationTier >= 2 && convergenceFusionPressureIndex >= 46) {
    notes.push('Pressure–stack resonance under active escalation');
  }

  const resonanceIndex = Math.round(
    Math.min(
      100,
      convergenceFusionPressureIndex * 0.38 +
        synthesisCascadeStackIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (convergenceFusionPressureIndex >= 48 && synthesisCascadeStackIndex >= 46 ? 14 : 0),
    ),
  );

  return { resonanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPressureStackResonance(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
