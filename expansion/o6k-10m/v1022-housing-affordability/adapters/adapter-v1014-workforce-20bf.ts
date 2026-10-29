/**
 * Cross-wire: V1014 workforce migration v2 (SECTION 20BF).
 */
import type { V1022HaffTurnInput, V1022HaffWorkforceBridge } from '../types/core';
import { readV1022HaffWorkforce20bfBridge } from './adapter-crosswire-hub';
import { V1022_HAFF_clamp } from '../engine/housing-affordability-utils';

export function computeV1022HaffWorkforce20bfBridge(
  input: V1022HaffTurnInput,
  rentStressIndex: number,
): V1022HaffWorkforceBridge {
  return readV1022HaffWorkforce20bfBridge(input.workforce20bf, rentStressIndex);
}

export function applyV1022HaffWorkforce20bfReadinessOverrides<T extends { nationalReadiness?: number }>(
  base: T,
  bridge: V1022HaffWorkforceBridge,
): T {
  return {
    ...base,
    nationalReadiness: V1022_HAFF_clamp((base.nationalReadiness ?? 52) + bridge.readinessDelta, 0, 100),
  };
}
