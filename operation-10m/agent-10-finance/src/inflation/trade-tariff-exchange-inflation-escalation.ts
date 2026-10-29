import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type TradeTariffExchangeInflationEscalationBand = 'stable' | 'stressed' | 'ruptured' | 'exchange_crisis';

export interface TradeTariffExchangeInflationEscalationAssessment {
  escalationBand: TradeTariffExchangeInflationEscalationBand;
  exchangeIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Trade tariff and exchange inflation escalation (Agent 15). */
export function assessTradeTariffExchangeInflationEscalation(input: {
  exchangeRatePressure: 'appreciation' | 'stable' | 'depreciation' | 'sharp_depreciation';
  tradeOpennessBand: 'closed' | 'mixed' | 'open';
  commodityImportShare: number;
  wave39TariffExchangeLatch: boolean;
  importExchangeEscalationBand: 'stable' | 'stressed' | 'ruptured';
  inflationBand: InflationConditionsBand;
  turn: number;
}): TradeTariffExchangeInflationEscalationAssessment {
  let pressure = 0;
  if (input.exchangeRatePressure === 'sharp_depreciation') pressure += 0.24;
  else if (input.exchangeRatePressure === 'depreciation') pressure += 0.12;
  if (input.tradeOpennessBand === 'open') pressure += 0.1;
  pressure += finClamp(input.commodityImportShare, 0, 1) * 0.18;
  if (input.wave39TariffExchangeLatch) pressure += 0.12;
  if (input.importExchangeEscalationBand === 'ruptured') pressure += 0.21;
  else if (input.importExchangeEscalationBand === 'stressed') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0037, 0, 1.05);
  const exchangeIndex = finRound(100 + pressure * 16, 1);

  let escalationBand: TradeTariffExchangeInflationEscalationBand = 'stable';
  if (pressure >= 0.57) escalationBand = 'exchange_crisis';
  else if (pressure >= 0.38) escalationBand = 'ruptured';
  else if (pressure >= 0.17) escalationBand = 'stressed';

  const inflationScoreNudge =
    escalationBand === 'exchange_crisis'
      ? 0.092
      : escalationBand === 'ruptured'
        ? 0.059
        : escalationBand === 'stressed'
          ? 0.027
          : 0;

  const narrative =
    escalationBand === 'exchange_crisis' || escalationBand === 'ruptured'
      ? 'Tariff exchange escalation feeding CPI import-pipeline metadata.'
      : escalationBand === 'stressed'
        ? 'Import exchange latch building under depreciation stress.'
        : 'Trade tariff exchange escalation stable versus headline CPI.';

  return { escalationBand, exchangeIndex, inflationScoreNudge, narrative };
}

export function tradeTariffExchangeInflationEscalationScoreAdjustment(
  band: TradeTariffExchangeInflationEscalationBand,
): number {
  if (band === 'exchange_crisis') return 4;
  if (band === 'ruptured') return 3;
  if (band === 'stressed') return 2;
  return 0;
}
