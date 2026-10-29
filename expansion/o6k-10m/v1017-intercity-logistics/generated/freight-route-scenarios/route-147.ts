import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 147 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_147_META = {
  id: 'route_147',
  regionId: 'WA' as V1017IclogRegionId,
  primarySystem: 'industrial' as V1017IclogSystemDomain,
  routeBand: 'active' as V1017IclogRouteBand,
  seed: 128960,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_147_COEF = {
  k0: 91.0000,
  k1: 4.9000,
  k2: 17.9000,
  k3: 30.9000,
  k4: 43.9000,
  k5: 56.9000,
  k6: 69.9000,
  k7: 82.9000,
  k8: 95.9000,
  k9: 9.8000,
  k10: 22.8000,
  k11: 35.8000,
  k12: 48.8000,
  k13: 61.8000,
  k14: 74.8000,
  k15: 87.8000,
  k16: 1.7000,
  k17: 14.7000,
  k18: 27.7000,
  k19: 40.7000,
  k20: 53.7000,
  k21: 66.7000,
  k22: 79.7000,
  k23: 92.7000,
  k24: 6.6000,
  k25: 19.6000,
  k26: 32.6000,
  k27: 45.6000,
  k28: 58.6000,
  k29: 71.6000,
  k30: 84.6000,
  k31: 97.6000,
  k32: 11.5000,
  k33: 24.5000,
  k34: 37.5000,
  k35: 50.5000,
  k36: 63.5000,
  k37: 76.5000,
  k38: 89.5000,
  k39: 3.4000,
  k40: 16.4000,
  k41: 29.4000,
  k42: 42.4000,
  k43: 55.4000,
  k44: 68.4000,
  k45: 81.4000,
  k46: 94.4000,
  k47: 8.3000,
  k48: 21.3000,
  k49: 34.3000,
  k50: 47.3000,
  k51: 60.3000,
  k52: 73.3000,
  k53: 86.3000,
  k54: 0.2000,
  k55: 13.2000,
  k56: 26.2000,
  k57: 39.2000,
  k58: 52.2000,
  k59: 65.2000,
  k60: 78.2000,
  k61: 91.2000,
  k62: 5.1000,
  k63: 18.1000,
  k64: 31.1000,
  k65: 44.1000,
  k66: 57.1000,
  k67: 70.1000,
  k68: 83.1000,
  k69: 96.1000,
  k70: 10.0000,
  k71: 23.0000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_147_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_147_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_147_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_147_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_147_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_147_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_147_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_147_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_147_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_147_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_147_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_147_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
