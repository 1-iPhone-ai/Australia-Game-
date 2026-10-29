import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type RetailTradeMarginBand = 'compressed' | 'stable' | 'expanding' | 'price_led';

export interface RetailTradeMarginInflationAssessment {
  marginBand: RetailTradeMarginBand;
  retailIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Retail trade margin and shelf-price pass-through in macro CPI metadata. */
export function assessRetailTradeMarginInflation(input: {
  discountingIntensity: 'heavy' | 'moderate' | 'light';
  inventoryClearanceActive: boolean;
  wageBillPressure: 'low' | 'medium' | 'high';
  inflationBand: InflationConditionsBand;
  turn: number;
}): RetailTradeMarginInflationAssessment {
  let pressure = 0;
  if (input.wageBillPressure === 'high') pressure += 0.32;
  else if (input.wageBillPressure === 'medium') pressure += 0.16;

  if (input.discountingIntensity === 'light') pressure += 0.18;
  else if (input.discountingIntensity === 'moderate') pressure += 0.08;

  if (input.inventoryClearanceActive) pressure -= 0.12;

  if (input.inflationBand === 'elevated' || input.inflationBand === 'high') {
    pressure += 0.07;
  }

  pressure = finClamp(pressure + input.turn * 0.004, 0, 1.05);
  const retailIndex = finRound(100 + pressure * 15, 1);

  let marginBand: RetailTradeMarginBand = 'stable';
  if (pressure >= 0.55) marginBand = 'price_led';
  else if (pressure >= 0.35) marginBand = 'expanding';
  else if (pressure < 0.12) marginBand = 'compressed';

  const inflationScoreNudge =
    marginBand === 'price_led'
      ? 0.08
      : marginBand === 'expanding'
        ? 0.05
        : marginBand === 'compressed'
          ? -0.02
          : 0;

  const narrative =
    marginBand === 'price_led' || marginBand === 'expanding'
      ? 'Retail margins are passing wage and input costs into shelf-price CPI.'
      : marginBand === 'compressed'
        ? 'Retail discounting compressing margins — partial CPI offset.'
        : 'Retail trade margin inflation stable versus services basket.';

  return { marginBand, retailIndex, inflationScoreNudge, narrative };
}

export function retailTradeMarginInflationScoreAdjustment(band: RetailTradeMarginBand): number {
  if (band === 'price_led') return 4;
  if (band === 'expanding') return 3;
  if (band === 'compressed') return 0;
  return 1;
}
