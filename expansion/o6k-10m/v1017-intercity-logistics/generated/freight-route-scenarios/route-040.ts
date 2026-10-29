import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 040 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_040_META = {
  id: 'route_040',
  regionId: 'NSW' as V1017IclogRegionId,
  primarySystem: 'freight' as V1017IclogSystemDomain,
  routeBand: 'latent' as V1017IclogRouteBand,
  seed: 35121,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_040_COEF = {
  k0: 7.9000,
  k1: 51.5000,
  k2: 95.1000,
  k3: 39.6000,
  k4: 83.2000,
  k5: 27.7000,
  k6: 71.3000,
  k7: 15.8000,
  k8: 59.4000,
  k9: 3.9000,
  k10: 47.5000,
  k11: 91.1000,
  k12: 35.6000,
  k13: 79.2000,
  k14: 23.7000,
  k15: 67.3000,
  k16: 11.8000,
  k17: 55.4000,
  k18: 99.0000,
  k19: 43.5000,
  k20: 87.1000,
  k21: 31.6000,
  k22: 75.2000,
  k23: 19.7000,
  k24: 63.3000,
  k25: 7.8000,
  k26: 51.4000,
  k27: 95.0000,
  k28: 39.5000,
  k29: 83.1000,
  k30: 27.6000,
  k31: 71.2000,
  k32: 15.7000,
  k33: 59.3000,
  k34: 3.8000,
  k35: 47.4000,
  k36: 91.0000,
  k37: 35.5000,
  k38: 79.1000,
  k39: 23.6000,
  k40: 67.2000,
  k41: 11.7000,
  k42: 55.3000,
  k43: 98.9000,
  k44: 43.4000,
  k45: 87.0000,
  k46: 31.5000,
  k47: 75.1000,
  k48: 19.6000,
  k49: 63.2000,
  k50: 7.7000,
  k51: 51.3000,
  k52: 94.9000,
  k53: 39.4000,
  k54: 83.0000,
  k55: 27.5000,
  k56: 71.1000,
  k57: 15.6000,
  k58: 59.2000,
  k59: 3.7000,
  k60: 47.3000,
  k61: 90.9000,
  k62: 35.4000,
  k63: 79.0000,
  k64: 23.5000,
  k65: 67.1000,
  k66: 11.6000,
  k67: 55.2000,
  k68: 98.8000,
  k69: 43.3000,
  k70: 86.9000,
  k71: 31.4000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_040_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_040_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_040_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_040_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_040_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_040_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_040_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_040_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_040_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_040_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_040_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_040_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
