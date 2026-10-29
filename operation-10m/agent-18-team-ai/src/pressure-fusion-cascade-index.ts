export interface PressureFusionCascadeReport {
  cascadeIndex: number;
  notes: string[];
}

/**
 * Synthesis–escalation pressure cascading through cascade–synthesis fusion.
 */
export function computePressureFusionCascadeIndex(
  synthesisEscalationPressureIndex: number,
  cascadeSynthesisFusionIndex: number,
  coordinationEscalationTier: number,
): PressureFusionCascadeReport {
  const notes: string[] = [];
  if (synthesisEscalationPressureIndex >= 44 && cascadeSynthesisFusionIndex >= 44) {
    notes.push('Escalation pressure and synthesis fusion both elevated');
  }
  if (coordinationEscalationTier >= 3 && synthesisEscalationPressureIndex >= 46) {
    notes.push('Pressure–fusion cascade at high escalation tier');
  }

  const cascadeIndex = Math.round(
    Math.min(
      100,
      synthesisEscalationPressureIndex * 0.38 +
        cascadeSynthesisFusionIndex * 0.36 +
        coordinationEscalationTier * 6 +
        (synthesisEscalationPressureIndex >= 48 && cascadeSynthesisFusionIndex >= 46 ? 15 : 0),
    ),
  );

  return { cascadeIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPressureFusionCascade(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
