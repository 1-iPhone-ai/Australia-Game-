/**
 * Cross-wire: V1014 supply chain depth (SECTION 20BB).
 */
import type { V1035CyresTurnInput, V1035CyresSupplyBridge } from '../types/core';
import { readV1035CyresSupply20bbBridge } from './adapter-crosswire-hub';
import { V1035_CYRES_clamp } from '../engine/cyber-resilience-utils';

export function computeV1035CyresSupply20bbBridge(
  input: V1035CyresTurnInput,
  sovereignDigitalStressExposureIndex: number,
): V1035CyresSupplyBridge {
  return readV1035CyresSupply20bbBridge(input.supply20bb, sovereignDigitalStressExposureIndex);
}

export function applyV1035CyresSupply20bbBottleneckOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1035CyresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1035_CYRES_clamp((base.bottleneckPressure ?? 40) + bridge.bottleneckDelta, 0, 100),
  };
}
