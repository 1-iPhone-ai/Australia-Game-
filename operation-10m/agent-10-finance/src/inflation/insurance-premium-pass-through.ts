import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type InsurancePremiumPassThroughBand = 'stable' | 'firming' | 'sharp' | 'hard_market';

export interface InsurancePremiumPassThroughAssessment {
  passThroughBand: InsurancePremiumPassThroughBand;
  premiumIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** General insurance premiums channel into macro CPI (metadata only). */
export function assessInsurancePremiumPassThrough(input: {
  claimsInflationBand: 'low' | 'moderate' | 'high' | 'extreme';
  reinsuranceStress: boolean;
  catastropheLoadActive: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): InsurancePremiumPassThroughAssessment {
  let pressure = 0;
  if (input.claimsInflationBand === 'extreme') pressure += 0.48;
  else if (input.claimsInflationBand === 'high') pressure += 0.3;
  else if (input.claimsInflationBand === 'moderate') pressure += 0.14;

  if (input.reinsuranceStress) pressure += 0.22;
  if (input.catastropheLoadActive) pressure += 0.2;

  if (input.inflationBand === 'elevated' || input.inflationBand === 'high') {
    pressure += 0.06;
  }

  pressure = finClamp(pressure + input.turn * 0.005, 0, 1.05);
  const premiumIndex = finRound(100 + pressure * 19, 1);

  let passThroughBand: InsurancePremiumPassThroughBand = 'stable';
  if (pressure >= 0.68) passThroughBand = 'hard_market';
  else if (pressure >= 0.42) passThroughBand = 'sharp';
  else if (pressure >= 0.2) passThroughBand = 'firming';

  const inflationScoreNudge =
    passThroughBand === 'hard_market'
      ? 0.09
      : passThroughBand === 'sharp'
        ? 0.06
        : passThroughBand === 'firming'
          ? 0.03
          : 0;

  const narrative =
    passThroughBand === 'hard_market' || passThroughBand === 'sharp'
      ? 'Insurance premiums are feeding household cost-of-living and CPI insurance sub-basket.'
      : passThroughBand === 'firming'
        ? 'Insurance pass-through firming — claims and reinsurance costs elevated.'
        : 'Insurance premium pass-through stable relative to macro services.';

  return { passThroughBand, premiumIndex, inflationScoreNudge, narrative };
}

export function insurancePremiumPassThroughInflationScoreAdjustment(
  band: InsurancePremiumPassThroughBand,
): number {
  if (band === 'hard_market') return 5;
  if (band === 'sharp') return 3;
  if (band === 'firming') return 2;
  return 0;
}
