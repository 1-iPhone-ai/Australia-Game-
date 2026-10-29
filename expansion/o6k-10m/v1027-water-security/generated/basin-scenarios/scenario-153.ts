import { V1027_WSEC_clamp, V1027_WSEC_waterSecurityBandFromScore } from '../../engine/water-security-utils.ts';
import type {
  V1027WsecWaterSecurityBand,
  V1027WsecRegionId,
  V1027WsecBasinSnapshot,
  V1027WsecWaterSecurityChannel,
} from '../../types/core.ts';

/** Generated basin scenario 153 — surface/ground/aquifer handoff matrix. */
export const V1027_WSEC_BASIN_SCENARIO_153_META = {
  id: 'basin_153',
  regionId: 'VIC' as V1027WsecRegionId,
  primaryChannel: 'telehealth' as V1027WsecWaterSecurityChannel,
  waterSecurityBand: 'critical' as V1027WsecWaterSecurityBand,
  seed: 139904,
} as const;

const V1027_WSEC_BASIN_SCENARIO_153_COEF = {
  k0: 57.3000,
  k1: 89.7000,
  k2: 22.4000,
  k3: 54.8000,
  k4: 87.2000,
  k5: 19.9000,
  k6: 52.3000,
  k7: 84.7000,
  k8: 17.4000,
  k9: 49.8000,
  k10: 82.2000,
  k11: 14.9000,
  k12: 47.3000,
  k13: 79.7000,
  k14: 12.4000,
  k15: 44.8000,
  k16: 77.2000,
  k17: 9.9000,
  k18: 42.3000,
  k19: 74.7000,
  k20: 7.4000,
  k21: 39.8000,
  k22: 72.2000,
  k23: 4.9000,
  k24: 37.3000,
  k25: 69.7000,
  k26: 2.4000,
  k27: 34.8000,
  k28: 67.2000,
  k29: 99.6000,
  k30: 32.3000,
  k31: 64.7000,
  k32: 97.1000,
  k33: 29.8000,
  k34: 62.2000,
  k35: 94.6000,
  k36: 27.3000,
  k37: 59.7000,
  k38: 92.1000,
  k39: 24.8000,
  k40: 57.2000,
  k41: 89.6000,
  k42: 22.3000,
  k43: 54.7000,
  k44: 87.1000,
  k45: 19.8000,
  k46: 52.2000,
  k47: 84.6000,
  k48: 17.3000,
  k49: 49.7000,
  k50: 82.1000,
  k51: 14.8000,
  k52: 47.2000,
  k53: 79.6000,
  k54: 12.3000,
  k55: 44.7000,
  k56: 77.1000,
  k57: 9.8000,
  k58: 42.2000,
  k59: 74.6000,
  k60: 7.3000,
  k61: 39.7000,
  k62: 72.1000,
  k63: 4.8000,
  k64: 37.2000,
  k65: 69.6000,
  k66: 2.3000,
  k67: 34.7000,
  k68: 67.1000,
  k69: 99.5000,
  k70: 32.2000,
  k71: 64.6000,
} as const;

export function V1027_WSEC_BASIN_SCENARIO_153_evaluate(turn: number): {
  waterStressIndex: number;
  aquiferReserveDelayTurns: number;
  waterSecurityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1027_WSEC_BASIN_SCENARIO_153_COEF) as Array<
    keyof typeof V1027_WSEC_BASIN_SCENARIO_153_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1027_WSEC_BASIN_SCENARIO_153_COEF[keys[j]] * ((turn + j) % 17);
  }
  const waterStressIndex = V1027_WSEC_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aquiferReserveDelayTurns = V1027_WSEC_clamp(2 + (acc % 11), 1, 18);
  const waterSecurityScore = V1027_WSEC_clamp(90 - waterStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1027_WSEC_waterSecurityBandFromScore(waterSecurityScore) !== 'depleted';
  return { waterStressIndex, aquiferReserveDelayTurns, waterSecurityScore, stable };
}

export function V1027_WSEC_BASIN_SCENARIO_153_snapshot(turn: number): V1027WsecBasinSnapshot {
  const r = V1027_WSEC_BASIN_SCENARIO_153_evaluate(turn);
  return {
    scenarioId: V1027_WSEC_BASIN_SCENARIO_153_META.id,
    regionId: V1027_WSEC_BASIN_SCENARIO_153_META.regionId,
    waterSecurityChannel: V1027_WSEC_BASIN_SCENARIO_153_META.primaryChannel,
    waterSecurityBand: V1027_WSEC_BASIN_SCENARIO_153_META.waterSecurityBand,
    waterStressIndex: r.waterStressIndex,
    aquiferReserveDelayTurns: r.aquiferReserveDelayTurns,
    waterSecurityScore: r.waterSecurityScore,
    waterSecurityBand: V1027_WSEC_waterSecurityBandFromScore(r.waterSecurityScore),
  };
}

export function V1027_WSEC_BASIN_SCENARIO_153_regressionAssert(turn: number): boolean {
  const r = V1027_WSEC_BASIN_SCENARIO_153_evaluate(turn);
  return typeof r.waterStressIndex === 'number' && r.waterSecurityScore <= 100;
}
