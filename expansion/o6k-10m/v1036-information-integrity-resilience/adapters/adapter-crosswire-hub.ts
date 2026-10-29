import type {
  V1036IiresTurnInput,
  V1036IiresPublicServices20azSlice,
  V1036IiresV1014EnergySlice,
  V1036IiresClimateAdaptation20brSlice,
  V1036IiresV1014SupplySlice,
  V1036IiresV1014TradeSlice,
  V1036IiresV1014WorkforceSlice,
} from '../types/core';
import { V1036_IIRES_clamp } from '../engine/information-integrity-resilience-utils';

export function readV1036IiresSupply20bbBridge(slice: V1036IiresV1014SupplySlice, attestationMeshStressExposureIndex: number) {
  const bottleneckDelta = V1036_IIRES_clamp(slice.bottleneckPressure * 0.04 + attestationMeshStressExposureIndex * 0.06, -12, 18);
  const stockDaysDelta: Partial<Record<string, number>> = {};
  Object.entries(slice.regionalStockDays ?? {}).forEach(([region, days]) => {
    stockDaysDelta[region] = V1036_IIRES_clamp(Number(days) - attestationMeshStressExposureIndex * 0.08, 0, 120);
  });
  return { bottleneckDelta, stockDaysDelta };
}

export function readV1036IiresTrade20baBridge(slice: V1036IiresV1014TradeSlice, heatStressPressure: number) {
  const importStressContribution = V1036_IIRES_clamp(
    slice.sanctionsPressure * 0.01 + slice.importDependencyRatio * 0.12 + heatStressPressure * 0.2,
    0,
    1,
  );
  const laneStabilityDelta = V1036_IIRES_clamp(
    (slice.exportLaneStability - 50) * 0.06 - importStressContribution * 8,
    -10,
    10,
  );
  return { laneStabilityDelta, importStressContribution };
}

export function readV1036IiresEnergy20bcBridge(slice: V1036IiresV1014EnergySlice, attestationMeshStressExposureIndex: number) {
  const gridDrag = V1036_IIRES_clamp((100 - slice.gridStability) * 0.008 + attestationMeshStressExposureIndex * 0.05, 0, 0.55);
  const reserveContribution = V1036_IIRES_clamp(slice.reserveMarginPct * 0.02 - gridDrag * 4, -0.2, 0.35);
  return { gridDrag, reserveContribution };
}

export function readV1036IiresWorkforce20bfBridge(slice: V1036IiresV1014WorkforceSlice, attestationMeshStressExposureIndex: number) {
  const mismatchContribution = V1036_IIRES_clamp(slice.mismatchIndex * 0.01 + attestationMeshStressExposureIndex * 0.04, 0, 1);
  const readinessDelta = V1036_IIRES_clamp(
    (slice.nationalReadiness - 52) * 0.05 - mismatchContribution * 6,
    -9,
    9,
  );
  return { readinessDelta, mismatchContribution };
}

export function readV1036IiresPublicServices20azBridge(
  slice: V1036IiresPublicServices20azSlice,
  attestationMeshStressExposureIndex: number,
) {
  const serviceQueueDelta = V1036_IIRES_clamp(
    (100 - slice.clinicCapacityScore) * 0.05 + slice.serviceDeliveryReadiness * 0.04 + attestationMeshStressExposureIndex * 0.03,
    -8,
    14,
  );
  return { bottleneckDelta: serviceQueueDelta, stockDaysDelta: {}, serviceQueueDelta };
}

export function readV1036IiresClimateAdaptation20brBridge(
  slice: V1036IiresClimateAdaptation20brSlice,
  attestationMeshStressExposureIndex: number,
) {
  const climateAdaptationDelta = V1036_IIRES_clamp(
    slice.heatStressPressure * 0.06 + slice.resilienceDriftTurns * 0.04 + attestationMeshStressExposureIndex * 0.05,
    -6,
    16,
  );
  return { bottleneckDelta: climateAdaptationDelta, stockDaysDelta: {}, climateAdaptationDelta };
}


export function readV1036IiresDigitalGovernance20btBridge(
  slice: import('../types/core').V1036IiresDigitalGovernance20btSlice,
  attestationMeshStressExposureIndex: number,
) {
  const digitalGovernanceDelta = V1036_IIRES_clamp(
    slice.modelGovernancePressure * 0.05 + slice.alignmentDriftTurns * 0.04 + attestationMeshStressExposureIndex * 0.04,
    -6,
    14,
  );
  return { bottleneckDelta: digitalGovernanceDelta, stockDaysDelta: {}, digitalGovernanceDelta };
}


export function readV1036IiresBiodiversityStewardship20buBridge(
  slice: import('../types/core').V1036IiresBiodiversityStewardship20buSlice,
  attestationMeshStressExposureIndex: number,
) {
  const regionalHealthDelta = V1036_IIRES_clamp(
    slice.hospitalSurgePressure * 0.06 + slice.bedCapacityDriftTurns * 0.05 + attestationMeshStressExposureIndex * 0.05,
    -8,
    16,
  );
  return { bottleneckDelta: regionalHealthDelta, stockDaysDelta: {}, regionalHealthDelta };
}


export function readV1036IiresWaterSecurity20bwBridge(
  slice: import('../types/core').V1036IiresWaterSecurity20bwSlice,
  attestationMeshStressExposureIndex: number,
) {
  const sovereignCyberResilienceDelta = V1036_IIRES_clamp(
    slice.gridStressExposurePressure * 0.07 + slice.outageDriftTurns * 0.04 + attestationMeshStressExposureIndex * 0.06,
    -8,
    16,
  );
  return { bottleneckDelta: sovereignCyberResilienceDelta, stockDaysDelta: {}, sovereignCyberResilienceDelta };
}

export function readV1036IiresDisasterResilience20bxBridge(
  slice: import('../types/core').V1036IiresDisasterResilience20bxSlice,
  attestationMeshStressExposureIndex: number,
) {
  const disasterResilienceDelta = V1036_IIRES_clamp(
    slice.compoundHazardLoad * 0.08 + slice.evacuationLagTurns * 0.05 + slice.infrastructureFailurePressure * 0.06 + attestationMeshStressExposureIndex * 0.04,
    -6,
    18,
  );
  return { bottleneckDelta: disasterResilienceDelta, stockDaysDelta: {}, disasterResilienceDelta };
}

export function buildV1036IiresBriefing(
  input: V1036IiresTurnInput,
  severity: number,
  facility_zone: number,
): string {
  return (
    `Turn ${input.turn}: facility_zone ${facility_zone.toFixed(1)}, severity ${severity.toFixed(1)}, ` +
    `supply bottleneck ${input.supply20bb.bottleneckPressure.toFixed(0)}, ` +
    `grid ${input.energy20bc.gridStability.toFixed(0)}.`
  );
}
