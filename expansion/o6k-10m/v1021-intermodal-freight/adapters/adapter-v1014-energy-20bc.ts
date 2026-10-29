/**
 * Cross-wire: V1014 energy depth (SECTION 20BC).
 */
import type { V1021ImfdEnergyBridge, V1021ImfdTurnInput } from '../types/core';
import { readV1021ImfdEnergy20bcBridge } from './adapter-crosswire-hub';
import { V1021_IMFD_clamp } from '../engine/intermodal-freight-utils';

export function computeV1021ImfdEnergy20bcBridge(
  input: V1021ImfdTurnInput,
  dwellPenaltyIndex: number,
): V1021ImfdEnergyBridge {
  return readV1021ImfdEnergy20bcBridge(input.energy20bc, dwellPenaltyIndex);
}

export function applyV1021ImfdEnergy20bcGridOverrides<T extends { gridStability?: number }>(
  base: T,
  bridge: V1021ImfdEnergyBridge,
): T {
  return {
    ...base,
    gridStability: V1021_IMFD_clamp((base.gridStability ?? 55) - bridge.gridDrag * 18, 0, 100),
  };
}
