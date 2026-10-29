import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 149 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_149_META = {
  id: 'route_149',
  regionId: 'TAS' as V1017IclogRegionId,
  primarySystem: 'finance' as V1017IclogSystemDomain,
  routeBand: 'recovering' as V1017IclogRouteBand,
  seed: 130714,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_149_COEF = {
  k0: 30.5000,
  k1: 20.7000,
  k2: 10.9000,
  k3: 1.1000,
  k4: 90.4000,
  k5: 80.6000,
  k6: 70.8000,
  k7: 61.0000,
  k8: 51.2000,
  k9: 41.4000,
  k10: 31.6000,
  k11: 21.8000,
  k12: 12.0000,
  k13: 2.2000,
  k14: 91.5000,
  k15: 81.7000,
  k16: 71.9000,
  k17: 62.1000,
  k18: 52.3000,
  k19: 42.5000,
  k20: 32.7000,
  k21: 22.9000,
  k22: 13.1000,
  k23: 3.3000,
  k24: 92.6000,
  k25: 82.8000,
  k26: 73.0000,
  k27: 63.2000,
  k28: 53.4000,
  k29: 43.6000,
  k30: 33.8000,
  k31: 24.0000,
  k32: 14.2000,
  k33: 4.4000,
  k34: 93.7000,
  k35: 83.9000,
  k36: 74.1000,
  k37: 64.3000,
  k38: 54.5000,
  k39: 44.7000,
  k40: 34.9000,
  k41: 25.1000,
  k42: 15.3000,
  k43: 5.5000,
  k44: 94.8000,
  k45: 85.0000,
  k46: 75.2000,
  k47: 65.4000,
  k48: 55.6000,
  k49: 45.8000,
  k50: 36.0000,
  k51: 26.2000,
  k52: 16.4000,
  k53: 6.6000,
  k54: 95.9000,
  k55: 86.1000,
  k56: 76.3000,
  k57: 66.5000,
  k58: 56.7000,
  k59: 46.9000,
  k60: 37.1000,
  k61: 27.3000,
  k62: 17.5000,
  k63: 7.7000,
  k64: 97.0000,
  k65: 87.2000,
  k66: 77.4000,
  k67: 67.6000,
  k68: 57.8000,
  k69: 48.0000,
  k70: 38.2000,
  k71: 28.4000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_149_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_149_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_149_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_149_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_149_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_149_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_149_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_149_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_149_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_149_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_149_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_149_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
