import { V1030_IHEAT_clamp, V1030_IHEAT_aridAdaptationBandFromScore } from '../../engine/inland-heat-utils.ts';
import type {
  V1030IheatAridAdaptationBand,
  V1030IheatRegionId,
  V1030IheatHeatwaveSnapshot,
  V1030IheatInlandHeatChannel,
} from '../../types/core.ts';

/** Generated heatwave scenario 131 — extreme_heat/drought/dust handoff matrix. */
export const V1030_IHEAT_HEATWAVE_SCENARIO_131_META = {
  id: 'heatwave_131',
  regionId: 'WA' as V1030IheatRegionId,
  primaryChannel: 'primary_access' as V1030IheatInlandHeatChannel,
  aridAdaptationBand: 'moderate' as V1030IheatAridAdaptationBand,
  seed: 119862,
} as const;

const V1030_IHEAT_HEATWAVE_SCENARIO_131_COEF = {
  k0: 44.8000,
  k1: 67.0000,
  k2: 89.2000,
  k3: 11.7000,
  k4: 33.9000,
  k5: 56.1000,
  k6: 78.3000,
  k7: 0.8000,
  k8: 23.0000,
  k9: 45.2000,
  k10: 67.4000,
  k11: 89.6000,
  k12: 12.1000,
  k13: 34.3000,
  k14: 56.5000,
  k15: 78.7000,
  k16: 1.2000,
  k17: 23.4000,
  k18: 45.6000,
  k19: 67.8000,
  k20: 90.0000,
  k21: 12.5000,
  k22: 34.7000,
  k23: 56.9000,
  k24: 79.1000,
  k25: 1.6000,
  k26: 23.8000,
  k27: 46.0000,
  k28: 68.2000,
  k29: 90.4000,
  k30: 12.9000,
  k31: 35.1000,
  k32: 57.3000,
  k33: 79.5000,
  k34: 2.0000,
  k35: 24.2000,
  k36: 46.4000,
  k37: 68.6000,
  k38: 90.8000,
  k39: 13.3000,
  k40: 35.5000,
  k41: 57.7000,
  k42: 79.9000,
  k43: 2.4000,
  k44: 24.6000,
  k45: 46.8000,
  k46: 69.0000,
  k47: 91.2000,
  k48: 13.7000,
  k49: 35.9000,
  k50: 58.1000,
  k51: 80.3000,
  k52: 2.8000,
  k53: 25.0000,
  k54: 47.2000,
  k55: 69.4000,
  k56: 91.6000,
  k57: 14.1000,
  k58: 36.3000,
  k59: 58.5000,
  k60: 80.7000,
  k61: 3.2000,
  k62: 25.4000,
  k63: 47.6000,
  k64: 69.8000,
  k65: 92.0000,
  k66: 14.5000,
  k67: 36.7000,
  k68: 58.9000,
  k69: 81.1000,
  k70: 3.6000,
  k71: 25.8000,
} as const;

export function V1030_IHEAT_HEATWAVE_SCENARIO_131_evaluate(turn: number): {
  inlandHeatExposureIndex: number;
  aridBufferDelayTurns: number;
  aridAdaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1030_IHEAT_HEATWAVE_SCENARIO_131_COEF) as Array<
    keyof typeof V1030_IHEAT_HEATWAVE_SCENARIO_131_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1030_IHEAT_HEATWAVE_SCENARIO_131_COEF[keys[j]] * ((turn + j) % 17);
  }
  const inlandHeatExposureIndex = V1030_IHEAT_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aridBufferDelayTurns = V1030_IHEAT_clamp(2 + (acc % 11), 1, 18);
  const aridAdaptationScore = V1030_IHEAT_clamp(90 - inlandHeatExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1030_IHEAT_aridAdaptationBandFromScore(aridAdaptationScore) !== 'depleted';
  return { inlandHeatExposureIndex, aridBufferDelayTurns, aridAdaptationScore, stable };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_131_snapshot(turn: number): V1030IheatHeatwaveSnapshot {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_131_evaluate(turn);
  return {
    scenarioId: V1030_IHEAT_HEATWAVE_SCENARIO_131_META.id,
    regionId: V1030_IHEAT_HEATWAVE_SCENARIO_131_META.regionId,
    inlandHeatChannel: V1030_IHEAT_HEATWAVE_SCENARIO_131_META.primaryChannel,
    aridAdaptationBand: V1030_IHEAT_HEATWAVE_SCENARIO_131_META.aridAdaptationBand,
    inlandHeatExposureIndex: r.inlandHeatExposureIndex,
    aridBufferDelayTurns: r.aridBufferDelayTurns,
    aridAdaptationScore: r.aridAdaptationScore,
    aridAdaptationBand: V1030_IHEAT_aridAdaptationBandFromScore(r.aridAdaptationScore),
  };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_131_regressionAssert(turn: number): boolean {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_131_evaluate(turn);
  return typeof r.inlandHeatExposureIndex === 'number' && r.aridAdaptationScore <= 100;
}
