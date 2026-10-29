import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 045 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_045_META = {
  id: 'route_045',
  regionId: 'TAS' as V1017IclogRegionId,
  primarySystem: 'pharma' as V1017IclogSystemDomain,
  routeBand: 'latent' as V1017IclogRouteBand,
  seed: 39506,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_045_COEF = {
  k0: 5.3000,
  k1: 91.0000,
  k2: 77.6000,
  k3: 64.2000,
  k4: 50.8000,
  k5: 37.4000,
  k6: 24.0000,
  k7: 10.6000,
  k8: 96.3000,
  k9: 82.9000,
  k10: 69.5000,
  k11: 56.1000,
  k12: 42.7000,
  k13: 29.3000,
  k14: 15.9000,
  k15: 2.5000,
  k16: 88.2000,
  k17: 74.8000,
  k18: 61.4000,
  k19: 48.0000,
  k20: 34.6000,
  k21: 21.2000,
  k22: 7.8000,
  k23: 93.5000,
  k24: 80.1000,
  k25: 66.7000,
  k26: 53.3000,
  k27: 39.9000,
  k28: 26.5000,
  k29: 13.1000,
  k30: 98.8000,
  k31: 85.4000,
  k32: 72.0000,
  k33: 58.6000,
  k34: 45.2000,
  k35: 31.8000,
  k36: 18.4000,
  k37: 5.0000,
  k38: 90.7000,
  k39: 77.3000,
  k40: 63.9000,
  k41: 50.5000,
  k42: 37.1000,
  k43: 23.7000,
  k44: 10.3000,
  k45: 96.0000,
  k46: 82.6000,
  k47: 69.2000,
  k48: 55.8000,
  k49: 42.4000,
  k50: 29.0000,
  k51: 15.6000,
  k52: 2.2000,
  k53: 87.9000,
  k54: 74.5000,
  k55: 61.1000,
  k56: 47.7000,
  k57: 34.3000,
  k58: 20.9000,
  k59: 7.5000,
  k60: 93.2000,
  k61: 79.8000,
  k62: 66.4000,
  k63: 53.0000,
  k64: 39.6000,
  k65: 26.2000,
  k66: 12.8000,
  k67: 98.5000,
  k68: 85.1000,
  k69: 71.7000,
  k70: 58.3000,
  k71: 44.9000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_045_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_045_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_045_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_045_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_045_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_045_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_045_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_045_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_045_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_045_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_045_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_045_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
