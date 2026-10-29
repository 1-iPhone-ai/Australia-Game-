import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type TradeImportExchangeInflationPipelineSurgeBand =
  | 'anchored'
  | 'building'
  | 'surge'
  | 'pipeline_crisis';

export interface TradeImportExchangeInflationPipelineSurgeAssessment {
  surgeBand: TradeImportExchangeInflationPipelineSurgeBand;
  stressIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Trade import exchange inflation pipeline surge (Agent 15, round 48). */
export function assessTradeImportExchangeInflationPipelineSurge(input: {
  tradeOpennessBand: 'closed' | 'mixed' | 'open';
  exchangeRatePressure: 'appreciation' | 'stable' | 'depreciation' | 'sharp_depreciation';
  wave48TradeImportPipelineLatch: boolean;
  importExchangePipelineSurgeBand: 'stable' | 'stressed' | 'ruptured';
  inflationBand: InflationConditionsBand;
  turn: number;
}): TradeImportExchangeInflationPipelineSurgeAssessment {
  let pressure = 0;
  if (input.exchangeRatePressure === 'sharp_depreciation') pressure += 0.2;
  else if (input.exchangeRatePressure === 'depreciation') pressure += 0.11;
  if (input.tradeOpennessBand === 'open') pressure += 0.09;
  if (input.wave48TradeImportPipelineLatch) pressure += 0.13;
  if (input.importExchangePipelineSurgeBand === 'ruptured') pressure += 0.22;
  else if (input.importExchangePipelineSurgeBand === 'stressed') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0039, 0, 1.05);
  const stressIndex = finRound(100 + pressure * 16.2, 1);

  let surgeBand: TradeImportExchangeInflationPipelineSurgeBand = 'anchored';
  if (pressure >= 0.58) surgeBand = 'pipeline_crisis';
  else if (pressure >= 0.38) surgeBand = 'surge';
  else if (pressure >= 0.17) surgeBand = 'building';

  const inflationScoreNudge =
    surgeBand === 'pipeline_crisis'
      ? 0.093
      : surgeBand === 'surge'
        ? 0.06
        : surgeBand === 'building'
          ? 0.028
          : 0;

  const narrative =
    surgeBand === 'pipeline_crisis' || surgeBand === 'surge'
      ? 'Trade import exchange pipeline surge feeding CPI pass-through metadata.'
      : surgeBand === 'building'
        ? 'Import pipeline latch building under exchange stress.'
        : 'Trade import exchange pipeline surge anchored versus headline CPI.';

  return { surgeBand, stressIndex, inflationScoreNudge, narrative };
}

export function tradeImportExchangeInflationPipelineSurgeScoreAdjustment(
  band: TradeImportExchangeInflationPipelineSurgeBand,
): number {
  if (band === 'pipeline_crisis') return 4;
  if (band === 'surge') return 3;
  if (band === 'building') return 2;
  return 0;
}
