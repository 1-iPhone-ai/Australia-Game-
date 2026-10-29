import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 163 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_163_META = {
  id: 'route_163',
  regionId: 'WA' as V1017IclogRegionId,
  primarySystem: 'digital' as V1017IclogSystemDomain,
  routeBand: 'critical' as V1017IclogRouteBand,
  seed: 142992,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_163_COEF = {
  k0: 3.4000,
  k1: 32.2000,
  k2: 61.0000,
  k3: 89.8000,
  k4: 19.5000,
  k5: 48.3000,
  k6: 77.1000,
  k7: 6.8000,
  k8: 35.6000,
  k9: 64.4000,
  k10: 93.2000,
  k11: 22.9000,
  k12: 51.7000,
  k13: 80.5000,
  k14: 10.2000,
  k15: 39.0000,
  k16: 67.8000,
  k17: 96.6000,
  k18: 26.3000,
  k19: 55.1000,
  k20: 83.9000,
  k21: 13.6000,
  k22: 42.4000,
  k23: 71.2000,
  k24: 0.9000,
  k25: 29.7000,
  k26: 58.5000,
  k27: 87.3000,
  k28: 17.0000,
  k29: 45.8000,
  k30: 74.6000,
  k31: 4.3000,
  k32: 33.1000,
  k33: 61.9000,
  k34: 90.7000,
  k35: 20.4000,
  k36: 49.2000,
  k37: 78.0000,
  k38: 7.7000,
  k39: 36.5000,
  k40: 65.3000,
  k41: 94.1000,
  k42: 23.8000,
  k43: 52.6000,
  k44: 81.4000,
  k45: 11.1000,
  k46: 39.9000,
  k47: 68.7000,
  k48: 97.5000,
  k49: 27.2000,
  k50: 56.0000,
  k51: 84.8000,
  k52: 14.5000,
  k53: 43.3000,
  k54: 72.1000,
  k55: 1.8000,
  k56: 30.6000,
  k57: 59.4000,
  k58: 88.2000,
  k59: 17.9000,
  k60: 46.7000,
  k61: 75.5000,
  k62: 5.2000,
  k63: 34.0000,
  k64: 62.8000,
  k65: 91.6000,
  k66: 21.3000,
  k67: 50.1000,
  k68: 78.9000,
  k69: 8.6000,
  k70: 37.4000,
  k71: 66.2000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_163_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_163_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_163_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_163_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_163_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_163_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_163_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_163_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_163_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_163_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_163_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_163_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
