import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 010 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_010_META = {
  id: 'route_010',
  regionId: 'QLD' as V1017IclogRegionId,
  primarySystem: 'freight' as V1017IclogSystemDomain,
  routeBand: 'latent' as V1017IclogRouteBand,
  seed: 8811,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_010_COEF = {
  k0: 23.5000,
  k1: 12.7000,
  k2: 1.9000,
  k3: 90.2000,
  k4: 79.4000,
  k5: 68.6000,
  k6: 57.8000,
  k7: 47.0000,
  k8: 36.2000,
  k9: 25.4000,
  k10: 14.6000,
  k11: 3.8000,
  k12: 92.1000,
  k13: 81.3000,
  k14: 70.5000,
  k15: 59.7000,
  k16: 48.9000,
  k17: 38.1000,
  k18: 27.3000,
  k19: 16.5000,
  k20: 5.7000,
  k21: 94.0000,
  k22: 83.2000,
  k23: 72.4000,
  k24: 61.6000,
  k25: 50.8000,
  k26: 40.0000,
  k27: 29.2000,
  k28: 18.4000,
  k29: 7.6000,
  k30: 95.9000,
  k31: 85.1000,
  k32: 74.3000,
  k33: 63.5000,
  k34: 52.7000,
  k35: 41.9000,
  k36: 31.1000,
  k37: 20.3000,
  k38: 9.5000,
  k39: 97.8000,
  k40: 87.0000,
  k41: 76.2000,
  k42: 65.4000,
  k43: 54.6000,
  k44: 43.8000,
  k45: 33.0000,
  k46: 22.2000,
  k47: 11.4000,
  k48: 0.6000,
  k49: 88.9000,
  k50: 78.1000,
  k51: 67.3000,
  k52: 56.5000,
  k53: 45.7000,
  k54: 34.9000,
  k55: 24.1000,
  k56: 13.3000,
  k57: 2.5000,
  k58: 90.8000,
  k59: 80.0000,
  k60: 69.2000,
  k61: 58.4000,
  k62: 47.6000,
  k63: 36.8000,
  k64: 26.0000,
  k65: 15.2000,
  k66: 4.4000,
  k67: 92.7000,
  k68: 81.9000,
  k69: 71.1000,
  k70: 60.3000,
  k71: 49.5000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_010_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_010_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_010_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_010_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_010_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_010_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_010_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_010_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_010_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_010_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_010_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_010_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
