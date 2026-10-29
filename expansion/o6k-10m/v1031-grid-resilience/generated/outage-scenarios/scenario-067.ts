import { V1031_GRES_clamp, V1031_GRES_gridResilienceBandFromScore } from '../../engine/grid-resilience-utils.ts';
import type {
  V1031GresGridResilienceBand,
  V1031GresRegionId,
  V1031GresOutageSnapshot,
  V1031GresGridResilienceChannel,
} from '../../types/core.ts';

/** Generated outage scenario 067 — extreme_heat/drought/dust handoff matrix. */
export const V1031_GRES_OUTAGE_SCENARIO_067_META = {
  id: 'outage_067',
  regionId: 'WA' as V1031GresRegionId,
  primaryChannel: 'mental_health' as V1031GresGridResilienceChannel,
  gridResilienceBand: 'elevated' as V1031GresGridResilienceBand,
  seed: 61558,
} as const;

const V1031_GRES_OUTAGE_SCENARIO_067_COEF = {
  k0: 17.5000,
  k1: 91.6000,
  k2: 66.0000,
  k3: 40.4000,
  k4: 14.8000,
  k5: 88.9000,
  k6: 63.3000,
  k7: 37.7000,
  k8: 12.1000,
  k9: 86.2000,
  k10: 60.6000,
  k11: 35.0000,
  k12: 9.4000,
  k13: 83.5000,
  k14: 57.9000,
  k15: 32.3000,
  k16: 6.7000,
  k17: 80.8000,
  k18: 55.2000,
  k19: 29.6000,
  k20: 4.0000,
  k21: 78.1000,
  k22: 52.5000,
  k23: 26.9000,
  k24: 1.3000,
  k25: 75.4000,
  k26: 49.8000,
  k27: 24.2000,
  k28: 98.3000,
  k29: 72.7000,
  k30: 47.1000,
  k31: 21.5000,
  k32: 95.6000,
  k33: 70.0000,
  k34: 44.4000,
  k35: 18.8000,
  k36: 92.9000,
  k37: 67.3000,
  k38: 41.7000,
  k39: 16.1000,
  k40: 90.2000,
  k41: 64.6000,
  k42: 39.0000,
  k43: 13.4000,
  k44: 87.5000,
  k45: 61.9000,
  k46: 36.3000,
  k47: 10.7000,
  k48: 84.8000,
  k49: 59.2000,
  k50: 33.6000,
  k51: 8.0000,
  k52: 82.1000,
  k53: 56.5000,
  k54: 30.9000,
  k55: 5.3000,
  k56: 79.4000,
  k57: 53.8000,
  k58: 28.2000,
  k59: 2.6000,
  k60: 76.7000,
  k61: 51.1000,
  k62: 25.5000,
  k63: 99.6000,
  k64: 74.0000,
  k65: 48.4000,
  k66: 22.8000,
  k67: 96.9000,
  k68: 71.3000,
  k69: 45.7000,
  k70: 20.1000,
  k71: 94.2000,
} as const;

export function V1031_GRES_OUTAGE_SCENARIO_067_evaluate(turn: number): {
  gridStressExposureIndex: number;
  gridBufferDelayTurns: number;
  gridResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1031_GRES_OUTAGE_SCENARIO_067_COEF) as Array<
    keyof typeof V1031_GRES_OUTAGE_SCENARIO_067_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1031_GRES_OUTAGE_SCENARIO_067_COEF[keys[j]] * ((turn + j) % 17);
  }
  const gridStressExposureIndex = V1031_GRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const gridBufferDelayTurns = V1031_GRES_clamp(2 + (acc % 11), 1, 18);
  const gridResilienceScore = V1031_GRES_clamp(90 - gridStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1031_GRES_gridResilienceBandFromScore(gridResilienceScore) !== 'depleted';
  return { gridStressExposureIndex, gridBufferDelayTurns, gridResilienceScore, stable };
}

export function V1031_GRES_OUTAGE_SCENARIO_067_snapshot(turn: number): V1031GresOutageSnapshot {
  const r = V1031_GRES_OUTAGE_SCENARIO_067_evaluate(turn);
  return {
    scenarioId: V1031_GRES_OUTAGE_SCENARIO_067_META.id,
    regionId: V1031_GRES_OUTAGE_SCENARIO_067_META.regionId,
    gridResilienceChannel: V1031_GRES_OUTAGE_SCENARIO_067_META.primaryChannel,
    gridResilienceBand: V1031_GRES_OUTAGE_SCENARIO_067_META.gridResilienceBand,
    gridStressExposureIndex: r.gridStressExposureIndex,
    gridBufferDelayTurns: r.gridBufferDelayTurns,
    gridResilienceScore: r.gridResilienceScore,
    gridResilienceBand: V1031_GRES_gridResilienceBandFromScore(r.gridResilienceScore),
  };
}

export function V1031_GRES_OUTAGE_SCENARIO_067_regressionAssert(turn: number): boolean {
  const r = V1031_GRES_OUTAGE_SCENARIO_067_evaluate(turn);
  return typeof r.gridStressExposureIndex === 'number' && r.gridResilienceScore <= 100;
}
