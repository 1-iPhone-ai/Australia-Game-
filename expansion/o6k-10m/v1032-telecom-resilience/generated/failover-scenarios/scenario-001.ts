import { V1032_TRES_clamp, V1032_TRES_telecomResilienceBandFromScore } from '../../engine/telecom-resilience-utils.ts';
import type {
  V1032TresTelecomResilienceBand,
  V1032TresRegionId,
  V1032TresFailoverSnapshot,
  V1032TresTelecomResilienceChannel,
} from '../../types/core.ts';

/** Generated failover scenario 001 — extreme_heat/drought/dust handoff matrix. */
export const V1032_TRES_FAILOVER_SCENARIO_001_META = {
  id: 'failover_001',
  regionId: 'VIC' as V1032TresRegionId,
  primaryChannel: 'primary_access' as V1032TresTelecomResilienceChannel,
  telecomResilienceBand: 'moderate' as V1032TresTelecomResilienceBand,
  seed: 1432,
} as const;

const V1032_TRES_FAILOVER_SCENARIO_001_COEF = {
  k0: 79.7000,
  k1: 23.5000,
  k2: 67.0000,
  k3: 10.8000,
  k4: 54.3000,
  k5: 97.8000,
  k6: 41.6000,
  k7: 85.1000,
  k8: 28.9000,
  k9: 72.4000,
  k10: 16.2000,
  k11: 59.7000,
  k12: 3.5000,
  k13: 47.0000,
  k14: 90.5000,
  k15: 34.3000,
  k16: 77.8000,
  k17: 21.6000,
  k18: 65.1000,
  k19: 8.9000,
  k20: 52.4000,
  k21: 95.9000,
  k22: 39.7000,
  k23: 83.2000,
  k24: 27.0000,
  k25: 70.5000,
  k26: 14.3000,
  k27: 57.8000,
  k28: 1.6000,
  k29: 45.1000,
  k30: 88.6000,
  k31: 32.4000,
  k32: 75.9000,
  k33: 19.7000,
  k34: 63.2000,
  k35: 7.0000,
  k36: 50.5000,
  k37: 94.0000,
  k38: 37.8000,
  k39: 81.3000,
  k40: 25.1000,
  k41: 68.6000,
  k42: 12.4000,
  k43: 55.9000,
  k44: 99.4000,
  k45: 43.2000,
  k46: 86.7000,
  k47: 30.5000,
  k48: 74.0000,
  k49: 17.8000,
  k50: 61.3000,
  k51: 5.1000,
  k52: 48.6000,
  k53: 92.1000,
  k54: 35.9000,
  k55: 79.4000,
  k56: 23.2000,
  k57: 66.7000,
  k58: 10.5000,
  k59: 54.0000,
  k60: 97.5000,
  k61: 41.3000,
  k62: 84.8000,
  k63: 28.6000,
  k64: 72.1000,
  k65: 15.9000,
  k66: 59.4000,
  k67: 3.2000,
  k68: 46.7000,
  k69: 90.2000,
  k70: 34.0000,
  k71: 77.5000,
} as const;

export function V1032_TRES_FAILOVER_SCENARIO_001_evaluate(turn: number): {
  telecomStressExposureIndex: number;
  backboneBufferDelayTurns: number;
  telecomResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1032_TRES_FAILOVER_SCENARIO_001_COEF) as Array<
    keyof typeof V1032_TRES_FAILOVER_SCENARIO_001_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1032_TRES_FAILOVER_SCENARIO_001_COEF[keys[j]] * ((turn + j) % 17);
  }
  const telecomStressExposureIndex = V1032_TRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const backboneBufferDelayTurns = V1032_TRES_clamp(2 + (acc % 11), 1, 18);
  const telecomResilienceScore = V1032_TRES_clamp(90 - telecomStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1032_TRES_telecomResilienceBandFromScore(telecomResilienceScore) !== 'depleted';
  return { telecomStressExposureIndex, backboneBufferDelayTurns, telecomResilienceScore, stable };
}

export function V1032_TRES_FAILOVER_SCENARIO_001_snapshot(turn: number): V1032TresFailoverSnapshot {
  const r = V1032_TRES_FAILOVER_SCENARIO_001_evaluate(turn);
  return {
    scenarioId: V1032_TRES_FAILOVER_SCENARIO_001_META.id,
    regionId: V1032_TRES_FAILOVER_SCENARIO_001_META.regionId,
    telecomResilienceChannel: V1032_TRES_FAILOVER_SCENARIO_001_META.primaryChannel,
    telecomResilienceBand: V1032_TRES_FAILOVER_SCENARIO_001_META.telecomResilienceBand,
    telecomStressExposureIndex: r.telecomStressExposureIndex,
    backboneBufferDelayTurns: r.backboneBufferDelayTurns,
    telecomResilienceScore: r.telecomResilienceScore,
    telecomResilienceBand: V1032_TRES_telecomResilienceBandFromScore(r.telecomResilienceScore),
  };
}

export function V1032_TRES_FAILOVER_SCENARIO_001_regressionAssert(turn: number): boolean {
  const r = V1032_TRES_FAILOVER_SCENARIO_001_evaluate(turn);
  return typeof r.telecomStressExposureIndex === 'number' && r.telecomResilienceScore <= 100;
}
