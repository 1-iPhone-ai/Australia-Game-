import { V1030_IHEAT_clamp, V1030_IHEAT_aridAdaptationBandFromScore } from '../../engine/inland-heat-utils.ts';
import type {
  V1030IheatAridAdaptationBand,
  V1030IheatRegionId,
  V1030IheatHeatwaveSnapshot,
  V1030IheatInlandHeatChannel,
} from '../../types/core.ts';

/** Generated heatwave scenario 019 — extreme_heat/drought/dust handoff matrix. */
export const V1030_IHEAT_HEATWAVE_SCENARIO_019_META = {
  id: 'heatwave_019',
  regionId: 'WA' as V1030IheatRegionId,
  primaryChannel: 'remote' as V1030IheatInlandHeatChannel,
  aridAdaptationBand: 'recovering' as V1030IheatAridAdaptationBand,
  seed: 17830,
} as const;

const V1030_IHEAT_HEATWAVE_SCENARIO_019_COEF = {
  k0: 71.8000,
  k1: 60.2000,
  k2: 48.6000,
  k3: 37.0000,
  k4: 25.4000,
  k5: 13.8000,
  k6: 2.2000,
  k7: 90.3000,
  k8: 78.7000,
  k9: 67.1000,
  k10: 55.5000,
  k11: 43.9000,
  k12: 32.3000,
  k13: 20.7000,
  k14: 9.1000,
  k15: 97.2000,
  k16: 85.6000,
  k17: 74.0000,
  k18: 62.4000,
  k19: 50.8000,
  k20: 39.2000,
  k21: 27.6000,
  k22: 16.0000,
  k23: 4.4000,
  k24: 92.5000,
  k25: 80.9000,
  k26: 69.3000,
  k27: 57.7000,
  k28: 46.1000,
  k29: 34.5000,
  k30: 22.9000,
  k31: 11.3000,
  k32: 99.4000,
  k33: 87.8000,
  k34: 76.2000,
  k35: 64.6000,
  k36: 53.0000,
  k37: 41.4000,
  k38: 29.8000,
  k39: 18.2000,
  k40: 6.6000,
  k41: 94.7000,
  k42: 83.1000,
  k43: 71.5000,
  k44: 59.9000,
  k45: 48.3000,
  k46: 36.7000,
  k47: 25.1000,
  k48: 13.5000,
  k49: 1.9000,
  k50: 90.0000,
  k51: 78.4000,
  k52: 66.8000,
  k53: 55.2000,
  k54: 43.6000,
  k55: 32.0000,
  k56: 20.4000,
  k57: 8.8000,
  k58: 96.9000,
  k59: 85.3000,
  k60: 73.7000,
  k61: 62.1000,
  k62: 50.5000,
  k63: 38.9000,
  k64: 27.3000,
  k65: 15.7000,
  k66: 4.1000,
  k67: 92.2000,
  k68: 80.6000,
  k69: 69.0000,
  k70: 57.4000,
  k71: 45.8000,
} as const;

export function V1030_IHEAT_HEATWAVE_SCENARIO_019_evaluate(turn: number): {
  inlandHeatExposureIndex: number;
  aridBufferDelayTurns: number;
  aridAdaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1030_IHEAT_HEATWAVE_SCENARIO_019_COEF) as Array<
    keyof typeof V1030_IHEAT_HEATWAVE_SCENARIO_019_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1030_IHEAT_HEATWAVE_SCENARIO_019_COEF[keys[j]] * ((turn + j) % 17);
  }
  const inlandHeatExposureIndex = V1030_IHEAT_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aridBufferDelayTurns = V1030_IHEAT_clamp(2 + (acc % 11), 1, 18);
  const aridAdaptationScore = V1030_IHEAT_clamp(90 - inlandHeatExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1030_IHEAT_aridAdaptationBandFromScore(aridAdaptationScore) !== 'depleted';
  return { inlandHeatExposureIndex, aridBufferDelayTurns, aridAdaptationScore, stable };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_019_snapshot(turn: number): V1030IheatHeatwaveSnapshot {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_019_evaluate(turn);
  return {
    scenarioId: V1030_IHEAT_HEATWAVE_SCENARIO_019_META.id,
    regionId: V1030_IHEAT_HEATWAVE_SCENARIO_019_META.regionId,
    inlandHeatChannel: V1030_IHEAT_HEATWAVE_SCENARIO_019_META.primaryChannel,
    aridAdaptationBand: V1030_IHEAT_HEATWAVE_SCENARIO_019_META.aridAdaptationBand,
    inlandHeatExposureIndex: r.inlandHeatExposureIndex,
    aridBufferDelayTurns: r.aridBufferDelayTurns,
    aridAdaptationScore: r.aridAdaptationScore,
    aridAdaptationBand: V1030_IHEAT_aridAdaptationBandFromScore(r.aridAdaptationScore),
  };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_019_regressionAssert(turn: number): boolean {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_019_evaluate(turn);
  return typeof r.inlandHeatExposureIndex === 'number' && r.aridAdaptationScore <= 100;
}
