import { V1032_TRES_clamp, V1032_TRES_telecomResilienceBandFromScore } from '../../engine/telecom-resilience-utils.ts';
import type {
  V1032TresTelecomResilienceBand,
  V1032TresRegionId,
  V1032TresFailoverSnapshot,
  V1032TresTelecomResilienceChannel,
} from '../../types/core.ts';

/** Generated failover scenario 093 — extreme_heat/drought/dust handoff matrix. */
export const V1032_TRES_FAILOVER_SCENARIO_093_META = {
  id: 'failover_093',
  regionId: 'TAS' as V1032TresRegionId,
  primaryChannel: 'telehealth' as V1032TresTelecomResilienceChannel,
  telecomResilienceBand: 'critical' as V1032TresTelecomResilienceBand,
  seed: 85244,
} as const;

const V1032_TRES_FAILOVER_SCENARIO_093_COEF = {
  k0: 50.4000,
  k1: 0.6000,
  k2: 50.5000,
  k3: 0.7000,
  k4: 50.6000,
  k5: 0.8000,
  k6: 50.7000,
  k7: 0.9000,
  k8: 50.8000,
  k9: 1.0000,
  k10: 50.9000,
  k11: 1.1000,
  k12: 51.0000,
  k13: 1.2000,
  k14: 51.1000,
  k15: 1.3000,
  k16: 51.2000,
  k17: 1.4000,
  k18: 51.3000,
  k19: 1.5000,
  k20: 51.4000,
  k21: 1.6000,
  k22: 51.5000,
  k23: 1.7000,
  k24: 51.6000,
  k25: 1.8000,
  k26: 51.7000,
  k27: 1.9000,
  k28: 51.8000,
  k29: 2.0000,
  k30: 51.9000,
  k31: 2.1000,
  k32: 52.0000,
  k33: 2.2000,
  k34: 52.1000,
  k35: 2.3000,
  k36: 52.2000,
  k37: 2.4000,
  k38: 52.3000,
  k39: 2.5000,
  k40: 52.4000,
  k41: 2.6000,
  k42: 52.5000,
  k43: 2.7000,
  k44: 52.6000,
  k45: 2.8000,
  k46: 52.7000,
  k47: 2.9000,
  k48: 52.8000,
  k49: 3.0000,
  k50: 52.9000,
  k51: 3.1000,
  k52: 53.0000,
  k53: 3.2000,
  k54: 53.1000,
  k55: 3.3000,
  k56: 53.2000,
  k57: 3.4000,
  k58: 53.3000,
  k59: 3.5000,
  k60: 53.4000,
  k61: 3.6000,
  k62: 53.5000,
  k63: 3.7000,
  k64: 53.6000,
  k65: 3.8000,
  k66: 53.7000,
  k67: 3.9000,
  k68: 53.8000,
  k69: 4.0000,
  k70: 53.9000,
  k71: 4.1000,
} as const;

export function V1032_TRES_FAILOVER_SCENARIO_093_evaluate(turn: number): {
  telecomStressExposureIndex: number;
  backboneBufferDelayTurns: number;
  telecomResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1032_TRES_FAILOVER_SCENARIO_093_COEF) as Array<
    keyof typeof V1032_TRES_FAILOVER_SCENARIO_093_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1032_TRES_FAILOVER_SCENARIO_093_COEF[keys[j]] * ((turn + j) % 17);
  }
  const telecomStressExposureIndex = V1032_TRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const backboneBufferDelayTurns = V1032_TRES_clamp(2 + (acc % 11), 1, 18);
  const telecomResilienceScore = V1032_TRES_clamp(90 - telecomStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1032_TRES_telecomResilienceBandFromScore(telecomResilienceScore) !== 'depleted';
  return { telecomStressExposureIndex, backboneBufferDelayTurns, telecomResilienceScore, stable };
}

export function V1032_TRES_FAILOVER_SCENARIO_093_snapshot(turn: number): V1032TresFailoverSnapshot {
  const r = V1032_TRES_FAILOVER_SCENARIO_093_evaluate(turn);
  return {
    scenarioId: V1032_TRES_FAILOVER_SCENARIO_093_META.id,
    regionId: V1032_TRES_FAILOVER_SCENARIO_093_META.regionId,
    telecomResilienceChannel: V1032_TRES_FAILOVER_SCENARIO_093_META.primaryChannel,
    telecomResilienceBand: V1032_TRES_FAILOVER_SCENARIO_093_META.telecomResilienceBand,
    telecomStressExposureIndex: r.telecomStressExposureIndex,
    backboneBufferDelayTurns: r.backboneBufferDelayTurns,
    telecomResilienceScore: r.telecomResilienceScore,
    telecomResilienceBand: V1032_TRES_telecomResilienceBandFromScore(r.telecomResilienceScore),
  };
}

export function V1032_TRES_FAILOVER_SCENARIO_093_regressionAssert(turn: number): boolean {
  const r = V1032_TRES_FAILOVER_SCENARIO_093_evaluate(turn);
  return typeof r.telecomStressExposureIndex === 'number' && r.telecomResilienceScore <= 100;
}
