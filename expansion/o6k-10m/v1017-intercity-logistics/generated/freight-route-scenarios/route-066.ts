import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 066 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_066_META = {
  id: 'route_066',
  regionId: 'QLD' as V1017IclogRegionId,
  primarySystem: 'food' as V1017IclogSystemDomain,
  routeBand: 'emerging' as V1017IclogRouteBand,
  seed: 57923,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_066_COEF = {
  k0: 14.2000,
  k1: 58.7000,
  k2: 4.1000,
  k3: 48.6000,
  k4: 93.1000,
  k5: 38.5000,
  k6: 83.0000,
  k7: 28.4000,
  k8: 72.9000,
  k9: 18.3000,
  k10: 62.8000,
  k11: 8.2000,
  k12: 52.7000,
  k13: 97.2000,
  k14: 42.6000,
  k15: 87.1000,
  k16: 32.5000,
  k17: 77.0000,
  k18: 22.4000,
  k19: 66.9000,
  k20: 12.3000,
  k21: 56.8000,
  k22: 2.2000,
  k23: 46.7000,
  k24: 91.2000,
  k25: 36.6000,
  k26: 81.1000,
  k27: 26.5000,
  k28: 71.0000,
  k29: 16.4000,
  k30: 60.9000,
  k31: 6.3000,
  k32: 50.8000,
  k33: 95.3000,
  k34: 40.7000,
  k35: 85.2000,
  k36: 30.6000,
  k37: 75.1000,
  k38: 20.5000,
  k39: 65.0000,
  k40: 10.4000,
  k41: 54.9000,
  k42: 0.3000,
  k43: 44.8000,
  k44: 89.3000,
  k45: 34.7000,
  k46: 79.2000,
  k47: 24.6000,
  k48: 69.1000,
  k49: 14.5000,
  k50: 59.0000,
  k51: 4.4000,
  k52: 48.9000,
  k53: 93.4000,
  k54: 38.8000,
  k55: 83.3000,
  k56: 28.7000,
  k57: 73.2000,
  k58: 18.6000,
  k59: 63.1000,
  k60: 8.5000,
  k61: 53.0000,
  k62: 97.5000,
  k63: 42.9000,
  k64: 87.4000,
  k65: 32.8000,
  k66: 77.3000,
  k67: 22.7000,
  k68: 67.2000,
  k69: 12.6000,
  k70: 57.1000,
  k71: 2.5000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_066_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_066_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_066_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_066_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_066_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_066_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_066_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_066_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_066_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_066_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_066_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_066_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
