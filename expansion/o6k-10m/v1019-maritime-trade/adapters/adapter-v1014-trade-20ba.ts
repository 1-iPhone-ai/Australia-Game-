/**
 * Cross-wire: V1014 trade depth (SECTION 20BA).
 */
import type { V1019MtrdTradeBridge, V1019MtrdTurnInput } from '../types/core';
import { readV1019MtrdTrade20baBridge } from './adapter-crosswire-hub';
import { V1019_MTRD_clamp } from '../engine/maritime-trade-utils';

export function computeV1019MtrdTrade20baBridge(
  input: V1019MtrdTurnInput,
  lanePressure: number,
): V1019MtrdTradeBridge {
  return readV1019MtrdTrade20baBridge(input.trade20ba, lanePressure);
}

export function applyV1019MtrdTrade20baLaneOverrides<T extends { exportLaneStability?: number }>(
  base: T,
  bridge: V1019MtrdTradeBridge,
): T {
  return {
    ...base,
    exportLaneStability: V1019_MTRD_clamp((base.exportLaneStability ?? 50) + bridge.laneStabilityDelta, 0, 100),
  };
}
