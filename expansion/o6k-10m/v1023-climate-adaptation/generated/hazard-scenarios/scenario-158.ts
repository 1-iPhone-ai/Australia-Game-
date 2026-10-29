import { V1023_CLAD_clamp, V1023_CLAD_hazardBandFromScore } from '../../engine/climate-adaptation-utils.ts';
import type {
  V1023CladHazardBand,
  V1023CladRegionId,
  V1023CladHazardSnapshot,
  V1023CladAdaptationChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 158 — heat/flood/drought handoff matrix. */
export const V1023_CLAD_HAZARD_SCENARIO_158_META = {
  id: 'stress_158',
  regionId: 'NT' as V1023CladRegionId,
  primaryChannel: 'regional' as V1023CladAdaptationChannel,
  hazardBand: 'critical' as V1023CladHazardBand,
  seed: 144459,
} as const;

const V1023_CLAD_HAZARD_SCENARIO_158_COEF = {
  k0: 82.8000,
  k1: 72.2000,
  k2: 61.6000,
  k3: 51.0000,
  k4: 40.4000,
  k5: 29.8000,
  k6: 19.2000,
  k7: 8.6000,
  k8: 97.7000,
  k9: 87.1000,
  k10: 76.5000,
  k11: 65.9000,
  k12: 55.3000,
  k13: 44.7000,
  k14: 34.1000,
  k15: 23.5000,
  k16: 12.9000,
  k17: 2.3000,
  k18: 91.4000,
  k19: 80.8000,
  k20: 70.2000,
  k21: 59.6000,
  k22: 49.0000,
  k23: 38.4000,
  k24: 27.8000,
  k25: 17.2000,
  k26: 6.6000,
  k27: 95.7000,
  k28: 85.1000,
  k29: 74.5000,
  k30: 63.9000,
  k31: 53.3000,
  k32: 42.7000,
  k33: 32.1000,
  k34: 21.5000,
  k35: 10.9000,
  k36: 0.3000,
  k37: 89.4000,
  k38: 78.8000,
  k39: 68.2000,
  k40: 57.6000,
  k41: 47.0000,
  k42: 36.4000,
  k43: 25.8000,
  k44: 15.2000,
  k45: 4.6000,
  k46: 93.7000,
  k47: 83.1000,
  k48: 72.5000,
  k49: 61.9000,
  k50: 51.3000,
  k51: 40.7000,
  k52: 30.1000,
  k53: 19.5000,
  k54: 8.9000,
  k55: 98.0000,
  k56: 87.4000,
  k57: 76.8000,
  k58: 66.2000,
  k59: 55.6000,
  k60: 45.0000,
  k61: 34.4000,
  k62: 23.8000,
  k63: 13.2000,
  k64: 2.6000,
  k65: 91.7000,
  k66: 81.1000,
  k67: 70.5000,
  k68: 59.9000,
  k69: 49.3000,
  k70: 38.7000,
  k71: 28.1000,
} as const;

export function V1023_CLAD_HAZARD_SCENARIO_158_evaluate(turn: number): {
  heatStressIndex: number;
  droughtBufferDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1023_CLAD_HAZARD_SCENARIO_158_COEF) as Array<
    keyof typeof V1023_CLAD_HAZARD_SCENARIO_158_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1023_CLAD_HAZARD_SCENARIO_158_COEF[keys[j]] * ((turn + j) % 17);
  }
  const heatStressIndex = V1023_CLAD_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const droughtBufferDelayTurns = V1023_CLAD_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1023_CLAD_clamp(90 - heatStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1023_CLAD_hazardBandFromScore(resilienceScore) !== 'fragile';
  return { heatStressIndex, droughtBufferDelayTurns, resilienceScore, stable };
}

export function V1023_CLAD_HAZARD_SCENARIO_158_snapshot(turn: number): V1023CladHazardSnapshot {
  const r = V1023_CLAD_HAZARD_SCENARIO_158_evaluate(turn);
  return {
    scenarioId: V1023_CLAD_HAZARD_SCENARIO_158_META.id,
    regionId: V1023_CLAD_HAZARD_SCENARIO_158_META.regionId,
    adaptationChannel: V1023_CLAD_HAZARD_SCENARIO_158_META.primaryChannel,
    hazardBand: V1023_CLAD_HAZARD_SCENARIO_158_META.hazardBand,
    heatStressIndex: r.heatStressIndex,
    droughtBufferDelayTurns: r.droughtBufferDelayTurns,
    resilienceScore: r.resilienceScore,
    hazardBand: V1023_CLAD_hazardBandFromScore(r.resilienceScore),
  };
}

export function V1023_CLAD_HAZARD_SCENARIO_158_regressionAssert(turn: number): boolean {
  const r = V1023_CLAD_HAZARD_SCENARIO_158_evaluate(turn);
  return typeof r.heatStressIndex === 'number' && r.resilienceScore <= 100;
}
