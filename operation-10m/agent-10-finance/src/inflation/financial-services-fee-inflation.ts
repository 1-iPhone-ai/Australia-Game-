import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type FinancialServicesFeeBand = 'subdued' | 'firming' | 'elevated' | 'fee_shock';

export interface FinancialServicesFeeInflationAssessment {
  feeBand: FinancialServicesFeeBand;
  servicesIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Banking, mortgage servicing, and payment fees in macro CPI metadata (not asset prices). */
export function assessFinancialServicesFeeInflation(input: {
  fundingCostPassThrough: 'low' | 'medium' | 'high';
  complianceCostStackActive: boolean;
  depositRateCompetitionBand: 'weak' | 'normal' | 'intense';
  inflationBand: InflationConditionsBand;
  turn: number;
}): FinancialServicesFeeInflationAssessment {
  let pressure = 0;
  if (input.fundingCostPassThrough === 'high') pressure += 0.36;
  else if (input.fundingCostPassThrough === 'medium') pressure += 0.18;

  if (input.complianceCostStackActive) pressure += 0.14;
  if (input.depositRateCompetitionBand === 'intense') pressure += 0.12;
  else if (input.depositRateCompetitionBand === 'weak') pressure += 0.06;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.09;
  }

  pressure = finClamp(pressure + input.turn * 0.0045, 0, 1.05);
  const servicesIndex = finRound(100 + pressure * 16, 1);

  let feeBand: FinancialServicesFeeBand = 'subdued';
  if (pressure >= 0.58) feeBand = 'fee_shock';
  else if (pressure >= 0.38) feeBand = 'elevated';
  else if (pressure >= 0.18) feeBand = 'firming';

  const inflationScoreNudge =
    feeBand === 'fee_shock'
      ? 0.08
      : feeBand === 'elevated'
        ? 0.05
        : feeBand === 'firming'
          ? 0.03
          : 0;

  const narrative =
    feeBand === 'fee_shock' || feeBand === 'elevated'
      ? 'Financial services fees are lifting CPI through funding and compliance pass-through.'
      : feeBand === 'firming'
        ? 'Fee inflation firming as deposit competition and funding costs bite.'
        : 'Financial services fee inflation subdued versus headline.';

  return { feeBand, servicesIndex, inflationScoreNudge, narrative };
}

export function financialServicesFeeInflationScoreAdjustment(band: FinancialServicesFeeBand): number {
  if (band === 'fee_shock') return 4;
  if (band === 'elevated') return 3;
  if (band === 'firming') return 2;
  return 0;
}
