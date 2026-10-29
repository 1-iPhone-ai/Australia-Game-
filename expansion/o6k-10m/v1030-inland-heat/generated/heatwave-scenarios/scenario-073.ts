import { V1030_IHEAT_clamp, V1030_IHEAT_aridAdaptationBandFromScore } from '../../engine/inland-heat-utils.ts';
import type {
  V1030IheatAridAdaptationBand,
  V1030IheatRegionId,
  V1030IheatHeatwaveSnapshot,
  V1030IheatInlandHeatChannel,
} from '../../types/core.ts';

/** Generated heatwave scenario 073 — extreme_heat/drought/dust handoff matrix. */
export const V1030_IHEAT_HEATWAVE_SCENARIO_073_META = {
  id: 'heatwave_073',
  regionId: 'VIC' as V1030IheatRegionId,
  primaryChannel: 'telehealth' as V1030IheatInlandHeatChannel,
  aridAdaptationBand: 'critical' as V1030IheatAridAdaptationBand,
  seed: 67024,
} as const;

const V1030_IHEAT_HEATWAVE_SCENARIO_073_COEF = {
  k0: 48.1000,
  k1: 70.6000,
  k2: 93.1000,
  k3: 15.9000,
  k4: 38.4000,
  k5: 60.9000,
  k6: 83.4000,
  k7: 6.2000,
  k8: 28.7000,
  k9: 51.2000,
  k10: 73.7000,
  k11: 96.2000,
  k12: 19.0000,
  k13: 41.5000,
  k14: 64.0000,
  k15: 86.5000,
  k16: 9.3000,
  k17: 31.8000,
  k18: 54.3000,
  k19: 76.8000,
  k20: 99.3000,
  k21: 22.1000,
  k22: 44.6000,
  k23: 67.1000,
  k24: 89.6000,
  k25: 12.4000,
  k26: 34.9000,
  k27: 57.4000,
  k28: 79.9000,
  k29: 2.7000,
  k30: 25.2000,
  k31: 47.7000,
  k32: 70.2000,
  k33: 92.7000,
  k34: 15.5000,
  k35: 38.0000,
  k36: 60.5000,
  k37: 83.0000,
  k38: 5.8000,
  k39: 28.3000,
  k40: 50.8000,
  k41: 73.3000,
  k42: 95.8000,
  k43: 18.6000,
  k44: 41.1000,
  k45: 63.6000,
  k46: 86.1000,
  k47: 8.9000,
  k48: 31.4000,
  k49: 53.9000,
  k50: 76.4000,
  k51: 98.9000,
  k52: 21.7000,
  k53: 44.2000,
  k54: 66.7000,
  k55: 89.2000,
  k56: 12.0000,
  k57: 34.5000,
  k58: 57.0000,
  k59: 79.5000,
  k60: 2.3000,
  k61: 24.8000,
  k62: 47.3000,
  k63: 69.8000,
  k64: 92.3000,
  k65: 15.1000,
  k66: 37.6000,
  k67: 60.1000,
  k68: 82.6000,
  k69: 5.4000,
  k70: 27.9000,
  k71: 50.4000,
} as const;

export function V1030_IHEAT_HEATWAVE_SCENARIO_073_evaluate(turn: number): {
  inlandHeatExposureIndex: number;
  aridBufferDelayTurns: number;
  aridAdaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1030_IHEAT_HEATWAVE_SCENARIO_073_COEF) as Array<
    keyof typeof V1030_IHEAT_HEATWAVE_SCENARIO_073_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1030_IHEAT_HEATWAVE_SCENARIO_073_COEF[keys[j]] * ((turn + j) % 17);
  }
  const inlandHeatExposureIndex = V1030_IHEAT_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aridBufferDelayTurns = V1030_IHEAT_clamp(2 + (acc % 11), 1, 18);
  const aridAdaptationScore = V1030_IHEAT_clamp(90 - inlandHeatExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1030_IHEAT_aridAdaptationBandFromScore(aridAdaptationScore) !== 'depleted';
  return { inlandHeatExposureIndex, aridBufferDelayTurns, aridAdaptationScore, stable };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_073_snapshot(turn: number): V1030IheatHeatwaveSnapshot {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_073_evaluate(turn);
  return {
    scenarioId: V1030_IHEAT_HEATWAVE_SCENARIO_073_META.id,
    regionId: V1030_IHEAT_HEATWAVE_SCENARIO_073_META.regionId,
    inlandHeatChannel: V1030_IHEAT_HEATWAVE_SCENARIO_073_META.primaryChannel,
    aridAdaptationBand: V1030_IHEAT_HEATWAVE_SCENARIO_073_META.aridAdaptationBand,
    inlandHeatExposureIndex: r.inlandHeatExposureIndex,
    aridBufferDelayTurns: r.aridBufferDelayTurns,
    aridAdaptationScore: r.aridAdaptationScore,
    aridAdaptationBand: V1030_IHEAT_aridAdaptationBandFromScore(r.aridAdaptationScore),
  };
}

export function V1030_IHEAT_HEATWAVE_SCENARIO_073_regressionAssert(turn: number): boolean {
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_073_evaluate(turn);
  return typeof r.inlandHeatExposureIndex === 'number' && r.aridAdaptationScore <= 100;
}
