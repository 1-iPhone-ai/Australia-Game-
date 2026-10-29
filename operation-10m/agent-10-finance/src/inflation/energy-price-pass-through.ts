import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type EnergyPassThroughBand = 'subdued' | 'firming' | 'sharp' | 'crisis';

export interface EnergyPricePassThroughAssessment {
  passThroughBand: EnergyPassThroughBand;
  energyCostIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Utility and transport fuel channel into macro CPI metadata (not commodity resourcePrices). */
export function assessEnergyPricePassThrough(input: {
  wholesaleEnergyStress: 'calm' | 'elevated' | 'severe' | 'crisis';
  retailTariffShock: boolean;
  gridReliabilityBand: 'stable' | 'strained' | 'fragile';
  inflationBand: InflationConditionsBand;
  turn: number;
}): EnergyPricePassThroughAssessment {
  let pressure = 0;
  if (input.wholesaleEnergyStress === 'crisis') pressure += 0.62;
  else if (input.wholesaleEnergyStress === 'severe') pressure += 0.4;
  else if (input.wholesaleEnergyStress === 'elevated') pressure += 0.22;

  if (input.retailTariffShock) pressure += 0.18;
  if (input.gridReliabilityBand === 'fragile') pressure += 0.14;
  else if (input.gridReliabilityBand === 'strained') pressure += 0.08;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.1;
  }

  pressure = finClamp(pressure + input.turn * 0.006, 0, 1.05);
  const energyCostIndex = finRound(100 + pressure * 22, 1);

  let passThroughBand: EnergyPassThroughBand = 'subdued';
  if (pressure >= 0.68) passThroughBand = 'crisis';
  else if (pressure >= 0.42) passThroughBand = 'sharp';
  else if (pressure >= 0.2) passThroughBand = 'firming';

  const inflationScoreNudge =
    passThroughBand === 'crisis'
      ? 0.12
      : passThroughBand === 'sharp'
        ? 0.08
        : passThroughBand === 'firming'
          ? 0.04
          : 0;

  const narrative =
    passThroughBand === 'crisis' || passThroughBand === 'sharp'
      ? 'Energy costs are pushing macro CPI through utilities and transport fuel.'
      : passThroughBand === 'firming'
        ? 'Energy pass-through firming — monitor wholesale and grid stress.'
        : 'Energy pass-through subdued relative to domestic services.';

  return { passThroughBand, energyCostIndex, inflationScoreNudge, narrative };
}

export function energyPassThroughInflationScoreAdjustment(band: EnergyPassThroughBand): number {
  if (band === 'crisis') return 5;
  if (band === 'sharp') return 3;
  if (band === 'firming') return 2;
  return 0;
}
