/**
 * Cross-wire: V1014 AI fidelity / handoff depth (SECTION 20AZ — handoff bridge).
 */
import type { V1024DgovTurnInput, V1024DgovSupplyBridge } from '../types/core';
import { readV1024DgovPublicServices20azBridge } from './adapter-crosswire-hub';
import { V1024_DGOV_clamp } from '../engine/digital-governance-utils';

export function computeV1024DgovPublicServices20azBridge(
  input: V1024DgovTurnInput,
  complianceStressIndex: number,
): V1024DgovSupplyBridge {
  return readV1024DgovPublicServices20azBridge(input.publicServices20az, complianceStressIndex);
}

export function applyV1024DgovPublicServices20azServiceOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1024DgovSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1024_DGOV_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.serviceQueueDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
