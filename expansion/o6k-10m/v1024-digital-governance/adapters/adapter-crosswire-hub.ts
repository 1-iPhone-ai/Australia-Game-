import type {
  V1024DgovTurnInput,
  V1024DgovPublicServices20azSlice,
  V1024DgovV1014EnergySlice,
  V1024DgovAiFidelity20beSlice,
  V1024DgovV1014SupplySlice,
  V1024DgovV1014TradeSlice,
  V1024DgovV1014WorkforceSlice,
} from '../types/core';
import { V1024_DGOV_clamp } from '../engine/digital-governance-utils';

export function readV1024DgovSupply20bbBridge(slice: V1024DgovV1014SupplySlice, complianceStressIndex: number) {
  const bottleneckDelta = V1024_DGOV_clamp(slice.bottleneckPressure * 0.04 + complianceStressIndex * 0.06, -12, 18);
  const stockDaysDelta: Partial<Record<string, number>> = {};
  Object.entries(slice.regionalStockDays ?? {}).forEach(([region, days]) => {
    stockDaysDelta[region] = V1024_DGOV_clamp(Number(days) - complianceStressIndex * 0.08, 0, 120);
  });
  return { bottleneckDelta, stockDaysDelta };
}

export function readV1024DgovTrade20baBridge(slice: V1024DgovV1014TradeSlice, modelGovernancePressure: number) {
  const importStressContribution = V1024_DGOV_clamp(
    slice.sanctionsPressure * 0.01 + slice.importDependencyRatio * 0.12 + modelGovernancePressure * 0.2,
    0,
    1,
  );
  const laneStabilityDelta = V1024_DGOV_clamp(
    (slice.exportLaneStability - 50) * 0.06 - importStressContribution * 8,
    -10,
    10,
  );
  return { laneStabilityDelta, importStressContribution };
}

export function readV1024DgovEnergy20bcBridge(slice: V1024DgovV1014EnergySlice, complianceStressIndex: number) {
  const gridDrag = V1024_DGOV_clamp((100 - slice.gridStability) * 0.008 + complianceStressIndex * 0.05, 0, 0.55);
  const reserveContribution = V1024_DGOV_clamp(slice.reserveMarginPct * 0.02 - gridDrag * 4, -0.2, 0.35);
  return { gridDrag, reserveContribution };
}

export function readV1024DgovWorkforce20bfBridge(slice: V1024DgovV1014WorkforceSlice, complianceStressIndex: number) {
  const mismatchContribution = V1024_DGOV_clamp(slice.mismatchIndex * 0.01 + complianceStressIndex * 0.04, 0, 1);
  const readinessDelta = V1024_DGOV_clamp(
    (slice.nationalReadiness - 52) * 0.05 - mismatchContribution * 6,
    -9,
    9,
  );
  return { readinessDelta, mismatchContribution };
}

export function readV1024DgovPublicServices20azBridge(
  slice: V1024DgovPublicServices20azSlice,
  complianceStressIndex: number,
) {
  const serviceQueueDelta = V1024_DGOV_clamp(
    (100 - slice.clinicCapacityScore) * 0.05 + slice.serviceDeliveryReadiness * 0.04 + complianceStressIndex * 0.03,
    -8,
    14,
  );
  return { bottleneckDelta: serviceQueueDelta, stockDaysDelta: {}, serviceQueueDelta };
}

export function readV1024DgovAiFidelity20beBridge(
  slice: V1024DgovAiFidelity20beSlice,
  complianceStressIndex: number,
) {
  const aiFidelityDelta = V1024_DGOV_clamp(
    slice.modelGovernancePressure * 0.06 + slice.alignmentDriftTurns * 0.04 + complianceStressIndex * 0.05,
    -6,
    16,
  );
  return { bottleneckDelta: aiFidelityDelta, stockDaysDelta: {}, aiFidelityDelta };
}

export function buildV1024DgovBriefing(
  input: V1024DgovTurnInput,
  severity: number,
  platform_node: number,
): string {
  return (
    `Turn ${input.turn}: platform_node ${platform_node.toFixed(1)}, severity ${severity.toFixed(1)}, ` +
    `supply bottleneck ${input.supply20bb.bottleneckPressure.toFixed(0)}, ` +
    `grid ${input.energy20bc.gridStability.toFixed(0)}.`
  );
}
