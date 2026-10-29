export interface CascadeResonanceAmplificationReport {
  amplificationIndex: number;
  notes: string[];
}

/**
 * Pressure–fusion cascade amplified by resonance–pressure synthesis and audit load.
 */
export function computeCascadeResonanceAmplificationIndex(
  pressureFusionCascadeIndex: number,
  resonancePressureSynthesisIndex: number,
  auditPressureIndex: number,
): CascadeResonanceAmplificationReport {
  const notes: string[] = [];
  if (pressureFusionCascadeIndex >= 44 && resonancePressureSynthesisIndex >= 44) {
    notes.push('Fusion cascade and resonance synthesis both elevated');
  }
  if (auditPressureIndex >= 40 && pressureFusionCascadeIndex >= 46) {
    notes.push('Audit pressure amplifying cascade–resonance load');
  }

  const amplificationIndex = Math.round(
    Math.min(
      100,
      pressureFusionCascadeIndex * 0.36 +
        resonancePressureSynthesisIndex * 0.36 +
        auditPressureIndex * 0.2 +
        (pressureFusionCascadeIndex >= 48 && resonancePressureSynthesisIndex >= 46 ? 14 : 0),
    ),
  );

  return { amplificationIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamCascadeResonanceAmplification(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
