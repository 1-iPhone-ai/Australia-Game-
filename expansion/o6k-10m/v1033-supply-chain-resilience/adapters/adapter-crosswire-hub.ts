import type {
  V1033ScresTurnInput,
  V1033ScresPublicServices20azSlice,
  V1033ScresV1014EnergySlice,
  V1033ScresClimateAdaptation20brSlice,
  V1033ScresV1014SupplySlice,
  V1033ScresV1014TradeSlice,
  V1033ScresV1014WorkforceSlice,
} from '../types/core';
import { V1033_SCRES_clamp } from '../engine/supply-chain-resilience-utils';

export function readV1033ScresSupply20bbBridge(slice: V1033ScresV1014SupplySlice, logisticsStressExposureIndex: number) {
  const bottleneckDelta = V1033_SCRES_clamp(slice.bottleneckPressure * 0.04 + logisticsStressExposureIndex * 0.06, -12, 18);
  const stockDaysDelta: Partial<Record<string, number>> = {};
  Object.entries(slice.regionalStockDays ?? {}).forEach(([region, days]) => {
    stockDaysDelta[region] = V1033_SCRES_clamp(Number(days) - logisticsStressExposureIndex * 0.08, 0, 120);
  });
  return { bottleneckDelta, stockDaysDelta };
}

export function readV1033ScresTrade20baBridge(slice: V1033ScresV1014TradeSlice, heatStressPressure: number) {
  const importStressContribution = V1033_SCRES_clamp(
    slice.sanctionsPressure * 0.01 + slice.importDependencyRatio * 0.12 + heatStressPressure * 0.2,
    0,
    1,
  );
  const laneStabilityDelta = V1033_SCRES_clamp(
    (slice.exportLaneStability - 50) * 0.06 - importStressContribution * 8,
    -10,
    10,
  );
  return { laneStabilityDelta, importStressContribution };
}

export function readV1033ScresEnergy20bcBridge(slice: V1033ScresV1014EnergySlice, logisticsStressExposureIndex: number) {
  const gridDrag = V1033_SCRES_clamp((100 - slice.gridStability) * 0.008 + logisticsStressExposureIndex * 0.05, 0, 0.55);
  const reserveContribution = V1033_SCRES_clamp(slice.reserveMarginPct * 0.02 - gridDrag * 4, -0.2, 0.35);
  return { gridDrag, reserveContribution };
}

export function readV1033ScresWorkforce20bfBridge(slice: V1033ScresV1014WorkforceSlice, logisticsStressExposureIndex: number) {
  const mismatchContribution = V1033_SCRES_clamp(slice.mismatchIndex * 0.01 + logisticsStressExposureIndex * 0.04, 0, 1);
  const readinessDelta = V1033_SCRES_clamp(
    (slice.nationalReadiness - 52) * 0.05 - mismatchContribution * 6,
    -9,
    9,
  );
  return { readinessDelta, mismatchContribution };
}

export function readV1033ScresPublicServices20azBridge(
  slice: V1033ScresPublicServices20azSlice,
  logisticsStressExposureIndex: number,
) {
  const serviceQueueDelta = V1033_SCRES_clamp(
    (100 - slice.clinicCapacityScore) * 0.05 + slice.serviceDeliveryReadiness * 0.04 + logisticsStressExposureIndex * 0.03,
    -8,
    14,
  );
  return { bottleneckDelta: serviceQueueDelta, stockDaysDelta: {}, serviceQueueDelta };
}

export function readV1033ScresClimateAdaptation20brBridge(
  slice: V1033ScresClimateAdaptation20brSlice,
  logisticsStressExposureIndex: number,
) {
  const climateAdaptationDelta = V1033_SCRES_clamp(
    slice.heatStressPressure * 0.06 + slice.resilienceDriftTurns * 0.04 + logisticsStressExposureIndex * 0.05,
    -6,
    16,
  );
  return { bottleneckDelta: climateAdaptationDelta, stockDaysDelta: {}, climateAdaptationDelta };
}


export function readV1033ScresDigitalGovernance20btBridge(
  slice: import('../types/core').V1033ScresDigitalGovernance20btSlice,
  logisticsStressExposureIndex: number,
) {
  const digitalGovernanceDelta = V1033_SCRES_clamp(
    slice.modelGovernancePressure * 0.05 + slice.alignmentDriftTurns * 0.04 + logisticsStressExposureIndex * 0.04,
    -6,
    14,
  );
  return { bottleneckDelta: digitalGovernanceDelta, stockDaysDelta: {}, digitalGovernanceDelta };
}


export function readV1033ScresBiodiversityStewardship20buBridge(
  slice: import('../types/core').V1033ScresBiodiversityStewardship20buSlice,
  logisticsStressExposureIndex: number,
) {
  const regionalHealthDelta = V1033_SCRES_clamp(
    slice.hospitalSurgePressure * 0.06 + slice.bedCapacityDriftTurns * 0.05 + logisticsStressExposureIndex * 0.05,
    -8,
    16,
  );
  return { bottleneckDelta: regionalHealthDelta, stockDaysDelta: {}, regionalHealthDelta };
}


export function readV1033ScresWaterSecurity20bwBridge(
  slice: import('../types/core').V1033ScresWaterSecurity20bwSlice,
  logisticsStressExposureIndex: number,
) {
  const telecomResilienceDelta = V1033_SCRES_clamp(
    slice.gridStressExposurePressure * 0.07 + slice.outageDriftTurns * 0.04 + logisticsStressExposureIndex * 0.06,
    -8,
    16,
  );
  return { bottleneckDelta: telecomResilienceDelta, stockDaysDelta: {}, telecomResilienceDelta };
}

export function readV1033ScresDisasterResilience20bxBridge(
  slice: import('../types/core').V1033ScresDisasterResilience20bxSlice,
  logisticsStressExposureIndex: number,
) {
  const disasterResilienceDelta = V1033_SCRES_clamp(
    slice.compoundHazardLoad * 0.08 + slice.evacuationLagTurns * 0.05 + slice.infrastructureFailurePressure * 0.06 + logisticsStressExposureIndex * 0.04,
    -6,
    18,
  );
  return { bottleneckDelta: disasterResilienceDelta, stockDaysDelta: {}, disasterResilienceDelta };
}

export function buildV1033ScresBriefing(
  input: V1033ScresTurnInput,
  severity: number,
  hub_zone: number,
): string {
  return (
    `Turn ${input.turn}: hub_zone ${hub_zone.toFixed(1)}, severity ${severity.toFixed(1)}, ` +
    `supply bottleneck ${input.supply20bb.bottleneckPressure.toFixed(0)}, ` +
    `grid ${input.energy20bc.gridStability.toFixed(0)}.`
  );
}
