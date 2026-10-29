export interface ResonanceFusionStackReport {
  stackIndex: number;
  notes: string[];
}

/**
 * Pressure–stack resonance stacking with stack–fusion cascade under escalation.
 */
export function computeResonanceFusionStackIndex(
  pressureStackResonanceIndex: number,
  stackFusionCascadeIndex: number,
  coordinationEscalationTier: number,
): ResonanceFusionStackReport {
  const notes: string[] = [];
  if (pressureStackResonanceIndex >= 44 && stackFusionCascadeIndex >= 44) {
    notes.push('Stack resonance and fusion cascade both elevated');
  }
  if (coordinationEscalationTier >= 2 && pressureStackResonanceIndex >= 46) {
    notes.push('Resonance–fusion stack under active escalation');
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      pressureStackResonanceIndex * 0.38 +
        stackFusionCascadeIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (pressureStackResonanceIndex >= 48 && stackFusionCascadeIndex >= 46 ? 14 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamResonanceFusionStack(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
