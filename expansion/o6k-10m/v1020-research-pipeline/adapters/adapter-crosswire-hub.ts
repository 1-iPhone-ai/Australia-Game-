import type {
  V1020RpipeTurnInput,
  V1020RpipeV1014AiFidelitySlice,
  V1020RpipeV1014EnergySlice,
  V1020RpipeV1014FiscalFederalismSlice,
  V1020RpipeV1014SupplySlice,
  V1020RpipeV1014TradeSlice,
  V1020RpipeV1014WorkforceSlice,
} from '../types/core';
import { V1020_RPIPE_clamp } from '../engine/research-pipeline-utils';

export function readV1020RpipeSupply20bbBridge(slice: V1020RpipeV1014SupplySlice, severityIndex: number) {
  const bottleneckDelta = V1020_RPIPE_clamp(slice.bottleneckPressure * 0.04 + severityIndex * 0.06, -12, 18);
  const stockDaysDelta: Partial<Record<string, number>> = {};
  Object.entries(slice.regionalStockDays ?? {}).forEach(([region, days]) => {
    stockDaysDelta[region] = V1020_RPIPE_clamp(Number(days) - severityIndex * 0.08, 0, 120);
  });
  return { bottleneckDelta, stockDaysDelta };
}

export function readV1020RpipeTrade20baBridge(slice: V1020RpipeV1014TradeSlice, transferPressure: number) {
  const importStressContribution = V1020_RPIPE_clamp(
    slice.sanctionsPressure * 0.01 + slice.importDependencyRatio * 0.12 + transferPressure * 0.2,
    0,
    1,
  );
  const laneStabilityDelta = V1020_RPIPE_clamp(
    (slice.exportLaneStability - 50) * 0.06 - importStressContribution * 8,
    -10,
    10,
  );
  return { laneStabilityDelta, importStressContribution };
}

export function readV1020RpipeEnergy20bcBridge(slice: V1020RpipeV1014EnergySlice, severityIndex: number) {
  const gridDrag = V1020_RPIPE_clamp((100 - slice.gridStability) * 0.008 + severityIndex * 0.05, 0, 0.55);
  const reserveContribution = V1020_RPIPE_clamp(slice.reserveMarginPct * 0.02 - gridDrag * 4, -0.2, 0.35);
  return { gridDrag, reserveContribution };
}

export function readV1020RpipeWorkforce20bfBridge(slice: V1020RpipeV1014WorkforceSlice, severityIndex: number) {
  const mismatchContribution = V1020_RPIPE_clamp(slice.mismatchIndex * 0.01 + severityIndex * 0.04, 0, 1);
  const readinessDelta = V1020_RPIPE_clamp(
    (slice.nationalReadiness - 52) * 0.05 - mismatchContribution * 6,
    -9,
    9,
  );
  return { readinessDelta, mismatchContribution };
}

export function readV1020RpipeCommercialization20beBridge(
  slice: V1020RpipeV1014AiFidelitySlice,
  severityIndex: number,
) {
  const commercializationDelta = V1020_RPIPE_clamp(
    (100 - slice.planVerifyScore) * 0.05 + slice.commercializationReadiness * 0.04 + severityIndex * 0.03,
    -8,
    14,
  );
  return { bottleneckDelta: commercializationDelta, stockDaysDelta: {}, commercializationDelta };
}

export function readV1020RpipeLabTransfer20bjBridge(
  slice: V1020RpipeV1014FiscalFederalismSlice,
  severityIndex: number,
) {
  const labTransferDelta = V1020_RPIPE_clamp(
    slice.transferPressure * 0.06 + slice.labTransferBacklog * 0.04 + severityIndex * 0.05,
    -6,
    16,
  );
  return { bottleneckDelta: labTransferDelta, stockDaysDelta: {}, labTransferDelta };
}

export function buildV1020RpipeBriefing(
  input: V1020RpipeTurnInput,
  severity: number,
  lab_transfer: number,
): string {
  return (
    `Turn ${input.turn}: lab_transfer ${lab_transfer.toFixed(1)}, severity ${severity.toFixed(1)}, ` +
    `supply bottleneck ${input.supply20bb.bottleneckPressure.toFixed(0)}, ` +
    `grid ${input.energy20bc.gridStability.toFixed(0)}.`
  );
}
