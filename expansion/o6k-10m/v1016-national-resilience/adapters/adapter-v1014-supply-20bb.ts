/**
 * Cross-wire: V1014 supply chain depth (SECTION 20BB).
 */
import type { V1016NresTurnInput, V1016NresSupplyBridge } from '../types/core';
import { readV1016NresSupply20bbBridge } from './adapter-crosswire-hub';
import { V1016_NRES_clamp } from '../engine/national-resilience-utils';

export function computeV1016NresSupply20bbBridge(
  input: V1016NresTurnInput,
  severityIndex: number,
): V1016NresSupplyBridge {
  return readV1016NresSupply20bbBridge(input.supply20bb, severityIndex);
}

export function applyV1016NresSupply20bbBottleneckOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1016NresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1016_NRES_clamp((base.bottleneckPressure ?? 40) + bridge.bottleneckDelta, 0, 100),
  };
}
