import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 063 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_063_META = {
  id: 'route_063',
  regionId: 'ACT' as V1017IclogRegionId,
  primarySystem: 'digital' as V1017IclogSystemDomain,
  routeBand: 'critical' as V1017IclogRouteBand,
  seed: 55292,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_063_COEF = {
  k0: 55.4000,
  k1: 35.0000,
  k2: 14.6000,
  k3: 93.3000,
  k4: 72.9000,
  k5: 52.5000,
  k6: 32.1000,
  k7: 11.7000,
  k8: 90.4000,
  k9: 70.0000,
  k10: 49.6000,
  k11: 29.2000,
  k12: 8.8000,
  k13: 87.5000,
  k14: 67.1000,
  k15: 46.7000,
  k16: 26.3000,
  k17: 5.9000,
  k18: 84.6000,
  k19: 64.2000,
  k20: 43.8000,
  k21: 23.4000,
  k22: 3.0000,
  k23: 81.7000,
  k24: 61.3000,
  k25: 40.9000,
  k26: 20.5000,
  k27: 0.1000,
  k28: 78.8000,
  k29: 58.4000,
  k30: 38.0000,
  k31: 17.6000,
  k32: 96.3000,
  k33: 75.9000,
  k34: 55.5000,
  k35: 35.1000,
  k36: 14.7000,
  k37: 93.4000,
  k38: 73.0000,
  k39: 52.6000,
  k40: 32.2000,
  k41: 11.8000,
  k42: 90.5000,
  k43: 70.1000,
  k44: 49.7000,
  k45: 29.3000,
  k46: 8.9000,
  k47: 87.6000,
  k48: 67.2000,
  k49: 46.8000,
  k50: 26.4000,
  k51: 6.0000,
  k52: 84.7000,
  k53: 64.3000,
  k54: 43.9000,
  k55: 23.5000,
  k56: 3.1000,
  k57: 81.8000,
  k58: 61.4000,
  k59: 41.0000,
  k60: 20.6000,
  k61: 0.2000,
  k62: 78.9000,
  k63: 58.5000,
  k64: 38.1000,
  k65: 17.7000,
  k66: 96.4000,
  k67: 76.0000,
  k68: 55.6000,
  k69: 35.2000,
  k70: 14.8000,
  k71: 93.5000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_063_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_063_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_063_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_063_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_063_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_063_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_063_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_063_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_063_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_063_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_063_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_063_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
