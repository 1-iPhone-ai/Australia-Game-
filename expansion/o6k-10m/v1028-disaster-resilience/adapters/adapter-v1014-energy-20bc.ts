/**
 * Cross-wire: V1014 energy depth (SECTION 20BC).
 */
import type { V1028DresEnergyBridge, V1028DresTurnInput } from '../types/core';
import { readV1028DresEnergy20bcBridge } from './adapter-crosswire-hub';
import { V1028_DRES_clamp } from '../engine/disaster-resilience-utils';

export function computeV1028DresEnergy20bcBridge(
  input: V1028DresTurnInput,
  disasterRiskIndex: number,
): V1028DresEnergyBridge {
  return readV1028DresEnergy20bcBridge(input.energy20bc, disasterRiskIndex);
}

export function applyV1028DresEnergy20bcGridOverrides<T extends { gridStability?: number }>(
  base: T,
  bridge: V1028DresEnergyBridge,
): T {
  return {
    ...base,
    gridStability: V1028_DRES_clamp((base.gridStability ?? 55) - bridge.gridDrag * 18, 0, 100),
  };
}
