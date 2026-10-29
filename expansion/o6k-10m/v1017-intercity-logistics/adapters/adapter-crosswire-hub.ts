import type {
  V1017IclogTurnInput,
  V1017IclogV1014CitiesSlice,
  V1017IclogV1014SupplySlice,
  V1017IclogV1014TradeSlice,
  V1017IclogV1016ResilienceSlice,
} from '../types/core';
import { V1017_ICLOG_clamp } from '../engine/intercity-logistics-utils';

export function readV1017IclogSupply20bbBridge(slice: V1017IclogV1014SupplySlice, severityIndex: number) {
  const bottleneckDelta = V1017_ICLOG_clamp(slice.bottleneckPressure * 0.04 + severityIndex * 0.06, -12, 18);
  const stockDaysDelta: Partial<Record<string, number>> = {};
  Object.entries(slice.regionalStockDays ?? {}).forEach(([region, days]) => {
    stockDaysDelta[region] = V1017_ICLOG_clamp(Number(days) - severityIndex * 0.08, 0, 120);
  });
  return { bottleneckDelta, stockDaysDelta };
}

export function readV1017IclogTrade20baBridge(slice: V1017IclogV1014TradeSlice, routePressure: number) {
  const importStressContribution = V1017_ICLOG_clamp(
    slice.sanctionsPressure * 0.01 + slice.importDependencyRatio * 0.12 + routePressure * 0.2,
    0,
    1,
  );
  const laneStabilityDelta = V1017_ICLOG_clamp(
    (slice.exportLaneStability - 50) * 0.06 - importStressContribution * 8,
    -10,
    10,
  );
  return { laneStabilityDelta, importStressContribution };
}

export function readV1017IclogCities20akBridge(slice: V1017IclogV1014CitiesSlice, severityIndex: number) {
  const congestionDrag = V1017_ICLOG_clamp((100 - slice.intercityLinkCongestion) * 0.008 + severityIndex * 0.05, 0, 0.55);
  const throughputContribution = V1017_ICLOG_clamp(slice.corridorThroughputIndex * 0.02 - congestionDrag * 4, -0.2, 0.35);
  return { congestionDrag, throughputContribution };
}

export function readV1017IclogResilience20bgBridge(slice: V1017IclogV1016ResilienceSlice, severityIndex: number) {
  const shockContribution = V1017_ICLOG_clamp(slice.rerouteUrgencyIndex * 0.01 + severityIndex * 0.04, 0, 1);
  const continuityDelta = V1017_ICLOG_clamp(
    (slice.resilienceContinuityScore - 52) * 0.05 - shockContribution * 6,
    -9,
    9,
  );
  return { continuityDelta, shockContribution };
}

export function buildV1017IclogBriefing(
  input: V1017IclogTurnInput,
  severity: number,
  hub: number,
): string {
  return (
    `Turn ${input.turn}: hub ${hub.toFixed(1)}, severity ${severity.toFixed(1)}, ` +
    `supply bottleneck ${input.supply20bb.bottleneckPressure.toFixed(0)}, ` +
    `grid ${input.cities20ak.intercityLinkCongestion.toFixed(0)}.`
  );
}
