import { V1023_CLAD_clamp, V1023_CLAD_hazardBandFromScore } from '../../engine/climate-adaptation-utils.ts';
import type {
  V1023CladHazardBand,
  V1023CladRegionId,
  V1023CladHazardSnapshot,
  V1023CladAdaptationChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 026 — heat/flood/drought handoff matrix. */
export const V1023_CLAD_HAZARD_SCENARIO_026_META = {
  id: 'stress_026',
  regionId: 'QLD' as V1023CladRegionId,
  primaryChannel: 'water_stress' as V1023CladAdaptationChannel,
  hazardBand: 'moderate' as V1023CladHazardBand,
  seed: 24207,
} as const;

const V1023_CLAD_HAZARD_SCENARIO_026_COEF = {
  k0: 7.8000,
  k1: 35.7000,
  k2: 63.6000,
  k3: 91.5000,
  k4: 19.7000,
  k5: 47.6000,
  k6: 75.5000,
  k7: 3.7000,
  k8: 31.6000,
  k9: 59.5000,
  k10: 87.4000,
  k11: 15.6000,
  k12: 43.5000,
  k13: 71.4000,
  k14: 99.3000,
  k15: 27.5000,
  k16: 55.4000,
  k17: 83.3000,
  k18: 11.5000,
  k19: 39.4000,
  k20: 67.3000,
  k21: 95.2000,
  k22: 23.4000,
  k23: 51.3000,
  k24: 79.2000,
  k25: 7.4000,
  k26: 35.3000,
  k27: 63.2000,
  k28: 91.1000,
  k29: 19.3000,
  k30: 47.2000,
  k31: 75.1000,
  k32: 3.3000,
  k33: 31.2000,
  k34: 59.1000,
  k35: 87.0000,
  k36: 15.2000,
  k37: 43.1000,
  k38: 71.0000,
  k39: 98.9000,
  k40: 27.1000,
  k41: 55.0000,
  k42: 82.9000,
  k43: 11.1000,
  k44: 39.0000,
  k45: 66.9000,
  k46: 94.8000,
  k47: 23.0000,
  k48: 50.9000,
  k49: 78.8000,
  k50: 7.0000,
  k51: 34.9000,
  k52: 62.8000,
  k53: 90.7000,
  k54: 18.9000,
  k55: 46.8000,
  k56: 74.7000,
  k57: 2.9000,
  k58: 30.8000,
  k59: 58.7000,
  k60: 86.6000,
  k61: 14.8000,
  k62: 42.7000,
  k63: 70.6000,
  k64: 98.5000,
  k65: 26.7000,
  k66: 54.6000,
  k67: 82.5000,
  k68: 10.7000,
  k69: 38.6000,
  k70: 66.5000,
  k71: 94.4000,
} as const;

export function V1023_CLAD_HAZARD_SCENARIO_026_evaluate(turn: number): {
  heatStressIndex: number;
  droughtBufferDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1023_CLAD_HAZARD_SCENARIO_026_COEF) as Array<
    keyof typeof V1023_CLAD_HAZARD_SCENARIO_026_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1023_CLAD_HAZARD_SCENARIO_026_COEF[keys[j]] * ((turn + j) % 17);
  }
  const heatStressIndex = V1023_CLAD_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const droughtBufferDelayTurns = V1023_CLAD_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1023_CLAD_clamp(90 - heatStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1023_CLAD_hazardBandFromScore(resilienceScore) !== 'fragile';
  return { heatStressIndex, droughtBufferDelayTurns, resilienceScore, stable };
}

export function V1023_CLAD_HAZARD_SCENARIO_026_snapshot(turn: number): V1023CladHazardSnapshot {
  const r = V1023_CLAD_HAZARD_SCENARIO_026_evaluate(turn);
  return {
    scenarioId: V1023_CLAD_HAZARD_SCENARIO_026_META.id,
    regionId: V1023_CLAD_HAZARD_SCENARIO_026_META.regionId,
    adaptationChannel: V1023_CLAD_HAZARD_SCENARIO_026_META.primaryChannel,
    hazardBand: V1023_CLAD_HAZARD_SCENARIO_026_META.hazardBand,
    heatStressIndex: r.heatStressIndex,
    droughtBufferDelayTurns: r.droughtBufferDelayTurns,
    resilienceScore: r.resilienceScore,
    hazardBand: V1023_CLAD_hazardBandFromScore(r.resilienceScore),
  };
}

export function V1023_CLAD_HAZARD_SCENARIO_026_regressionAssert(turn: number): boolean {
  const r = V1023_CLAD_HAZARD_SCENARIO_026_evaluate(turn);
  return typeof r.heatStressIndex === 'number' && r.resilienceScore <= 100;
}
