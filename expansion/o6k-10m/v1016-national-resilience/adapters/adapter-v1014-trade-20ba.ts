/**
 * Cross-wire: V1014 trade depth (SECTION 20BA).
 */
import type { V1016NresTradeBridge, V1016NresTurnInput } from '../types/core';
import { readV1016NresTrade20baBridge } from './adapter-crosswire-hub';
import { V1016_NRES_clamp } from '../engine/national-resilience-utils';

export function computeV1016NresTrade20baBridge(
  input: V1016NresTurnInput,
  shockPressure: number,
): V1016NresTradeBridge {
  return readV1016NresTrade20baBridge(input.trade20ba, shockPressure);
}

export function applyV1016NresTrade20baLaneOverrides<T extends { exportLaneStability?: number }>(
  base: T,
  bridge: V1016NresTradeBridge,
): T {
  return {
    ...base,
    exportLaneStability: V1016_NRES_clamp((base.exportLaneStability ?? 50) + bridge.laneStabilityDelta, 0, 100),
  };
}
