import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 083 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_083_META = {
  id: 'route_083',
  regionId: 'WA' as V1017IclogRegionId,
  primarySystem: 'digital' as V1017IclogSystemDomain,
  routeBand: 'critical' as V1017IclogRouteBand,
  seed: 72832,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_083_COEF = {
  k0: 45.0000,
  k1: 93.9000,
  k2: 43.7000,
  k3: 92.6000,
  k4: 42.4000,
  k5: 91.3000,
  k6: 41.1000,
  k7: 90.0000,
  k8: 39.8000,
  k9: 88.7000,
  k10: 38.5000,
  k11: 87.4000,
  k12: 37.2000,
  k13: 86.1000,
  k14: 35.9000,
  k15: 84.8000,
  k16: 34.6000,
  k17: 83.5000,
  k18: 33.3000,
  k19: 82.2000,
  k20: 32.0000,
  k21: 80.9000,
  k22: 30.7000,
  k23: 79.6000,
  k24: 29.4000,
  k25: 78.3000,
  k26: 28.1000,
  k27: 77.0000,
  k28: 26.8000,
  k29: 75.7000,
  k30: 25.5000,
  k31: 74.4000,
  k32: 24.2000,
  k33: 73.1000,
  k34: 22.9000,
  k35: 71.8000,
  k36: 21.6000,
  k37: 70.5000,
  k38: 20.3000,
  k39: 69.2000,
  k40: 19.0000,
  k41: 67.9000,
  k42: 17.7000,
  k43: 66.6000,
  k44: 16.4000,
  k45: 65.3000,
  k46: 15.1000,
  k47: 64.0000,
  k48: 13.8000,
  k49: 62.7000,
  k50: 12.5000,
  k51: 61.4000,
  k52: 11.2000,
  k53: 60.1000,
  k54: 9.9000,
  k55: 58.8000,
  k56: 8.6000,
  k57: 57.5000,
  k58: 7.3000,
  k59: 56.2000,
  k60: 6.0000,
  k61: 54.9000,
  k62: 4.7000,
  k63: 53.6000,
  k64: 3.4000,
  k65: 52.3000,
  k66: 2.1000,
  k67: 51.0000,
  k68: 0.8000,
  k69: 49.7000,
  k70: 98.6000,
  k71: 48.4000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_083_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_083_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_083_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_083_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_083_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_083_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_083_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_083_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_083_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_083_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_083_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_083_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
