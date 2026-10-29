export interface ResonanceAmplificationStackReport {
  stackIndex: number;
  notes: string[];
}

/**
 * Stack–synthesis resonance stacked on synthesis–stack amplification pressure.
 */
export function computeResonanceAmplificationStackIndex(
  stackSynthesisResonanceIndex: number,
  synthesisStackAmplificationIndex: number,
  convergenceCascadeSynthesisIndex: number,
): ResonanceAmplificationStackReport {
  const notes: string[] = [];
  if (stackSynthesisResonanceIndex >= 44 && synthesisStackAmplificationIndex >= 44) {
    notes.push('Synthesis resonance and stack amplification both elevated');
  }
  if (convergenceCascadeSynthesisIndex >= 46 && stackSynthesisResonanceIndex >= 46) {
    notes.push('Cascade synthesis reinforcing resonance–amplification stack');
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      stackSynthesisResonanceIndex * 0.37 +
        synthesisStackAmplificationIndex * 0.37 +
        convergenceCascadeSynthesisIndex * 0.18 +
        (stackSynthesisResonanceIndex >= 48 && synthesisStackAmplificationIndex >= 46 ? 15 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamResonanceAmplificationStack(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
