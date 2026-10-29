/**
 * Cross-wire: V1027 supply chain resilience basin depth (SECTION 20BW — supply stress bridge).
 */
import type { V1034CiresTurnInput, V1034CiresSupplyBridge } from '../types/core';
import { readV1034CiresWaterSecurity20bwBridge } from './adapter-crosswire-hub';
import { V1034_CIRES_clamp } from '../engine/critical-infrastructure-resilience-utils';

export function computeV1034CiresWaterSecurity20bwBridge(
  input: V1034CiresTurnInput,
  cyberPhysicalStressExposureIndex: number,
): V1034CiresSupplyBridge {
  return readV1034CiresWaterSecurity20bwBridge(input.supplyChainResilience20cd, cyberPhysicalStressExposureIndex);
}

export function applyV1034CiresWaterSecurity20bwOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1034CiresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1034_CIRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.supplyChainResilienceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
