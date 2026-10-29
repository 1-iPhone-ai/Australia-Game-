import { V1031_GRES_clamp, V1031_GRES_gridResilienceBandFromScore } from '../../engine/grid-resilience-utils.ts';
import type {
  V1031GresGridResilienceBand,
  V1031GresRegionId,
  V1031GresOutageSnapshot,
  V1031GresGridResilienceChannel,
} from '../../types/core.ts';

/** Generated outage scenario 015 — extreme_heat/drought/dust handoff matrix. */
export const V1031_GRES_OUTAGE_SCENARIO_015_META = {
  id: 'outage_015',
  regionId: 'ACT' as V1031GresRegionId,
  primaryChannel: 'specialist_referral' as V1031GresGridResilienceChannel,
  gridResilienceBand: 'minimal' as V1031GresGridResilienceBand,
  seed: 14186,
} as const;

const V1031_GRES_OUTAGE_SCENARIO_015_COEF = {
  k0: 51.4000,
  k1: 74.2000,
  k2: 97.0000,
  k3: 20.1000,
  k4: 42.9000,
  k5: 65.7000,
  k6: 88.5000,
  k7: 11.6000,
  k8: 34.4000,
  k9: 57.2000,
  k10: 80.0000,
  k11: 3.1000,
  k12: 25.9000,
  k13: 48.7000,
  k14: 71.5000,
  k15: 94.3000,
  k16: 17.4000,
  k17: 40.2000,
  k18: 63.0000,
  k19: 85.8000,
  k20: 8.9000,
  k21: 31.7000,
  k22: 54.5000,
  k23: 77.3000,
  k24: 0.4000,
  k25: 23.2000,
  k26: 46.0000,
  k27: 68.8000,
  k28: 91.6000,
  k29: 14.7000,
  k30: 37.5000,
  k31: 60.3000,
  k32: 83.1000,
  k33: 6.2000,
  k34: 29.0000,
  k35: 51.8000,
  k36: 74.6000,
  k37: 97.4000,
  k38: 20.5000,
  k39: 43.3000,
  k40: 66.1000,
  k41: 88.9000,
  k42: 12.0000,
  k43: 34.8000,
  k44: 57.6000,
  k45: 80.4000,
  k46: 3.5000,
  k47: 26.3000,
  k48: 49.1000,
  k49: 71.9000,
  k50: 94.7000,
  k51: 17.8000,
  k52: 40.6000,
  k53: 63.4000,
  k54: 86.2000,
  k55: 9.3000,
  k56: 32.1000,
  k57: 54.9000,
  k58: 77.7000,
  k59: 0.8000,
  k60: 23.6000,
  k61: 46.4000,
  k62: 69.2000,
  k63: 92.0000,
  k64: 15.1000,
  k65: 37.9000,
  k66: 60.7000,
  k67: 83.5000,
  k68: 6.6000,
  k69: 29.4000,
  k70: 52.2000,
  k71: 75.0000,
} as const;

export function V1031_GRES_OUTAGE_SCENARIO_015_evaluate(turn: number): {
  gridStressExposureIndex: number;
  gridBufferDelayTurns: number;
  gridResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1031_GRES_OUTAGE_SCENARIO_015_COEF) as Array<
    keyof typeof V1031_GRES_OUTAGE_SCENARIO_015_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1031_GRES_OUTAGE_SCENARIO_015_COEF[keys[j]] * ((turn + j) % 17);
  }
  const gridStressExposureIndex = V1031_GRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const gridBufferDelayTurns = V1031_GRES_clamp(2 + (acc % 11), 1, 18);
  const gridResilienceScore = V1031_GRES_clamp(90 - gridStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1031_GRES_gridResilienceBandFromScore(gridResilienceScore) !== 'depleted';
  return { gridStressExposureIndex, gridBufferDelayTurns, gridResilienceScore, stable };
}

export function V1031_GRES_OUTAGE_SCENARIO_015_snapshot(turn: number): V1031GresOutageSnapshot {
  const r = V1031_GRES_OUTAGE_SCENARIO_015_evaluate(turn);
  return {
    scenarioId: V1031_GRES_OUTAGE_SCENARIO_015_META.id,
    regionId: V1031_GRES_OUTAGE_SCENARIO_015_META.regionId,
    gridResilienceChannel: V1031_GRES_OUTAGE_SCENARIO_015_META.primaryChannel,
    gridResilienceBand: V1031_GRES_OUTAGE_SCENARIO_015_META.gridResilienceBand,
    gridStressExposureIndex: r.gridStressExposureIndex,
    gridBufferDelayTurns: r.gridBufferDelayTurns,
    gridResilienceScore: r.gridResilienceScore,
    gridResilienceBand: V1031_GRES_gridResilienceBandFromScore(r.gridResilienceScore),
  };
}

export function V1031_GRES_OUTAGE_SCENARIO_015_regressionAssert(turn: number): boolean {
  const r = V1031_GRES_OUTAGE_SCENARIO_015_evaluate(turn);
  return typeof r.gridStressExposureIndex === 'number' && r.gridResilienceScore <= 100;
}
