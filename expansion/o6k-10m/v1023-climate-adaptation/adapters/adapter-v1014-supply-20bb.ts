/**
 * Cross-wire: V1014 supply chain depth (SECTION 20BB).
 */
import type { V1023CladTurnInput, V1023CladSupplyBridge } from '../types/core';
import { readV1023CladSupply20bbBridge } from './adapter-crosswire-hub';
import { V1023_CLAD_clamp } from '../engine/climate-adaptation-utils';

export function computeV1023CladSupply20bbBridge(
  input: V1023CladTurnInput,
  heatStressIndex: number,
): V1023CladSupplyBridge {
  return readV1023CladSupply20bbBridge(input.supply20bb, heatStressIndex);
}

export function applyV1023CladSupply20bbBottleneckOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1023CladSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1023_CLAD_clamp((base.bottleneckPressure ?? 40) + bridge.bottleneckDelta, 0, 100),
  };
}
