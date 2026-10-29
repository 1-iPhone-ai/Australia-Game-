/**
 * Cross-wire: V1014 trade depth (SECTION 20BA).
 */
import type { V1030IheatTradeBridge, V1030IheatTurnInput } from '../types/core';
import { readV1030IheatTrade20baBridge } from './adapter-crosswire-hub';
import { V1030_IHEAT_clamp } from '../engine/inland-heat-utils';

export function computeV1030IheatTrade20baBridge(
  input: V1030IheatTurnInput,
  heatStressPressure: number,
): V1030IheatTradeBridge {
  return readV1030IheatTrade20baBridge(input.trade20ba, heatStressPressure);
}

export function applyV1030IheatTrade20baLaneOverrides<T extends { exportLaneStability?: number }>(
  base: T,
  bridge: V1030IheatTradeBridge,
): T {
  return {
    ...base,
    exportLaneStability: V1030_IHEAT_clamp((base.exportLaneStability ?? 50) + bridge.laneStabilityDelta, 0, 100),
  };
}
