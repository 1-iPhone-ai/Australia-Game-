import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 139 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_139_META = {
  id: 'route_139',
  regionId: 'WA' as V1017IclogRegionId,
  primarySystem: 'finance' as V1017IclogSystemDomain,
  routeBand: 'recovering' as V1017IclogRouteBand,
  seed: 121944,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_139_COEF = {
  k0: 35.7000,
  k1: 40.8000,
  k2: 45.9000,
  k3: 51.0000,
  k4: 56.1000,
  k5: 61.2000,
  k6: 66.3000,
  k7: 71.4000,
  k8: 76.5000,
  k9: 81.6000,
  k10: 86.7000,
  k11: 91.8000,
  k12: 96.9000,
  k13: 2.9000,
  k14: 8.0000,
  k15: 13.1000,
  k16: 18.2000,
  k17: 23.3000,
  k18: 28.4000,
  k19: 33.5000,
  k20: 38.6000,
  k21: 43.7000,
  k22: 48.8000,
  k23: 53.9000,
  k24: 59.0000,
  k25: 64.1000,
  k26: 69.2000,
  k27: 74.3000,
  k28: 79.4000,
  k29: 84.5000,
  k30: 89.6000,
  k31: 94.7000,
  k32: 0.7000,
  k33: 5.8000,
  k34: 10.9000,
  k35: 16.0000,
  k36: 21.1000,
  k37: 26.2000,
  k38: 31.3000,
  k39: 36.4000,
  k40: 41.5000,
  k41: 46.6000,
  k42: 51.7000,
  k43: 56.8000,
  k44: 61.9000,
  k45: 67.0000,
  k46: 72.1000,
  k47: 77.2000,
  k48: 82.3000,
  k49: 87.4000,
  k50: 92.5000,
  k51: 97.6000,
  k52: 3.6000,
  k53: 8.7000,
  k54: 13.8000,
  k55: 18.9000,
  k56: 24.0000,
  k57: 29.1000,
  k58: 34.2000,
  k59: 39.3000,
  k60: 44.4000,
  k61: 49.5000,
  k62: 54.6000,
  k63: 59.7000,
  k64: 64.8000,
  k65: 69.9000,
  k66: 75.0000,
  k67: 80.1000,
  k68: 85.2000,
  k69: 90.3000,
  k70: 95.4000,
  k71: 1.4000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_139_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_139_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_139_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_139_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_139_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_139_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_139_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_139_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_139_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_139_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_139_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_139_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
