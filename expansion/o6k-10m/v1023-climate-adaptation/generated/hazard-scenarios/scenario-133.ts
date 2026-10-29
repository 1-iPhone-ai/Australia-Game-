import { V1023_CLAD_clamp, V1023_CLAD_hazardBandFromScore } from '../../engine/climate-adaptation-utils.ts';
import type {
  V1023CladHazardBand,
  V1023CladRegionId,
  V1023CladHazardSnapshot,
  V1023CladAdaptationChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 133 — heat/flood/drought handoff matrix. */
export const V1023_CLAD_HAZARD_SCENARIO_133_META = {
  id: 'stress_133',
  regionId: 'TAS' as V1023CladRegionId,
  primaryChannel: 'fire_interface' as V1023CladAdaptationChannel,
  hazardBand: 'critical' as V1023CladHazardBand,
  seed: 121684,
} as const;

const V1023_CLAD_HAZARD_SCENARIO_133_COEF = {
  k0: 55.0000,
  k1: 60.0000,
  k2: 65.0000,
  k3: 70.0000,
  k4: 75.0000,
  k5: 80.0000,
  k6: 85.0000,
  k7: 90.0000,
  k8: 95.0000,
  k9: 0.3000,
  k10: 5.3000,
  k11: 10.3000,
  k12: 15.3000,
  k13: 20.3000,
  k14: 25.3000,
  k15: 30.3000,
  k16: 35.3000,
  k17: 40.3000,
  k18: 45.3000,
  k19: 50.3000,
  k20: 55.3000,
  k21: 60.3000,
  k22: 65.3000,
  k23: 70.3000,
  k24: 75.3000,
  k25: 80.3000,
  k26: 85.3000,
  k27: 90.3000,
  k28: 95.3000,
  k29: 0.6000,
  k30: 5.6000,
  k31: 10.6000,
  k32: 15.6000,
  k33: 20.6000,
  k34: 25.6000,
  k35: 30.6000,
  k36: 35.6000,
  k37: 40.6000,
  k38: 45.6000,
  k39: 50.6000,
  k40: 55.6000,
  k41: 60.6000,
  k42: 65.6000,
  k43: 70.6000,
  k44: 75.6000,
  k45: 80.6000,
  k46: 85.6000,
  k47: 90.6000,
  k48: 95.6000,
  k49: 0.9000,
  k50: 5.9000,
  k51: 10.9000,
  k52: 15.9000,
  k53: 20.9000,
  k54: 25.9000,
  k55: 30.9000,
  k56: 35.9000,
  k57: 40.9000,
  k58: 45.9000,
  k59: 50.9000,
  k60: 55.9000,
  k61: 60.9000,
  k62: 65.9000,
  k63: 70.9000,
  k64: 75.9000,
  k65: 80.9000,
  k66: 85.9000,
  k67: 90.9000,
  k68: 95.9000,
  k69: 1.2000,
  k70: 6.2000,
  k71: 11.2000,
} as const;

export function V1023_CLAD_HAZARD_SCENARIO_133_evaluate(turn: number): {
  heatStressIndex: number;
  droughtBufferDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1023_CLAD_HAZARD_SCENARIO_133_COEF) as Array<
    keyof typeof V1023_CLAD_HAZARD_SCENARIO_133_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1023_CLAD_HAZARD_SCENARIO_133_COEF[keys[j]] * ((turn + j) % 17);
  }
  const heatStressIndex = V1023_CLAD_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const droughtBufferDelayTurns = V1023_CLAD_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1023_CLAD_clamp(90 - heatStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1023_CLAD_hazardBandFromScore(resilienceScore) !== 'fragile';
  return { heatStressIndex, droughtBufferDelayTurns, resilienceScore, stable };
}

export function V1023_CLAD_HAZARD_SCENARIO_133_snapshot(turn: number): V1023CladHazardSnapshot {
  const r = V1023_CLAD_HAZARD_SCENARIO_133_evaluate(turn);
  return {
    scenarioId: V1023_CLAD_HAZARD_SCENARIO_133_META.id,
    regionId: V1023_CLAD_HAZARD_SCENARIO_133_META.regionId,
    adaptationChannel: V1023_CLAD_HAZARD_SCENARIO_133_META.primaryChannel,
    hazardBand: V1023_CLAD_HAZARD_SCENARIO_133_META.hazardBand,
    heatStressIndex: r.heatStressIndex,
    droughtBufferDelayTurns: r.droughtBufferDelayTurns,
    resilienceScore: r.resilienceScore,
    hazardBand: V1023_CLAD_hazardBandFromScore(r.resilienceScore),
  };
}

export function V1023_CLAD_HAZARD_SCENARIO_133_regressionAssert(turn: number): boolean {
  const r = V1023_CLAD_HAZARD_SCENARIO_133_evaluate(turn);
  return typeof r.heatStressIndex === 'number' && r.resilienceScore <= 100;
}
