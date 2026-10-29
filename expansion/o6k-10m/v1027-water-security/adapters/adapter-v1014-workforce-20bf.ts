/**
 * Cross-wire: V1014 workforce migration v2 (SECTION 20BF).
 */
import type { V1027WsecTurnInput, V1027WsecWorkforceBridge } from '../types/core';
import { readV1027WsecWorkforce20bfBridge } from './adapter-crosswire-hub';
import { V1027_WSEC_clamp } from '../engine/water-security-utils';

export function computeV1027WsecWorkforce20bfBridge(
  input: V1027WsecTurnInput,
  waterStressIndex: number,
): V1027WsecWorkforceBridge {
  return readV1027WsecWorkforce20bfBridge(input.workforce20bf, waterStressIndex);
}

export function applyV1027WsecWorkforce20bfReadinessOverrides<T extends { nationalReadiness?: number }>(
  base: T,
  bridge: V1027WsecWorkforceBridge,
): T {
  return {
    ...base,
    nationalReadiness: V1027_WSEC_clamp((base.nationalReadiness ?? 52) + bridge.readinessDelta, 0, 100),
  };
}
