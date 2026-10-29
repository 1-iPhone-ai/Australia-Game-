import { V1030_IHEAT_clamp, V1030_IHEAT_aridAdaptationBandFromScore } from '../../engine/inland-heat-utils.ts';
import type {
  V1030IheatAridAdaptationBand,
  V1030IheatRegionId,
  V1030IheatHeatwaveSnapshot,
  V1030IheatInlandHeatChannel,
} from '../../types/core.ts';

/** Generated heatwave scenario 127 — extreme_heat/drought/dust handoff matrix. */
export const V1030_IHEAT_HEATWAVE_SCENARIO_127_META = {
  id: 'heatwave_127',
  regionId: 'ACT' as V1030IheatRegionId,
  primaryChannel: 'mental_health' as V1030IheatInlandHeatChannel,
  aridAdaptationBand: 'elevated' as V1030IheatAridAdaptationBand,
  seed: 116218,
} as const;

const V1030_IHEAT_HEATWAVE_SCENARIO_127_COEF = {
  k0: 24.4000,
  k1: 81.0000,
  k2: 37.9000,
  k3: 94.5000,
  k4: 51.4000,
  k5: 8.3000,
  k6: 64.9000,
  k7: 21.8000,
  k8: 78.4000,
  k9: 35.3000,
  k10: 91.9000,
  k11: 48.8000,
  k12: 5.7000,
  k13: 62.3000,
  k14: 19.2000,
  k15: 75.8000,
  k16: 32.7000,
  k17: 89.3000,
  k18: 46.2000,
  k19: 3.1000,
  k20: 59.7000,
  k21: 16.6000,
  k22: 73.2000,
  k23: 30.1000,
  k24: 86.7000,
  k25: 43.6000,
  k26: 0.5000,
  k27: 57.1000,
  k28: 14.0000,
  k29: 70.6000,
  k30: 27.5000,
  k31: 84.1000,
  k32: 41.0000,
  k33: 97.6000,
  k34: 54.5000,
  k35: 11.4000,
  k36: 68.0000,
  k37: 24.9000,
  k38: 81.5000,
  k39: 38.4000,
  k40: 95.0000,
  k41: 51.9000,
  k42: 8.8000,
  k43: 65.4000,
  k44: 22.3000,
  k45: 78.9000,
  k46: 35.8000,
  k47: 92.4000,
  k48: 49.3000,
  k49: 6.2000,
  k50: 62.8000,
  k51: 19.7000,
  k52: 76.3000,
  k53: 33.2000,
  k54: 89.8000,
  k55: 46.7000,
  k56: 3.6000,
  k57: 60.2000,
  k58: 17.1000,
  k59: 73.7000,
  k60: 30.6000,
  k61: 87.2000,
  k62: 44.1000,
  k63: 1.0000,
  k64: 57.6000,
  k65: 14.5000,
  k66: 71.1000,
  k67: 28.0000,
  k68: 84.6000,
  k69: 41.5000,
  k70: 98.1000,
  k71: 55.0000,
} as const;

export function V1030_IHEAT_HEATWAVE_SCENARIO_127_evaluate(turn: number): {
  inlandHeatExposureIndex: number;
  aridBufferDelayTurns: number;
  aridAdaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1030_IHEAT_HEATWAVE_SCENARIO_127_COEF) as Array<
    keyof typeof V1030_IHEAT_HEATWAVE_SCENARIO_127_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1030_IHEAT_HEATWAVE_SCENARIO_127_COEF[keys[j]] * ((turn + j) % 17);
  }
  const inlandHeatExposureIndex = V1030_IHEAT_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aridBufferDelayTurns = V1030_IHEAT_clamp(2 + (acc % 11), 1, 18);
  const aridAdaptationScore = V1030_IHEAT_clamp(90 - inlandHeatExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1030_IHEAT_aridAdaptationBandFromScore(aridAdaptationScore) !== 'depleted';
  return { inlandHeatExposureIndex, aridBufferDelayTurns, aridAdaptationScore, stable };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_127_snapshot(turn: number): V1030IheatHeatwaveSnapshot {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_127_evaluate(turn);
  return {
    scenarioId: V1030_IHEAT_HEATWAVE_SCENARIO_127_META.id,
    regionId: V1030_IHEAT_HEATWAVE_SCENARIO_127_META.regionId,
    inlandHeatChannel: V1030_IHEAT_HEATWAVE_SCENARIO_127_META.primaryChannel,
    aridAdaptationBand: V1030_IHEAT_HEATWAVE_SCENARIO_127_META.aridAdaptationBand,
    inlandHeatExposureIndex: r.inlandHeatExposureIndex,
    aridBufferDelayTurns: r.aridBufferDelayTurns,
    aridAdaptationScore: r.aridAdaptationScore,
    aridAdaptationBand: V1030_IHEAT_aridAdaptationBandFromScore(r.aridAdaptationScore),
  };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_127_regressionAssert(turn: number): boolean {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_127_evaluate(turn);
  return typeof r.inlandHeatExposureIndex === 'number' && r.aridAdaptationScore <= 100;
}
