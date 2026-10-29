import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';
import { inflationBandSeverityRank } from './pass-through.js';
import type { InflationMomentumSnapshot } from './inflation-momentum.js';

export interface DisinflationSacrificeEstimate {
  sacrificeRatio: number;
  outputCostBand: 'low' | 'moderate' | 'high' | 'severe';
  turnsToAnchor: number;
  narrative: string;
}

/** Okun-style sacrifice ratio metaphor for disinflation paths (metadata only). */
export function estimateDisinflationSacrifice(
  inflationBand: InflationConditionsBand,
  inflationScore: number,
  momentum: InflationMomentumSnapshot | null,
): DisinflationSacrificeEstimate {
  const rank = inflationBandSeverityRank(inflationBand);
  const scoreGap = finClamp(inflationScore - 45, 0, 55);
  let sacrificeRatio = finRound(0.35 + rank * 0.22 + scoreGap * 0.012, 2);
  if (momentum?.direction === 'accelerating' || momentum?.direction === 'runaway') {
    sacrificeRatio = finRound(sacrificeRatio + 0.25, 2);
  }
  sacrificeRatio = finClamp(sacrificeRatio, 0.2, 3.5);

  const outputCostBand: DisinflationSacrificeEstimate['outputCostBand'] =
    sacrificeRatio >= 2.4
      ? 'severe'
      : sacrificeRatio >= 1.6
        ? 'high'
        : sacrificeRatio >= 0.9
          ? 'moderate'
          : 'low';

  const turnsToAnchor = Math.round(finClamp(2 + rank * 1.5 + scoreGap * 0.08 + (momentum?.streakTurns ?? 0) * 0.3, 2, 14));

  const narrative =
    outputCostBand === 'severe' || outputCostBand === 'high'
      ? 'Disinflation likely requires sustained tight financial conditions and fiscal restraint.'
      : 'Moderate sacrifice ratio — anchoring achievable with coordinated policy.';

  return { sacrificeRatio, outputCostBand, turnsToAnchor, narrative };
}
