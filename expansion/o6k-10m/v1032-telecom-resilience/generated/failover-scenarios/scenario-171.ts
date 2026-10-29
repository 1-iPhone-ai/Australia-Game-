import { V1032_TRES_clamp, V1032_TRES_telecomResilienceBandFromScore } from '../../engine/telecom-resilience-utils.ts';
import type {
  V1032TresTelecomResilienceBand,
  V1032TresRegionId,
  V1032TresFailoverSnapshot,
  V1032TresTelecomResilienceChannel,
} from '../../types/core.ts';

/** Generated failover scenario 171 — extreme_heat/drought/dust handoff matrix. */
export const V1032_TRES_FAILOVER_SCENARIO_171_META = {
  id: 'failover_171',
  regionId: 'WA' as V1032TresRegionId,
  primaryChannel: 'primary_access' as V1032TresTelecomResilienceChannel,
  telecomResilienceBand: 'moderate' as V1032TresTelecomResilienceBand,
  seed: 156302,
} as const;

const V1032_TRES_FAILOVER_SCENARIO_171_COEF = {
  k0: 49.4000,
  k1: 26.7000,
  k2: 4.0000,
  k3: 81.0000,
  k4: 58.3000,
  k5: 35.6000,
  k6: 12.9000,
  k7: 89.9000,
  k8: 67.2000,
  k9: 44.5000,
  k10: 21.8000,
  k11: 98.8000,
  k12: 76.1000,
  k13: 53.4000,
  k14: 30.7000,
  k15: 8.0000,
  k16: 85.0000,
  k17: 62.3000,
  k18: 39.6000,
  k19: 16.9000,
  k20: 93.9000,
  k21: 71.2000,
  k22: 48.5000,
  k23: 25.8000,
  k24: 3.1000,
  k25: 80.1000,
  k26: 57.4000,
  k27: 34.7000,
  k28: 12.0000,
  k29: 89.0000,
  k30: 66.3000,
  k31: 43.6000,
  k32: 20.9000,
  k33: 97.9000,
  k34: 75.2000,
  k35: 52.5000,
  k36: 29.8000,
  k37: 7.1000,
  k38: 84.1000,
  k39: 61.4000,
  k40: 38.7000,
  k41: 16.0000,
  k42: 93.0000,
  k43: 70.3000,
  k44: 47.6000,
  k45: 24.9000,
  k46: 2.2000,
  k47: 79.2000,
  k48: 56.5000,
  k49: 33.8000,
  k50: 11.1000,
  k51: 88.1000,
  k52: 65.4000,
  k53: 42.7000,
  k54: 20.0000,
  k55: 97.0000,
  k56: 74.3000,
  k57: 51.6000,
  k58: 28.9000,
  k59: 6.2000,
  k60: 83.2000,
  k61: 60.5000,
  k62: 37.8000,
  k63: 15.1000,
  k64: 92.1000,
  k65: 69.4000,
  k66: 46.7000,
  k67: 24.0000,
  k68: 1.3000,
  k69: 78.3000,
  k70: 55.6000,
  k71: 32.9000,
} as const;

export function V1032_TRES_FAILOVER_SCENARIO_171_evaluate(turn: number): {
  telecomStressExposureIndex: number;
  backboneBufferDelayTurns: number;
  telecomResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1032_TRES_FAILOVER_SCENARIO_171_COEF) as Array<
    keyof typeof V1032_TRES_FAILOVER_SCENARIO_171_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1032_TRES_FAILOVER_SCENARIO_171_COEF[keys[j]] * ((turn + j) % 17);
  }
  const telecomStressExposureIndex = V1032_TRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const backboneBufferDelayTurns = V1032_TRES_clamp(2 + (acc % 11), 1, 18);
  const telecomResilienceScore = V1032_TRES_clamp(90 - telecomStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1032_TRES_telecomResilienceBandFromScore(telecomResilienceScore) !== 'depleted';
  return { telecomStressExposureIndex, backboneBufferDelayTurns, telecomResilienceScore, stable };
}

export function V1032_TRES_FAILOVER_SCENARIO_171_snapshot(turn: number): V1032TresFailoverSnapshot {
  const r = V1032_TRES_FAILOVER_SCENARIO_171_evaluate(turn);
  return {
    scenarioId: V1032_TRES_FAILOVER_SCENARIO_171_META.id,
    regionId: V1032_TRES_FAILOVER_SCENARIO_171_META.regionId,
    telecomResilienceChannel: V1032_TRES_FAILOVER_SCENARIO_171_META.primaryChannel,
    telecomResilienceBand: V1032_TRES_FAILOVER_SCENARIO_171_META.telecomResilienceBand,
    telecomStressExposureIndex: r.telecomStressExposureIndex,
    backboneBufferDelayTurns: r.backboneBufferDelayTurns,
    telecomResilienceScore: r.telecomResilienceScore,
    telecomResilienceBand: V1032_TRES_telecomResilienceBandFromScore(r.telecomResilienceScore),
  };
}

export function V1032_TRES_FAILOVER_SCENARIO_171_regressionAssert(turn: number): boolean {
  const r = V1032_TRES_FAILOVER_SCENARIO_171_evaluate(turn);
  return typeof r.telecomStressExposureIndex === 'number' && r.telecomResilienceScore <= 100;
}
