import { V1031_GRES_clamp, V1031_GRES_gridResilienceBandFromScore } from '../../engine/grid-resilience-utils.ts';
import type {
  V1031GresGridResilienceBand,
  V1031GresRegionId,
  V1031GresOutageSnapshot,
  V1031GresGridResilienceChannel,
} from '../../types/core.ts';

/** Generated outage scenario 160 — extreme_heat/drought/dust handoff matrix. */
export const V1031_GRES_OUTAGE_SCENARIO_160_META = {
  id: 'outage_160',
  regionId: 'NSW' as V1031GresRegionId,
  primaryChannel: 'emergency_care' as V1031GresGridResilienceChannel,
  gridResilienceBand: 'minimal' as V1031GresGridResilienceBand,
  seed: 146281,
} as const;

const V1031_GRES_OUTAGE_SCENARIO_160_COEF = {
  k0: 93.0000,
  k1: 65.2000,
  k2: 37.4000,
  k3: 9.6000,
  k4: 81.5000,
  k5: 53.7000,
  k6: 25.9000,
  k7: 97.8000,
  k8: 70.0000,
  k9: 42.2000,
  k10: 14.4000,
  k11: 86.3000,
  k12: 58.5000,
  k13: 30.7000,
  k14: 2.9000,
  k15: 74.8000,
  k16: 47.0000,
  k17: 19.2000,
  k18: 91.1000,
  k19: 63.3000,
  k20: 35.5000,
  k21: 7.7000,
  k22: 79.6000,
  k23: 51.8000,
  k24: 24.0000,
  k25: 95.9000,
  k26: 68.1000,
  k27: 40.3000,
  k28: 12.5000,
  k29: 84.4000,
  k30: 56.6000,
  k31: 28.8000,
  k32: 1.0000,
  k33: 72.9000,
  k34: 45.1000,
  k35: 17.3000,
  k36: 89.2000,
  k37: 61.4000,
  k38: 33.6000,
  k39: 5.8000,
  k40: 77.7000,
  k41: 49.9000,
  k42: 22.1000,
  k43: 94.0000,
  k44: 66.2000,
  k45: 38.4000,
  k46: 10.6000,
  k47: 82.5000,
  k48: 54.7000,
  k49: 26.9000,
  k50: 98.8000,
  k51: 71.0000,
  k52: 43.2000,
  k53: 15.4000,
  k54: 87.3000,
  k55: 59.5000,
  k56: 31.7000,
  k57: 3.9000,
  k58: 75.8000,
  k59: 48.0000,
  k60: 20.2000,
  k61: 92.1000,
  k62: 64.3000,
  k63: 36.5000,
  k64: 8.7000,
  k65: 80.6000,
  k66: 52.8000,
  k67: 25.0000,
  k68: 96.9000,
  k69: 69.1000,
  k70: 41.3000,
  k71: 13.5000,
} as const;

export function V1031_GRES_OUTAGE_SCENARIO_160_evaluate(turn: number): {
  gridStressExposureIndex: number;
  gridBufferDelayTurns: number;
  gridResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1031_GRES_OUTAGE_SCENARIO_160_COEF) as Array<
    keyof typeof V1031_GRES_OUTAGE_SCENARIO_160_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1031_GRES_OUTAGE_SCENARIO_160_COEF[keys[j]] * ((turn + j) % 17);
  }
  const gridStressExposureIndex = V1031_GRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const gridBufferDelayTurns = V1031_GRES_clamp(2 + (acc % 11), 1, 18);
  const gridResilienceScore = V1031_GRES_clamp(90 - gridStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1031_GRES_gridResilienceBandFromScore(gridResilienceScore) !== 'depleted';
  return { gridStressExposureIndex, gridBufferDelayTurns, gridResilienceScore, stable };
}

export function V1031_GRES_OUTAGE_SCENARIO_160_snapshot(turn: number): V1031GresOutageSnapshot {
  const r = V1031_GRES_OUTAGE_SCENARIO_160_evaluate(turn);
  return {
    scenarioId: V1031_GRES_OUTAGE_SCENARIO_160_META.id,
    regionId: V1031_GRES_OUTAGE_SCENARIO_160_META.regionId,
    gridResilienceChannel: V1031_GRES_OUTAGE_SCENARIO_160_META.primaryChannel,
    gridResilienceBand: V1031_GRES_OUTAGE_SCENARIO_160_META.gridResilienceBand,
    gridStressExposureIndex: r.gridStressExposureIndex,
    gridBufferDelayTurns: r.gridBufferDelayTurns,
    gridResilienceScore: r.gridResilienceScore,
    gridResilienceBand: V1031_GRES_gridResilienceBandFromScore(r.gridResilienceScore),
  };
}

export function V1031_GRES_OUTAGE_SCENARIO_160_regressionAssert(turn: number): boolean {
  const r = V1031_GRES_OUTAGE_SCENARIO_160_evaluate(turn);
  return typeof r.gridStressExposureIndex === 'number' && r.gridResilienceScore <= 100;
}
