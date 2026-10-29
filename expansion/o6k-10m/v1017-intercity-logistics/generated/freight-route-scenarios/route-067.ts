import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 067 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_067_META = {
  id: 'route_067',
  regionId: 'WA' as V1017IclogRegionId,
  primarySystem: 'industrial' as V1017IclogSystemDomain,
  routeBand: 'active' as V1017IclogRouteBand,
  seed: 58800,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_067_COEF = {
  k0: 33.5000,
  k1: 66.6000,
  k2: 0.6000,
  k3: 33.7000,
  k4: 66.8000,
  k5: 0.8000,
  k6: 33.9000,
  k7: 67.0000,
  k8: 1.0000,
  k9: 34.1000,
  k10: 67.2000,
  k11: 1.2000,
  k12: 34.3000,
  k13: 67.4000,
  k14: 1.4000,
  k15: 34.5000,
  k16: 67.6000,
  k17: 1.6000,
  k18: 34.7000,
  k19: 67.8000,
  k20: 1.8000,
  k21: 34.9000,
  k22: 68.0000,
  k23: 2.0000,
  k24: 35.1000,
  k25: 68.2000,
  k26: 2.2000,
  k27: 35.3000,
  k28: 68.4000,
  k29: 2.4000,
  k30: 35.5000,
  k31: 68.6000,
  k32: 2.6000,
  k33: 35.7000,
  k34: 68.8000,
  k35: 2.8000,
  k36: 35.9000,
  k37: 69.0000,
  k38: 3.0000,
  k39: 36.1000,
  k40: 69.2000,
  k41: 3.2000,
  k42: 36.3000,
  k43: 69.4000,
  k44: 3.4000,
  k45: 36.5000,
  k46: 69.6000,
  k47: 3.6000,
  k48: 36.7000,
  k49: 69.8000,
  k50: 3.8000,
  k51: 36.9000,
  k52: 70.0000,
  k53: 4.0000,
  k54: 37.1000,
  k55: 70.2000,
  k56: 4.2000,
  k57: 37.3000,
  k58: 70.4000,
  k59: 4.4000,
  k60: 37.5000,
  k61: 70.6000,
  k62: 4.6000,
  k63: 37.7000,
  k64: 70.8000,
  k65: 4.8000,
  k66: 37.9000,
  k67: 71.0000,
  k68: 5.0000,
  k69: 38.1000,
  k70: 71.2000,
  k71: 5.2000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_067_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_067_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_067_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_067_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_067_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_067_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_067_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_067_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_067_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_067_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_067_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_067_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
