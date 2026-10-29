import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 004 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_004_META = {
  id: 'route_004',
  regionId: 'SA' as V1017IclogRegionId,
  primarySystem: 'trade' as V1017IclogSystemDomain,
  routeBand: 'recovering' as V1017IclogRouteBand,
  seed: 3549,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_004_COEF = {
  k0: 6.8000,
  k1: 64.4000,
  k2: 22.9000,
  k3: 80.5000,
  k4: 39.0000,
  k5: 96.6000,
  k6: 55.1000,
  k7: 13.6000,
  k8: 71.2000,
  k9: 29.7000,
  k10: 87.3000,
  k11: 45.8000,
  k12: 4.3000,
  k13: 61.9000,
  k14: 20.4000,
  k15: 78.0000,
  k16: 36.5000,
  k17: 94.1000,
  k18: 52.6000,
  k19: 11.1000,
  k20: 68.7000,
  k21: 27.2000,
  k22: 84.8000,
  k23: 43.3000,
  k24: 1.8000,
  k25: 59.4000,
  k26: 17.9000,
  k27: 75.5000,
  k28: 34.0000,
  k29: 91.6000,
  k30: 50.1000,
  k31: 8.6000,
  k32: 66.2000,
  k33: 24.7000,
  k34: 82.3000,
  k35: 40.8000,
  k36: 98.4000,
  k37: 56.9000,
  k38: 15.4000,
  k39: 73.0000,
  k40: 31.5000,
  k41: 89.1000,
  k42: 47.6000,
  k43: 6.1000,
  k44: 63.7000,
  k45: 22.2000,
  k46: 79.8000,
  k47: 38.3000,
  k48: 95.9000,
  k49: 54.4000,
  k50: 12.9000,
  k51: 70.5000,
  k52: 29.0000,
  k53: 86.6000,
  k54: 45.1000,
  k55: 3.6000,
  k56: 61.2000,
  k57: 19.7000,
  k58: 77.3000,
  k59: 35.8000,
  k60: 93.4000,
  k61: 51.9000,
  k62: 10.4000,
  k63: 68.0000,
  k64: 26.5000,
  k65: 84.1000,
  k66: 42.6000,
  k67: 1.1000,
  k68: 58.7000,
  k69: 17.2000,
  k70: 74.8000,
  k71: 33.3000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_004_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_004_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_004_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_004_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_004_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_004_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_004_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_004_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_004_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_004_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_004_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_004_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
