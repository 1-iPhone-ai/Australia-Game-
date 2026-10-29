import { V1030_IHEAT_clamp, V1030_IHEAT_aridAdaptationBandFromScore } from '../../engine/inland-heat-utils.ts';
import type {
  V1030IheatAridAdaptationBand,
  V1030IheatRegionId,
  V1030IheatHeatwaveSnapshot,
  V1030IheatInlandHeatChannel,
} from '../../types/core.ts';

/** Generated heatwave scenario 026 — extreme_heat/drought/dust handoff matrix. */
export const V1030_IHEAT_HEATWAVE_SCENARIO_026_META = {
  id: 'heatwave_026',
  regionId: 'QLD' as V1030IheatRegionId,
  primaryChannel: 'aged_care' as V1030IheatInlandHeatChannel,
  aridAdaptationBand: 'moderate' as V1030IheatAridAdaptationBand,
  seed: 24207,
} as const;

const V1030_IHEAT_HEATWAVE_SCENARIO_026_COEF = {
  k0: 7.8000,
  k1: 35.7000,
  k2: 63.6000,
  k3: 91.5000,
  k4: 19.7000,
  k5: 47.6000,
  k6: 75.5000,
  k7: 3.7000,
  k8: 31.6000,
  k9: 59.5000,
  k10: 87.4000,
  k11: 15.6000,
  k12: 43.5000,
  k13: 71.4000,
  k14: 99.3000,
  k15: 27.5000,
  k16: 55.4000,
  k17: 83.3000,
  k18: 11.5000,
  k19: 39.4000,
  k20: 67.3000,
  k21: 95.2000,
  k22: 23.4000,
  k23: 51.3000,
  k24: 79.2000,
  k25: 7.4000,
  k26: 35.3000,
  k27: 63.2000,
  k28: 91.1000,
  k29: 19.3000,
  k30: 47.2000,
  k31: 75.1000,
  k32: 3.3000,
  k33: 31.2000,
  k34: 59.1000,
  k35: 87.0000,
  k36: 15.2000,
  k37: 43.1000,
  k38: 71.0000,
  k39: 98.9000,
  k40: 27.1000,
  k41: 55.0000,
  k42: 82.9000,
  k43: 11.1000,
  k44: 39.0000,
  k45: 66.9000,
  k46: 94.8000,
  k47: 23.0000,
  k48: 50.9000,
  k49: 78.8000,
  k50: 7.0000,
  k51: 34.9000,
  k52: 62.8000,
  k53: 90.7000,
  k54: 18.9000,
  k55: 46.8000,
  k56: 74.7000,
  k57: 2.9000,
  k58: 30.8000,
  k59: 58.7000,
  k60: 86.6000,
  k61: 14.8000,
  k62: 42.7000,
  k63: 70.6000,
  k64: 98.5000,
  k65: 26.7000,
  k66: 54.6000,
  k67: 82.5000,
  k68: 10.7000,
  k69: 38.6000,
  k70: 66.5000,
  k71: 94.4000,
} as const;

export function V1030_IHEAT_HEATWAVE_SCENARIO_026_evaluate(turn: number): {
  inlandHeatExposureIndex: number;
  aridBufferDelayTurns: number;
  aridAdaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1030_IHEAT_HEATWAVE_SCENARIO_026_COEF) as Array<
    keyof typeof V1030_IHEAT_HEATWAVE_SCENARIO_026_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1030_IHEAT_HEATWAVE_SCENARIO_026_COEF[keys[j]] * ((turn + j) % 17);
  }
  const inlandHeatExposureIndex = V1030_IHEAT_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aridBufferDelayTurns = V1030_IHEAT_clamp(2 + (acc % 11), 1, 18);
  const aridAdaptationScore = V1030_IHEAT_clamp(90 - inlandHeatExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1030_IHEAT_aridAdaptationBandFromScore(aridAdaptationScore) !== 'depleted';
  return { inlandHeatExposureIndex, aridBufferDelayTurns, aridAdaptationScore, stable };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_026_snapshot(turn: number): V1030IheatHeatwaveSnapshot {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_026_evaluate(turn);
  return {
    scenarioId: V1030_IHEAT_HEATWAVE_SCENARIO_026_META.id,
    regionId: V1030_IHEAT_HEATWAVE_SCENARIO_026_META.regionId,
    inlandHeatChannel: V1030_IHEAT_HEATWAVE_SCENARIO_026_META.primaryChannel,
    aridAdaptationBand: V1030_IHEAT_HEATWAVE_SCENARIO_026_META.aridAdaptationBand,
    inlandHeatExposureIndex: r.inlandHeatExposureIndex,
    aridBufferDelayTurns: r.aridBufferDelayTurns,
    aridAdaptationScore: r.aridAdaptationScore,
    aridAdaptationBand: V1030_IHEAT_aridAdaptationBandFromScore(r.aridAdaptationScore),
  };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_026_regressionAssert(turn: number): boolean {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_026_evaluate(turn);
  return typeof r.inlandHeatExposureIndex === 'number' && r.aridAdaptationScore <= 100;
}
