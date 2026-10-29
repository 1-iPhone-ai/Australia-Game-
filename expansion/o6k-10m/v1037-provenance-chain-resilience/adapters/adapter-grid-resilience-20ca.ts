/**
 * Cross-wire: V1031 information integrity resilience depth (SECTION 20CA — heatwave / arid-buffer bridge).
 */
import type { V1031GresTurnInput, V1031GresSupplyBridge } from '../types/core';
import { readV1031GresInlandHeat20bzBridge } from './adapter-crosswire-hub';
import { V1031_GRES_clamp } from '../engine/provenance-chain-resilience-utils';

export function computeV1037PcresGridResilience20caBridge(
  input: V1031GresTurnInput,
  gridStressExposureIndex: number,
): V1031GresSupplyBridge {
  return readV1037PcresGridResilience20caBridge(input.informationIntegrityResilience20ci, gridStressExposureIndex);
}

export function applyV1037PcresGridResilience20caOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1031GresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1031_GRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.informationIntegrityResilienceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
