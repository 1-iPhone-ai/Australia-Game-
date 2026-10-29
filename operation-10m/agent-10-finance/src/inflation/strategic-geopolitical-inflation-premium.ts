import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type StrategicGeopoliticalPremiumBand = 'contained' | 'firming' | 'elevated' | 'geopolitical_shock';

export interface StrategicGeopoliticalInflationPremiumAssessment {
  premiumBand: StrategicGeopoliticalPremiumBand;
  strategicIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** National strategic priority and geopolitical risk premium in CPI metadata (Agent 01). */
export function assessStrategicGeopoliticalInflationPremium(input: {
  nationalPriorityInflationBias: 'containment' | 'neutral' | 'expansionary';
  strategicStockpileStress: boolean;
  geopoliticalRiskPremium: number;
  expansionaryPriorityCascadeActive: boolean;
  strategicInflationRiskBand: 'low' | 'elevated' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): StrategicGeopoliticalInflationPremiumAssessment {
  let pressure = 0;
  if (input.nationalPriorityInflationBias === 'expansionary') {
    pressure += 0.22;
  }
  if (input.strategicStockpileStress) {
    pressure += 0.18;
  }
  pressure += finClamp(input.geopoliticalRiskPremium, 0, 1) * 0.24;
  if (input.expansionaryPriorityCascadeActive) {
    pressure += 0.16;
  }
  if (input.strategicInflationRiskBand === 'critical') {
    pressure += 0.22;
  } else if (input.strategicInflationRiskBand === 'elevated') {
    pressure += 0.11;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const strategicIndex = finRound(100 + pressure * 17, 1);

  let premiumBand: StrategicGeopoliticalPremiumBand = 'contained';
  if (pressure >= 0.56) premiumBand = 'geopolitical_shock';
  else if (pressure >= 0.36) premiumBand = 'elevated';
  else if (pressure >= 0.17) premiumBand = 'firming';

  const inflationScoreNudge =
    premiumBand === 'geopolitical_shock'
      ? 0.09
      : premiumBand === 'elevated'
        ? 0.057
        : premiumBand === 'firming'
          ? 0.027
          : 0;

  const narrative =
    premiumBand === 'geopolitical_shock' || premiumBand === 'elevated'
      ? 'Strategic priorities and geopolitical risk are lifting CPI through premium channels.'
      : premiumBand === 'firming'
        ? 'National inflation bias firming with stockpile and risk pass-through.'
        : 'Strategic geopolitical premium contained versus headline CPI.';

  return { premiumBand, strategicIndex, inflationScoreNudge, narrative };
}

export function strategicGeopoliticalInflationPremiumScoreAdjustment(band: StrategicGeopoliticalPremiumBand): number {
  if (band === 'geopolitical_shock') return 4;
  if (band === 'elevated') return 3;
  if (band === 'firming') return 2;
  return 0;
}
