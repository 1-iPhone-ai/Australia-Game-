import type {
  V1031GresTurnInput,
  V1031GresPublicServices20azSlice,
  V1031GresV1014EnergySlice,
  V1031GresClimateAdaptation20brSlice,
  V1031GresV1014SupplySlice,
  V1031GresV1014TradeSlice,
  V1031GresV1014WorkforceSlice,
} from '../types/core';
import { V1031_GRES_clamp } from '../engine/grid-resilience-utils';

export function readV1031GresSupply20bbBridge(slice: V1031GresV1014SupplySlice, gridStressExposureIndex: number) {
  const bottleneckDelta = V1031_GRES_clamp(slice.bottleneckPressure * 0.04 + gridStressExposureIndex * 0.06, -12, 18);
  const stockDaysDelta: Partial<Record<string, number>> = {};
  Object.entries(slice.regionalStockDays ?? {}).forEach(([region, days]) => {
    stockDaysDelta[region] = V1031_GRES_clamp(Number(days) - gridStressExposureIndex * 0.08, 0, 120);
  });
  return { bottleneckDelta, stockDaysDelta };
}

export function readV1031GresTrade20baBridge(slice: V1031GresV1014TradeSlice, heatStressPressure: number) {
  const importStressContribution = V1031_GRES_clamp(
    slice.sanctionsPressure * 0.01 + slice.importDependencyRatio * 0.12 + heatStressPressure * 0.2,
    0,
    1,
  );
  const laneStabilityDelta = V1031_GRES_clamp(
    (slice.exportLaneStability - 50) * 0.06 - importStressContribution * 8,
    -10,
    10,
  );
  return { laneStabilityDelta, importStressContribution };
}

export function readV1031GresEnergy20bcBridge(slice: V1031GresV1014EnergySlice, gridStressExposureIndex: number) {
  const gridDrag = V1031_GRES_clamp((100 - slice.gridStability) * 0.008 + gridStressExposureIndex * 0.05, 0, 0.55);
  const reserveContribution = V1031_GRES_clamp(slice.reserveMarginPct * 0.02 - gridDrag * 4, -0.2, 0.35);
  return { gridDrag, reserveContribution };
}

export function readV1031GresWorkforce20bfBridge(slice: V1031GresV1014WorkforceSlice, gridStressExposureIndex: number) {
  const mismatchContribution = V1031_GRES_clamp(slice.mismatchIndex * 0.01 + gridStressExposureIndex * 0.04, 0, 1);
  const readinessDelta = V1031_GRES_clamp(
    (slice.nationalReadiness - 52) * 0.05 - mismatchContribution * 6,
    -9,
    9,
  );
  return { readinessDelta, mismatchContribution };
}

export function readV1031GresPublicServices20azBridge(
  slice: V1031GresPublicServices20azSlice,
  gridStressExposureIndex: number,
) {
  const serviceQueueDelta = V1031_GRES_clamp(
    (100 - slice.clinicCapacityScore) * 0.05 + slice.serviceDeliveryReadiness * 0.04 + gridStressExposureIndex * 0.03,
    -8,
    14,
  );
  return { bottleneckDelta: serviceQueueDelta, stockDaysDelta: {}, serviceQueueDelta };
}

export function readV1031GresClimateAdaptation20brBridge(
  slice: V1031GresClimateAdaptation20brSlice,
  gridStressExposureIndex: number,
) {
  const climateAdaptationDelta = V1031_GRES_clamp(
    slice.heatStressPressure * 0.06 + slice.resilienceDriftTurns * 0.04 + gridStressExposureIndex * 0.05,
    -6,
    16,
  );
  return { bottleneckDelta: climateAdaptationDelta, stockDaysDelta: {}, climateAdaptationDelta };
}


export function readV1031GresDigitalGovernance20btBridge(
  slice: import('../types/core').V1031GresDigitalGovernance20btSlice,
  gridStressExposureIndex: number,
) {
  const digitalGovernanceDelta = V1031_GRES_clamp(
    slice.modelGovernancePressure * 0.05 + slice.alignmentDriftTurns * 0.04 + gridStressExposureIndex * 0.04,
    -6,
    14,
  );
  return { bottleneckDelta: digitalGovernanceDelta, stockDaysDelta: {}, digitalGovernanceDelta };
}


export function readV1031GresBiodiversityStewardship20buBridge(
  slice: import('../types/core').V1031GresBiodiversityStewardship20buSlice,
  gridStressExposureIndex: number,
) {
  const regionalHealthDelta = V1031_GRES_clamp(
    slice.hospitalSurgePressure * 0.06 + slice.bedCapacityDriftTurns * 0.05 + gridStressExposureIndex * 0.05,
    -8,
    16,
  );
  return { bottleneckDelta: regionalHealthDelta, stockDaysDelta: {}, regionalHealthDelta };
}


export function readV1031GresWaterSecurity20bwBridge(
  slice: import('../types/core').V1031GresWaterSecurity20bwSlice,
  gridStressExposureIndex: number,
) {
  const inlandHeatDelta = V1031_GRES_clamp(
    slice.inlandHeatExposurePressure * 0.07 + slice.heatwaveDriftTurns * 0.04 + gridStressExposureIndex * 0.06,
    -8,
    16,
  );
  return { bottleneckDelta: inlandHeatDelta, stockDaysDelta: {}, inlandHeatDelta };
}

export function readV1031GresDisasterResilience20bxBridge(
  slice: import('../types/core').V1031GresDisasterResilience20bxSlice,
  gridStressExposureIndex: number,
) {
  const disasterResilienceDelta = V1031_GRES_clamp(
    slice.compoundHazardLoad * 0.08 + slice.evacuationLagTurns * 0.05 + slice.infrastructureFailurePressure * 0.06 + gridStressExposureIndex * 0.04,
    -6,
    18,
  );
  return { bottleneckDelta: disasterResilienceDelta, stockDaysDelta: {}, disasterResilienceDelta };
}

export function buildV1031GresBriefing(
  input: V1031GresTurnInput,
  severity: number,
  substation_zone: number,
): string {
  return (
    `Turn ${input.turn}: substation_zone ${substation_zone.toFixed(1)}, severity ${severity.toFixed(1)}, ` +
    `supply bottleneck ${input.supply20bb.bottleneckPressure.toFixed(0)}, ` +
    `grid ${input.energy20bc.gridStability.toFixed(0)}.`
  );
}
