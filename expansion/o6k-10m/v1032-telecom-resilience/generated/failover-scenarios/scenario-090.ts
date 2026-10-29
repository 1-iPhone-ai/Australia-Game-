import { V1032_TRES_clamp, V1032_TRES_telecomResilienceBandFromScore } from '../../engine/telecom-resilience-utils.ts';
import type {
  V1032TresTelecomResilienceBand,
  V1032TresRegionId,
  V1032TresFailoverSnapshot,
  V1032TresTelecomResilienceChannel,
} from '../../types/core.ts';

/** Generated failover scenario 090 — extreme_heat/drought/dust handoff matrix. */
export const V1032_TRES_FAILOVER_SCENARIO_090_META = {
  id: 'failover_090',
  regionId: 'QLD' as V1032TresRegionId,
  primaryChannel: 'emergency_care' as V1032TresTelecomResilienceChannel,
  telecomResilienceBand: 'minimal' as V1032TresTelecomResilienceBand,
  seed: 82511,
} as const;

const V1032_TRES_FAILOVER_SCENARIO_090_COEF = {
  k0: 35.1000,
  k1: 11.1000,
  k2: 86.8000,
  k3: 62.8000,
  k4: 38.8000,
  k5: 14.8000,
  k6: 90.5000,
  k7: 66.5000,
  k8: 42.5000,
  k9: 18.5000,
  k10: 94.2000,
  k11: 70.2000,
  k12: 46.2000,
  k13: 22.2000,
  k14: 97.9000,
  k15: 73.9000,
  k16: 49.9000,
  k17: 25.9000,
  k18: 1.9000,
  k19: 77.6000,
  k20: 53.6000,
  k21: 29.6000,
  k22: 5.6000,
  k23: 81.3000,
  k24: 57.3000,
  k25: 33.3000,
  k26: 9.3000,
  k27: 85.0000,
  k28: 61.0000,
  k29: 37.0000,
  k30: 13.0000,
  k31: 88.7000,
  k32: 64.7000,
  k33: 40.7000,
  k34: 16.7000,
  k35: 92.4000,
  k36: 68.4000,
  k37: 44.4000,
  k38: 20.4000,
  k39: 96.1000,
  k40: 72.1000,
  k41: 48.1000,
  k42: 24.1000,
  k43: 0.1000,
  k44: 75.8000,
  k45: 51.8000,
  k46: 27.8000,
  k47: 3.8000,
  k48: 79.5000,
  k49: 55.5000,
  k50: 31.5000,
  k51: 7.5000,
  k52: 83.2000,
  k53: 59.2000,
  k54: 35.2000,
  k55: 11.2000,
  k56: 86.9000,
  k57: 62.9000,
  k58: 38.9000,
  k59: 14.9000,
  k60: 90.6000,
  k61: 66.6000,
  k62: 42.6000,
  k63: 18.6000,
  k64: 94.3000,
  k65: 70.3000,
  k66: 46.3000,
  k67: 22.3000,
  k68: 98.0000,
  k69: 74.0000,
  k70: 50.0000,
  k71: 26.0000,
} as const;

export function V1032_TRES_FAILOVER_SCENARIO_090_evaluate(turn: number): {
  telecomStressExposureIndex: number;
  backboneBufferDelayTurns: number;
  telecomResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1032_TRES_FAILOVER_SCENARIO_090_COEF) as Array<
    keyof typeof V1032_TRES_FAILOVER_SCENARIO_090_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1032_TRES_FAILOVER_SCENARIO_090_COEF[keys[j]] * ((turn + j) % 17);
  }
  const telecomStressExposureIndex = V1032_TRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const backboneBufferDelayTurns = V1032_TRES_clamp(2 + (acc % 11), 1, 18);
  const telecomResilienceScore = V1032_TRES_clamp(90 - telecomStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1032_TRES_telecomResilienceBandFromScore(telecomResilienceScore) !== 'depleted';
  return { telecomStressExposureIndex, backboneBufferDelayTurns, telecomResilienceScore, stable };
}

export function V1032_TRES_FAILOVER_SCENARIO_090_snapshot(turn: number): V1032TresFailoverSnapshot {
  const r = V1032_TRES_FAILOVER_SCENARIO_090_evaluate(turn);
  return {
    scenarioId: V1032_TRES_FAILOVER_SCENARIO_090_META.id,
    regionId: V1032_TRES_FAILOVER_SCENARIO_090_META.regionId,
    telecomResilienceChannel: V1032_TRES_FAILOVER_SCENARIO_090_META.primaryChannel,
    telecomResilienceBand: V1032_TRES_FAILOVER_SCENARIO_090_META.telecomResilienceBand,
    telecomStressExposureIndex: r.telecomStressExposureIndex,
    backboneBufferDelayTurns: r.backboneBufferDelayTurns,
    telecomResilienceScore: r.telecomResilienceScore,
    telecomResilienceBand: V1032_TRES_telecomResilienceBandFromScore(r.telecomResilienceScore),
  };
}

export function V1032_TRES_FAILOVER_SCENARIO_090_regressionAssert(turn: number): boolean {
  const r = V1032_TRES_FAILOVER_SCENARIO_090_evaluate(turn);
  return typeof r.telecomStressExposureIndex === 'number' && r.telecomResilienceScore <= 100;
}
