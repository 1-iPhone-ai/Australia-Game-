import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 075 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_075_META = {
  id: 'route_075',
  regionId: 'WA' as V1017IclogRegionId,
  primarySystem: 'pharma' as V1017IclogSystemDomain,
  routeBand: 'latent' as V1017IclogRouteBand,
  seed: 65816,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_075_COEF = {
  k0: 88.8000,
  k1: 30.7000,
  k2: 71.7000,
  k3: 13.6000,
  k4: 54.6000,
  k5: 95.6000,
  k6: 37.5000,
  k7: 78.5000,
  k8: 20.4000,
  k9: 61.4000,
  k10: 3.3000,
  k11: 44.3000,
  k12: 85.3000,
  k13: 27.2000,
  k14: 68.2000,
  k15: 10.1000,
  k16: 51.1000,
  k17: 92.1000,
  k18: 34.0000,
  k19: 75.0000,
  k20: 16.9000,
  k21: 57.9000,
  k22: 98.9000,
  k23: 40.8000,
  k24: 81.8000,
  k25: 23.7000,
  k26: 64.7000,
  k27: 6.6000,
  k28: 47.6000,
  k29: 88.6000,
  k30: 30.5000,
  k31: 71.5000,
  k32: 13.4000,
  k33: 54.4000,
  k34: 95.4000,
  k35: 37.3000,
  k36: 78.3000,
  k37: 20.2000,
  k38: 61.2000,
  k39: 3.1000,
  k40: 44.1000,
  k41: 85.1000,
  k42: 27.0000,
  k43: 68.0000,
  k44: 9.9000,
  k45: 50.9000,
  k46: 91.9000,
  k47: 33.8000,
  k48: 74.8000,
  k49: 16.7000,
  k50: 57.7000,
  k51: 98.7000,
  k52: 40.6000,
  k53: 81.6000,
  k54: 23.5000,
  k55: 64.5000,
  k56: 6.4000,
  k57: 47.4000,
  k58: 88.4000,
  k59: 30.3000,
  k60: 71.3000,
  k61: 13.2000,
  k62: 54.2000,
  k63: 95.2000,
  k64: 37.1000,
  k65: 78.1000,
  k66: 20.0000,
  k67: 61.0000,
  k68: 2.9000,
  k69: 43.9000,
  k70: 84.9000,
  k71: 26.8000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_075_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_075_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_075_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_075_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_075_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_075_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_075_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_075_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_075_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_075_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_075_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_075_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
