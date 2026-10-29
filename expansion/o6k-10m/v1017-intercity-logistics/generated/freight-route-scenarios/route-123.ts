import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 123 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_123_META = {
  id: 'route_123',
  regionId: 'WA' as V1017IclogRegionId,
  primarySystem: 'digital' as V1017IclogSystemDomain,
  routeBand: 'critical' as V1017IclogRouteBand,
  seed: 107912,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_123_COEF = {
  k0: 24.2000,
  k1: 13.5000,
  k2: 2.8000,
  k3: 91.2000,
  k4: 80.5000,
  k5: 69.8000,
  k6: 59.1000,
  k7: 48.4000,
  k8: 37.7000,
  k9: 27.0000,
  k10: 16.3000,
  k11: 5.6000,
  k12: 94.0000,
  k13: 83.3000,
  k14: 72.6000,
  k15: 61.9000,
  k16: 51.2000,
  k17: 40.5000,
  k18: 29.8000,
  k19: 19.1000,
  k20: 8.4000,
  k21: 96.8000,
  k22: 86.1000,
  k23: 75.4000,
  k24: 64.7000,
  k25: 54.0000,
  k26: 43.3000,
  k27: 32.6000,
  k28: 21.9000,
  k29: 11.2000,
  k30: 0.5000,
  k31: 88.9000,
  k32: 78.2000,
  k33: 67.5000,
  k34: 56.8000,
  k35: 46.1000,
  k36: 35.4000,
  k37: 24.7000,
  k38: 14.0000,
  k39: 3.3000,
  k40: 91.7000,
  k41: 81.0000,
  k42: 70.3000,
  k43: 59.6000,
  k44: 48.9000,
  k45: 38.2000,
  k46: 27.5000,
  k47: 16.8000,
  k48: 6.1000,
  k49: 94.5000,
  k50: 83.8000,
  k51: 73.1000,
  k52: 62.4000,
  k53: 51.7000,
  k54: 41.0000,
  k55: 30.3000,
  k56: 19.6000,
  k57: 8.9000,
  k58: 97.3000,
  k59: 86.6000,
  k60: 75.9000,
  k61: 65.2000,
  k62: 54.5000,
  k63: 43.8000,
  k64: 33.1000,
  k65: 22.4000,
  k66: 11.7000,
  k67: 1.0000,
  k68: 89.4000,
  k69: 78.7000,
  k70: 68.0000,
  k71: 57.3000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_123_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_123_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_123_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_123_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_123_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_123_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_123_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_123_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_123_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_123_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_123_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_123_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
