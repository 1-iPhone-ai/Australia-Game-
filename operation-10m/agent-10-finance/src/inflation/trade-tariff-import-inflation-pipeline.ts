import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type TradeTariffImportInflationPipelineBand = 'anchored' | 'stressed' | 'fragile' | 'ruptured';

export interface TradeTariffImportInflationPipelineAssessment {
  pipelineBand: TradeTariffImportInflationPipelineBand;
  tradeIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Trade tariff and import pipeline inflation stress (Agent 15). */
export function assessTradeTariffImportInflationPipeline(input: {
  tradeOpennessBand: 'closed' | 'mixed' | 'open';
  exchangeRatePressure: 'appreciation' | 'stable' | 'depreciation' | 'sharp_depreciation';
  commodityImportShare: number;
  importTariffInflationLatch: boolean;
  exchangePipelineStressBand: 'stable' | 'stressed' | 'ruptured';
  inflationBand: InflationConditionsBand;
  turn: number;
}): TradeTariffImportInflationPipelineAssessment {
  let pressure = 0;
  if (input.exchangeRatePressure === 'sharp_depreciation') {
    pressure += 0.22;
  } else if (input.exchangeRatePressure === 'depreciation') {
    pressure += 0.12;
  }
  if (input.tradeOpennessBand === 'open') {
    pressure += finClamp(input.commodityImportShare, 0, 1) * 0.2;
  }
  if (input.importTariffInflationLatch) {
    pressure += 0.14;
  }
  if (input.exchangePipelineStressBand === 'ruptured') {
    pressure += 0.22;
  } else if (input.exchangePipelineStressBand === 'stressed') {
    pressure += 0.11;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const tradeIndex = finRound(100 + pressure * 15, 1);

  let pipelineBand: TradeTariffImportInflationPipelineBand = 'anchored';
  if (pressure >= 0.54) pipelineBand = 'ruptured';
  else if (pressure >= 0.34) pipelineBand = 'fragile';
  else if (pressure >= 0.15) pipelineBand = 'stressed';

  const inflationScoreNudge =
    pipelineBand === 'ruptured'
      ? 0.088
      : pipelineBand === 'fragile'
        ? 0.055
        : pipelineBand === 'stressed'
          ? 0.026
          : 0;

  const narrative =
    pipelineBand === 'ruptured' || pipelineBand === 'fragile'
      ? 'Trade tariff and import pipeline stress lifting CPI metadata.'
      : pipelineBand === 'stressed'
        ? 'Import tariff inflation latch building exchange pipeline pressure.'
        : 'Trade import pipeline anchored versus headline CPI.';

  return { pipelineBand, tradeIndex, inflationScoreNudge, narrative };
}

export function tradeTariffImportInflationPipelineScoreAdjustment(
  band: TradeTariffImportInflationPipelineBand,
): number {
  if (band === 'ruptured') return 4;
  if (band === 'fragile') return 3;
  if (band === 'stressed') return 2;
  return 0;
}
