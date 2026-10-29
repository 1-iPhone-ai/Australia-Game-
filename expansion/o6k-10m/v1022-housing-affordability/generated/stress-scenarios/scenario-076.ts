import { V1022_HAFF_clamp, V1022_HAFF_tenureBandFromScore } from '../../engine/housing-affordability-utils.ts';
import type {
  V1022HaffStressBand,
  V1022HaffRegionId,
  V1022HaffStressSnapshot,
  V1022HaffHousingTenure,
} from '../../types/core.ts';

/** Generated stress scenario 076 — rent/mortgage/social handoff matrix. */
export const V1022_HAFF_STRESS_SCENARIO_076_META = {
  id: 'stress_076',
  regionId: 'SA' as V1022HaffRegionId,
  primaryTenure: 'regional' as V1022HaffHousingTenure,
  stressBand: 'moderate' as V1022HaffStressBand,
  seed: 69757,
} as const;

const V1022_HAFF_STRESS_SCENARIO_076_COEF = {
  k0: 63.4000,
  k1: 60.1000,
  k2: 56.8000,
  k3: 53.5000,
  k4: 50.2000,
  k5: 46.9000,
  k6: 43.6000,
  k7: 40.3000,
  k8: 37.0000,
  k9: 33.7000,
  k10: 30.4000,
  k11: 27.1000,
  k12: 23.8000,
  k13: 20.5000,
  k14: 17.2000,
  k15: 13.9000,
  k16: 10.6000,
  k17: 7.3000,
  k18: 4.0000,
  k19: 0.7000,
  k20: 97.1000,
  k21: 93.8000,
  k22: 90.5000,
  k23: 87.2000,
  k24: 83.9000,
  k25: 80.6000,
  k26: 77.3000,
  k27: 74.0000,
  k28: 70.7000,
  k29: 67.4000,
  k30: 64.1000,
  k31: 60.8000,
  k32: 57.5000,
  k33: 54.2000,
  k34: 50.9000,
  k35: 47.6000,
  k36: 44.3000,
  k37: 41.0000,
  k38: 37.7000,
  k39: 34.4000,
  k40: 31.1000,
  k41: 27.8000,
  k42: 24.5000,
  k43: 21.2000,
  k44: 17.9000,
  k45: 14.6000,
  k46: 11.3000,
  k47: 8.0000,
  k48: 4.7000,
  k49: 1.4000,
  k50: 97.8000,
  k51: 94.5000,
  k52: 91.2000,
  k53: 87.9000,
  k54: 84.6000,
  k55: 81.3000,
  k56: 78.0000,
  k57: 74.7000,
  k58: 71.4000,
  k59: 68.1000,
  k60: 64.8000,
  k61: 61.5000,
  k62: 58.2000,
  k63: 54.9000,
  k64: 51.6000,
  k65: 48.3000,
  k66: 45.0000,
  k67: 41.7000,
  k68: 38.4000,
  k69: 35.1000,
  k70: 31.8000,
  k71: 28.5000,
} as const;

export function V1022_HAFF_STRESS_SCENARIO_076_evaluate(turn: number): {
  rentStressIndex: number;
  supplyPipelineDelayTurns: number;
  affordabilityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1022_HAFF_STRESS_SCENARIO_076_COEF) as Array<
    keyof typeof V1022_HAFF_STRESS_SCENARIO_076_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1022_HAFF_STRESS_SCENARIO_076_COEF[keys[j]] * ((turn + j) % 17);
  }
  const rentStressIndex = V1022_HAFF_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const supplyPipelineDelayTurns = V1022_HAFF_clamp(2 + (acc % 11), 1, 18);
  const affordabilityScore = V1022_HAFF_clamp(90 - rentStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1022_HAFF_tenureBandFromScore(affordabilityScore) !== 'fragile';
  return { rentStressIndex, supplyPipelineDelayTurns, affordabilityScore, stable };
}

export function V1022_HAFF_STRESS_SCENARIO_076_snapshot(turn: number): V1022HaffStressSnapshot {
  const r = V1022_HAFF_STRESS_SCENARIO_076_evaluate(turn);
  return {
    scenarioId: V1022_HAFF_STRESS_SCENARIO_076_META.id,
    regionId: V1022_HAFF_STRESS_SCENARIO_076_META.regionId,
    housingTenure: V1022_HAFF_STRESS_SCENARIO_076_META.primaryTenure,
    stressBand: V1022_HAFF_STRESS_SCENARIO_076_META.stressBand,
    rentStressIndex: r.rentStressIndex,
    supplyPipelineDelayTurns: r.supplyPipelineDelayTurns,
    affordabilityScore: r.affordabilityScore,
    tenureBand: V1022_HAFF_tenureBandFromScore(r.affordabilityScore),
  };
}

export function V1022_HAFF_STRESS_SCENARIO_076_regressionAssert(turn: number): boolean {
  const r = V1022_HAFF_STRESS_SCENARIO_076_evaluate(turn);
  return typeof r.rentStressIndex === 'number' && r.affordabilityScore <= 100;
}
