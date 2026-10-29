import type {
  V1037PcresTurnInput,
  V1037PcresPublicServices20azSlice,
  V1037PcresV1014EnergySlice,
  V1037PcresClimateAdaptation20brSlice,
  V1037PcresV1014SupplySlice,
  V1037PcresV1014TradeSlice,
  V1037PcresV1014WorkforceSlice,
} from '../types/core';
import { V1037_PCRS_clamp } from '../engine/provenance-chain-resilience-utils';

export function readV1037PcresSupply20bbBridge(slice: V1037PcresV1014SupplySlice, custodyChainStressExposureIndex: number) {
  const bottleneckDelta = V1037_PCRS_clamp(slice.bottleneckPressure * 0.04 + custodyChainStressExposureIndex * 0.06, -12, 18);
  const stockDaysDelta: Partial<Record<string, number>> = {};
  Object.entries(slice.regionalStockDays ?? {}).forEach(([region, days]) => {
    stockDaysDelta[region] = V1037_PCRS_clamp(Number(days) - custodyChainStressExposureIndex * 0.08, 0, 120);
  });
  return { bottleneckDelta, stockDaysDelta };
}

export function readV1037PcresTrade20baBridge(slice: V1037PcresV1014TradeSlice, heatStressPressure: number) {
  const importStressContribution = V1037_PCRS_clamp(
    slice.sanctionsPressure * 0.01 + slice.importDependencyRatio * 0.12 + heatStressPressure * 0.2,
    0,
    1,
  );
  const laneStabilityDelta = V1037_PCRS_clamp(
    (slice.exportLaneStability - 50) * 0.06 - importStressContribution * 8,
    -10,
    10,
  );
  return { laneStabilityDelta, importStressContribution };
}

export function readV1037PcresEnergy20bcBridge(slice: V1037PcresV1014EnergySlice, custodyChainStressExposureIndex: number) {
  const gridDrag = V1037_PCRS_clamp((100 - slice.gridStability) * 0.008 + custodyChainStressExposureIndex * 0.05, 0, 0.55);
  const reserveContribution = V1037_PCRS_clamp(slice.reserveMarginPct * 0.02 - gridDrag * 4, -0.2, 0.35);
  return { gridDrag, reserveContribution };
}

export function readV1037PcresWorkforce20bfBridge(slice: V1037PcresV1014WorkforceSlice, custodyChainStressExposureIndex: number) {
  const mismatchContribution = V1037_PCRS_clamp(slice.mismatchIndex * 0.01 + custodyChainStressExposureIndex * 0.04, 0, 1);
  const readinessDelta = V1037_PCRS_clamp(
    (slice.nationalReadiness - 52) * 0.05 - mismatchContribution * 6,
    -9,
    9,
  );
  return { readinessDelta, mismatchContribution };
}

export function readV1037PcresPublicServices20azBridge(
  slice: V1037PcresPublicServices20azSlice,
  custodyChainStressExposureIndex: number,
) {
  const serviceQueueDelta = V1037_PCRS_clamp(
    (100 - slice.clinicCapacityScore) * 0.05 + slice.serviceDeliveryReadiness * 0.04 + custodyChainStressExposureIndex * 0.03,
    -8,
    14,
  );
  return { bottleneckDelta: serviceQueueDelta, stockDaysDelta: {}, serviceQueueDelta };
}

export function readV1037PcresClimateAdaptation20brBridge(
  slice: V1037PcresClimateAdaptation20brSlice,
  custodyChainStressExposureIndex: number,
) {
  const climateAdaptationDelta = V1037_PCRS_clamp(
    slice.heatStressPressure * 0.06 + slice.resilienceDriftTurns * 0.04 + custodyChainStressExposureIndex * 0.05,
    -6,
    16,
  );
  return { bottleneckDelta: climateAdaptationDelta, stockDaysDelta: {}, climateAdaptationDelta };
}


export function readV1037PcresDigitalGovernance20btBridge(
  slice: import('../types/core').V1037PcresDigitalGovernance20btSlice,
  custodyChainStressExposureIndex: number,
) {
  const digitalGovernanceDelta = V1037_PCRS_clamp(
    slice.modelGovernancePressure * 0.05 + slice.alignmentDriftTurns * 0.04 + custodyChainStressExposureIndex * 0.04,
    -6,
    14,
  );
  return { bottleneckDelta: digitalGovernanceDelta, stockDaysDelta: {}, digitalGovernanceDelta };
}


export function readV1037PcresBiodiversityStewardship20buBridge(
  slice: import('../types/core').V1037PcresBiodiversityStewardship20buSlice,
  custodyChainStressExposureIndex: number,
) {
  const regionalHealthDelta = V1037_PCRS_clamp(
    slice.hospitalSurgePressure * 0.06 + slice.bedCapacityDriftTurns * 0.05 + custodyChainStressExposureIndex * 0.05,
    -8,
    16,
  );
  return { bottleneckDelta: regionalHealthDelta, stockDaysDelta: {}, regionalHealthDelta };
}


export function readV1037PcresWaterSecurity20bwBridge(
  slice: import('../types/core').V1037PcresWaterSecurity20bwSlice,
  custodyChainStressExposureIndex: number,
) {
  const informationIntegrityResilienceDelta = V1037_PCRS_clamp(
    slice.gridStressExposurePressure * 0.07 + slice.outageDriftTurns * 0.04 + custodyChainStressExposureIndex * 0.06,
    -8,
    16,
  );
  return { bottleneckDelta: informationIntegrityResilienceDelta, stockDaysDelta: {}, informationIntegrityResilienceDelta };
}

export function readV1037PcresDisasterResilience20bxBridge(
  slice: import('../types/core').V1037PcresDisasterResilience20bxSlice,
  custodyChainStressExposureIndex: number,
) {
  const disasterResilienceDelta = V1037_PCRS_clamp(
    slice.compoundHazardLoad * 0.08 + slice.evacuationLagTurns * 0.05 + slice.infrastructureFailurePressure * 0.06 + custodyChainStressExposureIndex * 0.04,
    -6,
    18,
  );
  return { bottleneckDelta: disasterResilienceDelta, stockDaysDelta: {}, disasterResilienceDelta };
}

export function buildV1037PcresBriefing(
  input: V1037PcresTurnInput,
  severity: number,
  facility_zone: number,
): string {
  return (
    `Turn ${input.turn}: facility_zone ${facility_zone.toFixed(1)}, severity ${severity.toFixed(1)}, ` +
    `supply bottleneck ${input.supply20bb.bottleneckPressure.toFixed(0)}, ` +
    `grid ${input.energy20bc.gridStability.toFixed(0)}.`
  );
}
