import { V1023_CLAD_clamp, V1023_CLAD_hazardBandFromScore } from '../../engine/climate-adaptation-utils.ts';
import type {
  V1023CladHazardBand,
  V1023CladRegionId,
  V1023CladHazardSnapshot,
  V1023CladAdaptationChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 047 — heat/flood/drought handoff matrix. */
export const V1023_CLAD_HAZARD_SCENARIO_047_META = {
  id: 'stress_047',
  regionId: 'ACT' as V1023CladRegionId,
  primaryChannel: 'coastal_erosion' as V1023CladAdaptationChannel,
  hazardBand: 'elevated' as V1023CladHazardBand,
  seed: 43338,
} as const;

const V1023_CLAD_HAZARD_SCENARIO_047_COEF = {
  k0: 15.2000,
  k1: 61.9000,
  k2: 8.9000,
  k3: 55.6000,
  k4: 2.6000,
  k5: 49.3000,
  k6: 96.0000,
  k7: 43.0000,
  k8: 89.7000,
  k9: 36.7000,
  k10: 83.4000,
  k11: 30.4000,
  k12: 77.1000,
  k13: 24.1000,
  k14: 70.8000,
  k15: 17.8000,
  k16: 64.5000,
  k17: 11.5000,
  k18: 58.2000,
  k19: 5.2000,
  k20: 51.9000,
  k21: 98.6000,
  k22: 45.6000,
  k23: 92.3000,
  k24: 39.3000,
  k25: 86.0000,
  k26: 33.0000,
  k27: 79.7000,
  k28: 26.7000,
  k29: 73.4000,
  k30: 20.4000,
  k31: 67.1000,
  k32: 14.1000,
  k33: 60.8000,
  k34: 7.8000,
  k35: 54.5000,
  k36: 1.5000,
  k37: 48.2000,
  k38: 94.9000,
  k39: 41.9000,
  k40: 88.6000,
  k41: 35.6000,
  k42: 82.3000,
  k43: 29.3000,
  k44: 76.0000,
  k45: 23.0000,
  k46: 69.7000,
  k47: 16.7000,
  k48: 63.4000,
  k49: 10.4000,
  k50: 57.1000,
  k51: 4.1000,
  k52: 50.8000,
  k53: 97.5000,
  k54: 44.5000,
  k55: 91.2000,
  k56: 38.2000,
  k57: 84.9000,
  k58: 31.9000,
  k59: 78.6000,
  k60: 25.6000,
  k61: 72.3000,
  k62: 19.3000,
  k63: 66.0000,
  k64: 13.0000,
  k65: 59.7000,
  k66: 6.7000,
  k67: 53.4000,
  k68: 0.4000,
  k69: 47.1000,
  k70: 93.8000,
  k71: 40.8000,
} as const;

export function V1023_CLAD_HAZARD_SCENARIO_047_evaluate(turn: number): {
  heatStressIndex: number;
  droughtBufferDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1023_CLAD_HAZARD_SCENARIO_047_COEF) as Array<
    keyof typeof V1023_CLAD_HAZARD_SCENARIO_047_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1023_CLAD_HAZARD_SCENARIO_047_COEF[keys[j]] * ((turn + j) % 17);
  }
  const heatStressIndex = V1023_CLAD_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const droughtBufferDelayTurns = V1023_CLAD_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1023_CLAD_clamp(90 - heatStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1023_CLAD_hazardBandFromScore(resilienceScore) !== 'fragile';
  return { heatStressIndex, droughtBufferDelayTurns, resilienceScore, stable };
}

export function V1023_CLAD_HAZARD_SCENARIO_047_snapshot(turn: number): V1023CladHazardSnapshot {
  const r = V1023_CLAD_HAZARD_SCENARIO_047_evaluate(turn);
  return {
    scenarioId: V1023_CLAD_HAZARD_SCENARIO_047_META.id,
    regionId: V1023_CLAD_HAZARD_SCENARIO_047_META.regionId,
    adaptationChannel: V1023_CLAD_HAZARD_SCENARIO_047_META.primaryChannel,
    hazardBand: V1023_CLAD_HAZARD_SCENARIO_047_META.hazardBand,
    heatStressIndex: r.heatStressIndex,
    droughtBufferDelayTurns: r.droughtBufferDelayTurns,
    resilienceScore: r.resilienceScore,
    hazardBand: V1023_CLAD_hazardBandFromScore(r.resilienceScore),
  };
}

export function V1023_CLAD_HAZARD_SCENARIO_047_regressionAssert(turn: number): boolean {
  const r = V1023_CLAD_HAZARD_SCENARIO_047_evaluate(turn);
  return typeof r.heatStressIndex === 'number' && r.resilienceScore <= 100;
}
