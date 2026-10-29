export interface SynthesisPressureResonanceReport {
  resonanceIndex: number;
  notes: string[];
}

/**
 * Resonance–cascade synthesis resonating with convergence–amplification pressure under audit load.
 */
export function computeSynthesisPressureResonanceIndex(
  resonanceCascadeSynthesisIndex: number,
  convergenceAmplificationPressureIndex: number,
  auditPressureIndex: number,
): SynthesisPressureResonanceReport {
  const notes: string[] = [];
  if (resonanceCascadeSynthesisIndex >= 44 && convergenceAmplificationPressureIndex >= 44) {
    notes.push('Cascade synthesis and amplification pressure both elevated');
  }
  if (auditPressureIndex >= 40 && resonanceCascadeSynthesisIndex >= 46) {
    notes.push('Audit pressure driving synthesis–pressure resonance');
  }

  const resonanceIndex = Math.round(
    Math.min(
      100,
      resonanceCascadeSynthesisIndex * 0.37 +
        convergenceAmplificationPressureIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (resonanceCascadeSynthesisIndex >= 48 && convergenceAmplificationPressureIndex >= 46 ? 14 : 0),
    ),
  );

  return { resonanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSynthesisPressureResonance(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
