import { V1022_HAFF_clamp, V1022_HAFF_tenureBandFromScore } from '../../engine/housing-affordability-utils.ts';
import type {
  V1022HaffStressBand,
  V1022HaffRegionId,
  V1022HaffStressSnapshot,
  V1022HaffHousingTenure,
} from '../../types/core.ts';

/** Generated stress scenario 116 — rent/mortgage/social handoff matrix. */
export const V1022_HAFF_STRESS_SCENARIO_116_META = {
  id: 'stress_116',
  regionId: 'SA' as V1022HaffRegionId,
  primaryTenure: 'regional' as V1022HaffHousingTenure,
  stressBand: 'moderate' as V1022HaffStressBand,
  seed: 106197,
} as const;

const V1022_HAFF_STRESS_SCENARIO_116_COEF = {
  k0: 68.0000,
  k1: 19.8000,
  k2: 71.3000,
  k3: 23.1000,
  k4: 74.6000,
  k5: 26.4000,
  k6: 77.9000,
  k7: 29.7000,
  k8: 81.2000,
  k9: 33.0000,
  k10: 84.5000,
  k11: 36.3000,
  k12: 87.8000,
  k13: 39.6000,
  k14: 91.1000,
  k15: 42.9000,
  k16: 94.4000,
  k17: 46.2000,
  k18: 97.7000,
  k19: 49.5000,
  k20: 1.3000,
  k21: 52.8000,
  k22: 4.6000,
  k23: 56.1000,
  k24: 7.9000,
  k25: 59.4000,
  k26: 11.2000,
  k27: 62.7000,
  k28: 14.5000,
  k29: 66.0000,
  k30: 17.8000,
  k31: 69.3000,
  k32: 21.1000,
  k33: 72.6000,
  k34: 24.4000,
  k35: 75.9000,
  k36: 27.7000,
  k37: 79.2000,
  k38: 31.0000,
  k39: 82.5000,
  k40: 34.3000,
  k41: 85.8000,
  k42: 37.6000,
  k43: 89.1000,
  k44: 40.9000,
  k45: 92.4000,
  k46: 44.2000,
  k47: 95.7000,
  k48: 47.5000,
  k49: 99.0000,
  k50: 50.8000,
  k51: 2.6000,
  k52: 54.1000,
  k53: 5.9000,
  k54: 57.4000,
  k55: 9.2000,
  k56: 60.7000,
  k57: 12.5000,
  k58: 64.0000,
  k59: 15.8000,
  k60: 67.3000,
  k61: 19.1000,
  k62: 70.6000,
  k63: 22.4000,
  k64: 73.9000,
  k65: 25.7000,
  k66: 77.2000,
  k67: 29.0000,
  k68: 80.5000,
  k69: 32.3000,
  k70: 83.8000,
  k71: 35.6000,
} as const;

export function V1022_HAFF_STRESS_SCENARIO_116_evaluate(turn: number): {
  rentStressIndex: number;
  supplyPipelineDelayTurns: number;
  affordabilityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1022_HAFF_STRESS_SCENARIO_116_COEF) as Array<
    keyof typeof V1022_HAFF_STRESS_SCENARIO_116_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1022_HAFF_STRESS_SCENARIO_116_COEF[keys[j]] * ((turn + j) % 17);
  }
  const rentStressIndex = V1022_HAFF_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const supplyPipelineDelayTurns = V1022_HAFF_clamp(2 + (acc % 11), 1, 18);
  const affordabilityScore = V1022_HAFF_clamp(90 - rentStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1022_HAFF_tenureBandFromScore(affordabilityScore) !== 'fragile';
  return { rentStressIndex, supplyPipelineDelayTurns, affordabilityScore, stable };
}

export function V1022_HAFF_STRESS_SCENARIO_116_snapshot(turn: number): V1022HaffStressSnapshot {
  const r = V1022_HAFF_STRESS_SCENARIO_116_evaluate(turn);
  return {
    scenarioId: V1022_HAFF_STRESS_SCENARIO_116_META.id,
    regionId: V1022_HAFF_STRESS_SCENARIO_116_META.regionId,
    housingTenure: V1022_HAFF_STRESS_SCENARIO_116_META.primaryTenure,
    stressBand: V1022_HAFF_STRESS_SCENARIO_116_META.stressBand,
    rentStressIndex: r.rentStressIndex,
    supplyPipelineDelayTurns: r.supplyPipelineDelayTurns,
    affordabilityScore: r.affordabilityScore,
    tenureBand: V1022_HAFF_tenureBandFromScore(r.affordabilityScore),
  };
}

export function V1022_HAFF_STRESS_SCENARIO_116_regressionAssert(turn: number): boolean {
  const r = V1022_HAFF_STRESS_SCENARIO_116_evaluate(turn);
  return typeof r.rentStressIndex === 'number' && r.affordabilityScore <= 100;
}
