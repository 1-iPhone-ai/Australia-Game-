import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 076 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_076_META = {
  id: 'route_076',
  regionId: 'SA' as V1017IclogRegionId,
  primarySystem: 'food' as V1017IclogSystemDomain,
  routeBand: 'emerging' as V1017IclogRouteBand,
  seed: 66693,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_076_COEF = {
  k0: 9.0000,
  k1: 38.6000,
  k2: 68.2000,
  k3: 97.8000,
  k4: 28.3000,
  k5: 57.9000,
  k6: 87.5000,
  k7: 18.0000,
  k8: 47.6000,
  k9: 77.2000,
  k10: 7.7000,
  k11: 37.3000,
  k12: 66.9000,
  k13: 96.5000,
  k14: 27.0000,
  k15: 56.6000,
  k16: 86.2000,
  k17: 16.7000,
  k18: 46.3000,
  k19: 75.9000,
  k20: 6.4000,
  k21: 36.0000,
  k22: 65.6000,
  k23: 95.2000,
  k24: 25.7000,
  k25: 55.3000,
  k26: 84.9000,
  k27: 15.4000,
  k28: 45.0000,
  k29: 74.6000,
  k30: 5.1000,
  k31: 34.7000,
  k32: 64.3000,
  k33: 93.9000,
  k34: 24.4000,
  k35: 54.0000,
  k36: 83.6000,
  k37: 14.1000,
  k38: 43.7000,
  k39: 73.3000,
  k40: 3.8000,
  k41: 33.4000,
  k42: 63.0000,
  k43: 92.6000,
  k44: 23.1000,
  k45: 52.7000,
  k46: 82.3000,
  k47: 12.8000,
  k48: 42.4000,
  k49: 72.0000,
  k50: 2.5000,
  k51: 32.1000,
  k52: 61.7000,
  k53: 91.3000,
  k54: 21.8000,
  k55: 51.4000,
  k56: 81.0000,
  k57: 11.5000,
  k58: 41.1000,
  k59: 70.7000,
  k60: 1.2000,
  k61: 30.8000,
  k62: 60.4000,
  k63: 90.0000,
  k64: 20.5000,
  k65: 50.1000,
  k66: 79.7000,
  k67: 10.2000,
  k68: 39.8000,
  k69: 69.4000,
  k70: 99.0000,
  k71: 29.5000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_076_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_076_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_076_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_076_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_076_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_076_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_076_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_076_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_076_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_076_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_076_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_076_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
