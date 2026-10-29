import { V1032_TRES_clamp, V1032_TRES_telecomResilienceBandFromScore } from '../../engine/telecom-resilience-utils.ts';
import type {
  V1032TresTelecomResilienceBand,
  V1032TresRegionId,
  V1032TresFailoverSnapshot,
  V1032TresTelecomResilienceChannel,
} from '../../types/core.ts';

/** Generated failover scenario 037 — extreme_heat/drought/dust handoff matrix. */
export const V1032_TRES_FAILOVER_SCENARIO_037_META = {
  id: 'failover_037',
  regionId: 'TAS' as V1032TresRegionId,
  primaryChannel: 'mental_health' as V1032TresTelecomResilienceChannel,
  telecomResilienceBand: 'elevated' as V1032TresTelecomResilienceBand,
  seed: 34228,
} as const;

const V1032_TRES_FAILOVER_SCENARIO_037_COEF = {
  k0: 63.9000,
  k1: 96.9000,
  k2: 30.2000,
  k3: 63.2000,
  k4: 96.2000,
  k5: 29.5000,
  k6: 62.5000,
  k7: 95.5000,
  k8: 28.8000,
  k9: 61.8000,
  k10: 94.8000,
  k11: 28.1000,
  k12: 61.1000,
  k13: 94.1000,
  k14: 27.4000,
  k15: 60.4000,
  k16: 93.4000,
  k17: 26.7000,
  k18: 59.7000,
  k19: 92.7000,
  k20: 26.0000,
  k21: 59.0000,
  k22: 92.0000,
  k23: 25.3000,
  k24: 58.3000,
  k25: 91.3000,
  k26: 24.6000,
  k27: 57.6000,
  k28: 90.6000,
  k29: 23.9000,
  k30: 56.9000,
  k31: 89.9000,
  k32: 23.2000,
  k33: 56.2000,
  k34: 89.2000,
  k35: 22.5000,
  k36: 55.5000,
  k37: 88.5000,
  k38: 21.8000,
  k39: 54.8000,
  k40: 87.8000,
  k41: 21.1000,
  k42: 54.1000,
  k43: 87.1000,
  k44: 20.4000,
  k45: 53.4000,
  k46: 86.4000,
  k47: 19.7000,
  k48: 52.7000,
  k49: 85.7000,
  k50: 19.0000,
  k51: 52.0000,
  k52: 85.0000,
  k53: 18.3000,
  k54: 51.3000,
  k55: 84.3000,
  k56: 17.6000,
  k57: 50.6000,
  k58: 83.6000,
  k59: 16.9000,
  k60: 49.9000,
  k61: 82.9000,
  k62: 16.2000,
  k63: 49.2000,
  k64: 82.2000,
  k65: 15.5000,
  k66: 48.5000,
  k67: 81.5000,
  k68: 14.8000,
  k69: 47.8000,
  k70: 80.8000,
  k71: 14.1000,
} as const;

export function V1032_TRES_FAILOVER_SCENARIO_037_evaluate(turn: number): {
  telecomStressExposureIndex: number;
  backboneBufferDelayTurns: number;
  telecomResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1032_TRES_FAILOVER_SCENARIO_037_COEF) as Array<
    keyof typeof V1032_TRES_FAILOVER_SCENARIO_037_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1032_TRES_FAILOVER_SCENARIO_037_COEF[keys[j]] * ((turn + j) % 17);
  }
  const telecomStressExposureIndex = V1032_TRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const backboneBufferDelayTurns = V1032_TRES_clamp(2 + (acc % 11), 1, 18);
  const telecomResilienceScore = V1032_TRES_clamp(90 - telecomStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1032_TRES_telecomResilienceBandFromScore(telecomResilienceScore) !== 'depleted';
  return { telecomStressExposureIndex, backboneBufferDelayTurns, telecomResilienceScore, stable };
}

export function V1032_TRES_FAILOVER_SCENARIO_037_snapshot(turn: number): V1032TresFailoverSnapshot {
  const r = V1032_TRES_FAILOVER_SCENARIO_037_evaluate(turn);
  return {
    scenarioId: V1032_TRES_FAILOVER_SCENARIO_037_META.id,
    regionId: V1032_TRES_FAILOVER_SCENARIO_037_META.regionId,
    telecomResilienceChannel: V1032_TRES_FAILOVER_SCENARIO_037_META.primaryChannel,
    telecomResilienceBand: V1032_TRES_FAILOVER_SCENARIO_037_META.telecomResilienceBand,
    telecomStressExposureIndex: r.telecomStressExposureIndex,
    backboneBufferDelayTurns: r.backboneBufferDelayTurns,
    telecomResilienceScore: r.telecomResilienceScore,
    telecomResilienceBand: V1032_TRES_telecomResilienceBandFromScore(r.telecomResilienceScore),
  };
}

export function V1032_TRES_FAILOVER_SCENARIO_037_regressionAssert(turn: number): boolean {
  const r = V1032_TRES_FAILOVER_SCENARIO_037_evaluate(turn);
  return typeof r.telecomStressExposureIndex === 'number' && r.telecomResilienceScore <= 100;
}
