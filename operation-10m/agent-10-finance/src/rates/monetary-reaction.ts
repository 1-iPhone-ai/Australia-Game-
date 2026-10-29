import type { CreditConditionsBand, InflationConditionsBand, MonetaryPolicyStance } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';
import { inflationBandSeverityRank } from '../inflation/pass-through.js';

export interface MonetaryReactionInputs {
  inflationBand: InflationConditionsBand;
  creditBand: CreditConditionsBand;
  inflationScore: number;
  creditScore: number;
  creditShockActive?: boolean;
  targetInflationScore?: number;
}

export interface MonetaryReactionRecommendation {
  recommendedStance: MonetaryPolicyStance;
  inflationGap: number;
  policyTightnessIndex: number;
  rationale: string;
  lagTurns: number;
}

const STANCE_ORDER: MonetaryPolicyStance[] = [
  'emergency_easing',
  'accommodative',
  'neutral',
  'tightening',
  'restrictive',
];

function stanceIndex(s: MonetaryPolicyStance): number {
  return STANCE_ORDER.indexOf(s);
}

function indexToStance(i: number): MonetaryPolicyStance {
  return STANCE_ORDER[finClamp(Math.round(i), 0, STANCE_ORDER.length - 1)];
}

/** Simplified Taylor-style reaction — metadata for UI / co-pilot; does not execute trades. */
export function recommendMonetaryStance(inputs: MonetaryReactionInputs): MonetaryReactionRecommendation {
  const target = inputs.targetInflationScore ?? 45;
  const inflationGap = finRound(inputs.inflationScore - target, 2);
  let tightness = 2 + inflationGap * 0.035;

  if (inflationBandSeverityRank(inputs.inflationBand) >= inflationBandSeverityRank('high')) {
    tightness += 0.85;
  } else if (inflationBandSeverityRank(inputs.inflationBand) >= inflationBandSeverityRank('elevated')) {
    tightness += 0.35;
  }

  if (inputs.creditScore < 42 || inputs.creditBand === 'frozen') {
    tightness -= 0.5;
  }
  if (inputs.creditShockActive) {
    tightness += 0.25;
  }

  if (inputs.creditBand === 'accommodative' && inflationGap < 5) {
    tightness -= 0.2;
  }

  tightness = finClamp(tightness, 0, STANCE_ORDER.length - 1);
  const recommendedStance = indexToStance(tightness);

  const lagTurns = inputs.creditShockActive ? 2 : 1;
  const rationale =
    inflationGap > 12
      ? 'Inflation materially above target — tightening bias.'
      : inflationGap < -8
        ? 'Below-target inflation — easing bias.'
        : 'Near target — neutral stance.';

  return {
    recommendedStance,
    inflationGap,
    policyTightnessIndex: finRound(tightness / (STANCE_ORDER.length - 1), 3),
    rationale,
    lagTurns,
  };
}

export function stanceDriftTowardRecommendation(
  current: MonetaryPolicyStance,
  recommended: MonetaryPolicyStance,
  turnsElapsed: number,
): MonetaryPolicyStance {
  const cur = stanceIndex(current);
  const rec = stanceIndex(recommended);
  if (cur === rec) return current;
  const step = turnsElapsed >= 2 ? 1 : 0;
  if (step === 0) return current;
  return rec > cur ? indexToStance(cur + 1) : indexToStance(cur - 1);
}
