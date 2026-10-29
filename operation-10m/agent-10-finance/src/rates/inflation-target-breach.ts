import { finClamp, finRound } from '../compute/math.js';

export interface InflationTargetBand {
  lower: number;
  upper: number;
  midpoint: number;
}

export const DEFAULT_INFLATION_TARGET_BAND: InflationTargetBand = {
  lower: 2,
  upper: 3,
  midpoint: 2.5,
};

export type TargetBreachSide = 'below' | 'within' | 'above';

export interface InflationTargetBreach {
  side: TargetBreachSide;
  deviationFromMidpoint: number;
  breachSeverity: 'none' | 'watch' | 'material' | 'severe';
  policyUrgencyScore: number;
}

/** Maps macro inflation score (0–100) to implicit annualized target metaphor for dashboards. */
export function inflationScoreToImpliedTargetPercent(inflationScore: number): number {
  const s = finClamp(inflationScore, 0, 100);
  return finRound(0.5 + (s / 100) * 7.5, 2);
}

export function assessInflationTargetBreach(
  inflationScore: number,
  band: InflationTargetBand = DEFAULT_INFLATION_TARGET_BAND,
): InflationTargetBreach {
  const implied = inflationScoreToImpliedTargetPercent(inflationScore);
  const deviationFromMidpoint = finRound(implied - band.midpoint, 2);

  let side: TargetBreachSide = 'within';
  if (implied < band.lower) side = 'below';
  else if (implied > band.upper) side = 'above';

  const distance =
    side === 'within'
      ? 0
      : side === 'below'
        ? band.lower - implied
        : implied - band.upper;

  const breachSeverity: InflationTargetBreach['breachSeverity'] =
    distance <= 0
      ? 'none'
      : distance < 0.8
        ? 'watch'
        : distance < 1.8
          ? 'material'
          : 'severe';

  const policyUrgencyScore = finRound(
    finClamp((side === 'above' ? distance * 22 : side === 'below' ? distance * 8 : 0) + (breachSeverity === 'severe' ? 25 : 0), 0, 100),
    1,
  );

  return { side, deviationFromMidpoint, breachSeverity, policyUrgencyScore };
}
