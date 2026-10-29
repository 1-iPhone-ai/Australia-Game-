/**
 * Cross-wire: V1014 trade depth (SECTION 20BA).
 */
import type { V1024DgovTradeBridge, V1024DgovTurnInput } from '../types/core';
import { readV1024DgovTrade20baBridge } from './adapter-crosswire-hub';
import { V1024_DGOV_clamp } from '../engine/digital-governance-utils';

export function computeV1024DgovTrade20baBridge(
  input: V1024DgovTurnInput,
  modelGovernancePressure: number,
): V1024DgovTradeBridge {
  return readV1024DgovTrade20baBridge(input.trade20ba, modelGovernancePressure);
}

export function applyV1024DgovTrade20baLaneOverrides<T extends { exportLaneStability?: number }>(
  base: T,
  bridge: V1024DgovTradeBridge,
): T {
  return {
    ...base,
    exportLaneStability: V1024_DGOV_clamp((base.exportLaneStability ?? 50) + bridge.laneStabilityDelta, 0, 100),
  };
}
