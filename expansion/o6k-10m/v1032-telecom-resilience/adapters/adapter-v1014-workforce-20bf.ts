/**
 * Cross-wire: V1014 workforce migration v2 (SECTION 20BF).
 */
import type { V1032TresTurnInput, V1032TresWorkforceBridge } from '../types/core';
import { readV1032TresWorkforce20bfBridge } from './adapter-crosswire-hub';
import { V1032_TRES_clamp } from '../engine/telecom-resilience-utils';

export function computeV1032TresWorkforce20bfBridge(
  input: V1032TresTurnInput,
  telecomStressExposureIndex: number,
): V1032TresWorkforceBridge {
  return readV1032TresWorkforce20bfBridge(input.workforce20bf, telecomStressExposureIndex);
}

export function applyV1032TresWorkforce20bfReadinessOverrides<T extends { nationalReadiness?: number }>(
  base: T,
  bridge: V1032TresWorkforceBridge,
): T {
  return {
    ...base,
    nationalReadiness: V1032_TRES_clamp((base.nationalReadiness ?? 52) + bridge.readinessDelta, 0, 100),
  };
}
