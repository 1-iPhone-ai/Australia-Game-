export interface CouplingStackCascadeReport {
  cascadeIndex: number;
  notes: string[];
}

/**
 * Fusion–resonance coupling cascading into convergence–fusion stack pressure.
 */
export function computeCouplingStackCascadeIndex(
  fusionResonanceCouplingIndex: number,
  convergenceFusionStackIndex: number,
  coordinationEscalationTier: number,
): CouplingStackCascadeReport {
  const notes: string[] = [];
  if (fusionResonanceCouplingIndex >= 44 && convergenceFusionStackIndex >= 44) {
    notes.push('Fusion coupling and convergence stack both elevated');
  }
  if (coordinationEscalationTier >= 2 && fusionResonanceCouplingIndex >= 46) {
    notes.push('Coupling–stack cascade under active escalation');
  }

  const cascadeIndex = Math.round(
    Math.min(
      100,
      fusionResonanceCouplingIndex * 0.38 +
        convergenceFusionStackIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (fusionResonanceCouplingIndex >= 48 && convergenceFusionStackIndex >= 46 ? 14 : 0),
    ),
  );

  return { cascadeIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamCouplingStackCascade(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
