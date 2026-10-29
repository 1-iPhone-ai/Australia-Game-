export interface PressureResonanceSynthesisReport {
  synthesisIndex: number;
  notes: string[];
}

/**
 * Pressure–fusion stack synthesizing with resonance–synthesis fusion under audit load.
 */
export function computePressureResonanceSynthesisIndex(
  pressureFusionStackIndex: number,
  resonanceSynthesisFusionIndex: number,
  auditPressureIndex: number,
): PressureResonanceSynthesisReport {
  const notes: string[] = [];
  if (pressureFusionStackIndex >= 44 && resonanceSynthesisFusionIndex >= 44) {
    notes.push('Fusion stack and synthesis fusion both elevated');
  }
  if (auditPressureIndex >= 40 && pressureFusionStackIndex >= 46) {
    notes.push('Audit pressure driving pressure–resonance synthesis');
  }

  const synthesisIndex = Math.round(
    Math.min(
      100,
      pressureFusionStackIndex * 0.37 +
        resonanceSynthesisFusionIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (pressureFusionStackIndex >= 48 && resonanceSynthesisFusionIndex >= 46 ? 15 : 0),
    ),
  );

  return { synthesisIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPressureResonanceSynthesis(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
