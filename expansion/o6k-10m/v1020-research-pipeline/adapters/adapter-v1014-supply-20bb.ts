/**
 * Cross-wire: V1014 supply chain depth (SECTION 20BB).
 */
import type { V1020RpipeTurnInput, V1020RpipeSupplyBridge } from '../types/core';
import { readV1020RpipeSupply20bbBridge } from './adapter-crosswire-hub';
import { V1020_RPIPE_clamp } from '../engine/research-pipeline-utils';

export function computeV1020RpipeSupply20bbBridge(
  input: V1020RpipeTurnInput,
  severityIndex: number,
): V1020RpipeSupplyBridge {
  return readV1020RpipeSupply20bbBridge(input.supply20bb, severityIndex);
}

export function applyV1020RpipeSupply20bbBottleneckOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1020RpipeSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1020_RPIPE_clamp((base.bottleneckPressure ?? 40) + bridge.bottleneckDelta, 0, 100),
  };
}
