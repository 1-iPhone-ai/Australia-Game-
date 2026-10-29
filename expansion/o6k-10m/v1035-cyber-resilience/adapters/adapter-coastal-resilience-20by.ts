/**
 * Cross-wire: V1029 critical infrastructure resilience depth (SECTION 20BY — sea-level / surge bridge).
 */
import type { V1035CyresTurnInput, V1035CyresSupplyBridge } from '../types/core';
import { readV1035CyresCoastalResilience20byBridge } from './adapter-crosswire-hub';
import { V1035_CYRES_clamp } from '../engine/cyber-resilience-utils';

export function computeV1035CyresCoastalResilience20byBridge(
  input: V1035CyresTurnInput,
  sovereignDigitalStressExposureIndex: number,
): V1035CyresSupplyBridge {
  return readV1035CyresCoastalResilience20byBridge(input.criticalInfrastructureResilience20ce, sovereignDigitalStressExposureIndex);
}

export function applyV1035CyresCoastalResilience20byOverrides<T extends { bottleneckPressure?: number }>(
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
