/**
 * Cross-wire: V1014 energy depth (SECTION 20BC).
 */
import type { V1030IheatEnergyBridge, V1030IheatTurnInput } from '../types/core';
import { readV1030IheatEnergy20bcBridge } from './adapter-crosswire-hub';
import { V1030_IHEAT_clamp } from '../engine/inland-heat-utils';

export function computeV1030IheatEnergy20bcBridge(
  input: V1030IheatTurnInput,
  inlandHeatExposureIndex: number,
): V1030IheatEnergyBridge {
  return readV1030IheatEnergy20bcBridge(input.energy20bc, inlandHeatExposureIndex);
}

export function applyV1030IheatEnergy20bcGridOverrides<T extends { gridStability?: number }>(
  base: T,
  bridge: V1030IheatEnergyBridge,
): T {
  return {
    ...base,
    gridStability: V1030_IHEAT_clamp((base.gridStability ?? 55) - bridge.gridDrag * 18, 0, 100),
  };
}
