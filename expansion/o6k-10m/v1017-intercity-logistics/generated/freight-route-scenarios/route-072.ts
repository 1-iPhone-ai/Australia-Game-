import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 072 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_072_META = {
  id: 'route_072',
  regionId: 'NSW' as V1017IclogRegionId,
  primarySystem: 'water' as V1017IclogSystemDomain,
  routeBand: 'active' as V1017IclogRouteBand,
  seed: 63185,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_072_COEF = {
  k0: 30.9000,
  k1: 7.0000,
  k2: 82.2000,
  k3: 58.3000,
  k4: 34.4000,
  k5: 10.5000,
  k6: 85.7000,
  k7: 61.8000,
  k8: 37.9000,
  k9: 14.0000,
  k10: 89.2000,
  k11: 65.3000,
  k12: 41.4000,
  k13: 17.5000,
  k14: 92.7000,
  k15: 68.8000,
  k16: 44.9000,
  k17: 21.0000,
  k18: 96.2000,
  k19: 72.3000,
  k20: 48.4000,
  k21: 24.5000,
  k22: 0.6000,
  k23: 75.8000,
  k24: 51.9000,
  k25: 28.0000,
  k26: 4.1000,
  k27: 79.3000,
  k28: 55.4000,
  k29: 31.5000,
  k30: 7.6000,
  k31: 82.8000,
  k32: 58.9000,
  k33: 35.0000,
  k34: 11.1000,
  k35: 86.3000,
  k36: 62.4000,
  k37: 38.5000,
  k38: 14.6000,
  k39: 89.8000,
  k40: 65.9000,
  k41: 42.0000,
  k42: 18.1000,
  k43: 93.3000,
  k44: 69.4000,
  k45: 45.5000,
  k46: 21.6000,
  k47: 96.8000,
  k48: 72.9000,
  k49: 49.0000,
  k50: 25.1000,
  k51: 1.2000,
  k52: 76.4000,
  k53: 52.5000,
  k54: 28.6000,
  k55: 4.7000,
  k56: 79.9000,
  k57: 56.0000,
  k58: 32.1000,
  k59: 8.2000,
  k60: 83.4000,
  k61: 59.5000,
  k62: 35.6000,
  k63: 11.7000,
  k64: 86.9000,
  k65: 63.0000,
  k66: 39.1000,
  k67: 15.2000,
  k68: 90.4000,
  k69: 66.5000,
  k70: 42.6000,
  k71: 18.7000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_072_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_072_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_072_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_072_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_072_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_072_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_072_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_072_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_072_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_072_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_072_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_072_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
