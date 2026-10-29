import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 033 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_033_META = {
  id: 'route_033',
  regionId: 'VIC' as V1017IclogRegionId,
  primarySystem: 'digital' as V1017IclogSystemDomain,
  routeBand: 'critical' as V1017IclogRouteBand,
  seed: 28982,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_033_COEF = {
  k0: 71.0000,
  k1: 95.3000,
  k2: 20.5000,
  k3: 44.8000,
  k4: 69.1000,
  k5: 93.4000,
  k6: 18.6000,
  k7: 42.9000,
  k8: 67.2000,
  k9: 91.5000,
  k10: 16.7000,
  k11: 41.0000,
  k12: 65.3000,
  k13: 89.6000,
  k14: 14.8000,
  k15: 39.1000,
  k16: 63.4000,
  k17: 87.7000,
  k18: 12.9000,
  k19: 37.2000,
  k20: 61.5000,
  k21: 85.8000,
  k22: 11.0000,
  k23: 35.3000,
  k24: 59.6000,
  k25: 83.9000,
  k26: 9.1000,
  k27: 33.4000,
  k28: 57.7000,
  k29: 82.0000,
  k30: 7.2000,
  k31: 31.5000,
  k32: 55.8000,
  k33: 80.1000,
  k34: 5.3000,
  k35: 29.6000,
  k36: 53.9000,
  k37: 78.2000,
  k38: 3.4000,
  k39: 27.7000,
  k40: 52.0000,
  k41: 76.3000,
  k42: 1.5000,
  k43: 25.8000,
  k44: 50.1000,
  k45: 74.4000,
  k46: 98.7000,
  k47: 23.9000,
  k48: 48.2000,
  k49: 72.5000,
  k50: 96.8000,
  k51: 22.0000,
  k52: 46.3000,
  k53: 70.6000,
  k54: 94.9000,
  k55: 20.1000,
  k56: 44.4000,
  k57: 68.7000,
  k58: 93.0000,
  k59: 18.2000,
  k60: 42.5000,
  k61: 66.8000,
  k62: 91.1000,
  k63: 16.3000,
  k64: 40.6000,
  k65: 64.9000,
  k66: 89.2000,
  k67: 14.4000,
  k68: 38.7000,
  k69: 63.0000,
  k70: 87.3000,
  k71: 12.5000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_033_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_033_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_033_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_033_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_033_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_033_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_033_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_033_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_033_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_033_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_033_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_033_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
