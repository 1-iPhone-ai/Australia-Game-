import { V1031_GRES_clamp, V1031_GRES_gridResilienceBandFromScore } from '../../engine/grid-resilience-utils.ts';
import type {
  V1031GresGridResilienceBand,
  V1031GresRegionId,
  V1031GresOutageSnapshot,
  V1031GresGridResilienceChannel,
} from '../../types/core.ts';

/** Generated outage scenario 162 — extreme_heat/drought/dust handoff matrix. */
export const V1031_GRES_OUTAGE_SCENARIO_162_META = {
  id: 'outage_162',
  regionId: 'QLD' as V1031GresRegionId,
  primaryChannel: 'substation_zone' as V1031GresGridResilienceChannel,
  gridResilienceBand: 'elevated' as V1031GresGridResilienceBand,
  seed: 148103,
} as const;

const V1031_GRES_OUTAGE_SCENARIO_162_COEF = {
  k0: 3.5000,
  k1: 58.2000,
  k2: 13.2000,
  k3: 67.9000,
  k4: 22.9000,
  k5: 77.6000,
  k6: 32.6000,
  k7: 87.3000,
  k8: 42.3000,
  k9: 97.0000,
  k10: 52.0000,
  k11: 7.0000,
  k12: 61.7000,
  k13: 16.7000,
  k14: 71.4000,
  k15: 26.4000,
  k16: 81.1000,
  k17: 36.1000,
  k18: 90.8000,
  k19: 45.8000,
  k20: 0.8000,
  k21: 55.5000,
  k22: 10.5000,
  k23: 65.2000,
  k24: 20.2000,
  k25: 74.9000,
  k26: 29.9000,
  k27: 84.6000,
  k28: 39.6000,
  k29: 94.3000,
  k30: 49.3000,
  k31: 4.3000,
  k32: 59.0000,
  k33: 14.0000,
  k34: 68.7000,
  k35: 23.7000,
  k36: 78.4000,
  k37: 33.4000,
  k38: 88.1000,
  k39: 43.1000,
  k40: 97.8000,
  k41: 52.8000,
  k42: 7.8000,
  k43: 62.5000,
  k44: 17.5000,
  k45: 72.2000,
  k46: 27.2000,
  k47: 81.9000,
  k48: 36.9000,
  k49: 91.6000,
  k50: 46.6000,
  k51: 1.6000,
  k52: 56.3000,
  k53: 11.3000,
  k54: 66.0000,
  k55: 21.0000,
  k56: 75.7000,
  k57: 30.7000,
  k58: 85.4000,
  k59: 40.4000,
  k60: 95.1000,
  k61: 50.1000,
  k62: 5.1000,
  k63: 59.8000,
  k64: 14.8000,
  k65: 69.5000,
  k66: 24.5000,
  k67: 79.2000,
  k68: 34.2000,
  k69: 88.9000,
  k70: 43.9000,
  k71: 98.6000,
} as const;

export function V1031_GRES_OUTAGE_SCENARIO_162_evaluate(turn: number): {
  gridStressExposureIndex: number;
  gridBufferDelayTurns: number;
  gridResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1031_GRES_OUTAGE_SCENARIO_162_COEF) as Array<
    keyof typeof V1031_GRES_OUTAGE_SCENARIO_162_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1031_GRES_OUTAGE_SCENARIO_162_COEF[keys[j]] * ((turn + j) % 17);
  }
  const gridStressExposureIndex = V1031_GRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const gridBufferDelayTurns = V1031_GRES_clamp(2 + (acc % 11), 1, 18);
  const gridResilienceScore = V1031_GRES_clamp(90 - gridStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1031_GRES_gridResilienceBandFromScore(gridResilienceScore) !== 'depleted';
  return { gridStressExposureIndex, gridBufferDelayTurns, gridResilienceScore, stable };
}

export function V1031_GRES_OUTAGE_SCENARIO_162_snapshot(turn: number): V1031GresOutageSnapshot {
  const r = V1031_GRES_OUTAGE_SCENARIO_162_evaluate(turn);
  return {
    scenarioId: V1031_GRES_OUTAGE_SCENARIO_162_META.id,
    regionId: V1031_GRES_OUTAGE_SCENARIO_162_META.regionId,
    gridResilienceChannel: V1031_GRES_OUTAGE_SCENARIO_162_META.primaryChannel,
    gridResilienceBand: V1031_GRES_OUTAGE_SCENARIO_162_META.gridResilienceBand,
    gridStressExposureIndex: r.gridStressExposureIndex,
    gridBufferDelayTurns: r.gridBufferDelayTurns,
    gridResilienceScore: r.gridResilienceScore,
    gridResilienceBand: V1031_GRES_gridResilienceBandFromScore(r.gridResilienceScore),
  };
}

export function V1031_GRES_OUTAGE_SCENARIO_162_regressionAssert(turn: number): boolean {
  const r = V1031_GRES_OUTAGE_SCENARIO_162_evaluate(turn);
  return typeof r.gridStressExposureIndex === 'number' && r.gridResilienceScore <= 100;
}
