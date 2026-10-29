/**
 * Cross-wire: V1014 workforce migration v2 (SECTION 20BF).
 */
import type { V1023CladTurnInput, V1023CladWorkforceBridge } from '../types/core';
import { readV1023CladWorkforce20bfBridge } from './adapter-crosswire-hub';
import { V1023_CLAD_clamp } from '../engine/climate-adaptation-utils';

export function computeV1023CladWorkforce20bfBridge(
  input: V1023CladTurnInput,
  heatStressIndex: number,
): V1023CladWorkforceBridge {
  return readV1023CladWorkforce20bfBridge(input.workforce20bf, heatStressIndex);
}

export function applyV1023CladWorkforce20bfReadinessOverrides<T extends { nationalReadiness?: number }>(
  base: T,
  bridge: V1023CladWorkforceBridge,
): T {
  return {
    ...base,
    nationalReadiness: V1023_CLAD_clamp((base.nationalReadiness ?? 52) + bridge.readinessDelta, 0, 100),
  };
}
