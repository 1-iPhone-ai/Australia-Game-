import { V1023_CLAD_clamp, V1023_CLAD_hazardBandFromScore } from '../../engine/climate-adaptation-utils.ts';
import type {
  V1023CladHazardBand,
  V1023CladRegionId,
  V1023CladHazardSnapshot,
  V1023CladAdaptationChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 141 — heat/flood/drought handoff matrix. */
export const V1023_CLAD_HAZARD_SCENARIO_141_META = {
  id: 'stress_141',
  regionId: 'TAS' as V1023CladRegionId,
  primaryChannel: 'flood_coastal' as V1023CladAdaptationChannel,
  hazardBand: 'moderate' as V1023CladHazardBand,
  seed: 128972,
} as const;

const V1023_CLAD_HAZARD_SCENARIO_141_COEF = {
  k0: 95.8000,
  k1: 32.0000,
  k2: 67.9000,
  k3: 4.1000,
  k4: 40.0000,
  k5: 75.9000,
  k6: 12.1000,
  k7: 48.0000,
  k8: 83.9000,
  k9: 20.1000,
  k10: 56.0000,
  k11: 91.9000,
  k12: 28.1000,
  k13: 64.0000,
  k14: 0.2000,
  k15: 36.1000,
  k16: 72.0000,
  k17: 8.2000,
  k18: 44.1000,
  k19: 80.0000,
  k20: 16.2000,
  k21: 52.1000,
  k22: 88.0000,
  k23: 24.2000,
  k24: 60.1000,
  k25: 96.0000,
  k26: 32.2000,
  k27: 68.1000,
  k28: 4.3000,
  k29: 40.2000,
  k30: 76.1000,
  k31: 12.3000,
  k32: 48.2000,
  k33: 84.1000,
  k34: 20.3000,
  k35: 56.2000,
  k36: 92.1000,
  k37: 28.3000,
  k38: 64.2000,
  k39: 0.4000,
  k40: 36.3000,
  k41: 72.2000,
  k42: 8.4000,
  k43: 44.3000,
  k44: 80.2000,
  k45: 16.4000,
  k46: 52.3000,
  k47: 88.2000,
  k48: 24.4000,
  k49: 60.3000,
  k50: 96.2000,
  k51: 32.4000,
  k52: 68.3000,
  k53: 4.5000,
  k54: 40.4000,
  k55: 76.3000,
  k56: 12.5000,
  k57: 48.4000,
  k58: 84.3000,
  k59: 20.5000,
  k60: 56.4000,
  k61: 92.3000,
  k62: 28.5000,
  k63: 64.4000,
  k64: 0.6000,
  k65: 36.5000,
  k66: 72.4000,
  k67: 8.6000,
  k68: 44.5000,
  k69: 80.4000,
  k70: 16.6000,
  k71: 52.5000,
} as const;

export function V1023_CLAD_HAZARD_SCENARIO_141_evaluate(turn: number): {
  heatStressIndex: number;
  droughtBufferDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1023_CLAD_HAZARD_SCENARIO_141_COEF) as Array<
    keyof typeof V1023_CLAD_HAZARD_SCENARIO_141_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1023_CLAD_HAZARD_SCENARIO_141_COEF[keys[j]] * ((turn + j) % 17);
  }
  const heatStressIndex = V1023_CLAD_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const droughtBufferDelayTurns = V1023_CLAD_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1023_CLAD_clamp(90 - heatStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1023_CLAD_hazardBandFromScore(resilienceScore) !== 'fragile';
  return { heatStressIndex, droughtBufferDelayTurns, resilienceScore, stable };
}

export function V1023_CLAD_HAZARD_SCENARIO_141_snapshot(turn: number): V1023CladHazardSnapshot {
  const r = V1023_CLAD_HAZARD_SCENARIO_141_evaluate(turn);
  return {
    scenarioId: V1023_CLAD_HAZARD_SCENARIO_141_META.id,
    regionId: V1023_CLAD_HAZARD_SCENARIO_141_META.regionId,
    adaptationChannel: V1023_CLAD_HAZARD_SCENARIO_141_META.primaryChannel,
    hazardBand: V1023_CLAD_HAZARD_SCENARIO_141_META.hazardBand,
    heatStressIndex: r.heatStressIndex,
    droughtBufferDelayTurns: r.droughtBufferDelayTurns,
    resilienceScore: r.resilienceScore,
    hazardBand: V1023_CLAD_hazardBandFromScore(r.resilienceScore),
  };
}

export function V1023_CLAD_HAZARD_SCENARIO_141_regressionAssert(turn: number): boolean {
  const r = V1023_CLAD_HAZARD_SCENARIO_141_evaluate(turn);
  return typeof r.heatStressIndex === 'number' && r.resilienceScore <= 100;
}
