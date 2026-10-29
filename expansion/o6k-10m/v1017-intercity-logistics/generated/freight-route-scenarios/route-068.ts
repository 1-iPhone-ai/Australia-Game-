import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 068 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_068_META = {
  id: 'route_068',
  regionId: 'SA' as V1017IclogRegionId,
  primarySystem: 'telecom' as V1017IclogSystemDomain,
  routeBand: 'critical' as V1017IclogRouteBand,
  seed: 59677,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_068_COEF = {
  k0: 52.8000,
  k1: 74.5000,
  k2: 96.2000,
  k3: 18.8000,
  k4: 40.5000,
  k5: 62.2000,
  k6: 83.9000,
  k7: 6.5000,
  k8: 28.2000,
  k9: 49.9000,
  k10: 71.6000,
  k11: 93.3000,
  k12: 15.9000,
  k13: 37.6000,
  k14: 59.3000,
  k15: 81.0000,
  k16: 3.6000,
  k17: 25.3000,
  k18: 47.0000,
  k19: 68.7000,
  k20: 90.4000,
  k21: 13.0000,
  k22: 34.7000,
  k23: 56.4000,
  k24: 78.1000,
  k25: 0.7000,
  k26: 22.4000,
  k27: 44.1000,
  k28: 65.8000,
  k29: 87.5000,
  k30: 10.1000,
  k31: 31.8000,
  k32: 53.5000,
  k33: 75.2000,
  k34: 96.9000,
  k35: 19.5000,
  k36: 41.2000,
  k37: 62.9000,
  k38: 84.6000,
  k39: 7.2000,
  k40: 28.9000,
  k41: 50.6000,
  k42: 72.3000,
  k43: 94.0000,
  k44: 16.6000,
  k45: 38.3000,
  k46: 60.0000,
  k47: 81.7000,
  k48: 4.3000,
  k49: 26.0000,
  k50: 47.7000,
  k51: 69.4000,
  k52: 91.1000,
  k53: 13.7000,
  k54: 35.4000,
  k55: 57.1000,
  k56: 78.8000,
  k57: 1.4000,
  k58: 23.1000,
  k59: 44.8000,
  k60: 66.5000,
  k61: 88.2000,
  k62: 10.8000,
  k63: 32.5000,
  k64: 54.2000,
  k65: 75.9000,
  k66: 97.6000,
  k67: 20.2000,
  k68: 41.9000,
  k69: 63.6000,
  k70: 85.3000,
  k71: 7.9000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_068_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_068_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_068_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_068_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_068_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_068_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_068_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_068_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_068_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_068_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_068_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_068_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
