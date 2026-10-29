import { V1032_TRES_clamp, V1032_TRES_telecomResilienceBandFromScore } from '../../engine/telecom-resilience-utils.ts';
import type {
  V1032TresTelecomResilienceBand,
  V1032TresRegionId,
  V1032TresFailoverSnapshot,
  V1032TresTelecomResilienceChannel,
} from '../../types/core.ts';

/** Generated failover scenario 111 — extreme_heat/drought/dust handoff matrix. */
export const V1032_TRES_FAILOVER_SCENARIO_111_META = {
  id: 'failover_111',
  regionId: 'ACT' as V1032TresRegionId,
  primaryChannel: 'primary_access' as V1032TresTelecomResilienceChannel,
  telecomResilienceBand: 'moderate' as V1032TresTelecomResilienceBand,
  seed: 101642,
} as const;

const V1032_TRES_FAILOVER_SCENARIO_111_COEF = {
  k0: 42.5000,
  k1: 37.3000,
  k2: 32.1000,
  k3: 26.9000,
  k4: 21.7000,
  k5: 16.5000,
  k6: 11.3000,
  k7: 6.1000,
  k8: 0.9000,
  k9: 95.4000,
  k10: 90.2000,
  k11: 85.0000,
  k12: 79.8000,
  k13: 74.6000,
  k14: 69.4000,
  k15: 64.2000,
  k16: 59.0000,
  k17: 53.8000,
  k18: 48.6000,
  k19: 43.4000,
  k20: 38.2000,
  k21: 33.0000,
  k22: 27.8000,
  k23: 22.6000,
  k24: 17.4000,
  k25: 12.2000,
  k26: 7.0000,
  k27: 1.8000,
  k28: 96.3000,
  k29: 91.1000,
  k30: 85.9000,
  k31: 80.7000,
  k32: 75.5000,
  k33: 70.3000,
  k34: 65.1000,
  k35: 59.9000,
  k36: 54.7000,
  k37: 49.5000,
  k38: 44.3000,
  k39: 39.1000,
  k40: 33.9000,
  k41: 28.7000,
  k42: 23.5000,
  k43: 18.3000,
  k44: 13.1000,
  k45: 7.9000,
  k46: 2.7000,
  k47: 97.2000,
  k48: 92.0000,
  k49: 86.8000,
  k50: 81.6000,
  k51: 76.4000,
  k52: 71.2000,
  k53: 66.0000,
  k54: 60.8000,
  k55: 55.6000,
  k56: 50.4000,
  k57: 45.2000,
  k58: 40.0000,
  k59: 34.8000,
  k60: 29.6000,
  k61: 24.4000,
  k62: 19.2000,
  k63: 14.0000,
  k64: 8.8000,
  k65: 3.6000,
  k66: 98.1000,
  k67: 92.9000,
  k68: 87.7000,
  k69: 82.5000,
  k70: 77.3000,
  k71: 72.1000,
} as const;

export function V1032_TRES_FAILOVER_SCENARIO_111_evaluate(turn: number): {
  telecomStressExposureIndex: number;
  backboneBufferDelayTurns: number;
  telecomResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1032_TRES_FAILOVER_SCENARIO_111_COEF) as Array<
    keyof typeof V1032_TRES_FAILOVER_SCENARIO_111_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1032_TRES_FAILOVER_SCENARIO_111_COEF[keys[j]] * ((turn + j) % 17);
  }
  const telecomStressExposureIndex = V1032_TRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const backboneBufferDelayTurns = V1032_TRES_clamp(2 + (acc % 11), 1, 18);
  const telecomResilienceScore = V1032_TRES_clamp(90 - telecomStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1032_TRES_telecomResilienceBandFromScore(telecomResilienceScore) !== 'depleted';
  return { telecomStressExposureIndex, backboneBufferDelayTurns, telecomResilienceScore, stable };
}

export function V1032_TRES_FAILOVER_SCENARIO_111_snapshot(turn: number): V1032TresFailoverSnapshot {
  const r = V1032_TRES_FAILOVER_SCENARIO_111_evaluate(turn);
  return {
    scenarioId: V1032_TRES_FAILOVER_SCENARIO_111_META.id,
    regionId: V1032_TRES_FAILOVER_SCENARIO_111_META.regionId,
    telecomResilienceChannel: V1032_TRES_FAILOVER_SCENARIO_111_META.primaryChannel,
    telecomResilienceBand: V1032_TRES_FAILOVER_SCENARIO_111_META.telecomResilienceBand,
    telecomStressExposureIndex: r.telecomStressExposureIndex,
    backboneBufferDelayTurns: r.backboneBufferDelayTurns,
    telecomResilienceScore: r.telecomResilienceScore,
    telecomResilienceBand: V1032_TRES_telecomResilienceBandFromScore(r.telecomResilienceScore),
  };
}

export function V1032_TRES_FAILOVER_SCENARIO_111_regressionAssert(turn: number): boolean {
  const r = V1032_TRES_FAILOVER_SCENARIO_111_evaluate(turn);
  return typeof r.telecomStressExposureIndex === 'number' && r.telecomResilienceScore <= 100;
}
