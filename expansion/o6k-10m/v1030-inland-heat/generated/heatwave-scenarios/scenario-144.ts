import { V1030_IHEAT_clamp, V1030_IHEAT_aridAdaptationBandFromScore } from '../../engine/inland-heat-utils.ts';
import type {
  V1030IheatAridAdaptationBand,
  V1030IheatRegionId,
  V1030IheatHeatwaveSnapshot,
  V1030IheatInlandHeatChannel,
} from '../../types/core.ts';

/** Generated heatwave scenario 144 — extreme_heat/drought/dust handoff matrix. */
export const V1030_IHEAT_HEATWAVE_SCENARIO_144_META = {
  id: 'heatwave_144',
  regionId: 'NSW' as V1030IheatRegionId,
  primaryChannel: 'rural_clinic' as V1030IheatInlandHeatChannel,
  aridAdaptationBand: 'recovering' as V1030IheatAridAdaptationBand,
  seed: 131705,
} as const;

const V1030_IHEAT_HEATWAVE_SCENARIO_144_COEF = {
  k0: 11.4000,
  k1: 21.5000,
  k2: 31.6000,
  k3: 41.7000,
  k4: 51.8000,
  k5: 61.9000,
  k6: 72.0000,
  k7: 82.1000,
  k8: 92.2000,
  k9: 2.6000,
  k10: 12.7000,
  k11: 22.8000,
  k12: 32.9000,
  k13: 43.0000,
  k14: 53.1000,
  k15: 63.2000,
  k16: 73.3000,
  k17: 83.4000,
  k18: 93.5000,
  k19: 3.9000,
  k20: 14.0000,
  k21: 24.1000,
  k22: 34.2000,
  k23: 44.3000,
  k24: 54.4000,
  k25: 64.5000,
  k26: 74.6000,
  k27: 84.7000,
  k28: 94.8000,
  k29: 5.2000,
  k30: 15.3000,
  k31: 25.4000,
  k32: 35.5000,
  k33: 45.6000,
  k34: 55.7000,
  k35: 65.8000,
  k36: 75.9000,
  k37: 86.0000,
  k38: 96.1000,
  k39: 6.5000,
  k40: 16.6000,
  k41: 26.7000,
  k42: 36.8000,
  k43: 46.9000,
  k44: 57.0000,
  k45: 67.1000,
  k46: 77.2000,
  k47: 87.3000,
  k48: 97.4000,
  k49: 7.8000,
  k50: 17.9000,
  k51: 28.0000,
  k52: 38.1000,
  k53: 48.2000,
  k54: 58.3000,
  k55: 68.4000,
  k56: 78.5000,
  k57: 88.6000,
  k58: 98.7000,
  k59: 9.1000,
  k60: 19.2000,
  k61: 29.3000,
  k62: 39.4000,
  k63: 49.5000,
  k64: 59.6000,
  k65: 69.7000,
  k66: 79.8000,
  k67: 89.9000,
  k68: 0.3000,
  k69: 10.4000,
  k70: 20.5000,
  k71: 30.6000,
} as const;

export function V1030_IHEAT_HEATWAVE_SCENARIO_144_evaluate(turn: number): {
  inlandHeatExposureIndex: number;
  aridBufferDelayTurns: number;
  aridAdaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1030_IHEAT_HEATWAVE_SCENARIO_144_COEF) as Array<
    keyof typeof V1030_IHEAT_HEATWAVE_SCENARIO_144_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1030_IHEAT_HEATWAVE_SCENARIO_144_COEF[keys[j]] * ((turn + j) % 17);
  }
  const inlandHeatExposureIndex = V1030_IHEAT_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aridBufferDelayTurns = V1030_IHEAT_clamp(2 + (acc % 11), 1, 18);
  const aridAdaptationScore = V1030_IHEAT_clamp(90 - inlandHeatExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1030_IHEAT_aridAdaptationBandFromScore(aridAdaptationScore) !== 'depleted';
  return { inlandHeatExposureIndex, aridBufferDelayTurns, aridAdaptationScore, stable };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_144_snapshot(turn: number): V1030IheatHeatwaveSnapshot {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_144_evaluate(turn);
  return {
    scenarioId: V1030_IHEAT_HEATWAVE_SCENARIO_144_META.id,
    regionId: V1030_IHEAT_HEATWAVE_SCENARIO_144_META.regionId,
    inlandHeatChannel: V1030_IHEAT_HEATWAVE_SCENARIO_144_META.primaryChannel,
    aridAdaptationBand: V1030_IHEAT_HEATWAVE_SCENARIO_144_META.aridAdaptationBand,
    inlandHeatExposureIndex: r.inlandHeatExposureIndex,
    aridBufferDelayTurns: r.aridBufferDelayTurns,
    aridAdaptationScore: r.aridAdaptationScore,
    aridAdaptationBand: V1030_IHEAT_aridAdaptationBandFromScore(r.aridAdaptationScore),
  };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_144_regressionAssert(turn: number): boolean {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_144_evaluate(turn);
  return typeof r.inlandHeatExposureIndex === 'number' && r.aridAdaptationScore <= 100;
}
