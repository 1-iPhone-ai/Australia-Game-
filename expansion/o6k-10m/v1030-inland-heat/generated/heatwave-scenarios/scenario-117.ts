import { V1030_IHEAT_clamp, V1030_IHEAT_aridAdaptationBandFromScore } from '../../engine/inland-heat-utils.ts';
import type {
  V1030IheatAridAdaptationBand,
  V1030IheatRegionId,
  V1030IheatHeatwaveSnapshot,
  V1030IheatInlandHeatChannel,
} from '../../types/core.ts';

/** Generated heatwave scenario 117 — extreme_heat/drought/dust handoff matrix. */
export const V1030_IHEAT_HEATWAVE_SCENARIO_117_META = {
  id: 'heatwave_117',
  regionId: 'TAS' as V1030IheatRegionId,
  primaryChannel: 'mental_health' as V1030IheatInlandHeatChannel,
  aridAdaptationBand: 'elevated' as V1030IheatAridAdaptationBand,
  seed: 107108,
} as const;

const V1030_IHEAT_HEATWAVE_SCENARIO_117_COEF = {
  k0: 73.1000,
  k1: 16.3000,
  k2: 59.2000,
  k3: 2.4000,
  k4: 45.3000,
  k5: 88.2000,
  k6: 31.4000,
  k7: 74.3000,
  k8: 17.5000,
  k9: 60.4000,
  k10: 3.6000,
  k11: 46.5000,
  k12: 89.4000,
  k13: 32.6000,
  k14: 75.5000,
  k15: 18.7000,
  k16: 61.6000,
  k17: 4.8000,
  k18: 47.7000,
  k19: 90.6000,
  k20: 33.8000,
  k21: 76.7000,
  k22: 19.9000,
  k23: 62.8000,
  k24: 6.0000,
  k25: 48.9000,
  k26: 91.8000,
  k27: 35.0000,
  k28: 77.9000,
  k29: 21.1000,
  k30: 64.0000,
  k31: 7.2000,
  k32: 50.1000,
  k33: 93.0000,
  k34: 36.2000,
  k35: 79.1000,
  k36: 22.3000,
  k37: 65.2000,
  k38: 8.4000,
  k39: 51.3000,
  k40: 94.2000,
  k41: 37.4000,
  k42: 80.3000,
  k43: 23.5000,
  k44: 66.4000,
  k45: 9.6000,
  k46: 52.5000,
  k47: 95.4000,
  k48: 38.6000,
  k49: 81.5000,
  k50: 24.7000,
  k51: 67.6000,
  k52: 10.8000,
  k53: 53.7000,
  k54: 96.6000,
  k55: 39.8000,
  k56: 82.7000,
  k57: 25.9000,
  k58: 68.8000,
  k59: 12.0000,
  k60: 54.9000,
  k61: 97.8000,
  k62: 41.0000,
  k63: 83.9000,
  k64: 27.1000,
  k65: 70.0000,
  k66: 13.2000,
  k67: 56.1000,
  k68: 99.0000,
  k69: 42.2000,
  k70: 85.1000,
  k71: 28.3000,
} as const;

export function V1030_IHEAT_HEATWAVE_SCENARIO_117_evaluate(turn: number): {
  inlandHeatExposureIndex: number;
  aridBufferDelayTurns: number;
  aridAdaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1030_IHEAT_HEATWAVE_SCENARIO_117_COEF) as Array<
    keyof typeof V1030_IHEAT_HEATWAVE_SCENARIO_117_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1030_IHEAT_HEATWAVE_SCENARIO_117_COEF[keys[j]] * ((turn + j) % 17);
  }
  const inlandHeatExposureIndex = V1030_IHEAT_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aridBufferDelayTurns = V1030_IHEAT_clamp(2 + (acc % 11), 1, 18);
  const aridAdaptationScore = V1030_IHEAT_clamp(90 - inlandHeatExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1030_IHEAT_aridAdaptationBandFromScore(aridAdaptationScore) !== 'depleted';
  return { inlandHeatExposureIndex, aridBufferDelayTurns, aridAdaptationScore, stable };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_117_snapshot(turn: number): V1030IheatHeatwaveSnapshot {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_117_evaluate(turn);
  return {
    scenarioId: V1030_IHEAT_HEATWAVE_SCENARIO_117_META.id,
    regionId: V1030_IHEAT_HEATWAVE_SCENARIO_117_META.regionId,
    inlandHeatChannel: V1030_IHEAT_HEATWAVE_SCENARIO_117_META.primaryChannel,
    aridAdaptationBand: V1030_IHEAT_HEATWAVE_SCENARIO_117_META.aridAdaptationBand,
    inlandHeatExposureIndex: r.inlandHeatExposureIndex,
    aridBufferDelayTurns: r.aridBufferDelayTurns,
    aridAdaptationScore: r.aridAdaptationScore,
    aridAdaptationBand: V1030_IHEAT_aridAdaptationBandFromScore(r.aridAdaptationScore),
  };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_117_regressionAssert(turn: number): boolean {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_117_evaluate(turn);
  return typeof r.inlandHeatExposureIndex === 'number' && r.aridAdaptationScore <= 100;
}
