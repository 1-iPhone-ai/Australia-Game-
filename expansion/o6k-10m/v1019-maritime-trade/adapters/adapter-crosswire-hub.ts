import type {
  V1019MtrdTurnInput,
  V1019MtrdV1014EnergySlice,
  V1019MtrdV1014TradeSlice,
} from '../types/core';
import { V1019_MTRD_clamp } from '../engine/maritime-trade-utils';

export function readV1019MtrdTrade20baBridge(slice: V1019MtrdV1014TradeSlice, lanePressure: number) {
  const importStressContribution = V1019_MTRD_clamp(
    slice.sanctionsPressure * 0.01 + slice.importDependencyRatio * 0.12 + lanePressure * 0.2,
    0,
    1,
  );
  const laneStabilityDelta = V1019_MTRD_clamp(
    (slice.exportLaneStability - 50) * 0.06 - importStressContribution * 8,
    -10,
    10,
  );
  return { laneStabilityDelta, importStressContribution };
}

export function readV1019MtrdEnergy20bcBridge(slice: V1019MtrdV1014EnergySlice, severityIndex: number) {
  const gridDrag = V1019_MTRD_clamp((100 - slice.gridStability) * 0.008 + severityIndex * 0.05, 0, 0.55);
  const reserveContribution = V1019_MTRD_clamp(slice.reserveMarginPct * 0.02 - gridDrag * 4, -0.2, 0.35);
  return { gridDrag, reserveContribution };
}

export function buildV1019MtrdBriefing(
  input: V1019MtrdTurnInput,
  severity: number,
  portScore: number,
): string {
  return (
    `Turn ${input.turn}: port ${portScore.toFixed(1)}, severity ${severity.toFixed(1)}, ` +
    `trade sanctions ${input.trade20ba.sanctionsPressure.toFixed(0)}, ` +
    `grid ${input.energy20bc.gridStability.toFixed(0)}.`
  );
}
