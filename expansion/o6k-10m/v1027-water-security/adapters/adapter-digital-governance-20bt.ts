/**
 * Cross-wire: V1024 digital governance distribution network depth (SECTION 20BT — e-health & data governance bridge).
 */
import type { V1027WsecTurnInput, V1027WsecSupplyBridge } from '../types/core';
import { readV1027WsecDigitalGovernance20btBridge } from './adapter-crosswire-hub';
import { V1027_WSEC_clamp } from '../engine/water-security-utils';

export function computeV1027WsecDigitalGovernance20btBridge(
  input: V1027WsecTurnInput,
  waterStressIndex: number,
): V1027WsecSupplyBridge {
  return readV1027WsecDigitalGovernance20btBridge(input.digitalGovernance20bt, waterStressIndex);
}

export function applyV1027WsecDigitalGovernance20btDigitalGovernanceOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1027WsecSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1027_WSEC_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.digitalGovernanceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
