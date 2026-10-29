import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 053 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_053_META = {
  id: 'route_053',
  regionId: 'TAS' as V1017IclogRegionId,
  primarySystem: 'digital' as V1017IclogSystemDomain,
  routeBand: 'critical' as V1017IclogRouteBand,
  seed: 46522,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_053_COEF = {
  k0: 60.6000,
  k1: 55.1000,
  k2: 49.6000,
  k3: 44.1000,
  k4: 38.6000,
  k5: 33.1000,
  k6: 27.6000,
  k7: 22.1000,
  k8: 16.6000,
  k9: 11.1000,
  k10: 5.6000,
  k11: 0.1000,
  k12: 93.7000,
  k13: 88.2000,
  k14: 82.7000,
  k15: 77.2000,
  k16: 71.7000,
  k17: 66.2000,
  k18: 60.7000,
  k19: 55.2000,
  k20: 49.7000,
  k21: 44.2000,
  k22: 38.7000,
  k23: 33.2000,
  k24: 27.7000,
  k25: 22.2000,
  k26: 16.7000,
  k27: 11.2000,
  k28: 5.7000,
  k29: 0.2000,
  k30: 93.8000,
  k31: 88.3000,
  k32: 82.8000,
  k33: 77.3000,
  k34: 71.8000,
  k35: 66.3000,
  k36: 60.8000,
  k37: 55.3000,
  k38: 49.8000,
  k39: 44.3000,
  k40: 38.8000,
  k41: 33.3000,
  k42: 27.8000,
  k43: 22.3000,
  k44: 16.8000,
  k45: 11.3000,
  k46: 5.8000,
  k47: 0.3000,
  k48: 93.9000,
  k49: 88.4000,
  k50: 82.9000,
  k51: 77.4000,
  k52: 71.9000,
  k53: 66.4000,
  k54: 60.9000,
  k55: 55.4000,
  k56: 49.9000,
  k57: 44.4000,
  k58: 38.9000,
  k59: 33.4000,
  k60: 27.9000,
  k61: 22.4000,
  k62: 16.9000,
  k63: 11.4000,
  k64: 5.9000,
  k65: 0.4000,
  k66: 94.0000,
  k67: 88.5000,
  k68: 83.0000,
  k69: 77.5000,
  k70: 72.0000,
  k71: 66.5000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_053_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_053_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_053_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_053_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_053_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_053_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_053_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_053_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_053_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_053_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_053_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_053_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
