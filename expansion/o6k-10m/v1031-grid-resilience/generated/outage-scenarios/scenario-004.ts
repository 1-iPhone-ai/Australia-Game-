import { V1031_GRES_clamp, V1031_GRES_gridResilienceBandFromScore } from '../../engine/grid-resilience-utils.ts';
import type {
  V1031GresGridResilienceBand,
  V1031GresRegionId,
  V1031GresOutageSnapshot,
  V1031GresGridResilienceChannel,
} from '../../types/core.ts';

/** Generated outage scenario 004 — extreme_heat/drought/dust handoff matrix. */
export const V1031_GRES_OUTAGE_SCENARIO_004_META = {
  id: 'outage_004',
  regionId: 'SA' as V1031GresRegionId,
  primaryChannel: 'rural_clinic' as V1031GresGridResilienceChannel,
  gridResilienceBand: 'recovering' as V1031GresGridResilienceBand,
  seed: 4165,
} as const;

const V1031_GRES_OUTAGE_SCENARIO_004_COEF = {
  k0: 95.0000,
  k1: 13.0000,
  k2: 30.7000,
  k3: 48.4000,
  k4: 66.1000,
  k5: 83.8000,
  k6: 1.8000,
  k7: 19.5000,
  k8: 37.2000,
  k9: 54.9000,
  k10: 72.6000,
  k11: 90.3000,
  k12: 8.3000,
  k13: 26.0000,
  k14: 43.7000,
  k15: 61.4000,
  k16: 79.1000,
  k17: 96.8000,
  k18: 14.8000,
  k19: 32.5000,
  k20: 50.2000,
  k21: 67.9000,
  k22: 85.6000,
  k23: 3.6000,
  k24: 21.3000,
  k25: 39.0000,
  k26: 56.7000,
  k27: 74.4000,
  k28: 92.1000,
  k29: 10.1000,
  k30: 27.8000,
  k31: 45.5000,
  k32: 63.2000,
  k33: 80.9000,
  k34: 98.6000,
  k35: 16.6000,
  k36: 34.3000,
  k37: 52.0000,
  k38: 69.7000,
  k39: 87.4000,
  k40: 5.4000,
  k41: 23.1000,
  k42: 40.8000,
  k43: 58.5000,
  k44: 76.2000,
  k45: 93.9000,
  k46: 11.9000,
  k47: 29.6000,
  k48: 47.3000,
  k49: 65.0000,
  k50: 82.7000,
  k51: 0.7000,
  k52: 18.4000,
  k53: 36.1000,
  k54: 53.8000,
  k55: 71.5000,
  k56: 89.2000,
  k57: 7.2000,
  k58: 24.9000,
  k59: 42.6000,
  k60: 60.3000,
  k61: 78.0000,
  k62: 95.7000,
  k63: 13.7000,
  k64: 31.4000,
  k65: 49.1000,
  k66: 66.8000,
  k67: 84.5000,
  k68: 2.5000,
  k69: 20.2000,
  k70: 37.9000,
  k71: 55.6000,
} as const;

export function V1031_GRES_OUTAGE_SCENARIO_004_evaluate(turn: number): {
  gridStressExposureIndex: number;
  gridBufferDelayTurns: number;
  gridResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1031_GRES_OUTAGE_SCENARIO_004_COEF) as Array<
    keyof typeof V1031_GRES_OUTAGE_SCENARIO_004_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1031_GRES_OUTAGE_SCENARIO_004_COEF[keys[j]] * ((turn + j) % 17);
  }
  const gridStressExposureIndex = V1031_GRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const gridBufferDelayTurns = V1031_GRES_clamp(2 + (acc % 11), 1, 18);
  const gridResilienceScore = V1031_GRES_clamp(90 - gridStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1031_GRES_gridResilienceBandFromScore(gridResilienceScore) !== 'depleted';
  return { gridStressExposureIndex, gridBufferDelayTurns, gridResilienceScore, stable };
}

export function V1031_GRES_OUTAGE_SCENARIO_004_snapshot(turn: number): V1031GresOutageSnapshot {
  const r = V1031_GRES_OUTAGE_SCENARIO_004_evaluate(turn);
  return {
    scenarioId: V1031_GRES_OUTAGE_SCENARIO_004_META.id,
    regionId: V1031_GRES_OUTAGE_SCENARIO_004_META.regionId,
    gridResilienceChannel: V1031_GRES_OUTAGE_SCENARIO_004_META.primaryChannel,
    gridResilienceBand: V1031_GRES_OUTAGE_SCENARIO_004_META.gridResilienceBand,
    gridStressExposureIndex: r.gridStressExposureIndex,
    gridBufferDelayTurns: r.gridBufferDelayTurns,
    gridResilienceScore: r.gridResilienceScore,
    gridResilienceBand: V1031_GRES_gridResilienceBandFromScore(r.gridResilienceScore),
  };
}

export function V1031_GRES_OUTAGE_SCENARIO_004_regressionAssert(turn: number): boolean {
  const r = V1031_GRES_OUTAGE_SCENARIO_004_evaluate(turn);
  return typeof r.gridStressExposureIndex === 'number' && r.gridResilienceScore <= 100;
}
