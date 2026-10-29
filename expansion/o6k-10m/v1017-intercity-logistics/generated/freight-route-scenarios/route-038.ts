import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 038 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_038_META = {
  id: 'route_038',
  regionId: 'NT' as V1017IclogRegionId,
  primarySystem: 'telecom' as V1017IclogSystemDomain,
  routeBand: 'critical' as V1017IclogRouteBand,
  seed: 33367,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_038_COEF = {
  k0: 68.4000,
  k1: 35.7000,
  k2: 3.0000,
  k3: 69.4000,
  k4: 36.7000,
  k5: 4.0000,
  k6: 70.4000,
  k7: 37.7000,
  k8: 5.0000,
  k9: 71.4000,
  k10: 38.7000,
  k11: 6.0000,
  k12: 72.4000,
  k13: 39.7000,
  k14: 7.0000,
  k15: 73.4000,
  k16: 40.7000,
  k17: 8.0000,
  k18: 74.4000,
  k19: 41.7000,
  k20: 9.0000,
  k21: 75.4000,
  k22: 42.7000,
  k23: 10.0000,
  k24: 76.4000,
  k25: 43.7000,
  k26: 11.0000,
  k27: 77.4000,
  k28: 44.7000,
  k29: 12.0000,
  k30: 78.4000,
  k31: 45.7000,
  k32: 13.0000,
  k33: 79.4000,
  k34: 46.7000,
  k35: 14.0000,
  k36: 80.4000,
  k37: 47.7000,
  k38: 15.0000,
  k39: 81.4000,
  k40: 48.7000,
  k41: 16.0000,
  k42: 82.4000,
  k43: 49.7000,
  k44: 17.0000,
  k45: 83.4000,
  k46: 50.7000,
  k47: 18.0000,
  k48: 84.4000,
  k49: 51.7000,
  k50: 19.0000,
  k51: 85.4000,
  k52: 52.7000,
  k53: 20.0000,
  k54: 86.4000,
  k55: 53.7000,
  k56: 21.0000,
  k57: 87.4000,
  k58: 54.7000,
  k59: 22.0000,
  k60: 88.4000,
  k61: 55.7000,
  k62: 23.0000,
  k63: 89.4000,
  k64: 56.7000,
  k65: 24.0000,
  k66: 90.4000,
  k67: 57.7000,
  k68: 25.0000,
  k69: 91.4000,
  k70: 58.7000,
  k71: 26.0000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_038_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_038_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_038_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_038_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_038_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_038_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_038_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_038_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_038_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_038_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_038_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_038_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
