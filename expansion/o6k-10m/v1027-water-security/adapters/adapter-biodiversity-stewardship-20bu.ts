/**
 * Cross-wire: V1025 biodiversity stewardship catchment depth (SECTION 20BU — basin integrity bridge).
 */
import type { V1027WsecTurnInput, V1027WsecSupplyBridge } from '../types/core';
import { readV1027WsecBiodiversityStewardship20buBridge } from './adapter-crosswire-hub';
import { V1027_WSEC_clamp } from '../engine/water-security-utils';

export function computeV1027WsecBiodiversityStewardship20buBridge(
  input: V1027WsecTurnInput,
  waterStressIndex: number,
): V1027WsecSupplyBridge {
  return readV1027WsecBiodiversityStewardship20buBridge(input.biodiversityStewardship20bu, waterStressIndex);
}

export function applyV1027WsecBiodiversityStewardship20buOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1027WsecSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1027_WSEC_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.biodiversityStewardshipDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
