/**
 * Cross-wire: V1031 critical infrastructure resilience depth (SECTION 20CA — heatwave / arid-buffer bridge).
 */
import type { V1031GresTurnInput, V1031GresSupplyBridge } from '../types/core';
import { readV1031GresInlandHeat20bzBridge } from './adapter-crosswire-hub';
import { V1031_GRES_clamp } from '../engine/cyber-resilience-utils';

export function computeV1035CyresGridResilience20caBridge(
  input: V1031GresTurnInput,
  gridStressExposureIndex: number,
): V1031GresSupplyBridge {
  return readV1035CyresGridResilience20caBridge(input.criticalInfrastructureResilience20ce, gridStressExposureIndex);
}

export function applyV1035CyresGridResilience20caOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1031GresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1031_GRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.criticalInfrastructureResilienceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
