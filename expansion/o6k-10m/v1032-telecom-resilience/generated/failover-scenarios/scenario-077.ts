import { V1032_TRES_clamp, V1032_TRES_telecomResilienceBandFromScore } from '../../engine/telecom-resilience-utils.ts';
import type {
  V1032TresTelecomResilienceBand,
  V1032TresRegionId,
  V1032TresFailoverSnapshot,
  V1032TresTelecomResilienceChannel,
} from '../../types/core.ts';

/** Generated failover scenario 077 — extreme_heat/drought/dust handoff matrix. */
export const V1032_TRES_FAILOVER_SCENARIO_077_META = {
  id: 'failover_077',
  regionId: 'TAS' as V1032TresRegionId,
  primaryChannel: 'mental_health' as V1032TresTelecomResilienceChannel,
  telecomResilienceBand: 'elevated' as V1032TresTelecomResilienceBand,
  seed: 70668,
} as const;

const V1032_TRES_FAILOVER_SCENARIO_077_COEF = {
  k0: 68.5000,
  k1: 56.6000,
  k2: 44.7000,
  k3: 32.8000,
  k4: 20.9000,
  k5: 9.0000,
  k6: 96.8000,
  k7: 84.9000,
  k8: 73.0000,
  k9: 61.1000,
  k10: 49.2000,
  k11: 37.3000,
  k12: 25.4000,
  k13: 13.5000,
  k14: 1.6000,
  k15: 89.4000,
  k16: 77.5000,
  k17: 65.6000,
  k18: 53.7000,
  k19: 41.8000,
  k20: 29.9000,
  k21: 18.0000,
  k22: 6.1000,
  k23: 93.9000,
  k24: 82.0000,
  k25: 70.1000,
  k26: 58.2000,
  k27: 46.3000,
  k28: 34.4000,
  k29: 22.5000,
  k30: 10.6000,
  k31: 98.4000,
  k32: 86.5000,
  k33: 74.6000,
  k34: 62.7000,
  k35: 50.8000,
  k36: 38.9000,
  k37: 27.0000,
  k38: 15.1000,
  k39: 3.2000,
  k40: 91.0000,
  k41: 79.1000,
  k42: 67.2000,
  k43: 55.3000,
  k44: 43.4000,
  k45: 31.5000,
  k46: 19.6000,
  k47: 7.7000,
  k48: 95.5000,
  k49: 83.6000,
  k50: 71.7000,
  k51: 59.8000,
  k52: 47.9000,
  k53: 36.0000,
  k54: 24.1000,
  k55: 12.2000,
  k56: 0.3000,
  k57: 88.1000,
  k58: 76.2000,
  k59: 64.3000,
  k60: 52.4000,
  k61: 40.5000,
  k62: 28.6000,
  k63: 16.7000,
  k64: 4.8000,
  k65: 92.6000,
  k66: 80.7000,
  k67: 68.8000,
  k68: 56.9000,
  k69: 45.0000,
  k70: 33.1000,
  k71: 21.2000,
} as const;

export function V1032_TRES_FAILOVER_SCENARIO_077_evaluate(turn: number): {
  telecomStressExposureIndex: number;
  backboneBufferDelayTurns: number;
  telecomResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1032_TRES_FAILOVER_SCENARIO_077_COEF) as Array<
    keyof typeof V1032_TRES_FAILOVER_SCENARIO_077_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1032_TRES_FAILOVER_SCENARIO_077_COEF[keys[j]] * ((turn + j) % 17);
  }
  const telecomStressExposureIndex = V1032_TRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const backboneBufferDelayTurns = V1032_TRES_clamp(2 + (acc % 11), 1, 18);
  const telecomResilienceScore = V1032_TRES_clamp(90 - telecomStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1032_TRES_telecomResilienceBandFromScore(telecomResilienceScore) !== 'depleted';
  return { telecomStressExposureIndex, backboneBufferDelayTurns, telecomResilienceScore, stable };
}

export function V1032_TRES_FAILOVER_SCENARIO_077_snapshot(turn: number): V1032TresFailoverSnapshot {
  const r = V1032_TRES_FAILOVER_SCENARIO_077_evaluate(turn);
  return {
    scenarioId: V1032_TRES_FAILOVER_SCENARIO_077_META.id,
    regionId: V1032_TRES_FAILOVER_SCENARIO_077_META.regionId,
    telecomResilienceChannel: V1032_TRES_FAILOVER_SCENARIO_077_META.primaryChannel,
    telecomResilienceBand: V1032_TRES_FAILOVER_SCENARIO_077_META.telecomResilienceBand,
    telecomStressExposureIndex: r.telecomStressExposureIndex,
    backboneBufferDelayTurns: r.backboneBufferDelayTurns,
    telecomResilienceScore: r.telecomResilienceScore,
    telecomResilienceBand: V1032_TRES_telecomResilienceBandFromScore(r.telecomResilienceScore),
  };
}

export function V1032_TRES_FAILOVER_SCENARIO_077_regressionAssert(turn: number): boolean {
  const r = V1032_TRES_FAILOVER_SCENARIO_077_evaluate(turn);
  return typeof r.telecomStressExposureIndex === 'number' && r.telecomResilienceScore <= 100;
}
