export interface GapChurnResonanceReport {
  resonanceIndex: number;
  notes: string[];
}

/**
 * Friction–alignment gap resonating with persistence churn spikes.
 */
export function computeGapChurnResonanceIndex(
  frictionAlignmentGapIndex: number,
  persistenceChurnIndex: number,
  persistenceGradientFrictionIndex: number,
): GapChurnResonanceReport {
  const notes: string[] = [];
  if (frictionAlignmentGapIndex >= 42 && persistenceChurnIndex >= 38) {
    notes.push('Alignment gap and persistence churn both elevated');
  }
  if (persistenceGradientFrictionIndex >= 44 && frictionAlignmentGapIndex >= 44) {
    notes.push('Gradient friction reinforcing gap–churn resonance');
  }

  const resonanceIndex = Math.round(
    Math.min(
      100,
      frictionAlignmentGapIndex * 0.37 +
        persistenceChurnIndex * 0.35 +
        persistenceGradientFrictionIndex * 0.2 +
        (frictionAlignmentGapIndex >= 46 && persistenceChurnIndex >= 40 ? 15 : 0),
    ),
  );

  return { resonanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamGapChurnResonance(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
