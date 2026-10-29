/**
 * Cross-wire: V1014 supply chain depth (SECTION 20BB).
 */
import type { V1034CiresTurnInput, V1034CiresSupplyBridge } from '../types/core';
import { readV1034CiresSupply20bbBridge } from './adapter-crosswire-hub';
import { V1034_CIRES_clamp } from '../engine/critical-infrastructure-resilience-utils';

export function computeV1034CiresSupply20bbBridge(
  input: V1034CiresTurnInput,
  cyberPhysicalStressExposureIndex: number,
): V1034CiresSupplyBridge {
  return readV1034CiresSupply20bbBridge(input.supply20bb, cyberPhysicalStressExposureIndex);
}

export function applyV1034CiresSupply20bbBottleneckOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1034CiresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1034_CIRES_clamp((base.bottleneckPressure ?? 40) + bridge.bottleneckDelta, 0, 100),
  };
}
