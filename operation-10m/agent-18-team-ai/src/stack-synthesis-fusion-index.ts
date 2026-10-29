export interface StackSynthesisFusionReport {
  fusionIndex: number;
  notes: string[];
}

/**
 * Convergence–pressure stack fusing with pressure–cascade fusion under composite health.
 */
export function computeStackSynthesisFusionIndex(
  convergencePressureStackIndex: number,
  pressureCascadeFusionIndex: number,
  coordinationCompositeScore: number,
): StackSynthesisFusionReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (convergencePressureStackIndex >= 44 && pressureCascadeFusionIndex >= 44) {
    notes.push('Pressure stack and cascade fusion both elevated');
  }
  if (weakComposite && convergencePressureStackIndex >= 46) {
    notes.push('Stack–synthesis fusion under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const fusionIndex = Math.round(
    Math.min(
      100,
      convergencePressureStackIndex * 0.37 +
        pressureCascadeFusionIndex * 0.37 +
        compositePenalty +
        (weakComposite && pressureCascadeFusionIndex >= 48 ? 14 : 0),
    ),
  );

  return { fusionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamStackSynthesisFusion(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
