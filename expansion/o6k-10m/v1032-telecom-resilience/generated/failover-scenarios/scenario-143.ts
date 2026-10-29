import { V1032_TRES_clamp, V1032_TRES_telecomResilienceBandFromScore } from '../../engine/telecom-resilience-utils.ts';
import type {
  V1032TresTelecomResilienceBand,
  V1032TresRegionId,
  V1032TresFailoverSnapshot,
  V1032TresTelecomResilienceChannel,
} from '../../types/core.ts';

/** Generated failover scenario 143 — extreme_heat/drought/dust handoff matrix. */
export const V1032_TRES_FAILOVER_SCENARIO_143_META = {
  id: 'failover_143',
  regionId: 'ACT' as V1032TresRegionId,
  primaryChannel: 'telehealth' as V1032TresTelecomResilienceChannel,
  telecomResilienceBand: 'critical' as V1032TresTelecomResilienceBand,
  seed: 130794,
} as const;

const V1032_TRES_FAILOVER_SCENARIO_143_COEF = {
  k0: 6.3000,
  k1: 25.0000,
  k2: 43.7000,
  k3: 62.4000,
  k4: 81.1000,
  k5: 0.1000,
  k6: 18.8000,
  k7: 37.5000,
  k8: 56.2000,
  k9: 74.9000,
  k10: 93.6000,
  k11: 12.6000,
  k12: 31.3000,
  k13: 50.0000,
  k14: 68.7000,
  k15: 87.4000,
  k16: 6.4000,
  k17: 25.1000,
  k18: 43.8000,
  k19: 62.5000,
  k20: 81.2000,
  k21: 0.2000,
  k22: 18.9000,
  k23: 37.6000,
  k24: 56.3000,
  k25: 75.0000,
  k26: 93.7000,
  k27: 12.7000,
  k28: 31.4000,
  k29: 50.1000,
  k30: 68.8000,
  k31: 87.5000,
  k32: 6.5000,
  k33: 25.2000,
  k34: 43.9000,
  k35: 62.6000,
  k36: 81.3000,
  k37: 0.3000,
  k38: 19.0000,
  k39: 37.7000,
  k40: 56.4000,
  k41: 75.1000,
  k42: 93.8000,
  k43: 12.8000,
  k44: 31.5000,
  k45: 50.2000,
  k46: 68.9000,
  k47: 87.6000,
  k48: 6.6000,
  k49: 25.3000,
  k50: 44.0000,
  k51: 62.7000,
  k52: 81.4000,
  k53: 0.4000,
  k54: 19.1000,
  k55: 37.8000,
  k56: 56.5000,
  k57: 75.2000,
  k58: 93.9000,
  k59: 12.9000,
  k60: 31.6000,
  k61: 50.3000,
  k62: 69.0000,
  k63: 87.7000,
  k64: 6.7000,
  k65: 25.4000,
  k66: 44.1000,
  k67: 62.8000,
  k68: 81.5000,
  k69: 0.5000,
  k70: 19.2000,
  k71: 37.9000,
} as const;

export function V1032_TRES_FAILOVER_SCENARIO_143_evaluate(turn: number): {
  telecomStressExposureIndex: number;
  backboneBufferDelayTurns: number;
  telecomResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1032_TRES_FAILOVER_SCENARIO_143_COEF) as Array<
    keyof typeof V1032_TRES_FAILOVER_SCENARIO_143_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1032_TRES_FAILOVER_SCENARIO_143_COEF[keys[j]] * ((turn + j) % 17);
  }
  const telecomStressExposureIndex = V1032_TRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const backboneBufferDelayTurns = V1032_TRES_clamp(2 + (acc % 11), 1, 18);
  const telecomResilienceScore = V1032_TRES_clamp(90 - telecomStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1032_TRES_telecomResilienceBandFromScore(telecomResilienceScore) !== 'depleted';
  return { telecomStressExposureIndex, backboneBufferDelayTurns, telecomResilienceScore, stable };
}

export function V1032_TRES_FAILOVER_SCENARIO_143_snapshot(turn: number): V1032TresFailoverSnapshot {
  const r = V1032_TRES_FAILOVER_SCENARIO_143_evaluate(turn);
  return {
    scenarioId: V1032_TRES_FAILOVER_SCENARIO_143_META.id,
    regionId: V1032_TRES_FAILOVER_SCENARIO_143_META.regionId,
    telecomResilienceChannel: V1032_TRES_FAILOVER_SCENARIO_143_META.primaryChannel,
    telecomResilienceBand: V1032_TRES_FAILOVER_SCENARIO_143_META.telecomResilienceBand,
    telecomStressExposureIndex: r.telecomStressExposureIndex,
    backboneBufferDelayTurns: r.backboneBufferDelayTurns,
    telecomResilienceScore: r.telecomResilienceScore,
    telecomResilienceBand: V1032_TRES_telecomResilienceBandFromScore(r.telecomResilienceScore),
  };
}

export function V1032_TRES_FAILOVER_SCENARIO_143_regressionAssert(turn: number): boolean {
  const r = V1032_TRES_FAILOVER_SCENARIO_143_evaluate(turn);
  return typeof r.telecomStressExposureIndex === 'number' && r.telecomResilienceScore <= 100;
}
