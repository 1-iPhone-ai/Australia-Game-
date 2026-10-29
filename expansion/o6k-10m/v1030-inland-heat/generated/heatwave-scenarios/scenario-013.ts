import { V1030_IHEAT_clamp, V1030_IHEAT_aridAdaptationBandFromScore } from '../../engine/inland-heat-utils.ts';
import type {
  V1030IheatAridAdaptationBand,
  V1030IheatRegionId,
  V1030IheatHeatwaveSnapshot,
  V1030IheatInlandHeatChannel,
} from '../../types/core.ts';

/** Generated heatwave scenario 013 — extreme_heat/drought/dust handoff matrix. */
export const V1030_IHEAT_HEATWAVE_SCENARIO_013_META = {
  id: 'heatwave_013',
  regionId: 'TAS' as V1030IheatRegionId,
  primaryChannel: 'telehealth' as V1030IheatInlandHeatChannel,
  aridAdaptationBand: 'critical' as V1030IheatAridAdaptationBand,
  seed: 12364,
} as const;

const V1030_IHEAT_HEATWAVE_SCENARIO_013_COEF = {
  k0: 41.2000,
  k1: 81.2000,
  k2: 21.5000,
  k3: 61.5000,
  k4: 1.8000,
  k5: 41.8000,
  k6: 81.8000,
  k7: 22.1000,
  k8: 62.1000,
  k9: 2.4000,
  k10: 42.4000,
  k11: 82.4000,
  k12: 22.7000,
  k13: 62.7000,
  k14: 3.0000,
  k15: 43.0000,
  k16: 83.0000,
  k17: 23.3000,
  k18: 63.3000,
  k19: 3.6000,
  k20: 43.6000,
  k21: 83.6000,
  k22: 23.9000,
  k23: 63.9000,
  k24: 4.2000,
  k25: 44.2000,
  k26: 84.2000,
  k27: 24.5000,
  k28: 64.5000,
  k29: 4.8000,
  k30: 44.8000,
  k31: 84.8000,
  k32: 25.1000,
  k33: 65.1000,
  k34: 5.4000,
  k35: 45.4000,
  k36: 85.4000,
  k37: 25.7000,
  k38: 65.7000,
  k39: 6.0000,
  k40: 46.0000,
  k41: 86.0000,
  k42: 26.3000,
  k43: 66.3000,
  k44: 6.6000,
  k45: 46.6000,
  k46: 86.6000,
  k47: 26.9000,
  k48: 66.9000,
  k49: 7.2000,
  k50: 47.2000,
  k51: 87.2000,
  k52: 27.5000,
  k53: 67.5000,
  k54: 7.8000,
  k55: 47.8000,
  k56: 87.8000,
  k57: 28.1000,
  k58: 68.1000,
  k59: 8.4000,
  k60: 48.4000,
  k61: 88.4000,
  k62: 28.7000,
  k63: 68.7000,
  k64: 9.0000,
  k65: 49.0000,
  k66: 89.0000,
  k67: 29.3000,
  k68: 69.3000,
  k69: 9.6000,
  k70: 49.6000,
  k71: 89.6000,
} as const;

export function V1030_IHEAT_HEATWAVE_SCENARIO_013_evaluate(turn: number): {
  inlandHeatExposureIndex: number;
  aridBufferDelayTurns: number;
  aridAdaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1030_IHEAT_HEATWAVE_SCENARIO_013_COEF) as Array<
    keyof typeof V1030_IHEAT_HEATWAVE_SCENARIO_013_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1030_IHEAT_HEATWAVE_SCENARIO_013_COEF[keys[j]] * ((turn + j) % 17);
  }
  const inlandHeatExposureIndex = V1030_IHEAT_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aridBufferDelayTurns = V1030_IHEAT_clamp(2 + (acc % 11), 1, 18);
  const aridAdaptationScore = V1030_IHEAT_clamp(90 - inlandHeatExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1030_IHEAT_aridAdaptationBandFromScore(aridAdaptationScore) !== 'depleted';
  return { inlandHeatExposureIndex, aridBufferDelayTurns, aridAdaptationScore, stable };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_013_snapshot(turn: number): V1030IheatHeatwaveSnapshot {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_013_evaluate(turn);
  return {
    scenarioId: V1030_IHEAT_HEATWAVE_SCENARIO_013_META.id,
    regionId: V1030_IHEAT_HEATWAVE_SCENARIO_013_META.regionId,
    inlandHeatChannel: V1030_IHEAT_HEATWAVE_SCENARIO_013_META.primaryChannel,
    aridAdaptationBand: V1030_IHEAT_HEATWAVE_SCENARIO_013_META.aridAdaptationBand,
    inlandHeatExposureIndex: r.inlandHeatExposureIndex,
    aridBufferDelayTurns: r.aridBufferDelayTurns,
    aridAdaptationScore: r.aridAdaptationScore,
    aridAdaptationBand: V1030_IHEAT_aridAdaptationBandFromScore(r.aridAdaptationScore),
  };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_013_regressionAssert(turn: number): boolean {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_013_evaluate(turn);
  return typeof r.inlandHeatExposureIndex === 'number' && r.aridAdaptationScore <= 100;
}
