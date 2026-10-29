/**
 * Cross-wire: V1014 energy depth (SECTION 20BC).
 */
import type { V1033ScresEnergyBridge, V1033ScresTurnInput } from '../types/core';
import { readV1033ScresEnergy20bcBridge } from './adapter-crosswire-hub';
import { V1033_SCRES_clamp } from '../engine/supply-chain-resilience-utils';

export function computeV1033ScresEnergy20bcBridge(
  input: V1033ScresTurnInput,
  logisticsStressExposureIndex: number,
): V1033ScresEnergyBridge {
  return readV1033ScresEnergy20bcBridge(input.energy20bc, logisticsStressExposureIndex);
}

export function applyV1033ScresEnergy20bcGridOverrides<T extends { gridStability?: number }>(
  base: T,
  bridge: V1033ScresEnergyBridge,
): T {
  return {
    ...base,
    gridStability: V1033_SCRES_clamp((base.gridStability ?? 55) - bridge.gridDrag * 18, 0, 100),
  };
}
