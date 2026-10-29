import type {
  V1022HaffTurnInput,
  V1022HaffPublicServices20azSlice,
  V1022HaffV1014EnergySlice,
  V1022HaffFiscalFederalism20bjSlice,
  V1022HaffV1014SupplySlice,
  V1022HaffV1014TradeSlice,
  V1022HaffV1014WorkforceSlice,
} from '../types/core';
import { V1022_HAFF_clamp } from '../engine/housing-affordability-utils';

export function readV1022HaffSupply20bbBridge(slice: V1022HaffV1014SupplySlice, rentStressIndex: number) {
  const bottleneckDelta = V1022_HAFF_clamp(slice.bottleneckPressure * 0.04 + rentStressIndex * 0.06, -12, 18);
  const stockDaysDelta: Partial<Record<string, number>> = {};
  Object.entries(slice.regionalStockDays ?? {}).forEach(([region, days]) => {
    stockDaysDelta[region] = V1022_HAFF_clamp(Number(days) - rentStressIndex * 0.08, 0, 120);
  });
  return { bottleneckDelta, stockDaysDelta };
}

export function readV1022HaffTrade20baBridge(slice: V1022HaffV1014TradeSlice, transferBackpressure: number) {
  const importStressContribution = V1022_HAFF_clamp(
    slice.sanctionsPressure * 0.01 + slice.importDependencyRatio * 0.12 + transferBackpressure * 0.2,
    0,
    1,
  );
  const laneStabilityDelta = V1022_HAFF_clamp(
    (slice.exportLaneStability - 50) * 0.06 - importStressContribution * 8,
    -10,
    10,
  );
  return { laneStabilityDelta, importStressContribution };
}

export function readV1022HaffEnergy20bcBridge(slice: V1022HaffV1014EnergySlice, rentStressIndex: number) {
  const gridDrag = V1022_HAFF_clamp((100 - slice.gridStability) * 0.008 + rentStressIndex * 0.05, 0, 0.55);
  const reserveContribution = V1022_HAFF_clamp(slice.reserveMarginPct * 0.02 - gridDrag * 4, -0.2, 0.35);
  return { gridDrag, reserveContribution };
}

export function readV1022HaffWorkforce20bfBridge(slice: V1022HaffV1014WorkforceSlice, rentStressIndex: number) {
  const mismatchContribution = V1022_HAFF_clamp(slice.mismatchIndex * 0.01 + rentStressIndex * 0.04, 0, 1);
  const readinessDelta = V1022_HAFF_clamp(
    (slice.nationalReadiness - 52) * 0.05 - mismatchContribution * 6,
    -9,
    9,
  );
  return { readinessDelta, mismatchContribution };
}

export function readV1022HaffPublicServices20azBridge(
  slice: V1022HaffPublicServices20azSlice,
  rentStressIndex: number,
) {
  const serviceQueueDelta = V1022_HAFF_clamp(
    (100 - slice.clinicCapacityScore) * 0.05 + slice.serviceDeliveryReadiness * 0.04 + rentStressIndex * 0.03,
    -8,
    14,
  );
  return { bottleneckDelta: serviceQueueDelta, stockDaysDelta: {}, serviceQueueDelta };
}

export function readV1022HaffFiscalFederalism20bjBridge(
  slice: V1022HaffFiscalFederalism20bjSlice,
  rentStressIndex: number,
) {
  const fiscalTransferDelta = V1022_HAFF_clamp(
    slice.transferBackpressure * 0.06 + slice.zoningBacklogTurns * 0.04 + rentStressIndex * 0.05,
    -6,
    16,
  );
  return { bottleneckDelta: fiscalTransferDelta, stockDaysDelta: {}, fiscalTransferDelta };
}

export function buildV1022HaffBriefing(
  input: V1022HaffTurnInput,
  severity: number,
  zoning_node: number,
): string {
  return (
    `Turn ${input.turn}: zoning_node ${zoning_node.toFixed(1)}, severity ${severity.toFixed(1)}, ` +
    `supply bottleneck ${input.supply20bb.bottleneckPressure.toFixed(0)}, ` +
    `grid ${input.energy20bc.gridStability.toFixed(0)}.`
  );
}
