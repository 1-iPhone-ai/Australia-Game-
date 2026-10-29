export interface PressureResonanceConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/** Pressure–resonance synthesis converging with convergence–synthesis pressure under escalation. */
export function computePressureResonanceConvergenceIndex(
  pressureSynthesisConvergenceIndex: number,
  convergenceSynthesisPressureIndex: number,
  coordinationEscalationTier: number,
): PressureResonanceConvergenceReport {
  const notes: string[] = [];
  if (pressureSynthesisConvergenceIndex >= 44 && convergenceSynthesisPressureIndex >= 44) {
    notes.push('Resonance convergence and synthesis pressure both elevated');
  }
  if (coordinationEscalationTier >= 2 && convergenceSynthesisPressureIndex >= 46) {
    notes.push('Pressure–resonance convergence under active escalation');
  }

  const convergenceIndex = Math.round(
    Math.min(
      100,
      pressureSynthesisConvergenceIndex * 0.38 +
        convergenceSynthesisPressureIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (pressureSynthesisConvergenceIndex >= 48 && convergenceSynthesisPressureIndex >= 46 ? 14 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPressureResonanceConvergence(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
