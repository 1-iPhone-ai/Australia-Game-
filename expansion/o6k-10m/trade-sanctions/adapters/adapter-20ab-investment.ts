/**
 * Cross-wire adapter: SECTION 20AB (strategic capital allocation & investment climate).
 */
import type {
  V1014TradeDepthInvestmentClimateDelta,
  V1014TradeDepthTurnInput,
} from '../types/core';
import { clampTradeDepth } from '../engine/trade-depth-utils';

export function computeV1014TradeDepthInvestmentDelta(
  input: V1014TradeDepthTurnInput,
  tariffPressure: number,
  sanctionsPressure: number,
): V1014TradeDepthInvestmentClimateDelta {
  const scoreDelta = clampTradeDepth(
    -(tariffPressure * 6 + sanctionsPressure * 8) + (input.investmentClimateScore > 50 ? 0.5 : -0.5),
    -25,
    5,
  );
  const confidenceDelta = clampTradeDepth(-tariffPressure * 0.12 - sanctionsPressure * 0.08, -0.35, 0.05);
  return {
    scoreDelta,
    confidenceDelta,
    narrative: `Trade depth drag: tariffs ${tariffPressure.toFixed(2)}, sanctions ${sanctionsPressure.toFixed(2)} on climate score.`,
  };
}
