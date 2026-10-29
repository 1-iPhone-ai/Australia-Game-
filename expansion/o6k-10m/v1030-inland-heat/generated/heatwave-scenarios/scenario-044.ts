import { V1030_IHEAT_clamp, V1030_IHEAT_aridAdaptationBandFromScore } from '../../engine/inland-heat-utils.ts';
import type {
  V1030IheatAridAdaptationBand,
  V1030IheatRegionId,
  V1030IheatHeatwaveSnapshot,
  V1030IheatInlandHeatChannel,
} from '../../types/core.ts';

/** Generated heatwave scenario 044 — extreme_heat/drought/dust handoff matrix. */
export const V1030_IHEAT_HEATWAVE_SCENARIO_044_META = {
  id: 'heatwave_044',
  regionId: 'SA' as V1030IheatRegionId,
  primaryChannel: 'rural_clinic' as V1030IheatInlandHeatChannel,
  aridAdaptationBand: 'recovering' as V1030IheatAridAdaptationBand,
  seed: 40605,
} as const;

const V1030_IHEAT_HEATWAVE_SCENARIO_044_COEF = {
  k0: 99.6000,
  k1: 72.4000,
  k2: 45.2000,
  k3: 18.0000,
  k4: 90.5000,
  k5: 63.3000,
  k6: 36.1000,
  k7: 8.9000,
  k8: 81.4000,
  k9: 54.2000,
  k10: 27.0000,
  k11: 99.5000,
  k12: 72.3000,
  k13: 45.1000,
  k14: 17.9000,
  k15: 90.4000,
  k16: 63.2000,
  k17: 36.0000,
  k18: 8.8000,
  k19: 81.3000,
  k20: 54.1000,
  k21: 26.9000,
  k22: 99.4000,
  k23: 72.2000,
  k24: 45.0000,
  k25: 17.8000,
  k26: 90.3000,
  k27: 63.1000,
  k28: 35.9000,
  k29: 8.7000,
  k30: 81.2000,
  k31: 54.0000,
  k32: 26.8000,
  k33: 99.3000,
  k34: 72.1000,
  k35: 44.9000,
  k36: 17.7000,
  k37: 90.2000,
  k38: 63.0000,
  k39: 35.8000,
  k40: 8.6000,
  k41: 81.1000,
  k42: 53.9000,
  k43: 26.7000,
  k44: 99.2000,
  k45: 72.0000,
  k46: 44.8000,
  k47: 17.6000,
  k48: 90.1000,
  k49: 62.9000,
  k50: 35.7000,
  k51: 8.5000,
  k52: 81.0000,
  k53: 53.8000,
  k54: 26.6000,
  k55: 99.1000,
  k56: 71.9000,
  k57: 44.7000,
  k58: 17.5000,
  k59: 90.0000,
  k60: 62.8000,
  k61: 35.6000,
  k62: 8.4000,
  k63: 80.9000,
  k64: 53.7000,
  k65: 26.5000,
  k66: 99.0000,
  k67: 71.8000,
  k68: 44.6000,
  k69: 17.4000,
  k70: 89.9000,
  k71: 62.7000,
} as const;

export function V1030_IHEAT_HEATWAVE_SCENARIO_044_evaluate(turn: number): {
  inlandHeatExposureIndex: number;
  aridBufferDelayTurns: number;
  aridAdaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1030_IHEAT_HEATWAVE_SCENARIO_044_COEF) as Array<
    keyof typeof V1030_IHEAT_HEATWAVE_SCENARIO_044_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1030_IHEAT_HEATWAVE_SCENARIO_044_COEF[keys[j]] * ((turn + j) % 17);
  }
  const inlandHeatExposureIndex = V1030_IHEAT_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aridBufferDelayTurns = V1030_IHEAT_clamp(2 + (acc % 11), 1, 18);
  const aridAdaptationScore = V1030_IHEAT_clamp(90 - inlandHeatExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1030_IHEAT_aridAdaptationBandFromScore(aridAdaptationScore) !== 'depleted';
  return { inlandHeatExposureIndex, aridBufferDelayTurns, aridAdaptationScore, stable };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_044_snapshot(turn: number): V1030IheatHeatwaveSnapshot {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_044_evaluate(turn);
  return {
    scenarioId: V1030_IHEAT_HEATWAVE_SCENARIO_044_META.id,
    regionId: V1030_IHEAT_HEATWAVE_SCENARIO_044_META.regionId,
    inlandHeatChannel: V1030_IHEAT_HEATWAVE_SCENARIO_044_META.primaryChannel,
    aridAdaptationBand: V1030_IHEAT_HEATWAVE_SCENARIO_044_META.aridAdaptationBand,
    inlandHeatExposureIndex: r.inlandHeatExposureIndex,
    aridBufferDelayTurns: r.aridBufferDelayTurns,
    aridAdaptationScore: r.aridAdaptationScore,
    aridAdaptationBand: V1030_IHEAT_aridAdaptationBandFromScore(r.aridAdaptationScore),
  };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_044_regressionAssert(turn: number): boolean {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_044_evaluate(turn);
  return typeof r.inlandHeatExposureIndex === 'number' && r.aridAdaptationScore <= 100;
}
