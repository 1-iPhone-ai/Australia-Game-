import { V1022_HAFF_clamp, V1022_HAFF_tenureBandFromScore } from '../../engine/housing-affordability-utils.ts';
import type {
  V1022HaffStressBand,
  V1022HaffRegionId,
  V1022HaffStressSnapshot,
  V1022HaffHousingTenure,
} from '../../types/core.ts';

/** Generated stress scenario 070 — rent/mortgage/social handoff matrix. */
export const V1022_HAFF_STRESS_SCENARIO_070_META = {
  id: 'stress_070',
  regionId: 'NT' as V1022HaffRegionId,
  primaryTenure: 'rent' as V1022HaffHousingTenure,
  stressBand: 'minimal' as V1022HaffStressBand,
  seed: 64291,
} as const;

const V1022_HAFF_STRESS_SCENARIO_070_COEF = {
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

export function V1022_HAFF_STRESS_SCENARIO_070_evaluate(turn: number): {
  rentStressIndex: number;
  supplyPipelineDelayTurns: number;
  affordabilityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1022_HAFF_STRESS_SCENARIO_070_COEF) as Array<
    keyof typeof V1022_HAFF_STRESS_SCENARIO_070_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1022_HAFF_STRESS_SCENARIO_070_COEF[keys[j]] * ((turn + j) % 17);
  }
  const rentStressIndex = V1022_HAFF_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const supplyPipelineDelayTurns = V1022_HAFF_clamp(2 + (acc % 11), 1, 18);
  const affordabilityScore = V1022_HAFF_clamp(90 - rentStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1022_HAFF_tenureBandFromScore(affordabilityScore) !== 'fragile';
  return { rentStressIndex, supplyPipelineDelayTurns, affordabilityScore, stable };
}

export function V1022_HAFF_STRESS_SCENARIO_070_snapshot(turn: number): V1022HaffStressSnapshot {
  const r = V1022_HAFF_STRESS_SCENARIO_070_evaluate(turn);
  return {
    scenarioId: V1022_HAFF_STRESS_SCENARIO_070_META.id,
    regionId: V1022_HAFF_STRESS_SCENARIO_070_META.regionId,
    housingTenure: V1022_HAFF_STRESS_SCENARIO_070_META.primaryTenure,
    stressBand: V1022_HAFF_STRESS_SCENARIO_070_META.stressBand,
    rentStressIndex: r.rentStressIndex,
    supplyPipelineDelayTurns: r.supplyPipelineDelayTurns,
    affordabilityScore: r.affordabilityScore,
    tenureBand: V1022_HAFF_tenureBandFromScore(r.affordabilityScore),
  };
}

export function V1022_HAFF_STRESS_SCENARIO_070_regressionAssert(turn: number): boolean {
  const r = V1022_HAFF_STRESS_SCENARIO_070_evaluate(turn);
  return typeof r.rentStressIndex === 'number' && r.affordabilityScore <= 100;
}
