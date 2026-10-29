import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 094 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_094_META = {
  id: 'route_094',
  regionId: 'NT' as V1017IclogRegionId,
  primarySystem: 'trade' as V1017IclogSystemDomain,
  routeBand: 'recovering' as V1017IclogRouteBand,
  seed: 82479,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_094_COEF = {
  k0: 59.1000,
  k1: 81.7000,
  k2: 5.2000,
  k3: 27.8000,
  k4: 50.4000,
  k5: 73.0000,
  k6: 95.6000,
  k7: 19.1000,
  k8: 41.7000,
  k9: 64.3000,
  k10: 86.9000,
  k11: 10.4000,
  k12: 33.0000,
  k13: 55.6000,
  k14: 78.2000,
  k15: 1.7000,
  k16: 24.3000,
  k17: 46.9000,
  k18: 69.5000,
  k19: 92.1000,
  k20: 15.6000,
  k21: 38.2000,
  k22: 60.8000,
  k23: 83.4000,
  k24: 6.9000,
  k25: 29.5000,
  k26: 52.1000,
  k27: 74.7000,
  k28: 97.3000,
  k29: 20.8000,
  k30: 43.4000,
  k31: 66.0000,
  k32: 88.6000,
  k33: 12.1000,
  k34: 34.7000,
  k35: 57.3000,
  k36: 79.9000,
  k37: 3.4000,
  k38: 26.0000,
  k39: 48.6000,
  k40: 71.2000,
  k41: 93.8000,
  k42: 17.3000,
  k43: 39.9000,
  k44: 62.5000,
  k45: 85.1000,
  k46: 8.6000,
  k47: 31.2000,
  k48: 53.8000,
  k49: 76.4000,
  k50: 99.0000,
  k51: 22.5000,
  k52: 45.1000,
  k53: 67.7000,
  k54: 90.3000,
  k55: 13.8000,
  k56: 36.4000,
  k57: 59.0000,
  k58: 81.6000,
  k59: 5.1000,
  k60: 27.7000,
  k61: 50.3000,
  k62: 72.9000,
  k63: 95.5000,
  k64: 19.0000,
  k65: 41.6000,
  k66: 64.2000,
  k67: 86.8000,
  k68: 10.3000,
  k69: 32.9000,
  k70: 55.5000,
  k71: 78.1000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_094_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_094_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_094_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_094_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_094_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_094_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_094_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_094_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_094_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_094_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_094_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_094_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
