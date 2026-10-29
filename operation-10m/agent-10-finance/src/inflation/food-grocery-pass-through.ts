import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type FoodGroceryPassThroughBand = 'stable' | 'firming' | 'sharp' | 'supply_shock';

export interface FoodGroceryPassThroughAssessment {
  passThroughBand: FoodGroceryPassThroughBand;
  groceryIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Staples and grocery channel into macro CPI metadata (not commodity resourcePrices). */
export function assessFoodGroceryPassThrough(input: {
  harvestStressBand: 'normal' | 'weak' | 'severe';
  retailMarginPressure: 'low' | 'medium' | 'high';
  supplyChainDisruption: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): FoodGroceryPassThroughAssessment {
  let pressure = 0;
  if (input.harvestStressBand === 'severe') pressure += 0.45;
  else if (input.harvestStressBand === 'weak') pressure += 0.24;

  if (input.retailMarginPressure === 'high') pressure += 0.2;
  else if (input.retailMarginPressure === 'medium') pressure += 0.1;

  if (input.supplyChainDisruption) pressure += 0.22;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.09;
  }

  pressure = finClamp(pressure + input.turn * 0.005, 0, 1.05);
  const groceryIndex = finRound(100 + pressure * 18, 1);

  let passThroughBand: FoodGroceryPassThroughBand = 'stable';
  if (pressure >= 0.68) passThroughBand = 'supply_shock';
  else if (pressure >= 0.42) passThroughBand = 'sharp';
  else if (pressure >= 0.2) passThroughBand = 'firming';

  const inflationScoreNudge =
    passThroughBand === 'supply_shock'
      ? 0.1
      : passThroughBand === 'sharp'
        ? 0.07
        : passThroughBand === 'firming'
          ? 0.03
          : 0;

  const narrative =
    passThroughBand === 'supply_shock' || passThroughBand === 'sharp'
      ? 'Grocery and staples are lifting headline CPI through food basket pass-through.'
      : passThroughBand === 'firming'
        ? 'Food pass-through firming — watch harvest and supply chain stress.'
        : 'Food grocery pass-through stable relative to domestic services.';

  return { passThroughBand, groceryIndex, inflationScoreNudge, narrative };
}

export function foodGroceryPassThroughInflationScoreAdjustment(band: FoodGroceryPassThroughBand): number {
  if (band === 'supply_shock') return 5;
  if (band === 'sharp') return 3;
  if (band === 'firming') return 2;
  return 0;
}
