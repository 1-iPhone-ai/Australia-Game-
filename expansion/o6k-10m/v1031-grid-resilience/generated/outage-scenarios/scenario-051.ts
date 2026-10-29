import { V1031_GRES_clamp, V1031_GRES_gridResilienceBandFromScore } from '../../engine/grid-resilience-utils.ts';
import type {
  V1031GresGridResilienceBand,
  V1031GresRegionId,
  V1031GresOutageSnapshot,
  V1031GresGridResilienceChannel,
} from '../../types/core.ts';

/** Generated outage scenario 051 — extreme_heat/drought/dust handoff matrix. */
export const V1031_GRES_OUTAGE_SCENARIO_051_META = {
  id: 'outage_051',
  regionId: 'WA' as V1031GresRegionId,
  primaryChannel: 'primary_access' as V1031GresGridResilienceChannel,
  gridResilienceBand: 'moderate' as V1031GresGridResilienceBand,
  seed: 46982,
} as const;

const V1031_GRES_OUTAGE_SCENARIO_051_COEF = {
  k0: 35.6000,
  k1: 47.9000,
  k2: 60.2000,
  k3: 72.5000,
  k4: 84.8000,
  k5: 97.1000,
  k6: 9.7000,
  k7: 22.0000,
  k8: 34.3000,
  k9: 46.6000,
  k10: 58.9000,
  k11: 71.2000,
  k12: 83.5000,
  k13: 95.8000,
  k14: 8.4000,
  k15: 20.7000,
  k16: 33.0000,
  k17: 45.3000,
  k18: 57.6000,
  k19: 69.9000,
  k20: 82.2000,
  k21: 94.5000,
  k22: 7.1000,
  k23: 19.4000,
  k24: 31.7000,
  k25: 44.0000,
  k26: 56.3000,
  k27: 68.6000,
  k28: 80.9000,
  k29: 93.2000,
  k30: 5.8000,
  k31: 18.1000,
  k32: 30.4000,
  k33: 42.7000,
  k34: 55.0000,
  k35: 67.3000,
  k36: 79.6000,
  k37: 91.9000,
  k38: 4.5000,
  k39: 16.8000,
  k40: 29.1000,
  k41: 41.4000,
  k42: 53.7000,
  k43: 66.0000,
  k44: 78.3000,
  k45: 90.6000,
  k46: 3.2000,
  k47: 15.5000,
  k48: 27.8000,
  k49: 40.1000,
  k50: 52.4000,
  k51: 64.7000,
  k52: 77.0000,
  k53: 89.3000,
  k54: 1.9000,
  k55: 14.2000,
  k56: 26.5000,
  k57: 38.8000,
  k58: 51.1000,
  k59: 63.4000,
  k60: 75.7000,
  k61: 88.0000,
  k62: 0.6000,
  k63: 12.9000,
  k64: 25.2000,
  k65: 37.5000,
  k66: 49.8000,
  k67: 62.1000,
  k68: 74.4000,
  k69: 86.7000,
  k70: 99.0000,
  k71: 11.6000,
} as const;

export function V1031_GRES_OUTAGE_SCENARIO_051_evaluate(turn: number): {
  gridStressExposureIndex: number;
  gridBufferDelayTurns: number;
  gridResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1031_GRES_OUTAGE_SCENARIO_051_COEF) as Array<
    keyof typeof V1031_GRES_OUTAGE_SCENARIO_051_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1031_GRES_OUTAGE_SCENARIO_051_COEF[keys[j]] * ((turn + j) % 17);
  }
  const gridStressExposureIndex = V1031_GRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const gridBufferDelayTurns = V1031_GRES_clamp(2 + (acc % 11), 1, 18);
  const gridResilienceScore = V1031_GRES_clamp(90 - gridStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1031_GRES_gridResilienceBandFromScore(gridResilienceScore) !== 'depleted';
  return { gridStressExposureIndex, gridBufferDelayTurns, gridResilienceScore, stable };
}

export function V1031_GRES_OUTAGE_SCENARIO_051_snapshot(turn: number): V1031GresOutageSnapshot {
  const r = V1031_GRES_OUTAGE_SCENARIO_051_evaluate(turn);
  return {
    scenarioId: V1031_GRES_OUTAGE_SCENARIO_051_META.id,
    regionId: V1031_GRES_OUTAGE_SCENARIO_051_META.regionId,
    gridResilienceChannel: V1031_GRES_OUTAGE_SCENARIO_051_META.primaryChannel,
    gridResilienceBand: V1031_GRES_OUTAGE_SCENARIO_051_META.gridResilienceBand,
    gridStressExposureIndex: r.gridStressExposureIndex,
    gridBufferDelayTurns: r.gridBufferDelayTurns,
    gridResilienceScore: r.gridResilienceScore,
    gridResilienceBand: V1031_GRES_gridResilienceBandFromScore(r.gridResilienceScore),
  };
}

export function V1031_GRES_OUTAGE_SCENARIO_051_regressionAssert(turn: number): boolean {
  const r = V1031_GRES_OUTAGE_SCENARIO_051_evaluate(turn);
  return typeof r.gridStressExposureIndex === 'number' && r.gridResilienceScore <= 100;
}
