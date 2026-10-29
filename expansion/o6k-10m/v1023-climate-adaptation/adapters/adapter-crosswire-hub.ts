import type {
  V1023CladTurnInput,
  V1023CladPublicServices20azSlice,
  V1023CladV1014EnergySlice,
  V1023CladScenarioPacks20bdSlice,
  V1023CladV1014SupplySlice,
  V1023CladV1014TradeSlice,
  V1023CladV1014WorkforceSlice,
} from '../types/core';
import { V1023_CLAD_clamp } from '../engine/climate-adaptation-utils';

export function readV1023CladSupply20bbBridge(slice: V1023CladV1014SupplySlice, heatStressIndex: number) {
  const bottleneckDelta = V1023_CLAD_clamp(slice.bottleneckPressure * 0.04 + heatStressIndex * 0.06, -12, 18);
  const stockDaysDelta: Partial<Record<string, number>> = {};
  Object.entries(slice.regionalStockDays ?? {}).forEach(([region, days]) => {
    stockDaysDelta[region] = V1023_CLAD_clamp(Number(days) - heatStressIndex * 0.08, 0, 120);
  });
  return { bottleneckDelta, stockDaysDelta };
}

export function readV1023CladTrade20baBridge(slice: V1023CladV1014TradeSlice, packCohesionPressure: number) {
  const importStressContribution = V1023_CLAD_clamp(
    slice.sanctionsPressure * 0.01 + slice.importDependencyRatio * 0.12 + packCohesionPressure * 0.2,
    0,
    1,
  );
  const laneStabilityDelta = V1023_CLAD_clamp(
    (slice.exportLaneStability - 50) * 0.06 - importStressContribution * 8,
    -10,
    10,
  );
  return { laneStabilityDelta, importStressContribution };
}

export function readV1023CladEnergy20bcBridge(slice: V1023CladV1014EnergySlice, heatStressIndex: number) {
  const gridDrag = V1023_CLAD_clamp((100 - slice.gridStability) * 0.008 + heatStressIndex * 0.05, 0, 0.55);
  const reserveContribution = V1023_CLAD_clamp(slice.reserveMarginPct * 0.02 - gridDrag * 4, -0.2, 0.35);
  return { gridDrag, reserveContribution };
}

export function readV1023CladWorkforce20bfBridge(slice: V1023CladV1014WorkforceSlice, heatStressIndex: number) {
  const mismatchContribution = V1023_CLAD_clamp(slice.mismatchIndex * 0.01 + heatStressIndex * 0.04, 0, 1);
  const readinessDelta = V1023_CLAD_clamp(
    (slice.nationalReadiness - 52) * 0.05 - mismatchContribution * 6,
    -9,
    9,
  );
  return { readinessDelta, mismatchContribution };
}

export function readV1023CladPublicServices20azBridge(
  slice: V1023CladPublicServices20azSlice,
  heatStressIndex: number,
) {
  const serviceQueueDelta = V1023_CLAD_clamp(
    (100 - slice.clinicCapacityScore) * 0.05 + slice.serviceDeliveryReadiness * 0.04 + heatStressIndex * 0.03,
    -8,
    14,
  );
  return { bottleneckDelta: serviceQueueDelta, stockDaysDelta: {}, serviceQueueDelta };
}

export function readV1023CladScenarioPacks20bdBridge(
  slice: V1023CladScenarioPacks20bdSlice,
  heatStressIndex: number,
) {
  const scenarioPackDelta = V1023_CLAD_clamp(
    slice.packCohesionPressure * 0.06 + slice.objectiveDriftTurns * 0.04 + heatStressIndex * 0.05,
    -6,
    16,
  );
  return { bottleneckDelta: scenarioPackDelta, stockDaysDelta: {}, scenarioPackDelta };
}

export function buildV1023CladBriefing(
  input: V1023CladTurnInput,
  severity: number,
  flood_node: number,
): string {
  return (
    `Turn ${input.turn}: flood_node ${flood_node.toFixed(1)}, severity ${severity.toFixed(1)}, ` +
    `supply bottleneck ${input.supply20bb.bottleneckPressure.toFixed(0)}, ` +
    `grid ${input.energy20bc.gridStability.toFixed(0)}.`
  );
}
