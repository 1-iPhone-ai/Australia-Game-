/**
 * Cross-wire: V1014 supply chain depth (SECTION 20BB).
 */
import type { V1032TresTurnInput, V1032TresSupplyBridge } from '../types/core';
import { readV1032TresSupply20bbBridge } from './adapter-crosswire-hub';
import { V1032_TRES_clamp } from '../engine/telecom-resilience-utils';

export function computeV1032TresSupply20bbBridge(
  input: V1032TresTurnInput,
  telecomStressExposureIndex: number,
): V1032TresSupplyBridge {
  return readV1032TresSupply20bbBridge(input.supply20bb, telecomStressExposureIndex);
}

export function applyV1032TresSupply20bbBottleneckOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1032TresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1032_TRES_clamp((base.bottleneckPressure ?? 40) + bridge.bottleneckDelta, 0, 100),
  };
}
