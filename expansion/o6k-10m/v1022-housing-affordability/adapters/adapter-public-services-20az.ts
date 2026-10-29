/**
 * Cross-wire: V1014 AI fidelity / handoff depth (SECTION 20AZ — handoff bridge).
 */
import type { V1022HaffTurnInput, V1022HaffSupplyBridge } from '../types/core';
import { readV1022HaffPublicServices20azBridge } from './adapter-crosswire-hub';
import { V1022_HAFF_clamp } from '../engine/housing-affordability-utils';

export function computeV1022HaffPublicServices20azBridge(
  input: V1022HaffTurnInput,
  rentStressIndex: number,
): V1022HaffSupplyBridge {
  return readV1022HaffPublicServices20azBridge(input.publicServices20az, rentStressIndex);
}

export function applyV1022HaffPublicServices20azServiceOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1022HaffSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1022_HAFF_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.serviceQueueDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
