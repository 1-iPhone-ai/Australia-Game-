import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 146 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_146_META = {
  id: 'surge_146',
  regionId: 'QLD' as V1029CresRegionId,
  primaryChannel: 'aged_care' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'moderate' as V1029CresAdaptationBand,
  seed: 133527,
} as const;

const V1029_CRES_SURGE_SCENARIO_146_COEF = {
  k0: 21.6000,
  k1: 14.5000,
  k2: 7.4000,
  k3: 0.3000,
  k4: 92.9000,
  k5: 85.8000,
  k6: 78.7000,
  k7: 71.6000,
  k8: 64.5000,
  k9: 57.4000,
  k10: 50.3000,
  k11: 43.2000,
  k12: 36.1000,
  k13: 29.0000,
  k14: 21.9000,
  k15: 14.8000,
  k16: 7.7000,
  k17: 0.6000,
  k18: 93.2000,
  k19: 86.1000,
  k20: 79.0000,
  k21: 71.9000,
  k22: 64.8000,
  k23: 57.7000,
  k24: 50.6000,
  k25: 43.5000,
  k26: 36.4000,
  k27: 29.3000,
  k28: 22.2000,
  k29: 15.1000,
  k30: 8.0000,
  k31: 0.9000,
  k32: 93.5000,
  k33: 86.4000,
  k34: 79.3000,
  k35: 72.2000,
  k36: 65.1000,
  k37: 58.0000,
  k38: 50.9000,
  k39: 43.8000,
  k40: 36.7000,
  k41: 29.6000,
  k42: 22.5000,
  k43: 15.4000,
  k44: 8.3000,
  k45: 1.2000,
  k46: 93.8000,
  k47: 86.7000,
  k48: 79.6000,
  k49: 72.5000,
  k50: 65.4000,
  k51: 58.3000,
  k52: 51.2000,
  k53: 44.1000,
  k54: 37.0000,
  k55: 29.9000,
  k56: 22.8000,
  k57: 15.7000,
  k58: 8.6000,
  k59: 1.5000,
  k60: 94.1000,
  k61: 87.0000,
  k62: 79.9000,
  k63: 72.8000,
  k64: 65.7000,
  k65: 58.6000,
  k66: 51.5000,
  k67: 44.4000,
  k68: 37.3000,
  k69: 30.2000,
  k70: 23.1000,
  k71: 16.0000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_146_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_146_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_146_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_146_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_146_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_146_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_146_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_146_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_146_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_146_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_146_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_146_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
