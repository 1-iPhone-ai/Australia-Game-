import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 112 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_112_META = {
  id: 'route_112',
  regionId: 'NSW' as V1017IclogRegionId,
  primarySystem: 'water' as V1017IclogSystemDomain,
  routeBand: 'active' as V1017IclogRouteBand,
  seed: 98265,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_112_COEF = {
  k0: 10.1000,
  k1: 25.7000,
  k2: 41.3000,
  k3: 56.9000,
  k4: 72.5000,
  k5: 88.1000,
  k6: 4.6000,
  k7: 20.2000,
  k8: 35.8000,
  k9: 51.4000,
  k10: 67.0000,
  k11: 82.6000,
  k12: 98.2000,
  k13: 14.7000,
  k14: 30.3000,
  k15: 45.9000,
  k16: 61.5000,
  k17: 77.1000,
  k18: 92.7000,
  k19: 9.2000,
  k20: 24.8000,
  k21: 40.4000,
  k22: 56.0000,
  k23: 71.6000,
  k24: 87.2000,
  k25: 3.7000,
  k26: 19.3000,
  k27: 34.9000,
  k28: 50.5000,
  k29: 66.1000,
  k30: 81.7000,
  k31: 97.3000,
  k32: 13.8000,
  k33: 29.4000,
  k34: 45.0000,
  k35: 60.6000,
  k36: 76.2000,
  k37: 91.8000,
  k38: 8.3000,
  k39: 23.9000,
  k40: 39.5000,
  k41: 55.1000,
  k42: 70.7000,
  k43: 86.3000,
  k44: 2.8000,
  k45: 18.4000,
  k46: 34.0000,
  k47: 49.6000,
  k48: 65.2000,
  k49: 80.8000,
  k50: 96.4000,
  k51: 12.9000,
  k52: 28.5000,
  k53: 44.1000,
  k54: 59.7000,
  k55: 75.3000,
  k56: 90.9000,
  k57: 7.4000,
  k58: 23.0000,
  k59: 38.6000,
  k60: 54.2000,
  k61: 69.8000,
  k62: 85.4000,
  k63: 1.9000,
  k64: 17.5000,
  k65: 33.1000,
  k66: 48.7000,
  k67: 64.3000,
  k68: 79.9000,
  k69: 95.5000,
  k70: 12.0000,
  k71: 27.6000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_112_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_112_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_112_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_112_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_112_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_112_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_112_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_112_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_112_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_112_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_112_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_112_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
