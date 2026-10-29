import { V1030_IHEAT_clamp, V1030_IHEAT_aridAdaptationBandFromScore } from '../../engine/inland-heat-utils.ts';
import type {
  V1030IheatAridAdaptationBand,
  V1030IheatRegionId,
  V1030IheatHeatwaveSnapshot,
  V1030IheatInlandHeatChannel,
} from '../../types/core.ts';

/** Generated heatwave scenario 133 — extreme_heat/drought/dust handoff matrix. */
export const V1030_IHEAT_HEATWAVE_SCENARIO_133_META = {
  id: 'heatwave_133',
  regionId: 'TAS' as V1030IheatRegionId,
  primaryChannel: 'telehealth' as V1030IheatInlandHeatChannel,
  aridAdaptationBand: 'critical' as V1030IheatAridAdaptationBand,
  seed: 121684,
} as const;

const V1030_IHEAT_HEATWAVE_SCENARIO_133_COEF = {
  k0: 55.0000,
  k1: 60.0000,
  k2: 65.0000,
  k3: 70.0000,
  k4: 75.0000,
  k5: 80.0000,
  k6: 85.0000,
  k7: 90.0000,
  k8: 95.0000,
  k9: 0.3000,
  k10: 5.3000,
  k11: 10.3000,
  k12: 15.3000,
  k13: 20.3000,
  k14: 25.3000,
  k15: 30.3000,
  k16: 35.3000,
  k17: 40.3000,
  k18: 45.3000,
  k19: 50.3000,
  k20: 55.3000,
  k21: 60.3000,
  k22: 65.3000,
  k23: 70.3000,
  k24: 75.3000,
  k25: 80.3000,
  k26: 85.3000,
  k27: 90.3000,
  k28: 95.3000,
  k29: 0.6000,
  k30: 5.6000,
  k31: 10.6000,
  k32: 15.6000,
  k33: 20.6000,
  k34: 25.6000,
  k35: 30.6000,
  k36: 35.6000,
  k37: 40.6000,
  k38: 45.6000,
  k39: 50.6000,
  k40: 55.6000,
  k41: 60.6000,
  k42: 65.6000,
  k43: 70.6000,
  k44: 75.6000,
  k45: 80.6000,
  k46: 85.6000,
  k47: 90.6000,
  k48: 95.6000,
  k49: 0.9000,
  k50: 5.9000,
  k51: 10.9000,
  k52: 15.9000,
  k53: 20.9000,
  k54: 25.9000,
  k55: 30.9000,
  k56: 35.9000,
  k57: 40.9000,
  k58: 45.9000,
  k59: 50.9000,
  k60: 55.9000,
  k61: 60.9000,
  k62: 65.9000,
  k63: 70.9000,
  k64: 75.9000,
  k65: 80.9000,
  k66: 85.9000,
  k67: 90.9000,
  k68: 95.9000,
  k69: 1.2000,
  k70: 6.2000,
  k71: 11.2000,
} as const;

export function V1030_IHEAT_HEATWAVE_SCENARIO_133_evaluate(turn: number): {
  inlandHeatExposureIndex: number;
  aridBufferDelayTurns: number;
  aridAdaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1030_IHEAT_HEATWAVE_SCENARIO_133_COEF) as Array<
    keyof typeof V1030_IHEAT_HEATWAVE_SCENARIO_133_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1030_IHEAT_HEATWAVE_SCENARIO_133_COEF[keys[j]] * ((turn + j) % 17);
  }
  const inlandHeatExposureIndex = V1030_IHEAT_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aridBufferDelayTurns = V1030_IHEAT_clamp(2 + (acc % 11), 1, 18);
  const aridAdaptationScore = V1030_IHEAT_clamp(90 - inlandHeatExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1030_IHEAT_aridAdaptationBandFromScore(aridAdaptationScore) !== 'depleted';
  return { inlandHeatExposureIndex, aridBufferDelayTurns, aridAdaptationScore, stable };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_133_snapshot(turn: number): V1030IheatHeatwaveSnapshot {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_133_evaluate(turn);
  return {
    scenarioId: V1030_IHEAT_HEATWAVE_SCENARIO_133_META.id,
    regionId: V1030_IHEAT_HEATWAVE_SCENARIO_133_META.regionId,
    inlandHeatChannel: V1030_IHEAT_HEATWAVE_SCENARIO_133_META.primaryChannel,
    aridAdaptationBand: V1030_IHEAT_HEATWAVE_SCENARIO_133_META.aridAdaptationBand,
    inlandHeatExposureIndex: r.inlandHeatExposureIndex,
    aridBufferDelayTurns: r.aridBufferDelayTurns,
    aridAdaptationScore: r.aridAdaptationScore,
    aridAdaptationBand: V1030_IHEAT_aridAdaptationBandFromScore(r.aridAdaptationScore),
  };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_133_regressionAssert(turn: number): boolean {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_133_evaluate(turn);
  return typeof r.inlandHeatExposureIndex === 'number' && r.aridAdaptationScore <= 100;
}
