import { V1031_GRES_clamp, V1031_GRES_gridResilienceBandFromScore } from '../../engine/grid-resilience-utils.ts';
import type {
  V1031GresGridResilienceBand,
  V1031GresRegionId,
  V1031GresOutageSnapshot,
  V1031GresGridResilienceChannel,
} from '../../types/core.ts';

/** Generated outage scenario 107 — extreme_heat/drought/dust handoff matrix. */
export const V1031_GRES_OUTAGE_SCENARIO_107_META = {
  id: 'outage_107',
  regionId: 'WA' as V1031GresRegionId,
  primaryChannel: 'mental_health' as V1031GresGridResilienceChannel,
  gridResilienceBand: 'elevated' as V1031GresGridResilienceBand,
  seed: 97998,
} as const;

const V1031_GRES_OUTAGE_SCENARIO_107_COEF = {
  k0: 22.1000,
  k1: 51.3000,
  k2: 80.5000,
  k3: 10.0000,
  k4: 39.2000,
  k5: 68.4000,
  k6: 97.6000,
  k7: 27.1000,
  k8: 56.3000,
  k9: 85.5000,
  k10: 15.0000,
  k11: 44.2000,
  k12: 73.4000,
  k13: 2.9000,
  k14: 32.1000,
  k15: 61.3000,
  k16: 90.5000,
  k17: 20.0000,
  k18: 49.2000,
  k19: 78.4000,
  k20: 7.9000,
  k21: 37.1000,
  k22: 66.3000,
  k23: 95.5000,
  k24: 25.0000,
  k25: 54.2000,
  k26: 83.4000,
  k27: 12.9000,
  k28: 42.1000,
  k29: 71.3000,
  k30: 0.8000,
  k31: 30.0000,
  k32: 59.2000,
  k33: 88.4000,
  k34: 17.9000,
  k35: 47.1000,
  k36: 76.3000,
  k37: 5.8000,
  k38: 35.0000,
  k39: 64.2000,
  k40: 93.4000,
  k41: 22.9000,
  k42: 52.1000,
  k43: 81.3000,
  k44: 10.8000,
  k45: 40.0000,
  k46: 69.2000,
  k47: 98.4000,
  k48: 27.9000,
  k49: 57.1000,
  k50: 86.3000,
  k51: 15.8000,
  k52: 45.0000,
  k53: 74.2000,
  k54: 3.7000,
  k55: 32.9000,
  k56: 62.1000,
  k57: 91.3000,
  k58: 20.8000,
  k59: 50.0000,
  k60: 79.2000,
  k61: 8.7000,
  k62: 37.9000,
  k63: 67.1000,
  k64: 96.3000,
  k65: 25.8000,
  k66: 55.0000,
  k67: 84.2000,
  k68: 13.7000,
  k69: 42.9000,
  k70: 72.1000,
  k71: 1.6000,
} as const;

export function V1031_GRES_OUTAGE_SCENARIO_107_evaluate(turn: number): {
  gridStressExposureIndex: number;
  gridBufferDelayTurns: number;
  gridResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1031_GRES_OUTAGE_SCENARIO_107_COEF) as Array<
    keyof typeof V1031_GRES_OUTAGE_SCENARIO_107_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1031_GRES_OUTAGE_SCENARIO_107_COEF[keys[j]] * ((turn + j) % 17);
  }
  const gridStressExposureIndex = V1031_GRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const gridBufferDelayTurns = V1031_GRES_clamp(2 + (acc % 11), 1, 18);
  const gridResilienceScore = V1031_GRES_clamp(90 - gridStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1031_GRES_gridResilienceBandFromScore(gridResilienceScore) !== 'depleted';
  return { gridStressExposureIndex, gridBufferDelayTurns, gridResilienceScore, stable };
}

export function V1031_GRES_OUTAGE_SCENARIO_107_snapshot(turn: number): V1031GresOutageSnapshot {
  const r = V1031_GRES_OUTAGE_SCENARIO_107_evaluate(turn);
  return {
    scenarioId: V1031_GRES_OUTAGE_SCENARIO_107_META.id,
    regionId: V1031_GRES_OUTAGE_SCENARIO_107_META.regionId,
    gridResilienceChannel: V1031_GRES_OUTAGE_SCENARIO_107_META.primaryChannel,
    gridResilienceBand: V1031_GRES_OUTAGE_SCENARIO_107_META.gridResilienceBand,
    gridStressExposureIndex: r.gridStressExposureIndex,
    gridBufferDelayTurns: r.gridBufferDelayTurns,
    gridResilienceScore: r.gridResilienceScore,
    gridResilienceBand: V1031_GRES_gridResilienceBandFromScore(r.gridResilienceScore),
  };
}

export function V1031_GRES_OUTAGE_SCENARIO_107_regressionAssert(turn: number): boolean {
  const r = V1031_GRES_OUTAGE_SCENARIO_107_evaluate(turn);
  return typeof r.gridStressExposureIndex === 'number' && r.gridResilienceScore <= 100;
}
