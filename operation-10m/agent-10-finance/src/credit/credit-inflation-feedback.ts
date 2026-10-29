import type { CreditConditionsBand, InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';
import { inflationBandSeverityRank } from '../inflation/pass-through.js';

export interface CreditInflationFeedbackAssessment {
  feedbackLoop: 'dampening' | 'neutral' | 'amplifying' | 'vicious';
  creditInflationCoupling: number;
  creditScoreNudge: number;
  inflationScoreNudge: number;
  summary: string;
}

const CREDIT_RANK: Record<CreditConditionsBand, number> = {
  frozen: 0,
  restricted: 1,
  tight: 1.5,
  neutral: 2,
  accommodative: 3,
};

/** Two-way credit–inflation coupling read for macro financial layer. */
export function assessCreditInflationFeedback(
  inflationBand: InflationConditionsBand,
  creditBand: CreditConditionsBand,
  creditShockActive: boolean,
): CreditInflationFeedbackAssessment {
  const inflRank = inflationBandSeverityRank(inflationBand);
  const credRank = CREDIT_RANK[creditBand];

  let coupling = finRound((inflRank - 2) * 0.18 + (2 - credRank) * 0.12, 3);
  if (creditShockActive) coupling += 0.15;
  coupling = finClamp(coupling, -0.5, 0.85);

  let feedbackLoop: CreditInflationFeedbackAssessment['feedbackLoop'] = 'neutral';
  if (inflRank >= 4 && credRank <= 1) {
    feedbackLoop = creditShockActive ? 'vicious' : 'amplifying';
  } else if (inflRank <= 2 && credRank >= 2) {
    feedbackLoop = 'dampening';
  } else if (coupling > 0.35) {
    feedbackLoop = 'amplifying';
  } else if (coupling < -0.1) {
    feedbackLoop = 'dampening';
  }

  const inflationScoreNudge =
    feedbackLoop === 'vicious' ? 1.8 : feedbackLoop === 'amplifying' ? 0.9 : feedbackLoop === 'dampening' ? -0.6 : 0;
  const creditScoreNudge =
    feedbackLoop === 'vicious' ? -2.2 : feedbackLoop === 'amplifying' ? -1.1 : feedbackLoop === 'dampening' ? 0.4 : 0;

  const summary =
    feedbackLoop === 'vicious'
      ? 'Credit stress and high inflation reinforce each other in the macro channel.'
      : feedbackLoop === 'amplifying'
        ? 'Tight credit is not yet breaking the inflation loop.'
        : feedbackLoop === 'dampening'
          ? 'Credit conditions are helping contain inflation pressures.'
          : 'Credit and inflation moving largely independently.';

  return {
    feedbackLoop,
    creditInflationCoupling: coupling,
    creditScoreNudge: finRound(creditScoreNudge, 2),
    inflationScoreNudge: finRound(inflationScoreNudge, 2),
    summary,
  };
}
