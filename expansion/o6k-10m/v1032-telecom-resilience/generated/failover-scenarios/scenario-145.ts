import { V1032_TRES_clamp, V1032_TRES_telecomResilienceBandFromScore } from '../../engine/telecom-resilience-utils.ts';
import type {
  V1032TresTelecomResilienceBand,
  V1032TresRegionId,
  V1032TresFailoverSnapshot,
  V1032TresTelecomResilienceChannel,
} from '../../types/core.ts';

/** Generated failover scenario 145 — extreme_heat/drought/dust handoff matrix. */
export const V1032_TRES_FAILOVER_SCENARIO_145_META = {
  id: 'failover_145',
  regionId: 'VIC' as V1032TresRegionId,
  primaryChannel: 'specialist_referral' as V1032TresTelecomResilienceChannel,
  telecomResilienceBand: 'minimal' as V1032TresTelecomResilienceBand,
  seed: 132616,
} as const;

const V1032_TRES_FAILOVER_SCENARIO_145_COEF = {
  k0: 16.5000,
  k1: 18.0000,
  k2: 19.5000,
  k3: 21.0000,
  k4: 22.5000,
  k5: 24.0000,
  k6: 25.5000,
  k7: 27.0000,
  k8: 28.5000,
  k9: 30.0000,
  k10: 31.5000,
  k11: 33.0000,
  k12: 34.5000,
  k13: 36.0000,
  k14: 37.5000,
  k15: 39.0000,
  k16: 40.5000,
  k17: 42.0000,
  k18: 43.5000,
  k19: 45.0000,
  k20: 46.5000,
  k21: 48.0000,
  k22: 49.5000,
  k23: 51.0000,
  k24: 52.5000,
  k25: 54.0000,
  k26: 55.5000,
  k27: 57.0000,
  k28: 58.5000,
  k29: 60.0000,
  k30: 61.5000,
  k31: 63.0000,
  k32: 64.5000,
  k33: 66.0000,
  k34: 67.5000,
  k35: 69.0000,
  k36: 70.5000,
  k37: 72.0000,
  k38: 73.5000,
  k39: 75.0000,
  k40: 76.5000,
  k41: 78.0000,
  k42: 79.5000,
  k43: 81.0000,
  k44: 82.5000,
  k45: 84.0000,
  k46: 85.5000,
  k47: 87.0000,
  k48: 88.5000,
  k49: 90.0000,
  k50: 91.5000,
  k51: 93.0000,
  k52: 94.5000,
  k53: 96.0000,
  k54: 97.5000,
  k55: 99.0000,
  k56: 0.8000,
  k57: 2.3000,
  k58: 3.8000,
  k59: 5.3000,
  k60: 6.8000,
  k61: 8.3000,
  k62: 9.8000,
  k63: 11.3000,
  k64: 12.8000,
  k65: 14.3000,
  k66: 15.8000,
  k67: 17.3000,
  k68: 18.8000,
  k69: 20.3000,
  k70: 21.8000,
  k71: 23.3000,
} as const;

export function V1032_TRES_FAILOVER_SCENARIO_145_evaluate(turn: number): {
  telecomStressExposureIndex: number;
  backboneBufferDelayTurns: number;
  telecomResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1032_TRES_FAILOVER_SCENARIO_145_COEF) as Array<
    keyof typeof V1032_TRES_FAILOVER_SCENARIO_145_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1032_TRES_FAILOVER_SCENARIO_145_COEF[keys[j]] * ((turn + j) % 17);
  }
  const telecomStressExposureIndex = V1032_TRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const backboneBufferDelayTurns = V1032_TRES_clamp(2 + (acc % 11), 1, 18);
  const telecomResilienceScore = V1032_TRES_clamp(90 - telecomStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1032_TRES_telecomResilienceBandFromScore(telecomResilienceScore) !== 'depleted';
  return { telecomStressExposureIndex, backboneBufferDelayTurns, telecomResilienceScore, stable };
}

export function V1032_TRES_FAILOVER_SCENARIO_145_snapshot(turn: number): V1032TresFailoverSnapshot {
  const r = V1032_TRES_FAILOVER_SCENARIO_145_evaluate(turn);
  return {
    scenarioId: V1032_TRES_FAILOVER_SCENARIO_145_META.id,
    regionId: V1032_TRES_FAILOVER_SCENARIO_145_META.regionId,
    telecomResilienceChannel: V1032_TRES_FAILOVER_SCENARIO_145_META.primaryChannel,
    telecomResilienceBand: V1032_TRES_FAILOVER_SCENARIO_145_META.telecomResilienceBand,
    telecomStressExposureIndex: r.telecomStressExposureIndex,
    backboneBufferDelayTurns: r.backboneBufferDelayTurns,
    telecomResilienceScore: r.telecomResilienceScore,
    telecomResilienceBand: V1032_TRES_telecomResilienceBandFromScore(r.telecomResilienceScore),
  };
}

export function V1032_TRES_FAILOVER_SCENARIO_145_regressionAssert(turn: number): boolean {
  const r = V1032_TRES_FAILOVER_SCENARIO_145_evaluate(turn);
  return typeof r.telecomStressExposureIndex === 'number' && r.telecomResilienceScore <= 100;
}
