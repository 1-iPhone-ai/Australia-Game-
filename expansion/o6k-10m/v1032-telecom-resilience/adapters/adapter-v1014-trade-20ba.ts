/**
 * Cross-wire: V1014 trade depth (SECTION 20BA).
 */
import type { V1032TresTradeBridge, V1032TresTurnInput } from '../types/core';
import { readV1032TresTrade20baBridge } from './adapter-crosswire-hub';
import { V1032_TRES_clamp } from '../engine/telecom-resilience-utils';

export function computeV1032TresTrade20baBridge(
  input: V1032TresTurnInput,
  heatStressPressure: number,
): V1032TresTradeBridge {
  return readV1032TresTrade20baBridge(input.trade20ba, heatStressPressure);
}

export function applyV1032TresTrade20baLaneOverrides<T extends { exportLaneStability?: number }>(
  base: T,
  bridge: V1032TresTradeBridge,
): T {
  return {
    ...base,
    exportLaneStability: V1032_TRES_clamp((base.exportLaneStability ?? 50) + bridge.laneStabilityDelta, 0, 100),
  };
}
