/**
 * Cross-wire: V1014 AI fidelity / commercialization depth (SECTION 20BE — commercialization bridge).
 */
import type { V1020RpipeTurnInput, V1020RpipeSupplyBridge } from '../types/core';
import { readV1020RpipeCommercialization20beBridge } from './adapter-crosswire-hub';
import { V1020_RPIPE_clamp } from '../engine/research-pipeline-utils';

export function computeV1020RpipeCommercialization20beBridge(
  input: V1020RpipeTurnInput,
  severityIndex: number,
): V1020RpipeSupplyBridge {
  return readV1020RpipeCommercialization20beBridge(input.aiFidelity20be, severityIndex);
}

export function applyV1020RpipeCommercialization20beCommercializationOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1020RpipeSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1020_RPIPE_clamp((base.bottleneckPressure ?? 40) + bridge.commercializationDelta, 0, 100),
  };
}
