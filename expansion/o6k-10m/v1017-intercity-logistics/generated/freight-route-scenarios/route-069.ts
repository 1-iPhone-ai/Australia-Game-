import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 069 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_069_META = {
  id: 'route_069',
  regionId: 'TAS' as V1017IclogRegionId,
  primarySystem: 'finance' as V1017IclogSystemDomain,
  routeBand: 'recovering' as V1017IclogRouteBand,
  seed: 60554,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_069_COEF = {
  k0: 72.1000,
  k1: 82.4000,
  k2: 92.7000,
  k3: 3.9000,
  k4: 14.2000,
  k5: 24.5000,
  k6: 34.8000,
  k7: 45.1000,
  k8: 55.4000,
  k9: 65.7000,
  k10: 76.0000,
  k11: 86.3000,
  k12: 96.6000,
  k13: 7.8000,
  k14: 18.1000,
  k15: 28.4000,
  k16: 38.7000,
  k17: 49.0000,
  k18: 59.3000,
  k19: 69.6000,
  k20: 79.9000,
  k21: 90.2000,
  k22: 1.4000,
  k23: 11.7000,
  k24: 22.0000,
  k25: 32.3000,
  k26: 42.6000,
  k27: 52.9000,
  k28: 63.2000,
  k29: 73.5000,
  k30: 83.8000,
  k31: 94.1000,
  k32: 5.3000,
  k33: 15.6000,
  k34: 25.9000,
  k35: 36.2000,
  k36: 46.5000,
  k37: 56.8000,
  k38: 67.1000,
  k39: 77.4000,
  k40: 87.7000,
  k41: 98.0000,
  k42: 9.2000,
  k43: 19.5000,
  k44: 29.8000,
  k45: 40.1000,
  k46: 50.4000,
  k47: 60.7000,
  k48: 71.0000,
  k49: 81.3000,
  k50: 91.6000,
  k51: 2.8000,
  k52: 13.1000,
  k53: 23.4000,
  k54: 33.7000,
  k55: 44.0000,
  k56: 54.3000,
  k57: 64.6000,
  k58: 74.9000,
  k59: 85.2000,
  k60: 95.5000,
  k61: 6.7000,
  k62: 17.0000,
  k63: 27.3000,
  k64: 37.6000,
  k65: 47.9000,
  k66: 58.2000,
  k67: 68.5000,
  k68: 78.8000,
  k69: 89.1000,
  k70: 0.3000,
  k71: 10.6000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_069_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_069_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_069_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_069_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_069_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_069_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_069_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_069_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_069_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_069_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_069_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_069_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
