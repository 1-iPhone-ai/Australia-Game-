import { V1031_GRES_clamp, V1031_GRES_gridResilienceBandFromScore } from '../../engine/grid-resilience-utils.ts';
import type {
  V1031GresGridResilienceBand,
  V1031GresRegionId,
  V1031GresOutageSnapshot,
  V1031GresGridResilienceChannel,
} from '../../types/core.ts';

/** Generated outage scenario 070 — extreme_heat/drought/dust handoff matrix. */
export const V1031_GRES_OUTAGE_SCENARIO_070_META = {
  id: 'outage_070',
  regionId: 'NT' as V1031GresRegionId,
  primaryChannel: 'emergency_care' as V1031GresGridResilienceChannel,
  gridResilienceBand: 'minimal' as V1031GresGridResilienceBand,
  seed: 64291,
} as const;

const V1031_GRES_OUTAGE_SCENARIO_070_COEF = {
  k0: 32.8000,
  k1: 81.1000,
  k2: 29.7000,
  k3: 78.0000,
  k4: 26.6000,
  k5: 74.9000,
  k6: 23.5000,
  k7: 71.8000,
  k8: 20.4000,
  k9: 68.7000,
  k10: 17.3000,
  k11: 65.6000,
  k12: 14.2000,
  k13: 62.5000,
  k14: 11.1000,
  k15: 59.4000,
  k16: 8.0000,
  k17: 56.3000,
  k18: 4.9000,
  k19: 53.2000,
  k20: 1.8000,
  k21: 50.1000,
  k22: 98.4000,
  k23: 47.0000,
  k24: 95.3000,
  k25: 43.9000,
  k26: 92.2000,
  k27: 40.8000,
  k28: 89.1000,
  k29: 37.7000,
  k30: 86.0000,
  k31: 34.6000,
  k32: 82.9000,
  k33: 31.5000,
  k34: 79.8000,
  k35: 28.4000,
  k36: 76.7000,
  k37: 25.3000,
  k38: 73.6000,
  k39: 22.2000,
  k40: 70.5000,
  k41: 19.1000,
  k42: 67.4000,
  k43: 16.0000,
  k44: 64.3000,
  k45: 12.9000,
  k46: 61.2000,
  k47: 9.8000,
  k48: 58.1000,
  k49: 6.7000,
  k50: 55.0000,
  k51: 3.6000,
  k52: 51.9000,
  k53: 0.5000,
  k54: 48.8000,
  k55: 97.1000,
  k56: 45.7000,
  k57: 94.0000,
  k58: 42.6000,
  k59: 90.9000,
  k60: 39.5000,
  k61: 87.8000,
  k62: 36.4000,
  k63: 84.7000,
  k64: 33.3000,
  k65: 81.6000,
  k66: 30.2000,
  k67: 78.5000,
  k68: 27.1000,
  k69: 75.4000,
  k70: 24.0000,
  k71: 72.3000,
} as const;

export function V1031_GRES_OUTAGE_SCENARIO_070_evaluate(turn: number): {
  gridStressExposureIndex: number;
  gridBufferDelayTurns: number;
  gridResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1031_GRES_OUTAGE_SCENARIO_070_COEF) as Array<
    keyof typeof V1031_GRES_OUTAGE_SCENARIO_070_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1031_GRES_OUTAGE_SCENARIO_070_COEF[keys[j]] * ((turn + j) % 17);
  }
  const gridStressExposureIndex = V1031_GRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const gridBufferDelayTurns = V1031_GRES_clamp(2 + (acc % 11), 1, 18);
  const gridResilienceScore = V1031_GRES_clamp(90 - gridStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1031_GRES_gridResilienceBandFromScore(gridResilienceScore) !== 'depleted';
  return { gridStressExposureIndex, gridBufferDelayTurns, gridResilienceScore, stable };
}

export function V1031_GRES_OUTAGE_SCENARIO_070_snapshot(turn: number): V1031GresOutageSnapshot {
  const r = V1031_GRES_OUTAGE_SCENARIO_070_evaluate(turn);
  return {
    scenarioId: V1031_GRES_OUTAGE_SCENARIO_070_META.id,
    regionId: V1031_GRES_OUTAGE_SCENARIO_070_META.regionId,
    gridResilienceChannel: V1031_GRES_OUTAGE_SCENARIO_070_META.primaryChannel,
    gridResilienceBand: V1031_GRES_OUTAGE_SCENARIO_070_META.gridResilienceBand,
    gridStressExposureIndex: r.gridStressExposureIndex,
    gridBufferDelayTurns: r.gridBufferDelayTurns,
    gridResilienceScore: r.gridResilienceScore,
    gridResilienceBand: V1031_GRES_gridResilienceBandFromScore(r.gridResilienceScore),
  };
}

export function V1031_GRES_OUTAGE_SCENARIO_070_regressionAssert(turn: number): boolean {
  const r = V1031_GRES_OUTAGE_SCENARIO_070_evaluate(turn);
  return typeof r.gridStressExposureIndex === 'number' && r.gridResilienceScore <= 100;
}
