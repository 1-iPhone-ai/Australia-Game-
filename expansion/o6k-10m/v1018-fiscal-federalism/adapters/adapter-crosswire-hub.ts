import type {
  V1018FfedTurnInput,
  V1018FfedV1014EnergySlice,
  V1018FfedV1014SupplySlice,
  V1018FfedV1014TradeSlice,
  V1018FfedV1014WorkforceSlice,
} from '../types/core';
import { V1018_FFED_clamp } from '../engine/fiscal-federalism-utils';

export function readV1018FfedSupply20bbBridge(slice: V1018FfedV1014SupplySlice, severityIndex: number) {
  const bottleneckDelta = V1018_FFED_clamp(slice.bottleneckPressure * 0.04 + severityIndex * 0.06, -12, 18);
  const stockDaysDelta: Partial<Record<string, number>> = {};
  Object.entries(slice.regionalStockDays ?? {}).forEach(([region, days]) => {
    stockDaysDelta[region] = V1018_FFED_clamp(Number(days) - severityIndex * 0.08, 0, 120);
  });
  return { bottleneckDelta, stockDaysDelta };
}

export function readV1018FfedTrade20baBridge(slice: V1018FfedV1014TradeSlice, transferPressure: number) {
  const importStressContribution = V1018_FFED_clamp(
    slice.sanctionsPressure * 0.01 + slice.importDependencyRatio * 0.12 + transferPressure * 0.2,
    0,
    1,
  );
  const laneStabilityDelta = V1018_FFED_clamp(
    (slice.exportLaneStability - 50) * 0.06 - importStressContribution * 8,
    -10,
    10,
  );
  return { laneStabilityDelta, importStressContribution };
}

export function readV1018FfedEnergy20bcBridge(slice: V1018FfedV1014EnergySlice, severityIndex: number) {
  const gridDrag = V1018_FFED_clamp((100 - slice.gridStability) * 0.008 + severityIndex * 0.05, 0, 0.55);
  const reserveContribution = V1018_FFED_clamp(slice.reserveMarginPct * 0.02 - gridDrag * 4, -0.2, 0.35);
  return { gridDrag, reserveContribution };
}

export function readV1018FfedWorkforce20bfBridge(slice: V1018FfedV1014WorkforceSlice, severityIndex: number) {
  const mismatchContribution = V1018_FFED_clamp(slice.mismatchIndex * 0.01 + severityIndex * 0.04, 0, 1);
  const readinessDelta = V1018_FFED_clamp(
    (slice.nationalReadiness - 52) * 0.05 - mismatchContribution * 6,
    -9,
    9,
  );
  return { readinessDelta, mismatchContribution };
}

export function buildV1018FfedBriefing(
  input: V1018FfedTurnInput,
  severity: number,
  audit_trail: number,
): string {
  return (
    `Turn ${input.turn}: audit_trail ${audit_trail.toFixed(1)}, severity ${severity.toFixed(1)}, ` +
    `supply bottleneck ${input.supply20bb.bottleneckPressure.toFixed(0)}, ` +
    `grid ${input.energy20bc.gridStability.toFixed(0)}.`
  );
}
