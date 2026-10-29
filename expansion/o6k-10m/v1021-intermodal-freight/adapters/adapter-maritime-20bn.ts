/**
 * Cross-wire: V1014 AI fidelity / handoff depth (SECTION 20BN — handoff bridge).
 */
import type { V1021ImfdTurnInput, V1021ImfdSupplyBridge } from '../types/core';
import { readV1021ImfdMaritime20bnBridge } from './adapter-crosswire-hub';
import { V1021_IMFD_clamp } from '../engine/intermodal-freight-utils';

export function computeV1021ImfdMaritime20bnBridge(
  input: V1021ImfdTurnInput,
  dwellPenaltyIndex: number,
): V1021ImfdSupplyBridge {
  return readV1021ImfdMaritime20bnBridge(input.maritime20bn, dwellPenaltyIndex);
}

export function applyV1021ImfdMaritime20bnHandoffOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1021ImfdSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1021_IMFD_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.handoffDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
