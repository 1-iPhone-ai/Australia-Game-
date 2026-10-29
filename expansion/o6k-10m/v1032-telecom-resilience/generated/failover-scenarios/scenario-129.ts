import { V1032_TRES_clamp, V1032_TRES_telecomResilienceBandFromScore } from '../../engine/telecom-resilience-utils.ts';
import type {
  V1032TresTelecomResilienceBand,
  V1032TresRegionId,
  V1032TresFailoverSnapshot,
  V1032TresTelecomResilienceChannel,
} from '../../types/core.ts';

/** Generated failover scenario 129 — extreme_heat/drought/dust handoff matrix. */
export const V1032_TRES_FAILOVER_SCENARIO_129_META = {
  id: 'failover_129',
  regionId: 'VIC' as V1032TresRegionId,
  primaryChannel: 'remote' as V1032TresTelecomResilienceChannel,
  telecomResilienceBand: 'recovering' as V1032TresTelecomResilienceBand,
  seed: 118040,
} as const;

const V1032_TRES_FAILOVER_SCENARIO_129_COEF = {
  k0: 34.6000,
  k1: 74.0000,
  k2: 13.7000,
  k3: 53.1000,
  k4: 92.5000,
  k5: 32.2000,
  k6: 71.6000,
  k7: 11.3000,
  k8: 50.7000,
  k9: 90.1000,
  k10: 29.8000,
  k11: 69.2000,
  k12: 8.9000,
  k13: 48.3000,
  k14: 87.7000,
  k15: 27.4000,
  k16: 66.8000,
  k17: 6.5000,
  k18: 45.9000,
  k19: 85.3000,
  k20: 25.0000,
  k21: 64.4000,
  k22: 4.1000,
  k23: 43.5000,
  k24: 82.9000,
  k25: 22.6000,
  k26: 62.0000,
  k27: 1.7000,
  k28: 41.1000,
  k29: 80.5000,
  k30: 20.2000,
  k31: 59.6000,
  k32: 99.0000,
  k33: 38.7000,
  k34: 78.1000,
  k35: 17.8000,
  k36: 57.2000,
  k37: 96.6000,
  k38: 36.3000,
  k39: 75.7000,
  k40: 15.4000,
  k41: 54.8000,
  k42: 94.2000,
  k43: 33.9000,
  k44: 73.3000,
  k45: 13.0000,
  k46: 52.4000,
  k47: 91.8000,
  k48: 31.5000,
  k49: 70.9000,
  k50: 10.6000,
  k51: 50.0000,
  k52: 89.4000,
  k53: 29.1000,
  k54: 68.5000,
  k55: 8.2000,
  k56: 47.6000,
  k57: 87.0000,
  k58: 26.7000,
  k59: 66.1000,
  k60: 5.8000,
  k61: 45.2000,
  k62: 84.6000,
  k63: 24.3000,
  k64: 63.7000,
  k65: 3.4000,
  k66: 42.8000,
  k67: 82.2000,
  k68: 21.9000,
  k69: 61.3000,
  k70: 1.0000,
  k71: 40.4000,
} as const;

export function V1032_TRES_FAILOVER_SCENARIO_129_evaluate(turn: number): {
  telecomStressExposureIndex: number;
  backboneBufferDelayTurns: number;
  telecomResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1032_TRES_FAILOVER_SCENARIO_129_COEF) as Array<
    keyof typeof V1032_TRES_FAILOVER_SCENARIO_129_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1032_TRES_FAILOVER_SCENARIO_129_COEF[keys[j]] * ((turn + j) % 17);
  }
  const telecomStressExposureIndex = V1032_TRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const backboneBufferDelayTurns = V1032_TRES_clamp(2 + (acc % 11), 1, 18);
  const telecomResilienceScore = V1032_TRES_clamp(90 - telecomStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1032_TRES_telecomResilienceBandFromScore(telecomResilienceScore) !== 'depleted';
  return { telecomStressExposureIndex, backboneBufferDelayTurns, telecomResilienceScore, stable };
}

export function V1032_TRES_FAILOVER_SCENARIO_129_snapshot(turn: number): V1032TresFailoverSnapshot {
  const r = V1032_TRES_FAILOVER_SCENARIO_129_evaluate(turn);
  return {
    scenarioId: V1032_TRES_FAILOVER_SCENARIO_129_META.id,
    regionId: V1032_TRES_FAILOVER_SCENARIO_129_META.regionId,
    telecomResilienceChannel: V1032_TRES_FAILOVER_SCENARIO_129_META.primaryChannel,
    telecomResilienceBand: V1032_TRES_FAILOVER_SCENARIO_129_META.telecomResilienceBand,
    telecomStressExposureIndex: r.telecomStressExposureIndex,
    backboneBufferDelayTurns: r.backboneBufferDelayTurns,
    telecomResilienceScore: r.telecomResilienceScore,
    telecomResilienceBand: V1032_TRES_telecomResilienceBandFromScore(r.telecomResilienceScore),
  };
}

export function V1032_TRES_FAILOVER_SCENARIO_129_regressionAssert(turn: number): boolean {
  const r = V1032_TRES_FAILOVER_SCENARIO_129_evaluate(turn);
  return typeof r.telecomStressExposureIndex === 'number' && r.telecomResilienceScore <= 100;
}
