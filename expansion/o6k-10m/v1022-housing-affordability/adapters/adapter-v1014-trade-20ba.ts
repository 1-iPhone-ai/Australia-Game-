/**
 * Cross-wire: V1014 trade depth (SECTION 20BA).
 */
import type { V1022HaffTradeBridge, V1022HaffTurnInput } from '../types/core';
import { readV1022HaffTrade20baBridge } from './adapter-crosswire-hub';
import { V1022_HAFF_clamp } from '../engine/housing-affordability-utils';

export function computeV1022HaffTrade20baBridge(
  input: V1022HaffTurnInput,
  transferBackpressure: number,
): V1022HaffTradeBridge {
  return readV1022HaffTrade20baBridge(input.trade20ba, transferBackpressure);
}

export function applyV1022HaffTrade20baLaneOverrides<T extends { exportLaneStability?: number }>(
  base: T,
  bridge: V1022HaffTradeBridge,
): T {
  return {
    ...base,
    exportLaneStability: V1022_HAFF_clamp((base.exportLaneStability ?? 50) + bridge.laneStabilityDelta, 0, 100),
  };
}
