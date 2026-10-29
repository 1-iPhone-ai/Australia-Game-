import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 091 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_091_META = {
  id: 'route_091',
  regionId: 'WA' as V1017IclogRegionId,
  primarySystem: 'energy' as V1017IclogSystemDomain,
  routeBand: 'emerging' as V1017IclogRouteBand,
  seed: 79848,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_091_COEF = {
  k0: 1.2000,
  k1: 58.0000,
  k2: 15.7000,
  k3: 72.5000,
  k4: 30.2000,
  k5: 87.0000,
  k6: 44.7000,
  k7: 2.4000,
  k8: 59.2000,
  k9: 16.9000,
  k10: 73.7000,
  k11: 31.4000,
  k12: 88.2000,
  k13: 45.9000,
  k14: 3.6000,
  k15: 60.4000,
  k16: 18.1000,
  k17: 74.9000,
  k18: 32.6000,
  k19: 89.4000,
  k20: 47.1000,
  k21: 4.8000,
  k22: 61.6000,
  k23: 19.3000,
  k24: 76.1000,
  k25: 33.8000,
  k26: 90.6000,
  k27: 48.3000,
  k28: 6.0000,
  k29: 62.8000,
  k30: 20.5000,
  k31: 77.3000,
  k32: 35.0000,
  k33: 91.8000,
  k34: 49.5000,
  k35: 7.2000,
  k36: 64.0000,
  k37: 21.7000,
  k38: 78.5000,
  k39: 36.2000,
  k40: 93.0000,
  k41: 50.7000,
  k42: 8.4000,
  k43: 65.2000,
  k44: 22.9000,
  k45: 79.7000,
  k46: 37.4000,
  k47: 94.2000,
  k48: 51.9000,
  k49: 9.6000,
  k50: 66.4000,
  k51: 24.1000,
  k52: 80.9000,
  k53: 38.6000,
  k54: 95.4000,
  k55: 53.1000,
  k56: 10.8000,
  k57: 67.6000,
  k58: 25.3000,
  k59: 82.1000,
  k60: 39.8000,
  k61: 96.6000,
  k62: 54.3000,
  k63: 12.0000,
  k64: 68.8000,
  k65: 26.5000,
  k66: 83.3000,
  k67: 41.0000,
  k68: 97.8000,
  k69: 55.5000,
  k70: 13.2000,
  k71: 70.0000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_091_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_091_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_091_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_091_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_091_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_091_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_091_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_091_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_091_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_091_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_091_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_091_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
