import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 078 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_078_META = {
  id: 'route_078',
  regionId: 'NT' as V1017IclogRegionId,
  primarySystem: 'telecom' as V1017IclogSystemDomain,
  routeBand: 'critical' as V1017IclogRouteBand,
  seed: 68447,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_078_COEF = {
  k0: 47.6000,
  k1: 54.4000,
  k2: 61.2000,
  k3: 68.0000,
  k4: 74.8000,
  k5: 81.6000,
  k6: 88.4000,
  k7: 95.2000,
  k8: 2.9000,
  k9: 9.7000,
  k10: 16.5000,
  k11: 23.3000,
  k12: 30.1000,
  k13: 36.9000,
  k14: 43.7000,
  k15: 50.5000,
  k16: 57.3000,
  k17: 64.1000,
  k18: 70.9000,
  k19: 77.7000,
  k20: 84.5000,
  k21: 91.3000,
  k22: 98.1000,
  k23: 5.8000,
  k24: 12.6000,
  k25: 19.4000,
  k26: 26.2000,
  k27: 33.0000,
  k28: 39.8000,
  k29: 46.6000,
  k30: 53.4000,
  k31: 60.2000,
  k32: 67.0000,
  k33: 73.8000,
  k34: 80.6000,
  k35: 87.4000,
  k36: 94.2000,
  k37: 1.9000,
  k38: 8.7000,
  k39: 15.5000,
  k40: 22.3000,
  k41: 29.1000,
  k42: 35.9000,
  k43: 42.7000,
  k44: 49.5000,
  k45: 56.3000,
  k46: 63.1000,
  k47: 69.9000,
  k48: 76.7000,
  k49: 83.5000,
  k50: 90.3000,
  k51: 97.1000,
  k52: 4.8000,
  k53: 11.6000,
  k54: 18.4000,
  k55: 25.2000,
  k56: 32.0000,
  k57: 38.8000,
  k58: 45.6000,
  k59: 52.4000,
  k60: 59.2000,
  k61: 66.0000,
  k62: 72.8000,
  k63: 79.6000,
  k64: 86.4000,
  k65: 93.2000,
  k66: 0.9000,
  k67: 7.7000,
  k68: 14.5000,
  k69: 21.3000,
  k70: 28.1000,
  k71: 34.9000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_078_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_078_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_078_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_078_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_078_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_078_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_078_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_078_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_078_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_078_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_078_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_078_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
