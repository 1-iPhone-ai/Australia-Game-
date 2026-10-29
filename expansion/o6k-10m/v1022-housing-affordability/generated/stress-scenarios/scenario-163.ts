import { V1022_HAFF_clamp, V1022_HAFF_tenureBandFromScore } from '../../engine/housing-affordability-utils.ts';
import type {
  V1022HaffStressBand,
  V1022HaffRegionId,
  V1022HaffStressSnapshot,
  V1022HaffHousingTenure,
} from '../../types/core.ts';

/** Generated stress scenario 163 — rent/mortgage/social handoff matrix. */
export const V1022_HAFF_STRESS_SCENARIO_163_META = {
  id: 'stress_163',
  regionId: 'WA' as V1022HaffRegionId,
  primaryTenure: 'build_to_rent' as V1022HaffHousingTenure,
  stressBand: 'critical' as V1022HaffStressBand,
  seed: 149014,
} as const;

const V1022_HAFF_STRESS_SCENARIO_163_COEF = {
  k0: 8.6000,
  k1: 54.7000,
  k2: 1.1000,
  k3: 47.2000,
  k4: 93.3000,
  k5: 39.7000,
  k6: 85.8000,
  k7: 32.2000,
  k8: 78.3000,
  k9: 24.7000,
  k10: 70.8000,
  k11: 17.2000,
  k12: 63.3000,
  k13: 9.7000,
  k14: 55.8000,
  k15: 2.2000,
  k16: 48.3000,
  k17: 94.4000,
  k18: 40.8000,
  k19: 86.9000,
  k20: 33.3000,
  k21: 79.4000,
  k22: 25.8000,
  k23: 71.9000,
  k24: 18.3000,
  k25: 64.4000,
  k26: 10.8000,
  k27: 56.9000,
  k28: 3.3000,
  k29: 49.4000,
  k30: 95.5000,
  k31: 41.9000,
  k32: 88.0000,
  k33: 34.4000,
  k34: 80.5000,
  k35: 26.9000,
  k36: 73.0000,
  k37: 19.4000,
  k38: 65.5000,
  k39: 11.9000,
  k40: 58.0000,
  k41: 4.4000,
  k42: 50.5000,
  k43: 96.6000,
  k44: 43.0000,
  k45: 89.1000,
  k46: 35.5000,
  k47: 81.6000,
  k48: 28.0000,
  k49: 74.1000,
  k50: 20.5000,
  k51: 66.6000,
  k52: 13.0000,
  k53: 59.1000,
  k54: 5.5000,
  k55: 51.6000,
  k56: 97.7000,
  k57: 44.1000,
  k58: 90.2000,
  k59: 36.6000,
  k60: 82.7000,
  k61: 29.1000,
  k62: 75.2000,
  k63: 21.6000,
  k64: 67.7000,
  k65: 14.1000,
  k66: 60.2000,
  k67: 6.6000,
  k68: 52.7000,
  k69: 98.8000,
  k70: 45.2000,
  k71: 91.3000,
} as const;

export function V1022_HAFF_STRESS_SCENARIO_163_evaluate(turn: number): {
  rentStressIndex: number;
  supplyPipelineDelayTurns: number;
  affordabilityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1022_HAFF_STRESS_SCENARIO_163_COEF) as Array<
    keyof typeof V1022_HAFF_STRESS_SCENARIO_163_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1022_HAFF_STRESS_SCENARIO_163_COEF[keys[j]] * ((turn + j) % 17);
  }
  const rentStressIndex = V1022_HAFF_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const supplyPipelineDelayTurns = V1022_HAFF_clamp(2 + (acc % 11), 1, 18);
  const affordabilityScore = V1022_HAFF_clamp(90 - rentStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1022_HAFF_tenureBandFromScore(affordabilityScore) !== 'fragile';
  return { rentStressIndex, supplyPipelineDelayTurns, affordabilityScore, stable };
}

export function V1022_HAFF_STRESS_SCENARIO_163_snapshot(turn: number): V1022HaffStressSnapshot {
  const r = V1022_HAFF_STRESS_SCENARIO_163_evaluate(turn);
  return {
    scenarioId: V1022_HAFF_STRESS_SCENARIO_163_META.id,
    regionId: V1022_HAFF_STRESS_SCENARIO_163_META.regionId,
    housingTenure: V1022_HAFF_STRESS_SCENARIO_163_META.primaryTenure,
    stressBand: V1022_HAFF_STRESS_SCENARIO_163_META.stressBand,
    rentStressIndex: r.rentStressIndex,
    supplyPipelineDelayTurns: r.supplyPipelineDelayTurns,
    affordabilityScore: r.affordabilityScore,
    tenureBand: V1022_HAFF_tenureBandFromScore(r.affordabilityScore),
  };
}

export function V1022_HAFF_STRESS_SCENARIO_163_regressionAssert(turn: number): boolean {
  const r = V1022_HAFF_STRESS_SCENARIO_163_evaluate(turn);
  return typeof r.rentStressIndex === 'number' && r.affordabilityScore <= 100;
}
