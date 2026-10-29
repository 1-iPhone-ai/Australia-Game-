import { V1023_CLAD_clamp, V1023_CLAD_hazardBandFromScore } from '../../engine/climate-adaptation-utils.ts';
import type {
  V1023CladHazardBand,
  V1023CladRegionId,
  V1023CladHazardSnapshot,
  V1023CladAdaptationChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 022 — heat/flood/drought handoff matrix. */
export const V1023_CLAD_HAZARD_SCENARIO_022_META = {
  id: 'stress_022',
  regionId: 'NT' as V1023CladRegionId,
  primaryChannel: 'drought_inland' as V1023CladAdaptationChannel,
  hazardBand: 'elevated' as V1023CladHazardBand,
  seed: 20563,
} as const;

const V1023_CLAD_HAZARD_SCENARIO_022_COEF = {
  k0: 87.1000,
  k1: 49.7000,
  k2: 12.3000,
  k3: 74.6000,
  k4: 37.2000,
  k5: 99.5000,
  k6: 62.1000,
  k7: 24.7000,
  k8: 87.0000,
  k9: 49.6000,
  k10: 12.2000,
  k11: 74.5000,
  k12: 37.1000,
  k13: 99.4000,
  k14: 62.0000,
  k15: 24.6000,
  k16: 86.9000,
  k17: 49.5000,
  k18: 12.1000,
  k19: 74.4000,
  k20: 37.0000,
  k21: 99.3000,
  k22: 61.9000,
  k23: 24.5000,
  k24: 86.8000,
  k25: 49.4000,
  k26: 12.0000,
  k27: 74.3000,
  k28: 36.9000,
  k29: 99.2000,
  k30: 61.8000,
  k31: 24.4000,
  k32: 86.7000,
  k33: 49.3000,
  k34: 11.9000,
  k35: 74.2000,
  k36: 36.8000,
  k37: 99.1000,
  k38: 61.7000,
  k39: 24.3000,
  k40: 86.6000,
  k41: 49.2000,
  k42: 11.8000,
  k43: 74.1000,
  k44: 36.7000,
  k45: 99.0000,
  k46: 61.6000,
  k47: 24.2000,
  k48: 86.5000,
  k49: 49.1000,
  k50: 11.7000,
  k51: 74.0000,
  k52: 36.6000,
  k53: 98.9000,
  k54: 61.5000,
  k55: 24.1000,
  k56: 86.4000,
  k57: 49.0000,
  k58: 11.6000,
  k59: 73.9000,
  k60: 36.5000,
  k61: 98.8000,
  k62: 61.4000,
  k63: 24.0000,
  k64: 86.3000,
  k65: 48.9000,
  k66: 11.5000,
  k67: 73.8000,
  k68: 36.4000,
  k69: 98.7000,
  k70: 61.3000,
  k71: 23.9000,
} as const;

export function V1023_CLAD_HAZARD_SCENARIO_022_evaluate(turn: number): {
  heatStressIndex: number;
  droughtBufferDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1023_CLAD_HAZARD_SCENARIO_022_COEF) as Array<
    keyof typeof V1023_CLAD_HAZARD_SCENARIO_022_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1023_CLAD_HAZARD_SCENARIO_022_COEF[keys[j]] * ((turn + j) % 17);
  }
  const heatStressIndex = V1023_CLAD_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const droughtBufferDelayTurns = V1023_CLAD_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1023_CLAD_clamp(90 - heatStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1023_CLAD_hazardBandFromScore(resilienceScore) !== 'fragile';
  return { heatStressIndex, droughtBufferDelayTurns, resilienceScore, stable };
}

export function V1023_CLAD_HAZARD_SCENARIO_022_snapshot(turn: number): V1023CladHazardSnapshot {
  const r = V1023_CLAD_HAZARD_SCENARIO_022_evaluate(turn);
  return {
    scenarioId: V1023_CLAD_HAZARD_SCENARIO_022_META.id,
    regionId: V1023_CLAD_HAZARD_SCENARIO_022_META.regionId,
    adaptationChannel: V1023_CLAD_HAZARD_SCENARIO_022_META.primaryChannel,
    hazardBand: V1023_CLAD_HAZARD_SCENARIO_022_META.hazardBand,
    heatStressIndex: r.heatStressIndex,
    droughtBufferDelayTurns: r.droughtBufferDelayTurns,
    resilienceScore: r.resilienceScore,
    hazardBand: V1023_CLAD_hazardBandFromScore(r.resilienceScore),
  };
}

export function V1023_CLAD_HAZARD_SCENARIO_022_regressionAssert(turn: number): boolean {
  const r = V1023_CLAD_HAZARD_SCENARIO_022_evaluate(turn);
  return typeof r.heatStressIndex === 'number' && r.resilienceScore <= 100;
}
