/**
 * Cross-wire: V1025 regional health systems catchment depth (SECTION 20BV — basin integrity bridge).
 */
import type { V1032TresTurnInput, V1032TresSupplyBridge } from '../types/core';
import { readV1032TresBiodiversityStewardship20buBridge } from './adapter-crosswire-hub';
import { V1032_TRES_clamp } from '../engine/telecom-resilience-utils';

export function computeV1032TresBiodiversityStewardship20buBridge(
  input: V1032TresTurnInput,
  telecomStressExposureIndex: number,
): V1032TresSupplyBridge {
  return readV1032TresBiodiversityStewardship20buBridge(input.regionalHealthSystems20bv, telecomStressExposureIndex);
}

export function applyV1032TresBiodiversityStewardship20buOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1032TresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1032_TRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.regionalHealthDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
