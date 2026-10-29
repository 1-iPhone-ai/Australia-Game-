import { V1032_TRES_clamp, V1032_TRES_telecomResilienceBandFromScore } from '../../engine/telecom-resilience-utils.ts';
import type {
  V1032TresTelecomResilienceBand,
  V1032TresRegionId,
  V1032TresFailoverSnapshot,
  V1032TresTelecomResilienceChannel,
} from '../../types/core.ts';

/** Generated failover scenario 165 — extreme_heat/drought/dust handoff matrix. */
export const V1032_TRES_FAILOVER_SCENARIO_165_META = {
  id: 'failover_165',
  regionId: 'TAS' as V1032TresRegionId,
  primaryChannel: 'specialist_referral' as V1032TresTelecomResilienceChannel,
  telecomResilienceBand: 'minimal' as V1032TresTelecomResilienceBand,
  seed: 150836,
} as const;

const V1032_TRES_FAILOVER_SCENARIO_165_COEF = {
  k0: 18.8000,
  k1: 47.7000,
  k2: 76.6000,
  k3: 5.8000,
  k4: 34.7000,
  k5: 63.6000,
  k6: 92.5000,
  k7: 21.7000,
  k8: 50.6000,
  k9: 79.5000,
  k10: 8.7000,
  k11: 37.6000,
  k12: 66.5000,
  k13: 95.4000,
  k14: 24.6000,
  k15: 53.5000,
  k16: 82.4000,
  k17: 11.6000,
  k18: 40.5000,
  k19: 69.4000,
  k20: 98.3000,
  k21: 27.5000,
  k22: 56.4000,
  k23: 85.3000,
  k24: 14.5000,
  k25: 43.4000,
  k26: 72.3000,
  k27: 1.5000,
  k28: 30.4000,
  k29: 59.3000,
  k30: 88.2000,
  k31: 17.4000,
  k32: 46.3000,
  k33: 75.2000,
  k34: 4.4000,
  k35: 33.3000,
  k36: 62.2000,
  k37: 91.1000,
  k38: 20.3000,
  k39: 49.2000,
  k40: 78.1000,
  k41: 7.3000,
  k42: 36.2000,
  k43: 65.1000,
  k44: 94.0000,
  k45: 23.2000,
  k46: 52.1000,
  k47: 81.0000,
  k48: 10.2000,
  k49: 39.1000,
  k50: 68.0000,
  k51: 96.9000,
  k52: 26.1000,
  k53: 55.0000,
  k54: 83.9000,
  k55: 13.1000,
  k56: 42.0000,
  k57: 70.9000,
  k58: 0.1000,
  k59: 29.0000,
  k60: 57.9000,
  k61: 86.8000,
  k62: 16.0000,
  k63: 44.9000,
  k64: 73.8000,
  k65: 3.0000,
  k66: 31.9000,
  k67: 60.8000,
  k68: 89.7000,
  k69: 18.9000,
  k70: 47.8000,
  k71: 76.7000,
} as const;

export function V1032_TRES_FAILOVER_SCENARIO_165_evaluate(turn: number): {
  telecomStressExposureIndex: number;
  backboneBufferDelayTurns: number;
  telecomResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1032_TRES_FAILOVER_SCENARIO_165_COEF) as Array<
    keyof typeof V1032_TRES_FAILOVER_SCENARIO_165_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1032_TRES_FAILOVER_SCENARIO_165_COEF[keys[j]] * ((turn + j) % 17);
  }
  const telecomStressExposureIndex = V1032_TRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const backboneBufferDelayTurns = V1032_TRES_clamp(2 + (acc % 11), 1, 18);
  const telecomResilienceScore = V1032_TRES_clamp(90 - telecomStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1032_TRES_telecomResilienceBandFromScore(telecomResilienceScore) !== 'depleted';
  return { telecomStressExposureIndex, backboneBufferDelayTurns, telecomResilienceScore, stable };
}

export function V1032_TRES_FAILOVER_SCENARIO_165_snapshot(turn: number): V1032TresFailoverSnapshot {
  const r = V1032_TRES_FAILOVER_SCENARIO_165_evaluate(turn);
  return {
    scenarioId: V1032_TRES_FAILOVER_SCENARIO_165_META.id,
    regionId: V1032_TRES_FAILOVER_SCENARIO_165_META.regionId,
    telecomResilienceChannel: V1032_TRES_FAILOVER_SCENARIO_165_META.primaryChannel,
    telecomResilienceBand: V1032_TRES_FAILOVER_SCENARIO_165_META.telecomResilienceBand,
    telecomStressExposureIndex: r.telecomStressExposureIndex,
    backboneBufferDelayTurns: r.backboneBufferDelayTurns,
    telecomResilienceScore: r.telecomResilienceScore,
    telecomResilienceBand: V1032_TRES_telecomResilienceBandFromScore(r.telecomResilienceScore),
  };
}

export function V1032_TRES_FAILOVER_SCENARIO_165_regressionAssert(turn: number): boolean {
  const r = V1032_TRES_FAILOVER_SCENARIO_165_evaluate(turn);
  return typeof r.telecomStressExposureIndex === 'number' && r.telecomResilienceScore <= 100;
}
