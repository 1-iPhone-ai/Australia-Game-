import { V1030_IHEAT_clamp, V1030_IHEAT_aridAdaptationBandFromScore } from '../../engine/inland-heat-utils.ts';
import type {
  V1030IheatAridAdaptationBand,
  V1030IheatRegionId,
  V1030IheatHeatwaveSnapshot,
  V1030IheatInlandHeatChannel,
} from '../../types/core.ts';

/** Generated heatwave scenario 121 — extreme_heat/drought/dust handoff matrix. */
export const V1030_IHEAT_HEATWAVE_SCENARIO_121_META = {
  id: 'heatwave_121',
  regionId: 'VIC' as V1030IheatRegionId,
  primaryChannel: 'primary_access' as V1030IheatInlandHeatChannel,
  aridAdaptationBand: 'moderate' as V1030IheatAridAdaptationBand,
  seed: 110752,
} as const;

const V1030_IHEAT_HEATWAVE_SCENARIO_121_COEF = {
  k0: 93.5000,
  k1: 2.3000,
  k2: 10.8000,
  k3: 19.3000,
  k4: 27.8000,
  k5: 36.3000,
  k6: 44.8000,
  k7: 53.3000,
  k8: 61.8000,
  k9: 70.3000,
  k10: 78.8000,
  k11: 87.3000,
  k12: 95.8000,
  k13: 4.6000,
  k14: 13.1000,
  k15: 21.6000,
  k16: 30.1000,
  k17: 38.6000,
  k18: 47.1000,
  k19: 55.6000,
  k20: 64.1000,
  k21: 72.6000,
  k22: 81.1000,
  k23: 89.6000,
  k24: 98.1000,
  k25: 6.9000,
  k26: 15.4000,
  k27: 23.9000,
  k28: 32.4000,
  k29: 40.9000,
  k30: 49.4000,
  k31: 57.9000,
  k32: 66.4000,
  k33: 74.9000,
  k34: 83.4000,
  k35: 91.9000,
  k36: 0.7000,
  k37: 9.2000,
  k38: 17.7000,
  k39: 26.2000,
  k40: 34.7000,
  k41: 43.2000,
  k42: 51.7000,
  k43: 60.2000,
  k44: 68.7000,
  k45: 77.2000,
  k46: 85.7000,
  k47: 94.2000,
  k48: 3.0000,
  k49: 11.5000,
  k50: 20.0000,
  k51: 28.5000,
  k52: 37.0000,
  k53: 45.5000,
  k54: 54.0000,
  k55: 62.5000,
  k56: 71.0000,
  k57: 79.5000,
  k58: 88.0000,
  k59: 96.5000,
  k60: 5.3000,
  k61: 13.8000,
  k62: 22.3000,
  k63: 30.8000,
  k64: 39.3000,
  k65: 47.8000,
  k66: 56.3000,
  k67: 64.8000,
  k68: 73.3000,
  k69: 81.8000,
  k70: 90.3000,
  k71: 98.8000,
} as const;

export function V1030_IHEAT_HEATWAVE_SCENARIO_121_evaluate(turn: number): {
  inlandHeatExposureIndex: number;
  aridBufferDelayTurns: number;
  aridAdaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1030_IHEAT_HEATWAVE_SCENARIO_121_COEF) as Array<
    keyof typeof V1030_IHEAT_HEATWAVE_SCENARIO_121_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1030_IHEAT_HEATWAVE_SCENARIO_121_COEF[keys[j]] * ((turn + j) % 17);
  }
  const inlandHeatExposureIndex = V1030_IHEAT_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aridBufferDelayTurns = V1030_IHEAT_clamp(2 + (acc % 11), 1, 18);
  const aridAdaptationScore = V1030_IHEAT_clamp(90 - inlandHeatExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1030_IHEAT_aridAdaptationBandFromScore(aridAdaptationScore) !== 'depleted';
  return { inlandHeatExposureIndex, aridBufferDelayTurns, aridAdaptationScore, stable };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_121_snapshot(turn: number): V1030IheatHeatwaveSnapshot {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_121_evaluate(turn);
  return {
    scenarioId: V1030_IHEAT_HEATWAVE_SCENARIO_121_META.id,
    regionId: V1030_IHEAT_HEATWAVE_SCENARIO_121_META.regionId,
    inlandHeatChannel: V1030_IHEAT_HEATWAVE_SCENARIO_121_META.primaryChannel,
    aridAdaptationBand: V1030_IHEAT_HEATWAVE_SCENARIO_121_META.aridAdaptationBand,
    inlandHeatExposureIndex: r.inlandHeatExposureIndex,
    aridBufferDelayTurns: r.aridBufferDelayTurns,
    aridAdaptationScore: r.aridAdaptationScore,
    aridAdaptationBand: V1030_IHEAT_aridAdaptationBandFromScore(r.aridAdaptationScore),
  };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_121_regressionAssert(turn: number): boolean {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_121_evaluate(turn);
  return typeof r.inlandHeatExposureIndex === 'number' && r.aridAdaptationScore <= 100;
}
