import { V1030_IHEAT_clamp, V1030_IHEAT_aridAdaptationBandFromScore } from '../../engine/inland-heat-utils.ts';
import type {
  V1030IheatAridAdaptationBand,
  V1030IheatRegionId,
  V1030IheatHeatwaveSnapshot,
  V1030IheatInlandHeatChannel,
} from '../../types/core.ts';

/** Generated heatwave scenario 161 — extreme_heat/drought/dust handoff matrix. */
export const V1030_IHEAT_HEATWAVE_SCENARIO_161_META = {
  id: 'heatwave_161',
  regionId: 'VIC' as V1030IheatRegionId,
  primaryChannel: 'primary_access' as V1030IheatInlandHeatChannel,
  aridAdaptationBand: 'moderate' as V1030IheatAridAdaptationBand,
  seed: 147192,
} as const;

const V1030_IHEAT_HEATWAVE_SCENARIO_161_COEF = {
  k0: 98.1000,
  k1: 61.7000,
  k2: 25.3000,
  k3: 88.6000,
  k4: 52.2000,
  k5: 15.8000,
  k6: 79.1000,
  k7: 42.7000,
  k8: 6.3000,
  k9: 69.6000,
  k10: 33.2000,
  k11: 96.5000,
  k12: 60.1000,
  k13: 23.7000,
  k14: 87.0000,
  k15: 50.6000,
  k16: 14.2000,
  k17: 77.5000,
  k18: 41.1000,
  k19: 4.7000,
  k20: 68.0000,
  k21: 31.6000,
  k22: 94.9000,
  k23: 58.5000,
  k24: 22.1000,
  k25: 85.4000,
  k26: 49.0000,
  k27: 12.6000,
  k28: 75.9000,
  k29: 39.5000,
  k30: 3.1000,
  k31: 66.4000,
  k32: 30.0000,
  k33: 93.3000,
  k34: 56.9000,
  k35: 20.5000,
  k36: 83.8000,
  k37: 47.4000,
  k38: 11.0000,
  k39: 74.3000,
  k40: 37.9000,
  k41: 1.5000,
  k42: 64.8000,
  k43: 28.4000,
  k44: 91.7000,
  k45: 55.3000,
  k46: 18.9000,
  k47: 82.2000,
  k48: 45.8000,
  k49: 9.4000,
  k50: 72.7000,
  k51: 36.3000,
  k52: 99.6000,
  k53: 63.2000,
  k54: 26.8000,
  k55: 90.1000,
  k56: 53.7000,
  k57: 17.3000,
  k58: 80.6000,
  k59: 44.2000,
  k60: 7.8000,
  k61: 71.1000,
  k62: 34.7000,
  k63: 98.0000,
  k64: 61.6000,
  k65: 25.2000,
  k66: 88.5000,
  k67: 52.1000,
  k68: 15.7000,
  k69: 79.0000,
  k70: 42.6000,
  k71: 6.2000,
} as const;

export function V1030_IHEAT_HEATWAVE_SCENARIO_161_evaluate(turn: number): {
  inlandHeatExposureIndex: number;
  aridBufferDelayTurns: number;
  aridAdaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1030_IHEAT_HEATWAVE_SCENARIO_161_COEF) as Array<
    keyof typeof V1030_IHEAT_HEATWAVE_SCENARIO_161_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1030_IHEAT_HEATWAVE_SCENARIO_161_COEF[keys[j]] * ((turn + j) % 17);
  }
  const inlandHeatExposureIndex = V1030_IHEAT_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aridBufferDelayTurns = V1030_IHEAT_clamp(2 + (acc % 11), 1, 18);
  const aridAdaptationScore = V1030_IHEAT_clamp(90 - inlandHeatExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1030_IHEAT_aridAdaptationBandFromScore(aridAdaptationScore) !== 'depleted';
  return { inlandHeatExposureIndex, aridBufferDelayTurns, aridAdaptationScore, stable };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_161_snapshot(turn: number): V1030IheatHeatwaveSnapshot {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_161_evaluate(turn);
  return {
    scenarioId: V1030_IHEAT_HEATWAVE_SCENARIO_161_META.id,
    regionId: V1030_IHEAT_HEATWAVE_SCENARIO_161_META.regionId,
    inlandHeatChannel: V1030_IHEAT_HEATWAVE_SCENARIO_161_META.primaryChannel,
    aridAdaptationBand: V1030_IHEAT_HEATWAVE_SCENARIO_161_META.aridAdaptationBand,
    inlandHeatExposureIndex: r.inlandHeatExposureIndex,
    aridBufferDelayTurns: r.aridBufferDelayTurns,
    aridAdaptationScore: r.aridAdaptationScore,
    aridAdaptationBand: V1030_IHEAT_aridAdaptationBandFromScore(r.aridAdaptationScore),
  };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_161_regressionAssert(turn: number): boolean {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_161_evaluate(turn);
  return typeof r.inlandHeatExposureIndex === 'number' && r.aridAdaptationScore <= 100;
}
