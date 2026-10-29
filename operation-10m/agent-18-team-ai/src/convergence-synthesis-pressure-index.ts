export interface ConvergenceSynthesisPressureReport {
  pressureIndex: number;
  notes: string[];
}

/** Convergence–synthesis pressure pressuring with synthesis–convergence resonance under escalation. */
export function computeConvergenceSynthesisPressureIndex(
  convergencePressureSynthesisIndex: number,
  synthesisConvergencePressureIndex: number,
  coordinationEscalationTier: number,
): ConvergenceSynthesisPressureReport {
  const notes: string[] = [];
  if (convergencePressureSynthesisIndex >= 44 && synthesisConvergencePressureIndex >= 44) {
    notes.push('Synthesis pressure and convergence synthesis both elevated');
  }
  if (coordinationEscalationTier >= 2 && synthesisConvergencePressureIndex >= 46) {
    notes.push('Convergence–synthesis pressure under active escalation');
  }

  const pressureIndex = Math.round(
    Math.min(
      100,
      convergencePressureSynthesisIndex * 0.38 +
        synthesisConvergencePressureIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (convergencePressureSynthesisIndex >= 48 && synthesisConvergencePressureIndex >= 46 ? 14 : 0),
    ),
  );

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamConvergenceSynthesisPressure(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
