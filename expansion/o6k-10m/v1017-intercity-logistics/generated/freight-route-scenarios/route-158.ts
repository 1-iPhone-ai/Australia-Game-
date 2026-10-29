import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 158 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_158_META = {
  id: 'route_158',
  regionId: 'NT' as V1017IclogRegionId,
  primarySystem: 'telecom' as V1017IclogSystemDomain,
  routeBand: 'critical' as V1017IclogRouteBand,
  seed: 138607,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_158_COEF = {
  k0: 6.0000,
  k1: 91.8000,
  k2: 78.5000,
  k3: 65.2000,
  k4: 51.9000,
  k5: 38.6000,
  k6: 25.3000,
  k7: 12.0000,
  k8: 97.8000,
  k9: 84.5000,
  k10: 71.2000,
  k11: 57.9000,
  k12: 44.6000,
  k13: 31.3000,
  k14: 18.0000,
  k15: 4.7000,
  k16: 90.5000,
  k17: 77.2000,
  k18: 63.9000,
  k19: 50.6000,
  k20: 37.3000,
  k21: 24.0000,
  k22: 10.7000,
  k23: 96.5000,
  k24: 83.2000,
  k25: 69.9000,
  k26: 56.6000,
  k27: 43.3000,
  k28: 30.0000,
  k29: 16.7000,
  k30: 3.4000,
  k31: 89.2000,
  k32: 75.9000,
  k33: 62.6000,
  k34: 49.3000,
  k35: 36.0000,
  k36: 22.7000,
  k37: 9.4000,
  k38: 95.2000,
  k39: 81.9000,
  k40: 68.6000,
  k41: 55.3000,
  k42: 42.0000,
  k43: 28.7000,
  k44: 15.4000,
  k45: 2.1000,
  k46: 87.9000,
  k47: 74.6000,
  k48: 61.3000,
  k49: 48.0000,
  k50: 34.7000,
  k51: 21.4000,
  k52: 8.1000,
  k53: 93.9000,
  k54: 80.6000,
  k55: 67.3000,
  k56: 54.0000,
  k57: 40.7000,
  k58: 27.4000,
  k59: 14.1000,
  k60: 0.8000,
  k61: 86.6000,
  k62: 73.3000,
  k63: 60.0000,
  k64: 46.7000,
  k65: 33.4000,
  k66: 20.1000,
  k67: 6.8000,
  k68: 92.6000,
  k69: 79.3000,
  k70: 66.0000,
  k71: 52.7000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_158_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_158_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_158_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_158_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_158_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_158_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_158_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_158_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_158_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_158_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_158_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_158_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
