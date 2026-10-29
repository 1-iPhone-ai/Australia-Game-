import { V1023_CLAD_clamp, V1023_CLAD_hazardBandFromScore } from '../../engine/climate-adaptation-utils.ts';
import type {
  V1023CladHazardBand,
  V1023CladRegionId,
  V1023CladHazardSnapshot,
  V1023CladAdaptationChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 160 — heat/flood/drought handoff matrix. */
export const V1023_CLAD_HAZARD_SCENARIO_160_META = {
  id: 'stress_160',
  regionId: 'NSW' as V1023CladRegionId,
  primaryChannel: 'heat_urban' as V1023CladAdaptationChannel,
  hazardBand: 'minimal' as V1023CladHazardBand,
  seed: 146281,
} as const;

const V1023_CLAD_HAZARD_SCENARIO_160_COEF = {
  k0: 93.0000,
  k1: 65.2000,
  k2: 37.4000,
  k3: 9.6000,
  k4: 81.5000,
  k5: 53.7000,
  k6: 25.9000,
  k7: 97.8000,
  k8: 70.0000,
  k9: 42.2000,
  k10: 14.4000,
  k11: 86.3000,
  k12: 58.5000,
  k13: 30.7000,
  k14: 2.9000,
  k15: 74.8000,
  k16: 47.0000,
  k17: 19.2000,
  k18: 91.1000,
  k19: 63.3000,
  k20: 35.5000,
  k21: 7.7000,
  k22: 79.6000,
  k23: 51.8000,
  k24: 24.0000,
  k25: 95.9000,
  k26: 68.1000,
  k27: 40.3000,
  k28: 12.5000,
  k29: 84.4000,
  k30: 56.6000,
  k31: 28.8000,
  k32: 1.0000,
  k33: 72.9000,
  k34: 45.1000,
  k35: 17.3000,
  k36: 89.2000,
  k37: 61.4000,
  k38: 33.6000,
  k39: 5.8000,
  k40: 77.7000,
  k41: 49.9000,
  k42: 22.1000,
  k43: 94.0000,
  k44: 66.2000,
  k45: 38.4000,
  k46: 10.6000,
  k47: 82.5000,
  k48: 54.7000,
  k49: 26.9000,
  k50: 98.8000,
  k51: 71.0000,
  k52: 43.2000,
  k53: 15.4000,
  k54: 87.3000,
  k55: 59.5000,
  k56: 31.7000,
  k57: 3.9000,
  k58: 75.8000,
  k59: 48.0000,
  k60: 20.2000,
  k61: 92.1000,
  k62: 64.3000,
  k63: 36.5000,
  k64: 8.7000,
  k65: 80.6000,
  k66: 52.8000,
  k67: 25.0000,
  k68: 96.9000,
  k69: 69.1000,
  k70: 41.3000,
  k71: 13.5000,
} as const;

export function V1023_CLAD_HAZARD_SCENARIO_160_evaluate(turn: number): {
  heatStressIndex: number;
  droughtBufferDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1023_CLAD_HAZARD_SCENARIO_160_COEF) as Array<
    keyof typeof V1023_CLAD_HAZARD_SCENARIO_160_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1023_CLAD_HAZARD_SCENARIO_160_COEF[keys[j]] * ((turn + j) % 17);
  }
  const heatStressIndex = V1023_CLAD_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const droughtBufferDelayTurns = V1023_CLAD_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1023_CLAD_clamp(90 - heatStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1023_CLAD_hazardBandFromScore(resilienceScore) !== 'fragile';
  return { heatStressIndex, droughtBufferDelayTurns, resilienceScore, stable };
}

export function V1023_CLAD_HAZARD_SCENARIO_160_snapshot(turn: number): V1023CladHazardSnapshot {
  const r = V1023_CLAD_HAZARD_SCENARIO_160_evaluate(turn);
  return {
    scenarioId: V1023_CLAD_HAZARD_SCENARIO_160_META.id,
    regionId: V1023_CLAD_HAZARD_SCENARIO_160_META.regionId,
    adaptationChannel: V1023_CLAD_HAZARD_SCENARIO_160_META.primaryChannel,
    hazardBand: V1023_CLAD_HAZARD_SCENARIO_160_META.hazardBand,
    heatStressIndex: r.heatStressIndex,
    droughtBufferDelayTurns: r.droughtBufferDelayTurns,
    resilienceScore: r.resilienceScore,
    hazardBand: V1023_CLAD_hazardBandFromScore(r.resilienceScore),
  };
}

export function V1023_CLAD_HAZARD_SCENARIO_160_regressionAssert(turn: number): boolean {
  const r = V1023_CLAD_HAZARD_SCENARIO_160_evaluate(turn);
  return typeof r.heatStressIndex === 'number' && r.resilienceScore <= 100;
}
