/**
 * Cross-wire: V1029 coastal resilience depth (SECTION 20BY — sea-level / surge bridge).
 */
import type { V1030IheatTurnInput, V1030IheatSupplyBridge } from '../types/core';
import { readV1030IheatCoastalResilience20byBridge } from './adapter-crosswire-hub';
import { V1030_IHEAT_clamp } from '../engine/inland-heat-utils';

export function computeV1030IheatCoastalResilience20byBridge(
  input: V1030IheatTurnInput,
  inlandHeatExposureIndex: number,
): V1030IheatSupplyBridge {
  return readV1030IheatCoastalResilience20byBridge(input.coastalResilience20by, inlandHeatExposureIndex);
}

export function applyV1030IheatCoastalResilience20byOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1030IheatSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1030_IHEAT_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.coastalResilienceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
