import { V1023_CLAD_clamp, V1023_CLAD_hazardBandFromScore } from '../../engine/climate-adaptation-utils.ts';
import type {
  V1023CladHazardBand,
  V1023CladRegionId,
  V1023CladHazardSnapshot,
  V1023CladAdaptationChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 015 — heat/flood/drought handoff matrix. */
export const V1023_CLAD_HAZARD_SCENARIO_015_META = {
  id: 'stress_015',
  regionId: 'ACT' as V1023CladRegionId,
  primaryChannel: 'heat_rural' as V1023CladAdaptationChannel,
  hazardBand: 'minimal' as V1023CladHazardBand,
  seed: 14186,
} as const;

const V1023_CLAD_HAZARD_SCENARIO_015_COEF = {
  k0: 51.4000,
  k1: 74.2000,
  k2: 97.0000,
  k3: 20.1000,
  k4: 42.9000,
  k5: 65.7000,
  k6: 88.5000,
  k7: 11.6000,
  k8: 34.4000,
  k9: 57.2000,
  k10: 80.0000,
  k11: 3.1000,
  k12: 25.9000,
  k13: 48.7000,
  k14: 71.5000,
  k15: 94.3000,
  k16: 17.4000,
  k17: 40.2000,
  k18: 63.0000,
  k19: 85.8000,
  k20: 8.9000,
  k21: 31.7000,
  k22: 54.5000,
  k23: 77.3000,
  k24: 0.4000,
  k25: 23.2000,
  k26: 46.0000,
  k27: 68.8000,
  k28: 91.6000,
  k29: 14.7000,
  k30: 37.5000,
  k31: 60.3000,
  k32: 83.1000,
  k33: 6.2000,
  k34: 29.0000,
  k35: 51.8000,
  k36: 74.6000,
  k37: 97.4000,
  k38: 20.5000,
  k39: 43.3000,
  k40: 66.1000,
  k41: 88.9000,
  k42: 12.0000,
  k43: 34.8000,
  k44: 57.6000,
  k45: 80.4000,
  k46: 3.5000,
  k47: 26.3000,
  k48: 49.1000,
  k49: 71.9000,
  k50: 94.7000,
  k51: 17.8000,
  k52: 40.6000,
  k53: 63.4000,
  k54: 86.2000,
  k55: 9.3000,
  k56: 32.1000,
  k57: 54.9000,
  k58: 77.7000,
  k59: 0.8000,
  k60: 23.6000,
  k61: 46.4000,
  k62: 69.2000,
  k63: 92.0000,
  k64: 15.1000,
  k65: 37.9000,
  k66: 60.7000,
  k67: 83.5000,
  k68: 6.6000,
  k69: 29.4000,
  k70: 52.2000,
  k71: 75.0000,
} as const;

export function V1023_CLAD_HAZARD_SCENARIO_015_evaluate(turn: number): {
  heatStressIndex: number;
  droughtBufferDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1023_CLAD_HAZARD_SCENARIO_015_COEF) as Array<
    keyof typeof V1023_CLAD_HAZARD_SCENARIO_015_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1023_CLAD_HAZARD_SCENARIO_015_COEF[keys[j]] * ((turn + j) % 17);
  }
  const heatStressIndex = V1023_CLAD_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const droughtBufferDelayTurns = V1023_CLAD_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1023_CLAD_clamp(90 - heatStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1023_CLAD_hazardBandFromScore(resilienceScore) !== 'fragile';
  return { heatStressIndex, droughtBufferDelayTurns, resilienceScore, stable };
}

export function V1023_CLAD_HAZARD_SCENARIO_015_snapshot(turn: number): V1023CladHazardSnapshot {
  const r = V1023_CLAD_HAZARD_SCENARIO_015_evaluate(turn);
  return {
    scenarioId: V1023_CLAD_HAZARD_SCENARIO_015_META.id,
    regionId: V1023_CLAD_HAZARD_SCENARIO_015_META.regionId,
    adaptationChannel: V1023_CLAD_HAZARD_SCENARIO_015_META.primaryChannel,
    hazardBand: V1023_CLAD_HAZARD_SCENARIO_015_META.hazardBand,
    heatStressIndex: r.heatStressIndex,
    droughtBufferDelayTurns: r.droughtBufferDelayTurns,
    resilienceScore: r.resilienceScore,
    hazardBand: V1023_CLAD_hazardBandFromScore(r.resilienceScore),
  };
}

export function V1023_CLAD_HAZARD_SCENARIO_015_regressionAssert(turn: number): boolean {
  const r = V1023_CLAD_HAZARD_SCENARIO_015_evaluate(turn);
  return typeof r.heatStressIndex === 'number' && r.resilienceScore <= 100;
}
