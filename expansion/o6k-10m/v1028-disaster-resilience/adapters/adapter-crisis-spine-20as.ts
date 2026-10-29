/**
 * Cross-wire: SECTION 20AS crisis spine — national coordination under compound hazards.
 */
import type { V1028DresTurnInput, V1028DresSupplyBridge } from '../types/core';
import { readV1028DresCrisisSpine20asBridge } from './adapter-crosswire-hub';
import { V1028_DRES_clamp } from '../engine/disaster-resilience-utils';

export function computeV1028DresCrisisSpine20asBridge(
  input: V1028DresTurnInput,
  disasterRiskIndex: number,
): V1028DresSupplyBridge {
  return readV1028DresCrisisSpine20asBridge(input.crisisSpine20as, disasterRiskIndex);
}

export function applyV1028DresCrisisSpine20asOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1028DresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1028_DRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.crisisSpineDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
