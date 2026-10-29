/**
 * Cross-wire: V1014 supply chain depth (SECTION 20BB).
 */
import type { V1025BioTurnInput, V1025BioSupplyBridge } from '../types/core';
import { readV1025BioSupply20bbBridge } from './adapter-crosswire-hub';
import { V1025_BIO_clamp } from '../engine/biodiversity-stewardship-utils';

export function computeV1025BioSupply20bbBridge(
  input: V1025BioTurnInput,
  ecosystemStressIndex: number,
): V1025BioSupplyBridge {
  return readV1025BioSupply20bbBridge(input.supply20bb, ecosystemStressIndex);
}

export function applyV1025BioSupply20bbBottleneckOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1025BioSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1025_BIO_clamp((base.bottleneckPressure ?? 40) + bridge.bottleneckDelta, 0, 100),
  };
}
