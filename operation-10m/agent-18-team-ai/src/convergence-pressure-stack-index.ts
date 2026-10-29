export interface ConvergencePressureStackReport {
  stackIndex: number;
  notes: string[];
}

/**
 * Stack–synthesis convergence stacking with fusion–stack pressure under composite health.
 */
export function computeConvergencePressureStackIndex(
  stackSynthesisConvergenceIndex: number,
  fusionStackPressureIndex: number,
  coordinationCompositeScore: number,
): ConvergencePressureStackReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (stackSynthesisConvergenceIndex >= 44 && fusionStackPressureIndex >= 44) {
    notes.push('Synthesis convergence and stack pressure both elevated');
  }
  if (weakComposite && stackSynthesisConvergenceIndex >= 46) {
    notes.push('Convergence–pressure stack under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const stackIndex = Math.round(
    Math.min(
      100,
      stackSynthesisConvergenceIndex * 0.37 +
        fusionStackPressureIndex * 0.37 +
        compositePenalty +
        (weakComposite && fusionStackPressureIndex >= 48 ? 14 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamConvergencePressureStack(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
