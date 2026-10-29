import { V1032_TRES_clamp, V1032_TRES_telecomResilienceBandFromScore } from '../../engine/telecom-resilience-utils.ts';
import type {
  V1032TresTelecomResilienceBand,
  V1032TresRegionId,
  V1032TresFailoverSnapshot,
  V1032TresTelecomResilienceChannel,
} from '../../types/core.ts';

/** Generated failover scenario 117 — extreme_heat/drought/dust handoff matrix. */
export const V1032_TRES_FAILOVER_SCENARIO_117_META = {
  id: 'failover_117',
  regionId: 'TAS' as V1032TresRegionId,
  primaryChannel: 'mental_health' as V1032TresTelecomResilienceChannel,
  telecomResilienceBand: 'elevated' as V1032TresTelecomResilienceBand,
  seed: 107108,
} as const;

const V1032_TRES_FAILOVER_SCENARIO_117_COEF = {
  k0: 73.1000,
  k1: 16.3000,
  k2: 59.2000,
  k3: 2.4000,
  k4: 45.3000,
  k5: 88.2000,
  k6: 31.4000,
  k7: 74.3000,
  k8: 17.5000,
  k9: 60.4000,
  k10: 3.6000,
  k11: 46.5000,
  k12: 89.4000,
  k13: 32.6000,
  k14: 75.5000,
  k15: 18.7000,
  k16: 61.6000,
  k17: 4.8000,
  k18: 47.7000,
  k19: 90.6000,
  k20: 33.8000,
  k21: 76.7000,
  k22: 19.9000,
  k23: 62.8000,
  k24: 6.0000,
  k25: 48.9000,
  k26: 91.8000,
  k27: 35.0000,
  k28: 77.9000,
  k29: 21.1000,
  k30: 64.0000,
  k31: 7.2000,
  k32: 50.1000,
  k33: 93.0000,
  k34: 36.2000,
  k35: 79.1000,
  k36: 22.3000,
  k37: 65.2000,
  k38: 8.4000,
  k39: 51.3000,
  k40: 94.2000,
  k41: 37.4000,
  k42: 80.3000,
  k43: 23.5000,
  k44: 66.4000,
  k45: 9.6000,
  k46: 52.5000,
  k47: 95.4000,
  k48: 38.6000,
  k49: 81.5000,
  k50: 24.7000,
  k51: 67.6000,
  k52: 10.8000,
  k53: 53.7000,
  k54: 96.6000,
  k55: 39.8000,
  k56: 82.7000,
  k57: 25.9000,
  k58: 68.8000,
  k59: 12.0000,
  k60: 54.9000,
  k61: 97.8000,
  k62: 41.0000,
  k63: 83.9000,
  k64: 27.1000,
  k65: 70.0000,
  k66: 13.2000,
  k67: 56.1000,
  k68: 99.0000,
  k69: 42.2000,
  k70: 85.1000,
  k71: 28.3000,
} as const;

export function V1032_TRES_FAILOVER_SCENARIO_117_evaluate(turn: number): {
  telecomStressExposureIndex: number;
  backboneBufferDelayTurns: number;
  telecomResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1032_TRES_FAILOVER_SCENARIO_117_COEF) as Array<
    keyof typeof V1032_TRES_FAILOVER_SCENARIO_117_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1032_TRES_FAILOVER_SCENARIO_117_COEF[keys[j]] * ((turn + j) % 17);
  }
  const telecomStressExposureIndex = V1032_TRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const backboneBufferDelayTurns = V1032_TRES_clamp(2 + (acc % 11), 1, 18);
  const telecomResilienceScore = V1032_TRES_clamp(90 - telecomStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1032_TRES_telecomResilienceBandFromScore(telecomResilienceScore) !== 'depleted';
  return { telecomStressExposureIndex, backboneBufferDelayTurns, telecomResilienceScore, stable };
}

export function V1032_TRES_FAILOVER_SCENARIO_117_snapshot(turn: number): V1032TresFailoverSnapshot {
  const r = V1032_TRES_FAILOVER_SCENARIO_117_evaluate(turn);
  return {
    scenarioId: V1032_TRES_FAILOVER_SCENARIO_117_META.id,
    regionId: V1032_TRES_FAILOVER_SCENARIO_117_META.regionId,
    telecomResilienceChannel: V1032_TRES_FAILOVER_SCENARIO_117_META.primaryChannel,
    telecomResilienceBand: V1032_TRES_FAILOVER_SCENARIO_117_META.telecomResilienceBand,
    telecomStressExposureIndex: r.telecomStressExposureIndex,
    backboneBufferDelayTurns: r.backboneBufferDelayTurns,
    telecomResilienceScore: r.telecomResilienceScore,
    telecomResilienceBand: V1032_TRES_telecomResilienceBandFromScore(r.telecomResilienceScore),
  };
}

export function V1032_TRES_FAILOVER_SCENARIO_117_regressionAssert(turn: number): boolean {
  const r = V1032_TRES_FAILOVER_SCENARIO_117_evaluate(turn);
  return typeof r.telecomStressExposureIndex === 'number' && r.telecomResilienceScore <= 100;
}
