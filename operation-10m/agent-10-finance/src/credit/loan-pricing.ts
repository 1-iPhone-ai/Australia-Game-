import type { CreditConditionsBand } from '../definitions/types.js';
import { advancedLoanEffectiveRate } from '../rates/reference-rate.js';
import { finClamp } from '../compute/math.js';

export interface LoanPricingQuote {
  baseRate: number;
  spreadMultiplier: number;
  regionalPremium: number;
  effectiveRate: number;
  affordabilityNote: string;
}

export function quoteAdvancedLoanPricing(
  baseRate: number,
  spreadMultiplier: number,
  credit: CreditConditionsBand,
  loanAffordabilityIndex: number,
  regionalPremium = 1,
): LoanPricingQuote {
  const effectiveRate = advancedLoanEffectiveRate(baseRate, spreadMultiplier * regionalPremium);
  let affordabilityNote = 'Macro loan conditions are neutral.';
  if (credit === 'frozen' || credit === 'restricted') {
    affordabilityNote = 'Restricted macro credit — spreads elevated (metadata only).';
  } else if (credit === 'accommodative' && loanAffordabilityIndex >= 60) {
    affordabilityNote = 'Accommodative credit supports prudent borrowing.';
  } else if (loanAffordabilityIndex < 40) {
    affordabilityNote = 'Low loan affordability index — consider deleveraging first.';
  }
  return {
    baseRate,
    spreadMultiplier: finClamp(spreadMultiplier * regionalPremium, 0.88, 1.85),
    regionalPremium,
    effectiveRate,
    affordabilityNote,
  };
}

export function refinanceTimingSignal(
  credit: CreditConditionsBand,
  actorStress: number,
): 'favorable' | 'neutral' | 'defer' {
  if (credit === 'frozen' || credit === 'restricted' || actorStress > 0.75) return 'defer';
  if (credit === 'accommodative' && actorStress < 0.45) return 'favorable';
  return 'neutral';
}
