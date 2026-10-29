/**
 * Cross-wire: V1025 regional health systems catchment depth (SECTION 20BV — basin integrity bridge).
 */
import type { V1030IheatTurnInput, V1030IheatSupplyBridge } from '../types/core';
import { readV1030IheatBiodiversityStewardship20buBridge } from './adapter-crosswire-hub';
import { V1030_IHEAT_clamp } from '../engine/inland-heat-utils';

export function computeV1030IheatBiodiversityStewardship20buBridge(
  input: V1030IheatTurnInput,
  inlandHeatExposureIndex: number,
): V1030IheatSupplyBridge {
  return readV1030IheatBiodiversityStewardship20buBridge(input.regionalHealthSystems20bv, inlandHeatExposureIndex);
}

export function applyV1030IheatBiodiversityStewardship20buOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1030IheatSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1030_IHEAT_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.regionalHealthDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
