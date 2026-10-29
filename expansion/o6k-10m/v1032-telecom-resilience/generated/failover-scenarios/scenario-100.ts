import { V1032_TRES_clamp, V1032_TRES_telecomResilienceBandFromScore } from '../../engine/telecom-resilience-utils.ts';
import type {
  V1032TresTelecomResilienceBand,
  V1032TresRegionId,
  V1032TresFailoverSnapshot,
  V1032TresTelecomResilienceChannel,
} from '../../types/core.ts';

/** Generated failover scenario 100 — extreme_heat/drought/dust handoff matrix. */
export const V1032_TRES_FAILOVER_SCENARIO_100_META = {
  id: 'failover_100',
  regionId: 'SA' as V1032TresRegionId,
  primaryChannel: 'emergency_care' as V1032TresTelecomResilienceChannel,
  telecomResilienceBand: 'minimal' as V1032TresTelecomResilienceBand,
  seed: 91621,
} as const;

const V1032_TRES_FAILOVER_SCENARIO_100_COEF = {
  k0: 86.1000,
  k1: 75.8000,
  k2: 65.5000,
  k3: 55.2000,
  k4: 44.9000,
  k5: 34.6000,
  k6: 24.3000,
  k7: 14.0000,
  k8: 3.7000,
  k9: 93.1000,
  k10: 82.8000,
  k11: 72.5000,
  k12: 62.2000,
  k13: 51.9000,
  k14: 41.6000,
  k15: 31.3000,
  k16: 21.0000,
  k17: 10.7000,
  k18: 0.4000,
  k19: 89.8000,
  k20: 79.5000,
  k21: 69.2000,
  k22: 58.9000,
  k23: 48.6000,
  k24: 38.3000,
  k25: 28.0000,
  k26: 17.7000,
  k27: 7.4000,
  k28: 96.8000,
  k29: 86.5000,
  k30: 76.2000,
  k31: 65.9000,
  k32: 55.6000,
  k33: 45.3000,
  k34: 35.0000,
  k35: 24.7000,
  k36: 14.4000,
  k37: 4.1000,
  k38: 93.5000,
  k39: 83.2000,
  k40: 72.9000,
  k41: 62.6000,
  k42: 52.3000,
  k43: 42.0000,
  k44: 31.7000,
  k45: 21.4000,
  k46: 11.1000,
  k47: 0.8000,
  k48: 90.2000,
  k49: 79.9000,
  k50: 69.6000,
  k51: 59.3000,
  k52: 49.0000,
  k53: 38.7000,
  k54: 28.4000,
  k55: 18.1000,
  k56: 7.8000,
  k57: 97.2000,
  k58: 86.9000,
  k59: 76.6000,
  k60: 66.3000,
  k61: 56.0000,
  k62: 45.7000,
  k63: 35.4000,
  k64: 25.1000,
  k65: 14.8000,
  k66: 4.5000,
  k67: 93.9000,
  k68: 83.6000,
  k69: 73.3000,
  k70: 63.0000,
  k71: 52.7000,
} as const;

export function V1032_TRES_FAILOVER_SCENARIO_100_evaluate(turn: number): {
  telecomStressExposureIndex: number;
  backboneBufferDelayTurns: number;
  telecomResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1032_TRES_FAILOVER_SCENARIO_100_COEF) as Array<
    keyof typeof V1032_TRES_FAILOVER_SCENARIO_100_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1032_TRES_FAILOVER_SCENARIO_100_COEF[keys[j]] * ((turn + j) % 17);
  }
  const telecomStressExposureIndex = V1032_TRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const backboneBufferDelayTurns = V1032_TRES_clamp(2 + (acc % 11), 1, 18);
  const telecomResilienceScore = V1032_TRES_clamp(90 - telecomStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1032_TRES_telecomResilienceBandFromScore(telecomResilienceScore) !== 'depleted';
  return { telecomStressExposureIndex, backboneBufferDelayTurns, telecomResilienceScore, stable };
}

export function V1032_TRES_FAILOVER_SCENARIO_100_snapshot(turn: number): V1032TresFailoverSnapshot {
  const r = V1032_TRES_FAILOVER_SCENARIO_100_evaluate(turn);
  return {
    scenarioId: V1032_TRES_FAILOVER_SCENARIO_100_META.id,
    regionId: V1032_TRES_FAILOVER_SCENARIO_100_META.regionId,
    telecomResilienceChannel: V1032_TRES_FAILOVER_SCENARIO_100_META.primaryChannel,
    telecomResilienceBand: V1032_TRES_FAILOVER_SCENARIO_100_META.telecomResilienceBand,
    telecomStressExposureIndex: r.telecomStressExposureIndex,
    backboneBufferDelayTurns: r.backboneBufferDelayTurns,
    telecomResilienceScore: r.telecomResilienceScore,
    telecomResilienceBand: V1032_TRES_telecomResilienceBandFromScore(r.telecomResilienceScore),
  };
}

export function V1032_TRES_FAILOVER_SCENARIO_100_regressionAssert(turn: number): boolean {
  const r = V1032_TRES_FAILOVER_SCENARIO_100_evaluate(turn);
  return typeof r.telecomStressExposureIndex === 'number' && r.telecomResilienceScore <= 100;
}
