import { V1032_TRES_clamp, V1032_TRES_telecomResilienceBandFromScore } from '../../engine/telecom-resilience-utils.ts';
import type {
  V1032TresTelecomResilienceBand,
  V1032TresRegionId,
  V1032TresFailoverSnapshot,
  V1032TresTelecomResilienceChannel,
} from '../../types/core.ts';

/** Generated failover scenario 134 — extreme_heat/drought/dust handoff matrix. */
export const V1032_TRES_FAILOVER_SCENARIO_134_META = {
  id: 'failover_134',
  regionId: 'NT' as V1032TresRegionId,
  primaryChannel: 'rural_clinic' as V1032TresTelecomResilienceChannel,
  telecomResilienceBand: 'recovering' as V1032TresTelecomResilienceBand,
  seed: 122595,
} as const;

const V1032_TRES_FAILOVER_SCENARIO_134_COEF = {
  k0: 60.1000,
  k1: 56.5000,
  k2: 52.9000,
  k3: 49.3000,
  k4: 45.7000,
  k5: 42.1000,
  k6: 38.5000,
  k7: 34.9000,
  k8: 31.3000,
  k9: 27.7000,
  k10: 24.1000,
  k11: 20.5000,
  k12: 16.9000,
  k13: 13.3000,
  k14: 9.7000,
  k15: 6.1000,
  k16: 2.5000,
  k17: 98.6000,
  k18: 95.0000,
  k19: 91.4000,
  k20: 87.8000,
  k21: 84.2000,
  k22: 80.6000,
  k23: 77.0000,
  k24: 73.4000,
  k25: 69.8000,
  k26: 66.2000,
  k27: 62.6000,
  k28: 59.0000,
  k29: 55.4000,
  k30: 51.8000,
  k31: 48.2000,
  k32: 44.6000,
  k33: 41.0000,
  k34: 37.4000,
  k35: 33.8000,
  k36: 30.2000,
  k37: 26.6000,
  k38: 23.0000,
  k39: 19.4000,
  k40: 15.8000,
  k41: 12.2000,
  k42: 8.6000,
  k43: 5.0000,
  k44: 1.4000,
  k45: 97.5000,
  k46: 93.9000,
  k47: 90.3000,
  k48: 86.7000,
  k49: 83.1000,
  k50: 79.5000,
  k51: 75.9000,
  k52: 72.3000,
  k53: 68.7000,
  k54: 65.1000,
  k55: 61.5000,
  k56: 57.9000,
  k57: 54.3000,
  k58: 50.7000,
  k59: 47.1000,
  k60: 43.5000,
  k61: 39.9000,
  k62: 36.3000,
  k63: 32.7000,
  k64: 29.1000,
  k65: 25.5000,
  k66: 21.9000,
  k67: 18.3000,
  k68: 14.7000,
  k69: 11.1000,
  k70: 7.5000,
  k71: 3.9000,
} as const;

export function V1032_TRES_FAILOVER_SCENARIO_134_evaluate(turn: number): {
  telecomStressExposureIndex: number;
  backboneBufferDelayTurns: number;
  telecomResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1032_TRES_FAILOVER_SCENARIO_134_COEF) as Array<
    keyof typeof V1032_TRES_FAILOVER_SCENARIO_134_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1032_TRES_FAILOVER_SCENARIO_134_COEF[keys[j]] * ((turn + j) % 17);
  }
  const telecomStressExposureIndex = V1032_TRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const backboneBufferDelayTurns = V1032_TRES_clamp(2 + (acc % 11), 1, 18);
  const telecomResilienceScore = V1032_TRES_clamp(90 - telecomStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1032_TRES_telecomResilienceBandFromScore(telecomResilienceScore) !== 'depleted';
  return { telecomStressExposureIndex, backboneBufferDelayTurns, telecomResilienceScore, stable };
}

export function V1032_TRES_FAILOVER_SCENARIO_134_snapshot(turn: number): V1032TresFailoverSnapshot {
  const r = V1032_TRES_FAILOVER_SCENARIO_134_evaluate(turn);
  return {
    scenarioId: V1032_TRES_FAILOVER_SCENARIO_134_META.id,
    regionId: V1032_TRES_FAILOVER_SCENARIO_134_META.regionId,
    telecomResilienceChannel: V1032_TRES_FAILOVER_SCENARIO_134_META.primaryChannel,
    telecomResilienceBand: V1032_TRES_FAILOVER_SCENARIO_134_META.telecomResilienceBand,
    telecomStressExposureIndex: r.telecomStressExposureIndex,
    backboneBufferDelayTurns: r.backboneBufferDelayTurns,
    telecomResilienceScore: r.telecomResilienceScore,
    telecomResilienceBand: V1032_TRES_telecomResilienceBandFromScore(r.telecomResilienceScore),
  };
}

export function V1032_TRES_FAILOVER_SCENARIO_134_regressionAssert(turn: number): boolean {
  const r = V1032_TRES_FAILOVER_SCENARIO_134_evaluate(turn);
  return typeof r.telecomStressExposureIndex === 'number' && r.telecomResilienceScore <= 100;
}
