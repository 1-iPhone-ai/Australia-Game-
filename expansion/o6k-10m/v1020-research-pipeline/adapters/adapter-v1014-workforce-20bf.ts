/**
 * Cross-wire: V1014 workforce migration v2 (SECTION 20BF).
 */
import type { V1020RpipeTurnInput, V1020RpipeWorkforceBridge } from '../types/core';
import { readV1020RpipeWorkforce20bfBridge } from './adapter-crosswire-hub';
import { V1020_RPIPE_clamp } from '../engine/research-pipeline-utils';

export function computeV1020RpipeWorkforce20bfBridge(
  input: V1020RpipeTurnInput,
  severityIndex: number,
): V1020RpipeWorkforceBridge {
  return readV1020RpipeWorkforce20bfBridge(input.workforce20bf, severityIndex);
}

export function applyV1020RpipeWorkforce20bfReadinessOverrides<T extends { nationalReadiness?: number }>(
  base: T,
  bridge: V1020RpipeWorkforceBridge,
): T {
  return {
    ...base,
    nationalReadiness: V1020_RPIPE_clamp((base.nationalReadiness ?? 52) + bridge.readinessDelta, 0, 100),
  };
}
