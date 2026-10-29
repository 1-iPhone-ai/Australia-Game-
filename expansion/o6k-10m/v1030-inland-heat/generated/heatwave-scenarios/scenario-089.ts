import { V1030_IHEAT_clamp, V1030_IHEAT_aridAdaptationBandFromScore } from '../../engine/inland-heat-utils.ts';
import type {
  V1030IheatAridAdaptationBand,
  V1030IheatRegionId,
  V1030IheatHeatwaveSnapshot,
  V1030IheatInlandHeatChannel,
} from '../../types/core.ts';

/** Generated heatwave scenario 089 — extreme_heat/drought/dust handoff matrix. */
export const V1030_IHEAT_HEATWAVE_SCENARIO_089_META = {
  id: 'heatwave_089',
  regionId: 'VIC' as V1030IheatRegionId,
  primaryChannel: 'remote' as V1030IheatInlandHeatChannel,
  aridAdaptationBand: 'recovering' as V1030IheatAridAdaptationBand,
  seed: 81600,
} as const;

const V1030_IHEAT_HEATWAVE_SCENARIO_089_COEF = {
  k0: 30.0000,
  k1: 14.6000,
  k2: 98.9000,
  k3: 83.5000,
  k4: 68.1000,
  k5: 52.7000,
  k6: 37.3000,
  k7: 21.9000,
  k8: 6.5000,
  k9: 90.8000,
  k10: 75.4000,
  k11: 60.0000,
  k12: 44.6000,
  k13: 29.2000,
  k14: 13.8000,
  k15: 98.1000,
  k16: 82.7000,
  k17: 67.3000,
  k18: 51.9000,
  k19: 36.5000,
  k20: 21.1000,
  k21: 5.7000,
  k22: 90.0000,
  k23: 74.6000,
  k24: 59.2000,
  k25: 43.8000,
  k26: 28.4000,
  k27: 13.0000,
  k28: 97.3000,
  k29: 81.9000,
  k30: 66.5000,
  k31: 51.1000,
  k32: 35.7000,
  k33: 20.3000,
  k34: 4.9000,
  k35: 89.2000,
  k36: 73.8000,
  k37: 58.4000,
  k38: 43.0000,
  k39: 27.6000,
  k40: 12.2000,
  k41: 96.5000,
  k42: 81.1000,
  k43: 65.7000,
  k44: 50.3000,
  k45: 34.9000,
  k46: 19.5000,
  k47: 4.1000,
  k48: 88.4000,
  k49: 73.0000,
  k50: 57.6000,
  k51: 42.2000,
  k52: 26.8000,
  k53: 11.4000,
  k54: 95.7000,
  k55: 80.3000,
  k56: 64.9000,
  k57: 49.5000,
  k58: 34.1000,
  k59: 18.7000,
  k60: 3.3000,
  k61: 87.6000,
  k62: 72.2000,
  k63: 56.8000,
  k64: 41.4000,
  k65: 26.0000,
  k66: 10.6000,
  k67: 94.9000,
  k68: 79.5000,
  k69: 64.1000,
  k70: 48.7000,
  k71: 33.3000,
} as const;

export function V1030_IHEAT_HEATWAVE_SCENARIO_089_evaluate(turn: number): {
  inlandHeatExposureIndex: number;
  aridBufferDelayTurns: number;
  aridAdaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1030_IHEAT_HEATWAVE_SCENARIO_089_COEF) as Array<
    keyof typeof V1030_IHEAT_HEATWAVE_SCENARIO_089_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1030_IHEAT_HEATWAVE_SCENARIO_089_COEF[keys[j]] * ((turn + j) % 17);
  }
  const inlandHeatExposureIndex = V1030_IHEAT_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aridBufferDelayTurns = V1030_IHEAT_clamp(2 + (acc % 11), 1, 18);
  const aridAdaptationScore = V1030_IHEAT_clamp(90 - inlandHeatExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1030_IHEAT_aridAdaptationBandFromScore(aridAdaptationScore) !== 'depleted';
  return { inlandHeatExposureIndex, aridBufferDelayTurns, aridAdaptationScore, stable };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_089_snapshot(turn: number): V1030IheatHeatwaveSnapshot {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_089_evaluate(turn);
  return {
    scenarioId: V1030_IHEAT_HEATWAVE_SCENARIO_089_META.id,
    regionId: V1030_IHEAT_HEATWAVE_SCENARIO_089_META.regionId,
    inlandHeatChannel: V1030_IHEAT_HEATWAVE_SCENARIO_089_META.primaryChannel,
    aridAdaptationBand: V1030_IHEAT_HEATWAVE_SCENARIO_089_META.aridAdaptationBand,
    inlandHeatExposureIndex: r.inlandHeatExposureIndex,
    aridBufferDelayTurns: r.aridBufferDelayTurns,
    aridAdaptationScore: r.aridAdaptationScore,
    aridAdaptationBand: V1030_IHEAT_aridAdaptationBandFromScore(r.aridAdaptationScore),
  };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_089_regressionAssert(turn: number): boolean {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_089_evaluate(turn);
  return typeof r.inlandHeatExposureIndex === 'number' && r.aridAdaptationScore <= 100;
}
