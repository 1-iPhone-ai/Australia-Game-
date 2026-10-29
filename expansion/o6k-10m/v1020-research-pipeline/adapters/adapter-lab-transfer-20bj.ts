/**
 * Cross-wire: V1014 fiscal federalism lab transfer depth (SECTION 20BJ — lab transfer bridge).
 */
import type { V1020RpipeTurnInput, V1020RpipeSupplyBridge } from '../types/core';
import { readV1020RpipeLabTransfer20bjBridge } from './adapter-crosswire-hub';
import { V1020_RPIPE_clamp } from '../engine/research-pipeline-utils';

export function computeV1020RpipeLabTransfer20bjBridge(
  input: V1020RpipeTurnInput,
  severityIndex: number,
): V1020RpipeSupplyBridge {
  return readV1020RpipeLabTransfer20bjBridge(input.fiscalFederalism20bj, severityIndex);
}

export function applyV1020RpipeLabTransfer20bjLabTransferOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1020RpipeSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1020_RPIPE_clamp((base.bottleneckPressure ?? 40) + bridge.labTransferDelta, 0, 100),
  };
}
