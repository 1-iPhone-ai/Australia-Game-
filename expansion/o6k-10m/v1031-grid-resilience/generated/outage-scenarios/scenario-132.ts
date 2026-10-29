import { V1031_GRES_clamp, V1031_GRES_gridResilienceBandFromScore } from '../../engine/grid-resilience-utils.ts';
import type {
  V1031GresGridResilienceBand,
  V1031GresRegionId,
  V1031GresOutageSnapshot,
  V1031GresGridResilienceChannel,
} from '../../types/core.ts';

/** Generated outage scenario 132 — extreme_heat/drought/dust handoff matrix. */
export const V1031_GRES_OUTAGE_SCENARIO_132_META = {
  id: 'outage_132',
  regionId: 'SA' as V1031GresRegionId,
  primaryChannel: 'substation_zone' as V1031GresGridResilienceChannel,
  gridResilienceBand: 'elevated' as V1031GresGridResilienceBand,
  seed: 120773,
} as const;

const V1031_GRES_OUTAGE_SCENARIO_132_COEF = {
  k0: 49.9000,
  k1: 63.5000,
  k2: 77.1000,
  k3: 90.7000,
  k4: 4.6000,
  k5: 18.2000,
  k6: 31.8000,
  k7: 45.4000,
  k8: 59.0000,
  k9: 72.6000,
  k10: 86.2000,
  k11: 0.1000,
  k12: 13.7000,
  k13: 27.3000,
  k14: 40.9000,
  k15: 54.5000,
  k16: 68.1000,
  k17: 81.7000,
  k18: 95.3000,
  k19: 9.2000,
  k20: 22.8000,
  k21: 36.4000,
  k22: 50.0000,
  k23: 63.6000,
  k24: 77.2000,
  k25: 90.8000,
  k26: 4.7000,
  k27: 18.3000,
  k28: 31.9000,
  k29: 45.5000,
  k30: 59.1000,
  k31: 72.7000,
  k32: 86.3000,
  k33: 0.2000,
  k34: 13.8000,
  k35: 27.4000,
  k36: 41.0000,
  k37: 54.6000,
  k38: 68.2000,
  k39: 81.8000,
  k40: 95.4000,
  k41: 9.3000,
  k42: 22.9000,
  k43: 36.5000,
  k44: 50.1000,
  k45: 63.7000,
  k46: 77.3000,
  k47: 90.9000,
  k48: 4.8000,
  k49: 18.4000,
  k50: 32.0000,
  k51: 45.6000,
  k52: 59.2000,
  k53: 72.8000,
  k54: 86.4000,
  k55: 0.3000,
  k56: 13.9000,
  k57: 27.5000,
  k58: 41.1000,
  k59: 54.7000,
  k60: 68.3000,
  k61: 81.9000,
  k62: 95.5000,
  k63: 9.4000,
  k64: 23.0000,
  k65: 36.6000,
  k66: 50.2000,
  k67: 63.8000,
  k68: 77.4000,
  k69: 91.0000,
  k70: 4.9000,
  k71: 18.5000,
} as const;

export function V1031_GRES_OUTAGE_SCENARIO_132_evaluate(turn: number): {
  gridStressExposureIndex: number;
  gridBufferDelayTurns: number;
  gridResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1031_GRES_OUTAGE_SCENARIO_132_COEF) as Array<
    keyof typeof V1031_GRES_OUTAGE_SCENARIO_132_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1031_GRES_OUTAGE_SCENARIO_132_COEF[keys[j]] * ((turn + j) % 17);
  }
  const gridStressExposureIndex = V1031_GRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const gridBufferDelayTurns = V1031_GRES_clamp(2 + (acc % 11), 1, 18);
  const gridResilienceScore = V1031_GRES_clamp(90 - gridStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1031_GRES_gridResilienceBandFromScore(gridResilienceScore) !== 'depleted';
  return { gridStressExposureIndex, gridBufferDelayTurns, gridResilienceScore, stable };
}

export function V1031_GRES_OUTAGE_SCENARIO_132_snapshot(turn: number): V1031GresOutageSnapshot {
  const r = V1031_GRES_OUTAGE_SCENARIO_132_evaluate(turn);
  return {
    scenarioId: V1031_GRES_OUTAGE_SCENARIO_132_META.id,
    regionId: V1031_GRES_OUTAGE_SCENARIO_132_META.regionId,
    gridResilienceChannel: V1031_GRES_OUTAGE_SCENARIO_132_META.primaryChannel,
    gridResilienceBand: V1031_GRES_OUTAGE_SCENARIO_132_META.gridResilienceBand,
    gridStressExposureIndex: r.gridStressExposureIndex,
    gridBufferDelayTurns: r.gridBufferDelayTurns,
    gridResilienceScore: r.gridResilienceScore,
    gridResilienceBand: V1031_GRES_gridResilienceBandFromScore(r.gridResilienceScore),
  };
}

export function V1031_GRES_OUTAGE_SCENARIO_132_regressionAssert(turn: number): boolean {
  const r = V1031_GRES_OUTAGE_SCENARIO_132_evaluate(turn);
  return typeof r.gridStressExposureIndex === 'number' && r.gridResilienceScore <= 100;
}
