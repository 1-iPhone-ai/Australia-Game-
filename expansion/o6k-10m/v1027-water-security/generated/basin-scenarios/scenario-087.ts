import { V1027_WSEC_clamp, V1027_WSEC_waterSecurityBandFromScore } from '../../engine/water-security-utils.ts';
import type {
  V1027WsecWaterSecurityBand,
  V1027WsecRegionId,
  V1027WsecBasinSnapshot,
  V1027WsecWaterSecurityChannel,
} from '../../types/core.ts';

/** Generated basin scenario 087 — surface/ground/aquifer handoff matrix. */
export const V1027_WSEC_BASIN_SCENARIO_087_META = {
  id: 'basin_087',
  regionId: 'ACT' as V1027WsecRegionId,
  primaryChannel: 'mental_health' as V1027WsecWaterSecurityChannel,
  waterSecurityBand: 'elevated' as V1027WsecWaterSecurityBand,
  seed: 79778,
} as const;

const V1027_WSEC_BASIN_SCENARIO_087_COEF = {
  k0: 19.8000,
  k1: 21.6000,
  k2: 23.4000,
  k3: 25.2000,
  k4: 27.0000,
  k5: 28.8000,
  k6: 30.6000,
  k7: 32.4000,
  k8: 34.2000,
  k9: 36.0000,
  k10: 37.8000,
  k11: 39.6000,
  k12: 41.4000,
  k13: 43.2000,
  k14: 45.0000,
  k15: 46.8000,
  k16: 48.6000,
  k17: 50.4000,
  k18: 52.2000,
  k19: 54.0000,
  k20: 55.8000,
  k21: 57.6000,
  k22: 59.4000,
  k23: 61.2000,
  k24: 63.0000,
  k25: 64.8000,
  k26: 66.6000,
  k27: 68.4000,
  k28: 70.2000,
  k29: 72.0000,
  k30: 73.8000,
  k31: 75.6000,
  k32: 77.4000,
  k33: 79.2000,
  k34: 81.0000,
  k35: 82.8000,
  k36: 84.6000,
  k37: 86.4000,
  k38: 88.2000,
  k39: 90.0000,
  k40: 91.8000,
  k41: 93.6000,
  k42: 95.4000,
  k43: 97.2000,
  k44: 99.0000,
  k45: 1.1000,
  k46: 2.9000,
  k47: 4.7000,
  k48: 6.5000,
  k49: 8.3000,
  k50: 10.1000,
  k51: 11.9000,
  k52: 13.7000,
  k53: 15.5000,
  k54: 17.3000,
  k55: 19.1000,
  k56: 20.9000,
  k57: 22.7000,
  k58: 24.5000,
  k59: 26.3000,
  k60: 28.1000,
  k61: 29.9000,
  k62: 31.7000,
  k63: 33.5000,
  k64: 35.3000,
  k65: 37.1000,
  k66: 38.9000,
  k67: 40.7000,
  k68: 42.5000,
  k69: 44.3000,
  k70: 46.1000,
  k71: 47.9000,
} as const;

export function V1027_WSEC_BASIN_SCENARIO_087_evaluate(turn: number): {
  waterStressIndex: number;
  aquiferReserveDelayTurns: number;
  waterSecurityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1027_WSEC_BASIN_SCENARIO_087_COEF) as Array<
    keyof typeof V1027_WSEC_BASIN_SCENARIO_087_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1027_WSEC_BASIN_SCENARIO_087_COEF[keys[j]] * ((turn + j) % 17);
  }
  const waterStressIndex = V1027_WSEC_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aquiferReserveDelayTurns = V1027_WSEC_clamp(2 + (acc % 11), 1, 18);
  const waterSecurityScore = V1027_WSEC_clamp(90 - waterStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1027_WSEC_waterSecurityBandFromScore(waterSecurityScore) !== 'depleted';
  return { waterStressIndex, aquiferReserveDelayTurns, waterSecurityScore, stable };
}

export function V1027_WSEC_BASIN_SCENARIO_087_snapshot(turn: number): V1027WsecBasinSnapshot {
  const r = V1027_WSEC_BASIN_SCENARIO_087_evaluate(turn);
  return {
    scenarioId: V1027_WSEC_BASIN_SCENARIO_087_META.id,
    regionId: V1027_WSEC_BASIN_SCENARIO_087_META.regionId,
    waterSecurityChannel: V1027_WSEC_BASIN_SCENARIO_087_META.primaryChannel,
    waterSecurityBand: V1027_WSEC_BASIN_SCENARIO_087_META.waterSecurityBand,
    waterStressIndex: r.waterStressIndex,
    aquiferReserveDelayTurns: r.aquiferReserveDelayTurns,
    waterSecurityScore: r.waterSecurityScore,
    waterSecurityBand: V1027_WSEC_waterSecurityBandFromScore(r.waterSecurityScore),
  };
}

export function V1027_WSEC_BASIN_SCENARIO_087_regressionAssert(turn: number): boolean {
  const r = V1027_WSEC_BASIN_SCENARIO_087_evaluate(turn);
  return typeof r.waterStressIndex === 'number' && r.waterSecurityScore <= 100;
}
