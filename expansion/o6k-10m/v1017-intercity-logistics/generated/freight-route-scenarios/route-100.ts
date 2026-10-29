import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 100 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_100_META = {
  id: 'route_100',
  regionId: 'SA' as V1017IclogRegionId,
  primarySystem: 'freight' as V1017IclogSystemDomain,
  routeBand: 'latent' as V1017IclogRouteBand,
  seed: 87741,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_100_COEF = {
  k0: 75.8000,
  k1: 30.0000,
  k2: 83.3000,
  k3: 37.5000,
  k4: 90.8000,
  k5: 45.0000,
  k6: 98.3000,
  k7: 52.5000,
  k8: 6.7000,
  k9: 60.0000,
  k10: 14.2000,
  k11: 67.5000,
  k12: 21.7000,
  k13: 75.0000,
  k14: 29.2000,
  k15: 82.5000,
  k16: 36.7000,
  k17: 90.0000,
  k18: 44.2000,
  k19: 97.5000,
  k20: 51.7000,
  k21: 5.9000,
  k22: 59.2000,
  k23: 13.4000,
  k24: 66.7000,
  k25: 20.9000,
  k26: 74.2000,
  k27: 28.4000,
  k28: 81.7000,
  k29: 35.9000,
  k30: 89.2000,
  k31: 43.4000,
  k32: 96.7000,
  k33: 50.9000,
  k34: 5.1000,
  k35: 58.4000,
  k36: 12.6000,
  k37: 65.9000,
  k38: 20.1000,
  k39: 73.4000,
  k40: 27.6000,
  k41: 80.9000,
  k42: 35.1000,
  k43: 88.4000,
  k44: 42.6000,
  k45: 95.9000,
  k46: 50.1000,
  k47: 4.3000,
  k48: 57.6000,
  k49: 11.8000,
  k50: 65.1000,
  k51: 19.3000,
  k52: 72.6000,
  k53: 26.8000,
  k54: 80.1000,
  k55: 34.3000,
  k56: 87.6000,
  k57: 41.8000,
  k58: 95.1000,
  k59: 49.3000,
  k60: 3.5000,
  k61: 56.8000,
  k62: 11.0000,
  k63: 64.3000,
  k64: 18.5000,
  k65: 71.8000,
  k66: 26.0000,
  k67: 79.3000,
  k68: 33.5000,
  k69: 86.8000,
  k70: 41.0000,
  k71: 94.3000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_100_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_100_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_100_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_100_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_100_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_100_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_100_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_100_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_100_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_100_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_100_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_100_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
