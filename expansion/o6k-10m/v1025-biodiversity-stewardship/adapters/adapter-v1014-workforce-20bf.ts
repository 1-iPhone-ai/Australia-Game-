/**
 * Cross-wire: V1014 workforce migration v2 (SECTION 20BF).
 */
import type { V1025BioTurnInput, V1025BioWorkforceBridge } from '../types/core';
import { readV1025BioWorkforce20bfBridge } from './adapter-crosswire-hub';
import { V1025_BIO_clamp } from '../engine/biodiversity-stewardship-utils';

export function computeV1025BioWorkforce20bfBridge(
  input: V1025BioTurnInput,
  ecosystemStressIndex: number,
): V1025BioWorkforceBridge {
  return readV1025BioWorkforce20bfBridge(input.workforce20bf, ecosystemStressIndex);
}

export function applyV1025BioWorkforce20bfReadinessOverrides<T extends { nationalReadiness?: number }>(
  base: T,
  bridge: V1025BioWorkforceBridge,
): T {
  return {
    ...base,
    nationalReadiness: V1025_BIO_clamp((base.nationalReadiness ?? 52) + bridge.readinessDelta, 0, 100),
  };
}
