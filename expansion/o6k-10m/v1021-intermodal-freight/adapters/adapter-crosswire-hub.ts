import type {
  V1021ImfdTurnInput,
  V1021ImfdMaritime20bnSlice,
  V1021ImfdV1014EnergySlice,
  V1021ImfdIclog20bkSlice,
  V1021ImfdV1014SupplySlice,
  V1021ImfdV1014TradeSlice,
  V1021ImfdV1014WorkforceSlice,
} from '../types/core';
import { V1021_IMFD_clamp } from '../engine/intermodal-freight-utils';

export function readV1021ImfdSupply20bbBridge(slice: V1021ImfdV1014SupplySlice, dwellPenaltyIndex: number) {
  const bottleneckDelta = V1021_IMFD_clamp(slice.bottleneckPressure * 0.04 + dwellPenaltyIndex * 0.06, -12, 18);
  const stockDaysDelta: Partial<Record<string, number>> = {};
  Object.entries(slice.regionalStockDays ?? {}).forEach(([region, days]) => {
    stockDaysDelta[region] = V1021_IMFD_clamp(Number(days) - dwellPenaltyIndex * 0.08, 0, 120);
  });
  return { bottleneckDelta, stockDaysDelta };
}

export function readV1021ImfdTrade20baBridge(slice: V1021ImfdV1014TradeSlice, iclogBackpressure: number) {
  const importStressContribution = V1021_IMFD_clamp(
    slice.sanctionsPressure * 0.01 + slice.importDependencyRatio * 0.12 + iclogBackpressure * 0.2,
    0,
    1,
  );
  const laneStabilityDelta = V1021_IMFD_clamp(
    (slice.exportLaneStability - 50) * 0.06 - importStressContribution * 8,
    -10,
    10,
  );
  return { laneStabilityDelta, importStressContribution };
}

export function readV1021ImfdEnergy20bcBridge(slice: V1021ImfdV1014EnergySlice, dwellPenaltyIndex: number) {
  const gridDrag = V1021_IMFD_clamp((100 - slice.gridStability) * 0.008 + dwellPenaltyIndex * 0.05, 0, 0.55);
  const reserveContribution = V1021_IMFD_clamp(slice.reserveMarginPct * 0.02 - gridDrag * 4, -0.2, 0.35);
  return { gridDrag, reserveContribution };
}

export function readV1021ImfdWorkforce20bfBridge(slice: V1021ImfdV1014WorkforceSlice, dwellPenaltyIndex: number) {
  const mismatchContribution = V1021_IMFD_clamp(slice.mismatchIndex * 0.01 + dwellPenaltyIndex * 0.04, 0, 1);
  const readinessDelta = V1021_IMFD_clamp(
    (slice.nationalReadiness - 52) * 0.05 - mismatchContribution * 6,
    -9,
    9,
  );
  return { readinessDelta, mismatchContribution };
}

export function readV1021ImfdMaritime20bnBridge(
  slice: V1021ImfdMaritime20bnSlice,
  dwellPenaltyIndex: number,
) {
  const handoffDelta = V1021_IMFD_clamp(
    (100 - slice.berthUtilizationScore) * 0.05 + slice.handoffReadiness * 0.04 + dwellPenaltyIndex * 0.03,
    -8,
    14,
  );
  return { bottleneckDelta: handoffDelta, stockDaysDelta: {}, handoffDelta };
}

export function readV1021ImfdIclog20bkBridge(
  slice: V1021ImfdIclog20bkSlice,
  dwellPenaltyIndex: number,
) {
  const labTransferDelta = V1021_IMFD_clamp(
    slice.iclogBackpressure * 0.06 + slice.dwellBacklogTurns * 0.04 + dwellPenaltyIndex * 0.05,
    -6,
    16,
  );
  return { bottleneckDelta: labTransferDelta, stockDaysDelta: {}, labTransferDelta };
}

export function buildV1021ImfdBriefing(
  input: V1021ImfdTurnInput,
  severity: number,
  dwell_hub: number,
): string {
  return (
    `Turn ${input.turn}: dwell_hub ${dwell_hub.toFixed(1)}, severity ${severity.toFixed(1)}, ` +
    `supply bottleneck ${input.supply20bb.bottleneckPressure.toFixed(0)}, ` +
    `grid ${input.energy20bc.gridStability.toFixed(0)}.`
  );
}
