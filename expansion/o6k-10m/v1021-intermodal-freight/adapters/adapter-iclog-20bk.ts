/**
 * Cross-wire: V1014 fiscal federalism dwell hub depth (SECTION 20BK — dwell hub bridge).
 */
import type { V1021ImfdTurnInput, V1021ImfdSupplyBridge } from '../types/core';
import { readV1021ImfdIclog20bkBridge } from './adapter-crosswire-hub';
import { V1021_IMFD_clamp } from '../engine/intermodal-freight-utils';

export function computeV1021ImfdIclog20bkBridge(
  input: V1021ImfdTurnInput,
  dwellPenaltyIndex: number,
): V1021ImfdSupplyBridge {
  return readV1021ImfdIclog20bkBridge(input.iclog20bk, dwellPenaltyIndex);
}

export function applyV1021ImfdIclog20bkLabTransferOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1021ImfdSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1021_IMFD_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.labTransferDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
