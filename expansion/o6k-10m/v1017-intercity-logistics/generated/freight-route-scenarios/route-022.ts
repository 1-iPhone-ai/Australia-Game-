import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 022 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_022_META = {
  id: 'route_022',
  regionId: 'NT' as V1017IclogRegionId,
  primarySystem: 'water' as V1017IclogSystemDomain,
  routeBand: 'active' as V1017IclogRouteBand,
  seed: 19335,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_022_COEF = {
  k0: 56.9000,
  k1: 8.4000,
  k2: 59.0000,
  k3: 10.5000,
  k4: 61.1000,
  k5: 12.6000,
  k6: 63.2000,
  k7: 14.7000,
  k8: 65.3000,
  k9: 16.8000,
  k10: 67.4000,
  k11: 18.9000,
  k12: 69.5000,
  k13: 21.0000,
  k14: 71.6000,
  k15: 23.1000,
  k16: 73.7000,
  k17: 25.2000,
  k18: 75.8000,
  k19: 27.3000,
  k20: 77.9000,
  k21: 29.4000,
  k22: 80.0000,
  k23: 31.5000,
  k24: 82.1000,
  k25: 33.6000,
  k26: 84.2000,
  k27: 35.7000,
  k28: 86.3000,
  k29: 37.8000,
  k30: 88.4000,
  k31: 39.9000,
  k32: 90.5000,
  k33: 42.0000,
  k34: 92.6000,
  k35: 44.1000,
  k36: 94.7000,
  k37: 46.2000,
  k38: 96.8000,
  k39: 48.3000,
  k40: 98.9000,
  k41: 50.4000,
  k42: 1.9000,
  k43: 52.5000,
  k44: 4.0000,
  k45: 54.6000,
  k46: 6.1000,
  k47: 56.7000,
  k48: 8.2000,
  k49: 58.8000,
  k50: 10.3000,
  k51: 60.9000,
  k52: 12.4000,
  k53: 63.0000,
  k54: 14.5000,
  k55: 65.1000,
  k56: 16.6000,
  k57: 67.2000,
  k58: 18.7000,
  k59: 69.3000,
  k60: 20.8000,
  k61: 71.4000,
  k62: 22.9000,
  k63: 73.5000,
  k64: 25.0000,
  k65: 75.6000,
  k66: 27.1000,
  k67: 77.7000,
  k68: 29.2000,
  k69: 79.8000,
  k70: 31.3000,
  k71: 81.9000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_022_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_022_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_022_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_022_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_022_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_022_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_022_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_022_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_022_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_022_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_022_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_022_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
