import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 031 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_031_META = {
  id: 'route_031',
  regionId: 'ACT' as V1017IclogRegionId,
  primarySystem: 'energy' as V1017IclogSystemDomain,
  routeBand: 'emerging' as V1017IclogRouteBand,
  seed: 27228,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_031_COEF = {
  k0: 32.4000,
  k1: 79.5000,
  k2: 27.5000,
  k3: 74.6000,
  k4: 22.6000,
  k5: 69.7000,
  k6: 17.7000,
  k7: 64.8000,
  k8: 12.8000,
  k9: 59.9000,
  k10: 7.9000,
  k11: 55.0000,
  k12: 3.0000,
  k13: 50.1000,
  k14: 97.2000,
  k15: 45.2000,
  k16: 92.3000,
  k17: 40.3000,
  k18: 87.4000,
  k19: 35.4000,
  k20: 82.5000,
  k21: 30.5000,
  k22: 77.6000,
  k23: 25.6000,
  k24: 72.7000,
  k25: 20.7000,
  k26: 67.8000,
  k27: 15.8000,
  k28: 62.9000,
  k29: 10.9000,
  k30: 58.0000,
  k31: 6.0000,
  k32: 53.1000,
  k33: 1.1000,
  k34: 48.2000,
  k35: 95.3000,
  k36: 43.3000,
  k37: 90.4000,
  k38: 38.4000,
  k39: 85.5000,
  k40: 33.5000,
  k41: 80.6000,
  k42: 28.6000,
  k43: 75.7000,
  k44: 23.7000,
  k45: 70.8000,
  k46: 18.8000,
  k47: 65.9000,
  k48: 13.9000,
  k49: 61.0000,
  k50: 9.0000,
  k51: 56.1000,
  k52: 4.1000,
  k53: 51.2000,
  k54: 98.3000,
  k55: 46.3000,
  k56: 93.4000,
  k57: 41.4000,
  k58: 88.5000,
  k59: 36.5000,
  k60: 83.6000,
  k61: 31.6000,
  k62: 78.7000,
  k63: 26.7000,
  k64: 73.8000,
  k65: 21.8000,
  k66: 68.9000,
  k67: 16.9000,
  k68: 64.0000,
  k69: 12.0000,
  k70: 59.1000,
  k71: 7.1000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_031_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_031_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_031_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_031_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_031_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_031_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_031_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_031_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_031_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_031_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_031_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_031_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
