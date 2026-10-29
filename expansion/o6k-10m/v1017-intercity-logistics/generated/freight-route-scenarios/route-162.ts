import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 162 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_162_META = {
  id: 'route_162',
  regionId: 'QLD' as V1017IclogRegionId,
  primarySystem: 'water' as V1017IclogSystemDomain,
  routeBand: 'active' as V1017IclogRouteBand,
  seed: 142115,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_162_COEF = {
  k0: 83.2000,
  k1: 24.3000,
  k2: 64.5000,
  k3: 5.6000,
  k4: 45.8000,
  k5: 86.0000,
  k6: 27.1000,
  k7: 67.3000,
  k8: 8.4000,
  k9: 48.6000,
  k10: 88.8000,
  k11: 29.9000,
  k12: 70.1000,
  k13: 11.2000,
  k14: 51.4000,
  k15: 91.6000,
  k16: 32.7000,
  k17: 72.9000,
  k18: 14.0000,
  k19: 54.2000,
  k20: 94.4000,
  k21: 35.5000,
  k22: 75.7000,
  k23: 16.8000,
  k24: 57.0000,
  k25: 97.2000,
  k26: 38.3000,
  k27: 78.5000,
  k28: 19.6000,
  k29: 59.8000,
  k30: 0.9000,
  k31: 41.1000,
  k32: 81.3000,
  k33: 22.4000,
  k34: 62.6000,
  k35: 3.7000,
  k36: 43.9000,
  k37: 84.1000,
  k38: 25.2000,
  k39: 65.4000,
  k40: 6.5000,
  k41: 46.7000,
  k42: 86.9000,
  k43: 28.0000,
  k44: 68.2000,
  k45: 9.3000,
  k46: 49.5000,
  k47: 89.7000,
  k48: 30.8000,
  k49: 71.0000,
  k50: 12.1000,
  k51: 52.3000,
  k52: 92.5000,
  k53: 33.6000,
  k54: 73.8000,
  k55: 14.9000,
  k56: 55.1000,
  k57: 95.3000,
  k58: 36.4000,
  k59: 76.6000,
  k60: 17.7000,
  k61: 57.9000,
  k62: 98.1000,
  k63: 39.2000,
  k64: 79.4000,
  k65: 20.5000,
  k66: 60.7000,
  k67: 1.8000,
  k68: 42.0000,
  k69: 82.2000,
  k70: 23.3000,
  k71: 63.5000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_162_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_162_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_162_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_162_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_162_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_162_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_162_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_162_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_162_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_162_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_162_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_162_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
