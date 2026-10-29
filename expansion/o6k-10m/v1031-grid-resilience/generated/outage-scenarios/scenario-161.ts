import { V1031_GRES_clamp, V1031_GRES_gridResilienceBandFromScore } from '../../engine/grid-resilience-utils.ts';
import type {
  V1031GresGridResilienceBand,
  V1031GresRegionId,
  V1031GresOutageSnapshot,
  V1031GresGridResilienceChannel,
} from '../../types/core.ts';

/** Generated outage scenario 161 — extreme_heat/drought/dust handoff matrix. */
export const V1031_GRES_OUTAGE_SCENARIO_161_META = {
  id: 'outage_161',
  regionId: 'VIC' as V1031GresRegionId,
  primaryChannel: 'primary_access' as V1031GresGridResilienceChannel,
  gridResilienceBand: 'moderate' as V1031GresGridResilienceBand,
  seed: 147192,
} as const;

const V1031_GRES_OUTAGE_SCENARIO_161_COEF = {
  k0: 98.1000,
  k1: 61.7000,
  k2: 25.3000,
  k3: 88.6000,
  k4: 52.2000,
  k5: 15.8000,
  k6: 79.1000,
  k7: 42.7000,
  k8: 6.3000,
  k9: 69.6000,
  k10: 33.2000,
  k11: 96.5000,
  k12: 60.1000,
  k13: 23.7000,
  k14: 87.0000,
  k15: 50.6000,
  k16: 14.2000,
  k17: 77.5000,
  k18: 41.1000,
  k19: 4.7000,
  k20: 68.0000,
  k21: 31.6000,
  k22: 94.9000,
  k23: 58.5000,
  k24: 22.1000,
  k25: 85.4000,
  k26: 49.0000,
  k27: 12.6000,
  k28: 75.9000,
  k29: 39.5000,
  k30: 3.1000,
  k31: 66.4000,
  k32: 30.0000,
  k33: 93.3000,
  k34: 56.9000,
  k35: 20.5000,
  k36: 83.8000,
  k37: 47.4000,
  k38: 11.0000,
  k39: 74.3000,
  k40: 37.9000,
  k41: 1.5000,
  k42: 64.8000,
  k43: 28.4000,
  k44: 91.7000,
  k45: 55.3000,
  k46: 18.9000,
  k47: 82.2000,
  k48: 45.8000,
  k49: 9.4000,
  k50: 72.7000,
  k51: 36.3000,
  k52: 99.6000,
  k53: 63.2000,
  k54: 26.8000,
  k55: 90.1000,
  k56: 53.7000,
  k57: 17.3000,
  k58: 80.6000,
  k59: 44.2000,
  k60: 7.8000,
  k61: 71.1000,
  k62: 34.7000,
  k63: 98.0000,
  k64: 61.6000,
  k65: 25.2000,
  k66: 88.5000,
  k67: 52.1000,
  k68: 15.7000,
  k69: 79.0000,
  k70: 42.6000,
  k71: 6.2000,
} as const;

export function V1031_GRES_OUTAGE_SCENARIO_161_evaluate(turn: number): {
  gridStressExposureIndex: number;
  gridBufferDelayTurns: number;
  gridResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1031_GRES_OUTAGE_SCENARIO_161_COEF) as Array<
    keyof typeof V1031_GRES_OUTAGE_SCENARIO_161_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1031_GRES_OUTAGE_SCENARIO_161_COEF[keys[j]] * ((turn + j) % 17);
  }
  const gridStressExposureIndex = V1031_GRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const gridBufferDelayTurns = V1031_GRES_clamp(2 + (acc % 11), 1, 18);
  const gridResilienceScore = V1031_GRES_clamp(90 - gridStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1031_GRES_gridResilienceBandFromScore(gridResilienceScore) !== 'depleted';
  return { gridStressExposureIndex, gridBufferDelayTurns, gridResilienceScore, stable };
}

export function V1031_GRES_OUTAGE_SCENARIO_161_snapshot(turn: number): V1031GresOutageSnapshot {
  const r = V1031_GRES_OUTAGE_SCENARIO_161_evaluate(turn);
  return {
    scenarioId: V1031_GRES_OUTAGE_SCENARIO_161_META.id,
    regionId: V1031_GRES_OUTAGE_SCENARIO_161_META.regionId,
    gridResilienceChannel: V1031_GRES_OUTAGE_SCENARIO_161_META.primaryChannel,
    gridResilienceBand: V1031_GRES_OUTAGE_SCENARIO_161_META.gridResilienceBand,
    gridStressExposureIndex: r.gridStressExposureIndex,
    gridBufferDelayTurns: r.gridBufferDelayTurns,
    gridResilienceScore: r.gridResilienceScore,
    gridResilienceBand: V1031_GRES_gridResilienceBandFromScore(r.gridResilienceScore),
  };
}

export function V1031_GRES_OUTAGE_SCENARIO_161_regressionAssert(turn: number): boolean {
  const r = V1031_GRES_OUTAGE_SCENARIO_161_evaluate(turn);
  return typeof r.gridStressExposureIndex === 'number' && r.gridResilienceScore <= 100;
}
