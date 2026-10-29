/**
 * Cross-wire: V1014 Climate adaptation distribution network node depth (SECTION 20BR — distribution network node bridge).
 */
import type { V1027WsecTurnInput, V1027WsecSupplyBridge } from '../types/core';
import { readV1027WsecClimateAdaptation20brBridge } from './adapter-crosswire-hub';
import { V1027_WSEC_clamp } from '../engine/water-security-utils';

export function computeV1027WsecClimateAdaptation20brBridge(
  input: V1027WsecTurnInput,
  waterStressIndex: number,
): V1027WsecSupplyBridge {
  return readV1027WsecClimateAdaptation20brBridge(input.climateAdaptation20br, waterStressIndex);
}

export function applyV1027WsecClimateAdaptation20brClimateAdaptationOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1027WsecSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1027_WSEC_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.climateAdaptationDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
