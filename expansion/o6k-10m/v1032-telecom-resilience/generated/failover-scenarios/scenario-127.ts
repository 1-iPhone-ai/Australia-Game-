import { V1032_TRES_clamp, V1032_TRES_telecomResilienceBandFromScore } from '../../engine/telecom-resilience-utils.ts';
import type {
  V1032TresTelecomResilienceBand,
  V1032TresRegionId,
  V1032TresFailoverSnapshot,
  V1032TresTelecomResilienceChannel,
} from '../../types/core.ts';

/** Generated failover scenario 127 — extreme_heat/drought/dust handoff matrix. */
export const V1032_TRES_FAILOVER_SCENARIO_127_META = {
  id: 'failover_127',
  regionId: 'ACT' as V1032TresRegionId,
  primaryChannel: 'mental_health' as V1032TresTelecomResilienceChannel,
  telecomResilienceBand: 'elevated' as V1032TresTelecomResilienceBand,
  seed: 116218,
} as const;

const V1032_TRES_FAILOVER_SCENARIO_127_COEF = {
  k0: 24.4000,
  k1: 81.0000,
  k2: 37.9000,
  k3: 94.5000,
  k4: 51.4000,
  k5: 8.3000,
  k6: 64.9000,
  k7: 21.8000,
  k8: 78.4000,
  k9: 35.3000,
  k10: 91.9000,
  k11: 48.8000,
  k12: 5.7000,
  k13: 62.3000,
  k14: 19.2000,
  k15: 75.8000,
  k16: 32.7000,
  k17: 89.3000,
  k18: 46.2000,
  k19: 3.1000,
  k20: 59.7000,
  k21: 16.6000,
  k22: 73.2000,
  k23: 30.1000,
  k24: 86.7000,
  k25: 43.6000,
  k26: 0.5000,
  k27: 57.1000,
  k28: 14.0000,
  k29: 70.6000,
  k30: 27.5000,
  k31: 84.1000,
  k32: 41.0000,
  k33: 97.6000,
  k34: 54.5000,
  k35: 11.4000,
  k36: 68.0000,
  k37: 24.9000,
  k38: 81.5000,
  k39: 38.4000,
  k40: 95.0000,
  k41: 51.9000,
  k42: 8.8000,
  k43: 65.4000,
  k44: 22.3000,
  k45: 78.9000,
  k46: 35.8000,
  k47: 92.4000,
  k48: 49.3000,
  k49: 6.2000,
  k50: 62.8000,
  k51: 19.7000,
  k52: 76.3000,
  k53: 33.2000,
  k54: 89.8000,
  k55: 46.7000,
  k56: 3.6000,
  k57: 60.2000,
  k58: 17.1000,
  k59: 73.7000,
  k60: 30.6000,
  k61: 87.2000,
  k62: 44.1000,
  k63: 1.0000,
  k64: 57.6000,
  k65: 14.5000,
  k66: 71.1000,
  k67: 28.0000,
  k68: 84.6000,
  k69: 41.5000,
  k70: 98.1000,
  k71: 55.0000,
} as const;

export function V1032_TRES_FAILOVER_SCENARIO_127_evaluate(turn: number): {
  telecomStressExposureIndex: number;
  backboneBufferDelayTurns: number;
  telecomResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1032_TRES_FAILOVER_SCENARIO_127_COEF) as Array<
    keyof typeof V1032_TRES_FAILOVER_SCENARIO_127_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1032_TRES_FAILOVER_SCENARIO_127_COEF[keys[j]] * ((turn + j) % 17);
  }
  const telecomStressExposureIndex = V1032_TRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const backboneBufferDelayTurns = V1032_TRES_clamp(2 + (acc % 11), 1, 18);
  const telecomResilienceScore = V1032_TRES_clamp(90 - telecomStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1032_TRES_telecomResilienceBandFromScore(telecomResilienceScore) !== 'depleted';
  return { telecomStressExposureIndex, backboneBufferDelayTurns, telecomResilienceScore, stable };
}

export function V1032_TRES_FAILOVER_SCENARIO_127_snapshot(turn: number): V1032TresFailoverSnapshot {
  const r = V1032_TRES_FAILOVER_SCENARIO_127_evaluate(turn);
  return {
    scenarioId: V1032_TRES_FAILOVER_SCENARIO_127_META.id,
    regionId: V1032_TRES_FAILOVER_SCENARIO_127_META.regionId,
    telecomResilienceChannel: V1032_TRES_FAILOVER_SCENARIO_127_META.primaryChannel,
    telecomResilienceBand: V1032_TRES_FAILOVER_SCENARIO_127_META.telecomResilienceBand,
    telecomStressExposureIndex: r.telecomStressExposureIndex,
    backboneBufferDelayTurns: r.backboneBufferDelayTurns,
    telecomResilienceScore: r.telecomResilienceScore,
    telecomResilienceBand: V1032_TRES_telecomResilienceBandFromScore(r.telecomResilienceScore),
  };
}

export function V1032_TRES_FAILOVER_SCENARIO_127_regressionAssert(turn: number): boolean {
  const r = V1032_TRES_FAILOVER_SCENARIO_127_evaluate(turn);
  return typeof r.telecomStressExposureIndex === 'number' && r.telecomResilienceScore <= 100;
}
