import { V1022_HAFF_clamp, V1022_HAFF_tenureBandFromScore } from '../../engine/housing-affordability-utils.ts';
import type {
  V1022HaffStressBand,
  V1022HaffRegionId,
  V1022HaffStressSnapshot,
  V1022HaffHousingTenure,
} from '../../types/core.ts';

/** Generated stress scenario 138 — rent/mortgage/social handoff matrix. */
export const V1022_HAFF_STRESS_SCENARIO_138_META = {
  id: 'stress_138',
  regionId: 'QLD' as V1022HaffRegionId,
  primaryTenure: 'investor' as V1022HaffHousingTenure,
  stressBand: 'critical' as V1022HaffStressBand,
  seed: 126239,
} as const;

const V1022_HAFF_STRESS_SCENARIO_138_COEF = {
  k0: 80.5000,
  k1: 42.5000,
  k2: 4.5000,
  k3: 66.2000,
  k4: 28.2000,
  k5: 89.9000,
  k6: 51.9000,
  k7: 13.9000,
  k8: 75.6000,
  k9: 37.6000,
  k10: 99.3000,
  k11: 61.3000,
  k12: 23.3000,
  k13: 85.0000,
  k14: 47.0000,
  k15: 9.0000,
  k16: 70.7000,
  k17: 32.7000,
  k18: 94.4000,
  k19: 56.4000,
  k20: 18.4000,
  k21: 80.1000,
  k22: 42.1000,
  k23: 4.1000,
  k24: 65.8000,
  k25: 27.8000,
  k26: 89.5000,
  k27: 51.5000,
  k28: 13.5000,
  k29: 75.2000,
  k30: 37.2000,
  k31: 98.9000,
  k32: 60.9000,
  k33: 22.9000,
  k34: 84.6000,
  k35: 46.6000,
  k36: 8.6000,
  k37: 70.3000,
  k38: 32.3000,
  k39: 94.0000,
  k40: 56.0000,
  k41: 18.0000,
  k42: 79.7000,
  k43: 41.7000,
  k44: 3.7000,
  k45: 65.4000,
  k46: 27.4000,
  k47: 89.1000,
  k48: 51.1000,
  k49: 13.1000,
  k50: 74.8000,
  k51: 36.8000,
  k52: 98.5000,
  k53: 60.5000,
  k54: 22.5000,
  k55: 84.2000,
  k56: 46.2000,
  k57: 8.2000,
  k58: 69.9000,
  k59: 31.9000,
  k60: 93.6000,
  k61: 55.6000,
  k62: 17.6000,
  k63: 79.3000,
  k64: 41.3000,
  k65: 3.3000,
  k66: 65.0000,
  k67: 27.0000,
  k68: 88.7000,
  k69: 50.7000,
  k70: 12.7000,
  k71: 74.4000,
} as const;

export function V1022_HAFF_STRESS_SCENARIO_138_evaluate(turn: number): {
  rentStressIndex: number;
  supplyPipelineDelayTurns: number;
  affordabilityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1022_HAFF_STRESS_SCENARIO_138_COEF) as Array<
    keyof typeof V1022_HAFF_STRESS_SCENARIO_138_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1022_HAFF_STRESS_SCENARIO_138_COEF[keys[j]] * ((turn + j) % 17);
  }
  const rentStressIndex = V1022_HAFF_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const supplyPipelineDelayTurns = V1022_HAFF_clamp(2 + (acc % 11), 1, 18);
  const affordabilityScore = V1022_HAFF_clamp(90 - rentStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1022_HAFF_tenureBandFromScore(affordabilityScore) !== 'fragile';
  return { rentStressIndex, supplyPipelineDelayTurns, affordabilityScore, stable };
}

export function V1022_HAFF_STRESS_SCENARIO_138_snapshot(turn: number): V1022HaffStressSnapshot {
  const r = V1022_HAFF_STRESS_SCENARIO_138_evaluate(turn);
  return {
    scenarioId: V1022_HAFF_STRESS_SCENARIO_138_META.id,
    regionId: V1022_HAFF_STRESS_SCENARIO_138_META.regionId,
    housingTenure: V1022_HAFF_STRESS_SCENARIO_138_META.primaryTenure,
    stressBand: V1022_HAFF_STRESS_SCENARIO_138_META.stressBand,
    rentStressIndex: r.rentStressIndex,
    supplyPipelineDelayTurns: r.supplyPipelineDelayTurns,
    affordabilityScore: r.affordabilityScore,
    tenureBand: V1022_HAFF_tenureBandFromScore(r.affordabilityScore),
  };
}

export function V1022_HAFF_STRESS_SCENARIO_138_regressionAssert(turn: number): boolean {
  const r = V1022_HAFF_STRESS_SCENARIO_138_evaluate(turn);
  return typeof r.rentStressIndex === 'number' && r.affordabilityScore <= 100;
}
