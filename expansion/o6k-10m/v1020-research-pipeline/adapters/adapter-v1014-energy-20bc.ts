/**
 * Cross-wire: V1014 energy depth (SECTION 20BC).
 */
import type { V1020RpipeEnergyBridge, V1020RpipeTurnInput } from '../types/core';
import { readV1020RpipeEnergy20bcBridge } from './adapter-crosswire-hub';
import { V1020_RPIPE_clamp } from '../engine/research-pipeline-utils';

export function computeV1020RpipeEnergy20bcBridge(
  input: V1020RpipeTurnInput,
  severityIndex: number,
): V1020RpipeEnergyBridge {
  return readV1020RpipeEnergy20bcBridge(input.energy20bc, severityIndex);
}

export function applyV1020RpipeEnergy20bcGridOverrides<T extends { gridStability?: number }>(
  base: T,
  bridge: V1020RpipeEnergyBridge,
): T {
  return {
    ...base,
    gridStability: V1020_RPIPE_clamp((base.gridStability ?? 55) - bridge.gridDrag * 18, 0, 100),
  };
}
