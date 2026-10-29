import { V1022_HAFF_clamp, V1022_HAFF_tenureBandFromScore } from '../../engine/housing-affordability-utils.ts';
import type {
  V1022HaffStressBand,
  V1022HaffRegionId,
  V1022HaffStressSnapshot,
  V1022HaffHousingTenure,
} from '../../types/core.ts';

/** Generated stress scenario 031 — rent/mortgage/social handoff matrix. */
export const V1022_HAFF_STRESS_SCENARIO_031_META = {
  id: 'stress_031',
  regionId: 'ACT' as V1022HaffRegionId,
  primaryTenure: 'mortgage' as V1022HaffHousingTenure,
  stressBand: 'moderate' as V1022HaffStressBand,
  seed: 28762,
} as const;

const V1022_HAFF_STRESS_SCENARIO_031_COEF = {
  k0: 33.3000,
  k1: 18.2000,
  k2: 3.1000,
  k3: 87.7000,
  k4: 72.6000,
  k5: 57.5000,
  k6: 42.4000,
  k7: 27.3000,
  k8: 12.2000,
  k9: 96.8000,
  k10: 81.7000,
  k11: 66.6000,
  k12: 51.5000,
  k13: 36.4000,
  k14: 21.3000,
  k15: 6.2000,
  k16: 90.8000,
  k17: 75.7000,
  k18: 60.6000,
  k19: 45.5000,
  k20: 30.4000,
  k21: 15.3000,
  k22: 0.2000,
  k23: 84.8000,
  k24: 69.7000,
  k25: 54.6000,
  k26: 39.5000,
  k27: 24.4000,
  k28: 9.3000,
  k29: 93.9000,
  k30: 78.8000,
  k31: 63.7000,
  k32: 48.6000,
  k33: 33.5000,
  k34: 18.4000,
  k35: 3.3000,
  k36: 87.9000,
  k37: 72.8000,
  k38: 57.7000,
  k39: 42.6000,
  k40: 27.5000,
  k41: 12.4000,
  k42: 97.0000,
  k43: 81.9000,
  k44: 66.8000,
  k45: 51.7000,
  k46: 36.6000,
  k47: 21.5000,
  k48: 6.4000,
  k49: 91.0000,
  k50: 75.9000,
  k51: 60.8000,
  k52: 45.7000,
  k53: 30.6000,
  k54: 15.5000,
  k55: 0.4000,
  k56: 85.0000,
  k57: 69.9000,
  k58: 54.8000,
  k59: 39.7000,
  k60: 24.6000,
  k61: 9.5000,
  k62: 94.1000,
  k63: 79.0000,
  k64: 63.9000,
  k65: 48.8000,
  k66: 33.7000,
  k67: 18.6000,
  k68: 3.5000,
  k69: 88.1000,
  k70: 73.0000,
  k71: 57.9000,
} as const;

export function V1022_HAFF_STRESS_SCENARIO_031_evaluate(turn: number): {
  rentStressIndex: number;
  supplyPipelineDelayTurns: number;
  affordabilityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1022_HAFF_STRESS_SCENARIO_031_COEF) as Array<
    keyof typeof V1022_HAFF_STRESS_SCENARIO_031_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1022_HAFF_STRESS_SCENARIO_031_COEF[keys[j]] * ((turn + j) % 17);
  }
  const rentStressIndex = V1022_HAFF_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const supplyPipelineDelayTurns = V1022_HAFF_clamp(2 + (acc % 11), 1, 18);
  const affordabilityScore = V1022_HAFF_clamp(90 - rentStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1022_HAFF_tenureBandFromScore(affordabilityScore) !== 'fragile';
  return { rentStressIndex, supplyPipelineDelayTurns, affordabilityScore, stable };
}

export function V1022_HAFF_STRESS_SCENARIO_031_snapshot(turn: number): V1022HaffStressSnapshot {
  const r = V1022_HAFF_STRESS_SCENARIO_031_evaluate(turn);
  return {
    scenarioId: V1022_HAFF_STRESS_SCENARIO_031_META.id,
    regionId: V1022_HAFF_STRESS_SCENARIO_031_META.regionId,
    housingTenure: V1022_HAFF_STRESS_SCENARIO_031_META.primaryTenure,
    stressBand: V1022_HAFF_STRESS_SCENARIO_031_META.stressBand,
    rentStressIndex: r.rentStressIndex,
    supplyPipelineDelayTurns: r.supplyPipelineDelayTurns,
    affordabilityScore: r.affordabilityScore,
    tenureBand: V1022_HAFF_tenureBandFromScore(r.affordabilityScore),
  };
}

export function V1022_HAFF_STRESS_SCENARIO_031_regressionAssert(turn: number): boolean {
  const r = V1022_HAFF_STRESS_SCENARIO_031_evaluate(turn);
  return typeof r.rentStressIndex === 'number' && r.affordabilityScore <= 100;
}
