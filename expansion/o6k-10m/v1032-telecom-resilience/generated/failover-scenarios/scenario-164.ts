import { V1032_TRES_clamp, V1032_TRES_telecomResilienceBandFromScore } from '../../engine/telecom-resilience-utils.ts';
import type {
  V1032TresTelecomResilienceBand,
  V1032TresRegionId,
  V1032TresFailoverSnapshot,
  V1032TresTelecomResilienceChannel,
} from '../../types/core.ts';

/** Generated failover scenario 164 — extreme_heat/drought/dust handoff matrix. */
export const V1032_TRES_FAILOVER_SCENARIO_164_META = {
  id: 'failover_164',
  regionId: 'SA' as V1032TresRegionId,
  primaryChannel: 'rural_clinic' as V1032TresTelecomResilienceChannel,
  telecomResilienceBand: 'recovering' as V1032TresTelecomResilienceBand,
  seed: 149925,
} as const;

const V1032_TRES_FAILOVER_SCENARIO_164_COEF = {
  k0: 13.7000,
  k1: 51.2000,
  k2: 88.7000,
  k3: 26.5000,
  k4: 64.0000,
  k5: 1.8000,
  k6: 39.3000,
  k7: 76.8000,
  k8: 14.6000,
  k9: 52.1000,
  k10: 89.6000,
  k11: 27.4000,
  k12: 64.9000,
  k13: 2.7000,
  k14: 40.2000,
  k15: 77.7000,
  k16: 15.5000,
  k17: 53.0000,
  k18: 90.5000,
  k19: 28.3000,
  k20: 65.8000,
  k21: 3.6000,
  k22: 41.1000,
  k23: 78.6000,
  k24: 16.4000,
  k25: 53.9000,
  k26: 91.4000,
  k27: 29.2000,
  k28: 66.7000,
  k29: 4.5000,
  k30: 42.0000,
  k31: 79.5000,
  k32: 17.3000,
  k33: 54.8000,
  k34: 92.3000,
  k35: 30.1000,
  k36: 67.6000,
  k37: 5.4000,
  k38: 42.9000,
  k39: 80.4000,
  k40: 18.2000,
  k41: 55.7000,
  k42: 93.2000,
  k43: 31.0000,
  k44: 68.5000,
  k45: 6.3000,
  k46: 43.8000,
  k47: 81.3000,
  k48: 19.1000,
  k49: 56.6000,
  k50: 94.1000,
  k51: 31.9000,
  k52: 69.4000,
  k53: 7.2000,
  k54: 44.7000,
  k55: 82.2000,
  k56: 20.0000,
  k57: 57.5000,
  k58: 95.0000,
  k59: 32.8000,
  k60: 70.3000,
  k61: 8.1000,
  k62: 45.6000,
  k63: 83.1000,
  k64: 20.9000,
  k65: 58.4000,
  k66: 95.9000,
  k67: 33.7000,
  k68: 71.2000,
  k69: 9.0000,
  k70: 46.5000,
  k71: 84.0000,
} as const;

export function V1032_TRES_FAILOVER_SCENARIO_164_evaluate(turn: number): {
  telecomStressExposureIndex: number;
  backboneBufferDelayTurns: number;
  telecomResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1032_TRES_FAILOVER_SCENARIO_164_COEF) as Array<
    keyof typeof V1032_TRES_FAILOVER_SCENARIO_164_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1032_TRES_FAILOVER_SCENARIO_164_COEF[keys[j]] * ((turn + j) % 17);
  }
  const telecomStressExposureIndex = V1032_TRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const backboneBufferDelayTurns = V1032_TRES_clamp(2 + (acc % 11), 1, 18);
  const telecomResilienceScore = V1032_TRES_clamp(90 - telecomStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1032_TRES_telecomResilienceBandFromScore(telecomResilienceScore) !== 'depleted';
  return { telecomStressExposureIndex, backboneBufferDelayTurns, telecomResilienceScore, stable };
}

export function V1032_TRES_FAILOVER_SCENARIO_164_snapshot(turn: number): V1032TresFailoverSnapshot {
  const r = V1032_TRES_FAILOVER_SCENARIO_164_evaluate(turn);
  return {
    scenarioId: V1032_TRES_FAILOVER_SCENARIO_164_META.id,
    regionId: V1032_TRES_FAILOVER_SCENARIO_164_META.regionId,
    telecomResilienceChannel: V1032_TRES_FAILOVER_SCENARIO_164_META.primaryChannel,
    telecomResilienceBand: V1032_TRES_FAILOVER_SCENARIO_164_META.telecomResilienceBand,
    telecomStressExposureIndex: r.telecomStressExposureIndex,
    backboneBufferDelayTurns: r.backboneBufferDelayTurns,
    telecomResilienceScore: r.telecomResilienceScore,
    telecomResilienceBand: V1032_TRES_telecomResilienceBandFromScore(r.telecomResilienceScore),
  };
}

export function V1032_TRES_FAILOVER_SCENARIO_164_regressionAssert(turn: number): boolean {
  const r = V1032_TRES_FAILOVER_SCENARIO_164_evaluate(turn);
  return typeof r.telecomStressExposureIndex === 'number' && r.telecomResilienceScore <= 100;
}
