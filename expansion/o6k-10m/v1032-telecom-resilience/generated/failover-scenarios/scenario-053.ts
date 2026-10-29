import { V1032_TRES_clamp, V1032_TRES_telecomResilienceBandFromScore } from '../../engine/telecom-resilience-utils.ts';
import type {
  V1032TresTelecomResilienceBand,
  V1032TresRegionId,
  V1032TresFailoverSnapshot,
  V1032TresTelecomResilienceChannel,
} from '../../types/core.ts';

/** Generated failover scenario 053 — extreme_heat/drought/dust handoff matrix. */
export const V1032_TRES_FAILOVER_SCENARIO_053_META = {
  id: 'failover_053',
  regionId: 'TAS' as V1032TresRegionId,
  primaryChannel: 'telehealth' as V1032TresTelecomResilienceChannel,
  telecomResilienceBand: 'critical' as V1032TresTelecomResilienceBand,
  seed: 48804,
} as const;

const V1032_TRES_FAILOVER_SCENARIO_053_COEF = {
  k0: 45.8000,
  k1: 40.9000,
  k2: 36.0000,
  k3: 31.1000,
  k4: 26.2000,
  k5: 21.3000,
  k6: 16.4000,
  k7: 11.5000,
  k8: 6.6000,
  k9: 1.7000,
  k10: 96.5000,
  k11: 91.6000,
  k12: 86.7000,
  k13: 81.8000,
  k14: 76.9000,
  k15: 72.0000,
  k16: 67.1000,
  k17: 62.2000,
  k18: 57.3000,
  k19: 52.4000,
  k20: 47.5000,
  k21: 42.6000,
  k22: 37.7000,
  k23: 32.8000,
  k24: 27.9000,
  k25: 23.0000,
  k26: 18.1000,
  k27: 13.2000,
  k28: 8.3000,
  k29: 3.4000,
  k30: 98.2000,
  k31: 93.3000,
  k32: 88.4000,
  k33: 83.5000,
  k34: 78.6000,
  k35: 73.7000,
  k36: 68.8000,
  k37: 63.9000,
  k38: 59.0000,
  k39: 54.1000,
  k40: 49.2000,
  k41: 44.3000,
  k42: 39.4000,
  k43: 34.5000,
  k44: 29.6000,
  k45: 24.7000,
  k46: 19.8000,
  k47: 14.9000,
  k48: 10.0000,
  k49: 5.1000,
  k50: 0.2000,
  k51: 95.0000,
  k52: 90.1000,
  k53: 85.2000,
  k54: 80.3000,
  k55: 75.4000,
  k56: 70.5000,
  k57: 65.6000,
  k58: 60.7000,
  k59: 55.8000,
  k60: 50.9000,
  k61: 46.0000,
  k62: 41.1000,
  k63: 36.2000,
  k64: 31.3000,
  k65: 26.4000,
  k66: 21.5000,
  k67: 16.6000,
  k68: 11.7000,
  k69: 6.8000,
  k70: 1.9000,
  k71: 96.7000,
} as const;

export function V1032_TRES_FAILOVER_SCENARIO_053_evaluate(turn: number): {
  telecomStressExposureIndex: number;
  backboneBufferDelayTurns: number;
  telecomResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1032_TRES_FAILOVER_SCENARIO_053_COEF) as Array<
    keyof typeof V1032_TRES_FAILOVER_SCENARIO_053_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1032_TRES_FAILOVER_SCENARIO_053_COEF[keys[j]] * ((turn + j) % 17);
  }
  const telecomStressExposureIndex = V1032_TRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const backboneBufferDelayTurns = V1032_TRES_clamp(2 + (acc % 11), 1, 18);
  const telecomResilienceScore = V1032_TRES_clamp(90 - telecomStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1032_TRES_telecomResilienceBandFromScore(telecomResilienceScore) !== 'depleted';
  return { telecomStressExposureIndex, backboneBufferDelayTurns, telecomResilienceScore, stable };
}

export function V1032_TRES_FAILOVER_SCENARIO_053_snapshot(turn: number): V1032TresFailoverSnapshot {
  const r = V1032_TRES_FAILOVER_SCENARIO_053_evaluate(turn);
  return {
    scenarioId: V1032_TRES_FAILOVER_SCENARIO_053_META.id,
    regionId: V1032_TRES_FAILOVER_SCENARIO_053_META.regionId,
    telecomResilienceChannel: V1032_TRES_FAILOVER_SCENARIO_053_META.primaryChannel,
    telecomResilienceBand: V1032_TRES_FAILOVER_SCENARIO_053_META.telecomResilienceBand,
    telecomStressExposureIndex: r.telecomStressExposureIndex,
    backboneBufferDelayTurns: r.backboneBufferDelayTurns,
    telecomResilienceScore: r.telecomResilienceScore,
    telecomResilienceBand: V1032_TRES_telecomResilienceBandFromScore(r.telecomResilienceScore),
  };
}

export function V1032_TRES_FAILOVER_SCENARIO_053_regressionAssert(turn: number): boolean {
  const r = V1032_TRES_FAILOVER_SCENARIO_053_evaluate(turn);
  return typeof r.telecomStressExposureIndex === 'number' && r.telecomResilienceScore <= 100;
}
