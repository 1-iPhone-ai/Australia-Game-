import { V1032_TRES_clamp, V1032_TRES_telecomResilienceBandFromScore } from '../../engine/telecom-resilience-utils.ts';
import type {
  V1032TresTelecomResilienceBand,
  V1032TresRegionId,
  V1032TresFailoverSnapshot,
  V1032TresTelecomResilienceChannel,
} from '../../types/core.ts';

/** Generated failover scenario 161 — extreme_heat/drought/dust handoff matrix. */
export const V1032_TRES_FAILOVER_SCENARIO_161_META = {
  id: 'failover_161',
  regionId: 'VIC' as V1032TresRegionId,
  primaryChannel: 'primary_access' as V1032TresTelecomResilienceChannel,
  telecomResilienceBand: 'moderate' as V1032TresTelecomResilienceBand,
  seed: 147192,
} as const;

const V1032_TRES_FAILOVER_SCENARIO_161_COEF = {
  k0: 98.1000,
  k1: 61.7000,
  k2: 25.3000,
  k3: 88.6000,
  k4: 52.2000,
  k5: 15.8000,
  k6: 79.1000,
  k7: 42.7000,
  k8: 6.3000,
  k9: 69.6000,
  k10: 33.2000,
  k11: 96.5000,
  k12: 60.1000,
  k13: 23.7000,
  k14: 87.0000,
  k15: 50.6000,
  k16: 14.2000,
  k17: 77.5000,
  k18: 41.1000,
  k19: 4.7000,
  k20: 68.0000,
  k21: 31.6000,
  k22: 94.9000,
  k23: 58.5000,
  k24: 22.1000,
  k25: 85.4000,
  k26: 49.0000,
  k27: 12.6000,
  k28: 75.9000,
  k29: 39.5000,
  k30: 3.1000,
  k31: 66.4000,
  k32: 30.0000,
  k33: 93.3000,
  k34: 56.9000,
  k35: 20.5000,
  k36: 83.8000,
  k37: 47.4000,
  k38: 11.0000,
  k39: 74.3000,
  k40: 37.9000,
  k41: 1.5000,
  k42: 64.8000,
  k43: 28.4000,
  k44: 91.7000,
  k45: 55.3000,
  k46: 18.9000,
  k47: 82.2000,
  k48: 45.8000,
  k49: 9.4000,
  k50: 72.7000,
  k51: 36.3000,
  k52: 99.6000,
  k53: 63.2000,
  k54: 26.8000,
  k55: 90.1000,
  k56: 53.7000,
  k57: 17.3000,
  k58: 80.6000,
  k59: 44.2000,
  k60: 7.8000,
  k61: 71.1000,
  k62: 34.7000,
  k63: 98.0000,
  k64: 61.6000,
  k65: 25.2000,
  k66: 88.5000,
  k67: 52.1000,
  k68: 15.7000,
  k69: 79.0000,
  k70: 42.6000,
  k71: 6.2000,
} as const;

export function V1032_TRES_FAILOVER_SCENARIO_161_evaluate(turn: number): {
  telecomStressExposureIndex: number;
  backboneBufferDelayTurns: number;
  telecomResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1032_TRES_FAILOVER_SCENARIO_161_COEF) as Array<
    keyof typeof V1032_TRES_FAILOVER_SCENARIO_161_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1032_TRES_FAILOVER_SCENARIO_161_COEF[keys[j]] * ((turn + j) % 17);
  }
  const telecomStressExposureIndex = V1032_TRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const backboneBufferDelayTurns = V1032_TRES_clamp(2 + (acc % 11), 1, 18);
  const telecomResilienceScore = V1032_TRES_clamp(90 - telecomStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1032_TRES_telecomResilienceBandFromScore(telecomResilienceScore) !== 'depleted';
  return { telecomStressExposureIndex, backboneBufferDelayTurns, telecomResilienceScore, stable };
}

export function V1032_TRES_FAILOVER_SCENARIO_161_snapshot(turn: number): V1032TresFailoverSnapshot {
  const r = V1032_TRES_FAILOVER_SCENARIO_161_evaluate(turn);
  return {
    scenarioId: V1032_TRES_FAILOVER_SCENARIO_161_META.id,
    regionId: V1032_TRES_FAILOVER_SCENARIO_161_META.regionId,
    telecomResilienceChannel: V1032_TRES_FAILOVER_SCENARIO_161_META.primaryChannel,
    telecomResilienceBand: V1032_TRES_FAILOVER_SCENARIO_161_META.telecomResilienceBand,
    telecomStressExposureIndex: r.telecomStressExposureIndex,
    backboneBufferDelayTurns: r.backboneBufferDelayTurns,
    telecomResilienceScore: r.telecomResilienceScore,
    telecomResilienceBand: V1032_TRES_telecomResilienceBandFromScore(r.telecomResilienceScore),
  };
}

export function V1032_TRES_FAILOVER_SCENARIO_161_regressionAssert(turn: number): boolean {
  const r = V1032_TRES_FAILOVER_SCENARIO_161_evaluate(turn);
  return typeof r.telecomStressExposureIndex === 'number' && r.telecomResilienceScore <= 100;
}
