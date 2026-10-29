import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 171 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_171_META = {
  id: 'route_171',
  regionId: 'WA' as V1017IclogRegionId,
  primarySystem: 'energy' as V1017IclogSystemDomain,
  routeBand: 'emerging' as V1017IclogRouteBand,
  seed: 150008,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_171_COEF = {
  k0: 58.7000,
  k1: 95.4000,
  k2: 33.0000,
  k3: 69.7000,
  k4: 7.3000,
  k5: 44.0000,
  k6: 80.7000,
  k7: 18.3000,
  k8: 55.0000,
  k9: 91.7000,
  k10: 29.3000,
  k11: 66.0000,
  k12: 3.6000,
  k13: 40.3000,
  k14: 77.0000,
  k15: 14.6000,
  k16: 51.3000,
  k17: 88.0000,
  k18: 25.6000,
  k19: 62.3000,
  k20: 99.0000,
  k21: 36.6000,
  k22: 73.3000,
  k23: 10.9000,
  k24: 47.6000,
  k25: 84.3000,
  k26: 21.9000,
  k27: 58.6000,
  k28: 95.3000,
  k29: 32.9000,
  k30: 69.6000,
  k31: 7.2000,
  k32: 43.9000,
  k33: 80.6000,
  k34: 18.2000,
  k35: 54.9000,
  k36: 91.6000,
  k37: 29.2000,
  k38: 65.9000,
  k39: 3.5000,
  k40: 40.2000,
  k41: 76.9000,
  k42: 14.5000,
  k43: 51.2000,
  k44: 87.9000,
  k45: 25.5000,
  k46: 62.2000,
  k47: 98.9000,
  k48: 36.5000,
  k49: 73.2000,
  k50: 10.8000,
  k51: 47.5000,
  k52: 84.2000,
  k53: 21.8000,
  k54: 58.5000,
  k55: 95.2000,
  k56: 32.8000,
  k57: 69.5000,
  k58: 7.1000,
  k59: 43.8000,
  k60: 80.5000,
  k61: 18.1000,
  k62: 54.8000,
  k63: 91.5000,
  k64: 29.1000,
  k65: 65.8000,
  k66: 3.4000,
  k67: 40.1000,
  k68: 76.8000,
  k69: 14.4000,
  k70: 51.1000,
  k71: 87.8000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_171_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_171_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_171_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_171_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_171_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_171_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_171_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_171_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_171_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_171_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_171_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_171_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
