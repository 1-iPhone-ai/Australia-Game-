import { V1030_IHEAT_clamp, V1030_IHEAT_aridAdaptationBandFromScore } from '../../engine/inland-heat-utils.ts';
import type {
  V1030IheatAridAdaptationBand,
  V1030IheatRegionId,
  V1030IheatHeatwaveSnapshot,
  V1030IheatInlandHeatChannel,
} from '../../types/core.ts';

/** Generated heatwave scenario 061 — extreme_heat/drought/dust handoff matrix. */
export const V1030_IHEAT_HEATWAVE_SCENARIO_061_META = {
  id: 'heatwave_061',
  regionId: 'TAS' as V1030IheatRegionId,
  primaryChannel: 'primary_access' as V1030IheatInlandHeatChannel,
  aridAdaptationBand: 'moderate' as V1030IheatAridAdaptationBand,
  seed: 56092,
} as const;

const V1030_IHEAT_HEATWAVE_SCENARIO_061_COEF = {
  k0: 86.6000,
  k1: 12.9000,
  k2: 38.9000,
  k3: 64.9000,
  k4: 90.9000,
  k5: 17.2000,
  k6: 43.2000,
  k7: 69.2000,
  k8: 95.2000,
  k9: 21.5000,
  k10: 47.5000,
  k11: 73.5000,
  k12: 99.5000,
  k13: 25.8000,
  k14: 51.8000,
  k15: 77.8000,
  k16: 4.1000,
  k17: 30.1000,
  k18: 56.1000,
  k19: 82.1000,
  k20: 8.4000,
  k21: 34.4000,
  k22: 60.4000,
  k23: 86.4000,
  k24: 12.7000,
  k25: 38.7000,
  k26: 64.7000,
  k27: 90.7000,
  k28: 17.0000,
  k29: 43.0000,
  k30: 69.0000,
  k31: 95.0000,
  k32: 21.3000,
  k33: 47.3000,
  k34: 73.3000,
  k35: 99.3000,
  k36: 25.6000,
  k37: 51.6000,
  k38: 77.6000,
  k39: 3.9000,
  k40: 29.9000,
  k41: 55.9000,
  k42: 81.9000,
  k43: 8.2000,
  k44: 34.2000,
  k45: 60.2000,
  k46: 86.2000,
  k47: 12.5000,
  k48: 38.5000,
  k49: 64.5000,
  k50: 90.5000,
  k51: 16.8000,
  k52: 42.8000,
  k53: 68.8000,
  k54: 94.8000,
  k55: 21.1000,
  k56: 47.1000,
  k57: 73.1000,
  k58: 99.1000,
  k59: 25.4000,
  k60: 51.4000,
  k61: 77.4000,
  k62: 3.7000,
  k63: 29.7000,
  k64: 55.7000,
  k65: 81.7000,
  k66: 8.0000,
  k67: 34.0000,
  k68: 60.0000,
  k69: 86.0000,
  k70: 12.3000,
  k71: 38.3000,
} as const;

export function V1030_IHEAT_HEATWAVE_SCENARIO_061_evaluate(turn: number): {
  inlandHeatExposureIndex: number;
  aridBufferDelayTurns: number;
  aridAdaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1030_IHEAT_HEATWAVE_SCENARIO_061_COEF) as Array<
    keyof typeof V1030_IHEAT_HEATWAVE_SCENARIO_061_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1030_IHEAT_HEATWAVE_SCENARIO_061_COEF[keys[j]] * ((turn + j) % 17);
  }
  const inlandHeatExposureIndex = V1030_IHEAT_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aridBufferDelayTurns = V1030_IHEAT_clamp(2 + (acc % 11), 1, 18);
  const aridAdaptationScore = V1030_IHEAT_clamp(90 - inlandHeatExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1030_IHEAT_aridAdaptationBandFromScore(aridAdaptationScore) !== 'depleted';
  return { inlandHeatExposureIndex, aridBufferDelayTurns, aridAdaptationScore, stable };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_061_snapshot(turn: number): V1030IheatHeatwaveSnapshot {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_061_evaluate(turn);
  return {
    scenarioId: V1030_IHEAT_HEATWAVE_SCENARIO_061_META.id,
    regionId: V1030_IHEAT_HEATWAVE_SCENARIO_061_META.regionId,
    inlandHeatChannel: V1030_IHEAT_HEATWAVE_SCENARIO_061_META.primaryChannel,
    aridAdaptationBand: V1030_IHEAT_HEATWAVE_SCENARIO_061_META.aridAdaptationBand,
    inlandHeatExposureIndex: r.inlandHeatExposureIndex,
    aridBufferDelayTurns: r.aridBufferDelayTurns,
    aridAdaptationScore: r.aridAdaptationScore,
    aridAdaptationBand: V1030_IHEAT_aridAdaptationBandFromScore(r.aridAdaptationScore),
  };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_061_regressionAssert(turn: number): boolean {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_061_evaluate(turn);
  return typeof r.inlandHeatExposureIndex === 'number' && r.aridAdaptationScore <= 100;
}
