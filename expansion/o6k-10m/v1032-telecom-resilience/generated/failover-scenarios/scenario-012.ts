import { V1032_TRES_clamp, V1032_TRES_telecomResilienceBandFromScore } from '../../engine/telecom-resilience-utils.ts';
import type {
  V1032TresTelecomResilienceBand,
  V1032TresRegionId,
  V1032TresFailoverSnapshot,
  V1032TresTelecomResilienceChannel,
} from '../../types/core.ts';

/** Generated failover scenario 012 — extreme_heat/drought/dust handoff matrix. */
export const V1032_TRES_FAILOVER_SCENARIO_012_META = {
  id: 'failover_012',
  regionId: 'SA' as V1032TresRegionId,
  primaryChannel: 'exchange_zone' as V1032TresTelecomResilienceChannel,
  telecomResilienceBand: 'elevated' as V1032TresTelecomResilienceBand,
  seed: 11453,
} as const;

const V1032_TRES_FAILOVER_SCENARIO_012_COEF = {
  k0: 36.1000,
  k1: 84.7000,
  k2: 33.6000,
  k3: 82.2000,
  k4: 31.1000,
  k5: 79.7000,
  k6: 28.6000,
  k7: 77.2000,
  k8: 26.1000,
  k9: 74.7000,
  k10: 23.6000,
  k11: 72.2000,
  k12: 21.1000,
  k13: 69.7000,
  k14: 18.6000,
  k15: 67.2000,
  k16: 16.1000,
  k17: 64.7000,
  k18: 13.6000,
  k19: 62.2000,
  k20: 11.1000,
  k21: 59.7000,
  k22: 8.6000,
  k23: 57.2000,
  k24: 6.1000,
  k25: 54.7000,
  k26: 3.6000,
  k27: 52.2000,
  k28: 1.1000,
  k29: 49.7000,
  k30: 98.3000,
  k31: 47.2000,
  k32: 95.8000,
  k33: 44.7000,
  k34: 93.3000,
  k35: 42.2000,
  k36: 90.8000,
  k37: 39.7000,
  k38: 88.3000,
  k39: 37.2000,
  k40: 85.8000,
  k41: 34.7000,
  k42: 83.3000,
  k43: 32.2000,
  k44: 80.8000,
  k45: 29.7000,
  k46: 78.3000,
  k47: 27.2000,
  k48: 75.8000,
  k49: 24.7000,
  k50: 73.3000,
  k51: 22.2000,
  k52: 70.8000,
  k53: 19.7000,
  k54: 68.3000,
  k55: 17.2000,
  k56: 65.8000,
  k57: 14.7000,
  k58: 63.3000,
  k59: 12.2000,
  k60: 60.8000,
  k61: 9.7000,
  k62: 58.3000,
  k63: 7.2000,
  k64: 55.8000,
  k65: 4.7000,
  k66: 53.3000,
  k67: 2.2000,
  k68: 50.8000,
  k69: 99.4000,
  k70: 48.3000,
  k71: 96.9000,
} as const;

export function V1032_TRES_FAILOVER_SCENARIO_012_evaluate(turn: number): {
  telecomStressExposureIndex: number;
  backboneBufferDelayTurns: number;
  telecomResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1032_TRES_FAILOVER_SCENARIO_012_COEF) as Array<
    keyof typeof V1032_TRES_FAILOVER_SCENARIO_012_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1032_TRES_FAILOVER_SCENARIO_012_COEF[keys[j]] * ((turn + j) % 17);
  }
  const telecomStressExposureIndex = V1032_TRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const backboneBufferDelayTurns = V1032_TRES_clamp(2 + (acc % 11), 1, 18);
  const telecomResilienceScore = V1032_TRES_clamp(90 - telecomStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1032_TRES_telecomResilienceBandFromScore(telecomResilienceScore) !== 'depleted';
  return { telecomStressExposureIndex, backboneBufferDelayTurns, telecomResilienceScore, stable };
}

export function V1032_TRES_FAILOVER_SCENARIO_012_snapshot(turn: number): V1032TresFailoverSnapshot {
  const r = V1032_TRES_FAILOVER_SCENARIO_012_evaluate(turn);
  return {
    scenarioId: V1032_TRES_FAILOVER_SCENARIO_012_META.id,
    regionId: V1032_TRES_FAILOVER_SCENARIO_012_META.regionId,
    telecomResilienceChannel: V1032_TRES_FAILOVER_SCENARIO_012_META.primaryChannel,
    telecomResilienceBand: V1032_TRES_FAILOVER_SCENARIO_012_META.telecomResilienceBand,
    telecomStressExposureIndex: r.telecomStressExposureIndex,
    backboneBufferDelayTurns: r.backboneBufferDelayTurns,
    telecomResilienceScore: r.telecomResilienceScore,
    telecomResilienceBand: V1032_TRES_telecomResilienceBandFromScore(r.telecomResilienceScore),
  };
}

export function V1032_TRES_FAILOVER_SCENARIO_012_regressionAssert(turn: number): boolean {
  const r = V1032_TRES_FAILOVER_SCENARIO_012_evaluate(turn);
  return typeof r.telecomStressExposureIndex === 'number' && r.telecomResilienceScore <= 100;
}
