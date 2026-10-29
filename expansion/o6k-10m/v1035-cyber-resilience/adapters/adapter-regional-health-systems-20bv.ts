/**
 * Cross-wire: V1025 regional health systems catchment depth (SECTION 20BV — basin integrity bridge).
 */
import type { V1035CyresTurnInput, V1035CyresSupplyBridge } from '../types/core';
import { readV1035CyresBiodiversityStewardship20buBridge } from './adapter-crosswire-hub';
import { V1035_CYRES_clamp } from '../engine/cyber-resilience-utils';

export function computeV1035CyresBiodiversityStewardship20buBridge(
  input: V1035CyresTurnInput,
  sovereignDigitalStressExposureIndex: number,
): V1035CyresSupplyBridge {
  return readV1035CyresBiodiversityStewardship20buBridge(input.regionalHealthSystems20bv, sovereignDigitalStressExposureIndex);
}

export function applyV1035CyresBiodiversityStewardship20buOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1035CyresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1035_CYRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.regionalHealthDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
