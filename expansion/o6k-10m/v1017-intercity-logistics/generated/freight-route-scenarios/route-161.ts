import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 161 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_161_META = {
  id: 'route_161',
  regionId: 'VIC' as V1017IclogRegionId,
  primarySystem: 'energy' as V1017IclogSystemDomain,
  routeBand: 'emerging' as V1017IclogRouteBand,
  seed: 141238,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_161_COEF = {
  k0: 63.9000,
  k1: 16.4000,
  k2: 68.0000,
  k3: 20.5000,
  k4: 72.1000,
  k5: 24.6000,
  k6: 76.2000,
  k7: 28.7000,
  k8: 80.3000,
  k9: 32.8000,
  k10: 84.4000,
  k11: 36.9000,
  k12: 88.5000,
  k13: 41.0000,
  k14: 92.6000,
  k15: 45.1000,
  k16: 96.7000,
  k17: 49.2000,
  k18: 1.7000,
  k19: 53.3000,
  k20: 5.8000,
  k21: 57.4000,
  k22: 9.9000,
  k23: 61.5000,
  k24: 14.0000,
  k25: 65.6000,
  k26: 18.1000,
  k27: 69.7000,
  k28: 22.2000,
  k29: 73.8000,
  k30: 26.3000,
  k31: 77.9000,
  k32: 30.4000,
  k33: 82.0000,
  k34: 34.5000,
  k35: 86.1000,
  k36: 38.6000,
  k37: 90.2000,
  k38: 42.7000,
  k39: 94.3000,
  k40: 46.8000,
  k41: 98.4000,
  k42: 50.9000,
  k43: 3.4000,
  k44: 55.0000,
  k45: 7.5000,
  k46: 59.1000,
  k47: 11.6000,
  k48: 63.2000,
  k49: 15.7000,
  k50: 67.3000,
  k51: 19.8000,
  k52: 71.4000,
  k53: 23.9000,
  k54: 75.5000,
  k55: 28.0000,
  k56: 79.6000,
  k57: 32.1000,
  k58: 83.7000,
  k59: 36.2000,
  k60: 87.8000,
  k61: 40.3000,
  k62: 91.9000,
  k63: 44.4000,
  k64: 96.0000,
  k65: 48.5000,
  k66: 1.0000,
  k67: 52.6000,
  k68: 5.1000,
  k69: 56.7000,
  k70: 9.2000,
  k71: 60.8000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_161_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_161_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_161_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_161_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_161_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_161_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_161_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_161_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_161_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_161_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_161_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_161_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
