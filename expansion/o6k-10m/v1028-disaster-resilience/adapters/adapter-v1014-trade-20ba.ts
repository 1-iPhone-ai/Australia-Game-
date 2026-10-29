/**
 * Cross-wire: V1014 trade depth (SECTION 20BA).
 */
import type { V1028DresTradeBridge, V1028DresTurnInput } from '../types/core';
import { readV1028DresTrade20baBridge } from './adapter-crosswire-hub';
import { V1028_DRES_clamp } from '../engine/disaster-resilience-utils';

export function computeV1028DresTrade20baBridge(
  input: V1028DresTurnInput,
  heatStressPressure: number,
): V1028DresTradeBridge {
  return readV1028DresTrade20baBridge(input.trade20ba, heatStressPressure);
}

export function applyV1028DresTrade20baLaneOverrides<T extends { exportLaneStability?: number }>(
  base: T,
  bridge: V1028DresTradeBridge,
): T {
  return {
    ...base,
    exportLaneStability: V1028_DRES_clamp((base.exportLaneStability ?? 50) + bridge.laneStabilityDelta, 0, 100),
  };
}
