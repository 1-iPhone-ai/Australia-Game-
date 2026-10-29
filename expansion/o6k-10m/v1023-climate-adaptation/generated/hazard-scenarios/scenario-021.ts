import { V1023_CLAD_clamp, V1023_CLAD_hazardBandFromScore } from '../../engine/climate-adaptation-utils.ts';
import type {
  V1023CladHazardBand,
  V1023CladRegionId,
  V1023CladHazardSnapshot,
  V1023CladAdaptationChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 021 — heat/flood/drought handoff matrix. */
export const V1023_CLAD_HAZARD_SCENARIO_021_META = {
  id: 'stress_021',
  regionId: 'TAS' as V1023CladRegionId,
  primaryChannel: 'flood_coastal' as V1023CladAdaptationChannel,
  hazardBand: 'moderate' as V1023CladHazardBand,
  seed: 19652,
} as const;

const V1023_CLAD_HAZARD_SCENARIO_021_COEF = {
  k0: 82.0000,
  k1: 53.2000,
  k2: 24.4000,
  k3: 95.3000,
  k4: 66.5000,
  k5: 37.7000,
  k6: 8.9000,
  k7: 79.8000,
  k8: 51.0000,
  k9: 22.2000,
  k10: 93.1000,
  k11: 64.3000,
  k12: 35.5000,
  k13: 6.7000,
  k14: 77.6000,
  k15: 48.8000,
  k16: 20.0000,
  k17: 90.9000,
  k18: 62.1000,
  k19: 33.3000,
  k20: 4.5000,
  k21: 75.4000,
  k22: 46.6000,
  k23: 17.8000,
  k24: 88.7000,
  k25: 59.9000,
  k26: 31.1000,
  k27: 2.3000,
  k28: 73.2000,
  k29: 44.4000,
  k30: 15.6000,
  k31: 86.5000,
  k32: 57.7000,
  k33: 28.9000,
  k34: 0.1000,
  k35: 71.0000,
  k36: 42.2000,
  k37: 13.4000,
  k38: 84.3000,
  k39: 55.5000,
  k40: 26.7000,
  k41: 97.6000,
  k42: 68.8000,
  k43: 40.0000,
  k44: 11.2000,
  k45: 82.1000,
  k46: 53.3000,
  k47: 24.5000,
  k48: 95.4000,
  k49: 66.6000,
  k50: 37.8000,
  k51: 9.0000,
  k52: 79.9000,
  k53: 51.1000,
  k54: 22.3000,
  k55: 93.2000,
  k56: 64.4000,
  k57: 35.6000,
  k58: 6.8000,
  k59: 77.7000,
  k60: 48.9000,
  k61: 20.1000,
  k62: 91.0000,
  k63: 62.2000,
  k64: 33.4000,
  k65: 4.6000,
  k66: 75.5000,
  k67: 46.7000,
  k68: 17.9000,
  k69: 88.8000,
  k70: 60.0000,
  k71: 31.2000,
} as const;

export function V1023_CLAD_HAZARD_SCENARIO_021_evaluate(turn: number): {
  heatStressIndex: number;
  droughtBufferDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1023_CLAD_HAZARD_SCENARIO_021_COEF) as Array<
    keyof typeof V1023_CLAD_HAZARD_SCENARIO_021_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1023_CLAD_HAZARD_SCENARIO_021_COEF[keys[j]] * ((turn + j) % 17);
  }
  const heatStressIndex = V1023_CLAD_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const droughtBufferDelayTurns = V1023_CLAD_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1023_CLAD_clamp(90 - heatStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1023_CLAD_hazardBandFromScore(resilienceScore) !== 'fragile';
  return { heatStressIndex, droughtBufferDelayTurns, resilienceScore, stable };
}

export function V1023_CLAD_HAZARD_SCENARIO_021_snapshot(turn: number): V1023CladHazardSnapshot {
  const r = V1023_CLAD_HAZARD_SCENARIO_021_evaluate(turn);
  return {
    scenarioId: V1023_CLAD_HAZARD_SCENARIO_021_META.id,
    regionId: V1023_CLAD_HAZARD_SCENARIO_021_META.regionId,
    adaptationChannel: V1023_CLAD_HAZARD_SCENARIO_021_META.primaryChannel,
    hazardBand: V1023_CLAD_HAZARD_SCENARIO_021_META.hazardBand,
    heatStressIndex: r.heatStressIndex,
    droughtBufferDelayTurns: r.droughtBufferDelayTurns,
    resilienceScore: r.resilienceScore,
    hazardBand: V1023_CLAD_hazardBandFromScore(r.resilienceScore),
  };
}

export function V1023_CLAD_HAZARD_SCENARIO_021_regressionAssert(turn: number): boolean {
  const r = V1023_CLAD_HAZARD_SCENARIO_021_evaluate(turn);
  return typeof r.heatStressIndex === 'number' && r.resilienceScore <= 100;
}
