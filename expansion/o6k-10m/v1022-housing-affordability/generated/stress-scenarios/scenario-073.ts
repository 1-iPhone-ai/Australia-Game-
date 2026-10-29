import { V1022_HAFF_clamp, V1022_HAFF_tenureBandFromScore } from '../../engine/housing-affordability-utils.ts';
import type {
  V1022HaffStressBand,
  V1022HaffRegionId,
  V1022HaffStressSnapshot,
  V1022HaffHousingTenure,
} from '../../types/core.ts';

/** Generated stress scenario 073 — rent/mortgage/social handoff matrix. */
export const V1022_HAFF_STRESS_SCENARIO_073_META = {
  id: 'stress_073',
  regionId: 'VIC' as V1022HaffRegionId,
  primaryTenure: 'build_to_rent' as V1022HaffHousingTenure,
  stressBand: 'critical' as V1022HaffStressBand,
  seed: 67024,
} as const;

const V1022_HAFF_STRESS_SCENARIO_073_COEF = {
  k0: 48.1000,
  k1: 70.6000,
  k2: 93.1000,
  k3: 15.9000,
  k4: 38.4000,
  k5: 60.9000,
  k6: 83.4000,
  k7: 6.2000,
  k8: 28.7000,
  k9: 51.2000,
  k10: 73.7000,
  k11: 96.2000,
  k12: 19.0000,
  k13: 41.5000,
  k14: 64.0000,
  k15: 86.5000,
  k16: 9.3000,
  k17: 31.8000,
  k18: 54.3000,
  k19: 76.8000,
  k20: 99.3000,
  k21: 22.1000,
  k22: 44.6000,
  k23: 67.1000,
  k24: 89.6000,
  k25: 12.4000,
  k26: 34.9000,
  k27: 57.4000,
  k28: 79.9000,
  k29: 2.7000,
  k30: 25.2000,
  k31: 47.7000,
  k32: 70.2000,
  k33: 92.7000,
  k34: 15.5000,
  k35: 38.0000,
  k36: 60.5000,
  k37: 83.0000,
  k38: 5.8000,
  k39: 28.3000,
  k40: 50.8000,
  k41: 73.3000,
  k42: 95.8000,
  k43: 18.6000,
  k44: 41.1000,
  k45: 63.6000,
  k46: 86.1000,
  k47: 8.9000,
  k48: 31.4000,
  k49: 53.9000,
  k50: 76.4000,
  k51: 98.9000,
  k52: 21.7000,
  k53: 44.2000,
  k54: 66.7000,
  k55: 89.2000,
  k56: 12.0000,
  k57: 34.5000,
  k58: 57.0000,
  k59: 79.5000,
  k60: 2.3000,
  k61: 24.8000,
  k62: 47.3000,
  k63: 69.8000,
  k64: 92.3000,
  k65: 15.1000,
  k66: 37.6000,
  k67: 60.1000,
  k68: 82.6000,
  k69: 5.4000,
  k70: 27.9000,
  k71: 50.4000,
} as const;

export function V1022_HAFF_STRESS_SCENARIO_073_evaluate(turn: number): {
  rentStressIndex: number;
  supplyPipelineDelayTurns: number;
  affordabilityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1022_HAFF_STRESS_SCENARIO_073_COEF) as Array<
    keyof typeof V1022_HAFF_STRESS_SCENARIO_073_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1022_HAFF_STRESS_SCENARIO_073_COEF[keys[j]] * ((turn + j) % 17);
  }
  const rentStressIndex = V1022_HAFF_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const supplyPipelineDelayTurns = V1022_HAFF_clamp(2 + (acc % 11), 1, 18);
  const affordabilityScore = V1022_HAFF_clamp(90 - rentStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1022_HAFF_tenureBandFromScore(affordabilityScore) !== 'fragile';
  return { rentStressIndex, supplyPipelineDelayTurns, affordabilityScore, stable };
}

export function V1022_HAFF_STRESS_SCENARIO_073_snapshot(turn: number): V1022HaffStressSnapshot {
  const r = V1022_HAFF_STRESS_SCENARIO_073_evaluate(turn);
  return {
    scenarioId: V1022_HAFF_STRESS_SCENARIO_073_META.id,
    regionId: V1022_HAFF_STRESS_SCENARIO_073_META.regionId,
    housingTenure: V1022_HAFF_STRESS_SCENARIO_073_META.primaryTenure,
    stressBand: V1022_HAFF_STRESS_SCENARIO_073_META.stressBand,
    rentStressIndex: r.rentStressIndex,
    supplyPipelineDelayTurns: r.supplyPipelineDelayTurns,
    affordabilityScore: r.affordabilityScore,
    tenureBand: V1022_HAFF_tenureBandFromScore(r.affordabilityScore),
  };
}

export function V1022_HAFF_STRESS_SCENARIO_073_regressionAssert(turn: number): boolean {
  const r = V1022_HAFF_STRESS_SCENARIO_073_evaluate(turn);
  return typeof r.rentStressIndex === 'number' && r.affordabilityScore <= 100;
}
