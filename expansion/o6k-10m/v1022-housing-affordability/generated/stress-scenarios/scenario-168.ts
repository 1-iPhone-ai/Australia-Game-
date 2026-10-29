import { V1022_HAFF_clamp, V1022_HAFF_tenureBandFromScore } from '../../engine/housing-affordability-utils.ts';
import type {
  V1022HaffStressBand,
  V1022HaffRegionId,
  V1022HaffStressSnapshot,
  V1022HaffHousingTenure,
} from '../../types/core.ts';

/** Generated stress scenario 168 — rent/mortgage/social handoff matrix. */
export const V1022_HAFF_STRESS_SCENARIO_168_META = {
  id: 'stress_168',
  regionId: 'NSW' as V1022HaffRegionId,
  primaryTenure: 'investor' as V1022HaffHousingTenure,
  stressBand: 'critical' as V1022HaffStressBand,
  seed: 153569,
} as const;

const V1022_HAFF_STRESS_SCENARIO_168_COEF = {
  k0: 34.1000,
  k1: 37.2000,
  k2: 40.3000,
  k3: 43.4000,
  k4: 46.5000,
  k5: 49.6000,
  k6: 52.7000,
  k7: 55.8000,
  k8: 58.9000,
  k9: 62.0000,
  k10: 65.1000,
  k11: 68.2000,
  k12: 71.3000,
  k13: 74.4000,
  k14: 77.5000,
  k15: 80.6000,
  k16: 83.7000,
  k17: 86.8000,
  k18: 89.9000,
  k19: 93.0000,
  k20: 96.1000,
  k21: 99.2000,
  k22: 2.6000,
  k23: 5.7000,
  k24: 8.8000,
  k25: 11.9000,
  k26: 15.0000,
  k27: 18.1000,
  k28: 21.2000,
  k29: 24.3000,
  k30: 27.4000,
  k31: 30.5000,
  k32: 33.6000,
  k33: 36.7000,
  k34: 39.8000,
  k35: 42.9000,
  k36: 46.0000,
  k37: 49.1000,
  k38: 52.2000,
  k39: 55.3000,
  k40: 58.4000,
  k41: 61.5000,
  k42: 64.6000,
  k43: 67.7000,
  k44: 70.8000,
  k45: 73.9000,
  k46: 77.0000,
  k47: 80.1000,
  k48: 83.2000,
  k49: 86.3000,
  k50: 89.4000,
  k51: 92.5000,
  k52: 95.6000,
  k53: 98.7000,
  k54: 2.1000,
  k55: 5.2000,
  k56: 8.3000,
  k57: 11.4000,
  k58: 14.5000,
  k59: 17.6000,
  k60: 20.7000,
  k61: 23.8000,
  k62: 26.9000,
  k63: 30.0000,
  k64: 33.1000,
  k65: 36.2000,
  k66: 39.3000,
  k67: 42.4000,
  k68: 45.5000,
  k69: 48.6000,
  k70: 51.7000,
  k71: 54.8000,
} as const;

export function V1022_HAFF_STRESS_SCENARIO_168_evaluate(turn: number): {
  rentStressIndex: number;
  supplyPipelineDelayTurns: number;
  affordabilityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1022_HAFF_STRESS_SCENARIO_168_COEF) as Array<
    keyof typeof V1022_HAFF_STRESS_SCENARIO_168_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1022_HAFF_STRESS_SCENARIO_168_COEF[keys[j]] * ((turn + j) % 17);
  }
  const rentStressIndex = V1022_HAFF_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const supplyPipelineDelayTurns = V1022_HAFF_clamp(2 + (acc % 11), 1, 18);
  const affordabilityScore = V1022_HAFF_clamp(90 - rentStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1022_HAFF_tenureBandFromScore(affordabilityScore) !== 'fragile';
  return { rentStressIndex, supplyPipelineDelayTurns, affordabilityScore, stable };
}

export function V1022_HAFF_STRESS_SCENARIO_168_snapshot(turn: number): V1022HaffStressSnapshot {
  const r = V1022_HAFF_STRESS_SCENARIO_168_evaluate(turn);
  return {
    scenarioId: V1022_HAFF_STRESS_SCENARIO_168_META.id,
    regionId: V1022_HAFF_STRESS_SCENARIO_168_META.regionId,
    housingTenure: V1022_HAFF_STRESS_SCENARIO_168_META.primaryTenure,
    stressBand: V1022_HAFF_STRESS_SCENARIO_168_META.stressBand,
    rentStressIndex: r.rentStressIndex,
    supplyPipelineDelayTurns: r.supplyPipelineDelayTurns,
    affordabilityScore: r.affordabilityScore,
    tenureBand: V1022_HAFF_tenureBandFromScore(r.affordabilityScore),
  };
}

export function V1022_HAFF_STRESS_SCENARIO_168_regressionAssert(turn: number): boolean {
  const r = V1022_HAFF_STRESS_SCENARIO_168_evaluate(turn);
  return typeof r.rentStressIndex === 'number' && r.affordabilityScore <= 100;
}
