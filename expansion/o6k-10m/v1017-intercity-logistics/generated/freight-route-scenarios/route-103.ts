import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 103 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_103_META = {
  id: 'route_103',
  regionId: 'ACT' as V1017IclogRegionId,
  primarySystem: 'digital' as V1017IclogSystemDomain,
  routeBand: 'critical' as V1017IclogRouteBand,
  seed: 90372,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_103_COEF = {
  k0: 34.6000,
  k1: 53.7000,
  k2: 72.8000,
  k3: 91.9000,
  k4: 11.9000,
  k5: 31.0000,
  k6: 50.1000,
  k7: 69.2000,
  k8: 88.3000,
  k9: 8.3000,
  k10: 27.4000,
  k11: 46.5000,
  k12: 65.6000,
  k13: 84.7000,
  k14: 4.7000,
  k15: 23.8000,
  k16: 42.9000,
  k17: 62.0000,
  k18: 81.1000,
  k19: 1.1000,
  k20: 20.2000,
  k21: 39.3000,
  k22: 58.4000,
  k23: 77.5000,
  k24: 96.6000,
  k25: 16.6000,
  k26: 35.7000,
  k27: 54.8000,
  k28: 73.9000,
  k29: 93.0000,
  k30: 13.0000,
  k31: 32.1000,
  k32: 51.2000,
  k33: 70.3000,
  k34: 89.4000,
  k35: 9.4000,
  k36: 28.5000,
  k37: 47.6000,
  k38: 66.7000,
  k39: 85.8000,
  k40: 5.8000,
  k41: 24.9000,
  k42: 44.0000,
  k43: 63.1000,
  k44: 82.2000,
  k45: 2.2000,
  k46: 21.3000,
  k47: 40.4000,
  k48: 59.5000,
  k49: 78.6000,
  k50: 97.7000,
  k51: 17.7000,
  k52: 36.8000,
  k53: 55.9000,
  k54: 75.0000,
  k55: 94.1000,
  k56: 14.1000,
  k57: 33.2000,
  k58: 52.3000,
  k59: 71.4000,
  k60: 90.5000,
  k61: 10.5000,
  k62: 29.6000,
  k63: 48.7000,
  k64: 67.8000,
  k65: 86.9000,
  k66: 6.9000,
  k67: 26.0000,
  k68: 45.1000,
  k69: 64.2000,
  k70: 83.3000,
  k71: 3.3000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_103_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_103_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_103_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_103_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_103_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_103_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_103_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_103_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_103_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_103_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_103_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_103_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
