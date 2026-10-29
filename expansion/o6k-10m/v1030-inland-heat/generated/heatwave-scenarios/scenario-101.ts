import { V1030_IHEAT_clamp, V1030_IHEAT_aridAdaptationBandFromScore } from '../../engine/inland-heat-utils.ts';
import type {
  V1030IheatAridAdaptationBand,
  V1030IheatRegionId,
  V1030IheatHeatwaveSnapshot,
  V1030IheatInlandHeatChannel,
} from '../../types/core.ts';

/** Generated heatwave scenario 101 — extreme_heat/drought/dust handoff matrix. */
export const V1030_IHEAT_HEATWAVE_SCENARIO_101_META = {
  id: 'heatwave_101',
  regionId: 'TAS' as V1030IheatRegionId,
  primaryChannel: 'primary_access' as V1030IheatInlandHeatChannel,
  aridAdaptationBand: 'moderate' as V1030IheatAridAdaptationBand,
  seed: 92532,
} as const;

const V1030_IHEAT_HEATWAVE_SCENARIO_101_COEF = {
  k0: 91.2000,
  k1: 72.3000,
  k2: 53.4000,
  k3: 34.5000,
  k4: 15.6000,
  k5: 96.4000,
  k6: 77.5000,
  k7: 58.6000,
  k8: 39.7000,
  k9: 20.8000,
  k10: 1.9000,
  k11: 82.7000,
  k12: 63.8000,
  k13: 44.9000,
  k14: 26.0000,
  k15: 7.1000,
  k16: 87.9000,
  k17: 69.0000,
  k18: 50.1000,
  k19: 31.2000,
  k20: 12.3000,
  k21: 93.1000,
  k22: 74.2000,
  k23: 55.3000,
  k24: 36.4000,
  k25: 17.5000,
  k26: 98.3000,
  k27: 79.4000,
  k28: 60.5000,
  k29: 41.6000,
  k30: 22.7000,
  k31: 3.8000,
  k32: 84.6000,
  k33: 65.7000,
  k34: 46.8000,
  k35: 27.9000,
  k36: 9.0000,
  k37: 89.8000,
  k38: 70.9000,
  k39: 52.0000,
  k40: 33.1000,
  k41: 14.2000,
  k42: 95.0000,
  k43: 76.1000,
  k44: 57.2000,
  k45: 38.3000,
  k46: 19.4000,
  k47: 0.5000,
  k48: 81.3000,
  k49: 62.4000,
  k50: 43.5000,
  k51: 24.6000,
  k52: 5.7000,
  k53: 86.5000,
  k54: 67.6000,
  k55: 48.7000,
  k56: 29.8000,
  k57: 10.9000,
  k58: 91.7000,
  k59: 72.8000,
  k60: 53.9000,
  k61: 35.0000,
  k62: 16.1000,
  k63: 96.9000,
  k64: 78.0000,
  k65: 59.1000,
  k66: 40.2000,
  k67: 21.3000,
  k68: 2.4000,
  k69: 83.2000,
  k70: 64.3000,
  k71: 45.4000,
} as const;

export function V1030_IHEAT_HEATWAVE_SCENARIO_101_evaluate(turn: number): {
  inlandHeatExposureIndex: number;
  aridBufferDelayTurns: number;
  aridAdaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1030_IHEAT_HEATWAVE_SCENARIO_101_COEF) as Array<
    keyof typeof V1030_IHEAT_HEATWAVE_SCENARIO_101_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1030_IHEAT_HEATWAVE_SCENARIO_101_COEF[keys[j]] * ((turn + j) % 17);
  }
  const inlandHeatExposureIndex = V1030_IHEAT_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aridBufferDelayTurns = V1030_IHEAT_clamp(2 + (acc % 11), 1, 18);
  const aridAdaptationScore = V1030_IHEAT_clamp(90 - inlandHeatExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1030_IHEAT_aridAdaptationBandFromScore(aridAdaptationScore) !== 'depleted';
  return { inlandHeatExposureIndex, aridBufferDelayTurns, aridAdaptationScore, stable };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_101_snapshot(turn: number): V1030IheatHeatwaveSnapshot {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_101_evaluate(turn);
  return {
    scenarioId: V1030_IHEAT_HEATWAVE_SCENARIO_101_META.id,
    regionId: V1030_IHEAT_HEATWAVE_SCENARIO_101_META.regionId,
    inlandHeatChannel: V1030_IHEAT_HEATWAVE_SCENARIO_101_META.primaryChannel,
    aridAdaptationBand: V1030_IHEAT_HEATWAVE_SCENARIO_101_META.aridAdaptationBand,
    inlandHeatExposureIndex: r.inlandHeatExposureIndex,
    aridBufferDelayTurns: r.aridBufferDelayTurns,
    aridAdaptationScore: r.aridAdaptationScore,
    aridAdaptationBand: V1030_IHEAT_aridAdaptationBandFromScore(r.aridAdaptationScore),
  };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_101_regressionAssert(turn: number): boolean {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_101_evaluate(turn);
  return typeof r.inlandHeatExposureIndex === 'number' && r.aridAdaptationScore <= 100;
}
