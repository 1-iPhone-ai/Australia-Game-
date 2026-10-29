import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 049 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_049_META = {
  id: 'route_049',
  regionId: 'VIC' as V1017IclogRegionId,
  primarySystem: 'finance' as V1017IclogSystemDomain,
  routeBand: 'recovering' as V1017IclogRouteBand,
  seed: 43014,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_049_COEF = {
  k0: 82.5000,
  k1: 23.5000,
  k2: 63.6000,
  k3: 4.6000,
  k4: 44.7000,
  k5: 84.8000,
  k6: 25.8000,
  k7: 65.9000,
  k8: 6.9000,
  k9: 47.0000,
  k10: 87.1000,
  k11: 28.1000,
  k12: 68.2000,
  k13: 9.2000,
  k14: 49.3000,
  k15: 89.4000,
  k16: 30.4000,
  k17: 70.5000,
  k18: 11.5000,
  k19: 51.6000,
  k20: 91.7000,
  k21: 32.7000,
  k22: 72.8000,
  k23: 13.8000,
  k24: 53.9000,
  k25: 94.0000,
  k26: 35.0000,
  k27: 75.1000,
  k28: 16.1000,
  k29: 56.2000,
  k30: 96.3000,
  k31: 37.3000,
  k32: 77.4000,
  k33: 18.4000,
  k34: 58.5000,
  k35: 98.6000,
  k36: 39.6000,
  k37: 79.7000,
  k38: 20.7000,
  k39: 60.8000,
  k40: 1.8000,
  k41: 41.9000,
  k42: 82.0000,
  k43: 23.0000,
  k44: 63.1000,
  k45: 4.1000,
  k46: 44.2000,
  k47: 84.3000,
  k48: 25.3000,
  k49: 65.4000,
  k50: 6.4000,
  k51: 46.5000,
  k52: 86.6000,
  k53: 27.6000,
  k54: 67.7000,
  k55: 8.7000,
  k56: 48.8000,
  k57: 88.9000,
  k58: 29.9000,
  k59: 70.0000,
  k60: 11.0000,
  k61: 51.1000,
  k62: 91.2000,
  k63: 32.2000,
  k64: 72.3000,
  k65: 13.3000,
  k66: 53.4000,
  k67: 93.5000,
  k68: 34.5000,
  k69: 74.6000,
  k70: 15.6000,
  k71: 55.7000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_049_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_049_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_049_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_049_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_049_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_049_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_049_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_049_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_049_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_049_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_049_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_049_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
