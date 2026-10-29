/**
 * Cross-wire: V1029 supply chain resilience depth (SECTION 20BY — sea-level / surge bridge).
 */
import type { V1034CiresTurnInput, V1034CiresSupplyBridge } from '../types/core';
import { readV1034CiresCoastalResilience20byBridge } from './adapter-crosswire-hub';
import { V1034_CIRES_clamp } from '../engine/critical-infrastructure-resilience-utils';

export function computeV1034CiresCoastalResilience20byBridge(
  input: V1034CiresTurnInput,
  cyberPhysicalStressExposureIndex: number,
): V1034CiresSupplyBridge {
  return readV1034CiresCoastalResilience20byBridge(input.supplyChainResilience20cd, cyberPhysicalStressExposureIndex);
}

export function applyV1034CiresCoastalResilience20byOverrides<T extends { bottleneckPressure?: number }>(
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
