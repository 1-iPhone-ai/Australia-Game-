import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type ImportPassThroughBand = 'muted' | 'moderate' | 'strong' | 'surge';

export interface ImportPricePassThroughAssessment {
  passThroughBand: ImportPassThroughBand;
  inflationScoreNudge: number;
  importCostIndex: number;
  narrative: string;
}

/** Trade-weighted import price channel into macro CPI metadata (no commodity resourcePrices). */
export function assessImportPricePassThrough(input: {
  tradeOpennessBand: 'closed' | 'mixed' | 'open';
  exchangeRatePressure: 'appreciation' | 'stable' | 'depreciation' | 'sharp_depreciation';
  commodityImportShare: number;
  inflationBand: InflationConditionsBand;
  turn: number;
}): ImportPricePassThroughAssessment {
  const share = finClamp(input.commodityImportShare, 0, 1);
  let pressureScore = 0;
  if (input.exchangeRatePressure === 'sharp_depreciation') pressureScore += 0.55;
  else if (input.exchangeRatePressure === 'depreciation') pressureScore += 0.32;
  else if (input.exchangeRatePressure === 'appreciation') pressureScore -= 0.18;

  if (input.tradeOpennessBand === 'open') pressureScore += 0.22;
  else if (input.tradeOpennessBand === 'mixed') pressureScore += 0.1;

  pressureScore += share * 0.35;
  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressureScore += 0.12;
  }

  pressureScore = finClamp(pressureScore + input.turn * 0.008, -0.2, 1.1);
  const importCostIndex = finRound(100 + pressureScore * 18, 1);

  let passThroughBand: ImportPassThroughBand = 'muted';
  if (pressureScore >= 0.72) passThroughBand = 'surge';
  else if (pressureScore >= 0.45) passThroughBand = 'strong';
  else if (pressureScore >= 0.2) passThroughBand = 'moderate';

  const inflationScoreNudge =
    passThroughBand === 'surge'
      ? 0.14
      : passThroughBand === 'strong'
        ? 0.09
        : passThroughBand === 'moderate'
          ? 0.04
          : 0;

  const narrative =
    passThroughBand === 'surge' || passThroughBand === 'strong'
      ? 'Import prices are feeding through to macro CPI pressure in the trade channel.'
      : passThroughBand === 'moderate'
        ? 'Moderate import pass-through — watch exchange and openness.'
        : 'Import pass-through muted relative to domestic drivers.';

  return { passThroughBand, inflationScoreNudge, importCostIndex, narrative };
}

export function importPassThroughInflationScoreAdjustment(band: ImportPassThroughBand): number {
  if (band === 'surge') return 6;
  if (band === 'strong') return 4;
  if (band === 'moderate') return 2;
  return 0;
}
