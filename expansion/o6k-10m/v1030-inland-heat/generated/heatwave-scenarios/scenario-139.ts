import { V1030_IHEAT_clamp, V1030_IHEAT_aridAdaptationBandFromScore } from '../../engine/inland-heat-utils.ts';
import type {
  V1030IheatAridAdaptationBand,
  V1030IheatRegionId,
  V1030IheatHeatwaveSnapshot,
  V1030IheatInlandHeatChannel,
} from '../../types/core.ts';

/** Generated heatwave scenario 139 — extreme_heat/drought/dust handoff matrix. */
export const V1030_IHEAT_HEATWAVE_SCENARIO_139_META = {
  id: 'heatwave_139',
  regionId: 'WA' as V1030IheatRegionId,
  primaryChannel: 'remote' as V1030IheatInlandHeatChannel,
  aridAdaptationBand: 'recovering' as V1030IheatAridAdaptationBand,
  seed: 127150,
} as const;

const V1030_IHEAT_HEATWAVE_SCENARIO_139_COEF = {
  k0: 85.6000,
  k1: 39.0000,
  k2: 92.1000,
  k3: 45.5000,
  k4: 98.6000,
  k5: 52.0000,
  k6: 5.4000,
  k7: 58.5000,
  k8: 11.9000,
  k9: 65.0000,
  k10: 18.4000,
  k11: 71.5000,
  k12: 24.9000,
  k13: 78.0000,
  k14: 31.4000,
  k15: 84.5000,
  k16: 37.9000,
  k17: 91.0000,
  k18: 44.4000,
  k19: 97.5000,
  k20: 50.9000,
  k21: 4.3000,
  k22: 57.4000,
  k23: 10.8000,
  k24: 63.9000,
  k25: 17.3000,
  k26: 70.4000,
  k27: 23.8000,
  k28: 76.9000,
  k29: 30.3000,
  k30: 83.4000,
  k31: 36.8000,
  k32: 89.9000,
  k33: 43.3000,
  k34: 96.4000,
  k35: 49.8000,
  k36: 3.2000,
  k37: 56.3000,
  k38: 9.7000,
  k39: 62.8000,
  k40: 16.2000,
  k41: 69.3000,
  k42: 22.7000,
  k43: 75.8000,
  k44: 29.2000,
  k45: 82.3000,
  k46: 35.7000,
  k47: 88.8000,
  k48: 42.2000,
  k49: 95.3000,
  k50: 48.7000,
  k51: 2.1000,
  k52: 55.2000,
  k53: 8.6000,
  k54: 61.7000,
  k55: 15.1000,
  k56: 68.2000,
  k57: 21.6000,
  k58: 74.7000,
  k59: 28.1000,
  k60: 81.2000,
  k61: 34.6000,
  k62: 87.7000,
  k63: 41.1000,
  k64: 94.2000,
  k65: 47.6000,
  k66: 1.0000,
  k67: 54.1000,
  k68: 7.5000,
  k69: 60.6000,
  k70: 14.0000,
  k71: 67.1000,
} as const;

export function V1030_IHEAT_HEATWAVE_SCENARIO_139_evaluate(turn: number): {
  inlandHeatExposureIndex: number;
  aridBufferDelayTurns: number;
  aridAdaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1030_IHEAT_HEATWAVE_SCENARIO_139_COEF) as Array<
    keyof typeof V1030_IHEAT_HEATWAVE_SCENARIO_139_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1030_IHEAT_HEATWAVE_SCENARIO_139_COEF[keys[j]] * ((turn + j) % 17);
  }
  const inlandHeatExposureIndex = V1030_IHEAT_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aridBufferDelayTurns = V1030_IHEAT_clamp(2 + (acc % 11), 1, 18);
  const aridAdaptationScore = V1030_IHEAT_clamp(90 - inlandHeatExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1030_IHEAT_aridAdaptationBandFromScore(aridAdaptationScore) !== 'depleted';
  return { inlandHeatExposureIndex, aridBufferDelayTurns, aridAdaptationScore, stable };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_139_snapshot(turn: number): V1030IheatHeatwaveSnapshot {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_139_evaluate(turn);
  return {
    scenarioId: V1030_IHEAT_HEATWAVE_SCENARIO_139_META.id,
    regionId: V1030_IHEAT_HEATWAVE_SCENARIO_139_META.regionId,
    inlandHeatChannel: V1030_IHEAT_HEATWAVE_SCENARIO_139_META.primaryChannel,
    aridAdaptationBand: V1030_IHEAT_HEATWAVE_SCENARIO_139_META.aridAdaptationBand,
    inlandHeatExposureIndex: r.inlandHeatExposureIndex,
    aridBufferDelayTurns: r.aridBufferDelayTurns,
    aridAdaptationScore: r.aridAdaptationScore,
    aridAdaptationBand: V1030_IHEAT_aridAdaptationBandFromScore(r.aridAdaptationScore),
  };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_139_regressionAssert(turn: number): boolean {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_139_evaluate(turn);
  return typeof r.inlandHeatExposureIndex === 'number' && r.aridAdaptationScore <= 100;
}
