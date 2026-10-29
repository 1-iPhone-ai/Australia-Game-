export interface CascadeSynthesisFusionReport {
  fusionIndex: number;
  notes: string[];
}

/**
 * Coupling–stack cascade fused with cascade–coupling synthesis stress.
 */
export function computeCascadeSynthesisFusionIndex(
  couplingStackCascadeIndex: number,
  cascadeCouplingSynthesisIndex: number,
  coordinationCompositeScore: number,
): CascadeSynthesisFusionReport {
  const notes: string[] = [];
  if (couplingStackCascadeIndex >= 44 && cascadeCouplingSynthesisIndex >= 44) {
    notes.push('Stack cascade and coupling synthesis both elevated');
  }
  if (coordinationCompositeScore < 55 && cascadeCouplingSynthesisIndex >= 46) {
    notes.push('Synthesis fusion under depressed coordination composite');
  }

  const compositePenalty =
    coordinationCompositeScore < 55 ? Math.max(0, 60 - coordinationCompositeScore) * 0.3 : 0;
  const fusionIndex = Math.round(
    Math.min(
      100,
      couplingStackCascadeIndex * 0.37 +
        cascadeCouplingSynthesisIndex * 0.38 +
        compositePenalty +
        (couplingStackCascadeIndex >= 48 && cascadeCouplingSynthesisIndex >= 46 ? 14 : 0),
    ),
  );

  return { fusionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamCascadeSynthesisFusion(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
