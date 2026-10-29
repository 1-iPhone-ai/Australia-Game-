import type {
  V1028DresTurnInput,
  V1028DresPublicServices20azSlice,
  V1028DresV1014EnergySlice,
  V1028DresClimateAdaptation20brSlice,
  V1028DresV1014SupplySlice,
  V1028DresV1014TradeSlice,
  V1028DresV1014WorkforceSlice,
} from '../types/core';
import { V1028_DRES_clamp } from '../engine/disaster-resilience-utils';

export function readV1028DresSupply20bbBridge(slice: V1028DresV1014SupplySlice, disasterRiskIndex: number) {
  const bottleneckDelta = V1028_DRES_clamp(slice.bottleneckPressure * 0.04 + disasterRiskIndex * 0.06, -12, 18);
  const stockDaysDelta: Partial<Record<string, number>> = {};
  Object.entries(slice.regionalStockDays ?? {}).forEach(([region, days]) => {
    stockDaysDelta[region] = V1028_DRES_clamp(Number(days) - disasterRiskIndex * 0.08, 0, 120);
  });
  return { bottleneckDelta, stockDaysDelta };
}

export function readV1028DresTrade20baBridge(slice: V1028DresV1014TradeSlice, heatStressPressure: number) {
  const importStressContribution = V1028_DRES_clamp(
    slice.sanctionsPressure * 0.01 + slice.importDependencyRatio * 0.12 + heatStressPressure * 0.2,
    0,
    1,
  );
  const laneStabilityDelta = V1028_DRES_clamp(
    (slice.exportLaneStability - 50) * 0.06 - importStressContribution * 8,
    -10,
    10,
  );
  return { laneStabilityDelta, importStressContribution };
}

export function readV1028DresEnergy20bcBridge(slice: V1028DresV1014EnergySlice, disasterRiskIndex: number) {
  const gridDrag = V1028_DRES_clamp((100 - slice.gridStability) * 0.008 + disasterRiskIndex * 0.05, 0, 0.55);
  const reserveContribution = V1028_DRES_clamp(slice.reserveMarginPct * 0.02 - gridDrag * 4, -0.2, 0.35);
  return { gridDrag, reserveContribution };
}

export function readV1028DresWorkforce20bfBridge(slice: V1028DresV1014WorkforceSlice, disasterRiskIndex: number) {
  const mismatchContribution = V1028_DRES_clamp(slice.mismatchIndex * 0.01 + disasterRiskIndex * 0.04, 0, 1);
  const readinessDelta = V1028_DRES_clamp(
    (slice.nationalReadiness - 52) * 0.05 - mismatchContribution * 6,
    -9,
    9,
  );
  return { readinessDelta, mismatchContribution };
}

export function readV1028DresPublicServices20azBridge(
  slice: V1028DresPublicServices20azSlice,
  disasterRiskIndex: number,
) {
  const serviceQueueDelta = V1028_DRES_clamp(
    (100 - slice.clinicCapacityScore) * 0.05 + slice.serviceDeliveryReadiness * 0.04 + disasterRiskIndex * 0.03,
    -8,
    14,
  );
  return { bottleneckDelta: serviceQueueDelta, stockDaysDelta: {}, serviceQueueDelta };
}

export function readV1028DresClimateAdaptation20brBridge(
  slice: V1028DresClimateAdaptation20brSlice,
  disasterRiskIndex: number,
) {
  const climateAdaptationDelta = V1028_DRES_clamp(
    slice.heatStressPressure * 0.06 + slice.resilienceDriftTurns * 0.04 + disasterRiskIndex * 0.05,
    -6,
    16,
  );
  return { bottleneckDelta: climateAdaptationDelta, stockDaysDelta: {}, climateAdaptationDelta };
}


export function readV1028DresDigitalGovernance20btBridge(
  slice: import('../types/core').V1028DresDigitalGovernance20btSlice,
  disasterRiskIndex: number,
) {
  const digitalGovernanceDelta = V1028_DRES_clamp(
    slice.modelGovernancePressure * 0.05 + slice.alignmentDriftTurns * 0.04 + disasterRiskIndex * 0.04,
    -6,
    14,
  );
  return { bottleneckDelta: digitalGovernanceDelta, stockDaysDelta: {}, digitalGovernanceDelta };
}


export function readV1028DresBiodiversityStewardship20buBridge(
  slice: import('../types/core').V1028DresBiodiversityStewardship20buSlice,
  disasterRiskIndex: number,
) {
  const regionalHealthDelta = V1028_DRES_clamp(
    slice.hospitalSurgePressure * 0.06 + slice.bedCapacityDriftTurns * 0.05 + disasterRiskIndex * 0.05,
    -8,
    16,
  );
  return { bottleneckDelta: regionalHealthDelta, stockDaysDelta: {}, regionalHealthDelta };
}


export function readV1028DresWaterSecurity20bwBridge(
  slice: import('../types/core').V1028DresWaterSecurity20bwSlice,
  disasterRiskIndex: number,
) {
  const waterSecurityDelta = V1028_DRES_clamp(
    slice.supplyStressPressure * 0.07 + slice.basinDriftTurns * 0.04 + disasterRiskIndex * 0.06,
    -8,
    16,
  );
  return { bottleneckDelta: waterSecurityDelta, stockDaysDelta: {}, waterSecurityDelta };
}

export function readV1028DresCrisisSpine20asBridge(
  slice: import('../types/core').V1028DresCrisisSpine20asSlice,
  disasterRiskIndex: number,
) {
  const crisisSpineDelta = V1028_DRES_clamp(
    slice.activeCrisisLoad * 0.08 + slice.coordinationLagTurns * 0.05 + slice.escalationPressure * 0.06 + disasterRiskIndex * 0.04,
    -6,
    18,
  );
  return { bottleneckDelta: crisisSpineDelta, stockDaysDelta: {}, crisisSpineDelta };
}

export function buildV1028DresBriefing(
  input: V1028DresTurnInput,
  severity: number,
  emergency_response: number,
): string {
  return (
    `Turn ${input.turn}: emergency_response ${emergency_response.toFixed(1)}, severity ${severity.toFixed(1)}, ` +
    `supply bottleneck ${input.supply20bb.bottleneckPressure.toFixed(0)}, ` +
    `grid ${input.energy20bc.gridStability.toFixed(0)}.`
  );
}
