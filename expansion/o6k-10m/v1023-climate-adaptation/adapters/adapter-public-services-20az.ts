/**
 * Cross-wire: V1014 AI fidelity / handoff depth (SECTION 20AZ — handoff bridge).
 */
import type { V1023CladTurnInput, V1023CladSupplyBridge } from '../types/core';
import { readV1023CladPublicServices20azBridge } from './adapter-crosswire-hub';
import { V1023_CLAD_clamp } from '../engine/climate-adaptation-utils';

export function computeV1023CladPublicServices20azBridge(
  input: V1023CladTurnInput,
  heatStressIndex: number,
): V1023CladSupplyBridge {
  return readV1023CladPublicServices20azBridge(input.publicServices20az, heatStressIndex);
}

export function applyV1023CladPublicServices20azServiceOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1023CladSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1023_CLAD_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.serviceQueueDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
