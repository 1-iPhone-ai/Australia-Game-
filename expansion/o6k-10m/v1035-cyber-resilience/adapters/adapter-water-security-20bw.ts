/**
 * Cross-wire: V1027 critical infrastructure resilience basin depth (SECTION 20BW — supply stress bridge).
 */
import type { V1035CyresTurnInput, V1035CyresSupplyBridge } from '../types/core';
import { readV1035CyresWaterSecurity20bwBridge } from './adapter-crosswire-hub';
import { V1035_CYRES_clamp } from '../engine/cyber-resilience-utils';

export function computeV1035CyresWaterSecurity20bwBridge(
  input: V1035CyresTurnInput,
  sovereignDigitalStressExposureIndex: number,
): V1035CyresSupplyBridge {
  return readV1035CyresWaterSecurity20bwBridge(input.criticalInfrastructureResilience20ce, sovereignDigitalStressExposureIndex);
}

export function applyV1035CyresWaterSecurity20bwOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1035CyresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1035_CYRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.criticalInfrastructureResilienceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
