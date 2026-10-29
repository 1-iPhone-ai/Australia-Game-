export interface FusionResonanceSynthesisReport {
  synthesisIndex: number;
  notes: string[];
}

/**
 * Stack–fusion resonance synthesizing with fusion–synthesis pressure under escalation.
 */
export function computeFusionResonanceSynthesisIndex(
  stackFusionResonanceIndex: number,
  fusionSynthesisPressureIndex: number,
  coordinationEscalationTier: number,
): FusionResonanceSynthesisReport {
  const notes: string[] = [];
  if (stackFusionResonanceIndex >= 44 && fusionSynthesisPressureIndex >= 44) {
    notes.push('Fusion resonance and synthesis pressure both elevated');
  }
  if (coordinationEscalationTier >= 2 && stackFusionResonanceIndex >= 46) {
    notes.push('Fusion–resonance synthesis under active escalation');
  }

  const synthesisIndex = Math.round(
    Math.min(
      100,
      stackFusionResonanceIndex * 0.38 +
        fusionSynthesisPressureIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (stackFusionResonanceIndex >= 48 && fusionSynthesisPressureIndex >= 46 ? 14 : 0),
    ),
  );

  return { synthesisIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionResonanceSynthesis(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
