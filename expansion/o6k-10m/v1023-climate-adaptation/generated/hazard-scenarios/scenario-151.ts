import { V1023_CLAD_clamp, V1023_CLAD_hazardBandFromScore } from '../../engine/climate-adaptation-utils.ts';
import type {
  V1023CladHazardBand,
  V1023CladRegionId,
  V1023CladHazardSnapshot,
  V1023CladAdaptationChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 151 — heat/flood/drought handoff matrix. */
export const V1023_CLAD_HAZARD_SCENARIO_151_META = {
  id: 'stress_151',
  regionId: 'ACT' as V1023CladRegionId,
  primaryChannel: 'flood_coastal' as V1023CladAdaptationChannel,
  hazardBand: 'moderate' as V1023CladHazardBand,
  seed: 138082,
} as const;

const V1023_CLAD_HAZARD_SCENARIO_151_COEF = {
  k0: 47.1000,
  k1: 96.7000,
  k2: 46.6000,
  k3: 96.2000,
  k4: 46.1000,
  k5: 95.7000,
  k6: 45.6000,
  k7: 95.2000,
  k8: 45.1000,
  k9: 94.7000,
  k10: 44.6000,
  k11: 94.2000,
  k12: 44.1000,
  k13: 93.7000,
  k14: 43.6000,
  k15: 93.2000,
  k16: 43.1000,
  k17: 92.7000,
  k18: 42.6000,
  k19: 92.2000,
  k20: 42.1000,
  k21: 91.7000,
  k22: 41.6000,
  k23: 91.2000,
  k24: 41.1000,
  k25: 90.7000,
  k26: 40.6000,
  k27: 90.2000,
  k28: 40.1000,
  k29: 89.7000,
  k30: 39.6000,
  k31: 89.2000,
  k32: 39.1000,
  k33: 88.7000,
  k34: 38.6000,
  k35: 88.2000,
  k36: 38.1000,
  k37: 87.7000,
  k38: 37.6000,
  k39: 87.2000,
  k40: 37.1000,
  k41: 86.7000,
  k42: 36.6000,
  k43: 86.2000,
  k44: 36.1000,
  k45: 85.7000,
  k46: 35.6000,
  k47: 85.2000,
  k48: 35.1000,
  k49: 84.7000,
  k50: 34.6000,
  k51: 84.2000,
  k52: 34.1000,
  k53: 83.7000,
  k54: 33.6000,
  k55: 83.2000,
  k56: 33.1000,
  k57: 82.7000,
  k58: 32.6000,
  k59: 82.2000,
  k60: 32.1000,
  k61: 81.7000,
  k62: 31.6000,
  k63: 81.2000,
  k64: 31.1000,
  k65: 80.7000,
  k66: 30.6000,
  k67: 80.2000,
  k68: 30.1000,
  k69: 79.7000,
  k70: 29.6000,
  k71: 79.2000,
} as const;

export function V1023_CLAD_HAZARD_SCENARIO_151_evaluate(turn: number): {
  heatStressIndex: number;
  droughtBufferDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1023_CLAD_HAZARD_SCENARIO_151_COEF) as Array<
    keyof typeof V1023_CLAD_HAZARD_SCENARIO_151_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1023_CLAD_HAZARD_SCENARIO_151_COEF[keys[j]] * ((turn + j) % 17);
  }
  const heatStressIndex = V1023_CLAD_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const droughtBufferDelayTurns = V1023_CLAD_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1023_CLAD_clamp(90 - heatStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1023_CLAD_hazardBandFromScore(resilienceScore) !== 'fragile';
  return { heatStressIndex, droughtBufferDelayTurns, resilienceScore, stable };
}

export function V1023_CLAD_HAZARD_SCENARIO_151_snapshot(turn: number): V1023CladHazardSnapshot {
  const r = V1023_CLAD_HAZARD_SCENARIO_151_evaluate(turn);
  return {
    scenarioId: V1023_CLAD_HAZARD_SCENARIO_151_META.id,
    regionId: V1023_CLAD_HAZARD_SCENARIO_151_META.regionId,
    adaptationChannel: V1023_CLAD_HAZARD_SCENARIO_151_META.primaryChannel,
    hazardBand: V1023_CLAD_HAZARD_SCENARIO_151_META.hazardBand,
    heatStressIndex: r.heatStressIndex,
    droughtBufferDelayTurns: r.droughtBufferDelayTurns,
    resilienceScore: r.resilienceScore,
    hazardBand: V1023_CLAD_hazardBandFromScore(r.resilienceScore),
  };
}

export function V1023_CLAD_HAZARD_SCENARIO_151_regressionAssert(turn: number): boolean {
  const r = V1023_CLAD_HAZARD_SCENARIO_151_evaluate(turn);
  return typeof r.heatStressIndex === 'number' && r.resilienceScore <= 100;
}
