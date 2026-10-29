/**
 * Cross-wire: V1031 grid resilience depth (SECTION 20CA — heatwave / arid-buffer bridge).
 */
import type { V1031GresTurnInput, V1031GresSupplyBridge } from '../types/core';
import { readV1031GresInlandHeat20bzBridge } from './adapter-crosswire-hub';
import { V1031_GRES_clamp } from '../engine/telecom-resilience-utils';

export function computeV1032TresGridResilience20caBridge(
  input: V1031GresTurnInput,
  gridStressExposureIndex: number,
): V1031GresSupplyBridge {
  return readV1032TresGridResilience20caBridge(input.gridResilience20ca, gridStressExposureIndex);
}

export function applyV1032TresGridResilience20caOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1031GresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1031_GRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.gridResilienceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
