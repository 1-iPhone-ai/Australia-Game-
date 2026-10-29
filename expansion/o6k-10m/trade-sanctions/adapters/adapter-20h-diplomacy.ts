/**
 * Cross-wire adapter: SECTION 20H (diplomacy & negotiation 2.0).
 */
import type {
  V1014TradeDepthDiplomacyReadSlice,
  V1014TradeDepthTurnInput,
} from '../types/core';
import { clampTradeDepth } from '../engine/trade-depth-utils';

export function readV1014TradeDepthDiplomacySlice(
  input: V1014TradeDepthTurnInput,
): V1014TradeDepthDiplomacyReadSlice {
  const violated = input.counterpartySanctionsActive ? 1 : 0;
  const activeDealCount = clampTradeDepth(Math.round(input.diplomacyTrust / 15), 0, 8);
  return {
    activeDealCount,
    violatedDeals: violated,
    trustAggregate: input.diplomacyTrust,
    recentEvents: [
      input.counterpartySanctionsActive ? 'counterparty_sanctions_flagged' : 'trade_talks_stable',
      `deficit_index_${input.tradeDeficitIndex.toFixed(2)}`,
    ],
  };
}

export function v1014TradeDepthDiplomaticRetaliationHint(
  slice: V1014TradeDepthDiplomacyReadSlice,
  tariffPressure: number,
): string {
  if (slice.violatedDeals > 0 && tariffPressure > 0.3) {
    return 'DN evaluator should weight counter offers +18% due to active trade retaliation window.';
  }
  if (slice.trustAggregate < 40) return 'DN trust band low — prefer delay / counter over accept on tariff-linked deals.';
  return 'DN trade linkage neutral.';
}
