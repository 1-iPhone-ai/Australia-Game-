/**
 * Cross-wire: V1014 supply chain depth (SECTION 20BB).
 */
import type { V1036IiresTurnInput, V1036IiresSupplyBridge } from '../types/core';
import { readV1036IiresSupply20bbBridge } from './adapter-crosswire-hub';
import { V1036_IIRES_clamp } from '../engine/information-integrity-resilience-utils';

export function computeV1036IiresSupply20bbBridge(
  input: V1036IiresTurnInput,
  attestationMeshStressExposureIndex: number,
): V1036IiresSupplyBridge {
  return readV1036IiresSupply20bbBridge(input.supply20bb, attestationMeshStressExposureIndex);
}

export function applyV1036IiresSupply20bbBottleneckOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1036IiresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1036_IIRES_clamp((base.bottleneckPressure ?? 40) + bridge.bottleneckDelta, 0, 100),
  };
}
