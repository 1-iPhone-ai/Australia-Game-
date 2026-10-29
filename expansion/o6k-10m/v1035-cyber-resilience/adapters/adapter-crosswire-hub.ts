import type {
  V1035CyresTurnInput,
  V1035CyresPublicServices20azSlice,
  V1035CyresV1014EnergySlice,
  V1035CyresClimateAdaptation20brSlice,
  V1035CyresV1014SupplySlice,
  V1035CyresV1014TradeSlice,
  V1035CyresV1014WorkforceSlice,
} from '../types/core';
import { V1035_CYRES_clamp } from '../engine/cyber-resilience-utils';

export function readV1035CyresSupply20bbBridge(slice: V1035CyresV1014SupplySlice, sovereignDigitalStressExposureIndex: number) {
  const bottleneckDelta = V1035_CYRES_clamp(slice.bottleneckPressure * 0.04 + sovereignDigitalStressExposureIndex * 0.06, -12, 18);
  const stockDaysDelta: Partial<Record<string, number>> = {};
  Object.entries(slice.regionalStockDays ?? {}).forEach(([region, days]) => {
    stockDaysDelta[region] = V1035_CYRES_clamp(Number(days) - sovereignDigitalStressExposureIndex * 0.08, 0, 120);
  });
  return { bottleneckDelta, stockDaysDelta };
}

export function readV1035CyresTrade20baBridge(slice: V1035CyresV1014TradeSlice, heatStressPressure: number) {
  const importStressContribution = V1035_CYRES_clamp(
    slice.sanctionsPressure * 0.01 + slice.importDependencyRatio * 0.12 + heatStressPressure * 0.2,
    0,
    1,
  );
  const laneStabilityDelta = V1035_CYRES_clamp(
    (slice.exportLaneStability - 50) * 0.06 - importStressContribution * 8,
    -10,
    10,
  );
  return { laneStabilityDelta, importStressContribution };
}

export function readV1035CyresEnergy20bcBridge(slice: V1035CyresV1014EnergySlice, sovereignDigitalStressExposureIndex: number) {
  const gridDrag = V1035_CYRES_clamp((100 - slice.gridStability) * 0.008 + sovereignDigitalStressExposureIndex * 0.05, 0, 0.55);
  const reserveContribution = V1035_CYRES_clamp(slice.reserveMarginPct * 0.02 - gridDrag * 4, -0.2, 0.35);
  return { gridDrag, reserveContribution };
}

export function readV1035CyresWorkforce20bfBridge(slice: V1035CyresV1014WorkforceSlice, sovereignDigitalStressExposureIndex: number) {
  const mismatchContribution = V1035_CYRES_clamp(slice.mismatchIndex * 0.01 + sovereignDigitalStressExposureIndex * 0.04, 0, 1);
  const readinessDelta = V1035_CYRES_clamp(
    (slice.nationalReadiness - 52) * 0.05 - mismatchContribution * 6,
    -9,
    9,
  );
  return { readinessDelta, mismatchContribution };
}

export function readV1035CyresPublicServices20azBridge(
  slice: V1035CyresPublicServices20azSlice,
  sovereignDigitalStressExposureIndex: number,
) {
  const serviceQueueDelta = V1035_CYRES_clamp(
    (100 - slice.clinicCapacityScore) * 0.05 + slice.serviceDeliveryReadiness * 0.04 + sovereignDigitalStressExposureIndex * 0.03,
    -8,
    14,
  );
  return { bottleneckDelta: serviceQueueDelta, stockDaysDelta: {}, serviceQueueDelta };
}

export function readV1035CyresClimateAdaptation20brBridge(
  slice: V1035CyresClimateAdaptation20brSlice,
  sovereignDigitalStressExposureIndex: number,
) {
  const climateAdaptationDelta = V1035_CYRES_clamp(
    slice.heatStressPressure * 0.06 + slice.resilienceDriftTurns * 0.04 + sovereignDigitalStressExposureIndex * 0.05,
    -6,
    16,
  );
  return { bottleneckDelta: climateAdaptationDelta, stockDaysDelta: {}, climateAdaptationDelta };
}


export function readV1035CyresDigitalGovernance20btBridge(
  slice: import('../types/core').V1035CyresDigitalGovernance20btSlice,
  sovereignDigitalStressExposureIndex: number,
) {
  const digitalGovernanceDelta = V1035_CYRES_clamp(
    slice.modelGovernancePressure * 0.05 + slice.alignmentDriftTurns * 0.04 + sovereignDigitalStressExposureIndex * 0.04,
    -6,
    14,
  );
  return { bottleneckDelta: digitalGovernanceDelta, stockDaysDelta: {}, digitalGovernanceDelta };
}


export function readV1035CyresBiodiversityStewardship20buBridge(
  slice: import('../types/core').V1035CyresBiodiversityStewardship20buSlice,
  sovereignDigitalStressExposureIndex: number,
) {
  const regionalHealthDelta = V1035_CYRES_clamp(
    slice.hospitalSurgePressure * 0.06 + slice.bedCapacityDriftTurns * 0.05 + sovereignDigitalStressExposureIndex * 0.05,
    -8,
    16,
  );
  return { bottleneckDelta: regionalHealthDelta, stockDaysDelta: {}, regionalHealthDelta };
}


export function readV1035CyresWaterSecurity20bwBridge(
  slice: import('../types/core').V1035CyresWaterSecurity20bwSlice,
  sovereignDigitalStressExposureIndex: number,
) {
  const criticalInfrastructureResilienceDelta = V1035_CYRES_clamp(
    slice.gridStressExposurePressure * 0.07 + slice.outageDriftTurns * 0.04 + sovereignDigitalStressExposureIndex * 0.06,
    -8,
    16,
  );
  return { bottleneckDelta: criticalInfrastructureResilienceDelta, stockDaysDelta: {}, criticalInfrastructureResilienceDelta };
}

export function readV1035CyresDisasterResilience20bxBridge(
  slice: import('../types/core').V1035CyresDisasterResilience20bxSlice,
  sovereignDigitalStressExposureIndex: number,
) {
  const disasterResilienceDelta = V1035_CYRES_clamp(
    slice.compoundHazardLoad * 0.08 + slice.evacuationLagTurns * 0.05 + slice.infrastructureFailurePressure * 0.06 + sovereignDigitalStressExposureIndex * 0.04,
    -6,
    18,
  );
  return { bottleneckDelta: disasterResilienceDelta, stockDaysDelta: {}, disasterResilienceDelta };
}

export function buildV1035CyresBriefing(
  input: V1035CyresTurnInput,
  severity: number,
  facility_zone: number,
): string {
  return (
    `Turn ${input.turn}: facility_zone ${facility_zone.toFixed(1)}, severity ${severity.toFixed(1)}, ` +
    `supply bottleneck ${input.supply20bb.bottleneckPressure.toFixed(0)}, ` +
    `grid ${input.energy20bc.gridStability.toFixed(0)}.`
  );
}
