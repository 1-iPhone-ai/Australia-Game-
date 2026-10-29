import { V1022_HAFF_clamp, V1022_HAFF_tenureBandFromScore } from '../../engine/housing-affordability-utils.ts';
import type {
  V1022HaffStressBand,
  V1022HaffRegionId,
  V1022HaffStressSnapshot,
  V1022HaffHousingTenure,
} from '../../types/core.ts';

/** Generated stress scenario 139 — rent/mortgage/social handoff matrix. */
export const V1022_HAFF_STRESS_SCENARIO_139_META = {
  id: 'stress_139',
  regionId: 'WA' as V1022HaffRegionId,
  primaryTenure: 'co_living' as V1022HaffHousingTenure,
  stressBand: 'recovering' as V1022HaffStressBand,
  seed: 127150,
} as const;

const V1022_HAFF_STRESS_SCENARIO_139_COEF = {
  k0: 85.6000,
  k1: 39.0000,
  k2: 92.1000,
  k3: 45.5000,
  k4: 98.6000,
  k5: 52.0000,
  k6: 5.4000,
  k7: 58.5000,
  k8: 11.9000,
  k9: 65.0000,
  k10: 18.4000,
  k11: 71.5000,
  k12: 24.9000,
  k13: 78.0000,
  k14: 31.4000,
  k15: 84.5000,
  k16: 37.9000,
  k17: 91.0000,
  k18: 44.4000,
  k19: 97.5000,
  k20: 50.9000,
  k21: 4.3000,
  k22: 57.4000,
  k23: 10.8000,
  k24: 63.9000,
  k25: 17.3000,
  k26: 70.4000,
  k27: 23.8000,
  k28: 76.9000,
  k29: 30.3000,
  k30: 83.4000,
  k31: 36.8000,
  k32: 89.9000,
  k33: 43.3000,
  k34: 96.4000,
  k35: 49.8000,
  k36: 3.2000,
  k37: 56.3000,
  k38: 9.7000,
  k39: 62.8000,
  k40: 16.2000,
  k41: 69.3000,
  k42: 22.7000,
  k43: 75.8000,
  k44: 29.2000,
  k45: 82.3000,
  k46: 35.7000,
  k47: 88.8000,
  k48: 42.2000,
  k49: 95.3000,
  k50: 48.7000,
  k51: 2.1000,
  k52: 55.2000,
  k53: 8.6000,
  k54: 61.7000,
  k55: 15.1000,
  k56: 68.2000,
  k57: 21.6000,
  k58: 74.7000,
  k59: 28.1000,
  k60: 81.2000,
  k61: 34.6000,
  k62: 87.7000,
  k63: 41.1000,
  k64: 94.2000,
  k65: 47.6000,
  k66: 1.0000,
  k67: 54.1000,
  k68: 7.5000,
  k69: 60.6000,
  k70: 14.0000,
  k71: 67.1000,
} as const;

export function V1022_HAFF_STRESS_SCENARIO_139_evaluate(turn: number): {
  rentStressIndex: number;
  supplyPipelineDelayTurns: number;
  affordabilityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1022_HAFF_STRESS_SCENARIO_139_COEF) as Array<
    keyof typeof V1022_HAFF_STRESS_SCENARIO_139_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1022_HAFF_STRESS_SCENARIO_139_COEF[keys[j]] * ((turn + j) % 17);
  }
  const rentStressIndex = V1022_HAFF_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const supplyPipelineDelayTurns = V1022_HAFF_clamp(2 + (acc % 11), 1, 18);
  const affordabilityScore = V1022_HAFF_clamp(90 - rentStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1022_HAFF_tenureBandFromScore(affordabilityScore) !== 'fragile';
  return { rentStressIndex, supplyPipelineDelayTurns, affordabilityScore, stable };
}

export function V1022_HAFF_STRESS_SCENARIO_139_snapshot(turn: number): V1022HaffStressSnapshot {
  const r = V1022_HAFF_STRESS_SCENARIO_139_evaluate(turn);
  return {
    scenarioId: V1022_HAFF_STRESS_SCENARIO_139_META.id,
    regionId: V1022_HAFF_STRESS_SCENARIO_139_META.regionId,
    housingTenure: V1022_HAFF_STRESS_SCENARIO_139_META.primaryTenure,
    stressBand: V1022_HAFF_STRESS_SCENARIO_139_META.stressBand,
    rentStressIndex: r.rentStressIndex,
    supplyPipelineDelayTurns: r.supplyPipelineDelayTurns,
    affordabilityScore: r.affordabilityScore,
    tenureBand: V1022_HAFF_tenureBandFromScore(r.affordabilityScore),
  };
}

export function V1022_HAFF_STRESS_SCENARIO_139_regressionAssert(turn: number): boolean {
  const r = V1022_HAFF_STRESS_SCENARIO_139_evaluate(turn);
  return typeof r.rentStressIndex === 'number' && r.affordabilityScore <= 100;
}
