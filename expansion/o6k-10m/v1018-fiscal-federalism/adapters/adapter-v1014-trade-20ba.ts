/**
 * Cross-wire: V1014 trade depth (SECTION 20BA).
 */
import type { V1018FfedTradeBridge, V1018FfedTurnInput } from '../types/core';
import { readV1018FfedTrade20baBridge } from './adapter-crosswire-hub';
import { V1018_FFED_clamp } from '../engine/fiscal-federalism-utils';

export function computeV1018FfedTrade20baBridge(
  input: V1018FfedTurnInput,
  transferPressure: number,
): V1018FfedTradeBridge {
  return readV1018FfedTrade20baBridge(input.trade20ba, transferPressure);
}

export function applyV1018FfedTrade20baLaneOverrides<T extends { exportLaneStability?: number }>(
  base: T,
  bridge: V1018FfedTradeBridge,
): T {
  return {
    ...base,
    exportLaneStability: V1018_FFED_clamp((base.exportLaneStability ?? 50) + bridge.laneStabilityDelta, 0, 100),
  };
}
