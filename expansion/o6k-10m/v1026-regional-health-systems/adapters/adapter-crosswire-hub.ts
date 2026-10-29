import type {
  V1026RhsTurnInput,
  V1026RhsPublicServices20azSlice,
  V1026RhsV1014EnergySlice,
  V1026RhsClimateAdaptation20brSlice,
  V1026RhsV1014SupplySlice,
  V1026RhsV1014TradeSlice,
  V1026RhsV1014WorkforceSlice,
} from '../types/core';
import { V1026_RHS_clamp } from '../engine/regional-health-systems-utils';

export function readV1026RhsSupply20bbBridge(slice: V1026RhsV1014SupplySlice, capacityStressIndex: number) {
  const bottleneckDelta = V1026_RHS_clamp(slice.bottleneckPressure * 0.04 + capacityStressIndex * 0.06, -12, 18);
  const stockDaysDelta: Partial<Record<string, number>> = {};
  Object.entries(slice.regionalStockDays ?? {}).forEach(([region, days]) => {
    stockDaysDelta[region] = V1026_RHS_clamp(Number(days) - capacityStressIndex * 0.08, 0, 120);
  });
  return { bottleneckDelta, stockDaysDelta };
}

export function readV1026RhsTrade20baBridge(slice: V1026RhsV1014TradeSlice, heatStressPressure: number) {
  const importStressContribution = V1026_RHS_clamp(
    slice.sanctionsPressure * 0.01 + slice.importDependencyRatio * 0.12 + heatStressPressure * 0.2,
    0,
    1,
  );
  const laneStabilityDelta = V1026_RHS_clamp(
    (slice.exportLaneStability - 50) * 0.06 - importStressContribution * 8,
    -10,
    10,
  );
  return { laneStabilityDelta, importStressContribution };
}

export function readV1026RhsEnergy20bcBridge(slice: V1026RhsV1014EnergySlice, capacityStressIndex: number) {
  const gridDrag = V1026_RHS_clamp((100 - slice.gridStability) * 0.008 + capacityStressIndex * 0.05, 0, 0.55);
  const reserveContribution = V1026_RHS_clamp(slice.reserveMarginPct * 0.02 - gridDrag * 4, -0.2, 0.35);
  return { gridDrag, reserveContribution };
}

export function readV1026RhsWorkforce20bfBridge(slice: V1026RhsV1014WorkforceSlice, capacityStressIndex: number) {
  const mismatchContribution = V1026_RHS_clamp(slice.mismatchIndex * 0.01 + capacityStressIndex * 0.04, 0, 1);
  const readinessDelta = V1026_RHS_clamp(
    (slice.nationalReadiness - 52) * 0.05 - mismatchContribution * 6,
    -9,
    9,
  );
  return { readinessDelta, mismatchContribution };
}

export function readV1026RhsPublicServices20azBridge(
  slice: V1026RhsPublicServices20azSlice,
  capacityStressIndex: number,
) {
  const serviceQueueDelta = V1026_RHS_clamp(
    (100 - slice.clinicCapacityScore) * 0.05 + slice.serviceDeliveryReadiness * 0.04 + capacityStressIndex * 0.03,
    -8,
    14,
  );
  return { bottleneckDelta: serviceQueueDelta, stockDaysDelta: {}, serviceQueueDelta };
}

export function readV1026RhsClimateAdaptation20brBridge(
  slice: V1026RhsClimateAdaptation20brSlice,
  capacityStressIndex: number,
) {
  const climateAdaptationDelta = V1026_RHS_clamp(
    slice.heatStressPressure * 0.06 + slice.resilienceDriftTurns * 0.04 + capacityStressIndex * 0.05,
    -6,
    16,
  );
  return { bottleneckDelta: climateAdaptationDelta, stockDaysDelta: {}, climateAdaptationDelta };
}


export function readV1026RhsDigitalGovernance20btBridge(
  slice: import('../types/core').V1026RhsDigitalGovernance20btSlice,
  capacityStressIndex: number,
) {
  const digitalGovernanceDelta = V1026_RHS_clamp(
    slice.modelGovernancePressure * 0.05 + slice.alignmentDriftTurns * 0.04 + capacityStressIndex * 0.04,
    -6,
    14,
  );
  return { bottleneckDelta: digitalGovernanceDelta, stockDaysDelta: {}, digitalGovernanceDelta };
}

export function buildV1026RhsBriefing(
  input: V1026RhsTurnInput,
  severity: number,
  hospital_network: number,
): string {
  return (
    `Turn ${input.turn}: hospital_network ${hospital_network.toFixed(1)}, severity ${severity.toFixed(1)}, ` +
    `supply bottleneck ${input.supply20bb.bottleneckPressure.toFixed(0)}, ` +
    `grid ${input.energy20bc.gridStability.toFixed(0)}.`
  );
}
