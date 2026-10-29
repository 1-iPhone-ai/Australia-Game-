/**
 * Cross-wire: V1014 trade depth (SECTION 20BA).
 */
import type { V1029CresTradeBridge, V1029CresTurnInput } from '../types/core';
import { readV1029CresTrade20baBridge } from './adapter-crosswire-hub';
import { V1029_CRES_clamp } from '../engine/coastal-resilience-utils';

export function computeV1029CresTrade20baBridge(
  input: V1029CresTurnInput,
  heatStressPressure: number,
): V1029CresTradeBridge {
  return readV1029CresTrade20baBridge(input.trade20ba, heatStressPressure);
}

export function applyV1029CresTrade20baLaneOverrides<T extends { exportLaneStability?: number }>(
  base: T,
  bridge: V1029CresTradeBridge,
): T {
  return {
    ...base,
    exportLaneStability: V1029_CRES_clamp((base.exportLaneStability ?? 50) + bridge.laneStabilityDelta, 0, 100),
  };
}
