/**
 * Cross-wire: V1014 trade depth (SECTION 20BA).
 */
import type { V1036IiresTradeBridge, V1036IiresTurnInput } from '../types/core';
import { readV1036IiresTrade20baBridge } from './adapter-crosswire-hub';
import { V1036_IIRES_clamp } from '../engine/information-integrity-resilience-utils';

export function computeV1036IiresTrade20baBridge(
  input: V1036IiresTurnInput,
  heatStressPressure: number,
): V1036IiresTradeBridge {
  return readV1036IiresTrade20baBridge(input.trade20ba, heatStressPressure);
}

export function applyV1036IiresTrade20baLaneOverrides<T extends { exportLaneStability?: number }>(
  base: T,
  bridge: V1036IiresTradeBridge,
): T {
  return {
    ...base,
    exportLaneStability: V1036_IIRES_clamp((base.exportLaneStability ?? 50) + bridge.laneStabilityDelta, 0, 100),
  };
}
