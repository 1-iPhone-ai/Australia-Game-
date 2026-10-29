export interface FusionSynthesisResonanceReport {
  resonanceIndex: number;
  notes: string[];
}

/**
 * Convergence–pressure fusion resonating with pressure–resonance synthesis under escalation.
 */
export function computeFusionSynthesisResonanceIndex(
  convergencePressureFusionIndex: number,
  pressureResonanceSynthesisIndex: number,
  coordinationEscalationTier: number,
): FusionSynthesisResonanceReport {
  const notes: string[] = [];
  if (convergencePressureFusionIndex >= 44 && pressureResonanceSynthesisIndex >= 44) {
    notes.push('Pressure fusion and resonance synthesis both elevated');
  }
  if (coordinationEscalationTier >= 2 && convergencePressureFusionIndex >= 46) {
    notes.push('Fusion–synthesis resonance under active escalation');
  }

  const resonanceIndex = Math.round(
    Math.min(
      100,
      convergencePressureFusionIndex * 0.38 +
        pressureResonanceSynthesisIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (convergencePressureFusionIndex >= 48 && pressureResonanceSynthesisIndex >= 46 ? 14 : 0),
    ),
  );

  return { resonanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionSynthesisResonance(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
