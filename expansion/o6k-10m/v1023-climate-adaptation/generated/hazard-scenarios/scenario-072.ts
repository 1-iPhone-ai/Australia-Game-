import { V1023_CLAD_clamp, V1023_CLAD_hazardBandFromScore } from '../../engine/climate-adaptation-utils.ts';
import type {
  V1023CladHazardBand,
  V1023CladRegionId,
  V1023CladHazardSnapshot,
  V1023CladAdaptationChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 072 — heat/flood/drought handoff matrix. */
export const V1023_CLAD_HAZARD_SCENARIO_072_META = {
  id: 'stress_072',
  regionId: 'NSW' as V1023CladRegionId,
  primaryChannel: 'drought_inland' as V1023CladAdaptationChannel,
  hazardBand: 'elevated' as V1023CladHazardBand,
  seed: 66113,
} as const;

const V1023_CLAD_HAZARD_SCENARIO_072_COEF = {
  k0: 43.0000,
  k1: 74.1000,
  k2: 5.5000,
  k3: 36.6000,
  k4: 67.7000,
  k5: 98.8000,
  k6: 30.2000,
  k7: 61.3000,
  k8: 92.4000,
  k9: 23.8000,
  k10: 54.9000,
  k11: 86.0000,
  k12: 17.4000,
  k13: 48.5000,
  k14: 79.6000,
  k15: 11.0000,
  k16: 42.1000,
  k17: 73.2000,
  k18: 4.6000,
  k19: 35.7000,
  k20: 66.8000,
  k21: 97.9000,
  k22: 29.3000,
  k23: 60.4000,
  k24: 91.5000,
  k25: 22.9000,
  k26: 54.0000,
  k27: 85.1000,
  k28: 16.5000,
  k29: 47.6000,
  k30: 78.7000,
  k31: 10.1000,
  k32: 41.2000,
  k33: 72.3000,
  k34: 3.7000,
  k35: 34.8000,
  k36: 65.9000,
  k37: 97.0000,
  k38: 28.4000,
  k39: 59.5000,
  k40: 90.6000,
  k41: 22.0000,
  k42: 53.1000,
  k43: 84.2000,
  k44: 15.6000,
  k45: 46.7000,
  k46: 77.8000,
  k47: 9.2000,
  k48: 40.3000,
  k49: 71.4000,
  k50: 2.8000,
  k51: 33.9000,
  k52: 65.0000,
  k53: 96.1000,
  k54: 27.5000,
  k55: 58.6000,
  k56: 89.7000,
  k57: 21.1000,
  k58: 52.2000,
  k59: 83.3000,
  k60: 14.7000,
  k61: 45.8000,
  k62: 76.9000,
  k63: 8.3000,
  k64: 39.4000,
  k65: 70.5000,
  k66: 1.9000,
  k67: 33.0000,
  k68: 64.1000,
  k69: 95.2000,
  k70: 26.6000,
  k71: 57.7000,
} as const;

export function V1023_CLAD_HAZARD_SCENARIO_072_evaluate(turn: number): {
  heatStressIndex: number;
  droughtBufferDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1023_CLAD_HAZARD_SCENARIO_072_COEF) as Array<
    keyof typeof V1023_CLAD_HAZARD_SCENARIO_072_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1023_CLAD_HAZARD_SCENARIO_072_COEF[keys[j]] * ((turn + j) % 17);
  }
  const heatStressIndex = V1023_CLAD_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const droughtBufferDelayTurns = V1023_CLAD_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1023_CLAD_clamp(90 - heatStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1023_CLAD_hazardBandFromScore(resilienceScore) !== 'fragile';
  return { heatStressIndex, droughtBufferDelayTurns, resilienceScore, stable };
}

export function V1023_CLAD_HAZARD_SCENARIO_072_snapshot(turn: number): V1023CladHazardSnapshot {
  const r = V1023_CLAD_HAZARD_SCENARIO_072_evaluate(turn);
  return {
    scenarioId: V1023_CLAD_HAZARD_SCENARIO_072_META.id,
    regionId: V1023_CLAD_HAZARD_SCENARIO_072_META.regionId,
    adaptationChannel: V1023_CLAD_HAZARD_SCENARIO_072_META.primaryChannel,
    hazardBand: V1023_CLAD_HAZARD_SCENARIO_072_META.hazardBand,
    heatStressIndex: r.heatStressIndex,
    droughtBufferDelayTurns: r.droughtBufferDelayTurns,
    resilienceScore: r.resilienceScore,
    hazardBand: V1023_CLAD_hazardBandFromScore(r.resilienceScore),
  };
}

export function V1023_CLAD_HAZARD_SCENARIO_072_regressionAssert(turn: number): boolean {
  const r = V1023_CLAD_HAZARD_SCENARIO_072_evaluate(turn);
  return typeof r.heatStressIndex === 'number' && r.resilienceScore <= 100;
}
