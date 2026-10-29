import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';
import { referencePolicyRate } from './reference-rate.js';
import { inflationScoreToImpliedTargetPercent } from './inflation-target-breach.js';
import type { MonetaryPolicyStance } from '../definitions/types.js';

export interface RealRateGapAssessment {
  nominalPolicyRatePercent: number;
  impliedInflationPercent: number;
  realRatePercent: number;
  gapBand: 'deeply_negative' | 'negative' | 'neutral' | 'positive' | 'restrictive';
  inflationScore: number;
  narrative: string;
}

/** Real rate = nominal policy minus implied CPI — metadata for co-pilot / dashboards. */
export function assessRealRateGap(
  inflationScore: number,
  stance: MonetaryPolicyStance,
  inflationBand: InflationConditionsBand,
): RealRateGapAssessment {
  const nominalPolicyRatePercent = referencePolicyRate(stance, 'neutral') * 100;
  const impliedInflationPercent = inflationScoreToImpliedTargetPercent(inflationScore);
  const realRatePercent = finRound(nominalPolicyRatePercent - impliedInflationPercent, 2);

  let gapBand: RealRateGapAssessment['gapBand'] = 'neutral';
  if (realRatePercent <= -2.5) gapBand = 'deeply_negative';
  else if (realRatePercent < -0.35) gapBand = 'negative';
  else if (realRatePercent <= 1.2) gapBand = 'neutral';
  else if (realRatePercent <= 3.5) gapBand = 'positive';
  else gapBand = 'restrictive';

  if (inflationBand === 'scenario_runaway' && gapBand === 'neutral') {
    gapBand = 'negative';
  }

  const narrative =
    gapBand === 'deeply_negative' || gapBand === 'negative'
      ? 'Real rates are accommodative — inflation may persist unless stance tightens.'
      : gapBand === 'restrictive' || gapBand === 'positive'
        ? 'Real rates are firm — disinflation channel active in metadata layer.'
        : 'Real rates near neutral relative to implied inflation.';

  return {
    nominalPolicyRatePercent: finRound(nominalPolicyRatePercent, 2),
    impliedInflationPercent: finRound(impliedInflationPercent, 2),
    realRatePercent: finClamp(realRatePercent, -8, 8),
    gapBand,
    inflationScore: finRound(inflationScore, 1),
    narrative,
  };
}

export function realRateGapTighteningBias(gap: RealRateGapAssessment): number {
  if (gap.gapBand === 'deeply_negative') return 0.35;
  if (gap.gapBand === 'negative') return 0.18;
  if (gap.gapBand === 'restrictive') return -0.12;
  return 0;
}
