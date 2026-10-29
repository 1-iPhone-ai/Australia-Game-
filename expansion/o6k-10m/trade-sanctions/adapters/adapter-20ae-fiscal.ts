/**
 * Cross-wire adapter: SECTION 20AE (public finance / fiscal capacity).
 */
import type { V1014TradeDepthFiscalStressBridge, V1014TradeDepthTurnInput } from '../types/core';
import { clampTradeDepth } from '../engine/trade-depth-utils';

export function computeV1014TradeDepthFiscalBridge(
  input: V1014TradeDepthTurnInput,
  tariffPressure: number,
  sanctionsPressure: number,
): V1014TradeDepthFiscalStressBridge {
  const bandMul =
    input.fiscalPressureBand === 'critical'
      ? 1.35
      : input.fiscalPressureBand === 'stressed'
        ? 1.15
        : input.fiscalPressureBand === 'tight'
          ? 1.05
          : 1;
  const revenueDrag = clampTradeDepth((tariffPressure * 0.04 + sanctionsPressure * 0.03) * bandMul, 0, 0.25);
  const expenditurePressure = clampTradeDepth((tariffPressure * 0.02 + sanctionsPressure * 0.05) * bandMul, 0, 0.2);
  const headroomDelta = clampTradeDepth(-(revenueDrag + expenditurePressure) * 100, -30, 0);
  return { revenueDrag, expenditurePressure, headroomDelta };
}
