/**
 * Cross-wire adapter: SECTION 20AT (GTEL / global trade economy).
 */
import type { V1014TradeDepthGtelReadSlice, V1014TradeDepthTurnInput } from '../types/core';
import { clampTradeDepth, tradeDepthAccessRank } from '../engine/trade-depth-utils';

export function applyV1014TradeDepthGtelBridge(
  input: V1014TradeDepthTurnInput,
  tariffPressure: number,
): V1014TradeDepthGtelReadSlice {
  const rank = tradeDepthAccessRank(input.gtelAccessBand);
  const downgrades =
    tariffPressure > 0.55 ? 2 : tariffPressure > 0.35 ? 1 : tariffPressure > 0.2 ? 0 : 0;
  const effectiveRank = clampTradeDepth(rank - downgrades, 0, 4);
  const bands = ['blocked', 'restricted', 'normal', 'preferred', 'strategic'] as const;
  const accessBand = bands[effectiveRank];

  return {
    accessBand,
    exportThroughput: clampTradeDepth(1 - tariffPressure * 0.65, 0.05, 1),
    partnerAccess: {
      asia_pacific: accessBand,
      europe: tariffPressure > 0.4 ? 'restricted' : input.gtelAccessBand,
      north_america: input.gtelAccessBand,
    },
  };
}

export function v1014TradeDepthToGtelPartnerModifier(tariffPressure: number): number {
  return clampTradeDepth(1 - tariffPressure * 0.5, 0.2, 1.15);
}
