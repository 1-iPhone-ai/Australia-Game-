import { V1023_CLAD_clamp, V1023_CLAD_hazardBandFromScore } from '../../engine/climate-adaptation-utils.ts';
import type {
  V1023CladHazardBand,
  V1023CladRegionId,
  V1023CladHazardSnapshot,
  V1023CladAdaptationChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 159 — heat/flood/drought handoff matrix. */
export const V1023_CLAD_HAZARD_SCENARIO_159_META = {
  id: 'stress_159',
  regionId: 'ACT' as V1023CladRegionId,
  primaryChannel: 'remote' as V1023CladAdaptationChannel,
  hazardBand: 'recovering' as V1023CladHazardBand,
  seed: 145370,
} as const;

const V1023_CLAD_HAZARD_SCENARIO_159_COEF = {
  k0: 87.9000,
  k1: 68.7000,
  k2: 49.5000,
  k3: 30.3000,
  k4: 11.1000,
  k5: 91.6000,
  k6: 72.4000,
  k7: 53.2000,
  k8: 34.0000,
  k9: 14.8000,
  k10: 95.3000,
  k11: 76.1000,
  k12: 56.9000,
  k13: 37.7000,
  k14: 18.5000,
  k15: 99.0000,
  k16: 79.8000,
  k17: 60.6000,
  k18: 41.4000,
  k19: 22.2000,
  k20: 3.0000,
  k21: 83.5000,
  k22: 64.3000,
  k23: 45.1000,
  k24: 25.9000,
  k25: 6.7000,
  k26: 87.2000,
  k27: 68.0000,
  k28: 48.8000,
  k29: 29.6000,
  k30: 10.4000,
  k31: 90.9000,
  k32: 71.7000,
  k33: 52.5000,
  k34: 33.3000,
  k35: 14.1000,
  k36: 94.6000,
  k37: 75.4000,
  k38: 56.2000,
  k39: 37.0000,
  k40: 17.8000,
  k41: 98.3000,
  k42: 79.1000,
  k43: 59.9000,
  k44: 40.7000,
  k45: 21.5000,
  k46: 2.3000,
  k47: 82.8000,
  k48: 63.6000,
  k49: 44.4000,
  k50: 25.2000,
  k51: 6.0000,
  k52: 86.5000,
  k53: 67.3000,
  k54: 48.1000,
  k55: 28.9000,
  k56: 9.7000,
  k57: 90.2000,
  k58: 71.0000,
  k59: 51.8000,
  k60: 32.6000,
  k61: 13.4000,
  k62: 93.9000,
  k63: 74.7000,
  k64: 55.5000,
  k65: 36.3000,
  k66: 17.1000,
  k67: 97.6000,
  k68: 78.4000,
  k69: 59.2000,
  k70: 40.0000,
  k71: 20.8000,
} as const;

export function V1023_CLAD_HAZARD_SCENARIO_159_evaluate(turn: number): {
  heatStressIndex: number;
  droughtBufferDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1023_CLAD_HAZARD_SCENARIO_159_COEF) as Array<
    keyof typeof V1023_CLAD_HAZARD_SCENARIO_159_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1023_CLAD_HAZARD_SCENARIO_159_COEF[keys[j]] * ((turn + j) % 17);
  }
  const heatStressIndex = V1023_CLAD_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const droughtBufferDelayTurns = V1023_CLAD_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1023_CLAD_clamp(90 - heatStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1023_CLAD_hazardBandFromScore(resilienceScore) !== 'fragile';
  return { heatStressIndex, droughtBufferDelayTurns, resilienceScore, stable };
}

export function V1023_CLAD_HAZARD_SCENARIO_159_snapshot(turn: number): V1023CladHazardSnapshot {
  const r = V1023_CLAD_HAZARD_SCENARIO_159_evaluate(turn);
  return {
    scenarioId: V1023_CLAD_HAZARD_SCENARIO_159_META.id,
    regionId: V1023_CLAD_HAZARD_SCENARIO_159_META.regionId,
    adaptationChannel: V1023_CLAD_HAZARD_SCENARIO_159_META.primaryChannel,
    hazardBand: V1023_CLAD_HAZARD_SCENARIO_159_META.hazardBand,
    heatStressIndex: r.heatStressIndex,
    droughtBufferDelayTurns: r.droughtBufferDelayTurns,
    resilienceScore: r.resilienceScore,
    hazardBand: V1023_CLAD_hazardBandFromScore(r.resilienceScore),
  };
}

export function V1023_CLAD_HAZARD_SCENARIO_159_regressionAssert(turn: number): boolean {
  const r = V1023_CLAD_HAZARD_SCENARIO_159_evaluate(turn);
  return typeof r.heatStressIndex === 'number' && r.resilienceScore <= 100;
}
