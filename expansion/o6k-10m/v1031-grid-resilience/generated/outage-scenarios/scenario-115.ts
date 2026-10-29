import { V1031_GRES_clamp, V1031_GRES_gridResilienceBandFromScore } from '../../engine/grid-resilience-utils.ts';
import type {
  V1031GresGridResilienceBand,
  V1031GresRegionId,
  V1031GresOutageSnapshot,
  V1031GresGridResilienceChannel,
} from '../../types/core.ts';

/** Generated outage scenario 115 — extreme_heat/drought/dust handoff matrix. */
export const V1031_GRES_OUTAGE_SCENARIO_115_META = {
  id: 'outage_115',
  regionId: 'WA' as V1031GresRegionId,
  primaryChannel: 'specialist_referral' as V1031GresGridResilienceChannel,
  gridResilienceBand: 'minimal' as V1031GresGridResilienceBand,
  seed: 105286,
} as const;

const V1031_GRES_OUTAGE_SCENARIO_115_COEF = {
  k0: 62.9000,
  k1: 23.3000,
  k2: 83.4000,
  k3: 43.8000,
  k4: 4.2000,
  k5: 64.3000,
  k6: 24.7000,
  k7: 84.8000,
  k8: 45.2000,
  k9: 5.6000,
  k10: 65.7000,
  k11: 26.1000,
  k12: 86.2000,
  k13: 46.6000,
  k14: 7.0000,
  k15: 67.1000,
  k16: 27.5000,
  k17: 87.6000,
  k18: 48.0000,
  k19: 8.4000,
  k20: 68.5000,
  k21: 28.9000,
  k22: 89.0000,
  k23: 49.4000,
  k24: 9.8000,
  k25: 69.9000,
  k26: 30.3000,
  k27: 90.4000,
  k28: 50.8000,
  k29: 11.2000,
  k30: 71.3000,
  k31: 31.7000,
  k32: 91.8000,
  k33: 52.2000,
  k34: 12.6000,
  k35: 72.7000,
  k36: 33.1000,
  k37: 93.2000,
  k38: 53.6000,
  k39: 14.0000,
  k40: 74.1000,
  k41: 34.5000,
  k42: 94.6000,
  k43: 55.0000,
  k44: 15.4000,
  k45: 75.5000,
  k46: 35.9000,
  k47: 96.0000,
  k48: 56.4000,
  k49: 16.8000,
  k50: 76.9000,
  k51: 37.3000,
  k52: 97.4000,
  k53: 57.8000,
  k54: 18.2000,
  k55: 78.3000,
  k56: 38.7000,
  k57: 98.8000,
  k58: 59.2000,
  k59: 19.6000,
  k60: 79.7000,
  k61: 40.1000,
  k62: 0.5000,
  k63: 60.6000,
  k64: 21.0000,
  k65: 81.1000,
  k66: 41.5000,
  k67: 1.9000,
  k68: 62.0000,
  k69: 22.4000,
  k70: 82.5000,
  k71: 42.9000,
} as const;

export function V1031_GRES_OUTAGE_SCENARIO_115_evaluate(turn: number): {
  gridStressExposureIndex: number;
  gridBufferDelayTurns: number;
  gridResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1031_GRES_OUTAGE_SCENARIO_115_COEF) as Array<
    keyof typeof V1031_GRES_OUTAGE_SCENARIO_115_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1031_GRES_OUTAGE_SCENARIO_115_COEF[keys[j]] * ((turn + j) % 17);
  }
  const gridStressExposureIndex = V1031_GRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const gridBufferDelayTurns = V1031_GRES_clamp(2 + (acc % 11), 1, 18);
  const gridResilienceScore = V1031_GRES_clamp(90 - gridStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1031_GRES_gridResilienceBandFromScore(gridResilienceScore) !== 'depleted';
  return { gridStressExposureIndex, gridBufferDelayTurns, gridResilienceScore, stable };
}

export function V1031_GRES_OUTAGE_SCENARIO_115_snapshot(turn: number): V1031GresOutageSnapshot {
  const r = V1031_GRES_OUTAGE_SCENARIO_115_evaluate(turn);
  return {
    scenarioId: V1031_GRES_OUTAGE_SCENARIO_115_META.id,
    regionId: V1031_GRES_OUTAGE_SCENARIO_115_META.regionId,
    gridResilienceChannel: V1031_GRES_OUTAGE_SCENARIO_115_META.primaryChannel,
    gridResilienceBand: V1031_GRES_OUTAGE_SCENARIO_115_META.gridResilienceBand,
    gridStressExposureIndex: r.gridStressExposureIndex,
    gridBufferDelayTurns: r.gridBufferDelayTurns,
    gridResilienceScore: r.gridResilienceScore,
    gridResilienceBand: V1031_GRES_gridResilienceBandFromScore(r.gridResilienceScore),
  };
}

export function V1031_GRES_OUTAGE_SCENARIO_115_regressionAssert(turn: number): boolean {
  const r = V1031_GRES_OUTAGE_SCENARIO_115_evaluate(turn);
  return typeof r.gridStressExposureIndex === 'number' && r.gridResilienceScore <= 100;
}
