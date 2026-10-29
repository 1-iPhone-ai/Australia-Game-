import { V1031_GRES_clamp, V1031_GRES_gridResilienceBandFromScore } from '../../engine/grid-resilience-utils.ts';
import type {
  V1031GresGridResilienceBand,
  V1031GresRegionId,
  V1031GresOutageSnapshot,
  V1031GresGridResilienceChannel,
} from '../../types/core.ts';

/** Generated outage scenario 152 — extreme_heat/drought/dust handoff matrix. */
export const V1031_GRES_OUTAGE_SCENARIO_152_META = {
  id: 'outage_152',
  regionId: 'NSW' as V1031GresRegionId,
  primaryChannel: 'substation_zone' as V1031GresGridResilienceChannel,
  gridResilienceBand: 'elevated' as V1031GresGridResilienceBand,
  seed: 138993,
} as const;

const V1031_GRES_OUTAGE_SCENARIO_152_COEF = {
  k0: 52.2000,
  k1: 93.2000,
  k2: 34.5000,
  k3: 75.5000,
  k4: 16.8000,
  k5: 57.8000,
  k6: 98.8000,
  k7: 40.1000,
  k8: 81.1000,
  k9: 22.4000,
  k10: 63.4000,
  k11: 4.7000,
  k12: 45.7000,
  k13: 86.7000,
  k14: 28.0000,
  k15: 69.0000,
  k16: 10.3000,
  k17: 51.3000,
  k18: 92.3000,
  k19: 33.6000,
  k20: 74.6000,
  k21: 15.9000,
  k22: 56.9000,
  k23: 97.9000,
  k24: 39.2000,
  k25: 80.2000,
  k26: 21.5000,
  k27: 62.5000,
  k28: 3.8000,
  k29: 44.8000,
  k30: 85.8000,
  k31: 27.1000,
  k32: 68.1000,
  k33: 9.4000,
  k34: 50.4000,
  k35: 91.4000,
  k36: 32.7000,
  k37: 73.7000,
  k38: 15.0000,
  k39: 56.0000,
  k40: 97.0000,
  k41: 38.3000,
  k42: 79.3000,
  k43: 20.6000,
  k44: 61.6000,
  k45: 2.9000,
  k46: 43.9000,
  k47: 84.9000,
  k48: 26.2000,
  k49: 67.2000,
  k50: 8.5000,
  k51: 49.5000,
  k52: 90.5000,
  k53: 31.8000,
  k54: 72.8000,
  k55: 14.1000,
  k56: 55.1000,
  k57: 96.1000,
  k58: 37.4000,
  k59: 78.4000,
  k60: 19.7000,
  k61: 60.7000,
  k62: 2.0000,
  k63: 43.0000,
  k64: 84.0000,
  k65: 25.3000,
  k66: 66.3000,
  k67: 7.6000,
  k68: 48.6000,
  k69: 89.6000,
  k70: 30.9000,
  k71: 71.9000,
} as const;

export function V1031_GRES_OUTAGE_SCENARIO_152_evaluate(turn: number): {
  gridStressExposureIndex: number;
  gridBufferDelayTurns: number;
  gridResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1031_GRES_OUTAGE_SCENARIO_152_COEF) as Array<
    keyof typeof V1031_GRES_OUTAGE_SCENARIO_152_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1031_GRES_OUTAGE_SCENARIO_152_COEF[keys[j]] * ((turn + j) % 17);
  }
  const gridStressExposureIndex = V1031_GRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const gridBufferDelayTurns = V1031_GRES_clamp(2 + (acc % 11), 1, 18);
  const gridResilienceScore = V1031_GRES_clamp(90 - gridStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1031_GRES_gridResilienceBandFromScore(gridResilienceScore) !== 'depleted';
  return { gridStressExposureIndex, gridBufferDelayTurns, gridResilienceScore, stable };
}

export function V1031_GRES_OUTAGE_SCENARIO_152_snapshot(turn: number): V1031GresOutageSnapshot {
  const r = V1031_GRES_OUTAGE_SCENARIO_152_evaluate(turn);
  return {
    scenarioId: V1031_GRES_OUTAGE_SCENARIO_152_META.id,
    regionId: V1031_GRES_OUTAGE_SCENARIO_152_META.regionId,
    gridResilienceChannel: V1031_GRES_OUTAGE_SCENARIO_152_META.primaryChannel,
    gridResilienceBand: V1031_GRES_OUTAGE_SCENARIO_152_META.gridResilienceBand,
    gridStressExposureIndex: r.gridStressExposureIndex,
    gridBufferDelayTurns: r.gridBufferDelayTurns,
    gridResilienceScore: r.gridResilienceScore,
    gridResilienceBand: V1031_GRES_gridResilienceBandFromScore(r.gridResilienceScore),
  };
}

export function V1031_GRES_OUTAGE_SCENARIO_152_regressionAssert(turn: number): boolean {
  const r = V1031_GRES_OUTAGE_SCENARIO_152_evaluate(turn);
  return typeof r.gridStressExposureIndex === 'number' && r.gridResilienceScore <= 100;
}
