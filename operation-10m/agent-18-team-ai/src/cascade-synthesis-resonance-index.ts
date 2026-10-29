export interface CascadeSynthesisResonanceReport {
  resonanceIndex: number;
  notes: string[];
}

/**
 * Pressure–resonance cascade resonating with stack–synthesis convergence under audit load.
 */
export function computeCascadeSynthesisResonanceIndex(
  pressureResonanceCascadeIndex: number,
  stackSynthesisConvergenceIndex: number,
  auditPressureIndex: number,
): CascadeSynthesisResonanceReport {
  const notes: string[] = [];
  if (pressureResonanceCascadeIndex >= 44 && stackSynthesisConvergenceIndex >= 44) {
    notes.push('Resonance cascade and synthesis convergence both elevated');
  }
  if (auditPressureIndex >= 40 && pressureResonanceCascadeIndex >= 46) {
    notes.push('Audit pressure driving cascade–synthesis resonance');
  }

  const resonanceIndex = Math.round(
    Math.min(
      100,
      pressureResonanceCascadeIndex * 0.37 +
        stackSynthesisConvergenceIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (pressureResonanceCascadeIndex >= 48 && stackSynthesisConvergenceIndex >= 46 ? 15 : 0),
    ),
  );

  return { resonanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamCascadeSynthesisResonance(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
