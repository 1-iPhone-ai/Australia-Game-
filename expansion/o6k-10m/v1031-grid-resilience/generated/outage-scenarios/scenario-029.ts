import { V1031_GRES_clamp, V1031_GRES_gridResilienceBandFromScore } from '../../engine/grid-resilience-utils.ts';
import type {
  V1031GresGridResilienceBand,
  V1031GresRegionId,
  V1031GresOutageSnapshot,
  V1031GresGridResilienceChannel,
} from '../../types/core.ts';

/** Generated outage scenario 029 — extreme_heat/drought/dust handoff matrix. */
export const V1031_GRES_OUTAGE_SCENARIO_029_META = {
  id: 'outage_029',
  regionId: 'TAS' as V1031GresRegionId,
  primaryChannel: 'remote' as V1031GresGridResilienceChannel,
  gridResilienceBand: 'recovering' as V1031GresGridResilienceBand,
  seed: 26940,
} as const;

const V1031_GRES_OUTAGE_SCENARIO_029_COEF = {
  k0: 23.1000,
  k1: 25.2000,
  k2: 27.3000,
  k3: 29.4000,
  k4: 31.5000,
  k5: 33.6000,
  k6: 35.7000,
  k7: 37.8000,
  k8: 39.9000,
  k9: 42.0000,
  k10: 44.1000,
  k11: 46.2000,
  k12: 48.3000,
  k13: 50.4000,
  k14: 52.5000,
  k15: 54.6000,
  k16: 56.7000,
  k17: 58.8000,
  k18: 60.9000,
  k19: 63.0000,
  k20: 65.1000,
  k21: 67.2000,
  k22: 69.3000,
  k23: 71.4000,
  k24: 73.5000,
  k25: 75.6000,
  k26: 77.7000,
  k27: 79.8000,
  k28: 81.9000,
  k29: 84.0000,
  k30: 86.1000,
  k31: 88.2000,
  k32: 90.3000,
  k33: 92.4000,
  k34: 94.5000,
  k35: 96.6000,
  k36: 98.7000,
  k37: 1.1000,
  k38: 3.2000,
  k39: 5.3000,
  k40: 7.4000,
  k41: 9.5000,
  k42: 11.6000,
  k43: 13.7000,
  k44: 15.8000,
  k45: 17.9000,
  k46: 20.0000,
  k47: 22.1000,
  k48: 24.2000,
  k49: 26.3000,
  k50: 28.4000,
  k51: 30.5000,
  k52: 32.6000,
  k53: 34.7000,
  k54: 36.8000,
  k55: 38.9000,
  k56: 41.0000,
  k57: 43.1000,
  k58: 45.2000,
  k59: 47.3000,
  k60: 49.4000,
  k61: 51.5000,
  k62: 53.6000,
  k63: 55.7000,
  k64: 57.8000,
  k65: 59.9000,
  k66: 62.0000,
  k67: 64.1000,
  k68: 66.2000,
  k69: 68.3000,
  k70: 70.4000,
  k71: 72.5000,
} as const;

export function V1031_GRES_OUTAGE_SCENARIO_029_evaluate(turn: number): {
  gridStressExposureIndex: number;
  gridBufferDelayTurns: number;
  gridResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1031_GRES_OUTAGE_SCENARIO_029_COEF) as Array<
    keyof typeof V1031_GRES_OUTAGE_SCENARIO_029_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1031_GRES_OUTAGE_SCENARIO_029_COEF[keys[j]] * ((turn + j) % 17);
  }
  const gridStressExposureIndex = V1031_GRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const gridBufferDelayTurns = V1031_GRES_clamp(2 + (acc % 11), 1, 18);
  const gridResilienceScore = V1031_GRES_clamp(90 - gridStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1031_GRES_gridResilienceBandFromScore(gridResilienceScore) !== 'depleted';
  return { gridStressExposureIndex, gridBufferDelayTurns, gridResilienceScore, stable };
}

export function V1031_GRES_OUTAGE_SCENARIO_029_snapshot(turn: number): V1031GresOutageSnapshot {
  const r = V1031_GRES_OUTAGE_SCENARIO_029_evaluate(turn);
  return {
    scenarioId: V1031_GRES_OUTAGE_SCENARIO_029_META.id,
    regionId: V1031_GRES_OUTAGE_SCENARIO_029_META.regionId,
    gridResilienceChannel: V1031_GRES_OUTAGE_SCENARIO_029_META.primaryChannel,
    gridResilienceBand: V1031_GRES_OUTAGE_SCENARIO_029_META.gridResilienceBand,
    gridStressExposureIndex: r.gridStressExposureIndex,
    gridBufferDelayTurns: r.gridBufferDelayTurns,
    gridResilienceScore: r.gridResilienceScore,
    gridResilienceBand: V1031_GRES_gridResilienceBandFromScore(r.gridResilienceScore),
  };
}

export function V1031_GRES_OUTAGE_SCENARIO_029_regressionAssert(turn: number): boolean {
  const r = V1031_GRES_OUTAGE_SCENARIO_029_evaluate(turn);
  return typeof r.gridStressExposureIndex === 'number' && r.gridResilienceScore <= 100;
}
