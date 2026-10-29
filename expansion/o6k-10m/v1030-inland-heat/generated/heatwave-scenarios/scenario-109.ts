import { V1030_IHEAT_clamp, V1030_IHEAT_aridAdaptationBandFromScore } from '../../engine/inland-heat-utils.ts';
import type {
  V1030IheatAridAdaptationBand,
  V1030IheatRegionId,
  V1030IheatHeatwaveSnapshot,
  V1030IheatInlandHeatChannel,
} from '../../types/core.ts';

/** Generated heatwave scenario 109 — extreme_heat/drought/dust handoff matrix. */
export const V1030_IHEAT_HEATWAVE_SCENARIO_109_META = {
  id: 'heatwave_109',
  regionId: 'TAS' as V1030IheatRegionId,
  primaryChannel: 'remote' as V1030IheatInlandHeatChannel,
  aridAdaptationBand: 'recovering' as V1030IheatAridAdaptationBand,
  seed: 99820,
} as const;

const V1030_IHEAT_HEATWAVE_SCENARIO_109_COEF = {
  k0: 32.3000,
  k1: 44.3000,
  k2: 56.3000,
  k3: 68.3000,
  k4: 80.3000,
  k5: 92.3000,
  k6: 4.6000,
  k7: 16.6000,
  k8: 28.6000,
  k9: 40.6000,
  k10: 52.6000,
  k11: 64.6000,
  k12: 76.6000,
  k13: 88.6000,
  k14: 0.9000,
  k15: 12.9000,
  k16: 24.9000,
  k17: 36.9000,
  k18: 48.9000,
  k19: 60.9000,
  k20: 72.9000,
  k21: 84.9000,
  k22: 96.9000,
  k23: 9.2000,
  k24: 21.2000,
  k25: 33.2000,
  k26: 45.2000,
  k27: 57.2000,
  k28: 69.2000,
  k29: 81.2000,
  k30: 93.2000,
  k31: 5.5000,
  k32: 17.5000,
  k33: 29.5000,
  k34: 41.5000,
  k35: 53.5000,
  k36: 65.5000,
  k37: 77.5000,
  k38: 89.5000,
  k39: 1.8000,
  k40: 13.8000,
  k41: 25.8000,
  k42: 37.8000,
  k43: 49.8000,
  k44: 61.8000,
  k45: 73.8000,
  k46: 85.8000,
  k47: 97.8000,
  k48: 10.1000,
  k49: 22.1000,
  k50: 34.1000,
  k51: 46.1000,
  k52: 58.1000,
  k53: 70.1000,
  k54: 82.1000,
  k55: 94.1000,
  k56: 6.4000,
  k57: 18.4000,
  k58: 30.4000,
  k59: 42.4000,
  k60: 54.4000,
  k61: 66.4000,
  k62: 78.4000,
  k63: 90.4000,
  k64: 2.7000,
  k65: 14.7000,
  k66: 26.7000,
  k67: 38.7000,
  k68: 50.7000,
  k69: 62.7000,
  k70: 74.7000,
  k71: 86.7000,
} as const;

export function V1030_IHEAT_HEATWAVE_SCENARIO_109_evaluate(turn: number): {
  inlandHeatExposureIndex: number;
  aridBufferDelayTurns: number;
  aridAdaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1030_IHEAT_HEATWAVE_SCENARIO_109_COEF) as Array<
    keyof typeof V1030_IHEAT_HEATWAVE_SCENARIO_109_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1030_IHEAT_HEATWAVE_SCENARIO_109_COEF[keys[j]] * ((turn + j) % 17);
  }
  const inlandHeatExposureIndex = V1030_IHEAT_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aridBufferDelayTurns = V1030_IHEAT_clamp(2 + (acc % 11), 1, 18);
  const aridAdaptationScore = V1030_IHEAT_clamp(90 - inlandHeatExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1030_IHEAT_aridAdaptationBandFromScore(aridAdaptationScore) !== 'depleted';
  return { inlandHeatExposureIndex, aridBufferDelayTurns, aridAdaptationScore, stable };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_109_snapshot(turn: number): V1030IheatHeatwaveSnapshot {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_109_evaluate(turn);
  return {
    scenarioId: V1030_IHEAT_HEATWAVE_SCENARIO_109_META.id,
    regionId: V1030_IHEAT_HEATWAVE_SCENARIO_109_META.regionId,
    inlandHeatChannel: V1030_IHEAT_HEATWAVE_SCENARIO_109_META.primaryChannel,
    aridAdaptationBand: V1030_IHEAT_HEATWAVE_SCENARIO_109_META.aridAdaptationBand,
    inlandHeatExposureIndex: r.inlandHeatExposureIndex,
    aridBufferDelayTurns: r.aridBufferDelayTurns,
    aridAdaptationScore: r.aridAdaptationScore,
    aridAdaptationBand: V1030_IHEAT_aridAdaptationBandFromScore(r.aridAdaptationScore),
  };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_109_regressionAssert(turn: number): boolean {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_109_evaluate(turn);
  return typeof r.inlandHeatExposureIndex === 'number' && r.aridAdaptationScore <= 100;
}
