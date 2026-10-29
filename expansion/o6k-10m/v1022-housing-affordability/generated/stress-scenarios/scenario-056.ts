import { V1022_HAFF_clamp, V1022_HAFF_tenureBandFromScore } from '../../engine/housing-affordability-utils.ts';
import type {
  V1022HaffStressBand,
  V1022HaffRegionId,
  V1022HaffStressSnapshot,
  V1022HaffHousingTenure,
} from '../../types/core.ts';

/** Generated stress scenario 056 — rent/mortgage/social handoff matrix. */
export const V1022_HAFF_STRESS_SCENARIO_056_META = {
  id: 'stress_056',
  regionId: 'NSW' as V1022HaffRegionId,
  primaryTenure: 'regional' as V1022HaffHousingTenure,
  stressBand: 'moderate' as V1022HaffStressBand,
  seed: 51537,
} as const;

const V1022_HAFF_STRESS_SCENARIO_056_COEF = {
  k0: 61.1000,
  k1: 30.4000,
  k2: 99.4000,
  k3: 68.7000,
  k4: 38.0000,
  k5: 7.3000,
  k6: 76.3000,
  k7: 45.6000,
  k8: 14.9000,
  k9: 83.9000,
  k10: 53.2000,
  k11: 22.5000,
  k12: 91.5000,
  k13: 60.8000,
  k14: 30.1000,
  k15: 99.1000,
  k16: 68.4000,
  k17: 37.7000,
  k18: 7.0000,
  k19: 76.0000,
  k20: 45.3000,
  k21: 14.6000,
  k22: 83.6000,
  k23: 52.9000,
  k24: 22.2000,
  k25: 91.2000,
  k26: 60.5000,
  k27: 29.8000,
  k28: 98.8000,
  k29: 68.1000,
  k30: 37.4000,
  k31: 6.7000,
  k32: 75.7000,
  k33: 45.0000,
  k34: 14.3000,
  k35: 83.3000,
  k36: 52.6000,
  k37: 21.9000,
  k38: 90.9000,
  k39: 60.2000,
  k40: 29.5000,
  k41: 98.5000,
  k42: 67.8000,
  k43: 37.1000,
  k44: 6.4000,
  k45: 75.4000,
  k46: 44.7000,
  k47: 14.0000,
  k48: 83.0000,
  k49: 52.3000,
  k50: 21.6000,
  k51: 90.6000,
  k52: 59.9000,
  k53: 29.2000,
  k54: 98.2000,
  k55: 67.5000,
  k56: 36.8000,
  k57: 6.1000,
  k58: 75.1000,
  k59: 44.4000,
  k60: 13.7000,
  k61: 82.7000,
  k62: 52.0000,
  k63: 21.3000,
  k64: 90.3000,
  k65: 59.6000,
  k66: 28.9000,
  k67: 97.9000,
  k68: 67.2000,
  k69: 36.5000,
  k70: 5.8000,
  k71: 74.8000,
} as const;

export function V1022_HAFF_STRESS_SCENARIO_056_evaluate(turn: number): {
  rentStressIndex: number;
  supplyPipelineDelayTurns: number;
  affordabilityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1022_HAFF_STRESS_SCENARIO_056_COEF) as Array<
    keyof typeof V1022_HAFF_STRESS_SCENARIO_056_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1022_HAFF_STRESS_SCENARIO_056_COEF[keys[j]] * ((turn + j) % 17);
  }
  const rentStressIndex = V1022_HAFF_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const supplyPipelineDelayTurns = V1022_HAFF_clamp(2 + (acc % 11), 1, 18);
  const affordabilityScore = V1022_HAFF_clamp(90 - rentStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1022_HAFF_tenureBandFromScore(affordabilityScore) !== 'fragile';
  return { rentStressIndex, supplyPipelineDelayTurns, affordabilityScore, stable };
}

export function V1022_HAFF_STRESS_SCENARIO_056_snapshot(turn: number): V1022HaffStressSnapshot {
  const r = V1022_HAFF_STRESS_SCENARIO_056_evaluate(turn);
  return {
    scenarioId: V1022_HAFF_STRESS_SCENARIO_056_META.id,
    regionId: V1022_HAFF_STRESS_SCENARIO_056_META.regionId,
    housingTenure: V1022_HAFF_STRESS_SCENARIO_056_META.primaryTenure,
    stressBand: V1022_HAFF_STRESS_SCENARIO_056_META.stressBand,
    rentStressIndex: r.rentStressIndex,
    supplyPipelineDelayTurns: r.supplyPipelineDelayTurns,
    affordabilityScore: r.affordabilityScore,
    tenureBand: V1022_HAFF_tenureBandFromScore(r.affordabilityScore),
  };
}

export function V1022_HAFF_STRESS_SCENARIO_056_regressionAssert(turn: number): boolean {
  const r = V1022_HAFF_STRESS_SCENARIO_056_evaluate(turn);
  return typeof r.rentStressIndex === 'number' && r.affordabilityScore <= 100;
}
