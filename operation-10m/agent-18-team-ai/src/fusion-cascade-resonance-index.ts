export interface FusionCascadeResonanceReport {
  resonanceIndex: number;
  notes: string[];
}

/**
 * Pressure–cascade fusion resonating with cascade–synthesis resonance under escalation.
 */
export function computeFusionCascadeResonanceIndex(
  pressureCascadeFusionIndex: number,
  cascadeSynthesisResonanceIndex: number,
  coordinationEscalationTier: number,
): FusionCascadeResonanceReport {
  const notes: string[] = [];
  if (pressureCascadeFusionIndex >= 44 && cascadeSynthesisResonanceIndex >= 44) {
    notes.push('Cascade fusion and synthesis resonance both elevated');
  }
  if (coordinationEscalationTier >= 2 && pressureCascadeFusionIndex >= 46) {
    notes.push('Fusion–cascade resonance under active escalation');
  }

  const resonanceIndex = Math.round(
    Math.min(
      100,
      pressureCascadeFusionIndex * 0.38 +
        cascadeSynthesisResonanceIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (pressureCascadeFusionIndex >= 48 && cascadeSynthesisResonanceIndex >= 46 ? 14 : 0),
    ),
  );

  return { resonanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionCascadeResonance(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
