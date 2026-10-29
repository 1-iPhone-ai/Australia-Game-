export interface PressureCascadeFusionReport {
  fusionIndex: number;
  notes: string[];
}

/**
 * Fusion–stack pressure fusing with pressure–resonance cascade under escalation.
 */
export function computePressureCascadeFusionIndex(
  fusionStackPressureIndex: number,
  pressureResonanceCascadeIndex: number,
  coordinationEscalationTier: number,
): PressureCascadeFusionReport {
  const notes: string[] = [];
  if (fusionStackPressureIndex >= 44 && pressureResonanceCascadeIndex >= 44) {
    notes.push('Stack pressure and resonance cascade both elevated');
  }
  if (coordinationEscalationTier >= 2 && fusionStackPressureIndex >= 46) {
    notes.push('Pressure–cascade fusion under active escalation');
  }

  const fusionIndex = Math.round(
    Math.min(
      100,
      fusionStackPressureIndex * 0.38 +
        pressureResonanceCascadeIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (fusionStackPressureIndex >= 48 && pressureResonanceCascadeIndex >= 46 ? 14 : 0),
    ),
  );

  return { fusionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPressureCascadeFusion(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
