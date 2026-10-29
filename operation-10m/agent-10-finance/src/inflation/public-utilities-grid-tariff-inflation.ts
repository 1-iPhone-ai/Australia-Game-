import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type PublicUtilitiesGridTariffBand = 'subdued' | 'firming' | 'elevated' | 'grid_shock';

export interface PublicUtilitiesGridTariffInflationAssessment {
  tariffBand: PublicUtilitiesGridTariffBand;
  gridIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Electricity and gas grid tariffs in macro CPI metadata (V10.12 utilities — distinct from water). */
export function assessPublicUtilitiesGridTariffInflation(input: {
  serviceReliabilityBand: 'robust' | 'strained' | 'fragile' | 'critical';
  outageRiskBand: 'clear' | 'moderate' | 'rolling' | 'severe';
  capacityMarginBand: 'surplus' | 'balanced' | 'thin' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): PublicUtilitiesGridTariffInflationAssessment {
  let pressure = 0;
  if (input.serviceReliabilityBand === 'critical' || input.serviceReliabilityBand === 'fragile') {
    pressure += 0.34;
  } else if (input.serviceReliabilityBand === 'strained') {
    pressure += 0.18;
  }

  if (input.outageRiskBand === 'severe' || input.outageRiskBand === 'rolling') {
    pressure += 0.28;
  } else if (input.outageRiskBand === 'moderate') {
    pressure += 0.12;
  }

  if (input.capacityMarginBand === 'critical' || input.capacityMarginBand === 'thin') {
    pressure += 0.22;
  } else if (input.capacityMarginBand === 'balanced') {
    pressure += 0.06;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.08;
  }

  pressure = finClamp(pressure + input.turn * 0.0048, 0, 1.05);
  const gridIndex = finRound(100 + pressure * 18, 1);

  let tariffBand: PublicUtilitiesGridTariffBand = 'subdued';
  if (pressure >= 0.58) tariffBand = 'grid_shock';
  else if (pressure >= 0.38) tariffBand = 'elevated';
  else if (pressure >= 0.2) tariffBand = 'firming';

  const inflationScoreNudge =
    tariffBand === 'grid_shock'
      ? 0.09
      : tariffBand === 'elevated'
        ? 0.06
        : tariffBand === 'firming'
          ? 0.03
          : 0;

  const narrative =
    tariffBand === 'grid_shock' || tariffBand === 'elevated'
      ? 'Public utilities grid tariffs are lifting CPI through reliability stress and thin capacity margins.'
      : tariffBand === 'firming'
        ? 'Grid tariff inflation firming as outage risk and reserve margins tighten.'
        : 'Electricity and gas grid tariff pass-through subdued versus headline.';

  return { tariffBand, gridIndex, inflationScoreNudge, narrative };
}

export function publicUtilitiesGridTariffInflationScoreAdjustment(band: PublicUtilitiesGridTariffBand): number {
  if (band === 'grid_shock') return 4;
  if (band === 'elevated') return 3;
  if (band === 'firming') return 2;
  return 0;
}
