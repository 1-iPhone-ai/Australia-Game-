import { V1030_IHEAT_clamp, V1030_IHEAT_aridAdaptationBandFromScore } from '../../engine/inland-heat-utils.ts';
import type {
  V1030IheatAridAdaptationBand,
  V1030IheatRegionId,
  V1030IheatHeatwaveSnapshot,
  V1030IheatInlandHeatChannel,
} from '../../types/core.ts';

/** Generated heatwave scenario 074 — extreme_heat/drought/dust handoff matrix. */
export const V1030_IHEAT_HEATWAVE_SCENARIO_074_META = {
  id: 'heatwave_074',
  regionId: 'QLD' as V1030IheatRegionId,
  primaryChannel: 'rural_clinic' as V1030IheatInlandHeatChannel,
  aridAdaptationBand: 'recovering' as V1030IheatAridAdaptationBand,
  seed: 67935,
} as const;

const V1030_IHEAT_HEATWAVE_SCENARIO_074_COEF = {
  k0: 53.2000,
  k1: 67.1000,
  k2: 81.0000,
  k3: 94.9000,
  k4: 9.1000,
  k5: 23.0000,
  k6: 36.9000,
  k7: 50.8000,
  k8: 64.7000,
  k9: 78.6000,
  k10: 92.5000,
  k11: 6.7000,
  k12: 20.6000,
  k13: 34.5000,
  k14: 48.4000,
  k15: 62.3000,
  k16: 76.2000,
  k17: 90.1000,
  k18: 4.3000,
  k19: 18.2000,
  k20: 32.1000,
  k21: 46.0000,
  k22: 59.9000,
  k23: 73.8000,
  k24: 87.7000,
  k25: 1.9000,
  k26: 15.8000,
  k27: 29.7000,
  k28: 43.6000,
  k29: 57.5000,
  k30: 71.4000,
  k31: 85.3000,
  k32: 99.2000,
  k33: 13.4000,
  k34: 27.3000,
  k35: 41.2000,
  k36: 55.1000,
  k37: 69.0000,
  k38: 82.9000,
  k39: 96.8000,
  k40: 11.0000,
  k41: 24.9000,
  k42: 38.8000,
  k43: 52.7000,
  k44: 66.6000,
  k45: 80.5000,
  k46: 94.4000,
  k47: 8.6000,
  k48: 22.5000,
  k49: 36.4000,
  k50: 50.3000,
  k51: 64.2000,
  k52: 78.1000,
  k53: 92.0000,
  k54: 6.2000,
  k55: 20.1000,
  k56: 34.0000,
  k57: 47.9000,
  k58: 61.8000,
  k59: 75.7000,
  k60: 89.6000,
  k61: 3.8000,
  k62: 17.7000,
  k63: 31.6000,
  k64: 45.5000,
  k65: 59.4000,
  k66: 73.3000,
  k67: 87.2000,
  k68: 1.4000,
  k69: 15.3000,
  k70: 29.2000,
  k71: 43.1000,
} as const;

export function V1030_IHEAT_HEATWAVE_SCENARIO_074_evaluate(turn: number): {
  inlandHeatExposureIndex: number;
  aridBufferDelayTurns: number;
  aridAdaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1030_IHEAT_HEATWAVE_SCENARIO_074_COEF) as Array<
    keyof typeof V1030_IHEAT_HEATWAVE_SCENARIO_074_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1030_IHEAT_HEATWAVE_SCENARIO_074_COEF[keys[j]] * ((turn + j) % 17);
  }
  const inlandHeatExposureIndex = V1030_IHEAT_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aridBufferDelayTurns = V1030_IHEAT_clamp(2 + (acc % 11), 1, 18);
  const aridAdaptationScore = V1030_IHEAT_clamp(90 - inlandHeatExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1030_IHEAT_aridAdaptationBandFromScore(aridAdaptationScore) !== 'depleted';
  return { inlandHeatExposureIndex, aridBufferDelayTurns, aridAdaptationScore, stable };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_074_snapshot(turn: number): V1030IheatHeatwaveSnapshot {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_074_evaluate(turn);
  return {
    scenarioId: V1030_IHEAT_HEATWAVE_SCENARIO_074_META.id,
    regionId: V1030_IHEAT_HEATWAVE_SCENARIO_074_META.regionId,
    inlandHeatChannel: V1030_IHEAT_HEATWAVE_SCENARIO_074_META.primaryChannel,
    aridAdaptationBand: V1030_IHEAT_HEATWAVE_SCENARIO_074_META.aridAdaptationBand,
    inlandHeatExposureIndex: r.inlandHeatExposureIndex,
    aridBufferDelayTurns: r.aridBufferDelayTurns,
    aridAdaptationScore: r.aridAdaptationScore,
    aridAdaptationBand: V1030_IHEAT_aridAdaptationBandFromScore(r.aridAdaptationScore),
  };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_074_regressionAssert(turn: number): boolean {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_074_evaluate(turn);
  return typeof r.inlandHeatExposureIndex === 'number' && r.aridAdaptationScore <= 100;
}
