import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 007 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_007_META = {
  id: 'route_007',
  regionId: 'ACT' as V1017IclogRegionId,
  primarySystem: 'industrial' as V1017IclogSystemDomain,
  routeBand: 'active' as V1017IclogRouteBand,
  seed: 6180,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_007_COEF = {
  k0: 64.7000,
  k1: 88.1000,
  k2: 12.4000,
  k3: 35.8000,
  k4: 59.2000,
  k5: 82.6000,
  k6: 6.9000,
  k7: 30.3000,
  k8: 53.7000,
  k9: 77.1000,
  k10: 1.4000,
  k11: 24.8000,
  k12: 48.2000,
  k13: 71.6000,
  k14: 95.0000,
  k15: 19.3000,
  k16: 42.7000,
  k17: 66.1000,
  k18: 89.5000,
  k19: 13.8000,
  k20: 37.2000,
  k21: 60.6000,
  k22: 84.0000,
  k23: 8.3000,
  k24: 31.7000,
  k25: 55.1000,
  k26: 78.5000,
  k27: 2.8000,
  k28: 26.2000,
  k29: 49.6000,
  k30: 73.0000,
  k31: 96.4000,
  k32: 20.7000,
  k33: 44.1000,
  k34: 67.5000,
  k35: 90.9000,
  k36: 15.2000,
  k37: 38.6000,
  k38: 62.0000,
  k39: 85.4000,
  k40: 9.7000,
  k41: 33.1000,
  k42: 56.5000,
  k43: 79.9000,
  k44: 4.2000,
  k45: 27.6000,
  k46: 51.0000,
  k47: 74.4000,
  k48: 97.8000,
  k49: 22.1000,
  k50: 45.5000,
  k51: 68.9000,
  k52: 92.3000,
  k53: 16.6000,
  k54: 40.0000,
  k55: 63.4000,
  k56: 86.8000,
  k57: 11.1000,
  k58: 34.5000,
  k59: 57.9000,
  k60: 81.3000,
  k61: 5.6000,
  k62: 29.0000,
  k63: 52.4000,
  k64: 75.8000,
  k65: 0.1000,
  k66: 23.5000,
  k67: 46.9000,
  k68: 70.3000,
  k69: 93.7000,
  k70: 18.0000,
  k71: 41.4000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_007_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_007_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_007_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_007_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_007_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_007_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_007_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_007_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_007_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_007_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_007_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_007_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
