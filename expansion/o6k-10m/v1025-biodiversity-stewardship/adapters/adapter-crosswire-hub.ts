import type {
  V1025BioTurnInput,
  V1025BioPublicServices20azSlice,
  V1025BioV1014EnergySlice,
  V1025BioClimateAdaptation20brSlice,
  V1025BioV1014SupplySlice,
  V1025BioV1014TradeSlice,
  V1025BioV1014WorkforceSlice,
} from '../types/core';
import { V1025_BIO_clamp } from '../engine/biodiversity-stewardship-utils';

export function readV1025BioSupply20bbBridge(slice: V1025BioV1014SupplySlice, ecosystemStressIndex: number) {
  const bottleneckDelta = V1025_BIO_clamp(slice.bottleneckPressure * 0.04 + ecosystemStressIndex * 0.06, -12, 18);
  const stockDaysDelta: Partial<Record<string, number>> = {};
  Object.entries(slice.regionalStockDays ?? {}).forEach(([region, days]) => {
    stockDaysDelta[region] = V1025_BIO_clamp(Number(days) - ecosystemStressIndex * 0.08, 0, 120);
  });
  return { bottleneckDelta, stockDaysDelta };
}

export function readV1025BioTrade20baBridge(slice: V1025BioV1014TradeSlice, heatStressPressure: number) {
  const importStressContribution = V1025_BIO_clamp(
    slice.sanctionsPressure * 0.01 + slice.importDependencyRatio * 0.12 + heatStressPressure * 0.2,
    0,
    1,
  );
  const laneStabilityDelta = V1025_BIO_clamp(
    (slice.exportLaneStability - 50) * 0.06 - importStressContribution * 8,
    -10,
    10,
  );
  return { laneStabilityDelta, importStressContribution };
}

export function readV1025BioEnergy20bcBridge(slice: V1025BioV1014EnergySlice, ecosystemStressIndex: number) {
  const gridDrag = V1025_BIO_clamp((100 - slice.gridStability) * 0.008 + ecosystemStressIndex * 0.05, 0, 0.55);
  const reserveContribution = V1025_BIO_clamp(slice.reserveMarginPct * 0.02 - gridDrag * 4, -0.2, 0.35);
  return { gridDrag, reserveContribution };
}

export function readV1025BioWorkforce20bfBridge(slice: V1025BioV1014WorkforceSlice, ecosystemStressIndex: number) {
  const mismatchContribution = V1025_BIO_clamp(slice.mismatchIndex * 0.01 + ecosystemStressIndex * 0.04, 0, 1);
  const readinessDelta = V1025_BIO_clamp(
    (slice.nationalReadiness - 52) * 0.05 - mismatchContribution * 6,
    -9,
    9,
  );
  return { readinessDelta, mismatchContribution };
}

export function readV1025BioPublicServices20azBridge(
  slice: V1025BioPublicServices20azSlice,
  ecosystemStressIndex: number,
) {
  const serviceQueueDelta = V1025_BIO_clamp(
    (100 - slice.clinicCapacityScore) * 0.05 + slice.serviceDeliveryReadiness * 0.04 + ecosystemStressIndex * 0.03,
    -8,
    14,
  );
  return { bottleneckDelta: serviceQueueDelta, stockDaysDelta: {}, serviceQueueDelta };
}

export function readV1025BioClimateAdaptation20brBridge(
  slice: V1025BioClimateAdaptation20brSlice,
  ecosystemStressIndex: number,
) {
  const climateAdaptationDelta = V1025_BIO_clamp(
    slice.heatStressPressure * 0.06 + slice.resilienceDriftTurns * 0.04 + ecosystemStressIndex * 0.05,
    -6,
    16,
  );
  return { bottleneckDelta: climateAdaptationDelta, stockDaysDelta: {}, climateAdaptationDelta };
}

export function buildV1025BioBriefing(
  input: V1025BioTurnInput,
  severity: number,
  protected_area: number,
): string {
  return (
    `Turn ${input.turn}: protected_area ${protected_area.toFixed(1)}, severity ${severity.toFixed(1)}, ` +
    `supply bottleneck ${input.supply20bb.bottleneckPressure.toFixed(0)}, ` +
    `grid ${input.energy20bc.gridStability.toFixed(0)}.`
  );
}
