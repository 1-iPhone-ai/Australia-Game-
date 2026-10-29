import { V1023_CLAD_clamp, V1023_CLAD_hazardBandFromScore } from '../../engine/climate-adaptation-utils.ts';
import type {
  V1023CladHazardBand,
  V1023CladRegionId,
  V1023CladHazardSnapshot,
  V1023CladAdaptationChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 011 — heat/flood/drought handoff matrix. */
export const V1023_CLAD_HAZARD_SCENARIO_011_META = {
  id: 'stress_011',
  regionId: 'WA' as V1023CladRegionId,
  primaryChannel: 'flood_coastal' as V1023CladAdaptationChannel,
  hazardBand: 'moderate' as V1023CladHazardBand,
  seed: 10542,
} as const;

const V1023_CLAD_HAZARD_SCENARIO_011_COEF = {
  k0: 31.0000,
  k1: 88.2000,
  k2: 45.7000,
  k3: 3.2000,
  k4: 60.4000,
  k5: 17.9000,
  k6: 75.1000,
  k7: 32.6000,
  k8: 89.8000,
  k9: 47.3000,
  k10: 4.8000,
  k11: 62.0000,
  k12: 19.5000,
  k13: 76.7000,
  k14: 34.2000,
  k15: 91.4000,
  k16: 48.9000,
  k17: 6.4000,
  k18: 63.6000,
  k19: 21.1000,
  k20: 78.3000,
  k21: 35.8000,
  k22: 93.0000,
  k23: 50.5000,
  k24: 8.0000,
  k25: 65.2000,
  k26: 22.7000,
  k27: 79.9000,
  k28: 37.4000,
  k29: 94.6000,
  k30: 52.1000,
  k31: 9.6000,
  k32: 66.8000,
  k33: 24.3000,
  k34: 81.5000,
  k35: 39.0000,
  k36: 96.2000,
  k37: 53.7000,
  k38: 11.2000,
  k39: 68.4000,
  k40: 25.9000,
  k41: 83.1000,
  k42: 40.6000,
  k43: 97.8000,
  k44: 55.3000,
  k45: 12.8000,
  k46: 70.0000,
  k47: 27.5000,
  k48: 84.7000,
  k49: 42.2000,
  k50: 99.4000,
  k51: 56.9000,
  k52: 14.4000,
  k53: 71.6000,
  k54: 29.1000,
  k55: 86.3000,
  k56: 43.8000,
  k57: 1.3000,
  k58: 58.5000,
  k59: 16.0000,
  k60: 73.2000,
  k61: 30.7000,
  k62: 87.9000,
  k63: 45.4000,
  k64: 2.9000,
  k65: 60.1000,
  k66: 17.6000,
  k67: 74.8000,
  k68: 32.3000,
  k69: 89.5000,
  k70: 47.0000,
  k71: 4.5000,
} as const;

export function V1023_CLAD_HAZARD_SCENARIO_011_evaluate(turn: number): {
  heatStressIndex: number;
  droughtBufferDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1023_CLAD_HAZARD_SCENARIO_011_COEF) as Array<
    keyof typeof V1023_CLAD_HAZARD_SCENARIO_011_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1023_CLAD_HAZARD_SCENARIO_011_COEF[keys[j]] * ((turn + j) % 17);
  }
  const heatStressIndex = V1023_CLAD_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const droughtBufferDelayTurns = V1023_CLAD_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1023_CLAD_clamp(90 - heatStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1023_CLAD_hazardBandFromScore(resilienceScore) !== 'fragile';
  return { heatStressIndex, droughtBufferDelayTurns, resilienceScore, stable };
}

export function V1023_CLAD_HAZARD_SCENARIO_011_snapshot(turn: number): V1023CladHazardSnapshot {
  const r = V1023_CLAD_HAZARD_SCENARIO_011_evaluate(turn);
  return {
    scenarioId: V1023_CLAD_HAZARD_SCENARIO_011_META.id,
    regionId: V1023_CLAD_HAZARD_SCENARIO_011_META.regionId,
    adaptationChannel: V1023_CLAD_HAZARD_SCENARIO_011_META.primaryChannel,
    hazardBand: V1023_CLAD_HAZARD_SCENARIO_011_META.hazardBand,
    heatStressIndex: r.heatStressIndex,
    droughtBufferDelayTurns: r.droughtBufferDelayTurns,
    resilienceScore: r.resilienceScore,
    hazardBand: V1023_CLAD_hazardBandFromScore(r.resilienceScore),
  };
}

export function V1023_CLAD_HAZARD_SCENARIO_011_regressionAssert(turn: number): boolean {
  const r = V1023_CLAD_HAZARD_SCENARIO_011_evaluate(turn);
  return typeof r.heatStressIndex === 'number' && r.resilienceScore <= 100;
}
