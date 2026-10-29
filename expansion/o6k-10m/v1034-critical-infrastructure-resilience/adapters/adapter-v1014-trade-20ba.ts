/**
 * Cross-wire: V1014 trade depth (SECTION 20BA).
 */
import type { V1034CiresTradeBridge, V1034CiresTurnInput } from '../types/core';
import { readV1034CiresTrade20baBridge } from './adapter-crosswire-hub';
import { V1034_CIRES_clamp } from '../engine/critical-infrastructure-resilience-utils';

export function computeV1034CiresTrade20baBridge(
  input: V1034CiresTurnInput,
  heatStressPressure: number,
): V1034CiresTradeBridge {
  return readV1034CiresTrade20baBridge(input.trade20ba, heatStressPressure);
}

export function applyV1034CiresTrade20baLaneOverrides<T extends { exportLaneStability?: number }>(
  base: T,
  bridge: V1034CiresTradeBridge,
): T {
  return {
    ...base,
    exportLaneStability: V1034_CIRES_clamp((base.exportLaneStability ?? 50) + bridge.laneStabilityDelta, 0, 100),
  };
}
