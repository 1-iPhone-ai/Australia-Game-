import { V1032_TRES_clamp, V1032_TRES_telecomResilienceBandFromScore } from '../../engine/telecom-resilience-utils.ts';
import type {
  V1032TresTelecomResilienceBand,
  V1032TresRegionId,
  V1032TresFailoverSnapshot,
  V1032TresTelecomResilienceChannel,
} from '../../types/core.ts';

/** Generated failover scenario 049 — extreme_heat/drought/dust handoff matrix. */
export const V1032_TRES_FAILOVER_SCENARIO_049_META = {
  id: 'failover_049',
  regionId: 'VIC' as V1032TresRegionId,
  primaryChannel: 'remote' as V1032TresTelecomResilienceChannel,
  telecomResilienceBand: 'recovering' as V1032TresTelecomResilienceBand,
  seed: 45160,
} as const;

const V1032_TRES_FAILOVER_SCENARIO_049_COEF = {
  k0: 25.4000,
  k1: 54.9000,
  k2: 84.4000,
  k3: 14.2000,
  k4: 43.7000,
  k5: 73.2000,
  k6: 3.0000,
  k7: 32.5000,
  k8: 62.0000,
  k9: 91.5000,
  k10: 21.3000,
  k11: 50.8000,
  k12: 80.3000,
  k13: 10.1000,
  k14: 39.6000,
  k15: 69.1000,
  k16: 98.6000,
  k17: 28.4000,
  k18: 57.9000,
  k19: 87.4000,
  k20: 17.2000,
  k21: 46.7000,
  k22: 76.2000,
  k23: 6.0000,
  k24: 35.5000,
  k25: 65.0000,
  k26: 94.5000,
  k27: 24.3000,
  k28: 53.8000,
  k29: 83.3000,
  k30: 13.1000,
  k31: 42.6000,
  k32: 72.1000,
  k33: 1.9000,
  k34: 31.4000,
  k35: 60.9000,
  k36: 90.4000,
  k37: 20.2000,
  k38: 49.7000,
  k39: 79.2000,
  k40: 9.0000,
  k41: 38.5000,
  k42: 68.0000,
  k43: 97.5000,
  k44: 27.3000,
  k45: 56.8000,
  k46: 86.3000,
  k47: 16.1000,
  k48: 45.6000,
  k49: 75.1000,
  k50: 4.9000,
  k51: 34.4000,
  k52: 63.9000,
  k53: 93.4000,
  k54: 23.2000,
  k55: 52.7000,
  k56: 82.2000,
  k57: 12.0000,
  k58: 41.5000,
  k59: 71.0000,
  k60: 0.8000,
  k61: 30.3000,
  k62: 59.8000,
  k63: 89.3000,
  k64: 19.1000,
  k65: 48.6000,
  k66: 78.1000,
  k67: 7.9000,
  k68: 37.4000,
  k69: 66.9000,
  k70: 96.4000,
  k71: 26.2000,
} as const;

export function V1032_TRES_FAILOVER_SCENARIO_049_evaluate(turn: number): {
  telecomStressExposureIndex: number;
  backboneBufferDelayTurns: number;
  telecomResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1032_TRES_FAILOVER_SCENARIO_049_COEF) as Array<
    keyof typeof V1032_TRES_FAILOVER_SCENARIO_049_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1032_TRES_FAILOVER_SCENARIO_049_COEF[keys[j]] * ((turn + j) % 17);
  }
  const telecomStressExposureIndex = V1032_TRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const backboneBufferDelayTurns = V1032_TRES_clamp(2 + (acc % 11), 1, 18);
  const telecomResilienceScore = V1032_TRES_clamp(90 - telecomStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1032_TRES_telecomResilienceBandFromScore(telecomResilienceScore) !== 'depleted';
  return { telecomStressExposureIndex, backboneBufferDelayTurns, telecomResilienceScore, stable };
}

export function V1032_TRES_FAILOVER_SCENARIO_049_snapshot(turn: number): V1032TresFailoverSnapshot {
  const r = V1032_TRES_FAILOVER_SCENARIO_049_evaluate(turn);
  return {
    scenarioId: V1032_TRES_FAILOVER_SCENARIO_049_META.id,
    regionId: V1032_TRES_FAILOVER_SCENARIO_049_META.regionId,
    telecomResilienceChannel: V1032_TRES_FAILOVER_SCENARIO_049_META.primaryChannel,
    telecomResilienceBand: V1032_TRES_FAILOVER_SCENARIO_049_META.telecomResilienceBand,
    telecomStressExposureIndex: r.telecomStressExposureIndex,
    backboneBufferDelayTurns: r.backboneBufferDelayTurns,
    telecomResilienceScore: r.telecomResilienceScore,
    telecomResilienceBand: V1032_TRES_telecomResilienceBandFromScore(r.telecomResilienceScore),
  };
}

export function V1032_TRES_FAILOVER_SCENARIO_049_regressionAssert(turn: number): boolean {
  const r = V1032_TRES_FAILOVER_SCENARIO_049_evaluate(turn);
  return typeof r.telecomStressExposureIndex === 'number' && r.telecomResilienceScore <= 100;
}
