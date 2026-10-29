import { V1017_ICLOG_clamp, V1017_ICLOG_hubFromScore } from '../../engine/intercity-logistics-utils.ts';
import type {
  V1017IclogRouteBand,
  V1017IclogRegionId,
  V1017IclogSupplyRouteSnapshot,
  V1017IclogSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 065 — intercity logistics / hub matrix. */
export const V1017_ICLOG_ROUTE_SCENARIO_065_META = {
  id: 'route_065',
  regionId: 'VIC' as V1017IclogRegionId,
  primarySystem: 'pharma' as V1017IclogSystemDomain,
  routeBand: 'latent' as V1017IclogRouteBand,
  seed: 57046,
} as const;

const V1017_ICLOG_ROUTE_SCENARIO_065_COEF = {
  k0: 94.0000,
  k1: 50.8000,
  k2: 7.6000,
  k3: 63.5000,
  k4: 20.3000,
  k5: 76.2000,
  k6: 33.0000,
  k7: 88.9000,
  k8: 45.7000,
  k9: 2.5000,
  k10: 58.4000,
  k11: 15.2000,
  k12: 71.1000,
  k13: 27.9000,
  k14: 83.8000,
  k15: 40.6000,
  k16: 96.5000,
  k17: 53.3000,
  k18: 10.1000,
  k19: 66.0000,
  k20: 22.8000,
  k21: 78.7000,
  k22: 35.5000,
  k23: 91.4000,
  k24: 48.2000,
  k25: 5.0000,
  k26: 60.9000,
  k27: 17.7000,
  k28: 73.6000,
  k29: 30.4000,
  k30: 86.3000,
  k31: 43.1000,
  k32: 99.0000,
  k33: 55.8000,
  k34: 12.6000,
  k35: 68.5000,
  k36: 25.3000,
  k37: 81.2000,
  k38: 38.0000,
  k39: 93.9000,
  k40: 50.7000,
  k41: 7.5000,
  k42: 63.4000,
  k43: 20.2000,
  k44: 76.1000,
  k45: 32.9000,
  k46: 88.8000,
  k47: 45.6000,
  k48: 2.4000,
  k49: 58.3000,
  k50: 15.1000,
  k51: 71.0000,
  k52: 27.8000,
  k53: 83.7000,
  k54: 40.5000,
  k55: 96.4000,
  k56: 53.2000,
  k57: 10.0000,
  k58: 65.9000,
  k59: 22.7000,
  k60: 78.6000,
  k61: 35.4000,
  k62: 91.3000,
  k63: 48.1000,
  k64: 4.9000,
  k65: 60.8000,
  k66: 17.6000,
  k67: 73.5000,
  k68: 30.3000,
  k69: 86.2000,
  k70: 43.0000,
  k71: 98.9000,
} as const;

export function V1017_ICLOG_ROUTE_SCENARIO_065_evaluate(turn: number): {
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1017_ICLOG_ROUTE_SCENARIO_065_COEF) as Array<
    keyof typeof V1017_ICLOG_ROUTE_SCENARIO_065_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1017_ICLOG_ROUTE_SCENARIO_065_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1017_ICLOG_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1017_ICLOG_clamp(2 + (acc % 9), 1, 16);
  const hubScore = V1017_ICLOG_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1017_ICLOG_hubFromScore(hubScore) !== 'fragile';
  return { severityIndex, corridorDelayTurns, hubScore, stable };
}

export function V1017_ICLOG_ROUTE_SCENARIO_065_snapshot(turn: number): V1017IclogSupplyRouteSnapshot {
  const r = V1017_ICLOG_ROUTE_SCENARIO_065_evaluate(turn);
  return {
    scenarioId: V1017_ICLOG_ROUTE_SCENARIO_065_META.id,
    regionId: V1017_ICLOG_ROUTE_SCENARIO_065_META.regionId,
    systemDomain: V1017_ICLOG_ROUTE_SCENARIO_065_META.primarySystem,
    routeBand: V1017_ICLOG_ROUTE_SCENARIO_065_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    hubScore: r.hubScore,
    hubBand: V1017_ICLOG_hubFromScore(r.hubScore),
  };
}

export function V1017_ICLOG_ROUTE_SCENARIO_065_regressionAssert(turn: number): boolean {
  const r = V1017_ICLOG_ROUTE_SCENARIO_065_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.hubScore <= 100;
}
