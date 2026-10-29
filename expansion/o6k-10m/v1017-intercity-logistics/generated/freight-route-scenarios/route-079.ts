import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 079 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_079_META = {
  id: 'route_079',
  regionId: 'ACT' as V1017IclogRegionId,
  primarySystem: 'finance' as V1017IclogSystemDomain,
  routeBand: 'recovering' as V1017IclogRouteBand,
  seed: 69324,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_079_COEF = {
  k0: 66.9000,
  k1: 62.3000,
  k2: 57.7000,
  k3: 53.1000,
  k4: 48.5000,
  k5: 43.9000,
  k6: 39.3000,
  k7: 34.7000,
  k8: 30.1000,
  k9: 25.5000,
  k10: 20.9000,
  k11: 16.3000,
  k12: 11.7000,
  k13: 7.1000,
  k14: 2.5000,
  k15: 97.0000,
  k16: 92.4000,
  k17: 87.8000,
  k18: 83.2000,
  k19: 78.6000,
  k20: 74.0000,
  k21: 69.4000,
  k22: 64.8000,
  k23: 60.2000,
  k24: 55.6000,
  k25: 51.0000,
  k26: 46.4000,
  k27: 41.8000,
  k28: 37.2000,
  k29: 32.6000,
  k30: 28.0000,
  k31: 23.4000,
  k32: 18.8000,
  k33: 14.2000,
  k34: 9.6000,
  k35: 5.0000,
  k36: 0.4000,
  k37: 94.9000,
  k38: 90.3000,
  k39: 85.7000,
  k40: 81.1000,
  k41: 76.5000,
  k42: 71.9000,
  k43: 67.3000,
  k44: 62.7000,
  k45: 58.1000,
  k46: 53.5000,
  k47: 48.9000,
  k48: 44.3000,
  k49: 39.7000,
  k50: 35.1000,
  k51: 30.5000,
  k52: 25.9000,
  k53: 21.3000,
  k54: 16.7000,
  k55: 12.1000,
  k56: 7.5000,
  k57: 2.9000,
  k58: 97.4000,
  k59: 92.8000,
  k60: 88.2000,
  k61: 83.6000,
  k62: 79.0000,
  k63: 74.4000,
  k64: 69.8000,
  k65: 65.2000,
  k66: 60.6000,
  k67: 56.0000,
  k68: 51.4000,
  k69: 46.8000,
  k70: 42.2000,
  k71: 37.6000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_079_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_079_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_079_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_079_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_079_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_079_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_079_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_079_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_079_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_079_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_079_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_079_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
