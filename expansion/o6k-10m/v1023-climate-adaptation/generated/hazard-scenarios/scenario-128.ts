import { V1023_CLAD_clamp, V1023_CLAD_hazardBandFromScore } from '../../engine/climate-adaptation-utils.ts';
import type {
  V1023CladHazardBand,
  V1023CladRegionId,
  V1023CladHazardSnapshot,
  V1023CladAdaptationChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 128 — heat/flood/drought handoff matrix. */
export const V1023_CLAD_HAZARD_SCENARIO_128_META = {
  id: 'stress_128',
  regionId: 'NSW' as V1023CladRegionId,
  primaryChannel: 'regional' as V1023CladAdaptationChannel,
  hazardBand: 'critical' as V1023CladHazardBand,
  seed: 117129,
} as const;

const V1023_CLAD_HAZARD_SCENARIO_128_COEF = {
  k0: 29.5000,
  k1: 77.5000,
  k2: 25.8000,
  k3: 73.8000,
  k4: 22.1000,
  k5: 70.1000,
  k6: 18.4000,
  k7: 66.4000,
  k8: 14.7000,
  k9: 62.7000,
  k10: 11.0000,
  k11: 59.0000,
  k12: 7.3000,
  k13: 55.3000,
  k14: 3.6000,
  k15: 51.6000,
  k16: 99.6000,
  k17: 47.9000,
  k18: 95.9000,
  k19: 44.2000,
  k20: 92.2000,
  k21: 40.5000,
  k22: 88.5000,
  k23: 36.8000,
  k24: 84.8000,
  k25: 33.1000,
  k26: 81.1000,
  k27: 29.4000,
  k28: 77.4000,
  k29: 25.7000,
  k30: 73.7000,
  k31: 22.0000,
  k32: 70.0000,
  k33: 18.3000,
  k34: 66.3000,
  k35: 14.6000,
  k36: 62.6000,
  k37: 10.9000,
  k38: 58.9000,
  k39: 7.2000,
  k40: 55.2000,
  k41: 3.5000,
  k42: 51.5000,
  k43: 99.5000,
  k44: 47.8000,
  k45: 95.8000,
  k46: 44.1000,
  k47: 92.1000,
  k48: 40.4000,
  k49: 88.4000,
  k50: 36.7000,
  k51: 84.7000,
  k52: 33.0000,
  k53: 81.0000,
  k54: 29.3000,
  k55: 77.3000,
  k56: 25.6000,
  k57: 73.6000,
  k58: 21.9000,
  k59: 69.9000,
  k60: 18.2000,
  k61: 66.2000,
  k62: 14.5000,
  k63: 62.5000,
  k64: 10.8000,
  k65: 58.8000,
  k66: 7.1000,
  k67: 55.1000,
  k68: 3.4000,
  k69: 51.4000,
  k70: 99.4000,
  k71: 47.7000,
} as const;

export function V1023_CLAD_HAZARD_SCENARIO_128_evaluate(turn: number): {
  heatStressIndex: number;
  droughtBufferDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1023_CLAD_HAZARD_SCENARIO_128_COEF) as Array<
    keyof typeof V1023_CLAD_HAZARD_SCENARIO_128_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1023_CLAD_HAZARD_SCENARIO_128_COEF[keys[j]] * ((turn + j) % 17);
  }
  const heatStressIndex = V1023_CLAD_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const droughtBufferDelayTurns = V1023_CLAD_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1023_CLAD_clamp(90 - heatStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1023_CLAD_hazardBandFromScore(resilienceScore) !== 'fragile';
  return { heatStressIndex, droughtBufferDelayTurns, resilienceScore, stable };
}

export function V1023_CLAD_HAZARD_SCENARIO_128_snapshot(turn: number): V1023CladHazardSnapshot {
  const r = V1023_CLAD_HAZARD_SCENARIO_128_evaluate(turn);
  return {
    scenarioId: V1023_CLAD_HAZARD_SCENARIO_128_META.id,
    regionId: V1023_CLAD_HAZARD_SCENARIO_128_META.regionId,
    adaptationChannel: V1023_CLAD_HAZARD_SCENARIO_128_META.primaryChannel,
    hazardBand: V1023_CLAD_HAZARD_SCENARIO_128_META.hazardBand,
    heatStressIndex: r.heatStressIndex,
    droughtBufferDelayTurns: r.droughtBufferDelayTurns,
    resilienceScore: r.resilienceScore,
    hazardBand: V1023_CLAD_hazardBandFromScore(r.resilienceScore),
  };
}

export function V1023_CLAD_HAZARD_SCENARIO_128_regressionAssert(turn: number): boolean {
  const r = V1023_CLAD_HAZARD_SCENARIO_128_evaluate(turn);
  return typeof r.heatStressIndex === 'number' && r.resilienceScore <= 100;
}
