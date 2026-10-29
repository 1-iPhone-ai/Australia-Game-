import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 056 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_056_META = {
  id: 'route_056',
  regionId: 'NSW' as V1017IclogRegionId,
  primarySystem: 'food' as V1017IclogSystemDomain,
  routeBand: 'emerging' as V1017IclogRouteBand,
  seed: 49153,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_056_COEF = {
  k0: 19.4000,
  k1: 78.8000,
  k2: 39.1000,
  k3: 98.5000,
  k4: 58.8000,
  k5: 19.1000,
  k6: 78.5000,
  k7: 38.8000,
  k8: 98.2000,
  k9: 58.5000,
  k10: 18.8000,
  k11: 78.2000,
  k12: 38.5000,
  k13: 97.9000,
  k14: 58.2000,
  k15: 18.5000,
  k16: 77.9000,
  k17: 38.2000,
  k18: 97.6000,
  k19: 57.9000,
  k20: 18.2000,
  k21: 77.6000,
  k22: 37.9000,
  k23: 97.3000,
  k24: 57.6000,
  k25: 17.9000,
  k26: 77.3000,
  k27: 37.6000,
  k28: 97.0000,
  k29: 57.3000,
  k30: 17.6000,
  k31: 77.0000,
  k32: 37.3000,
  k33: 96.7000,
  k34: 57.0000,
  k35: 17.3000,
  k36: 76.7000,
  k37: 37.0000,
  k38: 96.4000,
  k39: 56.7000,
  k40: 17.0000,
  k41: 76.4000,
  k42: 36.7000,
  k43: 96.1000,
  k44: 56.4000,
  k45: 16.7000,
  k46: 76.1000,
  k47: 36.4000,
  k48: 95.8000,
  k49: 56.1000,
  k50: 16.4000,
  k51: 75.8000,
  k52: 36.1000,
  k53: 95.5000,
  k54: 55.8000,
  k55: 16.1000,
  k56: 75.5000,
  k57: 35.8000,
  k58: 95.2000,
  k59: 55.5000,
  k60: 15.8000,
  k61: 75.2000,
  k62: 35.5000,
  k63: 94.9000,
  k64: 55.2000,
  k65: 15.5000,
  k66: 74.9000,
  k67: 35.2000,
  k68: 94.6000,
  k69: 54.9000,
  k70: 15.2000,
  k71: 74.6000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_056_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_056_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_056_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_056_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_056_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_056_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_056_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_056_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_056_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_056_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_056_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_056_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
