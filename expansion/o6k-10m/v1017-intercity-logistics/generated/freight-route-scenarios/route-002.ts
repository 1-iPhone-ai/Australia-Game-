import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 002 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_002_META = {
  id: 'route_002',
  regionId: 'QLD' as V1017IclogRegionId,
  primarySystem: 'water' as V1017IclogSystemDomain,
  routeBand: 'active' as V1017IclogRouteBand,
  seed: 1795,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_002_COEF = {
  k0: 67.3000,
  k1: 48.6000,
  k2: 29.9000,
  k3: 11.2000,
  k4: 91.6000,
  k5: 72.9000,
  k6: 54.2000,
  k7: 35.5000,
  k8: 16.8000,
  k9: 97.2000,
  k10: 78.5000,
  k11: 59.8000,
  k12: 41.1000,
  k13: 22.4000,
  k14: 3.7000,
  k15: 84.1000,
  k16: 65.4000,
  k17: 46.7000,
  k18: 28.0000,
  k19: 9.3000,
  k20: 89.7000,
  k21: 71.0000,
  k22: 52.3000,
  k23: 33.6000,
  k24: 14.9000,
  k25: 95.3000,
  k26: 76.6000,
  k27: 57.9000,
  k28: 39.2000,
  k29: 20.5000,
  k30: 1.8000,
  k31: 82.2000,
  k32: 63.5000,
  k33: 44.8000,
  k34: 26.1000,
  k35: 7.4000,
  k36: 87.8000,
  k37: 69.1000,
  k38: 50.4000,
  k39: 31.7000,
  k40: 13.0000,
  k41: 93.4000,
  k42: 74.7000,
  k43: 56.0000,
  k44: 37.3000,
  k45: 18.6000,
  k46: 99.0000,
  k47: 80.3000,
  k48: 61.6000,
  k49: 42.9000,
  k50: 24.2000,
  k51: 5.5000,
  k52: 85.9000,
  k53: 67.2000,
  k54: 48.5000,
  k55: 29.8000,
  k56: 11.1000,
  k57: 91.5000,
  k58: 72.8000,
  k59: 54.1000,
  k60: 35.4000,
  k61: 16.7000,
  k62: 97.1000,
  k63: 78.4000,
  k64: 59.7000,
  k65: 41.0000,
  k66: 22.3000,
  k67: 3.6000,
  k68: 84.0000,
  k69: 65.3000,
  k70: 46.6000,
  k71: 27.9000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_002_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_002_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_002_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_002_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_002_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_002_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_002_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_002_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_002_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_002_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_002_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_002_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
