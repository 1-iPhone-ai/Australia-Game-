import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 030 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_030_META = {
  id: 'route_030',
  regionId: 'NT' as V1017IclogRegionId,
  primarySystem: 'freight' as V1017IclogSystemDomain,
  routeBand: 'latent' as V1017IclogRouteBand,
  seed: 26351,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_030_COEF = {
  k0: 13.1000,
  k1: 71.6000,
  k2: 31.0000,
  k3: 89.5000,
  k4: 48.9000,
  k5: 8.3000,
  k6: 66.8000,
  k7: 26.2000,
  k8: 84.7000,
  k9: 44.1000,
  k10: 3.5000,
  k11: 62.0000,
  k12: 21.4000,
  k13: 79.9000,
  k14: 39.3000,
  k15: 97.8000,
  k16: 57.2000,
  k17: 16.6000,
  k18: 75.1000,
  k19: 34.5000,
  k20: 93.0000,
  k21: 52.4000,
  k22: 11.8000,
  k23: 70.3000,
  k24: 29.7000,
  k25: 88.2000,
  k26: 47.6000,
  k27: 7.0000,
  k28: 65.5000,
  k29: 24.9000,
  k30: 83.4000,
  k31: 42.8000,
  k32: 2.2000,
  k33: 60.7000,
  k34: 20.1000,
  k35: 78.6000,
  k36: 38.0000,
  k37: 96.5000,
  k38: 55.9000,
  k39: 15.3000,
  k40: 73.8000,
  k41: 33.2000,
  k42: 91.7000,
  k43: 51.1000,
  k44: 10.5000,
  k45: 69.0000,
  k46: 28.4000,
  k47: 86.9000,
  k48: 46.3000,
  k49: 5.7000,
  k50: 64.2000,
  k51: 23.6000,
  k52: 82.1000,
  k53: 41.5000,
  k54: 0.9000,
  k55: 59.4000,
  k56: 18.8000,
  k57: 77.3000,
  k58: 36.7000,
  k59: 95.2000,
  k60: 54.6000,
  k61: 14.0000,
  k62: 72.5000,
  k63: 31.9000,
  k64: 90.4000,
  k65: 49.8000,
  k66: 9.2000,
  k67: 67.7000,
  k68: 27.1000,
  k69: 85.6000,
  k70: 45.0000,
  k71: 4.4000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_030_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_030_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_030_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_030_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_030_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_030_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_030_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_030_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_030_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_030_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_030_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_030_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
