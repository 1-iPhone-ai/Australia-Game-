import { V1031_GRES_clamp, V1031_GRES_gridResilienceBandFromScore } from '../../engine/grid-resilience-utils.ts';
import type {
  V1031GresGridResilienceBand,
  V1031GresRegionId,
  V1031GresOutageSnapshot,
  V1031GresGridResilienceChannel,
} from '../../types/core.ts';

/** Generated outage scenario 036 — extreme_heat/drought/dust handoff matrix. */
export const V1031_GRES_OUTAGE_SCENARIO_036_META = {
  id: 'outage_036',
  regionId: 'SA' as V1031GresRegionId,
  primaryChannel: 'aged_care' as V1031GresGridResilienceChannel,
  gridResilienceBand: 'moderate' as V1031GresGridResilienceBand,
  seed: 33317,
} as const;

const V1031_GRES_OUTAGE_SCENARIO_036_COEF = {
  k0: 58.8000,
  k1: 0.7000,
  k2: 42.3000,
  k3: 83.9000,
  k4: 25.8000,
  k5: 67.4000,
  k6: 9.3000,
  k7: 50.9000,
  k8: 92.5000,
  k9: 34.4000,
  k10: 76.0000,
  k11: 17.9000,
  k12: 59.5000,
  k13: 1.4000,
  k14: 43.0000,
  k15: 84.6000,
  k16: 26.5000,
  k17: 68.1000,
  k18: 10.0000,
  k19: 51.6000,
  k20: 93.2000,
  k21: 35.1000,
  k22: 76.7000,
  k23: 18.6000,
  k24: 60.2000,
  k25: 2.1000,
  k26: 43.7000,
  k27: 85.3000,
  k28: 27.2000,
  k29: 68.8000,
  k30: 10.7000,
  k31: 52.3000,
  k32: 93.9000,
  k33: 35.8000,
  k34: 77.4000,
  k35: 19.3000,
  k36: 60.9000,
  k37: 2.8000,
  k38: 44.4000,
  k39: 86.0000,
  k40: 27.9000,
  k41: 69.5000,
  k42: 11.4000,
  k43: 53.0000,
  k44: 94.6000,
  k45: 36.5000,
  k46: 78.1000,
  k47: 20.0000,
  k48: 61.6000,
  k49: 3.5000,
  k50: 45.1000,
  k51: 86.7000,
  k52: 28.6000,
  k53: 70.2000,
  k54: 12.1000,
  k55: 53.7000,
  k56: 95.3000,
  k57: 37.2000,
  k58: 78.8000,
  k59: 20.7000,
  k60: 62.3000,
  k61: 4.2000,
  k62: 45.8000,
  k63: 87.4000,
  k64: 29.3000,
  k65: 70.9000,
  k66: 12.8000,
  k67: 54.4000,
  k68: 96.0000,
  k69: 37.9000,
  k70: 79.5000,
  k71: 21.4000,
} as const;

export function V1031_GRES_OUTAGE_SCENARIO_036_evaluate(turn: number): {
  gridStressExposureIndex: number;
  gridBufferDelayTurns: number;
  gridResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1031_GRES_OUTAGE_SCENARIO_036_COEF) as Array<
    keyof typeof V1031_GRES_OUTAGE_SCENARIO_036_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1031_GRES_OUTAGE_SCENARIO_036_COEF[keys[j]] * ((turn + j) % 17);
  }
  const gridStressExposureIndex = V1031_GRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const gridBufferDelayTurns = V1031_GRES_clamp(2 + (acc % 11), 1, 18);
  const gridResilienceScore = V1031_GRES_clamp(90 - gridStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1031_GRES_gridResilienceBandFromScore(gridResilienceScore) !== 'depleted';
  return { gridStressExposureIndex, gridBufferDelayTurns, gridResilienceScore, stable };
}

export function V1031_GRES_OUTAGE_SCENARIO_036_snapshot(turn: number): V1031GresOutageSnapshot {
  const r = V1031_GRES_OUTAGE_SCENARIO_036_evaluate(turn);
  return {
    scenarioId: V1031_GRES_OUTAGE_SCENARIO_036_META.id,
    regionId: V1031_GRES_OUTAGE_SCENARIO_036_META.regionId,
    gridResilienceChannel: V1031_GRES_OUTAGE_SCENARIO_036_META.primaryChannel,
    gridResilienceBand: V1031_GRES_OUTAGE_SCENARIO_036_META.gridResilienceBand,
    gridStressExposureIndex: r.gridStressExposureIndex,
    gridBufferDelayTurns: r.gridBufferDelayTurns,
    gridResilienceScore: r.gridResilienceScore,
    gridResilienceBand: V1031_GRES_gridResilienceBandFromScore(r.gridResilienceScore),
  };
}

export function V1031_GRES_OUTAGE_SCENARIO_036_regressionAssert(turn: number): boolean {
  const r = V1031_GRES_OUTAGE_SCENARIO_036_evaluate(turn);
  return typeof r.gridStressExposureIndex === 'number' && r.gridResilienceScore <= 100;
}
