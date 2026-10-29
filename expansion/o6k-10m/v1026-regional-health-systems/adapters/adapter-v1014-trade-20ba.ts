/**
 * Cross-wire: V1014 trade depth (SECTION 20BA).
 */
import type { V1026RhsTradeBridge, V1026RhsTurnInput } from '../types/core';
import { readV1026RhsTrade20baBridge } from './adapter-crosswire-hub';
import { V1026_RHS_clamp } from '../engine/regional-health-systems-utils';

export function computeV1026RhsTrade20baBridge(
  input: V1026RhsTurnInput,
  heatStressPressure: number,
): V1026RhsTradeBridge {
  return readV1026RhsTrade20baBridge(input.trade20ba, heatStressPressure);
}

export function applyV1026RhsTrade20baLaneOverrides<T extends { exportLaneStability?: number }>(
  base: T,
  bridge: V1026RhsTradeBridge,
): T {
  return {
    ...base,
    exportLaneStability: V1026_RHS_clamp((base.exportLaneStability ?? 50) + bridge.laneStabilityDelta, 0, 100),
  };
}
