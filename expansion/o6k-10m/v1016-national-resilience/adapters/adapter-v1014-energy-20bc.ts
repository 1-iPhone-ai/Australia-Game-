/**
 * Cross-wire: V1014 energy depth (SECTION 20BC).
 */
import type { V1016NresEnergyBridge, V1016NresTurnInput } from '../types/core';
import { readV1016NresEnergy20bcBridge } from './adapter-crosswire-hub';
import { V1016_NRES_clamp } from '../engine/national-resilience-utils';

export function computeV1016NresEnergy20bcBridge(
  input: V1016NresTurnInput,
  severityIndex: number,
): V1016NresEnergyBridge {
  return readV1016NresEnergy20bcBridge(input.energy20bc, severityIndex);
}

export function applyV1016NresEnergy20bcGridOverrides<T extends { gridStability?: number }>(
  base: T,
  bridge: V1016NresEnergyBridge,
): T {
  return {
    ...base,
    gridStability: V1016_NRES_clamp((base.gridStability ?? 55) - bridge.gridDrag * 18, 0, 100),
  };
}
