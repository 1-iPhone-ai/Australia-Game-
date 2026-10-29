/**
 * Cross-wire: V1014 fiscal federalism zoning friction node depth (SECTION 20BJ — zoning friction node bridge).
 */
import type { V1022HaffTurnInput, V1022HaffSupplyBridge } from '../types/core';
import { readV1022HaffFiscalFederalism20bjBridge } from './adapter-crosswire-hub';
import { V1022_HAFF_clamp } from '../engine/housing-affordability-utils';

export function computeV1022HaffFiscalFederalism20bjBridge(
  input: V1022HaffTurnInput,
  rentStressIndex: number,
): V1022HaffSupplyBridge {
  return readV1022HaffFiscalFederalism20bjBridge(input.fiscalFederalism20bj, rentStressIndex);
}

export function applyV1022HaffFiscalFederalism20bjZoningOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1022HaffSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1022_HAFF_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.fiscalTransferDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
