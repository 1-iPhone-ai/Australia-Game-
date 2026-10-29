export interface SynthesisPressureConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/**
 * Convergence–stack synthesis converging with stack–synthesis pressure under escalation.
 */
export function computeSynthesisPressureConvergenceIndex(
  convergenceStackSynthesisIndex: number,
  stackSynthesisPressureIndex: number,
  coordinationEscalationTier: number,
): SynthesisPressureConvergenceReport {
  const notes: string[] = [];
  if (convergenceStackSynthesisIndex >= 44 && stackSynthesisPressureIndex >= 44) {
    notes.push('Stack synthesis and synthesis pressure both elevated');
  }
  if (coordinationEscalationTier >= 2 && convergenceStackSynthesisIndex >= 46) {
    notes.push('Synthesis–pressure convergence under active escalation');
  }

  const convergenceIndex = Math.round(
    Math.min(
      100,
      convergenceStackSynthesisIndex * 0.38 +
        stackSynthesisPressureIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (convergenceStackSynthesisIndex >= 48 && stackSynthesisPressureIndex >= 46 ? 14 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSynthesisPressureConvergence(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
