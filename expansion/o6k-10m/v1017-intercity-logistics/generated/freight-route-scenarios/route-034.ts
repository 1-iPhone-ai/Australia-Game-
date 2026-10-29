import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 034 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_034_META = {
  id: 'route_034',
  regionId: 'QLD' as V1017IclogRegionId,
  primarySystem: 'trade' as V1017IclogSystemDomain,
  routeBand: 'recovering' as V1017IclogRouteBand,
  seed: 29859,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_034_COEF = {
  k0: 90.3000,
  k1: 4.1000,
  k2: 17.0000,
  k3: 29.9000,
  k4: 42.8000,
  k5: 55.7000,
  k6: 68.6000,
  k7: 81.5000,
  k8: 94.4000,
  k9: 8.2000,
  k10: 21.1000,
  k11: 34.0000,
  k12: 46.9000,
  k13: 59.8000,
  k14: 72.7000,
  k15: 85.6000,
  k16: 98.5000,
  k17: 12.3000,
  k18: 25.2000,
  k19: 38.1000,
  k20: 51.0000,
  k21: 63.9000,
  k22: 76.8000,
  k23: 89.7000,
  k24: 3.5000,
  k25: 16.4000,
  k26: 29.3000,
  k27: 42.2000,
  k28: 55.1000,
  k29: 68.0000,
  k30: 80.9000,
  k31: 93.8000,
  k32: 7.6000,
  k33: 20.5000,
  k34: 33.4000,
  k35: 46.3000,
  k36: 59.2000,
  k37: 72.1000,
  k38: 85.0000,
  k39: 97.9000,
  k40: 11.7000,
  k41: 24.6000,
  k42: 37.5000,
  k43: 50.4000,
  k44: 63.3000,
  k45: 76.2000,
  k46: 89.1000,
  k47: 2.9000,
  k48: 15.8000,
  k49: 28.7000,
  k50: 41.6000,
  k51: 54.5000,
  k52: 67.4000,
  k53: 80.3000,
  k54: 93.2000,
  k55: 7.0000,
  k56: 19.9000,
  k57: 32.8000,
  k58: 45.7000,
  k59: 58.6000,
  k60: 71.5000,
  k61: 84.4000,
  k62: 97.3000,
  k63: 11.1000,
  k64: 24.0000,
  k65: 36.9000,
  k66: 49.8000,
  k67: 62.7000,
  k68: 75.6000,
  k69: 88.5000,
  k70: 2.3000,
  k71: 15.2000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_034_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_034_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_034_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_034_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_034_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_034_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_034_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_034_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_034_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_034_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_034_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_034_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
