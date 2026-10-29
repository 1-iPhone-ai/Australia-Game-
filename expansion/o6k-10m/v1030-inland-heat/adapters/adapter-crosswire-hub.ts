import type {
  V1030IheatTurnInput,
  V1030IheatPublicServices20azSlice,
  V1030IheatV1014EnergySlice,
  V1030IheatClimateAdaptation20brSlice,
  V1030IheatV1014SupplySlice,
  V1030IheatV1014TradeSlice,
  V1030IheatV1014WorkforceSlice,
} from '../types/core';
import { V1030_IHEAT_clamp } from '../engine/inland-heat-utils';

export function readV1030IheatSupply20bbBridge(slice: V1030IheatV1014SupplySlice, inlandHeatExposureIndex: number) {
  const bottleneckDelta = V1030_IHEAT_clamp(slice.bottleneckPressure * 0.04 + inlandHeatExposureIndex * 0.06, -12, 18);
  const stockDaysDelta: Partial<Record<string, number>> = {};
  Object.entries(slice.regionalStockDays ?? {}).forEach(([region, days]) => {
    stockDaysDelta[region] = V1030_IHEAT_clamp(Number(days) - inlandHeatExposureIndex * 0.08, 0, 120);
  });
  return { bottleneckDelta, stockDaysDelta };
}

export function readV1030IheatTrade20baBridge(slice: V1030IheatV1014TradeSlice, heatStressPressure: number) {
  const importStressContribution = V1030_IHEAT_clamp(
    slice.sanctionsPressure * 0.01 + slice.importDependencyRatio * 0.12 + heatStressPressure * 0.2,
    0,
    1,
  );
  const laneStabilityDelta = V1030_IHEAT_clamp(
    (slice.exportLaneStability - 50) * 0.06 - importStressContribution * 8,
    -10,
    10,
  );
  return { laneStabilityDelta, importStressContribution };
}

export function readV1030IheatEnergy20bcBridge(slice: V1030IheatV1014EnergySlice, inlandHeatExposureIndex: number) {
  const gridDrag = V1030_IHEAT_clamp((100 - slice.gridStability) * 0.008 + inlandHeatExposureIndex * 0.05, 0, 0.55);
  const reserveContribution = V1030_IHEAT_clamp(slice.reserveMarginPct * 0.02 - gridDrag * 4, -0.2, 0.35);
  return { gridDrag, reserveContribution };
}

export function readV1030IheatWorkforce20bfBridge(slice: V1030IheatV1014WorkforceSlice, inlandHeatExposureIndex: number) {
  const mismatchContribution = V1030_IHEAT_clamp(slice.mismatchIndex * 0.01 + inlandHeatExposureIndex * 0.04, 0, 1);
  const readinessDelta = V1030_IHEAT_clamp(
    (slice.nationalReadiness - 52) * 0.05 - mismatchContribution * 6,
    -9,
    9,
  );
  return { readinessDelta, mismatchContribution };
}

export function readV1030IheatPublicServices20azBridge(
  slice: V1030IheatPublicServices20azSlice,
  inlandHeatExposureIndex: number,
) {
  const serviceQueueDelta = V1030_IHEAT_clamp(
    (100 - slice.clinicCapacityScore) * 0.05 + slice.serviceDeliveryReadiness * 0.04 + inlandHeatExposureIndex * 0.03,
    -8,
    14,
  );
  return { bottleneckDelta: serviceQueueDelta, stockDaysDelta: {}, serviceQueueDelta };
}

export function readV1030IheatClimateAdaptation20brBridge(
  slice: V1030IheatClimateAdaptation20brSlice,
  inlandHeatExposureIndex: number,
) {
  const climateAdaptationDelta = V1030_IHEAT_clamp(
    slice.heatStressPressure * 0.06 + slice.resilienceDriftTurns * 0.04 + inlandHeatExposureIndex * 0.05,
    -6,
    16,
  );
  return { bottleneckDelta: climateAdaptationDelta, stockDaysDelta: {}, climateAdaptationDelta };
}


export function readV1030IheatDigitalGovernance20btBridge(
  slice: import('../types/core').V1030IheatDigitalGovernance20btSlice,
  inlandHeatExposureIndex: number,
) {
  const digitalGovernanceDelta = V1030_IHEAT_clamp(
    slice.modelGovernancePressure * 0.05 + slice.alignmentDriftTurns * 0.04 + inlandHeatExposureIndex * 0.04,
    -6,
    14,
  );
  return { bottleneckDelta: digitalGovernanceDelta, stockDaysDelta: {}, digitalGovernanceDelta };
}


export function readV1030IheatBiodiversityStewardship20buBridge(
  slice: import('../types/core').V1030IheatBiodiversityStewardship20buSlice,
  inlandHeatExposureIndex: number,
) {
  const regionalHealthDelta = V1030_IHEAT_clamp(
    slice.hospitalSurgePressure * 0.06 + slice.bedCapacityDriftTurns * 0.05 + inlandHeatExposureIndex * 0.05,
    -8,
    16,
  );
  return { bottleneckDelta: regionalHealthDelta, stockDaysDelta: {}, regionalHealthDelta };
}


export function readV1030IheatWaterSecurity20bwBridge(
  slice: import('../types/core').V1030IheatWaterSecurity20bwSlice,
  inlandHeatExposureIndex: number,
) {
  const coastalResilienceDelta = V1030_IHEAT_clamp(
    slice.seaLevelExposurePressure * 0.07 + slice.surgeDriftTurns * 0.04 + inlandHeatExposureIndex * 0.06,
    -8,
    16,
  );
  return { bottleneckDelta: coastalResilienceDelta, stockDaysDelta: {}, coastalResilienceDelta };
}

export function readV1030IheatDisasterResilience20bxBridge(
  slice: import('../types/core').V1030IheatDisasterResilience20bxSlice,
  inlandHeatExposureIndex: number,
) {
  const disasterResilienceDelta = V1030_IHEAT_clamp(
    slice.compoundHazardLoad * 0.08 + slice.evacuationLagTurns * 0.05 + slice.infrastructureFailurePressure * 0.06 + inlandHeatExposureIndex * 0.04,
    -6,
    18,
  );
  return { bottleneckDelta: disasterResilienceDelta, stockDaysDelta: {}, disasterResilienceDelta };
}

export function buildV1030IheatBriefing(
  input: V1030IheatTurnInput,
  severity: number,
  inland_zone: number,
): string {
  return (
    `Turn ${input.turn}: inland_zone ${inland_zone.toFixed(1)}, severity ${severity.toFixed(1)}, ` +
    `supply bottleneck ${input.supply20bb.bottleneckPressure.toFixed(0)}, ` +
    `grid ${input.energy20bc.gridStability.toFixed(0)}.`
  );
}
