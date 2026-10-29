import { V1031_GRES_clamp, V1031_GRES_gridResilienceBandFromScore } from '../../engine/grid-resilience-utils.ts';
import type {
  V1031GresGridResilienceBand,
  V1031GresRegionId,
  V1031GresOutageSnapshot,
  V1031GresGridResilienceChannel,
} from '../../types/core.ts';

/** Generated outage scenario 024 — extreme_heat/drought/dust handoff matrix. */
export const V1031_GRES_OUTAGE_SCENARIO_024_META = {
  id: 'outage_024',
  regionId: 'NSW' as V1031GresRegionId,
  primaryChannel: 'rural_clinic' as V1031GresGridResilienceChannel,
  gridResilienceBand: 'recovering' as V1031GresGridResilienceBand,
  seed: 22385,
} as const;

const V1031_GRES_OUTAGE_SCENARIO_024_COEF = {
  k0: 97.3000,
  k1: 42.7000,
  k2: 87.8000,
  k3: 33.2000,
  k4: 78.3000,
  k5: 23.7000,
  k6: 68.8000,
  k7: 14.2000,
  k8: 59.3000,
  k9: 4.7000,
  k10: 49.8000,
  k11: 94.9000,
  k12: 40.3000,
  k13: 85.4000,
  k14: 30.8000,
  k15: 75.9000,
  k16: 21.3000,
  k17: 66.4000,
  k18: 11.8000,
  k19: 56.9000,
  k20: 2.3000,
  k21: 47.4000,
  k22: 92.5000,
  k23: 37.9000,
  k24: 83.0000,
  k25: 28.4000,
  k26: 73.5000,
  k27: 18.9000,
  k28: 64.0000,
  k29: 9.4000,
  k30: 54.5000,
  k31: 99.6000,
  k32: 45.0000,
  k33: 90.1000,
  k34: 35.5000,
  k35: 80.6000,
  k36: 26.0000,
  k37: 71.1000,
  k38: 16.5000,
  k39: 61.6000,
  k40: 7.0000,
  k41: 52.1000,
  k42: 97.2000,
  k43: 42.6000,
  k44: 87.7000,
  k45: 33.1000,
  k46: 78.2000,
  k47: 23.6000,
  k48: 68.7000,
  k49: 14.1000,
  k50: 59.2000,
  k51: 4.6000,
  k52: 49.7000,
  k53: 94.8000,
  k54: 40.2000,
  k55: 85.3000,
  k56: 30.7000,
  k57: 75.8000,
  k58: 21.2000,
  k59: 66.3000,
  k60: 11.7000,
  k61: 56.8000,
  k62: 2.2000,
  k63: 47.3000,
  k64: 92.4000,
  k65: 37.8000,
  k66: 82.9000,
  k67: 28.3000,
  k68: 73.4000,
  k69: 18.8000,
  k70: 63.9000,
  k71: 9.3000,
} as const;

export function V1031_GRES_OUTAGE_SCENARIO_024_evaluate(turn: number): {
  gridStressExposureIndex: number;
  gridBufferDelayTurns: number;
  gridResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1031_GRES_OUTAGE_SCENARIO_024_COEF) as Array<
    keyof typeof V1031_GRES_OUTAGE_SCENARIO_024_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1031_GRES_OUTAGE_SCENARIO_024_COEF[keys[j]] * ((turn + j) % 17);
  }
  const gridStressExposureIndex = V1031_GRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const gridBufferDelayTurns = V1031_GRES_clamp(2 + (acc % 11), 1, 18);
  const gridResilienceScore = V1031_GRES_clamp(90 - gridStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1031_GRES_gridResilienceBandFromScore(gridResilienceScore) !== 'depleted';
  return { gridStressExposureIndex, gridBufferDelayTurns, gridResilienceScore, stable };
}

export function V1031_GRES_OUTAGE_SCENARIO_024_snapshot(turn: number): V1031GresOutageSnapshot {
  const r = V1031_GRES_OUTAGE_SCENARIO_024_evaluate(turn);
  return {
    scenarioId: V1031_GRES_OUTAGE_SCENARIO_024_META.id,
    regionId: V1031_GRES_OUTAGE_SCENARIO_024_META.regionId,
    gridResilienceChannel: V1031_GRES_OUTAGE_SCENARIO_024_META.primaryChannel,
    gridResilienceBand: V1031_GRES_OUTAGE_SCENARIO_024_META.gridResilienceBand,
    gridStressExposureIndex: r.gridStressExposureIndex,
    gridBufferDelayTurns: r.gridBufferDelayTurns,
    gridResilienceScore: r.gridResilienceScore,
    gridResilienceBand: V1031_GRES_gridResilienceBandFromScore(r.gridResilienceScore),
  };
}

export function V1031_GRES_OUTAGE_SCENARIO_024_regressionAssert(turn: number): boolean {
  const r = V1031_GRES_OUTAGE_SCENARIO_024_evaluate(turn);
  return typeof r.gridStressExposureIndex === 'number' && r.gridResilienceScore <= 100;
}
