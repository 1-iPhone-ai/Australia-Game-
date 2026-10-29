export type CompositeHealthTrend = 'improving' | 'declining' | 'flat';

export interface CompositeHealthGradientReport {
  gradientIndex: number;
  trend: CompositeHealthTrend;
  delta: number;
  notes: string[];
}

/**
 * Turn-over-turn composite score delta; declining health yields higher gradient index.
 */
export function computeCompositeHealthGradient(
  previousScore: number | undefined,
  currentScore: number,
): CompositeHealthGradientReport {
  const notes: string[] = [];
  if (previousScore === undefined) {
    return {
      gradientIndex: 0,
      trend: 'flat',
      delta: 0,
      notes: ['No prior composite score — gradient baseline'],
    };
  }

  const delta = currentScore - previousScore;
  let trend: CompositeHealthTrend = 'flat';
  if (delta >= 4) trend = 'improving';
  if (delta <= -4) trend = 'declining';

  if (trend === 'declining') {
    notes.push(`Composite health declined ${Math.abs(delta)} points`);
  } else if (trend === 'improving') {
    notes.push(`Composite health improved ${delta} points`);
  }

  const gradientIndex = Math.round(Math.min(100, Math.max(0, -delta * 2.5)));

  return { gradientIndex, trend, delta, notes: notes.slice(0, 6) };
}

export function combineDualTeamCompositeHealthGradient(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
