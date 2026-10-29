export interface FusionStackPressureReport {
  pressureIndex: number;
  notes: string[];
}

/**
 * Resonance–fusion stack pressuring fusion–cascade pressure under escalation.
 */
export function computeFusionStackPressureIndex(
  resonanceFusionStackIndex: number,
  fusionCascadePressureIndex: number,
  coordinationEscalationTier: number,
): FusionStackPressureReport {
  const notes: string[] = [];
  if (resonanceFusionStackIndex >= 44 && fusionCascadePressureIndex >= 44) {
    notes.push('Fusion stack and cascade pressure both elevated');
  }
  if (coordinationEscalationTier >= 2 && resonanceFusionStackIndex >= 46) {
    notes.push('Fusion–stack pressure under active escalation');
  }

  const pressureIndex = Math.round(
    Math.min(
      100,
      resonanceFusionStackIndex * 0.38 +
        fusionCascadePressureIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (resonanceFusionStackIndex >= 48 && fusionCascadePressureIndex >= 46 ? 14 : 0),
    ),
  );

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionStackPressure(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
