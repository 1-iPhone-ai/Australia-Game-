import type {
  V1034CiresTurnInput,
  V1034CiresPublicServices20azSlice,
  V1034CiresV1014EnergySlice,
  V1034CiresClimateAdaptation20brSlice,
  V1034CiresV1014SupplySlice,
  V1034CiresV1014TradeSlice,
  V1034CiresV1014WorkforceSlice,
} from '../types/core';
import { V1034_CIRES_clamp } from '../engine/critical-infrastructure-resilience-utils';

export function readV1034CiresSupply20bbBridge(slice: V1034CiresV1014SupplySlice, cyberPhysicalStressExposureIndex: number) {
  const bottleneckDelta = V1034_CIRES_clamp(slice.bottleneckPressure * 0.04 + cyberPhysicalStressExposureIndex * 0.06, -12, 18);
  const stockDaysDelta: Partial<Record<string, number>> = {};
  Object.entries(slice.regionalStockDays ?? {}).forEach(([region, days]) => {
    stockDaysDelta[region] = V1034_CIRES_clamp(Number(days) - cyberPhysicalStressExposureIndex * 0.08, 0, 120);
  });
  return { bottleneckDelta, stockDaysDelta };
}

export function readV1034CiresTrade20baBridge(slice: V1034CiresV1014TradeSlice, heatStressPressure: number) {
  const importStressContribution = V1034_CIRES_clamp(
    slice.sanctionsPressure * 0.01 + slice.importDependencyRatio * 0.12 + heatStressPressure * 0.2,
    0,
    1,
  );
  const laneStabilityDelta = V1034_CIRES_clamp(
    (slice.exportLaneStability - 50) * 0.06 - importStressContribution * 8,
    -10,
    10,
  );
  return { laneStabilityDelta, importStressContribution };
}

export function readV1034CiresEnergy20bcBridge(slice: V1034CiresV1014EnergySlice, cyberPhysicalStressExposureIndex: number) {
  const gridDrag = V1034_CIRES_clamp((100 - slice.gridStability) * 0.008 + cyberPhysicalStressExposureIndex * 0.05, 0, 0.55);
  const reserveContribution = V1034_CIRES_clamp(slice.reserveMarginPct * 0.02 - gridDrag * 4, -0.2, 0.35);
  return { gridDrag, reserveContribution };
}

export function readV1034CiresWorkforce20bfBridge(slice: V1034CiresV1014WorkforceSlice, cyberPhysicalStressExposureIndex: number) {
  const mismatchContribution = V1034_CIRES_clamp(slice.mismatchIndex * 0.01 + cyberPhysicalStressExposureIndex * 0.04, 0, 1);
  const readinessDelta = V1034_CIRES_clamp(
    (slice.nationalReadiness - 52) * 0.05 - mismatchContribution * 6,
    -9,
    9,
  );
  return { readinessDelta, mismatchContribution };
}

export function readV1034CiresPublicServices20azBridge(
  slice: V1034CiresPublicServices20azSlice,
  cyberPhysicalStressExposureIndex: number,
) {
  const serviceQueueDelta = V1034_CIRES_clamp(
    (100 - slice.clinicCapacityScore) * 0.05 + slice.serviceDeliveryReadiness * 0.04 + cyberPhysicalStressExposureIndex * 0.03,
    -8,
    14,
  );
  return { bottleneckDelta: serviceQueueDelta, stockDaysDelta: {}, serviceQueueDelta };
}

export function readV1034CiresClimateAdaptation20brBridge(
  slice: V1034CiresClimateAdaptation20brSlice,
  cyberPhysicalStressExposureIndex: number,
) {
  const climateAdaptationDelta = V1034_CIRES_clamp(
    slice.heatStressPressure * 0.06 + slice.resilienceDriftTurns * 0.04 + cyberPhysicalStressExposureIndex * 0.05,
    -6,
    16,
  );
  return { bottleneckDelta: climateAdaptationDelta, stockDaysDelta: {}, climateAdaptationDelta };
}


export function readV1034CiresDigitalGovernance20btBridge(
  slice: import('../types/core').V1034CiresDigitalGovernance20btSlice,
  cyberPhysicalStressExposureIndex: number,
) {
  const digitalGovernanceDelta = V1034_CIRES_clamp(
    slice.modelGovernancePressure * 0.05 + slice.alignmentDriftTurns * 0.04 + cyberPhysicalStressExposureIndex * 0.04,
    -6,
    14,
  );
  return { bottleneckDelta: digitalGovernanceDelta, stockDaysDelta: {}, digitalGovernanceDelta };
}


export function readV1034CiresBiodiversityStewardship20buBridge(
  slice: import('../types/core').V1034CiresBiodiversityStewardship20buSlice,
  cyberPhysicalStressExposureIndex: number,
) {
  const regionalHealthDelta = V1034_CIRES_clamp(
    slice.hospitalSurgePressure * 0.06 + slice.bedCapacityDriftTurns * 0.05 + cyberPhysicalStressExposureIndex * 0.05,
    -8,
    16,
  );
  return { bottleneckDelta: regionalHealthDelta, stockDaysDelta: {}, regionalHealthDelta };
}


export function readV1034CiresWaterSecurity20bwBridge(
  slice: import('../types/core').V1034CiresWaterSecurity20bwSlice,
  cyberPhysicalStressExposureIndex: number,
) {
  const supplyChainResilienceDelta = V1034_CIRES_clamp(
    slice.gridStressExposurePressure * 0.07 + slice.outageDriftTurns * 0.04 + cyberPhysicalStressExposureIndex * 0.06,
    -8,
    16,
  );
  return { bottleneckDelta: supplyChainResilienceDelta, stockDaysDelta: {}, supplyChainResilienceDelta };
}

export function readV1034CiresDisasterResilience20bxBridge(
  slice: import('../types/core').V1034CiresDisasterResilience20bxSlice,
  cyberPhysicalStressExposureIndex: number,
) {
  const disasterResilienceDelta = V1034_CIRES_clamp(
    slice.compoundHazardLoad * 0.08 + slice.evacuationLagTurns * 0.05 + slice.infrastructureFailurePressure * 0.06 + cyberPhysicalStressExposureIndex * 0.04,
    -6,
    18,
  );
  return { bottleneckDelta: disasterResilienceDelta, stockDaysDelta: {}, disasterResilienceDelta };
}

export function buildV1034CiresBriefing(
  input: V1034CiresTurnInput,
  severity: number,
  facility_zone: number,
): string {
  return (
    `Turn ${input.turn}: facility_zone ${facility_zone.toFixed(1)}, severity ${severity.toFixed(1)}, ` +
    `supply bottleneck ${input.supply20bb.bottleneckPressure.toFixed(0)}, ` +
    `grid ${input.energy20bc.gridStability.toFixed(0)}.`
  );
}
