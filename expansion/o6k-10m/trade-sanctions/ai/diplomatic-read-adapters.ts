/**
 * AI diplomatic persona read adapters — trade state → briefing strings (GI3 / ACC hooks).
 */
import type {
  V1014TradeDepthDiplomacyReadSlice,
  V1014TradeDepthTurnInput,
} from '../types/core';
import { v1014TradeDepthDiplomaticRetaliationHint } from '../adapters/adapter-20h-diplomacy';

export function buildV1014TradeDepthAiBriefing(
  input: V1014TradeDepthTurnInput,
  diplomacy: V1014TradeDepthDiplomacyReadSlice,
  preview: { tariff: number; sanctions: number },
): string {
  const dnHint = v1014TradeDepthDiplomaticRetaliationHint(diplomacy, preview.tariff);
  const lines = [
    `Turn ${input.turn}: trade depth briefing.`,
    `Trust ${diplomacy.trustAggregate}; active deals ~${diplomacy.activeDealCount}.`,
    `Tariff pressure ${preview.tariff.toFixed(2)}; sanctions ${preview.sanctions.toFixed(2)}.`,
    `Fiscal band ${input.fiscalPressureBand}; household sentiment ${input.householdSentiment.toFixed(2)}.`,
    dnHint,
  ];
  return lines.join(' ');
}

export function buildV1014TradeDepthGi3FactBundle(stateSummary: string): Record<string, string> {
  return {
    trade_depth_state: stateSummary.slice(0, 500),
    trade_depth_schema: '10.14.trade_depth.1',
  };
}

export const V1014_TRADE_DEPTH_AI_PERSONA_WEIGHTS = {
  economic: { tariff: 1.2, sanctions: 0.9, capital: 1.1 },
  aggressive: { tariff: 0.8, sanctions: 1.3, capital: 0.7 },
  cooperative: { tariff: 1.0, sanctions: 0.6, capital: 1.0 },
  balanced: { tariff: 1.0, sanctions: 1.0, capital: 1.0 },
} as const;

export function scoreV1014TradeDepthPersonaResponse(
  persona: keyof typeof V1014_TRADE_DEPTH_AI_PERSONA_WEIGHTS,
  tariff: number,
  sanctions: number,
  capital: number,
): number {
  const w = V1014_TRADE_DEPTH_AI_PERSONA_WEIGHTS[persona];
  return tariff * w.tariff + sanctions * w.sanctions + capital * w.capital;
}
