import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 093 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_093_META = {
  id: 'route_093',
  regionId: 'TAS' as V1017IclogRegionId,
  primarySystem: 'digital' as V1017IclogSystemDomain,
  routeBand: 'critical' as V1017IclogRouteBand,
  seed: 81602,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_093_COEF = {
  k0: 39.8000,
  k1: 73.8000,
  k2: 8.7000,
  k3: 42.7000,
  k4: 76.7000,
  k5: 11.6000,
  k6: 45.6000,
  k7: 79.6000,
  k8: 14.5000,
  k9: 48.5000,
  k10: 82.5000,
  k11: 17.4000,
  k12: 51.4000,
  k13: 85.4000,
  k14: 20.3000,
  k15: 54.3000,
  k16: 88.3000,
  k17: 23.2000,
  k18: 57.2000,
  k19: 91.2000,
  k20: 26.1000,
  k21: 60.1000,
  k22: 94.1000,
  k23: 29.0000,
  k24: 63.0000,
  k25: 97.0000,
  k26: 31.9000,
  k27: 65.9000,
  k28: 0.8000,
  k29: 34.8000,
  k30: 68.8000,
  k31: 3.7000,
  k32: 37.7000,
  k33: 71.7000,
  k34: 6.6000,
  k35: 40.6000,
  k36: 74.6000,
  k37: 9.5000,
  k38: 43.5000,
  k39: 77.5000,
  k40: 12.4000,
  k41: 46.4000,
  k42: 80.4000,
  k43: 15.3000,
  k44: 49.3000,
  k45: 83.3000,
  k46: 18.2000,
  k47: 52.2000,
  k48: 86.2000,
  k49: 21.1000,
  k50: 55.1000,
  k51: 89.1000,
  k52: 24.0000,
  k53: 58.0000,
  k54: 92.0000,
  k55: 26.9000,
  k56: 60.9000,
  k57: 94.9000,
  k58: 29.8000,
  k59: 63.8000,
  k60: 97.8000,
  k61: 32.7000,
  k62: 66.7000,
  k63: 1.6000,
  k64: 35.6000,
  k65: 69.6000,
  k66: 4.5000,
  k67: 38.5000,
  k68: 72.5000,
  k69: 7.4000,
  k70: 41.4000,
  k71: 75.4000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_093_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_093_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_093_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_093_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_093_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_093_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_093_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_093_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_093_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_093_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_093_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_093_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
