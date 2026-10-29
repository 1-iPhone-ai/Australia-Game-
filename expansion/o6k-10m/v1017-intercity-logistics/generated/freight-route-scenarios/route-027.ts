import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 027 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_027_META = {
  id: 'route_027',
  regionId: 'WA' as V1017IclogRegionId,
  primarySystem: 'industrial' as V1017IclogSystemDomain,
  routeBand: 'active' as V1017IclogRouteBand,
  seed: 23720,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_027_COEF = {
  k0: 54.3000,
  k1: 47.9000,
  k2: 41.5000,
  k3: 35.1000,
  k4: 28.7000,
  k5: 22.3000,
  k6: 15.9000,
  k7: 9.5000,
  k8: 3.1000,
  k9: 95.8000,
  k10: 89.4000,
  k11: 83.0000,
  k12: 76.6000,
  k13: 70.2000,
  k14: 63.8000,
  k15: 57.4000,
  k16: 51.0000,
  k17: 44.6000,
  k18: 38.2000,
  k19: 31.8000,
  k20: 25.4000,
  k21: 19.0000,
  k22: 12.6000,
  k23: 6.2000,
  k24: 98.9000,
  k25: 92.5000,
  k26: 86.1000,
  k27: 79.7000,
  k28: 73.3000,
  k29: 66.9000,
  k30: 60.5000,
  k31: 54.1000,
  k32: 47.7000,
  k33: 41.3000,
  k34: 34.9000,
  k35: 28.5000,
  k36: 22.1000,
  k37: 15.7000,
  k38: 9.3000,
  k39: 2.9000,
  k40: 95.6000,
  k41: 89.2000,
  k42: 82.8000,
  k43: 76.4000,
  k44: 70.0000,
  k45: 63.6000,
  k46: 57.2000,
  k47: 50.8000,
  k48: 44.4000,
  k49: 38.0000,
  k50: 31.6000,
  k51: 25.2000,
  k52: 18.8000,
  k53: 12.4000,
  k54: 6.0000,
  k55: 98.7000,
  k56: 92.3000,
  k57: 85.9000,
  k58: 79.5000,
  k59: 73.1000,
  k60: 66.7000,
  k61: 60.3000,
  k62: 53.9000,
  k63: 47.5000,
  k64: 41.1000,
  k65: 34.7000,
  k66: 28.3000,
  k67: 21.9000,
  k68: 15.5000,
  k69: 9.1000,
  k70: 2.7000,
  k71: 95.4000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_027_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_027_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_027_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_027_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_027_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_027_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_027_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_027_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_027_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_027_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_027_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_027_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
