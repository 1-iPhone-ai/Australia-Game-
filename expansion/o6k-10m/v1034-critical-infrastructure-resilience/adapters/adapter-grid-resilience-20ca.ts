/**
 * Cross-wire: V1031 supply chain resilience depth (SECTION 20CA — heatwave / arid-buffer bridge).
 */
import type { V1031GresTurnInput, V1031GresSupplyBridge } from '../types/core';
import { readV1031GresInlandHeat20bzBridge } from './adapter-crosswire-hub';
import { V1031_GRES_clamp } from '../engine/critical-infrastructure-resilience-utils';

export function computeV1034CiresGridResilience20caBridge(
  input: V1031GresTurnInput,
  gridStressExposureIndex: number,
): V1031GresSupplyBridge {
  return readV1034CiresGridResilience20caBridge(input.supplyChainResilience20cd, gridStressExposureIndex);
}

export function applyV1034CiresGridResilience20caOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1031GresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1031_GRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.supplyChainResilienceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
