import type {
  V1027WsecTurnInput,
  V1027WsecPublicServices20azSlice,
  V1027WsecV1014EnergySlice,
  V1027WsecClimateAdaptation20brSlice,
  V1027WsecV1014SupplySlice,
  V1027WsecV1014TradeSlice,
  V1027WsecV1014WorkforceSlice,
} from '../types/core';
import { V1027_WSEC_clamp } from '../engine/water-security-utils';

export function readV1027WsecSupply20bbBridge(slice: V1027WsecV1014SupplySlice, waterStressIndex: number) {
  const bottleneckDelta = V1027_WSEC_clamp(slice.bottleneckPressure * 0.04 + waterStressIndex * 0.06, -12, 18);
  const stockDaysDelta: Partial<Record<string, number>> = {};
  Object.entries(slice.regionalStockDays ?? {}).forEach(([region, days]) => {
    stockDaysDelta[region] = V1027_WSEC_clamp(Number(days) - waterStressIndex * 0.08, 0, 120);
  });
  return { bottleneckDelta, stockDaysDelta };
}

export function readV1027WsecTrade20baBridge(slice: V1027WsecV1014TradeSlice, heatStressPressure: number) {
  const importStressContribution = V1027_WSEC_clamp(
    slice.sanctionsPressure * 0.01 + slice.importDependencyRatio * 0.12 + heatStressPressure * 0.2,
    0,
    1,
  );
  const laneStabilityDelta = V1027_WSEC_clamp(
    (slice.exportLaneStability - 50) * 0.06 - importStressContribution * 8,
    -10,
    10,
  );
  return { laneStabilityDelta, importStressContribution };
}

export function readV1027WsecEnergy20bcBridge(slice: V1027WsecV1014EnergySlice, waterStressIndex: number) {
  const gridDrag = V1027_WSEC_clamp((100 - slice.gridStability) * 0.008 + waterStressIndex * 0.05, 0, 0.55);
  const reserveContribution = V1027_WSEC_clamp(slice.reserveMarginPct * 0.02 - gridDrag * 4, -0.2, 0.35);
  return { gridDrag, reserveContribution };
}

export function readV1027WsecWorkforce20bfBridge(slice: V1027WsecV1014WorkforceSlice, waterStressIndex: number) {
  const mismatchContribution = V1027_WSEC_clamp(slice.mismatchIndex * 0.01 + waterStressIndex * 0.04, 0, 1);
  const readinessDelta = V1027_WSEC_clamp(
    (slice.nationalReadiness - 52) * 0.05 - mismatchContribution * 6,
    -9,
    9,
  );
  return { readinessDelta, mismatchContribution };
}

export function readV1027WsecPublicServices20azBridge(
  slice: V1027WsecPublicServices20azSlice,
  waterStressIndex: number,
) {
  const serviceQueueDelta = V1027_WSEC_clamp(
    (100 - slice.clinicCapacityScore) * 0.05 + slice.serviceDeliveryReadiness * 0.04 + waterStressIndex * 0.03,
    -8,
    14,
  );
  return { bottleneckDelta: serviceQueueDelta, stockDaysDelta: {}, serviceQueueDelta };
}

export function readV1027WsecClimateAdaptation20brBridge(
  slice: V1027WsecClimateAdaptation20brSlice,
  waterStressIndex: number,
) {
  const climateAdaptationDelta = V1027_WSEC_clamp(
    slice.heatStressPressure * 0.06 + slice.resilienceDriftTurns * 0.04 + waterStressIndex * 0.05,
    -6,
    16,
  );
  return { bottleneckDelta: climateAdaptationDelta, stockDaysDelta: {}, climateAdaptationDelta };
}


export function readV1027WsecDigitalGovernance20btBridge(
  slice: import('../types/core').V1027WsecDigitalGovernance20btSlice,
  waterStressIndex: number,
) {
  const digitalGovernanceDelta = V1027_WSEC_clamp(
    slice.modelGovernancePressure * 0.05 + slice.alignmentDriftTurns * 0.04 + waterStressIndex * 0.04,
    -6,
    14,
  );
  return { bottleneckDelta: digitalGovernanceDelta, stockDaysDelta: {}, digitalGovernanceDelta };
}


export function readV1027WsecBiodiversityStewardship20buBridge(
  slice: import('../types/core').V1027WsecBiodiversityStewardship20buSlice,
  waterStressIndex: number,
) {
  const biodiversityStewardshipDelta = V1027_WSEC_clamp(
    slice.catchmentIntegrityPressure * 0.06 + slice.offsetDriftTurns * 0.05 + waterStressIndex * 0.05,
    -8,
    16,
  );
  return { bottleneckDelta: biodiversityStewardshipDelta, stockDaysDelta: {}, biodiversityStewardshipDelta };
}

export function buildV1027WsecBriefing(
  input: V1027WsecTurnInput,
  severity: number,
  distribution_network: number,
): string {
  return (
    `Turn ${input.turn}: distribution_network ${distribution_network.toFixed(1)}, severity ${severity.toFixed(1)}, ` +
    `supply bottleneck ${input.supply20bb.bottleneckPressure.toFixed(0)}, ` +
    `grid ${input.energy20bc.gridStability.toFixed(0)}.`
  );
}
