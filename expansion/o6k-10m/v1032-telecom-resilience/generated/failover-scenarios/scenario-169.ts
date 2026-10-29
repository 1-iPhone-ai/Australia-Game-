import { V1032_TRES_clamp, V1032_TRES_telecomResilienceBandFromScore } from '../../engine/telecom-resilience-utils.ts';
import type {
  V1032TresTelecomResilienceBand,
  V1032TresRegionId,
  V1032TresFailoverSnapshot,
  V1032TresTelecomResilienceChannel,
} from '../../types/core.ts';

/** Generated failover scenario 169 — extreme_heat/drought/dust handoff matrix. */
export const V1032_TRES_FAILOVER_SCENARIO_169_META = {
  id: 'failover_169',
  regionId: 'VIC' as V1032TresRegionId,
  primaryChannel: 'remote' as V1032TresTelecomResilienceChannel,
  telecomResilienceBand: 'recovering' as V1032TresTelecomResilienceBand,
  seed: 154480,
} as const;

const V1032_TRES_FAILOVER_SCENARIO_169_COEF = {
  k0: 39.2000,
  k1: 33.7000,
  k2: 28.2000,
  k3: 22.7000,
  k4: 17.2000,
  k5: 11.7000,
  k6: 6.2000,
  k7: 0.7000,
  k8: 94.9000,
  k9: 89.4000,
  k10: 83.9000,
  k11: 78.4000,
  k12: 72.9000,
  k13: 67.4000,
  k14: 61.9000,
  k15: 56.4000,
  k16: 50.9000,
  k17: 45.4000,
  k18: 39.9000,
  k19: 34.4000,
  k20: 28.9000,
  k21: 23.4000,
  k22: 17.9000,
  k23: 12.4000,
  k24: 6.9000,
  k25: 1.4000,
  k26: 95.6000,
  k27: 90.1000,
  k28: 84.6000,
  k29: 79.1000,
  k30: 73.6000,
  k31: 68.1000,
  k32: 62.6000,
  k33: 57.1000,
  k34: 51.6000,
  k35: 46.1000,
  k36: 40.6000,
  k37: 35.1000,
  k38: 29.6000,
  k39: 24.1000,
  k40: 18.6000,
  k41: 13.1000,
  k42: 7.6000,
  k43: 2.1000,
  k44: 96.3000,
  k45: 90.8000,
  k46: 85.3000,
  k47: 79.8000,
  k48: 74.3000,
  k49: 68.8000,
  k50: 63.3000,
  k51: 57.8000,
  k52: 52.3000,
  k53: 46.8000,
  k54: 41.3000,
  k55: 35.8000,
  k56: 30.3000,
  k57: 24.8000,
  k58: 19.3000,
  k59: 13.8000,
  k60: 8.3000,
  k61: 2.8000,
  k62: 97.0000,
  k63: 91.5000,
  k64: 86.0000,
  k65: 80.5000,
  k66: 75.0000,
  k67: 69.5000,
  k68: 64.0000,
  k69: 58.5000,
  k70: 53.0000,
  k71: 47.5000,
} as const;

export function V1032_TRES_FAILOVER_SCENARIO_169_evaluate(turn: number): {
  telecomStressExposureIndex: number;
  backboneBufferDelayTurns: number;
  telecomResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1032_TRES_FAILOVER_SCENARIO_169_COEF) as Array<
    keyof typeof V1032_TRES_FAILOVER_SCENARIO_169_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1032_TRES_FAILOVER_SCENARIO_169_COEF[keys[j]] * ((turn + j) % 17);
  }
  const telecomStressExposureIndex = V1032_TRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const backboneBufferDelayTurns = V1032_TRES_clamp(2 + (acc % 11), 1, 18);
  const telecomResilienceScore = V1032_TRES_clamp(90 - telecomStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1032_TRES_telecomResilienceBandFromScore(telecomResilienceScore) !== 'depleted';
  return { telecomStressExposureIndex, backboneBufferDelayTurns, telecomResilienceScore, stable };
}

export function V1032_TRES_FAILOVER_SCENARIO_169_snapshot(turn: number): V1032TresFailoverSnapshot {
  const r = V1032_TRES_FAILOVER_SCENARIO_169_evaluate(turn);
  return {
    scenarioId: V1032_TRES_FAILOVER_SCENARIO_169_META.id,
    regionId: V1032_TRES_FAILOVER_SCENARIO_169_META.regionId,
    telecomResilienceChannel: V1032_TRES_FAILOVER_SCENARIO_169_META.primaryChannel,
    telecomResilienceBand: V1032_TRES_FAILOVER_SCENARIO_169_META.telecomResilienceBand,
    telecomStressExposureIndex: r.telecomStressExposureIndex,
    backboneBufferDelayTurns: r.backboneBufferDelayTurns,
    telecomResilienceScore: r.telecomResilienceScore,
    telecomResilienceBand: V1032_TRES_telecomResilienceBandFromScore(r.telecomResilienceScore),
  };
}

export function V1032_TRES_FAILOVER_SCENARIO_169_regressionAssert(turn: number): boolean {
  const r = V1032_TRES_FAILOVER_SCENARIO_169_evaluate(turn);
  return typeof r.telecomStressExposureIndex === 'number' && r.telecomResilienceScore <= 100;
}
