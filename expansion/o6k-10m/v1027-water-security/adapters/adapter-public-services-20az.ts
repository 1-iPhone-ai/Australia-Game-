/**
 * Cross-wire: V1014 Climate adaptation / handoff depth (SECTION 20AZ — handoff bridge).
 */
import type { V1027WsecTurnInput, V1027WsecSupplyBridge } from '../types/core';
import { readV1027WsecPublicServices20azBridge } from './adapter-crosswire-hub';
import { V1027_WSEC_clamp } from '../engine/water-security-utils';

export function computeV1027WsecPublicServices20azBridge(
  input: V1027WsecTurnInput,
  waterStressIndex: number,
): V1027WsecSupplyBridge {
  return readV1027WsecPublicServices20azBridge(input.publicServices20az, waterStressIndex);
}

export function applyV1027WsecPublicServices20azServiceOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1027WsecSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1027_WSEC_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.serviceQueueDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
