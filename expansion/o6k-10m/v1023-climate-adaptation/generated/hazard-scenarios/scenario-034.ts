import { V1023_CLAD_clamp, V1023_CLAD_hazardBandFromScore } from '../../engine/climate-adaptation-utils.ts';
import type {
  V1023CladHazardBand,
  V1023CladRegionId,
  V1023CladHazardSnapshot,
  V1023CladAdaptationChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 034 — heat/flood/drought handoff matrix. */
export const V1023_CLAD_HAZARD_SCENARIO_034_META = {
  id: 'stress_034',
  regionId: 'QLD' as V1023CladRegionId,
  primaryChannel: 'cyclone_north' as V1023CladAdaptationChannel,
  hazardBand: 'recovering' as V1023CladHazardBand,
  seed: 31495,
} as const;

const V1023_CLAD_HAZARD_SCENARIO_034_COEF = {
  k0: 48.6000,
  k1: 7.7000,
  k2: 66.5000,
  k3: 25.6000,
  k4: 84.4000,
  k5: 43.5000,
  k6: 2.6000,
  k7: 61.4000,
  k8: 20.5000,
  k9: 79.3000,
  k10: 38.4000,
  k11: 97.2000,
  k12: 56.3000,
  k13: 15.4000,
  k14: 74.2000,
  k15: 33.3000,
  k16: 92.1000,
  k17: 51.2000,
  k18: 10.3000,
  k19: 69.1000,
  k20: 28.2000,
  k21: 87.0000,
  k22: 46.1000,
  k23: 5.2000,
  k24: 64.0000,
  k25: 23.1000,
  k26: 81.9000,
  k27: 41.0000,
  k28: 0.1000,
  k29: 58.9000,
  k30: 18.0000,
  k31: 76.8000,
  k32: 35.9000,
  k33: 94.7000,
  k34: 53.8000,
  k35: 12.9000,
  k36: 71.7000,
  k37: 30.8000,
  k38: 89.6000,
  k39: 48.7000,
  k40: 7.8000,
  k41: 66.6000,
  k42: 25.7000,
  k43: 84.5000,
  k44: 43.6000,
  k45: 2.7000,
  k46: 61.5000,
  k47: 20.6000,
  k48: 79.4000,
  k49: 38.5000,
  k50: 97.3000,
  k51: 56.4000,
  k52: 15.5000,
  k53: 74.3000,
  k54: 33.4000,
  k55: 92.2000,
  k56: 51.3000,
  k57: 10.4000,
  k58: 69.2000,
  k59: 28.3000,
  k60: 87.1000,
  k61: 46.2000,
  k62: 5.3000,
  k63: 64.1000,
  k64: 23.2000,
  k65: 82.0000,
  k66: 41.1000,
  k67: 0.2000,
  k68: 59.0000,
  k69: 18.1000,
  k70: 76.9000,
  k71: 36.0000,
} as const;

export function V1023_CLAD_HAZARD_SCENARIO_034_evaluate(turn: number): {
  heatStressIndex: number;
  droughtBufferDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1023_CLAD_HAZARD_SCENARIO_034_COEF) as Array<
    keyof typeof V1023_CLAD_HAZARD_SCENARIO_034_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1023_CLAD_HAZARD_SCENARIO_034_COEF[keys[j]] * ((turn + j) % 17);
  }
  const heatStressIndex = V1023_CLAD_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const droughtBufferDelayTurns = V1023_CLAD_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1023_CLAD_clamp(90 - heatStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1023_CLAD_hazardBandFromScore(resilienceScore) !== 'fragile';
  return { heatStressIndex, droughtBufferDelayTurns, resilienceScore, stable };
}

export function V1023_CLAD_HAZARD_SCENARIO_034_snapshot(turn: number): V1023CladHazardSnapshot {
  const r = V1023_CLAD_HAZARD_SCENARIO_034_evaluate(turn);
  return {
    scenarioId: V1023_CLAD_HAZARD_SCENARIO_034_META.id,
    regionId: V1023_CLAD_HAZARD_SCENARIO_034_META.regionId,
    adaptationChannel: V1023_CLAD_HAZARD_SCENARIO_034_META.primaryChannel,
    hazardBand: V1023_CLAD_HAZARD_SCENARIO_034_META.hazardBand,
    heatStressIndex: r.heatStressIndex,
    droughtBufferDelayTurns: r.droughtBufferDelayTurns,
    resilienceScore: r.resilienceScore,
    hazardBand: V1023_CLAD_hazardBandFromScore(r.resilienceScore),
  };
}

export function V1023_CLAD_HAZARD_SCENARIO_034_regressionAssert(turn: number): boolean {
  const r = V1023_CLAD_HAZARD_SCENARIO_034_evaluate(turn);
  return typeof r.heatStressIndex === 'number' && r.resilienceScore <= 100;
}
