export interface StackFusionResonanceReport {
  resonanceIndex: number;
  notes: string[];
}

/**
 * Stack–resonance pressure resonating with pressure–fusion synthesis under escalation.
 */
export function computeStackFusionResonanceIndex(
  stackResonancePressureIndex: number,
  pressureFusionSynthesisIndex: number,
  coordinationEscalationTier: number,
): StackFusionResonanceReport {
  const notes: string[] = [];
  if (stackResonancePressureIndex >= 44 && pressureFusionSynthesisIndex >= 44) {
    notes.push('Resonance pressure and fusion synthesis both elevated');
  }
  if (coordinationEscalationTier >= 2 && stackResonancePressureIndex >= 46) {
    notes.push('Stack–fusion resonance under active escalation');
  }

  const resonanceIndex = Math.round(
    Math.min(
      100,
      stackResonancePressureIndex * 0.38 +
        pressureFusionSynthesisIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (stackResonancePressureIndex >= 48 && pressureFusionSynthesisIndex >= 46 ? 14 : 0),
    ),
  );

  return { resonanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamStackFusionResonance(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
