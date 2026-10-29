export interface CascadeConvergenceResonanceReport {
  resonanceIndex: number;
  notes: string[];
}

/**
 * Amplification–convergence cascade converging with stack–synthesis resonance under audit load.
 */
export function computeCascadeConvergenceResonanceIndex(
  amplificationConvergenceCascadeIndex: number,
  stackSynthesisResonanceIndex: number,
  auditPressureIndex: number,
): CascadeConvergenceResonanceReport {
  const notes: string[] = [];
  if (amplificationConvergenceCascadeIndex >= 44 && stackSynthesisResonanceIndex >= 44) {
    notes.push('Convergence cascade and synthesis resonance both elevated');
  }
  if (auditPressureIndex >= 40 && amplificationConvergenceCascadeIndex >= 46) {
    notes.push('Audit pressure driving cascade–convergence resonance');
  }

  const resonanceIndex = Math.round(
    Math.min(
      100,
      amplificationConvergenceCascadeIndex * 0.36 +
        stackSynthesisResonanceIndex * 0.38 +
        auditPressureIndex * 0.2 +
        (amplificationConvergenceCascadeIndex >= 48 && stackSynthesisResonanceIndex >= 46 ? 14 : 0),
    ),
  );

  return { resonanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamCascadeConvergenceResonance(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
