import { V1030_IHEAT_clamp, V1030_IHEAT_aridAdaptationBandFromScore } from '../../engine/inland-heat-utils.ts';
import type {
  V1030IheatAridAdaptationBand,
  V1030IheatRegionId,
  V1030IheatHeatwaveSnapshot,
  V1030IheatInlandHeatChannel,
} from '../../types/core.ts';

/** Generated heatwave scenario 146 — extreme_heat/drought/dust handoff matrix. */
export const V1030_IHEAT_HEATWAVE_SCENARIO_146_META = {
  id: 'heatwave_146',
  regionId: 'QLD' as V1030IheatRegionId,
  primaryChannel: 'aged_care' as V1030IheatInlandHeatChannel,
  aridAdaptationBand: 'moderate' as V1030IheatAridAdaptationBand,
  seed: 133527,
} as const;

const V1030_IHEAT_HEATWAVE_SCENARIO_146_COEF = {
  k0: 21.6000,
  k1: 14.5000,
  k2: 7.4000,
  k3: 0.3000,
  k4: 92.9000,
  k5: 85.8000,
  k6: 78.7000,
  k7: 71.6000,
  k8: 64.5000,
  k9: 57.4000,
  k10: 50.3000,
  k11: 43.2000,
  k12: 36.1000,
  k13: 29.0000,
  k14: 21.9000,
  k15: 14.8000,
  k16: 7.7000,
  k17: 0.6000,
  k18: 93.2000,
  k19: 86.1000,
  k20: 79.0000,
  k21: 71.9000,
  k22: 64.8000,
  k23: 57.7000,
  k24: 50.6000,
  k25: 43.5000,
  k26: 36.4000,
  k27: 29.3000,
  k28: 22.2000,
  k29: 15.1000,
  k30: 8.0000,
  k31: 0.9000,
  k32: 93.5000,
  k33: 86.4000,
  k34: 79.3000,
  k35: 72.2000,
  k36: 65.1000,
  k37: 58.0000,
  k38: 50.9000,
  k39: 43.8000,
  k40: 36.7000,
  k41: 29.6000,
  k42: 22.5000,
  k43: 15.4000,
  k44: 8.3000,
  k45: 1.2000,
  k46: 93.8000,
  k47: 86.7000,
  k48: 79.6000,
  k49: 72.5000,
  k50: 65.4000,
  k51: 58.3000,
  k52: 51.2000,
  k53: 44.1000,
  k54: 37.0000,
  k55: 29.9000,
  k56: 22.8000,
  k57: 15.7000,
  k58: 8.6000,
  k59: 1.5000,
  k60: 94.1000,
  k61: 87.0000,
  k62: 79.9000,
  k63: 72.8000,
  k64: 65.7000,
  k65: 58.6000,
  k66: 51.5000,
  k67: 44.4000,
  k68: 37.3000,
  k69: 30.2000,
  k70: 23.1000,
  k71: 16.0000,
} as const;

export function V1030_IHEAT_HEATWAVE_SCENARIO_146_evaluate(turn: number): {
  inlandHeatExposureIndex: number;
  aridBufferDelayTurns: number;
  aridAdaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1030_IHEAT_HEATWAVE_SCENARIO_146_COEF) as Array<
    keyof typeof V1030_IHEAT_HEATWAVE_SCENARIO_146_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1030_IHEAT_HEATWAVE_SCENARIO_146_COEF[keys[j]] * ((turn + j) % 17);
  }
  const inlandHeatExposureIndex = V1030_IHEAT_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aridBufferDelayTurns = V1030_IHEAT_clamp(2 + (acc % 11), 1, 18);
  const aridAdaptationScore = V1030_IHEAT_clamp(90 - inlandHeatExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1030_IHEAT_aridAdaptationBandFromScore(aridAdaptationScore) !== 'depleted';
  return { inlandHeatExposureIndex, aridBufferDelayTurns, aridAdaptationScore, stable };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_146_snapshot(turn: number): V1030IheatHeatwaveSnapshot {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_146_evaluate(turn);
  return {
    scenarioId: V1030_IHEAT_HEATWAVE_SCENARIO_146_META.id,
    regionId: V1030_IHEAT_HEATWAVE_SCENARIO_146_META.regionId,
    inlandHeatChannel: V1030_IHEAT_HEATWAVE_SCENARIO_146_META.primaryChannel,
    aridAdaptationBand: V1030_IHEAT_HEATWAVE_SCENARIO_146_META.aridAdaptationBand,
    inlandHeatExposureIndex: r.inlandHeatExposureIndex,
    aridBufferDelayTurns: r.aridBufferDelayTurns,
    aridAdaptationScore: r.aridAdaptationScore,
    aridAdaptationBand: V1030_IHEAT_aridAdaptationBandFromScore(r.aridAdaptationScore),
  };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_146_regressionAssert(turn: number): boolean {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_146_evaluate(turn);
  return typeof r.inlandHeatExposureIndex === 'number' && r.aridAdaptationScore <= 100;
}
