/**
 * Cross-wire: V1014 trade depth (SECTION 20BA).
 */
import type { V1033ScresTradeBridge, V1033ScresTurnInput } from '../types/core';
import { readV1033ScresTrade20baBridge } from './adapter-crosswire-hub';
import { V1033_SCRES_clamp } from '../engine/supply-chain-resilience-utils';

export function computeV1033ScresTrade20baBridge(
  input: V1033ScresTurnInput,
  heatStressPressure: number,
): V1033ScresTradeBridge {
  return readV1033ScresTrade20baBridge(input.trade20ba, heatStressPressure);
}

export function applyV1033ScresTrade20baLaneOverrides<T extends { exportLaneStability?: number }>(
  base: T,
  bridge: V1033ScresTradeBridge,
): T {
  return {
    ...base,
    exportLaneStability: V1033_SCRES_clamp((base.exportLaneStability ?? 50) + bridge.laneStabilityDelta, 0, 100),
  };
}
