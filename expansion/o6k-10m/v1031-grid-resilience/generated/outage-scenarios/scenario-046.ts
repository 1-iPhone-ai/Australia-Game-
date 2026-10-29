import { V1031_GRES_clamp, V1031_GRES_gridResilienceBandFromScore } from '../../engine/grid-resilience-utils.ts';
import type {
  V1031GresGridResilienceBand,
  V1031GresRegionId,
  V1031GresOutageSnapshot,
  V1031GresGridResilienceChannel,
} from '../../types/core.ts';

/** Generated outage scenario 046 — extreme_heat/drought/dust handoff matrix. */
export const V1031_GRES_OUTAGE_SCENARIO_046_META = {
  id: 'outage_046',
  regionId: 'NT' as V1031GresRegionId,
  primaryChannel: 'aged_care' as V1031GresGridResilienceChannel,
  gridResilienceBand: 'moderate' as V1031GresGridResilienceBand,
  seed: 42427,
} as const;

const V1031_GRES_OUTAGE_SCENARIO_046_COEF = {
  k0: 10.1000,
  k1: 65.4000,
  k2: 21.0000,
  k3: 76.3000,
  k4: 31.9000,
  k5: 87.2000,
  k6: 42.8000,
  k7: 98.1000,
  k8: 53.7000,
  k9: 9.3000,
  k10: 64.6000,
  k11: 20.2000,
  k12: 75.5000,
  k13: 31.1000,
  k14: 86.4000,
  k15: 42.0000,
  k16: 97.3000,
  k17: 52.9000,
  k18: 8.5000,
  k19: 63.8000,
  k20: 19.4000,
  k21: 74.7000,
  k22: 30.3000,
  k23: 85.6000,
  k24: 41.2000,
  k25: 96.5000,
  k26: 52.1000,
  k27: 7.7000,
  k28: 63.0000,
  k29: 18.6000,
  k30: 73.9000,
  k31: 29.5000,
  k32: 84.8000,
  k33: 40.4000,
  k34: 95.7000,
  k35: 51.3000,
  k36: 6.9000,
  k37: 62.2000,
  k38: 17.8000,
  k39: 73.1000,
  k40: 28.7000,
  k41: 84.0000,
  k42: 39.6000,
  k43: 94.9000,
  k44: 50.5000,
  k45: 6.1000,
  k46: 61.4000,
  k47: 17.0000,
  k48: 72.3000,
  k49: 27.9000,
  k50: 83.2000,
  k51: 38.8000,
  k52: 94.1000,
  k53: 49.7000,
  k54: 5.3000,
  k55: 60.6000,
  k56: 16.2000,
  k57: 71.5000,
  k58: 27.1000,
  k59: 82.4000,
  k60: 38.0000,
  k61: 93.3000,
  k62: 48.9000,
  k63: 4.5000,
  k64: 59.8000,
  k65: 15.4000,
  k66: 70.7000,
  k67: 26.3000,
  k68: 81.6000,
  k69: 37.2000,
  k70: 92.5000,
  k71: 48.1000,
} as const;

export function V1031_GRES_OUTAGE_SCENARIO_046_evaluate(turn: number): {
  gridStressExposureIndex: number;
  gridBufferDelayTurns: number;
  gridResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1031_GRES_OUTAGE_SCENARIO_046_COEF) as Array<
    keyof typeof V1031_GRES_OUTAGE_SCENARIO_046_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1031_GRES_OUTAGE_SCENARIO_046_COEF[keys[j]] * ((turn + j) % 17);
  }
  const gridStressExposureIndex = V1031_GRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const gridBufferDelayTurns = V1031_GRES_clamp(2 + (acc % 11), 1, 18);
  const gridResilienceScore = V1031_GRES_clamp(90 - gridStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1031_GRES_gridResilienceBandFromScore(gridResilienceScore) !== 'depleted';
  return { gridStressExposureIndex, gridBufferDelayTurns, gridResilienceScore, stable };
}

export function V1031_GRES_OUTAGE_SCENARIO_046_snapshot(turn: number): V1031GresOutageSnapshot {
  const r = V1031_GRES_OUTAGE_SCENARIO_046_evaluate(turn);
  return {
    scenarioId: V1031_GRES_OUTAGE_SCENARIO_046_META.id,
    regionId: V1031_GRES_OUTAGE_SCENARIO_046_META.regionId,
    gridResilienceChannel: V1031_GRES_OUTAGE_SCENARIO_046_META.primaryChannel,
    gridResilienceBand: V1031_GRES_OUTAGE_SCENARIO_046_META.gridResilienceBand,
    gridStressExposureIndex: r.gridStressExposureIndex,
    gridBufferDelayTurns: r.gridBufferDelayTurns,
    gridResilienceScore: r.gridResilienceScore,
    gridResilienceBand: V1031_GRES_gridResilienceBandFromScore(r.gridResilienceScore),
  };
}

export function V1031_GRES_OUTAGE_SCENARIO_046_regressionAssert(turn: number): boolean {
  const r = V1031_GRES_OUTAGE_SCENARIO_046_evaluate(turn);
  return typeof r.gridStressExposureIndex === 'number' && r.gridResilienceScore <= 100;
}
