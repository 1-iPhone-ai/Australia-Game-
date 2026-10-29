import { V1030_IHEAT_clamp, V1030_IHEAT_aridAdaptationBandFromScore } from '../../engine/inland-heat-utils.ts';
import type {
  V1030IheatAridAdaptationBand,
  V1030IheatRegionId,
  V1030IheatHeatwaveSnapshot,
  V1030IheatInlandHeatChannel,
} from '../../types/core.ts';

/** Generated heatwave scenario 038 — extreme_heat/drought/dust handoff matrix. */
export const V1030_IHEAT_HEATWAVE_SCENARIO_038_META = {
  id: 'heatwave_038',
  regionId: 'NT' as V1030IheatRegionId,
  primaryChannel: 'regional' as V1030IheatInlandHeatChannel,
  aridAdaptationBand: 'critical' as V1030IheatAridAdaptationBand,
  seed: 35139,
} as const;

const V1030_IHEAT_HEATWAVE_SCENARIO_038_COEF = {
  k0: 69.0000,
  k1: 93.4000,
  k2: 18.1000,
  k3: 42.5000,
  k4: 66.9000,
  k5: 91.3000,
  k6: 16.0000,
  k7: 40.4000,
  k8: 64.8000,
  k9: 89.2000,
  k10: 13.9000,
  k11: 38.3000,
  k12: 62.7000,
  k13: 87.1000,
  k14: 11.8000,
  k15: 36.2000,
  k16: 60.6000,
  k17: 85.0000,
  k18: 9.7000,
  k19: 34.1000,
  k20: 58.5000,
  k21: 82.9000,
  k22: 7.6000,
  k23: 32.0000,
  k24: 56.4000,
  k25: 80.8000,
  k26: 5.5000,
  k27: 29.9000,
  k28: 54.3000,
  k29: 78.7000,
  k30: 3.4000,
  k31: 27.8000,
  k32: 52.2000,
  k33: 76.6000,
  k34: 1.3000,
  k35: 25.7000,
  k36: 50.1000,
  k37: 74.5000,
  k38: 98.9000,
  k39: 23.6000,
  k40: 48.0000,
  k41: 72.4000,
  k42: 96.8000,
  k43: 21.5000,
  k44: 45.9000,
  k45: 70.3000,
  k46: 94.7000,
  k47: 19.4000,
  k48: 43.8000,
  k49: 68.2000,
  k50: 92.6000,
  k51: 17.3000,
  k52: 41.7000,
  k53: 66.1000,
  k54: 90.5000,
  k55: 15.2000,
  k56: 39.6000,
  k57: 64.0000,
  k58: 88.4000,
  k59: 13.1000,
  k60: 37.5000,
  k61: 61.9000,
  k62: 86.3000,
  k63: 11.0000,
  k64: 35.4000,
  k65: 59.8000,
  k66: 84.2000,
  k67: 8.9000,
  k68: 33.3000,
  k69: 57.7000,
  k70: 82.1000,
  k71: 6.8000,
} as const;

export function V1030_IHEAT_HEATWAVE_SCENARIO_038_evaluate(turn: number): {
  inlandHeatExposureIndex: number;
  aridBufferDelayTurns: number;
  aridAdaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1030_IHEAT_HEATWAVE_SCENARIO_038_COEF) as Array<
    keyof typeof V1030_IHEAT_HEATWAVE_SCENARIO_038_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1030_IHEAT_HEATWAVE_SCENARIO_038_COEF[keys[j]] * ((turn + j) % 17);
  }
  const inlandHeatExposureIndex = V1030_IHEAT_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aridBufferDelayTurns = V1030_IHEAT_clamp(2 + (acc % 11), 1, 18);
  const aridAdaptationScore = V1030_IHEAT_clamp(90 - inlandHeatExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1030_IHEAT_aridAdaptationBandFromScore(aridAdaptationScore) !== 'depleted';
  return { inlandHeatExposureIndex, aridBufferDelayTurns, aridAdaptationScore, stable };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_038_snapshot(turn: number): V1030IheatHeatwaveSnapshot {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_038_evaluate(turn);
  return {
    scenarioId: V1030_IHEAT_HEATWAVE_SCENARIO_038_META.id,
    regionId: V1030_IHEAT_HEATWAVE_SCENARIO_038_META.regionId,
    inlandHeatChannel: V1030_IHEAT_HEATWAVE_SCENARIO_038_META.primaryChannel,
    aridAdaptationBand: V1030_IHEAT_HEATWAVE_SCENARIO_038_META.aridAdaptationBand,
    inlandHeatExposureIndex: r.inlandHeatExposureIndex,
    aridBufferDelayTurns: r.aridBufferDelayTurns,
    aridAdaptationScore: r.aridAdaptationScore,
    aridAdaptationBand: V1030_IHEAT_aridAdaptationBandFromScore(r.aridAdaptationScore),
  };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_038_regressionAssert(turn: number): boolean {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_038_evaluate(turn);
  return typeof r.inlandHeatExposureIndex === 'number' && r.aridAdaptationScore <= 100;
}
