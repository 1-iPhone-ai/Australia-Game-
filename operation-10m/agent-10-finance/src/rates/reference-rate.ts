import type { CreditConditionsBand, MonetaryPolicyStance } from '../definitions/types.js';

/** Narrative reference rate (annualized fraction) — metadata only. */
const STANCE_BASE: Record<MonetaryPolicyStance, number> = {
  emergency_easing: 0.02,
  accommodative: 0.035,
  neutral: 0.05,
  tightening: 0.065,
  restrictive: 0.085,
};

const CREDIT_ADJ: Record<CreditConditionsBand, number> = {
  accommodative: -0.01,
  neutral: 0,
  tight: 0.012,
  restricted: 0.025,
  frozen: 0.04,
};

export function referencePolicyRate(stance: MonetaryPolicyStance, credit: CreditConditionsBand): number {
  const raw = STANCE_BASE[stance] + CREDIT_ADJ[credit];
  return Math.max(0, Math.min(0.15, Math.round(raw * 1000) / 1000));
}

export function advancedLoanEffectiveRate(baseRate: number, spreadMultiplier: number): number {
  return Math.max(0, Math.min(1, baseRate * spreadMultiplier));
}
