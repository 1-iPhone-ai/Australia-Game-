import { V1022_HAFF_clamp, V1022_HAFF_tenureBandFromScore } from '../../engine/housing-affordability-utils.ts';
import type {
  V1022HaffStressBand,
  V1022HaffRegionId,
  V1022HaffStressSnapshot,
  V1022HaffHousingTenure,
} from '../../types/core.ts';

/** Generated stress scenario 045 — rent/mortgage/social handoff matrix. */
export const V1022_HAFF_STRESS_SCENARIO_045_META = {
  id: 'stress_045',
  regionId: 'TAS' as V1022HaffRegionId,
  primaryTenure: 'senior' as V1022HaffHousingTenure,
  stressBand: 'minimal' as V1022HaffStressBand,
  seed: 41516,
} as const;

const V1022_HAFF_STRESS_SCENARIO_045_COEF = {
  k0: 5.0000,
  k1: 68.9000,
  k2: 33.1000,
  k3: 97.0000,
  k4: 61.2000,
  k5: 25.4000,
  k6: 89.3000,
  k7: 53.5000,
  k8: 17.7000,
  k9: 81.6000,
  k10: 45.8000,
  k11: 10.0000,
  k12: 73.9000,
  k13: 38.1000,
  k14: 2.3000,
  k15: 66.2000,
  k16: 30.4000,
  k17: 94.3000,
  k18: 58.5000,
  k19: 22.7000,
  k20: 86.6000,
  k21: 50.8000,
  k22: 15.0000,
  k23: 78.9000,
  k24: 43.1000,
  k25: 7.3000,
  k26: 71.2000,
  k27: 35.4000,
  k28: 99.3000,
  k29: 63.5000,
  k30: 27.7000,
  k31: 91.6000,
  k32: 55.8000,
  k33: 20.0000,
  k34: 83.9000,
  k35: 48.1000,
  k36: 12.3000,
  k37: 76.2000,
  k38: 40.4000,
  k39: 4.6000,
  k40: 68.5000,
  k41: 32.7000,
  k42: 96.6000,
  k43: 60.8000,
  k44: 25.0000,
  k45: 88.9000,
  k46: 53.1000,
  k47: 17.3000,
  k48: 81.2000,
  k49: 45.4000,
  k50: 9.6000,
  k51: 73.5000,
  k52: 37.7000,
  k53: 1.9000,
  k54: 65.8000,
  k55: 30.0000,
  k56: 93.9000,
  k57: 58.1000,
  k58: 22.3000,
  k59: 86.2000,
  k60: 50.4000,
  k61: 14.6000,
  k62: 78.5000,
  k63: 42.7000,
  k64: 6.9000,
  k65: 70.8000,
  k66: 35.0000,
  k67: 98.9000,
  k68: 63.1000,
  k69: 27.3000,
  k70: 91.2000,
  k71: 55.4000,
} as const;

export function V1022_HAFF_STRESS_SCENARIO_045_evaluate(turn: number): {
  rentStressIndex: number;
  supplyPipelineDelayTurns: number;
  affordabilityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1022_HAFF_STRESS_SCENARIO_045_COEF) as Array<
    keyof typeof V1022_HAFF_STRESS_SCENARIO_045_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1022_HAFF_STRESS_SCENARIO_045_COEF[keys[j]] * ((turn + j) % 17);
  }
  const rentStressIndex = V1022_HAFF_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const supplyPipelineDelayTurns = V1022_HAFF_clamp(2 + (acc % 11), 1, 18);
  const affordabilityScore = V1022_HAFF_clamp(90 - rentStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1022_HAFF_tenureBandFromScore(affordabilityScore) !== 'fragile';
  return { rentStressIndex, supplyPipelineDelayTurns, affordabilityScore, stable };
}

export function V1022_HAFF_STRESS_SCENARIO_045_snapshot(turn: number): V1022HaffStressSnapshot {
  const r = V1022_HAFF_STRESS_SCENARIO_045_evaluate(turn);
  return {
    scenarioId: V1022_HAFF_STRESS_SCENARIO_045_META.id,
    regionId: V1022_HAFF_STRESS_SCENARIO_045_META.regionId,
    housingTenure: V1022_HAFF_STRESS_SCENARIO_045_META.primaryTenure,
    stressBand: V1022_HAFF_STRESS_SCENARIO_045_META.stressBand,
    rentStressIndex: r.rentStressIndex,
    supplyPipelineDelayTurns: r.supplyPipelineDelayTurns,
    affordabilityScore: r.affordabilityScore,
    tenureBand: V1022_HAFF_tenureBandFromScore(r.affordabilityScore),
  };
}

export function V1022_HAFF_STRESS_SCENARIO_045_regressionAssert(turn: number): boolean {
  const r = V1022_HAFF_STRESS_SCENARIO_045_evaluate(turn);
  return typeof r.rentStressIndex === 'number' && r.affordabilityScore <= 100;
}
