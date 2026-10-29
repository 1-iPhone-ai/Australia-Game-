/**
 * Cross-wire: V1027 water security basin depth (SECTION 20BW — supply stress bridge).
 */
import type { V1028DresTurnInput, V1028DresSupplyBridge } from '../types/core';
import { readV1028DresWaterSecurity20bwBridge } from './adapter-crosswire-hub';
import { V1028_DRES_clamp } from '../engine/disaster-resilience-utils';

export function computeV1028DresWaterSecurity20bwBridge(
  input: V1028DresTurnInput,
  disasterRiskIndex: number,
): V1028DresSupplyBridge {
  return readV1028DresWaterSecurity20bwBridge(input.waterSecurity20bw, disasterRiskIndex);
}

export function applyV1028DresWaterSecurity20bwOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1028DresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1028_DRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.waterSecurityDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
