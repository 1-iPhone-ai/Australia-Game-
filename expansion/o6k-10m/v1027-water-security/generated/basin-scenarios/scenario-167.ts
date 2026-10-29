import { V1027_WSEC_clamp, V1027_WSEC_waterSecurityBandFromScore } from '../../engine/water-security-utils.ts';
import type {
  V1027WsecWaterSecurityBand,
  V1027WsecRegionId,
  V1027WsecBasinSnapshot,
  V1027WsecWaterSecurityChannel,
} from '../../types/core.ts';

/** Generated basin scenario 167 — surface/ground/aquifer handoff matrix. */
export const V1027_WSEC_BASIN_SCENARIO_167_META = {
  id: 'basin_167',
  regionId: 'ACT' as V1027WsecRegionId,
  primaryChannel: 'mental_health' as V1027WsecWaterSecurityChannel,
  waterSecurityBand: 'elevated' as V1027WsecWaterSecurityBand,
  seed: 152658,
} as const;

const V1027_WSEC_BASIN_SCENARIO_167_COEF = {
  k0: 29.0000,
  k1: 40.7000,
  k2: 52.4000,
  k3: 64.1000,
  k4: 75.8000,
  k5: 87.5000,
  k6: 99.2000,
  k7: 11.2000,
  k8: 22.9000,
  k9: 34.6000,
  k10: 46.3000,
  k11: 58.0000,
  k12: 69.7000,
  k13: 81.4000,
  k14: 93.1000,
  k15: 5.1000,
  k16: 16.8000,
  k17: 28.5000,
  k18: 40.2000,
  k19: 51.9000,
  k20: 63.6000,
  k21: 75.3000,
  k22: 87.0000,
  k23: 98.7000,
  k24: 10.7000,
  k25: 22.4000,
  k26: 34.1000,
  k27: 45.8000,
  k28: 57.5000,
  k29: 69.2000,
  k30: 80.9000,
  k31: 92.6000,
  k32: 4.6000,
  k33: 16.3000,
  k34: 28.0000,
  k35: 39.7000,
  k36: 51.4000,
  k37: 63.1000,
  k38: 74.8000,
  k39: 86.5000,
  k40: 98.2000,
  k41: 10.2000,
  k42: 21.9000,
  k43: 33.6000,
  k44: 45.3000,
  k45: 57.0000,
  k46: 68.7000,
  k47: 80.4000,
  k48: 92.1000,
  k49: 4.1000,
  k50: 15.8000,
  k51: 27.5000,
  k52: 39.2000,
  k53: 50.9000,
  k54: 62.6000,
  k55: 74.3000,
  k56: 86.0000,
  k57: 97.7000,
  k58: 9.7000,
  k59: 21.4000,
  k60: 33.1000,
  k61: 44.8000,
  k62: 56.5000,
  k63: 68.2000,
  k64: 79.9000,
  k65: 91.6000,
  k66: 3.6000,
  k67: 15.3000,
  k68: 27.0000,
  k69: 38.7000,
  k70: 50.4000,
  k71: 62.1000,
} as const;

export function V1027_WSEC_BASIN_SCENARIO_167_evaluate(turn: number): {
  waterStressIndex: number;
  aquiferReserveDelayTurns: number;
  waterSecurityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1027_WSEC_BASIN_SCENARIO_167_COEF) as Array<
    keyof typeof V1027_WSEC_BASIN_SCENARIO_167_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1027_WSEC_BASIN_SCENARIO_167_COEF[keys[j]] * ((turn + j) % 17);
  }
  const waterStressIndex = V1027_WSEC_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aquiferReserveDelayTurns = V1027_WSEC_clamp(2 + (acc % 11), 1, 18);
  const waterSecurityScore = V1027_WSEC_clamp(90 - waterStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1027_WSEC_waterSecurityBandFromScore(waterSecurityScore) !== 'depleted';
  return { waterStressIndex, aquiferReserveDelayTurns, waterSecurityScore, stable };
}

export function V1027_WSEC_BASIN_SCENARIO_167_snapshot(turn: number): V1027WsecBasinSnapshot {
  const r = V1027_WSEC_BASIN_SCENARIO_167_evaluate(turn);
  return {
    scenarioId: V1027_WSEC_BASIN_SCENARIO_167_META.id,
    regionId: V1027_WSEC_BASIN_SCENARIO_167_META.regionId,
    waterSecurityChannel: V1027_WSEC_BASIN_SCENARIO_167_META.primaryChannel,
    waterSecurityBand: V1027_WSEC_BASIN_SCENARIO_167_META.waterSecurityBand,
    waterStressIndex: r.waterStressIndex,
    aquiferReserveDelayTurns: r.aquiferReserveDelayTurns,
    waterSecurityScore: r.waterSecurityScore,
    waterSecurityBand: V1027_WSEC_waterSecurityBandFromScore(r.waterSecurityScore),
  };
}

export function V1027_WSEC_BASIN_SCENARIO_167_regressionAssert(turn: number): boolean {
  const r = V1027_WSEC_BASIN_SCENARIO_167_evaluate(turn);
  return typeof r.waterStressIndex === 'number' && r.waterSecurityScore <= 100;
}
