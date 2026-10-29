/**
 * Cross-wire: V1014 Climate adaptation / handoff depth (SECTION 20AZ — handoff bridge).
 */
import type { V1025BioTurnInput, V1025BioSupplyBridge } from '../types/core';
import { readV1025BioPublicServices20azBridge } from './adapter-crosswire-hub';
import { V1025_BIO_clamp } from '../engine/biodiversity-stewardship-utils';

export function computeV1025BioPublicServices20azBridge(
  input: V1025BioTurnInput,
  ecosystemStressIndex: number,
): V1025BioSupplyBridge {
  return readV1025BioPublicServices20azBridge(input.publicServices20az, ecosystemStressIndex);
}

export function applyV1025BioPublicServices20azServiceOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1025BioSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1025_BIO_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.serviceQueueDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
