import { V1027_WSEC_clamp, V1027_WSEC_waterSecurityBandFromScore } from '../../engine/water-security-utils.ts';
import type {
  V1027WsecWaterSecurityBand,
  V1027WsecRegionId,
  V1027WsecBasinSnapshot,
  V1027WsecWaterSecurityChannel,
} from '../../types/core.ts';

/** Generated basin scenario 084 — surface/ground/aquifer handoff matrix. */
export const V1027_WSEC_BASIN_SCENARIO_084_META = {
  id: 'basin_084',
  regionId: 'SA' as V1027WsecRegionId,
  primaryChannel: 'rural_clinic' as V1027WsecWaterSecurityChannel,
  waterSecurityBand: 'recovering' as V1027WsecWaterSecurityBand,
  seed: 77045,
} as const;

const V1027_WSEC_BASIN_SCENARIO_084_COEF = {
  k0: 4.5000,
  k1: 32.1000,
  k2: 59.7000,
  k3: 87.3000,
  k4: 15.2000,
  k5: 42.8000,
  k6: 70.4000,
  k7: 98.0000,
  k8: 25.9000,
  k9: 53.5000,
  k10: 81.1000,
  k11: 9.0000,
  k12: 36.6000,
  k13: 64.2000,
  k14: 91.8000,
  k15: 19.7000,
  k16: 47.3000,
  k17: 74.9000,
  k18: 2.8000,
  k19: 30.4000,
  k20: 58.0000,
  k21: 85.6000,
  k22: 13.5000,
  k23: 41.1000,
  k24: 68.7000,
  k25: 96.3000,
  k26: 24.2000,
  k27: 51.8000,
  k28: 79.4000,
  k29: 7.3000,
  k30: 34.9000,
  k31: 62.5000,
  k32: 90.1000,
  k33: 18.0000,
  k34: 45.6000,
  k35: 73.2000,
  k36: 1.1000,
  k37: 28.7000,
  k38: 56.3000,
  k39: 83.9000,
  k40: 11.8000,
  k41: 39.4000,
  k42: 67.0000,
  k43: 94.6000,
  k44: 22.5000,
  k45: 50.1000,
  k46: 77.7000,
  k47: 5.6000,
  k48: 33.2000,
  k49: 60.8000,
  k50: 88.4000,
  k51: 16.3000,
  k52: 43.9000,
  k53: 71.5000,
  k54: 99.1000,
  k55: 27.0000,
  k56: 54.6000,
  k57: 82.2000,
  k58: 10.1000,
  k59: 37.7000,
  k60: 65.3000,
  k61: 92.9000,
  k62: 20.8000,
  k63: 48.4000,
  k64: 76.0000,
  k65: 3.9000,
  k66: 31.5000,
  k67: 59.1000,
  k68: 86.7000,
  k69: 14.6000,
  k70: 42.2000,
  k71: 69.8000,
} as const;

export function V1027_WSEC_BASIN_SCENARIO_084_evaluate(turn: number): {
  waterStressIndex: number;
  aquiferReserveDelayTurns: number;
  waterSecurityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1027_WSEC_BASIN_SCENARIO_084_COEF) as Array<
    keyof typeof V1027_WSEC_BASIN_SCENARIO_084_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1027_WSEC_BASIN_SCENARIO_084_COEF[keys[j]] * ((turn + j) % 17);
  }
  const waterStressIndex = V1027_WSEC_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aquiferReserveDelayTurns = V1027_WSEC_clamp(2 + (acc % 11), 1, 18);
  const waterSecurityScore = V1027_WSEC_clamp(90 - waterStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1027_WSEC_waterSecurityBandFromScore(waterSecurityScore) !== 'depleted';
  return { waterStressIndex, aquiferReserveDelayTurns, waterSecurityScore, stable };
}

export function V1027_WSEC_BASIN_SCENARIO_084_snapshot(turn: number): V1027WsecBasinSnapshot {
  const r = V1027_WSEC_BASIN_SCENARIO_084_evaluate(turn);
  return {
    scenarioId: V1027_WSEC_BASIN_SCENARIO_084_META.id,
    regionId: V1027_WSEC_BASIN_SCENARIO_084_META.regionId,
    waterSecurityChannel: V1027_WSEC_BASIN_SCENARIO_084_META.primaryChannel,
    waterSecurityBand: V1027_WSEC_BASIN_SCENARIO_084_META.waterSecurityBand,
    waterStressIndex: r.waterStressIndex,
    aquiferReserveDelayTurns: r.aquiferReserveDelayTurns,
    waterSecurityScore: r.waterSecurityScore,
    waterSecurityBand: V1027_WSEC_waterSecurityBandFromScore(r.waterSecurityScore),
  };
}

export function V1027_WSEC_BASIN_SCENARIO_084_regressionAssert(turn: number): boolean {
  const r = V1027_WSEC_BASIN_SCENARIO_084_evaluate(turn);
  return typeof r.waterStressIndex === 'number' && r.waterSecurityScore <= 100;
}
