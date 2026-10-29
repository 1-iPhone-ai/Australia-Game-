import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 035 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_035_META = {
  id: 'route_035',
  regionId: 'WA' as V1017IclogRegionId,
  primarySystem: 'pharma' as V1017IclogSystemDomain,
  routeBand: 'latent' as V1017IclogRouteBand,
  seed: 30736,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_035_COEF = {
  k0: 10.5000,
  k1: 12.0000,
  k2: 13.5000,
  k3: 15.0000,
  k4: 16.5000,
  k5: 18.0000,
  k6: 19.5000,
  k7: 21.0000,
  k8: 22.5000,
  k9: 24.0000,
  k10: 25.5000,
  k11: 27.0000,
  k12: 28.5000,
  k13: 30.0000,
  k14: 31.5000,
  k15: 33.0000,
  k16: 34.5000,
  k17: 36.0000,
  k18: 37.5000,
  k19: 39.0000,
  k20: 40.5000,
  k21: 42.0000,
  k22: 43.5000,
  k23: 45.0000,
  k24: 46.5000,
  k25: 48.0000,
  k26: 49.5000,
  k27: 51.0000,
  k28: 52.5000,
  k29: 54.0000,
  k30: 55.5000,
  k31: 57.0000,
  k32: 58.5000,
  k33: 60.0000,
  k34: 61.5000,
  k35: 63.0000,
  k36: 64.5000,
  k37: 66.0000,
  k38: 67.5000,
  k39: 69.0000,
  k40: 70.5000,
  k41: 72.0000,
  k42: 73.5000,
  k43: 75.0000,
  k44: 76.5000,
  k45: 78.0000,
  k46: 79.5000,
  k47: 81.0000,
  k48: 82.5000,
  k49: 84.0000,
  k50: 85.5000,
  k51: 87.0000,
  k52: 88.5000,
  k53: 90.0000,
  k54: 91.5000,
  k55: 93.0000,
  k56: 94.5000,
  k57: 96.0000,
  k58: 97.5000,
  k59: 99.0000,
  k60: 1.4000,
  k61: 2.9000,
  k62: 4.4000,
  k63: 5.9000,
  k64: 7.4000,
  k65: 8.9000,
  k66: 10.4000,
  k67: 11.9000,
  k68: 13.4000,
  k69: 14.9000,
  k70: 16.4000,
  k71: 17.9000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_035_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_035_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_035_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_035_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_035_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_035_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_035_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_035_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_035_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_035_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_035_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_035_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
