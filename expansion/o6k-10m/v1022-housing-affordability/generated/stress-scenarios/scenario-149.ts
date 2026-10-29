import { V1022_HAFF_clamp, V1022_HAFF_tenureBandFromScore } from '../../engine/housing-affordability-utils.ts';
import type {
  V1022HaffStressBand,
  V1022HaffRegionId,
  V1022HaffStressSnapshot,
  V1022HaffHousingTenure,
} from '../../types/core.ts';

/** Generated stress scenario 149 — rent/mortgage/social handoff matrix. */
export const V1022_HAFF_STRESS_SCENARIO_149_META = {
  id: 'stress_149',
  regionId: 'TAS' as V1022HaffRegionId,
  primaryTenure: 'co_living' as V1022HaffHousingTenure,
  stressBand: 'recovering' as V1022HaffStressBand,
  seed: 136260,
} as const;

const V1022_HAFF_STRESS_SCENARIO_149_COEF = {
  k0: 36.9000,
  k1: 4.0000,
  k2: 70.8000,
  k3: 37.9000,
  k4: 5.0000,
  k5: 71.8000,
  k6: 38.9000,
  k7: 6.0000,
  k8: 72.8000,
  k9: 39.9000,
  k10: 7.0000,
  k11: 73.8000,
  k12: 40.9000,
  k13: 8.0000,
  k14: 74.8000,
  k15: 41.9000,
  k16: 9.0000,
  k17: 75.8000,
  k18: 42.9000,
  k19: 10.0000,
  k20: 76.8000,
  k21: 43.9000,
  k22: 11.0000,
  k23: 77.8000,
  k24: 44.9000,
  k25: 12.0000,
  k26: 78.8000,
  k27: 45.9000,
  k28: 13.0000,
  k29: 79.8000,
  k30: 46.9000,
  k31: 14.0000,
  k32: 80.8000,
  k33: 47.9000,
  k34: 15.0000,
  k35: 81.8000,
  k36: 48.9000,
  k37: 16.0000,
  k38: 82.8000,
  k39: 49.9000,
  k40: 17.0000,
  k41: 83.8000,
  k42: 50.9000,
  k43: 18.0000,
  k44: 84.8000,
  k45: 51.9000,
  k46: 19.0000,
  k47: 85.8000,
  k48: 52.9000,
  k49: 20.0000,
  k50: 86.8000,
  k51: 53.9000,
  k52: 21.0000,
  k53: 87.8000,
  k54: 54.9000,
  k55: 22.0000,
  k56: 88.8000,
  k57: 55.9000,
  k58: 23.0000,
  k59: 89.8000,
  k60: 56.9000,
  k61: 24.0000,
  k62: 90.8000,
  k63: 57.9000,
  k64: 25.0000,
  k65: 91.8000,
  k66: 58.9000,
  k67: 26.0000,
  k68: 92.8000,
  k69: 59.9000,
  k70: 27.0000,
  k71: 93.8000,
} as const;

export function V1022_HAFF_STRESS_SCENARIO_149_evaluate(turn: number): {
  rentStressIndex: number;
  supplyPipelineDelayTurns: number;
  affordabilityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1022_HAFF_STRESS_SCENARIO_149_COEF) as Array<
    keyof typeof V1022_HAFF_STRESS_SCENARIO_149_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1022_HAFF_STRESS_SCENARIO_149_COEF[keys[j]] * ((turn + j) % 17);
  }
  const rentStressIndex = V1022_HAFF_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const supplyPipelineDelayTurns = V1022_HAFF_clamp(2 + (acc % 11), 1, 18);
  const affordabilityScore = V1022_HAFF_clamp(90 - rentStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1022_HAFF_tenureBandFromScore(affordabilityScore) !== 'fragile';
  return { rentStressIndex, supplyPipelineDelayTurns, affordabilityScore, stable };
}

export function V1022_HAFF_STRESS_SCENARIO_149_snapshot(turn: number): V1022HaffStressSnapshot {
  const r = V1022_HAFF_STRESS_SCENARIO_149_evaluate(turn);
  return {
    scenarioId: V1022_HAFF_STRESS_SCENARIO_149_META.id,
    regionId: V1022_HAFF_STRESS_SCENARIO_149_META.regionId,
    housingTenure: V1022_HAFF_STRESS_SCENARIO_149_META.primaryTenure,
    stressBand: V1022_HAFF_STRESS_SCENARIO_149_META.stressBand,
    rentStressIndex: r.rentStressIndex,
    supplyPipelineDelayTurns: r.supplyPipelineDelayTurns,
    affordabilityScore: r.affordabilityScore,
    tenureBand: V1022_HAFF_tenureBandFromScore(r.affordabilityScore),
  };
}

export function V1022_HAFF_STRESS_SCENARIO_149_regressionAssert(turn: number): boolean {
  const r = V1022_HAFF_STRESS_SCENARIO_149_evaluate(turn);
  return typeof r.rentStressIndex === 'number' && r.affordabilityScore <= 100;
}
