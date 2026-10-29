import type {
  V1032TresTurnInput,
  V1032TresPublicServices20azSlice,
  V1032TresV1014EnergySlice,
  V1032TresClimateAdaptation20brSlice,
  V1032TresV1014SupplySlice,
  V1032TresV1014TradeSlice,
  V1032TresV1014WorkforceSlice,
} from '../types/core';
import { V1032_TRES_clamp } from '../engine/telecom-resilience-utils';

export function readV1032TresSupply20bbBridge(slice: V1032TresV1014SupplySlice, telecomStressExposureIndex: number) {
  const bottleneckDelta = V1032_TRES_clamp(slice.bottleneckPressure * 0.04 + telecomStressExposureIndex * 0.06, -12, 18);
  const stockDaysDelta: Partial<Record<string, number>> = {};
  Object.entries(slice.regionalStockDays ?? {}).forEach(([region, days]) => {
    stockDaysDelta[region] = V1032_TRES_clamp(Number(days) - telecomStressExposureIndex * 0.08, 0, 120);
  });
  return { bottleneckDelta, stockDaysDelta };
}

export function readV1032TresTrade20baBridge(slice: V1032TresV1014TradeSlice, heatStressPressure: number) {
  const importStressContribution = V1032_TRES_clamp(
    slice.sanctionsPressure * 0.01 + slice.importDependencyRatio * 0.12 + heatStressPressure * 0.2,
    0,
    1,
  );
  const laneStabilityDelta = V1032_TRES_clamp(
    (slice.exportLaneStability - 50) * 0.06 - importStressContribution * 8,
    -10,
    10,
  );
  return { laneStabilityDelta, importStressContribution };
}

export function readV1032TresEnergy20bcBridge(slice: V1032TresV1014EnergySlice, telecomStressExposureIndex: number) {
  const gridDrag = V1032_TRES_clamp((100 - slice.gridStability) * 0.008 + telecomStressExposureIndex * 0.05, 0, 0.55);
  const reserveContribution = V1032_TRES_clamp(slice.reserveMarginPct * 0.02 - gridDrag * 4, -0.2, 0.35);
  return { gridDrag, reserveContribution };
}

export function readV1032TresWorkforce20bfBridge(slice: V1032TresV1014WorkforceSlice, telecomStressExposureIndex: number) {
  const mismatchContribution = V1032_TRES_clamp(slice.mismatchIndex * 0.01 + telecomStressExposureIndex * 0.04, 0, 1);
  const readinessDelta = V1032_TRES_clamp(
    (slice.nationalReadiness - 52) * 0.05 - mismatchContribution * 6,
    -9,
    9,
  );
  return { readinessDelta, mismatchContribution };
}

export function readV1032TresPublicServices20azBridge(
  slice: V1032TresPublicServices20azSlice,
  telecomStressExposureIndex: number,
) {
  const serviceQueueDelta = V1032_TRES_clamp(
    (100 - slice.clinicCapacityScore) * 0.05 + slice.serviceDeliveryReadiness * 0.04 + telecomStressExposureIndex * 0.03,
    -8,
    14,
  );
  return { bottleneckDelta: serviceQueueDelta, stockDaysDelta: {}, serviceQueueDelta };
}

export function readV1032TresClimateAdaptation20brBridge(
  slice: V1032TresClimateAdaptation20brSlice,
  telecomStressExposureIndex: number,
) {
  const climateAdaptationDelta = V1032_TRES_clamp(
    slice.heatStressPressure * 0.06 + slice.resilienceDriftTurns * 0.04 + telecomStressExposureIndex * 0.05,
    -6,
    16,
  );
  return { bottleneckDelta: climateAdaptationDelta, stockDaysDelta: {}, climateAdaptationDelta };
}


export function readV1032TresDigitalGovernance20btBridge(
  slice: import('../types/core').V1032TresDigitalGovernance20btSlice,
  telecomStressExposureIndex: number,
) {
  const digitalGovernanceDelta = V1032_TRES_clamp(
    slice.modelGovernancePressure * 0.05 + slice.alignmentDriftTurns * 0.04 + telecomStressExposureIndex * 0.04,
    -6,
    14,
  );
  return { bottleneckDelta: digitalGovernanceDelta, stockDaysDelta: {}, digitalGovernanceDelta };
}


export function readV1032TresBiodiversityStewardship20buBridge(
  slice: import('../types/core').V1032TresBiodiversityStewardship20buSlice,
  telecomStressExposureIndex: number,
) {
  const regionalHealthDelta = V1032_TRES_clamp(
    slice.hospitalSurgePressure * 0.06 + slice.bedCapacityDriftTurns * 0.05 + telecomStressExposureIndex * 0.05,
    -8,
    16,
  );
  return { bottleneckDelta: regionalHealthDelta, stockDaysDelta: {}, regionalHealthDelta };
}


export function readV1032TresWaterSecurity20bwBridge(
  slice: import('../types/core').V1032TresWaterSecurity20bwSlice,
  telecomStressExposureIndex: number,
) {
  const gridResilienceDelta = V1032_TRES_clamp(
    slice.gridStressExposurePressure * 0.07 + slice.outageDriftTurns * 0.04 + telecomStressExposureIndex * 0.06,
    -8,
    16,
  );
  return { bottleneckDelta: gridResilienceDelta, stockDaysDelta: {}, gridResilienceDelta };
}

export function readV1032TresDisasterResilience20bxBridge(
  slice: import('../types/core').V1032TresDisasterResilience20bxSlice,
  telecomStressExposureIndex: number,
) {
  const disasterResilienceDelta = V1032_TRES_clamp(
    slice.compoundHazardLoad * 0.08 + slice.evacuationLagTurns * 0.05 + slice.infrastructureFailurePressure * 0.06 + telecomStressExposureIndex * 0.04,
    -6,
    18,
  );
  return { bottleneckDelta: disasterResilienceDelta, stockDaysDelta: {}, disasterResilienceDelta };
}

export function buildV1032TresBriefing(
  input: V1032TresTurnInput,
  severity: number,
  exchange_zone: number,
): string {
  return (
    `Turn ${input.turn}: exchange_zone ${exchange_zone.toFixed(1)}, severity ${severity.toFixed(1)}, ` +
    `supply bottleneck ${input.supply20bb.bottleneckPressure.toFixed(0)}, ` +
    `grid ${input.energy20bc.gridStability.toFixed(0)}.`
  );
}
