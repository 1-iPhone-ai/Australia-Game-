import type {
  V1029CresTurnInput,
  V1029CresPublicServices20azSlice,
  V1029CresV1014EnergySlice,
  V1029CresClimateAdaptation20brSlice,
  V1029CresV1014SupplySlice,
  V1029CresV1014TradeSlice,
  V1029CresV1014WorkforceSlice,
} from '../types/core';
import { V1029_CRES_clamp } from '../engine/coastal-resilience-utils';

export function readV1029CresSupply20bbBridge(slice: V1029CresV1014SupplySlice, seaLevelExposureIndex: number) {
  const bottleneckDelta = V1029_CRES_clamp(slice.bottleneckPressure * 0.04 + seaLevelExposureIndex * 0.06, -12, 18);
  const stockDaysDelta: Partial<Record<string, number>> = {};
  Object.entries(slice.regionalStockDays ?? {}).forEach(([region, days]) => {
    stockDaysDelta[region] = V1029_CRES_clamp(Number(days) - seaLevelExposureIndex * 0.08, 0, 120);
  });
  return { bottleneckDelta, stockDaysDelta };
}

export function readV1029CresTrade20baBridge(slice: V1029CresV1014TradeSlice, heatStressPressure: number) {
  const importStressContribution = V1029_CRES_clamp(
    slice.sanctionsPressure * 0.01 + slice.importDependencyRatio * 0.12 + heatStressPressure * 0.2,
    0,
    1,
  );
  const laneStabilityDelta = V1029_CRES_clamp(
    (slice.exportLaneStability - 50) * 0.06 - importStressContribution * 8,
    -10,
    10,
  );
  return { laneStabilityDelta, importStressContribution };
}

export function readV1029CresEnergy20bcBridge(slice: V1029CresV1014EnergySlice, seaLevelExposureIndex: number) {
  const gridDrag = V1029_CRES_clamp((100 - slice.gridStability) * 0.008 + seaLevelExposureIndex * 0.05, 0, 0.55);
  const reserveContribution = V1029_CRES_clamp(slice.reserveMarginPct * 0.02 - gridDrag * 4, -0.2, 0.35);
  return { gridDrag, reserveContribution };
}

export function readV1029CresWorkforce20bfBridge(slice: V1029CresV1014WorkforceSlice, seaLevelExposureIndex: number) {
  const mismatchContribution = V1029_CRES_clamp(slice.mismatchIndex * 0.01 + seaLevelExposureIndex * 0.04, 0, 1);
  const readinessDelta = V1029_CRES_clamp(
    (slice.nationalReadiness - 52) * 0.05 - mismatchContribution * 6,
    -9,
    9,
  );
  return { readinessDelta, mismatchContribution };
}

export function readV1029CresPublicServices20azBridge(
  slice: V1029CresPublicServices20azSlice,
  seaLevelExposureIndex: number,
) {
  const serviceQueueDelta = V1029_CRES_clamp(
    (100 - slice.clinicCapacityScore) * 0.05 + slice.serviceDeliveryReadiness * 0.04 + seaLevelExposureIndex * 0.03,
    -8,
    14,
  );
  return { bottleneckDelta: serviceQueueDelta, stockDaysDelta: {}, serviceQueueDelta };
}

export function readV1029CresClimateAdaptation20brBridge(
  slice: V1029CresClimateAdaptation20brSlice,
  seaLevelExposureIndex: number,
) {
  const climateAdaptationDelta = V1029_CRES_clamp(
    slice.heatStressPressure * 0.06 + slice.resilienceDriftTurns * 0.04 + seaLevelExposureIndex * 0.05,
    -6,
    16,
  );
  return { bottleneckDelta: climateAdaptationDelta, stockDaysDelta: {}, climateAdaptationDelta };
}


export function readV1029CresDigitalGovernance20btBridge(
  slice: import('../types/core').V1029CresDigitalGovernance20btSlice,
  seaLevelExposureIndex: number,
) {
  const digitalGovernanceDelta = V1029_CRES_clamp(
    slice.modelGovernancePressure * 0.05 + slice.alignmentDriftTurns * 0.04 + seaLevelExposureIndex * 0.04,
    -6,
    14,
  );
  return { bottleneckDelta: digitalGovernanceDelta, stockDaysDelta: {}, digitalGovernanceDelta };
}


export function readV1029CresBiodiversityStewardship20buBridge(
  slice: import('../types/core').V1029CresBiodiversityStewardship20buSlice,
  seaLevelExposureIndex: number,
) {
  const regionalHealthDelta = V1029_CRES_clamp(
    slice.hospitalSurgePressure * 0.06 + slice.bedCapacityDriftTurns * 0.05 + seaLevelExposureIndex * 0.05,
    -8,
    16,
  );
  return { bottleneckDelta: regionalHealthDelta, stockDaysDelta: {}, regionalHealthDelta };
}


export function readV1029CresWaterSecurity20bwBridge(
  slice: import('../types/core').V1029CresWaterSecurity20bwSlice,
  seaLevelExposureIndex: number,
) {
  const waterSecurityDelta = V1029_CRES_clamp(
    slice.supplyStressPressure * 0.07 + slice.basinDriftTurns * 0.04 + seaLevelExposureIndex * 0.06,
    -8,
    16,
  );
  return { bottleneckDelta: waterSecurityDelta, stockDaysDelta: {}, waterSecurityDelta };
}

export function readV1029CresDisasterResilience20bxBridge(
  slice: import('../types/core').V1029CresDisasterResilience20bxSlice,
  seaLevelExposureIndex: number,
) {
  const disasterResilienceDelta = V1029_CRES_clamp(
    slice.compoundHazardLoad * 0.08 + slice.evacuationLagTurns * 0.05 + slice.infrastructureFailurePressure * 0.06 + seaLevelExposureIndex * 0.04,
    -6,
    18,
  );
  return { bottleneckDelta: disasterResilienceDelta, stockDaysDelta: {}, disasterResilienceDelta };
}

export function buildV1029CresBriefing(
  input: V1029CresTurnInput,
  severity: number,
  littoral_zone: number,
): string {
  return (
    `Turn ${input.turn}: littoral_zone ${littoral_zone.toFixed(1)}, severity ${severity.toFixed(1)}, ` +
    `supply bottleneck ${input.supply20bb.bottleneckPressure.toFixed(0)}, ` +
    `grid ${input.energy20bc.gridStability.toFixed(0)}.`
  );
}
