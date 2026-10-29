import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type TradeExchangeImportBand = 'anchored' | 'import_pressure' | 'elevated' | 'fx_shock';

export interface TradeExchangeImportInflationAssessment {
  importBand: TradeExchangeImportBand;
  tradeIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Trade openness, FX, and import pipeline fragility in CPI metadata (Agent 15). */
export function assessTradeExchangeImportInflation(input: {
  tradeOpennessBand: 'closed' | 'mixed' | 'open';
  exchangeRatePressure: 'appreciation' | 'stable' | 'depreciation' | 'sharp_depreciation';
  commodityImportShare: number;
  tariffShockInflationActive: boolean;
  importPipelineFragileBand: 'stable' | 'strained' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): TradeExchangeImportInflationAssessment {
  let pressure = 0;
  if (input.exchangeRatePressure === 'sharp_depreciation') {
    pressure += 0.3;
  } else if (input.exchangeRatePressure === 'depreciation') {
    pressure += 0.16;
  }
  if (input.tradeOpennessBand === 'open') {
    pressure += finClamp(input.commodityImportShare, 0, 1) * 0.22;
  }
  if (input.tariffShockInflationActive) {
    pressure += 0.18;
  }
  if (input.importPipelineFragileBand === 'critical') {
    pressure += 0.2;
  } else if (input.importPipelineFragileBand === 'strained') {
    pressure += 0.1;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.004, 0, 1.05);
  const tradeIndex = finRound(100 + pressure * 17, 1);

  let importBand: TradeExchangeImportBand = 'anchored';
  if (pressure >= 0.56) importBand = 'fx_shock';
  else if (pressure >= 0.36) importBand = 'elevated';
  else if (pressure >= 0.18) importBand = 'import_pressure';

  const inflationScoreNudge =
    importBand === 'fx_shock'
      ? 0.09
      : importBand === 'elevated'
        ? 0.058
        : importBand === 'import_pressure'
          ? 0.028
          : 0;

  const narrative =
    importBand === 'fx_shock' || importBand === 'elevated'
      ? 'Trade and FX channels are lifting CPI through import pipeline fragility.'
      : importBand === 'import_pressure'
        ? 'Import-side inflation pressure building from openness and commodity share.'
        : 'Trade exchange import pass-through anchored versus headline.';

  return { importBand, tradeIndex, inflationScoreNudge, narrative };
}

export function tradeExchangeImportInflationScoreAdjustment(band: TradeExchangeImportBand): number {
  if (band === 'fx_shock') return 4;
  if (band === 'elevated') return 3;
  if (band === 'import_pressure') return 2;
  return 0;
}
