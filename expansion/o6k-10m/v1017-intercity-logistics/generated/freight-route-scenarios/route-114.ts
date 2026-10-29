import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 114 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_114_META = {
  id: 'route_114',
  regionId: 'QLD' as V1017IclogRegionId,
  primarySystem: 'trade' as V1017IclogSystemDomain,
  routeBand: 'recovering' as V1017IclogRouteBand,
  seed: 100019,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_114_COEF = {
  k0: 48.7000,
  k1: 41.5000,
  k2: 34.3000,
  k3: 27.1000,
  k4: 19.9000,
  k5: 12.7000,
  k6: 5.5000,
  k7: 97.4000,
  k8: 90.2000,
  k9: 83.0000,
  k10: 75.8000,
  k11: 68.6000,
  k12: 61.4000,
  k13: 54.2000,
  k14: 47.0000,
  k15: 39.8000,
  k16: 32.6000,
  k17: 25.4000,
  k18: 18.2000,
  k19: 11.0000,
  k20: 3.8000,
  k21: 95.7000,
  k22: 88.5000,
  k23: 81.3000,
  k24: 74.1000,
  k25: 66.9000,
  k26: 59.7000,
  k27: 52.5000,
  k28: 45.3000,
  k29: 38.1000,
  k30: 30.9000,
  k31: 23.7000,
  k32: 16.5000,
  k33: 9.3000,
  k34: 2.1000,
  k35: 94.0000,
  k36: 86.8000,
  k37: 79.6000,
  k38: 72.4000,
  k39: 65.2000,
  k40: 58.0000,
  k41: 50.8000,
  k42: 43.6000,
  k43: 36.4000,
  k44: 29.2000,
  k45: 22.0000,
  k46: 14.8000,
  k47: 7.6000,
  k48: 0.4000,
  k49: 92.3000,
  k50: 85.1000,
  k51: 77.9000,
  k52: 70.7000,
  k53: 63.5000,
  k54: 56.3000,
  k55: 49.1000,
  k56: 41.9000,
  k57: 34.7000,
  k58: 27.5000,
  k59: 20.3000,
  k60: 13.1000,
  k61: 5.9000,
  k62: 97.8000,
  k63: 90.6000,
  k64: 83.4000,
  k65: 76.2000,
  k66: 69.0000,
  k67: 61.8000,
  k68: 54.6000,
  k69: 47.4000,
  k70: 40.2000,
  k71: 33.0000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_114_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_114_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_114_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_114_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_114_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_114_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_114_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_114_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_114_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_114_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_114_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_114_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
