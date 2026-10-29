import { V1031_GRES_clamp, V1031_GRES_gridResilienceBandFromScore } from '../../engine/grid-resilience-utils.ts';
import type {
  V1031GresGridResilienceBand,
  V1031GresRegionId,
  V1031GresOutageSnapshot,
  V1031GresGridResilienceChannel,
} from '../../types/core.ts';

/** Generated outage scenario 028 — extreme_heat/drought/dust handoff matrix. */
export const V1031_GRES_OUTAGE_SCENARIO_028_META = {
  id: 'outage_028',
  regionId: 'SA' as V1031GresRegionId,
  primaryChannel: 'regional' as V1031GresGridResilienceChannel,
  gridResilienceBand: 'critical' as V1031GresGridResilienceBand,
  seed: 26029,
} as const;

const V1031_GRES_OUTAGE_SCENARIO_028_COEF = {
  k0: 18.0000,
  k1: 28.7000,
  k2: 39.4000,
  k3: 50.1000,
  k4: 60.8000,
  k5: 71.5000,
  k6: 82.2000,
  k7: 92.9000,
  k8: 3.9000,
  k9: 14.6000,
  k10: 25.3000,
  k11: 36.0000,
  k12: 46.7000,
  k13: 57.4000,
  k14: 68.1000,
  k15: 78.8000,
  k16: 89.5000,
  k17: 0.5000,
  k18: 11.2000,
  k19: 21.9000,
  k20: 32.6000,
  k21: 43.3000,
  k22: 54.0000,
  k23: 64.7000,
  k24: 75.4000,
  k25: 86.1000,
  k26: 96.8000,
  k27: 7.8000,
  k28: 18.5000,
  k29: 29.2000,
  k30: 39.9000,
  k31: 50.6000,
  k32: 61.3000,
  k33: 72.0000,
  k34: 82.7000,
  k35: 93.4000,
  k36: 4.4000,
  k37: 15.1000,
  k38: 25.8000,
  k39: 36.5000,
  k40: 47.2000,
  k41: 57.9000,
  k42: 68.6000,
  k43: 79.3000,
  k44: 90.0000,
  k45: 1.0000,
  k46: 11.7000,
  k47: 22.4000,
  k48: 33.1000,
  k49: 43.8000,
  k50: 54.5000,
  k51: 65.2000,
  k52: 75.9000,
  k53: 86.6000,
  k54: 97.3000,
  k55: 8.3000,
  k56: 19.0000,
  k57: 29.7000,
  k58: 40.4000,
  k59: 51.1000,
  k60: 61.8000,
  k61: 72.5000,
  k62: 83.2000,
  k63: 93.9000,
  k64: 4.9000,
  k65: 15.6000,
  k66: 26.3000,
  k67: 37.0000,
  k68: 47.7000,
  k69: 58.4000,
  k70: 69.1000,
  k71: 79.8000,
} as const;

export function V1031_GRES_OUTAGE_SCENARIO_028_evaluate(turn: number): {
  gridStressExposureIndex: number;
  gridBufferDelayTurns: number;
  gridResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1031_GRES_OUTAGE_SCENARIO_028_COEF) as Array<
    keyof typeof V1031_GRES_OUTAGE_SCENARIO_028_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1031_GRES_OUTAGE_SCENARIO_028_COEF[keys[j]] * ((turn + j) % 17);
  }
  const gridStressExposureIndex = V1031_GRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const gridBufferDelayTurns = V1031_GRES_clamp(2 + (acc % 11), 1, 18);
  const gridResilienceScore = V1031_GRES_clamp(90 - gridStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1031_GRES_gridResilienceBandFromScore(gridResilienceScore) !== 'depleted';
  return { gridStressExposureIndex, gridBufferDelayTurns, gridResilienceScore, stable };
}

export function V1031_GRES_OUTAGE_SCENARIO_028_snapshot(turn: number): V1031GresOutageSnapshot {
  const r = V1031_GRES_OUTAGE_SCENARIO_028_evaluate(turn);
  return {
    scenarioId: V1031_GRES_OUTAGE_SCENARIO_028_META.id,
    regionId: V1031_GRES_OUTAGE_SCENARIO_028_META.regionId,
    gridResilienceChannel: V1031_GRES_OUTAGE_SCENARIO_028_META.primaryChannel,
    gridResilienceBand: V1031_GRES_OUTAGE_SCENARIO_028_META.gridResilienceBand,
    gridStressExposureIndex: r.gridStressExposureIndex,
    gridBufferDelayTurns: r.gridBufferDelayTurns,
    gridResilienceScore: r.gridResilienceScore,
    gridResilienceBand: V1031_GRES_gridResilienceBandFromScore(r.gridResilienceScore),
  };
}

export function V1031_GRES_OUTAGE_SCENARIO_028_regressionAssert(turn: number): boolean {
  const r = V1031_GRES_OUTAGE_SCENARIO_028_evaluate(turn);
  return typeof r.gridStressExposureIndex === 'number' && r.gridResilienceScore <= 100;
}
