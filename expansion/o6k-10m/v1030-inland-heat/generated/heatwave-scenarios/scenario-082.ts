import { V1030_IHEAT_clamp, V1030_IHEAT_aridAdaptationBandFromScore } from '../../engine/inland-heat-utils.ts';
import type {
  V1030IheatAridAdaptationBand,
  V1030IheatRegionId,
  V1030IheatHeatwaveSnapshot,
  V1030IheatInlandHeatChannel,
} from '../../types/core.ts';

/** Generated heatwave scenario 082 — extreme_heat/drought/dust handoff matrix. */
export const V1030_IHEAT_HEATWAVE_SCENARIO_082_META = {
  id: 'heatwave_082',
  regionId: 'QLD' as V1030IheatRegionId,
  primaryChannel: 'inland_zone' as V1030IheatInlandHeatChannel,
  aridAdaptationBand: 'elevated' as V1030IheatAridAdaptationBand,
  seed: 75223,
} as const;

const V1030_IHEAT_HEATWAVE_SCENARIO_082_COEF = {
  k0: 94.0000,
  k1: 39.1000,
  k2: 83.9000,
  k3: 29.0000,
  k4: 73.8000,
  k5: 18.9000,
  k6: 63.7000,
  k7: 8.8000,
  k8: 53.6000,
  k9: 98.4000,
  k10: 43.5000,
  k11: 88.3000,
  k12: 33.4000,
  k13: 78.2000,
  k14: 23.3000,
  k15: 68.1000,
  k16: 13.2000,
  k17: 58.0000,
  k18: 3.1000,
  k19: 47.9000,
  k20: 92.7000,
  k21: 37.8000,
  k22: 82.6000,
  k23: 27.7000,
  k24: 72.5000,
  k25: 17.6000,
  k26: 62.4000,
  k27: 7.5000,
  k28: 52.3000,
  k29: 97.1000,
  k30: 42.2000,
  k31: 87.0000,
  k32: 32.1000,
  k33: 76.9000,
  k34: 22.0000,
  k35: 66.8000,
  k36: 11.9000,
  k37: 56.7000,
  k38: 1.8000,
  k39: 46.6000,
  k40: 91.4000,
  k41: 36.5000,
  k42: 81.3000,
  k43: 26.4000,
  k44: 71.2000,
  k45: 16.3000,
  k46: 61.1000,
  k47: 6.2000,
  k48: 51.0000,
  k49: 95.8000,
  k50: 40.9000,
  k51: 85.7000,
  k52: 30.8000,
  k53: 75.6000,
  k54: 20.7000,
  k55: 65.5000,
  k56: 10.6000,
  k57: 55.4000,
  k58: 0.5000,
  k59: 45.3000,
  k60: 90.1000,
  k61: 35.2000,
  k62: 80.0000,
  k63: 25.1000,
  k64: 69.9000,
  k65: 15.0000,
  k66: 59.8000,
  k67: 4.9000,
  k68: 49.7000,
  k69: 94.5000,
  k70: 39.6000,
  k71: 84.4000,
} as const;

export function V1030_IHEAT_HEATWAVE_SCENARIO_082_evaluate(turn: number): {
  inlandHeatExposureIndex: number;
  aridBufferDelayTurns: number;
  aridAdaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1030_IHEAT_HEATWAVE_SCENARIO_082_COEF) as Array<
    keyof typeof V1030_IHEAT_HEATWAVE_SCENARIO_082_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1030_IHEAT_HEATWAVE_SCENARIO_082_COEF[keys[j]] * ((turn + j) % 17);
  }
  const inlandHeatExposureIndex = V1030_IHEAT_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aridBufferDelayTurns = V1030_IHEAT_clamp(2 + (acc % 11), 1, 18);
  const aridAdaptationScore = V1030_IHEAT_clamp(90 - inlandHeatExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1030_IHEAT_aridAdaptationBandFromScore(aridAdaptationScore) !== 'depleted';
  return { inlandHeatExposureIndex, aridBufferDelayTurns, aridAdaptationScore, stable };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_082_snapshot(turn: number): V1030IheatHeatwaveSnapshot {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_082_evaluate(turn);
  return {
    scenarioId: V1030_IHEAT_HEATWAVE_SCENARIO_082_META.id,
    regionId: V1030_IHEAT_HEATWAVE_SCENARIO_082_META.regionId,
    inlandHeatChannel: V1030_IHEAT_HEATWAVE_SCENARIO_082_META.primaryChannel,
    aridAdaptationBand: V1030_IHEAT_HEATWAVE_SCENARIO_082_META.aridAdaptationBand,
    inlandHeatExposureIndex: r.inlandHeatExposureIndex,
    aridBufferDelayTurns: r.aridBufferDelayTurns,
    aridAdaptationScore: r.aridAdaptationScore,
    aridAdaptationBand: V1030_IHEAT_aridAdaptationBandFromScore(r.aridAdaptationScore),
  };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_082_regressionAssert(turn: number): boolean {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_082_evaluate(turn);
  return typeof r.inlandHeatExposureIndex === 'number' && r.aridAdaptationScore <= 100;
}
