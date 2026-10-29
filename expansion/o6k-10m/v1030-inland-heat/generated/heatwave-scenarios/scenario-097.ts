import { V1030_IHEAT_clamp, V1030_IHEAT_aridAdaptationBandFromScore } from '../../engine/inland-heat-utils.ts';
import type {
  V1030IheatAridAdaptationBand,
  V1030IheatRegionId,
  V1030IheatHeatwaveSnapshot,
  V1030IheatInlandHeatChannel,
} from '../../types/core.ts';

/** Generated heatwave scenario 097 — extreme_heat/drought/dust handoff matrix. */
export const V1030_IHEAT_HEATWAVE_SCENARIO_097_META = {
  id: 'heatwave_097',
  regionId: 'VIC' as V1030IheatRegionId,
  primaryChannel: 'mental_health' as V1030IheatInlandHeatChannel,
  aridAdaptationBand: 'elevated' as V1030IheatAridAdaptationBand,
  seed: 88888,
} as const;

const V1030_IHEAT_HEATWAVE_SCENARIO_097_COEF = {
  k0: 70.8000,
  k1: 86.3000,
  k2: 2.1000,
  k3: 17.6000,
  k4: 33.1000,
  k5: 48.6000,
  k6: 64.1000,
  k7: 79.6000,
  k8: 95.1000,
  k9: 10.9000,
  k10: 26.4000,
  k11: 41.9000,
  k12: 57.4000,
  k13: 72.9000,
  k14: 88.4000,
  k15: 4.2000,
  k16: 19.7000,
  k17: 35.2000,
  k18: 50.7000,
  k19: 66.2000,
  k20: 81.7000,
  k21: 97.2000,
  k22: 13.0000,
  k23: 28.5000,
  k24: 44.0000,
  k25: 59.5000,
  k26: 75.0000,
  k27: 90.5000,
  k28: 6.3000,
  k29: 21.8000,
  k30: 37.3000,
  k31: 52.8000,
  k32: 68.3000,
  k33: 83.8000,
  k34: 99.3000,
  k35: 15.1000,
  k36: 30.6000,
  k37: 46.1000,
  k38: 61.6000,
  k39: 77.1000,
  k40: 92.6000,
  k41: 8.4000,
  k42: 23.9000,
  k43: 39.4000,
  k44: 54.9000,
  k45: 70.4000,
  k46: 85.9000,
  k47: 1.7000,
  k48: 17.2000,
  k49: 32.7000,
  k50: 48.2000,
  k51: 63.7000,
  k52: 79.2000,
  k53: 94.7000,
  k54: 10.5000,
  k55: 26.0000,
  k56: 41.5000,
  k57: 57.0000,
  k58: 72.5000,
  k59: 88.0000,
  k60: 3.8000,
  k61: 19.3000,
  k62: 34.8000,
  k63: 50.3000,
  k64: 65.8000,
  k65: 81.3000,
  k66: 96.8000,
  k67: 12.6000,
  k68: 28.1000,
  k69: 43.6000,
  k70: 59.1000,
  k71: 74.6000,
} as const;

export function V1030_IHEAT_HEATWAVE_SCENARIO_097_evaluate(turn: number): {
  inlandHeatExposureIndex: number;
  aridBufferDelayTurns: number;
  aridAdaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1030_IHEAT_HEATWAVE_SCENARIO_097_COEF) as Array<
    keyof typeof V1030_IHEAT_HEATWAVE_SCENARIO_097_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1030_IHEAT_HEATWAVE_SCENARIO_097_COEF[keys[j]] * ((turn + j) % 17);
  }
  const inlandHeatExposureIndex = V1030_IHEAT_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aridBufferDelayTurns = V1030_IHEAT_clamp(2 + (acc % 11), 1, 18);
  const aridAdaptationScore = V1030_IHEAT_clamp(90 - inlandHeatExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1030_IHEAT_aridAdaptationBandFromScore(aridAdaptationScore) !== 'depleted';
  return { inlandHeatExposureIndex, aridBufferDelayTurns, aridAdaptationScore, stable };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_097_snapshot(turn: number): V1030IheatHeatwaveSnapshot {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_097_evaluate(turn);
  return {
    scenarioId: V1030_IHEAT_HEATWAVE_SCENARIO_097_META.id,
    regionId: V1030_IHEAT_HEATWAVE_SCENARIO_097_META.regionId,
    inlandHeatChannel: V1030_IHEAT_HEATWAVE_SCENARIO_097_META.primaryChannel,
    aridAdaptationBand: V1030_IHEAT_HEATWAVE_SCENARIO_097_META.aridAdaptationBand,
    inlandHeatExposureIndex: r.inlandHeatExposureIndex,
    aridBufferDelayTurns: r.aridBufferDelayTurns,
    aridAdaptationScore: r.aridAdaptationScore,
    aridAdaptationBand: V1030_IHEAT_aridAdaptationBandFromScore(r.aridAdaptationScore),
  };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_097_regressionAssert(turn: number): boolean {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_097_evaluate(turn);
  return typeof r.inlandHeatExposureIndex === 'number' && r.aridAdaptationScore <= 100;
}
