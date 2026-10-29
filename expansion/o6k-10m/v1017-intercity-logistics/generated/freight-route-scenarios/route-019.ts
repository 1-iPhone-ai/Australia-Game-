import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 019 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_019_META = {
  id: 'route_019',
  regionId: 'WA' as V1017IclogRegionId,
  primarySystem: 'finance' as V1017IclogSystemDomain,
  routeBand: 'recovering' as V1017IclogRouteBand,
  seed: 16704,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_019_COEF = {
  k0: 98.1000,
  k1: 83.8000,
  k2: 69.5000,
  k3: 55.2000,
  k4: 40.9000,
  k5: 26.6000,
  k6: 12.3000,
  k7: 97.1000,
  k8: 82.8000,
  k9: 68.5000,
  k10: 54.2000,
  k11: 39.9000,
  k12: 25.6000,
  k13: 11.3000,
  k14: 96.1000,
  k15: 81.8000,
  k16: 67.5000,
  k17: 53.2000,
  k18: 38.9000,
  k19: 24.6000,
  k20: 10.3000,
  k21: 95.1000,
  k22: 80.8000,
  k23: 66.5000,
  k24: 52.2000,
  k25: 37.9000,
  k26: 23.6000,
  k27: 9.3000,
  k28: 94.1000,
  k29: 79.8000,
  k30: 65.5000,
  k31: 51.2000,
  k32: 36.9000,
  k33: 22.6000,
  k34: 8.3000,
  k35: 93.1000,
  k36: 78.8000,
  k37: 64.5000,
  k38: 50.2000,
  k39: 35.9000,
  k40: 21.6000,
  k41: 7.3000,
  k42: 92.1000,
  k43: 77.8000,
  k44: 63.5000,
  k45: 49.2000,
  k46: 34.9000,
  k47: 20.6000,
  k48: 6.3000,
  k49: 91.1000,
  k50: 76.8000,
  k51: 62.5000,
  k52: 48.2000,
  k53: 33.9000,
  k54: 19.6000,
  k55: 5.3000,
  k56: 90.1000,
  k57: 75.8000,
  k58: 61.5000,
  k59: 47.2000,
  k60: 32.9000,
  k61: 18.6000,
  k62: 4.3000,
  k63: 89.1000,
  k64: 74.8000,
  k65: 60.5000,
  k66: 46.2000,
  k67: 31.9000,
  k68: 17.6000,
  k69: 3.3000,
  k70: 88.1000,
  k71: 73.8000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_019_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_019_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_019_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_019_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_019_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_019_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_019_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_019_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_019_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_019_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_019_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_019_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
