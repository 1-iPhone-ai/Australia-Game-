export interface CascadeCouplingSynthesisReport {
  synthesisIndex: number;
  notes: string[];
}

/**
 * Resonance–audit cascade synthesized with fusion–resonance coupling under composite health.
 */
export function computeCascadeCouplingSynthesisIndex(
  resonanceAuditCascadeIndex: number,
  fusionResonanceCouplingIndex: number,
  coordinationCompositeScore: number,
): CascadeCouplingSynthesisReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (resonanceAuditCascadeIndex >= 44 && fusionResonanceCouplingIndex >= 44) {
    notes.push('Audit cascade and fusion coupling both elevated');
  }
  if (weakComposite && resonanceAuditCascadeIndex >= 46) {
    notes.push('Cascade–coupling synthesis under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.35 : 0;
  const synthesisIndex = Math.round(
    Math.min(
      100,
      resonanceAuditCascadeIndex * 0.37 +
        fusionResonanceCouplingIndex * 0.35 +
        compositePenalty +
        (weakComposite && fusionResonanceCouplingIndex >= 48 ? 14 : 0),
    ),
  );

  return { synthesisIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamCascadeCouplingSynthesis(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
