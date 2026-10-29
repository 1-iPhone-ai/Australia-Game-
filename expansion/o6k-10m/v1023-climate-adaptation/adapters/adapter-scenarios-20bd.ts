/**
 * Cross-wire: V1014 scenario packs flood defend node depth (SECTION 20BD — flood defend node bridge).
 */
import type { V1023CladTurnInput, V1023CladSupplyBridge } from '../types/core';
import { readV1023CladScenarioPacks20bdBridge } from './adapter-crosswire-hub';
import { V1023_CLAD_clamp } from '../engine/climate-adaptation-utils';

export function computeV1023CladScenarioPacks20bdBridge(
  input: V1023CladTurnInput,
  heatStressIndex: number,
): V1023CladSupplyBridge {
  return readV1023CladScenarioPacks20bdBridge(input.scenarioPacks20bd, heatStressIndex);
}

export function applyV1023CladScenarioPacks20bdScenarioPackOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1023CladSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1023_CLAD_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.scenarioPackDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
