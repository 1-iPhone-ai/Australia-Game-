import type {
  V1016NresTurnInput,
  V1016NresV1014EnergySlice,
  V1016NresV1014SupplySlice,
  V1016NresV1014TradeSlice,
  V1016NresV1014WorkforceSlice,
} from '../types/core';
import { V1016_NRES_clamp } from '../engine/national-resilience-utils';

export function readV1016NresSupply20bbBridge(slice: V1016NresV1014SupplySlice, severityIndex: number) {
  const bottleneckDelta = V1016_NRES_clamp(slice.bottleneckPressure * 0.04 + severityIndex * 0.06, -12, 18);
  const stockDaysDelta: Partial<Record<string, number>> = {};
  Object.entries(slice.regionalStockDays ?? {}).forEach(([region, days]) => {
    stockDaysDelta[region] = V1016_NRES_clamp(Number(days) - severityIndex * 0.08, 0, 120);
  });
  return { bottleneckDelta, stockDaysDelta };
}

export function readV1016NresTrade20baBridge(slice: V1016NresV1014TradeSlice, shockPressure: number) {
  const importStressContribution = V1016_NRES_clamp(
    slice.sanctionsPressure * 0.01 + slice.importDependencyRatio * 0.12 + shockPressure * 0.2,
    0,
    1,
  );
  const laneStabilityDelta = V1016_NRES_clamp(
    (slice.exportLaneStability - 50) * 0.06 - importStressContribution * 8,
    -10,
    10,
  );
  return { laneStabilityDelta, importStressContribution };
}

export function readV1016NresEnergy20bcBridge(slice: V1016NresV1014EnergySlice, severityIndex: number) {
  const gridDrag = V1016_NRES_clamp((100 - slice.gridStability) * 0.008 + severityIndex * 0.05, 0, 0.55);
  const reserveContribution = V1016_NRES_clamp(slice.reserveMarginPct * 0.02 - gridDrag * 4, -0.2, 0.35);
  return { gridDrag, reserveContribution };
}

export function readV1016NresWorkforce20bfBridge(slice: V1016NresV1014WorkforceSlice, severityIndex: number) {
  const mismatchContribution = V1016_NRES_clamp(slice.mismatchIndex * 0.01 + severityIndex * 0.04, 0, 1);
  const readinessDelta = V1016_NRES_clamp(
    (slice.nationalReadiness - 52) * 0.05 - mismatchContribution * 6,
    -9,
    9,
  );
  return { readinessDelta, mismatchContribution };
}

export function buildV1016NresBriefing(
  input: V1016NresTurnInput,
  severity: number,
  continuity: number,
): string {
  return (
    `Turn ${input.turn}: continuity ${continuity.toFixed(1)}, severity ${severity.toFixed(1)}, ` +
    `supply bottleneck ${input.supply20bb.bottleneckPressure.toFixed(0)}, ` +
    `grid ${input.energy20bc.gridStability.toFixed(0)}.`
  );
}
