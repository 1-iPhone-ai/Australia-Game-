/**
 * Cross-wire: V1030 critical infrastructure resilience depth (SECTION 20BZ — heatwave / arid-buffer bridge).
 */
import type { V1035CyresTurnInput, V1035CyresSupplyBridge } from '../types/core';
import { readV1035CyresInlandHeat20bzBridge } from './adapter-crosswire-hub';
import { V1035_CYRES_clamp } from '../engine/cyber-resilience-utils';

export function computeV1035CyresInlandHeat20bzBridge(
  input: V1035CyresTurnInput,
  sovereignDigitalStressExposureIndex: number,
): V1035CyresSupplyBridge {
  return readV1035CyresInlandHeat20bzBridge(input.criticalInfrastructureResilience20ce, sovereignDigitalStressExposureIndex);
}

export function applyV1035CyresInlandHeat20bzOverrides<T extends { bottleneckPressure?: number }>(
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
