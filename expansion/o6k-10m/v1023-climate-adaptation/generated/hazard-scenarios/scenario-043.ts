import { V1023_CLAD_clamp, V1023_CLAD_hazardBandFromScore } from '../../engine/climate-adaptation-utils.ts';
import type {
  V1023CladHazardBand,
  V1023CladRegionId,
  V1023CladHazardSnapshot,
  V1023CladAdaptationChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 043 — heat/flood/drought handoff matrix. */
export const V1023_CLAD_HAZARD_SCENARIO_043_META = {
  id: 'stress_043',
  regionId: 'WA' as V1023CladRegionId,
  primaryChannel: 'fire_interface' as V1023CladAdaptationChannel,
  hazardBand: 'critical' as V1023CladHazardBand,
  seed: 39694,
} as const;

const V1023_CLAD_HAZARD_SCENARIO_043_COEF = {
  k0: 94.5000,
  k1: 75.9000,
  k2: 57.3000,
  k3: 38.7000,
  k4: 20.1000,
  k5: 1.5000,
  k6: 82.6000,
  k7: 64.0000,
  k8: 45.4000,
  k9: 26.8000,
  k10: 8.2000,
  k11: 89.3000,
  k12: 70.7000,
  k13: 52.1000,
  k14: 33.5000,
  k15: 14.9000,
  k16: 96.0000,
  k17: 77.4000,
  k18: 58.8000,
  k19: 40.2000,
  k20: 21.6000,
  k21: 3.0000,
  k22: 84.1000,
  k23: 65.5000,
  k24: 46.9000,
  k25: 28.3000,
  k26: 9.7000,
  k27: 90.8000,
  k28: 72.2000,
  k29: 53.6000,
  k30: 35.0000,
  k31: 16.4000,
  k32: 97.5000,
  k33: 78.9000,
  k34: 60.3000,
  k35: 41.7000,
  k36: 23.1000,
  k37: 4.5000,
  k38: 85.6000,
  k39: 67.0000,
  k40: 48.4000,
  k41: 29.8000,
  k42: 11.2000,
  k43: 92.3000,
  k44: 73.7000,
  k45: 55.1000,
  k46: 36.5000,
  k47: 17.9000,
  k48: 99.0000,
  k49: 80.4000,
  k50: 61.8000,
  k51: 43.2000,
  k52: 24.6000,
  k53: 6.0000,
  k54: 87.1000,
  k55: 68.5000,
  k56: 49.9000,
  k57: 31.3000,
  k58: 12.7000,
  k59: 93.8000,
  k60: 75.2000,
  k61: 56.6000,
  k62: 38.0000,
  k63: 19.4000,
  k64: 0.8000,
  k65: 81.9000,
  k66: 63.3000,
  k67: 44.7000,
  k68: 26.1000,
  k69: 7.5000,
  k70: 88.6000,
  k71: 70.0000,
} as const;

export function V1023_CLAD_HAZARD_SCENARIO_043_evaluate(turn: number): {
  heatStressIndex: number;
  droughtBufferDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1023_CLAD_HAZARD_SCENARIO_043_COEF) as Array<
    keyof typeof V1023_CLAD_HAZARD_SCENARIO_043_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1023_CLAD_HAZARD_SCENARIO_043_COEF[keys[j]] * ((turn + j) % 17);
  }
  const heatStressIndex = V1023_CLAD_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const droughtBufferDelayTurns = V1023_CLAD_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1023_CLAD_clamp(90 - heatStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1023_CLAD_hazardBandFromScore(resilienceScore) !== 'fragile';
  return { heatStressIndex, droughtBufferDelayTurns, resilienceScore, stable };
}

export function V1023_CLAD_HAZARD_SCENARIO_043_snapshot(turn: number): V1023CladHazardSnapshot {
  const r = V1023_CLAD_HAZARD_SCENARIO_043_evaluate(turn);
  return {
    scenarioId: V1023_CLAD_HAZARD_SCENARIO_043_META.id,
    regionId: V1023_CLAD_HAZARD_SCENARIO_043_META.regionId,
    adaptationChannel: V1023_CLAD_HAZARD_SCENARIO_043_META.primaryChannel,
    hazardBand: V1023_CLAD_HAZARD_SCENARIO_043_META.hazardBand,
    heatStressIndex: r.heatStressIndex,
    droughtBufferDelayTurns: r.droughtBufferDelayTurns,
    resilienceScore: r.resilienceScore,
    hazardBand: V1023_CLAD_hazardBandFromScore(r.resilienceScore),
  };
}

export function V1023_CLAD_HAZARD_SCENARIO_043_regressionAssert(turn: number): boolean {
  const r = V1023_CLAD_HAZARD_SCENARIO_043_evaluate(turn);
  return typeof r.heatStressIndex === 'number' && r.resilienceScore <= 100;
}
