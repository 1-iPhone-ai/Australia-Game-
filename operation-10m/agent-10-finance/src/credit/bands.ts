import type {
  CreditConditionsBand,
  FinancialStabilityBand,
  InflationConditionsBand,
  MonetaryPolicyStance,
} from '../definitions/types.js';

export function bandInflation(score: number, scenario: boolean): InflationConditionsBand {
  if (scenario && score >= 70) return 'scenario_runaway';
  if (score >= 78) return 'high';
  if (score >= 58) return 'elevated';
  if (score <= 28) return 'disinflation';
  return 'anchored';
}

export function bandCredit(score: number): CreditConditionsBand {
  if (score >= 72) return 'accommodative';
  if (score >= 52) return 'neutral';
  if (score >= 36) return 'tight';
  if (score >= 22) return 'restricted';
  return 'frozen';
}

export function bandStability(score: number): FinancialStabilityBand {
  if (score >= 78) return 'resilient';
  if (score >= 62) return 'stable';
  if (score >= 46) return 'watch';
  if (score >= 30) return 'stressed';
  return 'crisis';
}

export function bandStance(
  infl: InflationConditionsBand,
  credit: CreditConditionsBand,
  stability: FinancialStabilityBand,
): MonetaryPolicyStance {
  if (stability === 'crisis' || credit === 'frozen') return 'emergency_easing';
  if (infl === 'high' || infl === 'scenario_runaway') return 'restrictive';
  if (infl === 'elevated' && credit !== 'accommodative') return 'tightening';
  if (infl === 'disinflation' && (credit === 'restricted' || credit === 'tight')) return 'accommodative';
  return 'neutral';
}

export function applyHysteresis(
  score: number,
  prevBand: string,
  nextBand: string,
  order: string[],
  deadband: number,
): string {
  const pi = order.indexOf(prevBand);
  const ni = order.indexOf(nextBand);
  if (pi < 0 || ni < 0) return nextBand;
  if (Math.abs(ni - pi) <= 1) return nextBand;
  if (ni > pi && score < order.indexOf(nextBand) * 20 - deadband) return prevBand;
  return nextBand;
}
