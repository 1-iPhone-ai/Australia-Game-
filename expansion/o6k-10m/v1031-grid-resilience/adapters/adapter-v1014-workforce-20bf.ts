/**
 * Cross-wire: V1014 workforce migration v2 (SECTION 20BF).
 */
import type { V1031GresTurnInput, V1031GresWorkforceBridge } from '../types/core';
import { readV1031GresWorkforce20bfBridge } from './adapter-crosswire-hub';
import { V1031_GRES_clamp } from '../engine/grid-resilience-utils';

export function computeV1031GresWorkforce20bfBridge(
  input: V1031GresTurnInput,
  gridStressExposureIndex: number,
): V1031GresWorkforceBridge {
  return readV1031GresWorkforce20bfBridge(input.workforce20bf, gridStressExposureIndex);
}

export function applyV1031GresWorkforce20bfReadinessOverrides<T extends { nationalReadiness?: number }>(
  base: T,
  bridge: V1031GresWorkforceBridge,
): T {
  return {
    ...base,
    nationalReadiness: V1031_GRES_clamp((base.nationalReadiness ?? 52) + bridge.readinessDelta, 0, 100),
  };
}
