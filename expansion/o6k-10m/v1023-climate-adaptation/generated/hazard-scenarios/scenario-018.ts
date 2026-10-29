import { V1023_CLAD_clamp, V1023_CLAD_hazardBandFromScore } from '../../engine/climate-adaptation-utils.ts';
import type {
  V1023CladHazardBand,
  V1023CladRegionId,
  V1023CladHazardSnapshot,
  V1023CladAdaptationChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 018 — heat/flood/drought handoff matrix. */
export const V1023_CLAD_HAZARD_SCENARIO_018_META = {
  id: 'stress_018',
  regionId: 'QLD' as V1023CladRegionId,
  primaryChannel: 'regional' as V1023CladAdaptationChannel,
  hazardBand: 'critical' as V1023CladHazardBand,
  seed: 16919,
} as const;

const V1023_CLAD_HAZARD_SCENARIO_018_COEF = {
  k0: 66.7000,
  k1: 63.7000,
  k2: 60.7000,
  k3: 57.7000,
  k4: 54.7000,
  k5: 51.7000,
  k6: 48.7000,
  k7: 45.7000,
  k8: 42.7000,
  k9: 39.7000,
  k10: 36.7000,
  k11: 33.7000,
  k12: 30.7000,
  k13: 27.7000,
  k14: 24.7000,
  k15: 21.7000,
  k16: 18.7000,
  k17: 15.7000,
  k18: 12.7000,
  k19: 9.7000,
  k20: 6.7000,
  k21: 3.7000,
  k22: 0.7000,
  k23: 97.4000,
  k24: 94.4000,
  k25: 91.4000,
  k26: 88.4000,
  k27: 85.4000,
  k28: 82.4000,
  k29: 79.4000,
  k30: 76.4000,
  k31: 73.4000,
  k32: 70.4000,
  k33: 67.4000,
  k34: 64.4000,
  k35: 61.4000,
  k36: 58.4000,
  k37: 55.4000,
  k38: 52.4000,
  k39: 49.4000,
  k40: 46.4000,
  k41: 43.4000,
  k42: 40.4000,
  k43: 37.4000,
  k44: 34.4000,
  k45: 31.4000,
  k46: 28.4000,
  k47: 25.4000,
  k48: 22.4000,
  k49: 19.4000,
  k50: 16.4000,
  k51: 13.4000,
  k52: 10.4000,
  k53: 7.4000,
  k54: 4.4000,
  k55: 1.4000,
  k56: 98.1000,
  k57: 95.1000,
  k58: 92.1000,
  k59: 89.1000,
  k60: 86.1000,
  k61: 83.1000,
  k62: 80.1000,
  k63: 77.1000,
  k64: 74.1000,
  k65: 71.1000,
  k66: 68.1000,
  k67: 65.1000,
  k68: 62.1000,
  k69: 59.1000,
  k70: 56.1000,
  k71: 53.1000,
} as const;

export function V1023_CLAD_HAZARD_SCENARIO_018_evaluate(turn: number): {
  heatStressIndex: number;
  droughtBufferDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1023_CLAD_HAZARD_SCENARIO_018_COEF) as Array<
    keyof typeof V1023_CLAD_HAZARD_SCENARIO_018_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1023_CLAD_HAZARD_SCENARIO_018_COEF[keys[j]] * ((turn + j) % 17);
  }
  const heatStressIndex = V1023_CLAD_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const droughtBufferDelayTurns = V1023_CLAD_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1023_CLAD_clamp(90 - heatStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1023_CLAD_hazardBandFromScore(resilienceScore) !== 'fragile';
  return { heatStressIndex, droughtBufferDelayTurns, resilienceScore, stable };
}

export function V1023_CLAD_HAZARD_SCENARIO_018_snapshot(turn: number): V1023CladHazardSnapshot {
  const r = V1023_CLAD_HAZARD_SCENARIO_018_evaluate(turn);
  return {
    scenarioId: V1023_CLAD_HAZARD_SCENARIO_018_META.id,
    regionId: V1023_CLAD_HAZARD_SCENARIO_018_META.regionId,
    adaptationChannel: V1023_CLAD_HAZARD_SCENARIO_018_META.primaryChannel,
    hazardBand: V1023_CLAD_HAZARD_SCENARIO_018_META.hazardBand,
    heatStressIndex: r.heatStressIndex,
    droughtBufferDelayTurns: r.droughtBufferDelayTurns,
    resilienceScore: r.resilienceScore,
    hazardBand: V1023_CLAD_hazardBandFromScore(r.resilienceScore),
  };
}

export function V1023_CLAD_HAZARD_SCENARIO_018_regressionAssert(turn: number): boolean {
  const r = V1023_CLAD_HAZARD_SCENARIO_018_evaluate(turn);
  return typeof r.heatStressIndex === 'number' && r.resilienceScore <= 100;
}
