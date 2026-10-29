export interface ConvergenceStackSynthesisReport {
  synthesisIndex: number;
  notes: string[];
}

/**
 * Resonance–convergence stack synthesizing with pressure–stack synthesis under escalation.
 */
export function computeConvergenceStackSynthesisIndex(
  resonanceConvergenceStackIndex: number,
  pressureStackSynthesisIndex: number,
  coordinationEscalationTier: number,
): ConvergenceStackSynthesisReport {
  const notes: string[] = [];
  if (resonanceConvergenceStackIndex >= 44 && pressureStackSynthesisIndex >= 44) {
    notes.push('Convergence stack and stack synthesis both elevated');
  }
  if (coordinationEscalationTier >= 2 && resonanceConvergenceStackIndex >= 46) {
    notes.push('Convergence–stack synthesis under active escalation');
  }

  const synthesisIndex = Math.round(
    Math.min(
      100,
      resonanceConvergenceStackIndex * 0.38 +
        pressureStackSynthesisIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (resonanceConvergenceStackIndex >= 48 && pressureStackSynthesisIndex >= 46 ? 14 : 0),
    ),
  );

  return { synthesisIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamConvergenceStackSynthesis(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
