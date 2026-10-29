import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 129 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_129_META = {
  id: 'route_129',
  regionId: 'VIC' as V1017IclogRegionId,
  primarySystem: 'finance' as V1017IclogSystemDomain,
  routeBand: 'recovering' as V1017IclogRouteBand,
  seed: 113174,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_129_COEF = {
  k0: 40.9000,
  k1: 60.9000,
  k2: 80.9000,
  k3: 1.8000,
  k4: 21.8000,
  k5: 41.8000,
  k6: 61.8000,
  k7: 81.8000,
  k8: 2.7000,
  k9: 22.7000,
  k10: 42.7000,
  k11: 62.7000,
  k12: 82.7000,
  k13: 3.6000,
  k14: 23.6000,
  k15: 43.6000,
  k16: 63.6000,
  k17: 83.6000,
  k18: 4.5000,
  k19: 24.5000,
  k20: 44.5000,
  k21: 64.5000,
  k22: 84.5000,
  k23: 5.4000,
  k24: 25.4000,
  k25: 45.4000,
  k26: 65.4000,
  k27: 85.4000,
  k28: 6.3000,
  k29: 26.3000,
  k30: 46.3000,
  k31: 66.3000,
  k32: 86.3000,
  k33: 7.2000,
  k34: 27.2000,
  k35: 47.2000,
  k36: 67.2000,
  k37: 87.2000,
  k38: 8.1000,
  k39: 28.1000,
  k40: 48.1000,
  k41: 68.1000,
  k42: 88.1000,
  k43: 9.0000,
  k44: 29.0000,
  k45: 49.0000,
  k46: 69.0000,
  k47: 89.0000,
  k48: 9.9000,
  k49: 29.9000,
  k50: 49.9000,
  k51: 69.9000,
  k52: 89.9000,
  k53: 10.8000,
  k54: 30.8000,
  k55: 50.8000,
  k56: 70.8000,
  k57: 90.8000,
  k58: 11.7000,
  k59: 31.7000,
  k60: 51.7000,
  k61: 71.7000,
  k62: 91.7000,
  k63: 12.6000,
  k64: 32.6000,
  k65: 52.6000,
  k66: 72.6000,
  k67: 92.6000,
  k68: 13.5000,
  k69: 33.5000,
  k70: 53.5000,
  k71: 73.5000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_129_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_129_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_129_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_129_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_129_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_129_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_129_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_129_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_129_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_129_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_129_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_129_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
