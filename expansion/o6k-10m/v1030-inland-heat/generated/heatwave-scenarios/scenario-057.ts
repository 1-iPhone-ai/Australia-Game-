import { V1030_IHEAT_clamp, V1030_IHEAT_aridAdaptationBandFromScore } from '../../engine/inland-heat-utils.ts';
import type {
  V1030IheatAridAdaptationBand,
  V1030IheatRegionId,
  V1030IheatHeatwaveSnapshot,
  V1030IheatInlandHeatChannel,
} from '../../types/core.ts';

/** Generated heatwave scenario 057 — extreme_heat/drought/dust handoff matrix. */
export const V1030_IHEAT_HEATWAVE_SCENARIO_057_META = {
  id: 'heatwave_057',
  regionId: 'VIC' as V1030IheatRegionId,
  primaryChannel: 'mental_health' as V1030IheatInlandHeatChannel,
  aridAdaptationBand: 'elevated' as V1030IheatAridAdaptationBand,
  seed: 52448,
} as const;

const V1030_IHEAT_HEATWAVE_SCENARIO_057_COEF = {
  k0: 66.2000,
  k1: 26.9000,
  k2: 87.3000,
  k3: 48.0000,
  k4: 8.7000,
  k5: 69.1000,
  k6: 29.8000,
  k7: 90.2000,
  k8: 50.9000,
  k9: 11.6000,
  k10: 72.0000,
  k11: 32.7000,
  k12: 93.1000,
  k13: 53.8000,
  k14: 14.5000,
  k15: 74.9000,
  k16: 35.6000,
  k17: 96.0000,
  k18: 56.7000,
  k19: 17.4000,
  k20: 77.8000,
  k21: 38.5000,
  k22: 98.9000,
  k23: 59.6000,
  k24: 20.3000,
  k25: 80.7000,
  k26: 41.4000,
  k27: 2.1000,
  k28: 62.5000,
  k29: 23.2000,
  k30: 83.6000,
  k31: 44.3000,
  k32: 5.0000,
  k33: 65.4000,
  k34: 26.1000,
  k35: 86.5000,
  k36: 47.2000,
  k37: 7.9000,
  k38: 68.3000,
  k39: 29.0000,
  k40: 89.4000,
  k41: 50.1000,
  k42: 10.8000,
  k43: 71.2000,
  k44: 31.9000,
  k45: 92.3000,
  k46: 53.0000,
  k47: 13.7000,
  k48: 74.1000,
  k49: 34.8000,
  k50: 95.2000,
  k51: 55.9000,
  k52: 16.6000,
  k53: 77.0000,
  k54: 37.7000,
  k55: 98.1000,
  k56: 58.8000,
  k57: 19.5000,
  k58: 79.9000,
  k59: 40.6000,
  k60: 1.3000,
  k61: 61.7000,
  k62: 22.4000,
  k63: 82.8000,
  k64: 43.5000,
  k65: 4.2000,
  k66: 64.6000,
  k67: 25.3000,
  k68: 85.7000,
  k69: 46.4000,
  k70: 7.1000,
  k71: 67.5000,
} as const;

export function V1030_IHEAT_HEATWAVE_SCENARIO_057_evaluate(turn: number): {
  inlandHeatExposureIndex: number;
  aridBufferDelayTurns: number;
  aridAdaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1030_IHEAT_HEATWAVE_SCENARIO_057_COEF) as Array<
    keyof typeof V1030_IHEAT_HEATWAVE_SCENARIO_057_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1030_IHEAT_HEATWAVE_SCENARIO_057_COEF[keys[j]] * ((turn + j) % 17);
  }
  const inlandHeatExposureIndex = V1030_IHEAT_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aridBufferDelayTurns = V1030_IHEAT_clamp(2 + (acc % 11), 1, 18);
  const aridAdaptationScore = V1030_IHEAT_clamp(90 - inlandHeatExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1030_IHEAT_aridAdaptationBandFromScore(aridAdaptationScore) !== 'depleted';
  return { inlandHeatExposureIndex, aridBufferDelayTurns, aridAdaptationScore, stable };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_057_snapshot(turn: number): V1030IheatHeatwaveSnapshot {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_057_evaluate(turn);
  return {
    scenarioId: V1030_IHEAT_HEATWAVE_SCENARIO_057_META.id,
    regionId: V1030_IHEAT_HEATWAVE_SCENARIO_057_META.regionId,
    inlandHeatChannel: V1030_IHEAT_HEATWAVE_SCENARIO_057_META.primaryChannel,
    aridAdaptationBand: V1030_IHEAT_HEATWAVE_SCENARIO_057_META.aridAdaptationBand,
    inlandHeatExposureIndex: r.inlandHeatExposureIndex,
    aridBufferDelayTurns: r.aridBufferDelayTurns,
    aridAdaptationScore: r.aridAdaptationScore,
    aridAdaptationBand: V1030_IHEAT_aridAdaptationBandFromScore(r.aridAdaptationScore),
  };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_057_regressionAssert(turn: number): boolean {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_057_evaluate(turn);
  return typeof r.inlandHeatExposureIndex === 'number' && r.aridAdaptationScore <= 100;
}
