export interface ConvergenceFusionPressureReport {
  pressureIndex: number;
  notes: string[];
}

/**
 * Resonance–convergence fusion pressuring pressure–synthesis cascade under escalation.
 */
export function computeConvergenceFusionPressureIndex(
  resonanceConvergenceFusionIndex: number,
  pressureSynthesisCascadeIndex: number,
  coordinationEscalationTier: number,
): ConvergenceFusionPressureReport {
  const notes: string[] = [];
  if (resonanceConvergenceFusionIndex >= 44 && pressureSynthesisCascadeIndex >= 44) {
    notes.push('Convergence fusion and synthesis cascade both elevated');
  }
  if (coordinationEscalationTier >= 2 && resonanceConvergenceFusionIndex >= 46) {
    notes.push('Convergence–fusion pressure under active escalation');
  }

  const pressureIndex = Math.round(
    Math.min(
      100,
      resonanceConvergenceFusionIndex * 0.38 +
        pressureSynthesisCascadeIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (resonanceConvergenceFusionIndex >= 48 && pressureSynthesisCascadeIndex >= 46 ? 14 : 0),
    ),
  );

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamConvergenceFusionPressure(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
