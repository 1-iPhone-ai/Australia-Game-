/**
 * Cross-wire: V1014 trade depth (SECTION 20BA).
 */
import type { V1035CyresTradeBridge, V1035CyresTurnInput } from '../types/core';
import { readV1035CyresTrade20baBridge } from './adapter-crosswire-hub';
import { V1035_CYRES_clamp } from '../engine/cyber-resilience-utils';

export function computeV1035CyresTrade20baBridge(
  input: V1035CyresTurnInput,
  heatStressPressure: number,
): V1035CyresTradeBridge {
  return readV1035CyresTrade20baBridge(input.trade20ba, heatStressPressure);
}

export function applyV1035CyresTrade20baLaneOverrides<T extends { exportLaneStability?: number }>(
  base: T,
  bridge: V1035CyresTradeBridge,
): T {
  return {
    ...base,
    exportLaneStability: V1035_CYRES_clamp((base.exportLaneStability ?? 50) + bridge.laneStabilityDelta, 0, 100),
  };
}
