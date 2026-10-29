import { V1022_HAFF_clamp, V1022_HAFF_tenureBandFromScore } from '../../engine/housing-affordability-utils.ts';
import type {
  V1022HaffStressBand,
  V1022HaffRegionId,
  V1022HaffStressSnapshot,
  V1022HaffHousingTenure,
} from '../../types/core.ts';

/** Generated stress scenario 140 — rent/mortgage/social handoff matrix. */
export const V1022_HAFF_STRESS_SCENARIO_140_META = {
  id: 'stress_140',
  regionId: 'SA' as V1022HaffRegionId,
  primaryTenure: 'rent' as V1022HaffHousingTenure,
  stressBand: 'minimal' as V1022HaffStressBand,
  seed: 128061,
} as const;

const V1022_HAFF_STRESS_SCENARIO_140_COEF = {
  k0: 90.7000,
  k1: 35.5000,
  k2: 80.0000,
  k3: 24.8000,
  k4: 69.3000,
  k5: 14.1000,
  k6: 58.6000,
  k7: 3.4000,
  k8: 47.9000,
  k9: 92.4000,
  k10: 37.2000,
  k11: 81.7000,
  k12: 26.5000,
  k13: 71.0000,
  k14: 15.8000,
  k15: 60.3000,
  k16: 5.1000,
  k17: 49.6000,
  k18: 94.1000,
  k19: 38.9000,
  k20: 83.4000,
  k21: 28.2000,
  k22: 72.7000,
  k23: 17.5000,
  k24: 62.0000,
  k25: 6.8000,
  k26: 51.3000,
  k27: 95.8000,
  k28: 40.6000,
  k29: 85.1000,
  k30: 29.9000,
  k31: 74.4000,
  k32: 19.2000,
  k33: 63.7000,
  k34: 8.5000,
  k35: 53.0000,
  k36: 97.5000,
  k37: 42.3000,
  k38: 86.8000,
  k39: 31.6000,
  k40: 76.1000,
  k41: 20.9000,
  k42: 65.4000,
  k43: 10.2000,
  k44: 54.7000,
  k45: 99.2000,
  k46: 44.0000,
  k47: 88.5000,
  k48: 33.3000,
  k49: 77.8000,
  k50: 22.6000,
  k51: 67.1000,
  k52: 11.9000,
  k53: 56.4000,
  k54: 1.2000,
  k55: 45.7000,
  k56: 90.2000,
  k57: 35.0000,
  k58: 79.5000,
  k59: 24.3000,
  k60: 68.8000,
  k61: 13.6000,
  k62: 58.1000,
  k63: 2.9000,
  k64: 47.4000,
  k65: 91.9000,
  k66: 36.7000,
  k67: 81.2000,
  k68: 26.0000,
  k69: 70.5000,
  k70: 15.3000,
  k71: 59.8000,
} as const;

export function V1022_HAFF_STRESS_SCENARIO_140_evaluate(turn: number): {
  rentStressIndex: number;
  supplyPipelineDelayTurns: number;
  affordabilityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1022_HAFF_STRESS_SCENARIO_140_COEF) as Array<
    keyof typeof V1022_HAFF_STRESS_SCENARIO_140_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1022_HAFF_STRESS_SCENARIO_140_COEF[keys[j]] * ((turn + j) % 17);
  }
  const rentStressIndex = V1022_HAFF_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const supplyPipelineDelayTurns = V1022_HAFF_clamp(2 + (acc % 11), 1, 18);
  const affordabilityScore = V1022_HAFF_clamp(90 - rentStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1022_HAFF_tenureBandFromScore(affordabilityScore) !== 'fragile';
  return { rentStressIndex, supplyPipelineDelayTurns, affordabilityScore, stable };
}

export function V1022_HAFF_STRESS_SCENARIO_140_snapshot(turn: number): V1022HaffStressSnapshot {
  const r = V1022_HAFF_STRESS_SCENARIO_140_evaluate(turn);
  return {
    scenarioId: V1022_HAFF_STRESS_SCENARIO_140_META.id,
    regionId: V1022_HAFF_STRESS_SCENARIO_140_META.regionId,
    housingTenure: V1022_HAFF_STRESS_SCENARIO_140_META.primaryTenure,
    stressBand: V1022_HAFF_STRESS_SCENARIO_140_META.stressBand,
    rentStressIndex: r.rentStressIndex,
    supplyPipelineDelayTurns: r.supplyPipelineDelayTurns,
    affordabilityScore: r.affordabilityScore,
    tenureBand: V1022_HAFF_tenureBandFromScore(r.affordabilityScore),
  };
}

export function V1022_HAFF_STRESS_SCENARIO_140_regressionAssert(turn: number): boolean {
  const r = V1022_HAFF_STRESS_SCENARIO_140_evaluate(turn);
  return typeof r.rentStressIndex === 'number' && r.affordabilityScore <= 100;
}
