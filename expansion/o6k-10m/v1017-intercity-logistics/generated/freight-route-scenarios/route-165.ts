import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 165 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_165_META = {
  id: 'route_165',
  regionId: 'TAS' as V1017IclogRegionId,
  primarySystem: 'pharma' as V1017IclogSystemDomain,
  routeBand: 'latent' as V1017IclogRouteBand,
  seed: 144746,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_165_COEF = {
  k0: 42.0000,
  k1: 48.0000,
  k2: 54.0000,
  k3: 60.0000,
  k4: 66.0000,
  k5: 72.0000,
  k6: 78.0000,
  k7: 84.0000,
  k8: 90.0000,
  k9: 96.0000,
  k10: 2.9000,
  k11: 8.9000,
  k12: 14.9000,
  k13: 20.9000,
  k14: 26.9000,
  k15: 32.9000,
  k16: 38.9000,
  k17: 44.9000,
  k18: 50.9000,
  k19: 56.9000,
  k20: 62.9000,
  k21: 68.9000,
  k22: 74.9000,
  k23: 80.9000,
  k24: 86.9000,
  k25: 92.9000,
  k26: 98.9000,
  k27: 5.8000,
  k28: 11.8000,
  k29: 17.8000,
  k30: 23.8000,
  k31: 29.8000,
  k32: 35.8000,
  k33: 41.8000,
  k34: 47.8000,
  k35: 53.8000,
  k36: 59.8000,
  k37: 65.8000,
  k38: 71.8000,
  k39: 77.8000,
  k40: 83.8000,
  k41: 89.8000,
  k42: 95.8000,
  k43: 2.7000,
  k44: 8.7000,
  k45: 14.7000,
  k46: 20.7000,
  k47: 26.7000,
  k48: 32.7000,
  k49: 38.7000,
  k50: 44.7000,
  k51: 50.7000,
  k52: 56.7000,
  k53: 62.7000,
  k54: 68.7000,
  k55: 74.7000,
  k56: 80.7000,
  k57: 86.7000,
  k58: 92.7000,
  k59: 98.7000,
  k60: 5.6000,
  k61: 11.6000,
  k62: 17.6000,
  k63: 23.6000,
  k64: 29.6000,
  k65: 35.6000,
  k66: 41.6000,
  k67: 47.6000,
  k68: 53.6000,
  k69: 59.6000,
  k70: 65.6000,
  k71: 71.6000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_165_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_165_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_165_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_165_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_165_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_165_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_165_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_165_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_165_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_165_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_165_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_165_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
