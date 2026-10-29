export interface SynthesisCascadeStackReport {
  stackIndex: number;
  notes: string[];
}

/**
 * Pressure–synthesis cascade stacking with synthesis–resonance stack under audit load.
 */
export function computeSynthesisCascadeStackIndex(
  pressureSynthesisCascadeIndex: number,
  synthesisResonanceStackIndex: number,
  auditPressureIndex: number,
): SynthesisCascadeStackReport {
  const notes: string[] = [];
  if (pressureSynthesisCascadeIndex >= 44 && synthesisResonanceStackIndex >= 44) {
    notes.push('Synthesis cascade and resonance stack both elevated');
  }
  if (auditPressureIndex >= 40 && pressureSynthesisCascadeIndex >= 46) {
    notes.push('Audit pressure driving synthesis–cascade stack');
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      pressureSynthesisCascadeIndex * 0.37 +
        synthesisResonanceStackIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (pressureSynthesisCascadeIndex >= 48 && synthesisResonanceStackIndex >= 46 ? 15 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSynthesisCascadeStack(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
