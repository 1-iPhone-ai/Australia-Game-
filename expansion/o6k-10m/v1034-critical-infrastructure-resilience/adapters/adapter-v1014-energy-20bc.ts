/**
 * Cross-wire: V1014 energy depth (SECTION 20BC).
 */
import type { V1034CiresEnergyBridge, V1034CiresTurnInput } from '../types/core';
import { readV1034CiresEnergy20bcBridge } from './adapter-crosswire-hub';
import { V1034_CIRES_clamp } from '../engine/critical-infrastructure-resilience-utils';

export function computeV1034CiresEnergy20bcBridge(
  input: V1034CiresTurnInput,
  cyberPhysicalStressExposureIndex: number,
): V1034CiresEnergyBridge {
  return readV1034CiresEnergy20bcBridge(input.energy20bc, cyberPhysicalStressExposureIndex);
}

export function applyV1034CiresEnergy20bcGridOverrides<T extends { gridStability?: number }>(
  base: T,
  bridge: V1034CiresEnergyBridge,
): T {
  return {
    ...base,
    gridStability: V1034_CIRES_clamp((base.gridStability ?? 55) - bridge.gridDrag * 18, 0, 100),
  };
}
