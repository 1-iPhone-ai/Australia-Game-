export interface AmplificationStackResonanceReport {
  resonanceIndex: number;
  notes: string[];
}

/**
 * Stack–cascade amplification resonating with convergence–fusion stack load.
 */
export function computeAmplificationStackResonanceIndex(
  stackCascadeAmplificationIndex: number,
  convergenceFusionStackIndex: number,
  gapChurnResonanceIndex: number,
): AmplificationStackResonanceReport {
  const notes: string[] = [];
  if (stackCascadeAmplificationIndex >= 44 && convergenceFusionStackIndex >= 44) {
    notes.push('Cascade amplification and convergence stack both elevated');
  }
  if (gapChurnResonanceIndex >= 42 && stackCascadeAmplificationIndex >= 46) {
    notes.push('Gap–churn resonance reinforcing amplification stack');
  }

  const resonanceIndex = Math.round(
    Math.min(
      100,
      stackCascadeAmplificationIndex * 0.36 +
        convergenceFusionStackIndex * 0.34 +
        gapChurnResonanceIndex * 0.22 +
        (stackCascadeAmplificationIndex >= 48 && convergenceFusionStackIndex >= 46 ? 15 : 0),
    ),
  );

  return { resonanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamAmplificationStackResonance(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
