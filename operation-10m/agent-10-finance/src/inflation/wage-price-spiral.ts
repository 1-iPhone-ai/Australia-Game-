import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';
import { inflationBandSeverityRank } from './pass-through.js';

export interface WagePriceSpiralInputs {
  inflationBand: InflationConditionsBand;
  householdAffordability: 'healthy' | 'strained' | 'severe_pressure' | null | undefined;
  fiscalPressure: 'healthy' | 'tight' | 'strained' | 'critical' | null | undefined;
  /** 0–100 nominal wage growth pressure from labor module (read-only). */
  wageGrowthPressureScore?: number;
  turn: number;
}

export interface WagePriceSpiralAssessment {
  spiralRisk: 'low' | 'moderate' | 'elevated' | 'critical';
  wagePassThroughFraction: number;
  impliedInflationScoreDelta: number;
  narrative: string;
  dampeningFactors: string[];
}

const BAND_BASE_RISK: Record<InflationConditionsBand, number> = {
  disinflation: 0.05,
  anchored: 0.12,
  elevated: 0.28,
  high: 0.45,
  scenario_runaway: 0.72,
};

/** Deterministic wage–price feedback — does not mutate commodity resource prices. */
export function assessWagePriceSpiral(inputs: WagePriceSpiralInputs): WagePriceSpiralAssessment {
  const dampeningFactors: string[] = [];
  let risk = BAND_BASE_RISK[inputs.inflationBand];

  const wage = finClamp(inputs.wageGrowthPressureScore ?? 40, 0, 100);
  risk += (wage - 40) * 0.004;

  if (inputs.householdAffordability === 'severe_pressure') {
    risk += 0.12;
    dampeningFactors.push('household_affordability_cap');
  } else if (inputs.householdAffordability === 'strained') {
    risk += 0.05;
  }

  if (inputs.fiscalPressure === 'critical') {
    risk += 0.08;
    dampeningFactors.push('fiscal_austerity_dampener');
  } else if (inputs.fiscalPressure === 'strained') {
    risk += 0.03;
  }

  if (inflationBandSeverityRank(inputs.inflationBand) <= inflationBandSeverityRank('anchored')) {
    risk *= 0.65;
    dampeningFactors.push('anchored_inflation_band');
  }

  // Even turns slightly dampen narrative spiral (contractual lag)
  if (inputs.turn % 2 === 0) {
    risk *= 0.97;
  }

  const clampedRisk = finClamp(risk, 0, 1);
  const spiralRisk: WagePriceSpiralAssessment['spiralRisk'] =
    clampedRisk >= 0.62 ? 'critical' : clampedRisk >= 0.42 ? 'elevated' : clampedRisk >= 0.22 ? 'moderate' : 'low';

  const wagePassThroughFraction = finRound(finClamp(clampedRisk * 0.35, 0, 0.28), 3);
  const impliedInflationScoreDelta = finRound(wagePassThroughFraction * 100 * 0.55, 2);

  const narrative =
    spiralRisk === 'critical'
      ? 'Wage settlements and service prices are reinforcing — macro CPI channel only.'
      : spiralRisk === 'elevated'
        ? 'Second-round wage pressure is building in services.'
        : spiralRisk === 'moderate'
          ? 'Mild wage pass-through; inflation expectations still manageable.'
          : 'Wage–price loop contained.';

  return {
    spiralRisk,
    wagePassThroughFraction,
    impliedInflationScoreDelta,
    narrative,
    dampeningFactors,
  };
}

export function wageSpiralInflationScoreAdjustment(assessment: WagePriceSpiralAssessment): number {
  if (assessment.spiralRisk === 'low') return 0;
  return finRound(assessment.impliedInflationScoreDelta, 2);
}
