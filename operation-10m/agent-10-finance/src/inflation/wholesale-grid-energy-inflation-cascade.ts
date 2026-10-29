import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type WholesaleGridEnergyInflationCascadeBand = 'stable' | 'stressed' | 'fragile' | 'crisis';

export interface WholesaleGridEnergyInflationCascadeAssessment {
  cascadeBand: WholesaleGridEnergyInflationCascadeBand;
  energyIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Wholesale grid and tariff energy inflation cascade (Agent 13). */
export function assessWholesaleGridEnergyInflationCascade(input: {
  wholesaleEnergyStress: 'calm' | 'elevated' | 'severe' | 'crisis';
  retailTariffShock: boolean;
  gridReliabilityBand: 'stable' | 'strained' | 'fragile';
  gridTariffInflationLatch: boolean;
  wholesaleStressCascadeBand: 'stable' | 'stressed' | 'cascade';
  inflationBand: InflationConditionsBand;
  turn: number;
}): WholesaleGridEnergyInflationCascadeAssessment {
  let pressure = 0;
  if (input.wholesaleEnergyStress === 'crisis') pressure += 0.24;
  else if (input.wholesaleEnergyStress === 'severe') pressure += 0.14;
  else if (input.wholesaleEnergyStress === 'elevated') pressure += 0.07;
  if (input.retailTariffShock) pressure += 0.14;
  if (input.gridReliabilityBand === 'fragile') pressure += 0.12;
  else if (input.gridReliabilityBand === 'strained') pressure += 0.06;
  if (input.gridTariffInflationLatch) pressure += 0.13;
  if (input.wholesaleStressCascadeBand === 'cascade') pressure += 0.21;
  else if (input.wholesaleStressCascadeBand === 'stressed') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0037, 0, 1.05);
  const energyIndex = finRound(100 + pressure * 15, 1);

  let cascadeBand: WholesaleGridEnergyInflationCascadeBand = 'stable';
  if (pressure >= 0.54) cascadeBand = 'crisis';
  else if (pressure >= 0.34) cascadeBand = 'fragile';
  else if (pressure >= 0.15) cascadeBand = 'stressed';

  const inflationScoreNudge =
    cascadeBand === 'crisis' ? 0.088 : cascadeBand === 'fragile' ? 0.055 : cascadeBand === 'stressed' ? 0.026 : 0;

  const narrative =
    cascadeBand === 'crisis' || cascadeBand === 'fragile'
      ? 'Wholesale grid energy cascade passing into utility CPI metadata.'
      : cascadeBand === 'stressed'
        ? 'Grid tariff inflation latch building under wholesale stress.'
        : 'Wholesale grid cascade stable versus headline CPI.';

  return { cascadeBand, energyIndex, inflationScoreNudge, narrative };
}

export function wholesaleGridEnergyInflationCascadeScoreAdjustment(band: WholesaleGridEnergyInflationCascadeBand): number {
  if (band === 'crisis') return 4;
  if (band === 'fragile') return 3;
  if (band === 'stressed') return 2;
  return 0;
}
