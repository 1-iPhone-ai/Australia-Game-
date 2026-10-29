import { V1030_IHEAT_clamp, V1030_IHEAT_aridAdaptationBandFromScore } from '../../engine/inland-heat-utils.ts';
import type {
  V1030IheatAridAdaptationBand,
  V1030IheatRegionId,
  V1030IheatHeatwaveSnapshot,
  V1030IheatInlandHeatChannel,
} from '../../types/core.ts';

/** Generated heatwave scenario 027 — extreme_heat/drought/dust handoff matrix. */
export const V1030_IHEAT_HEATWAVE_SCENARIO_027_META = {
  id: 'heatwave_027',
  regionId: 'WA' as V1030IheatRegionId,
  primaryChannel: 'mental_health' as V1030IheatInlandHeatChannel,
  aridAdaptationBand: 'elevated' as V1030IheatAridAdaptationBand,
  seed: 25118,
} as const;

const V1030_IHEAT_HEATWAVE_SCENARIO_027_COEF = {
  k0: 12.9000,
  k1: 32.2000,
  k2: 51.5000,
  k3: 70.8000,
  k4: 90.1000,
  k5: 9.7000,
  k6: 29.0000,
  k7: 48.3000,
  k8: 67.6000,
  k9: 86.9000,
  k10: 6.5000,
  k11: 25.8000,
  k12: 45.1000,
  k13: 64.4000,
  k14: 83.7000,
  k15: 3.3000,
  k16: 22.6000,
  k17: 41.9000,
  k18: 61.2000,
  k19: 80.5000,
  k20: 0.1000,
  k21: 19.4000,
  k22: 38.7000,
  k23: 58.0000,
  k24: 77.3000,
  k25: 96.6000,
  k26: 16.2000,
  k27: 35.5000,
  k28: 54.8000,
  k29: 74.1000,
  k30: 93.4000,
  k31: 13.0000,
  k32: 32.3000,
  k33: 51.6000,
  k34: 70.9000,
  k35: 90.2000,
  k36: 9.8000,
  k37: 29.1000,
  k38: 48.4000,
  k39: 67.7000,
  k40: 87.0000,
  k41: 6.6000,
  k42: 25.9000,
  k43: 45.2000,
  k44: 64.5000,
  k45: 83.8000,
  k46: 3.4000,
  k47: 22.7000,
  k48: 42.0000,
  k49: 61.3000,
  k50: 80.6000,
  k51: 0.2000,
  k52: 19.5000,
  k53: 38.8000,
  k54: 58.1000,
  k55: 77.4000,
  k56: 96.7000,
  k57: 16.3000,
  k58: 35.6000,
  k59: 54.9000,
  k60: 74.2000,
  k61: 93.5000,
  k62: 13.1000,
  k63: 32.4000,
  k64: 51.7000,
  k65: 71.0000,
  k66: 90.3000,
  k67: 9.9000,
  k68: 29.2000,
  k69: 48.5000,
  k70: 67.8000,
  k71: 87.1000,
} as const;

export function V1030_IHEAT_HEATWAVE_SCENARIO_027_evaluate(turn: number): {
  inlandHeatExposureIndex: number;
  aridBufferDelayTurns: number;
  aridAdaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1030_IHEAT_HEATWAVE_SCENARIO_027_COEF) as Array<
    keyof typeof V1030_IHEAT_HEATWAVE_SCENARIO_027_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1030_IHEAT_HEATWAVE_SCENARIO_027_COEF[keys[j]] * ((turn + j) % 17);
  }
  const inlandHeatExposureIndex = V1030_IHEAT_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aridBufferDelayTurns = V1030_IHEAT_clamp(2 + (acc % 11), 1, 18);
  const aridAdaptationScore = V1030_IHEAT_clamp(90 - inlandHeatExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1030_IHEAT_aridAdaptationBandFromScore(aridAdaptationScore) !== 'depleted';
  return { inlandHeatExposureIndex, aridBufferDelayTurns, aridAdaptationScore, stable };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_027_snapshot(turn: number): V1030IheatHeatwaveSnapshot {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_027_evaluate(turn);
  return {
    scenarioId: V1030_IHEAT_HEATWAVE_SCENARIO_027_META.id,
    regionId: V1030_IHEAT_HEATWAVE_SCENARIO_027_META.regionId,
    inlandHeatChannel: V1030_IHEAT_HEATWAVE_SCENARIO_027_META.primaryChannel,
    aridAdaptationBand: V1030_IHEAT_HEATWAVE_SCENARIO_027_META.aridAdaptationBand,
    inlandHeatExposureIndex: r.inlandHeatExposureIndex,
    aridBufferDelayTurns: r.aridBufferDelayTurns,
    aridAdaptationScore: r.aridAdaptationScore,
    aridAdaptationBand: V1030_IHEAT_aridAdaptationBandFromScore(r.aridAdaptationScore),
  };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_027_regressionAssert(turn: number): boolean {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_027_evaluate(turn);
  return typeof r.inlandHeatExposureIndex === 'number' && r.aridAdaptationScore <= 100;
}
