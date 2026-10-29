import { V1030_IHEAT_clamp, V1030_IHEAT_aridAdaptationBandFromScore } from '../../engine/inland-heat-utils.ts';
import type {
  V1030IheatAridAdaptationBand,
  V1030IheatRegionId,
  V1030IheatHeatwaveSnapshot,
  V1030IheatInlandHeatChannel,
} from '../../types/core.ts';

/** Generated heatwave scenario 055 — extreme_heat/drought/dust handoff matrix. */
export const V1030_IHEAT_HEATWAVE_SCENARIO_055_META = {
  id: 'heatwave_055',
  regionId: 'ACT' as V1030IheatRegionId,
  primaryChannel: 'specialist_referral' as V1030IheatInlandHeatChannel,
  aridAdaptationBand: 'minimal' as V1030IheatAridAdaptationBand,
  seed: 50626,
} as const;

const V1030_IHEAT_HEATWAVE_SCENARIO_055_COEF = {
  k0: 56.0000,
  k1: 33.9000,
  k2: 11.8000,
  k3: 89.4000,
  k4: 67.3000,
  k5: 45.2000,
  k6: 23.1000,
  k7: 1.0000,
  k8: 78.6000,
  k9: 56.5000,
  k10: 34.4000,
  k11: 12.3000,
  k12: 89.9000,
  k13: 67.8000,
  k14: 45.7000,
  k15: 23.6000,
  k16: 1.5000,
  k17: 79.1000,
  k18: 57.0000,
  k19: 34.9000,
  k20: 12.8000,
  k21: 90.4000,
  k22: 68.3000,
  k23: 46.2000,
  k24: 24.1000,
  k25: 2.0000,
  k26: 79.6000,
  k27: 57.5000,
  k28: 35.4000,
  k29: 13.3000,
  k30: 90.9000,
  k31: 68.8000,
  k32: 46.7000,
  k33: 24.6000,
  k34: 2.5000,
  k35: 80.1000,
  k36: 58.0000,
  k37: 35.9000,
  k38: 13.8000,
  k39: 91.4000,
  k40: 69.3000,
  k41: 47.2000,
  k42: 25.1000,
  k43: 3.0000,
  k44: 80.6000,
  k45: 58.5000,
  k46: 36.4000,
  k47: 14.3000,
  k48: 91.9000,
  k49: 69.8000,
  k50: 47.7000,
  k51: 25.6000,
  k52: 3.5000,
  k53: 81.1000,
  k54: 59.0000,
  k55: 36.9000,
  k56: 14.8000,
  k57: 92.4000,
  k58: 70.3000,
  k59: 48.2000,
  k60: 26.1000,
  k61: 4.0000,
  k62: 81.6000,
  k63: 59.5000,
  k64: 37.4000,
  k65: 15.3000,
  k66: 92.9000,
  k67: 70.8000,
  k68: 48.7000,
  k69: 26.6000,
  k70: 4.5000,
  k71: 82.1000,
} as const;

export function V1030_IHEAT_HEATWAVE_SCENARIO_055_evaluate(turn: number): {
  inlandHeatExposureIndex: number;
  aridBufferDelayTurns: number;
  aridAdaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1030_IHEAT_HEATWAVE_SCENARIO_055_COEF) as Array<
    keyof typeof V1030_IHEAT_HEATWAVE_SCENARIO_055_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1030_IHEAT_HEATWAVE_SCENARIO_055_COEF[keys[j]] * ((turn + j) % 17);
  }
  const inlandHeatExposureIndex = V1030_IHEAT_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aridBufferDelayTurns = V1030_IHEAT_clamp(2 + (acc % 11), 1, 18);
  const aridAdaptationScore = V1030_IHEAT_clamp(90 - inlandHeatExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1030_IHEAT_aridAdaptationBandFromScore(aridAdaptationScore) !== 'depleted';
  return { inlandHeatExposureIndex, aridBufferDelayTurns, aridAdaptationScore, stable };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_055_snapshot(turn: number): V1030IheatHeatwaveSnapshot {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_055_evaluate(turn);
  return {
    scenarioId: V1030_IHEAT_HEATWAVE_SCENARIO_055_META.id,
    regionId: V1030_IHEAT_HEATWAVE_SCENARIO_055_META.regionId,
    inlandHeatChannel: V1030_IHEAT_HEATWAVE_SCENARIO_055_META.primaryChannel,
    aridAdaptationBand: V1030_IHEAT_HEATWAVE_SCENARIO_055_META.aridAdaptationBand,
    inlandHeatExposureIndex: r.inlandHeatExposureIndex,
    aridBufferDelayTurns: r.aridBufferDelayTurns,
    aridAdaptationScore: r.aridAdaptationScore,
    aridAdaptationBand: V1030_IHEAT_aridAdaptationBandFromScore(r.aridAdaptationScore),
  };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_055_regressionAssert(turn: number): boolean {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_055_evaluate(turn);
  return typeof r.inlandHeatExposureIndex === 'number' && r.aridAdaptationScore <= 100;
}
