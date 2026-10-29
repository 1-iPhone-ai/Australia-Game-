/**
 * Cross-wire: V1014 AI fidelity platform regulation node depth (SECTION 20BE — platform regulation node bridge).
 */
import type { V1024DgovTurnInput, V1024DgovSupplyBridge } from '../types/core';
import { readV1024DgovAiFidelity20beBridge } from './adapter-crosswire-hub';
import { V1024_DGOV_clamp } from '../engine/digital-governance-utils';

export function computeV1024DgovAiFidelity20beBridge(
  input: V1024DgovTurnInput,
  complianceStressIndex: number,
): V1024DgovSupplyBridge {
  return readV1024DgovAiFidelity20beBridge(input.aiFidelity20be, complianceStressIndex);
}

export function applyV1024DgovAiFidelity20beAiFidelityOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1024DgovSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1024_DGOV_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.aiFidelityDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
